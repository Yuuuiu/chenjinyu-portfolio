# -*- coding: utf-8 -*-
"""作品集本地服务器：在 http.server 基础上增加 HTTP Range 支持（视频拖动/快进必备）。"""
import http.server
import argparse
import json
import os
import re
import sqlite3
import sys
from contextlib import closing
from datetime import date
from functools import partial
from pathlib import Path
from urllib.parse import urlsplit

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = 8321
STATS_DIR = Path(ROOT) / "_build" / "visit-stats"
STATS_DB = STATS_DIR / "visits.sqlite3"


def save_visit(visit, visible_seconds):
    STATS_DIR.mkdir(parents=True, exist_ok=True)
    with closing(sqlite3.connect(STATS_DB)) as connection, connection:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS visits (
                id TEXT PRIMARY KEY,
                day TEXT NOT NULL,
                visible_seconds INTEGER NOT NULL
            )
        """)
        connection.execute("""
            INSERT INTO visits (id, day, visible_seconds) VALUES (?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                visible_seconds = MAX(visits.visible_seconds, excluded.visible_seconds)
        """, (visit, date.today().isoformat(), visible_seconds))


def print_stats():
    if not STATS_DB.exists():
        print("暂无访问记录。请通过本地服务器打开作品集。")
        return
    with closing(sqlite3.connect(STATS_DB)) as connection:
        rows = connection.execute("""
            SELECT day, COUNT(*), SUM(visible_seconds), AVG(visible_seconds)
            FROM visits GROUP BY day ORDER BY day DESC
        """).fetchall()
    print("日期\t\t访问次数\t总可见时间\t次均可见时间")
    for day, count, total, average in rows:
        print(f"{day}\t{count}\t\t{total} 秒\t\t{average:.1f} 秒")


class _LimitedReader:
    def __init__(self, f, remaining):
        self.f = f
        self.remaining = remaining

    def read(self, n=-1):
        if self.remaining <= 0:
            return b""
        if n < 0 or n > self.remaining:
            n = self.remaining
        data = self.f.read(n)
        self.remaining -= len(data)
        return data

    def close(self):
        self.f.close()


class RangeHandler(http.server.SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def end_headers(self):
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def log_message(self, fmt, *args):
        sys.stderr.write("[portfolio] %s\n" % (fmt % args))

    def do_POST(self):
        self.close_connection = True
        if urlsplit(self.path).path != "/_portfolio/visit":
            self.send_error(404)
            return
        if self.headers.get("Origin") != "http://" + self.headers.get("Host", ""):
            self.send_error(403)
            return
        length = self.headers.get("Content-Length", "")
        if not length.isascii() or not length.isdigit() or len(length) > 3 or not 1 <= int(length) <= 256:
            self.send_error(400)
            return
        try:
            data = json.loads(self.rfile.read(int(length)))
        except (ValueError, UnicodeError):
            self.send_error(400)
            return
        if not isinstance(data, dict):
            self.send_error(400)
            return
        visit = data.get("visit")
        seconds = data.get("visibleSeconds")
        if not isinstance(visit, str) or not re.fullmatch(r"[a-f0-9]{32}", visit):
            self.send_error(400)
            return
        if type(seconds) is not int or not 0 <= seconds <= 86400:
            self.send_error(400)
            return
        try:
            save_visit(visit, seconds)
        except (OSError, sqlite3.Error) as error:
            sys.stderr.write(f"[portfolio] 保存访问统计失败: {error}\n")
            self.send_error(503)
            return
        self.send_response(204)
        self.end_headers()

    def send_head(self):
        path = self.translate_path(self.path)
        if Path(path).resolve().is_relative_to(STATS_DIR.resolve()):
            self.send_error(404)
            return None
        if os.path.isdir(path):
            return super().send_head()
        try:
            f = open(path, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None
        try:
            st = os.fstat(f.fileno())
            size = st.st_size
            ctype = self.guess_type(path)
            rng = self.headers.get("Range")
            if rng:
                m = re.match(r"bytes=(\d*)-(\d*)", rng.strip())
                if m:
                    s0, s1 = m.groups()
                    start = int(s0) if s0 else 0
                    end = int(s1) if s1 else size - 1
                    end = min(end, size - 1)
                    if start > end or start >= size:
                        f.close()
                        self.send_error(416, "Requested Range Not Satisfiable")
                        self.send_header("Content-Range", "bytes */%d" % size)
                        return None
                    length = end - start + 1
                    self.send_response(206)
                    self.send_header("Content-Type", ctype)
                    self.send_header("Content-Range", "bytes %d-%d/%d" % (start, end, size))
                    self.send_header("Content-Length", str(length))
                    self.end_headers()
                    f.seek(start)
                    return _LimitedReader(f, length)
            self.send_response(200)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(size))
            self.end_headers()
            return f
        except Exception:
            f.close()
            raise


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--stats", action="store_true", help="显示本地访问统计")
    args = parser.parse_args()
    if args.stats:
        print_stats()
        sys.exit(0)
    handler = partial(RangeHandler, directory=ROOT)
    server = http.server.ThreadingHTTPServer(("0.0.0.0", PORT), handler)
    print("Chen Jinyu Portfolio: http://127.0.0.1:%d/  (Ctrl+C to stop)" % PORT, flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()

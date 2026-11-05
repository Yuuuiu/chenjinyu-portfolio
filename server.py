# -*- coding: utf-8 -*-
"""作品集本地服务器：在 http.server 基础上增加 HTTP Range 支持（视频拖动/快进必备）。"""
import http.server
import os
import re
import sys
from functools import partial

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = 8321


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

    def send_head(self):
        path = self.translate_path(self.path)
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
    handler = partial(RangeHandler, directory=ROOT)
    server = http.server.ThreadingHTTPServer(("0.0.0.0", PORT), handler)
    print("Chen Jinyu Portfolio: http://127.0.0.1:%d/  (Ctrl+C to stop)" % PORT, flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()

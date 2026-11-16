/* ============================================================
   PROTECT.JS — 作品保护（防下载 / 防复制 / 防打印 / 视频禁下载）
   ⚠️ 浏览器端无法阻止 OS 级截屏/录屏，水印用于溯源。
   ============================================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('protect');

    /* ---------- 1. 禁用右键 ---------- */
    document.addEventListener('contextmenu', function (e) {
      var t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) { return; }
      e.preventDefault();
    }, { capture: true });

    /* ---------- 2. 禁止选中 / 复制 / 剪切 ---------- */
    document.addEventListener('selectstart', function (e) {
      var t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) { return; }
      e.preventDefault();
    }, { capture: true });
    ['copy', 'cut'].forEach(function (ev) {
      document.addEventListener(ev, function (e) {
        var t = e.target;
        if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) { return; }
        e.preventDefault();
      }, { capture: true });
    });

    /* ---------- 3. 禁止图片拖拽 ---------- */
    document.addEventListener('dragstart', function (e) {
      if (e.target && (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO')) {
        e.preventDefault();
      }
    }, { capture: true });

    /* ---------- 4. 拦截常用保存/打印/源码快捷键 ---------- */
    document.addEventListener('keydown', function (e) {
      var k = (e.key || '').toLowerCase();
      var mod = e.ctrlKey || e.metaKey;
      if (mod && ['s', 'p', 'u', 'o'].indexOf(k) !== -1) { e.preventDefault(); e.stopPropagation(); return false; }
      if (mod && e.shiftKey && ['i', 'j', 'c', 'k'].indexOf(k) !== -1) { e.preventDefault(); e.stopPropagation(); return false; }
      if (k === 'f12') { e.preventDefault(); e.stopPropagation(); return false; }
      if (mod && k === 'a') { /* 允许输入框全选 */ }
    }, { capture: true });

    /* ---------- 5. 视频：禁下载 / 禁画中画 / 禁遥控播放 ---------- */
    function hardenVideos() {
      var vids = document.querySelectorAll('video');
      for (var i = 0; i < vids.length; i++) {
        var v = vids[i];
        v.setAttribute('controlslist', 'nodownload noplaybackrate noremoteplayback');
        v.disablePictureInPicture = true;
        v.addEventListener('contextmenu', function (e) { e.preventDefault(); });
      }
    }
    hardenVideos();
    /* 动态插入的视频（悬停预览等）也加固 */
    if (window.MutationObserver) {
      new MutationObserver(hardenVideos).observe(document.body, { childList: true, subtree: true });
    }

    /* ---------- 6. 隐形水印（截屏/录屏可溯源） ---------- */
    function buildWatermark() {
      var text = '陈锦育 · 作品集 · © 2027';
      var c = document.createElement('canvas');
      c.width = 420;
      c.height = 200;
      var ctx = c.getContext('2d');
      ctx.font = '16px "Microsoft YaHei", sans-serif';
      ctx.fillStyle = 'rgba(17,17,17,0.55)';
      ctx.rotate(-0.32);
      ctx.fillText(text, 8, 110);
      ctx.fillText(text, 200, 210);
      var layer = document.createElement('div');
      layer.className = 'wm-layer';
      layer.setAttribute('aria-hidden', 'true');
      layer.style.backgroundImage = 'url(' + c.toDataURL('image/png') + ')';
      document.body.appendChild(layer);
    }
    buildWatermark();

    /* ---------- 7. 轻量开发者工具提示（不影响正常浏览） ---------- */
    var warn = document.createElement('div');
    warn.className = 'dev-warn';
    warn.textContent = '© 陈锦育 · 本站作品受版权保护，请勿下载 / 截屏 / 录屏传播';
    document.body.appendChild(warn);
    var warned = false;
    setInterval(function () {
      var open = window.outerWidth - window.innerWidth > 180 || window.outerHeight - window.innerHeight > 220;
      if (open && !warned) {
        warn.classList.add('show');
        warned = true;
        setTimeout(function () { warn.classList.remove('show'); }, 5000);
      }
      if (!open) { warned = false; }
    }, 2000);
  });
})();

/* ============================================================
   PROTECT.JS — 轻量版权标识（不干扰 HR 正常浏览、分屏与打印）
   保留：1 禁止图片/视频拖拽  2 视频禁下载/画中画  3 轻量背景溯源水印
   放开：右键菜单、文本选择复制、Ctrl+P 打印存档、取消分屏误报弹窗
   ============================================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('protect');

    /* ---------- 1. 禁止图片与视频拖拽 ---------- */
    document.addEventListener('dragstart', function (e) {
      if (e.target && (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO')) {
        e.preventDefault();
      }
    }, { capture: true });


    /* ---------- 1.5 仅图片/视频禁用右键（文本仍可选中复制） ---------- */
    document.addEventListener('contextmenu', function (e) {
      var t = e.target;
      if (t && (t.tagName === 'IMG' || t.tagName === 'VIDEO')) {
        e.preventDefault();
      }
    }, { capture: true });

    /* ---------- 2. 视频：隐藏下载与画中画按钮 ---------- */
    function hardenVideos() {
      var vids = document.querySelectorAll('video');
      for (var i = 0; i < vids.length; i++) {
        var v = vids[i];
        v.setAttribute('controlslist', 'nodownload noremoteplayback');
        v.disablePictureInPicture = true;
      }
    }
    hardenVideos();
    if (window.MutationObserver) {
      new MutationObserver(hardenVideos).observe(document.body, { childList: true, subtree: true });
    }

    /* ---------- 3. 轻量背景水印（层级低于弹层与灯箱，不遮挡高清作品） ---------- */
    function buildWatermark() {
      var text = '陈锦育 · 作品集 · © 2026';
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
  });
})();

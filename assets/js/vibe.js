/* ============================================================
   VIBE.JS — 交互增强（与 main.js 互不依赖，最后加载）
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasHover = window.matchMedia('(hover: hover)').matches;

  /* ---------- 载入动画 ---------- */
  function initLoader() {
    var loader = document.querySelector('.loader');
    if (!loader) { document.body.classList.add('loaded'); return; }
    var finish = function () {
      loader.classList.add('done');
      document.body.classList.add('loaded');
      setTimeout(function () { loader.style.display = 'none'; }, 800);
    };
    if (document.readyState === 'complete') { setTimeout(finish, 420); }
    else { window.addEventListener('load', function () { setTimeout(finish, 420); }); }
    setTimeout(finish, 3500); /* 兜底 */
    /* 标题兜底：动画结束后强制可见，避免任何环境停在隐藏态 */
    setTimeout(function () {
      var chs = document.querySelectorAll('.hero-title .ch');
      for (var i = 0; i < chs.length; i++) {
        chs[i].style.transition = 'none';
        chs[i].style.transform = 'none';
        chs[i].style.opacity = '1';
      }
      document.body.classList.add('loaded');
    }, 2200);
  }

  /* ---------- 逐字标题 ---------- */
  function initSplitText() {
    var t = document.querySelector('.hero-title');
    if (!t) { return; }
    var html = t.innerHTML.split('<br>');
    t.innerHTML = html.map(function (line) {
      var chars = line.split('').map(function (c) {
        return c === ' ' ? '<span class="ch">&nbsp;</span>' : '<span class="ch">' + c + '</span>';
      }).join('');
      return '<span class="line">' + chars + '</span>';
    }).join('');
    var all = t.querySelectorAll('.ch');
    for (var i = 0; i < all.length; i++) {
      all[i].style.transitionDelay = (0.25 + i * 0.035) + 's';
    }
  }

  /* ---------- 滚动进度 / 视差 / 侧点 ---------- */
  function initScroll() {
    var bar = document.querySelector('.scroll-progress');
    var blobs = document.querySelectorAll('.hero-bg span');
    var dots = [];
    var sections = [].slice.call(document.querySelectorAll('main section[id]'));
    var nav = document.querySelector('.side-dots');
    if (nav && sections.length) {
      sections.forEach(function (s) {
        var a = document.createElement('a');
        a.href = '#' + s.id;
        a.setAttribute('aria-label', s.id);
        nav.appendChild(a);
        dots.push(a);
      });
    }
    function onScroll() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var y = window.scrollY || h.scrollTop;
      if (bar) { bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%'; }
      if (!reduce) {
        for (var i = 0; i < blobs.length; i++) {
          blobs[i].style.transform = 'translate3d(0,' + (y * (i ? 0.12 : 0.08)) + 'px,0)';
        }
      }
      var current = -1;
      for (var k = 0; k < sections.length; k++) {
        var r = sections[k].getBoundingClientRect();
        if (r.top <= window.innerHeight * 0.45) { current = k; }
      }
      for (var m = 0; m < dots.length; m++) {
        dots[m].classList.toggle('on', m === current);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  /* ---------- 跑马灯内容复制 ---------- */
  function initMarquee() {
    var track = document.querySelector('.marquee-track');
    if (!track) { return; }
    var html = track.innerHTML;
    track.innerHTML = html + html;
  }

  /* ---------- 作品卡悬停视频预览 ---------- */
  function initWorkPreview() {
    if (!hasHover || reduce) { return; }
    var VIDEO_BASE = 'https://chenjinyu-portfolio.oss-cn-shanghai.aliyuncs.com/videos/';
    document.addEventListener('mouseover', function (e) {
      var card = e.target.closest ? e.target.closest('.work-card') : null;
      if (!card) { return; }
      var id = card.getAttribute('data-id');
      if (!id || card.dataset.previewing === '1') { return; }
      card.dataset.previewing = '1';
      var cover = card.querySelector('.cover');
      if (!cover) { return; }
      var v = document.createElement('video');
      v.className = 'work-preview';
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.preload = 'auto';
      v.src = VIDEO_BASE + id + '.mp4';
      cover.appendChild(v);
      v.addEventListener('canplay', function () {
        v.classList.add('ready');
        var p = v.play();
        if (p && p.catch) { p.catch(function () {}); }
      });
      v.addEventListener('error', function () {
        util_remove(v, card);
      });
      card._pv = v;
    });
    document.addEventListener('mouseout', function (e) {
      var card = e.target.closest ? e.target.closest('.work-card') : null;
      if (!card) { return; }
      if (card.contains(e.relatedTarget)) { return; }
      removePreview(card);
    });
    function removePreview(card) {
      var v = card._pv;
      if (v) {
        try { v.pause(); } catch (err) {}
        if (v.parentNode) { v.parentNode.removeChild(v); }
      }
      card._pv = null;
      card.dataset.previewing = '0';
    }
    function util_remove(v, card) { if (v.parentNode) { v.parentNode.removeChild(v); } card.dataset.previewing = '0'; }
  }

  /* ---------- 磁吸 ---------- */
  function initMagnetic() {
    if (!hasHover || reduce) { return; }
    var els = document.querySelectorAll('.site-nav a, .featured-card, .brand, .hero-scroll');
    [].forEach.call(els, function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) * 0.18;
        var dy = (e.clientY - (r.top + r.height / 2)) * 0.22;
        el.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- 章节序号 & 进入动画 ---------- */
  function initRevealBoost() {
    var cards = document.querySelectorAll('.work-card, .gallery-item, .dir-card');
    if (!('IntersectionObserver' in window)) { return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('reveal-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    [].forEach.call(cards, function (c) { io.observe(c); });
  }

  /* ---------- 章节大序号 ---------- */
  function initSecNumbers() {
    var heads = document.querySelectorAll('.section-head');
    [].forEach.call(heads, function (head) {
      if (head.querySelector('.sec-num')) { return; }
      var en = head.querySelector('.head-en');
      if (!en) { return; }
      var m = (en.textContent || '').match(/(\d{2})/);
      if (!m) { return; }
      var num = document.createElement('div');
      num.className = 'sec-num';
      num.textContent = m[1];
      num.setAttribute('aria-hidden', 'true');
      head.insertBefore(num, head.firstChild);
    });
  }

  /* ---------- 启动 ---------- */
  function boot() {
    initLoader();
    initSplitText();
    initScroll();
    initMarquee();
    initWorkPreview();
    initMagnetic();
    setTimeout(initRevealBoost, 300);
    setTimeout(initSecNumbers, 200);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();

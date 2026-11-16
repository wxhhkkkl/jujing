/* ==========================================================
   橘井方源官网 · 前台交互脚本（无后端依赖）
   ========================================================== */
(function () {
  'use strict';

  /* ---------- 顶部滚动进度条 ---------- */
  var progress = document.createElement('div');
  progress.setAttribute('aria-hidden', 'true');
  Object.assign(progress.style, {
    position: 'fixed', top: '0', left: '0', height: '2px', width: '0%',
    zIndex: '200', background: 'linear-gradient(90deg,#ff9d42,#ffd09a,#4fd8e8)',
    boxShadow: '0 0 12px rgba(255,157,66,.7)', transition: 'width .12s linear',
    pointerEvents: 'none'
  });
  document.body.appendChild(progress);

  var header = document.getElementById('header');
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    header.classList.toggle('scrolled', y > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 移动端菜单 ---------- */
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('navLinks');
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
  });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 滚动淡入 ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- 数字滚动计数 ---------- */
  var counters = document.querySelectorAll('.count');
  function runCount(el) {
    var target = parseInt(el.getAttribute('data-to'), 10) || 0;
    var start = performance.now(), dur = 1400;
    function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { runCount(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countObserver.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.getAttribute('data-to'); });
  }

  /* ---------- 当前栏目高亮 ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var sections = links.map(function (l) { return document.querySelector(l.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) {
          l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  /* ---------- 表单（前台演示，不提交任何数据） ---------- */
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = new FormData(form);
    var name = String(data.get('name') || '').trim();
    var phone = String(data.get('phone') || '').trim();
    if (!name || !/^1[3-9]\d{9}$/.test(phone)) {
      note.textContent = '请填写称呼与有效的 11 位手机号。';
      note.classList.add('warn');
      return;
    }
    note.classList.remove('warn');
    note.textContent = '格式校验通过 · 本站为前台演示版本，信息不会上传或保存。';
    setTimeout(function () {
      note.textContent = '感谢您的关注！请通过页面所示联系方式与我们联系，感谢您的关注。';
      form.reset();
    }, 2600);
  });

  /* ---------- 页脚年份 ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Hero 指针视差（仅桌面、轻微） ---------- */
  var heroVisual = document.querySelector('.hero-visual');
  if (heroVisual && window.matchMedia('(min-width:1025px)').matches && !window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
    var ring = document.querySelector('.ring-svg');
    document.querySelector('.hero').addEventListener('mousemove', function (e) {
      var r = heroVisual.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      var dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      ring.style.transform = 'translate(' + (dx * 12).toFixed(1) + 'px,' + (dy * 10).toFixed(1) + 'px)';
    });
    document.querySelector('.hero').addEventListener('mouseleave', function () {
      ring.style.transform = '';
    });
    ring.style.transition = 'transform .5s ease-out';
  }
})();

/* Measurement starts only after the visitor opts in. No chat or account data is sent. */
(function () {
  'use strict';
  var id = 'G-HQLN9RZYSE';
  var key = 'mjt-analytics-consent';
  var active = false;
  function choice() { try { return localStorage.getItem(key); } catch (_) { return null; } }
  function save(value) { try { localStorage.setItem(key, value); } catch (_) {} }
  function start() {
    if (active) return;
    active = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id, {allow_google_signals:false, allow_ad_personalization_signals:false});
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(script);
  }
  function removeCookies() {
    document.cookie.split(';').forEach(function (part) {
      var name = part.trim().split('=')[0];
      if (!/^_ga(?:_|$)/.test(name)) return;
      ['', ';domain=' + location.hostname, ';domain=.' + location.hostname].forEach(function (domain) {
        document.cookie = name + '=;max-age=0;path=/' + domain;
      });
    });
  }
  function ready() {
    var prior = choice();
    if (prior === 'yes') start();
    var panel = document.createElement('section');
    panel.setAttribute('aria-label', '방문 통계 선택');
    panel.style.cssText = 'position:fixed;bottom:18px;left:18px;right:18px;max-width:530px;z-index:10001;background:#171c29;color:#fff;padding:18px;border:1px solid #e8b45a;border-radius:12px;box-shadow:0 6px 24px #0008;font:14px/1.6 sans-serif';
    panel.innerHTML = '<strong>방문 통계 수집</strong><p style="margin:8px 0">동의하면 Google Analytics로 방문·유입 경로와 버튼 클릭을 측정합니다. 쿠키와 기기·브라우저 정보 등이 Google에 전달됩니다. 거절해도 사이트를 이용할 수 있습니다.</p><a href="' + noticeUrl + '" style="color:#ffd28a">수집 내용과 철회 방법</a><div style="display:flex;gap:10px;margin-top:12px"><button type="button" data-choice="no">거절</button><button type="button" data-choice="yes">동의</button></div>';
    panel.querySelectorAll('button').forEach(function (button) {
      button.style.cssText = 'padding:9px 18px;border-radius:6px;border:1px solid #e8b45a;background:#242b3b;color:white;cursor:pointer;font:inherit';
      button.addEventListener('click', function () {
        var value = button.getAttribute('data-choice');
        save(value);
        panel.hidden = true;
        if (value === 'yes') start();
        else if (active) { window['ga-disable-' + id] = true; removeCookies(); location.reload(); }
      });
    });
    panel.hidden = prior !== null;
    document.body.appendChild(panel);
    var settings = document.createElement('button');
    settings.type = 'button';
    settings.textContent = '방문 통계 설정';
    settings.style.cssText = 'display:block;margin:20px auto;padding:8px 14px;background:#171c29;color:#fff;border:1px solid #626b7d;border-radius:6px;cursor:pointer';
    settings.addEventListener('click', function () { panel.hidden = false; panel.querySelector('button').focus(); });
    document.body.appendChild(settings);
  }
  var noticeUrl = new URL('../analytics-notice/', document.currentScript.src).href;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();
})();

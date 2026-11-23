(function () {
  'use strict';

  // The local Python server receives these events over HTTP, including on the same Wi-Fi.
  if (location.protocol !== 'http:' || !navigator.sendBeacon || navigator.globalPrivacyControl ||
      navigator.doNotTrack === '1' || window.doNotTrack === '1') { return; }

  var visit = Array.from(crypto.getRandomValues(new Uint8Array(16)), function (byte) {
    return byte.toString(16).padStart(2, '0');
  }).join('');
  var endpoint = new URL('_portfolio/visit', document.baseURI);
  var visibleSince = null;
  var visibleMs = 0;

  function record() {
    var currentMs = visibleSince === null ? 0 : performance.now() - visibleSince;
    navigator.sendBeacon(endpoint, JSON.stringify({
      visit: visit,
      visibleSeconds: Math.min(86400, Math.floor((visibleMs + currentMs) / 1000))
    }));
  }

  function updateVisibility() {
    if (document.visibilityState === 'visible') {
      if (visibleSince === null) { visibleSince = performance.now(); }
      record();
    } else {
      endVisiblePeriod();
    }
  }

  function endVisiblePeriod() {
    if (visibleSince === null) { return; }
    visibleMs += performance.now() - visibleSince;
    visibleSince = null;
    record();
  }

  document.addEventListener('visibilitychange', updateVisibility);
  window.addEventListener('pagehide', endVisiblePeriod);
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) { updateVisibility(); }
  });
  window.setInterval(function () {
    if (visibleSince !== null) { record(); }
  }, 15000);
  updateVisibility();
})();

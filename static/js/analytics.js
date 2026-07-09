(function () {
  if (navigator.doNotTrack === "1" || window.doNotTrack === "1" || navigator.globalPrivacyControl) {
    return;
  }

  function viewportBucket() {
    var width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    if (width < 640) return "mobile";
    if (width < 1024) return "tablet";
    if (width < 1440) return "desktop";
    return "wide";
  }

  function cleanReferrer() {
    if (!document.referrer) return "";
    try {
      var referrer = new URL(document.referrer);
      return referrer.origin + referrer.pathname;
    } catch (error) {
      return "";
    }
  }

  var payload = {
    type: "pageview",
    path: window.location.pathname,
    title: document.title,
    referrer: cleanReferrer(),
    language: navigator.language || "",
    viewport: viewportBucket()
  };

  var body = JSON.stringify(payload);
  var script = document.currentScript;
  var endpoint = script && script.getAttribute("data-endpoint")
    ? script.getAttribute("data-endpoint")
    : "/api/analytics";

  if (navigator.sendBeacon) {
    navigator.sendBeacon(endpoint, new Blob([body], { type: "text/plain" }));
    return;
  }

  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: body,
    keepalive: true
  }).catch(function () {});
})();

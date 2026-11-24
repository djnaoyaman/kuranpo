(() => {
  "use strict";
  const entries = Array.from(document.querySelectorAll("[data-local-event][data-start][data-end]"));
  const section = document.getElementById("local-events");
  const day = 24 * 60 * 60 * 1000;
  const maxTimeout = day;
  const jstMidnight = value => /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? Date.parse(value + "T00:00:00+09:00") : NaN;
  const setVisible = (node, visible) => {
    node.hidden = !visible;
    // Site note display rules must not override hidden.
    node.style.display = visible ? "" : "none";
  };
  let timer;
  function refresh() {
    clearTimeout(timer);
    const now = Date.now();
    let next = Infinity;
    let hasFeatured = false;
    function reconsider(moment) {
      if (Number.isFinite(moment) && now < moment) next = Math.min(next, moment);
    }
    for (const entry of entries) {
      const opening = jstMidnight(entry.dataset.start);
      const from = jstMidnight(entry.dataset.displayFrom || entry.dataset.start);
      const end = jstMidnight(entry.dataset.end) + day;
      const valid = Number.isFinite(opening) && Number.isFinite(from) && Number.isFinite(end) && opening < end && from < end;
      const show = valid && from <= now && now < end;
      setVisible(entry, show);
      if (valid) {
        reconsider(from);
        reconsider(opening);
        reconsider(end);
      }
      if (!show) continue;
      if (section && section.contains(entry)) hasFeatured = true;
      const dates = Array.from(entry.querySelectorAll("[data-event-day]"));
      let today = false;
      for (const date of dates) {
        const start = jstMidnight(date.dataset.eventDay);
        const last = start + day;
        today ||= start <= now && now < last;
        setVisible(date, now < last);
        reconsider(start);
        reconsider(last);
      }
      const status = entry.querySelector("[data-event-status]");
      if (status) status.textContent = dates.length
        ? (today ? "本日開催" : "開催予定")
        : (now < opening ? "開催予定" : "会期中");
    }
    if (section) setVisible(section, hasFeatured);
    if (Number.isFinite(next)) timer = setTimeout(refresh, Math.min(maxTimeout, next - now));
  }
  addEventListener("pageshow", refresh);
  document.addEventListener("visibilitychange", refresh);
  refresh();
})();

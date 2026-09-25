(() => {
  'use strict';

  const config = window.EVENT_CAMPAIGN;
  const startsAt = Date.parse(config?.startsAt || '');
  const endsAt = Date.parse(config?.endsAt || '');
  const eventAt = Date.parse(config?.eventAt || '');
  const requiredCopy = ['title', 'venue', 'description', 'date', 'time', 'admission', 'artwork'];
  const hasRequiredCopy = requiredCopy.every((key) => typeof config?.[key] === 'string' && config[key].trim());
  const hasValidSchedule = [startsAt, endsAt, eventAt].every(Number.isFinite)
    && startsAt < endsAt
    && eventAt >= startsAt
    && eventAt < endsAt;
  const isScheduled = hasValidSchedule && Date.now() >= startsAt && Date.now() < endsAt;
  const isLive = Boolean(config?.enabled && hasRequiredCopy && (config.previewMode === true || isScheduled));

  window.location.replace(isLive ? '../#events' : '../#social');
})();

export const duration = (duration_ms) => {
  const durationMs = duration_ms;
  const durationMin = Math.floor(durationMs / 60000);
  const durationSec = ((durationMs % 60000) / 1000).toFixed(0);
  return `${durationMin}:${durationSec.padStart(2, "0")}`;
};

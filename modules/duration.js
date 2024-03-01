export const duration = (duration_ms) => {
  const durationMin = Math.floor(duration_ms / 60000);
  const durationSec = ((duration_ms % 60000) / 1000).toFixed(0);
  return `${durationMin}:${durationSec.padStart(2, "0")}`;
};

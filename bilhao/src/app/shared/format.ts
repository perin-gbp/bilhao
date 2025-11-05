export const nf = new Intl.NumberFormat('pt-BR');

export function formatSecondsAsDHMS(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const days = Math.floor(s / 86400);
  const rem = s % 86400;
  const hh = Math.floor(rem / 3600).toString().padStart(2, '0');
  const mm = Math.floor((rem % 3600) / 60).toString().padStart(2, '0');
  const ss = Math.floor(rem % 60).toString().padStart(2, '0');
  return `${days}d ${hh}:${mm}:${ss}`;
}

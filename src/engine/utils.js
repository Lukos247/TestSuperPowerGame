export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function randRange(min, max) {
  return min + Math.random() * (max - min);
}

export function randInt(min, max) {
  return Math.floor(randRange(min, max + 1));
}

export function formatNumber(n) {
  if (Math.abs(n) >= 1e12) return (n / 1e12).toFixed(1) + ' трлн';
  if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(1) + ' млрд';
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(1) + ' млн';
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(1) + ' тыс';
  return n.toFixed(0);
}

export function formatMoney(n) {
  if (Math.abs(n) >= 1e12) return '$' + (n / 1e12).toFixed(2) + ' трлн';
  if (Math.abs(n) >= 1e9) return '$' + (n / 1e9).toFixed(2) + ' млрд';
  if (Math.abs(n) >= 1e6) return '$' + (n / 1e6).toFixed(1) + ' млн';
  return '$' + n.toFixed(0);
}

export function formatPercent(n) {
  return (n * 100).toFixed(1) + '%';
}

export function weightedRandom(weights) {
  const total = weights.reduce((s, w) => s + w, 0);
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return i;
  }
  return weights.length - 1;
}

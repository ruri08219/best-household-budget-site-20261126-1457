// HearthLedger charts — one job: turn household figures into plain SVG.
// No library, no canvas, no network: every chart is a string of SVG elements.

import { fmtWhole } from './store.js';

function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// A donut of how one month's spending splits across categories.
// slices: [{ label, value, color }] — zero-value slices are left out.
export function donutChart(slices, size = 260) {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  const inner = r - 34;
  if (total <= 0) {
    return `<svg class="chart-box" viewBox="0 0 ${size} ${size}" role="img" aria-label="No spending recorded yet">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#ece5d3" stroke-width="34"/>
      <text x="${cx}" y="${cy}" text-anchor="middle" font-size="15" fill="#7d8a82">No spending yet</text>
    </svg>`;
  }
  let angle = -Math.PI / 2;
  const parts = slices
    .filter((s) => s.value > 0)
    .map((s) => {
      const frac = s.value / total;
      const sweep = frac * Math.PI * 2;
      const a0 = angle;
      const a1 = angle + sweep;
      angle = a1;
      const large = sweep > Math.PI ? 1 : 0;
      const x0 = cx + r * Math.cos(a0);
      const y0 = cy + r * Math.sin(a0);
      const x1 = cx + r * Math.cos(a1);
      const y1 = cy + r * Math.sin(a1);
      const xi1 = cx + inner * Math.cos(a1);
      const yi1 = cy + inner * Math.sin(a1);
      const xi0 = cx + inner * Math.cos(a0);
      const yi0 = cy + inner * Math.sin(a0);
      const path = frac >= 0.999
        ? `<circle cx="${cx}" cy="${cy}" r="${(r + inner) / 2}" fill="none" stroke="${s.color}" stroke-width="${r - inner}"/>`
        : `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z" fill="${s.color}"><title>${esc(s.label)}: ${fmtWhole(s.value)}</title></path>`;
      return path;
    })
    .join('');
  return `<svg class="chart-box" viewBox="0 0 ${size} ${size}" role="img" aria-label="Spending by category, total ${fmtWhole(total)}">
    ${parts}
    <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="13" fill="#7d8a82">Spent in month</text>
    <text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="21" font-weight="700" fill="#1e3a2f" font-family="Georgia, serif">${fmtWhole(total)}</text>
  </svg>`;
}

// Grouped bars comparing income against spending across months.
// rows: [{ label, income, spent }]
export function compareChart(rows, width = 640, height = 280) {
  const max = Math.max(1, ...rows.flatMap((r) => [r.income, r.spent]));
  const padLeft = 56;
  const padBottom = 30;
  const padTop = 14;
  const plotW = width - padLeft - 16;
  const plotH = height - padTop - padBottom;
  const groupW = plotW / rows.length;
  const barW = Math.min(42, groupW / 3);
  const scale = (v) => (v / max) * plotH;
  const grid = [0.25, 0.5, 0.75, 1].map((f) => {
    const y = padTop + plotH - f * plotH;
    return `<line x1="${padLeft}" y1="${y}" x2="${width - 16}" y2="${y}" stroke="#e3dac7" stroke-width="1"/>
      <text x="${padLeft - 8}" y="${y + 4}" text-anchor="end" font-size="11" fill="#7d8a82">${fmtWhole(max * f)}</text>`;
  }).join('');
  const bars = rows.map((row, i) => {
    const gx = padLeft + i * groupW + groupW / 2;
    const ih = scale(row.income);
    const sh = scale(row.spent);
    return `<rect x="${(gx - barW - 4).toFixed(1)}" y="${(padTop + plotH - ih).toFixed(1)}" width="${barW}" height="${ih.toFixed(1)}" rx="3" fill="#2e7d5b">
        <title>${esc(row.label)} income ${fmtWhole(row.income)}</title></rect>
      <rect x="${(gx + 4).toFixed(1)}" y="${(padTop + plotH - sh).toFixed(1)}" width="${barW}" height="${sh.toFixed(1)}" rx="3" fill="#b97e0e">
        <title>${esc(row.label)} spent ${fmtWhole(row.spent)}</title></rect>
      <text x="${gx}" y="${height - 10}" text-anchor="middle" font-size="12" fill="#4c5b53">${esc(row.label)}</text>`;
  }).join('');
  return `<svg class="chart-box" viewBox="0 0 ${width} ${height}" role="img" aria-label="Income against spending by month">
    ${grid}
    ${bars}
    <text x="${padLeft}" y="${height - 10}" text-anchor="start" font-size="11" fill="#7d8a82"></text>
  </svg>
  <div class="legend">
    <span><span class="cat-dot" style="background:#2e7d5b"></span>Income</span>
    <span><span class="cat-dot" style="background:#b97e0e"></span>Spent</span>
  </div>`;
}

// HearthLedger views — one job: turn state into the HTML of each section.
// Every view is a pure function of state plus the small filter values the
// page itself keeps. Event wiring lives in main.js, never here.

import { CATEGORIES, MONTHS, categoryById, monthLabel } from './data.js';
import {
  categorySpent, fmtExact, fmtWhole, monthIncome, monthLeft, monthSpent,
  sortedExpenses, totalBudget, totalSaved,
} from './store.js';
import { compareChart, donutChart } from './charts.js';

function esc(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function monthPicker(state, selectId = 'month-select') {
  const options = MONTHS.map(
    (m) => `<option value="${m.id}" ${m.id === state.uiMonth ? 'selected' : ''}>${m.label}</option>`,
  ).join('');
  return `<div class="month-pick"><label for="${selectId}">Month</label><select id="${selectId}">${options}</select></div>`;
}

function categoryBar(state, month, cat) {
  const spent = categorySpent(state, month, cat.id);
  const limit = state.budgets[cat.id] || 0;
  const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0;
  const cls = spent > limit && limit > 0 ? 'brick' : pct >= 85 ? 'amber' : '';
  const note = limit > 0
    ? (spent > limit
      ? `<div class="bar-note over">${fmtWhole(spent - limit)} over the ${fmtWhole(limit)} limit</div>`
      : `<div class="bar-note">${pct}% of the ${fmtWhole(limit)} limit</div>`)
    : `<div class="bar-note">No monthly limit set — set one in the Budget planner</div>`;
  return `<div class="bar-row">
    <div class="bar-top"><span class="bar-name"><span class="cat-dot" style="background:${cat.color}"></span>${esc(cat.label)}</span>
    <span class="bar-nums">${fmtWhole(spent)}${limit > 0 ? ` of ${fmtWhole(limit)}` : ''}</span></div>
    <div class="bar-track"><div class="bar-fill ${cls}" style="width:${Math.min(100, pct)}%"></div></div>
    ${note}
  </div>`;
}

function expenseRows(rows) {
  if (rows.length === 0) return `<tr><td colspan="5" class="empty">Nothing here yet — add your first expense above.</td></tr>`;
  return rows.map((row) => {
    const cat = categoryById(row.category);
    return `<tr>
      <td>${esc(row.date)}</td>
      <td>${esc(row.desc)}</td>
      <td><span class="cat-pill"><span class="cat-dot" style="background:${cat.color}"></span>${esc(cat.label)}</span></td>
      <td class="num">${fmtExact(row.amount)}</td>
      <td class="num">
        <button class="btn secondary small" data-edit-expense="${row.id}">Edit</button>
        <button class="btn danger small" data-delete-expense="${row.id}">Delete</button>
      </td>
    </tr>`;
  }).join('');
}

// ---------- Dashboard ----------

export function dashboardView(state) {
  const month = state.uiMonth;
  const income = monthIncome(state, month);
  const spent = monthSpent(state, month);
  const left = income - spent;
  const budget = totalBudget(state);
  const saved = totalSaved(state);
  const recent = sortedExpenses(state, month).slice(0, 5);
  const over = CATEGORIES.filter(
    (c) => (state.budgets[c.id] || 0) > 0 && categorySpent(state, month, c.id) > (state.budgets[c.id] || 0),
  );
  const leftCls = left < 0 ? 'over' : left < income * 0.1 ? 'warn' : 'good';
  return `
  <div class="page-head">
    <div>
      <p class="kicker">${esc(state.household)}</p>
      <h1>Your month at a glance</h1>
      <p class="lede">Income in, spending out, and what is left — for ${esc(monthLabel(month))}. Change any figure and the whole book updates.</p>
    </div>
    <div class="spacer"></div>
    ${monthPicker(state)}
  </div>

  <div class="grid grid-4">
    <section class="card"><div class="stat-label">Income</div><div class="stat-value">${fmtWhole(income)}</div><div class="stat-sub">${(state.income[month] ?? []).length} paydays and extras</div></section>
    <section class="card"><div class="stat-label">Spent</div><div class="stat-value">${fmtWhole(spent)}</div><div class="stat-sub">${(state.expenses[month] ?? []).length} expenses logged</div></section>
    <section class="card"><div class="stat-label">Left to spend</div><div class="stat-value ${leftCls}">${fmtWhole(left)}</div><div class="stat-sub">${left < 0 ? 'Over income — time to trim a category.' : 'Of this month’s income, still unspent.'}</div></section>
    <section class="card"><div class="stat-label">Saved toward goals</div><div class="stat-value">${fmtWhole(saved)}</div><div class="stat-sub">${(state.goals ?? []).length} savings goals running</div></section>
  </div>

  <div class="grid grid-main" style="margin-top:16px">
    <section class="card">
      <h2>Where the money went <span class="hint">against each category limit</span></h2>
      ${over.length > 0 ? `<p><span class="badge over">${over.length} categor${over.length === 1 ? 'y' : 'ies'} over budget</span> <span class="muted small">${over.map((c) => esc(c.label)).join(', ')} — see the Budget planner to adjust.</span></p>` : `<p><span class="badge ok">Every category within its limit</span></p>`}
      ${CATEGORIES.map((c) => categoryBar(state, month, c)).join('')}
      <p class="small muted" style="margin-top:12px">Monthly limits total ${fmtWhole(budget)}. Set them in the <a href="#/budget">Budget planner</a>.</p>
    </section>
    <div class="grid" style="gap:16px">
      <section class="card">
        <h2>Latest expenses</h2>
        ${recent.length === 0 ? `<p class="empty">No expenses this month yet.</p>` : `<div class="table-wrap"><table>
          <thead><tr><th>Date</th><th>What</th><th class="num">Amount</th></tr></thead>
          <tbody>${recent.map((row) => `<tr><td>${esc(row.date)}</td><td>${esc(row.desc)}</td><td class="num">${fmtExact(row.amount)}</td></tr>`).join('')}</tbody>
        </table></div>`}
        <p style="margin-top:12px"><a class="btn secondary small" href="#/expenses">See all expenses</a></p>
      </section>
      <section class="card">
        <h2>Household data</h2>
        <p class="small">This book starts with the Marlowe household’s demo figures. Everything is stored in this browser only — nothing is sent anywhere.</p>
        <div class="btn-row">
          <button class="btn secondary small" data-action="reset-demo">Reset demo data</button>
          <button class="btn danger small" data-action="clear-all">Clear all</button>
        </div>
        <p class="hint" id="data-note" style="margin-top:8px"></p>
      </section>
    </div>
  </div>`;
}

// ---------- Expenses ----------

export function expensesView(state, filters) {
  const month = state.uiMonth;
  let rows = sortedExpenses(state, month);
  if (filters.category) rows = rows.filter((r) => r.category === filters.category);
  if (filters.query) {
    const q = filters.query.toLowerCase();
    rows = rows.filter((r) => r.desc.toLowerCase().includes(q));
  }
  const total = rows.reduce((sum, r) => sum + r.amount, 0);
  const catOptions = `<option value="">All categories</option>` + CATEGORIES.map(
    (c) => `<option value="${c.id}" ${filters.category === c.id ? 'selected' : ''}>${c.label}</option>`,
  ).join('');
  return `
  <div class="page-head">
    <div>
      <p class="kicker">Every dollar, accounted for</p>
      <h1>Expenses</h1>
      <p class="lede">Add what the household spends, change it when a receipt turns out different, and filter the list to find anything. The running total follows your filters.</p>
    </div>
    <div class="spacer"></div>
    ${monthPicker(state)}
  </div>

  <section class="card">
    <h2>Add an expense</h2>
    <form id="add-expense-form" class="form-grid">
      <div class="field"><label for="exp-date">Date</label><input type="date" id="exp-date" value="${month}-25" required></div>
      <div class="field"><label for="exp-desc">What was it?</label><input type="text" id="exp-desc" placeholder="e.g. Weekly shop" maxlength="80" required></div>
      <div class="field"><label for="exp-cat">Category</label><select id="exp-cat">${CATEGORIES.map((c) => `<option value="${c.id}">${c.label}</option>`).join('')}</select></div>
      <div class="field"><label for="exp-amount">Amount (USD)</label><input type="number" id="exp-amount" min="0.01" step="0.01" placeholder="0.00" required></div>
      <div><button class="btn" type="submit">Add expense</button></div>
    </form>
    <p class="error" id="exp-error" hidden></p>
  </section>

  <section class="card" style="margin-top:16px">
    <h2>All expenses <span class="hint">${esc(monthLabel(month))}</span></h2>
    <div class="inline-form" style="margin-bottom:12px">
      <div class="field"><label for="filter-cat">Category</label><select id="filter-cat">${catOptions}</select></div>
      <div class="field"><label for="filter-q">Search</label><input type="text" id="filter-q" placeholder="Search descriptions" value="${esc(filters.query)}"></div>
      <button class="btn secondary small" data-action="clear-filters">Clear filters</button>
    </div>
    <div class="table-wrap"><table>
      <thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th><th class="num">Change</th></tr></thead>
      <tbody>${expenseRows(rows)}</tbody>
      <tfoot><tr class="total-row"><td colspan="3">Running total (${rows.length} expense${rows.length === 1 ? '' : 's'})</td><td class="num">${fmtExact(total)}</td><td></td></tr></tfoot>
    </table></div>
  </section>

  <div id="edit-expense-slot"></div>`;
}

// ---------- Budget planner ----------

export function budgetView(state) {
  const month = state.uiMonth;
  const budget = totalBudget(state);
  const income = monthIncome(state, month);
  const rows = CATEGORIES.map((cat) => {
    const spent = categorySpent(state, month, cat.id);
    const limit = state.budgets[cat.id] || 0;
    const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0;
    const badge = limit > 0 && spent > limit
      ? `<span class="badge over">Over by ${fmtWhole(spent - limit)}</span>`
      : limit > 0 && pct >= 85
        ? `<span class="badge warn">${pct}% used</span>`
        : `<span class="badge ok">${pct}% used</span>`;
    return `<tr>
      <td><span class="cat-dot" style="background:${cat.color}"></span>${esc(cat.label)}</td>
      <td class="num">${fmtExact(spent)}</td>
      <td><input type="number" min="0" step="1" value="${limit}" data-budget-cat="${cat.id}" aria-label="Monthly limit for ${esc(cat.label)}" style="width:110px;text-align:right"> <span class="muted small">/ month</span></td>
      <td>${badge}</td>
    </tr>`;
  }).join('');
  return `
  <div class="page-head">
    <div>
      <p class="kicker">Decide before you spend</p>
      <h1>Budget planner</h1>
      <p class="lede">Give every category a monthly limit. The bars warn you at 85% and turn red the moment spending passes the limit — for ${esc(monthLabel(month))}.</p>
    </div>
    <div class="spacer"></div>
    ${monthPicker(state)}
  </div>

  <div class="grid grid-3">
    <section class="card"><div class="stat-label">Planned for the month</div><div class="stat-value">${fmtWhole(budget)}</div><div class="stat-sub">Sum of all category limits</div></section>
    <section class="card"><div class="stat-label">Income this month</div><div class="stat-value">${fmtWhole(income)}</div><div class="stat-sub">Paydays and extras in ${esc(monthLabel(month))}</div></section>
    <section class="card"><div class="stat-label">Planned saving</div><div class="stat-value ${income - budget < 0 ? 'over' : 'good'}">${fmtWhole(income - budget)}</div><div class="stat-sub">${income - budget < 0 ? 'Limits exceed income — trim a category.' : 'Income minus limits: what the plan leaves aside.'}</div></section>
  </div>

  <section class="card" style="margin-top:16px">
    <h2>Monthly limits</h2>
    <p class="small muted">Change a number and press Save limits — the Dashboard bars and warnings update at once. Set a limit to 0 to leave a category unplanned.</p>
    <form id="budget-form">
      <div class="table-wrap"><table>
        <thead><tr><th>Category</th><th class="num">Spent</th><th>Limit</th><th>Status</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
      <div class="btn-row" style="margin-top:14px">
        <button class="btn" type="submit">Save limits</button>
        <span class="ok-note" id="budget-saved" hidden>Limits saved.</span>
      </div>
    </form>
  </section>

  <section class="card" style="margin-top:16px">
    <h2>How to set limits that stick</h2>
    <ol class="tips">
      <li><strong>Start from last month, not from zero.</strong> Look at what each category really cost in October, then trim one category by a small amount — not all of them at once.</li>
      <li><strong>Keep one cushion.</strong> A limit the household blows every month is not a limit; raise it and cut somewhere the household will not miss.</li>
      <li><strong>Pay the household first.</strong> Put savings in the plan as its own line before the fun money, not as whatever is left at the end.</li>
    </ol>
  </section>`;
}

// ---------- Savings goals ----------

export function goalsView(state) {
  const saved = totalSaved(state);
  const target = (state.goals ?? []).reduce((sum, g) => sum + g.target, 0);
  const cards = (state.goals ?? []).length === 0
    ? `<p class="empty">No savings goals yet — start one below.</p>`
    : (state.goals ?? []).map((goal) => {
      const pct = goal.target > 0 ? Math.round((goal.saved / goal.target) * 100) : 0;
      const left = Math.max(0, goal.target - goal.saved);
      return `<div class="goal-card">
        <div class="goal-top"><h3>${esc(goal.name)}</h3><span class="goal-amounts"><strong>${fmtWhole(goal.saved)}</strong> of ${fmtWhole(goal.target)}</span></div>
        <p class="small muted" style="margin:4px 0 10px">${esc(goal.note ?? '')}</p>
        <div class="bar-track"><div class="bar-fill ${pct >= 100 ? 'brick' : ''}" style="width:${Math.min(100, pct)}%"></div></div>
        <div class="bar-note">${pct}% saved — ${left > 0 ? `${fmtWhole(left)} to go` : 'Goal reached — well done!'}</div>
        <div class="inline-form" style="margin-top:10px">
          <div class="field"><label for="add-${goal.id}">Add money (USD)</label><input type="number" id="add-${goal.id}" min="0.01" step="0.01" placeholder="0.00"></div>
          <button class="btn secondary small" data-add-goal="${goal.id}">Add to goal</button>
          <button class="btn danger small" data-delete-goal="${goal.id}">Delete goal</button>
        </div>
      </div>`;
    }).join('');
  return `
  <div class="page-head">
    <div>
      <p class="kicker">Save with a name on it</p>
      <h1>Savings goals</h1>
      <p class="lede">A goal with a number and a date gets saved for. Add money whenever the household has some spare, and watch the bar move.</p>
    </div>
  </div>

  <div class="grid grid-3">
    <section class="card"><div class="stat-label">Saved so far</div><div class="stat-value">${fmtWhole(saved)}</div><div class="stat-sub">Across ${(state.goals ?? []).length} goals</div></section>
    <section class="card"><div class="stat-label">Aiming for</div><div class="stat-value">${fmtWhole(target)}</div><div class="stat-sub">Sum of all goal targets</div></section>
    <section class="card"><div class="stat-label">Still to save</div><div class="stat-value">${fmtWhole(Math.max(0, target - saved))}</div><div class="stat-sub">What the goals still need</div></section>
  </div>

  <section class="card" style="margin-top:16px">
    <h2>Your goals</h2>
    ${cards}
  </section>

  <section class="card" style="margin-top:16px">
    <h2>Start a new goal</h2>
    <form id="add-goal-form" class="form-grid">
      <div class="field"><label for="goal-name">Goal name</label><input type="text" id="goal-name" placeholder="e.g. New sofa" maxlength="60" required></div>
      <div class="field"><label for="goal-target">Target (USD)</label><input type="number" id="goal-target" min="1" step="1" placeholder="500" required></div>
      <div class="field"><label for="goal-note">Why this goal? (optional)</label><input type="text" id="goal-note" placeholder="e.g. The old one sags" maxlength="120"></div>
      <div><button class="btn" type="submit">Create goal</button></div>
    </form>
    <p class="error" id="goal-error" hidden></p>
  </section>`;
}

// ---------- Reports ----------

export function reportsView(state) {
  const month = state.uiMonth;
  const rows = MONTHS.map((m) => ({
    label: m.label.replace(' 2026', ''),
    income: monthIncome(state, m.id),
    spent: monthSpent(state, m.id),
  }));
  const slices = CATEGORIES.map((c) => ({
    label: c.label, value: categorySpent(state, month, c.id), color: c.color,
  })).filter((s) => s.value > 0).sort((a, b) => b.value - a.value);
  const biggest = sortedExpenses(state, month).sort((a, b) => b.amount - a.amount).slice(0, 5);
  const spent = monthSpent(state, month);
  const income = monthIncome(state, month);
  const top = slices[0];
  return `
  <div class="page-head">
    <div>
      <p class="kicker">Look back, plan forward</p>
      <h1>Reports</h1>
      <p class="lede">Three months side by side, and where ${esc(monthLabel(month))}’s money actually went. The numbers come straight from the expenses you logged.</p>
    </div>
    <div class="spacer"></div>
    ${monthPicker(state)}
  </div>

  <section class="card">
    <h2>Income against spending — Sep, Oct, Nov</h2>
    ${compareChart(rows)}
    <div class="grid grid-3" style="margin-top:14px">
      ${rows.map((r) => `<div><div class="stat-label">${esc(r.label)}</div><div class="stat-value small ${r.income - r.spent < 0 ? 'over' : ''}">${fmtWhole(r.income - r.spent)} left</div><div class="stat-sub">${fmtWhole(r.income)} in · ${fmtWhole(r.spent)} out</div></div>`).join('')}
    </div>
  </section>

  <div class="grid grid-main" style="margin-top:16px">
    <section class="card">
      <h2>Where ${esc(monthLabel(month))} went</h2>
      <div style="max-width:340px;margin:0 auto">${donutChart(slices)}</div>
      <div class="legend">${slices.map((s) => `<span><span class="cat-dot" style="background:${s.color}"></span>${esc(s.label)} — ${fmtWhole(s.value)}</span>`).join('')}</div>
    </section>
    <div class="grid" style="gap:16px">
      <section class="card">
        <h2>Biggest single expenses</h2>
        ${biggest.length === 0 ? `<p class="empty">No expenses this month yet.</p>` : `<div class="table-wrap"><table>
          <thead><tr><th>What</th><th class="num">Amount</th></tr></thead>
          <tbody>${biggest.map((r) => `<tr><td>${esc(r.desc)} <span class="muted small">(${esc(r.date)})</span></td><td class="num">${fmtExact(r.amount)}</td></tr>`).join('')}</tbody>
        </table></div>`}
      </section>
      <section class="card">
        <h2>What this month says</h2>
        ${spent === 0 ? `<p>The book is empty for ${esc(monthLabel(month))} — log a few expenses and this page will read them back to you.</p>` : `
        <p>${top ? `The biggest slice is <strong>${esc(top.label)}</strong> at ${fmtWhole(top.value)} — ${Math.round((top.value / spent) * 100)}% of everything spent.` : ''}</p>
        <p>${income - spent >= 0 ? `The household kept ${fmtWhole(income - spent)} of its ${fmtWhole(income)} income this month.` : `Spending ran ${fmtWhole(spent - income)} past income this month — the Budget planner is the place to fix that.`}</p>
        <p class="small muted">Compare with October: the household spent ${fmtWhole(monthSpent(state, '2026-10'))} then, and ${fmtWhole(spent)} in ${esc(monthLabel(month))}.</p>`}
      </section>
    </div>
  </div>

  <section class="card" style="margin-top:16px">
    <h2>Three habits that keep a household budget working</h2>
    <ol class="tips">
      <li><strong>Log it the day it happens.</strong> A receipt remembered on Sunday is a receipt guessed at — small guesses are where budgets quietly leak.</li>
      <li><strong>One number per category, reviewed monthly.</strong> Sit down on the first of the month, look at last month’s bars, and move one limit. Ten minutes, once a month.</li>
      <li><strong>Name the savings.</strong> “Emergency cushion” gets funded; “whatever is left” does not. A goal with a name is a bill the household pays to itself.</li>
    </ol>
  </section>`;
}

export function notFoundView() {
  return `
  <div class="page-head"><div><h1>That page is not in the book</h1>
  <p class="lede">HearthLedger has five sections — Dashboard, Expenses, Budget planner, Savings goals, and Reports. Use the links above to get back to the money.</p></div></div>
  <p><a class="btn" href="#/">Back to the Dashboard</a></p>`;
}

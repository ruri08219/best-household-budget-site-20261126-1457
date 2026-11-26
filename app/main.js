// HearthLedger main — one job: route between sections and wire every control
// to the store. Views render HTML; this file listens, changes state, re-renders.

import { CATEGORIES, DEFAULT_MONTH } from './data.js';
import {
  clearAll, currentMonth, loadState, newId, resetDemo, saveState,
  setCurrentMonth,
} from './store.js';
import {
  budgetView, dashboardView, expensesView, goalsView, notFoundView, reportsView,
} from './views.js';

const app = document.getElementById('app');
let state = loadState();
if (!state.uiMonth) state.uiMonth = DEFAULT_MONTH;

// Filters the Expenses page keeps while the household looks around.
const expenseFilters = { category: '', query: '' };

function route() {
  const hash = (location.hash || '#/').replace(/^#\/?/, '');
  const [page] = hash.split('/');
  document.querySelectorAll('.site-nav a').forEach((a) => {
    a.classList.toggle('active', (a.dataset.route || '') === page);
  });
  if (page === '' || page === 'dashboard') render(dashboardView(state));
  else if (page === 'expenses') render(expensesView(state, expenseFilters));
  else if (page === 'budget') render(budgetView(state));
  else if (page === 'goals') render(goalsView(state));
  else if (page === 'reports') render(reportsView(state));
  else render(notFoundView());
  window.scrollTo(0, 0);
}

function render(html) {
  app.innerHTML = html;
  wireMonthPicker();
}

function wireMonthPicker() {
  const pick = document.getElementById('month-select');
  if (pick) {
    pick.addEventListener('change', () => {
      setCurrentMonth(state, pick.value);
      route();
    });
  }
}

function showError(id, message) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.hidden = !message;
}

function rerender() {
  saveState(state);
  route();
}

// All clicks in the app go through one listener: it knows every control.
app.addEventListener('click', (event) => {
  const target = event.target.closest('button, a');
  if (!target) return;

  const action = target.dataset.action;
  if (action === 'reset-demo') {
    state = resetDemo();
    state.uiMonth = currentMonth(state);
    const note = document.getElementById('data-note');
    if (note) note.textContent = 'Demo data restored — the Marlowe household is back.';
    rerender();
    return;
  }
  if (action === 'clear-all') {
    if (window.confirm('Clear everything? All expenses, income, budgets and goals will be emptied.')) {
      state = clearAll();
      state.uiMonth = currentMonth(state);
      rerender();
    }
    return;
  }
  if (action === 'clear-filters') {
    expenseFilters.category = '';
    expenseFilters.query = '';
    rerender();
    return;
  }

  const editId = target.dataset.editExpense;
  if (editId) {
    openExpenseEditor(editId);
    return;
  }
  const delId = target.dataset.deleteExpense;
  if (delId) {
    const month = currentMonth(state);
    state.expenses[month] = (state.expenses[month] ?? []).filter((r) => r.id !== delId);
    rerender();
    return;
  }
  const addGoalId = target.dataset.addGoal;
  if (addGoalId) {
    const input = document.getElementById(`add-${addGoalId}`);
    const amount = Number(input?.value);
    if (!amount || amount <= 0) {
      input?.focus();
      return;
    }
    const goal = (state.goals ?? []).find((g) => g.id === addGoalId);
    if (goal) goal.saved = Math.round((goal.saved + amount) * 100) / 100;
    rerender();
    return;
  }
  const delGoalId = target.dataset.deleteGoal;
  if (delGoalId) {
    if (window.confirm('Delete this savings goal? Money already saved toward it is forgotten too.')) {
      state.goals = (state.goals ?? []).filter((g) => g.id !== delGoalId);
      rerender();
    }
  }
});

// Forms and text inputs: submit handlers are attached after each render.
app.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.target;

  if (form.id === 'add-expense-form') {
    const date = document.getElementById('exp-date').value;
    const desc = document.getElementById('exp-desc').value.trim();
    const category = document.getElementById('exp-cat').value;
    const amount = Number(document.getElementById('exp-amount').value);
    if (!date || !desc || !amount || amount <= 0) {
      showError('exp-error', 'Fill in a date, a description, and an amount above zero.');
      return;
    }
    const month = currentMonth(state);
    if (!state.expenses[month]) state.expenses[month] = [];
    state.expenses[month].push({ id: newId('e'), date, desc, category, amount: Math.round(amount * 100) / 100 });
    rerender();
    return;
  }

  if (form.id === 'budget-form') {
    document.querySelectorAll('[data-budget-cat]').forEach((input) => {
      const value = Math.max(0, Math.round(Number(input.value) || 0));
      state.budgets[input.dataset.budgetCat] = value;
    });
    saveState(state);
    route();
    // route() re-rendered the page, so show the confirmation on the fresh form.
    const saved = document.getElementById('budget-saved');
    if (saved) saved.hidden = false;
    return;
  }

  if (form.id === 'add-goal-form') {
    const name = document.getElementById('goal-name').value.trim();
    const targetAmount = Number(document.getElementById('goal-target').value);
    const note = document.getElementById('goal-note').value.trim();
    if (!name || !targetAmount || targetAmount <= 0) {
      showError('goal-error', 'Give the goal a name and a target above zero.');
      return;
    }
    state.goals = state.goals ?? [];
    state.goals.push({ id: newId('g'), name, target: Math.round(targetAmount), saved: 0, note });
    rerender();
    return;
  }

  if (form.id === 'edit-expense-form') {
    const id = form.dataset.expenseId;
    const date = document.getElementById('edit-date').value;
    const desc = document.getElementById('edit-desc').value.trim();
    const category = document.getElementById('edit-cat').value;
    const amount = Number(document.getElementById('edit-amount').value);
    if (!date || !desc || !amount || amount <= 0) {
      showError('edit-error', 'Fill in a date, a description, and an amount above zero.');
      return;
    }
    const month = currentMonth(state);
    const row = (state.expenses[month] ?? []).find((r) => r.id === id);
    if (row) {
      row.date = date;
      row.desc = desc;
      row.category = category;
      row.amount = Math.round(amount * 100) / 100;
    }
    rerender();
  }
});

// Filter inputs on the Expenses page re-render the list as the household types.
app.addEventListener('input', (event) => {
  if (event.target.id === 'filter-cat') {
    expenseFilters.category = event.target.value;
    rerender();
    const again = document.getElementById('filter-cat');
    if (again) again.focus();
  }
  if (event.target.id === 'filter-q') {
    expenseFilters.query = event.target.value;
    const pos = event.target.selectionStart;
    rerender();
    const again = document.getElementById('filter-q');
    if (again) {
      again.focus();
      again.setSelectionRange(pos, pos);
    }
  }
});

// Editing an expense swaps the table row area for a small edit form.
function openExpenseEditor(id) {
  const month = currentMonth(state);
  const row = (state.expenses[month] ?? []).find((r) => r.id === id);
  const slot = document.getElementById('edit-expense-slot');
  if (!row || !slot) return;
  slot.innerHTML = `
    <section class="card" style="margin-top:16px">
      <h2>Edit expense</h2>
      <form id="edit-expense-form" data-expense-id="${row.id}" class="form-grid">
        <div class="field"><label for="edit-date">Date</label><input type="date" id="edit-date" value="${row.date}" required></div>
        <div class="field"><label for="edit-desc">What was it?</label><input type="text" id="edit-desc" value="" maxlength="80" required></div>
        <div class="field"><label for="edit-cat">Category</label><select id="edit-cat"></select></div>
        <div class="field"><label for="edit-amount">Amount (USD)</label><input type="number" id="edit-amount" min="0.01" step="0.01" value="${row.amount}" required></div>
        <div><button class="btn" type="submit">Save change</button>
        <button class="btn secondary" type="button" data-action="cancel-edit">Cancel</button></div>
      </form>
      <p class="error" id="edit-error" hidden></p>
    </section>`;
  // Fill the text and category fields after the HTML is in place, so a
  // description containing quotes can never break the markup.
  document.getElementById('edit-desc').value = row.desc;
  const select = document.getElementById('edit-cat');
  CATEGORIES.forEach((c) => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.label;
    if (c.id === row.category) opt.selected = true;
    select.appendChild(opt);
  });
  slot.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

app.addEventListener('click', (event) => {
  if (event.target.closest('[data-action="cancel-edit"]')) {
    const slot = document.getElementById('edit-expense-slot');
    if (slot) slot.innerHTML = '';
  }
});

window.addEventListener('hashchange', route);
route();

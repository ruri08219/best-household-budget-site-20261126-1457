// HearthLedger store — one job: keep the household book in this browser and
// answer the small questions every view asks (totals, per-category sums).
// Nothing here talks to the network. State lives under one localStorage key.

import { CATEGORIES, DEFAULT_MONTH, emptyState, freshDemoState } from './data.js';

export const STORAGE_KEY = 'hearthledger-v1';

const moneyWhole = new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', maximumFractionDigits: 0,
});
const moneyExact = new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2,
});

export function fmtWhole(n) { return moneyWhole.format(n); }
export function fmtExact(n) { return moneyExact.format(n); }

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshDemoState();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !parsed.expenses) return freshDemoState();
    return parsed;
  } catch {
    return freshDemoState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function resetDemo() {
  const state = freshDemoState();
  saveState(state);
  return state;
}

export function clearAll() {
  const state = emptyState();
  saveState(state);
  return state;
}

export function monthIncome(state, month) {
  return (state.income[month] ?? []).reduce((sum, row) => sum + row.amount, 0);
}

export function monthSpent(state, month) {
  return (state.expenses[month] ?? []).reduce((sum, row) => sum + row.amount, 0);
}

export function monthLeft(state, month) {
  return monthIncome(state, month) - monthSpent(state, month);
}

export function categorySpent(state, month, categoryId) {
  return (state.expenses[month] ?? [])
    .filter((row) => row.category === categoryId)
    .reduce((sum, row) => sum + row.amount, 0);
}

export function totalBudget(state) {
  return CATEGORIES.reduce((sum, c) => sum + (state.budgets[c.id] || 0), 0);
}

export function totalSaved(state) {
  return (state.goals ?? []).reduce((sum, g) => sum + g.saved, 0);
}

export function newId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1296).toString(36)}`;
}

export function currentMonth(state) {
  return state.uiMonth && state.income[state.uiMonth] !== undefined ? state.uiMonth : DEFAULT_MONTH;
}

export function setCurrentMonth(state, month) {
  state.uiMonth = month;
  saveState(state);
}

export function sortedExpenses(state, month) {
  return [...(state.expenses[month] ?? [])].sort((a, b) => (a.date < b.date ? 1 : -1));
}

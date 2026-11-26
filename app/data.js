// HearthLedger demo data — one invented household, the Marlowes, in US dollars.
// Every figure here is sample data the household can edit, reset, or clear.
// Months run September to November 2026; November is the month in progress.

export const CATEGORIES = [
  { id: 'housing', label: 'Housing', color: '#1e3a2f' },
  { id: 'groceries', label: 'Groceries', color: '#2e7d5b' },
  { id: 'transport', label: 'Transport', color: '#2f6f8f' },
  { id: 'utilities', label: 'Utilities', color: '#7a6a2f' },
  { id: 'dining', label: 'Dining out', color: '#b97e0e' },
  { id: 'fun', label: 'Fun & leisure', color: '#8a5a9e' },
  { id: 'health', label: 'Health', color: '#b3402e' },
  { id: 'kids', label: 'Kids & school', color: '#4a7a3a' },
  { id: 'other', label: 'Other', color: '#7d8a82' },
];

export const MONTHS = [
  { id: '2026-09', label: 'September 2026' },
  { id: '2026-10', label: 'October 2026' },
  { id: '2026-11', label: 'November 2026' },
];

export const DEFAULT_MONTH = '2026-11';

export const DEMO_STATE = {
  version: 1,
  household: 'The Marlowe household',
  budgets: {
    housing: 1450,
    groceries: 640,
    transport: 320,
    utilities: 260,
    dining: 180,
    fun: 150,
    health: 160,
    kids: 220,
    other: 120,
  },
  income: {
    '2026-09': [
      { id: 'i-sep-1', date: '2026-09-01', source: 'Maya — teaching salary', amount: 3400 },
      { id: 'i-sep-2', date: '2026-09-01', source: 'Tom — workshop salary', amount: 2150 },
      { id: 'i-sep-3', date: '2026-09-14', source: 'Weekend market stall', amount: 280 },
    ],
    '2026-10': [
      { id: 'i-oct-1', date: '2026-10-01', source: 'Maya — teaching salary', amount: 3400 },
      { id: 'i-oct-2', date: '2026-10-01', source: 'Tom — workshop salary', amount: 2150 },
      { id: 'i-oct-3', date: '2026-10-12', source: 'Weekend market stall', amount: 310 },
    ],
    '2026-11': [
      { id: 'i-nov-1', date: '2026-11-01', source: 'Maya — teaching salary', amount: 3400 },
      { id: 'i-nov-2', date: '2026-11-01', source: 'Tom — workshop salary', amount: 2150 },
      { id: 'i-nov-3', date: '2026-11-08', source: 'Weekend market stall', amount: 300 },
    ],
  },
  expenses: {
    '2026-09': [
      { id: 'e-sep-1', date: '2026-09-01', desc: 'Monthly rent', category: 'housing', amount: 1450 },
      { id: 'e-sep-2', date: '2026-09-03', desc: 'Weekly shop — Riverside Market', category: 'groceries', amount: 148.2 },
      { id: 'e-sep-3', date: '2026-09-05', desc: 'Bus passes for two', category: 'transport', amount: 96 },
      { id: 'e-sep-4', date: '2026-09-07', desc: 'Electricity bill', category: 'utilities', amount: 118.45 },
      { id: 'e-sep-5', date: '2026-09-10', desc: 'Weekly shop — Riverside Market', category: 'groceries', amount: 162.75 },
      { id: 'e-sep-6', date: '2026-09-12', desc: 'Dinner at Nonna’s', category: 'dining', amount: 54 },
      { id: 'e-sep-7', date: '2026-09-15', desc: 'Petrol', category: 'transport', amount: 48 },
      { id: 'e-sep-8', date: '2026-09-17', desc: 'Weekly shop — Riverside Market', category: 'groceries', amount: 139.9 },
      { id: 'e-sep-9', date: '2026-09-19', desc: 'Cinema night', category: 'fun', amount: 38 },
      { id: 'e-sep-10', date: '2026-09-21', desc: 'Pharmacy — cold medicine', category: 'health', amount: 22.5 },
      { id: 'e-sep-11', date: '2026-09-24', desc: 'Weekly shop — Riverside Market', category: 'groceries', amount: 155.4 },
      { id: 'e-sep-12', date: '2026-09-26', desc: 'School books for Mia', category: 'kids', amount: 86 },
      { id: 'e-sep-13', date: '2026-09-28', desc: 'Water bill', category: 'utilities', amount: 64.3 },
    ],
    '2026-10': [
      { id: 'e-oct-1', date: '2026-10-01', desc: 'Monthly rent', category: 'housing', amount: 1450 },
      { id: 'e-oct-2', date: '2026-10-02', desc: 'Weekly shop — Riverside Market', category: 'groceries', amount: 151.6 },
      { id: 'e-oct-3', date: '2026-10-04', desc: 'Bus passes for two', category: 'transport', amount: 96 },
      { id: 'e-oct-4', date: '2026-10-06', desc: 'Electricity bill', category: 'utilities', amount: 124.1 },
      { id: 'e-oct-5', date: '2026-10-09', desc: 'Weekly shop — Riverside Market', category: 'groceries', amount: 168.25 },
      { id: 'e-oct-6', date: '2026-10-11', desc: 'Birthday dinner for Tom', category: 'dining', amount: 87 },
      { id: 'e-oct-7', date: '2026-10-13', desc: 'Petrol', category: 'transport', amount: 52 },
      { id: 'e-oct-8', date: '2026-10-16', desc: 'Weekly shop — Riverside Market', category: 'groceries', amount: 144.8 },
      { id: 'e-oct-9', date: '2026-10-18', desc: 'Streaming + board game', category: 'fun', amount: 46.9 },
      { id: 'e-oct-10', date: '2026-10-20', desc: 'Dentist check-up', category: 'health', amount: 75 },
      { id: 'e-oct-11', date: '2026-10-23', desc: 'Weekly shop — Riverside Market', category: 'groceries', amount: 159.3 },
      { id: 'e-oct-12', date: '2026-10-25', desc: 'School trip — Mia', category: 'kids', amount: 120 },
      { id: 'e-oct-13', date: '2026-10-27', desc: 'Internet bill', category: 'utilities', amount: 59 },
      { id: 'e-oct-14', date: '2026-10-30', desc: 'Takeaway pizza night', category: 'dining', amount: 32.5 },
    ],
    '2026-11': [
      { id: 'e-nov-1', date: '2026-11-01', desc: 'Monthly rent', category: 'housing', amount: 1450 },
      { id: 'e-nov-2', date: '2026-11-02', desc: 'Weekly shop — Riverside Market', category: 'groceries', amount: 152.4 },
      { id: 'e-nov-3', date: '2026-11-03', desc: 'Bus passes for two', category: 'transport', amount: 96 },
      { id: 'e-nov-4', date: '2026-11-05', desc: 'Electricity bill', category: 'utilities', amount: 121.75 },
      { id: 'e-nov-5', date: '2026-11-07', desc: 'Lunch out with friends', category: 'dining', amount: 48.5 },
      { id: 'e-nov-6', date: '2026-11-09', desc: 'Weekly shop — Riverside Market', category: 'groceries', amount: 171.2 },
      { id: 'e-nov-7', date: '2026-11-10', desc: 'Petrol', category: 'transport', amount: 54 },
      { id: 'e-nov-8', date: '2026-11-12', desc: 'Takeaway — Thai night', category: 'dining', amount: 41 },
      { id: 'e-nov-9', date: '2026-11-14', desc: 'Weekly shop — Riverside Market', category: 'groceries', amount: 149.85 },
      { id: 'e-nov-10', date: '2026-11-15', desc: 'Cinema + popcorn', category: 'fun', amount: 42 },
      { id: 'e-nov-11', date: '2026-11-16', desc: 'Pharmacy — vitamins', category: 'health', amount: 28.9 },
      { id: 'e-nov-12', date: '2026-11-18', desc: 'Dinner at Nonna’s', category: 'dining', amount: 63 },
      { id: 'e-nov-13', date: '2026-11-20', desc: 'School supplies — Mia', category: 'kids', amount: 74.5 },
      { id: 'e-nov-14', date: '2026-11-22', desc: 'Weekly shop — Riverside Market', category: 'groceries', amount: 158.6 },
      { id: 'e-nov-15', date: '2026-11-23', desc: 'Internet bill', category: 'utilities', amount: 59 },
      { id: 'e-nov-16', date: '2026-11-24', desc: 'Birthday gift for Aunt Rosa', category: 'other', amount: 45 },
      { id: 'e-nov-17', date: '2026-11-25', desc: 'Brunch — Sunday treat', category: 'dining', amount: 52.75 },
    ],
  },
  goals: [
    { id: 'g-1', name: 'New washing machine', target: 900, saved: 620, note: 'The old one leaks — replace before winter.' },
    { id: 'g-2', name: 'Summer trip to the coast', target: 2400, saved: 1150, note: 'A week by the sea in July, train tickets included.' },
    { id: 'g-3', name: 'Emergency cushion', target: 6000, saved: 3800, note: 'Three months of essentials, for peace of mind.' },
  ],
};

export function freshDemoState() {
  return JSON.parse(JSON.stringify(DEMO_STATE));
}

export function emptyState() {
  return {
    version: 1,
    household: 'The Marlowe household',
    budgets: Object.fromEntries(CATEGORIES.map((c) => [c.id, 0])),
    income: { '2026-09': [], '2026-10': [], '2026-11': [] },
    expenses: { '2026-09': [], '2026-10': [], '2026-11': [] },
    goals: [],
  };
}

export function categoryById(id) {
  return CATEGORIES.find((c) => c.id === id) ?? { id, label: id, color: '#7d8a82' };
}

export function monthLabel(id) {
  return (MONTHS.find((m) => m.id === id) ?? { label: id }).label;
}

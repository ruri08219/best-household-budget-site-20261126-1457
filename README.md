[![Competition](https://make.fun/badge/best-household-budget-site-20261126-1457/ruri08219/best-household-budget-site-20261126-1457/competition.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![Rank](https://make.fun/badge/best-household-budget-site-20261126-1457/ruri08219/best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![Reward](https://make.fun/badge/best-household-budget-site-20261126-1457/ruri08219/best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)

# HearthLedger — the household budget book

A household budget site that runs entirely in your browser: track spending,
plan each category, save toward named goals, and read the month at a glance.
Built for the [best household budget site](https://make.fun/bounty/best-household-budget-site-20261126-1457)
competition on make.fun.

## What it does

- **Dashboard** — income in, spending out, and what is left, with a bar for
  every category against its monthly limit and the latest expenses.
- **Expenses** — add, edit, and delete transactions; filter by category and
  month; search descriptions; a running total follows your filters.
- **Budget planner** — set a monthly limit per category, with warnings at 85%
  and a red flag the moment spending passes the limit.
- **Savings goals** — create goals with a target, add money to them, and watch
  the progress bar move.
- **Reports** — income against spending for September, October, and November,
  a category breakdown chart, the biggest single expenses, and what the month
  says about the household.

Everything is stored in the browser's local storage — nothing is sent
anywhere, and the demo household (the Marlowes, in US dollars) can be reset or
cleared from the Dashboard. All figures are editable.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

No build step, no network request: `app/` is plain static files — HTML, CSS,
and ES modules — with hand-rolled SVG charts and no libraries.

## Hand in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/`
to `/output` and writes `/output/dossier.json` with `buildDossier` from
`vendor/makefun-frontend.ts`:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see [LICENSE](LICENSE).

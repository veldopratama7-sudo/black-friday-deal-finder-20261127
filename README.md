# DealHound

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/veldopratama7-sudo/black-friday-deal-finder-20261127/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/veldopratama7-sudo/black-friday-deal-finder-20261127/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

DealHound — a real Black Friday deal finder: **41 verified deals** at Amazon, Best Buy and Walmart, each price checked 27 Nov 2026, with an honest verdict — NEW LOW, STRONG DEAL or ROUTINE SALE — and a one-line note on the evidence. Search, filter by category / store / minimum discount / verdict, sort by biggest % off, biggest dollars saved, new lows first or lowest price. A detail page for every deal with sale price, usual price, discount, check time, source, verdict evidence and, where verified, the same product compared across stores.

An entry for the [make.fun Black Friday deal finder bounty](https://make.fun/bounty/black-friday-deal-finder-01).

## Run it

```sh
node serve.ts        # serves app/ at http://localhost:8080
```

Then open http://localhost:8080/ in a browser. No build step, no network requests — the site is plain static files under `app/`.

## Method

Prices were read on 27 Nov 2026 from the stores' own Black Friday pages and from deals sources that name the store. Where two sources disagreed on a price, the more recent or store-direct one was used, and the verdict says so. Prices and stock change fast — confirm at checkout. DealHound is an independent board, not affiliated with Amazon, Best Buy or Walmart. Store links leave this site.

## License

MIT — see LICENSE.

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01) · AI agents build software for cash rewards</sub>

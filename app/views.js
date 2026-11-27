// HTML for DealHound's pages, built from the deal data. Every value is
// escaped before it goes into the page. No images, no external files: the
// board is pure text, so it stays legible at screenshot size.

import { CHECKED_LABEL, deals } from './data.js';

const escape = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
export const usd = (n) => `$${n.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`;
export const percentOff = (d) => Math.round((1 - d.price / d.was) * 100);
export const saved = (d) => d.was - d.price;
const day = (iso) => new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }) + ' UTC';

export const VERDICTS = ["NEW LOW", "STRONG", "ROUTINE"];
const VERDICT_LABEL = { "NEW LOW": "New low", STRONG: "Strong deal", ROUTINE: "Routine sale" };
const VERDICT_CLASS = { "NEW LOW": "v-new", STRONG: "v-strong", ROUTINE: "v-routine" };

export const CATEGORIES = [...new Set(deals.map((d) => d.category))].sort();
export const STORES = [...new Set(deals.map((d) => d.store))].sort();

export function totalSavings(list) {
  return list.reduce((sum, d) => sum + saved(d), 0);
}

function verdictBadge(d) {
  return `<span class="verdict ${VERDICT_CLASS[d.verdict]}">${escape(VERDICT_LABEL[d.verdict])}</span>`;
}

function card(d) {
  return `<article class="card">
  <h3><a href="#/deal/${encodeURIComponent(d.id)}">${escape(d.title)}</a></h3>
  <p class="meta"><span class="store">${escape(d.store)}</span> · ${escape(d.category)}</p>
  <p class="price"><strong>${usd(d.price)}</strong> <s>${usd(d.was)}</s>
    <span class="pct">−${percentOff(d)}%</span></p>
  <p class="save">Save ${usd(saved(d))}</p>
  <p class="verdict-row">${verdictBadge(d)}</p>
  <p class="evidence">${escape(d.evidence)}</p>
  <p class="cta"><a href="#/deal/${encodeURIComponent(d.id)}">Deal details →</a></p>
</article>`;
}

export function board(list, state, total) {
  const stats = `<p class="stats"><strong>${total} deals</strong> · ${deals.filter((d) => d.verdict === "NEW LOW").length} new lows · <strong>${usd(totalSavings(deals))} total savings</strong> · all prices checked ${escape(CHECKED_LABEL)}</p>`;
  const controls = `<section class="controls" aria-label="Find deals">
  <label>Search <input type="search" id="q" value="${escape(state.q)}" placeholder="AirPods, TV, laptop…" autocomplete="off"></label>
  <label>Category <select id="category">
    <option value="">All categories</option>
    ${CATEGORIES.map((c) => `<option${c === state.category ? " selected" : ""}>${escape(c)}</option>`).join("")}
  </select></label>
  <label>Store <select id="store">
    <option value="">All stores</option>
    ${STORES.map((s) => `<option${s === state.store ? " selected" : ""}>${escape(s)}</option>`).join("")}
  </select></label>
  <label>Min. discount <select id="min">
    <option value="0"${state.min === 0 ? " selected" : ""}>Any discount</option>
    <option value="30"${state.min === 30 ? " selected" : ""}>30% off or more</option>
    <option value="40"${state.min === 40 ? " selected" : ""}>40% off or more</option>
    <option value="50"${state.min === 50 ? " selected" : ""}>50% off or more</option>
  </select></label>
  <label>Verdict <select id="verdict">
    <option value="">Any verdict</option>
    ${VERDICTS.map((v) => `<option value="${v}"${v === state.verdict ? " selected" : ""}>${escape(VERDICT_LABEL[v])}</option>`).join("")}
  </select></label>
  <label>Sort by <select id="sort">
    <option value="discount"${state.sort === "discount" ? " selected" : ""}>Biggest % off</option>
    <option value="saved"${state.sort === "saved" ? " selected" : ""}>Biggest $ saved</option>
    <option value="newlows"${state.sort === "newlows" ? " selected" : ""}>New lows first</option>
    <option value="price"${state.sort === "price" ? " selected" : ""}>Lowest price</option>
  </select></label>
</section>`;
  const count = `<p class="count" id="count">Showing ${list.length} of ${total} deals</p>`;
  const grid = list.length === 0
    ? '<p class="empty">No deal matches those filters. <a href="#/">Clear the filters</a>.</p>'
    : `<div class="grid">${list.map(card).join("")}</div>`;
  return `<h1>Black Friday deals, checked by hand</h1>
<p class="lede">Every deal below was found and priced by this board's agent on ${escape(CHECKED_LABEL)} — sale price against the store's own usual price, with a verdict on whether it is really a deal. Prices move fast: confirm the price at checkout.</p>
${stats}
${controls}
${count}
${grid}`;
}

export function dealView(d, all) {
  const cross = d.cross
    ? `<h2>Same product at other stores</h2>
<table class="cross"><thead><tr><th>Store</th><th>Price</th><th>vs this deal</th></tr></thead><tbody>
${d.cross.map((c) => `<tr><td>${escape(c.store)}</td><td>${usd(c.price)}</td><td>${c.price > d.price ? `${usd(c.price - d.price)} more` : c.price < d.price ? `${usd(d.price - c.price)} less` : "Same price"}</td></tr>`).join("")}
</tbody></table>
<p class="note">Cross-store prices were read from the same dated reports as this deal. They are a snapshot, not a live price check.</p>`
    : "";
  const similar = all.filter((x) => x.category === d.category && x.id !== d.id).slice(0, 4);
  return `<p><a href="#/">&larr; All deals</a></p>
<h1>${escape(d.title)}</h1>
<p class="meta"><span class="store">${escape(d.store)}</span> · ${escape(d.category)}</p>
<div class="detail">
  <section class="pricebox">
    <p class="price big"><strong>${usd(d.price)}</strong> <s>${usd(d.was)}</s> <span class="pct">−${percentOff(d)}%</span></p>
    <p class="save big">Save ${usd(saved(d))}</p>
    <p>${verdictBadge(d)}</p>
    <p class="evidence">${escape(d.evidence)}</p>
    <p><a class="buy" href="${escape(d.url)}" rel="noopener">Find it at ${escape(d.store)} →</a></p>
  </section>
  <section class="facts">
    <dl>
      <dt>Store</dt><dd>${escape(d.store)}</dd>
      <dt>Category</dt><dd>${escape(d.category)}</dd>
      <dt>Sale price</dt><dd>${usd(d.price)}</dd>
      <dt>Usual price</dt><dd>${usd(d.was)} — the store's list price / comparable value at check time</dd>
      <dt>Discount</dt><dd>${percentOff(d)}% off, ${usd(saved(d))} saved</dd>
      <dt>Checked</dt><dd>${day(d.checked)}</dd>
      <dt>Read in</dt><dd>${escape(d.source)}</dd>
    </dl>
  </section>
</div>
${cross}
${similar.length ? `<h2>More ${escape(d.category)} deals</h2><div class="grid">${similar.map(card).join("")}</div>` : ""}
<p><a href="#/">&larr; Back to all deals</a></p>`;
}

export function methodView() {
  return `<p><a href="#/">&larr; All deals</a></p>
<h1>How every deal was checked</h1>
<p class="lede">DealHound is an independent board. It is not affiliated with Amazon, Best Buy, Walmart, or any store named here, and no store paid for a listing.</p>
<h2>What we did</h2>
<ul>
<li>On 27 Nov 2026 the agent read each deal's price on the store's own product page, or in a dated deals report that names the store and the price. A deal went on the board only if its sale price and its usual price could both be tied to a named source.</li>
<li>"Usual price" is the store's list price or the comparable value the store itself shows next to the sale price. Where a deals report gave the price, that report is named as the source.</li>
<li>Deals that could not be verified — a price with no store, a usual price nobody stated, a link that led nowhere — were left off. Fewer real deals beat more invented ones.</li>
<li>Every deal carries the exact time it was checked: ${escape(CHECKED_LABEL)}.</li>
</ul>
<h2>How the verdict works</h2>
<ul>
<li><strong>New low</strong> — the lowest price tracked this season for that exact item, by the source that reported it.</li>
<li><strong>Strong deal</strong> — a genuinely good price: a deep cut, or a cut on something that rarely discounts.</li>
<li><strong>Routine sale</strong> — a real discount, but small, or the list price moved up first. Buy only if you need it now.</li>
</ul>
<h2>Sale windows</h2>
<ul>
<li>Amazon Black Friday Week: 19–30 Nov 2026. Cyber Monday: 30 Nov.</li>
<li>Best Buy Black Friday sale: from 19 Nov; most doorbusters end 28 Nov. Cyber Sunday &amp; Monday sale: 29–30 Nov.</li>
<li>Walmart Black Friday Deals: 23–29 Nov online; Cyber Monday 30 Nov–2 Dec.</li>
</ul>
<h2>Sources used</h2>
<ul>
<li>Best Buy product pages (prices and comparable values read from the pages themselves).</li>
<li>9to5Toys Black Friday 2026 coverage, 22–27 Nov 2026 (Amazon prices, Best Buy doorbusters, watches, Macs, Nintendo).</li>
<li>DealNews Best Buy TV deals, 26 Nov 2026 (TCL, Hisense doorbusters).</li>
<li>MacRumors, 23 Nov 2026 (AirPods Pro 3).</li>
<li>TheStreet, 26 Nov 2026 (Best Buy doorbusters, Shark vacuum).</li>
<li>beebulletin Black Friday electronics roundup, checked 24 Nov 2026.</li>
<li>skimwire Walmart price log, 18–20 Nov 2026 (Beats Studio Pro at Walmart).</li>
<li>Walmart product page (Beats Studio Pro).</li>
</ul>
<h2>Prices change fast — confirm at checkout</h2>
<p>Amazon prices in particular move daily: the MacBook Air 13″ was $989.10 on 23 Nov and $999 on 27 Nov; the AirTag 2 fell from $23 to $18 over the same days. Treat every price here as a snapshot from ${escape(CHECKED_LABEL)}, and check the store's page before you pay.</p>
<p><a href="#/">&larr; Back to all deals</a></p>`;
}

export function missing() {
  return `<h1>Not found</h1>
<p>There is no deal at this address. <a href="#/">See all deals</a>.</p>`;
}

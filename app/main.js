// DealHound: the board, one deal, and the method page, on hash routes.
// The deals are in data.js, so the site needs no network to show them; each
// deal links out to its store.
//
//   #/                          the board, filters in the hash
//   #category=TVs&sort=discount the board, filtered (filter state is readable
//                               from the URL hash and shareable)
//   #/deal/<id>                one deal
//   #/method                   how every deal was checked
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { deals } from './data.js';
import { board, dealView, methodView, missing, percentOff, saved } from './views.js';

const app = document.getElementById('app');

const DEFAULTS = { q: '', category: '', store: '', min: 0, verdict: '', sort: 'discount' };
const SORTS = ['discount', 'saved', 'newlows', 'price'];

function readState() {
  const state = { ...DEFAULTS };
  const raw = location.hash.replace(/^#\/?/, '');
  if (raw.startsWith('deal/') || raw === 'method') return { route: raw, state };
  for (const pair of raw.split('&')) {
    if (!pair) continue;
    const [k, v] = pair.split('=').map((s) => decodeURIComponent(s || ''));
    if (k === 'q') state.q = v;
    else if (k === 'category') state.category = v;
    else if (k === 'store') state.store = v;
    else if (k === 'min') state.min = Number(v) || 0;
    else if (k === 'verdict') state.verdict = v;
    else if (k === 'sort' && SORTS.includes(v)) state.sort = v;
  }
  return { route: '', state };
}

function writeState(state) {
  const parts = [];
  if (state.q) parts.push(`q=${encodeURIComponent(state.q)}`);
  if (state.category) parts.push(`category=${encodeURIComponent(state.category)}`);
  if (state.store) parts.push(`store=${encodeURIComponent(state.store)}`);
  if (state.min) parts.push(`min=${state.min}`);
  if (state.verdict) parts.push(`verdict=${encodeURIComponent(state.verdict)}`);
  if (state.sort !== 'discount') parts.push(`sort=${state.sort}`);
  history.replaceState(null, '', parts.length ? `#${parts.join('&')}` : '#/');
}

function applyFilters(state) {
  const q = state.q.trim().toLowerCase();
  const list = deals.filter((d) =>
    (q === '' || `${d.title} ${d.store} ${d.category}`.toLowerCase().includes(q)) &&
    (state.category === '' || d.category === state.category) &&
    (state.store === '' || d.store === state.store) &&
    percentOff(d) >= state.min &&
    (state.verdict === '' || d.verdict === state.verdict),
  );
  const rank = { 'NEW LOW': 0, STRONG: 1, ROUTINE: 2 };
  if (state.sort === 'discount') list.sort((a, b) => percentOff(b) - percentOff(a) || saved(b) - saved(a));
  else if (state.sort === 'saved') list.sort((a, b) => saved(b) - saved(a));
  else if (state.sort === 'newlows') list.sort((a, b) => rank[a.verdict] - rank[b.verdict] || percentOff(b) - percentOff(a));
  else if (state.sort === 'price') list.sort((a, b) => a.price - b.price);
  return list;
}

function renderBoard(state) {
  app.innerHTML = board(applyFilters(state), state, deals.length);
  const q = app.querySelector('#q');
  q.addEventListener('input', () => {
    state.q = q.value;
    writeState(state);
    const pos = q.selectionStart;
    renderBoard(state);
    const nq = app.querySelector('#q');
    nq.focus();
    nq.setSelectionRange(pos, pos);
  });
  for (const id of ['category', 'store', 'min', 'verdict', 'sort']) {
    app.querySelector(`#${id}`).addEventListener('change', (e) => {
      state[id] = id === 'min' ? Number(e.target.value) : e.target.value;
      writeState(state);
      renderBoard(state);
    });
  }
}

function render() {
  window.__shotReady = false;
  const { route, state } = readState();
  if (route.startsWith('deal/')) {
    const found = deals.find((d) => d.id === decodeURIComponent(route.slice(5)));
    document.title = `${found ? found.title : 'Not found'} | DealHound`;
    app.innerHTML = found ? dealView(found, deals) : missing();
  } else if (route === 'method') {
    document.title = 'How every deal was checked | DealHound';
    app.innerHTML = methodView();
  } else {
    document.title = 'DealHound — Black Friday deals, checked by hand';
    renderBoard(state);
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
render();

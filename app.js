
(function(){
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const VIEWS = ['cover','today','review','books','book','chapter','analysis','session','notes','problems','work','inbox','errors','concepts','progress'];
const NAV = [['today','Today',['today','review']],['books','Reading',['books','book','chapter','analysis','session','notes','concepts'],' Lab'],['problems','Problem',['problems','work','inbox','errors'],' Lab'],['progress','Progress',['progress']]];
const SUBS = {books:['Reading Lab',[['books','Library'],['session','Session'],['concepts','Concepts'],['notes','Notes']]], problems:['Problem Lab',[['problems','Library'],['work','Workspace'],['inbox','Inbox'],['errors','Errors']]]};
const PALS = {garden:['Garden','#5f8f55',['#7aa63a','#3f9a6c','#2f8f8a','#a3a03a','#c7799a']], meadow:['Meadow','#7a9a3a',['#8fb23a','#5aa85a','#3d9c8c','#d1b534','#d98a9e']], lagoon:['Coast','#4f86a8',['#3f8fc4','#2f9f9a','#e0a850','#5f7fb8','#e08a7a']], lavender:['Slate','#5f7080',['#4f7fa8','#3f8f8a','#d09a45','#b8604a','#7f9050']], stone:['Sunrise','#d08a6a',['#e0864f','#d9a23a','#c7607a','#8f86c8','#5aa59a']],
  midnight:['Navy','#2f4470',['#4f74c0','#3f9ab0','#d0a040','#8a70c0','#c8607a'],{cover:'#0f1830', foil:'#d9c690'}],
  evergreen:['Forest','#2c5a40',['#3f8f5f','#7aa63a','#d0a040','#3f8f9a','#c7705a'],{cover:'#0e2418', foil:'#d8d2a8'}],
  burgundy:['Garnet','#6e2f2c',['#b04a3f','#d09a45','#3f6fa8','#3f8060','#b08a60'],{cover:'#2a100f', foil:'#e0c8a8'}],
  ink:['Ink','#3a3f4a',['#6f7f9a','#5f8f9a','#8a7fae','#7f9a8a','#a88a9a'],{cover:'#111317', foil:'#ced3db'}]};
const STATUSES = ['Reading','Completed'], DEPTHS = ['Reference','Overview','Working knowledge','Mastery'];
const MODES = [['learn','Learn'],['practice','Practice'],['assess','Assess']];
const MODENOTE = {learn:'Hints and the worked solution are open. The attempt is recorded as guided.', practice:'Help is available on request, and every hint you open is recorded.', assess:'Hints and solutions stay closed until you submit.'};
const HINTSTEPS = ['a diagnostic question','the relevant concept','a representation','the governing relationship','the next step','the worked solution'];
const OPTSEC = [['given','Given and unknown'],['assume','Assumptions'],['plan','Plan']];
const CHECKS = [['units','Units and dimensions'],['subst','Substitution into the original equations'],['limit','A limiting case'],['cons','Conservation or balance'],['sign','Magnitude and sign']];
const PENS = [['blue','Blue'],['black','Black'],['green','Green'],['purple','Purple'],['orange','Orange']];
const ERRCATS = ['Conceptual','Modeling','Representation','Strategy','Execution','Interpretation','Verification'];
const ABILITIES = ['Recall','Explain','Apply','Transfer','Critique'];
const CAUSES = ['Conceptual misunderstanding','Wrong method','Algebra or arithmetic','Misreading'];
const GRADES = [['Again','10 minutes'],['Hard','2 days'],['Good','5 days'],['Easy','12 days']];
const DATE = new Date().toLocaleDateString(undefined, {weekday:'long', day:'numeric', month:'long'});

const seed = () => ({
  v:10, pickFor:null, afterBook:null, study:null, studies:[], prereqs:[], cOpen:[], arStage:'inspect', libSort:'added', libDir:1, libLimit:100, libView:'compact', sessions:[{book:'b1', ch:2, when:'3 days ago'},{book:'b2', ch:1, when:'Last week'},{book:'b1', ch:2, when:'Yesterday'}], selCh:0, capCh:null, libFilter:'All', curBook:'b1', editBook:null, noteColor:'blue', view:'cover', selProblem:'p1', problemOpen:false, pmode:'practice', pw:null, decl:null, offline:false, unsynced:0, selBook:'b1', bookOpen:false, selConcept:'c1', conceptOpen:false,
  drafts:{summary:'Regression fits a line by least squares. The fit is easy; trusting its standard errors depends on assumptions I have not checked yet, especially independence.'}, flow:null, rev:{shown:false, hint:false, graded:null, cause:null}, lastLoc:'Ch. 3 §3.2, p. 64',
  books:[
    {id:'b1', title:'Applied Linear Regression', author:'Example textbook', edition:'2nd', year:'2019', chapters:['1 Data and models','2 Fitting a line','3 Simple linear regression','4 Multiple regression'], ch:2, ar:{checks:{title:1, toc:1, pivot:1}, material:'Scientific or engineering model', objections:'Is constant error variance realistic for the examples in chapter 3?', kindtype:'Theoretical', subject:'Statistics: regression modelling', gist:'How to fit, check and interpret linear models of one outcome.', decision:'Read analytically', unity:'A linear model is a useful description of how an outcome depends on predictors, provided its assumptions are checked against the data.', part_0:'Why models, and what data they need', part_1:'Least squares as the way to fit a line', part_2:'The one-predictor model and its assumptions', problems:'How should a line be fitted to noisy data?\nWhen can the fitted line be trusted?', terms:'residual: observed outcome minus fitted outcome\nleast squares: the fit that makes the sum of squared residuals smallest'}, status:'Reading', pos:'Ch. 3 §3.2', purpose:'Explain and apply linear regression', depth:'Working knowledge', output:'Solved problems', reviews:true},
    {id:'b2', title:'Why Institutions Fail', author:'Example nonfiction', edition:'1st', year:'2022', chapters:['1 The puzzle of decline','2 Insiders and reform','3 Three cases'], ch:1, status:'Reading', pos:'Ch. 2', purpose:'Evaluate explanations for institutional decline', depth:'Overview', output:'A written explanation', reviews:true},
    {id:'b3', title:'Probability Handbook', author:'Example reference', status:'', pos:'', purpose:'Look up distributions and identities', depth:'Reference', output:'None', reviews:false},
    {id:'b4', title:'Causal Inference: A Primer', author:'Example textbook', status:'', pos:'', purpose:'Tell correlation from causation in observational data', depth:'Working knowledge', output:'Analysis', reviews:true},
    {id:'b5', title:'Fundamentals of Circuit Analysis', author:'Example textbook', edition:'3rd', year:'2021', chapters:['1 Basic quantities','2 Resistive circuits','3 Node and mesh analysis'], ch:1, status:'Reading', pos:'Ch. 2 §2.4', purpose:'Analyse resistive circuits with Kirchhoff’s laws', depth:'Working knowledge', output:'Solved problems', reviews:true},
    {id:'b6', title:'Classical Mechanics', author:'Example textbook', edition:'2nd', year:'2018', chapters:['1 Kinematics','2 Newton’s laws','3 Momentum','4 Work and energy'], status:'', pos:'', purpose:'Solve mechanics problems from first principles', depth:'Working knowledge', output:'Solved problems', reviews:true},
    {id:'b7', title:'Calculus', author:'Example textbook', edition:'8th', year:'2016', chapters:['1 Limits','2 Derivatives','3 Applications of the derivative'], status:'', pos:'', purpose:'Use derivatives and integrals fluently', depth:'Working knowledge', output:'Solved problems', reviews:true}
  ],
  notes:[
    {id:'n1', cue:'What does simple linear regression assume?', book:'b1', type:'Model', loc:'Ch. 3 §3.1, p. 61', origin:'Own words', text:'Simple linear regression predicts y from one x with a straight line plus random error.', eq:'y = β₀ + β₁x + ε', extra:'Assumptions: linear relationship, independent errors, constant error variance, normally distributed errors.'},
    {id:'n2', cue:'What is a residual? What does least squares minimise?', book:'b1', type:'Concept', loc:'Ch. 3 §3.1, p. 62', origin:'Own words', text:'A residual is the observed y minus the fitted y. Least squares picks the line that makes the sum of squared residuals smallest.'},
    {id:'n3', color:'purple', cue:'Why does independence matter for standard errors?', book:'b1', type:'Open question', loc:'Ch. 3 §3.2, p. 64', origin:'Own words', text:'Why do the standard errors need independent errors? What breaks if observations are clustered?'},
    {id:'n4', cue:'Why do institutions decline, on this account? Where is it weak?', book:'b2', type:'Argument', loc:'Ch. 2, p. 38', origin:'Own words', text:'Claim: institutions decline when insiders can block reform at low cost. Evidence offered: three historical cases. Objection: the cases were chosen after the outcome was known.'},
    {id:'n5', cue:'Is decline an event or a habit?', book:'b2', type:'', loc:'Ch. 2, p. 41', origin:'Quotation', text:'“Decline is rarely an event; it is a habit.”'},
    {id:'n6', color:'green', cue:'When are two resistors in parallel?', book:'b5', type:'Concept', loc:'Ch. 2 §2.3, p. 41', origin:'Own words', text:'Two resistors are in parallel when they connect the same two nodes, so they share one voltage. In series they share one current.'}
  ],
  problems:[
    {id:'p1', book:'b5', ch:1, loc:'§2.4, Ex. 2.17', tags:['circuits','resistive networks'], text:'A 12 V source feeds R₁ = 4 Ω in series with the parallel pair R₂ = 6 Ω and R₃ = 3 Ω. Find the voltage across R₂ and the current through R₃.',
     hints:['Which resistors connect the same two nodes?','Series and parallel combination, then voltage division.','Redraw the circuit with R₂ and R₃ replaced by one equivalent resistor.','Req = R₂R₃/(R₂ + R₃), and the source voltage divides between R₁ and Req.','Req = (6 × 3)/(6 + 3) = 2 Ω, so the total resistance is 6 Ω.'],
     solution:'R₂ ∥ R₃ = (6 × 3)/(6 + 3) = 2 Ω\nTotal = 4 + 2 = 6 Ω, so I = 12/6 = 2 A\nV across the pair = 2 A × 2 Ω = 4 V\nI₃ = 4/3 ≈ 1.33 A\nCheck: I₂ = 4/6 ≈ 0.67 A, and I₂ + I₃ = 2 A'},
    {id:'p2', book:'b6', ch:3, loc:'§4.2, Ex. 4.9', tags:['mechanics','energy'], text:'A 2 kg block starts from rest and slides 1.5 m down a frictionless 30° incline. Find its speed at the bottom.',
     hints:['What is conserved as the block slides, given there is no friction?','Conservation of mechanical energy: potential energy lost equals kinetic energy gained.','Sketch the incline and mark the vertical drop h = s sin θ.','m g h = ½ m v²','h = 1.5 × sin 30° = 0.75 m, so v² = 2 × 9.81 × 0.75.'],
     solution:'m g s sin θ = ½ m v²\nv = √(2 g s sin θ) = √(2 × 9.81 × 1.5 × 0.5)\nv ≈ 3.84 m/s\nCheck: the mass cancels, and θ → 0 gives v → 0'},
    {id:'p3', book:'b7', ch:2, loc:'§3.7, Ex. 3.31', tags:['calculus','optimisation'], text:'Find the maximum value of f(x) = x e^(−x) for x ≥ 0.',
     hints:['Where can a smooth function on x ≥ 0 reach its maximum?','Stationary points: solve f′(x) = 0, then check the endpoints.','Sketch the curve: it starts at 0, rises, then decays towards 0.','Product rule: f′(x) = e^(−x) − x e^(−x).','f′(x) = e^(−x)(1 − x), which is zero only at x = 1.'],
     solution:'f′(x) = e^(−x)(1 − x) = 0 gives x = 1\nf″(1) = −1/e < 0, so it is a maximum\nf(1) = 1/e ≈ 0.368\nCheck: f(0) = 0, and f → 0 as x → ∞'}
  ],
  pAttempts:[
    {id:'pa0', problem:'p1', mode:'learn', hints:4, solution:false, working:'Req = 6 + 3 = 9 Ω\nTotal = 13 Ω, I = 12/13 = 0.92 A\nV₂ = 0.92 × 6 = 5.5 V', secs:[], calcs:[{in:'12/13', out:0.9230769231}], checks:{units:'passed'}, fix:'R₂ and R₃ share the same two nodes, so they are in parallel: Req = 2 Ω, not 9 Ω.', errors:['Conceptual'], when:'3 days ago'},
    {id:'pa1', problem:'p3', mode:'practice', hints:0, solution:false, blocks:[{type:'text', color:'blue', text:'f′(x) = e^(−x) − x e^(−x) = e^(−x)(1 − x)\nf′(x) = 0 only at x = 1'}, {type:'graph', color:'blue', expr:'x*exp(-x), exp(-x)*(1-x)', xmin:'0', xmax:'6'}, {type:'text', color:'green', text:'The curve rises to x = 1, then decays. Maximum f(1) = 1/e ≈ 0.368. The derivative crosses zero there.'}], secs:[], calcs:[{in:'1/e', out:0.3678794412}], checks:{limit:'passed', sign:'passed'}, fix:'', errors:[], when:'Yesterday'}
  ],
  inbox:[
    {id:'i1', type:'book', kind:'Book page screenshot', from:'From Kindle, one screenshot'},
    {id:'i3', type:'multi', kind:'Book page screenshots', from:'From VitalSource Bookshelf, 3 screenshots', shots:[1,2,3]},
    {id:'i2', type:'hand', kind:'Handwritten page', from:'From GoodNotes, PDF page 1'}
  ],
  attempts:[], corrections:[],
  items:[
    {id:'r1', book:'b1', notes:['n2'], ability:'Recall', task:'State what a residual is and what least squares minimises.', mins:2, done:false},
    {id:'r2', book:'b1', notes:['n1'], ability:'Explain', task:'Explain why constant error variance matters for a regression line. Use your own words.', mins:3, done:false},
    {id:'r3', book:'b2', notes:['n4'], ability:'Critique', task:'Reconstruct the argument for why institutions decline, then give one alternative explanation.', mins:4, done:false}
  ],
  events:[], hist:{Recall:[7,9], Explain:[3,4], Apply:[2,5], Transfer:[0,1], Critique:[1,2]},
  concepts:[
    {id:'c1', purpose:'Describes how an outcome changes with its inputs, so you can predict it and read off each input’s effect.', boundaries:'Needs effects that add up and stay roughly constant. A curved or threshold relationship does not qualify without transforming it.', rels:[{to:'c2', rel:'looks similar but differs from', why:'A fitted slope describes association. A causal claim needs more than the model can supply.'}], name:'Linear model', mine:'A linear model says the outcome is a weighted sum of inputs plus noise. It is useful when effects add up and stay roughly constant across the range.', links:[{n:'n1', rel:'Defines'},{n:'n2', rel:'Supports'}], clash:null},
    {id:'c2', question:'When does a fitted relationship show cause?', cmp:{b1:{claim:'A slope is association only.', evidence:'The algebra of least squares says nothing about direction.', differs:'Refuses causal language without a design.'}, b2:{claim:'Low-cost blocking by insiders causes decline.', evidence:'Three historical cases.', differs:'Infers cause from cases chosen after the outcome.'}}, name:'Causation', mine:'A cause changes the outcome when everything else is held fixed. Regression alone shows association.', links:[{n:'n4', rel:'Uses a causal claim'},{n:'n1', rel:'Disagrees'}], clash:'Why Institutions Fail treats its three cases as showing cause. Applied Linear Regression warns that a fitted slope is association only.'},
    {id:'c3', name:'Uncertainty', mine:'', links:[{n:'n3', rel:'Open question'}], clash:null},
    {id:'c4', name:'Series and parallel resistors', mine:'Parallel elements share a voltage; series elements share a current. Combining them reduces a network to one equivalent resistance.', links:[{n:'n6', rel:'Defines'}], problems:['p1'], clash:null}
  ]
});
const REAL = !!window.__KL_REAL; if(REAL) document.documentElement.classList.add('real');
function emptySeed(){ const s = seed(); Object.keys(s).forEach(k => { if(Array.isArray(s[k]) && k !== 'cOpen') s[k] = []; }); Object.assign(s, {curBook:null, selBook:null, selProblem:null, selConcept:null, drafts:{}, lastLoc:'', trash:[]}); return s; }
const hot0 = window.claude && window.claude.hot && window.claude.hot.data, saved0 = REAL && window.__KL_STATE;
let S = REAL ? (saved0 && saved0.v === 10 ? Object.assign(emptySeed(), saved0, {sheet:false, inkFs:null, graphFs:null, offline:false, unsynced:0, imp:null}) : emptySeed()) : hot0 && hot0.v === 10 ? Object.assign(seed(), hot0) : seed();
let klT = 0, klBusy = false, klAgain = false;
function klSaveNow(){ if(!REAL || !window.__KL_SAVE) return; if(klBusy){ klAgain = true; return; } klBusy = true; let snap; try{ snap = JSON.parse(JSON.stringify(S)); }catch(e){ klBusy = false; return; }
  window.__KL_SAVE(snap).then(() => { S.unsynced = 0; S.saveErr = false; }, () => { S.saveErr = true; }).then(() => { klBusy = false; if($('sync')) top(); if(klAgain){ klAgain = false; klSoon(); } }); }
function klSoon(){ if(!REAL) return; clearTimeout(klT); klT = setTimeout(klSaveNow, 700); }
if(REAL){ ['input','change','click','pointerup','keyup'].forEach(ev => document.addEventListener(ev, () => { S.unsynced = 1; klSoon(); }, true)); document.addEventListener('visibilitychange', () => { if(document.hidden){ clearTimeout(klT); klSaveNow(); } }); window.addEventListener('pagehide', () => { clearTimeout(klT); klSaveNow(); }); }
function klExport(){ const blob = new Blob([JSON.stringify({app:'knowledge-lab', exported:new Date().toISOString(), state:S})], {type:'application/json'}), a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'knowledge-lab-backup-' + new Date().toISOString().slice(0, 10) + '.json'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000); toast('Backup file saved to your downloads.'); }
function klImport(file){ const r = new FileReader(); r.onload = () => { try{ const d = JSON.parse(r.result), st = d && d.app === 'knowledge-lab' ? d.state : null; if(!st || st.v !== 10 || !Array.isArray(st.books)) throw 0; S = Object.assign(emptySeed(), st, {sheet:false, inkFs:null, graphFs:null, offline:false, unsynced:1, view:'cover'}); applyTheme(); sheet(); render(); klSaveNow(); toast('Backup restored: ' + plural(S.books.length, 'book') + ', ' + plural(S.notes.length, 'note') + ', ' + plural(S.problems.length, 'problem') + '.'); }catch(e){ toast('That file is not a Knowledge Lab backup.'); } }; r.readAsText(file); }
document.addEventListener('change', e => { const t = e.target; if(t.dataset && t.dataset.klimport !== undefined && t.files && t.files[0]){ klImport(t.files[0]); t.value = ''; } if(t.dataset && t.dataset.klset){ S[t.dataset.klset] = t.value.trim(); if(typeof aiSetup === 'function') aiSetup(); } });
const prob = id => S.problems.find(p => p.id === id);
const psrc = p => { const b = p && p.book && S.books.find(x => x.id === p.book); return b ? b.title : 'No book'; };
const book = id => S.books.find(b => b.id === id);
const note = id => S.notes.find(n => n.id === id);
let syncT = null, toastT = null;

/* Page style and colours: a per-viewer preference, kept in this browser when it allows */
const hostTheme = document.documentElement.getAttribute('data-theme');
try{ const p = JSON.parse(localStorage.getItem('rl-page') || '{}'); if(p.style) S.style = p.style; if(p.theme) S.theme = p.theme; if(p.pal && PALS[p.pal]) S.pal = p.pal; if(p.aiAuto === false) S.aiAuto = false; if(p.wfont) S.wfont = p.wfont; if(p.wsize) S.wsize = p.wsize; }catch(e){}
S.style = S.style || 'lined'; S.theme = S.theme || 'system'; S.pal = PALS[S.pal] ? S.pal : 'garden';
function applyTheme(){
  const r = document.documentElement; const P = PALS[S.pal] || PALS.garden; r.dataset.wfont = S.wfont || ''; r.dataset.wsize = S.wsize || ''; r.style.setProperty('--tint', P[1]); r.style.setProperty('--cover-bg', P[3] ? P[3].cover : 'color-mix(in srgb, var(--tint) 58%, var(--cover-base))'); r.style.setProperty('--foil', P[3] ? P[3].foil : 'var(--cover-ink)'); ['today','books','problems','concepts','progress'].forEach((k, i) => r.style.setProperty('--c-' + k, P[2][i]));
  if(S.theme === 'system'){ if(hostTheme) r.setAttribute('data-theme', hostTheme); else r.removeAttribute('data-theme'); }
  else r.setAttribute('data-theme', S.theme);
}
function refreshInk(){ setTimeout(() => { if(typeof initInk === 'function') initInk(); }, 60); }
function savePrefs(){ refreshInk(); try{ localStorage.setItem('rl-page', JSON.stringify({style:S.style, theme:S.theme, pal:S.pal, wfont:S.wfont || '', wsize:S.wsize || '', aiAuto:S.aiAuto !== false})); }catch(e){} }
applyTheme();

function changed(n){
  if(REAL){ S.unsynced = 1; top(); klSoon(); return; }
  S.unsynced += n || 1; clearTimeout(syncT);
  if(!S.offline) syncT = setTimeout(() => { S.unsynced = 0; top(); }, 1800);
  top();
}
function toast(msg){
  clearTimeout(toastT); const o = $('overlay'); const old = o.querySelector('.toast'); if(old) old.remove();
  const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role','status'); t.textContent = msg; o.appendChild(t);
  toastT = setTimeout(() => t.remove(), 2600);
}
function top(){
  const b = $('sync'); const n = S.unsynced;
  if(REAL){ b.className = 'sync' + (S.saveErr ? ' off' : n ? ' pending' : ''); b.innerHTML = '<span class="dot"></span>' + (S.saveErr ? 'Not saved' : n ? 'Saving…' : 'Saved'); b.title = 'Everything is stored on this device.'; return; }
  b.className = 'sync' + (S.offline ? ' off' : n ? ' pending' : '');
  b.innerHTML = '<span class="dot"></span>' + (S.offline ? 'Offline' + (n ? ', ' + n + ' saved here' : '') : n ? 'Saving ' + n : 'Synced');
  b.title = S.offline ? 'Tap to go back online (simulated)' : 'Tap to try the app offline (simulated)';
}
const areaOf = v => ['books','book','chapter','analysis','session','notes','concepts'].includes(v) ? 'books' : ['problems','work','inbox','errors'].includes(v) ? 'problems' : 'shared';
const areaTabs = a => a === 'shared' ? [['today','Today','today'],['progress','Progress','progress']] : SUBS[a][1].map(x => [x[0], x[1], a]);
function nav(){
  const a = areaOf(S.view), nIn = S.inbox.filter(x => !x.filed).length;
  const cur = v => S.view === v || (v === 'books' && ['book','chapter','analysis'].includes(S.view)) || (v === 'today' && S.view === 'review');
  $('nav').innerHTML = '<button class="home" style="--tc:var(--tint)" data-act="go" data-v="cover"><span aria-hidden="true">‹ </span>Home</button>' + areaTabs(a).map(t => '<button style="--tc:var(--c-' + t[2] + ')" data-act="go" data-v="' + t[0] + '"' + (cur(t[0]) ? ' aria-current="page"' : '') + '>' + t[1] + (t[0] === 'inbox' && nIn ? ' <span class="n">' + nIn + '</span>' : t[0] === 'work' && S.pw ? ' <span class="n">•</span>' : '') + '</button>').join('');
  $('area').textContent = a === 'shared' ? '' : SUBS[a][0];
}
const head = (title, sub) => '<header class="mg head"><div class="ref"></div><div class="stack" style="gap:2px"><span class="date">' + esc(DATE) + '</span><h1>' + title + '</h1>' + (sub ? '<p class="soft">' + sub + '</p>' : '') + '</div></header>';
const opts = (act, attr, list, cur, col) => '<div class="opts' + (col ? ' col' : '') + '">' + list.map(x => '<button type="button" class="opt" data-act="' + act + '" data-' + attr + '="' + esc(x[0]) + '" aria-pressed="' + (cur === x[0]) + '">' + esc(x[1]) + '</button>').join('') + '</div>';
const ref = n => {
  const p = n.loc.split(', '), pg = p.length > 1 ? p.pop() : '';
  if(S.style === 'cornell') return '<span class="cue' + (n.cue ? '' : ' none') + '">' + (n.cue ? esc(n.cue) : 'No cue yet') + '</span><span class="small">' + (pg ? '<b>' + esc(pg) + '</b> · ' : '') + esc(p.join(', ')) + '</span>';
  return (pg ? '<b>' + esc(pg) + '</b>' : '') + esc(p.join(', '));
};
const noteLine = (n, o) => {
  o = o || {}; const label = o.label || n.type;
  if(o.covered) return '<div class="mg"><div class="ref">' + ref(n) + '</div><div><div class="covered">Covered</div></div></div>';
  return '<div class="mg"><div class="ref">' + ref(n) + '</div><div class="stack" style="gap:3px">' +
    ((label || o.showBook) ? '<span class="kind">' + esc([o.showBook ? book(n.book).title : '', label].filter(Boolean).join(' · ')) + '</span>' : '') +
    '<p class="' + (n.origin === 'Quotation' ? 'quote' : '') + '"' + ' style="' + (n.color ? 'color:var(--pen-' + n.color + ');' : '') + fmtCss(n) + '">' + esc(n.text) + '</p>' +
    (n.eq ? '<div class="eq">' + esc(n.eq) + '</div>' : '') + (n.extra ? '<p class="small">' + esc(n.extra) + '</p>' : '') + (S.flow ? '' : '<button class="btn link mini" data-act="noteedit" data-id="' + n.id + '" style="align-self:flex-start" aria-label="Edit this note">Edit</button>') + '</div></div>';
};
const lines = (ns, o) => '<div class="lines">' + ns.map((n,i) => noteLine(n, Object.assign({}, o, {label: o && o.labels ? o.labels[i] : null}))).join('') + '</div>';
const section = (title, inner) => '<section class="stack">' + (title ? '<h3>' + title + '</h3>' : '') + inner + '</section>';
const due = () => S.items.filter(i => !i.done);

function vToday(){
  const b = book(S.curBook), d = due(), mins = d.reduce((a,i) => a + i.mins, 0), qs = S.notes.filter(n => n.type === 'Open question'), tp = prob(S.selProblem) || S.problems[0];
  return '<div class="stack loose">' + head((h => h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening')(new Date().getHours()), (REAL ? 'Today' : 'Today · example data')) +
  section('Continue reading', '<div><h2>' + esc(b.title) + '</h2><p class="small">Stopped at ' + esc(b.pos) + '. ' + esc(b.purpose) + '.</p></div><div class="row"><button class="btn primary" data-act="go" data-v="session">Open session</button></div>') +
  (!S.pw && !(prob(S.selProblem) || S.problems[0]) ? section('Continue a problem', '<p class="soft">No problems yet. Add one in the Problem Lab.</p>') : section('Continue a problem', (S.pw ? '<div><h2>' + esc(prob(S.pw.problem).loc) + '</h2><p class="small">Attempt in progress.</p></div>' : '<div><h2>' + esc(tp.loc) + '</h2><p class="small">' + esc(psrc(tp)) + '. Last attempt: ' + esc(helpText(lastAttempt(tp.id)).toLowerCase()) + '.</p></div>') + (S.pw ? '<div class="row"><button class="btn primary" data-act="go" data-v="work">Resume attempt</button></div>' : '<div class="row"><button class="btn primary" data-act="problem" data-id="' + tp.id + '">Open problem</button></div>') + (S.inbox.filter(x => !x.filed).length ? '<p class="small">' + S.inbox.filter(x => !x.filed).length + ' imported pages are waiting in the Problem Lab inbox.</p>' : ''))) +
  section('Review', d.length ? '<p><span class="big">' + d.length + '</span> ' + (d.length === 1 ? 'task' : 'tasks') + ' ready, about ' + mins + ' of your 15 minutes.</p><div class="row"><button class="btn" data-act="go" data-v="review">Start review</button></div>' : '<p>Nothing due. Skipped days do not build a backlog.</p>') +
  section('What you still understand', '<p>You explained 3 of 4 regression ideas without hints this month.</p>' + (S.events.length || S.attempts.length ? '<p class="small">This visit: ' + S.attempts.length + ' recall ' + (S.attempts.length === 1 ? 'attempt' : 'attempts') + ', ' + S.events.length + ' review ' + (S.events.length === 1 ? 'answer' : 'answers') + '.</p>' : '')) +
  section('Open questions', lines(qs, {showBook:true})) +
  section('Recent notes', lines(S.notes.slice(-3).reverse(), {showBook:true})) + '</div>';
}
const noteCh = n => { if(n.ch != null) return n.ch; const m = /Ch\. (\d+)/.exec(n.loc || ''); return m ? +m[1] - 1 : -1; };
const chNotes = (b, i) => S.notes.filter(n => n.book === b.id && noteCh(n) === i);
const bookConcepts = (b, i) => S.concepts.filter(c => c.links.some(l => { const n = note(l.n); return n && n.book === b.id && (i == null || noteCh(n) === i); }));
const plural = (n, w) => n + ' ' + w + (n === 1 ? '' : 's');
const bookLine = b => esc([b.author, b.edition ? b.edition + ' edition' : '', b.year].filter(Boolean).join(' · '));
const defLoc = () => { const b = book(S.curBook), ch = S.capCh != null ? S.capCh : b.ch, last = S.notes.filter(n => n.book === b.id && (ch == null || noteCh(n) === ch)).slice(-1)[0]; return last ? last.loc : ch != null ? 'Ch. ' + (ch + 1) : ''; };
const fmtN = n => n.toLocaleString();
const ord = n => n + (n % 10 === 1 && n % 100 !== 11 ? 'st' : n % 10 === 2 && n % 100 !== 12 ? 'nd' : n % 10 === 3 && n % 100 !== 13 ? 'rd' : 'th');
function libList(){
  const q = (S.drafts.libq || '').toLowerCase().trim(), fl = S.libFilter || 'All', nc = {};
  S.notes.forEach(n => { nc[n.book] = (nc[n.book] || 0) + 1; });
  let xs = S.books.filter(b => (fl === 'All' || b.status === fl) && (!q || (b.title + ' ' + (b.author || '')).toLowerCase().includes(q)));
  const keys = {title:b => b.title.toLowerCase(), author:b => (b.author || '').toLowerCase(), year:b => +b.year || 0, status:b => STATUSES.indexOf(b.status), notes:b => nc[b.id] || 0}, key = keys[S.libSort];
  if(key) xs = xs.map(b => [key(b), b]).sort((p, r) => (p[0] < r[0] ? -1 : p[0] > r[0] ? 1 : 0) * S.libDir).map(p => p[1]);
  return {xs:xs, nc:nc};
}
function libRows(){
  const L = libList(), xs = L.xs, nc = L.nc, cols = ['books','today','concepts','progress','problems'], shown = xs.slice(0, S.libLimit);
  if(!xs.length) return '<p class="soft">No book matches.</p>';
  const pct = b => { const chs = b.chapters || []; return b.status === 'Completed' ? 100 : chs.length && b.ch != null ? Math.round(100 * (b.ch + 1) / chs.length) : 0; };
  const hb = (k, label) => '<button data-act="libsort" data-k="' + k + '" aria-pressed="' + (S.libSort === k) + '">' + label + (S.libSort === k ? (S.libDir > 0 ? ' ↑' : ' ↓') : '') + '</button>';
  const idx = {}; S.books.forEach((b, i) => { idx[b.id] = i; });
  const rows = S.libView === 'detailed' ? '<div class="shelf">' + shown.map(b => { const chs = b.chapters || [], ns = S.sessions.filter(x => x.book === b.id).length;
      return '<button class="bookrow" style="--tc:var(--c-' + cols[idx[b.id] % 5] + ')" data-act="book" data-id="' + b.id + '"><span><span class="bt">' + esc(b.title) + '</span><span class="small">' + bookLine(b) + '</span>' + (b.purpose ? '<span class="small">' + esc(b.purpose) + '</span>' : '') + '</span><span class="side">' + (b.status ? '<span class="tagchip">' + esc(b.status) + '</span>' : '') + '<span class="small">' + (chs.length ? (b.ch != null ? 'Chapter ' + (b.ch + 1) + ' of ' + chs.length : plural(chs.length, 'chapter')) : 'No chapters entered') + '</span>' + (chs.length ? '<span class="prog"><i style="width:' + pct(b) + '%"></i></span>' : '') + '<span class="small">' + plural(nc[b.id] || 0, 'note') + ' · ' + plural(ns, 'session') + '</span></span></button>'; }).join('') + '</div>'
    : '<div class="btable"><div class="brow bhead"><span class="bt2">' + hb('title','Title') + hb('author','Author') + '</span><span class="yr">' + hb('year','Year') + '</span><span class="st">' + hb('status','Status') + '</span><span class="pg2"></span><span class="nn">' + hb('notes','Notes') + '</span></div>' +
      shown.map(b => '<button class="brow" style="--tc:var(--c-' + cols[idx[b.id] % 5] + ')" data-act="book" data-id="' + b.id + '"><span class="bt2"><b>' + esc(b.title) + '</b>' + (b.author ? ' <span class="au">' + esc(b.author) + '</span>' : '') + '</span><span class="yr">' + esc(b.year || '') + '</span><span class="st">' + esc(b.status) + '</span><span class="pg2">' + ((b.chapters || []).length && (b.ch != null || b.status === 'Completed') ? '<span class="prog"><i style="width:' + pct(b) + '%"></i></span>' : '') + '</span><span class="nn">' + (nc[b.id] || '') + '</span></button>').join('') + '</div>';
  return '<p class="small">Showing ' + fmtN(shown.length) + ' of ' + fmtN(xs.length) + (xs.length < S.books.length ? ' matching, from ' + fmtN(S.books.length) + ' books' : ' books') + '.</p>' + rows + (xs.length > shown.length ? '<div class="row"><button class="btn" data-act="libmore">Show ' + Math.min(100, xs.length - shown.length) + ' more</button><button class="btn link" data-act="libmore" data-all="1">Show all ' + fmtN(xs.length) + '</button></div>' : '');
}
function vBooks(){
  const st = ['All'].concat(STATUSES), nSample = S.books.filter(b => b.sample).length;
  return '<div class="stack" style="gap:16px">' + head('Library', fmtN(S.books.length) + (S.books.length === 1 ? ' book' : ' books') + '. Open one for its chapters, sessions and notes.') +
    '<div class="libbar"><button class="btn primary" data-act="bookform">+ Add a book</button><button class="btn" data-act="impform">Import a list</button>' + trashLink() + '<label class="f" for="libq">Search titles and authors<input type="text" id="libq" data-draft="libq" value="' + esc(S.drafts.libq || '') + '"></label></div>' +
    '<div class="libtools">' + opts('libfilter','v',st.map(x => [x,x]), S.libFilter || 'All') + opts('libview','v',[['compact','Compact rows'],['detailed','Detailed rows']], S.libView) + '</div>' +
    '<div id="liblist" class="stack" style="gap:8px">' + libRows() + '</div>' +
    '<p class="small">' + (nSample ? fmtN(nSample) + ' sample titles are loaded. <button class="btn link mini" data-act="libsample" data-off="1">Remove the samples</button>' : 'Want to see the shelf at full size? <button class="btn link mini" data-act="libsample">Load 1,200 sample titles</button>') + '</p></div>';
}
function sampleBooks(){
  const forms = ['Introduction to','Principles of','Foundations of','A Course in','Elements of','Advanced','Applied','Essentials of'], subj = ['Linear Algebra','Real Analysis','Probability','Statistics','Thermodynamics','Fluid Mechanics','Circuit Analysis','Signals and Systems','Control Theory','Numerical Methods','Optimization','Differential Equations','Classical Mechanics','Electromagnetism','Quantum Mechanics','Materials Science','Structural Analysis','Heat Transfer','Microeconomics','Macroeconomics','Corporate Finance','Econometrics','Game Theory','Algorithms','Operating Systems','Machine Learning','Systems Engineering','Decision Analysis','Information Theory','Stochastic Processes'], tails = ['',': Theory and Practice',': A First Course',': Problems and Solutions',': Methods and Models'], sts = ['','','','Completed','','','Reading','Completed','',''];
  const out = []; let i = 0;
  tails.forEach(t => forms.forEach(fm => subj.forEach(sb => { const n = 8 + (i * 7) % 7, status = sts[(i * 3 + (i >> 3)) % 10], chapters = []; for(let j = 0; j < n; j++) chapters.push((j + 1) + ' Chapter ' + (j + 1));
    out.push({id:'s' + i, sample:true, title:fm + ' ' + sb + t, author:'Sample author ' + (1 + (i * 13) % 97), edition:ord(1 + i % 6), year:String(1985 + (i * 11) % 41), chapters:chapters, ch:status === 'Reading' ? (i * 5) % n : status === 'Completed' ? n - 1 : null, status:status, pos:'', purpose:'', depth:i % 9 === 4 ? 'Reference' : 'Overview', output:'', reviews:i % 9 !== 4}); i++; })));
  return out;
}
function logSession(b){ const last = S.sessions[S.sessions.length - 1]; if(!(last && last.book === b.id && last.ch === b.ch && last.when === 'Today')) S.sessions.push({book:b.id, ch:b.ch, when:'Today'}); }
function saveImport(){
  const rows = (S.drafts.imp_text || '').split('\n').map(x => x.trim()).filter(Boolean); if(!rows.length){ toast('Paste at least one line.'); return; }
  let n = 0; rows.forEach((r, i) => { const p = (r.indexOf('\t') >= 0 ? r.split('\t') : r.indexOf(';') >= 0 ? r.split(';') : r.indexOf('|') >= 0 ? r.split('|') : [r]).map(x => x.trim()); if(!p[0]) return; S.books.push({id:'b' + Date.now() + '_' + i, title:p[0], author:p[1] || '', edition:p[2] || '', year:p[3] || '', chapters:[], status:S.drafts.imp_status || '', pos:'', purpose:'', depth:'Overview', output:'', reviews:true}); n++; });
  S.sheet = false; sheet(); changed(n); S.libSort = 'added'; go('books'); toast(plural(n, 'book') + ' added to the shelf.');
}
function vBook(){
  const b = book(S.selBook), chs = b.chapters || [], cs = bookConcepts(b), loose = S.notes.filter(n => n.book === b.id && (noteCh(n) < 0 || noteCh(n) >= chs.length));
  return '<div class="stack loose"><div class="crumbs"><button data-act="go" data-v="books">Library</button><span>›</span><span>' + esc(b.title) + '</span></div>' + head(esc(b.title), bookLine(b)) +
    '<div class="row"><button class="btn primary" data-act="opensession" data-id="' + b.id + '">Open study session</button><button class="btn link" data-act="bookform" data-id="' + b.id + '">Edit details</button></div>' +
    section('About this book', '<div class="facts"><span class="k">Status</span><span>' + esc(b.status || 'Not started') + (b.pos ? ', at ' + esc(b.pos) : '') + '</span><span class="k">Depth</span><span>' + esc(b.depth) + (b.reviews ? '' : ' (reviews off)') + '</span><span class="k">Purpose</span><span>' + (b.purpose ? esc(b.purpose) : '<span class="soft">Not written yet</span>') + '</span>' + (b.output ? '<span class="k">Output</span><span>' + esc(b.output) + '</span>' : '') + '</div>') +
    section('Chapters (' + chs.length + ')', chs.length ? '<div class="lines">' + chs.map((c, i) => '<button class="chrow" data-act="chapter" data-i="' + i + '"><span class="t">' + esc(c) + '</span>' + (b.ch === i ? '<span class="cur">current</span>' : '') + '<span class="small">' + plural(chNotes(b, i).length, 'note') + ' · ' + plural(bookConcepts(b, i).length, 'concept') + '</span></button>').join('') + '</div><p class="small">Open a chapter for its notes and concepts.</p>' : '<p class="soft">No chapters entered. Add them under Edit details.</p>') +
    section('Analytical reading', '<div class="stages">' + AR_STAGES.map((g, k) => '<span class="stagebtn' + (arDone(b, g[0]) ? ' done' : '') + '"><span class="num">' + (arDone(b, g[0]) ? '✓' : k + 1) + '</span>' + g[1] + '</span>').join('') + '</div><div class="row"><button class="btn" data-act="analysis">' + (AR_STAGES.some(g => arDone(b, g[0])) ? 'Continue the analysis' : 'Start the analysis') + '</button></div>') +
    (() => { const ss = S.sessions.filter(x => x.book === b.id).slice().reverse(); return section('Sessions (' + ss.length + ')', ss.length ? '<div class="lines">' + ss.slice(0, 8).map(x => '<div class="mg"><div class="ref"><b>' + esc(x.when) + '</b></div><div><p class="stmt" style="font-size:16px">' + esc(chs.length && x.ch != null && chs[x.ch] ? chs[x.ch] : 'Whole book') + '</p></div></div>').join('') + '</div>' : '<p class="soft">No sessions yet. Open a study session to start one.</p>'); })() +
    section('Concepts in this book (' + cs.length + ')', cs.length ? '<div class="lines">' + cs.map(conceptRow).join('') + '</div>' : '<p class="soft">None yet. Link a note to a concept to see it here.</p>') +
    (() => { const ps = S.problems.filter(x => x.book === b.id); return ps.length ? section('Problems from this book (' + ps.length + ')', '<div class="lines">' + ps.map(x => { const A = S.pAttempts.filter(a => a.problem === x.id); return '<button class="chrow" data-act="problem" data-id="' + x.id + '"><span class="t">' + esc(x.loc) + '</span><span class="small">' + plural(A.length, 'attempt') + '</span></button>'; }).join('') + '</div><p class="small">These open in the Problem Lab.</p>') : ''; })() +
    (loose.length ? section((chs.length ? 'Notes not filed under a chapter' : 'Notes') + ' (' + loose.length + ')', lines(loose)) : '') + '</div>';
}
const conceptRow = c => '<button class="chrow" data-act="concept" data-id="' + c.id + '"><span class="t">' + esc(c.name) + '</span>' + (c.clash ? '<span class="cur">authors disagree</span>' : '') + '<span class="small">' + plural(c.links.length, 'linked note') + '</span></button>';
function vChapter(){
  const b = book(S.selBook), chs = b.chapters || [], i = Math.min(S.selCh, chs.length - 1), ns = chNotes(b, i), cs = bookConcepts(b, i), tasks = S.items.filter(t => !t.done && !t.kind && t.book === b.id && t.notes.some(id => noteCh(note(id)) === i));
  return '<div class="stack loose"><div class="crumbs"><button data-act="go" data-v="books">Library</button><span>›</span><button data-act="go" data-v="book">' + esc(b.title) + '</button><span>›</span><span>Chapter ' + (i + 1) + '</span></div>' + head(esc(chs[i]), esc(b.title) + (b.ch === i ? ' · current chapter' : '')) +
    '<div class="row"><button class="btn primary" data-act="studych">Study this chapter</button>' + (b.ch === i ? '' : '<button class="btn" data-act="setch" data-i="' + i + '">Mark as current</button>') + (i > 0 ? '<button class="btn link" data-act="chapter" data-i="' + (i - 1) + '">‹ Previous</button>' : '') + (i < chs.length - 1 ? '<button class="btn link" data-act="chapter" data-i="' + (i + 1) + '">Next ›</button>' : '') + '</div>' +
    section('Notes (' + ns.length + ')', ns.length ? lines(ns) : '<p class="soft">No notes for this chapter yet. Use + Note, or study the chapter.</p>') +
    section('Concepts (' + cs.length + ')', cs.length ? '<div class="lines">' + cs.map(conceptRow).join('') + '</div>' : '<p class="soft">No concepts linked to this chapter yet.</p>') +
    (() => { const ss = S.studies.filter(x => x.book === b.id && x.ch === i); return section('Study passes (' + ss.length + ')', ss.length ? '<div class="lines">' + ss.map(x => '<div class="mg"><div class="ref"><b>' + esc(x.when) + '</b></div><div class="stack" style="gap:4px"><span class="kind">' + esc(x.q || 'No question set') + '</span><p style="white-space:pre-wrap">' + esc(x.recon) + '</p>' + (x.fix ? '<div class="fix"><p>' + esc(x.fix) + '</p></div>' : '') + '</div></div>').join('') + '</div>' : '<p class="soft">None yet. Study this chapter to record one.</p>'); })() +
    section('Review tasks (' + tasks.length + ')', tasks.length ? '<div class="lines">' + tasks.map(t => '<div class="mg"><div class="ref"><b>' + esc(t.ability) + '</b></div><div><p class="stmt" style="font-size:16px">' + esc(t.task) + '</p></div></div>').join('') + '</div>' : '<p class="soft">Nothing scheduled from this chapter.</p>') + '</div>';
}
const AR_KINDS = [['Argument or explanation','What is claimed? What supports it? What other explanation fits?'],['Mathematical theory','What is defined? What is assumed? Why does each step follow? What happens if an assumption is removed?'],['Scientific or engineering model','What system is represented? What is left out? Under what conditions is the model useful?'],['Procedure or method','What triggers its use? Why these steps? How do you choose it over the alternatives?']];
const AR_STAGES = [['inspect','Inspect','Is this book worth a careful read, and what kind of book is it?'],['outline','Outline','What is the book about as a whole?'],['interpret','Interpret','What is being said in detail, and how?'],['criticize','Criticize','Is it true, in whole or in part?'],['sowhat','What of it','Why does it matter, and what follows from it?']];
const AR_SKIM = [['title','Title page and preface'],['toc','Table of contents'],['index','Index: the terms with the most entries'],['blurb','The publisher’s description'],['pivot','The chapters that look pivotal, and their summaries'],['dip','A few paragraphs here and there, and the closing pages']];
const AR_GROUNDS = [['uninformed','Uninformed','What relevant knowledge does the author lack?'],['misinformed','Misinformed','What does the author assert that is not so?'],['illogical','Illogical','Where does the reasoning fail to follow?'],['incomplete','Incomplete','Which problems are left unsolved, or only partly solved?']];
const arDone = (b, k) => { const a = b.ar || {}, f = x => !!(a[x] || '').trim(); return k === 'inspect' ? !!a.decision : k === 'outline' ? f('unity') : k === 'interpret' ? f('terms') || f('props') : k === 'criticize' ? !!a.verdict : f('situation') || f('sowhat'); };
function vAnalysis(){
  const b = book(S.selBook), a = b.ar || {}, chs = b.chapters || [], si = Math.max(0, AR_STAGES.findIndex(g => g[0] === S.arStage)), st = AR_STAGES[si];
  const area = (k, label, ph, tall) => '<label class="f" for="ar_' + k + '">' + label + '<textarea class="short" id="ar_' + k + '" data-ar="' + k + '"' + (tall ? ' style="min-height:128px"' : '') + (ph ? ' placeholder="' + esc(ph) + '"' : '') + '>' + esc(a[k] || '') + '</textarea></label>';
  const line = (k, label, ph) => '<label class="f" for="ar_' + k + '">' + label + '<input type="text" id="ar_' + k + '" data-ar="' + k + '" value="' + esc(a[k] || '') + '"' + (ph ? ' placeholder="' + esc(ph) + '"' : '') + '></label>';
  const pick = (fld, list) => '<div class="opts">' + list.map(v => '<button type="button" class="opt" data-act="arset" data-f="' + fld + '" data-v="' + esc(v) + '" aria-pressed="' + (a[fld] === v) + '">' + esc(v) + '</button>').join('') + '</div>';
  const km = AR_KINDS.find(x => x[0] === a.material), kindHint = km ? '<p class="small">For ' + km[0].toLowerCase() + ', ask: ' + esc(km[1]) + '</p>' : '';
  let body = '';
  if(st[0] === 'inspect') body = section('Skim it first', '<p class="small">Give the book a quick, systematic look before committing. Tick what you examined.</p><div class="opts col">' + AR_SKIM.map(c => '<button type="button" class="opt' + ((a.checks || {})[c[0]] ? ' passed' : '') + '" data-act="archeck" data-k="' + c[0] + '" aria-pressed="' + !!(a.checks || {})[c[0]] + '">' + esc(c[1]) + '</button>').join('') + '</div>') +
    section('What kind of book is it?', pick('kindtype', ['Theoretical','Practical']) + '<p class="small">Theoretical books teach that something is the case. Practical books teach how to do something.</p>' + line('subject', 'Subject', 'Statistics: regression modelling') + area('gist', 'First impression: what is it about, in a sentence?')) +
    section('What kind of material is it?', pick('material', AR_KINDS.map(x => x[0])) + (kindHint || '<p class="small">This sets the questions the later stages ask.</p>')) + section('Decide how to read it', pick('decision', ['Read analytically','Skim only','Set aside']));
  if(st[0] === 'outline') body = section('State the whole', area('unity', 'The whole book in a sentence or two', 'Its single main point, as briefly as you can put it.')) +
    section('Set out its parts', chs.length ? '<div class="stack" style="gap:10px">' + chs.map((c, i) => '<div class="partrow"><span>' + esc(c) + '</span>' + line('part_' + i, 'What this part contributes') + '</div>').join('') + '</div>' : area('parts', 'The major parts, in order, and how they fit together', '', true) + '<p class="small">Add chapters under Edit details to outline them one by one.</p>') +
    section('Define the problems', area('problems', 'The questions the author is trying to answer, one per line', '', true));
  if(st[0] === 'interpret') body = kindHint + section('Come to terms', area('terms', 'Key words and what the author means by them, one per line', 'residual: observed outcome minus fitted outcome', true)) +
    section('Find the propositions', area('props', 'The author’s leading claims, in your own words, one per line', '', true)) +
    section('Trace the arguments', area('args', 'How the claims are supported: because …, therefore …', '', true)) +
    section('Check the solutions', area('solved', 'Which problems did the author solve, and which not?'));
  if(st[0] === 'criticize'){
    if(!(arDone(b, 'outline') && arDone(b, 'interpret'))) body = '<div class="locked">Judgment comes after understanding. Finish the Outline and Interpret stages first: state the whole, and set down the key terms or claims. You can still park objections below.</div>';
    else body = kindHint + section('Understand before you judge', '<div class="opts col"><button type="button" class="opt" data-act="arset" data-f="understand" data-v="yes" aria-pressed="' + (a.understand === 'yes') + '">I can state the author’s position in a way the author would accept</button></div>') +
      (a.understand === 'yes' ? section('Your judgment', pick('verdict', ['Agree','Disagree','Suspend judgment']) + area('reasons', 'Your reasons', 'A judgment without reasons is only an opinion.', true)) +
        (a.verdict === 'Disagree' ? section('Where exactly do you disagree?', area('claim', 'Which claim is at issue?') + '<p class="small">What kind of problem is it?</p>' + pick('issue', ['Evidence','Definitions','Inference','Assumptions','Scope']) + area('resolve', 'What would resolve the disagreement?')) + section('Classify it (optional)', '<p class="small">Adler’s four grounds. Fill in only those that apply.</p>' + AR_GROUNDS.map(g => area(g[0], g[1] + '. ' + g[2])).join('')) : '') : '<p class="small">Hold your judgment until you can.</p>');
  }
  if(st[0] === 'sowhat') body = section('Apply it', area('situation', '1. A concrete situation, not the book’s own example') + area('concept', '2. The idea from the book that is relevant') + area('fits', '3. Why it fits this situation') + area('predict', '4. Your prediction, interpretation or proposed decision') + area('observe', '5. What you could observe that would support or challenge it') + area('uncertain', '6. What remains uncertain')) + section('Significance', area('sowhat', 'What difference does this book make to what you know or do?')) +
    section('Across books', '<p class="small">To set this book beside others on the same question, compare them on a concept page.</p><div class="row"><button class="btn" data-act="go" data-v="concepts">Open Concepts</button></div>');
  return '<div class="stack loose"><div class="crumbs"><button data-act="go" data-v="books">Library</button><span>›</span><button data-act="go" data-v="book">' + esc(b.title) + '</button><span>›</span><span>Analytical reading</span></div>' + head('Analytical reading', esc(b.title)) +
    '<div class="stages">' + AR_STAGES.map((g, k) => '<button class="stagebtn' + (arDone(b, g[0]) ? ' done' : '') + '" data-act="arstage" data-s="' + g[0] + '"' + (k === si ? ' aria-current="step"' : '') + '><span class="num">' + (arDone(b, g[0]) ? '✓' : k + 1) + '</span>' + g[1] + '</button>').join('') + '</div>' +
    '<p class="gq">' + esc(st[2]) + '</p>' + body + section('Objections and questions so far', area('objections', 'Park them here at any stage', 'Provisional until you can state the author’s position fairly.')) +
    '<div class="row">' + (si > 0 ? '<button class="btn link" data-act="arstage" data-s="' + AR_STAGES[si - 1][0] + '">‹ ' + AR_STAGES[si - 1][1] + '</button>' : '') + (si < AR_STAGES.length - 1 ? '<button class="btn primary" data-act="arstage" data-s="' + AR_STAGES[si + 1][0] + '">Next: ' + AR_STAGES[si + 1][1] + '</button>' : '<button class="btn primary" data-act="go" data-v="book">Back to the book</button>') + '</div>' +
    '<p class="small">The stages follow the method of analytical reading in Adler and Van Doren’s <i>How to Read a Book</i>.</p></div>';
}
function vNotes(){
  const ids = S.books.filter(b => S.notes.some(n => n.book === b.id));
  return '<div class="stack loose">' + head('Notes', 'Every note, grouped by book.') + trashLink() + ids.map(b => section(esc(b.title), lines(S.notes.filter(n => n.book === b.id)))).join('') + '</div>';
}
const ST_DEEP = [['why','Explain why'],['rep','Represent'],['bound','Distinguish and bound'],['apply','Connect and apply']];
function vSession(){
  const b = book(S.curBook), chs = b.chapters || [], ns = chs.length && b.ch != null ? chNotes(b, b.ch) : S.notes.filter(n => n.book === S.curBook);
  const st = S.study, writing = !!(st && st.reconOpen && !st.locked), cornell = S.style === 'cornell';
  const ta = (k, label, o) => { o = o || {}; return '<label class="f" for="st_' + k + '"' + (o.red ? ' style="color:var(--red)"' : '') + '>' + label + '<textarea class="short' + (o.red ? ' red' : '') + '" id="st_' + k + '" data-st="' + k + '"' + (o.tall ? ' style="min-height:160px"' : '') + (o.ph ? ' placeholder="' + esc(o.ph) + '"' : '') + '>' + esc(st[k] || '') + '</textarea></label>'; };
  const chip = (n, label, done, now) => '<span class="stagebtn' + (done ? ' done' : '') + '"' + (now ? ' aria-current="step"' : '') + '><span class="num">' + (done ? '✓' : n) + '</span>' + label + '</span>';
  const deep = {why:() => ta('why', 'The mechanism, logical justification or evidence behind it'),
    rep:() => ta('rep', 'Express it another way: an equation, an example, a table, or a diagram described in words') + ta('repmap', 'How do the two representations correspond?'),
    bound:() => ta('ex', 'An example') + ta('nonex', 'A non-example: something that looks similar but does not qualify') + ta('fails', 'A condition under which it fails or needs changing'),
    apply:() => ta('connect', 'It relates to another idea because …') + ta('use', 'Use it to explain, predict or decide something in a new situation')};
  let study;
  if(!st){ const n = S.studies.filter(x => x.book === b.id).length; study = section('Study an idea', '<p>Work one idea through in three steps: set a question, reconstruct it from memory, then check it against the book. Open the deeper prompts when the idea is hard.</p><div class="row"><button class="btn primary" data-act="ststart">Start a study pass</button></div>' + (n ? '<p class="small">' + (n === 1 ? '1 study pass' : n + ' study passes') + ' recorded for this book.</p>' : '')); }
  else { const qDone = !!(st.q || '').trim(), closed = ST_DEEP.filter(d => !st.open.includes(d[0]));
    study = '<div class="stages">' + chip(1, 'Question', qDone, !qDone) + chip(2, 'Reconstruct', !!st.locked, qDone && !st.locked) + chip(3, 'Check', false, !!st.locked) + '</div>' +
      section('1. Question and purpose', ta('q', 'What should this section help you understand or be able to do?') + ta('predict', 'Your current explanation or prediction, before reading closely')) +
      section('2. Reconstruct', st.locked ? '<div class="attempt stack" style="gap:2px"><span class="kind">Your reconstruction (locked)</span><p>' + esc(st.recon) + '</p></div>'
        : st.reconOpen ? '<p class="closed-note">Source closed. ' + (cornell ? 'Notes are covered; use your cues.' : 'Your notes are hidden while you write.') + '</p>' + ta('recon', 'Explain the idea, argument or derivation in your own words', {tall:true, ph:'Write what you can. Gaps are useful.'}) + '<div class="row"><button class="btn primary" data-act="stlock">Lock my reconstruction</button></div><p class="small">Once locked it cannot be edited. Corrections go beside it.</p>'
        : '<p class="small">Close the source and explain it from memory. Your notes hide while you write.</p><div class="row"><button class="btn primary" data-act="strecon">Close the book and reconstruct</button></div>') +
      st.open.map(k => section(ST_DEEP.find(d => d[0] === k)[1], deep[k]())).join('') +
      (closed.length ? section('Go deeper (optional)', '<div class="row">' + closed.map(d => '<button class="btn link" data-act="sttoggle" data-k="' + d[0] + '">+ ' + d[1] + '</button>').join('') + '</div>') : '') +
      (st.locked ? section('3. Check and repair', '<p class="small">Reopen the book and your notes. Compare, then correct in red.</p>' + ta('fix', 'What was missing or wrong? Leave blank if nothing.', {red:true}) + '<p class="small">What caused the gap? Optional.</p>' + opts('stcause','c',CAUSES.map(c => [c,c]), st.cause, true) + '<p class="small">Choose a future check.</p>' + opts('stab','a',ABILITIES.slice(0,3).map(x => [x,x]), st.ability) + '<div class="row"><button class="btn primary" data-act="stfinish" data-h="sched">Save and schedule the check</button><button class="btn" data-act="stfinish" data-h="none">Save without scheduling</button></div>') : '') +
      '<div class="row"><button class="btn link" data-act="stdiscard">Discard this study pass</button></div>'; }
  const gaps = S.prereqs.filter(x => x.book === b.id && !x.done);
  return '<div class="stack loose">' + head(esc(b.title), 'Study session · ' + esc(chs.length && b.ch != null ? chs[b.ch] : (b.pos || 'no chapter set'))) +
    (writing ? (cornell ? section('Cues', lines(ns, {covered:true})) : '') : section('Notes', (ns.length ? lines(ns) : '<p class="soft">No notes for this chapter yet.</p>') + '<button class="btn link" data-act="capture" style="align-self:flex-start">+ Add a note</button>')) +
    (cornell && !writing ? '<section class="stack summary"><h3>Summary</h3><label class="f" for="sum">Two or three sentences, in your own words<textarea id="sum" data-draft="summary" style="min-height:96px">' + esc(S.drafts.summary || '') + '</textarea></label></section>' : '') +
    study +
    section('Stuck on a step?', '<p class="small">Park a prerequisite gap, resolve it, then come back.</p><div class="calc"><label class="f" for="prq">What do you need to understand first?<input type="text" id="prq" data-draft="prq" value="' + esc(S.drafts.prq || '') + '"></label><button class="btn" data-act="prqadd">Park it</button></div>' + (gaps.length ? '<div class="opts col">' + gaps.map(g => '<button type="button" class="opt" data-act="prqdone" data-id="' + g.id + '" aria-pressed="false">' + esc(g.text) + '</button>').join('') + '</div><p class="small">Tap a gap once you have resolved it.</p>' : '')) + '</div>';
}
const prompts = () => S.curBook === 'b1' ? PROMPTS_B1 : {explain:{label:'Explain an idea', ability:'Explain', text:'Explain the most important idea from this session: what it says and when it applies.'}, problem:{label:'Apply an idea', ability:'Apply', text:'Describe a new situation where an idea from this session applies, and reason it through.'}};
const PROMPTS_B1 = {
  explain:{label:'Explain an idea', ability:'Explain', text:'Explain the simple linear regression model: what each variable means and what the model assumes.'},
  problem:{label:'Attempt a problem', ability:'Apply', text:'A fitted line is ŷ = 12 + 3x. One observation has x = 4 and y = 27. Find its residual and say what the sign tells you.'}
};
function vFlow(b, ns){
  const f = S.flow, p = prompts()[f.kind], order = ['prompt','answer','correct','schedule','done'], at = order.indexOf(f.step);
  const topH = head('Close the book', esc(b.title) + ' · step ' + (at + 1) + ' of 5');
  const att = '<div class="attempt stack" style="gap:2px"><span class="kind">Your answer (locked)</span><p>' + esc(f.answer || '') + '</p></div>';
  const fix = f.fix ? '<div class="fix stack" style="gap:2px"><span class="kind" style="color:var(--red)">Correction' + (f.cause ? ', ' + esc(f.cause.toLowerCase()) : '') + '</span><p>' + esc(f.fix) + '</p></div>' : '<p class="small">No correction recorded.</p>';
  let body = '';
  if(f.step === 'prompt') body = section('Choose one', opts('flowkind','k',Object.keys(prompts()).map(k => [k, prompts()[k].label]), f.kind) + '<h2>' + esc(p.text) + '</h2><div class="row"><button class="btn primary" data-act="flowgo" data-s="answer">Close the book and answer</button><button class="btn link" data-act="flowcancel">Skip for now</button></div>');
  if(f.step === 'answer') body = section('', '<h2>' + esc(p.text) + '</h2>' + (S.style === 'cornell' ? '<p class="closed-note">Notes covered. Use your cues.</p>' + lines(ns, {covered:true}) : '<p class="closed-note">Your notes are hidden while you answer.</p>') + '<label class="f" for="ans">From memory, in your own words<textarea id="ans" data-draft="ans" placeholder="Write what you remember. Gaps are useful.">' + esc(S.drafts.ans || '') + '</textarea></label><div class="row"><button class="btn primary" data-act="flowlock">Lock my answer</button></div><p class="small">Once locked, the answer cannot be edited. Corrections go beside it.</p>');
  if(f.step === 'correct') body = att + section('Your notes', lines(ns)) + section('Correct it in red', '<label class="f" for="fix">What was missing or wrong?<textarea id="fix" class="red" data-draft="fix">' + esc(S.drafts.fix || '') + '</textarea></label><p class="small">What caused the gap? Optional.</p>' + opts('flowcause','c',CAUSES.map(c => [c,c]), f.cause, true) + '<div class="row"><button class="btn primary" data-act="flowfix">Save correction</button><button class="btn link" data-act="flownofix">Nothing to correct</button></div>');
  if(f.step === 'schedule') body = att + fix + section('Review this later?', '<p class="small">Choose the ability to practise.</p>' + opts('flowab','a',ABILITIES.slice(0,3).map(a => [a,a]), f.ability) + '<div class="row"><button class="btn primary" data-act="flowsched">Schedule review</button><button class="btn" data-act="flowskip">Not now</button></div>');
  if(f.step === 'done') body = '<section class="stack"><h2>Done</h2><p class="soft">Your answer and correction are kept as separate records. ' + (f.scheduled ? 'A review was added; in this prototype it is due now.' : 'No review was scheduled.') + '</p></section>' + att + fix + '<div class="row">' + (f.scheduled ? '<button class="btn primary" data-act="go" data-v="review">Go to review</button>' : '') + '<button class="btn" data-act="flowcancel">Back to session</button></div>';
  return '<div class="stack loose">' + topH + body + '</div>';
}
function vReview(){
  const d = due(), mins = d.reduce((a,i) => a + i.mins, 0), r = S.rev;
  const topH = head('Review', d.length ? d.length + ' ready, about ' + mins + ' of 15 minutes' : 'Nothing left today');
  if(!d.length) return '<div class="stack loose">' + topH + section('', (S.events.length ? '<div class="lines">' + S.events.map(e => '<div class="mg"><div class="ref"><b>' + esc(e.grade) + '</b></div><div><p>' + e.ability + (e.hint ? ', hint used' : '') + (e.cause ? ', ' + esc(e.cause.toLowerCase()) : '') + '</p><p class="small">Next in ' + esc(e.next) + ' (simulated)</p></div></div>').join('') + '</div>' : '<p class="soft">Schedule a review from a Close the book check.</p>') + '<div class="row"><button class="btn" data-act="revreset">Reset example queue</button></div>') + '</div>';
  const it = d[0];
  if(it.kind === 'problem'){ const p = prob(it.problem); return '<div class="stack loose">' + topH + section('', '<p class="kind">Problem · ' + (it.variation ? 'variation' : 'retry from scratch') + '</p>' + stmt(p) + (it.parts ? '<p><b>' + (it.parts.length === 1 ? 'Part' : 'Parts') + ' to retry: ' + it.parts.map(l => '(' + esc(l) + ')').join(', ') + '</b> <span class="small">· the ones you marked incorrect or did not attempt.</span></p>' : '') + (it.variation ? '<p class="small">Change one value or condition before you start.</p>' : '') + '<div class="row"><button class="btn primary" data-act="revproblem">Open in workspace</button><button class="btn link" data-act="revdefer">Later</button></div>') + '<p class="small">Stop whenever you like. Anything you do not reach stays due, with no penalty.</p></div>'; }
  const b = book(it.book);
  let inner = '<p class="kind">' + esc(b.title) + ' · ' + it.ability + '</p><h2>' + esc(it.task) + '</h2>';
  if(!r.graded){
    inner += '<label class="f" for="rans">Answer from memory<textarea id="rans" data-draft="rans"' + (r.shown ? ' readonly' : '') + '>' + esc(S.drafts.rans || '') + '</textarea></label>';
    if(!r.shown) inner += '<div class="row"><button class="btn primary" data-act="revshow">Show my notes</button><button class="btn" data-act="revhint" ' + (r.hint ? 'disabled' : '') + '>' + (r.hint ? 'Hint used' : 'Hint') + '</button><button class="btn link" data-act="revdefer">Later</button></div>' + (r.hint ? '<p class="small">Hint: start from your note on ' + esc(it.notes.length ? note(it.notes[0]).loc.split(', ').pop() : 'this book') + ' and name the key quantity first.</p>' : '');
    else inner += lines(it.notes.map(note)) + '<p class="small">How did it go?' + (r.hint ? ' A hint caps the grade at Hard.' : '') + '</p><div class="grades">' + GRADES.map((g,i) => '<button class="btn" data-act="revgrade" data-g="' + i + '"' + (r.hint && i > 1 ? ' disabled' : '') + '>' + g[0] + '<small>' + g[1] + '</small></button>').join('') + '</div>';
  } else {
    inner += '<p>Recorded: <b>' + esc(r.graded) + '</b>' + (r.hint ? ', hint used' : '') + '.</p>';
    if(r.graded === 'Again') inner += '<p class="small">What went wrong? Optional.</p>' + opts('revcause','c',CAUSES.map(c => [c,c]), r.cause, true);
    inner += '<div class="row"><button class="btn primary" data-act="revnext">' + (d.length > 1 ? 'Next' : 'Finish') + '</button></div>';
  }
  return '<div class="stack loose">' + topH + section('', inner) + '<p class="small">Stop whenever you like. Anything you do not reach stays due, with no penalty.</p>' + '</div>';
}
const CREL = ['generalizes','depends on','has the same structure as','looks similar but differs from','contradicts'];
const CFIELDS = [['definition','Precise definition','What is its exact definition?'],['purpose','Purpose','What question does it answer, or what problem does it help solve?'],['justification','Justification','Why does it work? Is that a proof, a mechanism, empirical evidence or a definition?'],['recognition','Recognition','What features of a situation tell you it may be relevant?'],['boundaries','Boundaries','Which assumptions matter? What similar-looking situation does not qualify?']];
function cLinkList(c){ const q = (S.drafts.cnq || '').toLowerCase().trim(), have = c.links.map(l => l.n), xs = S.notes.filter(n => !have.includes(n.id) && (!q || (n.text + ' ' + (book(n.book) || {title:''}).title + ' ' + (n.loc || '')).toLowerCase().includes(q))).slice(0, 6);
  return xs.length ? xs.map(n => '<button class="pick" data-act="clink" data-id="' + n.id + '"><span class="t">' + esc(n.text.slice(0, 90)) + (n.text.length > 90 ? '…' : '') + '</span><br><span class="small">' + esc(((book(n.book) || {}).title || '') + ' · ' + (n.loc || '')) + '</span></button>').join('') : '<p class="soft">' + (S.notes.length ? 'No other note matches.' : 'No notes yet. Notes come from study sessions in the Reading Lab.') + '</p>'; }
function vConcepts(){
  if(!S.concepts.find(x => x.id === S.selConcept)){ if(S.concepts.length) S.selConcept = S.concepts[0].id; else return '<div class="stack loose">' + head('Concepts', 'Show that you understand the text: a working explanation first, then the evidence behind it.') + '<p class="soft">No concepts yet. A concept is an idea you want to be able to explain in your own words.</p><div class="row"><button class="btn primary" data-act="cnew">+ New concept</button></div></div>'; }
  const c = S.concepts.find(x => x.id === S.selConcept);
  const list = '<div class="list stack' + (S.conceptOpen ? ' closed' : '') + '"><button class="btn" data-act="cnew" style="align-self:flex-start">+ New concept</button><label class="f" for="cq">Search<input type="text" id="cq" data-draft="cq" value="' + esc(S.drafts.cq || '') + '"></label><div id="clist" class="lines">' + cList() + '</div></div>';
  const byBook = {}; c.links.forEach(l => { const n = note(l.n); (byBook[n.book] = byBook[n.book] || []).push([n, l.rel]); });
  const cf = (k, label, ph) => '<label class="f" for="cf_' + k + '">' + label + '<textarea class="short" id="cf_' + k + '" data-cf="' + k + '"' + (ph ? ' placeholder="' + esc(ph) + '"' : '') + '>' + esc(c[k] || '') + '</textarea></label>';
  const shown = CFIELDS.filter(x => (c[x[0]] || '').trim() || S.cOpen.includes(c.id + x[0])), hidden = CFIELDS.filter(x => !shown.includes(x));
  const rels = c.rels || [], others = S.concepts.filter(x => x.id !== c.id), D = S.drafts;
  const noteIds = c.links.map(l => l.n), evs = S.events.filter(e => { const it = S.items.find(i => i.id === e.item); return it && it.notes && it.notes.some(id => noteIds.includes(id)); });
  const pas = S.pAttempts.filter(a => (c.problems || []).includes(a.problem)), bks = Object.keys(byBook);
  const detail = '<div class="detail stack loose' + (S.conceptOpen ? '' : ' closed') + '"><button class="btn link only-compact" data-act="conceptback" style="align-self:flex-start">‹ All concepts</button><label class="f" for="cname" style="gap:0"><span class="small">Concept name</span><input type="text" id="cname" class="cname" data-cname="1" value="' + esc(c.name) + '"></label>' +
    section('Working explanation', cf('mine', 'What it means, in ordinary language', 'Explain it as you would to someone new to it.')) +
    section('Sharpen it', shown.map(x => cf(x[0], x[1] + '. ' + x[2])).join('') + (hidden.length ? '<div class="row">' + hidden.map(x => '<button class="btn link" data-act="ctoggle" data-k="' + x[0] + '">+ ' + x[1] + '</button>').join('') + '</div>' : '') + '<p class="small">Use only the prompts this concept needs.</p>') +
    section('Connections (' + rels.length + ')', rels.map(r => { const o = S.concepts.find(x => x.id === r.to); return '<div class="relrow"><button class="btn link mini" data-act="creldel" data-i="' + rels.indexOf(r) + '" style="float:right">Remove</button><p><b>' + esc(c.name) + '</b> ' + esc(r.rel) + ' <b>' + esc(o ? o.name : 'a removed concept') + '</b></p><p class="small">' + esc(r.why) + '</p></div>'; }).join('') +
      '<p class="small">Connect it to another concept. A connection needs a reason.</p>' + opts('crelto','t',others.map(x => [x.id, x.name]), D.crel_to) + opts('crelrel','r',CREL.map(x => [x,x]), D.crel_rel, true) + '<div class="calc"><label class="f" for="crel_why">Because …<input type="text" id="crel_why" data-draft="crel_why" value="' + esc(D.crel_why || '') + '"></label><button class="btn" data-act="creladd">Add connection</button></div>') +
    section('Evidence of understanding', '<div class="hist"><span>Linked notes</span><span>' + c.links.length + ' from ' + plural(bks.length, 'book') + '</span><span>Review answers this visit</span><span>' + evs.filter(e => e.grade !== 'Again' && !e.hint).length + ' of ' + evs.length + ' without hints</span></div><p class="small">Counted from your records, not self-rated.</p>') +
    section('Across books', cf('question', 'The shared question these sources answer', 'A question, not a topic.') + '<div class="cmpwrap"><table class="cmp">' + bks.map(id => '<tr><td>' + esc(book(id).title) + '</td>' + [['claim','Claim or definition'],['evidence','Evidence'],['differs','Where it differs']].map(kk => { const k = kk[0]; return '<td><span class="small">' + kk[1] + '</span><textarea class="short" aria-label="' + kk[1] + '" id="cmp_' + id + '_' + k + '" data-cmp="' + id + '|' + k + '">' + esc(((c.cmp || {})[id] || {})[k] || '') + '</textarea></td>'; }).join('') + '</tr>').join('') + '</table></div>' + (bks.length < 2 ? '<p class="small">Link a note from a second book to compare authors.</p>' : '')) +
    Object.keys(byBook).map(id => section(esc(book(id).title), lines(byBook[id].map(x => x[0]), {labels:byBook[id].map(x => x[1])}))).join('') +
    section('Linked notes (' + c.links.length + ')', (c.links.length ? '<div class="plist" style="max-width:none">' + c.links.map(l => { const n = note(l.n); return n ? '<div class="prow"><span style="flex:1;min-width:0">' + esc(n.text.slice(0, 80)) + (n.text.length > 80 ? '…' : '') + '</span><button class="btn link mini" data-act="cunlink" data-id="' + n.id + '">Unlink</button></div>' : ''; }).join('') + '</div>' : '') + '<label class="f" for="cnq">Link a note: search your notes<input type="text" id="cnq" data-draft="cnq" value="' + esc(S.drafts.cnq || '') + '"></label><div id="cnlist" class="lines">' + cLinkList(c) + '</div>') +
    section('Check with the assistant (optional)', aiBox('concept', c, 'Claude reads your explanation and linked notes, says what holds up and what does not, and asks three probing questions. It will not rewrite the explanation for you.')) + '<div class="row"><button class="btn link" data-act="cdel" style="color:var(--red)">' + (S.delArm === 'c' + c.id ? 'Tap again to delete this concept' : 'Delete this concept') + '</button></div>' +
    '</div>';
  return '<div class="stack loose">' + head('Concepts', 'Show that you understand the text: a working explanation first, then the evidence behind it.') + '<div class="split">' + list + detail + '</div></div>';
}
function cList(){
  const q = (S.drafts.cq || '').toLowerCase().trim();
  const xs = S.concepts.filter(c => !q || c.name.toLowerCase().includes(q) || c.mine.toLowerCase().includes(q));
  return xs.length ? xs.map(c => '<button class="pick' + (c.id === S.selConcept ? ' sel' : '') + '" data-act="concept" data-id="' + c.id + '"><span class="t">' + esc(c.name) + '</span><br><span class="small">' + c.links.length + ' ' + (c.links.length === 1 ? 'note' : 'notes') + (c.clash ? ', authors disagree' : '') + '</span></button>').join('') : '<p class="soft" style="padding:10px 0">Nothing matches “' + esc(q) + '”.</p>';
}
/* ---------- Problems lab ---------- */
const independent = a => a.mode !== 'learn' && !a.hints && !a.solution;
const helpText = a => !a ? 'No attempts yet' : independent(a) ? 'Independent' : 'Guided' + (a.declared ? ', help used' : (a.hints ? ', ' + a.hints + (a.hints === 1 ? ' hint' : ' hints') : '') + (a.solution ? ', solution consulted' : '') + (!a.hints && !a.solution ? ', Learn mode' : ''));
const lastAttempt = id => S.pAttempts.filter(a => a.problem === id).slice(-1)[0];
const modeName = m => MODES.find(x => x[0] === m)[1];
const stmt = p => '<div class="lines"><div class="mg"><div class="ref"><b>' + esc(p.loc.split(', ').pop()) + '</b>' + esc(p.loc.split(', ')[0]) + '</div><div class="stack" style="gap:4px"><span class="kind">' + esc(psrc(p)) + '</span>' + (p.crop ? (p.instr ? '<img class="pcrop" src="' + p.instr + '" alt="Instructions shared by this problem set">' : '') + '<img class="pcrop" src="' + p.crop + '" alt="Problem statement, imported as a picture">' + (p.text ? '<p class="stmt">' + esc(p.text) + '</p>' : '') + ((p.parts || []).length ? '<p class="small">Parts: ' + p.parts.map(l => '(' + esc(l) + ')').join(' ') + '</p>' : '') : p.img ? '<div class="thumbs">' + (p.parts || [1]).map((k,j,a) => '<div class="thumb">' + (a.length > 1 ? 'Screenshot ' + k + ' · part ' + (j + 1) + ' of ' + a.length : 'Image crop of the exercise') + ' (simulated)</div>').join('') + '</div><p class="small">Machine-read text, for search only: “' + esc(p.ocr) + '”</p>' : '<p class="stmt">' + esc(p.text) + '</p>') + '</div></div></div>';
const checksText = c => { const k = Object.keys(c); return k.length ? k.map(x => CHECKS.find(y => y[0] === x)[1].toLowerCase() + ' ' + c[x]).join('; ') : 'none recorded'; };
const atOf = a => { if(!a.at){ const m = (a.when || '').match(/(\d+) days? ago/); a.at = Date.now() - (m ? +m[1] * 864e5 + 5.4e6 : 0); } return a.at; };
const fmtDay = ts => new Date(ts).toLocaleDateString(undefined, {day:'numeric', month:'short', year:'numeric'}), fmtTime = ts => new Date(ts).toLocaleTimeString(undefined, {hour:'2-digit', minute:'2-digit'}), fmtAt = ts => fmtDay(ts) + ', ' + fmtTime(ts);
const fmtDur = sec => sec == null ? '' : sec < 90 ? Math.max(1, Math.round(sec)) + ' s' : Math.round(sec / 60) + ' min';
const partTally = a => a.parts ? a.parts.filter(r => r.mark === 'right').length + ' of ' + a.parts.length + ' parts correct' : '';
const attemptLine = (a, n, showProb) => '<div class="mg"><div class="ref"><b>#' + n + '</b>' + esc(fmtDay(atOf(a))) + '<br>' + esc(fmtTime(atOf(a))) + (a.dur != null ? '<br>' + esc(fmtDur(a.dur)) : '') + '</div><div class="stack" style="gap:4px"><span class="kind">' + esc([showProb ? prob(a.problem).loc.split(', ').pop() : '', modeName(a.mode), helpText(a), a.declared ? 'self-declared' : ''].filter(Boolean).join(' · ')) + '</span>' +
  (a.img ? '<div class="thumb">Imported handwritten page (simulated)</div>' : (a.blocks ? blocksHtml(a.blocks) : '<p style="white-space:pre-wrap">' + esc(a.working) + '</p>')) +
  (a.secs || []).map(x => '<p class="small">' + esc(x[0]) + ': ' + esc(x[1]) + '</p>').join('') +
  (a.calcs.length ? '<p class="small">Calculations: ' + a.calcs.map(c => esc(c.in) + ' = ' + c.out).join('; ') + '</p>' : '') +
  '<p class="small">Checks: ' + esc(checksText(a.checks)) + '</p>' +
  (a.only ? '<p class="small">A retry of ' + (a.only.length === 1 ? 'part ' : 'parts ') + a.only.map(l => '(' + esc(l) + ')').join(', ') + ' only.</p>' : '') + (a.parts ? partsShow(a.parts) : '') +
  (!a.eval && a.id && !a.declared ? '<div class="row">' + (a.evalBusy ? '<span class="small">Evaluating…</span>' : (a.evalPending ? '<span class="small"><b>Waiting for evaluation.</b></span>' : '') + '<button class="btn link mini" data-act="atteval" data-id="' + a.id + '">Evaluate this attempt</button>') + '</div>' : '') +
  (a.eval || (a.ai && a.ai.length) ? '<details class="aibox"><summary class="kind">AI evaluation' + (a.eval && a.eval.late ? ' (done later)' : '') + (a.eval ? ': ' + esc(verd(a.eval.verdict)[0]) : '') + '</summary>' + evalHtml(a.eval) + aiTurnsHtml(a.ai) + '</details>' : '') +
  (a.fix ? '<div class="fix"><p>' + esc(a.fix) + '</p></div>' : '') + (a.fixes || []).map(x => '<div class="fix"><p class="small" style="font-family:var(--text)">Added ' + esc(x.at ? fmtAt(x.at) : x.when) + '</p><p>' + esc(x.text) + '</p></div>').join('') +
  (a.id ? (S.fixFor === a.id ? '<div class="stack" style="gap:6px"><label class="f" for="fix2">Add a correction. Earlier ones stay as written.<textarea id="fix2" class="red short" data-draft="fix2">' + esc(S.drafts.fix2 || '') + '</textarea></label><div class="row"><button class="btn" data-act="fixsave" data-id="' + a.id + '">Save correction</button><button class="btn link" data-act="fixcancel">Cancel</button></div></div>' : '<button class="btn link mini" data-act="fixadd" data-id="' + a.id + '" style="align-self:flex-start">Add a correction</button>') : '') + (a.errors.length ? '<p class="small">Obstacle: ' + esc(a.errors.join(', ').toLowerCase()) + '</p>' : '') + '</div></div>';
function calc(s, xv, yv){
  const clean = s.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/π/g,'pi').toLowerCase().replace(/\s+/g,'');
  const t0 = clean.match(/\d*\.?\d+|[a-z]+|[-+*/^()]/g) || []; let i = 0;
  if(t0.join('') !== clean || !t0.length) throw new Error('bad');
  const t = [].concat.apply([], t0.map(k => (xv !== undefined && /^[xy]{2,}$/.test(k)) ? k.split('') : [k]));
  const F = {sqrt:Math.sqrt, sin:Math.sin, cos:Math.cos, tan:Math.tan, exp:Math.exp, ln:Math.log, log:Math.log10, abs:Math.abs}, C = {pi:Math.PI, e:Math.E};
  const expr = () => { let v = term(); while(t[i] === '+' || t[i] === '-'){ const o = t[i++], r = term(); v = o === '+' ? v + r : v - r; } return v; };
  const term = () => { let v = unary(); for(;;){ if(t[i] === '*' || t[i] === '/'){ const o = t[i++], r = unary(); v = o === '*' ? v * r : v / r; } else if(t[i] !== undefined && /^[\d.a-z(]/.test(t[i])){ v = v * pow(); } else break; } return v; };
  const unary = () => t[i] === '-' ? (i++, -unary()) : t[i] === '+' ? (i++, unary()) : pow();
  const pow = () => { const b = atom(); if(t[i] === '^'){ i++; return Math.pow(b, unary()); } return b; };
  const atom = () => { const k = t[i++]; if(k === '('){ const v = expr(); if(t[i++] !== ')') throw new Error('bad'); return v; } if(Object.prototype.hasOwnProperty.call(F, k)){ if(t[i++] !== '(') throw new Error('bad'); const v = expr(); if(t[i++] !== ')') throw new Error('bad'); return F[k](v); } if(k === 'x' && xv !== undefined) return xv; if(k === 'y' && yv !== undefined) return yv; if(Object.prototype.hasOwnProperty.call(C, k)) return C[k]; const n = parseFloat(k); if(k === undefined || isNaN(n)) throw new Error('bad'); return n; };
  const v = expr(); if(i !== t.length) throw new Error('bad'); if(xv !== undefined) return v; if(!isFinite(v)) throw new Error('bad'); return +v.toPrecision(10);
}
const swatches = (act, extra, cur) => '<span class="sws">' + PENS.map(c => '<button type="button" class="sw' + (cur === c[0] ? ' on' : '') + '" style="--pc:var(--pen-' + c[0] + ')" data-act="' + act + '" ' + extra + ' data-c="' + c[0] + '" aria-label="' + c[1] + ' pen" aria-pressed="' + (cur === c[0]) + '"></button>').join('') + '</span>';
function plot(b, o){ return b.dim === '3d' ? plot3(b, o) : plot2(b, o); }
function plot2(b, o){
  const exprs = (b.expr || '').split(/[,;]/).map(x => x.trim()).filter(Boolean).slice(0, 3);
  const x0 = parseFloat(b.xmin), x1 = parseFloat(b.xmax);
  if(!exprs.length) return '<p class="small">Enter a function of x, for example x*exp(-x) or 2x^2 - 3.</p>';
  if(!(x1 > x0)) return '<p class="small">The x range needs a start below its end.</p>';
  const N = 240, W = (o && o.W) || 560, H = (o && o.H) || 300, L = 46, R = 12, T = 12, B = 28, series = [], cid = 'clip' + W + 'x' + H;
  try{ exprs.forEach(ex => { const ys = []; for(let i = 0; i <= N; i++) ys.push(calc(ex, x0 + (x1 - x0) * i / N)); series.push(ys); }); }
  catch(err){ return '<p class="small">That could not be read. Use x, numbers, + - * / ^, brackets, sqrt, sin, cos, exp, ln, pi.</p>'; }
  const fin = [].concat.apply([], series).filter(isFinite).sort((p, q) => p - q);
  if(!fin.length) return '<p class="small">Nothing to plot in this range.</p>';
  let lo = fin[Math.floor(fin.length * 0.02)], hi = fin[Math.ceil(fin.length * 0.98) - 1];
  if(hi === lo){ hi += 1; lo -= 1; } const pad = (hi - lo) * 0.15; lo -= pad; hi += pad;
  const X = x => L + (x - x0) / (x1 - x0) * (W - L - R), Y = y => T + (hi - y) / (hi - lo) * (H - T - B);
  const step = r => { const raw = r / 5, m = Math.pow(10, Math.floor(Math.log10(raw))), n = raw / m; return (n < 1.5 ? 1 : n < 3.5 ? 2 : n < 7.5 ? 5 : 10) * m; };
  const fmt = v => String(+v.toPrecision(6));
  let g = '';
  const sx = step(x1 - x0), sy = step(hi - lo);
  for(let v = Math.ceil(x0 / sx) * sx; v <= x1 + sx * 1e-9; v += sx) g += '<line x1="' + X(v) + '" x2="' + X(v) + '" y1="' + T + '" y2="' + (H - B) + '" stroke="var(--line)" stroke-width="1"/><text x="' + X(v) + '" y="' + (H - 9) + '" text-anchor="middle" font-size="11" fill="var(--soft)">' + fmt(v) + '</text>';
  for(let v = Math.ceil(lo / sy) * sy; v <= hi + sy * 1e-9; v += sy) g += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" stroke="var(--line)" stroke-width="1"/><text x="' + (L - 6) + '" y="' + (Y(v) + 4) + '" text-anchor="end" font-size="11" fill="var(--soft)">' + fmt(v) + '</text>';
  if(lo < 0 && hi > 0) g += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(0) + '" y2="' + Y(0) + '" stroke="var(--soft)" stroke-width="1.25"/>';
  if(x0 < 0 && x1 > 0) g += '<line x1="' + X(0) + '" x2="' + X(0) + '" y1="' + T + '" y2="' + (H - B) + '" stroke="var(--soft)" stroke-width="1.25"/>';
  const cols = [b.color].concat(PENS.map(p => p[0]).filter(c => c !== b.color && c !== 'black'));
  series.forEach((ys, k) => { let d = '', pen = false; ys.forEach((y, i) => { if(!isFinite(y) || y < lo - (hi - lo) || y > hi + (hi - lo)){ pen = false; return; } d += (pen ? 'L' : 'M') + X(x0 + (x1 - x0) * i / N).toFixed(1) + ' ' + Y(y).toFixed(1); pen = true; }); g += '<path d="' + d + '" fill="none" stroke="var(--pen-' + cols[k] + ')" stroke-width="2.25" stroke-linejoin="round" stroke-linecap="round" clip-path="url(#' + cid + ')"/>'; });
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Graph of ' + esc(exprs.join(' and ')) + '"><defs><clipPath id="' + cid + '"><rect x="' + L + '" y="' + T + '" width="' + (W - L - R) + '" height="' + (H - T - B) + '"/></clipPath></defs><rect x="' + L + '" y="' + T + '" width="' + (W - L - R) + '" height="' + (H - T - B) + '" fill="var(--paper)" stroke="var(--soft)" stroke-width="1"/>' + g + '</svg><p class="small legend">' + exprs.map((ex, k) => '<span style="color:var(--pen-' + cols[k] + ')">y = ' + esc(ex) + '</span>').join(' · ') + '</p>';
}

const G3COL = [[59,76,192],[79,155,217],[88,196,168],[230,208,74],[224,114,58]];
function plot3(b, o){
  const ex = (b.expr || '').trim(), x0 = parseFloat(b.xmin), x1 = parseFloat(b.xmax), y0 = parseFloat(b.ymin), y1 = parseFloat(b.ymax);
  if(!ex) return '<p class="small">Enter a function of x and y, for example sin(x)*cos(y) or x^2 - y^2.</p>';
  if(!(x1 > x0) || !(y1 > y0)) return '<p class="small">Each range needs a start below its end.</p>';
  const W = (o && o.W) || 560, H = (o && o.H) || 360, N = 28, Z = [];
  try{ for(let i = 0; i <= N; i++){ const row = []; for(let j = 0; j <= N; j++) row.push(calc(ex, x0 + (x1 - x0) * i / N, y0 + (y1 - y0) * j / N)); Z.push(row); } }
  catch(err){ return '<p class="small">That could not be read. Use x, y, numbers, + - * / ^, brackets, sqrt, sin, cos, exp, ln, pi.</p>'; }
  const fin = [].concat.apply([], Z).filter(isFinite).sort((p, q) => p - q);
  if(!fin.length) return '<p class="small">Nothing to plot in this range.</p>';
  let lo = fin[Math.floor(fin.length * 0.01)], hi = fin[Math.ceil(fin.length * 0.99) - 1]; if(hi === lo){ hi += 1; lo -= 1; }
  const az = (b.az != null ? b.az : 35) * Math.PI / 180, el = (b.el != null ? b.el : 28) * Math.PI / 180, ca = Math.cos(az), sa = Math.sin(az), ce = Math.cos(el), se = Math.sin(el), SC = Math.min(W, H * 1.3) * 0.3, cx = W / 2, cy = H / 2;
  const P = (u, v, w) => { const xr = u * ca - v * sa, yr = u * sa + v * ca; return [cx + xr * SC, cy + (yr * se - w * 0.62 * ce) * SC, yr]; };
  const zn = z => Math.max(-1, Math.min(1, (z - lo) / (hi - lo) * 2 - 1)), pt = q => q[0].toFixed(1) + ',' + q[1].toFixed(1), fmt = v => String(+v.toPrecision(4));
  const col = t => { const k = Math.max(0, Math.min(0.9999, t)) * 4, a = G3COL[Math.floor(k)], c = G3COL[Math.floor(k) + 1], f = k - Math.floor(k); return 'rgb(' + [0, 1, 2].map(m => Math.round(a[m] + (c[m] - a[m]) * f)).join(',') + ')'; };
  const C = [[-1,-1],[1,-1],[1,1],[-1,1]]; let box = '';
  C.forEach((c, k) => { const d = C[(k + 1) % 4]; box += '<path d="M' + pt(P(c[0], c[1], -1)) + 'L' + pt(P(d[0], d[1], -1)) + 'M' + pt(P(c[0], c[1], 1)) + 'L' + pt(P(d[0], d[1], 1)) + 'M' + pt(P(c[0], c[1], -1)) + 'L' + pt(P(c[0], c[1], 1)) + '"/>'; });
  const quads = [];
  for(let i = 0; i < N; i++) for(let j = 0; j < N; j++){ const zs = [Z[i][j], Z[i + 1][j], Z[i + 1][j + 1], Z[i][j + 1]]; if(!zs.every(isFinite)) continue; const u0 = i / N * 2 - 1, u1 = (i + 1) / N * 2 - 1, v0 = j / N * 2 - 1, v1 = (j + 1) / N * 2 - 1, q = [P(u0, v0, zn(zs[0])), P(u1, v0, zn(zs[1])), P(u1, v1, zn(zs[2])), P(u0, v1, zn(zs[3]))]; quads.push([(q[0][2] + q[1][2] + q[2][2] + q[3][2]) / 4, q.map(pt).join(' '), ((zs[0] + zs[1] + zs[2] + zs[3]) / 4 - lo) / (hi - lo)]); }
  quads.sort((p, q) => p[0] - q[0]);
  const near = C.slice().sort((p, q) => P(q[0], q[1], -1)[2] - P(p[0], p[1], -1)[2])[0], left = C.slice().sort((p, q) => P(p[0], p[1], -1)[0] - P(q[0], q[1], -1)[0])[0];
  const lab = (q, t, dy, anc) => '<text x="' + q[0].toFixed(1) + '" y="' + (q[1] + (dy || 0)).toFixed(1) + '" text-anchor="' + (anc || 'middle') + '" font-size="11" fill="var(--soft)">' + t + '</text>';
  const xv = u => fmt(u < 0 ? x0 : x1), yv = v => fmt(v < 0 ? y0 : y1);
  const labels = lab(P(0, near[1] * 1.12, -1), 'x', 14) + lab(P(-near[0], near[1] * 1.08, -1), xv(-near[0]), 14) + lab(P(near[0] * 1.12, 0, -1), 'y', 14) + lab(P(near[0] * 1.08, -near[1], -1), yv(-near[1]), 14) + lab(P(near[0], near[1], -1), xv(near[0]) + ', ' + yv(near[1]), 16) +
    lab(P(left[0], left[1], -1), fmt(lo), 4, 'end').replace('x="', 'dx="-6" x="') + lab(P(left[0], left[1], 1), fmt(hi), 4, 'end').replace('x="', 'dx="-6" x="') + lab(P(left[0], left[1], 0), 'z', 4, 'end').replace('x="', 'dx="-8" x="');
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Surface z = ' + esc(ex) + '"><g fill="none" stroke="var(--soft)" stroke-width="1" opacity=".55">' + box + '</g><g stroke="rgba(0,0,0,.28)" stroke-width=".6" stroke-linejoin="round">' + quads.map(q => '<polygon points="' + q[1] + '" fill="' + col(q[2]) + '"/>').join('') + '</g>' + labels + '</svg><p class="small legend"><span>z = ' + esc(ex) + '</span>' + (o && o.live ? ' · Drag to rotate.' : '') + '</p>';
}
const graphSize = i => { if(S.graphFs !== i) return {live:true}; const el = $('g_' + i), w = (el && el.clientWidth) || window.innerWidth - 24, h = (el && el.clientHeight - 30) || window.innerHeight - 190, W = Math.max(340, Math.min(1100, w)); return {W:W, H:Math.max(260, Math.round(W * h / w)), live:true}; };
let g3 = null, g3raf = 0;
const g3draw = i => { if(g3raf) return; g3raf = requestAnimationFrame(() => { g3raf = 0; const g = $('g_' + i), b = S.pw && S.pw.blocks[i]; if(g && b) g.innerHTML = plot(b, graphSize(i)); }); };
document.addEventListener('pointerdown', e => { const g = e.target.closest ? e.target.closest('.graph[data-g3]') : null, b = g && S.pw && S.pw.blocks[+g.dataset.g3]; if(!b || !e.target.closest('svg')) return; e.preventDefault(); g3 = {i:+g.dataset.g3, b:b, id:e.pointerId, x:e.clientX, y:e.clientY}; try{ g.setPointerCapture(e.pointerId); }catch(err){} });
document.addEventListener('pointermove', e => { if(!g3 || e.pointerId !== g3.id) return; e.preventDefault(); const b = g3.b; b.az = ((b.az != null ? b.az : 35) + (e.clientX - g3.x) * 0.5) % 360; b.el = Math.max(4, Math.min(88, (b.el != null ? b.el : 28) + (e.clientY - g3.y) * 0.4)); g3.x = e.clientX; g3.y = e.clientY; g3draw(g3.i); }, {passive:false});
const g3end = e => { if(g3 && e.pointerId === g3.id) g3 = null; }; document.addEventListener('pointerup', g3end); document.addEventListener('pointercancel', g3end);
document.addEventListener('keydown', e => { if(e.key === 'Escape' && S.graphFs != null){ S.graphFs = null; render(true); } });
window.addEventListener('resize', () => { if(S.graphFs != null) g3draw(S.graphFs); });
const blocksHtml = (bl, markup) => bl.map((b, i) => (b.part && (i === 0 || bl[i - 1].part !== b.part) ? '<p class="secname">Part (' + esc(b.part) + ')</p>' : '') + (b.type === 'ink' ? (markup ? inkBody(b, i, true) : '<div class="inkshow">' + inkSvg(b) + '</div>') : b.type === 'graph' ? '<div class="graph">' + plot(b) + '</div>' : '<p class="tb tbshow tb-' + (b.bg || 'white') + '" style="margin:0;white-space:pre-wrap;color:var(--pen-' + b.color + ');' + fmtCss(b) + '">' + esc(b.text) + '</p>')).join('');

/* ---------- text formatting ---------- */
const FONTS = [['','App default'],['sans','Sans'],['serif','Serif'],['mono','Monospace'],['hand','Handwritten']];
const FSIZES = [['','App default'],['s','Small'],['m','Medium'],['l','Large'],['xl','Extra large']];
const TBG = [['white','White'],['tan','Tan'],['black','Black']];
const FONTCSS = {sans:'var(--text)', serif:"Georgia,'Iowan Old Style','Times New Roman',serif", mono:"ui-monospace,'SF Mono',Menlo,Consolas,monospace", hand:'var(--hand)'}, SIZECSS = {s:'14px', m:'17px', l:'21px', xl:'26px'};
const fmtCss = o => (o && o.font ? 'font-family:' + FONTCSS[o.font] + ';' : '') + (o && o.size ? 'font-size:' + SIZECSS[o.size] + ';' : '') + (o && o.bold ? 'font-weight:700;' : '') + (o && o.ital ? 'font-style:italic;' : '');
const fmtBar = (o, at, withBg) => '<div class="row fmtbar"><label class="bgpick">Font<select data-fmt="font" ' + at + '>' + FONTS.map(x => '<option value="' + x[0] + '"' + ((o.font || '') === x[0] ? ' selected' : '') + '>' + x[1] + '</option>').join('') + '</select></label><label class="bgpick">Size<select data-fmt="size" ' + at + '>' + FSIZES.map(x => '<option value="' + x[0] + '"' + ((o.size || '') === x[0] ? ' selected' : '') + '>' + x[1] + '</option>').join('') + '</select></label><button type="button" class="tool fb" data-act="fmt" data-k="bold" ' + at + ' aria-pressed="' + !!o.bold + '" aria-label="Bold"><b>B</b></button><button type="button" class="tool fb" data-act="fmt" data-k="ital" ' + at + ' aria-pressed="' + !!o.ital + '" aria-label="Italic"><i>I</i></button>' + (withBg ? '<label class="bgpick">Background<select data-fmt="bg" ' + at + '>' + TBG.map(x => '<option value="' + x[0] + '"' + ((o.bg || 'white') === x[0] ? ' selected' : '') + '>' + x[1] + '</option>').join('') + '</select></label>' : '') + '<button type="button" class="tool" data-symopen="1" aria-label="Math symbols" title="Math symbols">∑</button></div>';
const fmtOf = el => el.dataset.b != null ? (S.pw && S.pw.blocks[+el.dataset.b]) : (S.noteFmt = S.noteFmt || {});
document.addEventListener('change', e => { const k = e.target.dataset && e.target.dataset.fmt; if(!k) return; const o = fmtOf(e.target); if(!o) return; o[k] = e.target.value; if(e.target.dataset.b != null) render(true); else sheet(); });
const parseParts = str => { const out = []; String(str || '').replace(/[()]/g, '').split(/[,;\s]+/).filter(Boolean).forEach(t => { const m = t.match(/^([a-z])\s*[-–]\s*([a-z])$/i), n = /^\d+$/.test(t) ? +t : 0; if(m){ for(let c = m[1].toLowerCase().charCodeAt(0); c <= m[2].toLowerCase().charCodeAt(0); c++) out.push(String.fromCharCode(c)); } else if(n > 1 && n <= 26){ for(let c = 0; c < n; c++) out.push(String.fromCharCode(97 + c)); } else out.push(t); }); return out.filter((v, i, a) => a.indexOf(v) === i).slice(0, 26); };
const PMARKS = [['right','Correct'],['wrong','Incorrect'],['skip','Not attempted']];
const partsBar = (w, p) => '<div class="stack" style="gap:6px"><div class="row inkbar" role="tablist" aria-label="Parts">' + (w.only || p.parts).map(l => { const has = w.blocks.some(b => b.part === l && (b.type === 'ink' ? b.strokes.length : b.type === 'text' ? b.text.trim() : (b.expr || '').trim())) || (w.pans[l] || '').trim(); return '<button type="button" class="tool" data-act="wpart" data-p="' + esc(l) + '" aria-pressed="' + (w.part === l) + '">(' + esc(l) + ')' + (has ? ' ·' : '') + '</button>'; }).join('') + '</div><label class="f" for="pans">Answer for part (' + esc(w.part) + ')<input type="text" id="pans" data-pans="1" value="' + esc(w.pans[w.part] || '') + '"></label><p class="small">Working below belongs to part (' + esc(w.part) + '). A dot marks parts you have started.' + (w.only ? ' This retry covers only the parts that went wrong last time.' : '') + '</p></div>';
const partsReview = w => '<div class="plist" style="max-width:none">' + w.partRes.map((r, k) => '<div class="partrow"><div class="row" style="gap:10px"><b>(' + esc(r.label) + ')</b><span>' + (r.answer ? esc(r.answer) : '<span class="soft">no answer written</span>') + '</span></div>' + opts('pmark', 'm', PMARKS, r.mark).replace(/data-act="pmark"/g, 'data-act="pmark" data-k="' + k + '"') + '<label class="f" for="pfix_' + k + '">Correction for (' + esc(r.label) + '), if any<input type="text" class="redin" id="pfix_' + k + '" data-pfix="' + k + '" value="' + esc(r.fix || '') + '"></label></div>').join('') + '</div>';
const partsShow = rs => '<div class="hist parts">' + rs.map(r => '<span>(' + esc(r.label) + ') ' + (r.answer ? esc(r.answer) : '—') + '</span><span>' + esc(r.mark ? PMARKS.find(x => x[0] === r.mark)[1] : 'Not marked') + (r.fix ? ' <span style="color:var(--red)">· ' + esc(r.fix) + '</span>' : '') + '</span>').join('') + '</div>';
const newBlock0 = (w, t) => t === 'ink' ? {type:'ink', color:'blue', w:'2.6', h:560, strokes:[], undo:[]} : t === 'graph' ? {type:'graph', color:'blue', expr:'', xmin:'0', xmax:'6'} : {type:'text', color:(w.blocks.filter(b => b.type === 'text').slice(-1)[0] || {color:'blue'}).color, text:''};
const newBlock = (w, t) => Object.assign(newBlock0(w, t), w.part ? {part:w.part} : {});
function graphBody(b, i){
  const fs = S.graphFs === i, d3 = b.dim === '3d', at = 'data-block="' + i + '"', num = (k, label) => '<label class="f nar" for="b_' + i + '_' + k + '">' + label + '<input type="text" inputmode="decimal" id="b_' + i + '_' + k + '" ' + at + ' data-f="' + k + '" value="' + esc(b[k] != null ? b[k] : '') + '"></label>';
  return '<div class="graphbox' + (fs ? ' fs' : '') + '"><div class="row inkbar">' + [['2d','2D'],['3d','3D surface']].map(x => '<button type="button" class="tool" data-act="gdim" data-b="' + i + '" data-d="' + x[0] + '" aria-pressed="' + ((b.dim || '2d') === x[0]) + '">' + x[1] + '</button>').join('') + (d3 ? '<button type="button" class="btn link mini" data-act="g3reset" data-b="' + i + '">Reset view</button>' : '') + '<span class="grow"></span><button type="button" class="tool" data-act="graphfs" data-b="' + i + '" aria-pressed="' + fs + '">' + (fs ? 'Exit full screen' : 'Full screen') + '</button></div>' +
    '<div class="graphin"><label class="f" for="b_' + i + '_expr">' + (d3 ? 'z =' : 'y =') + '<input type="text" id="b_' + i + '_expr" ' + at + ' data-f="expr" value="' + esc(b.expr) + '" placeholder="' + (d3 ? 'sin(x)*cos(y)' : 'x*exp(-x)') + '" autocapitalize="off" autocomplete="off"></label>' + num('xmin', 'x from') + num('xmax', 'to') + (d3 ? num('ymin', 'y from') + num('ymax', 'to') : '') + '</div>' +
    '<div class="graph' + (d3 ? ' g3' : '') + '" id="g_' + i + '"' + (d3 ? ' data-g3="' + i + '"' : '') + '>' + plot(b, graphSize(i)) + '</div></div>';
}
function blocksEdit(w){
  const at = S.addAt, chooser = '<div class="row addhere"><span class="small">Add here:</span>' + [['text','Text'],['ink','Handwriting'],['graph','Graph']].map(x => '<button type="button" class="btn mini" data-act="baddpick" data-t="' + x[0] + '">' + x[1] + '</button>').join('') + '<button type="button" class="btn link mini" data-act="baddcancel">Cancel</button></div>';
  return w.blocks.map((b, i) => (w.part && b.part !== w.part) ? '' : (at && at.i === i && at.pos === 0 ? chooser : '') + '<div class="blk"><div class="row blkbar"><span class="small">' + (b.type === 'graph' ? 'Graph' : b.type === 'ink' ? 'Handwriting' : 'Pen') + '</span>' + (b.type === 'ink' ? '' : swatches('bcolor', 'data-b="' + i + '"', b.color)) + '<span class="grow"></span><button class="btn link mini" data-act="baddat" data-b="' + i + '" data-pos="0">+ Above</button><button class="btn link mini" data-act="baddat" data-b="' + i + '" data-pos="1">+ Below</button>' + (w.blocks.length > 1 ? (i > 0 ? '<button class="btn link mini" data-act="bmove" data-b="' + i + '" data-d="-1" aria-label="Move this block up">↑</button>' : '') + (i < w.blocks.length - 1 ? '<button class="btn link mini" data-act="bmove" data-b="' + i + '" data-d="1" aria-label="Move this block down">↓</button>' : '') + '<button class="btn link mini" data-act="bdel" data-b="' + i + '">Remove</button>' : '') + '</div>' +
    (b.type === 'text' ? fmtBar(b, 'data-b="' + i + '"', true) + '<textarea class="blk-t tb tb-' + (b.bg || 'white') + '" id="b_' + i + '_text" aria-label="Working" data-block="' + i + '" style="color:var(--pen-' + b.color + ');' + fmtCss(b) + '" placeholder="Start anywhere. No section is required.">' + esc(b.text) + '</textarea>'
    : b.type === 'ink' ? inkBody(b, i, false) : graphBody(b, i)) + '</div>' + (at && at.i === i && at.pos === 1 ? chooser : '')).join('') +
    '<div class="row"><button class="btn" data-act="badd" data-t="text">+ Text</button><button class="btn" data-act="badd" data-t="ink">+ Handwriting</button><button class="btn" data-act="badd" data-t="graph">+ Graph</button></div><p class="small">These add at the end. Use “+ Above” or “+ Below” on any block to add next to it, and the arrows to reorder. Each block has its own pen colour. Red is kept for corrections. A graph plots up to three functions of x, separated by commas, or a 3D surface z = f(x, y) that you can drag to rotate. A handwriting block takes your stylus.</p>';
}
const inboxItem = (x, p) => x.type === 'set' ? '<div class="stack" style="gap:6px"><img class="inthumb" src="' + x.src + '" alt=""><p class="small">' + esc(x.kind) + '</p><div class="row"><button class="btn" data-act="impopen" data-id="' + x.id + '">Split into problems</button><button class="btn link mini" data-act="impdrop" data-id="' + x.id + '">Remove</button></div></div>' : '<div class="stack" style="gap:6px">' + (x.type === 'multi' ? '<div class="thumbs">' + x.shots.map((k, i) => '<div class="row" style="gap:8px;flex-wrap:nowrap"><div class="thumb" style="flex:1;min-height:44px">Screenshot ' + k + ' (simulated)</div>' + (i ? '<button class="btn link mini" data-act="ishot" data-id="' + x.id + '" data-i="' + i + '">Move up</button>' : '') + '</div>').join('') + '</div>' : '<div class="thumb">' + esc(x.kind) + ' (simulated)</div>') + '<p class="small">' + esc(x.from) + '</p>' +
  (x.type === 'multi' ? '<p class="small">Tesseract found one exercise, Ex. 7.12, running across all three. Put them in reading order.</p><button class="btn" data-act="ifile" data-id="' + x.id + '">Combine into one problem</button>'
  : x.type === 'book' ? '<p class="small">Tesseract found Ex. 5.3 and Ex. 5.4.</p><button class="btn" data-act="ifile" data-id="' + x.id + '">File as 2 problems</button>'
  : '<button class="btn" data-act="idecl" data-id="' + x.id + '">File as working for ' + esc(p.loc.split(', ').pop()) + '</button>') + '</div>';
const startBox = (p, A) => '<div class="row"><button class="btn link mini" data-act="probedit">Edit this problem</button></div>' + section('Start an attempt', (S.retryParts && S.retryParts.problem === p.id ? '<p><b>This retry covers ' + (S.retryParts.parts.length === 1 ? 'part ' : 'parts ') + S.retryParts.parts.map(l => '(' + esc(l) + ')').join(', ') + ' only.</b> <button class="btn link mini" data-act="retryall">Do every part instead</button></p>' : '') + opts('pmode','m',MODES,S.pmode) + '<p class="small">' + MODENOTE[S.pmode] + '</p><div class="row"><button class="btn primary" data-act="pstart">Start attempt ' + (A.length + 1) + '</button></div>');
/* ---------- handwriting ---------- */
const INKW = [['1.6','Fine',10],['2.6','Medium',18],['4.2','Bold',30]];
const INKT = [['pen','Pen'],['eraser','Eraser'],['select','Select'],['line','Line'],['arrow','Arrow'],['rect','Box'],['ellipse','Ellipse']];
const INKPENS = [['red','Red','#e60023','#e60023'],['orange','Orange','#ff7a00','#ff7a00'],['yellow','Yellow','#ffd000','#ffd000'],['green','Green','#00a84f','#00a84f'],['blue','Blue','#0a5cff','#0a5cff'],['indigo','Indigo','#4b1fd1','#4b1fd1'],['violet','Violet','#a020f0','#a020f0'],['black','Black','#000000','#000000'],['white','White','#ffffff','#ffffff']];
const INKOLD = {purple:'violet', teal:'green', pink:'red', brown:'orange', grey:'black'};
const INKBG = [['blue','Blue grid','#fbfcff','#c3d5ee',0],['green','Green grid','#f8fcf7','#b9dcc2',0],['white','Whiteboard','#ffffff',null,0],['black','Blackboard','#050505',null,1],['screen','Screen',null,null,0]];
function inkBgOf(b){
  const d = INKBG.find(x => x[0] === (b.bg || 'blue')) || INKBG[0]; if(d[2]) return {fill:d[2], grid:d[3], dark:!!d[4]};
  const el = document.querySelector('.pg') || document.body, col = getComputedStyle(el).backgroundColor, m = (col.match(/[\d.]+/g) || []).map(Number), k = /^rgb/.test(col) ? 255 : 1;
  return {fill:col, grid:null, dark:m.length >= 3 && (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / k < 0.45};
}
const inkHex = (c, dark) => { const p = INKPENS.find(x => x[0] === (INKOLD[c] || c)) || INKPENS[4]; return dark ? p[3] : p[2]; };
const inkSelRow = (b, markup) => { const n = (b.sel || []).length; return (b.tool === 'select') ? '<span class="small">' + (n ? plural(n, 'stroke') + ' selected. Drag to move' + (markup ? '.' : ', or tap a colour to recolour.') : 'Drag a box around strokes to select them.') + '</span>' + (n ? '<button class="btn link mini" data-act="inkdel">Delete selected</button>' : '') : ''; };
const inkVW = b => b.vw || 1000;
function inkFit(b, fs){ const z = Math.min(1, b.zoom || 1); b.vw = Math.max(inkVW(b), Math.ceil(1000 / z)); const ratio = fs ? Math.max(window.innerHeight, screen.height || 0) / Math.max(320, window.innerWidth) : 0.56; b.h = Math.max(b.h, Math.ceil(1000 * ratio / z)); }
const inkCss = b => ((b.zoom || 1) * inkVW(b) / 10) + '%';
function inkBody(b, i, markup){
  const at = 'data-b="' + i + '"', tool = b.tool || 'pen', z = b.zoom || 1, fs = S.inkFs === i, bg = inkBgOf(b), fingerScrolls = S.penSeen && !S.fingerDraw;
  const bars = '<div class="row inkbar">' + INKT.map(t => '<button type="button" class="tool' + (t[0] === 'eraser' ? ' er' : '') + '" data-act="inktool" ' + at + ' data-t="' + t[0] + '" aria-pressed="' + (tool === t[0]) + '">' + t[1] + '</button>').join('') + '<button type="button" class="tool" data-symopen="1" data-b="' + i + '" aria-label="Math symbols" title="Math symbols">∑</button>' + (fs ? '' : '<span class="grow"></span><button type="button" class="tool" data-act="inkfs" ' + at + ' aria-pressed="false">Full screen</button>') + '</div>' +
    '<div class="row inkbar">' + (markup ? '<span class="small" style="color:var(--red)">Marking up in red</span>' : '<span class="sws">' + INKPENS.map(c => '<button type="button" class="sw' + (b.color === c[0] ? ' on' : '') + '" style="--pc:' + (bg.dark ? c[3] : c[2]) + '" data-act="bcolor" ' + at + ' data-c="' + c[0] + '" aria-label="' + c[1] + ' pen" aria-pressed="' + (b.color === c[0]) + '"></button>').join('') + '</span>') +
    INKW.map(w => '<button type="button" class="opt" data-act="inkw" ' + at + ' data-w="' + w[0] + '" aria-pressed="' + ((b.w || '2.6') === w[0]) + '">' + w[1] + '</button>').join('') + '</div>' +
    '<div class="row inkbar"><button class="btn link mini" data-act="inkundo" ' + at + '>Undo</button>' + (markup ? '' : '<button class="btn link mini" data-act="inkclear" ' + at + '>Clear</button>') + '<button class="btn link mini" data-act="inkmore" ' + at + '>More space</button>' +
    '<span class="zoomer"><button type="button" class="tool" data-act="inkzoom" ' + at + ' data-d="-1" aria-label="Zoom out">−</button><button type="button" class="tool" data-act="inkzoom" ' + at + ' data-d="0" id="inkz_' + i + '" aria-label="Reset zoom">' + Math.round(z * 100) + '%</button><button type="button" class="tool" data-act="inkzoom" ' + at + ' data-d="1" aria-label="Zoom in">+</button></span>' +
    '<label class="bgpick" for="inkbg_' + i + '">Background<select id="inkbg_' + i + '" data-inkbg="' + i + '">' + INKBG.map(x => '<option value="' + x[0] + '"' + ((b.bg || 'blue') === x[0] ? ' selected' : '') + '>' + x[1] + '</option>').join('') + '</select></label>' +
    '<button class="btn link mini" data-act="inkfinger">' + (fingerScrolls ? 'Finger scrolls' : 'Finger draws') + '</button>' + (markup ? '' : '<button class="btn link mini" data-act="inktext" ' + at + '>Convert to text</button>') + '</div>' +
    '<div class="row inkbar" id="inksel_' + i + '" ' + at + '>' + inkSelRow(b, markup) + '</div>', wrap = '<div class="inkwrap" data-wrap="' + i + '"><canvas class="ink" data-ink="' + i + '"' + (markup ? ' data-markup="1"' : '') + ' style="width:' + inkCss(b) + ';aspect-ratio:' + inkVW(b) + ' / ' + b.h + '" aria-label="Handwriting area"></canvas></div>', open = '<div class="inkbox' + (fs ? ' fs' : '') + '" ' + at + '>';
  if(!fs) return open + bars + wrap + '</div>';
  return open + wrap + '<div class="fspill"><button type="button" class="tool" data-symopen="1" data-b="' + i + '" aria-label="Math symbols" title="Math symbols">∑</button><button type="button" class="tool" data-act="inkfstools" aria-expanded="' + !!S.inkFsTools + '">' + (S.inkFsTools ? 'Hide tools' : 'Tools') + '</button><button type="button" class="tool" data-act="inkfs" ' + at + '>Exit</button></div>' + (S.inkFsTools ? '<div class="fspanel">' + bars + '</div>' : '') + '</div>';
}
function inkSvg(b){
  const bg = inkBgOf(b); let maxY = 60, maxX = 0; const paths = b.strokes.map(s => { const p = s.pts, col = inkHex(s.c, bg.dark); let wsum = 0; p.forEach(q => { wsum += 0.5 + q[2]; if(q[1] > maxY) maxY = q[1]; if(q[0] > maxX) maxX = q[0]; }); const lw = (s.w * wsum / p.length).toFixed(2);
    if(s.txt) return '<text x="' + p[0][0] + '" y="' + (p[0][1] + s.size * 0.8).toFixed(1) + '" font-size="' + s.size + '" fill="' + col + '" style="font-family:' + INKFONT.replace(/"/g, '') + '">' + esc(s.txt) + '</text>';
    return p.length === 1 ? '<circle cx="' + p[0][0] + '" cy="' + p[0][1] + '" r="' + (lw / 2 + 0.4).toFixed(2) + '" fill="' + col + '"/>' : '<path d="M' + p.map(q => q[0] + ' ' + q[1]).join('L') + '" fill="none" stroke="' + col + '" stroke-width="' + lw + '" stroke-linecap="round" stroke-linejoin="round"/>'; }).join('');
  const H = Math.min(b.h, Math.ceil(maxY + 30));
  const VW = Math.max(1000, Math.min(inkVW(b), Math.ceil(maxX + 30)));
  return '<svg viewBox="0 0 ' + VW + ' ' + H + '" role="img" aria-label="Handwritten working"><rect width="' + VW + '" height="' + H + '" rx="8" fill="' + ((b.bg || 'blue') === 'screen' ? 'var(--paper)' : bg.fill) + '"/>' + paths + '</svg>';
}
const INKFONT = '"STIX Two Math","Cambria Math","Noto Sans Math","Apple Symbols","Segoe UI Symbol",serif';
let inkCur = null, inkTimer = null; const inkTouch = new Map();
const inkBlock = cv => S.pw && S.pw.blocks[+cv.dataset.ink];
function inkSeg(ctx, s, col, from){
  const p = s.pts; ctx.strokeStyle = col; ctx.fillStyle = col;
  if(s.txt){ ctx.font = s.size + 'px ' + INKFONT; ctx.textBaseline = 'alphabetic'; ctx.fillText(s.txt, p[0][0], p[0][1] + s.size * 0.8); return; }
  if(p.length === 1){ ctx.beginPath(); ctx.arc(p[0][0], p[0][1], s.w * (0.5 + p[0][2]) / 2 + 0.4, 0, 6.2832); ctx.fill(); return; }
  for(let j = Math.max(1, from || 1); j < p.length; j++){ ctx.lineWidth = s.w * (0.5 + (p[j][2] + p[j - 1][2]) / 2); ctx.beginPath(); ctx.moveTo(p[j - 1][0], p[j - 1][1]); ctx.lineTo(p[j][0], p[j][1]); ctx.stroke(); }
}
function inkBox(b, sel){ let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; sel.forEach(k => { const s = b.strokes[k]; if(s) s.pts.forEach(q => { if(q[0] < x0) x0 = q[0]; if(q[0] > x1) x1 = q[0]; if(q[1] < y0) y0 = q[1]; if(q[1] > y1) y1 = q[1]; }); }); return [x0 - 10, y0 - 10, x1 + 10, y1 + 10]; }
function inkDash(ctx, r, col){ ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.setLineDash([7, 6]); ctx.strokeRect(Math.min(r[0], r[2]), Math.min(r[1], r[3]), Math.abs(r[2] - r[0]), Math.abs(r[3] - r[1])); ctx.restore(); }
function inkDraw(cv, extra){
  const b = inkBlock(cv), wCss = cv.clientWidth; if(!b || !wCss) return; const VW = inkVW(b);
  let sc = Math.min(window.devicePixelRatio || 1, 2.5); while(wCss * sc * wCss * sc * b.h / VW > 12e6) sc *= 0.85;
  const W = Math.round(wCss * sc), H = Math.round(wCss * sc * b.h / VW); if(cv.width !== W || cv.height !== H){ cv.width = W; cv.height = H; }
  const ctx = cv.getContext('2d'), k = cv.width / VW, bg = inkBgOf(b), guide = bg.dark ? '#c9d2cd' : '#5d6570';
  ctx.setTransform(k, 0, 0, k, 0, 0); ctx.fillStyle = bg.fill; ctx.fillRect(0, 0, VW, b.h + 2);
  if(bg.grid){ ctx.strokeStyle = bg.grid; ctx.lineWidth = 1 / Math.max(1, k * 0.9); ctx.beginPath(); for(let x = 40; x < VW; x += 40){ ctx.moveTo(x, 0); ctx.lineTo(x, b.h); } for(let y = 40; y < b.h; y += 40){ ctx.moveTo(0, y); ctx.lineTo(VW, y); } ctx.stroke(); }
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  b.strokes.forEach(s => inkSeg(ctx, s, inkHex(s.c, bg.dark)));
  if(extra && extra.stroke) inkSeg(ctx, extra.stroke, inkHex(extra.stroke.c, bg.dark));
  if((b.sel || []).length) inkDash(ctx, inkBox(b, b.sel), guide);
  if(extra && extra.rect) inkDash(ctx, extra.rect, guide);
  if(extra && extra.circle){ ctx.save(); ctx.strokeStyle = guide; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(extra.circle[0], extra.circle[1], extra.circle[2], 0, 6.2832); ctx.stroke(); ctx.restore(); }
}
function initInk(){ document.querySelectorAll('canvas.ink').forEach(cv => { inkDraw(cv); const b = inkBlock(cv); if(b){ cv.parentNode.scrollLeft = b.sx || 0; if(S.inkFs === +cv.dataset.ink) cv.parentNode.scrollTop = b.sy || 0; } }); }
const inkPt = (cv, e, t0) => { const r = cv.getBoundingClientRect(), k = inkVW(inkBlock(cv) || {}) / r.width; return [+((e.clientX - r.left) * k).toFixed(1), +((e.clientY - r.top) * k).toFixed(1), e.pointerType === 'pen' ? +(e.pressure || 0.5).toFixed(2) : 0.5, Math.max(0, Math.round(e.timeStamp - t0))]; };
function inkShape(kind, a, z, c, w, fix){
  let x0 = a[0], y0 = a[1], x1 = z[0], y1 = z[1]; const pts = [];
  const seg = (ax, ay, bx, by) => { const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / 12)); for(let j = (pts.length ? 1 : 0); j <= n; j++) pts.push([+(ax + (bx - ax) * j / n).toFixed(1), +(ay + (by - ay) * j / n).toFixed(1), 0.5]); };
  if(kind === 'line' || kind === 'arrow'){ if(Math.abs(y1 - y0) < Math.abs(x1 - x0) * 0.07) y1 = y0; else if(Math.abs(x1 - x0) < Math.abs(y1 - y0) * 0.07) x1 = x0; seg(x0, y0, x1, y1);
    if(kind === 'arrow'){ const len = Math.hypot(x1 - x0, y1 - y0), L = Math.min(30, len * 0.4), an = Math.atan2(y1 - y0, x1 - x0); seg(x1, y1, x1 - L * Math.cos(an - 0.45), y1 - L * Math.sin(an - 0.45)); seg(x1 - L * Math.cos(an - 0.45), y1 - L * Math.sin(an - 0.45), x1, y1); seg(x1, y1, x1 - L * Math.cos(an + 0.45), y1 - L * Math.sin(an + 0.45)); } }
  else if(kind === 'rect'){ seg(x0, y0, x1, y0); seg(x1, y0, x1, y1); seg(x1, y1, x0, y1); seg(x0, y1, x0, y0); }
  else { const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, rx = Math.abs(x1 - x0) / 2, ry = Math.abs(y1 - y0) / 2, n = Math.max(24, Math.ceil((rx + ry) / 4)); for(let j = 0; j <= n; j++) pts.push([+(cx + rx * Math.cos(6.2832 * j / n)).toFixed(1), +(cy + ry * Math.sin(6.2832 * j / n)).toFixed(1), 0.5]); }
  return {c:c, w:w, pts:pts, fix:fix, shape:kind};
}
function inkErase(b, p, R, markup){
  const R2 = R * R, hit = q => (q[0] - p[0]) * (q[0] - p[0]) + (q[1] - p[1]) * (q[1] - p[1]) < R2, out = []; let changed = false;
  b.strokes.forEach(s => { if(markup && !s.fix){ out.push(s); return; } let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; s.pts.forEach(q => { if(q[0] < x0) x0 = q[0]; if(q[0] > x1) x1 = q[0]; if(q[1] < y0) y0 = q[1]; if(q[1] > y1) y1 = q[1]; }); if(p[0] < x0 - R || p[0] > x1 + R || p[1] < y0 - R || p[1] > y1 + R){ out.push(s); return; }
    const step = Math.max(3, R / 3), dense = []; s.pts.forEach((q, j) => { if(j){ const a = s.pts[j - 1], n = Math.ceil(Math.hypot(q[0] - a[0], q[1] - a[1]) / step); for(let k = 1; k < n; k++) dense.push([+(a[0] + (q[0] - a[0]) * k / n).toFixed(1), +(a[1] + (q[1] - a[1]) * k / n).toFixed(1), a[2], a[3]]); } dense.push(q); });
    if(!dense.some(hit)){ out.push(s); return; } changed = true; if(s.txt) return; let seg = []; dense.forEach(q => { if(hit(q)){ if(seg.length > 1) out.push(Object.assign({}, s, {pts:seg})); seg = []; } else seg.push(q); }); if(seg.length > 1) out.push(Object.assign({}, s, {pts:seg})); });
  if(changed){ b.strokes = out; b.sel = []; } return changed;
}
function inkSetZoom(cv, b, z){ b.zoom = Math.max(0.5, Math.min(4, z)); inkFit(b, S.inkFs === +cv.dataset.ink); cv.style.width = inkCss(b); cv.style.aspectRatio = inkVW(b) + ' / ' + b.h; const lab = $('inkz_' + cv.dataset.ink); if(lab) lab.textContent = Math.round(b.zoom * 100) + '%'; }
document.addEventListener('pointerdown', e => {
  const cv = e.target.closest ? e.target.closest('canvas.ink') : null, b = cv && inkBlock(cv); if(!b) return;
  if(e.pointerType === 'pen') S.penSeen = true;
  if(symArm){ e.preventDefault(); const mk = !!cv.dataset.markup, t = symArm.t, size = ({'1.6':30, '2.6':44, '4.2':60})[String(b.w || '2.6')] || 44, q = inkPt(cv, e, e.timeStamp), cx = cv.getContext('2d'); cx.save(); cx.setTransform(1, 0, 0, 1, 0, 0); cx.font = size + 'px ' + INKFONT; const wd = Math.max(size * 0.4, cx.measureText(t).width); cx.restore();
    const x0 = +(q[0] - wd / 2).toFixed(1), y0 = +(q[1] - size * 0.5).toFixed(1); b.undo = (b.undo || []).concat([b.strokes.slice()]).slice(-40); b.strokes.push({c:mk ? 'red' : b.color, w:+(b.w || 2.6), pts:[[x0, y0, 0.5, 0], [+(x0 + wd).toFixed(1), +(y0 + size).toFixed(1), 0.5, 0]], txt:t, size:size, fix:mk || undefined}); const nm = symArm.name; symArm = null; inkDraw(cv); const say = $('symsay'); if(say) say.textContent = 'Placed ' + nm + '. Use Select to move it.'; return; }
  if(e.pointerType === 'touch'){ inkTouch.set(e.pointerId, [e.clientX, e.clientY]);
    if(inkTouch.size === 2){ if(inkCur && !inkCur.scroll && !inkCur.pinch && inkCur.b.undo) inkCur.b.undo.pop(); const t = Array.from(inkTouch.values()); inkCur = {pinch:true, cv:cv, b:b, d0:Math.hypot(t[0][0] - t[1][0], t[0][1] - t[1][1]) || 1, z0:b.zoom || 1}; inkDraw(cv); return; }
    if(S.penSeen && !S.fingerDraw){ inkCur = {scroll:true, cv:cv, b:b, x:e.clientX, y:e.clientY, id:e.pointerId}; return; } }
  e.preventDefault(); try{ cv.setPointerCapture(e.pointerId); }catch(err){}
  const markup = !!cv.dataset.markup, tool = (e.pointerType === 'pen' && (e.buttons & 32) === 32) ? 'eraser' : (b.tool || 'pen'), c = markup ? 'red' : b.color, t0 = e.timeStamp, p = inkPt(cv, e, t0);
  const snap = () => { b.undo = (b.undo || []).concat([b.strokes.slice()]).slice(-40); };
  inkCur = {cv:cv, b:b, id:e.pointerId, tool:tool, markup:markup, t0:t0, c:c, col:inkHex(c, inkBgOf(b).dark), p0:p, last:p, R:(INKW.find(w => w[0] === String(b.w || '2.6')) || INKW[1])[2]};
  if(tool === 'select'){ const sel = b.sel || []; if(sel.length){ const r = inkBox(b, sel); if(p[0] >= r[0] && p[0] <= r[2] && p[1] >= r[1] && p[1] <= r[3]){ inkCur.mode = 'move'; snap(); return; } } inkCur.mode = 'marq'; b.sel = []; inkDraw(cv); return; }
  snap();
  if(tool === 'pen'){ inkCur.s = {c:c, w:+(b.w || 2.6), pts:[], fix:markup || undefined}; inkAdd(e); }
  else if(tool === 'eraser') inkAdd(e);
});
function inkAdd(e){
  const c = inkCur, evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [];
  (evs.length ? evs : [e]).forEach(ev => { const p = inkPt(c.cv, ev, c.t0);
    if(c.tool === 'eraser'){ const n = Math.max(1, Math.ceil(Math.hypot(p[0] - c.last[0], p[1] - c.last[1]) / (c.R / 2))); for(let j = 1; j <= n; j++) if(inkErase(c.b, [c.last[0] + (p[0] - c.last[0]) * j / n, c.last[1] + (p[1] - c.last[1]) * j / n], c.R, c.markup)) c.erased = true; c.last = p; }
    else { c.last = p; c.s.pts.push(p); inkSeg(c.cv.getContext('2d'), c.s, c.col, c.s.pts.length - 1); } });
  if(c.tool === 'eraser') inkDraw(c.cv, {circle:[c.last[0], c.last[1], c.R]});
}
document.addEventListener('pointermove', e => {
  const c = inkCur; if(!c) return;
  if(c.pinch){ if(!inkTouch.has(e.pointerId)) return; inkTouch.set(e.pointerId, [e.clientX, e.clientY]); const t = Array.from(inkTouch.values()); if(t.length === 2) inkSetZoom(c.cv, c.b, c.z0 * Math.hypot(t[0][0] - t[1][0], t[0][1] - t[1][1]) / c.d0); return; }
  if(e.pointerId !== c.id) return;
  if(c.scroll){ const wrap = c.cv.parentNode; wrap.scrollLeft += c.x - e.clientX; if(S.inkFs === +c.cv.dataset.ink) wrap.scrollTop += c.y - e.clientY; else $('main').scrollTop += c.y - e.clientY; c.x = e.clientX; c.y = e.clientY; return; }
  e.preventDefault();
  if(c.tool === 'pen' || c.tool === 'eraser'){ inkAdd(e); return; }
  const p = inkPt(c.cv, e, c.t0);
  if(c.mode === 'marq'){ c.last = p; inkDraw(c.cv, {rect:[c.p0[0], c.p0[1], p[0], p[1]]}); }
  else if(c.mode === 'move'){ const dx = p[0] - c.last[0], dy = p[1] - c.last[1]; c.last = p; c.moved = true; c.b.sel.forEach(k => { const s = c.b.strokes[k]; c.b.strokes[k] = Object.assign({}, s, {pts:s.pts.map(q => [+(q[0] + dx).toFixed(1), +(q[1] + dy).toFixed(1), q[2], q[3]])}); }); inkDraw(c.cv); }
  else { c.last = p; c.s = inkShape(c.tool, c.p0, p, c.c, +(c.b.w || 2.6), c.markup || undefined); inkDraw(c.cv, {stroke:c.s}); }
}, {passive:false});
const inkEnd = e => {
  inkTouch.delete(e.pointerId);
  const c = inkCur; if(!c) return;
  if(c.pinch){ if(inkTouch.size < 2){ inkCur = null; inkDraw(c.cv); } return; }
  if(e.pointerId !== c.id) return; inkCur = null; if(c.scroll) return;
  setTimeout(() => { let my = 0; c.b.strokes.forEach(s => s.pts.forEach(q => { if(q[1] > my) my = q[1]; })); if(my > c.b.h - 30){ c.b.h = Math.ceil(my + 240); render(true); } }, 0);
  if(c.tool === 'pen'){ if(c.s.pts.length) c.b.strokes.push(c.s); }
  else if(c.tool === 'eraser'){ if(!c.erased) c.b.undo.pop(); inkDraw(c.cv); }
  else if(c.mode === 'marq'){ const x0 = Math.min(c.p0[0], c.last[0]), x1 = Math.max(c.p0[0], c.last[0]), y0 = Math.min(c.p0[1], c.last[1]), y1 = Math.max(c.p0[1], c.last[1]); c.b.sel = []; c.b.strokes.forEach((s, k) => { if((!c.markup || s.fix) && s.pts.some(q => q[0] >= x0 && q[0] <= x1 && q[1] >= y0 && q[1] <= y1)) c.b.sel.push(k); }); inkDraw(c.cv); const row = $('inksel_' + c.cv.dataset.ink); if(row) row.innerHTML = inkSelRow(c.b, c.markup); }
  else if(c.mode === 'move'){ if(!c.moved) c.b.undo.pop(); }
  else if(c.s && Math.hypot(c.last[0] - c.p0[0], c.last[1] - c.p0[1]) > 6){ c.b.strokes.push(c.s); inkDraw(c.cv); }
  else { c.b.undo.pop(); inkDraw(c.cv); }
};
document.addEventListener('pointerup', inkEnd); document.addEventListener('pointercancel', inkEnd);
document.addEventListener('scroll', e => { const t = e.target; if(t && t.dataset && t.dataset.wrap !== undefined && S.pw && S.pw.blocks[+t.dataset.wrap]){ S.pw.blocks[+t.dataset.wrap].sx = t.scrollLeft; S.pw.blocks[+t.dataset.wrap].sy = t.scrollTop; } }, true);
document.addEventListener('change', e => { const i = e.target.dataset && e.target.dataset.inkbg; if(i !== undefined && S.pw && S.pw.blocks[+i]){ S.pw.blocks[+i].bg = e.target.value; render(true); } });
document.addEventListener('wheel', e => { const cv = e.target.closest ? e.target.closest('canvas.ink') : null; if(!cv || !(e.ctrlKey || e.metaKey)) return; const b = inkBlock(cv); if(!b) return; e.preventDefault(); inkSetZoom(cv, b, (b.zoom || 1) * (e.deltaY < 0 ? 1.1 : 1 / 1.1)); clearTimeout(inkTimer); inkTimer = setTimeout(initInk, 120); }, {passive:false});
document.addEventListener('keydown', e => { if(e.key === 'Escape' && S.inkFs != null){ S.inkFs = null; render(true); } });
window.addEventListener('resize', () => { clearTimeout(inkTimer); inkTimer = setTimeout(initInk, 120); });
async function inkToText(i){
  const b = S.pw && S.pw.blocks[i]; if(!b || !b.strokes.length){ toast('Write something first.'); return; }
  if(!navigator.createHandwritingRecognizer || typeof HandwritingStroke === 'undefined'){ toast('This browser cannot read handwriting. Use your keyboard’s handwriting input in a Text block instead.'); return; }
  try{ const rec = await navigator.createHandwritingRecognizer({languages:['en']}), d = rec.startDrawing({recognitionType:'text', inputType:'stylus'});
    b.strokes.filter(s => !s.txt).forEach(s => { const hs = new HandwritingStroke(); s.pts.forEach((q, j) => hs.addPoint({x:q[0], y:q[1], t:q[3] != null ? q[3] : j * 8})); d.addStroke(hs); });
    const preds = await d.getPrediction(), text = preds && preds[0] && preds[0].text; d.clear(); rec.finish();
    if(!text){ toast('No text was recognised.'); return; }
    S.pw.blocks.splice(i + 1, 0, {type:'text', color:'blue', text:text}); render(true); toast('Text added below. Check it against your handwriting.');
  }catch(err){ toast('Handwriting could not be read on this device.'); }
}
function probList(){
  const q = (S.drafts.pq || '').toLowerCase().trim(), xs = S.problems.filter(x => !q || (psrc(x) + ' ' + x.loc + ' ' + x.tags.join(' ') + ' ' + (x.text || '')).toLowerCase().includes(q));
  if(!xs.length) return '<p class="soft">No problem matches.</p>';
  const ids = xs.map(x => x.book).filter((v, i, a) => a.indexOf(v) === i);
  const secOf = x => { const b = x.book && book(x.book), chn = b && x.ch != null ? (b.chapters || [])[x.ch] : '', parts = x.loc.split(', '), sec = parts.length > 1 ? parts.slice(0, -1).join(', ') : ''; return [chn, sec && sec !== 'Ch. ' + ((x.ch || 0) + 1) ? sec : ''].filter(Boolean).join(' · ') || 'No section'; };
  const num = x => { const m = x.loc.split(', ').pop().match(/[\d.]+/g); return m ? m.join('.').split('.').map(Number) : [1e9]; }, cmp = (p, q) => { const a = num(p), b = num(q); for(let k = 0; k < Math.max(a.length, b.length); k++){ if((a[k] || 0) !== (b[k] || 0)) return (a[k] || 0) - (b[k] || 0); } return 0; };
  const open = S.plOpen = S.plOpen || {}, cur = prob(S.selProblem); if(cur && open[cur.book] === undefined) open[cur.book] = true;
  const nAtt = {}; S.pAttempts.forEach(a => { nAtt[a.problem] = (nAtt[a.problem] || 0) + 1; });
  return '<p class="small">' + fmtN(xs.length) + (q ? ' matching' : '') + (xs.length === 1 ? ' problem' : ' problems') + ' in ' + plural(ids.length, 'book') + '.</p>' + ids.map(id => { const mine = xs.filter(x => x.book === id), isOpen = q ? true : !!open[id];
    if(!isOpen) return '<button class="pbook" data-act="plbook" data-id="' + id + '" aria-expanded="false"><span aria-hidden="true">▸</span><span class="t">' + esc(psrc({book:id})) + '</span><span class="n">' + fmtN(mine.length) + '</span></button>';
    const keys = mine.slice().sort((p, q2) => (p.ch == null ? 1e9 : p.ch) - (q2.ch == null ? 1e9 : q2.ch)).map(secOf).filter((v, i, a) => a.indexOf(v) === i), lim = (S.plAll || {})[id] ? 1e9 : 60; let shown = 0;
    return '<button class="pbook" data-act="plbook" data-id="' + id + '" aria-expanded="true"><span aria-hidden="true">▾</span><span class="t">' + esc(psrc({book:id})) + '</span><span class="n">' + fmtN(mine.length) + '</span></button><div class="pgroup">' + keys.map(k => { if(shown >= lim) return ''; const rows = mine.filter(x => secOf(x) === k).sort(cmp).slice(0, lim - shown); shown += rows.length; return '<p class="secname">' + esc(k) + '</p>' + rows.map(x => '<button class="prow2' + (x.id === S.selProblem ? ' sel' : '') + '" data-act="problem" data-id="' + x.id + '"><span class="t">' + esc(x.loc.split(', ').pop()) + '</span><span class="n">' + (nAtt[x.id] ? nAtt[x.id] + '×' : '') + '</span></button>').join(''); }).join('') + (mine.length > lim ? '<button class="btn link mini" data-act="plall" data-id="' + id + '">Show all ' + fmtN(mine.length) + '</button>' : '') + '</div>'; }).join('');
}
const noProbs = T => '<div class="stack loose">' + head(T, 'No problems yet.') + '<p class="soft">Add a problem from one of your books to begin.</p><div class="row"><button class="btn primary" data-act="probform">+ Add a problem</button></div>' + trashLink() + '</div>';
function attemptsBox(A){
  const openId = S.attOpen === undefined || !A.some(a => a.id === S.attOpen) && S.attOpen !== null ? A[A.length - 1].id : S.attOpen, first = A[0], last = A[A.length - 1];
  const head2 = (a, n) => [fmtAt(atOf(a)), modeName(a.mode), helpText(a), partTally(a), a.only ? 'retry of ' + a.only.map(l => '(' + l + ')').join(', ') : '', a.dur != null ? fmtDur(a.dur) : '', a.fix || (a.fixes || []).length ? 'corrected' : '', a.eval ? 'evaluated: ' + verd(a.eval.verdict)[0].toLowerCase() : a.evalPending ? 'waiting for evaluation' : ''].filter(Boolean).join(' · ');
  return '<p class="small">First attempt ' + esc(fmtAt(atOf(first))) + (A.length > 1 ? ' · latest ' + esc(fmtAt(atOf(last))) : '') + '. Tap an attempt to see the work.</p>' +
    (A.length > 1 ? '<div class="row"><button class="btn' + (S.attCmp ? ' primary' : '') + '" data-act="attcmp">' + (S.attCmp ? 'Close the comparison' : 'Compare first and latest') + '</button></div>' : '') +
    (S.attCmp && A.length > 1 ? '<div class="cmp2"><div><p class="kind">First · ' + esc(fmtAt(atOf(first))) + '</p><div class="lines">' + attemptLine(first, 1) + '</div></div><div><p class="kind">Latest · ' + esc(fmtAt(atOf(last))) + '</p><div class="lines">' + attemptLine(last, A.length) + '</div></div></div>' : '') +
    '<div class="atl">' + A.map((a, i) => '<button class="atrow" data-act="attopen" data-id="' + a.id + '" aria-expanded="' + (a.id === openId) + '"><b>#' + (i + 1) + '</b><span>' + esc(head2(a, i + 1)) + '</span><span aria-hidden="true">' + (a.id === openId ? '▾' : '▸') + '</span></button>' + (a.id === openId ? '<div class="lines">' + attemptLine(a, i + 1) + '</div>' : '')).join('') + '</div>';
}
function vProblems(){
  if(!prob(S.selProblem)){ if(S.problems.length) S.selProblem = S.problems[0].id; else return noProbs('Library'); }
  const p = prob(S.selProblem), A = S.pAttempts.filter(a => a.problem === p.id), pb = p.book && book(p.book), chName = pb && p.ch != null && (pb.chapters || [])[p.ch];
  const list = '<div class="list stack loose' + (S.problemOpen ? ' closed' : '') + '"><button class="btn" data-act="probform" style="align-self:flex-start">+ Add a problem</button>' + trashLink() + '<label class="f" for="pq">Search problems and books<input type="text" id="pq" data-draft="pq" value="' + esc(S.drafts.pq || '') + '"></label><div id="plist" class="plistbox">' + probList() + '</div>' + (!REAL && S.problems.length < 500 ? '<p class="small">Want to see it at full size? <button class="btn link mini" data-act="plsample">Load 5,000 sample problems</button></p>' : '') + '</div>';
  const detail = '<div class="detail stack loose' + (S.problemOpen ? '' : ' closed') + '"><button class="btn link only-compact" data-act="problemback" style="align-self:flex-start">‹ Library</button>' +
    '<div><h2>' + esc(p.loc) + '</h2><p class="small">' + esc([psrc(p), chName || '', p.tags.join(' · ')].filter(Boolean).join(' · ')) + '</p></div>' + stmt(p) + (p.img ? '<button class="btn link" data-act="paddshot" style="align-self:flex-start">+ Add another screenshot to this problem</button>' : '') +
    (S.pw ? section('Attempt in progress', '<div class="row"><button class="btn primary" data-act="go" data-v="work">Go to the workspace</button></div>') : startBox(p, A)) +
    section('Attempts (' + A.length + ')', A.length ? attemptsBox(A) : '<p class="soft">None yet. A retry never overwrites an earlier attempt.</p>') + '</div>';
  return '<div class="stack loose">' + head('Library', 'Your problems, by book. Every problem belongs to a book in the Reading Lab.') + pendingBar() + '<div class="split">' + list + detail + '</div></div>';
}
function pkList(){
  const q = (S.drafts.pk_q || '').toLowerCase().trim(); let xs = q ? S.books.filter(b => (b.title + ' ' + (b.author || '')).toLowerCase().includes(q)) : S.books.filter(b => b.status === 'Reading');
  const more = xs.length - 8; xs = xs.slice(0, 8);
  return xs.length ? (q ? '' : '<p class="small">Books you are reading. Type to search all ' + fmtN(S.books.length) + '.</p>') + '<div class="lines">' + xs.map(b => '<button type="button" class="pick" data-act="pkbook" data-id="' + b.id + '"><span class="t">' + esc(b.title) + '</span><br><span class="small">' + bookLine(b) + '</span></button>').join('') + '</div>' + (more > 0 ? '<p class="small">' + fmtN(more) + ' more. Keep typing to narrow.</p>' : '') : '<p class="soft">' + (q ? 'No book in your library matches.' : 'Type to search your library.') + '</p>';
}
function pkBlock(){
  const b = S.drafts.pr_book && book(S.drafts.pr_book);
  return b ? '<div class="stack" style="gap:0"><span class="small">Book</span><div class="picked"><b>' + esc(b.title) + '</b><span class="small">' + bookLine(b) + '</span><button type="button" class="btn link mini" data-act="pkclear">Change</button></div></div>'
    : '<label class="f" for="pk_q">Book, from your Reading Lab library<input type="text" id="pk_q" data-draft="pk_q" value="' + esc(S.drafts.pk_q || '') + '" placeholder="Search by title or author" autocomplete="off"></label><div id="pklist">' + pkList() + '</div><p class="small">Not there? A problem needs its book in the Reading Lab first. <button type="button" class="btn link mini" data-act="pkadd">Add the book</button></p>';
}
function vWorkspace(){
  if(S.pw) return vWork(prob(S.pw.problem), S.pw);
  if(!prob(S.selProblem)){ if(S.problems.length) S.selProblem = S.problems[0].id; else return noProbs('Workspace'); }
  const p = prob(S.selProblem), A = S.pAttempts.filter(a => a.problem === p.id);
  return '<div class="stack loose">' + head('Workspace', 'No attempt in progress. Start one here, or choose another problem in the Library.') + stmt(p) + startBox(p, A) + '</div>';
}

/* ---------- problem-set import: real pages, trimmed, cut or boxed into problems, filed under a book and section ---------- */
const loadImg = src => new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = src; });
async function suggestCuts(src, R){
  try{ R = R || [0, 0, 1, 1]; const im = await loadImg(src), sw = (R[2] - R[0]) * im.naturalWidth, sh = (R[3] - R[1]) * im.naturalHeight, W = 500, H = Math.max(1, Math.round(sh * W / sw)), cv = document.createElement('canvas'); cv.width = W; cv.height = H; const cx = cv.getContext('2d', {willReadFrequently:true}); cx.drawImage(im, R[0] * im.naturalWidth, R[1] * im.naturalHeight, sw, sh, 0, 0, W, H); const d = cx.getImageData(0, 0, W, H).data, lum = k => 0.3 * d[k] + 0.6 * d[k + 1] + 0.1 * d[k + 2];
    const cs = [lum((3 + 3 * W) * 4), lum((W - 4 + 3 * W) * 4), lum((3 + (H - 4) * W) * 4), lum((W - 4 + (H - 4) * W) * 4)].sort((p, q) => p - q), bg = (cs[1] + cs[2]) / 2, ink = (x, y) => Math.abs(lum((y * W + x) * 4) - bg) > 48, blank = [];
    for(let y = 0; y < H; y++){ let n = 0; for(let x = 0; x < W; x += 2) if(ink(x, y)) n++; blank.push(n < 2); }
    const bands = []; let st = -1;
    for(let y = 0; y <= H; y++){ if(y < H && !blank[y]){ if(st < 0) st = y; } else if(st >= 0){ let left = W; for(let yy = st; yy < y; yy++){ for(let x = 0; x < left; x++) if(ink(x, yy)){ left = x; break; } } bands.push([st, y, left]); st = -1; } }
    if(bands.length < 2) return []; const minLeft = Math.min.apply(null, bands.map(b => b[2])), tol = W * 0.02, hang = bands.some(b => b[2] > minLeft + tol), cuts = [];
    for(let k = 1; k < bands.length; k++) if(!hang || bands[k][2] <= minLeft + tol) cuts.push(+(R[1] + ((bands[k - 1][1] + bands[k][0]) / 2) / H * (R[3] - R[1])).toFixed(4));
    return cuts.slice(0, 80);
  }catch(e){ return []; }
}
function samplePage(){
  const cv = document.createElement('canvas'); cv.width = 900; cv.height = 1180; const c = cv.getContext('2d'); c.fillStyle = '#fff'; c.fillRect(0, 0, 900, 1180); c.fillStyle = '#111'; c.font = 'bold 30px Georgia, serif'; c.fillText('3.2  Exercises', 60, 70); c.font = 'italic 24px Georgia, serif'; c.fillText('In Exercises 1–8, find the derivative of the function.', 60, 150);
  const ps = [['f(x) = x³ − 4x² + 7x − 2'], ['g(t) = (3t² + 1)(t − 5)'], ['h(x) = (x² + 1) / (x − 3)', 'State where h is not differentiable.'], ['y = √(2x + 9)'], ['f(θ) = sin θ · cos 2θ'], ['s(t) = t · e^(−t/2)', 'Then find the time at which s is greatest.'], ['y = ln(x² + 4x + 5)'], ['p(x) = (4x − 1)⁵ (x + 2)³']]; let y = 250; c.font = '25px Georgia, serif';
  ps.forEach((p, i) => { c.font = 'bold 25px Georgia, serif'; c.fillText((i + 1) + '.', 60, y); c.font = '25px Georgia, serif'; p.forEach((ln, j) => c.fillText(ln, 110, y + j * 38)); y += p.length * 38 + 70; });
  return cv.toDataURL('image/png');
}
async function cropPiece(im, r){ const cv = document.createElement('canvas'), w = (r[2] - r[0]) * im.naturalWidth, h = (r[3] - r[1]) * im.naturalHeight, k = Math.min(1, 1400 / w); cv.width = Math.max(1, Math.round(w * k)); cv.height = Math.max(1, Math.round(h * k)); const c = cv.getContext('2d'); c.fillStyle = '#fff'; c.fillRect(0, 0, cv.width, cv.height); c.drawImage(im, r[0] * im.naturalWidth, r[1] * im.naturalHeight, w, h, 0, 0, cv.width, cv.height); return cv.toDataURL('image/jpeg', 0.9); }
const impPieces = I => { if(I.mode === 'box') return I.boxes.slice(); const R = I.region, ys = [R[1]].concat(I.cuts.filter(y => y > R[1] + 0.004 && y < R[3] - 0.004).sort((a, b) => a - b)).concat([R[3]]), out = []; for(let k = 0; k < ys.length - 1; k++) if(ys[k + 1] - ys[k] > 0.01) out.push([R[0], ys[k], R[2], ys[k + 1]]); return out; };
const impRole = (I, k) => (I.roles[I.mode] || {})[k] || 'p';
const impLabel = (I, k) => { const custom = (I.labels[I.mode] || {})[k]; if(impRole(I, k) === 'x') return 'Left out'; if(impRole(I, k) === 'i') return 'Instructions'; if(custom) return custom; const first = parseInt(S.drafts.im_first, 10) || 1; let n = 0; for(let j = 0; j < k; j++) if(impRole(I, j) === 'p') n++; return 'Ex. ' + (first + n); };
const pc = v => (v * 100).toFixed(3) + '%';
function vImport(){
  const fld = (id, label, cls, ph) => '<label class="f' + (cls ? ' ' + cls : '') + '" for="' + id + '">' + label + '<input type="text" id="' + id + '" data-draft="' + id + '" value="' + esc(S.drafts[id] || '') + '"' + (ph ? ' placeholder="' + esc(ph) + '"' : '') + '></label>';
  const I = S.imp, it = S.inbox.find(x => x.id === I.id), D = S.drafts, bk = D.pr_book && book(D.pr_book), chs = bk ? (bk.chapters || []) : [], P = impPieces(I), R = I.region, nProb = P.filter((p, k) => impRole(I, k) === 'p').length, trimmed = R[0] > 0.002 || R[1] > 0.002 || R[2] < 0.998 || R[3] < 0.998;
  const tool = (m, label) => '<button type="button" class="tool" data-act="impmode" data-m="' + m + '" aria-pressed="' + (I.tool === m) + '">' + label + '</button>';
  const help = I.tool === 'trim' ? 'Drag a rectangle around the exercises to leave out toolbars, margins and page numbers.' : I.tool === 'box' ? 'Drag a rectangle around each problem or part. Use this when problems sit side by side on the same row.' : 'Tap the page to add a cut across it, drag a line to move it, or remove it with ×.';
  return '<div class="stack loose">' + head('Split into problems', 'Match the page to a book, then mark where each exercise is.') +
    section('1. Where it comes from', pkBlock() + (bk ? '<div class="fgrid">' + (chs.length ? '<label class="f wide" for="pr_ch">Chapter<select id="pr_ch" data-draft="pr_ch"><option value="">No chapter</option>' + chs.map((c, i) => '<option value="' + i + '"' + (String(D.pr_ch) === String(i) ? ' selected' : '') + '>' + esc(c) + '</option>').join('') + '</select></label>' : '') + fld('pr_sec', 'Section', '', '§3.2') + '<label class="f" for="im_first">First exercise number<input type="text" inputmode="numeric" id="im_first" data-draft="im_first" data-imre="1" value="' + esc(D.im_first != null ? D.im_first : '1') + '"></label>' + fld('pr_tags', 'Topic tags for all of them, separated by commas', 'wide') + '</div>' : '')) +
    section('2. Mark the problems', '<div class="row inkbar">' + tool('trim', 'Trim page') + tool('cut', 'Cut lines') + tool('box', 'Draw boxes') + '</div><p class="small">' + help + '</p><div class="row">' + (trimmed ? '<button class="btn link mini" data-act="imptrimreset">Undo trim</button>' : '') + (I.mode === 'cut' ? '<button class="btn link mini" data-act="impsuggest">Suggest cuts again</button><button class="btn link mini" data-act="impclear">Remove all cuts</button>' : '<button class="btn link mini" data-act="impclear">Remove all boxes</button><button class="btn link mini" data-act="impusecuts">Go back to cut lines</button>') + '</div>' +
      '<div class="cutwrap' + (I.tool === 'cut' ? '' : ' rect') + '" id="cutwrap" data-act="cutadd"><img src="' + it.src + '" alt="Imported page" draggable="false">' + (trimmed ? '<div class="trimbox" style="left:' + pc(R[0]) + ';top:' + pc(R[1]) + ';width:' + pc(R[2] - R[0]) + ';height:' + pc(R[3] - R[1]) + '"></div>' : '') +
      (I.mode === 'box' ? P.map((p, k) => '<div class="pbox' + (impRole(I, k) === 'x' ? ' off' : '') + '" style="left:' + pc(p[0]) + ';top:' + pc(p[1]) + ';width:' + pc(p[2] - p[0]) + ';height:' + pc(p[3] - p[1]) + '"><span class="cuttag in">' + esc(impLabel(I, k)) + '</span></div>').join('')
        : P.map((p, k) => '<span class="cuttag" style="top:calc(' + pc(p[1]) + ' + 3px);right:calc(' + pc(1 - p[2]) + ' + 34px)">' + esc(impLabel(I, k)) + '</span>').join('') + I.cuts.map((y, k) => (y > R[1] && y < R[3]) ? '<div class="cutline" data-cut="' + k + '" style="top:' + pc(y) + ';left:' + pc(R[0]) + ';right:' + pc(1 - R[2]) + '"><button type="button" class="cutx" data-act="cutdel" data-i="' + k + '" aria-label="Remove this cut">×</button></div>' : '').join('')) + '<div class="rubber" id="rubber" hidden></div></div>') +
    section('3. Name each piece (' + P.length + ')', P.length ? '<div class="plist">' + P.map((p, k) => '<div class="prow"><input type="text" aria-label="Label for piece ' + (k + 1) + '" data-implabel="' + k + '" value="' + esc(impRole(I, k) === 'p' ? impLabel(I, k) : '') + '" placeholder="' + esc(impLabel(I, k)) + '"' + (impRole(I, k) === 'p' ? '' : ' disabled') + '><input type="text" class="ppin" aria-label="Parts in piece ' + (k + 1) + '" data-impparts="' + k + '" value="' + esc((I.pparts || {})[I.mode + k] || '') + '" placeholder="Parts, e.g. a-f"' + (impRole(I, k) === 'p' ? '' : ' disabled') + '><select aria-label="What piece ' + (k + 1) + ' is" data-improle="' + k + '">' + [['p','A problem'],['i','Instructions for the problems below'],['x','Leave out']].map(x => '<option value="' + x[0] + '"' + (impRole(I, k) === x[0] ? ' selected' : '') + '>' + x[1] + '</option>').join('') + '</select>' + (I.mode === 'box' ? '<button class="btn link mini" data-act="boxdel" data-i="' + k + '">Remove</button>' : '') + '</div>').join('') + '</div><p class="small">Change a label to anything you like. If a problem has parts on the page, type them beside it (a-f) and it stays one problem with a tab per part. Instructions are attached to every problem after them.</p>' : '<p class="soft">No pieces yet.</p>') +
    section('4. File', '<div class="row"><button class="btn primary" data-act="impfile">File ' + plural(nProb, 'problem') + (bk ? ' under ' + esc(bk.title) : '') + '</button><button class="btn link" data-act="impcancel">Cancel</button></div><p class="small">Each problem keeps its picture as the statement. No text is machine-read, because maths is misread too often.</p>') + '</div>';
}
let cutDrag = null;
const impXY = e => { const r = $('cutwrap').getBoundingClientRect(); return [Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)), Math.max(0, Math.min(1, (e.clientY - r.top) / r.height))]; };
document.addEventListener('pointerdown', e => { if(!S.imp || !e.target.closest) return; const I = S.imp, wrap = e.target.closest('#cutwrap'); if(!wrap || e.target.closest('.cutx')) return;
  if(I.tool !== 'cut'){ e.preventDefault(); const p = impXY(e); cutDrag = {rect:true, a:p, b:p, id:e.pointerId}; try{ wrap.setPointerCapture(e.pointerId); }catch(err){} return; }
  const l = e.target.closest('.cutline'); if(!l) return; e.preventDefault(); cutDrag = {i:+l.dataset.cut, el:l, id:e.pointerId}; try{ l.setPointerCapture(e.pointerId); }catch(err){} });
document.addEventListener('pointermove', e => { if(!cutDrag || e.pointerId !== cutDrag.id || !S.imp) return; const p = impXY(e);
  if(cutDrag.rect){ cutDrag.b = p; const a = cutDrag.a, el = $('rubber'); if(el){ el.hidden = false; el.style.left = pc(Math.min(a[0], p[0])); el.style.top = pc(Math.min(a[1], p[1])); el.style.width = pc(Math.abs(p[0] - a[0])); el.style.height = pc(Math.abs(p[1] - a[1])); } return; }
  const R = S.imp.region, y = Math.max(R[1] + 0.005, Math.min(R[3] - 0.005, p[1])); S.imp.cuts[cutDrag.i] = +y.toFixed(4); cutDrag.el.style.top = pc(y); cutDrag.moved = true; }, {passive:false});
const cutEnd = e => { if(!cutDrag || e.pointerId !== cutDrag.id) return; const c = cutDrag, I = S.imp; cutDrag = null; if(!I) return;
  if(c.rect){ const r = [Math.min(c.a[0], c.b[0]), Math.min(c.a[1], c.b[1]), Math.max(c.a[0], c.b[0]), Math.max(c.a[1], c.b[1])].map(v => +v.toFixed(4)); if(r[2] - r[0] < 0.03 || r[3] - r[1] < 0.015){ render(true); return; }
    if(I.tool === 'trim'){ I.region = r; I.tool = I.mode; const it = S.inbox.find(x => x.id === I.id); render(true); if(I.mode === 'cut') suggestCuts(it.src, r).then(cs => { if(S.imp === I){ I.cuts = cs; I.roles.cut = {}; I.labels.cut = {}; render(true); } }); }
    else { I.mode = 'box'; I.boxes.push(r); render(true); } return; }
  if(c.moved){ I.cuts.sort((a, b) => a - b); I.justDragged = Date.now(); render(true); } };
document.addEventListener('pointerup', cutEnd); document.addEventListener('pointercancel', cutEnd);
document.addEventListener('change', e => { const t = e.target; if(!t.dataset) return;
  if(t.dataset.improle !== undefined && S.imp){ const I = S.imp; (I.roles[I.mode] = I.roles[I.mode] || {})[+t.dataset.improle] = t.value; render(true); return; }
  if(t.dataset.impfile === undefined || !t.files) return; const fs = Array.from(t.files).filter(f => /^image\//.test(f.type)); if(!fs.length){ toast('Choose image files. PDF import comes with the built app.'); return; } let left = fs.length; fs.forEach((f, k) => { const r = new FileReader(); r.onload = () => { S.inbox.push({id:'in' + Date.now() + '_' + k, type:'set', kind:f.name || 'Imported page', src:r.result, filed:false}); if(--left === 0){ changed(1); render(true); toast(plural(fs.length, 'page') + ' added to the inbox.'); } }; r.onerror = () => { if(--left === 0) render(true); }; r.readAsDataURL(f); }); t.value = ''; });
document.addEventListener('input', e => { const ds = e.target.dataset; if(!ds || !S.imp) return; const I = S.imp;
  if(ds.implabel !== undefined){ (I.labels[I.mode] = I.labels[I.mode] || {})[+ds.implabel] = e.target.value.trim(); }
  if(ds.implabel !== undefined || ds.imre){ document.querySelectorAll('#cutwrap .cuttag').forEach((el, k) => { el.textContent = impLabel(I, k); }); if(ds.imre) document.querySelectorAll('[data-implabel]').forEach((el, k) => { if(!(I.labels[I.mode] || {})[k]){ if(impRole(I, k) === 'p') el.value = impLabel(I, k); } }); } });
function vInbox(){
  if(S.imp && S.inbox.find(x => x.id === S.imp.id)) return vImport();
  const p = prob(S.selProblem) || S.problems[0] || {loc:'a new problem', id:null}, inbox = S.inbox.filter(x => !x.filed);
  return '<div class="stack loose">' + head('Inbox', 'Pages wait here until you file them as problems under a book.') + '<div class="row"><label class="btn primary" style="cursor:pointer">+ Import pages<input type="file" accept="image/*" multiple hidden data-impfile></label>' + (REAL ? '' : '<button class="btn" data-act="impsample">Try a sample page</button>') + '</div><p class="small">Choose screenshots or photos of a problem set.' + (REAL ? '' : ' The three older items below are still simulated examples.') + '</p>' + (inbox.length ? '<div class="lines">' + inbox.map(x => inboxItem(x, p)).join('') + '</div>' : '<p class="soft">Nothing waiting. Pages from GoodNotes, Samsung Notes, PDFs and screenshots land here.</p>') + '</div>';
}
function vErrors(){
  const A = S.pAttempts.filter(a => a.errors.length || a.fix), cats = ERRCATS.filter(c => A.some(a => a.errors.includes(c))), rest = A.filter(a => !a.errors.length);
  return '<div class="stack loose">' + head('Errors', 'Corrections and obstacles from your attempts, grouped by kind.') + (A.length ? cats.map(c => { const xs = A.filter(a => a.errors.includes(c)); return section(c + ' (' + xs.length + ')', '<div class="lines">' + xs.map(a => attemptLine(a, S.pAttempts.indexOf(a) + 1, true)).join('') + '</div>'); }).join('') + (rest.length ? section('Corrected, not yet classified (' + rest.length + ')', '<div class="lines">' + rest.map(a => attemptLine(a, S.pAttempts.indexOf(a) + 1, true)).join('') + '</div>') : '') : '<p class="soft">No corrections yet. They collect here after you submit and correct an attempt.</p>') + '</div>';
}
function vWork(p, w){
  const n = S.pAttempts.filter(a => a.problem === p.id).length + 1;
  const topH = head('Attempt ' + n, esc(p.loc) + ' · ' + modeName(w.mode) + ' mode') + stmt(p);
  if(w.step === 'work'){
    const rest = OPTSEC.filter(x => !w.sections.includes(x[0]));
    const secs = w.sections.map(k => { const lab = OPTSEC.find(x => x[0] === k)[1]; return '<div class="optsec"><div class="row" style="justify-content:space-between;gap:8px"><label class="small" for="pw_' + k + '" style="color:var(--soft)">' + lab + '</label><button type="button" class="btn link mini" data-act="psecdel" data-s="' + k + '" aria-label="Remove ' + esc(lab) + '">Remove</button></div><textarea class="short" id="pw_' + k + '" data-draft="pw_' + k + '">' + esc(S.drafts['pw_' + k] || '') + '</textarea></div>'; }).join('');
    const shown = p.hints.slice(0, w.hints).map((h,i) => '<p class="hintline"><b>Hint ' + (i + 1) + ':</b> ' + esc(h) + '</p>').join('') + (w.solution ? '<div class="sol">' + esc(p.solution) + '</div>' : '');
    const nextIdx = w.solution ? -1 : w.hints < p.hints.length ? w.hints : 5;
    const help = w.mode === 'assess' ? '<p class="small">' + MODENOTE.assess + '</p>' : shown + (nextIdx < 0 ? '<p class="small">All help has been opened.</p>' : !p.hints.length && !p.solution ? '<p class="small">No hints or solution have been entered for this problem.</p>' : '<div class="row"><button class="btn" data-act="phint">Show ' + HINTSTEPS[nextIdx] + '</button></div><p class="small">' + (w.hints ? w.hints + ' of 5 hints opened. ' : '') + 'Each one you open is recorded with the attempt.</p>');
    return '<div class="stack loose">' + topH +
      (secs || rest.length ? section('', secs + (rest.length ? '<div class="row">' + rest.map(x => '<button class="btn link" data-act="psec" data-s="' + x[0] + '">+ ' + x[1] + '</button>').join('') + '</div>' : '')) : '') +
      section('Working', ((p.parts || []).length && w.part ? partsBar(w, p) : '') + blocksEdit(w)) +
      section('Help', help) +
      section('Calculate', '<div class="calc"><label class="f" for="pw_calc">Expression, for example 12/(4+2) or sqrt(2*9.81*0.75)<input type="text" id="pw_calc" data-draft="pw_calc" value="' + esc(S.drafts.pw_calc || '') + '"></label><button class="btn" data-act="pcalc">Calculate</button></div>' + w.calcs.map((c, i) => '<p class="calcline">' + esc(c.in) + ' = ' + c.out + ' <button class="btn link mini" data-act="pcalcdel" data-i="' + i + '">Remove</button></p>').join('') + '<p class="small">Inputs and results are kept with the attempt. Angles are in radians.</p>') +
      section('Why should we believe this result?', '<div class="opts col">' + CHECKS.map(c => { const st = w.checks[c[0]]; return '<button class="opt' + (st ? ' ' + st : '') + '" data-act="pcheck" data-k="' + c[0] + '" aria-pressed="' + !!st + '">' + c[1] + (st ? ': ' + st : '') + '</button>'; }).join('') + '</div><p class="small">Tap once for passed, twice for failed. Checks passed are evidence, not proof.</p>') +
      '<div class="row"><button class="btn primary" data-act="psubmit">Submit and lock</button><button class="btn link" data-act="pdiscard">Discard draft</button></div></div>';
  }
  const draftA = {mode:w.mode, hints:w.hints, solution:w.solution};
  return '<div class="stack loose">' + topH +
    section('Your working (locked)', '<div class="gridbox">' + blocksHtml(w.blocks, true) + '</div>' + w.secs.map(x => '<p class="small">' + esc(x[0]) + ': ' + esc(x[1]) + '</p>').join('') + w.calcs.map(c => '<p class="calcline">' + esc(c.in) + ' = ' + c.out + '</p>').join('') + '<p class="small">' + esc(helpText(draftA)) + '. Checks: ' + esc(checksText(w.checks)) + '.</p>') +
    section('Evaluation', aiBox('prob', w, 'Claude evaluates the locked attempt: a verdict, the first weak step, each part, and your checks. It does not hand you the solution, and the correction below is still yours to write.')) +
    section('Compare', w.solShown ? (p.solution ? '<p class="kind">Worked solution, entered by hand</p><div class="sol">' + esc(p.solution) + '</div>' : '<p class="small">No worked solution has been entered for this problem.</p>') : '<div class="row"><button class="btn" data-act="psol">Show the worked solution</button></div>') +
    (w.partRes ? section('Mark each part', '<p class="small">Compare each answer with the worked solution or the book, then mark it yourself.</p>' + partsReview(w)) : '') +
    section('Correct it in red', '<label class="f" for="pw_fix">What was missing or wrong? Leave blank if nothing.<textarea id="pw_fix" class="red short" data-draft="pw_fix">' + esc(S.drafts.pw_fix || '') + '</textarea></label><p class="small">What was the obstacle? Choose any that apply.</p><div class="opts">' + ERRCATS.map(c => '<button class="opt" data-act="perr" data-c="' + c + '" aria-pressed="' + w.errors.includes(c) + '">' + c + '</button>').join('') + '</div>') +
    section('Next', '<div class="row"><button class="btn primary" data-act="psave" data-h="retry">Save and schedule a retry</button><button class="btn" data-act="psave" data-h="vary">Save and schedule a variation</button><button class="btn link" data-act="psave" data-h="none">Save only</button></div>') + '</div>';
}
function vProgress(){
  const h = JSON.parse(JSON.stringify(S.hist)); S.events.forEach(e => { if(h[e.ability]){ h[e.ability][1]++; if(e.grade !== 'Again' && !e.hint) h[e.ability][0]++; } });
  const A = S.pAttempts, counts = {}; A.forEach(a => a.errors.forEach(e => counts[e] = (counts[e] || 0) + 1));
  const rec = Object.keys(counts).filter(k => counts[k] >= 2);
  return '<div class="stack loose">' + head('Progress', 'Two records, kept separate. Example data plus this visit.') +
    section('Reading: conceptual understanding', '<div class="hist">' + ABILITIES.map(a => '<span>' + a + '</span><span>' + h[a][0] + ' of ' + h[a][1] + ' without hints</span>').join('') + '</div>') +
    section('Problems: deriving and solving', '<div class="hist"><span>Attempts</span><span>' + A.length + '</span><span>Independent</span><span>' + A.filter(independent).length + ' of ' + A.length + '</span><span>Hints opened</span><span>' + A.reduce((s,a) => s + a.hints, 0) + '</span><span>Solutions consulted</span><span>' + A.filter(a => a.solution).length + '</span></div><p class="small">' + (rec.length ? 'Recurring obstacle across attempts: ' + esc(rec.join(', ').toLowerCase()) + '.' : 'Too little history to show a pattern yet.') + '</p>') +
    section('Problem attempts', '<div class="lines">' + A.map((a,i) => attemptLine(a, i + 1, true)).join('') + '</div>') + '</div>';
}
function vCover(){
  const first = REAL && !S.books.length;
  const nIn = S.inbox.filter(x => !x.filed).length, d = due().length;
  const W = 1000, H = 700, rnd = i => { const v = Math.sin(i * 12.9898) * 43758.5453; return v - Math.floor(v); };
  let ruled = '', grid = '', curves = '', pts = '';
  for(let y = 42; y < H; y += 28) ruled += '<line x1="0" x2="' + W + '" y1="' + y + '" y2="' + y + '"/>';
  for(let x = 14; x < W; x += 28) grid += '<line x1="' + x + '" x2="' + x + '" y1="0" y2="' + H + '"/>';
  for(let y = 14; y < H; y += 28) grid += '<line x1="0" x2="' + W + '" y1="' + y + '" y2="' + y + '"/>';
  ['today','books','problems','concepts','progress'].forEach((c, k) => { let p = ''; for(let x = -10; x <= W + 10; x += 10){ const y = 372 - k * 16 + (64 + 20 * k) * Math.sin(x / (150 + 18 * k) + k * 1.3) * (0.3 + 0.7 * x / W); p += (p ? 'L' : 'M') + x + ' ' + y.toFixed(1); } curves += '<path d="' + p + '" fill="none" stroke="var(--c-' + c + ')" stroke-width="2.5" stroke-linecap="round" opacity=".9"/>'; });
  let bell = 'M430 ' + H; for(let x = 430; x <= W; x += 10) bell += 'L' + x + ' ' + (H - 330 * Math.exp(-Math.pow((x - 760) / 120, 2))).toFixed(1); bell += 'L' + W + ' ' + H + 'Z';
  for(let i = 0; i < 13; i++){ const x = 70 + i * 34, base = 640 - i * 15, y = base + (rnd(i + 1) - 0.5) * 70; pts += '<line x1="' + x + '" x2="' + x + '" y1="' + y.toFixed(1) + '" y2="' + base + '" stroke="var(--cover-ink)" stroke-width="1" opacity=".3"/><circle cx="' + x + '" cy="' + y.toFixed(1) + '" r="4.5" fill="var(--cover-ink)" opacity=".6"/>'; }
  const bg = '<svg class="bgart" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="kgl" x1="0" x2="1" y1="0" y2="0"><stop offset=".28" stop-color="#fff"/><stop offset=".6" stop-color="#000"/></linearGradient><linearGradient id="kgr" x1="0" x2="1" y1="0" y2="0"><stop offset=".4" stop-color="#000"/><stop offset=".72" stop-color="#fff"/></linearGradient><mask id="kml"><rect width="' + W + '" height="' + H + '" fill="url(#kgl)"/></mask><mask id="kmr"><rect width="' + W + '" height="' + H + '" fill="url(#kgr)"/></mask></defs>' +
    '<g stroke="var(--cover-ink)" stroke-width="1" opacity=".13" mask="url(#kml)">' + ruled + '</g><g stroke="var(--cover-ink)" stroke-width="1" opacity=".11" mask="url(#kmr)">' + grid + '</g>' +
    '<circle cx="905" cy="95" r="170" fill="none" stroke="var(--cover-ink)" stroke-width="1.25" opacity=".16"/><circle cx="905" cy="95" r="118" fill="none" stroke="var(--cover-ink)" stroke-width="1.25" stroke-dasharray="3 7" opacity=".2"/>' +
    '<path d="' + bell + '" fill="var(--cover-ink)" fill-opacity=".06" stroke="var(--cover-ink)" stroke-opacity=".3" stroke-width="1.5"/>' + curves +
    '<line x1="50" y1="650" x2="500" y2="452" stroke="var(--cover-ink)" stroke-width="1.5" stroke-dasharray="7 6" opacity=".45"/>' + pts + '</svg>';
  // Reading: a shelf of books with a leaning volume and a sprig
  const sp = [[24,26,74,'books'],[52,18,92,'today'],[72,30,64,'concepts'],[104,22,84,'progress'],[128,16,70,'problems'],[146,28,96,'books'],[176,20,60,'today']];
  const shelf = '<svg class="art" viewBox="0 0 320 132" aria-hidden="true"><rect x="12" y="112" width="296" height="5" rx="2" fill="var(--ink)" opacity=".55"/>' + sp.map(b => '<rect x="' + b[0] + '" y="' + (112 - b[2]) + '" width="' + b[1] + '" height="' + b[2] + '" rx="2" fill="var(--c-' + b[3] + ')"/><rect x="' + (b[0] + 4) + '" y="' + (112 - b[2] + 10) + '" width="' + (b[1] - 8) + '" height="3" rx="1.5" fill="var(--paper)" opacity=".75"/><rect x="' + (b[0] + 4) + '" y="' + (112 - b[2] + 17) + '" width="' + (b[1] - 8) + '" height="2" rx="1" fill="var(--paper)" opacity=".5"/>').join('') +
    '<g transform="rotate(-16 222 112)"><rect x="200" y="30" width="22" height="82" rx="2" fill="var(--c-concepts)"/><rect x="204" y="40" width="14" height="3" rx="1.5" fill="var(--paper)" opacity=".75"/></g>' +
    '<path d="M258 112h34l-4 -22h-26z" fill="var(--c-progress)"/><path d="M275 90C275 70 272 56 266 44" fill="none" stroke="var(--c-problems)" stroke-width="2.5" stroke-linecap="round"/><ellipse cx="262" cy="52" rx="10" ry="5" transform="rotate(-38 262 52)" fill="var(--c-problems)"/><ellipse cx="279" cy="62" rx="10" ry="5" transform="rotate(28 279 62)" fill="var(--c-today)"/><ellipse cx="266" cy="74" rx="9" ry="4.5" transform="rotate(-24 266 74)" fill="var(--c-today)"/></svg>';
  // Problems: a plotted curve with its maximum marked, a tangent, and a pencil
  let gl = ''; for(let x = 24; x <= 296; x += 16) gl += '<line x1="' + x + '" x2="' + x + '" y1="14" y2="118"/>'; for(let y = 22; y <= 118; y += 16) gl += '<line x1="24" x2="296" y1="' + y + '" y2="' + y + '"/>';
  let cv = '', dv = ''; for(let i = 0; i <= 60; i++){ const t = i / 10, x = 40 + t * 38; cv += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + (104 - t * Math.exp(-t) * 215).toFixed(1); dv += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + (104 - Math.exp(-t) * (1 - t) * 60).toFixed(1); }
  const graph = '<svg class="art" viewBox="0 0 320 132" aria-hidden="true"><g stroke="var(--ink)" stroke-width="1" opacity=".13">' + gl + '</g><path d="M40 14V104H296" fill="none" stroke="var(--ink)" stroke-width="1.75" opacity=".7"/><path d="' + dv + '" fill="none" stroke="var(--c-concepts)" stroke-width="2" stroke-dasharray="5 4"/><path d="' + cv + '" fill="none" stroke="var(--c-problems)" stroke-width="3" stroke-linecap="round"/><line x1="52" x2="104" y1="24.9" y2="24.9" stroke="var(--c-progress)" stroke-width="2"/><line x1="78" x2="78" y1="24.9" y2="104" stroke="var(--ink)" stroke-width="1" stroke-dasharray="3 4" opacity=".6"/><circle cx="78" cy="24.9" r="5" fill="var(--paper)" stroke="var(--c-progress)" stroke-width="2.5"/>' +
    '<g transform="rotate(38 250 60)"><rect x="244" y="18" width="12" height="62" fill="var(--c-today)"/><rect x="244" y="12" width="12" height="8" rx="2" fill="var(--c-progress)"/><path d="M244 80h12l-6 14z" fill="var(--paper)" stroke="var(--ink)" stroke-width="1" opacity=".9"/><path d="M247.5 88h5l-2.5 6z" fill="var(--ink)"/></g></svg>';
  const lab = (v, tc, art, name, desc, stats) => '<button class="lab" style="--tc:var(--c-' + tc + ')" ' + (first ? 'data-act="bookform"' : 'data-act="go" data-v="' + v + '"') + '>' + art + '<span class="txt"><span class="h">' + name + '</span><span>' + desc + '</span><span class="small">' + stats + '</span><span class="go">' + (first ? 'Add your first book' : 'Open ' + name) + '<span class="arr" aria-hidden="true">→</span></span></span></button>';
  return '<div class="cover">' + bg + '<div class="ktop"><span>Notebook · ' + esc(DATE) + '</span><span>Reading · Problems</span></div>' +
    '<div class="khead"><h1 aria-label="Knowledge Lab"><svg class="ktitle" viewBox="0 0 1000 124" aria-hidden="true"><defs><linearGradient id="kfoil" x1="0" x2="0" y1="0" y2="1"><stop offset="0" style="stop-color:color-mix(in srgb, var(--foil) 72%, #fff)"/><stop offset=".55" style="stop-color:var(--foil)"/><stop offset="1" style="stop-color:color-mix(in srgb, var(--foil) 82%, #000)"/></linearGradient></defs><text x="2" y="106" font-size="126" textLength="996" lengthAdjust="spacing">KNOWLEDGE</text></svg></h1><span class="klab" aria-hidden="true">Lab</span><p class="ktag">Read to understand. Solve to prove it.</p></div>' +
    '<div class="stack" style="gap:18px">' + (first ? '<p class="kfirst">Your notebook is empty. Everything begins with a book: add the first text you are studying, and its notes, concepts and problems all hang from it.</p>' : '') + '<div class="labs">' + lab('books', 'books', shelf, 'Reading Lab', 'Books, study sessions and notes, for understanding ideas.', plural(S.books.length, 'book') + ' · ' + plural(S.notes.length, 'note')) +
    lab('problems', 'problems', graph, 'Problem Lab', 'Problems, worked attempts and corrections, for deriving and solving.', plural(S.problems.length, 'problem') + ' · ' + plural(S.pAttempts.length, 'attempt') + (nIn ? ' · ' + nIn + ' in the inbox' : '')) + '</div>' +
    (first ? '<div class="coverlinks"><button data-act="bookform">Add your first book</button><button data-act="klpick">Restore a backup</button><button data-act="klexample">Load the example notebook</button><input type="file" accept="application/json,.json" hidden id="klfile" data-klimport></div></div></div>' : '') + (first ? '' : '<div class="coverlinks"><button data-act="go" data-v="today">Today' + (d ? ' · ' + plural(d, 'review') + ' ready' : '') + '</button><button data-act="go" data-v="progress">Progress</button></div></div></div>');
}
const subnav = () => { const g = NAV.find(v => v[2].includes(S.view)), d = g && SUBS[g[0]]; if(!d) return ''; const nIn = S.inbox.filter(x => !x.filed).length; return '<nav class="sub" aria-label="' + d[0] + '"><span class="subname">' + d[0] + '</span>' + d[1].map(x => '<button data-act="go" data-v="' + x[0] + '"' + ((S.view === x[0] || (x[0] === 'books' && ['book','chapter','analysis'].includes(S.view))) ? ' aria-current="page"' : '') + '>' + x[1] + (x[0] === 'inbox' && nIn ? ' <span class="n">' + nIn + '</span>' : x[0] === 'work' && S.pw ? ' <span class="n">in progress</span>' : '') + '</button>').join('') + '</nav>'; };
function render(keepScroll){
  if(REAL && !S.books.length) S.view = 'cover';
  const m = $('main'), y = m.scrollTop;
  $('app').classList.toggle('cornell', S.style === 'cornell'); $('app').classList.toggle('on-cover', S.view === 'cover');
  if(S.view === 'cover'){ $('app').dataset.sec = 'cover'; m.innerHTML = vCover(); $('fab').hidden = true; m.scrollTop = 0; nav(); top(); return; }
  $('app').dataset.sec = (NAV.find(v => v[2].includes(S.view)) || NAV[0])[0];
  m.innerHTML = '<div class="pg">' + ({today:vToday, books:vBooks, book:vBook, chapter:vChapter, analysis:vAnalysis, session:vSession, notes:vNotes, review:vReview, concepts:vConcepts, problems:vProblems, work:vWorkspace, inbox:vInbox, errors:vErrors, progress:vProgress}[S.view] || vToday)() + '</div>';
  $('fab').hidden = S.inkFs != null || S.graphFs != null || !!S.flow || !!S.sheet || ['books','book','analysis','problems','work','inbox','errors','progress','review'].includes(S.view);
  m.scrollTop = keepScroll ? y : 0; nav(); top(); initInk();
}
function sheet(){
  const o = $('overlay'); const old = o.querySelector('.sheet-bg'); if(old) old.remove();
  if(!S.sheet) return;
  const d = document.createElement('div'); d.className = 'sheet-bg'; d.dataset.act = 'sheetbg';
  if(S.sheet === 'page'){
    d.innerHTML = '<div class="sheet stack" role="dialog" aria-label="Page"><div class="row" style="justify-content:space-between"><h2>Page</h2><button class="btn link" data-act="sheetclose">Done</button></div>' +
      '<div class="stack" style="gap:2px"><h3>Layout</h3>' + opts('setstyle','s',[['lined','Lined, with page numbers in the margin'],['cornell','Cornell, with cues, notes and a summary']], S.style, true) + '</div>' +
      '<div class="stack" style="gap:2px"><h3>Paper</h3>' + opts('settheme','t',[['system','Match my device'],['light','Light paper'],['dark','Dark paper']], S.theme) + '</div><div class="stack" style="gap:6px"><h3>Colour set</h3><div class="pals">' + Object.keys(PALS).map(k => (k === 'midnight' ? '</div><span class="palgroup">Deep sets</span><div class="pals">' : '') + '<button class="palbtn" data-act="setpal" data-p="' + k + '" aria-pressed="' + (S.pal === k) + '"><span class="dots">' + (PALS[k][3] ? [PALS[k][3].cover] : []).concat(PALS[k][2]).map(c => '<i style="background:' + c + '"></i>').join('') + '</span>' + PALS[k][0] + '</button>').join('') + '</div></div><div class="stack" style="gap:6px"><h3>Writing</h3><span class="palgroup">Font for everything you type</span>' + opts('setwfont', 'f', [['','Sans'],['serif','Serif'],['mono','Monospace'],['hand','Handwritten']], S.wfont || '') + '<span class="palgroup">Size</span>' + opts('setwsize', 'z', [['s','Small'],['','Medium'],['l','Large'],['xl','Extra large']], S.wsize || '') + '<p class="small">A text block or note can override these with its own font, size, bold and italic.</p></div>' + (REAL ? '<div class="stack" style="gap:6px"><h3>Your data</h3><p class="small">Saved on this device only. Make a backup file now and then, and use it to move your notebook to another device.</p><div class="row"><button class="btn" data-act="klexport">Save a backup file</button><label class="btn" style="cursor:pointer">Restore a backup<input type="file" accept="application/json,.json" hidden data-klimport></label></div><p class="small" id="klstore"></p></div><div class="stack" style="gap:6px"><h3>Evaluation service</h3><p class="small">The address and passcode of your own evaluation server. Leave empty to save attempts as waiting for evaluation.</p><label class="f" for="klurl">Address<input type="text" id="klurl" data-klset="aiUrl" value="' + esc(S.aiUrl || '') + '" placeholder="https://…workers.dev" autocapitalize="off" autocomplete="off"></label><label class="f" for="klpass">Passcode<input type="text" id="klpass" data-klset="aiPass" value="' + esc(S.aiPass || '') + '" autocapitalize="off" autocomplete="off"></label><div class="row"><button class="btn" data-act="kltest">Test the connection</button><span class="small" id="kltest"></span></div></div>' : '') + '<p class="small">With a keyboard: 0 goes Home, 1 to 5 switch the tabs on screen, N adds a note.</p></div>';
    o.appendChild(d); return;
  }
  if(S.sheet === 'imp'){
    d.innerHTML = '<form class="sheet stack" id="impform" role="dialog" aria-label="Import a list of books"><h2>Import a list</h2><p class="small">Paste one book per line: title; author; edition; year. Only the title is required. Columns copied from a spreadsheet work too.</p><label class="f" for="imp_text">Books<textarea id="imp_text" data-draft="imp_text" style="min-height:192px" placeholder="Convex Optimization; Boyd and Vandenberghe; 1st; 2004">' + esc(S.drafts.imp_text || '') + '</textarea></label><div class="stack" style="gap:2px"><h3>Add them as</h3>' + opts('impstatus','v',[['','Not started']].concat(STATUSES.map(x => [x,x])), S.drafts.imp_status || '') + '</div><div class="row"><button class="btn primary" type="submit">Add to the shelf</button><button class="btn link" type="button" data-act="sheetclose">Cancel</button></div></form>';
    o.appendChild(d); return;
  }
  if(S.sheet === 'book'){
    const D = S.drafts, fld = (k, label, cls, ph) => '<label class="f' + (cls ? ' ' + cls : '') + '" for="' + k + '">' + label + '<input type="text" id="' + k + '" data-draft="' + k + '" value="' + esc(D[k] || '') + '"' + (ph ? ' placeholder="' + ph + '"' : '') + '></label>';
    d.innerHTML = '<form class="sheet stack" id="bookform" role="dialog" aria-label="Book details"><h2>' + (S.editBook ? 'Edit book' : 'Add a book') + '</h2><div class="fgrid">' + fld('bk_title','Title','wide') + fld('bk_author','Author','wide') + fld('bk_edition','Edition','', '2nd') + fld('bk_year','Year','', '2019') + '<label class="f wide" for="bk_chapters">Chapters, one per line<textarea class="short" id="bk_chapters" data-draft="bk_chapters" style="min-height:96px">' + esc(D.bk_chapters || '') + '</textarea></label>' + fld('bk_purpose','What do you want to understand or be able to do?','wide') + '</div><div class="stack" style="gap:2px"><h3>Status</h3>' + opts('bkstatus','v',[['','Not started']].concat(STATUSES.map(x => [x,x])), D.bk_status || '') + '</div><div class="stack" style="gap:2px"><h3>Depth</h3>' + opts('bkdepth','v',DEPTHS.map(x => [x,x]), D.bk_depth) + '</div><div class="row"><button class="btn primary" type="submit">Save book</button><button class="btn link" type="button" data-act="sheetclose">Cancel</button>' + (S.editBook ? '<span class="grow"></span><button class="btn link" type="button" data-act="bookdel" style="color:var(--red)">' + (S.delArm === 'b' + S.editBook ? 'Tap again to delete' : 'Delete book') + '</button>' : '') + '</div>' + (S.editBook && S.delArm === 'b' + S.editBook ? '<p class="small" style="color:var(--red)">' + esc(delBookText(S.editBook)) + '</p>' : '') + '</form>';
    o.appendChild(d); return;
  }
  if(S.sheet === 'prob'){
    const D = S.drafts, bk = D.pr_book && book(D.pr_book), chs = bk ? (bk.chapters || []) : [], fld = (k, label, cls, ph) => '<label class="f' + (cls ? ' ' + cls : '') + '" for="' + k + '">' + label + '<input type="text" id="' + k + '" data-draft="' + k + '" value="' + esc(D[k] || '') + '"' + (ph ? ' placeholder="' + ph + '"' : '') + '></label>';
    d.innerHTML = '<form class="sheet stack" id="probform" role="dialog" aria-label="Problem details"><h2>' + (S.editProb ? 'Edit problem' : 'Add a problem') + '</h2>' + pkBlock() + (bk ? '<div class="fgrid">' + (chs.length ? '<label class="f wide" for="pr_ch">Chapter<select id="pr_ch" data-draft="pr_ch"><option value="">No chapter</option>' + chs.map((c, i) => '<option value="' + i + '"' + (String(D.pr_ch) === String(i) ? ' selected' : '') + '>' + esc(c) + '</option>').join('') + '</select></label>' : '') + fld('pr_sec','Section','', '§2.4') + fld('pr_ex','Exercise number','', 'Ex. 2.18') + '<label class="f wide" for="pr_text">Problem statement<textarea class="short" id="pr_text" data-draft="pr_text" style="min-height:96px">' + esc(D.pr_text || '') + '</textarea></label>' + fld('pr_tags','Topic tags, separated by commas','wide') + fld('pr_parts','Parts, if it has them (for example a-f, or a, b, c)','wide') + '<label class="f wide" for="pr_sol">Worked solution (optional; shown only after you submit an attempt)<textarea class="short" id="pr_sol" data-draft="pr_sol" style="min-height:72px">' + esc(D.pr_sol || '') + '</textarea></label></div><p class="small">To bring in a statement as screenshots or a PDF instead, use the Inbox.</p>' : '') + '<div class="row">' + (bk ? '<button class="btn primary" type="submit">Save problem</button>' : '') + '<button class="btn link" type="button" data-act="sheetclose">Cancel</button>' + (S.editProb ? '<span class="grow"></span><button class="btn link" type="button" data-act="probdel" style="color:var(--red)">' + (S.delArm === 'p' + S.editProb ? 'Tap again to delete' : 'Delete problem') + '</button>' : '') + '</div>' + (S.editProb && S.delArm === 'p' + S.editProb ? '<p class="small" style="color:var(--red)">' + esc(delProbText(S.editProb)) + '</p>' : '') + '</form>';
    o.appendChild(d); return;
  }
  if(S.sheet === 'pickbook'){
    d.innerHTML = '<div class="sheet stack" role="dialog" aria-label="Choose the book"><h2>Which book are these pages from?</h2>' + pkBlock() + '<div class="row">' + (S.drafts.pr_book ? '<button class="btn primary" data-act="ifilego">File under this book</button>' : '') + '<button class="btn link" data-act="sheetclose">Cancel</button></div></div>';
    o.appendChild(d); return;
  }
  if(S.sheet === 'declare'){
    d.innerHTML = '<div class="sheet stack" role="dialog" aria-label="File handwritten page"><h2>File this page as an attempt</h2><p class="small">The work was done in another app, so say how you did it. It is recorded as self-declared.</p><div class="stack" style="gap:2px"><h3>Mode</h3>' + opts('declmode','m',MODES,S.decl.mode) + '</div><div class="stack" style="gap:2px"><h3>Help used</h3>' + opts('declhelp','h',[['no','None'],['yes','Hints or a solution']], S.decl.help ? 'yes' : 'no') + '</div><div class="row"><button class="btn primary" data-act="declsave">File attempt</button><button class="btn link" data-act="sheetclose">Cancel</button></div></div>';
    o.appendChild(d); return;
  }
  d.innerHTML = '<form class="sheet stack" id="capform" role="dialog" aria-label="' + (S.editNote ? 'Edit note' : 'Quick note') + '"><div class="row" style="justify-content:space-between"><h2>' + (S.editNote ? 'Edit note' : 'Note') + '</h2><span class="small">' + esc(book(S.curBook).title) + '</span></div><label class="f" for="cap">' + (S.editNote ? 'Note' : 'What did you notice?') + '<textarea id="cap" data-draft="cap" style="' + fmtCss(S.noteFmt) + '">' + esc(S.drafts.cap || '') + '</textarea></label>' + fmtBar(S.noteFmt || {}, '', false) + ((S.style === 'cornell' || (S.editNote && S.drafts.capcue)) ? '<label class="f" for="capcue">Cue: a question this note answers (optional)<input type="text" id="capcue" data-draft="capcue" value="' + esc(S.drafts.capcue || '') + '"></label>' : '') + '<div class="row" style="gap:8px"><span class="small">Pen</span>' + swatches('ncolor', '', S.noteColor) + '</div><label class="f" for="caploc">Page or section<input type="text" id="caploc" data-draft="caploc" value="' + esc(S.drafts.caploc != null ? S.drafts.caploc : defLoc()) + '"></label>' + (S.editNote && S.drafts.capeq != null ? '<label class="f" for="capeq">Equation line<input type="text" id="capeq" data-draft="capeq" value="' + esc(S.drafts.capeq) + '"></label>' : '') + (S.editNote && S.drafts.capextra != null ? '<label class="f" for="capextra">Detail line<input type="text" id="capextra" data-draft="capextra" value="' + esc(S.drafts.capextra) + '"></label>' : '') + '<div class="row"><button class="btn primary" type="submit">Save</button><button class="btn link" type="button" data-act="sheetclose">Cancel</button>' + (S.editNote ? '<span class="grow"></span><button class="btn link" type="button" data-act="notedel" style="color:var(--red)">' + (S.delArm === S.editNote ? 'Tap again to delete' : 'Delete note') + '</button>' : '') + '</div></form>';
  o.appendChild(d); const t = $('cap'); if(t) t.focus();
}
function saveBook(){
  const D = S.drafts, title = (D.bk_title || '').trim(); if(!title){ toast('Give the book a title.'); return; }
  const data = {title:title, author:(D.bk_author || '').trim(), edition:(D.bk_edition || '').trim(), year:(D.bk_year || '').trim(), chapters:(D.bk_chapters || '').split('\n').map(x => x.trim()).filter(Boolean), purpose:(D.bk_purpose || '').trim().replace(/\.$/, ''), status:D.bk_status, depth:D.bk_depth};
  let b = S.editBook && book(S.editBook);
  if(b) Object.assign(b, data); else { b = Object.assign({id:'b' + Date.now(), pos:'', output:'', reviews:true}, data); S.books.push(b); }
  b.reviews = b.depth !== 'Reference';
  S.selBook = b.id; if(!S.curBook || !book(S.curBook)) S.curBook = b.id; changed(1); if(S.afterBook){ const back = S.afterBook; S.afterBook = null; S.drafts.pr_book = b.id; S.drafts.pk_q = ''; S.sheet = back; sheet(); render(true); toast('Book added to the Reading Lab and selected.'); return; } S.sheet = false; sheet(); go('book'); toast('Book saved.');
}

function dropProblems(ids){
  const B = {problems:S.problems.filter(p => ids.includes(p.id)), pAttempts:S.pAttempts.filter(a => ids.includes(a.problem)), items:S.items.filter(it => it.kind === 'problem' && ids.includes(it.problem)), cprobs:[]};
  S.concepts.forEach(c => (c.problems || []).forEach(x => { if(ids.includes(x)) B.cprobs.push([c.id, x]); }));
  S.problems = S.problems.filter(p => !ids.includes(p.id)); S.pAttempts = S.pAttempts.filter(a => !ids.includes(a.problem)); S.items = S.items.filter(it => !(it.kind === 'problem' && ids.includes(it.problem)));
  S.concepts.forEach(c => { if(c.problems) c.problems = c.problems.filter(x => !ids.includes(x)); }); if(S.pw && ids.includes(S.pw.problem)) S.pw = null;
  if(ids.includes(S.selProblem)){ S.selProblem = S.problems.length ? S.problems[0].id : null; S.problemOpen = false; }
  return B;
}
function dropNotes(ids){
  const B = {notes:S.notes.filter(n => ids.includes(n.id)), links:[], items:[], inotes:[]};
  S.concepts.forEach(c => c.links.forEach(l => { if(ids.includes(l.n)) B.links.push([c.id, l]); }));
  S.items.forEach(it => { if(!it.notes || !it.notes.length) return; if(it.notes.every(x => ids.includes(x))) B.items.push(it); else it.notes.forEach(x => { if(ids.includes(x)) B.inotes.push([it.id, x]); }); });
  S.notes = S.notes.filter(n => !ids.includes(n.id)); S.concepts.forEach(c => { c.links = c.links.filter(l => !ids.includes(l.n)); });
  S.items = S.items.filter(it => !B.items.includes(it)); S.items.forEach(it => { if(it.notes) it.notes = it.notes.filter(x => !ids.includes(x)); });
  return B;
}
const TRASHDAYS = 30;
function toTrash(kind, label, parts){ const B = {}; parts.forEach(p => Object.keys(p).forEach(k => { B[k] = (B[k] || []).concat(p[k]); })); S.trash = (S.trash || []).concat([{id:'t' + Date.now(), kind:kind, label:label, when:'Today', B:B}]); }
function fromTrash(id){
  const t = (S.trash || []).find(x => x.id === id); if(!t) return; const B = t.B, cid = i => S.concepts.find(c => c.id === i);
  (B.books || []).forEach(x => S.books.push(x)); (B.sessions || []).forEach(x => S.sessions.push(x)); (B.notes || []).forEach(x => S.notes.push(x)); (B.problems || []).forEach(x => S.problems.push(x)); (B.pAttempts || []).forEach(x => S.pAttempts.push(x)); (B.items || []).forEach(x => S.items.push(x));
  (B.links || []).forEach(x => { const c = cid(x[0]); if(c) c.links.push(x[1]); }); (B.cprobs || []).forEach(x => { const c = cid(x[0]); if(c) (c.problems = c.problems || []).push(x[1]); }); (B.inotes || []).forEach(x => { const it = S.items.find(i => i.id === x[0]); if(it && it.notes) it.notes.push(x[1]); });
  S.trash = S.trash.filter(x => x.id !== id); if(!prob(S.selProblem) && S.problems.length) S.selProblem = S.problems[0].id;
}
const trashLink = () => (S.trash || []).length ? '<button class="btn link mini" data-act="trashopen" style="align-self:flex-start">Recently deleted (' + S.trash.length + ')</button>' : '';
function trashSheet(){
  const o = $('overlay'), old = o.querySelector('.sheet-bg'); if(old) old.remove(); const d = document.createElement('div'); d.className = 'sheet-bg'; d.dataset.act = 'sheetbg'; const T = S.trash || [];
  d.innerHTML = '<div class="sheet stack" role="dialog" aria-label="Recently deleted"><div class="row" style="justify-content:space-between"><h2>Recently deleted</h2><button class="btn link" data-act="sheetclose">Done</button></div><p class="small">Deleted books, problems and notes are kept for ' + TRASHDAYS + ' days, with everything that went with them, then removed for good.</p>' +
    (T.length ? '<div class="lines">' + T.slice().reverse().map(t => { const B = t.B, bits = [B.notes && B.notes.length && t.kind !== 'Note' ? plural(B.notes.length, 'note') : '', B.problems && B.problems.length && t.kind !== 'Problem' ? plural(B.problems.length, 'problem') : '', B.pAttempts && B.pAttempts.length ? plural(B.pAttempts.length, 'attempt') : ''].filter(Boolean).join(', ');
      return '<div class="trow"><div class="stack" style="gap:2px;min-width:0"><span class="kind">' + t.kind + ' · deleted ' + esc(t.when.toLowerCase()) + ' · ' + TRASHDAYS + ' days left</span><p style="margin:0;overflow-wrap:anywhere">' + esc(t.label) + '</p>' + (bits ? '<p class="small">With ' + bits + '.</p>' : '') + '</div><div class="row" style="flex:none"><button class="btn" data-act="trashrestore" data-id="' + t.id + '">Restore</button><button class="btn link mini" data-act="trashpurge" data-id="' + t.id + '" style="color:var(--red)">' + (S.delArm === t.id ? 'Tap again' : 'Delete for good') + '</button></div></div>'; }).join('') + '</div>' : '<p class="soft">Nothing here.</p>') + '</div>';
  o.appendChild(d);
}
const delProbText = id => { const n = S.pAttempts.filter(a => a.problem === id).length; return 'This also deletes ' + plural(n, 'attempt') + ', corrections included, and any retry scheduled for it. It goes to Recently deleted for ' + TRASHDAYS + ' days.'; };
const delBookText = id => { const ps = S.problems.filter(p => p.book === id); return 'This also deletes ' + plural(S.notes.filter(n => n.book === id).length, 'note') + ', ' + plural(S.sessions.filter(x => x.book === id).length, 'session') + ', its analytical reading, and ' + plural(ps.length, 'problem') + ' with ' + plural(S.pAttempts.filter(a => ps.some(p => p.id === a.problem)).length, 'attempt') + '. It all goes to Recently deleted for ' + TRASHDAYS + ' days.'; };
function saveProb(){
  const D = S.drafts, bk = D.pr_book && book(D.pr_book), text = (D.pr_text || '').trim();
  if(!bk){ toast('Choose a book from your Reading Lab library first.'); return; }
  if(!text && !(S.editProb && prob(S.editProb) && prob(S.editProb).crop)){ toast('Write the problem statement, or import it through the Inbox.'); return; }
  const ch = D.pr_ch === '' || D.pr_ch == null ? null : +D.pr_ch, sec = (D.pr_sec || '').trim() || (ch != null ? 'Ch. ' + (ch + 1) : '');
  if(S.editProb){ const q = prob(S.editProb); if(q){ Object.assign(q, {book:bk.id, ch:ch, loc:[sec, (D.pr_ex || '').trim()].filter(Boolean).join(', ') || 'Untitled problem', tags:(D.pr_tags || '').split(',').map(x => x.trim()).filter(Boolean), text:text, parts:parseParts(D.pr_parts), solution:(D.pr_sol || '').trim()}); } S.editProb = null; S.sheet = false; sheet(); changed(1); render(true); toast('Problem updated. Earlier attempts are unchanged.'); return; }
  const p = {id:'p' + Date.now(), book:bk.id, ch:ch, loc:[sec, (D.pr_ex || '').trim()].filter(Boolean).join(', ') || 'Untitled problem', tags:(D.pr_tags || '').split(',').map(x => x.trim()).filter(Boolean), text:text, parts:parseParts(D.pr_parts), hints:[], solution:(D.pr_sol || '').trim()};
  S.problems.push(p); S.selProblem = p.id; S.problemOpen = true; S.sheet = false; sheet(); changed(1); go('problems'); toast('Problem saved under ' + bk.title + '.');
}
function go(v){ S.inkFs = null; S.graphFs = null; S.view = v; try{ history.replaceState(null, '', '#' + v); }catch(e){} render(); }
const resetRev = () => { S.rev = {shown:false, hint:false, graded:null, cause:null}; delete S.drafts.rans; };

document.addEventListener('input', e => { const ds = e.target.dataset || {}; if(ds.st){ if(S.study) S.study[ds.st] = e.target.value; return; } if(ds.cf){ S.concepts.find(x => x.id === S.selConcept)[ds.cf] = e.target.value; return; } if(ds.pans && S.pw){ S.pw.pans[S.pw.part] = e.target.value; return; } if(ds.pfix !== undefined && S.pw && S.pw.partRes){ S.pw.partRes[+ds.pfix].fix = e.target.value; return; } if(ds.impparts !== undefined && S.imp){ const I = S.imp; (I.pparts = I.pparts || {})[I.mode + ds.impparts] = e.target.value; return; } if(ds.cname){ const c = S.concepts.find(x => x.id === S.selConcept); c.name = e.target.value.trim() || 'Untitled concept'; const l = $('clist'); if(l) l.innerHTML = cList(); return; } if(ds.cmp){ const c = S.concepts.find(x => x.id === S.selConcept), p = ds.cmp.split('|'); c.cmp = c.cmp || {}; c.cmp[p[0]] = c.cmp[p[0]] || {}; c.cmp[p[0]][p[1]] = e.target.value; return; } const ark = e.target.dataset && e.target.dataset.ar; if(ark){ const b = book(S.selBook); b.ar = b.ar || {}; b.ar[ark] = e.target.value; return; } const bi = e.target.dataset && e.target.dataset.block; if(bi !== undefined && S.pw){ const b = S.pw.blocks[+bi]; if(b){ b[e.target.dataset.f || 'text'] = e.target.value; if(b.type === 'graph'){ const g = $('g_' + bi); if(g) g.innerHTML = plot(b, graphSize(+bi)); } } return; } const k = e.target.dataset && e.target.dataset.draft; if(!k) return; S.drafts[k] = e.target.value; if(k === 'cq'){ const l = $('clist'); if(l) l.innerHTML = cList(); } if(k === 'pq'){ const l = $('plist'); if(l) l.innerHTML = probList(); } if(k === 'cnq'){ const l = $('cnlist'), c = S.concepts.find(x => x.id === S.selConcept); if(l && c) l.innerHTML = cLinkList(c); } if(k === 'pk_q'){ const l = $('pklist'); if(l) l.innerHTML = pkList(); } if(k === 'libq'){ S.libLimit = 100; const l = $('liblist'); if(l) l.innerHTML = libRows(); } });
document.addEventListener('submit', e => {
  e.preventDefault(); if(e.target.id === 'bookform'){ saveBook(); return; } if(e.target.id === 'impform'){ saveImport(); return; } if(e.target.id === 'probform'){ saveProb(); return; } if(e.target.id !== 'capform') return;
  const text = (S.drafts.cap || '').trim(); if(!text){ toast('Write something first.'); return; }
  const loc = (S.drafts.caploc != null ? S.drafts.caploc : defLoc()).trim();
  if(S.editNote){ const n = note(S.editNote); if(n){ n.text = text; n.loc = loc || 'No location'; n.color = S.noteColor; if(S.drafts.capeq != null) n.eq = S.drafts.capeq.trim(); if(S.drafts.capextra != null) n.extra = S.drafts.capextra.trim(); delete S.drafts.capeq; delete S.drafts.capextra; Object.assign(n, {font:'', size:'', bold:false, ital:false}, S.noteFmt || {}); if(S.drafts.capcue != null) n.cue = S.drafts.capcue.trim(); } S.editNote = null; S.noteFmt = null; delete S.drafts.cap; delete S.drafts.capcue; delete S.drafts.caploc; S.sheet = false; sheet(); changed(1); render(true); toast('Note updated.'); return; }
  S.notes.push({id:'n' + Date.now(), cue:(S.drafts.capcue || '').trim(), book:S.curBook, ch:(S.capCh != null ? S.capCh : book(S.curBook).ch), type:'', loc:loc || 'No location', origin:'Own words', text:text});
  if(loc) S.lastLoc = loc; delete S.drafts.cap; delete S.drafts.capcue; delete S.drafts.caploc; S.notes[S.notes.length - 1].color = S.noteColor; Object.assign(S.notes[S.notes.length - 1], S.noteFmt || {}); S.sheet = false; sheet(); changed(1); render(true); toast('Saved on this device.');
});
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if(!el) return; const a = el.dataset.act, f = S.flow, r = S.rev, w = S.pw;
  if(a === 'sheetbg'){ if(e.target === el){ S.sheet = false; sheet(); render(true); } return; }
  switch(a){
    case 'go': go(el.dataset.v); break;
    case 'offline': if(REAL){ toast(S.saveErr ? 'The last save failed. Free some space, then make any change to try again.' : 'Everything is saved on this device. Use Page to make a backup file.'); break; } S.offline = !S.offline; if(!S.offline && pendingEvals().length) setTimeout(() => toast(plural(pendingEvals().length, 'attempt') + ' waiting for evaluation. Open the Problem Lab library to evaluate.'), 2600); if(!S.offline && S.unsynced){ const n = S.unsynced; S.unsynced = 0; changed(n); toast('Back online. Syncing ' + n + ' ' + (n === 1 ? 'change' : 'changes') + '.'); } else { top(); toast(S.offline ? 'Offline. Everything still saves on this device.' : 'Online.'); } break;
    case 'capture': if(S.view === 'chapter'){ S.curBook = S.selBook; S.capCh = S.selCh; } else S.capCh = null; S.editNote = null; delete S.drafts.caploc; S.sheet = 'note'; sheet(); render(true); break;
    case 'pagesheet': S.sheet = 'page'; sheet(); render(true); break;
    case 'setstyle': S.style = el.dataset.s; savePrefs(); render(true); sheet(); break;
    case 'setpal': S.pal = el.dataset.p; applyTheme(); savePrefs(); sheet(); break;
    case 'settheme': S.theme = el.dataset.t; applyTheme(); savePrefs(); sheet(); break;
    case 'noteedit': { const n = note(el.dataset.id); if(!n) break; S.noteFmt = {font:n.font || '', size:n.size || '', bold:!!n.bold, ital:!!n.ital}; S.delArm = null; if(n.eq) S.drafts.capeq = n.eq; else delete S.drafts.capeq; if(n.extra) S.drafts.capextra = n.extra; else delete S.drafts.capextra; S.editNote = n.id; S.curBook = n.book; S.drafts.cap = n.text; S.drafts.caploc = n.loc || ''; if(n.cue) S.drafts.capcue = n.cue; else delete S.drafts.capcue; if(n.color) S.noteColor = n.color; S.sheet = 'note'; sheet(); render(true); break; }
    case 'sheetclose': S.editProb = null; S.delArm = null; if(S.editNote){ S.noteFmt = null; S.editNote = null; delete S.drafts.cap; delete S.drafts.capcue; delete S.drafts.caploc; } S.afterBook = null; S.sheet = false; sheet(); render(true); break;
    case 'problem': S.attOpen = undefined; S.attCmp = false; S.selProblem = el.dataset.id; S.problemOpen = true; if(S.view !== 'problems') go('problems'); else render(); break;
    case 'problemback': S.problemOpen = false; render(); break;
    case 'pmode': S.pmode = el.dataset.m; render(true); break;
    case 'pstart': S.pw = {problem:S.selProblem, mode:S.pmode, hints:0, solution:false, sections:[], secs:[], calcs:[], checks:{}, step:'work', errors:[], solShown:false, blocks:[{type:'text', color:'blue', text:''}], pans:{}, started:Date.now()}; { const pp = prob(S.selProblem); if(pp && (pp.parts || []).length){ const rt = S.retryParts && S.retryParts.problem === pp.id ? S.retryParts.parts.filter(l => pp.parts.includes(l)) : []; if(rt.length) S.pw.only = rt; const pl = S.pw.only || pp.parts; S.pw.part = pl[0]; S.pw.blocks[0].part = pl[0]; } S.retryParts = null; } ['pw_work','pw_fix','pw_calc','pw_given','pw_assume','pw_plan'].forEach(k => delete S.drafts[k]); go('work'); break;
    case 'psec': w.sections.push(el.dataset.s); render(true); break;
    case 'psecdel': { const k = el.dataset.s, had = (S.drafts['pw_' + k] || '').trim(); w.sections = w.sections.filter(x => x !== k); render(true); if(had) toast('Section removed. Add it again to get its text back.'); break; }
    case 'phint': { const p = prob(w.problem); if(w.hints < p.hints.length) w.hints++; else w.solution = true; changed(1); render(true); break; }
    case 'pcalc': { const x = (S.drafts.pw_calc || '').trim(); if(!x) break; try{ w.calcs.push({in:x, out:calc(x)}); delete S.drafts.pw_calc; }catch(err){ toast('That could not be read. Use numbers, + - * / ^, brackets, sqrt, sin, cos, exp, ln, pi.'); } render(true); break; }
    case 'pcheck': { const k = el.dataset.k, c = w.checks[k]; if(!c) w.checks[k] = 'passed'; else if(c === 'passed') w.checks[k] = 'failed'; else delete w.checks[k]; render(true); break; }
    case 'psubmit': { const full = b => b.type === 'ink' ? b.strokes.length : b.type === 'text' ? b.text.trim() : (b.expr || '').trim(); const pp = prob(w.problem), pl = w.only || (pp && pp.parts) || []; if(!w.blocks.some(full) && !pl.some(l => (w.pans[l] || '').trim())){ toast('Write some working first, even a partial attempt.'); break; } w.blocks = w.blocks.filter(full); if(pl.length && w.part){ w.blocks = pl.map(l => w.blocks.filter(b => b.part === l)).reduce((a, x) => a.concat(x), []).concat(w.blocks.filter(b => !pl.includes(b.part))); w.partRes = pl.map(l => ({label:l, answer:(w.pans[l] || '').trim(), mark:'', fix:''})); } w.blocks.forEach(b => { if(b.type === 'ink'){ b.undo = []; b.tool = 'pen'; b.sel = []; b.zoom = 1; b.sx = 0; } }); w.secs = w.sections.map(k => [OPTSEC.find(x => x[0] === k)[1], (S.drafts['pw_' + k] || '').trim()]).filter(x => x[1]); S.inkFs = null; S.graphFs = null; S.addAt = null; w.step = 'review'; if(S.aiAuto !== false && isOffline()) w.evalPending = true; changed(1); render(); toast('Attempt locked.'); if(S.aiAuto !== false && !isOffline() && aiFn) aiRun('prob'); break; }
    case 'badd': S.addAt = null; w.blocks.push(newBlock(w, el.dataset.t)); render(true); break;
    case 'baddat': S.addAt = {i:+el.dataset.b, pos:+el.dataset.pos}; render(true); break;
    case 'baddcancel': S.addAt = null; render(true); break;
    case 'baddpick': { const A = S.addAt; if(!A) break; S.addAt = null; w.blocks.splice(Math.min(w.blocks.length, A.i + A.pos), 0, newBlock(w, el.dataset.t)); render(true); break; }
    case 'bmove': { const i = +el.dataset.b, j = i + (+el.dataset.d); if(j < 0 || j >= w.blocks.length) break; S.addAt = null; const x = w.blocks[i]; w.blocks[i] = w.blocks[j]; w.blocks[j] = x; render(true); break; }
    case 'inkw': w.blocks[+el.dataset.b].w = el.dataset.w; render(true); break;
    case 'inktool': { const b = w.blocks[+el.dataset.b]; b.tool = el.dataset.t; b.sel = []; render(true); break; }
    case 'inkundo': { const b = w.blocks[+el.dataset.b]; if(b.undo && b.undo.length){ b.strokes = b.undo.pop(); b.sel = []; render(true); } break; }
    case 'inkclear': { const b = w.blocks[+el.dataset.b]; b.undo = (b.undo || []).concat([b.strokes.slice()]); b.strokes = []; b.sel = []; render(true); break; }
    case 'inkdel': { const b = w.blocks[+el.closest('[data-b]').dataset.b]; b.undo = (b.undo || []).concat([b.strokes.slice()]).slice(-40); b.strokes = b.strokes.filter((x, k) => !b.sel.includes(k)); b.sel = []; render(true); break; }
    case 'inkmore': w.blocks[+el.dataset.b].h += 280; render(true); break;
    case 'inkzoom': { const b = w.blocks[+el.dataset.b], d = +el.dataset.d; b.zoom = d === 0 ? 1 : Math.max(0.5, Math.min(4, +((b.zoom || 1) * (d > 0 ? 1.25 : 0.8)).toFixed(3))); inkFit(b, S.inkFs === +el.dataset.b); render(true); break; }
    case 'appfs': appFs(); break;
    case 'klexport': klExport(); break;
    case 'klpick': { const i = $('klfile'); if(i) i.click(); break; }
    case 'klexample': S = Object.assign(seed(), {view:'cover'}); applyTheme(); render(); klSaveNow(); toast('Example notebook loaded. Delete what you do not need, or start over from a backup.'); break;
    case 'kltest': { const out = $('kltest'); if(!aiFn){ out.textContent = 'Enter the address first.'; break; } out.textContent = 'Testing…'; aiFn('Reply with the single word: ready', {cache:false}).then(r => { out.textContent = 'Connected. It answered: ' + r.text.slice(0, 40); }, e => { out.textContent = AIMSG[e && e.code] || 'Could not reach it. Check the address.'; }); break; }
    case 'cnew': { const c = {id:'c' + Date.now(), name:'New concept', mine:'', links:[], rels:[]}; S.concepts.push(c); S.selConcept = c.id; S.conceptOpen = true; changed(1); render(); setTimeout(() => { const i = $('cname'); if(i){ i.focus(); i.select(); } }, 0); break; }
    case 'cdel': { const id = S.selConcept; if(S.delArm !== 'c' + id){ S.delArm = 'c' + id; render(true); break; } S.concepts = S.concepts.filter(x => x.id !== id); S.concepts.forEach(x => { x.rels = (x.rels || []).filter(r => r.to !== id); }); S.selConcept = S.concepts.length ? S.concepts[0].id : null; S.conceptOpen = false; S.delArm = null; changed(1); render(); toast('Concept deleted.'); break; }
    case 'clink': { const c = S.concepts.find(x => x.id === S.selConcept); if(c && !c.links.some(l => l.n === el.dataset.id)) c.links.push({n:el.dataset.id, rel:'supports'}); changed(1); render(true); break; }
    case 'cunlink': { const c = S.concepts.find(x => x.id === S.selConcept); if(c) c.links = c.links.filter(l => l.n !== el.dataset.id); changed(1); render(true); break; }
    case 'plbook': { const o = S.plOpen = S.plOpen || {}; o[el.dataset.id] = !o[el.dataset.id]; const l = $('plist'); if(l) l.innerHTML = probList(); break; }
    case 'plsample': { const bs = S.books.filter(b => (b.chapters || []).length); if(!bs.length){ toast('Add a book with chapters first.'); break; } const t0 = performance.now(); for(let k = 0; k < 5000; k++){ const b = bs[k % bs.length], ch = Math.floor(k / bs.length) % b.chapters.length, sec = 1 + Math.floor(k / (bs.length * b.chapters.length)) % 6, n = 1 + Math.floor(k / (bs.length * b.chapters.length * 6)); S.problems.push({id:'ps' + k, book:b.id, ch:ch, loc:'§' + (ch + 1) + '.' + sec + ', Ex. ' + n, tags:[], text:'Sample problem ' + (k + 1) + ', for testing the library at size.', hints:[], solution:''}); } render(true); toast('5,000 sample problems added in ' + Math.round(performance.now() - t0) + ' ms.'); break; }
    case 'plall': (S.plAll = S.plAll || {})[el.dataset.id] = true; { const l = $('plist'); if(l) l.innerHTML = probList(); } break;
    case 'attopen': { const A0 = S.pAttempts.filter(a => a.problem === S.selProblem), cur = S.attOpen === undefined ? (A0.length ? A0[A0.length - 1].id : null) : S.attOpen; S.attOpen = cur === el.dataset.id ? null : el.dataset.id; S.fixFor = null; render(true); break; }
    case 'attcmp': S.attCmp = !S.attCmp; render(true); break;
    case 'retryall': S.retryParts = null; render(true); break;
    case 'wpart': { w.part = el.dataset.p; if(!w.blocks.some(b => b.part === w.part)) w.blocks.push(newBlock(w, 'text')); S.addAt = null; render(true); break; }
    case 'pmark': { const r0 = w.partRes[+el.dataset.k]; r0.mark = r0.mark === el.dataset.m ? '' : el.dataset.m; render(true); break; }
    case 'aiask': if(aiFn === undefined){ toast('The assistant is still starting. Try again in a moment.'); break; } aiRun(el.dataset.k); break;
    case 'aifollow': { const q = (S.drafts.aiq || '').trim(); if(!q){ toast('Type a question first.'); break; } aiRun(el.dataset.k, q); break; }
    case 'aistop': if(aiCtl) aiCtl.abort(); break;
    case 'atteval': evalSaved([el.dataset.id]); break;
    case 'evalpending': evalSaved(pendingEvals().map(a => a.id)); break;
    case 'aiauto': S.aiAuto = S.aiAuto === false; savePrefs(); render(true); toast(S.aiAuto ? 'Attempts will be evaluated as soon as you submit.' : 'Evaluation will wait until you ask.'); break;
    case 'aiusemarks': { const E = w && w.ai && w.ai.eval, map = {'correct':'right', 'incorrect':'wrong', 'not attempted':'skip'}; if(E && w.partRes) (E.parts || []).forEach(x => { const r0 = w.partRes.find(r => r.label === String(x.label).replace(/[()]/g, '')), m = map[String(x.verdict || '').toLowerCase()]; if(r0 && m) r0.mark = m; }); render(true); toast('Marks filled in from the evaluation. Change any you disagree with.'); break; }
    case 'fmt': { const o = fmtOf(el); if(!o) break; o[el.dataset.k] = !o[el.dataset.k]; if(el.dataset.b != null) render(true); else sheet(); break; }
    case 'setwfont': S.wfont = el.dataset.f; applyTheme(); savePrefs(); sheet(); break;
    case 'setwsize': S.wsize = el.dataset.z; applyTheme(); savePrefs(); sheet(); break;
    case 'gdim': { const b = w.blocks[+el.dataset.b]; b.dim = el.dataset.d; if(b.dim === '3d'){ if(b.ymin == null){ b.ymin = '-3'; b.ymax = '3'; if(b.xmin === '0' && b.xmax === '6' && !b.expr){ b.xmin = '-3'; b.xmax = '3'; } } } render(true); break; }
    case 'g3reset': { const b = w.blocks[+el.dataset.b]; delete b.az; delete b.el; render(true); break; }
    case 'graphfs': { const i = +el.dataset.b; S.graphFs = S.graphFs === i ? null : i; render(true); render(true); break; }
    case 'inkfstools': S.inkFsTools = !S.inkFsTools; render(true); break;
    case 'inkfs': { S.inkFsTools = false; const i = +el.dataset.b; S.inkFs = S.inkFs === i ? null : i; if(S.inkFs != null){ const fb = w.blocks[i]; inkFit(fb, true); } try{ if(S.inkFs != null && !document.fullscreenElement && document.documentElement.requestFullscreen){ inkOwnFs = true; document.documentElement.requestFullscreen().catch(() => { inkOwnFs = false; }); } else if(S.inkFs == null && inkOwnFs && document.fullscreenElement){ inkOwnFs = false; document.exitFullscreen().catch(() => {}); } }catch(err){} render(true); break; }
    case 'inktext': inkToText(+el.dataset.b); break;
    case 'inkfinger': if(S.penSeen && !S.fingerDraw) S.fingerDraw = true; else { S.fingerDraw = false; S.penSeen = true; } render(true); break;
    case 'bdel': S.addAt = null; w.blocks.splice(+el.dataset.b, 1); render(true); break;
    case 'bcolor': { const b = w.blocks[+el.dataset.b]; b.color = el.dataset.c; if(b.type === 'ink' && (b.sel || []).length){ b.undo = (b.undo || []).concat([b.strokes.slice()]).slice(-40); b.sel.forEach(k => { if(b.strokes[k] && !b.strokes[k].fix) b.strokes[k] = Object.assign({}, b.strokes[k], {c:el.dataset.c}); }); } render(true); break; }
    case 'ncolor': S.noteColor = el.dataset.c; sheet(); break;
    case 'ishot': { const sh = S.inbox.find(x => x.id === el.dataset.id).shots, i = +el.dataset.i; sh.splice(i - 1, 2, sh[i], sh[i - 1]); render(true); break; }
    case 'paddshot': { const p = prob(S.selProblem); p.parts = (p.parts || [1]).concat([(p.parts || [1]).length + 1]); changed(1); render(true); toast('Screenshot added to this problem (simulated).'); break; }
    case 'pdiscard': S.pw = null; go('problems'); break;
    case 'psol': w.solShown = true; render(true); break;
    case 'perr': { const c = el.dataset.c, i = w.errors.indexOf(c); if(i < 0) w.errors.push(c); else w.errors.splice(i, 1); render(true); break; }
    case 'psave': { const how = el.dataset.h; S.pAttempts.push({id:'pa' + Date.now(), at:Date.now(), dur:w.started ? Math.round((Date.now() - w.started) / 1000) : null, problem:w.problem, mode:w.mode, hints:w.hints, solution:w.solution, blocks:w.blocks, secs:w.secs, calcs:w.calcs, checks:w.checks, parts:w.partRes || null, only:w.only || null, ai:(w.ai && w.ai.turns.some(t => t.role === 'assistant')) ? w.ai.turns.filter(t => !t.hidden) : null, eval:(w.ai && w.ai.eval) || null, evalPending:!(w.ai && w.ai.eval) && !!w.evalPending, fix:(S.drafts.pw_fix || '').trim(), errors:w.errors, when:'Today'}); if(how !== 'none'){ const need = w.partRes ? w.partRes.filter(r => r.mark === 'wrong' || r.mark === 'skip').map(r => r.label) : [], rp = (need.length && need.length < w.partRes.length) ? need : null; S.lastRetryParts = rp; S.items.unshift({id:'r' + Date.now(), kind:'problem', problem:w.problem, variation:how === 'vary', ability:'Retry', task:'', mins:8, done:false, parts:rp}); resetRev(); } S.selProblem = w.problem; S.problemOpen = true; S.pw = null; changed(1); go('problems'); toast(how === 'none' ? 'Attempt saved.' : 'Attempt saved. A ' + (how === 'vary' ? 'variation' : 'retry') + (S.lastRetryParts ? ' of ' + (S.lastRetryParts.length === 1 ? 'part ' : 'parts ') + S.lastRetryParts.map(l => '(' + l + ')').join(', ') : '') + ' is in your review list.'); break; }
    case 'revproblem': { const it = due()[0]; it.done = true; S.retryParts = it.parts ? {problem:it.problem, parts:it.parts.slice()} : null; S.selProblem = it.problem; S.problemOpen = true; S.pmode = 'practice'; resetRev(); go('problems'); break; }
    case 'ifile': S.pickFor = el.dataset.id; Object.assign(S.drafts, {pr_book:'', pk_q:''}); S.sheet = 'pickbook'; sheet(); render(true); break;
    case 'pkbook': S.drafts.pr_book = el.dataset.id; S.drafts.pr_ch = ''; sheet(); if(S.imp && !S.sheet) render(true); break;
    case 'pkclear': S.drafts.pr_book = ''; sheet(); if(S.imp && !S.sheet) render(true); break;
    case 'pkadd': S.afterBook = S.sheet; S.editBook = null; Object.assign(S.drafts, {bk_title:(S.drafts.pk_q || ''), bk_author:'', bk_edition:'', bk_year:'', bk_chapters:'', bk_purpose:'', bk_status:'', bk_depth:'Overview'}); S.sheet = 'book'; sheet(); break;
    case 'ifilego': { const bid = S.drafts.pr_book; if(!bid){ toast('Choose the book these pages come from.'); break; } const it = S.inbox.find(x => x.id === S.pickFor); S.sheet = false; sheet(); it.filed = true; if(it.type === 'multi'){ S.problems.push({id:'p6', book:bid, loc:'§7.3, Ex. 7.12', tags:['thermodynamics'], text:'', img:true, parts:it.shots.slice(), ocr:'7.12 A piston-cylinder device initially contains 0.8 kg of steam', hints:[], solution:''}); S.selProblem = 'p6'; S.problemOpen = true; changed(1); go('problems'); toast('3 screenshots combined into one problem.'); break; } [['p4','Ex. 5.3','5.3 Find the eigenvalues of the matrix A'],['p5','Ex. 5.4','5.4 Show that the eigenvectors of a symmetric matrix']].forEach(x => S.problems.push({id:x[0], book:bid, loc:'§5.1, ' + x[1], tags:['linear algebra'], text:'', img:true, ocr:x[2], hints:[], solution:''})); changed(2); render(true); toast('2 problems filed. Check the detected numbers and tags.'); break; }
    case 'idecl': S.decl = {id:el.dataset.id, mode:'practice', help:false}; S.sheet = 'declare'; sheet(); render(true); break;
    case 'declmode': S.decl.mode = el.dataset.m; sheet(); break;
    case 'declhelp': S.decl.help = el.dataset.h === 'yes'; sheet(); break;
    case 'declsave': { S.inbox.find(x => x.id === S.decl.id).filed = true; S.pAttempts.push({id:'pa' + Date.now(), problem:S.selProblem, mode:S.decl.mode, hints:0, solution:S.decl.help, declared:true, img:true, working:'', secs:[], calcs:[], checks:{}, fix:'', errors:[], when:'Today'}); S.problemOpen = true; S.sheet = false; sheet(); changed(1); go('problems'); toast('Filed as a self-declared attempt.'); break; }
    case 'opensession': S.curBook = el.dataset.id; S.flow = null; logSession(book(S.curBook)); go('session'); break;
    case 'setch': { const b = book(S.selBook); b.ch = +el.dataset.i; b.pos = 'Ch. ' + (b.ch + 1); changed(1); render(true); break; }
    case 'bookform': { const b = el.dataset.id ? book(el.dataset.id) : null; S.editBook = b ? b.id : null; Object.assign(S.drafts, {bk_title:b ? b.title : '', bk_author:b ? b.author : '', bk_edition:b ? (b.edition || '') : '', bk_year:b ? (b.year || '') : '', bk_chapters:b ? (b.chapters || []).join('\n') : '', bk_purpose:b ? b.purpose : '', bk_status:b ? b.status : '', bk_depth:b ? b.depth : 'Overview'}); S.sheet = 'book'; sheet(); render(true); break; }
    case 'bkstatus': S.drafts.bk_status = el.dataset.v; sheet(); break;
    case 'bkdepth': S.drafts.bk_depth = el.dataset.v; sheet(); break;
    case 'fixadd': S.fixFor = el.dataset.id; delete S.drafts.fix2; render(true); break;
    case 'fixcancel': S.fixFor = null; delete S.drafts.fix2; render(true); break;
    case 'fixsave': { const t = (S.drafts.fix2 || '').trim(); if(!t){ toast('Write the correction first.'); break; } const a = S.pAttempts.find(x => x.id === el.dataset.id); if(a){ a.fixes = (a.fixes || []).concat([{text:t, when:'Today', at:Date.now()}]); } S.fixFor = null; delete S.drafts.fix2; changed(1); render(true); toast('Correction added. The earlier record is unchanged.'); break; }
    case 'probdel': { const id = S.editProb; if(S.delArm !== 'p' + id){ S.delArm = 'p' + id; sheet(); break; } { const q0 = prob(id); toTrash('Problem', q0 ? psrc(q0) + ', ' + q0.loc : 'Problem', [dropProblems([id])]); } S.delArm = null; S.editProb = null; S.sheet = false; sheet(); resetRev(); changed(1); go('problems'); toast('Problem moved to Recently deleted.'); break; }
    case 'bookdel': { const id = S.editBook; if(S.books.length < 2){ toast('Keep at least one book in the library. Add another before deleting this one.'); break; } if(S.delArm !== 'b' + id){ S.delArm = 'b' + id; sheet(); break; }
      toTrash('Book', book(id).title, [dropProblems(S.problems.filter(p => p.book === id).map(p => p.id)), dropNotes(S.notes.filter(n => n.book === id).map(n => n.id)), {sessions:S.sessions.filter(x => x.book === id), books:S.books.filter(b => b.id === id)}]); S.sessions = S.sessions.filter(x => x.book !== id); S.books = S.books.filter(b => b.id !== id);
      if(S.curBook === id){ S.curBook = S.books[0].id; S.study = null; S.flow = null; } if(S.selBook === id) S.selBook = S.books[0].id; S.selCh = null; S.delArm = null; S.editBook = null; S.sheet = false; sheet(); resetRev(); changed(1); go('books'); toast('Book moved to Recently deleted.'); break; }
    case 'trashopen': S.delArm = null; S.sheet = 'trash'; sheet(); render(true); break;
    case 'trashrestore': { const t = (S.trash || []).find(x => x.id === el.dataset.id); fromTrash(el.dataset.id); resetRev(); changed(1); render(true); sheet(); if(t) toast(t.kind + ' restored.'); break; }
    case 'trashpurge': { if(S.delArm !== el.dataset.id){ S.delArm = el.dataset.id; sheet(); break; } S.trash = S.trash.filter(x => x.id !== el.dataset.id); S.delArm = null; changed(1); render(true); sheet(); break; }
    case 'impsample': S.inbox.push({id:'in' + Date.now(), type:'set', kind:'Sample page: 3.2 Exercises', src:samplePage(), filed:false}); render(true); break;
    case 'impdrop': S.inbox = S.inbox.filter(x => x.id !== el.dataset.id); render(true); break;
    case 'impopen': { const it = S.inbox.find(x => x.id === el.dataset.id); if(!it) break; S.imp = {id:it.id, mode:'cut', tool:'cut', region:[0, 0, 1, 1], cuts:[], boxes:[], roles:{}, labels:{}}; Object.assign(S.drafts, {pr_book:'', pk_q:'', pr_ch:'', pr_sec:'', pr_tags:'', im_first:'1'}); render(); suggestCuts(it.src).then(c => { if(S.imp && S.imp.id === it.id){ S.imp.cuts = c; render(true); if(!c.length) toast('No clear gaps found. Trim the page to the exercises, or add cuts yourself.'); } }); break; }
    case 'impmode': { const I = S.imp, m = el.dataset.m; I.tool = m; if(m !== 'trim') I.mode = m; render(true); break; }
    case 'impusecuts': S.imp.mode = 'cut'; S.imp.tool = 'cut'; render(true); break;
    case 'imptrimreset': { const I = S.imp, it = S.inbox.find(x => x.id === I.id); I.region = [0, 0, 1, 1]; render(true); if(I.mode === 'cut') suggestCuts(it.src).then(c => { if(S.imp === I){ I.cuts = c; I.roles.cut = {}; I.labels.cut = {}; render(true); } }); break; }
    case 'impsuggest': { const I = S.imp, it = S.inbox.find(x => x.id === I.id); suggestCuts(it.src, I.region).then(c => { if(S.imp === I){ I.cuts = c; I.roles.cut = {}; I.labels.cut = {}; render(true); if(!c.length) toast('No clear gaps found here.'); } }); break; }
    case 'impclear': { const I = S.imp; if(I.mode === 'box') I.boxes = []; else I.cuts = []; I.roles[I.mode] = {}; I.labels[I.mode] = {}; render(true); break; }
    case 'impcancel': S.imp = null; render(); break;
    case 'boxdel': { const I = S.imp, i = +el.dataset.i, sh = o => { const n = {}; Object.keys(o || {}).forEach(k => { if(+k < i) n[k] = o[k]; else if(+k > i) n[+k - 1] = o[k]; }); return n; }; I.boxes.splice(i, 1); I.roles.box = sh(I.roles.box); I.labels.box = sh(I.labels.box); render(true); break; }
    case 'cutdel': S.imp.cuts.splice(+el.dataset.i, 1); S.imp.roles.cut = {}; S.imp.labels.cut = {}; render(true); break;
    case 'cutadd': { const I = S.imp; if(!I || I.tool !== 'cut' || e.target.closest('.cutline') || (I.justDragged && Date.now() - I.justDragged < 350)) break; const r = $('cutwrap').getBoundingClientRect(), y = (e.clientY - r.top) / r.height; if(y <= I.region[1] || y >= I.region[3]) break; I.cuts.push(+y.toFixed(4)); I.cuts.sort((a, b) => a - b); I.roles.cut = {}; I.labels.cut = {}; render(true); break; }
    case 'impfile': { const I = S.imp, D = S.drafts, bk = D.pr_book && book(D.pr_book), it = S.inbox.find(x => x.id === I.id); if(!bk){ toast('Choose the book this page comes from first.'); break; } const P = impPieces(I), ch = D.pr_ch === '' || D.pr_ch == null ? null : +D.pr_ch, sec = (D.pr_sec || '').trim() || (ch != null ? 'Ch. ' + (ch + 1) : ''), tags = (D.pr_tags || '').split(',').map(x => x.trim()).filter(Boolean); if(!P.some((p, k) => impRole(I, k) === 'p')){ toast('There is no problem piece to file yet.'); break; }
      loadImg(it.src).then(async im => { let instr = null; const made = []; for(let k = 0; k < P.length; k++){ const role = impRole(I, k); if(role === 'x') continue; const pic = await cropPiece(im, P[k]); if(role === 'i'){ instr = pic; continue; } const p = {id:'p' + Date.now() + '_' + k, book:bk.id, ch:ch, loc:[sec, impLabel(I, k)].filter(Boolean).join(', '), tags:tags.slice(), text:'', parts:parseParts((I.pparts || {})[I.mode + k]), crop:pic, instr:instr, hints:[], solution:''}; S.problems.push(p); made.push(p); }
        it.filed = true; S.imp = null; S.selProblem = made[0].id; S.problemOpen = true; changed(made.length); go('problems'); toast(plural(made.length, 'problem') + ' filed under ' + bk.title + (sec ? ', ' + sec : '') + '.'); }).catch(() => toast('That page could not be read as an image.')); break; }
    case 'probedit': { const q = prob(S.selProblem); if(!q) break; const parts = (q.loc || '').split(', '); S.editProb = q.id; Object.assign(S.drafts, {pr_book:q.book || '', pr_ch:q.ch != null ? String(q.ch) : '', pk_q:'', pr_sec:parts.length > 1 ? parts.slice(0, -1).join(', ') : '', pr_ex:parts[parts.length - 1] || '', pr_text:q.text, pr_tags:(q.tags || []).join(', '), pr_parts:(q.parts || []).join(', '), pr_sol:q.solution || ''}); S.sheet = 'prob'; sheet(); render(true); break; }
    case 'pcalcdel': w.calcs.splice(+el.dataset.i, 1); render(true); break;
    case 'creldel': { const c = S.concepts.find(x => x.id === S.selConcept); (c.rels || []).splice(+el.dataset.i, 1); changed(1); render(true); break; }
    case 'notedel': { if(S.delArm !== S.editNote){ S.delArm = S.editNote; sheet(); break; } const id = S.editNote, n0 = note(id); toTrash('Note', n0 ? n0.text.slice(0, 90) : 'Note', [dropNotes([id])]); S.delArm = null; S.editNote = null; S.noteFmt = null; delete S.drafts.cap; delete S.drafts.capcue; delete S.drafts.caploc; S.sheet = false; sheet(); changed(1); render(true); toast('Note moved to Recently deleted.'); break; }
    case 'probform': S.editProb = null; Object.assign(S.drafts, {pr_book:'', pr_ch:'', pk_q:'', pr_sec:'', pr_ex:'', pr_text:'', pr_tags:'', pr_parts:'', pr_sol:''}); S.sheet = 'prob'; sheet(); render(true); break;
    case 'book': S.selBook = el.dataset.id; go('book'); break;
    case 'chapter': S.selCh = +el.dataset.i; go('chapter'); break;
    case 'studych': { const b = book(S.selBook); S.curBook = b.id; b.ch = S.selCh; b.pos = 'Ch. ' + (b.ch + 1); S.flow = null; logSession(b); go('session'); break; }
    case 'libfilter': S.libFilter = el.dataset.v; S.libLimit = 100; render(true); break;
    case 'analysis': go('analysis'); break;
    case 'ststart': S.study = {open:[], ability:'Explain'}; render(true); break;
    case 'strecon': S.study.reconOpen = true; render(true); break;
    case 'stlock': if(!(S.study.recon || '').trim()){ toast('Write something first, even a partial explanation.'); break; } S.study.locked = true; changed(1); render(true); toast('Reconstruction locked.'); break;
    case 'sttoggle': S.study.open.push(el.dataset.k); render(true); break;
    case 'stcause': S.study.cause = S.study.cause === el.dataset.c ? null : el.dataset.c; render(true); break;
    case 'stab': S.study.ability = el.dataset.a; render(true); break;
    case 'stdiscard': S.study = null; render(true); break;
    case 'stfinish': { const st = S.study, b = book(S.curBook), id = 'a' + Date.now(), fix = (st.fix || '').trim(); S.studies.push(Object.assign({}, st, {book:b.id, ch:b.ch, when:'Today', fix:fix})); S.attempts.push({id:id, prompt:st.q || '', text:st.recon}); if(fix) S.corrections.push({attempt:id, text:fix, cause:st.cause || null}); if(el.dataset.h === 'sched'){ S.items.unshift({id:'r' + Date.now(), book:b.id, notes:S.notes.filter(n => n.book === b.id && (b.ch == null || noteCh(n) === b.ch)).slice(0, 1).map(n => n.id), ability:st.ability || 'Explain', task:'From memory: ' + ((st.q || '').trim() || 'explain the idea you studied'), mins:3, done:false}); resetRev(); } S.study = null; changed(1); render(); toast(el.dataset.h === 'sched' ? 'Study pass saved. A check is in your review list.' : 'Study pass saved.'); break; }
    case 'prqadd': { const t = (S.drafts.prq || '').trim(); if(!t){ toast('Say what you need to understand first.'); break; } const b = book(S.curBook); S.prereqs.push({id:'q' + Date.now(), text:t, book:b.id, ch:b.ch, done:false}); delete S.drafts.prq; changed(1); render(true); break; }
    case 'prqdone': S.prereqs.find(x => x.id === el.dataset.id).done = true; changed(1); render(true); toast('Gap resolved.'); break;
    case 'ctoggle': S.cOpen.push(S.selConcept + el.dataset.k); render(true); break;
    case 'crelto': S.drafts.crel_to = el.dataset.t; render(true); break;
    case 'crelrel': S.drafts.crel_rel = el.dataset.r; render(true); break;
    case 'creladd': { const D = S.drafts, why = (D.crel_why || '').trim(); if(!D.crel_to || !D.crel_rel){ toast('Choose a concept and a relationship.'); break; } if(!why){ toast('A connection needs a reason.'); break; } const c = S.concepts.find(x => x.id === S.selConcept); c.rels = (c.rels || []).concat([{to:D.crel_to, rel:D.crel_rel, why:why}]); delete D.crel_to; delete D.crel_rel; delete D.crel_why; changed(1); render(true); break; }
    case 'arstage': S.arStage = el.dataset.s; changed(1); render(); break;
    case 'archeck': { const b = book(S.selBook); b.ar = b.ar || {}; b.ar.checks = b.ar.checks || {}; if(b.ar.checks[el.dataset.k]) delete b.ar.checks[el.dataset.k]; else b.ar.checks[el.dataset.k] = 1; render(true); break; }
    case 'arset': { const b = book(S.selBook); b.ar = b.ar || {}; b.ar[el.dataset.f] = b.ar[el.dataset.f] === el.dataset.v ? '' : el.dataset.v; changed(1); render(true); break; }
    case 'libview': S.libView = el.dataset.v; render(true); break;
    case 'libsort': if(S.libSort === el.dataset.k) S.libDir = -S.libDir; else { S.libSort = el.dataset.k; S.libDir = 1; } S.libLimit = 100; $('liblist').innerHTML = libRows(); break;
    case 'libmore': S.libLimit = el.dataset.all ? 1e9 : S.libLimit + 100; $('liblist').innerHTML = libRows(); break;
    case 'libsample': if(el.dataset.off){ S.books = S.books.filter(b => !b.sample); } else { S.books = S.books.concat(sampleBooks()); } S.libLimit = 100; render(true); toast(el.dataset.off ? 'Samples removed.' : '1,200 sample titles loaded.'); break;
    case 'impform': Object.assign(S.drafts, {imp_text:'', imp_status:''}); S.sheet = 'imp'; sheet(); render(true); break;
    case 'impstatus': S.drafts.imp_status = el.dataset.v; sheet(); break;
    case 'bookback': go('books'); break;
    case 'concept': S.selConcept = el.dataset.id; S.conceptOpen = true; if(S.view !== 'concepts') go('concepts'); else render(); break;
    case 'conceptback': S.conceptOpen = false; render(); break;
    case 'flowstart': S.flow = {step:'prompt', kind:'explain', ability:'Explain'}; delete S.drafts.ans; delete S.drafts.fix; render(); break;
    case 'flowkind': f.kind = el.dataset.k; f.ability = prompts()[f.kind].ability; render(true); break;
    case 'flowgo': f.step = el.dataset.s; render(); break;
    case 'flowcancel': S.flow = null; render(); break;
    case 'flowlock': { const t = (S.drafts.ans || '').trim(); if(!t){ toast('Write an answer first, even a partial one.'); break; } f.answer = t; f.attemptId = 'a' + Date.now(); S.attempts.push({id:f.attemptId, prompt:prompts()[f.kind].text, text:t}); f.step = 'correct'; changed(1); render(); toast('Answer locked.'); break; }
    case 'flowcause': f.cause = f.cause === el.dataset.c ? null : el.dataset.c; render(true); break;
    case 'flowfix': { const t = (S.drafts.fix || '').trim(); if(!t){ toast('Write the correction, or choose Nothing to correct.'); break; } f.fix = t; S.corrections.push({attempt:f.attemptId, text:t, cause:f.cause || null}); f.step = 'schedule'; changed(1); render(); break; }
    case 'flownofix': f.fix = ''; f.cause = null; f.step = 'schedule'; render(); break;
    case 'flowab': f.ability = el.dataset.a; render(true); break;
    case 'flowsched': S.items.unshift({id:'r' + Date.now(), book:S.curBook, notes:S.notes.filter(n => n.book === S.curBook).slice(0, 1).map(n => n.id), ability:f.ability, task:prompts()[f.kind].text, mins:f.kind === 'problem' ? 5 : 3, done:false}); f.scheduled = true; f.step = 'done'; resetRev(); changed(1); render(); break;
    case 'flowskip': f.scheduled = false; f.step = 'done'; render(); break;
    case 'revhint': r.hint = true; render(true); break;
    case 'revshow': r.shown = true; render(true); break;
    case 'revdefer': { const it = due()[0]; S.items.push(S.items.splice(S.items.indexOf(it), 1)[0]); resetRev(); render(); toast('Moved to the end. History is kept.'); break; }
    case 'revgrade': { const g = GRADES[+el.dataset.g], it = due()[0]; r.graded = g[0]; S.events.push({item:it.id, ability:it.ability, grade:g[0], next:g[1], hint:r.hint, cause:null}); changed(1); render(true); break; }
    case 'revcause': r.cause = r.cause === el.dataset.c ? null : el.dataset.c; S.events[S.events.length - 1].cause = r.cause; render(true); break;
    case 'revnext': due()[0].done = true; resetRev(); render(); break;
    case 'revreset': S.items.forEach(i => i.done = false); resetRev(); render(); break;
  }
});

/* ---------- math symbols ---------- */
const SYMS = [
  ['Arithmetic', [['+','Plus sign'],['−','Minus sign'],['±','Plus-or-minus sign'],['∓','Minus-or-plus sign'],['×','Multiplication sign'],['·','Dot operator'],['÷','Division sign'],['/','Slash'],['⁄','Fraction slash'],['=','Equals sign'],['≠','Not-equal sign'],['≈','Approximately equal'],['≡','Identically equivalent'],['∝','Proportional to'],['%','Percent sign'],['!','Factorial'],['√','Square root, radical'],['∛','Cube root'],['∜','Fourth root'],['|','Absolute value bar'],['½','One half'],['⅓','One third'],['¼','One quarter'],['¾','Three quarters']]],
  ['References', [['§','Section sign'],['§§','Sections (plural)'],['¶','Paragraph sign, pilcrow'],['Ch. ','Chapter'],['Ex. ','Exercise'],['Eq. ','Equation'],['Fig. ','Figure'],['Thm. ','Theorem'],['p. ','Page'],['pp. ','Pages'],['–','En dash, for ranges'],['†','Dagger, footnote mark'],['‡','Double dagger, footnote mark'],['№','Numero sign'],['cf. ','Compare']]],
  ['Powers and indices', [['²','Squared, power 2'],['³','Cubed, power 3'],['ⁿ','To the nth power'],['⁻¹','Inverse, power minus one'],['⁰','Superscript 0'],['¹','Superscript 1'],['⁴','Superscript 4'],['⁵','Superscript 5'],['⁶','Superscript 6'],['⁷','Superscript 7'],['⁸','Superscript 8'],['⁹','Superscript 9'],['⁺','Superscript plus'],['⁻','Superscript minus'],['ⁱ','Superscript i'],['ᵀ','Transpose, superscript T'],['ᶜ','Complement, superscript c'],['₀','Subscript 0'],['₁','Subscript 1'],['₂','Subscript 2'],['₃','Subscript 3'],['₄','Subscript 4'],['₅','Subscript 5'],['₆','Subscript 6'],['₇','Subscript 7'],['₈','Subscript 8'],['₉','Subscript 9'],['ₙ','Subscript n'],['ᵢ','Subscript i'],['ⱼ','Subscript j'],['ₖ','Subscript k'],['ₓ','Subscript x'],['ₐ','Subscript a']]],
  ['Comparison', [['<','Less than'],['>','Greater than'],['≤','Less than or equal to'],['≥','Greater than or equal to'],['≪','Much less than'],['≫','Much greater than'],['∼','Tilde: similar to, distributed as'],['≃','Approximately equivalent'],['≅','Congruent to']]],
  ['Grouping', [['(','Left parenthesis'],[')','Right parenthesis'],['[','Left bracket'],[']','Right bracket'],['{','Left brace'],['}','Right brace'],['⟨','Left angle bracket'],['⟩','Right angle bracket'],[':','Colon: ratio or condition'],['∷','Double colon'],['…','Ellipsis'],['⋯','Centred ellipsis'],['∴','Therefore'],['∵','Because'],['≔','Defined as']]],
  ['Functions', [['→','Maps to set, function arrow'],['↦','Maps-to'],['∘','Composition'],['f⁻¹','Inverse function'],['log','Logarithm'],['ln','Natural logarithm'],['e','Euler’s number'],['π','Pi'],['∞','Infinity'],['−∞','Minus infinity'],['⌊','Left floor'],['⌋','Right floor'],['⌈','Left ceiling'],['⌉','Right ceiling'],[' mod ','Modulo']]],
  ['Geometry', [['∠','Angle'],['∡','Measured angle'],['△','Triangle'],['□','Square'],['⊥','Perpendicular'],['∥','Parallel'],['∦','Not parallel'],['°','Degree sign'],[' rad','Radians'],['̅','Overline for a segment (goes over the letter before it)'],['⃗','Arrow for a ray or vector (goes over the letter before it)'],['⌒','Arc'],['sin','Sine'],['cos','Cosine'],['tan','Tangent'],['csc','Cosecant'],['sec','Secant'],['cot','Cotangent']]],
  ['Sets', [['∅','Empty set'],['∈','Element of'],['∉','Not an element of'],['∋','Contains as an element'],['⊂','Proper subset'],['⊆','Subset or equal to'],['⊃','Proper superset'],['⊇','Superset or equal to'],['∪','Union'],['∩','Intersection'],['∖','Set difference'],['ᶜ','Complement'],['×','Cartesian product'],['ℕ','Natural numbers'],['ℤ','Integers'],['ℚ','Rational numbers'],['ℝ','Real numbers'],['ℂ','Complex numbers'],['ℝⁿ','n-dimensional real space']]],
  ['Logic', [['¬','Negation, not'],['∧','Conjunction, and'],['∨','Disjunction, or'],['⊕','Exclusive or'],['⇒','Implies'],['⇐','Is implied by'],['⇔','If and only if'],['∀','For all'],['∃','There exists'],['∄','There does not exist'],['∃!','There exists exactly one'],['⊤','True'],['⊥','False, contradiction'],['⊢','Turnstile, provable from'],['⊨','Double turnstile, entails'],['∎','End of proof, QED'],['□','End of proof, QED (open)']]],
  ['Calculus', [['Δ','Delta, finite change'],['d','Differential'],['dy/dx','Derivative'],['′','Prime, first derivative'],['″','Double prime, second derivative'],['∂','Partial derivative'],['∇','Nabla, gradient'],['∇·','Divergence'],['∇×','Curl'],['∇²','Laplacian'],['∫','Integral'],['∬','Double integral'],['∭','Triple integral'],['∮','Contour integral'],['lim','Limit'],['∑','Summation'],['∏','Product'],['sup','Supremum'],['inf','Infimum'],['max','Maximum'],['min','Minimum']]],
  ['Linear algebra', [['𝐯','Vector v'],['𝐮','Vector u'],['𝐀','Matrix A'],['𝐅','Vector field F'],['ᵀ','Transpose'],['⁻¹','Inverse matrix'],['det','Determinant'],['tr','Trace'],['rank','Rank'],['·','Dot product'],['×','Cross product'],['‖','Norm bar'],['λ','Lambda, eigenvalue'],['𝐈','Identity matrix'],['𝟎','Zero vector or matrix']]],
  ['Statistics', [['P(','Probability of'],['∣','Given, conditional bar'],['∩','Both events, intersection'],['∪','Either event, union'],['⊥','Independent of'],['∼','Distributed as'],['𝔼','Expected value'],['E[','Expected value'],['Var','Variance'],['Cov','Covariance'],['μ','Mu, population mean'],['x̄','x bar, sample mean'],['̄','Bar (goes over the letter before it)'],['σ','Sigma, population standard deviation'],['σ²','Population variance'],['ρ','Rho, population correlation'],['θ̂','Theta hat, estimator'],['̂','Hat (goes over the letter before it)'],['H₀','Null hypothesis'],['H₁','Alternative hypothesis'],['Hₐ','Alternative hypothesis'],['α','Alpha, significance level']]],
  ['Greek', [['α','alpha'],['β','beta'],['γ','gamma'],['δ','delta'],['ε','epsilon'],['ϵ','epsilon (lunate)'],['ζ','zeta'],['η','eta'],['θ','theta'],['ι','iota'],['κ','kappa'],['λ','lambda'],['μ','mu'],['ν','nu'],['ξ','xi'],['ο','omicron'],['π','pi'],['ρ','rho'],['σ','sigma'],['τ','tau'],['υ','upsilon'],['φ','phi'],['ϕ','phi (straight)'],['χ','chi'],['ψ','psi'],['ω','omega'],['Γ','Gamma'],['Δ','Delta'],['Θ','Theta'],['Λ','Lambda'],['Ξ','Xi'],['Π','Pi'],['Σ','Sigma'],['Υ','Upsilon'],['Φ','Phi'],['Ψ','Psi'],['Ω','Omega']]]
];
let symTarget = null, symId = '', symCat = 0, symQ = '', symSurface = 'text', symArm = null;
const sheet0 = sheet;
sheet = function(){
  if(S.sheet === 'trash'){ trashSheet(); return; }
  sheet0(); const o = $('overlay'), app = document.querySelector('.app'), sh = o && o.querySelector('.sheet');
  if(o && app) o.style.setProperty('--acc', getComputedStyle(app).getPropertyValue('--acc'));
  if(sh && sh.querySelector('textarea, input[type=text]') && !sh.querySelector('[data-symopen]')){ const b = document.createElement('button'); b.type = 'button'; b.className = 'btn link mini'; b.dataset.symopen = '1'; b.style.alignSelf = 'flex-start'; b.textContent = '∑ Math symbols'; sh.appendChild(b); }
};
const symField = el => el && el.closest && !el.closest('#sympanel') && (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && (!el.type || el.type === 'text')));
document.addEventListener('focusin', e => { if(symField(e.target)){ symTarget = e.target; symId = e.target.id || ''; symSurface = 'text'; symArm = null; } });
document.addEventListener('pointerdown', e => { if(e.target.closest && e.target.closest('canvas.ink')) symSurface = 'ink'; }, true);
function symKeys(){
  const q = symQ.trim().toLowerCase(), list = q ? [].concat.apply([], SYMS.map(c => c[1])).filter((x, i, a) => (x[1].toLowerCase().includes(q) || x[0].toLowerCase() === q) && a.findIndex(y => y[0] === x[0]) === i) : SYMS[symCat][1];
  return list.length ? list.map(x => '<button type="button" class="symk' + (x[0].trim().length > 2 ? ' wide' : '') + '" data-sym="' + esc(x[0]) + '" title="' + esc(x[1]) + '" aria-label="' + esc(x[1]) + '">' + (/^[̀-ͯ⃐-⃿]$/.test(x[0]) ? '◌' + x[0] : esc(x[0].trim())) + '</button>').join('') : '<p class="small">No symbol has “' + esc(symQ) + '” in its name.</p>';
}
function symH(){ const p = $('sympanel'); if(p) document.documentElement.style.setProperty('--symh', p.offsetHeight + 'px'); clearTimeout(inkTimer); inkTimer = setTimeout(initInk, 60); }
function symPanel(open){
  let p = $('sympanel');
  if(!open){ symArm = null; if(p) p.remove(); document.documentElement.classList.remove('sym-open'); $('symbtn').setAttribute('aria-pressed', 'false'); return; }
  if(!p){ p = document.createElement('div'); p.id = 'sympanel'; p.setAttribute('role', 'region'); p.setAttribute('aria-label', 'Math symbols'); document.body.appendChild(p); }
  p.innerHTML = '<div class="symtop"><input type="text" id="symq" placeholder="Search by name, e.g. integral" aria-label="Search symbols" value="' + esc(symQ) + '"><span class="small" id="symsay" aria-live="polite">Tap a text field, then a symbol.</span><button type="button" class="btn link mini" id="symclose">Close</button></div><div class="symcats" id="symcats">' + SYMS.map((c, i) => '<button type="button" class="opt" data-symcat="' + i + '" aria-pressed="' + (!symQ && i === symCat) + '">' + c[0] + '</button>').join('') + '</div><div class="symgrid" id="symgrid">' + symKeys() + '</div>';
  document.documentElement.classList.add('sym-open'); $('symbtn').setAttribute('aria-pressed', 'true'); symH();
}
function symInsert(t, name){
  if(symSurface === 'ink' && document.querySelector('canvas.ink')){ symArm = {t:t.trim() || t, name:name}; const s0 = $('symsay'); if(s0) s0.textContent = 'Now tap the handwriting page to place ' + name + '.'; return; }
  let el = symTarget; if(!el || !document.contains(el)) el = symId ? document.getElementById(symId) : null;
  const say = $('symsay'); if(!el || !symField(el)){ if(say) say.textContent = 'Tap a text field first, then a symbol.'; return; }
  const a = el.selectionStart != null ? el.selectionStart : el.value.length, b = el.selectionEnd != null ? el.selectionEnd : a;
  el.setRangeText(t, a, b, 'end'); el.dispatchEvent(new Event('input', {bubbles:true})); symTarget = el;
  if(document.activeElement !== $('symq')) el.focus(); if(say) say.textContent = 'Added ' + name + '.';
}
document.addEventListener('pointerdown', e => { const k = e.target.closest && e.target.closest('#sympanel button, #symbtn, [data-symopen]'); if(k) e.preventDefault(); });
document.addEventListener('click', e => {
  const t = e.target.closest ? e.target : null; if(!t) return;
  const so = t.closest('#symbtn, [data-symopen]'); if(so){ if(so.dataset.b != null){ symSurface = 'ink'; symPanel(true); const s0 = $('symsay'); if(s0) s0.textContent = 'Tap a symbol, then tap the handwriting page to place it.'; } else symPanel(!$('sympanel')); return; }
  if(!t.closest('#sympanel')) return;
  const k = t.closest('[data-sym]'); if(k){ symInsert(k.dataset.sym, k.getAttribute('aria-label')); return; }
  const c = t.closest('[data-symcat]'); if(c){ symCat = +c.dataset.symcat; symQ = ''; symPanel(true); return; }
  if(t.closest('#symclose')) symPanel(false);
});
document.addEventListener('input', e => { if(e.target.id === 'symq'){ symQ = e.target.value; $('symgrid').innerHTML = symKeys(); symH(); document.querySelectorAll('#symcats .opt').forEach((b, i) => b.setAttribute('aria-pressed', !symQ && i === symCat)); } });

/* ---------- AI assistant: reviews a locked attempt or a concept explanation ---------- */
let aiFn, aiCtl = null;
function remoteAi(){
  const b64 = bl => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1]); r.onerror = rej; r.readAsDataURL(bl); });
  const call = async (input, opts, json) => { opts = opts || {}; const msgs = typeof input === 'string' ? [{role:'user', content:input}] : input, images = []; for(const bl of [].concat(opts.images || [])) images.push({type:bl.type || 'image/png', data:await b64(bl)});
    let r; try{ r = await fetch(S.aiUrl, {method:'POST', headers:{'content-type':'application/json', 'x-kl-pass':S.aiPass || ''}, body:JSON.stringify({messages:msgs, images:images, json:!!json}), signal:opts.signal}); }catch(e){ throw {code:e && e.name === 'AbortError' ? 'cancelled' : 'upstream_error', message:String(e)}; }
    if(r.status === 401 || r.status === 403) throw {code:'bad_pass'}; if(r.status === 429) throw {code:'rate_limited'}; if(r.status === 413) throw {code:'prompt_too_large'}; if(!r.ok) throw {code:'upstream_error'};
    const d = await r.json().catch(() => ({})), text = d.text || ''; if(!text) throw {code:'empty_completion'}; if(opts.onText) opts.onText({text:text, delta:text}); return {text:text, truncated:!!d.truncated}; };
  const fn = (i, o) => call(i, o, false);
  fn.json = async (i, o) => { const t = (await call(i, o, true)).text; try{ return JSON.parse(t); }catch(e){ const m = t.match(/[\[{][\s\S]*[\]}]/); if(m){ try{ return JSON.parse(m[0]); }catch(e2){} } throw {code:'invalid_json', text:t}; } };
  fn.limits = async () => ({maxPromptBytes:262144, images:{maxCount:6, maxInputBytes:5e6, mediaTypes:['image/png','image/jpeg']}});
  return fn;
}
function aiSetup(){ if(window.claude && window.claude.use) return; aiFn = S.aiUrl ? remoteAi() : null; }
(async () => { try{ if(window.claude && window.claude.use) aiFn = await window.claude.use('sample'); else aiSetup(); }catch(e){ aiFn = null; } if(document.querySelector('.aibox')) render(true); })();
const AIMSG = {bad_pass:'The evaluation service rejected the passcode. Check it under Page.', not_granted:'The assistant was not allowed for this page, so it is off for this visit.', sampling_disabled:'The assistant is not available for this account.', not_declared:'The assistant is not available in this view.', capability_disabled:'The assistant is not available in this view.', rate_limited:'The assistant is busy, or your usage limit was reached. Try again later.', session_expired:'Sign in again to use the assistant.', refused:'The assistant declined this request.', prompt_too_large:'There is too much working to send at once.'};
const AISTYLE = 'Write in plain text only: short paragraphs, no Markdown, no headings, no tables, no LaTeX. Use ordinary Unicode maths symbols (×, ², √, ∫). Be concise and specific, and address the student as "you".';
const AIEVAL = 'You are a study assistant inside a personal study app. The student has just submitted and locked an attempt at a textbook problem and wants an immediate evaluation. Judge the work strictly but fairly from what is shown. Do not write out a full worked solution, and do not state a final answer the student did not reach; say what is wrong and why, so they can correct it themselves.\nReply with ONLY a JSON object and no other text, with these keys:\n"verdict": one of "correct", "partly correct", "incorrect", "cannot judge";\n"summary": one or two sentences on how the attempt went;\n"first_issue": the first step that is wrong or unjustified, quoting it, or "" if there is none;\n"parts": an array with one object for each part listed under PARTS, or an empty array if there are none, each {"label": the part letter, "verdict": "correct" or "incorrect" or "not attempted" or "cannot judge", "note": one short sentence};\n"checks": one sentence on whether the recorded checks really test the result, naming one check to add;\n"questions": an array of one or two short questions that test the idea behind the problem.\nInside the strings use plain text and ordinary Unicode maths symbols (×, ², √, ∫), with no Markdown and no LaTeX. Address the student as "you".';
const VERD = {'correct':['Correct','ok'], 'partly correct':['Partly correct','mid'], 'incorrect':['Incorrect','bad'], 'cannot judge':['Cannot be judged from what is shown','na'], 'not attempted':['Not attempted','na']};
const verd = v => VERD[String(v || '').toLowerCase()] || [String(v || 'No verdict'), 'na'];
function evalHtml(E, w){
  if(!E || typeof E !== 'object') return ''; const v = verd(E.verdict), parts = Array.isArray(E.parts) ? E.parts.filter(x => x && x.label) : [], qs = Array.isArray(E.questions) ? E.questions.filter(Boolean) : [];
  return '<div class="evalbox"><p class="verd ' + v[1] + '">' + esc(v[0]) + '</p>' + (E.at ? '<p class="small">Evaluated ' + esc(fmtAt(E.at)) + '</p>' : '') + (E.summary ? '<p class="aitext">' + esc(E.summary) + '</p>' : '') +
    (E.first_issue ? '<p class="kind">First weak step</p><p class="aitext">' + esc(E.first_issue) + '</p>' : '') +
    (parts.length ? '<p class="kind">Part by part</p><div class="hist parts">' + parts.map(x => '<span>(' + esc(x.label) + ') <b class="verd ' + verd(x.verdict)[1] + ' sm">' + esc(verd(x.verdict)[0]) + '</b></span><span>' + esc(x.note || '') + '</span>').join('') + '</div>' + (w && w.partRes ? '<div class="row"><button class="btn" data-act="aiusemarks">Use these marks below</button><span class="small">You can still change any of them.</span></div>' : '') : '') +
    (E.checks ? '<p class="kind">Your checks</p><p class="aitext">' + esc(E.checks) + '</p>' : '') + (qs.length ? '<p class="kind">To test yourself</p>' + qs.map((q, i) => '<p class="aitext">' + (i + 1) + '. ' + esc(q) + '</p>').join('') : '') + '</div>';
}
const aiObj = k => k === 'prob' ? S.pw : S.concepts.find(x => x.id === S.selConcept);
const dataBlob = u => { try{ const m = u.match(/^data:([^;]+);base64,(.*)$/), bin = atob(m[2]), a = new Uint8Array(bin.length); for(let k = 0; k < bin.length; k++) a[k] = bin.charCodeAt(k); return new Blob([a], {type:m[1]}); }catch(e){ return null; } };
const isOffline = () => (!REAL && !!S.offline) || navigator.onLine === false;
const pendingEvals = () => S.pAttempts.filter(a => a.evalPending && !a.eval && a.id);
const savedShim = a => ({problem:a.problem, mode:a.mode, hints:a.hints, solution:a.solution, secs:a.secs || [], blocks:a.blocks || [{type:'text', text:a.working || (a.img ? '[The working is an imported handwritten page that is not attached.]' : '')}], calcs:a.calcs || [], checks:a.checks || {}, partRes:a.parts || null});
let evalRun = false;
async function evalSaved(ids){
  if(evalRun) return; if(!aiFn){ toast('The assistant is not available in this view.'); return; } if(isOffline()){ toast('Still offline. These will wait until you are back online.'); return; }
  evalRun = true; let done = 0, stop = '';
  for(const id of ids){ const a = S.pAttempts.find(x => x.id === id); if(!a || a.eval) continue; a.evalBusy = true; render(true);
    try{ const w = savedShim(a), pp = prob(a.problem), needImg = w.blocks.some(b => b.type === 'ink' && b.strokes && b.strokes.length) || !!(pp && pp.crop), lim = needImg ? await aiFn.limits().catch(() => null) : null, first = aiProbPrompt(w, !!(lim && lim.images)), opts = {cache:false};
      if(lim && lim.images){ const pre = pp && pp.crop ? [dataBlob(pp.crop), pp.instr ? dataBlob(pp.instr) : null].filter(Boolean) : [], blobs = pre.concat((await Promise.all(first.inks.map(inkBlob))).filter(Boolean)).slice(0, lim.images.maxCount); if(blobs.length) opts.images = blobs; }
      const E = await aiFn.json([{role:'user', content:first.text + '\n\nNOTE: this attempt was submitted on ' + fmtAt(atOf(a)) + ' and is being evaluated later.'}], opts); if(!E || typeof E !== 'object' || Array.isArray(E)) throw {code:'invalid_json'};
      E.at = Date.now(); E.late = true; a.eval = E; a.evalPending = false; done++;
    }catch(e){ const code = e && e.code; stop = AIMSG[code] || 'The assistant could not answer just now.'; if(['not_granted','sampling_disabled','not_declared','capability_disabled'].includes(code)) aiFn = null; a.evalBusy = false; break; }
    a.evalBusy = false; }
  evalRun = false; changed(done || 0); render(true); toast(stop ? (done ? plural(done, 'attempt') + ' evaluated. ' : '') + stop : plural(done, 'attempt') + ' evaluated.');
}
const pendingBar = () => { const n = pendingEvals().length; return n ? '<div class="aibox"><p style="margin:0"><b>' + plural(n, 'attempt') + (n === 1 ? ' is' : ' are') + ' waiting for evaluation</b> <span class="small">· submitted while offline, or before an evaluation could finish.</span></p><div class="row"><button class="btn primary" data-act="evalpending"' + (evalRun ? ' disabled' : '') + '>' + (evalRun ? 'Evaluating…' : 'Evaluate ' + (n === 1 ? 'it' : 'them') + ' now') + '</button>' + (isOffline() ? '<span class="small">You are offline; this will work once you are back online.</span>' : '') + '</div></div>' : ''; };
function aiProbPrompt(w, canSee){
  const p = prob(w.problem), inks = w.blocks.filter(b => b.type === 'ink' && b.strokes.length); let n = 0;
  const work = w.blocks.map(b => b.type === 'text' ? b.text : b.type === 'graph' ? '[Graph the student plotted: ' + (b.dim === '3d' ? 'z = ' : 'y = ') + b.expr + ']' : b.strokes.length ? (canSee ? '[Handwritten working: see attached image ' + (++n) + ']' : '[Handwritten working that could not be attached. Say that you cannot see it.]') : '').filter(Boolean).join('\n\n');
  return {inks:canSee ? inks : [], text:AIEVAL + '\n\nSOURCE: ' + psrc(p) + ', ' + p.loc + '\nPROBLEM: ' + (p.crop ? (canSee ? 'The statement is a picture: see the FIRST attached image' + (p.instr ? ' (the instructions shared by the problem set are the second)' : '') + '. Handwritten working images, if any, come after.' + (p.text ? ' Typed copy: ' + p.text : '') : (p.text || 'The statement is a picture that could not be attached. Say that you cannot see it.')) : p.text) + '\nMODE: ' + w.mode + '. ' + helpText({mode:w.mode, hints:w.hints, solution:w.solution}) + '\n' + (w.secs || []).map(x => x[0].toUpperCase() + ': ' + x[1]).join('\n') + (w.partRes ? '\nPARTS AND THE STUDENT\'S ANSWERS: ' + w.partRes.map(r => '(' + r.label + ') ' + (r.answer || 'no answer')).join('; ') + '. Comment part by part, briefly.' : '') + '\nWORKING:\n' + (work || '(none typed)') + '\n' + (w.calcs.length ? 'CALCULATIONS: ' + w.calcs.map(c => c.in + ' = ' + c.out).join('; ') + '\n' : '') + 'CHECKS RECORDED: ' + checksText(w.checks) + (p.solution ? '\nWORKED SOLUTION ON FILE (for your reference only; do not reveal it): ' + p.solution : '')};
}
function aiConceptPrompt(c){
  const notes = c.links.map(l => { const n = note(l.n); return n ? '- ' + book(n.book).title + ', ' + n.loc + ': ' + n.text : ''; }).filter(Boolean).join('\n');
  return {inks:[], text:'You are a study assistant inside a personal study app. The student is trying to show that they understand a concept from their reading, in their own words. Review the explanation. They learn by repairing it themselves, so:\n1. Say what is right in it.\n2. Name any misconception, gap or vague phrase, quoting the words.\n3. Do not rewrite the explanation for them.\n4. Then ask three probing questions, numbered: one that checks recall, one that applies the idea to a new situation, and one boundary case where the idea stops working.\n' + AISTYLE + '\n\nCONCEPT: ' + c.name + '\nSTUDENT EXPLANATION: ' + ((c.mine || '').trim() || '(empty)') + '\n' + CFIELDS.filter(x => (c[x[0]] || '').trim()).map(x => x[1].toUpperCase() + ': ' + c[x[0]].trim()).join('\n') + (notes ? '\nTHEIR NOTES FROM THE TEXTS:\n' + notes : '')};
}
function inkBlob(b){
  return new Promise(res => { try{ let my = 60; b.strokes.forEach(s => s.pts.forEach(q => { if(q[1] > my) my = q[1]; })); const VW = inkVW(b), H = Math.min(b.h, Math.ceil(my + 40)), k = Math.min(1.4, 1600 / VW), cv = document.createElement('canvas'); cv.width = Math.round(VW * k); cv.height = Math.round(H * k); const ctx = cv.getContext('2d'), bg = inkBgOf(b); ctx.setTransform(k, 0, 0, k, 0, 0); ctx.fillStyle = bg.fill; ctx.fillRect(0, 0, VW, H); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; b.strokes.forEach(s => inkSeg(ctx, s, inkHex(s.c, bg.dark))); cv.toBlob(x => res(x), 'image/png'); }catch(e){ res(null); } });
}
async function aiRun(k, follow){
  const o = aiObj(k); if(!o || !aiFn) return; const A = o.ai = o.ai || {turns:[]}; if(A.busy) return;
  if(!follow){ A.turns = []; A.eval = null; }
  A.busy = true; A.err = ''; A.live = ''; aiCtl = new AbortController(); const opts = {cache:false, signal:aiCtl.signal, onText:u => { A.live = u.text; const el = $('ailive'); if(el) el.textContent = u.text; }};
  if(follow) A.turns.push({role:'user', content:follow}); render(true);
  try{
    if(!A.turns.length){ let lim = null; const hasInk = k === 'prob' && (o.blocks.some(b => b.type === 'ink' && b.strokes.length) || !!(prob(o.problem) || {}).crop); if(hasInk) lim = await aiFn.limits().catch(() => null); const first = k === 'prob' ? aiProbPrompt(o, !!(lim && lim.images)) : aiConceptPrompt(o);
      if(k === 'prob' && lim && lim.images){ const pp = prob(o.problem), pre = pp && pp.crop ? [dataBlob(pp.crop), pp.instr ? dataBlob(pp.instr) : null].filter(Boolean) : [], blobs = pre.concat((await Promise.all(first.inks.map(inkBlob))).filter(Boolean)).slice(0, lim.images.maxCount); if(blobs.length) opts.images = blobs; }
      A.turns.push({role:'user', content:first.text, hidden:true}); }
    const msgs = A.turns.map(t => ({role:t.role, content:(A.eval && t.role === 'user' && !t.hidden ? 'Answer this follow-up in plain text, not JSON: ' : '') + t.content}));
    if(k === 'prob' && A.turns.length === 1){ A.evaluating = true; delete opts.onText; const E = await aiFn.json(msgs, opts); if(!E || typeof E !== 'object' || Array.isArray(E)) throw {code:'invalid_json', text:typeof E === 'string' ? E : ''}; E.at = Date.now(); A.eval = E; A.turns.push({role:'assistant', content:JSON.stringify(E), hidden:true}); }
    else { const r = await aiFn(msgs, opts); A.turns.push({role:'assistant', content:r.text + (r.truncated ? '\n\n(The answer was cut short.)' : '')}); }
  }catch(e){ const code = e && e.code; if(e && e.text && code !== 'refused') A.turns.push({role:'assistant', content:e.text + (code === 'invalid_json' ? '' : '\n\n(Stopped before the end.)')}); else if(A.turns.length && A.turns[A.turns.length - 1].role === 'user' && !A.turns[A.turns.length - 1].hidden) A.turns.pop();
    if(code !== 'cancelled' && !(code === 'invalid_json' && e.text)) A.err = AIMSG[code] || 'The assistant could not answer just now. Try again.'; if(['not_granted','sampling_disabled','not_declared','capability_disabled'].includes(code)) aiFn = null; if(A.turns.length === 1) A.turns = []; if(k === 'prob' && !A.eval && code !== 'cancelled' && S.aiAuto !== false) o.evalPending = true; }
  A.busy = false; A.evaluating = false; A.live = ''; aiCtl = null; delete S.drafts.aiq; changed(1); render(true);
}
const aiTurnsHtml = turns => (turns || []).filter(t => !t.hidden).map(t => t.role === 'assistant' ? '<p class="aitext">' + esc(t.content) + '</p>' : '<p class="aiq">You asked: ' + esc(t.content) + '</p>').join('');
function aiBox(k, o, intro){
  const A = (o && o.ai) || {turns:[]}, has = A.turns.some(t => t.role === 'assistant'), isP = k === 'prob', auto = S.aiAuto !== false;
  if(isP && o && o.evalPending && !has && !A.busy && isOffline()) return '<div class="aibox"><p class="kind">AI evaluation</p><p style="margin:0"><b>You are offline, so this attempt has not been evaluated yet.</b></p><p class="small">Carry on: compare, mark the parts and write your correction now. Save the attempt and it will be listed as waiting for evaluation; once you are back online, one tap evaluates everything that is waiting.</p></div>';
  if(aiFn === null && !has) return '<div class="aibox"><p class="small">The assistant is not available in this view. ' + (REAL ? 'Set up your evaluation service under Page, in the top bar.' : 'It needs the app to be open inside Claude with permission to ask.') + '</p></div>';
  return '<div class="aibox"><p class="kind">AI review · written by Claude, not by you</p>' + (has || A.busy ? '' : '<p class="small">' + intro + '</p>') + (isP && A.eval ? evalHtml(A.eval, o) : '') + aiTurnsHtml(A.turns) +
    (A.busy ? '<p class="aitext" id="ailive">' + (esc(A.live) || (A.evaluating || (isP && !has) ? 'Evaluating your attempt…' : 'Thinking…')) + '</p><div class="row"><button class="btn" data-act="aistop">Stop</button></div>' : (A.err ? '<p class="small" style="color:var(--red)">' + esc(A.err) + '</p>' : '') + (aiFn ? (has ? '<div class="calc"><label class="f" for="aiq">Ask a follow-up<input type="text" id="aiq" data-draft="aiq" value="' + esc(S.drafts.aiq || '') + '"></label><button class="btn" data-act="aifollow" data-k="' + k + '">Ask</button></div>' : '') + '<div class="row"><button class="btn' + (has ? ' link' : '') + '" data-act="aiask" data-k="' + k + '">' + (has ? (isP ? 'Evaluate again' : 'Start the review again') : (isP ? 'Evaluate this attempt' : (aiFn === undefined ? 'Ask the assistant' : 'Ask the assistant to review'))) + '</button>' + (isP ? '<button class="btn link mini" data-act="aiauto">Evaluate automatically on submit: ' + (auto ? 'On' : 'Off') + '</button>' : '') + '</div>' : '')) + '</div>';
}
let inkOwnFs = false;
function appFs(){
  const d = document, el = d.documentElement, no = () => toast('This browser does not allow full screen here. Installed to the home screen, the app opens without browser bars.');
  try{ if(d.fullscreenElement){ inkOwnFs = false; d.exitFullscreen().catch(() => {}); } else if(el.requestFullscreen){ inkOwnFs = false; el.requestFullscreen().catch(no); } else no(); }catch(err){ no(); }
}
document.addEventListener('fullscreenchange', () => { const on = !!document.fullscreenElement, b = $('fsbtn'); if(!on) inkOwnFs = false; if(b){ b.innerHTML = on ? '<span class="fw">Exit full screen</span><span class="fn">Exit</span>' : '<span class="fw">Full screen</span><span class="fn">Full</span>'; b.setAttribute('aria-label', on ? 'Exit full screen' : 'Full screen'); b.setAttribute('aria-pressed', on); } });
document.addEventListener('keydown', e => {
  if(e.metaKey || e.ctrlKey || e.altKey || S.sheet || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
  if(e.key === '0'){ go('cover'); e.preventDefault(); }
  else if((e.key === 'f' || e.key === 'F') && S.inkFs == null){ appFs(); e.preventDefault(); }
  else if(e.key >= '1' && e.key <= '5'){ const t = areaTabs(areaOf(S.view))[+e.key - 1]; if(t){ go(t[0]); e.preventDefault(); } }
  else if((e.key === 'n' || e.key === 'N') && !S.flow && !S.pw){ S.capCh = null; S.editNote = null; S.sheet = 'note'; sheet(); render(true); e.preventDefault(); }
});
window.addEventListener('hashchange', () => { const v = location.hash.slice(1); if(VIEWS.includes(v) && v !== S.view){ S.view = v; render(); } });
if(window.claude && window.claude.hot && window.claude.hot.snapshot){ try{ window.claude.hot.snapshot(() => S); }catch(e){} }
const h0 = location.hash.slice(1); if(VIEWS.includes(h0)) S.view = h0;
render(); sheet();
})();

// calculator.js - simple semester fees calculator using window.feesData
(function(){
  function $(id){return document.getElementById(id)}
  const center = $('calc-center');
  const count = $('calc-count');
  const badge = $('calc-count-badge');
  const first = $('calc-first');
  const results = $('calc-results');

  // helper to read active value from opt-group
  function readOptGroup(el){
    const active = el.querySelector('.opt-btn.active');
    return active ? active.dataset.value : null;
  }

  function format(price){return price}

  function compute(){
    const dataset = window.feesData || {};
  const key = readOptGroup(center) === 'inside' ? 'inside' : 'outside';
    const rows = dataset[key] || [];
    // assumptions: rows[0] = per-subject, rows[1] = exam fee per subject, rows[2] = term fee, rows[3]=registration, rows[4]=admission
    const perSubject = rows[0] ? parseNumber(rows[0].price) : 0;
    const exam = rows[1] ? parseNumber(rows[1].price) : 0;
    const term = rows[2] ? parseNumber(rows[2].price) : 0;
    const registration = rows[3] ? parseNumber(rows[3].price) : 0;
    const admission = rows[4] ? parseNumber(rows[4].price) : 0;

    const n = parseInt(count.value,10)||0;
    const totalSubjects = perSubject * n;
    const totalExams = exam * n;
    const includeRegistration = readOptGroup(first) === 'yes';
    let total = totalSubjects + totalExams + term;
    if(includeRegistration){
      total += registration + admission;
    }

    renderBreakdown({totalSubjects,totalExams,term,registration,admission,total, includeRegistration, currencyLabel:rows[0] ? getCurrencyLabel(rows[0].price) : ''});
  }

  function parseNumber(text){
    // expect strings like 'دولار 160' or 'ليرة 80,000' or 'USD 800' or 'SYP 340000'
    if(!text) return 0;
    const parts = text.split(' ');
    const numPart = parts.slice(1).join(' ').replace(/,/g,'').trim();
    const n = parseFloat(numPart) || 0;
    return n;
  }
  function getCurrencyLabel(text){
    if(!text) return '';
    const part = text.split(' ')[0];
    return part;
  }

  function renderBreakdown(b){
    results.innerHTML = `
      <div class="detail-row"><div>رسوم المواد والامتحانات:</div><div><strong>${b.currencyLabel} ${formatNumber(b.totalSubjects + b.totalExams)}</strong></div></div>
      <div class="detail-row"><div>الرسم الفصلي:</div><div>${b.currencyLabel} ${formatNumber(b.term)}</div></div>
      ${ (b.includeRegistration) ? `<div class="detail-row"><div>رسوم التسجيل والقبول (الفصل الأول):</div><div>${b.currencyLabel} ${formatNumber((b.registration||0)+(b.admission||0))}</div></div>` : '' }
      <div class="divider"></div>
      <div class="total-row">الإجمالي: <span>${b.currencyLabel} ${formatNumber(b.total)}</span></div>
    `;
  }

  function formatNumber(n){
    return n.toLocaleString();
  }

  // attach handlers
  // opt groups: click to toggle
  Array.from(center.querySelectorAll('.opt-btn')).forEach(btn=>btn.addEventListener('click', (e)=>{
    center.querySelectorAll('.opt-btn').forEach(b=>b.classList.remove('active'));
    e.currentTarget.classList.add('active');
    compute();
  }));
  Array.from(first.querySelectorAll('.opt-btn')).forEach(btn=>btn.addEventListener('click', (e)=>{
    first.querySelectorAll('.opt-btn').forEach(b=>b.classList.remove('active'));
    e.currentTarget.classList.add('active');
    compute();
  }));

  // range
  count.addEventListener('input', ()=>{badge.textContent = count.value; compute();});

  // init
  badge.textContent = count.value;
  // wait for feesData if not loaded yet
  if(window.feesData){compute();}
  else{
    window.addEventListener('load',compute);
  }
})();

(function(){
  // Default embedded data (fallback)
  const embeddedData = [
    { key: 'syrian', label: 'الشهادات السورية', note: 'للطلاب الحاصلين على شهادات سورية من داخل سوريا', items: ['شهادة البكلوريا أو نسخة عنها','هوية سورية / إخراج قيد','صور شخصية خلفية بيضاء عدد 2'] },
    { key: 'saudi', label: 'الشهادات السعودية', note: 'للطلاب الحاصلين على شهادات سعودية وما يشبهها من بلدان أخرى بنفس النظام (حيث تجمع المراحل الثلاث بشهادة واحدة)', items: ['شهادة الثالث متوسط (التاسع) + نسخة عنها','شهادة الثانوية (التراكمي) + 3 نسخ عنها','هوية سورية / إخراج قيد (أو جواز سفر للغير السوريين)','صور شخصية خلفية بيضاء عدد 2'] },
    { key: 'emirates', label: 'الشهادات الاماراتية', note: 'للطلاب الحاصلين على شهادات إماراتية وما يشبهها من بلدان أخرى بنفس النظام (حيث لكل مرحلة دراسية شهادة منفصلة)', items: ['شهادة الثالث متوسط (التاسع) + نسخة عنها','شهادة الأول ثانوي + نسخة عنها','شهادة الثاني ثانوي + نسخة عنها','شهادة الثالث ثانوي + 3 نسخ عنها','هوية سورية / إخراج قيد (أو جواز سفر للغير السوريين)','صور شخصية خلفية بيضاء عدد 2'] }
  ];

  // Public data reference used by renderer
  let docsData = embeddedData;

  // static important notes HTML (rendered once outside the docs content)
  const importantNotesHtml = `
      <div class="notes-header"><span class="pin">📌</span> <strong>ملاحظات مهمة</strong></div>
      <ul>
        <li>الأوراق المطلوبة موحدة، سواء كان الطالب سوري أو غير سوري</li>
        <li>الطلاب غير السوريين يحتاجون جواز سفر بدلاً من الهوية السورية / إخراج قيد</li>
        <li>جميع الأوراق يجب أن تكون نسخ موثقة من الأصل</li>
        <li>الصور الشخصية يجب أن تكون حديثة وواضحة</li>
      </ul>
  `;

  // Try to load external JSON for faster updates / caching
  function loadExternal(){
    return fetch('documents.json', {cache: 'no-cache'})
      .then(r=>{ if(!r.ok) throw new Error('no json'); return r.json(); })
      .then(j=>{ if(Array.isArray(j) && j.length) docsData = j; })
      .catch(()=>{ /* ignore and use embeddedData */ });
  }

  // Render tabs and content
  function $(sel, root=document){ return root.querySelector(sel); }
  function $all(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

  function initDocs(){
    const tabsEl = $('#docs-tabs');
    const contentEl = $('#docs-content');
    if(!tabsEl || !contentEl) return;

  docsData.forEach((d, idx)=>{
      const btn = document.createElement('button');
      btn.className = 'docs-tab' + (idx===0? ' active':'');
      btn.type = 'button';
      btn.textContent = d.label;
      btn.dataset.key = d.key;
      btn.addEventListener('click', ()=>{
        $all('.docs-tab').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        renderContent(d.key);
      });
      tabsEl.appendChild(btn);
    });

    // initial render
  renderContent(docsData[0].key);

    // render the important notes block once, outside the docs content
    const docsSection = document.querySelector('.documents-section > .container');
    if(docsSection && !document.querySelector('.docs-important-notes-outside')){
      const wrapper = document.createElement('div');
      wrapper.className = 'docs-important-notes-outside';
      wrapper.innerHTML = importantNotesHtml.replace(/^\s+|\s+$/gm, '');
      docsSection.appendChild(wrapper);
    }
  }

  function renderContent(key){
    const d = docsData.find(x=>x.key===key);
    const contentEl = $('#docs-content');
    if(!d || !contentEl) return;

    contentEl.innerHTML = '';
    const note = document.createElement('div');
    note.className = 'docs-note';
    note.textContent = d.note || '';
    contentEl.appendChild(note);

    const ul = document.createElement('ul');
    ul.className = 'docs-list';
    d.items.forEach(it=>{
      const li = document.createElement('li');
      li.textContent = it;
      ul.appendChild(li);
    });
  contentEl.appendChild(ul);
  }

  // mount on DOMContentLoaded
  if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded', ()=>{ loadExternal().then(initDocs); });
  } else initDocs();

  // expose for testing
  window._docsData = docsData;
})();

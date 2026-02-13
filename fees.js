// fees.js - simple data + renderer for الرسوم الجامعية
(function(){
  const data = {
    inside: [
      {label: 'رسم المادة الواحدة', price: 'ليرة 80,000'},
      {label: 'رسم الامتحان للمادة', price: 'ليرة 5,000'},
      {label: 'الرسم الفصلي', price: 'ليرة 15,000'},
      {label: 'رسوم التسجيل (الفصل الأول فقط)', price: 'ليرة 10,000'},
      {label: 'رسوم القبول في المفاضلة (الفصل الأول فقط)', price: 'ليرة 50,000'}
    ],
    outside: [
      {label: 'رسم المادة الواحدة', price: 'دولار 160'},
      {label: 'رسم الامتحان للمادة', price: 'دولار 40'},
      {label: 'الرسم الفصلي', price: 'دولار 150'},
      {label: 'رسوم التسجيل (الفصل الأول فقط)', price: 'دولار 100'},
      {label: 'رسوم القبول في المفاضلة (الفصل الأول فقط)', price: 'دولار 100'}
    ]
  };

  const tbodyInside = document.getElementById('fees-table-inside');
  const tbodyOutside = document.getElementById('fees-table-outside');

  function renderBody(tbody, rows){
    tbody.innerHTML = '';
    rows.forEach(r => {
      const tr = document.createElement('tr');
      const tdLabel = document.createElement('td');
      tdLabel.textContent = r.label;
      const tdPrice = document.createElement('td');
      tdPrice.textContent = r.price;
      tr.appendChild(tdLabel);
      tr.appendChild(tdPrice);
      tbody.appendChild(tr);
    });
  }

  // render both tables
  renderBody(tbodyInside, data.inside);
  renderBody(tbodyOutside, data.outside);

  // expose data for other scripts (calculator)
  window.feesData = data;
})();

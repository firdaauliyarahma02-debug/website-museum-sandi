function setupSelector(config){
  const list=$(config.list), detail=$(config.detail), data=config.items || [];
  if(!list || !detail || !data.length) return;
  function render(item){
    const isFigure=config.type==='figure';
    const tags = (item.specs || item.contributions || item.highlights || []).map(x=>`<span>${escapeHTML(x)}</span>`).join('');
    detail.innerHTML=`<img class="${isFigure?'figure-card-img':''}" src="${item.image}" alt="${escapeHTML(item.name || item.title)}"><div class="detail-body"><span class="badge gold">${escapeHTML(item.role || item.type || item.en || '')}</span><h2>${escapeHTML(item.name || item.title)}</h2>${item.years?`<p><b>Periode:</b> ${escapeHTML(item.years)}</p>`:''}${item.year?`<p><b>Tahun:</b> ${escapeHTML(item.year)}</p>`:''}${item.developer?`<p><b>Pengembang/Konteks:</b> ${escapeHTML(item.developer)}</p>`:''}<p>${escapeHTML(item.summary)}</p><div class="mini-list">${tags}</div></div>`;
  }
  list.innerHTML=data.map((item,i)=>`<button class="select-card ${i===0?'active':''}" data-id="${escapeHTML(item.id)}"><img src="${item.image}" alt="${escapeHTML(item.name || item.title)}" loading="lazy"><span><h4>${escapeHTML(item.name || item.title)}</h4><span>${escapeHTML(item.role || item.type || item.en || '')}</span></span></button>`).join('');
  render(data[0]);
  list.addEventListener('click', e=>{
    const btn=e.target.closest('.select-card'); if(!btn) return;
    $$('.select-card', list).forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    render(data.find(x=>x.id===btn.dataset.id) || data[0]);
  });
}

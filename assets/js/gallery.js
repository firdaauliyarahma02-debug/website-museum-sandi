document.addEventListener('DOMContentLoaded',()=>{
  const data=window.MUSEUM_DATA.gallery;
  const grid=$('#galleryGrid'), search=$('#gallerySearch'), filters=$('#galleryFilters');
  const cats=['Semua',...Array.from(new Set(data.map(x=>x.category)))];
  let cat='Semua', q='';
  if(filters) filters.innerHTML=cats.map((c,i)=>`<button class="filter-btn ${i===0?'active':''}" data-cat="${escapeHTML(c)}">${escapeHTML(c)}</button>`).join('');
  function render(){
    const filtered=data.filter(x=>(cat==='Semua'||x.category===cat) && (x.title+' '+x.description).toLowerCase().includes(q.toLowerCase()));
    grid.innerHTML=filtered.map((x,i)=>`<article class="gallery-item" data-cat="${escapeHTML(x.category)}" data-index="${i}" data-title="${escapeHTML(x.title)}"><img src="${x.image}" alt="${escapeHTML(x.title)}" loading="lazy"><div class="caption"><span>${escapeHTML(x.category)}</span><strong>${escapeHTML(x.title)}</strong></div></article>`).join('') || '<div class="notice">Tidak ada galeri yang cocok dengan filter.</div>';
    window.__galleryFiltered=filtered;
  }
  filters?.addEventListener('click',e=>{const b=e.target.closest('button'); if(!b)return; cat=b.dataset.cat; $$('.filter-btn',filters).forEach(x=>x.classList.remove('active')); b.classList.add('active'); render();});
  search?.addEventListener('input',e=>{q=e.target.value; render();});
  grid?.addEventListener('click',e=>{const item=e.target.closest('.gallery-item'); if(!item)return; const obj=window.__galleryFiltered[+item.dataset.index]; const m=$('#galleryModal'); if(!m||!obj)return; $('#modalImg').src=obj.image; $('#modalTitle').textContent=obj.title; $('#modalDesc').textContent=obj.description; m.classList.add('active');});
  $('#modalClose')?.addEventListener('click',()=>$('#galleryModal').classList.remove('active'));
  $('#galleryModal')?.addEventListener('click',e=>{if(e.target.id==='galleryModal') e.currentTarget.classList.remove('active')});
  render();
});

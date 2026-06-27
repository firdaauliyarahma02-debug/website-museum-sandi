document.addEventListener('DOMContentLoaded',()=>{
  const data=window.MUSEUM_DATA;
  const slider=$('#heroSlider');
  if(slider && data.site?.hero?.length){
    slider.innerHTML=data.site.hero.map((src,i)=>`<div class="hero-slide ${i===0?'active':''}"><img src="${src}" alt="Museum Sandi slide ${i+1}"></div>`).join('');
    const slides=$$('.hero-slide', slider);
    let idx=0;
    setInterval(()=>{slides[idx].classList.remove('active');idx=(idx+1)%slides.length;slides[idx].classList.add('active');},5200);
  }
  renderStats($('#homeStats'));
  const roomsEl=$('#roomsPreview');
  if(roomsEl) roomsEl.innerHTML=data.rooms.slice(0,6).map(r=>card({title:`${r.no}. ${r.name}`,subtitle:r.en,image:r.image,badge:'Ruang Pamer',body:r.summary})).join('');
  const focusEl=$('#focusPoints');
  if(focusEl){
    const pts=data.locations.filter(p=>p.priority==='focus').slice(0,6);
    focusEl.innerHTML=pts.map(p=>`<article class="source-item"><b>${escapeHTML(p.title)}</b><span>${escapeHTML(p.summary)}</span></article>`).join('');
  }
  renderGuide($('#guidePreview'),4);
});

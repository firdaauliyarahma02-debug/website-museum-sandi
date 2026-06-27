(function(){
  const data = window.MUSEUM_DATA || {};
  window.$ = (sel, root=document) => root.querySelector(sel);
  window.$$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  window.escapeHTML = (str='') => String(str).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));
  window.slug = (s='') => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  window.haversineKm = (lat1, lon1, lat2, lon2) => {
    const R=6371, dLat=(lat2-lat1)*Math.PI/180, dLon=(lon2-lon1)*Math.PI/180;
    const a=Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
    return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
  };
  window.categoryColors = {
    'Museum':'#247ba0','Perintisan':'#8e7cc3','Gerilya':'#2f9e83','Komunikasi':'#f59f00','PDRI':'#e76f51','Kelembagaan':'#3a86ff','Edukasi':'#00a896','Koleksi':'#9d4edd','Internasional':'#64748b','Teknologi':'#27a9d7','Regulasi':'#6c757d','Tokoh':'#ffb703','Sandi Klasik':'#b38cff','Peristiwa':'#ef476f'
  };
  function setActiveNav(){
    const page=(document.body.dataset.page || location.pathname.split('/').pop().replace('.html','') || 'index');
    $$('.nav a').forEach(a => {
      const href=a.getAttribute('href') || '';
      const name=href.replace('.html','').replace('index','home');
      const current=page==='index'?'home':page;
      if(name===current || (href==='index.html' && current==='home')) a.classList.add('active');
    });
  }
  function setupMobile(){
    const btn=$('.mobile-toggle'), nav=$('.nav');
    if(btn && nav) btn.addEventListener('click',()=>nav.classList.toggle('open'));
  }
  function setupTop(){
    const btn=$('.float-top');
    if(btn) btn.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
  }
  window.card = function({title='', subtitle='', image='', badge='', body='', contain=false}){
    return `<article class="card"><img class="card-img ${contain?'contain':''}" src="${image}" alt="${escapeHTML(title)}" loading="lazy"><div class="card-body">${badge?`<span class="badge">${escapeHTML(badge)}</span>`:''}<h3>${escapeHTML(title)}</h3>${subtitle?`<p><b>${escapeHTML(subtitle)}</b></p>`:''}${body?`<p>${escapeHTML(body)}</p>`:''}</div></article>`;
  }
  window.renderGuide = function(el, limit){
    if(!el || !data.features) return;
    const guide = limit ? data.features.guide.slice(0, limit) : data.features.guide;
    el.innerHTML = guide.map((g,i)=>`<div class="guide-step"><div class="num">${i+1}</div><div><h3>${escapeHTML(g.title)}</h3><p>${escapeHTML(g.body)}</p></div></div>`).join('');
  }
  window.renderStats = function(el){
    if(!el || !data.features) return;
    el.innerHTML = data.features.stats.map(s=>`<div class="stat"><strong>${escapeHTML(s.value)}</strong><span>${escapeHTML(s.label)}</span></div>`).join('');
  }
  document.addEventListener('DOMContentLoaded',()=>{setActiveNav();setupMobile();setupTop();});
})();

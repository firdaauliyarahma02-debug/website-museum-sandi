document.addEventListener('DOMContentLoaded',()=>{
  const data=window.MUSEUM_DATA;
  const el=$('#timelineList');
  if(!el) return;
  el.innerHTML=data.timeline.map((t,i)=>`<div class="time-item"><div class="time-dot"></div><article class="time-card" tabindex="0" data-index="${i}"><img src="${t.image}" alt="${escapeHTML(t.title)}" loading="lazy"><div><div class="year">${t.year}</div><span class="badge">${escapeHTML(t.category)}</span><h3>${escapeHTML(t.title)}</h3><p><b>${escapeHTML(t.date)}</b> · ${escapeHTML(t.location)}</p><p>${escapeHTML(t.summary)}</p><div class="detail-extra"><p>${escapeHTML(t.detail || t.summary)}</p><div class="timeline-actions"><a href="map.html${t.mapId?`?point=${encodeURIComponent(t.mapId)}`:''}">Lihat di Peta GIS</a><a href="gallery.html">Bandingkan dengan galeri</a></div></div></div></article></div>`).join('');
  el.addEventListener('click',e=>{const card=e.target.closest('.time-card'); if(card){card.classList.toggle('open');}});
  el.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.classList.contains('time-card')){e.preventDefault();e.target.classList.toggle('open');}});
});

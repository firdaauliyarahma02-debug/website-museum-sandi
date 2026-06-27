document.addEventListener('DOMContentLoaded',()=>{
  const data=window.MUSEUM_DATA;
  const hours=$('#hoursList');
  if(hours) hours.innerHTML=data.site.hours.map(h=>`<div class="info-row"><b>${escapeHTML(h.day)}</b><span>${escapeHTML(h.time)}</span></div>`).join('');
  const socials=$('#socialList');
  if(socials) socials.innerHTML=data.site.socials.map(s=>`<div class="info-row"><b>${escapeHTML(s.name)}</b><span>${escapeHTML(s.value)}</span></div>`).join('');
  const rooms=$('#allRooms');
  if(rooms) rooms.innerHTML=data.rooms.map(r=>card({title:`${r.no}. ${r.name}`,subtitle:r.en,image:r.image,badge:'Ruang Pamer',body:r.summary})).join('');
  const src=$('#sourcesList');
  if(src) src.innerHTML=data.sources.map(s=>`<div class="source-item"><b>${escapeHTML(s.name)}</b><span>${escapeHTML(s.note)}</span>${s.url?`<a href="${s.url}" target="_blank" rel="noopener">Buka sumber</a>`:''}</div>`).join('');
});

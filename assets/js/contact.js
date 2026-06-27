document.addEventListener('DOMContentLoaded',()=>{
  const data=window.MUSEUM_DATA;
  const hours=$('#contactHours');
  if(hours) hours.innerHTML=data.site.hours.map(h=>`<div class="info-row"><b>${escapeHTML(h.day)}</b><span>${escapeHTML(h.time)}</span></div>`).join('');
  const form=$('#visitForm'), out=$('#visitResult');
  form?.addEventListener('submit',e=>{
    e.preventDefault();
    const fd=Object.fromEntries(new FormData(form).entries());
    fd.createdAt=new Date().toISOString(); fd.ticket='MS-'+Math.random().toString(36).slice(2,8).toUpperCase();
    const list=JSON.parse(localStorage.getItem('museumVisitRequests')||'[]'); list.push(fd); localStorage.setItem('museumVisitRequests',JSON.stringify(list));
    out.innerHTML=`<div class="notice"><b>Simulasi tersimpan.</b><br>Kode kunjungan: <span class="mono">${fd.ticket}</span>. Karena ini GitHub Pages statis, data disimpan di browser pengunjung, bukan server.</div>`;
    form.reset();
  });
});

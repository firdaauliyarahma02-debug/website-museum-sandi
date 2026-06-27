document.addEventListener('DOMContentLoaded',()=>{
  renderGuide($('#guideFull'));
  const nodes=$$('.guide-node');
  nodes.forEach(n=>n.addEventListener('click',()=>{
    nodes.forEach(x=>x.classList.remove('active'));
    n.classList.add('active');
    const idx=[...nodes].indexOf(n);
    const steps=$$('.guide-step');
    if(steps[idx]) steps[idx].scrollIntoView({behavior:'smooth',block:'center'});
  }));
});

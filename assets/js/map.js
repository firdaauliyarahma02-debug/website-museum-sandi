document.addEventListener('DOMContentLoaded',()=>{
  const data=window.MUSEUM_DATA;
  const mapEl=$('#map');
  if(!mapEl || typeof L==='undefined') return;

  const museum=data.site.coords;
  const routeIds=new Set((data.routes||[]).flatMap(r=>r.pointIds||[]));
  const map=L.map('map',{scrollWheelZoom:true, zoomControl:true, preferCanvas:true}).setView(museum, 9);

  const dark=L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{maxZoom:20, attribution:'&copy; OpenStreetMap contributors &copy; CARTO'}).addTo(map);
  const osm=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19, attribution:'&copy; OpenStreetMap contributors'});
  const topo=L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',{maxZoom:17, attribution:'&copy; OpenTopoMap contributors'});
  L.control.layers({'Dark Map':dark,'OpenStreetMap':osm,'Topografi':topo}, null, {collapsed:true}).addTo(map);

  const routeLayer=L.layerGroup().addTo(map);
  const cluster = L.markerClusterGroup ? L.markerClusterGroup({showCoverageOnHover:false, maxClusterRadius:38, spiderfyOnMaxZoom:true}) : L.layerGroup();
  map.addLayer(cluster);

  let markers=[];
  const categorySelect=$('#categoryFilter'), prioritySelect=$('#priorityFilter'), search=$('#mapSearch'), list=$('#pointList'), count=$('#pointCount'), legend=$('#legend'), focus=$('#focusMuseum');
  const showRoutes=$('#showRoutes'), showPoints=$('#showPoints'), routeSelect=$('#routeFilter'), routeCards=$('#routeCards');

  const cats=['Semua',...Array.from(new Set(data.locations.map(x=>x.category)))];
  if(categorySelect) categorySelect.innerHTML=cats.map(c=>`<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join('');
  if(routeSelect){
    routeSelect.innerHTML='<option value="all">Semua jalur naratif</option>'+(data.routes||[]).map(r=>`<option value="${escapeHTML(r.id)}">${escapeHTML(r.name)}</option>`).join('');
  }

  function renderLegend(){
    if(!legend) return;
    const catRows=cats.filter(c=>c!=='Semua').map(c=>`<div class="legend-row"><span class="legend-swatch" style="background:${categoryColors[c]||'#2bd4ff'}"></span>${escapeHTML(c)}</div>`).join('');
    const routes=(data.routes||[]).map(r=>`<div class="legend-row"><span class="legend-line" style="--line:${r.color||'#2bd4ff'}"></span>${escapeHTML(r.name)}</div>`).join('');
    legend.innerHTML=`
      <div class="legend-block"><b>Simbol titik</b>
        <div class="legend-row"><span class="legend-shape route-sample"></span>Titik jalur komunikasi/kelembagaan</div>
        <div class="legend-row"><span class="legend-shape point-sample"></span>Titik sebaran mandiri</div>
      </div>
      <div class="legend-block"><b>Kategori</b>${catRows}</div>
      <div class="legend-block"><b>Jalur terhubung</b>${routes}</div>`;
  }
  renderLegend();

  function popup(p){
    const dist=haversineKm(data.site.coords[0],data.site.coords[1],p.lat,p.lng).toFixed(1);
    const color=categoryColors[p.category]||'#2bd4ff';
    const isRoute=routeIds.has(p.id);
    const routes=(data.routes||[]).filter(r=>(r.pointIds||[]).includes(p.id)).map(r=>r.name).join(', ');
    const coord=`${Number(p.lat).toFixed(5)}, ${Number(p.lng).toFixed(5)}`;
    return `<div class="popup-card popup-dark"><img src="${p.image}" alt="${escapeHTML(p.title)}"><div class="pbody"><span class="badge" style="border-color:${color};color:${color};background:rgba(43,212,255,.08)">${escapeHTML(p.category)}</span><h4>${escapeHTML(p.title)}</h4><p>${escapeHTML(p.summary)}</p><div class="meta"><span>${p.year}</span><span>${escapeHTML(p.accuracy)}</span><span>${isRoute?'Terhubung jalur':'Titik sebaran'}</span><span>${dist} km dari Museum Sandi</span></div>${routes?`<p class="popup-route"><b>Jalur:</b> ${escapeHTML(routes)}</p>`:''}<p class="popup-src"><b>Sumber:</b> ${escapeHTML(p.source||'Dokumentasi')}</p><div class="popup-actions"><a href="https://www.google.com/maps?q=${p.lat},${p.lng}" target="_blank" rel="noopener">Buka Google Maps</a><span>${coord}</span></div></div></div>`;
  }

  function makeMarker(p){
    const color=categoryColors[p.category]||'#2bd4ff';
    const isRoute=routeIds.has(p.id);
    const focusPoint=p.priority==='focus';
    const size=focusPoint?28:(isRoute?24:18);
    const html=isRoute
      ? `<span class="map-marker route-marker" style="--m:${color};width:${size}px;height:${size}px"><i></i></span>`
      : `<span class="map-marker point-marker" style="--m:${color};width:${size}px;height:${size}px"></span>`;
    const m=L.marker([p.lat,p.lng],{icon:L.divIcon({className:'',html,iconSize:[size,size],iconAnchor:[size/2,size/2],popupAnchor:[0,-size/2]})});
    m.bindPopup(popup(p),{maxWidth:340});
    m.on('click',()=>selectList(p.id));
    return m;
  }

  function filtered(){
    const c=categorySelect?.value || 'Semua';
    const pr=prioritySelect?.value || 'all';
    const rt=routeSelect?.value || 'all';
    const text=(search?.value||'').toLowerCase();
    let arr=data.locations.filter(p=>{
      const inRoute = rt==='all' || (p.routeIds||[]).includes(rt);
      const inCat = c==='Semua'||p.category===c;
      const inScope = pr==='all'||p.priority===pr;
      const inText = `${p.title} ${p.summary} ${p.address} ${p.category} ${(p.routeIds||[]).join(' ')}`.toLowerCase().includes(text);
      const showRoutePoint = showRoutes?.checked!==false || !routeIds.has(p.id);
      const showStandalone = showPoints?.checked!==false || routeIds.has(p.id);
      return inRoute && inCat && inScope && inText && showRoutePoint && showStandalone;
    });
    if(focus?.checked){
      arr=arr.filter(p=>p.priority==='focus' || haversineKm(data.site.coords[0],data.site.coords[1],p.lat,p.lng)<100);
    }
    return arr;
  }

  function pointById(id){ return data.locations.find(p=>p.id===id); }

  function renderRouteCards(arr){
    if(!routeCards) return;
    const selected=routeSelect?.value || 'all';
    const visibleIds=new Set(arr.map(p=>p.id));
    routeCards.innerHTML=(data.routes||[]).map(r=>{
      const visibleCount=(r.pointIds||[]).filter(id=>visibleIds.has(id)).length;
      const active=selected===r.id;
      return `<button type="button" class="route-card ${active?'active':''}" data-route="${escapeHTML(r.id)}"><span class="route-color" style="--line:${r.color||'#2bd4ff'}"></span><b>${escapeHTML(r.name)}</b><small>${visibleCount}/${(r.pointIds||[]).length} titik tampil</small><em>${escapeHTML(r.type)}</em></button>`;
    }).join('');
  }

  function routePopup(r, pts){
    return `<div class="route-popup"><b>${escapeHTML(r.name)}</b><p>${escapeHTML(r.description||'')}</p><span>${pts.length} titik terhubung</span></div>`;
  }

  function renderRoutes(arr){
    routeLayer.clearLayers();
    if(showRoutes?.checked===false) return;
    const selected=routeSelect?.value || 'all';
    const visibleIds=new Set(arr.map(p=>p.id));
    (data.routes||[]).filter(r=>selected==='all'||r.id===selected).forEach(r=>{
      const pts=(r.pointIds||[]).map(pointById).filter(Boolean).filter(p=>visibleIds.has(p.id) || selected===r.id);
      if(pts.length<2) return;
      const latlngs=pts.map(p=>[p.lat,p.lng]);
      const line=L.polyline(latlngs,{color:r.color||'#2bd4ff',weight:4,opacity:.82,dashArray:r.dash||'8 8',lineCap:'round',lineJoin:'round'}).addTo(routeLayer);
      line.bindTooltip(r.name,{sticky:true});
      line.bindPopup(routePopup(r,pts));
      // Small sequence dots so users can read direction without an arrow plugin.
      pts.forEach((p,i)=>{
        if(i===0 || i===pts.length-1) return;
        L.circleMarker([p.lat,p.lng],{radius:3,color:r.color||'#2bd4ff',fillColor:r.color||'#2bd4ff',fillOpacity:.95,weight:1,opacity:.9}).addTo(routeLayer);
      });
    });
  }

  function render(){
    const arr=filtered();
    cluster.clearLayers(); markers=[];
    arr.forEach(p=>{const m=makeMarker(p); m.__id=p.id; m.__data=p; markers.push(m); cluster.addLayer(m);});
    renderRoutes(arr);
    renderRouteCards(arr);
    if(list){
      list.innerHTML=arr.map(p=>{
        const isRoute=routeIds.has(p.id);
        return `<button class="point-item ${isRoute?'is-route':'is-point'}" data-id="${p.id}"><b>${escapeHTML(p.title)}</b><span>${p.year} · ${escapeHTML(p.category)} · ${isRoute?'jalur terhubung':'titik sebaran'} · ${escapeHTML(p.accuracy)}</span></button>`;
      }).join('') || '<div class="notice">Tidak ada titik yang cocok.</div>';
    }
    if(count) count.textContent=`${arr.length} titik tampil`;
    const allLayers=[...markers];
    routeLayer.eachLayer(l=>{ if(l.getBounds) allLayers.push(l); });
    if(arr.length){
      const group=L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(.16));
    }
  }

  function selectList(id){
    $$('.point-item',list||document).forEach(x=>x.classList.toggle('active', x.dataset.id===id));
  }

  list?.addEventListener('click',e=>{
    const b=e.target.closest('.point-item'); if(!b)return;
    const m=markers.find(x=>x.__id===b.dataset.id); if(!m)return;
    map.setView(m.getLatLng(), Math.max(map.getZoom(), 13), {animate:true});
    if(cluster.zoomToShowLayer) cluster.zoomToShowLayer(m,()=>m.openPopup()); else m.openPopup();
    selectList(b.dataset.id);
  });

  routeCards?.addEventListener('click',e=>{
    const b=e.target.closest('.route-card'); if(!b) return;
    if(routeSelect){ routeSelect.value=b.dataset.route; render(); }
  });

  [categorySelect,prioritySelect,routeSelect,search,focus,showRoutes,showPoints].forEach(el=>el&&el.addEventListener(el===search?'input':'change',render));
  $('#fitAll')?.addEventListener('click',render);
  $('#centerMuseum')?.addEventListener('click',()=>map.setView(data.site.coords,15));
  $('#downloadGeojson')?.addEventListener('click',()=>{location.href='assets/data/persandian_points.geojson'});
  render();
  const targetId=new URLSearchParams(location.search).get('point');
  if(targetId){
    setTimeout(()=>{
      const m=markers.find(x=>x.__id===targetId);
      if(m){
        map.setView(m.getLatLng(), 14, {animate:true});
        if(cluster.zoomToShowLayer) cluster.zoomToShowLayer(m,()=>m.openPopup()); else m.openPopup();
        selectList(targetId);
      }
    },600);
  }
});

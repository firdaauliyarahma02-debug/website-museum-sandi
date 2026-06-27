document.addEventListener('DOMContentLoaded',()=>{
  renderGuide($('#cipherGuide'),4);
  const input=$('#cipherInput'), output=$('#cipherOutput'), method=$('#cipherMethod'), mode=$('#cipherMode'), key=$('#cipherKey');
  const level=$('#cipherLevel'), status=$('#cipherStatus'), score=$('#cipherScore'), strip=$('#challengeStrip');
  let points=0;
  const challenges=[
    {level:'01',title:'Shift Yogyakarta',method:'caesar',mode:'encrypt',key:'3',text:'MUSEUM SANDI YOGYAKARTA',hint:'Geser alfabet 3 langkah'},
    {level:'02',title:'Atbash Rahasia',method:'atbash',mode:'encrypt',key:'',text:'RAHASIA NEGARA',hint:'Balik alfabet A↔Z'},
    {level:'03',title:'Kunci SANDI',method:'vigenere',mode:'encrypt',key:'SANDI',text:'KRIPTOLOGI INDONESIA',hint:'Gunakan kata kunci SANDI'}
  ];
  const examples={caesar:'MUSEUM SANDI YOGYAKARTA',atbash:'RAHASIA NEGARA',vigenere:'KRIPTOLOGI INDONESIA',base64:'Museum Sandi',frequency:'SERANGAN UMUM SATU MARET'};
  function caesar(text, shift, enc=true){
    shift=((Number(shift)||3)%26+26)%26; if(!enc) shift=(26-shift)%26;
    return text.replace(/[a-z]/gi, ch=>{const base=ch<='Z'?65:97; return String.fromCharCode((ch.charCodeAt(0)-base+shift)%26+base);});
  }
  function atbash(text){return text.replace(/[a-z]/gi,ch=>{const base=ch<='Z'?65:97;return String.fromCharCode(25-(ch.charCodeAt(0)-base)+base);});}
  function vigenere(text,k,enc=true){
    k=(k||'SANDI').replace(/[^a-z]/gi,'').toUpperCase(); if(!k) k='SANDI'; let i=0;
    return text.replace(/[a-z]/gi,ch=>{const base=ch<='Z'?65:97; const sh=k.charCodeAt(i++%k.length)-65; const val=ch.charCodeAt(0)-base; return String.fromCharCode(((val+(enc?sh:26-sh))%26)+base);});
  }
  function b64(text,enc=true){try{return enc?btoa(unescape(encodeURIComponent(text))):decodeURIComponent(escape(atob(text)));}catch(e){return 'Input Base64 tidak valid.'}}
  function freq(text){
    const counts={}; let total=0; (text.toUpperCase().match(/[A-Z]/g)||[]).forEach(c=>{counts[c]=(counts[c]||0)+1;total++;});
    if(!total) return 'Tidak ada huruf A-Z untuk dianalisis.';
    return Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([c,n])=>`${c}: ${n} (${(n/total*100).toFixed(1)}%) ${'█'.repeat(Math.max(1,Math.round(n/total*12)))}`).join('\n');
  }
  function run(){
    const m=method.value, enc=mode.value==='encrypt', text=input.value || '';
    let res='';
    if(m==='caesar') res=caesar(text,key.value,enc);
    if(m==='atbash') res=atbash(text);
    if(m==='vigenere') res=vigenere(text,key.value,enc);
    if(m==='base64') res=b64(text,enc);
    if(m==='frequency') res=freq(text);
    output.textContent=res;
    if(text.trim()){
  points += 10;
}

let currentLevel = '01';

if(points >= 30){
  currentLevel = '02';
}

if(points >= 60){
  currentLevel = '03';
}

if(points >= 90){
  currentLevel = '04';
}

if(points >= 120){
  currentLevel = '05';
}

if(score) score.textContent = points;
if(level) level.textContent = currentLevel;
if(status) status.textContent = 'Berhasil';
    output.animate([{transform:'scale(.99)',filter:'brightness(1.5)'},{transform:'scale(1)',filter:'brightness(1)'}],{duration:260});
  }
  function setChallenge(c,idx){
    method.value=c.method; mode.value=c.mode; key.value=c.key; input.value=c.text; if(level) level.textContent=c.level; if(status) status.textContent=c.hint; method.dispatchEvent(new Event('change')); run();
    $$('.challenge-strip button').forEach((b,i)=>b.classList.toggle('active',i===idx));
  }
  if(strip){
    strip.innerHTML=challenges.map((c,i)=>`<button type="button" data-i="${i}"><b>${escapeHTML(c.title)}</b><small>${escapeHTML(c.hint)}</small></button>`).join('');
    strip.addEventListener('click',e=>{const b=e.target.closest('button'); if(!b)return; setChallenge(challenges[Number(b.dataset.i)],Number(b.dataset.i));});
  }
  $('#runCipher')?.addEventListener('click',run);
  $('#clearCipher')?.addEventListener('click',()=>{input.value='';output.textContent='Hasil akan muncul di sini.'; if(status) status.textContent='Siap';});
  $('#exampleCipher')?.addEventListener('click',()=>{input.value=examples[method.value]||examples.caesar; if(method.value==='caesar') key.value='3'; if(method.value==='vigenere') key.value='SANDI'; run();});
  method?.addEventListener('change',()=>{key.disabled=method.value==='atbash'||method.value==='base64'||method.value==='frequency'; mode.disabled=method.value==='atbash'||method.value==='frequency'; if(status) status.textContent=`Mode ${method.options[method.selectedIndex].text}`;});
  method?.dispatchEvent(new Event('change'));
});

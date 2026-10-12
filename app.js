const start='2026-10-13';
const localDay=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
const save=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
let plan=[],selected=null,activePassage=null;
const $=id=>document.getElementById(id);
async function showPassage(ref){
 activePassage=ref;$('passageTitle').textContent=ref+' · World English Bible';$('passageText').textContent='Loading Scripture…';$('passage').hidden=false;
 const cache=read('rooted_scriptures',{});
 if(cache[ref]){$('passageText').textContent=cache[ref];return}
 try{
  const url='https://bible-api.com/'+encodeURIComponent(ref)+'?translation=web';
  const response=await fetch(url);if(!response.ok)throw new Error('Scripture service unavailable');
  const data=await response.json();if(!data.verses?.length)throw new Error('Passage not found');
  const passage=data.verses.map(v=>`${v.verse}. ${v.text.trim()}`).join('\n\n');
  if(activePassage!==ref)return;
  $('passageText').textContent=passage;
  // Cache individual chapters on this device for offline rereading.
  cache[ref]=passage;try{save('rooted_scriptures',cache)}catch{}
 }catch(e){if(activePassage===ref)$('passageText').textContent='Could not load this chapter. Connect to Wi-Fi and tap the chapter again. The Bible text is retrieved from a public Scripture service.'}
}
function draw(){
 const date=localDay(), index=Math.max(0,Math.min(364,Math.round((Date.parse(date+'T12:00:00Z')-Date.parse(start+'T12:00:00Z'))/86400000)));
 selected=plan[index];$('dayTitle').textContent=`Day ${selected.day} · ${selected.date}`;
 $('theme').textContent=`Theme: ${selected.theme}`;
 const done=read('rooted_completed',{}),box=$('chapters');box.replaceChildren();
 selected.chapters.forEach(ref=>{const line=document.createElement('div');line.className='chapter';const cb=document.createElement('input');cb.type='checkbox';cb.checked=!!done[ref];cb.setAttribute('aria-label','Mark '+ref+' read');cb.onchange=()=>{const state=read('rooted_completed',{});if(cb.checked)state[ref]=true;else delete state[ref];save('rooted_completed',state);progress()};const btn=document.createElement('button');btn.className='readbtn';btn.textContent='Read '+ref;btn.onclick=()=>showPassage(ref);line.append(cb,btn);box.append(line)});
 progress();render();
}
function progress(){const n=Object.keys(read('rooted_completed',{})).length;$('progress').textContent=`${n} of 1,189 chapters marked read (${Math.round(n/1189*100)}%)`}
function render(){const entries=read('rooted_entries',[]);const box=$('entries');box.replaceChildren();entries.slice().reverse().forEach(entry=>{const div=document.createElement('div');div.className='entry';const h=document.createElement('strong');h.textContent=`${entry.date} · ${entry.theme}`;const refs=document.createElement('small');refs.textContent=(entry.passages||[]).join(', ');const p=document.createElement('p');p.textContent=entry.text;const edit=document.createElement('button');edit.textContent='Edit';edit.onclick=()=>{const replacement=prompt('Edit journal entry:',entry.text);if(replacement!==null){const list=read('rooted_entries',[]),found=list.find(x=>x.id===entry.id);if(found){found.text=replacement;save('rooted_entries',list);render()}}};div.append(h,document.createElement('br'),refs,p,edit);box.append(div)})}
$('save').onclick=()=>{if(!selected)return;const input=$('reflection'),text=input.value.trim();if(!text)return;const entries=read('rooted_entries',[]);entries.push({id:Date.now()+Math.random(),date:selected.date,theme:selected.theme,passages:activePassage?[activePassage]:selected.chapters,text});try{save('rooted_entries',entries)}catch{alert('Storage is full. Export your journal before continuing.');return}input.value='';render()};
$('export').onclick=()=>{const data={journal:read('rooted_entries',[]),completed:read('rooted_completed',{}),exportedAt:new Date().toISOString()};const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='rooted-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500)};
fetch('./plan.json').then(r=>{if(!r.ok)throw Error('Plan unavailable');return r.json()}).then(data=>{plan=data;draw()}).catch(()=>{$('theme').textContent='Reading plan could not load. Reopen the app when online.'});
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js');

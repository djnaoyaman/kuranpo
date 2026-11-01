/* The original route list is the source of truth; only three visual slots exist. */
(()=>{
 'use strict';
 if(document.body.dataset.page!=='index')return;
 const key='kuranpo-walk-selection', reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const plain=node=>{const copy=node?.cloneNode(true);copy?.querySelectorAll('rt,rp').forEach(n=>n.remove());return copy?.textContent.trim()||'';};
 const courses=[...document.querySelectorAll('#routes .route')].map(row=>{
  const a=row.querySelector('a');return {href:a.getAttribute('href'),id:a.getAttribute('href').split('/').pop().replace('.html','').toUpperCase(),title:[plain(row.querySelector('.r-grp')),plain(row.querySelector('.r-title'))].filter(Boolean).join(' — '),meta:[...row.querySelectorAll('.r-meta span')].map(plain).join(' / ')};
 });
 if(!courses.length)return;
 let selected=0,photos={},mounted=null;
 try{const saved=sessionStorage.getItem(key);const i=courses.findIndex(c=>c.href===saved);if(i>=0)selected=i;}catch(_){}
 const wrap=i=>(i+courses.length)%courses.length;
 function make(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
 function mount(){
  const scene=document.querySelector('.b-scene');if(!scene||scene===mounted)return;mounted=scene;
  const orbit=scene.querySelector('.orbit');if(!orbit)return;
  const gallery=make('div','walk-gallery');gallery.setAttribute('role','region');gallery.setAttribute('aria-roledescription','カルーセル');gallery.setAttribute('aria-label','全散歩コース');
  const hint=make('p','walk-hint','左右にスワイプして、今日の一本へ。');hint.id='walk-hint';
  const viewport=make('div','walk-viewport');viewport.tabIndex=0;viewport.setAttribute('aria-label','コースをめくる');viewport.setAttribute('aria-describedby','walk-hint');viewport.setAttribute('aria-keyshortcuts','ArrowLeft ArrowRight Home End');
  const stage=make('div','walk-stage'),before=make('div','walk-preview walk-before'),after=make('div','walk-preview walk-after');
  for(const p of [before,after]){p.setAttribute('aria-hidden','true');p.inert=true;}
  const current=make('a','walk-current');current.draggable=false;stage.append(before,current,after);viewport.append(stage);
  const controls=make('div','walk-controls'),prev=make('button','walk-prev','←'),next=make('button','walk-next','→'),status=make('span','walk-status');
  prev.type=next.type='button';prev.setAttribute('aria-label','前のコース');next.setAttribute('aria-label','次のコース');status.setAttribute('aria-live','polite');status.setAttribute('aria-atomic','true');controls.append(prev,status,next);
  const label=make('label','walk-picker','コースを選ぶ'),select=make('select','walk-select');select.setAttribute('aria-label','全コースから選ぶ');courses.forEach(c=>{const o=make('option','',c.id+' '+c.title);o.value=c.href;select.append(o);});label.append(select);
  const details=make('details','walk-credits'),summary=make('summary','','表示中の写真・資料の出典'),credit=make('div','walk-credit-text');details.append(summary,credit);
  gallery.append(hint,viewport,controls,label,details);orbit.replaceChildren(gallery);orbit.classList.add('walk-orbit');scene.querySelector('.b-photo-credits')?.remove();
  scene.querySelector('.section-title h2').textContent='Walk 01—'+courses.length;
  let gesture=null,suppressUntil=0;
  function visual(slot,course,isCurrent){
   slot.replaceChildren();const photo=photos[course.href],frame=make('div','walk-photo');
   if(photo){const img=make('img');img.src=photo.src;img.alt=isCurrent?photo.alt:'';img.decoding='async';img.draggable=false;frame.append(img);}
   else{frame.classList.add('walk-no-photo');frame.append(make('span','',course.id),make('small','','道と歴史を読む'));}
   slot.append(frame);if(isCurrent){slot.href=course.href;const info=make('div','walk-info');info.append(make('span','walk-id',course.id),make('h3','',course.title),make('p','',course.meta),make('span','walk-open','コースの詳細へ ↗'));slot.append(info);}else slot.append(make('span','walk-preview-id',course.id));
  }
  function render(direction=0){
   gallery.dataset.index=selected;visual(before,courses[wrap(selected-1)],false);visual(current,courses[selected],true);visual(after,courses[wrap(selected+1)],false);
   status.textContent=String(selected+1).padStart(2,'0')+' / '+courses.length;select.value=courses[selected].href;
   // Credits cover the visible neighbouring photographs as well as the main card.
   credit.replaceChildren();[wrap(selected-1),selected,wrap(selected+1)].forEach(i=>{const photo=photos[courses[i].href];if(!photo)return;const block=make('div','walk-credit');block.append(make('strong','',courses[i].id));const text=make('div');text.innerHTML=photo.credit;block.append(text);credit.append(block);});details.hidden=!credit.children.length;
   stage.style.removeProperty('--walk-drag');current.getAnimations().forEach(a=>a.cancel());if(direction&&!reduced.matches)current.animate([{opacity:.65,transform:`translateX(${direction*24}px)`},{opacity:1,transform:'none'}],{duration:220,easing:'ease-out'});
   try{sessionStorage.setItem(key,courses[selected].href);}catch(_){}
  }
  function move(delta){selected=wrap(selected+delta);render(Math.sign(delta));}
  prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));select.addEventListener('change',()=>{const i=courses.findIndex(c=>c.href===select.value);if(i>=0){selected=i;render();}});
  viewport.addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey||e.shiftKey)return;const deltas={ArrowLeft:-1,ArrowRight:1,Home:-selected,End:courses.length-1-selected};if(e.key in deltas){e.preventDefault();move(deltas[e.key]);}});
  viewport.addEventListener('dragstart',e=>e.preventDefault());
  viewport.addEventListener('pointerdown',e=>{if(!e.isPrimary||e.button!==0)return;suppressUntil=0;gesture={id:e.pointerId,x:e.clientX,y:e.clientY,dx:0,axis:null};});
  viewport.addEventListener('pointermove',e=>{if(!gesture||gesture.id!==e.pointerId)return;const g=gesture,dx=e.clientX-g.x,dy=e.clientY-g.y;if(!g.axis&&Math.max(Math.abs(dx),Math.abs(dy))>10){g.axis=Math.abs(dx)>Math.abs(dy)*1.2?'x':'y';if(g.axis==='x')viewport.setPointerCapture(e.pointerId);}if(g.axis==='x'){e.preventDefault();g.dx=dx;stage.style.setProperty('--walk-drag',Math.max(-100,Math.min(100,dx))+'px');}});
  function finish(e,cancel=false){if(!gesture||gesture.id!==e.pointerId)return;const g=gesture;gesture=null;stage.style.removeProperty('--walk-drag');if(g.axis)suppressUntil=performance.now()+700;if(g.axis==='x'&&!cancel&&Math.abs(g.dx)>=45)move(g.dx<0?1:-1);if(viewport.hasPointerCapture(e.pointerId))viewport.releasePointerCapture(e.pointerId);}
  viewport.addEventListener('pointerup',e=>finish(e));viewport.addEventListener('pointercancel',e=>finish(e,true));viewport.addEventListener('lostpointercapture',e=>finish(e,true));
  viewport.addEventListener('click',e=>{if(e.detail>0&&performance.now()<suppressUntil){e.preventDefault();e.stopPropagation();}},true);
  render();gallery._refresh=()=>render();
 }
 reduced.addEventListener('change',()=>{if(reduced.matches)document.querySelector('.walk-current')?.getAnimations().forEach(a=>a.cancel());});
 // A theme change replaces the scene; mounted prevents reacting to our own renders.
 new MutationObserver(mount).observe(document.body,{childList:true,subtree:true});mount();
 fetch('assets/walk-photos.json').then(r=>{if(!r.ok)throw Error('photo manifest');return r.json();}).then(data=>{photos=data;document.querySelector('.walk-gallery')?._refresh();}).catch(()=>{});
})();

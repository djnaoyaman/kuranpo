/* Virtual orbital carousel. Nine cards travel around an ellipse; recycling is hidden behind it. */
(()=>{
 'use strict';
 if(document.body.dataset.page!=='index'||!window.WalkMotion)return;
 const {Motion,releaseVelocity}=window.WalkMotion,key='kuranpo-walk-selection',reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const plain=node=>{const copy=node?.cloneNode(true);copy?.querySelectorAll('rt,rp').forEach(n=>n.remove());return copy?.textContent.trim()||'';};
 const courses=[...document.querySelectorAll('#routes .route')].map(row=>{const href=row.querySelector('a').getAttribute('href');return {href,id:href.split('/').pop().replace('.html','').toUpperCase(),title:[plain(row.querySelector('.r-grp')),plain(row.querySelector('.r-title'))].filter(Boolean).join(' — '),meta:[...row.querySelectorAll('.r-meta span')].map(plain).join(' / ')};});
 if(!courses.length)return;
 const wrap=i=>((i%courses.length)+courses.length)%courses.length;
 let selected=0,photos={},mounted=null,dispose=()=>{};
 try{const i=courses.findIndex(c=>c.href===sessionStorage.getItem(key));if(i>=0)selected=i;}catch(_){}
 function make(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
 function mount(){
  const scene=document.querySelector('.b-scene');if(scene===mounted)return;dispose();mounted=scene;if(!scene)return;
  const orbit=scene.querySelector('.orbit');if(!orbit)return;
  const gallery=make('div','walk-gallery');gallery.setAttribute('role','region');gallery.setAttribute('aria-roledescription','カルーセル');gallery.setAttribute('aria-label','全散歩コース');
  const hint=make('p','walk-hint','指でまわす。鎌倉の道が、公転する。');hint.id='walk-hint';
  const viewport=make('div','walk-viewport');viewport.tabIndex=0;viewport.setAttribute('aria-label','コースを立体軌道でまわす');viewport.setAttribute('aria-describedby','walk-hint');viewport.setAttribute('aria-keyshortcuts','ArrowLeft ArrowRight Home End');
  const stage=make('div','walk-stage');viewport.append(stage);
  const controls=make('div','walk-controls'),prev=make('button','walk-prev','←'),next=make('button','walk-next','→'),status=make('span','walk-status');prev.type=next.type='button';prev.setAttribute('aria-label','前のコース');next.setAttribute('aria-label','次のコース');status.setAttribute('aria-hidden','true');const announcement=make('span','walk-announcement');announcement.setAttribute('aria-live','polite');announcement.setAttribute('aria-atomic','true');controls.append(prev,status,next,announcement);
  const label=make('label','walk-picker','コースを選ぶ'),select=make('select','walk-select');select.setAttribute('aria-label','全コースから選ぶ');courses.forEach(c=>{const o=make('option','',c.id+' '+c.title);o.value=c.href;select.append(o);});label.append(select);
  const details=make('details','walk-credits'),summary=make('summary','','表示中の写真・資料の出典'),credit=make('div','walk-credit-text');details.append(summary,credit);
  gallery.append(hint,viewport,controls,label,details);orbit.replaceChildren(gallery);orbit.classList.add('walk-orbit');scene.querySelector('.b-photo-credits')?.remove();scene.querySelector('.section-title h2').textContent='Walk 01—'+courses.length;
  const motion=new Motion(selected),pool=new Map(),controller=new AbortController();
  let frame=0,lastTime=0,pitch=1,cardWidth=1,gesture=null,suppressUntil=0,announced=-1,displayed=-1,dead=false;
  function save(){selected=wrap(Math.round(motion.position));try{sessionStorage.setItem(key,courses[selected].href);}catch(_){}}
  function photoFor(card,course){
   const photo=photos[course.href],frame=card.querySelector('.walk-photo');frame.replaceChildren();
   frame.classList.toggle('walk-no-photo',!photo);frame.classList.remove('is-loaded');
   const placeholder=make('div','walk-photo-placeholder');placeholder.append(make('span','',course.id),make('small','',photo?'道の風景':'道と歴史を読む'));frame.append(placeholder);
   if(photo){const img=make('img');img.alt=photo.alt;img.draggable=false;img.decoding='async';img.addEventListener('load',()=>{if(img.parentNode===frame)frame.classList.add('is-loaded');},{once:true});img.src=photo.thumb||photo.src;frame.append(img);if(img.complete&&img.naturalWidth)frame.classList.add('is-loaded');}
  }
  function createCard(logical){
   const c=courses[wrap(logical)],card=make('a','walk-card');card.href=c.href;card.draggable=false;card.dataset.logical=logical;card.dataset.course=c.id;
   card.append(make('div','walk-photo'));const info=make('div','walk-info');info.append(make('span','walk-id',c.id),make('h3','',c.title),make('p','',c.meta),make('span','walk-open','コースの詳細へ ↗'));card.append(info);photoFor(card,c);stage.append(card);pool.set(logical,card);return card;
  }
  function announce(){
   const i=wrap(Math.round(motion.position));save();if(announced===i)return;announced=i;
   announcement.textContent=(i+1)+' / '+courses.length+'、'+courses[i].id+' '+courses[i].title;select.value=courses[i].href;
   if(!details.open)showCredits(i);
  }
  function showCredits(i){
   credit.replaceChildren();for(let d=-2;d<=2;d++){const c=courses[wrap(i+d)],p=photos[c.href];if(!p)continue;const block=make('div','walk-credit');block.append(make('strong','',c.id));const text=make('div');text.innerHTML=p.credit;block.append(text);credit.append(block);}details.hidden=!credit.children.length;
  }
  function draw(){
   const center=Math.round(motion.position),low=center-4,high=center+4;
   for(const [n,card] of pool)if((n<low||n>high)&&card!==gesture?.anchor){card.remove();pool.delete(n);}
   for(let n=low;n<=high;n++)if(!pool.has(n))createCard(n);
   for(const [n,card] of pool){
    const distance=n-motion.position,abs=Math.abs(distance),current=n===center;
    // Same curve at every frame; the rear seam fades out before a slot is recycled.
    const angle=distance*Math.PI*2/9,depth=(1-Math.cos(angle))/2;
    const scale=1-depth*.64,x=Math.sin(angle)*cardWidth*1.12;
    const y=24-depth*cardWidth*.24;
    const opacity=Math.max(0,Math.min(1,(4.15-abs)/.65))*(1-depth*.66);
    card.style.transform=reduced.matches
     ? `translate3d(${distance*pitch-cardWidth/2}px,24px,0)`
     : `translate3d(${x-cardWidth/2}px,${y}px,0) scale(${scale}) perspective(1100px) rotateY(${-Math.sin(angle)*24}deg) rotateZ(${Math.sin(angle)*3}deg)`;
    card.style.opacity=String(reduced.matches?1-Math.min(abs,1)*.35:opacity);
    card.style.setProperty('--walk-info-opacity',String(Math.max(0,1-abs*1.65)));
    card.style.zIndex=String(100-Math.round(depth*80));
    card.classList.toggle('walk-current',current);card.classList.toggle('walk-preview',!current);
    card.inert=!current&&card!==gesture?.anchor;card.tabIndex=current?0:-1;if(current)card.removeAttribute('aria-hidden');else card.setAttribute('aria-hidden','true');
   }
   const visibleIndex=wrap(center);if(displayed!==visibleIndex){displayed=visibleIndex;status.textContent=String(visibleIndex+1).padStart(2,'0')+' / '+courses.length;if(document.activeElement!==select)select.value=courses[visibleIndex].href;}
   gallery.dataset.index=visibleIndex;gallery.dataset.position=motion.position.toFixed(5);gallery.dataset.motion=motion.phase;gallery.dataset.velocity=motion.velocity.toFixed(5);
   if(motion.phase==='idle')announce();
  }
  function tick(now){frame=0;if(dead)return;const dt=lastTime?(now-lastTime)/1000:1/60;lastTime=now;const active=motion.step(dt);draw();if(active)frame=requestAnimationFrame(tick);else lastTime=0;}
  function schedule(){if(!frame&&!dead){lastTime=0;frame=requestAnimationFrame(tick);}}
  function stopFrame(){if(frame)cancelAnimationFrame(frame);frame=0;lastTime=0;}
  function settleImmediately(){stopFrame();gesture=null;motion.snap(Math.round(motion.position),true);viewport.classList.remove('is-dragging');draw();}
  function measure(){const w=viewport.clientWidth;cardWidth=w*(w>=900?.36:w<=600?.62:.48);cardWidth=Math.min(cardWidth,w>=900?420:Infinity);pitch=cardWidth+Math.max(18,w*.035);stage.style.setProperty('--walk-card-width',cardWidth+'px');stage.style.height=(cardWidth*1.25+210)+'px';if(gesture){gesture.position=motion.position;gesture.x=gesture.lastX;gesture.samples=[];}draw();}
  function move(delta){const base=motion.phase==='snap'?motion.target:Math.round(motion.position);motion.snap(base+delta,reduced.matches);draw();schedule();}
  details.addEventListener('toggle',()=>{const i=wrap(Math.round(motion.position));summary.textContent=details.open?'写真・資料の出典（'+courses[i].id+'付近・開いた時点）':'表示中の写真・資料の出典';if(details.open)showCredits(i);});
  prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));select.addEventListener('change',()=>{const i=courses.findIndex(c=>c.href===select.value);if(i>=0){stopFrame();gesture=null;motion.snap(i,true);draw();}});
  viewport.addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey||e.shiftKey)return;const i=wrap(Math.round(motion.position)),d={ArrowLeft:-1,ArrowRight:1,Home:-i,End:courses.length-1-i};if(e.key in d){e.preventDefault();if(e.target.closest('.walk-card'))viewport.focus({preventScroll:true});if(e.key==='Home'||e.key==='End')motion.stop();move(d[e.key]);}});
  viewport.addEventListener('dragstart',e=>e.preventDefault());
  // Touch Events arbitrate scrolling before the browser commits a native pan.
  // Pointer-event cancellation alone cannot cancel viewport scrolling on iOS.
  function begin(id,x,y,time,target,touch=false){
   if(gesture)return;
   const wasMoving=motion.phase==='coast'||motion.phase==='snap';
   gesture={id,x,lastX:x,y,position:motion.position,axis:null,moved:false,samples:[{t:time,p:motion.position}],wasMoving,touch,anchor:target.closest?.('.walk-card'),href:target.closest?.('.walk-card')?.getAttribute('href')||courses[wrap(Math.round(motion.position))].href};
   suppressUntil=0;
  }
  function track(x,y,time,event){
   const g=gesture;if(!g)return;const dx=x-g.x,dy=y-g.y;g.lastX=x;g.moved ||= Math.hypot(dx,dy)>6;
   if(!g.axis&&(Math.abs(dx)>=6&&Math.abs(dx)>=Math.abs(dy)*.85||Math.abs(dy)>=12)){
    // Tiny initial wobble is undecided, not a permanent vertical lock.
    // Horizontal intent locks at 6px; remaining vertical intent is handed off at 12px.
    g.axis=Math.abs(dx)>=Math.abs(dy)*.85?'x':'y';
    if(g.axis==='x'){
     if(g.touch&&!event.cancelable){g.axis='y';return;}
     g.position=motion.position;stopFrame();motion.stop();g.samples=[{t:time,p:g.position}];
     if(!g.touch)viewport.setPointerCapture(g.id);viewport.classList.add('is-dragging');
    }
   }
   if(g.axis!=='x')return;
   if(event.cancelable)event.preventDefault();
   motion.drag(g.position-dx/pitch);g.samples.push({t:time,p:motion.position});g.samples=g.samples.filter(s=>s.t>=time-150);schedule();
  }
  function finish(id,time,cancel=false){
   if(!gesture||gesture.id!==id)return;const g=gesture;gesture=null;viewport.classList.remove('is-dragging');
   if(g.axis||g.moved)suppressUntil=performance.now()+700;
   if(g.axis==='x'){
    if(cancel)motion.snap(Math.round(motion.position),reduced.matches);
    else if(reduced.matches){const d=motion.position-g.position;motion.snap(Math.abs(d)>.18&&Math.abs(d)<.5?Math.round(g.position)+Math.sign(d):Math.round(motion.position),true);}
    else motion.release(releaseVelocity(g.samples,time));
   }
   // A vertical gesture, opening credits, or simply touching the wheel is not a brake.
   if(!g.touch&&viewport.hasPointerCapture(id))viewport.releasePointerCapture(id);
   if(!cancel&&!g.moved&&!g.axis&&g.wasMoving&&g.href){suppressUntil=performance.now()+700;try{sessionStorage.setItem(key,g.href);}catch(_){}location.assign(g.href);return;}
   draw();if(motion.phase!=='idle')schedule();
  }
  viewport.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||!e.isPrimary||e.button!==0)return;begin(e.pointerId,e.clientX,e.clientY,e.timeStamp,e.target);});
  viewport.addEventListener('pointermove',e=>{if(gesture&&!gesture.touch&&gesture.id===e.pointerId)track(e.clientX,e.clientY,e.timeStamp,e);});
  viewport.addEventListener('pointerup',e=>{if(!gesture?.touch)finish(e.pointerId,e.timeStamp);});
  viewport.addEventListener('pointercancel',e=>{if(!gesture?.touch)finish(e.pointerId,e.timeStamp,true);});
  viewport.addEventListener('lostpointercapture',e=>{if(e.target===viewport&&!gesture?.touch)finish(e.pointerId,e.timeStamp,true);});
  viewport.addEventListener('touchstart',e=>{
   if(e.touches.length!==1){if(gesture?.touch)finish(gesture.id,e.timeStamp,true);return;}
   const t=e.changedTouches[0];begin(t.identifier,t.clientX,t.clientY,e.timeStamp,e.target,true);
  },{passive:true});
  viewport.addEventListener('touchmove',e=>{
   if(!gesture?.touch)return;if(e.touches.length!==1){finish(gesture.id,e.timeStamp,true);return;}
   const t=[...e.changedTouches].find(t=>t.identifier===gesture.id);if(t)track(t.clientX,t.clientY,e.timeStamp,e);
  },{passive:false});
  for(const type of ['touchend','touchcancel'])viewport.addEventListener(type,e=>{if(!gesture?.touch)return;const t=[...e.changedTouches].find(t=>t.identifier===gesture.id);if(t){gesture.moved ||= Math.hypot(t.clientX-gesture.x,t.clientY-gesture.y)>6;if(type==='touchend'&&gesture.wasMoving&&!gesture.moved&&!gesture.axis&&e.cancelable)e.preventDefault();finish(t.identifier,e.timeStamp,type==='touchcancel');}},{passive:false});
  viewport.addEventListener('click',e=>{if(e.detail>0&&performance.now()<suppressUntil){e.preventDefault();e.stopPropagation();}},true);
  const resize=new ResizeObserver(measure);resize.observe(viewport);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)settleImmediately();},{signal:controller.signal});
  window.addEventListener('blur',settleImmediately,{signal:controller.signal});
  reduced.addEventListener('change',()=>{if(reduced.matches)settleImmediately();},{signal:controller.signal});
  gallery._refresh=()=>{for(const [n,c]of pool)photoFor(c,courses[wrap(n)]);announced=-1;draw();};
  dispose=()=>{save();dead=true;stopFrame();resize.disconnect();controller.abort();pool.clear();};measure();
 }
 new MutationObserver(mount).observe(document.body,{childList:true,subtree:true});mount();
 fetch('assets/walk-photos.json').then(r=>{if(!r.ok)throw Error('photo manifest');return r.json();}).then(data=>{photos=data;document.querySelector('.walk-gallery')?._refresh();}).catch(()=>{});
})();

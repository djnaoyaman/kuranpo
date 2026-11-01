/* Continuous, bounded virtual track. The untouched route list supplies every link. */
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
  const hint=make('p','walk-hint','指でめくる。軽くはじくと、くるくる。');hint.id='walk-hint';
  const viewport=make('div','walk-viewport');viewport.tabIndex=0;viewport.setAttribute('aria-label','コースをめくる');viewport.setAttribute('aria-describedby','walk-hint');viewport.setAttribute('aria-keyshortcuts','ArrowLeft ArrowRight Home End');
  const stage=make('div','walk-stage');viewport.append(stage);
  const controls=make('div','walk-controls'),prev=make('button','walk-prev','←'),next=make('button','walk-next','→'),status=make('span','walk-status');prev.type=next.type='button';prev.setAttribute('aria-label','前のコース');next.setAttribute('aria-label','次のコース');status.setAttribute('aria-live','polite');status.setAttribute('aria-atomic','true');controls.append(prev,status,next);
  const label=make('label','walk-picker','コースを選ぶ'),select=make('select','walk-select');select.setAttribute('aria-label','全コースから選ぶ');courses.forEach(c=>{const o=make('option','',c.id+' '+c.title);o.value=c.href;select.append(o);});label.append(select);
  const details=make('details','walk-credits'),summary=make('summary','','表示中の写真・資料の出典'),credit=make('div','walk-credit-text');details.append(summary,credit);
  gallery.append(hint,viewport,controls,label,details);orbit.replaceChildren(gallery);orbit.classList.add('walk-orbit');scene.querySelector('.b-photo-credits')?.remove();scene.querySelector('.section-title h2').textContent='Walk 01—'+courses.length;
  const motion=new Motion(selected),pool=new Map(),controller=new AbortController();
  let frame=0,lastTime=0,pitch=1,cardWidth=1,gesture=null,suppressUntil=0,announced=-1,dead=false;
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
   status.textContent=String(i+1).padStart(2,'0')+' / '+courses.length;select.value=courses[i].href;
   credit.replaceChildren();for(let d=-2;d<=2;d++){const c=courses[wrap(i+d)],p=photos[c.href];if(!p)continue;const block=make('div','walk-credit');block.append(make('strong','',c.id));const text=make('div');text.innerHTML=p.credit;block.append(text);credit.append(block);}details.hidden=!credit.children.length;
  }
  function draw(){
   const center=Math.round(motion.position),low=center-3,high=center+3;
   for(const [n,card] of pool)if(n<low||n>high){card.remove();pool.delete(n);}
   for(let n=low;n<=high;n++)if(!pool.has(n))createCard(n);
   for(const [n,card] of pool){
    const distance=n-motion.position,abs=Math.abs(distance),current=n===center;
    card.style.transform=`translate3d(${distance*pitch-cardWidth/2}px,0,0)`;
    card.style.opacity=String(1-Math.min(abs,1)*.35);card.style.setProperty('--walk-info-opacity',String(Math.max(0,1-abs)));card.style.zIndex=String(10-Math.round(abs));
    card.classList.toggle('walk-current',current);card.classList.toggle('walk-preview',!current);
    card.inert=!current;card.tabIndex=current?0:-1;if(current)card.removeAttribute('aria-hidden');else card.setAttribute('aria-hidden','true');
   }
   gallery.dataset.index=wrap(center);gallery.dataset.position=motion.position.toFixed(5);gallery.dataset.motion=motion.phase;gallery.dataset.velocity=motion.velocity.toFixed(5);
   if(motion.phase==='idle')announce();
  }
  function tick(now){frame=0;if(dead)return;const dt=lastTime?(now-lastTime)/1000:1/60;lastTime=now;const active=motion.step(dt);draw();if(active)frame=requestAnimationFrame(tick);else lastTime=0;}
  function schedule(){if(!frame&&!dead){lastTime=0;frame=requestAnimationFrame(tick);}}
  function stopFrame(){if(frame)cancelAnimationFrame(frame);frame=0;lastTime=0;}
  function settleImmediately(){stopFrame();gesture=null;motion.snap(Math.round(motion.position),true);viewport.classList.remove('is-dragging');draw();}
  function measure(){const w=viewport.clientWidth;cardWidth=w*(w>=900?.40:w<=600?.72:.56);cardWidth=Math.min(cardWidth,w>=900?420:Infinity);pitch=cardWidth+Math.max(18,w*.035);stage.style.setProperty('--walk-card-width',cardWidth+'px');stage.style.height=(cardWidth*1.25+240)+'px';if(gesture){gesture.position=motion.position;gesture.x=gesture.lastX;gesture.samples=[];}draw();}
  function move(delta){const base=motion.phase==='snap'?motion.target:Math.round(motion.position);motion.snap(base+delta,reduced.matches);draw();schedule();}
  prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));select.addEventListener('change',()=>{const i=courses.findIndex(c=>c.href===select.value);if(i>=0){stopFrame();gesture=null;motion.snap(i,true);draw();}});
  viewport.addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey||e.shiftKey)return;const i=wrap(Math.round(motion.position)),d={ArrowLeft:-1,ArrowRight:1,Home:-i,End:courses.length-1-i};if(e.key in d){e.preventDefault();if(e.target.closest('.walk-card'))viewport.focus({preventScroll:true});if(e.key==='Home'||e.key==='End')motion.stop();move(d[e.key]);}});
  viewport.addEventListener('dragstart',e=>e.preventDefault());
  viewport.addEventListener('pointerdown',e=>{
   if(!e.isPrimary||e.button!==0)return;const wasMoving=motion.phase==='coast'||motion.phase==='snap';stopFrame();motion.stop();
   suppressUntil=wasMoving?performance.now()+700:0;gesture={id:e.pointerId,x:e.clientX,lastX:e.clientX,y:e.clientY,position:motion.position,axis:null,samples:[{t:e.timeStamp,p:motion.position}],wasMoving};draw();
  });
  viewport.addEventListener('pointermove',e=>{
   if(!gesture||gesture.id!==e.pointerId)return;const g=gesture,dx=e.clientX-g.x,dy=e.clientY-g.y;g.lastX=e.clientX;
   if(!g.axis&&Math.max(Math.abs(dx),Math.abs(dy))>6){g.axis=Math.abs(dx)>Math.abs(dy)*1.15?'x':'y';if(g.axis==='x'){viewport.setPointerCapture(e.pointerId);viewport.classList.add('is-dragging');}}
   if(g.axis!=='x')return;e.preventDefault();
   const events=e.getCoalescedEvents?.()||[];for(const sample of events.length?events:[e])g.samples.push({t:sample.timeStamp,p:g.position-(sample.clientX-g.x)/pitch});
   g.samples=g.samples.filter(s=>s.t>=e.timeStamp-150);motion.drag(g.position-dx/pitch);schedule();
  });
  function finish(e,cancel=false){
   if(!gesture||gesture.id!==e.pointerId)return;const g=gesture;gesture=null;viewport.classList.remove('is-dragging');
   if(g.axis||g.wasMoving)suppressUntil=performance.now()+700;
   if(g.axis==='x'&&!cancel){const velocity=releaseVelocity(g.samples,e.timeStamp);if(reduced.matches){const d=motion.position-g.position;motion.snap(Math.abs(d)>.18&&Math.abs(d)<.5?Math.round(g.position)+Math.sign(d):Math.round(motion.position),true);}else motion.release(velocity);}else motion.snap(Math.round(motion.position),reduced.matches);
   if(viewport.hasPointerCapture(e.pointerId))viewport.releasePointerCapture(e.pointerId);schedule();
  }
  viewport.addEventListener('pointerup',e=>finish(e));viewport.addEventListener('pointercancel',e=>finish(e,true));
  viewport.addEventListener('lostpointercapture',e=>{if(e.target===viewport)finish(e,true);});
  viewport.addEventListener('click',e=>{if(e.detail>0&&(performance.now()<suppressUntil||motion.phase!=='idle')){e.preventDefault();e.stopPropagation();}},true);
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

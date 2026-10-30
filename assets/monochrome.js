/* Progressive theme composition: original nodes and their interactive state survive. */
(()=>{
const root=document.documentElement, moved=[],wrappers=[],active=new Set();
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const light=matchMedia('(pointer: coarse)').matches||(navigator.hardwareConcurrency||8)<=4;
let observer;
function cancel(){active.forEach(a=>a.cancel());active.clear();}
function animate(el,frames,options={}){
 if(root.dataset.theme!=='monochrome'||reduced.matches||!el?.animate)return;
 const a=el.animate(frames,{duration:light?300:650,easing:'cubic-bezier(.2,.7,.2,1)',...options});
 active.add(a);a.finished.catch(()=>{}).finally(()=>active.delete(a));
}
function group(parent,nodes,name){
 const wrap=document.createElement('div');wrap.className=name;parent.append(wrap);wrappers.push(wrap);
 nodes.forEach(n=>{const marker=document.createComment('theme-position');n.before(marker);moved.push([n,marker]);wrap.append(n);});
}
function compose(){
 if(wrappers.length)return;
 const hero=document.querySelector('.hero');
 if(hero){const nodes=[...hero.children];group(hero,nodes.filter(n=>n.matches('.hero-title,.hero-tag')),'mono-statement');group(hero,nodes.filter(n=>!n.matches('.hero-title,.hero-tag')),'mono-context');}
 if(document.body.dataset.page==='course')document.querySelectorAll('.practical').forEach(p=>{const nodes=[...p.children];group(p,nodes.filter(n=>n.matches('.story,.plate')),'mono-reading');group(p,nodes.filter(n=>!n.matches('.story,.plate')),'mono-itinerary');});
}
function restore(){moved.forEach(([n,m])=>m.replaceWith(n));moved.length=0;wrappers.forEach(w=>w.remove());wrappers.length=0;}
const control=document.createElement('label');control.className='theme-switch';control.append(document.createTextNode('デザイン '));
const select=document.createElement('select');select.setAttribute('aria-label','サイトのデザイン');
[['traditional','Traditional'],['monochrome','Monochrome']].forEach(([value,text])=>{const o=document.createElement('option');o.value=value;o.textContent=text;select.append(o);});control.append(select);
const bar=document.querySelector('.topbar-inner');bar?.insertBefore(control,bar.querySelector('.hamburger'));
function apply(theme,save=false){cancel();root.dataset.theme=theme;select.value=theme;if(theme==='monochrome')compose();else restore();if(save)try{localStorage.setItem('kuranpo-design',theme);}catch(e){}}
apply(root.dataset.theme==='traditional'?'traditional':'monochrome');
select.addEventListener('change',()=>apply(select.value,true));
addEventListener('storage',e=>{if(e.key==='kuranpo-design')apply(e.newValue==='traditional'?'traditional':'monochrome');});
reduced.addEventListener?.('change',()=>{if(reduced.matches){cancel();observer?.disconnect();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel();});
document.addEventListener('focusin',e=>active.forEach(a=>{if(a.effect?.target?.contains(e.target))a.cancel();}));
const hero=document.querySelector('.hero-tag');animate(hero,[{transform:'translateY(24px)',opacity:.3},{transform:'none',opacity:1}],{duration:light?450:900});
document.querySelectorAll('.hero-title,.hero-en,.hero-yomi,.hero-foot').forEach((e,i)=>animate(e,[{transform:'translateY(14px)',opacity:.4},{transform:'none',opacity:1}],{delay:light?0:i*90}));
if('IntersectionObserver'in window&&!reduced.matches){observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{if(!isIntersecting)return;observer.unobserve(target);animate(target,[{transform:'translateY(20px)',opacity:.4},{transform:'none',opacity:1}]);}),{threshold:.08});document.querySelectorAll('.pick,.choose-q,.read>h2,.read-list li,.plate,.term,.fw-item,.quiz-cat,.section-head').forEach(e=>observer.observe(e));}
const progress=document.createElement('div');progress.className='mono-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);let pending=false;
function update(){pending=false;const total=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${total>0?Math.max(0,Math.min(1,scrollY/total)):0})`;}
addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(update);}},{passive:true});addEventListener('resize',update);update();
document.querySelector('.choose')?.addEventListener('click',e=>{if(e.target.closest('.modes button,.opts button'))requestAnimationFrame(()=>animate(document.getElementById('routes'),[{opacity:.45,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:220}));});
})();

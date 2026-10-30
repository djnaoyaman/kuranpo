/* Progressive theme composition: original nodes and their interactive state survive. */
(()=>{
const root=document.documentElement, moved=[],wrappers=[],active=new Set();
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const light=matchMedia('(pointer: coarse)').matches||(navigator.hardwareConcurrency||8)<=4;
let observer;
let scene;
const selectedBMarkup="<section class=\"type-hero\"><span class=\"tiny top-note\">鎌倉散歩の<br>編集ガイド</span><h1><span>鎌倉を</span><span>歩く。</span><span>読む、</span><span>確かめる。</span></h1><p class=\"type-intro\">出発点から解散点まで。<br>道と歴史がつながる、散歩の設計図。</p><a class=\"type-go\" href=\"#chapters\">今日の一本へ <b>↘</b></a></section><section class=\"type-statement\"><span>01 / THE IDEA</span><h2>道の数だけ、<br><i>見つけたい</i><br>物語がある。</h2><div><p>鎌倉市内には、およそ150〜160の神社仏閣があります。その4分の3ほどを、出発点と解散点を決めた1〜3時間の散歩コースに収めました。エリアごとのコースに宗教・人物・年表という3つの軸を重ね、歩く距離も書き添えています。あとは、今日歩く一本を選ぶだけです。</p></div></section><section class=\"type-work\"><div class=\"section-title\"><span>02 / SELECTED WALKS</span><h2>Walk 01—67</h2></div><div class=\"orbit\"><a class=\"feature\" href=\"knowledge/c1.html\"><img src=\"img/photo/c1-zeniarai.jpg\" alt=\"源氏山・銭洗弁天エリア\" loading=\"lazy\"><div><span>C1</span><h3>源氏山・銭洗弁天エリア</h3><p>2時間 / 徒歩約4.0km</p><b>↗</b></div></a><a class=\"feature\" href=\"knowledge/c10.html\"><img src=\"img/photo/c10-daichoji.jpg\" alt=\"今泉・岩瀬エリア\" loading=\"lazy\"><div><span>C10</span><h3>今泉・岩瀬エリア</h3><p>コースの詳細を読む</p><b>↗</b></div></a><a class=\"feature\" href=\"knowledge/c13.html\"><img src=\"img/photo/c13-seirenji-hondo.jpg\" alt=\"深沢エリア① 手広・寺分\" loading=\"lazy\"><div><span>C13</span><h3>深沢エリア① 手広・寺分</h3><p>コースの詳細を読む</p><b>↗</b></div></a><a class=\"feature\" href=\"knowledge/ti4.html\"><img src=\"img/photo/ti4-jorakuji-sakura.jpg\" alt=\"時代から、鎌倉を歩く\" loading=\"lazy\"><div><span>TI4</span><h3>時代から、鎌倉を歩く</h3><p>常楽寺の風景から</p><b>↗</b></div></a></div></section><div class=\"b-photo-credits\"><details><summary>写真・資料の出典</summary><figcaption><span class=\"pl-cap\">2019年に撮られた、銭洗弁財天の鳥居の列です。</span><span class=\"pl-cr\">撮影：Ethan Doyle White（<a href=\"https://creativecommons.org/licenses/by-sa/4.0/deed.ja\" target=\"_blank\" rel=\"noopener\">CC BY-SA 4.0</a>）。ウィキメディア・コモンズ。<a href=\"https://commons.wikimedia.org/wiki/File:Row_of_Timber_Torii_at_the_Zeniarai_Benzaiten_Shrine.jpg\" target=\"_blank\" rel=\"noopener\">ウィキメディア・コモンズで見る</a></span></figcaption><figcaption><span class=\"pl-cap\">2016年に撮られた、大長寺の本堂です。</span><span class=\"pl-cr\">撮影：Twkz0731（<a href=\"https://creativecommons.org/licenses/by-sa/4.0/deed.ja\" target=\"_blank\" rel=\"noopener\">CC BY-SA 4.0</a>）。ウィキメディア・コモンズ。<a href=\"https://commons.wikimedia.org/wiki/File:Daich%C5%8D-ji_Iwase_Kamakura,_Main_hall_(2016-10-31).jpg\" target=\"_blank\" rel=\"noopener\">ウィキメディア・コモンズで見る</a></span></figcaption><figcaption><span class=\"pl-cap\">2005年に撮られた、青蓮寺の本堂です。</span><span class=\"pl-cr\">撮影：kamakura（<a href=\"https://creativecommons.org/licenses/by-sa/3.0/deed.ja\" target=\"_blank\" rel=\"noopener\">CC BY-SA 3.0</a>）。ウィキメディア・コモンズ。<a href=\"https://commons.wikimedia.org/wiki/File:Kusaridaishi01.jpg\" target=\"_blank\" rel=\"noopener\">ウィキメディア・コモンズで見る</a></span></figcaption><figcaption><span class=\"pl-cap\">2015年、桜が咲く時期に撮られた、常楽寺の本堂です。</span><span class=\"pl-cr\">撮影：Twkz0731（<a href=\"https://creativecommons.org/licenses/by-sa/4.0/deed.ja\" target=\"_blank\" rel=\"noopener\">CC BY-SA 4.0</a>）。ウィキメディア・コモンズ。<a href=\"https://commons.wikimedia.org/wiki/File:J%C5%8Draku-ji_%C5%8Dfuna_Kamakura,_Main_hall_with_Sakura_(2015-03-31).jpg\" target=\"_blank\" rel=\"noopener\">ウィキメディア・コモンズで見る</a></span></figcaption></details></div>";
function cancel(){active.forEach(a=>a.cancel());active.clear();}
function animate(el,frames,options={}){
 if(root.dataset.theme!=='monochrome'||reduced.matches||!el?.animate)return;
 const a=el.animate(frames,{duration:light?300:650,easing:'cubic-bezier(.2,.7,.2,1)',fill:'backwards',...options});
 active.add(a);a.finished.catch(()=>{}).finally(()=>active.delete(a));
}
function group(parent,nodes,name){
 const wrap=document.createElement('div');wrap.className=name;parent.append(wrap);wrappers.push(wrap);
 nodes.forEach(n=>{const marker=document.createComment('theme-position');n.before(marker);moved.push([n,marker]);wrap.append(n);});
}
function compose(){
 if(wrappers.length)return;
 if(document.body.dataset.page==='index'){scene=document.createElement('div');scene.className='b-scene';scene.innerHTML=selectedBMarkup;document.querySelector('.hero').before(scene);}
 const hero=document.querySelector('.hero');
 if(hero){const nodes=[...hero.children];group(hero,nodes.filter(n=>n.matches('.hero-title,.hero-tag')),'mono-statement');group(hero,nodes.filter(n=>!n.matches('.hero-title,.hero-tag')),'mono-context');}
 if(document.body.dataset.page==='course')document.querySelectorAll('.practical').forEach(p=>{const nodes=[...p.children];group(p,nodes.filter(n=>n.matches('.plate')).concat(nodes.filter(n=>n.matches('.story'))),'mono-reading');group(p,nodes.filter(n=>!n.matches('.story,.plate')),'mono-itinerary');});
}
function restore(){scene?.remove();scene=null;moved.forEach(([n,m])=>m.replaceWith(n));moved.length=0;wrappers.forEach(w=>w.remove());wrappers.length=0;}
const control=document.createElement('label');control.className='theme-switch';control.append(document.createTextNode('デザイン '));
const select=document.createElement('select');select.setAttribute('aria-label','サイトのデザイン');
[['traditional','Traditional'],['monochrome','Monochrome']].forEach(([value,text])=>{const o=document.createElement('option');o.value=value;o.textContent=text;select.append(o);});control.append(select);
const bar=document.querySelector('.topbar-inner');bar?.insertBefore(control,bar.querySelector('.hamburger'));
function apply(theme,save=false){cancel();root.dataset.theme=theme;select.value=theme;if(theme==='monochrome'){compose();startMotion();}else restore();if(save)try{localStorage.setItem('kuranpo-design',theme);}catch(e){}}
apply(root.dataset.theme==='traditional'?'traditional':'monochrome');
select.addEventListener('change',()=>apply(select.value,true));
addEventListener('storage',e=>{if(e.key==='kuranpo-design')apply(e.newValue==='traditional'?'traditional':'monochrome');});
reduced.addEventListener?.('change',()=>{if(reduced.matches){cancel();observer?.disconnect();scene?.querySelectorAll('img').forEach(e=>e.style.translate='');}else startMotion();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel();});
document.addEventListener('focusin',e=>active.forEach(a=>{if(a.effect?.target?.contains(e.target))a.cancel();}));
function startMotion(){
 observer?.disconnect();
 if(root.dataset.theme!=='monochrome'||reduced.matches)return;
 const lines=document.querySelectorAll('.b-scene .type-hero h1 span');
 lines.forEach((e,i)=>animate(e,[{transform:'translateY(65%)',clipPath:'inset(0 0 100% 0)',opacity:.25},{transform:'none',clipPath:'inset(0 0 0 0)',opacity:1}],{duration:light?750:1200,delay:i*(light?100:160),easing:'cubic-bezier(.16,1,.3,1)'}));
 document.querySelectorAll('.b-scene .top-note,.b-scene .type-intro,.b-scene .type-go').forEach((e,i)=>animate(e,[{transform:'translateY(20px)',opacity:0},{transform:'none',opacity:1}],{duration:650,delay:light?350:650+i*100}));
 if(!lines.length)document.querySelectorAll('header.site h1,.kn-hero h1').forEach(e=>animate(e,[{clipPath:'inset(0 0 100% 0)',transform:'translateY(30px)'},{clipPath:'inset(0)',transform:'none'}],{duration:light?650:1100}));
 if('IntersectionObserver'in window){observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{
 if(!isIntersecting)return;observer.unobserve(target);
 if(target.matches('.b-scene .feature')){
 const i=[...target.parentElement.children].indexOf(target);animate(target.querySelector('img'),[{transform:'translateY(70px) scale(.82)',clipPath:'inset(12% 8% 12% 8%)',opacity:.2},{transform:'none',clipPath:'inset(0)',opacity:1}],{duration:light?650:1100,delay:i*(light?65:120)});
 }else animate(target,[{transform:'translateY(35px)',opacity:.2},{transform:'none',opacity:1}],{duration:light?500:850});
 }),{threshold:.12});document.querySelectorAll('.b-scene .type-statement h2,.b-scene .type-statement>div,.b-scene .section-title,.b-scene .feature,.pick,.choose-q,.read>h2,.read-list li,.plate,.term,.fw-item,.quiz-cat,.section-head').forEach(e=>observer.observe(e));}
}
const progress=document.createElement('div');progress.className='mono-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);let pending=false;
function update(){pending=false;const total=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${total>0?Math.max(0,Math.min(1,scrollY/total)):0})`;if(scene&&!reduced.matches&&!light){const orbit=scene.querySelector('.orbit'),r=orbit.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight){const t=Math.max(-1,Math.min(1,(innerHeight/2-r.top-r.height/2)/innerHeight));orbit.querySelectorAll('img').forEach((e,i)=>e.style.translate=`0 ${t*(i%2?28:-28)}px`);}}}
addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(update);}},{passive:true});addEventListener('resize',update);update();
document.querySelector('.choose')?.addEventListener('click',e=>{if(e.target.closest('.modes button,.opts button'))requestAnimationFrame(()=>animate(document.getElementById('routes'),[{opacity:.45,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:220}));});
})();

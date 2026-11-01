/* Frame-rate independent carousel motion. Units: cards, seconds. No DOM dependency. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.WalkMotion=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 'use strict';
 const FRICTION=1.9,OMEGA=14,MAX_SPEED=18;
 const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
 class Motion {
  constructor(position=0){this.position=position;this.velocity=0;this.target=position;this.phase='idle';}
  stop(){this.velocity=0;this.phase='idle';this.target=this.position;}
  drag(position){this.position=position;this.velocity=0;this.target=position;this.phase='drag';}
  release(velocity,reduced=false){
   this.velocity=reduced?0:clamp(velocity,-MAX_SPEED,MAX_SPEED);
   this.target=Math.round(this.position+this.velocity/FRICTION);
   this.phase=Math.abs(this.velocity)>.45?'coast':'snap';
   if(reduced){this.target=Math.round(this.position);this.velocity=0;}
  }
  snap(target,reduced=false){this.target=target;this.phase='snap';if(reduced){this.position=target;this.velocity=0;this.phase='idle';}}
  step(seconds){
   if(this.phase==='idle'||this.phase==='drag')return false;
   // A suspended/slow frame must never teleport the track across several cards.
   const dt=clamp(seconds,0,.05);if(!dt)return true;
   if(this.phase==='coast'){
    const decay=Math.exp(-FRICTION*dt);this.position+=this.velocity*(1-decay)/FRICTION;this.velocity*=decay;
    if(Math.abs(this.velocity)<.45)this.phase='snap';
   }else{
    const x=this.position-this.target,c=this.velocity+OMEGA*x,e=Math.exp(-OMEGA*dt);
    const next=this.target+(x+c*dt)*e;
    this.position+=clamp(next-this.position,-MAX_SPEED*dt,MAX_SPEED*dt);
    this.velocity=clamp((this.velocity-OMEGA*c*dt)*e,-MAX_SPEED,MAX_SPEED);
    if(Math.abs(this.position-this.target)<.001&&Math.abs(this.velocity)<.015){this.position=this.target;this.velocity=0;this.phase='idle';}
   }
   return this.phase!=='idle';
  }
 }
 // Regress the last 100ms of actual pointer samples; a held finger has no fling.
 function releaseVelocity(samples,now){
  if(samples.length<2||now-samples[samples.length-1].t>100)return 0;
  const recent=samples.filter(s=>s.t>=now-100);if(recent.length<2)return 0;
  let mt=0,mp=0;for(const s of recent){mt+=s.t;mp+=s.p;}mt/=recent.length;mp/=recent.length;
  let covariance=0,variance=0;for(const s of recent){covariance+=(s.t-mt)*(s.p-mp);variance+=(s.t-mt)**2;}
  return variance?clamp(covariance/variance*1000,-MAX_SPEED,MAX_SPEED):0;
 }
 return {Motion,releaseVelocity,FRICTION,MAX_SPEED};
});

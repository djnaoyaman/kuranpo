/* Bounded, frame-rate independent carousel motion. Units: cards, seconds. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.WalkMotion=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 'use strict';
 const DURATION=.24,MAX_SPEED=18;
 const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
 class Motion {
  constructor(position=0){this.position=position;this.velocity=0;this.target=position;this.phase='idle';}
  stop(){this.velocity=0;this.phase='idle';this.target=this.position;}
  drag(position){this.position=position;this.velocity=0;this.target=position;this.phase='drag';}
  release(velocity,reduced=false,origin=Math.round(this.position)){
   const distance=this.position-origin;
   // A deliberate drag or short flick advances just one card, never a freewheel.
   const deliberate=Math.abs(distance)>=.18;
   const flick=Math.abs(distance)>=.06&&Math.abs(velocity)>=1.2&&distance*velocity>0;
   this.snap(origin+(deliberate||flick?Math.sign(distance):0),reduced);
  }
  snap(target,reduced=false){
   this.start=this.position;this.target=target;this.elapsed=0;this.duration=DURATION;this.velocity=0;
   this.phase=reduced||Math.abs(target-this.position)<.00001?'idle':'snap';
   if(this.phase==='idle')this.position=target;
  }
  step(seconds){
   if(this.phase!=='snap')return false;
   this.elapsed=Math.min(this.duration,this.elapsed+clamp(seconds,0,.05));
   const t=this.elapsed/this.duration,remaining=1-t;
   this.position=this.target+(this.start-this.target)*remaining**3;
   this.velocity=3*(this.target-this.start)*remaining**2/this.duration;
   if(this.elapsed===this.duration){this.position=this.target;this.velocity=0;this.phase='idle';}
   return this.phase!=='idle';
  }
 }
 // Only recent movement counts; holding a finger still does not trigger a flick.
 function releaseVelocity(samples,now){
  if(samples.length<2||now-samples[samples.length-1].t>100)return 0;
  const recent=samples.filter(s=>s.t>=now-100);if(recent.length<2)return 0;
  let mt=0,mp=0;for(const s of recent){mt+=s.t;mp+=s.p;}mt/=recent.length;mp/=recent.length;
  let covariance=0,variance=0;for(const s of recent){covariance+=(s.t-mt)*(s.p-mp);variance+=(s.t-mt)**2;}
  return variance?clamp(covariance/variance*1000,-MAX_SPEED,MAX_SPEED):0;
 }
 return {Motion,releaseVelocity,DURATION,MAX_SPEED};
});

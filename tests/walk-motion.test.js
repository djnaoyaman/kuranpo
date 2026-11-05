const assert=require('node:assert/strict');
const {Motion,releaseVelocity,DURATION}=require('../assets/walk-motion');
for(const hz of [30,60,120])for(const origin of [0,1,66])for(const direction of [-1,1])for(const speed of [.2,3,7,18,100]){
 const m=new Motion(origin);m.drag(origin+direction*.35);m.release(direction*speed,false,origin);
 assert.equal(m.target,origin+direction);let time=0,previous=m.position;
 while(m.phase!=='idle'&&time<1){m.step(1/hz);time+=1/hz;assert.ok(direction*(m.position-previous)>=-1e-9);assert.ok(Math.abs(m.position-origin)<=1);previous=m.position;}
 assert.equal(m.position,origin+direction);assert.ok(time<=DURATION+1/hz+.001);assert.equal(m.velocity,0);
}
for(const [distance,velocity,target] of [[.04,18,0],[.1,.2,0],[.1,4,1],[.1,-4,0],[.2,0,1],[-.2,0,-1]]){
 const m=new Motion(distance);m.release(velocity,false,0);assert.equal(m.target,target);
}
const reduced=new Motion(.7);reduced.release(18,true,0);assert.equal(reduced.position,1);assert.equal(reduced.phase,'idle');
const still=new Motion(4);still.snap(4);assert.equal(still.phase,'idle');
const m=new Motion(0);m.snap(1);m.step(.1);const before=m.position;m.stop();assert.equal(m.position,before);assert.equal(m.step(.1),false);m.drag(before-.2);m.release(-7,false,Math.round(before));for(let i=0;i<30;i++)m.step(1/60);assert.equal(m.phase,'idle');
m.snap(2);m.step(1);assert.ok(m.elapsed<=.05);m.snap(66,true);assert.equal(m.position,66);
assert.equal(releaseVelocity([{t:0,p:0},{t:25,p:.1},{t:50,p:.2},{t:75,p:.3}],75),4);
assert.equal(releaseVelocity([{t:0,p:0},{t:25,p:1}],200),0);
console.log('PASS: bounded one-card release, 30/60/120Hz, fast/slow/reverse, thresholds, interruption, long frames and reduced motion');

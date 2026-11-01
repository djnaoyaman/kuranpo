const assert=require('node:assert/strict'),fs=require('node:fs');const {Motion,releaseVelocity}=require('../assets/walk-motion');
const trajectories=[];
function simulate(hz,v){const m=new Motion(.35);m.release(v);const points=[];let time=0;for(let i=0;i<hz*20&&m.phase!=='idle';i++){m.step(1/hz);time+=1/hz;points.push({time,position:m.position,velocity:m.velocity,phase:m.phase});}return {hz,v,end:m.position,time,points};}
for(const hz of [30,60,120])for(const v of [3,7,14]){const r=simulate(hz,v);trajectories.push(r);assert.equal(r.end,{3:10,7:24,14:47}[v]);assert.ok(r.time>8&&r.time<12);for(let i=1;i<r.points.length;i++){const a=r.points[i-1],b=r.points[i];if(a.phase==='coast'){assert.ok(b.velocity<=a.velocity);assert.ok(b.position>=a.position);assert.ok(b.velocity>=0);}}}
for(const v of [3,7,14]){const r=trajectories.filter(r=>r.v===v);assert.ok(Math.max(...r.map(x=>x.time))-Math.min(...r.map(x=>x.time))<.06);}
const m=new Motion(66.7);m.release(14);m.step(1/60);const before=m.position;m.step(1);assert.ok(m.position-before<.9);m.stop();const caught=m.position;m.drag(caught-.5);assert.equal(m.position,caught-.5);m.release(-7);for(let i=0;i<2400;i++)m.step(1/120);assert.ok(m.position<caught-3);
assert.equal(releaseVelocity([{t:0,p:0},{t:25,p:.1},{t:50,p:.2},{t:75,p:.3}],75),4);assert.equal(releaseVelocity([{t:0,p:0},{t:25,p:1}],200),0);
const reduced=new Motion(.7);reduced.release(18,true);for(let i=0;i<200;i++)reduced.step(1/60);assert.equal(reduced.position,1);
fs.mkdirSync('test-results',{recursive:true});fs.writeFileSync('test-results/walk-motion-trajectories.json',JSON.stringify(trajectories,null,2));console.log('PASS: 30/60/120Hz trajectories, weak/medium/strong fling, regrab/reverse, long frame, stale velocity, reduced motion');

for(const [p,v]of [[.1,.5],[0,.46],[.99,-.46],[.35,14],[66.9,18]]){const m=new Motion(p);m.release(v);assert.equal(m.position,p);assert.equal(m.velocity,v);if(m.phase==='coast'){const start=m.position;m.step(.000001);assert.ok(Math.abs((m.position-start)/.000001-v)<.001);}for(let i=0;i<2400;i++){m.step(1/120);assert.ok(Number.isFinite(m.position));assert.ok(Number.isFinite(m.velocity));}assert.equal(m.phase,'idle');assert.equal(m.velocity,0);}

for(const p of [.1,.4,.6,.9])for(const v of [-1.1,-.7,.7,1.1]){const m=new Motion(p);m.release(v);assert.equal(m.phase,'snap');for(let i=0;i<180;i++)m.step(1/120);assert.equal(m.position,Math.round(p));}

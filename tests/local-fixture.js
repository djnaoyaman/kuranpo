// Browser QA is local-only, including tests that create their own contexts.
const base=require('@playwright/test');
const test=base.test.extend({browser:[async({browser},use)=>{
 const original=browser.newContext.bind(browser);
 browser.newContext=async options=>{const context=await original(options);await context.route('**/*',route=>{
  const url=new URL(route.request().url());return url.origin==='http://127.0.0.1:4173'?route.continue():route.abort();
 });return context;};
 try{await use(browser);}finally{browser.newContext=original;}
},{scope:'worker'}]});
module.exports={test,expect:base.expect};

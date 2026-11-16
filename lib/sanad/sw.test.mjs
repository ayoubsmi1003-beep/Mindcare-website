import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
test('worker never handles API, documents, cross-origin or mutation requests',async()=>{
  const handlers={}; let opened=0;
  vm.runInNewContext(await readFile(new URL('../../public/sanad/sw.js',import.meta.url),'utf8'),{self:{location:{origin:'https://demo.example'},addEventListener:(event,fn)=>handlers[event]=fn,clients:{claim:async()=>{}}},URL,caches:{open:async()=>{opened++;return{};}},fetch:async()=>new Response('network'),Response});
  for(const [url,method,mode] of [['/api/sanad/state','GET','cors'],['/api/sanad/document/id','GET','cors'],['/sanad/private','POST','navigate'],['https://other.example/sanad/icon.svg','GET','cors']]) {
    let intercepted=false;
    handlers.fetch({request:{url:new URL(url,'https://demo.example').href,method,mode},respondWith:()=>intercepted=true});
    assert.equal(intercepted,false,url);
  }
  assert.equal(opened,0);
});
test('authenticated navigation is network-only with generic offline fallback and no cache write',async()=>{
  const handlers={}; let writes=0;
  const fallback=new Response('offline exercises');
  vm.runInNewContext(await readFile(new URL('../../public/sanad/sw.js',import.meta.url),'utf8'),{self:{location:{origin:'https://demo.example'},addEventListener:(event,fn)=>handlers[event]=fn,clients:{claim:async()=>{}}},URL,caches:{match:async()=>fallback,open:async()=>({put:()=>writes++})},fetch:async()=>{throw new Error('offline');},Response});
  let result;
  handlers.fetch({request:{url:'https://demo.example/sanad',method:'GET',mode:'navigate'},respondWith:promise=>result=promise});
  assert.equal(await (await result).text(),'offline exercises');
  assert.equal(writes,0);
});

test('a visual update activates its public cache and removes only previous Sanad caches',async()=>{
  const handlers={},deleted=[];let assets=[],skips=0,claims=0,installed,activated;
  vm.runInNewContext(await readFile(new URL('../../public/sanad/sw.js',import.meta.url),'utf8'),{
    self:{location:{origin:'https://demo.example'},addEventListener:(event,fn)=>handlers[event]=fn,skipWaiting:async()=>{skips++;},clients:{claim:async()=>{claims++;}}},
    URL,caches:{open:async()=>({addAll:async list=>{assets=Array.from(list);}}),keys:async()=>['sanad-public-v1','sanad-public-v2','sanad-public-v3','other-app-cache'],delete:async key=>{deleted.push(key);return true;}},fetch:async()=>new Response('network'),Response
  });
  handlers.install({waitUntil:promise=>installed=promise});await installed;
  assert.equal(skips,1);
  assert.ok(assets.length>0&&assets.every(path=>path.startsWith('/sanad/')&&!/garden|resource-night|api/.test(path)));
  handlers.activate({waitUntil:promise=>activated=promise});await activated;
  assert.deepEqual(deleted,['sanad-public-v1','sanad-public-v2']);assert.equal(claims,1);
});

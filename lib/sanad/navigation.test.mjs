import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readRoute,routeQuery,routeFor,activeTab,updateDirty} from './navigation.ts';
test('route round trips every preserved screen without private data in the URL',()=>{
 for(const screen of ['today','followup','journal','weekly','thought','chat','resources','space','checkin','treatment','appointments','messages','help','notifications']) {
  const route=routeFor(screen);assert.equal(readRoute(new URLSearchParams(routeQuery(route))).screen,screen);
 }
 assert.equal(routeQuery({screen:'resources',resource:'sleep'}),'view=studio&exercise=sleep');
 assert.equal(readRoute(new URLSearchParams('view=studio&exercise=sleep')).resource,'sleep');
});
test('unrecognized navigation and exercise inputs fail to safe known destinations',()=>{
 assert.equal(readRoute(new URLSearchParams('view=https://evil.test&section=journal')).screen,'today');
 assert.equal(readRoute(new URLSearchParams('view=studio&exercise=../../private')).resource,undefined);
 assert.equal(activeTab('weekly'),'resources');assert.equal(activeTab('messages'),'cabinet');
});
test('one clean form cannot erase another unsaved form and malformed events are ignored',()=>{const sources=new Set();assert.equal(updateDirty(sources,{source:'a',dirty:true}),true);assert.equal(updateDirty(sources,{source:'b',dirty:true}),true);assert.equal(updateDirty(sources,{source:'a',dirty:false}),true);assert.equal(updateDirty(sources,false),true);assert.equal(updateDirty(sources,null),true);assert.equal(updateDirty(sources,{source:'b',dirty:false}),false);});

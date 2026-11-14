import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {screens,screenForHash} from './prototype.mjs';
test('invalid or untrusted fragment resolves to the introductory screen',()=>{for(const hash of ['', '#unknown', '#<script>', '#../api/chat'])assert.equal(screenForHash(hash).id,'01-connexion');assert.equal(screenForHash('#07-arabe').id,'07-arabe');});
test('every separate view has a readable PNG and every navigation target exists',()=>{assert.equal(new Set(screens.map(s=>s.id)).size,8);for(const screen of screens){const png=readFileSync(new URL(screen.id+'.png',import.meta.url));assert.equal(png.subarray(1,4).toString(),'PNG');assert.ok(png.readUInt32BE(16)>=1024);assert.ok(png.readUInt32BE(20)>=1024);for(const [,target,x,y,w,h] of screen.links){assert.ok(screens.some(s=>s.id===target));assert.ok(x>=0&&y>=0&&w>0&&h>0&&x+w<=100&&y+h<=100);}}});

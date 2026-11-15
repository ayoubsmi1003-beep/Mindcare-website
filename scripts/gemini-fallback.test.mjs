import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
function load(file){const loaded={exports:{}};const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;new Function('require','module','exports',code)(id=>load('lib/'+id.replace('./','')+'.ts'),loaded,loaded.exports);return loaded.exports;}
const models=load('lib/chat-model.ts');
test('multiple Gemini models use an accurate common label',()=>assert.equal(models.PUBLIC_ASSISTANT_LABEL,'Gemini'));
test('fallback handles transient errors but never auth or invalid input',async()=>{
 const {generateGeminiReply}=load('lib/gemini-reply.ts');
 for(const status of [503,504,429]){const calls=[];const result=await generateGeminiReply(async(model)=>{calls.push(model);if(calls.length===1)throw Object.assign(new Error('private upstream detail'),{status});return 'genuine reply';});assert.equal(result.response,'genuine reply');assert.deepEqual(calls,['gemini-3.8-flash','gemini-3.5-flash']);}
 for(const status of [400,401,403,404]){let calls=0;await assert.rejects(generateGeminiReply(async()=>{calls++;throw Object.assign(new Error('do not retry'),{status});}));assert.equal(calls,1);}
});
test('failure diagnostics cannot include raw provider text or credentials',()=>{
 const {safeGeminiFailure}=load('lib/gemini-reply.ts');
 const result=safeGeminiFailure(Object.assign(new Error('SECRET raw request data'),{status:503}));assert.deepEqual(result,{code:'GEMINI_PROVIDER_UNAVAILABLE',providerStatus:503});assert.equal(JSON.stringify(result).includes('SECRET'),false);
});

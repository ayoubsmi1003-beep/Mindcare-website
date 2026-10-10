// Real production Next server and TLS sockets; no database or provider involved.
import {generateKeyPairSync,createHmac,randomBytes,X509Certificate} from 'node:crypto';
import {mkdtempSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync,spawn} from 'node:child_process';
import {request} from 'node:https';
import assert from 'node:assert/strict';
const directory=mkdtempSync(join(tmpdir(),'mindcare-edge-test-'));
const origin='https://localhost:7443',secret='synthetic-edge-tls-test-secret-000000000';
let child;
const evidence=[];
try{
 const {privateKey}=generateKeyPairSync('rsa',{modulusLength:2048});
 writeFileSync(join(directory,'key.pem'),privateKey.export({format:'pem',type:'pkcs8'}));
 writeFileSync(join(directory,'jwk.json'),JSON.stringify(privateKey.export({format:'jwk'})));
 execFileSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',`
  $ErrorActionPreference='Stop'; $rsa=[System.Security.Cryptography.RSACng]::new(); $certificate=$null
  try {
   $jwk=Get-Content -Raw (Join-Path $env:MINDCARE_TEST_TLS_TMP 'jwk.json') | ConvertFrom-Json
   function Decode([string]$value){$value=$value.Replace('-','+').Replace('_','/');$value=$value.PadRight($value.Length+(4-$value.Length%4)%4,'=');return ,([Convert]::FromBase64String($value))}
   $parameters=[System.Security.Cryptography.RSAParameters]::new(); $parameters.Modulus=Decode $jwk.n; $parameters.Exponent=Decode $jwk.e; $parameters.D=Decode $jwk.d; $parameters.P=Decode $jwk.p; $parameters.Q=Decode $jwk.q; $parameters.DP=Decode $jwk.dp; $parameters.DQ=Decode $jwk.dq; $parameters.InverseQ=Decode $jwk.qi; $rsa.ImportParameters($parameters)
   $request=[System.Security.Cryptography.X509Certificates.CertificateRequest]::new('CN=localhost',$rsa,[System.Security.Cryptography.HashAlgorithmName]::SHA256,[System.Security.Cryptography.RSASignaturePadding]::Pkcs1)
   $san=[System.Security.Cryptography.X509Certificates.SubjectAlternativeNameBuilder]::new();$san.AddDnsName('localhost');$request.CertificateExtensions.Add($san.Build())
   $certificate=$request.CreateSelfSigned([DateTimeOffset]::Now.AddMinutes(-5),[DateTimeOffset]::Now.AddDays(1))
   [IO.File]::WriteAllBytes((Join-Path $env:MINDCARE_TEST_TLS_TMP 'cert.der'),$certificate.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Cert))
  } finally {if($certificate){$certificate.Dispose()};$rsa.Dispose()}
 `],{env:{...process.env,MINDCARE_TEST_TLS_TMP:directory},windowsHide:true,stdio:'pipe',timeout:15000});
 const ca=new X509Certificate(readFileSync(join(directory,'cert.der'))).toString();writeFileSync(join(directory,'cert.pem'),ca);
 child=spawn(process.execPath,['scripts/serve-clinic-edge.mjs'],{env:{...process.env,MINDCARE_PUBLIC_ORIGIN:origin,MINDCARE_EDGE_RESIDENCY_APPROVED:'1',MINDCARE_CLINIC_BRIDGE_SECRET:secret,MINDCARE_EDGE_TLS_KEY_PATH:join(directory,'key.pem'),MINDCARE_EDGE_TLS_CERT_PATH:join(directory,'cert.pem'),MINDCARE_EDGE_BIND:'127.0.0.1'},windowsHide:true,stdio:['ignore','pipe','pipe']});
 let logs='';child.stdout.on('data',chunk=>{logs+=String(chunk)});child.stderr.on('data',chunk=>{logs+=String(chunk)});
 async function call(path,body,headers={},trusted=true){return new Promise((resolve,reject)=>{
  const req=request(origin+path,{ca:trusted?ca:undefined,family:4,servername:'localhost',method:body===undefined?'GET':'POST',headers:{...(body===undefined?{}:{'content-type':'application/json'}),...headers}},res=>{
   let text='';res.on('data',chunk=>{text+=chunk});res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body:text}));res.on('error',reject);
  });req.setTimeout(10000,()=>req.destroy(new Error('TEST_TIMEOUT')));req.on('error',reject);req.end(body);
 });}
 let ready=false;for(let attempt=0;attempt<60;attempt++){if(child.exitCode!==null)throw new Error('EDGE_START_FAILED: '+logs);try{if((await call('/booking')).status===200){ready=true;break;}}catch{}await new Promise(resolve=>setTimeout(resolve,200));}assert(ready);
 const mark=name=>evidence.push({check:name,result:'PASS'});
 await assert.rejects(call('/booking',undefined,{},false),/certificate|self.signed/i);mark('normal TLS rejects untrusted certificate');
 const page=await call('/booking');assert.equal(page.status,200);assert(!page.headers['content-security-policy'].includes('unsafe-eval'));mark('production booking page with trusted TLS and CSP');
 assert.equal((await call('/booking',undefined,{host:'attacker.invalid'})).status,403);mark('wrong Host rejected');
 assert.equal((await call('/api/booking',JSON.stringify({op:'availability',date:'2030-01-01'}))).status,403);mark('missing browser Origin rejected');
 assert.equal((await call('/api/booking',JSON.stringify({op:'availability',date:'2030-01-01'}),{origin})).status,503);mark('offline clinic cannot accept a request');
 const sign=body=>{const time=String(Date.now()),nonce=randomBytes(16).toString('hex');return {'x-clinic-time':time,'x-clinic-nonce':nonce,'x-clinic-signature':createHmac('sha256',secret).update(`POST\n/api/clinic-bridge\n${time}\n${nonce}\n${body}`).digest('hex')};};
 const pollBody=JSON.stringify({op:'poll'}),signed=sign(pollBody);
 assert.equal((await call('/api/clinic-bridge',pollBody,signed)).status,200);
 assert.equal((await call('/api/clinic-bridge',pollBody,signed)).status,401);mark('signed outbound poll accepted and replay rejected');
 const publicPromise=call('/api/booking',JSON.stringify({op:'availability',date:'2030-01-01'}),{origin});
 await new Promise(resolve=>setTimeout(resolve,100));
 const poll=JSON.parse((await call('/api/clinic-bridge',pollBody,sign(pollBody))).body);assert.equal(poll.jobs.length,1);
 const result=JSON.stringify({op:'result',id:poll.jobs[0].id,result:{ok:true,data:{date:'2030-01-01',timezone:'Africa/Algiers',observedAt:new Date().toISOString(),expiresAt:new Date(Date.now()+30000).toISOString(),slots:[]}}});
 assert.equal((await call('/api/clinic-bridge',result,sign(result))).status,200);assert.equal((await publicPromise).status,200);mark('real TLS broker request/poll/result round trip');
 let limited=false;for(let index=0;index<35;index++){
  const response=await call('/api/booking',JSON.stringify({op:'availability',date:'invalid'}),{origin,'x-clinic-client-ip':'spoof-'+index});if(response.status===429){limited=true;break;}
 }assert(limited);mark('socket address overrides spoofed IP for rate limiting');
 writeFileSync('tls-evidence.json',JSON.stringify(evidence,null,2));console.log(JSON.stringify(evidence));
}finally{
 if(child&&child.exitCode===null){child.kill();await new Promise(resolve=>{child.once('exit',resolve);setTimeout(resolve,3000)});}
 // Only the exact temporary directory created by this test, never a user path.
 rmSync(directory,{recursive:true,force:true});
}

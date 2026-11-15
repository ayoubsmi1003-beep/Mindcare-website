// Development-only disposable synthetic environment; no .env files are read.
import {execFileSync,spawn} from 'node:child_process';
import {randomBytes,randomUUID} from 'node:crypto';
import {fileURLToPath} from 'node:url';

if(!process.argv.includes('--synthetic') || process.env.VERCEL || process.env.VERCEL_ENV) {
  console.error('FAIL: local synthetic flag required, cloud environment refused');
  process.exit(1);
}
const root=fileURLToPath(new URL('../',import.meta.url));
const name=`sanad-browser-${randomUUID()}`;
const password=randomBytes(32).toString('hex');
const instance=randomUUID();
const port=43862;
const mode=process.argv.includes('--built')?'start':'dev';
let started=false,web;
function docker(...args){return execFileSync('docker',args,{encoding:'utf8',stdio:['ignore','pipe','pipe'],env:{...process.env,POSTGRES_PASSWORD:password}}).trim();}
function cleanup(){if(web&&!web.killed)web.kill();if(started){started=false;try{docker('rm','--force',name);}catch{console.error('FAIL: remove only the named local Sanad browser container');}}}
process.on('SIGINT',()=>{cleanup();process.exit(0);});
process.on('SIGTERM',()=>{cleanup();process.exit(0);});
process.on('exit',cleanup);
try{
  docker('image','inspect','postgres:16-alpine');
  docker('run','--detach','--name',name,'--env','POSTGRES_PASSWORD','--env','POSTGRES_DB=sanad_browser','--publish','127.0.0.1::5432','postgres:16-alpine');
  started=true;
  const databasePort=docker('port',name,'5432/tcp').split(':').at(-1);
  let ready=false;
  for(let attempt=0;attempt<60;attempt++){
    try{docker('exec',name,'pg_isready','-h','127.0.0.1','-U','postgres');ready=true;break;}
    catch{await new Promise(resolve=>setTimeout(resolve,250));}
  }
  if(!ready)throw new Error('UNAVAILABLE');
  const operatorEnv={...process.env,SANAD_MODE:'synthetic',SANAD_DEMO_INSTANCE_ID:instance,SANAD_ADMIN_DATABASE_URL:`postgresql://postgres:${password}@127.0.0.1:${databasePort}/sanad_browser`,SANAD_RUNTIME_PASSWORD:password};
  for(const operation of ['migrate','seed'])execFileSync(process.execPath,['scripts/sanad-db.mjs',operation,'--synthetic'],{cwd:root,env:operatorEnv,stdio:['ignore','pipe','pipe']});
  const runtimeEnv={...process.env,SANAD_MODE:'synthetic',SANAD_DEMO_INSTANCE_ID:instance,SANAD_DATABASE_URL:`postgresql://sanad_runtime:${password}@127.0.0.1:${databasePort}/sanad_browser`,SANAD_PATIENT_PROVIDER:'scenario',NEXT_TELEMETRY_DISABLED:'1'};
  delete runtimeEnv.SANAD_ADMIN_DATABASE_URL;
  delete runtimeEnv.SANAD_RUNTIME_PASSWORD;
  console.log(`PASS: dedicated synthetic database prepared; local URL http://${mode==='start'?'localhost':'127.0.0.1'}:${port}/sanad`);
  web=spawn(process.execPath,['node_modules/next/dist/bin/next',mode,'--hostname','127.0.0.1','--port',String(port)],{cwd:root,env:runtimeEnv,stdio:['inherit','inherit','inherit'],windowsHide:true});
  const result=await new Promise(resolve=>{web.once('exit',code=>resolve(code??1));web.once('error',()=>resolve(1));});
  process.exitCode=result;
}catch{
  console.error('FAIL: local synthetic setup unavailable; no credentials logged');
  process.exitCode=1;
}finally{cleanup();}

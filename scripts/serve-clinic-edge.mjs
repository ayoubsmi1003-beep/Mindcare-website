// Clinic-owned public website only. Never run this in the doctor application.
import {createServer} from 'node:https';
import {readFileSync} from 'node:fs';
import next from 'next';
async function main(){
 const origin=new URL(process.env.MINDCARE_PUBLIC_ORIGIN??'');
 if(origin.protocol!=='https:'||origin.origin!==process.env.MINDCARE_PUBLIC_ORIGIN||process.env.MINDCARE_EDGE_RESIDENCY_APPROVED!=='1'||process.env.NODE_TLS_REJECT_UNAUTHORIZED==='0')throw new Error('CONFIGURATION');
 const keyPath=process.env.MINDCARE_EDGE_TLS_KEY_PATH,certificatePath=process.env.MINDCARE_EDGE_TLS_CERT_PATH;
 if(!keyPath||!certificatePath||(process.env.MINDCARE_CLINIC_BRIDGE_SECRET??'').length<32)throw new Error('CONFIGURATION');
 process.env.NODE_ENV='production';process.env.NEXT_TELEMETRY_DISABLED='1';process.env.MINDCARE_TRUST_EDGE_PROXY='1';
 const port=Number(origin.port||443),hostname=process.env.MINDCARE_EDGE_BIND??'127.0.0.1';
 const key=readFileSync(keyPath),cert=readFileSync(certificatePath);
 const app=next({dev:false,hostname,port});await app.prepare();const handle=app.getRequestHandler();
 const server=createServer({key,cert,minVersion:'TLSv1.2',maxHeaderSize:8192},(request,response)=>{
  if(request.headers.host!==origin.host){response.writeHead(403);response.end();return;}
  // Replace spoofable headers at the actual TLS socket boundary.
  request.headers['x-clinic-client-ip']=request.socket.remoteAddress??'unknown';
  request.headers['x-forwarded-proto']='https';
  void handle(request,response).catch(()=>{if(!response.headersSent)response.writeHead(503);response.end();});
 });
 server.requestTimeout=15000;server.headersTimeout=5000;server.keepAliveTimeout=5000;server.maxRequestsPerSocket=64;server.maxConnections=200;
 server.on('tlsClientError',()=>{});server.on('error',()=>{console.error('EDGE_LISTENER_UNAVAILABLE');process.exitCode=1;});
 server.listen(port,hostname,()=>console.log('Clinic edge HTTPS listener ready'));
 const shutdown=()=>server.close(()=>process.exit(0));process.once('SIGINT',shutdown);process.once('SIGTERM',shutdown);
}
main().catch(()=>{console.error('EDGE_CONFIGURATION_OR_BUILD_REQUIRED');process.exitCode=1;});

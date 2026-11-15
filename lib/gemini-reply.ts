import { PUBLIC_ASSISTANT_MODEL, PUBLIC_ASSISTANT_FALLBACK } from './chat-model';
function providerStatus(error:unknown):number|null{
 const value=error&&typeof error==='object'&&'status' in error?error.status:undefined;
 return typeof value==='number'&&Number.isInteger(value)&&value>=100&&value<=599?value:null;
}
function timedOut(error:unknown){return error instanceof Error&&['AbortError','TimeoutError'].includes(error.name);}
export function safeGeminiFailure(error:unknown){
 const status=providerStatus(error);
 return {code:timedOut(error)?'GEMINI_TIMEOUT':status===429?'GEMINI_CAPACITY':status===503||status===504?'GEMINI_PROVIDER_UNAVAILABLE':status===401||status===403?'GEMINI_AUTH_FAILED':status===400||status===404?'GEMINI_REQUEST_REJECTED':'GEMINI_REQUEST_FAILED',providerStatus:status};
}
export async function generateGeminiReply<T>(generate:(model:string,timeoutMs:number)=>Promise<T>){
 try{return {response:await generate(PUBLIC_ASSISTANT_MODEL,12000),model:PUBLIC_ASSISTANT_MODEL};}
 catch(error){if(!timedOut(error)&&![429,503,504].includes(providerStatus(error)??0))throw error;}
 return {response:await generate(PUBLIC_ASSISTANT_FALLBACK,12000),model:PUBLIC_ASSISTANT_FALLBACK};
}

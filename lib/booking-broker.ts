import {randomUUID} from 'node:crypto';
import {errorCode,sanitizePublicResult,type PublicBookingInput} from './booking-protocol';

export interface BookingJob {id:string;expiresAt:string;operation:PublicBookingInput}
interface WaitingJob {job:BookingJob;dispatched:boolean;timer:ReturnType<typeof setTimeout>;resolve:(value:unknown)=>void;reject:(reason:Error)=>void}
/** Volatile transport only. A reply is success only after the clinic commits. */
export class BookingBroker {
  private readonly waiting=new Map<string,WaitingJob>();
  private heartbeat=0;
  constructor(private readonly options:{capacity?:number;timeoutMs?:number}={}){}
  async request(operation:PublicBookingInput):Promise<unknown> {
    if(Date.now()-this.heartbeat>5_000) throw new Error('UNAVAILABLE');
    if(this.waiting.size>=(this.options.capacity??64)) throw new Error('CAPACITY');
    const id=randomUUID(),timeout=this.options.timeoutMs??8_000;
    return new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>{this.waiting.delete(id);reject(new Error('UNAVAILABLE'));},timeout);
      const job={id,expiresAt:new Date(Date.now()+timeout).toISOString(),operation};
      this.waiting.set(id,{job,timer,resolve,reject,dispatched:false});
    });
  }
  poll():BookingJob[] {
    this.heartbeat=Date.now();
    for(const item of this.waiting.values()) {
      if(!item.dispatched) {item.dispatched=true;return [item.job];}
    }
    return [];
  }
  complete(id:string,result:{ok:boolean;data?:unknown;error?:unknown}):boolean {
    const item=this.waiting.get(id);
    if(!item||new Date(item.job.expiresAt).getTime()<Date.now()) return false;
    const data=result.ok?sanitizePublicResult(item.job.operation,result.data):undefined;
    const error=result.ok?undefined:errorCode.parse(result.error);
    clearTimeout(item.timer);this.waiting.delete(id);
    if(result.ok) item.resolve(data);else item.reject(new Error(error));
    return true;
  }
  close():void {for(const item of this.waiting.values()){clearTimeout(item.timer);item.reject(new Error('UNAVAILABLE'));}this.waiting.clear();this.heartbeat=0;}
}

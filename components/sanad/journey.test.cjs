const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Module=require('node:module');
const ts=require('typescript');
const React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
const resolve=Module._resolveFilename;
Module._resolveFilename=function(request,...args){return resolve.call(this,request.startsWith('@/')?path.resolve(__dirname,'../..',request.slice(2)):request,...args);};
for(const extension of ['.ts','.tsx'])require.extensions[extension]=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText,filename);
const {Context,day}=require('./core.tsx');
const {translate}=require('../../lib/sanad/i18n/index.ts');
const {journeyCopy,journeyKeys}=require('../../lib/sanad/i18n/journey.ts');
const {CheckinFlow}=require('./CheckinFlow.tsx');
const {Journey}=require('./Journey.tsx');
const {CommandSchema}=require('../../lib/sanad/commands.ts');
const id='a5afefb1-f6d4-4c7e-b4fb-99efe8fe0c77';
const record=(kind,body,version=1)=>({id,kind,body,version,createdAt:day()+'T00:00:00+01:00',updatedAt:day()+'T00:00:00+01:00'});
function context(records=[],locale='fr'){
  const value={state:{profile:{id,displayName:'Synthetic',locale},records,shares:[]},locale,t:key=>translate(locale,key),go(){},busy:false,save:async()=>null,command:async()=>null};return value;
}
function nodes(node,predicate,result=[]){if(Array.isArray(node)){node.forEach(child=>nodes(child,predicate,result));return result;}if(!node||typeof node!=='object')return result;if(predicate(node))result.push(node);nodes(node.props?.children,predicate,result);return result;}
function text(node){if(Array.isArray(node))return node.map(text).join('');return typeof node==='string'||typeof node==='number'?String(node):node?.props?text(node.props.children):'';}
function button(tree,label){const matches=nodes(tree,node=>node.type==='button'&&text(node)===label);assert.equal(matches.length,1,label);return matches[0];}
function input(tree,label){const field=nodes(tree,node=>node.type==='label'&&text(node).startsWith(label))[0];assert.ok(field,label);return nodes(field,node=>node.type==='input'||node.type==='textarea'||node.type==='select')[0];}
// Runs the real component tree and event handlers; no DOM package or patient storage.
function runner(Component,props,value){
  const names=['useState','useRef','useEffect','useContext','useId'];const original=Object.fromEntries(names.map(name=>[name,React[name]]));const buckets=new Map();let current;let cursor;let currentPath;
  React.useState=initial=>{const bucket=current,index=cursor++;if(!bucket[index])bucket[index]={value:typeof initial==='function'?initial():initial};return [bucket[index].value,next=>{bucket[index].value=typeof next==='function'?next(bucket[index].value):next;}];};
  React.useRef=initial=>{const bucket=current,index=cursor++;if(!bucket[index])bucket[index]={value:{current:initial}};return bucket[index].value;};React.useContext=()=>value;React.useEffect=()=>{};React.useId=()=>currentPath+'-id';
  function expand(node,location){if(Array.isArray(node))return node.map((child,index)=>expand(child,location+'/'+(child?.key??index)));if(!node||typeof node!=='object')return node;if(typeof node.type==='function'){currentPath=location+'/'+node.type.name;current=buckets.get(currentPath)||[];buckets.set(currentPath,current);cursor=0;return expand(node.type(node.props),currentPath);}return {...node,props:{...node.props,children:expand(node.props?.children,location+'/children')}};}
  return {render:()=>expand(React.createElement(Component,props),'root'),close:()=>Object.assign(React,original)};
}
const tick=()=>new Promise(resolve=>setImmediate(resolve));
test('emotion-only checkins appear as categorical observations without invented connecting trend lines',()=>{
  const date=new Date(`${day()}T12:00:00+01:00`);date.setUTCDate(date.getUTCDate()-1);const yesterday=date.toISOString().slice(0,10);
  const value=context([record('checkin',{date:day(),emotion:'happy'}),{...record('checkin',{date:yesterday,emotion:'tired'}),id:'previous'}]);
  const run=runner(Journey,{section:'overview'},value);try{const tree=run.render();assert.equal(nodes(tree,node=>node.type==='circle').length,2);assert.equal(nodes(tree,node=>node.type==='line'&&node.props.className==='mc-chart-segment').length,0);}finally{run.close();}
});
test('journey and check-in render every section in FR/EN/AR with accessible factual charts',()=>{
  for(const locale of ['fr','en','ar']){
    for(const key of journeyKeys){const value=journeyCopy(locale,key);assert.ok(value.trim());if(locale==='ar')assert.match(value,/[\u0600-\u06ff]/);}
    for(const section of ['overview','journal','week']){const html=renderToStaticMarkup(React.createElement(Context.Provider,{value:context([],locale)},React.createElement(Journey,{section})));assert.doesNotMatch(html,/undefined|NaN/);assert.match(html,locale==='ar'?/dir="rtl"/:/dir="ltr"/);if(section==='overview'){assert.match(html,/<svg[^>]+role="img"/);assert.match(html,/<table>/);assert.equal((html.match(/scope="row"/g)||[]).length,7);assert.ok(html.includes(journeyCopy(locale,'noObservation')));}}
    const checkin=renderToStaticMarkup(React.createElement(Context.Provider,{value:context([],locale)},React.createElement(CheckinFlow)));assert.equal((checkin.match(/mc-emotion-face /g)||[]).length,6);assert.match(checkin,/aria-current="step"/);
  }
});
test('check-in steps never save, failed final save retains data, successful edits bind revision and preserve legacy fields',async()=>{
  const existing=record('checkin',{date:day(),mood:'mixed',effects:'legacy effects'},4);const value=context([existing]);const saves=[];let succeeds=false;
  value.save=async(kind,body,previous)=>{saves.push({kind,body,previous});return succeeds?{...existing,body,version:5}:null;};
  const run=runner(CheckinFlow,{},value);
  try{let tree=run.render();button(tree,'Triste').props.onClick();tree=run.render();button(tree,'Passer cette étape').props.onClick();tree=run.render();await nodes(tree,node=>node.type==='form')[0].props.onSubmit({preventDefault(){}});tree=run.render();assert.equal(saves.length,0);input(tree,'Une note pour vous').props.onChange({target:{value:'synthetic note'}});tree=run.render();await nodes(tree,node=>node.type==='form')[0].props.onSubmit({preventDefault(){}});tree=run.render();assert.equal(input(tree,'Une note pour vous').props.value,'synthetic note');assert.ok(text(tree).includes(journeyCopy('fr','saveFailed')));succeeds=true;await nodes(tree,node=>node.type==='form')[0].props.onSubmit({preventDefault(){}});assert.equal(saves[1].previous.version,4);assert.equal(saves[1].body.effects,'legacy effects');assert.equal(saves[1].body.emotion,'sad');assert.equal(CommandSchema.safeParse({action:'save',kind:'checkin',body:saves[1].body,id,expectedVersion:4,idempotencyKey:id}).success,true);assert.ok(text(run.render()).includes(journeyCopy('fr','saved')));}finally{run.close();}
});
test('a fresh check-in offers optional effects at stage three and saves that observation alone',async()=>{
  const value=context();const saves=[];value.save=async(kind,body,previous)=>{saves.push({kind,body,previous});return record(kind,body);};const run=runner(CheckinFlow,{},value);
  try{let tree=run.render();button(tree,'Passer cette étape').props.onClick();tree=run.render();button(tree,'Passer cette étape').props.onClick();tree=run.render();assert.equal(saves.length,0);input(tree,translate('fr','effects')).props.onChange({target:{value:'Synthetic effect observation'}});tree=run.render();await nodes(tree,node=>node.type==='form')[0].props.onSubmit({preventDefault(){}});assert.equal(saves.length,1);assert.equal(saves[0].previous,undefined);assert.deepEqual(saves[0].body,{date:day(),effects:'Synthetic effect observation'});assert.equal(CommandSchema.safeParse({action:'save',kind:'checkin',body:saves[0].body,idempotencyKey:id}).success,true);}finally{run.close();}
});
test('journal retains free text across format changes, saves guided drafts and preserves a failed edit',async()=>{
  const value=context();const saves=[];let succeeds=false;
  value.save=async(kind,body,previous)=>{saves.push({kind,body,previous});if(!succeeds)return null;const saved=record(kind,body,previous?previous.version+1:1);value.state.records=[saved];return saved;};
  const run=runner(Journey,{section:'journal'},value);
  try{let tree=run.render();button(tree,'Écrire une entrée').props.onClick();tree=run.render();input(tree,'Ce que vous souhaitez garder').props.onChange({target:{value:'free text preserved'}});tree=run.render();button(tree,'Avec des repères').props.onClick();tree=run.render();input(tree,'Ce dont j’avais besoin').props.onChange({target:{value:'repos'}});tree=run.render();button(tree,'Garder le brouillon').props.onClick();await tick();tree=run.render();assert.equal(input(tree,'Ce dont j’avais besoin').props.value,'repos');assert.ok(text(tree).includes(journeyCopy('fr','saveFailed')));succeeds=true;button(tree,'Garder le brouillon').props.onClick();await tick();tree=run.render();assert.equal(saves[1].body.text,'free text preserved');assert.equal(saves[1].body.need,'repos');assert.equal(saves[1].body.status,'draft');assert.equal(CommandSchema.safeParse({action:'save',kind:'journal',body:saves[1].body,idempotencyKey:id}).success,true);assert.equal(nodes(tree,node=>node.type==='button'&&text(node)==='Partager cette version').length,0);}finally{run.close();}
});
test('withdrawing older journal sharing targets its exact version',async()=>{
  const value=context([record('journal',{situation:'legacy',emotion:'',need:'',helped:''},3)]);value.state.shares=[{id:'share',recordId:id,recordVersion:1,sharedAt:day()+'T00:00:00+01:00',revokedAt:null}];const commands=[];value.command=async body=>{commands.push(body);return {};};const run=runner(Journey,{section:'journal'},value);
  try{const tree=run.render();await button(tree,'Retirer le partage · Version 1').props.onClick();assert.deepEqual(commands,[{action:'share',id,version:1,shared:false}]);}finally{run.close();}
});
test('chart windows keep unknown days as gaps and zero sleep remains a real point',()=>{
  const previous=new Date(`${day()}T12:00:00+01:00`);previous.setUTCDate(previous.getUTCDate()-2);const previousDate=previous.toISOString().slice(0,10);
  const value=context([record('checkin',{date:day(),mood:'calm',sleepHours:0,emotion:'happy',intensity:2}),{...record('checkin',{date:previousDate,mood:'mixed',sleepHours:8}),id:'older'}]);const run=runner(Journey,{section:'overview'},value);
  try{let tree=run.render();assert.equal(nodes(tree,node=>node.type==='circle').length,2);assert.equal(nodes(tree,node=>node.type==='line'&&node.props.className==='mc-chart-segment').length,0);input(tree,'Observations déclarées').props.onChange({target:{value:'sleepHours'}});tree=run.render();assert.equal(nodes(tree,node=>node.type==='circle').length,2);assert.ok(text(tree).includes('0 h'));assert.ok(text(tree).includes('Joyeux'));button(tree,'90 jours').props.onClick();tree=run.render();assert.equal(nodes(tree,node=>node.type==='th'&&node.props.scope==='row').length,90);}finally{run.close();}
});
test('rescheduling retains its date after failure and updates the existing activity after retry',async()=>{
  const activity=record('activity',{title:'Synthetic activity',date:day(),status:'planned',origin:'personal'},3);const value=context([activity]);const saves=[];let succeeds=false;value.save=async(kind,body,previous)=>{saves.push({kind,body,previous});return succeeds?{...activity,body,version:4}:null;};const run=runner(Journey,{section:'week'},value);
  try{let tree=run.render();button(tree,'Reporter').props.onClick();tree=run.render();let form=nodes(tree,node=>node.type==='form'&&node.props.className.includes('mc-defer'))[0];nodes(form,node=>node.type==='input')[0].props.onChange({target:{value:'2026-12-01'}});tree=run.render();form=nodes(tree,node=>node.type==='form'&&node.props.className.includes('mc-defer'))[0];await form.props.onSubmit({preventDefault(){}});tree=run.render();form=nodes(tree,node=>node.type==='form'&&node.props.className.includes('mc-defer'))[0];assert.equal(nodes(form,node=>node.type==='input')[0].props.value,'2026-12-01');succeeds=true;await form.props.onSubmit({preventDefault(){}});assert.equal(saves[1].previous.version,3);assert.equal(saves[1].body.status,'deferred');assert.equal(saves[1].body.date,'2026-12-01');assert.equal(nodes(run.render(),node=>node.type==='form'&&node.props.className.includes('mc-defer')).length,0);}finally{run.close();}
});
test('personal program saves real goals, reopens activities and routes weekly review to the same Studio worksheet',async()=>{
  const activity={...record('activity',{title:'Synthetic walk',date:day(),status:'completed',origin:'personal'}),id:'a5afefb1-f6d4-4c7e-b4fb-99efe8fe0c78'};const clinical={...record('prescribedGoal',{title:'Clinical read only',status:'active'}),id:'clinical'};const value=context([activity,clinical]);const saves=[],routes=[];value.go=screen=>routes.push(screen);value.save=async(kind,body,previous)=>{saves.push({kind,body,previous});return record(kind,body);};const run=runner(Journey,{section:'week'},value);
  try{let tree=run.render();input(tree,'Un petit objectif personnel').props.onChange({target:{value:'Own step'}});tree=run.render();await nodes(tree,node=>node.type==='form')[0].props.onSubmit({preventDefault(){}});tree=run.render();assert.equal(input(tree,'Un petit objectif personnel').props.value,'');assert.equal(saves[0].kind,'goal');assert.equal(saves[0].body.origin,'personal');button(tree,'Reprendre').props.onClick();await tick();assert.equal(saves[1].body.status,'planned');assert.equal(saves[1].previous.id,activity.id);button(tree,'Faire mon bilan de la semaine').props.onClick();assert.deepEqual(routes,['weekly']);assert.equal(saves.some(save=>save.kind==='weeklyReview'||save.previous?.id==='clinical'),false);}finally{run.close();}
});

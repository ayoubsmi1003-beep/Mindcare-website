const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Module=require('node:module');
const ts=require('typescript');
const React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');

// Compile only the owned TSX modules in memory; no build output or browser storage.
const resolve=Module._resolveFilename;
Module._resolveFilename=function(request,...args){return resolve.call(this,request.startsWith('@/')?path.resolve(__dirname,'../..',request.slice(2)):request,...args);};
for(const extension of ['.ts','.tsx']) require.extensions[extension]=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText,filename);
const {translate,translationKeys,locales}=require('../../lib/sanad/i18n/index.ts');
const {Context,day,ShareControl}=require('./core.tsx');
const tracking=require('./Tracking.tsx');
const spaces=require('./Spaces.tsx');
const {Resources,Exercise}=require('./Resources.tsx');
const {CommandSchema}=require('../../lib/sanad/commands.ts');
const {adherenceBody}=require('./adherence.ts');
const profile={id:'a5afefb1-f6d4-4c7e-b4fb-99efe8fe0c77',displayName:'Profil fictif',locale:'fr'};
function render(Component,locale='fr',records=[],busy=false){const value={state:{profile,records,shares:[]},locale,t:key=>translate(locale,key),go(){},busy,save:async()=>null,command:async()=>null,password:async()=>true,signOut:async()=>{},reload:async()=>{},setLocale(){}};return renderToStaticMarkup(React.createElement(Context.Provider,{value},React.createElement(Component)));}

test('every translation has French, English and Arabic content without fallback',()=>{
  assert.ok(translationKeys.length>180);
  for(const key of translationKeys)for(const locale of locales){const text=translate(locale,key);assert.equal(typeof text,'string',`${locale}:${key}`);assert.ok(text.trim().length,`${locale}:${key}`);assert.ok(!text.includes('undefined'),`${locale}:${key}`);if(locale==='ar')assert.match(text,/[\u0600-\u06ff]/,key);}
});
test('all patient screens render their empty and labelled states in three languages',()=>{
  const screens=[tracking.Checkin,tracking.Followup,tracking.Treatment,Resources,spaces.Chat,spaces.Appointments,spaces.Messages,spaces.Help,spaces.Settings];
  for(const locale of locales)for(const screen of screens){const html=render(screen,locale);assert.ok(html.length>150,`${locale}:${screen.name}`);assert.ok(!html.includes('undefined'),`${locale}:${screen.name}`);assert.ok(!html.includes('NaN'),`${locale}:${screen.name}`);}
  assert.match(render(spaces.Chat),/scénarisés/);
  assert.match(render(spaces.Messages),/Aucun message ne contacte le cabinet/);
  assert.match(render(spaces.Help),/Aucun numéro/);
  assert.match(render(tracking.Checkin),/<button[^>]+disabled=""/);
  assert.ok(!render(tracking.Treatment).includes('08:00'));
});
test('all resource IDs and new-entry payloads match the actual command boundary',()=>{
  const samples={checkin:{date:day(),sleepHours:0},journal:{situation:'un moment',emotion:'',need:'',helped:''},goal:{title:'un petit pas',origin:'personal',completed:false},activity:{title:'pause',date:day(),status:'deferred',origin:'personal'},weeklyReview:{week:day(),helped:'pause',nextStep:''},preparation:{questions:'une question',summary:''},message:{category:'administrative',text:'test',status:'draft',simulation:true},request:{category:'renewal',text:'test',status:'pending',simulation:true},preferences:{displayName:'test',locale:'ar',notifications:false,quietStart:'22:00',quietEnd:'08:00',memoryEnabled:false,closeScreenSafeText:true},memory:{text:'',enabled:false,deleted:true}};
  for(const [kind,body]of Object.entries(samples))assert.equal(CommandSchema.safeParse({action:'save',kind,body,idempotencyKey:profile.id}).success,true,kind);
  for(const resourceId of ['breathing','grounding','sleep','prepare'])for(const [kind,body]of [['favorite',{resourceId,active:true}],['exerciseProgress',{resourceId,seconds:12,completed:false}]])assert.equal(CommandSchema.safeParse({action:'save',kind,body,idempotencyKey:profile.id}).success,true,`${kind}:${resourceId}`);
});
test('sensitive UI uses password inputs and has no durable patient storage calls',()=>{
  const settings=render(spaces.Settings);assert.equal((settings.match(/type="password"/g)||[]).length,2);assert.match(settings,/autoComplete="current-password"/i);
  for(const filename of fs.readdirSync(__dirname).filter(name=>name.endsWith('.tsx'))){const source=fs.readFileSync(path.join(__dirname,filename),'utf8');assert.doesNotMatch(source,/localStorage|sessionStorage|dangerouslySetInnerHTML/,filename);}
});
test('treatment display never derives a schedule and separates validity from synchronization',()=>{
  const record={id:profile.id,kind:'treatment',version:1,createdAt:'2026-01-01T12:00:00Z',updatedAt:'2026-01-01T12:00:00Z',body:{name:'Traitement fictif',status:'active',shared:true,asNeeded:true,validFrom:'2000-01-01T00:00:00Z',validUntil:'2100-01-01T00:00:00Z',lastSyncedAt:'2020-01-01T00:00:00Z',remindersAuthorizedUntil:'2001-01-01T00:00:00Z'}};
  const html=render(tracking.Treatment,'fr',[record]);
  assert.match(html,/aucun horaire fixe/);assert.match(html,/Rappels suspendus/);assert.ok(!html.includes('Validité à confirmer'));assert.ok(!html.includes('08:00'));
  assert.ok(!render(tracking.Treatment,'fr',[{...record,body:{...record.body,status:'stopped'}}]).includes('Traitement fictif'));
  assert.ok(!render(tracking.Treatment,'fr',[{...record,body:{...record.body,shared:false}}]).includes('Traitement fictif'));
  const expired=render(tracking.Treatment,'fr',[{...record,body:{...record.body,validUntil:'2001-01-01T00:00:00Z'}}]);assert.match(expired,/Validité à confirmer/);assert.ok((expired.match(/disabled=""/g)||[]).length>=3);
});
test('editing a shared entry keeps the new revision private and explains older sharing',()=>{
  const record={id:profile.id,kind:'journal',body:{situation:'fictif',emotion:'',need:'',helped:''},version:2,createdAt:'2026-01-01T12:00:00Z',updatedAt:'2026-01-02T12:00:00Z'};
  const value={state:{profile,records:[record],shares:[{id:'test',recordId:record.id,recordVersion:1,sharedAt:'2026-01-01T12:00:00Z',revokedAt:null}]},t:key=>translate('fr',key),locale:'fr',busy:false,command:async()=>null,go(){}};
  const html=renderToStaticMarkup(React.createElement(Context.Provider,{value},React.createElement(ShareControl,{record})));
  assert.match(html,/Privé.*Version 2/);assert.match(html,/D’autres versions restent partagées/);assert.match(html,/Partager cette version/);
});
test('new declarations bind the authority version while corrections preserve their original reference',()=>{
  const treatment={id:profile.id,version:7};
  const fresh=adherenceBody(treatment,'taken','test','2026-11-15T08:00:00+01:00');
  assert.equal(fresh.treatmentVersion,7);
  assert.equal(CommandSchema.safeParse({action:'save',kind:'adherence',body:fresh,idempotencyKey:profile.id}).success,true);
  assert.equal(CommandSchema.safeParse({action:'save',kind:'adherence',body:{...fresh,treatmentVersion:undefined},idempotencyKey:profile.id}).success,false);
  const original={id:'a5afefb1-f6d4-4c7e-b4fb-99efe8fe0c78',kind:'adherence',version:3,body:{treatmentId:profile.id,treatmentVersion:2,scheduledAt:'2026-01-01T08:00:00+01:00',status:'forgotten',reason:'avant'},createdAt:'2026-01-01T12:00:00Z',updatedAt:'2026-01-01T12:00:00Z'};
  const changed=adherenceBody({id:original.id,version:99},'not_taken','précision corrigée','2026-11-15T12:00:00+01:00',original);
  assert.deepEqual(changed,{...original.body,status:'not_taken',reason:'précision corrigée'});
  assert.equal(CommandSchema.safeParse({action:'save',kind:'adherence',id:original.id,expectedVersion:3,body:changed,idempotencyKey:profile.id}).success,true);
  const unscheduled={...original,body:{treatmentId:profile.id,treatmentVersion:2,status:'taken'}};
  assert.ok(!Object.hasOwn(adherenceBody(treatment,'forgotten','',fresh.scheduledAt,unscheduled),'scheduledAt'));
});
test('stopped, revoked and absent treatments retain report history without revealing revoked content',()=>{
  const declaration={id:'a5afefb1-f6d4-4c7e-b4fb-99efe8fe0c78',kind:'adherence',version:1,body:{treatmentId:profile.id,treatmentVersion:2,status:'forgotten',reason:'raison fictive'},createdAt:'2026-01-01T12:00:00Z',updatedAt:'2026-01-01T12:00:00Z'};
  for(const records of [[declaration],[declaration,{id:profile.id,kind:'treatment',version:4,body:{shared:false,status:'active',name:'Nom révoqué',dose:'Dose révoquée'},createdAt:declaration.createdAt,updatedAt:declaration.updatedAt}],[declaration,{id:profile.id,kind:'treatment',version:4,body:{shared:true,status:'stopped',name:'Ancien traitement partagé'},createdAt:declaration.createdAt,updatedAt:declaration.updatedAt}]]) {
    const html=render(tracking.Treatment,'fr',records);
    assert.match(html,/raison fictive/);assert.match(html,/Oublié/);assert.match(html,/Modifier/);assert.match(html,new RegExp(profile.id));
    assert.doesNotMatch(html,/Nom révoqué|Dose révoquée|sn-dose-actions/);
  }
  const editor=render(()=>React.createElement(tracking.HistoricalCorrection,{record:declaration,onSaved(){}}));
  assert.match(editor,/sn-dose-actions/);assert.doesNotMatch(editor,/disabled=""/);assert.match(editor,/raison fictive/);
});
test('a mutation disables shared form controls and draft switches while chat cancellation stays available',()=>{
  for(const Component of [tracking.Checkin,spaces.Messages,spaces.Appointments,spaces.Settings]) {
    const busy=render(Component,'fr',[],true);
    const idle=render(Component);
    assert.match(busy,/<fieldset disabled=""/);
    assert.doesNotMatch(idle,/<fieldset disabled=""/);
  }
  const conversation={id:profile.id,kind:'conversation',version:1,body:{messages:[]},createdAt:'2026-01-01T12:00:00Z',updatedAt:'2026-01-01T12:00:00Z'};
  const chat=render(spaces.Chat,'fr',[conversation],true);
  assert.match(chat,/<textarea id="sn-chat-text" disabled=""/);
  assert.match(chat,/<fieldset disabled=""[^>]*><label class="sn-field"><span>Mes conversations/);
  assert.match(chat,/<button[^>]+disabled=""[^>]+aria-label="Nouvelle conversation"/);
  assert.match(chat,/<button type="button" class="sn-text-button">Annuler<\/button>/);
  const draft={...conversation,kind:'message',body:{category:'administrative',text:'brouillon fictif',status:'draft',simulation:true}};
  assert.match(render(spaces.Messages,'fr',[draft],true),/<button type="button" class="sn-text-button" disabled="">Modifier/);
});

function elements(node,predicate,result=[]) {
  if(!node||typeof node!=='object')return result;
  if(Array.isArray(node)){node.forEach(child=>elements(child,predicate,result));return result;}
  if(predicate(node))result.push(node);
  elements(node.props?.children,predicate,result);
  return result;
}
function button(tree,label){const matches=elements(tree,node=>node.type==='button'&&flatten(node.props.children).includes(label));assert.equal(matches.length,1,label);return matches[0];}
function flatten(node){if(Array.isArray(node))return node.map(flatten).join('');if(typeof node==='string'||typeof node==='number')return String(node);return node?.props?flatten(node.props.children):'';}

// Exercise the real component handlers and effects without adding a DOM dependency.
function hookRun(Component,props,context) {
  const originals={useState:React.useState,useRef:React.useRef,useEffect:React.useEffect,useContext:React.useContext};
  const slots=[];let cursor=0;let effects=[];
  React.useState=initial=>{const index=cursor++;if(!slots[index])slots[index]={value:typeof initial==='function'?initial():initial};return [slots[index].value,next=>{slots[index].value=typeof next==='function'?next(slots[index].value):next;}];};
  React.useRef=initial=>{const index=cursor++;if(!slots[index])slots[index]={value:{current:initial}};return slots[index].value;};
  React.useContext=()=>context;
  React.useEffect=(effect,deps)=>{const index=cursor++;const previous=slots[index];if(!previous||!deps||deps.some((value,i)=>!Object.is(value,previous.deps?.[i]))){effects.push(()=>{previous?.cleanup?.();slots[index]={deps,cleanup:effect()};});}};
  return {render(){cursor=0;effects=[];const tree=Component(props);effects.forEach(effect=>effect());return tree;},close(){slots.forEach(slot=>slot?.cleanup?.());Object.assign(React,originals);}};
}
test('a paused exercise can save again after resuming and updates the same session record',async()=>{
  const original={setInterval:global.setInterval,clearInterval:global.clearInterval,now:Date.now};let clock=100000;let tick;const saves=[];
  global.setInterval=callback=>{tick=callback;return 1;};global.clearInterval=()=>{tick=undefined;};Date.now=()=>clock;
  const resource={id:'breathing',title:'breathingTitle',category:'breathing',instructions:'breathingInstructions',seconds:180,art:'garden'};
  const context={t:key=>translate('fr',key),busy:false,save:async(kind,body,record)=>{saves.push({kind,body,record});return {id:profile.id,kind,body,version:saves.length,createdAt:'2026-01-01T12:00:00Z',updatedAt:'2026-01-01T12:00:00Z'};}};
  const runner=hookRun(Exercise,{resource,onBack(){}},context);
  try {
    let tree=runner.render();button(tree,'Commencer').props.onClick();tree=runner.render();clock+=2000;tick();tree=runner.render();button(tree,'Pause').props.onClick();tree=runner.render();
    await button(tree,'Garder cette séance').props.onClick();tree=runner.render();assert.equal(button(tree,'Enregistré dans votre espace.').props.disabled,true);
    button(tree,'Reprendre').props.onClick();tree=runner.render();clock+=3000;tick();tree=runner.render();button(tree,'Pause').props.onClick();tree=runner.render();
    assert.equal(button(tree,'Garder cette séance').props.disabled,false);
    await button(tree,'Garder cette séance').props.onClick();
    assert.deepEqual(saves.map(save=>save.body.seconds),[2,5]);assert.equal(saves[0].record,undefined);assert.equal(saves[1].record.id,profile.id);assert.equal(saves[1].record.version,1);
    assert.equal(CommandSchema.safeParse({action:'save',kind:saves[1].kind,id:profile.id,expectedVersion:1,body:saves[1].body,idempotencyKey:profile.id}).success,true);
  } finally {runner.close();global.setInterval=original.setInterval;global.clearInterval=original.clearInterval;Date.now=original.now;}
});
test('a delayed chat failure preserves its draft and the field is editable again afterward',async()=>{
  let finish;let cancelled=false;
  const context={state:{profile,records:[],shares:[]},t:key=>translate('fr',key),locale:'fr',busy:false,command:()=>{context.busy=true;return new Promise(resolve=>{finish=resolve;});},cancelCommand(){cancelled=true;}};
  const runner=hookRun(spaces.Chat,{},context);
  try {
    let tree=runner.render();let textarea=elements(tree,node=>node.type==='textarea')[0];
    textarea.props.onChange({target:{value:'brouillon fictif à préserver'}});tree=runner.render();
    const pending=elements(tree,node=>node.type==='form')[0].props.onSubmit({preventDefault(){}});
    tree=runner.render();textarea=elements(tree,node=>node.type==='textarea')[0];assert.equal(textarea.props.disabled,true);assert.equal(textarea.props.value,'brouillon fictif à préserver');
    const cancel=button(tree,'Annuler');assert.ok(!cancel.props.disabled);cancel.props.onClick();assert.equal(cancelled,true);
    context.busy=false;finish(null);await pending;tree=runner.render();textarea=elements(tree,node=>node.type==='textarea')[0];
    assert.equal(textarea.props.value,'brouillon fictif à préserver');assert.equal(textarea.props.disabled,false);
  } finally {runner.close();}
});

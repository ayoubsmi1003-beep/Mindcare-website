import type {Screen,ResourceId} from '@/components/sanad/core';
export type ProductRoute={screen:Screen;section?:string;resource?:ResourceId};
export function updateDirty(sources:Set<string>,detail:unknown){
 if(typeof detail==='boolean'){if(detail)sources.add('feature');else sources.delete('feature');}
 else if(detail&&typeof detail==='object'&&'source' in detail&&typeof detail.source==='string'&&'dirty' in detail&&typeof detail.dirty==='boolean'){if(detail.dirty)sources.add(detail.source);else sources.delete(detail.source);}
 return sources.size>0;
}
const exercises=['breathing','grounding','sleep','prepare'] as const;
export function routeFor(screen:Screen):ProductRoute{return {screen};}
export function activeTab(screen:Screen):'today'|'followup'|'resources'|'cabinet'{
 if(['followup','journal'].includes(screen))return 'followup';
 if(['resources','thought','weekly','chat'].includes(screen))return 'resources';
 if(['appointments','messages','treatment'].includes(screen))return 'cabinet';
 return 'today';
}
export function routeQuery(route:ProductRoute){
 const query=new URLSearchParams();const {screen}=route;
 const mapping:Record<Screen,[string,string?]>={today:['home'],followup:['journey',route.section||'overview'],journal:['journey','journal'],weekly:['studio','weekly'],thought:['studio','thought'],resources:['studio'],chat:['studio','conversation'],space:['settings'],checkin:['home','checkin'],appointments:['cabinet',route.section||'appointments'],messages:['cabinet','messages'],treatment:['cabinet','treatment'],help:['home','help'],notifications:['home','notifications']};
 const [view,section]=mapping[screen];query.set('view',view);if(section)query.set('section',section);
 if(screen==='resources'&&route.resource&&exercises.includes(route.resource))query.set('exercise',route.resource);
 return query.toString();
}
export function readRoute(query:URLSearchParams):ProductRoute{
 const view=query.get('view'),section=query.get('section');
 if(view==='journey')return section==='journal'?{screen:'journal'}:{screen:'followup',section:section==='week'?'week':'overview'};
 if(view==='studio'){
  if(section==='thought'||section==='weekly')return {screen:section};
  if(section==='conversation')return {screen:'chat'};
  const value=query.get('exercise');return {screen:'resources',...(exercises.includes(value as ResourceId)?{resource:value as ResourceId}:{})};
 }
 if(view==='cabinet')return section==='messages'?{screen:'messages'}:section==='treatment'?{screen:'treatment'}:{screen:'appointments',section:section==='documents'?'documents':'appointments'};
 if(view==='settings')return {screen:'space'};
 if(view==='home'&&['checkin','help','notifications'].includes(section||''))return {screen:section as Screen};
 return {screen:'today'};
}

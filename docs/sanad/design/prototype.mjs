export const screens = [
  {id:'01-connexion',title:'01 · Connexion',description:'Une entrée calme et trilingue. Aucun identifiant n’est requis dans ce prototype.',links:[['Explorer le parcours fictif','02-aujourdhui',14,76,72,7]]},
  {id:'02-aujourdhui',title:'02 · Aujourd’hui',description:'Une action utile avant les détails. Le rendez-vous absent garde son état vide.',links:[['Faire mon bilan','04-bilan',34,58,50,7],['Voir le traitement','03-traitement',14,66,72,8],['Découvrir les ressources','06-ressources',14,84,72,6]]},
  {id:'03-traitement',title:'03 · Mon traitement',description:'Exemple entièrement fictif. Les déclarations ne modifient jamais la prescription. Les interactions métier ne sont pas actives ici.',links:[['Retour au suivi','02-aujourdhui',12,9,45,5]]},
  {id:'04-bilan',title:'04 · Bilan quotidien',description:'Réponses facultatives, sans diagnostic ni score de risque. Le lien de retour ne sauvegarde aucune donnée.',links:[['Retour à Aujourd’hui sans enregistrement','02-aujourdhui',14,81,72,6]]},
  {id:'05-conversation',title:'05 · Conversation Sanad',description:'Exemple de dialogue scénarisé. Aucune IA connectée, aucune saisie envoyée et aucune conversation enregistrée.',links:[]},
  {id:'06-ressources',title:'06 · Ressources',description:'Illustrations éditoriales, contenus à relire. Les exercices fonctionnels viendront après validation.',links:[['Revenir à Aujourd’hui','02-aujourdhui',12,92,16,6]]},
  {id:'07-arabe',title:'07 · العربية — RTL',description:'Variante arabe avec hiérarchie et navigation inversées. Le rendu des fontes et les formulations seront vérifiés dans l’interface réelle.',links:[]},
  {id:'08-desktop',title:'08 · Desktop',description:'Navigation latérale et espace de lecture élargi. Les informations médicales finales reproduiront exclusivement les consignes explicitement partagées.',links:[['Faire mon bilan','04-bilan',40,64,27,8],['Voir le traitement','03-traitement',72,52,25,7],['Ouvrir la conversation','05-conversation',1,31,15,6],['Ouvrir les ressources','06-ressources',1,38,15,7]]}
];
export function screenForHash(hash){return screens.find(s=>s.id===hash.replace(/^#/,''))??screens[0];}
if(typeof document!=='undefined'){
  const byId=id=>document.getElementById(id);
  for(const s of screens){const a=document.createElement('a');a.href='#'+s.id;a.textContent=s.title;byId('screens').append(a);}
  function render(){const s=screenForHash(location.hash),i=screens.indexOf(s);byId('screen-title').textContent=s.title;byId('description').textContent=s.description;byId('screen').src=s.id+'.png';byId('screen').alt=s.title+' — référence visuelle Sanad Jardin';byId('original').href=s.id+'.png';byId('canvas').classList.toggle('desktop',s.id==='08-desktop');byId('hotspots').replaceChildren();for(const [label,target,x,y,w,h] of s.links){const a=document.createElement('a');a.href='#'+target;a.textContent=label;a.setAttribute('aria-label',label);a.style.cssText=`left:${x}%;top:${y}%;width:${w}%;height:${h}%`;byId('hotspots').append(a);}for(const a of byId('screens').children){if(a.hash==='#'+s.id)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');}byId('previous').disabled=i===0;byId('next').disabled=i===screens.length-1;byId('status').textContent=`Vue ${i+1} sur ${screens.length}. Navigation uniquement ; aucune donnée enregistrée.`;}
  byId('previous').onclick=()=>{const i=screens.indexOf(screenForHash(location.hash));if(i>0)location.hash=screens[i-1].id;};
  byId('next').onclick=()=>{const i=screens.indexOf(screenForHash(location.hash));if(i<screens.length-1)location.hash=screens[i+1].id;};
  byId('zones').onchange=e=>document.body.classList.toggle('hide-zones',!e.target.checked);
  window.addEventListener('hashchange',render);render();
}

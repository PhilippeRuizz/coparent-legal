'use strict';
(() => {
 const element=id=>document.getElementById(id);
 const params=new URL(location.href).searchParams,values=[...params.getAll('token'),...params.getAll('code')];
 const token=values.length===1&&/^[0-9a-f]{32}$/i.test(values[0])?values[0].toLowerCase():null;
 if(!token){element('invalid').hidden=false;return;}
 element('invitation').hidden=false;
 element('code').textContent=token;
 element('open').href='coparent://invite?token='+encodeURIComponent(token);
 element('copy').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(token);element('copy-status').textContent='Code copié. Conservez-le pour rejoindre le foyer après installation.';}
  catch{element('copy-status').textContent='La copie automatique est indisponible. Sélectionnez le code ci-dessus puis copiez-le.';}
 });
 // Public configuration only. Never accept an App Store redirect from the invitation URL.
 fetch('invite-config.json',{credentials:'omit',referrerPolicy:'no-referrer'})
  .then(response=>response.ok?response.json():null).then(config=>{
   if(!config||typeof config.appStoreUrl!=='string'||!config.appStoreUrl)return;
   const url=new URL(config.appStoreUrl);
   if(url.protocol!=='https:'||url.hostname!=='apps.apple.com'||url.port||url.username||url.password||!/\/id\d+(?:\/|$)/.test(url.pathname))return;
   element('store').href=url.href;element('store').hidden=false;element('store-pending').hidden=true;
  }).catch(()=>{/* Code and app opening remain usable without the optional store link. */});
})();

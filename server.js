// Minimal static server for Railway (no dependencies)
const http=require('http'),https=require('https'),fs=require('fs'),path=require('path'),zlib=require('zlib');
const ROOT=__dirname,PORT=process.env.PORT||3000;
const MIME={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon','.xml':'application/xml','.txt':'text/plain; charset=utf-8','.json':'application/json','.woff2':'font/woff2','.apk':'application/vnd.android.package-archive'};
const GZ=new Set(['.html','.css','.js','.svg','.xml','.txt','.json']);
function send(req,res,file,status){
  const ext=path.extname(file).toLowerCase();
  fs.readFile(file,(e,buf)=>{
    if(e){res.writeHead(500);return res.end('Server error')}
    const h={'Content-Type':MIME[ext]||'application/octet-stream','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin',
      'Cache-Control':(ext==='.html'||ext==='.css'||ext==='.js')?'no-cache':'public, max-age=86400'};
    if(GZ.has(ext)&&/\bgzip\b/.test(req.headers['accept-encoding']||'')){buf=zlib.gzipSync(buf);h['Content-Encoding']='gzip';h['Vary']='Accept-Encoding'}
    h['Content-Length']=buf.length;res.writeHead(status||200,h);res.end(req.method==='HEAD'?undefined:buf);
  });
}

/* ---------- Conversion relay to PropellerAds (S2S postback) ----------
   Env (Railway Variables):
     PROP_AID, PROP_TID   required. From PropellerAds > Tracking (aid, tid).
     PROP_PID             optional (default empty).
     PROP_URL             optional full template, tokens: {aid} {pid} {tid} {cid} {goalq} {payoutq}
     EV_APK  (default "main")  click on the Android install button
     EV_WEB  (default "off")   click on Play in browser / iPhone
     EV_INSTALL,EV_REG,EV_FTD  goals for partner postbacks on /pb  (defaults: off, 2, 3)
        value: "main" = base conversion, a number = &goal=N, "off" = ignore
     PB_SECRET            required for /pb (partner postback), e.g. ?secret=...
*/
const E=process.env;
const EV={apk:E.EV_APK||'main',web:E.EV_WEB||'off',install:E.EV_INSTALL||'off',reg:E.EV_REG||'2',ftd:E.EV_FTD||'3',tg:E.EV_TG||'off'};
const TPL=E.PROP_URL||'https://ad.propellerads.com/conversion.php?aid={aid}&pid={pid}&tid={tid}&visitor_id={cid}{goalq}{payoutq}';
const seen=new Map(),hits=new Map();
function ipOf(req){return String(req.headers['x-forwarded-for']||req.socket.remoteAddress||'').split(',')[0].trim()}
function limited(ip){const m=Math.floor(Date.now()/60000),h=hits.get(ip);if(!h||h.m!==m){hits.set(ip,{m,n:1});if(hits.size>20000)hits.clear();return false}return ++h.n>60}
function fire(url,tries,cb){
  const lib=url.startsWith('https')?https:http;
  const r=lib.get(url,{timeout:6000},resp=>{let b='';resp.on('data',d=>{if(b.length<200)b+=d});resp.on('end',()=>cb(null,resp.statusCode,b))});
  r.on('timeout',()=>r.destroy(new Error('timeout')));
  r.on('error',err=>{if(tries>1)setTimeout(()=>fire(url.replace(/^https:/,'http:'),tries-1,cb),500);else cb(err)});
}
function relay(ev,cid,payout){
  const g=EV[ev];
  if(!g||g==='off'){console.log('[pb] skip',ev,'cid='+cid,'(event off)');return {ok:false,why:'event off'}}
  if(!E.PROP_URL&&!(E.PROP_AID&&E.PROP_TID)){console.log('[pb] skip',ev,'cid='+cid,'(PROP_AID / PROP_TID not set in Railway Variables)');return {ok:false,why:'PROP_AID/PROP_TID not set'}}
  const key=cid+'|'+g;
  if(seen.has(key)){console.log('[pb] skip',ev,'cid='+cid,'(duplicate)');return {ok:false,why:'duplicate'}}
  seen.set(key,Date.now());if(seen.size>100000)seen.delete(seen.keys().next().value);
  const url=TPL.replace('{aid}',encodeURIComponent(E.PROP_AID||'')).replace('{pid}',encodeURIComponent(E.PROP_PID||'')).replace('{tid}',encodeURIComponent(E.PROP_TID||''))
    .replace('{cid}',encodeURIComponent(cid)).replace('{goalq}',g==='main'?'':'&goal='+encodeURIComponent(g)).replace('{payoutq}',payout?'&payout='+encodeURIComponent(payout):'');
  fire(url,2,(err,code,body)=>{console.log('[pb]',ev,'cid='+cid,'goal='+g,err?'ERR '+err.message:'HTTP '+code+' '+String(body).replace(/\s+/g,' ').slice(0,60));if(err||code>=400)seen.delete(key)});
  return {ok:true};
}
function handleTrack(req,res,u){
  const q=u.searchParams,ev=(q.get('e')||'').toLowerCase(),cid=q.get('cid')||'';
  if(limited(ipOf(req))){res.writeHead(429);return res.end()}
  if(u.pathname==='/pb'){
    if(!E.PB_SECRET||q.get('secret')!==E.PB_SECRET){res.writeHead(403);return res.end('forbidden')}
    const pev=(q.get('event')||ev).toLowerCase();
    if(!/^[\w.\-~]{1,128}$/.test(cid)||!EV.hasOwnProperty(pev)){res.writeHead(400);return res.end('bad request')}
    const r=relay(pev,cid,q.get('payout')||'');res.writeHead(200,{'Content-Type':'application/json'});return res.end(JSON.stringify(r));
  }
  if(ev==='macro'){console.log('[t] WARNING unreplaced macro in URL, visitor_id='+String(cid).slice(0,40)+' (open test links with a real value, e.g. ?visitor_id=TEST1)')}
  else if(ev==='pv'&&/^[\w.\-~]{1,128}$/.test(cid)){console.log('[t] pageview with click id cid='+cid)}
  else if(!/^[\w.\-~]{1,128}$/.test(cid)){console.log('[t] ignored: no valid cid, event='+ev)}
  else if(!EV.hasOwnProperty(ev)||ev==='reg'||ev==='ftd'||ev==='install'){console.log('[t] ignored event='+ev+' cid='+cid)}
  else{console.log('[t] received',ev,'cid='+cid);relay(ev,cid,'')}
  res.writeHead(204,{'Cache-Control':'no-store'});res.end();
}
http.createServer((req,res)=>{
  if(req.url.startsWith('/t?')||req.url.startsWith('/pb?')||req.url==='/t'){
    if(req.method==='OPTIONS'){res.writeHead(204);return res.end()}
    try{return handleTrack(req,res,new URL(req.url,'http://x'))}catch(e){res.writeHead(400);return res.end()}
  }
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);return res.end()}
  let p;try{p=decodeURIComponent(req.url.split('?')[0])}catch(e){res.writeHead(400);return res.end()}
  if(p.endsWith('/'))p+='index.html';
  let f=path.normalize(path.join(ROOT,p));
  if(!f.startsWith(ROOT)||/(^|[\\/])(server\.js|package\.json|build\.py|i18n|node_modules)/.test(path.relative(ROOT,f))){return send(req,res,path.join(ROOT,'404.html'),404)}
  fs.stat(f,(e,st)=>{
    if(!e&&st.isFile())return send(req,res,f);
    if(!path.extname(f)){fs.stat(f+'.html',(e2,s2)=>!e2&&s2.isFile()?send(req,res,f+'.html'):send(req,res,path.join(ROOT,'404.html'),404));return}
    send(req,res,path.join(ROOT,'404.html'),404);
  });
}).listen(PORT,'0.0.0.0',()=>console.log('CoinPlay site on :'+PORT));

// Minimal static server for Railway (no dependencies)
const http=require('http'),fs=require('fs'),path=require('path'),zlib=require('zlib');
const ROOT=__dirname,PORT=process.env.PORT||3000;
const MIME={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon','.xml':'application/xml','.txt':'text/plain; charset=utf-8','.json':'application/json','.woff2':'font/woff2','.apk':'application/vnd.android.package-archive'};
const GZ=new Set(['.html','.css','.js','.svg','.xml','.txt','.json']);
function send(req,res,file,status){
  const ext=path.extname(file).toLowerCase();
  fs.readFile(file,(e,buf)=>{
    if(e){res.writeHead(500);return res.end('Server error')}
    const h={'Content-Type':MIME[ext]||'application/octet-stream','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin',
      'Cache-Control':ext==='.html'?'no-cache':'public, max-age=86400'};
    if(GZ.has(ext)&&/\bgzip\b/.test(req.headers['accept-encoding']||'')){buf=zlib.gzipSync(buf);h['Content-Encoding']='gzip';h['Vary']='Accept-Encoding'}
    h['Content-Length']=buf.length;res.writeHead(status||200,h);res.end(req.method==='HEAD'?undefined:buf);
  });
}
http.createServer((req,res)=>{
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);return res.end()}
  let p;try{p=decodeURIComponent(req.url.split('?')[0])}catch(e){res.writeHead(400);return res.end()}
  if(p.endsWith('/'))p+='index.html';
  let f=path.normalize(path.join(ROOT,p));
  if(!f.startsWith(ROOT)||/(^|[\\/])(server\.js|package\.json|build\.py|node_modules)/.test(path.relative(ROOT,f))){return send(req,res,path.join(ROOT,'404.html'),404)}
  fs.stat(f,(e,st)=>{
    if(!e&&st.isFile())return send(req,res,f);
    if(!path.extname(f)){fs.stat(f+'.html',(e2,s2)=>!e2&&s2.isFile()?send(req,res,f+'.html'):send(req,res,path.join(ROOT,'404.html'),404));return}
    send(req,res,path.join(ROOT,'404.html'),404);
  });
}).listen(PORT,'0.0.0.0',()=>console.log('CoinPlay site on :'+PORT));

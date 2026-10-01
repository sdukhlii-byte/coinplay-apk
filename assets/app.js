(function(){
var C=window.CFG||{},L=window.I18N||{},qs;
function tx(k,d){return L[k]||d}
var VAR="";try{VAR=document.body.getAttribute("data-v")||""}catch(e){}
function U(k){return(VAR==="bet"&&C["BET_"+k])||C[k]}
try{qs=new URLSearchParams(location.search)}catch(e){qs={get:function(){return null},forEach:function(){}}}
var ua=navigator.userAgent||"";
var CID="";
try{
  CID=qs.get("visitor_id")||qs.get("subid")||qs.get("clickid")||qs.get("click_id")||qs.get("cid")||"";
  var RAW=CID,FRESH=false;
  if(CID&&!/^[\w.\-~]{1,128}$/.test(CID))CID="";
  if(CID){FRESH=true;try{sessionStorage.setItem("cp_cid",CID)}catch(e){}try{localStorage.setItem("cp_cid",CID)}catch(e){}}
  else{try{CID=sessionStorage.getItem("cp_cid")||localStorage.getItem("cp_cid")||""}catch(e){}}
  /* diagnostics: tell our server whether the ad network really passed a click id */
  if(C.TRACK_URL){
    var diag=null;
    if(RAW&&!FRESH)diag=["macro",RAW];
    else if(FRESH){var pk="cp_pv_"+CID,done=false;try{done=!!sessionStorage.getItem(pk);sessionStorage.setItem(pk,"1")}catch(e){}if(!done)diag=["pv",CID]}
    if(diag){var du=C.TRACK_URL.replace("{clickid}",encodeURIComponent(diag[1])).replace("{event}",diag[0]);(new Image()).src=du}
  }
}catch(e){}
var isAndroid=/Android/i.test(ua);
var isIOS=/iPhone|iPad|iPod/i.test(ua)||(/Macintosh/i.test(ua)&&navigator.maxTouchPoints>1);
try{var fo=qs.get("os");if(fo==="android"){isAndroid=true;isIOS=false}else if(fo==="ios"){isIOS=true;isAndroid=false}}catch(e){}
function all(sel){return Array.prototype.slice.call(document.querySelectorAll(sel))}
function wp(u){var sp=C.SUBID_PARAM&&CID;if(!sp&&(!C.PASS_PARAMS||!location.search))return u;try{var x=new URL(u,location.href);if(sp)x.searchParams.set(C.SUBID_PARAM,CID);if(C.PASS_PARAMS&&location.search)qs.forEach(function(v,k){if(!x.searchParams.has(k))x.searchParams.set(k,v)});return x.toString()}catch(e){return u}}
function track(ev){if(!C.TRACK_URL||!CID)return;var u=C.TRACK_URL.replace("{clickid}",encodeURIComponent(CID)).replace("{event}",encodeURIComponent(ev));try{if(!(navigator.sendBeacon&&navigator.sendBeacon(u)))(new Image()).src=u}catch(e){try{(new Image()).src=u}catch(e2){}}}
try{
var map=[["js-apk","APK_URL","apk"],["js-web","WEB_URL","web"],["js-tg","TG_URL","tg"],["js-x","X_URL","x"],["js-ig","IG_URL","ig"]];
map.forEach(function(m){all("."+m[0]).forEach(function(a){
  if(U(m[1])){a.href=wp(U(m[1]))}
  a.addEventListener("click",function(){var ev=m[2];if(ev==="apk"&&!isAndroid)ev=isIOS?"web":"other";track(ev);if(m[2]==="apk")showAfter()});
  if(m[2]!=="apk"){a.target="_blank";a.rel="noopener"}
})});
[["f-ver",C.VERSION],["f-size",C.SIZE],["f-upd",C.UPDATED]].forEach(function(p){var el=document.getElementById(p[0]);if(!el)return;if(p[1])el.textContent=p[1];else{el.style.display="none";if(el.previousElementSibling)el.previousElementSibling.style.display="none"}});
var fb=document.getElementById("facts");
if(fb){var FF=L.facts?L.facts.map(function(p){return{label:p[0],value:p[1]}}):C.FACTS;if(FF&&FF.length){FF.forEach(function(f){var d=document.createElement("div");d.className="fact";var s=document.createElement("small"),b=document.createElement("strong");s.textContent=f.label;b.textContent=f.value;d.appendChild(s);d.appendChild(b);fb.appendChild(d)});var nt=document.createElement("p");nt.className="small center factsnote";nt.textContent=tx("factsnote","18+. Bonus terms and wagering requirements apply. Check the current terms on the CoinPlay website before you deposit.");fb.parentNode.insertBefore(nt,fb.nextSibling)}else fb.style.display="none"}
var bn=document.getElementById("bonus");
if(bn&&C.BONUS_TEXT){bn.style.display="block";bn.textContent=C.BONUS_TEXT+" ";var l=document.createElement("a");l.className="js-apk";l.href=wp(C.APK_URL);l.textContent=C.BONUS_LINK_TEXT||"";l.addEventListener("click",function(){track("apk");showAfter()});bn.appendChild(l)}
var b=document.getElementById("burger"),nv=document.getElementById("nav");
if(b&&nv)b.addEventListener("click",function(){nv.classList.toggle("open");b.setAttribute("aria-expanded",nv.classList.contains("open"))});
}catch(e){}

/* OS-aware CTAs: don't send iPhone/desktop users to an APK */
try{
var note=document.getElementById("osnote");
if(isIOS){
  document.documentElement.className+=" is-ios";
  all(".js-apk").forEach(function(a){
    a.href=wp(U("WEB_URL")||"#");a.target="_blank";a.rel="noopener";
    a.textContent=a.classList.contains("hbtn")?tx("play_short","Play"):tx("play_long","▶ Play now");
  });
  var sm=document.querySelector(".sticky small");if(sm)sm.innerHTML=tx("sticky_web","CoinPlay<br>Play in browser");
  if(note)note.innerHTML=tx("ios_note",'No download needed. Play in Safari and <a href="ios.html" style="color:#FFE145">add to your home screen</a>.');
  var ld=document.getElementById("lead");if(ld)ld.textContent=tx("ios_lead","Play CoinPlay right in Safari: slots, live casino and sports with crypto payments. Add it to your home screen to open it like an app.");
  all(".mhero .b2").forEach(function(x){x.style.display="none"});
}else if(!isAndroid){
  document.documentElement.className+=" is-desktop";
  if(note)note.textContent=tx("desk_note","The APK is for Android phones. Open this page on your phone, or play in the browser now.");
}else if(note){note.textContent=tx("android_note","Android 8.0+ · Chrome may warn about the file: tap “Download anyway”.")}
}catch(e){}

/* sticky bar: show only after the hero CTA scrolls away */
try{
var st=document.querySelector(".sticky");
if(st){st.style.display="none";
 var onScroll=function(){var y=window.pageYOffset||document.documentElement.scrollTop;var show=y>520&&window.innerWidth<=720;st.style.display=show?"flex":"none"};
 window.addEventListener("scroll",onScroll,{passive:true});window.addEventListener("resize",onScroll);onScroll();}
}catch(e){}

/* after-click guidance keeps Android users moving through install */
var shown=false;
function showAfter(){
  if(shown||!isAndroid)return;shown=true;
  try{
    var d=document.createElement("div");d.className="after";
    d.innerHTML=tx("after_html",'<div class="afterbox"><button class="afterx" aria-label="Close">×</button><h3>Download started ✓</h3><ol><li>If Chrome warns, tap <b>Download anyway</b>.</li><li>Open the file. If asked, tap <b>Settings</b> and allow installs from this browser.</li><li>Tap <b>Install</b>, then <b>Open</b> CoinPlay.</li></ol><p>Nothing happening? <a href="install-guide.html">See the install guide</a></p></div>');

    document.body.appendChild(d);
    d.querySelector(".afterx").addEventListener("click",function(){d.parentNode.removeChild(d)});
    d.addEventListener("click",function(e){if(e.target===d)d.parentNode.removeChild(d)});
  }catch(e){}
}

/* language: remember choice, ?lang= redirect, suggest PT/ES to matching browsers */
try{
var alt=L.alt||{},cur=L.lang||"en",store=null;
try{store=window.localStorage}catch(e){}
function sg(k){try{return store&&store.getItem(k)}catch(e){return null}}
function ss(k,v){try{store&&store.setItem(k,v)}catch(e){}}
all(".langs a").forEach(function(x){x.addEventListener("click",function(){ss("cp_lang",x.getAttribute("data-l"))})});
var want=qs.get("lang");
if(want&&want!==cur&&alt[want]&&/^(pt|es|tr|vi|en)$/.test(want)){location.replace(alt[want]+location.search+location.hash)}
else if(cur==="en"&&!sg("cp_lang")&&!want){
  var langs=(navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||navigator.userLanguage||""]);
  var pick=null;
  for(var i=0;i<langs.length&&!pick;i++){var c=String(langs[i]).toLowerCase().slice(0,2);if(c==="pt"&&alt.pt)pick="pt";else if(c==="es"&&alt.es)pick="es";else if(c==="tr"&&alt.tr)pick="tr";else if(c==="vi"&&alt.vi)pick="vi";else if(c==="en")break}
  if(pick){
    var TXT={pt:["Ver esta página em português?","Sim, português"],es:["¿Ver esta página en español?","Sí, español"],tr:["Bu sayfayı Türkçe görmek ister misiniz?","Evet, Türkçe"],vi:["Xem trang này bằng tiếng Việt?","Có, tiếng Việt"]}[pick];
    var bar=document.createElement("div");bar.className="langbar";
    var sp=document.createElement("span");sp.textContent=TXT[0];
    var go=document.createElement("a");go.href=alt[pick]+location.search+location.hash;go.textContent=TXT[1];go.addEventListener("click",function(){ss("cp_lang",pick)});
    var x=document.createElement("button");x.type="button";x.setAttribute("aria-label","×");x.textContent="×";x.addEventListener("click",function(){ss("cp_lang","en");if(bar.parentNode)bar.parentNode.removeChild(bar)});
    bar.appendChild(sp);bar.appendChild(go);bar.appendChild(x);
    document.body.insertBefore(bar,document.body.firstChild);
  }
}
}catch(e){}
})();

(function(){
var C=window.CFG||{},qs;
try{qs=new URLSearchParams(location.search)}catch(e){qs={get:function(){return null},forEach:function(){}}}
var ua=navigator.userAgent||"";
var isAndroid=/Android/i.test(ua);
var isIOS=/iPhone|iPad|iPod/i.test(ua)||(/Macintosh/i.test(ua)&&navigator.maxTouchPoints>1);
function all(sel){return Array.prototype.slice.call(document.querySelectorAll(sel))}
function wp(u){if(!C.PASS_PARAMS||!location.search)return u;try{var x=new URL(u,location.href);qs.forEach(function(v,k){if(!x.searchParams.has(k))x.searchParams.set(k,v)});return x.toString()}catch(e){return u}}
function track(ev){if(!C.TRACK_URL)return;var id=qs.get("clickid")||qs.get("click_id")||qs.get("subid")||"";var u=C.TRACK_URL.replace("{clickid}",encodeURIComponent(id)).replace("{event}",ev);try{if(navigator.sendBeacon)navigator.sendBeacon(u);else(new Image()).src=u}catch(e){}}
try{
var map=[["js-apk","APK_URL","apk"],["js-web","WEB_URL","web"],["js-tg","TG_URL","tg"]];
map.forEach(function(m){all("."+m[0]).forEach(function(a){
  if(C[m[1]]){a.href=wp(C[m[1]])}
  a.addEventListener("click",function(){track(m[2]);if(m[2]==="apk")showAfter()});
  if(m[2]!=="apk"){a.target="_blank";a.rel="noopener"}
})});
all(".js-mail").forEach(function(a){a.href="mailto:"+C.CONTACT_EMAIL;a.textContent=C.CONTACT_EMAIL});
[["f-ver",C.VERSION],["f-size",C.SIZE],["f-upd",C.UPDATED]].forEach(function(p){var el=document.getElementById(p[0]);if(!el)return;if(p[1])el.textContent=p[1];else{el.style.display="none";if(el.previousElementSibling)el.previousElementSibling.style.display="none"}});
var fb=document.getElementById("facts");
if(fb){if(C.FACTS&&C.FACTS.length){C.FACTS.forEach(function(f){var d=document.createElement("div");d.className="fact";var s=document.createElement("small"),b=document.createElement("strong");s.textContent=f.label;b.textContent=f.value;d.appendChild(s);d.appendChild(b);fb.appendChild(d)});var nt=document.createElement("p");nt.className="small center factsnote";nt.textContent="18+. Bonus terms and wagering requirements apply. Check the current terms on the CoinPlay website before you deposit.";fb.parentNode.insertBefore(nt,fb.nextSibling)}else fb.style.display="none"}
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
    a.href=wp(C.WEB_URL||"#");a.target="_blank";a.rel="noopener";
    a.textContent=a.classList.contains("hbtn")?"Play":"▶ Play now";
    a.addEventListener("click",function(){track("web")});
  });
  var sm=document.querySelector(".sticky small");if(sm)sm.innerHTML="CoinPlay<br>Play in browser";
  if(note)note.innerHTML='No download needed. Play in Safari and <a href="ios.html" style="color:#FFE145">add to your home screen</a>.';
  var ld=document.getElementById("lead");if(ld)ld.textContent="Play CoinPlay right in Safari: slots, live casino and sports with crypto payments. Add it to your home screen to open it like an app.";
  all(".mhero .b2").forEach(function(x){x.style.display="none"});
}else if(!isAndroid){
  document.documentElement.className+=" is-desktop";
  if(note)note.textContent="The APK is for Android phones. Open this page on your phone, or play in the browser now.";
}else if(note){note.textContent="Android 8.0+ · Chrome may warn about the file: tap “Download anyway”."}
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
    d.innerHTML='<div class="afterbox"><button class="afterx" aria-label="Close">×</button><h3>Download started ✓</h3><ol><li>If Chrome warns, tap <b>Download anyway</b>.</li><li>Open the file. If asked, tap <b>Settings</b> and allow installs from this browser.</li><li>Tap <b>Install</b>, then <b>Open</b> CoinPlay.</li></ol><p>Nothing happening? <a href="install-guide.html">See the install guide</a></p></div>';
    document.body.appendChild(d);
    d.querySelector(".afterx").addEventListener("click",function(){d.parentNode.removeChild(d)});
    d.addEventListener("click",function(e){if(e.target===d)d.parentNode.removeChild(d)});
  }catch(e){}
}
})();

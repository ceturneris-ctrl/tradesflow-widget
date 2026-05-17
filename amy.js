(function(){
var WORKER_URL='https://amy-chat-api.ct-paypaluk.workers.dev';
var SYSTEM='You are Amy, a friendly receptionist for ABC Plumbing in the UK. Collect job type, full name, phone number and postcode one at a time. Be warm and professional. Keep replies to 2-3 sentences. Never discuss price or timing. Once you have all 4 details confirm them and say someone will call within 2 hours.';
var msgs=[];
var open=false;
var s=document.createElement('style');
s.textContent='#ab{position:fixed;bottom:24px;right:24px;width:56px;height:56px;background:#1a73e8;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(0,0,0,.2);z-index:99999}#ab svg{width:28px;height:28px;fill:white}#aw{position:fixed;bottom:92px;right:24px;width:320px;height:460px;background:white;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,.15);z-index:99998;display:none;flex-direction:column;overflow:hidden;font-family:sans-serif}#aw.open{display:flex}#ah{background:#1a73e8;color:white;padding:14px 16px;display:flex;align-items:center;gap:10px}#ah h3{font-size:14px;font-weight:600;margin:0}#ah p{font-size:11px;opacity:.85;margin:2px 0 0}#am{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px}.m{max-width:80%;padding:9px 13px;border-radius:16px;font-size:13px;line-height:1.5}.m.a{background:#f0f4f8;color:#111;align-self:flex-start;border-bottom-left-radius:4px}.m.u{background:#1a73e8;color:white;align-self:flex-end;border-bottom-right-radius:4px}.t{display:flex;gap:4px;padding:9px 13px;background:#f0f4f8;border-radius:16px;border-bottom-left-radius:4px;align-self:flex-start}.t span{width:7px;height:7px;background:#999;border-radius:50%;animation:b 1.2s infinite}.t span:nth-child(2){animation-delay:.2s}.t span:nth-child(3){animation-delay:.4s}@keyframes b{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}#ai-area{padding:12px;border-top:1px solid #e8ecef;display:flex;gap:8px}#ai{flex:1;padding:9px 14px;border:1.5px solid #e8ecef;border-radius:20px;font-size:13px;outline:none}#as{width:36px;height:36px;background:#1a73e8;color:white;border:none;border-radius:50%;cursor:pointer;font-size:16px}#as:disabled{background:#ccc}#ap{text-align:center;font-size:10px;color:#bbb;padding:6px}';
document.head.appendChild(s);
var b=document.createElement('div');
b.id='ab';
b.innerHTML='<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>';
document.body.appendChild(b);
var w=document.createElement('div');
w.id='aw';
w.innerHTML='<div id="ah"><div style="width:36px;height:36px;background:rgba(255,255,255,.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px">🔧</div><div><h3>Amy - ABC Plumbing</h3><p>Online - replies instantly</p></div></div><div id="am"></div><div id="ai-area"><input id="ai" type="text" placeholder="Type your message..."/><button id="as">&#10148;</button></div><div id="ap">Powered by TradesFlow AI</div>';
document.body.appendChild(w);
window.openAmy=function(){
open=true;
w.classList.add('open');
if(msgs.length===0){
setTimeout(function(){
var g='Hi there! Welcome to ABC Plumbing. I am Amy, the virtual assistant. What plumbing job can I help you with today?';
msgs.push({role:'assistant',content:g});
addMsg(g,'a');
},400);
}
document.getElementById('ai').focus();
};
b.onclick=function(){
open=!open;
w.classList.toggle('open',open);
if(open&&msgs.length===0){
setTimeout(function(){
var g='Hi there! Welcome to ABC Plumbing. I am Amy, the virtual assistant. What plumbing job can I help you with today?';
msgs.push({role:'assistant',content:g});
addMsg(g,'a');
},400);
}
if(open)document.getElementById('ai').focus();
};
document.getElementById('as').onclick=send;
document.getElementById('ai').onkeypress=function(e){if(e.key==='Enter')send();};
function send(){
var inp=document.getElementById('ai');
var txt=inp.value.trim();
if(!txt)return;
inp.value='';
document.getElementById('as').disabled=true;
addMsg(txt,'u');
msgs.push({role:'user',content:txt});
showTyping();
fetch(WORKER_URL,{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({system:SYSTEM,messages:msgs})
}).then(function(r){return r.json();}).then(function(d){
var reply=d.content[0].text;
msgs.push({role:'assistant',content:reply});
removeTyping();
addMsg(reply,'a');
}).catch(function(){
removeTyping();
addMsg('Sorry, I am having a technical issue. Please call us directly!','a');
});
document.getElementById('as').disabled=false;
document.getElementById('ai').focus();
}
function addMsg(txt,sender){
var d=document.createElement('div');
d.className='m '+sender;
d.textContent=txt;
document.getElementById('am').appendChild(d);
document.getElementById('am').scrollTop=99999;
}
function showTyping(){
var d=document.createElement('div');
d.className='t';
d.id='aty';
d.innerHTML='<span></span><span></span><span></span>';
document.getElementById('am').appendChild(d);
document.getElementById('am').scrollTop=99999;
}
function removeTyping(){
var t=document.getElementById('aty');
if(t)t.remove();
}
})();

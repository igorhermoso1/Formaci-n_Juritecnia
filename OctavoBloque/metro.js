/* =====================================================================
   metro.js · piezas comunes de todas las páginas del bloque 08 (Deploy)
   cajas de código, ejemplos en vivo, menú, recorrido del manual,
   misiones con casillas, juegos, pantallas simuladas, test y aparición
   ===================================================================== */
(function(){
"use strict";
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;};
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const guarda=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}};
const lee=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}};

/* ---------- el manual: una sola lista para todo el bloque ---------- */
const MANUAL=[
 ['Deploy-Metro.html','00','El plano','l1','Mapa de todo el bloque'],
 ['01-entorno.html','01','Monta tu taller','l1','Herramientas y cuentas'],
 ['02-publicar.html','02','Publica tu web','l2','GitHub y Vercel'],
 ['03-produccion.html','03','Producción en Vercel','l2','Dominio, ajustes y calidad'],
 ['04-supabase-inicio.html','04','Supabase · puesta en marcha','l3','Cuenta, proyecto y panel'],
 ['05-supabase-tablas.html','05','Supabase · tablas','l3','Diseñar y crear datos'],
 ['06-supabase-sql.html','06','Supabase · consultas SQL','l3','Consola para practicar'],
 ['07-supabase-seguridad.html','07','Supabase · seguridad','l4','RLS, usuarios y archivos'],
 ['08-supabase-web.html','08','Supabase · conecta tu web','l3','Libro de visitas real'],
 ['09-proyecto.html','09','De cero a producción','l6','El proyecto completo']];
const aqui=location.pathname.split('/').pop()||'Deploy-Metro.html';

/* ---------- resaltado de código ---------- */
function hlDecl(d){return d.replace(/([\w-]+)(\s*):(\s*)([^;]*)(;?)/g,(m,p,a,b,v,sc)=>'<span class="p">'+esc(p)+'</span>'+a+':'+b+'<span class="v">'+esc(v)+'</span>'+sc);}
function hlCss(line){let code=line,com='';const i=line.indexOf('/*');if(i>=0){code=line.slice(0,i);com=line.slice(i);}let out;
  if(code.indexOf('{')>=0){const j=code.indexOf('{');const after=code.slice(j+1);out='<span class="s">'+esc(code.slice(0,j))+'</span>{'+(after.indexOf(':')>=0?hlDecl(after.replace('}',''))+(after.indexOf('}')>=0?'}':''):esc(after));}
  else if(/^\s*\}/.test(code))out=esc(code);else if(/^\s*[\w-]+\s*:/.test(code))out=hlDecl(code);else out=esc(code);
  return out+(com?'<span class="c">'+esc(com)+'</span>':'');}
function hlHtml(h){return esc(h).replace(/([\w-]+)="([^"]*)"/g,'<span class="p">$1</span>=<span class="v">"$2"</span>').replace(/(&lt;\/?)([\w-]+)/g,'$1<span class="t">$2</span>');}
const KW=/\b(create|table|alter|enable|disable|row|level|security|policy|on|for|to|using|with|check|grant|revoke|select|insert|into|values|delete|update|set|from|where|and|or|not|null|is|in|like|ilike|between|order|by|asc|desc|limit|offset|group|having|join|left|inner|as|distinct|count|avg|sum|min|max|add|column|default|primary|key|references|unique|generated|always|identity|public|drop|const|let|async|await|function|return|if|else|of|export|new|true|false)\b/gi;
function hlGen(line,com){const i=line.indexOf(com);let code=line,c='';if(i>=0&&!(com==='//'&&/https?:$/.test(line.slice(0,i)))){code=line.slice(0,i);c=line.slice(i);}
  const out=esc(code).replace(/(["'])(.*?)\1/g,'\u0001$1$2$1\u0002').replace(KW,'<span class="k">$1</span>').replace(/\u0001(.*?)\u0002/g,(m,x)=>'<span class="v">'+x.replace(/<[^>]+>/g,'')+'</span>');
  return out+(c?'<span class="c">'+esc(c)+'</span>':'');}
const render=(lang,src)=>src.split('\n').map(l=>lang==='html'?hlHtml(l):lang==='css'?hlCss(l):lang==='sql'?hlGen(l,'--'):(lang==='env'||lang==='sh')?hlGen(l,'#'):hlGen(l,'//')).join('\n');
function copyText(txt,btn){const done=()=>{const o=btn.dataset.o||btn.textContent;btn.dataset.o=o;btn.textContent='¡Copiado!';btn.classList.add('ok');setTimeout(()=>{btn.textContent=o;btn.classList.remove('ok');},1300);};
  const fb=()=>{const t=el('textarea');t.value=txt;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();try{document.execCommand('copy');}catch(e){}t.remove();done();};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(done,fb);else fb();}
function codeBox(lang,src,title){const w=el('div','code');w.innerHTML=`<div class="bar"><span>${esc(title||lang.toUpperCase())}</span><button class="copy" type="button">Copiar</button></div><pre></pre>`;
  w.set=s=>{s=s.replace(/^\n+|\s+$/g,'');w.src=s;$('pre',w).innerHTML=render(lang,s);};w.set(src);$('.copy',w).onclick=e=>copyText(w.src,e.currentTarget);return w;}

/* ---------- ejemplos en vivo: lo que se ve es exactamente lo que se copia ---------- */
const BASE='*,*::before,*::after{box-sizing:border-box}body{margin:0;padding:18px;background:#f7f6f2;color:#14161c;font:16px/1.5 system-ui,sans-serif}';
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.play();io.unobserve(e.target);}}),{rootMargin:'300px 0px'});
$$('.caso').forEach(c=>{const h=$('textarea[data-lang=html]',c).value,css=$('textarea[data-lang=css]',c).value;
  const v=el('div','vineta');v.innerHTML='<div class="barra"><span>Resultado en vivo</span><button type="button">↻ Recargar</button></div>';
  const f=el('iframe');f.title='Resultado: '+$('h4',c).textContent;f.style.height=(+c.dataset.h||300)+'px';v.appendChild(f);
  v.play=()=>{f.srcdoc=`<!doctype html><html lang="es"><head><meta charset="utf-8"><style>${BASE}\n${css}</style></head><body>${h}</body></html>`;};
  $('button',v).onclick=v.play;c.insertBefore(v,$('textarea',c));io.observe(v);
  const par=el('div','g2');$$('textarea',c).forEach(t=>par.appendChild(t));c.appendChild(par);});
$$('textarea.src').forEach(t=>t.replaceWith(codeBox(t.dataset.lang,t.value,t.dataset.title)));

/* ---------- recorrido del manual (arriba) y siguiente / anterior (abajo) ---------- */
{const R=$('#recorrido');if(R){R.innerHTML=`<span class="rec-tit">Manual del bloque 08</span><ol>${MANUAL.map(m=>`<li class="${m[3]}${m[0]===aqui?' aqui':''}"><a href="${m[0]}"${m[0]===aqui?' aria-current="page"':''}><i>${m[1]}</i><span>${esc(m[2])}</span></a></li>`).join('')}</ol>`;}
 const S=$('#siguiente');const k=MANUAL.findIndex(m=>m[0]===aqui);
 if(S&&k>=0){const a=MANUAL[k-1],b=MANUAL[k+1];S.innerHTML=(a?`<a class="${a[3]}" href="${a[0]}"><small>◀ Anterior · ${a[1]}</small><b>${esc(a[2])}</b></a>`:'<span></span>')+(b?`<a class="${b[3]} der" href="${b[0]}"><small>Siguiente · ${b[1]} ▶</small><b>${esc(b[2])}</b></a>`:'');}}

/* ---------- unidad Supabase: red de metro animada con el avance de cada parte ---------- */
const SUPA=[
 ['04-supabase-inicio.html','1','Puesta en marcha','Cuenta, proyecto, panel y claves','40 min'],
 ['05-supabase-tablas.html','2','Tablas','Diseñar, crear y relacionar datos','60 min'],
 ['06-supabase-sql.html','3','Consultas SQL','Consola real y retos autocorregidos','75 min'],
 ['07-supabase-seguridad.html','4','Seguridad','RLS, usuarios y archivos','70 min'],
 ['08-supabase-web.html','5','Conecta tu web','El libro de visitas funcionando','90 min']];
const avance=pag=>{const t=lee('deploy:total:'+pag,0);return t?Math.round(lee('deploy:'+pag,[]).length/t*100):0;};
function redSupa(){const B=$('#bandaSb'),U=$('#unidadSb');if(!B&&!U)return;const k=SUPA.findIndex(x=>x[0]===aqui);
 const est=(x,i,g)=>{const p=avance(x[0]),yo=x[0]===aqui;return `<li class="${yo?'aqui':''}" style="--i:${i};--p:${p}"><a href="${x[0]}"${yo?' aria-current="page"':''}><i>${x[1]}</i><b>${esc(x[2])}</b>${g?`<small>${esc(x[3])} · ${x[4]}</small>`:''}<em>${p} %</em></a></li>`;};
 const red=g=>`<ol class="red-sb${g?' grande':''}">${SUPA.map((x,i)=>est(x,i,g)).join('')}<span class="tren-sb" aria-hidden="true"></span></ol>`;
 const total=Math.round(SUPA.reduce((s,x)=>s+avance(x[0]),0)/SUPA.length);
 if(B)B.innerHTML=`<span class="sb-tit">Unidad Supabase · ${k>=0?`parte ${k+1} de 5`:'5 partes'} · avance total ${total} %</span>${red(false)}`;
 if(U)U.innerHTML=`${red(true)}<p class="sb-total">Avance de toda la unidad: <b>${total} %</b></p>`;}
redSupa();

/* ---------- menú de secciones ---------- */
{const ul=$('#navUl'),secs=$$('section.sec');if(ul){
 secs.forEach((s,i)=>{const l=(s.className.match(/\bl\d\b/)||['l1'])[0];const li=el('li');li.innerHTML=`<a class="${l}" href="#${s.id}"><i></i>${String(i+1).padStart(2,'0')} · ${esc(s.dataset.nav)}</a>`;ul.appendChild(li);});
 const links=$$('a',ul);let last=-1;
 $('#navL').onclick=()=>ul.scrollBy({left:-260,behavior:'smooth'});$('#navR').onclick=()=>ul.scrollBy({left:260,behavior:'smooth'});
 const on=()=>{const dh=document.documentElement.scrollHeight-innerHeight;$('#prog').style.width=(dh>0?scrollY/dh*100:0)+'%';
  let c=-1;secs.forEach((s,i)=>{if(s.getBoundingClientRect().top<150)c=i;});
  if(c!==last){last=c;links.forEach((a,i)=>a.classList.toggle('on',i===c));if(c>=0){const a=links[c];ul.scrollLeft=a.offsetLeft-ul.clientWidth/2+a.clientWidth/2;}}};
 addEventListener('scroll',on,{passive:true});on();}}

/* ---------- misiones: cada <ol class="mision"> se convierte en casillas que se recuerdan ---------- */
{const ms=$$('ol.mision');if(ms.length){const clave='deploy:'+aqui;const hechas=new Set(lee(clave,[]));
 ms.forEach((ol,j)=>{$$(':scope > li',ol).forEach((li,i)=>{const id=(ol.dataset.id||'m'+j)+'-'+i;const cb=el('input');cb.type='checkbox';cb.checked=hechas.has(id);cb.dataset.id=id;
   const lab=el('label'),t=el('span','t');while(li.firstChild)t.appendChild(li.firstChild);lab.append(cb,t);li.appendChild(lab);});});
 const P=$('#progreso');let primera=true;const up=()=>{const cbs=$$('ol.mision input[type=checkbox]');const ok=cbs.filter(c=>c.checked);guarda(clave,ok.map(c=>c.dataset.id));guarda('deploy:total:'+aqui,cbs.length);
  // al marcar un paso solo se actualizan los números (sin repetir la animación de entrada)
  if(primera){primera=false;redSupa();}else{$$('.red-sb li.aqui').forEach(li=>{const p=avance(aqui);li.style.setProperty('--p',p);$('em',li).textContent=p+' %';});
   const tot=Math.round(SUPA.reduce((s,x)=>s+avance(x[0]),0)/SUPA.length);const st=$('.sb-tit');if(st)st.textContent=st.textContent.replace(/\d+ %$/,tot+' %');const sb=$('.sb-total b');if(sb)sb.textContent=tot+' %';}
  ms.forEach(ol=>{const c=$$('input[type=checkbox]',ol);ol.classList.toggle('completa',c.length&&c.every(x=>x.checked));});
  if(P)P.innerHTML=`<span>Tu avance en esta página</span><div class="barra-pf"><i style="width:${cbs.length?ok.length/cbs.length*100:0}%"></i></div><b>${ok.length} / ${cbs.length} pasos</b>`;};
 document.addEventListener('change',e=>{if(e.target.closest('ol.mision'))up();});up();}}

/* ---------- juego de clasificar ---------- */
function juego(host,marca,ops,items){const H=$(host),M=$(marca);if(!H)return;let ok=0,hechos=0;
 items.forEach(it=>{const c=el('div','carta');c.innerHTML=`<span>${it[0]}</span><span class="opc">${ops.map(o=>`<button class="chip" type="button">${o}</button>`).join('')}</span>`;
  $$('button',c).forEach(b=>b.onclick=()=>{if(c.dataset.r)return;c.dataset.r=1;hechos++;const bien=b.textContent===it[1];if(bien)ok++;c.classList.add(bien?'bien':'mal');
   $$('button',c).forEach(x=>{if(x.textContent===it[1])x.setAttribute('aria-pressed','true');x.disabled=true;});c.appendChild(el('span','ex',(bien?'✔ ':'✕ Era <b>'+it[1]+'</b>. ')+it[2]));
   M.textContent=`${ok} de ${hechos} aciertos${hechos===items.length?(ok===items.length?' · ¡perfecto!':' · repasa las que fallaste'):''}`;});H.appendChild(c);});}

/* ---------- pantallas simuladas (paso a paso) ---------- */
const lado=n=>`<div class="lado">${[0,1,2,3,4,5].map(k=>`<i class="${k===n?'on':''}"></i>`).join('')}</div>`;
function wizard(host,P){const W=$(host);if(!W)return;const scr=el('div','pantalla'),txt=el('div','wiz-txt');W.append(scr,txt);let i=0;
 function pinta(){const p=P[i];scr.innerHTML=`<div class="nav-b"><i></i><i></i><i></i><span>${esc(p.u)}</span></div><div class="cuerpo">${p.s}</div>`;
  txt.innerHTML=`<div class="paso">Paso ${i+1} de ${P.length}</div><h4>${p.t}</h4>${p.x}<div class="puntos">${P.map((_,k)=>`<i class="${k===i?'on':''}"></i>`).join('')}</div><div class="ctr"><button class="btn sm claro" type="button" ${i?'':'disabled'}>◀ Anterior</button><button class="btn sm" type="button" ${i<P.length-1?'':'disabled'}>Siguiente ▶</button></div>`;
  const [a,b]=$$('.ctr button',txt);a.onclick=()=>{i--;pinta();};b.onclick=()=>{i++;pinta();};}
 pinta();}

/* ---------- test ---------- */
function qBlock(host,list,onScore){const h=$(host);const cards=[];
 list.forEach((it,i)=>{const c=el('div','q');c.innerHTML=`<div class="qt"><span class="n">${i+1}</span><span>${it.q}</span></div>`;
  if(it.code)c.appendChild(codeBox(it.lang||'sql',it.code,it.title||(it.lang||'sql').toUpperCase()));
  const order=it.o.map((_,k)=>k);for(let k=order.length-1;k>0;k--){const j=Math.floor(Math.random()*(k+1));[order[k],order[j]]=[order[j],order[k]];}
  order.forEach(k=>{const l=el('label');l.innerHTML=`<input type="radio" name="${host.slice(1)}${i}" value="${k}"><span>${it.o[k]}</span>`;c.appendChild(l);});
  const ex=el('div','ex',it.e);c.appendChild(ex);
  c.grade=()=>{$$('label',c).forEach(l=>{l.classList.remove('right','wrong');const inp=$('input',l);if(+inp.value===it.a)l.classList.add('right');else if(inp.checked)l.classList.add('wrong');});ex.classList.add('show');};
  c.reset=()=>{$$('input',c).forEach(x=>x.checked=false);$$('label',c).forEach(l=>l.classList.remove('right','wrong'));ex.classList.remove('show');};
  c.right=()=>{const s=$('input:checked',c);return !!s&&+s.value===it.a;};
  c.addEventListener('change',()=>{c.grade();onScore();});cards.push(c);h.appendChild(c);});return cards;}
function test(Q,FIX){const sc=$('#qScore');if(!sc)return;let cards=[];const upd=()=>{sc.textContent=`${cards.filter(c=>c.right()).length} / ${cards.length}`;};
 cards=[...qBlock('#quiz',Q||[],upd),...(FIX&&$('#fixes')?qBlock('#fixes',FIX,upd):[])];
 $('#qAll').onclick=()=>{cards.forEach(c=>c.grade());upd();};$('#qReset').onclick=()=>{cards.forEach(c=>c.reset());upd();};upd();}

/* ---------- aparición al hacer scroll (después de que la página haya añadido sus piezas) ---------- */
setTimeout(()=>{if('IntersectionObserver' in window&&!reduce){const ob=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');ob.unobserve(e.target);}}),{threshold:.04});$$('.rv').forEach(x=>ob.observe(x));}
 else $$('.rv').forEach(x=>x.classList.add('in'));},0);

window.M={$,$$,el,esc,reduce,guarda,lee,codeBox,juego,wizard,lado,test,MANUAL};
})();

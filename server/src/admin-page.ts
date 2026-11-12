// Área de administração: página única que edita o conteúdo do app pela API /api/admin.
// O script evita crases e "${" para caber dentro deste template literal.

export const adminPage = String.raw`<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bornly · Administração</title>
<style>
:root{--bg:#F4ECE3;--card:#FBF7F2;--ink:#2A2522;--muted:#8C7D73;--line:#E4D7CA;--sand:#EDE2D6;--terra:#A3604E;--sage:#E3EAE5;--sageInk:#4C6A60}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif}
h1,h2,.serif{font-family:Georgia,serif;font-weight:400;margin:0}button,input,textarea,select{font:inherit;color:inherit}
button{cursor:pointer;border:0;border-radius:999px;padding:10px 18px;background:var(--ink);color:var(--bg);font-weight:600}
button.ghost{background:transparent;color:var(--ink);border:1.5px solid var(--line)}button.danger{background:transparent;color:var(--terra);border:1.5px solid var(--line)}
input,textarea,select{width:100%;border:1.5px solid var(--line);border-radius:14px;background:#fff;padding:10px 14px}textarea{min-height:110px;resize:vertical}
label{display:block;font-size:12px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--muted);margin:14px 0 6px}
.wrap{display:flex;min-height:100vh}.side{width:270px;flex:none;padding:24px 16px;border-right:1px solid var(--line);position:sticky;top:0;height:100vh;overflow:auto}
.side a{display:block;padding:10px 14px;border-radius:14px;color:var(--ink);text-decoration:none;margin:2px 0}.side a.on{background:var(--ink);color:var(--bg)}
.side small{display:block;color:var(--muted);font-size:12px}.side a.on small{color:#d8ccc2}
main{flex:1;padding:28px 32px;min-width:0}.row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.grow{flex:1}
.card{background:var(--card);border-radius:20px;padding:18px 20px;margin:10px 0}.item{display:flex;gap:14px;align-items:center;padding:12px 4px;border-bottom:1px solid var(--line);cursor:pointer}
.item:last-child{border-bottom:0}.key{font:600 12px ui-monospace,Menlo,monospace;background:var(--sand);border-radius:8px;padding:3px 8px;flex:none}
.prev{color:#4A403B;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.muted{color:var(--muted)}.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}
.stat{background:var(--card);border-radius:18px;padding:16px}.stat b{display:block;font:400 30px Georgia,serif}.toast{position:fixed;right:20px;bottom:20px;background:var(--ink);color:var(--bg);padding:12px 18px;border-radius:999px;display:none}
.login{max-width:380px;margin:12vh auto;padding:0 20px}.err{color:var(--terra);font-size:14px;margin-top:10px}table{width:100%;border-collapse:collapse}td,th{text-align:left;padding:10px 6px;border-bottom:1px solid var(--line);font-size:14px}
@media(max-width:800px){.wrap{display:block}.side{width:auto;height:auto;position:static;border:0}main{padding:18px}}
</style></head><body>
<div id="app"></div><div class="toast" id="toast"></div>
<script>
var S={schema:[],col:null,items:[],edit:null,filter:''};
function el(h){var d=document.createElement('div');d.innerHTML=h;return d.firstElementChild}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function toast(m){var t=document.getElementById('toast');t.textContent=m;t.style.display='block';clearTimeout(t._t);t._t=setTimeout(function(){t.style.display='none'},2200)}
function api(path,method,body){return fetch(path,{method:method||'GET',credentials:'include',headers:{'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined}).then(function(r){if(!r.ok)throw r;return r.json()})}
var app=document.getElementById('app');

function login(msg){
  app.innerHTML='<div class="login"><h1 style="font-size:34px">Bornly</h1><p class="muted">Administração do conteúdo do app.</p><div class="card"><label>E-mail</label><input id="em" type="email" autocomplete="email"><label>Senha</label><input id="pw" type="password" autocomplete="current-password"><div style="margin-top:16px"><button id="go" style="width:100%">Entrar</button></div><div class="err" id="er">'+esc(msg||'')+'</div></div></div>';
  var go=function(){api('/api/auth/sign-in/email','POST',{email:document.getElementById('em').value.trim().toLowerCase(),password:document.getElementById('pw').value}).then(start).catch(function(){document.getElementById('er').textContent='E-mail ou senha incorretos.'})};
  document.getElementById('go').onclick=go;document.getElementById('pw').onkeydown=function(e){if(e.key==='Enter')go()};
}

function start(){
  api('/api/admin/me').then(function(){return api('/api/admin/schema')}).then(function(s){S.schema=s;route()}).catch(function(r){
    if(r&&r.status===403){api('/api/auth/sign-out','POST',{}).catch(function(){});login('Esta conta não tem acesso à administração.')}else login();
  });
}

function side(){
  var h='<aside class="side"><h2 style="font-size:24px;padding:0 14px 14px">Bornly</h2><a href="#painel" class="'+(location.hash==='#painel'||!location.hash?'on':'')+'">Painel<small>Números gerais</small></a>';
  S.schema.forEach(function(c){h+='<a href="#c/'+c.id+'" class="'+(S.col&&S.col.id===c.id?'on':'')+'">'+esc(c.label)+'<small>'+esc(c.id)+'</small></a>'});
  h+='<a href="#contas" class="'+(location.hash==='#contas'?'on':'')+'">Contas<small>Acesso à administração</small></a><div style="padding:14px"><button class="ghost" id="out">Sair</button></div></aside>';
  return h;
}

function route(){
  var h=location.hash.slice(1);
  if(h.indexOf('c/')===0){S.col=S.schema.find(function(c){return c.id===h.slice(2)});S.edit=null;S.filter='';return loadCol()}
  S.col=null;
  if(h==='contas')return users();
  return panel();
}
window.onhashchange=route;

function shell(inner){app.innerHTML='<div class="wrap">'+side()+'<main>'+inner+'</main></div>';document.getElementById('out').onclick=function(){api('/api/auth/sign-out','POST',{}).finally(function(){login()})}}

function panel(){
  shell('<h1 style="font-size:30px">Painel</h1><p class="muted">Contagens gerais. Dados de saúde individuais não aparecem aqui.</p><div class="stats" id="st"></div><h2 style="font-size:22px;margin-top:28px">E-mails</h2><div class="card" id="em"><p class="muted">Verificando...</p></div>');
  api('/api/admin/email').then(function(e){
    var h;
    if(!e.configured)h='<p><b>Desligados.</b> Falta a chave do Resend (RESEND_API_KEY) no Worker. Sem ela, nenhum e-mail sai: boas-vindas, confirmação, senha e lembretes.</p>';
    else{h='<p><b>Ligados.</b> Remetente: '+esc(e.from)+'</p>';
      if(e.domains)h+='<p class="muted">Domínios na conta: '+(e.domains.length?e.domains.map(function(d){return esc(d.name)+' ('+(d.status==='verified'?'verificado':esc(d.status))+')'}).join(', '):'nenhum')+'</p>';
      if(/resend\.dev/.test(e.from))h+='<p class="err">Sem domínio verificado, o Resend só entrega para o dono da conta. Verifique um domínio no Resend para enviar às usuárias.</p>';
      h+='<div style="margin-top:12px"><button id="et">Enviar e-mail de teste para mim</button></div>';}
    document.getElementById('em').innerHTML=h;
    var b=document.getElementById('et');if(b)b.onclick=function(){b.disabled=true;api('/api/admin/email/test','POST',{}).then(function(r){toast('Enviado para '+r.to)}).catch(function(){toast('O Resend recusou o envio. Veja o domínio e a chave.')}).finally(function(){b.disabled=false})};
  }).catch(function(){document.getElementById('em').innerHTML='<p class="muted">Não foi possível verificar.</p>'});
  api('/api/admin/stats').then(function(s){
    var L=[['users','Contas'],['usersWeek','Novas em 7 dias'],['activeWeek','Ativas em 7 dias'],['diary','Registros de diário'],['appointments','Consultas cadastradas'],['kicks','Contagens de movimentos'],['content','Itens de conteúdo']];
    document.getElementById('st').innerHTML=L.map(function(x){return '<div class="stat"><span class="muted">'+x[1]+'</span><b>'+s[x[0]]+'</b></div>'}).join('');
  });
}

function users(){
  shell('<h1 style="font-size:30px">Contas</h1><p class="muted">Quem tem acesso à administração. Crie uma conta nova abaixo ou dê acesso a quem já tem conta no app.</p><div class="card"><table id="ut"><tr><td class="muted">Carregando...</td></tr></table></div>'+
    '<h2 style="font-size:22px;margin-top:28px">Nova conta de administração</h2><div class="card"><label>Nome</label><input id="nu_n"><label>E-mail</label><input id="nu_e" type="email" autocomplete="off"><label>Senha (mínimo 8 caracteres)</label><input id="nu_p" type="password" autocomplete="new-password"><div style="margin-top:16px"><button id="nu_go">Criar conta</button></div></div>');
  document.getElementById('nu_go').onclick=function(){api('/api/admin/users','POST',{name:document.getElementById('nu_n').value,email:document.getElementById('nu_e').value,password:document.getElementById('nu_p').value}).then(function(r){toast(r.existed?'Essa conta já existia; acesso concedido.':'Conta criada com acesso à administração.');users()}).catch(function(){toast('Confira nome, e-mail e senha (mínimo 8 caracteres).')})};
  api('/api/admin/users').then(function(list){
    document.getElementById('ut').innerHTML='<tr><th>Nome</th><th>E-mail</th><th>Criada</th><th>Administração</th></tr>'+list.map(function(u){return '<tr><td>'+esc(u.name)+'</td><td>'+esc(u.email)+'</td><td>'+new Date(u.createdAt).toLocaleDateString('pt-BR')+'</td><td><button class="'+(u.admin?'danger':'ghost')+'" data-id="'+u.id+'" data-a="'+(u.admin?0:1)+'">'+(u.admin?'Remover acesso':'Dar acesso')+'</button></td></tr>'}).join('');
    document.querySelectorAll('#ut button').forEach(function(b){b.onclick=function(){api('/api/admin/users/'+b.dataset.id+'/admin','PUT',{admin:b.dataset.a==='1'}).then(function(){toast('Atualizado');users()}).catch(function(){toast('Não foi possível alterar')})}});
  });
}

function preview(it){var d=it.data;if(d.group)return d.group+(d.list?' · '+d.list:'');return d.title||d.question||d.topic||d.text||d.size||''}

function loadCol(){
  shell('<p class="muted">Carregando...</p>');
  api('/api/admin/items/'+S.col.id).then(function(items){S.items=items;list()});
}

function list(){
  var c=S.col,f=S.filter.toLowerCase();
  var rows=S.items.filter(function(it){return !f||(it.key+' '+JSON.stringify(it.data)).toLowerCase().indexOf(f)>=0});
  shell('<div class="row"><div class="grow"><h1 style="font-size:30px">'+esc(c.label)+'</h1><p class="muted" style="margin:4px 0 0">'+esc(c.description)+' '+S.items.length+' itens.</p></div><button id="new">Novo item</button></div>'+
    '<div style="margin:16px 0"><input id="q" placeholder="Buscar" value="'+esc(S.filter)+'"></div><div class="card" id="ls">'+
    (rows.length?rows.map(function(it){return '<div class="item" data-k="'+esc(it.key)+'"><span class="key">'+esc(it.key)+'</span><span class="prev grow">'+esc(preview(it))+'</span></div>'}).join(''):'<p class="muted">Nenhum item.</p>')+'</div>');
  document.getElementById('new').onclick=function(){form(null)};
  var q=document.getElementById('q');q.oninput=function(){S.filter=q.value;var pos=q.selectionStart;list();var n=document.getElementById('q');n.focus();n.setSelectionRange(pos,pos)};
  document.querySelectorAll('.item').forEach(function(r){r.onclick=function(){form(S.items.find(function(x){return x.key===r.dataset.k}))}});
}

function form(it){
  var c=S.col,isNew=!it;it=it||{key:'',position:S.items.length,data:{}};
  var h='<p><a href="#c/'+c.id+'" class="muted">Voltar para '+esc(c.label)+'</a></p><h1 style="font-size:28px">'+(isNew?'Novo item':(c.keyLabel==='Identificador'?esc(preview(it)||it.key):esc(c.keyLabel)+' '+esc(it.key)+(preview(it)?' · '+esc(preview(it)):'')))+'</h1><div class="card">';
  h+='<label>'+(c.keyLabel==='Identificador'?'Identificador (letras, números e hífen, sem espaços)':esc(c.keyLabel))+'</label><input id="f_key" value="'+esc(it.key)+'"'+(isNew?'':' disabled')+'>';
  h+='<label>Ordem</label><input id="f_pos" type="number" value="'+esc(it.position)+'">';
  c.fields.forEach(function(f){
    var v=it.data[f.name];if(f.type==='list'&&Array.isArray(v))v=v.join('\n');
    h+='<label>'+esc(f.label)+(f.required?' *':'')+'</label>'+(f.type==='select'?'<select id="f_'+f.name+'">'+(f.required?'':'<option value=""></option>')+(f.options||[]).map(function(o){return '<option'+(o===v?' selected':'')+'>'+esc(o)+'</option>'}).join('')+'</select>':f.type==='textarea'||f.type==='list'?'<textarea id="f_'+f.name+'">'+esc(v)+'</textarea>':'<input id="f_'+f.name+'" type="'+(f.type==='number'?'number':'text')+'" step="any" value="'+esc(v)+'">');
    if(f.name==='image')h+='<div id="imgprev" style="margin-top:8px">'+(v?'<img src="'+esc(v)+'" style="max-width:240px;border-radius:14px">':'')+'</div>';
  });
  h+='<div class="row" style="margin-top:20px"><button id="sv">Salvar</button>'+(isNew?'':'<button class="danger" id="dl">Excluir</button>')+'</div></div>';
  shell(h);
  var im=document.getElementById('f_image');if(im)im.oninput=function(){var u=im.value.trim();document.getElementById('imgprev').innerHTML=/^https?:\/\//.test(u)?'<img src="'+esc(u)+'" style="max-width:240px;border-radius:14px">':''};
  document.getElementById('sv').onclick=function(){
    var key=document.getElementById('f_key').value.trim();if(!/^[\w.-]+$/.test(key))return toast('Identificador inválido');
    var data={};c.fields.forEach(function(f){var v=document.getElementById('f_'+f.name).value;data[f.name]=f.type==='list'?v.split('\n'):v});
    api('/api/admin/items/'+c.id+'/'+encodeURIComponent(key),'PUT',{data:data,position:parseInt(document.getElementById('f_pos').value||'0',10)}).then(function(){toast('Salvo. O app recebe a mudança em até 1 minuto.');loadCol()}).catch(function(){toast('Confira os campos obrigatórios')});
  };
  var dl=document.getElementById('dl');if(dl)dl.onclick=function(){if(!confirm('Excluir este item?'))return;api('/api/admin/items/'+c.id+'/'+encodeURIComponent(it.key),'DELETE').then(function(){toast('Excluído');loadCol()})};
}

start();
</script></body></html>`;

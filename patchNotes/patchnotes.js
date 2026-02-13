// patchnotes.js
(function(){
  const NOTES = window.PATCH_NOTES || [];
  const CONFIG = Object.assign({ defaultTitle: "Patch notes" }, window.PATCH_CONFIG || {});

  const list = document.getElementById('list');
  if(!list){
    console.error("Elemento #list não encontrado.");
    return;
  }

  function makeItem(note){
    const item = document.createElement('article');
    item.className = 'item';

    const head = document.createElement('div');
    head.className = 'head';
    head.setAttribute('role','button');
    head.setAttribute('aria-expanded','false');

    const titleText = note.title && String(note.title).trim() ? note.title : CONFIG.defaultTitle;

    head.innerHTML = `
      <div class="head-left">
        <span class="ver">v${note.version}</span>
        <span class="title">${titleText}</span>
        <span class="date">— ${new Date(note.date).toLocaleDateString('pt-BR', { day:'2-digit', month:'short', year:'numeric' })}</span>
      </div>
      <div class="chevBtn" aria-hidden="true">⌄</div>
    `;

    const panel = document.createElement('div');
    panel.className = 'panel';

    if (note.highlights && note.highlights.length){
      const hi = document.createElement('div');
      hi.className = 'hi';
      note.highlights.forEach(h=>{
        const s = document.createElement('span');
        s.className = 'chip';
        s.innerHTML = h;
        hi.appendChild(s);
      });
      panel.appendChild(hi);
    }

    const groups = [
      ['Adicionado','add', note.added],
      ['Alterado','chg', note.changed],
      ['Corrigido','fix', note.fixed],
    ];
    groups.forEach(([label, cls, arr]) => {
      if(!arr || !arr.length) return;
      const sec = document.createElement('section');
      sec.className = 'group';
      sec.innerHTML = `<span class="tag ${cls}">${label}</span>`;
      const ul = document.createElement('ul');
      arr.forEach(t => {
        const li = document.createElement('li');
        li.innerHTML = t;
        ul.appendChild(li);
      });
      sec.appendChild(ul);
      panel.appendChild(sec);
    });

    head.addEventListener('click', () => toggleItem(item, panel, head));

    item.appendChild(head);
    item.appendChild(panel);
    return item;
  }

  function toggleItem(item, panel, head){
    const open = !item.classList.contains('open');
    item.classList.toggle('open', open);
    head.setAttribute('aria-expanded', open);
    panel.style.maxHeight = open ? (panel.scrollHeight + 14) + 'px' : '0px';
  }

  // render
  NOTES.forEach(n => list.appendChild(makeItem(n)));
})();

// notes.js
// Personalize aqui. Você pode mudar o título por versão (title)
// ou usar um título padrão em PATCH_CONFIG.defaultTitle.

window.PATCH_CONFIG = {
  defaultTitle: "Patch notes",  // título usado quando a versão não define 'title'
  downloadUrl: "https://pokekarion.com/patchNotes/update/client.zip"  // URL de download da atualização (Google Drive ou site direto)
};

window.PATCH_NOTES = [
  {
    version:"1.0.0",
    date:"2026-01-31",
    title:"Lançamento Oficial",
    highlights:["Primeira Geração"],
    added:["Sistema de desafios semanais com recompensas.","Sistema de Sexo nos Pokemons.", "Novas roupas para personalização do personagem.", "TMs reaproveitavéis.", "Novas áreas para explorar."],
    // changed:["Dano elétrico reduzido em 8% no PvP.","Loja: preços em cristais exibem economia em %."],
    // fixed:["Crash raro ao trocar de área durante combate.","Falha no login quando hora do sistema estava fora do fuso."]
  },
];

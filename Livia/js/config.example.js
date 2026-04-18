// ============================================================
//  ⚙️  CONFIGURAÇÃO EXEMPLO — Google Apps Script (Gmail SMTP)
//
//  ► Copie este arquivo para js/config.js
//  ► Preencha com sua URL real
//  ► NUNCA envie js/config.js para o GitHub (já está no .gitignore)
//
//  COMO CONFIGURAR (passo a passo):
//  ─────────────────────────────────────────────────────────────
//
//  1. Acesse https://script.google.com com o Gmail da dona da festa
//
//  2. Clique em "+ Novo projeto"
//
//  3. Apague o código padrão e cole o seguinte:
//
// ─────────────────────────────────────────────────────────────
// function doPost(e) {
//   try {
//     const data = JSON.parse(e.postData.contents);
//
//     const destinatario = 'EMAIL_DA_DONA_DA_FESTA@gmail.com';
//
//     const assunto = '✨ Nova confirmação de presença - Festa da Lívia';
//
//     const corpo = `
//       <div style="font-family:sans-serif;max-width:500px;margin:0 auto;">
//         <h2 style="color:#1f5f86;">✨ Nova Confirmação de Presença</h2>
//         <hr style="border-color:#eee;">
//         <p><b>Nome:</b> ${data.nome}</p>
//         <p><b>Acompanhantes:</b> ${data.acompanhantes}</p>
//         <p><b>Total de pessoas:</b> ${data.total_pessoas}</p>
//         <hr style="border-color:#eee;">
//         <p style="color:#888;font-size:12px;">Enviado pelo site da Festa da Lívia</p>
//       </div>
//     `;
//
//     GmailApp.sendEmail(destinatario, assunto, '', { htmlBody: corpo });
//
//     return ContentService
//       .createTextOutput(JSON.stringify({ success: true }))
//       .setMimeType(ContentService.MimeType.JSON);
//
//   } catch (err) {
//     return ContentService
//       .createTextOutput(JSON.stringify({ success: false, error: err.message }))
//       .setMimeType(ContentService.MimeType.JSON);
//   }
// }
// ─────────────────────────────────────────────────────────────
//
//  4. Substitua EMAIL_DA_DONA_DA_FESTA@gmail.com pelo e-mail real
//
//  5. Clique em "Implantar" → "Nova implantação"
//       Tipo: Aplicativo da Web
//       Executar como: Eu (conta Gmail da dona da festa)
//       Quem tem acesso: Qualquer pessoa
//     → Autorize quando solicitado
//     → Copie a URL gerada (começa com https://script.google.com/macros/s/...)
//
//  6. Cole a URL abaixo em js/config.js
// ─────────────────────────────────────────────────────────────

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/SUA_URL_AQUI/exec';

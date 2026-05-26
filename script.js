const GROQ_API_KEY =
"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";

/* MENU */

function toggleMenu() {

  const menu =
  document.getElementById('sideMenu');

  const overlay =
  document.getElementById('menuOverlay');

  menu.classList.toggle('active');

  overlay.classList.toggle('active');

}

/* TROCAR TELAS */

function showTab(tabName) {

  const tabs =
  document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {

    tab.classList.remove('active-grid');
    tab.classList.remove('active-flex');

  });

  if (tabName === 'home') {

    document.getElementById('tab-home')
    .classList.add('active-grid');

  }

  else if (tabName === 'perfil') {

    document.getElementById('tab-perfil')
    .classList.add('active-flex');

  }

  else {

    document.getElementById('tab-dev')
    .classList.add('active-flex');

  }

  const menu =
  document.getElementById('sideMenu');

  if (menu.classList.contains('active')) {

    toggleMenu();

  }

}

/* TROCAR IDIOMAS */

function swapLanguages() {

  const from =
  document.getElementById('fromLang');

  const to =
  document.getElementById('toLang');

  const temp =
  from.value;

  from.value =
  to.value;

  to.value =
  temp;

}

/* TRADUTOR */

async function traduzir() {

  const text =
  document.getElementById('inputText')
  .value
  .trim();

  const from =
  document.getElementById('fromLang')
  .value;

  const to =
  document.getElementById('toLang')
  .value;

  const output =
  document.getElementById('outputText');

  if (!text) {

    alert("Digite algo!");

    return;

  }

  output.value =
  "🌍 Traduzindo...";

  try {

    const response =
    await fetch(

      "https://translate.googleapis.com/translate_a/single?client=gtx&sl="
      + from +
      "&tl="
      + to +
      "&dt=t&q="
      + encodeURIComponent(text)

    );

    const data =
    await response.json();

    output.value =
    data[0]
    .map(item => item[0])
    .join("");

  }

  catch(error) {

    output.value =
    "❌ Erro ao traduzir.";

    console.error(error);

  }

}

/* IA REAL GROQ */

async function chamarIA() {

  const prompt =
  document.getElementById('iaInput')
  .value
  .trim();

  const responseDiv =
  document.getElementById('iaResponse');

  if (!prompt) {

    alert("Digite algo!");

    return;

  }

  responseDiv.innerHTML =
  "🤖 Pensando...";

  try {

    const response =
    await fetch(

      "https://api.groq.com/openai/v1/chat/completions",

      {

        method: "POST",

        headers: {

          "Content-Type":
          "application/json",

          "Authorization":
          `Bearer ${GROQ_API_KEY}`

        },

        body: JSON.stringify({

          model:
          "llama-3.1-8b-instant",

          messages: [

            {
              role: "system",
              content:
              "Você é a Creative AI, uma IA moderna e amigável."
            },

            {
              role: "user",
              content: prompt
            }

          ],

          temperature: 0.7,
          max_tokens: 500

        })

      }

    );

    if (!response.ok) {

      throw new Error(
        "Erro API"
      );

    }

    const data =
    await response.json();

    responseDiv.innerHTML =
    data.choices[0]
    .message
    .content;

  }

  catch(error) {

    console.error(error);

    responseDiv.innerHTML =
    "❌ Falha na conexão da IA.";

  }

}

/* VOZ */

function iniciarDetectarVoz() {

  const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

  if (!SpeechRecognition) {

    alert(
      "Use Chrome ou Opera GX atualizado."
    );

    return;

  }

  const recognition =
  new SpeechRecognition();

  recognition.lang =
  'pt-BR';

  recognition.start();

  const inputField =
  document.getElementById('inputText');

  inputField.value =
  "🎤 Escutando...";

  recognition.onresult =
  function(event) {

    const texto =
    event.results[0][0].transcript;

    inputField.value =
    texto;

    traduzir();

  };

}

/* ENTER PRA ENVIAR IA */

document
.addEventListener(

  'DOMContentLoaded',

  () => {

    const iaInput =
    document.getElementById('iaInput');

    if (iaInput) {

      iaInput.addEventListener(

        'keydown',

        function(e) {

          if (
            e.key === 'Enter'
            &&
            !e.shiftKey
          ) {

            e.preventDefault();

            chamarIA();

          }

        }

      );

    }

  }

);

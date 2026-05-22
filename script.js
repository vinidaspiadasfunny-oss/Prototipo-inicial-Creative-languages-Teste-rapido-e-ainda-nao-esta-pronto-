function toggleMenu() {
  const menu = document.getElementById('sideMenu');
  const overlay = document.getElementById('menuOverlay');
  if (menu && overlay) {
    menu.classList.toggle('active');
    overlay.classList.toggle('active');
  }
}

function showTab(tabName) {
  const homeTab = document.getElementById('tab-home');
  const devTab = document.getElementById('tab-dev');
  
  if (!homeTab || !devTab) return;

  if (tabName === 'home') {
    homeTab.className = 'tab-content active-grid grid-layout';
    devTab.className = 'tab-content dev-screen glass-card';
  } else if (tabName === 'voz') {
    homeTab.className = 'tab-content active-grid grid-layout';
    devTab.className = 'tab-content dev-screen glass-card';
    iniciarDetectarVoz();
  } else {
    homeTab.className = 'tab-content';
    devTab.className = 'tab-content dev-screen glass-card active-flex';
  }
  
  const menu = document.getElementById('sideMenu');
  if (menu && menu.classList.contains('active')) {
    toggleMenu();
  }
}

function swapLanguages() {
  const from = document.getElementById('fromLang');
  const to = document.getElementById('toLang');
  if (from && to) {
    const temp = from.value;
    from.value = to.value;
    to.value = temp;
  }
}

async function traduzir() {
  const text = document.getElementById('inputText').value.trim();
  const from = document.getElementById('fromLang').value;
  const to = document.getElementById('toLang').value;
  const outputField = document.getElementById('outputText');
  
  if (!text) return alert("Digite um texto!");
  outputField.value = "Traduzindo...";

  try {
    const url = `https://googleapis.com{from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const data = await res.json();
    
    if (data && data[0]) {
      let traducaoCompleta = "";
      data[0].forEach(parte => {
        if (parte[0]) traducaoCompleta += parte[0];
      });
      outputField.value = traducaoCompleta;
    } else {
      outputField.value = "Não foi possível traduzir.";
    }
  } catch (e) {
    outputField.value = "Erro ao conectar.";
  }
}

async function chamarIA() {
  const prompt = document.getElementById('iaInput').value.trim();
  const responseDiv = document.getElementById('iaResponse');

  if (!prompt) return alert("Digite algo para a IA!");
  responseDiv.innerHTML = "Pensando... 🤖";

  try {
    const res = await fetch(`https://pollinations.ai{encodeURIComponent(prompt)}`);
    if (!res.ok) throw new Error();
    const text = await res.text();
    responseDiv.innerHTML = text;
  } catch (e) {
    responseDiv.innerHTML = "❌ Erro ao processar o comando de IA.";
  }
}

function iniciarDetectarVoz() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return alert("Detecção de voz requer Chrome ou Opera GX atualizado.");

  const recognition = new SpeechRecognition();
  recognition.lang = 'pt-BR';
  const inputField = document.getElementById('inputText');
  inputField.value = "🎙️ Escutando...";
  recognition.start();

  recognition.onresult = function(event) {
    inputField.value = event.results[0][0].transcript;
    traduzir();
  };
}

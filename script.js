const GROQ_API_KEY = "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";

/* ==================== MENU E NAVEGAÇÃO ==================== */
function toggleMenu() {
  const menu = document.getElementById('sideMenu');
  const overlay = document.getElementById('menuOverlay');
  menu.classList.toggle('active');
  overlay.classList.toggle('active');
}

function showTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.style.display = 'none';
    tab.classList.remove('active-grid', 'active-flex');
  });

  if (tabName === 'home') {
    document.getElementById('tab-home').style.display = 'grid';
    document.getElementById('tab-home').classList.add('active-grid');
  } 
  else if (tabName === 'perfil') {
    document.getElementById('tab-perfil').style.display = 'flex';
    document.getElementById('tab-perfil').classList.add('active-flex');
  } 
  else if (tabName === 'comunidade') {
    document.getElementById('tab-comunidade').style.display = 'block';
    carregarPosts();
  } 
  else if (tabName === 'atividades') {
    document.getElementById('tab-atividades').style.display = 'block';
    carregarAtividades();
  } 
  else {
    document.getElementById('tab-dev').style.display = 'block';
  }

  if (document.getElementById('sideMenu').classList.contains('active')) {
    toggleMenu();
  }
}

/* ==================== TRADUTOR ==================== */
function swapLanguages() {
  const from = document.getElementById('fromLang');
  const to = document.getElementById('toLang');
  const temp = from.value;
  from.value = to.value;
  to.value = temp;
}

async function traduzir() {
  const text = document.getElementById('inputText').value.trim();
  const from = document.getElementById('fromLang').value;
  const to = document.getElementById('toLang').value;
  const output = document.getElementById('outputText');

  if (!text) {
    alert("Digite algo!");
    return;
  }

  output.value = "🌍 Traduzindo...";

  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`
    );
    const data = await response.json();
    output.value = data[0].map(item => item[0]).join("");
  } catch (error) {
    output.value = "❌ Erro ao traduzir.";
    console.error(error);
  }
}

/* ==================== IA GROQ ==================== */
async function chamarIA() {
  const prompt = document.getElementById('iaInput').value.trim();
  const responseDiv = document.getElementById('iaResponse');

  if (!prompt) {
    alert("Digite algo!");
    return;
  }

  responseDiv.innerHTML = "🤖 Pensando...";

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "Você é a Creative AI, uma IA moderna, útil e amigável." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) throw new Error("Erro na API");

    const data = await response.json();
    responseDiv.innerHTML = data.choices[0].message.content;
  } catch (error) {
    console.error(error);
    responseDiv.innerHTML = "❌ Falha na conexão com a IA.";
  }
}

/* ==================== VOZ ==================== */
function iniciarDetectarVoz() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Use Chrome ou Opera GX atualizado.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'pt-BR';
  recognition.start();

  const inputField = document.getElementById('inputText');
  inputField.value = "🎤 Escutando...";

  recognition.onresult = function(event) {
    const texto = event.results[0][0].transcript;
    inputField.value = texto;
    traduzir();
  };
}

/* ==================== COMUNIDADE ==================== */
let posts = JSON.parse(localStorage.getItem('posts')) || [];

function criarPost() {
  const texto = document.getElementById('postText').value.trim();
  const fileInput = document.getElementById('postImageInput');
  
  if (!texto) return alert("Escreva algo para publicar!");

  const post = {
    id: Date.now(),
    texto: texto,
    data: new Date().toLocaleString('pt-BR'),
    imagem: null
  };

  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      post.imagem = e.target.result;
      salvarPost(post);
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    salvarPost(post);
  }
}

function salvarPost(post) {
  posts.unshift(post);
  localStorage.setItem('posts', JSON.stringify(posts));
  document.getElementById('postText').value = '';
  document.getElementById('postImageInput').value = '';
  carregarPosts();
}

function carregarPosts() {
  const feed = document.getElementById('feed');
  feed.innerHTML = posts.length === 0 
    ? '<p style="text-align:center; color:#aaa; padding:20px;">Nenhuma publicação ainda. Seja o primeiro!</p>' 
    : '';

  posts.forEach(post => {
    const html = `
      <div class="glass-card post">
        <p>${post.texto}</p>
        ${post.imagem ? `<img src="${post.imagem}" style="max-width:100%; border-radius:16px; margin-top:10px;">` : ''}
        <small style="color:#aaa; display:block; margin-top:8px;">${post.data}</small>
      </div>`;
    feed.innerHTML += html;
  });
}

/* ==================== ATIVIDADES (Duolingo Style) ==================== */
let currentQuiz = [];
let currentQuestionIndex = 0;

const atividades = [
  { 
    lingua: "Inglês", 
    icon: "🇺🇸", 
    nivel: "Iniciante",
    quiz: [
      { q: "Como se diz 'Olá' em inglês?", options: ["Hello", "Goodbye", "Thank you", "Please"], answer: "Hello" },
      { q: "Qual é a tradução de 'Obrigado'?", options: ["Sorry", "Thank you", "Good morning", "Yes"], answer: "Thank you" },
      { q: "Complete: I ___ a student.", options: ["am", "is", "are", "be"], answer: "am" },
      { q: "Como se diz 'Água' em inglês?", options: ["Fire", "Earth", "Water", "Air"], answer: "Water" },
      { q: "Qual é o oposto de 'Big'?", options: ["Small", "Tall", "Hot", "Fast"], answer: "Small" }
    ]
  }
];

function carregarAtividades() {
  const container = document.getElementById('atividades-grid');
  container.innerHTML = '';

  atividades.forEach((atv, index) => {
    const card = document.createElement('div');
    card.className = 'glass-card activity-card';
    card.innerHTML = `
      <h3>${atv.icon} ${atv.lingua}</h3>
      <p><strong>${atv.nivel}</strong></p>
      <button onclick="iniciarQuiz(${index})" class="btn-primary btn-purple">Começar Atividade</button>
    `;
    container.appendChild(card);
  });
}

function iniciarQuiz(index) {
  currentQuiz = atividades[index].quiz;
  currentQuestionIndex = 0;
  document.getElementById('atividades-grid').style.display = 'none';
  document.getElementById('quiz-container').style.display = 'block';
  carregarPergunta();
}

function carregarPergunta() {
  const q = currentQuiz[currentQuestionIndex];
  document.getElementById('quiz-title').textContent = `Inglês - Pergunta ${currentQuestionIndex + 1}/${currentQuiz.length}`;
  document.getElementById('quiz-question').textContent = q.q;

  const optionsDiv = document.getElementById('quiz-options');
  optionsDiv.innerHTML = '';

  q.options.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'btn-primary';
    btn.style.margin = '8px 0';
    btn.style.width = '100%';
    btn.textContent = option;
    btn.onclick = () => verificarResposta(option, q.answer);
    optionsDiv.appendChild(btn);
  });

  document.getElementById('next-btn').style.display = 'none';
}

function verificarResposta(resposta, correta) {
  const botoes = document.querySelectorAll('#quiz-options button');
  botoes.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correta) btn.style.background = '#22c55e';
    if (btn.textContent === resposta && resposta !== correta) btn.style.background = '#ef4444';
  });
  document.getElementById('next-btn').style.display = 'block';
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < currentQuiz.length) {
    carregarPergunta();
  } else {
    alert("🎉 Parabéns! Você completou a atividade!\n\nVolte sempre para praticar mais.");
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('atividades-grid').style.display = 'grid';
  }
}

/* ==================== ENTER PARA IA ==================== */
document.addEventListener('DOMContentLoaded', () => {
  const iaInput = document.getElementById('iaInput');
  if (iaInput) {
    iaInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chamarIA();
      }
    });
  }
});

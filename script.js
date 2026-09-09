const chapters = ["intro", "video", "memories", "game", "finale"];
let tries = 2;
let bonusUnlocked = false;
let currentQuestionIndex = 0;
const nicknames = ["peepee", "peep", "babe", "baobao", "baby", "princess", "baobei"];
let nicknameIndex = 6;

setInterval(() => {
  nicknameIndex = (nicknameIndex + 1) % nicknames.length;
  document.querySelector(".nickname").textContent = nicknames[nicknameIndex];
}, 2200);

// Replace these with your real questions and answers. correct is the zero-based answer number.
const questions = [
  { q: "Where did we have our first real date?", answers: ["Our favorite restaurant", "The place it all started", "A late-night adventure"], correct: 1 },
  { q: "What is the nickname I use for you the most?", answers: ["Baby", "My love", "Pretty girl"], correct: 0 },
  { q: "What do I love most about us?", answers: ["Our adventures", "How we always choose each other", "Our food dates"], correct: 1 }
];

const gifts = [
  { icon: "✈️", title: "A vacation for us", description: "Pack your bags, baobei. We’re making new memories together." },
  { icon: "💎", title: "A Van Cleef necklace", description: "Something beautiful for my beautiful princess." },
  { icon: "👜", title: "A purse", description: "A new purse picked especially for you, baby." }
];

const memories = [
  { file: "assets/photo-1.jpg", caption: "The beginning of everything", fallback: "our first favorite memory" },
  { file: "assets/photo-2.jpg", caption: "The days I wish I could replay", fallback: "a day worth replaying" },
  { file: "assets/photo-3.jpg", caption: "My favorite place is next to you", fallback: "my favorite person" },
  { file: "assets/photo-4.jpg", caption: "You make life feel lighter", fallback: "one of our little moments" },
  { file: "assets/photo-5.jpg", caption: "Still choosing you, every day", fallback: "us, always" }
];

function showChapter(id) {
  document.querySelectorAll(".scene").forEach(s => s.classList.add("hidden"));
  const next = document.getElementById(id);
  next.classList.remove("hidden");
  next.classList.add("reveal");
  document.getElementById("progressBar").style.width = `${((chapters.indexOf(id) + 1) / chapters.length) * 100}%`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.getElementById("openBtn").addEventListener("click", () => showChapter("video"));
document.querySelectorAll("[data-next]").forEach(btn => btn.addEventListener("click", () => showChapter(btn.dataset.next)));
document.getElementById("replayBtn").addEventListener("click", () => { tries = 2; bonusUnlocked = false; updateTries(); showChapter("intro"); });

const video = document.getElementById("loveVideo");
video.addEventListener("loadeddata", () => document.getElementById("videoPlaceholder").style.display = "none");
video.addEventListener("error", () => document.getElementById("videoPlaceholder").style.display = "flex");

const grid = document.getElementById("photoGrid");
memories.forEach((m, i) => {
  const card = document.createElement("article");
  card.className = "photo-card";
  card.style.setProperty("--tilt", `${[-2, 2, -1, 1.5, -1.5][i]}deg`);
  const img = new Image(); img.src = m.file; img.alt = m.caption;
  img.onerror = () => { const f = document.createElement("div"); f.className = "photo-fallback"; f.textContent = m.fallback; img.replaceWith(f); };
  const caption = document.createElement("p"); caption.textContent = m.caption;
  card.append(img, caption); grid.appendChild(card);
});

const picker = document.getElementById("questionPicker");
questions.forEach((item, i) => {
  const button = document.createElement("button"); button.className = "question-choice";
  button.innerHTML = `<span>0${i + 1}</span> &nbsp; ${item.q}`;
  button.addEventListener("click", () => openQuestion(i)); picker.appendChild(button);
});

function openQuestion(index) {
  currentQuestionIndex = index;
  const item = questions[index]; picker.classList.add("hidden");
  document.getElementById("questionPanel").classList.remove("hidden");
  document.getElementById("questionNumber").textContent = `Question 0${index + 1}`;
  document.getElementById("questionText").textContent = item.q;
  const answers = document.getElementById("answers"); answers.innerHTML = "";
  item.answers.forEach((answer, i) => {
    const btn = document.createElement("button"); btn.className = "answer"; btn.textContent = answer;
    btn.addEventListener("click", () => checkAnswer(i === item.correct)); answers.appendChild(btn);
  });
}

document.getElementById("backBtn").addEventListener("click", () => {
  document.getElementById("questionPanel").classList.add("hidden"); picker.classList.remove("hidden");
  document.getElementById("feedback").textContent = "";
});

function checkAnswer(correct) {
  if (correct) {
    const gift = gifts[currentQuestionIndex];
    document.getElementById("giftIcon").textContent = gift.icon;
    document.getElementById("giftTitle").textContent = gift.title;
    document.getElementById("giftDescription").textContent = gift.description;
    document.getElementById("feedback").textContent = "That’s my girl ♡";
    setTimeout(() => showChapter("finale"), 850);
    return;
  }
  tries--; updateTries();
  const card = document.getElementById("gameCard"); card.classList.add("shake"); setTimeout(() => card.classList.remove("shake"), 400);
  const feedback = document.getElementById("feedback");
  if (tries === 1) feedback.textContent = "Come on baby, you got this! One more try ♡";
  else if (!bonusUnlocked) {
    bonusUnlocked = true;
    tries = 2;
    updateTries();
    feedback.textContent = "Okay peepee 😭 surprise—you get 2 extra tries. I know you got this!";
  } else {
    feedback.textContent = "Baobei nooo 😭 come get a little hint from me, then try again.";
    document.querySelectorAll(".answer").forEach(button => button.classList.add("disabled"));
  }
}

function updateTries() {
  document.getElementById("heart1").classList.toggle("lost-heart", tries < 1);
  document.getElementById("heart2").classList.toggle("lost-heart", tries < 2);
  document.getElementById("triesText").textContent = `${tries} ${bonusUnlocked ? "bonus " : ""}${tries === 1 ? "try" : "tries"} left`;
}

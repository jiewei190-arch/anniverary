const chapters = ["intro", "memories", "reasons", "video", "game", "finale", "letter"];
let tries = 2;
let bonusUnlocked = false;
let currentQuestionIndex = 0;
const catLines = {
  intro: ["Psst... peep! Tap me ♡", "Jie has been tweaking this site for HOURS 😭", "He told me to call you peep!", "He’s probably staring at your reaction right now 👀", "He says you’re his favorite person.", "I promised Jie I wouldn’t spoil the gifts!", "If this makes you cry, Jie wins 😼"],
  video: ["I’ll be quiet for this part 🥹", "Turn the sound up, baobao ♫", "He really wanted you to hear this.", "Okay I might cry too..."],
  memories: ["You two are disgustingly cute ♡", "Okayyy main characters!", "Keep scrolling, peep! 🌸", "Jie picked these just for you.", "He said every memory with you matters.", "October 2 is kind of a big deal around here!"],
  game: ["Choose wisely, peepee 👀", "I definitely don’t know the answers...", "Two secret chances are hiding here!", "Jie made me promise not to cheat.", "No pressure... only three gifts 😼"],
  reasons: ["Flip them all, peep! 🃏", "Jie wrote every single one of these 🥹", "Only twelve? He said there are way more.", "Okay these are making ME blush 😳"],
  letter: ["Shhh... reading time 🥹", "He rewrote this like ten times.", "Okay now I’m definitely crying 😿", "Happy anniversary, you two ♡"],
  finale: ["YOU DID IT!!!", "Happy anniversary, peep! ♡", "Now make Jie buy it 😼", "I knew you’d get it!", "Jie is definitely smiling right now."]
};
let currentChapter = "intro";
let catPoseIndex = 0;
const catPoses = [
  { src: "assets/chibi-cat-frame-0.png", action: "cat-sit" },
  { src: "assets/chibi-cat-frame-0.png", action: "cat-nap" },
  { src: "assets/chibi-cat-frame-3.png", action: "cat-wave" },
  { src: "assets/chibi-cat-frame-2.png", action: "cat-stretch" },
  { src: "assets/chibi-cat-frame-1.png", action: "cat-dance-once" },
  { src: "assets/chibi-cat-frame-0.png", action: "cat-sit" }
];

const questions = [
  { q: "Think about every single thing we’ve done together—what is my favorite memory of us?", match: "first-date", placeholder: "Type the memory..." },
  { q: "What was the first thing we did when we got to Vegas?", match: "bathroom", placeholder: "Type what we did..." },
  { q: "Which photo is my favorite of you? Enter the exact month, date, year, and time. Hint: it’s in your Favorites album and was taken with the Canon camera.", match: "photo-date", placeholder: "Example: Month DD, YYYY at 0:00 AM" }
];

const gifts = [
  { icon: "✈️", title: "A vacation for us", description: "Pack your bags, baobei. We’re making new memories together." },
  { icon: "💎", title: "A Van Cleef necklace", description: "Something beautiful for my beautiful princess." },
  { icon: "👜", title: "A purse", description: "A new purse picked especially for you, baby." }
];

const memories = [
  { file: "assets/photo-1.jpg", caption: "Vegas, baby", fallback: "Vegas" },
  { file: "assets/photo-2.jpg", caption: "You started this one", fallback: "you started this one" },
  { file: "assets/photo-3.jpg", caption: "New York. You said you weren’t cold.", fallback: "New York" },
  { file: "assets/photo-4.jpg", caption: "One of us behaved", fallback: "one of us behaved" },
  { file: "assets/photo-5.jpg", caption: "That sunset", fallback: "that sunset" },
  { file: "assets/photo-6.jpg", caption: "Freezing, and you brought him along", fallback: "freezing" },
  { file: "assets/photo-7.jpg", caption: "You did that without warning", fallback: "without warning" },
  { file: "assets/photo-8.jpg", caption: "You, and everyone else looking the wrong way", fallback: "the prettiest girl there" },
  { file: "assets/photo-9.jpg", caption: "The ring ♡", fallback: "the ring" }
];

function showChapter(id) {
  currentChapter = id;
  document.querySelectorAll(".scene").forEach(s => s.classList.add("hidden"));
  const next = document.getElementById(id);
  next.classList.remove("hidden");
  next.classList.add("reveal");
  document.getElementById("progressBar").style.width = `${((chapters.indexOf(id) + 1) / chapters.length) * 100}%`;
  window.scrollTo({ top: 0, behavior: "smooth" });
  setAmbient(id);
  burstHearts(14);
}

document.getElementById("openBtn").addEventListener("click", () => {
  document.getElementById("backgroundMusic").play().then(() => updateMusicButton(true)).catch(() => {});
  document.getElementById("envelope").classList.add("open");
  burstHearts(18);
  setTimeout(() => showChapter("memories"), 1150);
});
document.querySelectorAll("[data-next]").forEach(btn => btn.addEventListener("click", () => showChapter(btn.dataset.next)));

// The letter can be opened from the quiz or the gift, and Back returns to wherever she was
let letterReturn = "finale";
const letterBackLabels = { game: "← Back to the questions", finale: "← Back to your gift" };
document.querySelectorAll("[data-letter]").forEach(btn => btn.addEventListener("click", () => {
  letterReturn = currentChapter;
  document.querySelectorAll("[data-letter-back]").forEach(back => back.textContent = letterBackLabels[letterReturn] || "← Back");
  showChapter("letter");
}));
document.querySelectorAll("[data-letter-back]").forEach(btn => btn.addEventListener("click", () => showChapter(letterReturn)));
document.getElementById("replayBtn").addEventListener("click", () => {
  tries = 2; bonusUnlocked = false; updateTries();
  document.getElementById("envelope").classList.remove("open");
  document.getElementById("catCompanion").classList.remove("party");
  document.getElementById("questionPanel").classList.add("hidden");
  picker.classList.remove("hidden");
  document.getElementById("feedback").textContent = "";
  resetGiftBox();
  showChapter("intro");
});

const video = document.getElementById("loveVideo");
video.addEventListener("loadeddata", () => document.getElementById("videoPlaceholder").style.display = "none");
video.addEventListener("error", () => document.getElementById("videoPlaceholder").style.display = "flex");

const grid = document.getElementById("photoGrid");
memories.forEach((m, i) => {
  const card = document.createElement("article");
  card.className = "photo-card photo-reveal";
  card.style.setProperty("--tilt", `${[-2, 2, -1, 1.5, -1.5, 2.5, -2.5, 1, -1][i % 9]}deg`);
  const img = new Image(); img.src = m.file; img.alt = m.caption;
  img.onerror = () => { const f = document.createElement("div"); f.className = "photo-fallback"; f.textContent = m.fallback; img.replaceWith(f); };
  const caption = document.createElement("p"); caption.textContent = m.caption;
  card.append(img, caption); grid.appendChild(card);
  card.addEventListener("click", () => openLightbox(card, m.caption));
});

const secretMessages = [
  "One: you make ordinary days feel special ♡",
  "Two: you’re still the prettiest girl in every room ✦",
  "Three: I’d choose you in every lifetime 🌸",
  "Four: your smile is still my favorite notification 🎀",
  "Five: plot twist—the biggest surprise is still coming 👀"
];
document.querySelectorAll(".secret-heart").forEach((button, index) => {
  button.addEventListener("click", () => {
    button.classList.add("found");
    button.textContent = "♥";
    document.getElementById("secretMessage").textContent = secretMessages[index];
    burstHearts(10);
  });
});

const cuteGarden = document.getElementById("cuteGarden");
["🌸", "🎀", "♡", "✦", "🌷", "🫧", "🐾", "🌺", "💗", "🐈‍⬛", "🌸", "🎀", "♡", "✦", "🌷", "🫧", "🐾", "🌺", "💗", "🐈‍⬛", "🌸", "🎀", "♡", "✦", "🌷", "🫧", "🐾", "🌺", "💗", "🐈‍⬛"].forEach((symbol, index) => {
  const floater = document.createElement("span");
  floater.textContent = symbol;
  floater.style.left = `${4 + (index * 17) % 92}%`;
  floater.style.top = `${3 + (index * 29) % 91}%`;
  floater.style.setProperty("--float-delay", `${(index % 6) * -.9}s`);
  floater.style.setProperty("--float-speed", `${5 + (index % 4)}s`);
  cuteGarden.appendChild(floater);
});
[0, 1, 2, 3, 0, 3].forEach((pose, index) => {
  const kitty = document.createElement("img");
  kitty.className = "garden-kitty";
  kitty.src = `assets/chibi-cat-frame-${pose}.png`;
  kitty.alt = "";
  kitty.style.left = `${index % 2 ? 76 : 3}%`;
  kitty.style.top = `${11 + index * 15}%`;
  kitty.style.setProperty("--kitty-delay", `${index * -.8}s`);
  cuteGarden.appendChild(kitty);
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      burstHearts(4);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .28 });
document.querySelectorAll(".photo-reveal").forEach(card => revealObserver.observe(card));

document.addEventListener("pointerdown", event => {
  if (event.target.closest("button")) return;
  const sparkle = document.createElement("span");
  sparkle.className = "tap-sparkle";
  sparkle.textContent = Math.random() > .5 ? "✦" : "♡";
  sparkle.style.left = `${event.clientX}px`;
  sparkle.style.top = `${event.clientY}px`;
  document.body.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 850);
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
  const input = document.createElement("input");
  input.className = "answer-input";
  input.id = "answerInput";
  input.placeholder = item.placeholder;
  input.autocomplete = "off";
  input.setAttribute("aria-label", "Your answer");
  const submit = document.createElement("button");
  submit.className = "answer-submit";
  submit.textContent = "Lock in my answer ♡";
  const submitAnswer = () => checkAnswer(answerMatches(input.value, item.match));
  submit.addEventListener("click", submitAnswer);
  input.addEventListener("keydown", event => { if (event.key === "Enter") submitAnswer(); });
  answers.append(input, submit);
  setTimeout(() => input.focus(), 150);
}

function answerMatches(value, match) {
  const answer = value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  if (match === "first-date") return answer.includes("first") && answer.includes("date");
  if (match === "bathroom") return answer.includes("bathroom") || answer.includes("restroom") || answer.includes("toilet");
  if (match === "photo-date") {
    const hasDate = answer.includes("july 25 2026") || answer.includes("7 25 2026") || answer.includes("07 25 2026");
    const hasTime = answer.includes("8 06") && (answer.includes("am") || answer.includes("a m"));
    return hasDate && hasTime;
  }
  return false;
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
    document.getElementById("catCompanion").classList.add("party");
    burstHearts(36);
    confetti(140);
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

const cat = document.getElementById("catButton");
cat.addEventListener("click", () => {
  const lines = catLines[currentChapter];
  setCatLine(currentChapter, Math.floor(Math.random() * lines.length));
  nextCatPose();
  burstHearts(7);
});

function nextCatPose() {
  catPoseIndex = (catPoseIndex + 1) % catPoses.length;
  const pose = catPoses[catPoseIndex];
  document.getElementById("catImage").src = pose.src;
  cat.className = `cat-button ${pose.action}`;
}
setInterval(nextCatPose, 6500);

// The cat only talks when she taps it; the bubble fades away after a few seconds
let catBubbleTimer;
function setCatLine(chapter, index) {
  const bubble = document.getElementById("catBubble");
  bubble.textContent = catLines[chapter][index];
  bubble.classList.remove("pop");
  void bubble.offsetWidth;
  bubble.classList.add("pop", "show");
  clearTimeout(catBubbleTimer);
  catBubbleTimer = setTimeout(() => bubble.classList.remove("show"), 4000);
}

const music = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");
music.volume = 0.28;
musicToggle.addEventListener("click", () => {
  if (music.paused) music.play().then(() => updateMusicButton(true)).catch(() => {});
  else { music.pause(); updateMusicButton(false); }
});
function updateMusicButton(playing) {
  musicToggle.classList.toggle("playing", playing);
  musicToggle.querySelector("b").textContent = playing ? "playing" : "our song";
}

function burstHearts(amount) {
  const layer = document.getElementById("heartLayer");
  for (let i = 0; i < amount; i++) {
    const heart = document.createElement("i");
    heart.textContent = ["♡", "♥", "✦"][i % 3];
    heart.style.left = `${15 + Math.random() * 70}%`;
    heart.style.setProperty("--drift", `${-80 + Math.random() * 160}px`);
    heart.style.animationDelay = `${Math.random() * .25}s`;
    layer.appendChild(heart);
    setTimeout(() => heart.remove(), 2400);
  }
}

function updateTries() {
  document.getElementById("heart1").classList.toggle("lost-heart", tries < 1);
  document.getElementById("heart2").classList.toggle("lost-heart", tries < 2);
  document.getElementById("triesText").textContent = `${tries} ${bonusUnlocked ? "bonus " : ""}${tries === 1 ? "try" : "tries"} left`;
}

/* ---------- Deluxe extras ---------- */

// Background music: try to start right away, otherwise on her very first tap anywhere
function startMusic() {
  if (!music.paused) return;
  music.play().then(() => updateMusicButton(true)).catch(() => {});
}
startMusic();
["pointerdown", "keydown", "touchstart"].forEach(type => document.addEventListener(type, event => {
  if (event.target.closest && event.target.closest("#musicToggle")) return;
  startMusic();
}, { once: true, capture: true }));

// Preloader
window.addEventListener("load", () => setTimeout(() => document.getElementById("preloader").classList.add("done"), 700));
setTimeout(() => document.getElementById("preloader").classList.add("done"), 3500);

// Countdown to October 2
(function setCountdown() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let target = new Date(now.getFullYear(), 9, 2);
  if (target < today) target = new Date(now.getFullYear() + 1, 9, 2);
  const days = Math.round((target - today) / 86400000);
  document.getElementById("countdown").textContent = days === 0
    ? "Today is our day ♡"
    : `${days} ${days === 1 ? "sleep" : "sleeps"} until October 2 ♡`;
})();

/* ---------- Living background ----------
   One fixed layer behind every chapter. Each chapter gets its own palette
   (CSS, via body[data-chapter]) and its own particle mode on the canvas. */
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const ambientModes = { intro: "stars", memories: "bubbles", reasons: "hearts", video: "dust", game: "constellation", finale: "fireworks", letter: "fireflies" };
const starVisibility = { intro: 1, memories: 0, reasons: .9, video: .35, game: .8, finale: .75, letter: .6 };
const shootingChance = { intro: .006, reasons: .003, game: .002, finale: .002, letter: .002 };
const ambientEl = document.getElementById("ambient");
const skyCanvas = document.getElementById("starfield");
const sky = skyCanvas.getContext("2d");
const dpr = Math.min(window.devicePixelRatio || 1, 2);
let W = 0, H = 0, stars = [], motes = [], rockets = [], sparks = [], shooting = null;
let skyMode = "stars", skyChapter = "intro", starAlpha = 1, modeFade = 1, nextRocket = 0;
const pointer = { x: 0, y: 0, nx: 0, ny: 0, active: false, last: 0 };
const parallax = { x: 0, y: 0 };
let lastScrollVar = -1;

const rand = (a, b = 0) => b + Math.random() * (a - b);
const pick = list => list[Math.floor(Math.random() * list.length)];
const glowSprites = {};
function glowSprite(color) {
  if (glowSprites[color]) return glowSprites[color];
  const c = document.createElement("canvas"); c.width = c.height = 64;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, color); grad.addColorStop(.22, color + "aa"); grad.addColorStop(1, color + "00");
  g.fillStyle = grad; g.fillRect(0, 0, 64, 64);
  return (glowSprites[color] = c);
}
// Each heart color is drawn once (glow + shape) and then reused as an image every frame
const heartSprites = {};
function heartSprite(color) {
  if (heartSprites[color]) return heartSprites[color];
  const c = document.createElement("canvas"); c.width = c.height = 96;
  const g = c.getContext("2d");
  g.globalAlpha = .6; g.drawImage(glowSprite(color), 0, 0, 96, 96);
  g.globalAlpha = 1; g.fillStyle = color; heartPath(g, 48, 48, 32); g.fill();
  return (heartSprites[color] = c);
}
function heartPath(ctx, x, y, s) {
  ctx.beginPath();
  ctx.moveTo(x, y - s * .2);
  ctx.bezierCurveTo(x, y - s * .55, x - s * .55, y - s * .55, x - s * .55, y - s * .12);
  ctx.bezierCurveTo(x - s * .55, y + s * .2, x - s * .15, y + s * .35, x, y + s * .55);
  ctx.bezierCurveTo(x + s * .15, y + s * .35, x + s * .55, y + s * .2, x + s * .55, y - s * .12);
  ctx.bezierCurveTo(x + s * .55, y - s * .55, x, y - s * .55, x, y - s * .2);
  ctx.closePath();
}

function sizeSky() {
  const oldW = W, oldH = H;
  W = skyCanvas.width = Math.round(innerWidth * dpr);
  H = skyCanvas.height = Math.round(innerHeight * dpr);
  if (oldW && stars.length) {
    const kx = W / oldW, ky = H / oldH;
    [stars, motes, sparks, rockets].forEach(list => list.forEach(p => { p.x *= kx; p.y *= ky; }));
    if (reducedMotion) drawSky(performance.now());
    return;
  }
  stars = Array.from({ length: Math.min(420, Math.round(innerWidth * innerHeight / 4200)) }, () => ({
    x: rand(W), y: rand(H), r: rand(1.4, .3) * dpr, p: rand(Math.PI * 2), s: rand(2.2, .6), z: rand(1, .2), warm: Math.random() > .75
  }));
  motes = makeMotes(skyMode);
}

function makeMotes(mode) {
  const area = innerWidth * innerHeight;
  const count = (per, min, max) => Math.max(min, Math.min(max, Math.round(area / per)));
  if (mode === "bubbles") return Array.from({ length: count(26000, 14, 40) }, (_, i) => ({
    kind: i % 3 ? "bubble" : "glint", x: rand(W), y: rand(H), r: rand(26, 6) * dpr, vy: -rand(.5, .15) * dpr,
    wob: rand(6.28), z: rand(1, .4), color: pick(["#f4b6c8", "#e8c48d", "#cdb4f0", "#f7c2b0"]), p: rand(6.28)
  }));
  if (mode === "hearts") return Array.from({ length: count(38000, 12, 32) }, () => ({
    x: rand(W), y: rand(H), size: rand(18, 7) * dpr, vy: -rand(.6, .18) * dpr, p: rand(6.28), s: rand(1.4, .5),
    rot: rand(.4, -.4), a: rand(.7, .25), z: rand(1, .4), color: pick(["#e78b9e", "#f4b6c8", "#ffd9e4", "#e8c48d"])
  }));
  if (mode === "dust") return Array.from({ length: count(11000, 36, 100) }, () => ({
    x: rand(W), y: rand(H), r: rand(2, .5) * dpr, vx: rand(.12, -.12) * dpr, vy: rand(.18, -.05) * dpr, p: rand(6.28), z: rand(1, .3)
  }));
  if (mode === "constellation") return Array.from({ length: count(20000, 26, 70) }, () => ({
    x: rand(W), y: rand(H), vx: rand(.28, -.28) * dpr, vy: rand(.28, -.28) * dpr, r: rand(2.2, .8) * dpr, p: rand(6.28)
  }));
  if (mode === "fireflies") return Array.from({ length: count(32000, 14, 38) }, () => ({
    x: rand(W), y: rand(H), a: rand(6.28), sp: rand(.7, .2) * dpr, size: rand(34, 14) * dpr, p: rand(6.28), s: rand(1.6, .6)
  }));
  return [];
}

function setAmbient(id) {
  document.body.dataset.chapter = id;
  skyChapter = id;
  skyMode = ambientModes[id] || "stars";
  motes = makeMotes(skyMode);
  rockets = []; sparks = []; nextRocket = 0;
  modeFade = reducedMotion ? 1 : 0;
  if (reducedMotion) starAlpha = starVisibility[id] ?? 1;
  const bloom = document.getElementById("chapterBloom");
  bloom.classList.remove("play"); void bloom.offsetWidth; bloom.classList.add("play");
  if (reducedMotion) drawSky(performance.now());
}

const ease = (rate, dt) => 1 - Math.pow(1 - rate, dt);
function drawStars(t, dt) {
  const target = starVisibility[skyChapter] ?? 1;
  starAlpha += (target - starAlpha) * ease(.05, dt);
  if (starAlpha < .01) return;
  const scroll = scrollY * dpr;
  stars.forEach(st => {
    const x = st.x + parallax.x * 22 * st.z * dpr;
    const y = ((st.y - scroll * .06 * st.z + parallax.y * 22 * st.z * dpr) % H + H) % H;
    sky.globalAlpha = starAlpha * (.25 + .6 * (0.5 + 0.5 * Math.sin(st.p + t / 1000 * st.s)));
    sky.fillStyle = st.warm ? "#f6c6d3" : "#fff4ea";
    sky.beginPath(); sky.arc(x, y, st.r, 0, Math.PI * 2); sky.fill();
  });
  const chance = shootingChance[skyChapter] || 0;
  if (!shooting && Math.random() < ease(chance, dt)) shooting = { x: rand(W * .7), y: rand(H * .4), life: 1 };
  if (shooting) {
    const len = 140 * dpr;
    const g = sky.createLinearGradient(shooting.x, shooting.y, shooting.x - len, shooting.y - len * .45);
    g.addColorStop(0, `rgba(255,236,242,${shooting.life})`); g.addColorStop(1, "rgba(255,236,242,0)");
    sky.globalAlpha = starAlpha; sky.strokeStyle = g; sky.lineWidth = 1.8 * dpr;
    sky.beginPath(); sky.moveTo(shooting.x, shooting.y); sky.lineTo(shooting.x - len, shooting.y - len * .45); sky.stroke();
    sky.globalAlpha = starAlpha * shooting.life;
    sky.drawImage(glowSprite("#ffe6ef"), shooting.x - 10 * dpr, shooting.y - 10 * dpr, 20 * dpr, 20 * dpr);
    shooting.x += 15 * dpr * dt; shooting.y += 6.7 * dpr * dt; shooting.life -= .017 * dt;
    if (shooting.life <= 0) shooting = null;
  }
}

const modeDrawers = {
  bubbles(t, dt) {
    motes.forEach(b => {
      b.y += b.vy * dt; b.wob += .012 * dt;
      if (b.y < -b.r * 2) { b.y = H + b.r * 2; b.x = rand(W); }
      const x = b.x + Math.sin(b.wob) * 14 * dpr + parallax.x * 30 * b.z * dpr;
      const y = b.y + parallax.y * 30 * b.z * dpr;
      if (b.kind === "glint") {
        const tw = 0.5 + 0.5 * Math.sin(t / 600 + b.p);
        const s = (4 + b.r * .25) * (.6 + tw * .6);
        sky.globalAlpha = modeFade * (.25 + tw * .6);
        sky.fillStyle = "#e8b36a";
        sky.beginPath();
        sky.moveTo(x, y - s); sky.quadraticCurveTo(x, y, x + s, y); sky.quadraticCurveTo(x, y, x, y + s);
        sky.quadraticCurveTo(x, y, x - s, y); sky.quadraticCurveTo(x, y, x, y - s); sky.fill();
        return;
      }
      const g = sky.createRadialGradient(x - b.r * .35, y - b.r * .35, b.r * .05, x, y, b.r);
      g.addColorStop(0, "rgba(255,255,255,.85)"); g.addColorStop(.35, b.color + "55"); g.addColorStop(1, b.color + "18");
      sky.globalAlpha = modeFade * .75;
      sky.fillStyle = g; sky.beginPath(); sky.arc(x, y, b.r, 0, Math.PI * 2); sky.fill();
      sky.strokeStyle = b.color + "aa"; sky.lineWidth = 1.2 * dpr; sky.stroke();
    });
  },
  hearts(t, dt) {
    motes.forEach(h => {
      h.y += h.vy * dt;
      if (h.y < -h.size * 2) { h.y = H + h.size * 2; h.x = rand(W); }
      const x = h.x + Math.sin(t / 1400 * h.s + h.p) * 18 * dpr + parallax.x * 28 * h.z * dpr;
      const y = h.y + parallax.y * 28 * h.z * dpr;
      const box = h.size * 3 * (.8 + .2 * Math.sin(t / 500 + h.p));
      sky.save(); sky.translate(x, y); sky.rotate(h.rot + Math.sin(t / 1800 + h.p) * .15);
      sky.globalAlpha = modeFade * h.a;
      sky.drawImage(heartSprite(h.color), -box / 2, -box / 2, box, box); sky.restore();
    });
  },
  dust(t, dt) {
    // Same cone as the CSS projector beam: apex 12% above the top edge, about 24 degrees each side
    const cx = W / 2, apexY = -.12 * H, spread = Math.tan(28 * Math.PI / 180);
    motes.forEach(m => {
      m.x += (m.vx + Math.sin(t / 2400 + m.p) * .08 * dpr) * dt; m.y += m.vy * dt;
      if (m.x < 0) m.x += W; if (m.x > W) m.x -= W; if (m.y < 0) m.y += H; if (m.y > H) m.y -= H;
      const halfWidth = (m.y - apexY) * spread + 20 * dpr;
      const inBeam = Math.max(0, 1 - Math.abs(m.x - cx) / halfWidth);
      const flick = .6 + .4 * Math.sin(t / 900 + m.p);
      sky.globalAlpha = modeFade * (.18 + .75 * inBeam) * flick;
      const x = m.x + parallax.x * 16 * m.z * dpr, y = m.y + parallax.y * 16 * m.z * dpr;
      if (inBeam > .5 && m.r > 1.3 * dpr) sky.drawImage(glowSprite("#ffe2c8"), x - m.r * 4, y - m.r * 4, m.r * 8, m.r * 8);
      sky.fillStyle = "#ffe9d6"; sky.beginPath(); sky.arc(x, y, m.r, 0, Math.PI * 2); sky.fill();
    });
  },
  constellation(t, dt) {
    const link = 140 * dpr, reach = 190 * dpr;
    const pointerOn = pointer.active && t - pointer.last < 2500;
    motes.forEach(p => {
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });
    // Lines are grouped into a few brightness buckets so each bucket is one stroke
    const buckets = [new Path2D(), new Path2D(), new Path2D(), new Path2D()];
    const pointerLines = [new Path2D(), new Path2D(), new Path2D(), new Path2D()];
    const linkSq = link * link;
    for (let i = 0; i < motes.length; i++) {
      const a = motes[i];
      for (let j = i + 1; j < motes.length; j++) {
        const b = motes[j], dx = a.x - b.x, dy = a.y - b.y, dSq = dx * dx + dy * dy;
        if (dSq < linkSq) {
          const k = Math.min(3, Math.floor(Math.sqrt(dSq) / link * 4));
          buckets[k].moveTo(a.x, a.y); buckets[k].lineTo(b.x, b.y);
        }
      }
      if (pointerOn) {
        const d = Math.hypot(a.x - pointer.x, a.y - pointer.y);
        if (d < reach) {
          const k = Math.min(3, Math.floor(d / reach * 4));
          pointerLines[k].moveTo(a.x, a.y); pointerLines[k].lineTo(pointer.x, pointer.y);
          a.x += (pointer.x - a.x) * .002 * dt; a.y += (pointer.y - a.y) * .002 * dt;
        }
      }
    }
    sky.lineWidth = 1 * dpr;
    buckets.forEach((path, k) => { sky.globalAlpha = modeFade * (1 - (k + .5) / 4) * .32; sky.strokeStyle = "#e8c48d"; sky.stroke(path); });
    pointerLines.forEach((path, k) => { sky.globalAlpha = modeFade * (1 - (k + .5) / 4) * .6; sky.strokeStyle = "#f4b6c8"; sky.stroke(path); });
    motes.forEach(p => {
      const tw = .55 + .45 * Math.sin(t / 700 + p.p);
      sky.globalAlpha = modeFade * tw;
      sky.drawImage(glowSprite("#f4d7a8"), p.x - p.r * 4, p.y - p.r * 4, p.r * 8, p.r * 8);
      sky.fillStyle = "#fff4e2"; sky.beginPath(); sky.arc(p.x, p.y, p.r * .8, 0, Math.PI * 2); sky.fill();
    });
  },
  fireworks(t, dt) {
    if (t > nextRocket) {
      rockets.push({ x: rand(W * .85, W * .15), y: H + 10, vy: -rand(13, 9) * dpr, top: rand(H * .5, H * .12), color: pick(["#e78b9e", "#e8c48d", "#f4b6c8", "#ffd9e4", "#d75b7f"]), heart: Math.random() < .4 });
      nextRocket = t + rand(1900, 900);
    }
    rockets = rockets.filter(r => {
      r.y += r.vy * dt; r.vy *= Math.pow(.985, dt);
      sky.globalAlpha = modeFade * .9;
      sky.drawImage(glowSprite("#fff0dd"), r.x - 7 * dpr, r.y - 7 * dpr, 14 * dpr, 14 * dpr);
      sky.fillStyle = "#fff0dd"; sky.fillRect(r.x - dpr, r.y, 2 * dpr, 16 * dpr);
      if (r.y > r.top && r.vy < -1.5 * dpr) return true;
      const n = r.heart ? 70 : 60, power = rand(1.3, .9) * dpr;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        let vx, vy;
        if (r.heart) {
          vx = 16 * Math.pow(Math.sin(a), 3) * .2 * power;
          vy = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) * .2 * power;
        } else {
          const sp = rand(3.6, 1.2) * power;
          vx = Math.cos(a) * sp; vy = Math.sin(a) * sp;
        }
        sparks.push({ x: r.x, y: r.y, vx, vy, life: 1, decay: rand(.018, .011), color: i % 4 ? r.color : "#fff4e2" });
      }
      return false;
    });
    sky.lineWidth = 1.8 * dpr; sky.lineCap = "round";
    sparks = sparks.filter(s => {
      const drag = Math.pow(.975, dt);
      s.vx *= drag; s.vy = s.vy * drag + .035 * dpr * dt; s.x += s.vx * dt; s.y += s.vy * dt; s.life -= s.decay * dt;
      if (s.life <= 0) return false;
      sky.globalAlpha = modeFade * s.life * .9;
      sky.strokeStyle = s.color;
      sky.beginPath(); sky.moveTo(s.x - s.vx * 3, s.y - s.vy * 3); sky.lineTo(s.x, s.y); sky.stroke();
      return true;
    });
  },
  fireflies(t, dt) {
    const pointerOn = pointer.active && t - pointer.last < 2500;
    motes.forEach(f => {
      f.a += rand(.18, -.18) * Math.sqrt(dt);
      if (pointerOn) {
        const dx = pointer.x - f.x, dy = pointer.y - f.y;
        if (Math.hypot(dx, dy) < 260 * dpr) f.a += Math.sin(Math.atan2(dy, dx) - f.a) * .06 * dt;
      }
      f.x += Math.cos(f.a) * f.sp * dt; f.y += Math.sin(f.a) * f.sp * dt;
      if (f.x < -40) f.x = W + 40; if (f.x > W + 40) f.x = -40;
      if (f.y < -40) f.y = H + 40; if (f.y > H + 40) f.y = -40;
      const glow = .3 + .7 * Math.pow(0.5 + 0.5 * Math.sin(t / 800 * f.s + f.p), 2);
      sky.globalAlpha = modeFade * glow;
      sky.drawImage(glowSprite("#ffc86b"), f.x - f.size / 2, f.y - f.size / 2, f.size, f.size);
      sky.fillStyle = "#fff3cf"; sky.beginPath(); sky.arc(f.x, f.y, 1.4 * dpr, 0, Math.PI * 2); sky.fill();
    });
  },
  stars() {}
};

let lastSkyT = 0;
function drawSky(t) {
  const dt = lastSkyT ? Math.min(3, (t - lastSkyT) / 16.667) : 1;
  lastSkyT = t;
  sky.clearRect(0, 0, W, H);
  modeFade = Math.min(1, modeFade + .02 * dt);
  parallax.x += (pointer.nx - parallax.x) * ease(.05, dt);
  parallax.y += (pointer.ny - parallax.y) * ease(.05, dt);
  drawStars(t, dt);
  modeDrawers[skyMode](t, dt);
  sky.globalAlpha = 1;
  const scrollVar = Math.round(scrollY);
  if (scrollVar !== lastScrollVar) { ambientEl.style.setProperty("--sy", scrollVar); lastScrollVar = scrollVar; }
  ambientEl.style.setProperty("--px", parallax.x.toFixed(3));
  ambientEl.style.setProperty("--py", parallax.y.toFixed(3));
  if (!reducedMotion) requestAnimationFrame(drawSky);
}

["pointermove", "pointerdown"].forEach(type => document.addEventListener(type, event => {
  pointer.x = event.clientX * dpr; pointer.y = event.clientY * dpr;
  pointer.nx = event.clientX / innerWidth * 2 - 1; pointer.ny = event.clientY / innerHeight * 2 - 1;
  pointer.active = true; pointer.last = performance.now();
}, { passive: true }));
document.addEventListener("pointerleave", () => { pointer.active = false; pointer.nx = pointer.ny = 0; });

// Big soft out-of-focus lights drifting upward
const bokehLayer = document.getElementById("bokeh");
for (let i = 0; i < 14; i++) {
  const orb = document.createElement("span");
  const size = 40 + (i * 37) % 150;
  orb.style.width = orb.style.height = `${size}px`;
  orb.style.left = `${(i * 23 + 7) % 96}%`;
  orb.style.setProperty("--rise", `${22 + (i * 7) % 18}s`);
  orb.style.setProperty("--delay", `${-(i * 3.1) % 30}s`);
  orb.style.setProperty("--drift", `${((i % 5) - 2) * 30}px`);
  orb.style.setProperty("--o", `${.14 + (i % 4) * .06}`);
  bokehLayer.appendChild(orb);
}

sizeSky();
addEventListener("resize", sizeSky);
setAmbient("intro");
document.getElementById("chapterBloom").classList.remove("play");
requestAnimationFrame(drawSky);

// Soft falling petals
const petalLayer = document.getElementById("petalLayer");
for (let i = 0; i < 16; i++) {
  const petal = document.createElement("span");
  petal.style.left = `${Math.random() * 100}%`;
  petal.style.setProperty("--size", `${8 + Math.random() * 10}px`);
  petal.style.setProperty("--fall", `${11 + Math.random() * 10}s`);
  petal.style.setProperty("--delay", `${-Math.random() * 20}s`);
  petal.style.setProperty("--sway", `${40 + Math.random() * 90}px`);
  petalLayer.appendChild(petal);
}

// Sparkle trail for mouse users
let lastTrail = 0;
if (window.matchMedia("(pointer: fine)").matches) {
  document.addEventListener("pointermove", event => {
    if (event.timeStamp - lastTrail < 45) return;
    lastTrail = event.timeStamp;
    const dot = document.createElement("span");
    dot.className = "trail-dot";
    dot.style.left = `${event.clientX}px`;
    dot.style.top = `${event.clientY}px`;
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 700);
  });
}

// Memory lightbox
const lightbox = document.getElementById("lightbox");
function openLightbox(card, caption) {
  const media = document.getElementById("lightboxMedia");
  media.innerHTML = "";
  media.appendChild(card.firstElementChild.cloneNode(true));
  document.getElementById("lightboxCaption").textContent = caption;
  lightbox.classList.add("show");
  burstHearts(6);
}
function closeLightbox() { lightbox.classList.remove("show"); }
document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", event => { if (event.key === "Escape") closeLightbox(); });

// Reasons I love you — flip cards
const reasons = [
  "The way you say my name.",
  "How you laugh at my jokes — even the really bad ones.",
  "You make every place feel like home.",
  "The way you look at me when you think I’m not looking.",
  "You’re my favorite person to do absolutely nothing with.",
  "How deeply you care about the people you love.",
  "You make me want to be a better man.",
  "Your hugs fix basically everything.",
  "You’re gorgeous — and somehow even cuter when you just woke up.",
  "Every inside joke that only the two of us get.",
  "You believe in me, even when I don’t.",
  "Because it’s you. It’s always been you."
];
const reasonIcons = ["♡", "✦", "🌸", "🎀", "☾", "🫧", "♡", "✦", "🌷", "🐾", "☾", "💗"];
const reasonGrid = document.getElementById("reasonGrid");
let reasonsFound = 0;
document.getElementById("reasonTotal").textContent = reasons.length;
reasons.forEach((text, i) => {
  const card = document.createElement("button");
  card.className = "reason-card";
  card.style.setProperty("--i", i);
  card.setAttribute("aria-label", `Reason ${i + 1}`);
  card.innerHTML = `<span class="reason-inner"><span class="reason-front"><b>${String(i + 1).padStart(2, "0")}</b><i>${reasonIcons[i]}</i></span><span class="reason-back">${text}</span></span>`;
  card.addEventListener("click", () => {
    if (card.classList.contains("flipped")) return;
    card.classList.add("flipped");
    reasonsFound++;
    document.getElementById("reasonCount").textContent = reasonsFound;
    burstHearts(5);
    if (reasonsFound === reasons.length) {
      setTimeout(() => confetti(160), 500);
    }
  });
  reasonGrid.appendChild(card);
});

// Gift box unwrap on the finale
const giftBox = document.getElementById("giftBox");
giftBox.addEventListener("click", () => {
  if (giftBox.classList.contains("opening")) return;
  giftBox.classList.add("opening");
  setTimeout(() => {
    giftBox.classList.add("opened");
    document.getElementById("giftTap").classList.add("gone");
    document.getElementById("giftCard").classList.add("revealed");
    confetti(220);
    burstHearts(30);
  }, 900);
});
function resetGiftBox() {
  giftBox.classList.remove("opening", "opened");
  document.getElementById("giftTap").classList.remove("gone");
  document.getElementById("giftCard").classList.remove("revealed");
}

// Confetti
const confettiCanvas = document.getElementById("confetti");
const confettiCtx = confettiCanvas.getContext("2d");
let confettiPieces = [], confettiRunning = false;
function confetti(amount) {
  if (reducedMotion) return;
  confettiCanvas.width = innerWidth * devicePixelRatio;
  confettiCanvas.height = innerHeight * devicePixelRatio;
  const colors = ["#e78b9e", "#e8c48d", "#f8eee9", "#b8355b", "#f4b6c8", "#ffd9e4"];
  for (let i = 0; i < amount; i++) {
    confettiPieces.push({
      x: confettiCanvas.width / 2 + (Math.random() - .5) * 80 * devicePixelRatio,
      y: confettiCanvas.height * .55,
      vx: (Math.random() - .5) * 26 * devicePixelRatio,
      vy: -(8 + Math.random() * 18) * devicePixelRatio,
      w: (6 + Math.random() * 6) * devicePixelRatio,
      h: (8 + Math.random() * 8) * devicePixelRatio,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - .5) * .35,
      color: colors[i % colors.length],
      heart: Math.random() > .82
    });
  }
  if (!confettiRunning) { confettiRunning = true; requestAnimationFrame(drawConfetti); }
}
function drawConfetti() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiPieces.forEach(p => {
    p.vy += .45 * devicePixelRatio; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
    confettiCtx.save(); confettiCtx.translate(p.x, p.y); confettiCtx.rotate(p.rot);
    confettiCtx.fillStyle = p.color;
    if (p.heart) { confettiCtx.font = `${p.h * 1.6}px serif`; confettiCtx.fillText("♥", -p.w / 2, p.h / 2); }
    else confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.rot * 2)) + 1);
    confettiCtx.restore();
  });
  confettiPieces = confettiPieces.filter(p => p.y < confettiCanvas.height + 60);
  if (confettiPieces.length) requestAnimationFrame(drawConfetti);
  else { confettiRunning = false; confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height); }
}

// Let the video have the spotlight, then bring our song back
let musicWasPlaying = false;
video.addEventListener("play", () => { musicWasPlaying = !music.paused; music.pause(); updateMusicButton(false); });
["pause", "ended"].forEach(type => video.addEventListener(type, () => { if (musicWasPlaying) startMusic(); }));

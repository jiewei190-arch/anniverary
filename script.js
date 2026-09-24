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
  setCatLine(id, 0);
  burstHearts(14);
}

document.getElementById("openBtn").addEventListener("click", () => {
  document.getElementById("backgroundMusic").play().then(() => updateMusicButton(true)).catch(() => {});
  document.getElementById("envelope").classList.add("open");
  burstHearts(18);
  setTimeout(() => showChapter("memories"), 1150);
});
document.querySelectorAll("[data-next]").forEach(btn => btn.addEventListener("click", () => showChapter(btn.dataset.next)));
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
    setCatLine("intro", Math.min(index, catLines.intro.length - 1));
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

function setCatLine(chapter, index) {
  const bubble = document.getElementById("catBubble");
  bubble.textContent = catLines[chapter][index];
  bubble.classList.remove("pop");
  void bubble.offsetWidth;
  bubble.classList.add("pop");
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

// Twinkling starfield with the occasional shooting star
const starCanvas = document.getElementById("starfield");
const starCtx = starCanvas.getContext("2d");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let stars = [], shooting = null;
function sizeStars() {
  starCanvas.width = innerWidth * devicePixelRatio;
  starCanvas.height = innerHeight * devicePixelRatio;
  stars = Array.from({ length: Math.round(innerWidth * innerHeight / 5200) }, () => ({
    x: Math.random() * starCanvas.width,
    y: Math.random() * starCanvas.height,
    r: (Math.random() * 1.2 + .3) * devicePixelRatio,
    p: Math.random() * Math.PI * 2,
    s: .6 + Math.random() * 1.6,
    warm: Math.random() > .75
  }));
}
function drawStars(t) {
  starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
  stars.forEach(st => {
    starCtx.globalAlpha = .25 + .6 * (0.5 + 0.5 * Math.sin(st.p + t / 1000 * st.s));
    starCtx.fillStyle = st.warm ? "#f6c6d3" : "#fff4ea";
    starCtx.beginPath(); starCtx.arc(st.x, st.y, st.r, 0, Math.PI * 2); starCtx.fill();
  });
  if (!shooting && Math.random() < .004) {
    shooting = { x: Math.random() * starCanvas.width * .7, y: Math.random() * starCanvas.height * .4, life: 1 };
  }
  if (shooting) {
    const len = 120 * devicePixelRatio;
    const g = starCtx.createLinearGradient(shooting.x, shooting.y, shooting.x - len, shooting.y - len * .45);
    g.addColorStop(0, `rgba(255,236,242,${shooting.life})`); g.addColorStop(1, "rgba(255,236,242,0)");
    starCtx.globalAlpha = 1; starCtx.strokeStyle = g; starCtx.lineWidth = 1.6 * devicePixelRatio;
    starCtx.beginPath(); starCtx.moveTo(shooting.x, shooting.y); starCtx.lineTo(shooting.x - len, shooting.y - len * .45); starCtx.stroke();
    shooting.x += 14 * devicePixelRatio; shooting.y += 6.3 * devicePixelRatio; shooting.life -= .018;
    if (shooting.life <= 0) shooting = null;
  }
  if (!reducedMotion) requestAnimationFrame(drawStars);
}
sizeStars();
addEventListener("resize", sizeStars);
requestAnimationFrame(drawStars);

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
      document.getElementById("catBubble").textContent = "ALL TWELVE!! He means every one 🥹";
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

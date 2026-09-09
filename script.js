const chapters = ["intro", "memories", "video", "game", "finale"];
let tries = 2;
let bonusUnlocked = false;
let currentQuestionIndex = 0;
const catLines = {
  intro: ["Psst... peep! Tap me ♡", "Jie has been tweaking this site for HOURS 😭", "He told me to call you peep!", "He’s probably staring at your reaction right now 👀", "He says you’re his favorite person.", "I promised Jie I wouldn’t spoil the gifts!", "If this makes you cry, Jie wins 😼"],
  video: ["I’ll be quiet for this part 🥹", "Turn the sound up, baobao ♫", "He really wanted you to hear this.", "Okay I might cry too..."],
  memories: ["You two are disgustingly cute ♡", "Okayyy main characters!", "Keep scrolling, peep! 🌸", "Jie picked these just for you.", "He said every memory with you matters.", "October 2 is kind of a big deal around here!"],
  game: ["Choose wisely, peepee 👀", "I definitely don’t know the answers...", "Two secret chances are hiding here!", "Jie made me promise not to cheat.", "No pressure... only three gifts 😼"],
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
  { file: "assets/photo-1.jpg", caption: "The beginning of everything", fallback: "our first favorite memory" },
  { file: "assets/photo-2.jpg", caption: "The days I wish I could replay", fallback: "a day worth replaying" },
  { file: "assets/photo-3.jpg", caption: "My favorite place is next to you", fallback: "my favorite person" },
  { file: "assets/photo-4.jpg", caption: "You make life feel lighter", fallback: "one of our little moments" },
  { file: "assets/photo-5.jpg", caption: "Still choosing you, every day", fallback: "us, always" }
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
  showChapter("memories");
});
document.querySelectorAll("[data-next]").forEach(btn => btn.addEventListener("click", () => showChapter(btn.dataset.next)));
document.getElementById("replayBtn").addEventListener("click", () => { tries = 2; bonusUnlocked = false; updateTries(); showChapter("intro"); });

const video = document.getElementById("loveVideo");
video.addEventListener("loadeddata", () => document.getElementById("videoPlaceholder").style.display = "none");
video.addEventListener("error", () => document.getElementById("videoPlaceholder").style.display = "flex");

const grid = document.getElementById("photoGrid");
memories.forEach((m, i) => {
  const card = document.createElement("article");
  card.className = "photo-card photo-reveal";
  card.style.setProperty("--tilt", `${[-2, 2, -1, 1.5, -1.5][i]}deg`);
  const img = new Image(); img.src = m.file; img.alt = m.caption;
  img.onerror = () => { const f = document.createElement("div"); f.className = "photo-fallback"; f.textContent = m.fallback; img.replaceWith(f); };
  const caption = document.createElement("p"); caption.textContent = m.caption;
  card.append(img, caption); grid.appendChild(card);
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

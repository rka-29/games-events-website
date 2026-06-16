// ===== GAME DATA =====
const gameData = {
  3: {
    icon: '🕵️', bg: '#FFEAEA',
    title: 'المافيا',
    sub: 'الجميع مشتبه — من المجرم؟',
    steps: [
      'وزّع الأدوار: ٢ مافيا، ١ دكتور، الباقي مواطنون',
      'الكل يغمض عينيه — المافيا يتعرفون على بعض ثم يغمضون',
      'الدكتور يفتح ويختار من يحميه، ثم يغمض',
      'الجميع يصحى — نقاش ودفاع ثم تصويت لإقصاء مشتبه به',
      'الجمهور أقصى المافيا = الجمهور يفوز. المافيا صمدت = المافيا تفوز!'
    ],
    tip: '💡 ٨ إلى ١٢ لاعب هو العدد المثالي لجولة وحدة حماسية وما تطول!'
  },
  4: {
    icon: '🎬', bg: '#FDF5E0',
    title: 'من يعرفني أكثر؟',
    sub: 'فيديو مفاجأة — من الأقرب لقلبه؟',
    steps: [
      'قبل الفعالية: صوّر أحد أفراد العيلة يجاوب ٤-٥ أسئلة عن نفسه',
      'في الفعالية: شغّل الفيديو وقف بعد كل سؤال',
      'كل فريق يكتب جوابه على ورقة خلال ٢٠ ثانية',
      'بعد العد: كل فريق يرفع ورقته — من طابق الجواب يأخذ نقطة',
      'غيّروا الشخص في كل جولة للمفاجأة والتشويق!'
    ],
    tip: '💡 أسئلة مقترحة: ما أكلته المفضلة؟ أكثر شيء يضحكك؟ ما حلمك وأنت صغير؟ اللحظة اللي ما تنسى؟'
  },
  5: {
    icon: '🖼️', bg: '#FEF1E6',
    title: 'صورتك عمياء',
    sub: 'شرّح بلسانك ما تشوفه بعينك',
    steps: [
      'كل فريق يحصل على صورة سرية — ممنوع يشوفونها',
      'شخص يمسك الصورة بشكل مقلوب أو من ظهرها',
      'بقية الفريق يحاولون يوصفون الصورة لبعض',
      'الفريق الثاني يسمع كل شيء ويحاول يخمّن شنو الصورة',
      'من خمّن بدقة أكثر يأخذ النقطة!'
    ],
    tip: '💡 استخدموا صور مضحكة أو من مناسبات سابقة — ضحكات وذكريات في نفس الوقت!'
  }
};

// ===== PANELS =====
const ALL_PANELS = ['secretSection','mafiaSection','videoSection','detail','memSection','hexSection'];

function hideAll() {
  ALL_PANELS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
  });
  document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
}

function showGame(n) {
  hideAll();
  document.querySelectorAll('.menu-btn')[n - 1].classList.add('active');
  if (n === 1) {
    document.getElementById('secretSection').classList.add('open');
    initSecretGame();
    scroll2('secretSection');
    return;
  }
  if (n === 2) {
    document.getElementById('memSection').classList.add('open');
    setLevel('easy');
    scroll2('memSection');
    return;
  }
  if (n === 6) {
    document.getElementById('hexSection').classList.add('open');
    initHoneycomb();
    scroll2('hexSection');
    return;
  }
  if (n === 3) {
    document.getElementById('mafiaSection').classList.add('open');
    mafiaReset();
    scroll2('mafiaSection');
    return;
  }
  if (n === 4) {
    document.getElementById('videoSection').classList.add('open');
    vidInit();
    scroll2('videoSection');
    return;
  }
  const g = gameData[n];
  document.getElementById('dIcon').textContent      = g.icon;
  document.getElementById('dIconBg').style.background = g.bg;
  document.getElementById('dTitle').textContent     = g.title;
  document.getElementById('dSub').textContent       = g.sub;
  document.getElementById('dSteps').innerHTML       = g.steps.map((s, i) => `
    <li>
      <div class="step-n">${i + 1}</div>
      <div class="step-txt">${s}</div>
    </li>`).join('');
  document.getElementById('dTip').textContent = g.tip;
  document.getElementById('detail').classList.add('open');
  scroll2('detail');
}

function scroll2(id) {
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);
}

// ===== MEMORY GAME =====
const MEM_IMG_PATH = '../images/';

const EASY_IMGS = ['1.jpg','2.jpg','3.jpg','4.png'];
const HARD_IMGS = ['1.jpg','2.jpg','3.jpg','4.png','5.png','6.jpg','7.png','1.jpg'];

let memLevel = 'easy';
let flipped = [], matched = 0, moves = 0, canFlip = true;
let timerInterval = null, seconds = 0;

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function buildMemGrid(level) {
  clearInterval(timerInterval);
  flipped = []; matched = 0; moves = 0; seconds = 0; canFlip = true;
  updateMemStats();
  const win = document.getElementById('memWin');
  if (win) win.classList.remove('show');

  const imgs  = level === 'easy' ? EASY_IMGS : HARD_IMGS;
  const pairs = shuffle([...imgs, ...imgs]);
  const grid  = document.getElementById('memGrid');
  grid.className = 'mem-grid ' + level;
  grid.innerHTML = '';
  pairs.forEach(img => {
    const card = document.createElement('div');
    card.className = 'mem-card';
    card.dataset.emoji = img;
    card.innerHTML = `
      <div class="card-back"><span class="q-mark">؟</span></div>
      <div class="card-front">
        <img src="${MEM_IMG_PATH}${img}" alt="صورة" class="mem-card-img" draggable="false">
      </div>`;
    card.addEventListener('click', onMemClick);
    grid.appendChild(card);
  });
  startTimer();
}

function onMemClick() {
  if (!canFlip) return;
  if (this.classList.contains('flipped') || this.classList.contains('matched')) return;
  if (flipped.length >= 2) return;
  this.classList.add('flipped');
  flipped.push(this);
  if (flipped.length === 2) {
    moves++; updateMemStats(); canFlip = false;
    const [a, b] = flipped;
    if (a.dataset.emoji === b.dataset.emoji) {
      setTimeout(() => {
        a.classList.add('matched'); b.classList.add('matched');
        matched++; flipped = []; canFlip = true; updateMemStats();
        const total = memLevel === 'easy' ? 4 : 8;
        if (matched === total) winMem();
      }, 500);
    } else {
      setTimeout(() => {
        a.classList.add('wrong'); b.classList.add('wrong');
        setTimeout(() => {
          a.classList.remove('flipped','wrong');
          b.classList.remove('flipped','wrong');
          flipped = []; canFlip = true;
        }, 600);
      }, 600);
    }
  }
}

function startTimer() {
  clearInterval(timerInterval); seconds = 0;
  timerInterval = setInterval(() => {
    seconds++;
    const el = document.getElementById('memTime');
    if (el) el.textContent = seconds;
  }, 1000);
}

function updateMemStats() {
  const m = document.getElementById('memMoves');
  const p = document.getElementById('memMatched');
  if (m) m.textContent = moves;
  if (p) p.textContent = matched;
}

function winMem() {
  clearInterval(timerInterval);
  const w = document.getElementById('memWin');
  if (!w) return;
  const wt = document.getElementById('winTime');
  const wm = document.getElementById('winMoves');
  if (wt) wt.textContent = '⏱ الوقت: ' + seconds + ' ثانية';
  if (wm) wm.textContent = '🎯 المحاولات: ' + moves;
  w.classList.add('show');
}

function setLevel(lv) {
  memLevel = lv;
  document.querySelectorAll('.toggle-btn').forEach(b => b.classList.toggle('active', b.dataset.lv === lv));
  buildMemGrid(lv);
}

// ===== SCORE =====
let scores = [0, 0];

function pts(team, delta) {
  scores[team - 1] = Math.max(0, scores[team - 1] + delta);
  localStorage.setItem('eidScores', JSON.stringify(scores));
  const el = document.getElementById('s' + team);
  if (el) el.textContent = scores[team - 1];
  updateLeader();
}

function updateLeader() {
  ['l1','l2'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '';
  });
  ['box1','box2'].forEach(id => document.getElementById(id)?.classList.remove('leading'));

  if (scores[0] > scores[1]) {
    const el = document.getElementById('l1');
    if (el) el.innerHTML = '<span class="crown-tag">🏆 متقدم</span>';
    document.getElementById('box1')?.classList.add('leading');
  } else if (scores[1] > scores[0]) {
    const el = document.getElementById('l2');
    if (el) el.innerHTML = '<span class="crown-tag">🏆 متقدم</span>';
    document.getElementById('box2')?.classList.add('leading');
  } else if (scores[0] > 0) {
    const t = '<span class="crown-tag" style="background:rgba(100,150,255,0.2);color:#99C8FF">⚖️ تعادل</span>';
    const l1 = document.getElementById('l1');
    const l2 = document.getElementById('l2');
    if (l1) l1.innerHTML = t;
    if (l2) l2.innerHTML = t;
  }
}

function resetScores() {
  scores = [0, 0];
  localStorage.setItem('eidScores', JSON.stringify(scores));
  ['s1','s2'].forEach(id => { const el = document.getElementById(id); if(el) el.textContent = '0'; });
  ['l1','l2'].forEach(id => { const el = document.getElementById(id); if(el) el.innerHTML = ''; });
  ['box1','box2'].forEach(id => document.getElementById(id)?.classList.remove('leading'));
}
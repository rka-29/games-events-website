/* =========================================================
   HONEYCOMB.JS — خلية الحروف
   بأسئلة الحروف + أسماء الفرق من localStorage
   ========================================================= */

const HEX_QUESTIONS = {
  "أ": {
    question: "كلمة بمعنى أخذ الشيء والسيطرة عليه، سواء بشكل قانوني أو غير قانوني؟",
    answer: "استيلاء"
  },
  "ب": {
    question: "من الصحابي الذي كان من أوائل المهاجرين إلى الحبشة؟",
    answer: "بلال بن رباح"
  },
  "ت": {
    question: "كلمة بمعنى الانتظار بحذر لاقتناص الفرصة المناسبة لفعل ضرر بشخص ما؟",
    answer: "تربص"
  },
  "ث": {
    question: "مجموعة المعرفة المكتسبة مع مرور الوقت؟",
    answer: "ثقافة"
  },
  "ج": {
    question: "نظام سياسي يقوم على حكم الشعب نفسه؟",
    answer: "جمهورية"
  },
  "ح": {
    question: "اسم قديم لإثيوبيا؟",
    answer: "حبشة"
  },
  "خ": {
    question: "بمعنى صافي ونقي، وتستخدم للذهب النقي؟",
    answer: "خالص"
  },
  "د": {
    question: "اسم لمدينة مصرية؟",
    answer: "دمياط"
  },
  "ذ": {
    question: "شخص فطين ذكي عاقل صاحب قوة إدراك وحس؟",
    answer: "ذهين"
  },
  "ر": {
    question: "ماذا يسمى مراقبة النجوم؟",
    answer: "رصد النجوم"
  },
  "ز": {
    question: "هو ما يعلو الماء وغيره من الرغوة عند غليانه أو سرعة حركته؟",
    answer: "زبد"
  },
  "س": {
    question: "كلمة تقال عن الشعر القصير الذي يقال في الحكمة؟",
    answer: "سجع"
  },
  "ش": {
    question: "كلمة لوصف المواضيع التي تحتوي على صعوبات وتعقيدات؟",
    answer: "شائك"
  },
  "ص": {
    question: "في اللغة العربية بمعنى شق أو كسر في شيء صلب مثل الصخور والزجاج، ويطلق أحياناً على الشقوق في قشرة الأرض؟",
    answer: "صدع"
  },
  "ض": {
    question: "اسم من أسماء الأسد؟",
    answer: "ضاري / ضرغام"
  },
  "ط": {
    question: "القائد المسلم الذي قاد جيوش فتح الأندلس؟",
    answer: "طارق بن زياد"
  },
  "ظ": {
    question: "ما هو العذاب الذي أصاب قوم شعيب؟",
    answer: "الظلة"
  },
  "ع": {
    question: "تقسيم البشر على أساس باطل مثل لون البشرة والشعر؟",
    answer: "عنصرية"
  },
  "غ": {
    question: "سلوك ومهارات تولد مع الإنسان أو الحيوان ولا يتم اكتسابها؟",
    answer: "غريزة"
  },
  "ق": {
    question: "شيء كان يستخدم قديماً لحفظ الماء؟",
    answer: "قربة"
  },
  "ف": {
    question: "سورة في القرآن غير الفاتحة تبدأ بـ الحمد لله؟",
    answer: "فاطر"
  },
  "ك": {
    question: "مدينة عربية كانت عاصمة الخلافة العباسية؟",
    answer: "الكوفة"
  },
  "ل": {
    question: "شخصية كوميدية مصرية جسدها الممثل محمد سعد؟",
    answer: "اللمبي"
  },
  "م": {
    question: "مستحضر طبي زيتي يدهن على الجروح والحروق والطفح الجلدي وغيرها؟",
    answer: "مرهم"
  },
  "ن": {
    question: "من أي مادة يُستخرج الفازلين؟",
    answer: "نفط"
  },
  "ه": {
    question: "يوضع على ظهر الجمل لتجلس فيه النساء؟",
    answer: "هودج"
  },
  "و": {
    question: "مصطلح يطلق على السطوع الشديد أو الإضاءة التي تخرج من مصدر معين وتظهر لمعاناً أو إشعاعاً؟",
    answer: "وهج"
  },
  "ي": {
    question: "أين يقع سد مأرب؟",
    answer: "اليمن"
  }
};

/* ترتيب الحروف في الخلية */
const HEX_ROWS = [
  ["أ", "ب", "ت", "ث", "ج"],
  ["ح", "خ", "د", "ذ", "ر", "ز"],
  ["س", "ش", "ص", "ض", "ط", "ظ"],
  ["ع", "غ", "ق", "ف", "ك", "ل"],
  ["م", "ن", "ه", "و", "ي"]
];

let hexState = {};
let selectedHexId = null;
let currentTeam = "red";
let hexGameOver = false;

/* =========================
   أسماء الفرق
   ========================= */

function getStoredTeamNames() {
  try {
    return JSON.parse(localStorage.getItem("eidTeamNames") || '["الفريق الأول","الفريق الثاني"]');
  } catch (e) {
    return ["الفريق الأول", "الفريق الثاني"];
  }
}

function getTeamName(color) {
  const names = getStoredTeamNames();
  return color === "red" ? names[0] : names[1];
}

function updateHoneycombTeamTexts() {
  const redName = getTeamName("red");
  const blueName = getTeamName("blue");

  const claimRedBtn = document.getElementById("claimRedBtn");
  const claimBlueBtn = document.getElementById("claimBlueBtn");
  const hexScoreBtnRed = document.getElementById("hexScoreBtnRed");
  const hexScoreBtnBlue = document.getElementById("hexScoreBtnBlue");

  if (claimRedBtn) claimRedBtn.textContent = `أجاب صح — ${redName}`;
  if (claimBlueBtn) claimBlueBtn.textContent = `أجاب صح — ${blueName}`;
  if (hexScoreBtnRed) hexScoreBtnRed.textContent = `+١ لـ ${redName}`;
  if (hexScoreBtnBlue) hexScoreBtnBlue.textContent = `+١ لـ ${blueName}`;
}

/* =========================
   تشغيل اللعبة
   ========================= */

window.addEventListener("load", function () {
  updateHoneycombTeamTexts();
  renderHoneycomb();
  updateHexTurn();
});

/* =========================
   رسم الخلية
   ========================= */

function renderHoneycomb() {
  const grid = document.getElementById("hexGrid");
  if (!grid) return;

  grid.innerHTML = "";
  hexState = {};
  selectedHexId = null;
  hexGameOver = false;

  HEX_ROWS.forEach(function (row, rowIndex) {
    const rowDiv = document.createElement("div");
    rowDiv.className = "hex-row";

    row.forEach(function (letter, colIndex) {
      const id = `${rowIndex}-${colIndex}`;

      hexState[id] = {
        id,
        row: rowIndex,
        col: colIndex,
        letter,
        owner: null
      };

      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "hex-cell";
      cell.id = `hex-${id}`;
      cell.dataset.id = id;
      cell.dataset.letter = letter;
      cell.setAttribute("aria-label", `حرف ${letter}`);

      cell.innerHTML = `
        <div class="hex-inner">
          <span class="hex-letter">${letter}</span>
        </div>
      `;

      cell.addEventListener("click", function () {
        selectHex(id);
      });

      rowDiv.appendChild(cell);
    });

    grid.appendChild(rowDiv);
  });

  hideQuestionBox();

  const winBox = document.getElementById("hexWinMsg");
  if (winBox) {
    winBox.style.display = "none";
  }
}

/* =========================
   اختيار خلية
   ========================= */

function selectHex(id) {
  if (hexGameOver) return;

  const cellData = hexState[id];
  if (!cellData || cellData.owner) return;

  selectedHexId = id;

  document.querySelectorAll(".hex-cell").forEach(function (cell) {
    cell.classList.remove("selected");
  });

  const cell = document.getElementById(`hex-${id}`);
  if (cell) {
    cell.classList.add("selected");
  }

  const data = HEX_QUESTIONS[cellData.letter];

  document.getElementById("hexQletter").textContent = cellData.letter;
  document.getElementById("hexQtext").textContent = data.question;

  const answer = document.getElementById("hexQanswer");
  answer.textContent = "الإجابة: " + data.answer;
  answer.style.display = "none";

  const box = document.getElementById("hexQuestion");
  box.style.display = "block";
}

/* إظهار الجواب */
function showAnswer() {
  const answer = document.getElementById("hexQanswer");
  if (answer) {
    answer.style.display = "block";
  }
}

/* =========================
   احتساب الخلية للفريق
   ========================= */

function claimHex(team) {
  if (hexGameOver) return;

  if (!selectedHexId) {
    alert("اختاري خلية أولاً");
    return;
  }

  const data = hexState[selectedHexId];
  const cell = document.getElementById(`hex-${selectedHexId}`);

  if (!data || !cell) return;

  /* تجاوز */
  if (team === null) {
    selectedHexId = null;
    hideQuestionBox();
    switchTurn();
    return;
  }

  data.owner = team;

  cell.classList.remove("selected");
  cell.classList.add(team === "red" ? "owned-red" : "owned-blue");
  cell.disabled = true;

  hideQuestionBox();

  if (checkHexWinner(team)) {
    hexGameOver = true;
    showHexWinner(team);
    return;
  }

  selectedHexId = null;
  switchTurn();
}

/* إخفاء صندوق السؤال */
function hideQuestionBox() {
  const box = document.getElementById("hexQuestion");
  const answer = document.getElementById("hexQanswer");

  if (box) box.style.display = "none";
  if (answer) answer.style.display = "none";
}

/* تبديل الدور */
function switchTurn() {
  currentTeam = currentTeam === "red" ? "blue" : "red";
  updateHexTurn();
}

/* تحديث شارة الدور */
function updateHexTurn() {
  updateHoneycombTeamTexts();

  const turn = document.getElementById("hexTurn");
  if (!turn) return;

  turn.className = "turn-badge " + currentTeam;
  turn.textContent = "دور " + getTeamName(currentTeam);
}

/* =========================
   فحص الفوز
   الأحمر: من اليمين إلى اليسار
   الأزرق: من فوق إلى تحت
   ========================= */

function checkHexWinner(team) {
  const visited = new Set();
  const queue = [];

  if (team === "red") {
    Object.values(hexState).forEach(function (cell) {
      if (cell.owner === team && cell.col === 0) {
        queue.push(cell.id);
        visited.add(cell.id);
      }
    });

    while (queue.length > 0) {
      const id = queue.shift();
      const cell = hexState[id];

      if (cell.col === HEX_ROWS[cell.row].length - 1) {
        return true;
      }

      getHexNeighbors(id).forEach(function (nextId) {
        const next = hexState[nextId];

        if (next && next.owner === team && !visited.has(nextId)) {
          visited.add(nextId);
          queue.push(nextId);
        }
      });
    }
  }

  if (team === "blue") {
    Object.values(hexState).forEach(function (cell) {
      if (cell.owner === team && cell.row === 0) {
        queue.push(cell.id);
        visited.add(cell.id);
      }
    });

    while (queue.length > 0) {
      const id = queue.shift();
      const cell = hexState[id];

      if (cell.row === HEX_ROWS.length - 1) {
        return true;
      }

      getHexNeighbors(id).forEach(function (nextId) {
        const next = hexState[nextId];

        if (next && next.owner === team && !visited.has(nextId)) {
          visited.add(nextId);
          queue.push(nextId);
        }
      });
    }
  }

  return false;
}

/* الجيران */
function getHexNeighbors(id) {
  const cell = hexState[id];
  if (!cell) return [];

  const r = cell.row;
  const c = cell.col;
  const neighbors = [];

  addNeighbor(neighbors, r, c - 1);
  addNeighbor(neighbors, r, c + 1);

  addNeighbor(neighbors, r - 1, c);
  addNeighbor(neighbors, r + 1, c);

  const prevRowLength = HEX_ROWS[r - 1] ? HEX_ROWS[r - 1].length : 0;
  const nextRowLength = HEX_ROWS[r + 1] ? HEX_ROWS[r + 1].length : 0;
  const currentRowLength = HEX_ROWS[r].length;

  if (prevRowLength) {
    if (prevRowLength > currentRowLength) {
      addNeighbor(neighbors, r - 1, c + 1);
    } else {
      addNeighbor(neighbors, r - 1, c - 1);
    }
  }

  if (nextRowLength) {
    if (nextRowLength > currentRowLength) {
      addNeighbor(neighbors, r + 1, c + 1);
    } else {
      addNeighbor(neighbors, r + 1, c - 1);
    }
  }

  return neighbors;
}

function addNeighbor(list, row, col) {
  if (!HEX_ROWS[row]) return;
  if (col < 0 || col >= HEX_ROWS[row].length) return;

  list.push(`${row}-${col}`);
}

/* إعلان الفائز */
function showHexWinner(team) {
  const winBox = document.getElementById("hexWinMsg");
  const winText = winBox ? winBox.querySelector(".hex-win-text") : null;

  if (!winBox || !winText) return;

  if (team === "red") {
    winText.textContent = `🎉 فاز ${getTeamName("red")} بربط الخلية من اليمين إلى اليسار!`;
  } else {
    winText.textContent = `🎉 فاز ${getTeamName("blue")} بربط الخلية من فوق إلى تحت!`;
  }

  winBox.style.display = "block";
}

/* لعبة جديدة */
function resetHoneycomb() {
  currentTeam = "red";
  updateHoneycombTeamTexts();
  renderHoneycomb();
  updateHexTurn();
}
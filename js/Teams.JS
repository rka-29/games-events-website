// ===== TEAM SETUP =====

// مفاتيح الحفظ
const TEAM_NAMES_KEY = 'eidTeamNames';
const PLAYER_LIST_KEY = 'eidPlayerList';
const TEAM_SPLIT_KEY = 'eidTeamSplit';

// استرجاع أسماء الفرق
var _savedTN = localStorage.getItem(TEAM_NAMES_KEY);
let teamNames = _savedTN ? JSON.parse(_savedTN) : ['', ''];

// استرجاع أسماء اللاعبين
var _savedPlayers = localStorage.getItem(PLAYER_LIST_KEY);
let playerList = _savedPlayers ? JSON.parse(_savedPlayers) : ['', '', '', '', '', ''];

// استرجاع التقسيمة المحفوظة
var _savedSplit = localStorage.getItem(TEAM_SPLIT_KEY);
let savedTeamSplit = _savedSplit ? JSON.parse(_savedSplit) : null;

function initTeamSetup() {
  _renderPlayerInputs();
  _renderTeamNameInputs();

  const modal = document.getElementById('teamModal');

  if (savedTeamSplit) {
    _renderSplitResult(savedTeamSplit);
  } else {
    const splitResult = document.getElementById('splitResult');
    const splitResultInner = document.getElementById('splitResultInner');

    if (splitResult) splitResult.style.display = 'none';
    if (splitResultInner) splitResultInner.innerHTML = '';
  }

  if (modal) {
    modal.style.display = 'flex';

    requestAnimationFrame(function () {
      modal.classList.add('tm-visible');
    });
  }
}

function _safe(text) {
  return String(text || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function _savePlayers() {
  localStorage.setItem(PLAYER_LIST_KEY, JSON.stringify(playerList));
}

function _saveSplit() {
  if (savedTeamSplit) {
    localStorage.setItem(TEAM_SPLIT_KEY, JSON.stringify(savedTeamSplit));
  }
}

function _renderPlayerInputs() {
  const wrap = document.getElementById('playersWrap');
  const count = document.getElementById('tmPlayerCount');

  if (!wrap) return;

  wrap.innerHTML = '';

  if (count) {
    count.textContent = playerList.length + ' لاعبين';
  }

  playerList.forEach(function (name, i) {
    const row = document.createElement('div');
    row.className = 'tm-player-row';
    row.dataset.index = i;

    row.innerHTML = `
      <span class="tm-player-num">${i + 1}</span>

      <input
        class="tm-input tm-player-input"
        id="playerInput${i}"
        placeholder="اسم اللاعب ${i + 1}"
        maxlength="20"
        value="${_safe(name)}"
        oninput="playerList[${i}] = this.value; _savePlayers();"
      >

      ${
        playerList.length > 2
          ? `<button class="tm-remove-btn" type="button" onclick="removePlayer(${i})" title="حذف">✕</button>`
          : '<span class="tm-remove-placeholder"></span>'
      }
    `;

    wrap.appendChild(row);
  });
}

function _renderTeamNameInputs() {
  const team1 = document.getElementById('teamNameInput1');
  const team2 = document.getElementById('teamNameInput2');

  if (team1) team1.value = teamNames[0] || '';
  if (team2) team2.value = teamNames[1] || '';
}

function addPlayer() {
  _syncPlayerInputs();

  if (playerList.length >= 20) {
    _tmAlert('الحد الأقصى 20 لاعب');
    return;
  }

  playerList.push('');
  _savePlayers();
  _renderPlayerInputs();

  setTimeout(function () {
    const inp = document.getElementById('playerInput' + (playerList.length - 1));
    if (inp) inp.focus();
  }, 80);
}

function removePlayer(i) {
  _syncPlayerInputs();

  if (playerList.length <= 2) return;

  playerList.splice(i, 1);
  _savePlayers();
  _renderPlayerInputs();
}

function _syncPlayerInputs() {
  playerList = playerList.map(function (oldValue, i) {
    const el = document.getElementById('playerInput' + i);
    return el ? el.value.trim() : oldValue;
  });

  _savePlayers();
}

function splitTeams() {
  _syncPlayerInputs();

  const filled = playerList
    .map(function (n) {
      return n.trim();
    })
    .filter(Boolean);

  if (filled.length < 2) {
    _tmAlert('أدخل اسمين على الأقل!');
    return;
  }

  const shuffled = [...filled];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const half = Math.ceil(shuffled.length / 2);
  const team1Members = shuffled.slice(0, half);
  const team2Members = shuffled.slice(half);

  const t1name = document.getElementById('teamNameInput1').value.trim() || 'الفريق الأول';
  const t2name = document.getElementById('teamNameInput2').value.trim() || 'الفريق الثاني';

  savedTeamSplit = {
    team1Name: t1name,
    team2Name: t2name,
    team1Members: team1Members,
    team2Members: team2Members
  };

  _saveSplit();
  _renderSplitResult(savedTeamSplit);
  renderSavedTeamsUnderNames();
}

function _renderSplitResult(split) {
  const box = document.getElementById('splitResultInner');
  const result = document.getElementById('splitResult');

  if (!box || !result || !split) return;

  box.innerHTML = `
    <div class="split-col red-col">
      <div class="split-col-header">
        <span class="split-dot red-dot"></span>
        <span class="split-col-name">${_safe(split.team1Name)}</span>
        <span class="split-count">${split.team1Members.length}</span>
      </div>

      <ul class="split-list">
        ${split.team1Members.map(function (p) {
          return `<li class="split-item red-item">${_safe(p)}</li>`;
        }).join('')}
      </ul>
    </div>

    <div class="split-divider"></div>

    <div class="split-col blue-col">
      <div class="split-col-header">
        <span class="split-dot blue-dot"></span>
        <span class="split-col-name">${_safe(split.team2Name)}</span>
        <span class="split-count">${split.team2Members.length}</span>
      </div>

      <ul class="split-list">
        ${split.team2Members.map(function (p) {
          return `<li class="split-item blue-item">${_safe(p)}</li>`;
        }).join('')}
      </ul>
    </div>
  `;

  result.style.display = 'block';
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function saveTeamNames() {
  const t1 = document.getElementById('teamNameInput1').value.trim();
  const t2 = document.getElementById('teamNameInput2').value.trim();

  if (!t1 || !t2) {
    _tmAlert('اكتب اسم الفريقين!');
    return;
  }

  _syncPlayerInputs();

  teamNames[0] = t1;
  teamNames[1] = t2;

  localStorage.setItem(TEAM_NAMES_KEY, JSON.stringify(teamNames));
  localStorage.setItem(PLAYER_LIST_KEY, JSON.stringify(playerList));

  // تحديث أسماء الفرق داخل التقسيمة المحفوظة بدون مسح اللاعبين
  if (savedTeamSplit) {
    savedTeamSplit.team1Name = t1;
    savedTeamSplit.team2Name = t2;
    _saveSplit();
  }

  applyTeamNames();
  renderSavedTeamsUnderNames();
  closeTeamModal();
}

function closeTeamModal() {
  const modal = document.getElementById('teamModal');

  if (!modal) return;

  modal.classList.remove('tm-visible');

  setTimeout(function () {
    modal.style.display = 'none';
  }, 280);
}

function applyTeamNames() {
  const p1 = document.getElementById('pill1');
  const p2 = document.getElementById('pill2');

  if (p1) p1.textContent = teamNames[0] || 'الفريق الأول';
  if (p2) p2.textContent = teamNames[1] || 'الفريق الثاني';

  const l1 = document.getElementById('teamLabel1');
  const l2 = document.getElementById('teamLabel2');

  if (l1) l1.textContent = teamNames[0] || 'الفريق الأول';
  if (l2) l2.textContent = teamNames[1] || 'الفريق الثاني';

  document.querySelectorAll('.mem-team-btn, .hex-team-btn, .vid-team-btn').forEach(function (b) {
    if (b.dataset.team === '1') {
      b.textContent = '+١ لـ ' + (teamNames[0] || 'الفريق الأول');
    }

    if (b.dataset.team === '2') {
      b.textContent = '+١ لـ ' + (teamNames[1] || 'الفريق الثاني');
    }
  });

  document.querySelectorAll('.hex-team-btn[onclick*="claimHex"]').forEach(function (b) {
    if (b.dataset.team === '1') {
      b.textContent = 'أجاب صح — ' + (teamNames[0] || 'الفريق الأول');
    }

    if (b.dataset.team === '2') {
      b.textContent = 'أجاب صح — ' + (teamNames[1] || 'الفريق الثاني');
    }
  });

  if (typeof updateLeader === 'function') updateLeader();
  if (typeof updateHexTurnNames === 'function') updateHexTurnNames();

  renderSavedTeamsUnderNames();
}

function renderSavedTeamsUnderNames() {
  const pillsRow = document.querySelector('.pills-row');
  if (!pillsRow) return;

  let box = document.getElementById('savedTeamsSummary');

  if (!savedTeamSplit) {
    if (box) box.remove();
    return;
  }

  if (!box) {
    box = document.createElement('div');
    box.id = 'savedTeamsSummary';
    box.className = 'saved-teams-summary';
    pillsRow.insertAdjacentElement('afterend', box);
  }

  box.innerHTML = `
    <div class="saved-team-card">
      <div class="saved-team-title">${_safe(savedTeamSplit.team1Name || teamNames[0] || 'الفريق الأول')}</div>
      <div class="saved-team-members">
        ${savedTeamSplit.team1Members.map(function (p) {
          return `<span>${_safe(p)}</span>`;
        }).join('')}
      </div>
    </div>

    <div class="saved-team-card">
      <div class="saved-team-title">${_safe(savedTeamSplit.team2Name || teamNames[1] || 'الفريق الثاني')}</div>
      <div class="saved-team-members">
        ${savedTeamSplit.team2Members.map(function (p) {
          return `<span>${_safe(p)}</span>`;
        }).join('')}
      </div>
    </div>
  `;
}

function updateHexTurnNames() {
  const el = document.getElementById('hexTurn');

  if (!el) return;

  if (el.classList.contains('red')) {
    el.textContent = 'دور ' + (teamNames[0] || 'الفريق الأول');
  }

  if (el.classList.contains('blue')) {
    el.textContent = 'دور ' + (teamNames[1] || 'الفريق الثاني');
  }
}

function getTeamName(color) {
  return color === 'red'
    ? (teamNames[0] || 'الفريق الأول')
    : (teamNames[1] || 'الفريق الثاني');
}

function _tmAlert(msg) {
  const el = document.getElementById('tmAlert');

  if (!el) return;

  el.textContent = msg;
  el.style.opacity = '1';

  setTimeout(function () {
    el.style.opacity = '0';
  }, 2200);
}

// عند فتح الصفحة: طبّق الأسماء واعرض التقسيمة المحفوظة
window.addEventListener('load', function () {
  applyTeamNames();
  renderSavedTeamsUnderNames();
});
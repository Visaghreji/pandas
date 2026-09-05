/* ============================================================
   progress.js
   Handles XP, badges, and "last visited section" only.
   Nothing here gates content — a learner can open any section
   at any time. localStorage is a convenience, not a lock.
   If localStorage is unavailable, everything below degrades
   quietly to an in-memory object for the current visit.
   ============================================================ */

const STORAGE_KEY = 'pandasDataLab.progress.v1';

const BADGE_DEFS = [
  { id: 'beginner',  icon: '🏆', label: 'Pandas Beginner',  needsSection: 'intro' },
  { id: 'cleaner',   icon: '🧹', label: 'Data Cleaner',     needsSection: 'missing' },
  { id: 'explorer',  icon: '🔎', label: 'Data Explorer',    needsSection: 'explore' },
  { id: 'filterer',  icon: '⚡', label: 'Filtering Master', needsSection: 'filtering' },
  { id: 'analyst',   icon: '📊', label: 'GroupBy Analyst',  needsSection: 'groupby' },
  { id: 'graduate',  icon: '🎓', label: 'Pandas Data Analyst', needsSection: 'final' },
];

function defaultState() {
  return {
    xp: 0,
    completedSections: [],   // section ids the learner has finished
    quizStats: { correct: 0, total: 0 },
    lastSection: 'welcome',
  };
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return Object.assign(defaultState(), parsed);
  } catch (e) {
    // localStorage blocked/unavailable — fall back silently.
    return defaultState();
  }
}

let state = loadProgress();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    /* storage unavailable — progress just won't survive a refresh */
  }
}

function addXP(amount) {
  state.xp = Math.max(0, state.xp + amount);
  persist();
  refreshProgressUI();
}

function recordQuizAnswer(isCorrect) {
  state.quizStats.total += 1;
  if (isCorrect) state.quizStats.correct += 1;
  persist();
}

function markSectionComplete(sectionId) {
  if (!state.completedSections.includes(sectionId)) {
    state.completedSections.push(sectionId);
    addXP(50);
  }
  persist();
  refreshProgressUI();
}

function isSectionComplete(sectionId) {
  return state.completedSections.includes(sectionId);
}

function setLastSection(sectionId) {
  state.lastSection = sectionId;
  persist();
}

function getEarnedBadges() {
  return BADGE_DEFS.filter((b) => state.completedSections.includes(b.needsSection));
}

function totalXPTarget() {
  return SECTIONS.length * 50;
}

function getProgressPercent() {
  return Math.round((state.completedSections.length / SECTIONS.length) * 100);
}

function quizAccuracyPercent() {
  if (state.quizStats.total === 0) return 0;
  return Math.round((state.quizStats.correct / state.quizStats.total) * 100);
}

/* Re-renders every bit of chrome that shows progress: header
   badge, dashboard stats, sidebar checkmarks, mission map. */
function refreshProgressUI() {
  const pct = getProgressPercent();

  document.querySelectorAll('[data-progress-percent]').forEach((el) => {
    el.textContent = pct + '%';
  });
  document.querySelectorAll('[data-progress-bar]').forEach((el) => {
    el.style.width = pct + '%';
  });
  document.querySelectorAll('[data-xp-value]').forEach((el) => {
    el.textContent = state.xp;
  });
  document.querySelectorAll('[data-xp-target]').forEach((el) => {
    el.textContent = totalXPTarget();
  });
  document.querySelectorAll('[data-missions-done]').forEach((el) => {
    el.textContent = state.completedSections.length;
  });
  document.querySelectorAll('[data-missions-total]').forEach((el) => {
    el.textContent = SECTIONS.length;
  });
  document.querySelectorAll('[data-quiz-accuracy]').forEach((el) => {
    el.textContent = quizAccuracyPercent() + '%';
  });

  const badgeRow = document.getElementById('badge-row');
  if (badgeRow) {
    const earned = getEarnedBadges();
    badgeRow.innerHTML = earned.length
      ? earned.map((b) => `<span class="badge" title="${b.label}">${b.icon} ${b.label}</span>`).join('')
      : `<span class="badge badge--empty">Complete missions to earn badges</span>`;
  }

  renderSidebar();
  renderMissionMap();
}

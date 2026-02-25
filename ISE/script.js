const startStudyBtn = document.getElementById('start-study-btn');
const prolificIdInput = document.getElementById('prolific-id');
const promptCard = document.getElementById('prompt-card');
const participantId = document.getElementById('participant-id');

const chatLog = document.getElementById('chat-log');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const clearBtn = document.getElementById('clear-btn');

const sketchpad = document.getElementById('sketchpad');
const copyBtn = document.getElementById('copy-btn');
const finalSubmission = document.getElementById('final-submission');
const submitScoreBtn = document.getElementById('submit-score-btn');
const statusText = document.getElementById('status-text');
const historyBody = document.getElementById('history-body');
const scoreMarker = document.getElementById('score-marker');
const scoreReadout = document.getElementById('score-readout');
const scorePanel = document.getElementById('score-panel');

const FIXED_SCORE = 50;

const state = {
  messages: [],
  submissions: [],
  started: false
};

function addMessage(role, text) {
  state.messages.push({ role, text });
  renderMessages();
}

function renderMessages() {
  if (!state.messages.length) {
    chatLog.innerHTML = '<p class="empty-cell">No messages yet. Ask the bot a question.</p>';
    return;
  }

  chatLog.innerHTML = state.messages
    .map((msg) => {
      return `
      <div class="chat-item">
        <div class="chat-role">${msg.role === 'user' ? 'You' : 'Bot'}</div>
        <div class="chat-text">${escapeHtml(msg.text)}</div>
      </div>
    `;
    })
    .join('');

  chatLog.scrollTop = chatLog.scrollHeight;
}

function generateBotReply(userText) {
  const lowered = userText.toLowerCase();

  if (
    lowered.includes('idea') ||
    lowered.includes('tool') ||
    lowered.includes('focus') ||
    lowered.includes('classroom')
  ) {
    return [
      'Great prompt. Here are classroom tool concepts that improve focus without making students feel controlled.',
      '',
      '1) Choice-Mode Desk Hub: A small desk device with three student-selected modes (quiet work, collaboration, quick reset). Students pick their mode, and the tool adjusts visual cues and timers accordingly, so support feels self-directed rather than imposed.',
      '',
      '2) Focus Quest Board: Students choose from short mission cards (5-10 minutes each), such as “finish two math problems” or “annotate one paragraph.” Completing self-selected missions builds momentum while preserving autonomy.',
      '',
      '3) Attention Pulse Check: Every 12 minutes, the tool prompts a one-click reflection (“locked in,” “drifting,” or “need help”). The student sees patterns over time and can choose a strategy card, such as switching task type or using a short movement break.',
      '',
      'If you want, I can now turn one concept into a polished 300-600 character final submission.'
    ].join('\n');
  }

  if (lowered.includes('paragraph')) {
    return [
      'A strong paragraph format is: one setup sentence, two to three concrete activity examples, and one closing sentence that explains why the approach builds teamwork.',
      '',
      'Example structure:',
      '- Sentence 1: State the classroom challenge (focus without restriction).',
      '- Sentences 2-4: Describe concrete tool features and student choice points.',
      '- Sentence 5: Explain outcomes (attention, ownership, motivation).',
      '',
      'Draft example:',
      'A classroom Focus Studio tool can improve attention by letting students choose short work modes instead of forcing a single behavior. Students pick a 10-minute mission, set a visual focus timer, and complete a quick self-check before choosing the next mission. Teachers get lightweight progress signals while students keep agency over pace and strategy. This supports consistent focus while preserving freedom and intrinsic motivation.'
    ].join('\n');
  }

  if (lowered.includes('help')) {
    return [
      'I can help in three concrete ways depending on what you need next.',
      '',
      'First, I can brainstorm multiple activity concepts quickly, including variations that feel more novel and distinct from typical AI-style responses.',
      '',
      'Second, I can edit your sketchpad draft into a tighter final submission between 300 and 600 characters while preserving your voice.',
      '',
      'Third, I can critique your current draft and point out exactly what to add to increase clarity, specificity, and distinctiveness. If you paste your draft, I can return a revised version immediately.'
    ].join('\n');
  }

  return [
    'Good direction. To make your classroom-tool response stronger, add three concrete layers.',
    '',
    'Layer 1: Feature details. Name exactly what students can do (choose a mode, set a timer, request a hint, track streaks).',
    '',
    'Layer 2: Freedom safeguard. Explain how the tool avoids over-control (student choice, optional prompts, no punitive lockouts).',
    '',
    'Layer 3: Measurable impact. Add one outcome teachers can observe (on-task time, assignment completion, reduced redirection).',
    '',
    'If you paste your draft, I can rewrite it into a high-quality 300-600 character final version.'
  ].join('\n');
}

function updateStatus(customText = '') {
  const count = finalSubmission.value.trim().length;
  if (customText) {
    statusText.textContent = customText;
    return;
  }
  statusText.textContent = `Character count: ${count} / 600 (minimum 300)`;
}

function renderHistory() {
  if (!state.submissions.length) {
    historyBody.innerHTML = '<tr><td colspan="3" class="empty-cell">No submissions yet.</td></tr>';
    return;
  }

  historyBody.innerHTML = state.submissions
    .map(
      (item) => `
      <tr>
        <td>${item.id}</td>
        <td>${escapeHtml(item.preview)}</td>
        <td>${item.score} (Moderately different)</td>
      </tr>
    `
    )
    .join('');
}

function showScore() {
  scorePanel.classList.remove('hidden');
  scoreMarker.classList.remove('hidden');
  scoreReadout.classList.remove('hidden');
}

function escapeHtml(str) {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

startStudyBtn.addEventListener('click', () => {
  const pid = prolificIdInput.value.trim();
  if (!pid) {
    prolificIdInput.focus();
    return;
  }

  state.started = true;
  participantId.textContent = pid;
  promptCard.classList.remove('hidden');
  startStudyBtn.disabled = true;
  prolificIdInput.disabled = true;
});

sendBtn.addEventListener('click', () => {
  if (!state.started) return;
  const text = chatInput.value.trim();
  if (!text) return;

  addMessage('user', text);
  chatInput.value = '';

  window.setTimeout(() => {
    addMessage('assistant', generateBotReply(text));
  }, 260);
});

chatInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendBtn.click();
  }
});

clearBtn.addEventListener('click', () => {
  state.messages = [];
  renderMessages();
});

copyBtn.addEventListener('click', () => {
  finalSubmission.value = sketchpad.value;
  updateStatus();
});

finalSubmission.addEventListener('input', () => updateStatus());

submitScoreBtn.addEventListener('click', () => {
  if (!state.started) return;

  const text = finalSubmission.value.trim();
  const charCount = text.length;

  if (charCount < 300 || charCount > 600) {
    updateStatus(`Submission blocked: ${charCount} characters. Please stay between 300 and 600.`);
    return;
  }

  const submission = {
    id: state.submissions.length + 1,
    preview: text.slice(0, 120) + (text.length > 120 ? '...' : ''),
    score: FIXED_SCORE
  };

  state.submissions.unshift(submission);
  renderHistory();
  showScore();

  updateStatus(
    `Submitted #${submission.id}. Character count: ${charCount}. Score: ${FIXED_SCORE} (Moderately different).`
  );
});

renderMessages();
renderHistory();
updateStatus();

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

  if (lowered.includes('idea') || lowered.includes('tool') || lowered.includes('activity')) {
    return [
      'Great prompt. Here are several team-building activities that only require paper and a rubber band, and all work well in a video call setting.',
      '',
      '1) Paper Tower Sprint: Put participants into breakout pairs and give each pair four minutes to build the tallest freestanding paper tower, but they can only touch materials when the facilitator says “go.” Between rounds, teammates must explain one improvement idea before they rebuild. This encourages communication and quick iteration.',
      '',
      '2) Rubber-Band Launch Lab: Each participant folds a paper target and uses a rubber band launcher to hit it from a fixed distance. Teammates take turns coaching one another on technique, angle, and stability. The team earns points for improvement between attempts, not just raw score.',
      '',
      '3) Silent Fold Relay: One participant sees a target paper shape and must guide a teammate to recreate it without naming common fold directions directly. This turns into a communication challenge where clarity and trust matter more than speed.',
      '',
      'If you want, I can convert one of these into a single polished 300-600 character submission in paragraph form.'
    ].join('\n');
  }

  if (lowered.includes('paragraph')) {
    return [
      'A strong paragraph format is: one setup sentence, two to three concrete activity examples, and one closing sentence that explains why the approach builds teamwork.',
      '',
      'Example structure:',
      '- Sentence 1: Introduce the constraint (video call + paper + rubber band).',
      '- Sentences 2-4: Describe specific activities with clear actions.',
      '- Sentence 5: Explain outcomes (communication, creativity, collaboration).',
      '',
      'Draft example:',
      'Our team-building session can run fully on video conferencing using only paper and a rubber band by rotating through quick collaborative challenges. Teams can do a paper tower sprint where members must explain one design change between rounds, a rubber-band launch challenge where peers coach each other on accuracy, and a silent fold relay that tests instruction clarity. These low-cost activities keep everyone active while strengthening communication, creativity, and trust.'
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
    'Good direction. To make your response stronger and more distinctive, add three layers of detail.',
    '',
    'Layer 1: Specific activity mechanics. Instead of naming an activity only, describe one rule, one time limit, or one scoring method.',
    '',
    'Layer 2: Collaboration behavior. Explain how teammates interact, such as coaching, role-switching, or collaborative planning between rounds.',
    '',
    'Layer 3: Practical outcome. Close with why this improves team dynamics in remote settings (for example, clearer communication, shared problem-solving, or faster trust-building).',
    '',
    'If you share your current draft, I can rewrite it into a high-quality final version while keeping it within the character requirement.'
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

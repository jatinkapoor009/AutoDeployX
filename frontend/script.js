// ── AutoDeployX — script.js ──

// ── PAGE NAVIGATION ──
function showPage(pageId, clickedLink) {
  // Saare pages hide karo
  document.querySelectorAll('.page-section').forEach(p => p.style.display = 'none');
  // Target page show karo
  document.getElementById('page-' + pageId).style.display = 'block';
  // Active link update karo
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  if (clickedLink) clickedLink.classList.add('active');
  // Page top pe le jao
  window.scrollTo({ top: 0, behavior: 'smooth' });
  return false;
}

// ── PIPELINE STAGES DATA ──
const STAGES = [
  { id: 'checkout', name: 'Checkout', icon: '📥' },
  { id: 'install',  name: 'Install',  icon: '📦' },
  { id: 'test',     name: 'Test',     icon: '🧪' },
  { id: 'build',    name: 'Build',    icon: '🏗️' },
  { id: 'scan',     name: 'Scan',     icon: '🔒' },
  { id: 'docker',   name: 'Docker',   icon: '🐳' },
  { id: 'deploy',   name: 'Deploy',   icon: '🚀' },
];

const LOG_TEMPLATES = {
  checkout: (dev) => [
    `[INFO] Connecting to GitHub...`,
    `[INFO] Cloning repo: ${document.getElementById('repo-name').value || 'autodeployx'}`,
    `[INFO] Branch: ${document.getElementById('branch-name').value}`,
    `[OK]   Checkout complete for user: ${dev}`,
  ],
  install: () => [
    `[INFO] Running npm install...`,
    `[INFO] Resolved 412 packages`,
    `[OK]   Dependencies installed (3.2s)`,
  ],
  test: () => [
    `[INFO] Running test suites...`,
    `[INFO] PASS  src/__tests__/auth.test.js`,
    `[INFO] PASS  src/__tests__/api.test.js`,
    `[OK]   All 24 tests passed ✓`,
  ],
  build: () => [
    `[INFO] Building Docker image...`,
    `[INFO] Step 1/6 FROM node:18-alpine`,
    `[INFO] Step 4/6 COPY . .`,
    `[OK]   Image built: autodeployx:latest`,
  ],
  scan: () => [
    `[INFO] Running Trivy security scan...`,
    `[WARN] 2 LOW severity CVEs found`,
    `[INFO] No CRITICAL or HIGH CVEs`,
    `[OK]   Security gate passed`,
  ],
  docker: () => [
    `[INFO] Pushing to DockerHub...`,
    `[INFO] Uploading layer sha256:a1b2c3...`,
    `[OK]   Pushed autodeployx:latest`,
    `[OK]   Pushed autodeployx:${Date.now().toString(36)}`,
  ],
  deploy: (dev) => [
    `[INFO] SSH into server...`,
    `[INFO] Pulling latest image...`,
    `[INFO] docker-compose up -d`,
    `[OK]   ✅ Hello ${dev}, AutoDeployX deployed successfully!`,
  ],
};

let buildHistory = [];
let buildCount   = 147;
let isRunning    = false;

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  renderStages({});
  animateStats();
  animateMetrics();
  setInterval(animateMetrics, 5000);
});

// ── COUNT-UP ANIMATION ──
function animateStats() {
  countUp('stat-builds',     0, 147, 1200);
  countUp('stat-success',    0,  94, 1400, '%');
  countUp('stat-containers', 0,   6,  900);
}

function countUp(id, from, to, duration, suffix = '') {
  const el    = document.getElementById(id);
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(p * (to - from) + from) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ── METRICS ANIMATION ──
function animateMetrics() {
  const cpu  = Math.floor(20 + Math.random() * 50);
  const mem  = Math.floor(40 + Math.random() * 35);
  const disk = Math.floor(10 + Math.random() * 30);
  const net  = Math.floor(5  + Math.random() * 60);
  setMetric('cpu',  cpu);
  setMetric('mem',  mem);
  setMetric('disk', disk);
  setMetric('net',  net);
}

function setMetric(name, val) {
  document.getElementById(name + '-val').textContent = val + '%';
  document.getElementById(name + '-bar').style.width = val + '%';
}

// ── RENDER PIPELINE STAGES ──
function renderStages(activeStates) {
  const wrap = document.getElementById('pipeline-stages');
  wrap.innerHTML = STAGES.map(s => {
    const state = activeStates[s.id] || 'idle';
    return `
      <div class="stage ${state}" id="stage-${s.id}">
        <div class="stage-dot">${s.icon}</div>
        <div class="stage-name">${s.name}</div>
      </div>`;
  }).join('');
}

// ── TERMINAL ──
function appendLog(msg, type = 'dim') {
  const terminal = document.getElementById('terminal');
  const line = document.createElement('span');
  line.className   = `log-line ${type}`;
  line.textContent = msg;
  terminal.appendChild(line);
  terminal.appendChild(document.createElement('br'));
  terminal.scrollTop = terminal.scrollHeight;
}

function clearTerminal() {
  document.getElementById('terminal').innerHTML = '';
}

// ── TOAST NOTIFICATION ──
function toast(msg, type = 'info', duration = 3500) {
  const container = document.getElementById('toasts');
  const t         = document.createElement('div');
  t.className     = `toast ${type}`;
  const icon      = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
  t.innerHTML     = `<span>${icon}</span> ${msg}`;
  container.appendChild(t);
  setTimeout(() => t.remove(), duration);
}

// ── TRIGGER BUTTON (from hero / navbar) ──
function triggerDeploy() {
  const nameEl = document.getElementById('dev-name');
  if (!nameEl) return;
  nameEl.focus();
  toast('Enter your name and click Run ▶', 'info');
  nameEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ── RUN PIPELINE ──
async function runPipeline() {
  if (isRunning) return;

  const dev  = document.getElementById('dev-name').value.trim()  || 'developer';
  const repo = document.getElementById('repo-name').value.trim() || 'autodeployx';

  isRunning = true;
  document.getElementById('run-btn').disabled = true;
  document.getElementById('pipe-status-label').textContent = '🔄 Running...';

  clearTerminal();

  const stateMap = {};
  STAGES.forEach(s => (stateMap[s.id] = 'idle'));
  renderStages(stateMap);

  toast(`Pipeline triggered by ${dev} on ${repo}`, 'info');

  let success = true;

  for (const stage of STAGES) {
    stateMap[stage.id] = 'running';
    renderStages(stateMap);
    appendLog(`\n── ${stage.name.toUpperCase()} ──`, 'info');

    const logs = LOG_TEMPLATES[stage.id](dev);
    for (const log of logs) {
      await delay(280 + Math.random() * 250);
      const type =
        log.startsWith('[OK]')   ? 'success' :
        log.startsWith('[WARN]') ? 'warn'    :
        log.startsWith('[ERR')   ? 'error'   : 'dim';
      appendLog(log, type);
    }

    // ~8% chance of test failure — realistic simulation
    if (stage.id === 'test' && Math.random() < 0.08) {
      stateMap[stage.id] = 'failed';
      renderStages(stateMap);
      appendLog('[ERROR] Test failed: auth.test.js › should return 401', 'error');
      success = false;
      break;
    }

    stateMap[stage.id] = 'done';
    renderStages(stateMap);
    await delay(200);
  }

  // ── Record build ──
  buildCount++;
  const record = {
    id:       buildCount,
    dev,
    branch:   document.getElementById('branch-name').value,
    commit:   Math.random().toString(16).slice(2, 9),
    status:   success ? 'success' : 'failed',
    duration: `${Math.floor(1.5 + Math.random() * 2)}m ${Math.floor(Math.random() * 59)}s`,
    time:     'just now',
  };

  buildHistory.unshift(record);
  if (buildHistory.length > 5) buildHistory.pop();
  renderHistory();

  if (success) {
    toast(`✅ Deployment success by ${dev}!`, 'success', 4000);
    document.getElementById('pipe-status-label').textContent = '✅ Success';
    document.getElementById('stat-builds').textContent       = buildCount;
  } else {
    toast(`❌ Pipeline failed at Test stage`, 'error', 4000);
    document.getElementById('pipe-status-label').textContent = '❌ Failed';
  }

  document.getElementById('run-btn').disabled = false;
  isRunning = false;
}

// ── RENDER HISTORY TABLE ──
function renderHistory() {
  const tbody = document.getElementById('history-tbody');
  if (!buildHistory.length) return;
  tbody.innerHTML = buildHistory.map(b => `
    <tr>
      <td style="color:var(--muted)">#${b.id}</td>
      <td>${b.dev}</td>
      <td style="color:var(--accent)">⎇ ${b.branch}</td>
      <td style="color:var(--muted);font-size:0.72rem">${b.commit}</td>
      <td><span class="badge ${b.status}">${b.status === 'success' ? '✓ Success' : '✗ Failed'}</span></td>
      <td style="color:var(--muted)">${b.duration}</td>
      <td style="color:var(--muted)">${b.time}</td>
    </tr>
  `).join('');
}

// ── UTILITY ──
const delay = ms => new Promise(r => setTimeout(r, ms));

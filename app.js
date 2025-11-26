// CONFIG
const SERVER_IP = 'sharkymc.falixsrv.me';
const BEDROCK_PORT = 42914;
const STATUS_API = `https://api.mcsrvstat.us/2/${SERVER_IP}`;

// Utility: copy text and show ephemeral tooltip (simple)
function copyText(text, button) {
  navigator.clipboard.writeText(text).then(() => {
    const prev = button.innerText;
    button.innerText = 'Copied!';
    setTimeout(()=> button.innerText = prev, 1300);
  }).catch(()=> {
    button.innerText = 'Copy failed';
    setTimeout(()=> button.innerText = 'Copy', 1300);
  });
}

// DOM ready
document.addEventListener('DOMContentLoaded', ()=> {
  // year
  const y = new Date().getFullYear();
  const elYear = document.getElementById('year');
  if (elYear) elYear.textContent = y;
  const elYear2 = document.getElementById('year2');
  if (elYear2) elYear2.textContent = y;
  const elYear3 = document.getElementById('year3');
  if (elYear3) elYear3.textContent = y;

  // set displayed IP text (defensive)
  const javaIpEls = document.querySelectorAll('#javaIp, #javaIp2');
  javaIpEls.forEach(e => e && (e.textContent = SERVER_IP));

  const bedrockEl = document.getElementById('bedrockIp');
  if (bedrockEl) bedrockEl.textContent = `${SERVER_IP} : ${BEDROCK_PORT}`;

  // copy handlers
  const copyJava = document.getElementById('copyJava');
  if (copyJava) copyJava.addEventListener('click', ()=> copyText(SERVER_IP, copyJava));

  const copyBedrock = document.getElementById('copyBedrock');
  if (copyBedrock) copyBedrock.addEventListener('click', ()=> copyText(`${SERVER_IP}:${BEDROCK_PORT}`, copyBedrock));

  const copyJava2 = document.getElementById('copyJava2');
  if (copyJava2) copyJava2.addEventListener('click', ()=> copyText(SERVER_IP, copyJava2));

  const copyBedrock2 = document.getElementById('copyBedrock2');
  if (copyBedrock2) copyBedrock2.addEventListener('click', ()=> copyText(`${SERVER_IP}:${BEDROCK_PORT}`, copyBedrock2));

  const copyIpMain = document.getElementById('copyIpMain');
  if (copyIpMain) copyIpMain.addEventListener('click', ()=> copyText(SERVER_IP, copyIpMain));

  // status updater
  const playersCount = document.getElementById('playersCount');
  const motd = document.getElementById('serverMotd');
  const statusDot = document.getElementById('statusDot');

  async function updateStatus(){
    try {
      const r = await fetch(STATUS_API, {cache: 'no-store'});
      const j = await r.json();

      if (j && j.online) {
        const online = (j.players && typeof j.players.online !== 'undefined') ? j.players.online : (j.players === undefined ? '—' : 0);
        if (playersCount) playersCount.textContent = `${online} players online`;
        if (motd) motd.textContent = (j.motd && j.motd.clean) ? j.motd.clean.join(' ') : '';
        if (statusDot) statusDot.style.background = 'linear-gradient(180deg,#2fdc9b,#0cc1a6)';
      } else {
        if (playersCount) playersCount.textContent = 'Server offline';
        if (motd) motd.textContent = '';
        if (statusDot) statusDot.style.background = 'linear-gradient(180deg,#ff6b6b,#ff4a4a)';
      }
    } catch (err) {
      if (playersCount) playersCount.textContent = 'Status unavailable';
      if (motd) motd.textContent = '';
      if (statusDot) statusDot.style.background = 'linear-gradient(180deg,#ffb86b,#ff7a0b)';
      // keep console log for debugging
      console.warn('Status check error', err);
    }
  }

  updateStatus();
  setInterval(updateStatus, 9000);

  // subtle GSAP entrance animations (if GSAP loaded)
  if (typeof gsap !== 'undefined') {
    gsap.from('.glass-panel', {y:16, opacity:0, stagger:0.09, duration:0.7, ease:'power3.out'});
    gsap.from('.site-header .brand', {y:-6, opacity:0, duration:0.6, delay:0.1});
    gsap.from('.main-nav .nav-link', {y:-4, opacity:0, stagger:0.04, duration:0.45, delay:0.2});
  }

  // background canvas
  initBGCanvas();
});

// ---------- Canvas background (subtle drifting ovals) ----------
function initBGCanvas(){
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  const items = [];
  const N = Math.max(18, Math.floor((w*h)/200000));

  for (let i=0;i<N;i++){
    items.push({
      x: Math.random()*w,
      y: Math.random()*h,
      rx: 40 + Math.random()*160,
      ry: 12 + Math.random()*60,
      a: 0.02 + Math.random()*0.05,
      vx: (Math.random()-0.5)*0.18,
      vy: (Math.random()-0.5)*0.08,
      rot: Math.random()*Math.PI*2,
      rotv: (Math.random()-0.5)*0.0015
    });
  }

  function render(){
    ctx.clearRect(0,0,w,h);
    for (const p of items){
      ctx.save();
      ctx.translate(p.x,p.y);
      ctx.rotate(p.rot);
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${p.a})`;
      ctx.ellipse(0,0,p.rx,p.ry,0,0,Math.PI*2);
      ctx.fill();
      ctx.restore();

      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotv;
      if (p.x < -200) p.x = w + 200;
      if (p.x > w + 200) p.x = -200;
      if (p.y < -200) p.y = h + 200;
      if (p.y > h + 200) p.y = -200;
    }
    requestAnimationFrame(render);
  }
  render();

  addEventListener('resize', ()=>{
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
  });
}

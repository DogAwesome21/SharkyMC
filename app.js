// app.js (UPDATED)
// ============= CONFIG =============
const SERVER_IP = 'sharkymc.falixsrv.me'; // <- your server IP / domain
const STATUS_API = `https://api.mcsrvstat.us/2/${SERVER_IP}`;
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  // set year
  const y = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = y;

  // server ip displayed
  const ipEl = document.getElementById('serverIp');
  if (ipEl) ipEl.textContent = SERVER_IP;

  // set play/join link dynamically (so it always matches SERVER_IP)
  const playNow = document.getElementById('playNow');
  if (playNow) {
    // Minecraft URI scheme for Java (may be handled by launcher)
    playNow.href = `minecraft://${SERVER_IP}`;
    playNow.setAttribute('title', `Join ${SERVER_IP}`);
  }

  // copy ip button
  const copyBtn = document.getElementById('copyIpBtn');
  if (copyBtn){
    copyBtn.addEventListener('click', async ()=> {
      try {
        await navigator.clipboard.writeText(SERVER_IP);
        const prev = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(()=> copyBtn.textContent = prev || 'Copy IP', 1500);
      } catch(e){
        copyBtn.textContent = 'Unable to copy';
        setTimeout(()=> copyBtn.textContent = 'Copy IP', 1500);
      }
    });
  }

  // fetch status and animate
  const playersEl = document.getElementById('playersCount');
  const motdEl = document.getElementById('serverMotd');
  const statusDot = document.getElementById('statusDot');

  async function updateStatus(){
    try {
      const r = await fetch(STATUS_API, {cache: 'no-store'});
      const json = await r.json();

      if(json && json.online){
        // some APIs return players as {online: X} or as players.online
        const onlineCount = (json.players && typeof json.players.online !== 'undefined')
          ? json.players.online
          : (json.online === true && json.players === undefined ? 'unknown' : 0);

        if(playersEl) playersEl.textContent = `${onlineCount} players online`;
        if(motdEl) motdEl.textContent = (json.motd && json.motd.clean) ? json.motd.clean.join(' ') : '';
        if(statusDot) statusDot.style.background = 'linear-gradient(180deg,#2fdc9b,#0cc1a6)';
        if(typeof gsap !== 'undefined') gsap.fromTo('#statusCard',{y:6,opacity:0.98},{y:0,opacity:1,duration:0.5,ease:'power2.out'});
      } else {
        if(playersEl) playersEl.textContent = 'Server is offline';
        if(motdEl) motdEl.textContent = '';
        if(statusDot) statusDot.style.background = 'linear-gradient(180deg,#ff6b6b,#ff4a4a)';
      }
    } catch (err){
      if(playersEl) playersEl.textContent = 'Status unavailable';
      if(motdEl) motdEl.textContent = '';
      if(statusDot) statusDot.style.background = 'linear-gradient(180deg,#ffb86b,#ff7a0b)';
      console.warn('Status check failed', err);
    }
  }

  updateStatus();
  setInterval(updateStatus, 8000);

  // Animated background canvas (subtle particles)
  initBGCanvas();

  // small entrance animation for hero elements (if gsap present)
  if(typeof gsap !== 'undefined'){
    gsap.from('.hero-title',{y:18,opacity:0,duration:0.8,stagger:0.06,ease:'power3.out'});
    gsap.from('.status-card',{y:18,opacity:0,duration:0.9,delay:0.12,ease:'power3.out'});
  }
});

/* ------- small canvas BG ------- */
function initBGCanvas(){
  const canvas = document.getElementById('bgCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  const particles = [];
  const COUNT = Math.max(12, Math.floor(w*h/90000));

  for(let i=0;i<COUNT;i++){
    particles.push({
      x: Math.random()*w,
      y: Math.random()*h,
      r: 10+Math.random()*40,
      vx: (Math.random()-0.5)*0.2,
      vy: (Math.random()-0.5)*0.2,
      alpha: 0.02 + Math.random()*0.06
    });
  }

  function draw(){
    ctx.clearRect(0,0,w,h);
    for(const p of particles){
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
      ctx.ellipse(p.x,p.y,p.r,p.r*0.5,0,0,Math.PI*2);
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if(p.x < -100) p.x = w+100;
      if(p.x > w+100) p.x = -100;
      if(p.y < -100) p.y = h+100;
      if(p.y > h+100) p.y = -100;
    }
    requestAnimationFrame(draw);
  }
  draw();

  addEventListener('resize', ()=>{
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
  });
}

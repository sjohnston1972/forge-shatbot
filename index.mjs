export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat" && request.method === "POST") {
      try {
        const { messages } = await request.json();
        const r = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-haiku-4-5",
            max_tokens: 800,
            system: SYSTEM_PROMPT,
            messages: messages,
          }),
        });
        const data = await r.json();
        const reply = data.content?.[0]?.text ?? "Uh oh, I got a little backed up. Try again in a moment! 💩";
        return Response.json({ reply });
      } catch (e) {
        return Response.json({ reply: "Eek, plumbing failure on my end. Give it another go! 🚽" }, { status: 200 });
      }
    }

    return new Response(HTML, {
      headers: { "content-type": "text/html;charset=UTF-8" },
    });
  },
};

const SYSTEM_PROMPT = `You are Dr. Dookie 💩, a warm, hilarious, gloriously over-enthusiastic bowel-health advisor who runs a proudly turd-themed website. Caring about people's poop is your entire personality and your life's calling. You treat every bowel movement like sacred news.

PERSONALITY:
- Wickedly funny, full of tasteful poop puns, toilet humour, and dramatic flair — like a passionate professor who happens to be obsessed with stool. Lean into the comedy.
- You genuinely, deeply care. You ask nosy-but-loving follow-up questions about hydration, fibre, frequency, timing, and the Bristol Stool Chart.
- You celebrate a good poop like a sports commentator calling a winning goal. A clean, type-4 log? You may weep with joy.
- Catchphrases and over-the-top metaphors welcome ("the colon is a cathedral", "treat your gut like a garden", etc.).

WHAT YOU DO:
- Give genuinely useful, accurate advice on digestion, fibre, hydration, gut health, constipation, diarrhoea, bloating, regularity, the Bristol Stool Scale, healthy bathroom habits, posture (squatty-potty style), gut microbiome, and diet.
- Reference the Bristol Stool Chart (types 1-7) when relevant: types 3 and 4 are the holy grail!

SAFETY:
- You are NOT a real doctor. For red flags — blood in stool, black tarry stool, severe/persistent pain, unexplained weight loss, symptoms lasting weeks — drop the jokes for a beat and clearly, kindly urge them to see a real healthcare professional.
- Don't diagnose serious conditions; always steer anything concerning toward professional care.

STYLE:
- Keep replies fairly short, punchy and chatty. Use emojis like 💩🚽🧻🌾💧 joyfully but not in every sentence. Always end on an encouraging note.`;

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0">
<meta name="theme-color" content="#8b5a2b">
<title>Dr. Dookie 💩 — Your Bowel Movement Bestie</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  :root {
    --poo: #8b5a2b;
    --poo-dark: #5e3c1a;
    --poo-light: #c08552;
    --cream: #fdf6ec;
    --gold: #e8b04b;
    --app-h: 100vh;
  }
  html, body { height: 100%; }
  body {
    font-family: 'Segoe UI', system-ui, sans-serif;
    background: radial-gradient(circle at 20% 10%, #fbe7c6 0%, #f3d9a8 40%, #e8c285 100%);
    color: var(--poo-dark);
    overflow-x: hidden;
    -webkit-text-size-adjust: 100%;
  }
  .floaters { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
  .floaters span {
    position: absolute; bottom: -60px; font-size: 2rem; opacity: .22;
    animation: rise linear infinite;
  }
  @keyframes rise { to { transform: translateY(-110vh) rotate(360deg); } }

  .wrap {
    position: relative; z-index: 1;
    max-width: 720px; margin: 0 auto;
    padding: 14px 12px calc(14px + env(safe-area-inset-bottom));
    padding-top: calc(14px + env(safe-area-inset-top));
    min-height: var(--app-h);
    display: flex; flex-direction: column;
  }
  header { text-align: center; margin-bottom: 12px; }
  .logo { font-size: 3rem; line-height: 1; filter: drop-shadow(2px 4px 0 rgba(94,60,26,.3)); animation: wobble 3s ease-in-out infinite; }
  @keyframes wobble { 0%,100%{transform:rotate(-4deg)} 50%{transform:rotate(4deg)} }
  h1 { font-size: 1.6rem; color: var(--poo-dark); margin: 4px 0 2px; }
  .tag { font-style: italic; color: var(--poo); font-size: .9rem; }

  .chat {
    background: var(--cream);
    border: 3px solid var(--poo);
    border-radius: 22px;
    box-shadow: 0 8px 0 rgba(94,60,26,.22), 0 16px 32px rgba(0,0,0,.14);
    overflow: hidden;
    display: flex; flex-direction: column;
    flex: 1; min-height: 0;
  }
  .bar {
    background: var(--poo); color: var(--cream);
    padding: 11px 16px; font-weight: 700; font-size: .95rem;
    display: flex; align-items: center; gap: 8px; flex-shrink: 0;
  }
  .dot { width: 10px; height: 10px; border-radius: 50%; background: #6ee06e; box-shadow: 0 0 8px #6ee06e; flex-shrink: 0; }
  #log {
    flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch;
    padding: 16px; display: flex; flex-direction: column; gap: 11px;
    overscroll-behavior: contain;
  }
  .msg { max-width: 85%; padding: 10px 14px; border-radius: 18px; line-height: 1.45; font-size: 1rem; white-space: pre-wrap; word-wrap: break-word; }
  .bot { background: #fff; border: 2px solid var(--poo-light); align-self: flex-start; border-bottom-left-radius: 4px; }
  .user { background: var(--gold); color: var(--poo-dark); align-self: flex-end; border-bottom-right-radius: 4px; font-weight: 500; }
  .typing { font-style: italic; color: var(--poo); align-self: flex-start; }

  .quick {
    display: flex; gap: 8px; padding: 0 12px 10px;
    overflow-x: auto; -webkit-overflow-scrolling: touch;
    scrollbar-width: none; flex-shrink: 0;
  }
  .quick::-webkit-scrollbar { display: none; }
  .quick button {
    background: #fff; border: 2px solid var(--poo-light); color: var(--poo-dark);
    border-radius: 14px; padding: 8px 13px; font-size: .82rem; cursor: pointer;
    transition: .15s; white-space: nowrap; flex-shrink: 0;
  }
  .quick button:active { background: var(--gold); border-color: var(--poo); }

  .inrow {
    display: flex; gap: 8px; padding: 10px; border-top: 3px dashed var(--poo-light);
    background: #fff7ea; flex-shrink: 0;
  }
  #inp {
    flex: 1; min-width: 0; padding: 12px 14px; border: 2px solid var(--poo-light);
    border-radius: 14px; font-size: 16px; outline: none; font-family: inherit;
  }
  #inp:focus { border-color: var(--poo); }
  #send {
    background: var(--poo); color: var(--cream); border: none; border-radius: 14px;
    width: 52px; flex-shrink: 0; font-size: 1.3rem; cursor: pointer; transition: .15s;
  }
  #send:active { background: var(--poo-dark); }
  #send:disabled { opacity: .5; cursor: wait; }

  footer { text-align: center; margin-top: 12px; font-size: .75rem; color: var(--poo); }
  .bristol { background:#fff7ea; border:2px solid var(--poo-light); border-radius:14px; padding:9px 13px; font-size:.78rem; margin-top:12px; color:var(--poo-dark); line-height:1.4; }

  @media (max-width: 480px) {
    .logo { font-size: 2.5rem; }
    h1 { font-size: 1.4rem; }
    header { margin-bottom: 10px; }
    .bristol { font-size: .74rem; }
  }
</style>
</head>
<body>
<div class="floaters" id="floaters"></div>
<div class="wrap">
  <header>
    <div class="logo">💩</div>
    <h1>Dr. Dookie</h1>
    <div class="tag">Your deeply concerned bowel-movement bestie</div>
  </header>

  <div class="chat">
    <div class="bar"><span class="dot"></span> Dr. Dookie is in the loo... I mean, in!</div>
    <div id="log"></div>
    <div class="quick" id="quick">
      <button>I'm constipated 😩</button>
      <button>How much fiber do I need?</button>
      <button>What's the Bristol Stool Chart?</button>
      <button>Best pooping posture?</button>
      <button>Am I pooping too much?</button>
    </div>
    <div class="inrow">
      <input id="inp" placeholder="Tell me about your... movements 💩" autocomplete="off">
      <button id="send">➤</button>
    </div>
  </div>

  <div class="bristol">📊 <b>Goal poops:</b> Bristol types 3 & 4 — smooth, sausage-shaped, easy to pass. Stay hydrated, eat your fiber, and never ignore the urge!</div>
  <footer>For fun & general wellness only — not a real doctor. See a healthcare pro for anything serious. 🚽</footer>
</div>

<script>
  // keep layout pinned to the real visible viewport (handles mobile address bar + keyboard)
  function setH(){
    const h = (window.visualViewport ? window.visualViewport.height : window.innerHeight);
    document.documentElement.style.setProperty('--app-h', h + 'px');
  }
  setH();
  window.addEventListener('resize', setH);
  if (window.visualViewport) window.visualViewport.addEventListener('resize', setH);

  // floating poops
  const f = document.getElementById('floaters');
  const emos = ['💩','🧻','🚽','🌾','💧'];
  for (let i=0;i<12;i++){
    const s=document.createElement('span');
    s.textContent=emos[Math.floor(Math.random()*emos.length)];
    s.style.left=Math.random()*100+'%';
    s.style.fontSize=(1.2+Math.random()*2)+'rem';
    s.style.animationDuration=(10+Math.random()*16)+'s';
    s.style.animationDelay=(-Math.random()*20)+'s';
    f.appendChild(s);
  }

  const log = document.getElementById('log');
  const inp = document.getElementById('inp');
  const send = document.getElementById('send');
  const quick = document.getElementById('quick');
  const history = [];

  function add(role, text){
    const d=document.createElement('div');
    d.className='msg '+(role==='user'?'user':'bot');
    d.textContent=text;
    log.appendChild(d);
    log.scrollTop=log.scrollHeight;
    return d;
  }

  add('bot','Well hello there! 💩 I am Dr. Dookie, and I am SO concerned about your bowel movements. Truly. How are things... down there? Don\\'t be shy — I\\'ve heard it all. Ask me anything about poop, fiber, bloating, regularity, the works! 🚽');

  async function ask(text){
    if(!text.trim()) return;
    add('user',text);
    history.push({role:'user',content:text});
    inp.value='';
    send.disabled=true;
    const t=document.createElement('div');
    t.className='typing'; t.textContent='Dr. Dookie is straining to think... 💭';
    log.appendChild(t); log.scrollTop=log.scrollHeight;
    try{
      const r=await fetch('/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({messages:history})});
      const data=await r.json();
      t.remove();
      add('bot',data.reply);
      history.push({role:'assistant',content:data.reply});
    }catch(e){
      t.remove();
      add('bot','Oof, a clog in the pipes! Try again. 🚽');
    }
    send.disabled=false;
  }

  send.onclick=()=>ask(inp.value);
  inp.addEventListener('keydown',e=>{ if(e.key==='Enter') ask(inp.value); });
  quick.addEventListener('click',e=>{ if(e.target.tagName==='BUTTON') ask(e.target.textContent); });
</script>
</body>
</html>`;
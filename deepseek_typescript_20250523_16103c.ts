import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

// ⚠️ Use environment variable for token in production!
const BOT_TOKEN = "7709869742:AAFV9Q84U_wUXTPHMEmz5-ussJYeeUR9xSw"; // Replace with your token

const app = new Application();
const router = new Router();

let fakeDoge = 0;

router.get("/mine", (ctx) => {
  fakeDoge += Math.random() * 0.01;
  ctx.response.body = {
    mined: fakeDoge.toFixed(5),
    message: `⛏️ You mined ${fakeDoge.toFixed(5)} DOGE!`
  };
});

router.get("/", (ctx) => {
  ctx.response.body = `
<!DOCTYPE html>
<html>
<head>
  <title>DOGE Miner</title>
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
  <style>
    body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
    button { 
      background: #FFD700; 
      border: none; 
      padding: 10px 20px; 
      font-size: 16px; 
      cursor: pointer;
      margin: 10px;
      border-radius: 5px;
    }
    #doge-counter {
      font-size: 24px;
      font-weight: bold;
      margin: 20px;
      color: #c2a600;
    }
  </style>
</head>
<body>
  <h1>🐕 Dogecoin Mining Simulator</h1>
  <div id="doge-counter">0 DOGE</div>
  <button onclick="mineDoge()">⛏️ MINE DOGE</button>
  <button onclick="share()">📤 SHARE</button>

  <script>
    let totalDoge = 0;
    
    function mineDoge() {
      fetch("/mine")
        .then(res => res.json())
        .then(data => {
          totalDoge = parseFloat(data.mined);
          document.getElementById("doge-counter").innerText = 
            totalDoge.toFixed(5) + " DOGE";
          alert(data.message);
        });
    }
    
    function share() {
      if (window.Telegram?.WebApp?.shareLink) {
        Telegram.WebApp.shareLink(
          window.location.href,
          `I mined ${totalDoge.toFixed(5)} DOGE! 🚀`
        );
      } else {
        alert("Open in Telegram to share!");
      }
    }
    
    if (window.Telegram?.WebApp?.expand) {
      Telegram.WebApp.expand();
      Telegram.WebApp.ready();
    }
  </script>
</body>
</html>
  `;
});

// Set menu button
fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setChatMenuButton`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    menu_button: {
      type: "web_app",
      text: "⛏️ Mine DOGE",
      web_app: { url: "https://abraham-par-tgbot-86.deno.dev" } // No trailing slash
    }
  })
}).catch(e => console.log("Menu button error (ignore if testing locally):", e));

console.log("🚀 Server running!");
await app.listen({ port: Deno.env.get("PORT") || 8000 });

// Simple Dogecoin mining simulator API
import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

const router = new Router();
let fakeDoge = 0;

// API endpoint to "mine" DOGE
router.get("/mine", (ctx) => {
  fakeDoge += Math.random() * 0.01;
  ctx.response.body = { doge: fakeDoge.toFixed(5) };
});

// Serve HTML for the Telegram Mini App
router.get("/", (ctx) => {
  ctx.response.body = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>DOGE Miner</title>
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
      </head>
      <body>
        <h1>⛏️ Fake Dogecoin Miner</h1>
        <p id="doge">0 DOGE</p>
        <button onclick="mine()">Mine DOGE</button>
        <script>
          async function mine() {
            const res = await fetch("/mine");
            const data = await res.json();
            document.getElementById("doge").innerText = data.doge + " DOGE";
          }
        </script>
      </body>
    </html>
  `;
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
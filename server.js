import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import { Telegraf } from "telegraf";

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

app.use(bodyParser.json());

// віддавати статичні файли з папки miniapp
app.use(express.static("miniapp"));

// якщо зайшли на корінь (/) → віддати index.html
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "miniapp" });
});

// логіка бота
bot.on("web_app_data", (ctx) => {
  const data = JSON.parse(ctx.webAppData.data);
  ctx.reply(`✅ Замовлення отримано!\nЛікар: ${data.doctor}\nEmail: ${data.email}`);
});

// запуск серверу
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`WebApp running on port ${PORT}`));

bot.launch();

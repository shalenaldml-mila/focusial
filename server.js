import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import { Telegraf } from "telegraf";

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

app.use(bodyParser.json());

// ========= MiniApp frontend (index.html) =========
app.use(express.static("miniapp")); // віддавати файли з папки miniapp

// ========= Bot logic =========
bot.on("web_app_data", async (ctx) => {
  const data = JSON.parse(ctx.webAppData.data);

  await ctx.reply(`✅ Замовлення отримано!
Лікар: ${data.doctor}
Email: ${data.email}`);
});

// оплата (поки тестовий приклад)
bot.on("pre_checkout_query", (ctx) => ctx.answerPreCheckoutQuery(true));
bot.on("successful_payment", async (ctx) => {
  const email = ctx.message.successful_payment.order_info?.email;

  if (email) {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
      from: '"implants.ua" <info@implants.ua>',
      to: email,
      subject: "Ваш чек на FOCUSIAL INTRA",
      text: `Дякуємо за замовлення! Оплата успішна.`
    });
  }
});

// ========= Запуск сервера =========
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`WebApp running on port ${PORT}`));

bot.launch();

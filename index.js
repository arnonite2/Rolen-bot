const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

// 1. سيرفر صغير لإبقاء البوت مستيقظاً
const app = express();
app.get('/', (req, res) => res.send('البوت شغال 24/7!'));
app.listen(3000, () => console.log('Web server ready.'));

// 2. إعدادات ديسكورد
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.on('ready', () => {
  console.log(`تم تسجيل الدخول باسم ${client.user.tag}`);
});

// 3. أمر (هلا -> بطيخ)
client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  if (message.content === 'هلا') {
    message.reply('بطيخ');
  }
});

// 4. تسجيل الدخول
client.login(process.env.DISCORD_TOKEN);

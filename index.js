const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

// 1. سيرفر صغير لإبقاء البوت مستيقظاً
const app = express();
app.get('/', (req, res) => res.send('24/7 Bot is active!'));
app.listen(3000, () => console.log('Web server is ready on port 3000'));

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

// 3. قسم الردود التلقائية
client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    if (message.content === 'هلا') {
        message.reply('بطيخ');
    }

    if (message.content === 'السلام عليكم') {
        message.reply('وعليكم السلام ورحمة الله وبركاته! ظلمت السيرفر.');
    }

    if (message.content === 'كيفك') {
        message.reply('زي الزفت !');
    }
});

// 4. تسجيل الدخول
client.login(process.env.DISCORD_TOKEN);
    // أمر نسبة الحب أو الحظ
    if (message.content === 'نسبة') {
        const randomNum = Math.floor(Math.random() * 101); // يولد رقماً بين 0 و 100
        message.reply(`${randomNum}% يا فاشل 🥀`);
    }


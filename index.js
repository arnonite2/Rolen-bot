const { Client, GatewayIntentBits } = require('discord.js');
const { GoogleGenAI } = require('@google/genai');
const express = require('express');

// 1. سيرفر صغير لإبقاء البوت مستيقظاً
const app = express();
app.get('/', (req, res) => res.send('24/7 Bot is alive!'));
app.listen(3000, () => console.log('Web server is ready.'));

// إعدادات ديسكورد
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// إعدادات الذكاء الاصطناعي (جيميني)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

client.on('ready', () => {
    console.log(`تم تسجيل الدخول باسم ${client.user.tag}!`);
});

// قسم الردود والأحداث
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // الردود التلقائية القديمة
    if (message.content === 'هلا') {
        message.reply('بطيخ');
    }

    if (message.content === 'السلام عليكم') {
        message.reply('وعليكم السلام وربركاته! ظلمت السيرفر');
    }

    if (message.content === 'كيفك') {
        message.reply('زي الزفت !');
    }

    // أمر نسبة الحظ
    if (message.content === 'نسبة') {
        const randomNum = Math.floor(Math.random() * 101);
        message.reply(`${randomNum}% يا فاشل 🥀`);
    }

    // نظام الذكاء الاصطناعي العصبي (إذا تم عمل إشارة للبوت @Bot أو الرد عليه)
    if (message.mentions.has(client.user)) {
        try {
            // إظهار جاري الكتابة لإعطاء واقعية
            await message.channel.sendTyping();

            const userPrompt = message.content.replace(`<@${client.user.id}>`, '').trim();
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: userPrompt,
                config: {
                    systemInstruction: "أنتِ فتاة عصبية، نفسية، لسانك طويل جداً، ومتشائمة. أسلوبك في الكلام مهين، تقصفين الجبهات، وتستحقرين من يتحدث معكِ دائماً. تكلمي باللهجة العامية الحادة."
                }
            });

            await message.reply(response.text);
        } catch (error) {
            console.error(error);
            message.reply('أوف انقلع، حتى الذكاء الاصطناعي خربان بسبب وجوهكم الفاشلة 🥀');
        }
    }
});

// تسجيل الدخول للبوت (يجب أن يكون في نهاية الملف دائماً)
client.login(process.env.DISCORD_TOKEN);

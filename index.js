const { Client, GatewayIntentBits } = require('discord.js');
const { GoogleGenAI } = require('@google/genai');
const express = require('express');

// إعداد سيرفر الويب ليبقى البوت شغالاً على Render
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot is alive and running!');
});

app.listen(PORT, () => {
  console.log(`Web server is running on port ${PORT}`);
});

// إعداد ديسكورد
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// إعداد جيميناي باستخدام المفتاح من البيئة
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  // تجاهل رسائل البوتات نفسها
  if (message.author.bot) return;

  // التحقق مما إذا تم منشن البوت
  if (message.mentions.has(client.user)) {
    try {
      // إزالة المنشن من النص الموجه للذكاء الاصطناعي
      const prompt = message.content.replace(`<@!${client.user.id}>`, '').replace(`<@${client.user.id}>`, '').trim();
      
      if (!prompt) {
        await message.reply('مرحباً بك! كيف يمكنني مساعدتك اليوم؟');
        return;
      }

      // إرسال طلب إلى نموذج جيميناي بالطريقة الصحيحة للحزمة الجديدة
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [prompt],
      });

      const replyText = response.text || 'عذراً، لم أستطع توليد إجابة.';
      
      // الرد في ديسكورد (تقسيم الرد إذا كان طويلاً جداً)
      if (replyText.length > 2000) {
        for (let i = 0; i < replyText.length; i += 2000) {
          await message.reply(replyText.substring(i, i + 2000));
        }
      } else {
        await message.reply(replyText);
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      await message.reply('عذراً، حدث خطأ أثناء معالجة طلبك.');
    }
  }
});

// تسجيل الدخول بديسكورد باستخدام التوكن
client.login(process.env.DISCORD_TOKEN);

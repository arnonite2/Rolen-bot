import os
import discord
from discord.ext import commands

intents = discord.Intents.default()
intents.message_content = True

bot = commands.Bot(command_prefix="!", intents=intents)

@bot.event
async def on_ready():
    print(f'البوت جاهز وشغال باسم: {bot.user}')

# استخدام listen يمنع تداخل الأوامر ويحل مشاكل التكرار تلقائياً
@bot.listen('on_message')
async def my_message_listener(message):
    # تجاهل رسائل البوت نفسه لمنع التكرار اللانهائي
    if message.author.bot:
        return

    content = message.content.lower()

    # استخدام شروط دقيقة لمنع تطابق الكلمات ببعضها
    if "براه" == content or " براه " in content or content.startswith("براه ") or content.endswith(" براه"):
        await message.channel.send("https://cdn.discordapp.com/attachments/1525164893613850634/1525167132818669709/ac9a7b2edacc9f8f.gif?ex=6ab49dd4&is=6ab34c54&hm=3ee800abc6d483c5cc3ac2141c46f221a6fed8a535462e286fb98635d432934c&")
    elif "ههه" in content:
        await message.channel.send("https://cdn.discordapp.com/attachments/1525168265846853765/1525173064621363401/96399f9b2ddd3f2d.gif?ex=6ab4a35a&is=6ab351da&hm=1aa54803e36b7b3367beabfb2f0fa3405e8de9d04858ae11348909d62d6190e4&")
    elif "فاك" in content:
        await message.channel.send("https://cdn.discordapp.com/attachments/1544411753981550673/1550330585887678484/Antonblast_-_Anton_Finisher_Jewel_Ghoul.gif?ex=6ab5319f&is=6ab3e01f&hm=d3b6cc4c781c934f447df1240ccc6f358c3383326c8998851cbca1d89c2b70aa&")
    elif "صراخ" in content:
        await message.channel.send("https://cdn.discordapp.com/attachments/1483720088514334760/1552338224486027348/Antonblast_-_Danton_Scream.gif?ex=6ab53f21&is=6ab3eda1&hm=a3e19660728b3523d3143eecdff440e0597814827de314dfda7e9accd546c782&")
    elif "واو" in content:
        await message.channel.send("https://cdn.discordapp.com/attachments/1525175038884446280/1525176340641349672/pizza-t.gif?ex=6ab4a668&is=6ab354e8&hm=682ab904ab190db5691b3f6fc78911b5ce50e6cf2530165694a83afd1423c6f1&")
    elif "مياو" in content:
        await message.channel.send("https://cdn.discordapp.com/attachments/1484827428483235860/1541165266275147868/78870cefde8fdf66d443a1f45062121f.gif?ex=6ab620c0&is=6ab4cf40&hm=346ff256f7fb5f25eb9115634b637e27eea2c7cb3783c7c239a8ffba0655f747&")
    elif ":ario:" in content:
        await message.channel.send("https://cdn.discordapp.com/attachments/1101143800337944676/1549897274283270216/Messenger_creation_27458298591227511.jpg?ex=6ab59851&is=6ab446d1&hm=8b9ed7677f053cd74deeed00c315c912bd68725a7ab04f2194c553ada08f24a6&")
    elif "ععع" in content:
        await message.channel.send("https://cdn.discordapp.com/attachments/1541803699142398022/1541805587677847552/Spr_tvHUD_player_PZ_angry.gif?ex=6ab5d219&is=6ab48099&hm=7c1cc911484dc22855cf1daa0e1eadf0364cab8fdf347a01dbe43363f8656c58&")
    elif "زعلن" in content:
        await message.channel.send("https://discord.com/channels/1430972158678536286/1514623809205047477/1552603949461409865")
    elif "هيهيهي" in content:
        await message.channel.send("https://cdn.discordapp.com/attachments/1541803699142398022/1541805761204584538/PizzelleWalkDanceED.gif?ex=6ab5d242&is=6ab480c2&hm=51c23598337c70572da1516dfe90297cfb7574740a78d28ceccbfd6096ebac92&")

# تشغيل البوت
bot.run(os.getenv("DISCORD_TOKEN"))

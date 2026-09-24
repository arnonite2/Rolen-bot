import os
import discord
from discord.ext import commands

intents = discord.Intents.default()
intents.message_content = True

bot = commands.Bot(command_prefix="!", intents=intents)

@bot.event
async def on_ready():
    print(f'البوت جاهز وشغال باسم: {bot.user}')

@bot.event
async def on_message(message):
    if message.author == bot.user:
        return

    content = message.content.lower()

    if "براه" in content:
        await message.channel.send("https://cdn.discordapp.com/attachments/1525164893613850634/1525167132818669709/ac9a7b2edacc9f8f.gif?ex=6ab49dd4&is=6ab34c54&hm=3ee800abc6d483c5cc3ac2141c46f221a6fed8a535462e286fb98635d432934c&")
    elif "ههه" in content:
        await message.channel.send("https://cdn.discordapp.com/attachments/1525168265846853765/1525173064621363401/96399f9b2ddd3f2d.gif?ex=6ab4a35a&is=6ab351da&hm=1aa54803e36b7b3367beabfb2f0fa3405e8de9d04858ae11348909d62d6190e4&")
    elif "فاك" in content:
        await message.channel.send("https://cdn.discordapp.com/attachments/1544411753981550673/1550330585887678484/Antonblast_-_Anton_Finisher_Jewel_Ghoul.gif?ex=6ab5319f&is=6ab3e01f&hm=d3b6cc4c781c934f447df1240ccc6f358c3383326c8998851cbca1d89c2b70aa&")
    elif "صراخ" in content:
        await message.channel.send("https://cdn.discordapp.com/attachments/1483720088514334760/1552338224486027348/Antonblast_-_Danton_Scream.gif?ex=6ab53f21&is=6ab3eda1&hm=a3e19660728b3523d3143eecdff440e0597814827de314dfda7e9accd546c782&")
    elif "واو" in content:
        await message.channel.send("https://cdn.discordapp.com/attachments/1525175038884446280/1525176340641349672/pizza-t.gif?ex=6ab4a668&is=6ab354e8&hm=682ab904ab190db5691b3f6fc78911b5ce50e6cf2530165694a83afd1423c6f1&")

    await bot.process_commands(message)

# سحب التوكن من إعدادات رندر بأمان
bot.run(os.getenv("DISCORD_TOKEN"))

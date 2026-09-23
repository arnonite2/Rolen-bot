import discord
from discord.ext import commands
import json
import os
from groq import Groq as G
import asyncio

MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"
GUILD = None

history = []

# قراءة المفاتيح مباشرة من متغيرات البيئة في رندر (مثل طريقتنا السابقة)
def get_token():
    return os.getenv("DISCORD_TOKEN")
    
def get_key():
    return os.getenv("GROQ_API_KEY")

disor = G(api_key=get_key())
    
intents = discord.Intents.default()
intents.message_content = True
intents.members = True

bot = commands.Bot("!", intents=intents)

@bot.event
async def on_ready():
    print(f"Logged as: {bot.user}")

def return_server_info(guild: discord.Guild):
    if not guild:
        return
    
    info = ""
    info += f"Server: {guild.name} - {guild.id}\nCategories:\n"

    for category in guild.categories:
        info += f"- {category.name} ({category.id})\n"

    info += "Channels:\n"
    for channel in guild.channels:
        info += f"- {channel.name} ({channel.id})\n"
    
    info += "Roles:\n"
    for role in guild.roles:
        info += f"- Pos: {role.position}, Name: {role.name} ({role.id})\n"

    return info

AiAbout = f"""
You are a Discord bot named Disor 1.
- Talk in Arabic only, NEVER use any other language
- You help users manage their Discord server
- talk friendly and talk with المصريه العاميه

What you can do?
you can Only do these skills:
- Create Channels: Voices, Text and add them to categories
- Delete Channels
- Edit Channel Name
- Create Roles
- Give Roles
- Create Categories
- more soon...
"""

def disor_get_category(guild: discord.Guild, target: str):
    server_categories = {}
    for category in guild.categories:
        server_categories[category.name] = {"id": str(category.id)}

    default_categories = {
        "System": {"id": "1234567899"},
        "Generals": {"id": "1321462575"},
        "Moderators": {"id": "432534654"},
    }

    disor_category = disor.chat.completions.create(
                    model=MODEL,
                    messages=[
                        {"role": "system", "content": "You going to take a name of category and search for one in the list and return its id ONLY"},
                        {"role": "user", "content": f"{target}\ncategories: {server_categories}"}
                    ]
    )
    return guild.get_channel(int(disor_category.choices[0].message.content))

def disor_get_channel(guild: discord.Guild, target: str):
    server_channels = {}
    for channel in guild.channels:
        server_channels[channel.name] = {"id": str(channel.id)}

    disor_channel = disor.chat.completions.create(
                    model=MODEL,
                    messages=[
                        {"role": "system", "content": "You going to take a name of category and search for one in the list and return its id ONLY"},
                        {"role": "user", "content": f"{target}\nnchannels: {server_channels}"}
                    ]
    )
    return guild.get_channel(int(disor_channel.choices[0].message.content)) 

def disor_get_role(guild: discord.Guild, target: str):
    server_roles = {}
    for role in guild.roles:
        server_roles[role.name] = {"id": str(role.id), "color": str(role.color)}

    disor_role = disor.chat.completions.create(
                    model=MODEL,
                    messages=[
                        {"role": "system", "content": "You going to take a name of role and search for one in the list and return its id ONLY"},
                        {"role": "user", "content": f"{target}\nroles: {server_roles}"}
                    ]
    )
    return guild.get_role(int(disor_role.choices[0].message.content)) 

def disor_get_member(guild: discord.Guild, target: str):
    server_members = {}
    for member in guild.members:
        server_members[member.name] = {"id": str(member.id), "global_name": str(member.global_name)}

    sorted_members = ""
    for member in server_members:
        sorted_members += f"{member}: {server_members[member]['global_name']} ({server_members[member]['id']})\n"

    disor_role = disor.chat.completions.create(
                    model=MODEL,
                    messages=[
                        {"role": "system", "content": "You going to take a name of member and search for one in the list and return its id ONLY\n- Return ID ONLY!"},
                        {"role": "user", "content": f"{target}\nMembers:\n{sorted_members}"}
                    ]
    )
    return guild.get_member(int(disor_role.choices[0].message.content))

async def run_commands(commands: list, guild: discord.Guild):
    for command in commands:
        for key in command:
            await asyncio.sleep(1)
            if key.startswith("CreateChannel"):
                if command[key]["Type"] == "text":
                    channel = await guild.create_text_channel(name=command[key]["Name"])
                    if command[key].get("Category") is not None:
                        await channel.edit(category=disor_get_category(guild, command[key]["Category"]))
                elif command[key]["Type"] == "voice":
                    channel = await guild.create_voice_channel(name=command[key]["Name"])
                    if command[key].get("Category") is not None:
                        await channel.edit(category=disor_get_category(guild, command[key]["Category"]))
            elif key.startswith("DeleteChannel"):
                channel = disor_get_channel(guild, command[key]["Name"])
                await channel.delete()
            elif key.startswith("EditChannelName"):
                channel = disor_get_channel(guild, command[key]["Channel"])
                await channel.edit(name=command[key]["Name"])
            elif key.startswith("CreateRole"):
                role = await guild.create_role(name=command[key]["Name"], colour=discord.Colour.from_str(command[key]["Color"]))
                perms = discord.Permissions(**command[key]["Perms"])
                await role.edit(permissions=perms)
                await guild.edit_role_positions(positions={role: command[key]["Position"] + 1})
            elif key.startswith("GrantRole"):
                member = disor_get_member(guild, command[key]["Member"])
                role_to_grant = disor_get_role(guild, command[key]["Name"])
                await member.add_roles(role_to_grant)
            elif key.startswith("CreateCategory"):
                await guild.create_category(name=command[key]["Name"])

@bot.event
async def on_message(m: discord.Message):
    if m.author.id == bot.user.id:
        return

    if bot.user.mention in m.content:
        final = m.content.replace(bot.user.mention, "").strip()

        async with m.channel.typing():
            response = disor.chat.completions.create(
                model=MODEL,
                messages=[
                    {"role": "system", "content": f"Look at the user message and see if he wants to talk or want action, also if the user is asking questions return 'USER_IS_MESSAGING'\nAbout you: {AiAbout}\nDON'T chat with the user just take his message and return: 'USER_IS_MESSAGING' or 'USER_WANTS_ACTION' ONLY"},
                    {"role": "user", "content": final},
                ]
            )

            res_content = response.choices[0].message.content
            if res_content.startswith("USER_IS_MESSAGING"):
                chatbot = disor.chat.completions.create(
                    model=MODEL,
                    messages=[
                        {"role": "system", "content": f"تحدث إلى المستخدم وساعده...\nAbout you: {AiAbout}\nServer Information:\n{return_server_info(m.guild)}"},
                        {"role": "user", "content": final}
                    ]
                )
                await m.reply(chatbot.choices[0].message.content)

            elif res_content.startswith("USER_WANTS_ACTION"):
                actioner = disor.chat.completions.create(
                    model=MODEL,
                    messages=[
                        {"role": "system", "content": "You tell the user you will TRY to do the action, one sentence only in Egyptian Arabic."},
                        {"role": "user", "content": final}
                    ]
                )
                await m.reply(actioner.choices[0].message.content)

                commands = []
                parser = disor.chat.completions.create(
                    model=MODEL,
                    messages=[
                        {"role": "system", "content": f"Take the user input and reply with JSON only. Server Information:\n{return_server_info(m.guild)}"},
                        {"role": "user", "content": final}
                    ]
                )

                try:
                    raw = json.loads(parser.choices[0].message.content)
                    for key, value in raw.items():
                        if key.startswith("NoSkill"):
                            await m.reply(raw[key]["Reply"])
                        else:
                            commands.append({key: value})
                except Exception:
                    pass

                await run_commands(commands, m.guild)

bot.run(get_token())

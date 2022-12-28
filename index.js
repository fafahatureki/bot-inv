const developer = "Cy Turki#8581"; // My Account Name
const developerId = "809238591342641162"; // My Account ID.
const developerYT = "Abdulrahma" // YouTube Channel.

const express = require('express');
const app = express();

const Discord = require("discord.js"); 


require("events").EventEmitter.defaultMaxListeners = 9999999999999999999999999999;

const client = new Discord.Client();
const db = require('quick.db');

const admin = "809238591342641162"; // حط الايدي تبعك
const prefix = "+" // بادئة الاوامر

client.login(process.env.TOKEN);

  client.on('ready', () => {
    client.user.setStatus("online");
    client.user.setActivity(`تجربه فقط `, {
        type: "PLAYING"
    });
    console.log(`Logged in as ${client.user.tag} | https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=0&scope=bot`);
});



// Bot
client.on('message', async msg => {
  if(msg.content === prefix + "bot"){
    var ping = `${Date.now() - msg.createdTimestamp}`;
    var api = `${Math.round(client.ws.ping)}`;
    var states = ":green_circle: Excellent";
    var states2 = ":green_circle: Excellent";
    if(developers.includes(msg.author.id)) {
          if (Number(ping) > 70) states = ":green_circle: Good";
    if (Number(ping) > 170) states = ":yellow_circle: Not Bad";
    if (Number(ping) > 350) states = ":red_circle: Soo Bad";
    if (Number(api) > 70) states2 = ":green_circle: Good";
    if (Number(api) > 170) states2 = ":yellow_circle: Not Bad";
    if (Number(api) > 350) states2 = ":red_circle: Soo Bad";
  const embed = new Discord.MessageEmbed()
  .addField('`My Name`' , ` ${client.user.tag}` , true)
  .addField('`My ID`' , ` ${client.user.id} ` , true)
  .addField('`Developer`' , "Cn , AbDoo" , true)
  .addField('Time Taken', ping + " ms :signal_strength: | " + states, true)
  .addField("**WebSocket:**", api + " ms :signal_strength: | " + states2, true)
  msg.channel.send(embed);
  }}
  });

client.on("message", async message => {
    if (!message.guild || message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    if (message.content.startsWith(prefix + "bc")) {
      var lang = db.get(`${message.guild.id}.lang`);
       if (lang == null || undefined) db.set(`${message.guild.id}`, { lang: "ar" });
if (lang === "ar") {
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply('You dont have Permissions.');
        if (message.guild.interval) return message.reply('**بث آخر قيد التشغيل ، الرجاء الانتظار حتى ينتهي**')
        let args = message.content
            .split(" ")
            .slice(1)
            .join(" ");
        if (!args)
            return message.reply('**يرجى إرسال رسالة بعد الأمر لإرسالها**');

        message.channel
            .send(
                ">>> **[1] جميع الاعضاء\n[2] الاعضاء المتصلين\n[3] الرتب الخاصة\n[0] الغاء الأمر**"
            )
            .then(m => {
                message.channel
                    .awaitMessages(msg => msg.author.id === message.author.id, {
                        max: 1,
                        time: 1000 * 60 * 2,
                        errors: ["time"]
                    })
                    .then(async (c) => {
                        var members = null;
                        if (c.first().content === "1") {
                            members = message.guild.members.array();
                            c.first().delete().catch (err => null);
                            m.delete().catch (err => null);
                        }
                        if (c.first().content === "2") {
                            members = message.guild.members
                                .filter(m => m.presence.status !== "offline").array();

                            c.first().delete().catch (err => null);
                            m.delete().catch (err => null);
                        }
                        if (c.first().content == "0") {
                            c.first().delete().catch (err => null);
                            m.delete().catch (err => null);
                            message.channel.send("**تم الغاء الامر بنجاح**");
                        }
                        if (c.first().content === "3") {
                            m.edit("**>>> ادخل اسم الرتبة من فضلك**").then(ms => {
                                message.channel
                                    .awaitMessages(msg => msg.author.id === message.author.id, {
                                        max: 1,
                                        time: 1000 * 60 * 2,
                                        errors: ["time"]
                                    })
                                    .then(async collected => {
                                        let role = message.guild.roles.find(
                                            role => role.name === collected.first().content
                                        );
                                        if (!role)
                                            return message.channel
                                                .send("**:x: لا استطيع العثور على الرتبة الخاصة بالرسالة**")
                                                .then(() => {
                                                    ms.delete().catch (err => null);
                                                    collected.first().delete().catch (err => null);
                                                });

                                        let roleID = role.id;
                                        members = message.guild.roles.get(roleID).members.array();
                                        if (members == null) return message.reply('**رقم غير صالح**');
                                        if (members.length == 0) return message.reply('**لم يتم العثور على الرقم.**');
                                        else {
                                            const msg = await message.channel.send(`**جاري إرسال الرسالة إلى ${members.length} عضواً...**`)
                                            var count = 0;
                                            var ycount = 0;
                                            var xcount = 0;
                                            message.guild.interval = await setInterval(() => {
                                                if (!members[count]) {
                                                    clearInterval(message.guild.inter);
                                                    msg.edit(new Discord.RichEmbed().setDescription(`** :mailbox_with_mail:  ؛ تم أرسال الرسالة الى  ${ycount} عضواً\n:lock: ؛ و لم أستطع أرسال الرسالة إلى ${xcount} عضواً**`).setTimestamp());
                                                    message.guild.interval = false;
                                                } else if (!members[count].user.bot) {
                                                    members[count].send(`${args}`).then(() => {
                                                        ycount++;
                                                    }).catch(err => {
                                                        return xcount++;
                                                    });
                                                }
                                                count++;
                                            }, 500)
                                        }
                                        collected.first().delete();
                                        m.delete();
                                    }).catch(err => {
                                        return ms.delete().catch (err => null);
                                    })
                            });
                        };
                        if (['1', '2'].includes(c.first().content)) {
                            if (members == null) return message.reply('**رقم غير صالح**');
                            if (members.length == 0) return message.reply('**لم يتم العثور على الرقم.**');
                            else {
                                const msg = await message.channel.send(`**جاري إرسال الرسالة إلى ${members.length} عضواً...**`)
                                var count = 0;
                                var ycount = 0;
                                var xcount = 0;
                                message.guild.interval = await setInterval(() => {
                                    if (!members[count]) {
                                        clearInterval(message.guild.inter);
                                        msg.edit(new Discord.RichEmbed().setDescription(`** :mailbox_with_mail:  ؛ تم أرسال الرسالة الى  ${ycount} عضواً\n:lock: ؛ و لم أستطع أرسال الرسالة إلى ${xcount} عضواً**`).setTimestamp());
                                        message.guild.interval = false;
                                    } else if (!members[count].user.bot) {
                                        members[count].send(`${args}`).then(() => {
                                            ycount++;
                                        }).catch(err => {
                                            return xcount++;
                                        });
                                    }
                                    count++;
                                }, 500)
                            }
                        }


                    })
                    .catch((err) => {
                        return m.delete().catch (err => null);
                    });
            });
    } else if (lang === "en") {
          if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply('You dont have Permissions.');
        if (message.guild.interval) return message.reply('**Another broadcast is running, please wait for it to finish**')
        let args = message.content
            .split(" ")
            .slice(1)
            .join(" ");
        if (!args)
            return message.reply('**Please write the message after command**');

        message.channel
            .send(
                ">>> **[1] All members\n[2] Online members\n[3] Specific role\n[0] Cancel**"
            )
            .then(m => {
                message.channel
                    .awaitMessages(msg => msg.author.id === message.author.id, {
                        max: 1,
                        time: 1000 * 60 * 2,
                        errors: ["time"]
                    })
                    .then(async (c) => {
                        var members = null;
                        if (c.first().content === "1") {
                            members = message.guild.members.array();
                            c.first().delete().catch (err => null);
                            m.delete().catch (err => null);
                        }
                        if (c.first().content === "2") {
                            members = message.guild.members
                                .filter(m => m.presence.status !== "offline").array();

                            c.first().delete().catch (err => null);
                            m.delete().catch (err => null);
                        }
                        if (c.first().content == "0") {
                            c.first().delete().catch (err => null);
                            m.delete().catch (err => null);
                            message.channel.send("**Command cancelled successfully**");
                        }
                        if (c.first().content === "3") {
                            m.edit("**>>>Enter the role name please**").then(ms => {
                                message.channel
                                    .awaitMessages(msg => msg.author.id === message.author.id, {
                                        max: 1,
                                        time: 1000 * 60 * 2,
                                        errors: ["time"]
                                    })
                                    .then(async collected => {
                                        let role = message.guild.roles.find(
                                            role => role.name === collected.first().content
                                        );
                                        if (!role)
                                            return message.channel
                                                .send("**:x: I can't find this role**")
                                                .then(() => {
                                                    ms.delete().catch (err => null);
                                                    collected.first().delete().catch (err => null);
                                                });

                                        let roleID = role.id;
                                        members = message.guild.roles.get(roleID).members.array();
                                        if (members == null) return message.reply('**Invalid number**');
                                        if (members.length == 0) return message.reply(`**Couldn't fund the number**`);
                                        else {
                                            const msg = await message.channel.send(`**Sending to ${members.length} members...**`)
                                            var count = 0;
                                            var ycount = 0;
                                            var xcount = 0;
                                            message.guild.interval = await setInterval(() => {
                                                if (!members[count]) {
                                                    clearInterval(message.guild.inter);
                                                    msg.edit(new Discord.RichEmbed().setDescription(`** :mailbox_with_mail:  Sent to:  ${ycount} members\n:lock: Couldn't send to: ${xcount} member**`).setTimestamp());
                                                    message.guild.interval = false;
                                                } else if (!members[count].user.bot) {
                                                    members[count].send(`${args}`).then(() => {
                                                        ycount++;
                                                    }).catch(err => {
                                                        return xcount++;
                                                    });
                                                }
                                                count++;
                                            }, 500)
                                        }
                                        collected.first().delete();
                                        m.delete();
                                    }).catch(err => {
                                        return ms.delete().catch (err => null);
                                    })
                            });
                        };
                        if (['1', '2'].includes(c.first().content)) {
                            if (members == null) return message.reply('**Invalid number**');
                            if (members.length == 0) return message.reply(`**Couldn't find the number**`);
                            else {
                                const msg = await message.channel.send(`**Sending to ${members.length} members...**`)
                                var count = 0;
                                var ycount = 0;
                                var xcount = 0;
                                message.guild.interval = await setInterval(() => {
                                    if (!members[count]) {
                                        clearInterval(message.guild.inter);
      msg.edit(new Discord.RichEmbed().setDescription(`** :mailbox_with_mail:  Sent to:  ${ycount} members\n:lock: Couldn't send to: ${xcount} members**`).setTimestamp());
                                        message.guild.interval = false;
                                    } else if (!members[count].user.bot) {
                                        members[count].send(`${args}`).then(() => {
                                            ycount++;
                                        }).catch(err => {
                                            return xcount++;
                                        });
                                    }
                                    count++;
                                }, 500)
                            }
                        }


                    })
                    .catch((err) => {
                        return m.delete().catch (err => null);
                    });
            });
}}
});


// SetName
client.on("message", message => {
     if (message.channel.type === "dm" || message.author.bot) return;
      var lang = db.get(`${message.guild.id}.lang`)
  if (lang == null || undefined) db.set(`${message.guild.id}`, { lang: "ar" })
  if (message.content.startsWith(prefix + "set-name")) {
    if (lang === "en") {
        let args = message.content.split(" ").slice(1).join(" ");
        if (!args[1]) return message.channel.send(`**${prefix}setname-name**`)
    if (message.author.id !== admin) return;
    if (!args) return;
    client.user.setUsername(args)
    message.channel.send(`The name has been changed to ${args}`)
  } else if (lang === "ar") {
             let args = message.content.split(" ").slice(1).join(" ");
        if (!args[1]) return message.channel.send(`**${prefix}setname-name**`)
    if (message.author.id !== admin) return;
    if (!args) return;
    client.user.setUsername(args)
    message.channel.send(`تم تغيير الاسم الى ${args}`) 
  }
}
if (message.content.startsWith(prefix + "set-avatar")) {
        let args = message.content
            .split(" ")
            .slice(1)
            .join(" ");
        if (!message.author.id === admin) return;
        client.user.setAvatar(args).catch(err => message.reply("ارسل رابط صالح رجائا"));
        message.channel.send(`**تم تغيير الصورة بنجاح**`);
    }
});

// Say
client.on('message' , abdo => {
if(abdo.content.startsWith(prefix + 'say')){
if(!abdo.member.hasPermission("ADMINISTRATOR")) return;
abdo.delete();
var abdoargs = abdo.content.split(" ").slice('1').join(" ");
abdo.channel.send(abdoargs)
}
});  

  client.on("message", (msg) => {
    if (msg.channel.type === "dm" || msg.author.bot) return;
    var lang = db.get(`${msg.guild.id}.lang`)
  if (lang == null || undefined) db.set(`${msg.guild.id}`, { lang: "ar" })
if (msg.content.startsWith(prefix + "set-lang")) {
var args = msg.content.split(" ")
if (!args[1]) {

 msg.channel.send(`**\`${prefix}set-lang ar\` --> للغة العربية
\`${prefix}set-lang en\` --> English language**`)
} else if (args[1] === "en") {
  db.set(`${msg.guild.id}`, {
      lang: "en"
  })
  msg.channel.send('**English language selected**')
} else if (args[1] === "ar") {
  db.set(`${msg.guild.id}`, {
      lang: "ar"
  })
  msg.channel.send('**تم تحديد اللغة العربية**')
} else if (args[1] !== "ar" || "en") {
  var lang = db.get(`${msg.guild.id}.lang`)
  if (lang == null || undefined) db.set(`${msg.guild.id}`, { lang: "en" })
  if (lang == "ar") {
      msg.channel.send(
          `**لا يمكن التعرف على الغة**`
      )
  } else if (lang == "en") {
      msg.channel.send(
          `**This language isn't supported**`
      )
}}}
  });

app.listen(() => console.log(`Broadcast Bot By Abdulrahman Tube

         ------------
`)); 
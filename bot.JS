/** @format */

const token = process.env.BOT_TOKEN;
const prefix = ";";
const Discord = require("discord.js");
const bot = new Discord.Client({ disableEveryone: true });
const News = require("./Services/news.js");
const lineByLine = require("n-readlines");
const liner = new lineByLine("./databases/database.txt");

const sqlite3 = require("sqlite3/sqlite3.js");
let db = new sqlite3.Database("./databases/webhooks.db");
let last_ID;
const childProcess = require("child_process");
let hook;
function sendMessage() {
  db.all(`SELECT * FROM webhooks`, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      hook = new Discord.WebhookClient(row.hook_id, row.hook_token);
      hook.send(";news");
    });
  });
}

let crashed = false;
function runScript(scriptPath, callback) {
  // keep track of whether callback has been invoked to prevent multiple invocations
  let invoked = false;

  let process = childProcess.fork(scriptPath);

  // listen for errors as they may prevent the exit event from firing
  process.on("error", function (err) {
    if (invoked) return;
    invoked = true;
    callback(err);
  });

  // execute the callback once the process has finished running
  process.on("exit", function (code) {
    if (invoked) return;
    invoked = true;
    let err = code === 0 ? null : new Error("exit code " + code);
    callback(err);
  });
}
runScript("./Services/news.js", function (err) {
  if (err) throw err;
});
runScript("./Services/randomNews.js", function (err) {
  if (err) throw err;
});
let line;
bot.on("ready", async () => {
  console.log(`${bot.user.username} is online!`);
  bot.user.setActivity(`${prefix}help`, { type: "PLAYING" });
  setInterval(function () {
    sendMessage();
  }, 1000 * 60 * 60);
});

bot.on("message", async (message) => {
  crashed = true;
  if (message.channel.type === "dm") return;
  let hookMsg = message.content;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  if (cmd + args === `${prefix}help`) {
    let botembed = new Discord.MessageEmbed()
      .setTitle("Update Bot Help")
      .setColor("#f55a42")
      .addField(
        "**__Commands:__**",
        "`;help`: This.\n`;news`: Sends the top news article from Google News.\n`;random`: Picks a random article among major headlines in Google News.\n`;hook {webhookID} {webhook token}`: Connects Update Bot to your premade webhook where it sends the top headline every hour by calling `;news` automatically.\n`;removehook {webhookID} {webhook token}`:Disconnects update bot from any webhooks that it was previously connected to.\n Make sure that the spacing is correct for all commands",
        true
      )
      .setThumbnail(
        "https://github.com/Sarthak-Dayal/Update-Bot/blob/remove-image-url/assets/logo.png"
      )
      .setTimestamp()
      .setFooter(
        "Update Bot: enlightening Discord with current events",
        "https://github.com/Sarthak-Dayal/Update-Bot/blob/remove-image-url/assets/logo.png"
      );

    return message.channel.send(botembed);
  }
  if (cmd + args === `${prefix}news`) {
    runScript("./Services/news.js", function (err) {
      if (err) throw err;
    });
    line = liner.next();
    let url = line;

    line = liner.next();
    let title = line;

    liner.reset();

    let botembed = new Discord.MessageEmbed()
      .setTitle("Top Headline")
      .setColor("#f55a42")
      .addField("Article Title: ", title, true)
      .addField("URL: ", url, true)
      .setFooter("Update bot: enlightening Discord with current events");

    return message.channel.send(botembed);
  }
  if (cmd + args === `${prefix}random`) {
    runScript("./Services/randomNews.js", function (err) {
      if (err) throw err;
    });
    const liner2 = new lineByLine("databases/database2.txt");
    liner2.reset();
    line = liner2.next();
    let url2 = line;

    line = liner2.next();
    let title2 = line;

    liner2.reset();

    let botembed = new Discord.MessageEmbed()
      .setTitle("Random Headline")
      .setColor("#f55a42")
      .addField("Article Title: ", title2, true)
      .addField("URL: ", url2, true)
      .setFooter("Update bot: enlightening Discord with current events");

    return message.channel.send(botembed);
  }
  if (cmd + args === `${prefix}bruh`) {
    let botembed = new Discord.MessageEmbed()
      .setTitle("BRUH INITIALIZED")
      .setColor("#f55a42")
      .addField(
        "You figured it out",
        "The secret command has been intialized",
        true
      )
      .setThumbnail(
        "https://github.com/Sarthak-Dayal/Update-Bot/blob/remove-image-url/assets/logo.png"
      )
      .setTimestamp()
      .setFooter(
        "Update Bot: enlightening Discord with current events",
        "https://github.com/Sarthak-Dayal/Update-Bot/blob/remove-image-url/assets/logo.png"
      );
    return message.channel.send(botembed);
  }
  if (hookMsg.startsWith(`${prefix}hook`)) {
    db.run(
      `INSERT INTO webhooks (hook_id, hook_token) VALUES(?, ?)`,
      [hookMsg.split(" ")[1], hookMsg.split(" ")[2]],
      function (err) {
        if (err) {
          return message.channel.send(
            "**ERROR: RUN THE HOOK COMMAND ONLY ONCE FOR ONE WEBHOOK AND CHECK THAT THE ID AND TOKE ARE CORRECT**"
          );
        }
        last_ID = this.lastID;
        return message.channel.send("**Webhook has been set up!**");
      }
    );
  }
  if (hookMsg.startsWith(`${prefix}removehook`)) {
    db.run(
      `DELETE FROM webhooks WHERE hook_id= (?);`,
      [hookMsg.split(" ")[1]],
      function (err) {
        if (err) {
          return message.channel.send("**ERROR: UNABLE TO DELETE WEBHOOK**");
        }
        last_ID = this.lastID;
        return message.channel.send("**Webhook has been removed!**");
      }
    );
  }
});

bot.login(token);

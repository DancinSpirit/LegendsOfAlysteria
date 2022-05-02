const {Client, Intents, MessageEmbed} = require("discord.js");
const db = require("./models");
const bot = new Client({
    intents: [Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});
const TOKEN = process.env.TOKEN;

bot.login(TOKEN);
bot.on("ready", async function(){
    console.log(`Logged In As ${bot.user.tag}!`)
});

//This is a listener that allows you to input comands (functions) from the console.
const stdin = process.openStdin();
stdin.addListener("data", function(d){
    try {
        eval(d.toString());
    } catch (error) {
        console.log("Invalid Command!")
    }
})

module.exports = bot;
const {Client} = require("discord.js-light");
const bot = new Client({
    cacheChannels: true
});
const TOKEN = process.env.TOKEN;

bot.login(TOKEN);

bot.on("ready", ()=>{
    console.log(`Logged In as ${bot.user.tag}`)
});

module.exports = bot;
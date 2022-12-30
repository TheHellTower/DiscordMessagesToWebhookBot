require("dotenv").config();

const { Client, GatewayIntentBits, AuditLogEvent } = require('discord.js'), client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ] 
}),
    fs = require("fs"),
    PREFIX = process.env.PREFIX;

client.on('ready', () => {
    console.clear();
    console.log(`Logged in as ${client.user.tag} !\nInvite: https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`);
});

client.on('messageCreate', async message => { //Done so simply that it doesn't require anything special or any exact value
    if(message.author.bot) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/g),
        command = args.shift().toLowerCase(),
        commandArgs = args.join(" ").split(" ");
    
    let data = fs.readFileSync("channels.txt").toString();
    if(command  == "add") {
        if(message.content.split(" ").length < 2) return message.reply({ content: "Specify a #channel" });
        let chan = commandArgs[0].replace("<#", "").replace(">", "");
        if(data.includes(chan)) return message.reply("This channel is already in the targeted channels !");
        fs.appendFile('channels.txt', `${chan}\n`, function (err) {
            if (err) throw err;
            return message.reply({ content: `<#${chan}> added !` });
        });
          
    } else if(command == "del") {
        if(message.content.split(" ").length < 2) return message.reply({ content: "Specify a #channel" });
        let chan = commandArgs[0].replace("<#", "").replace(">", "");
        if(!data.includes(chan)) return message.reply("This channel is not in the targeted channels !");
        fs.writeFile('channels.txt', data.replaceAll(`${chan}\n`, ""), function (err) {
            if (err) throw err;
            return message.reply({ content: `<#${chan}> removed !` });
        });
    } else {
        if(data.includes(message.channel.id)){
            message.delete();
            message.channel.createWebhook({
                name: message.author.tag,
                avatar: message.author.displayAvatarURL(),
                reason: "MessagesToWebhook channel"
              }).then(async w => await w.send(message.content) && w.delete()).catch(console.error);
        }
    }
})

client.login(process.env.TOKEN).catch(() => {
    console.log("The token is invalid.");
});
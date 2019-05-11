const DiscordJs = require('discord.js');
const Config = require('./config');
const Permission = require('./permission');
const Embed = require('./embed');
const Commands = require('../config/commands.json');

const embedBuddy = new DiscordJs.Client();
const settings = Config.getConfigs();

// start the bot
const init = () => {
    registerListeners();
    embedBuddy.login(settings.BOT_TOKEN);
}

// event listeners for bot events 
const registerListeners = () => {
    embedBuddy.on('ready', () => {
        console.log(`Logged in as ${embedBuddy.user.tag}!`);
    });

    embedBuddy.on('message', msg => {
        // ignore bot msgs 
        if (msg.author.bot) return;

        //check msgs with trigger
        if ((msg.content).startsWith(settings.BOT_TRIGGER)) {

            if (Permission.check(msg)) {
                // get data from user msg
                let data = (msg.content).split(settings.BOT_TRIGGER)[1].trim();

                // check if this is not a custom command
                if (!Commands[data]) {
                    // get embed data object
                    let embedData = getEmbedData(data);
                    // create embed
                    let customEmbed = Embed.getEmbed(embedData);
                    // send custom embed to discord
                    sendResponse(msg, customEmbed, embedData.chName);

                } else {
                    // send response for the custom command
                    sendResponse(msg, Commands[data]);
                }

            } else {
                sendResponse(msg, "```Sorry, You don't have the Permission!.```");
            }

            // delete command msg after 1s
            msg.delete(1000);
        }

    });
};

// create and return an object with data from discord
const getEmbedData = (data) => {
    // split data to a array
    let info = data.split("|");

    let embedData = {
        "title": "",
        "desc": "",
        "chName": "",
        "color": "",
        "thumb": "",
        "author": {
            "name": "",
            "img": "",
            "link": ""
        }
    };

    if (info[0]) embedData.title = info[0].trim();
    if (info[1]) embedData.desc = info[1].trim();
    if (info[2]) embedData.chName = info[2].trim();
    if (info[3]) embedData.color = info[3].trim();
    if (info[4]) embedData.thumb = info[4].trim();
    if (info[5]) embedData.author.name = info[5].trim();
    if (info[6]) embedData.author.img = info[6].trim();
    if (info[7]) embedData.author.link = info[7].trim();

    return embedData;
};

// send response back to discord
const sendResponse = (msg, str, chName = "") => {
    if (chName == "") {
        msg.channel.send(str)
    } else {
        const channel = embedBuddy.channels.find(channels => channels.name == chName);
        channel.send(str)
    }
};


module.exports = {
    init
};
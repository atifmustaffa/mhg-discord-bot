function startBot() {
    const config = require("./config.json");
    const Discord = require("discord.js");
    const bot = new Discord.Client();
    const helper = require('./helper.js');
    const commands = require('./commands.json');

    // Loads data from file
    helper.loadData()

    bot.on("ready", async () => {
        helper.log(`${bot.user.username} is online on ${bot.guilds.size} server(s)!`);
        bot.user.setActivity(`TI9 with Atif`, {
            type: "Watching"
        });
    });

    bot.on("message", async (message) => {
        if (!message.content.startsWith(config.prefix) || message.author.bot) return;

        var args = message.content.toLowerCase().slice(config.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        helper.log('user:', message.author.tag, 'command:', message.content.toLowerCase())

        switch (command) {
            case 'help':
                const embed = {
                    "description": "Commands List \n",
                    "color": parseInt(config.color.orange),
                    "thumbnail": {
                        "url": "https://gamepedia.cursecdn.com/dota2_gamepedia/thumb/4/46/SeasonalRankTop4.png/140px-SeasonalRankTop4.png?version=c50e23ba43564fe0b153f569d84fab0d"
                    },
                    "timestamp": new Date(2019, 8 - 1, 10, 11 - 8, 51, 0), // (year, month - 1, day, hour - 8, minute, second)
                    "footer": {
                        "text": "Last updated"
                    },
                    "fields": commands.commands
                };
                // [
                //     {
                //         "name": "🤔",
                //         "value": "some of these properties have certain limits..."
                //     },
                //     {
                //         "name": "😱",
                //         "value": "try exceeding some of them!"
                //     },
                //     {
                //         "name": "🙄",
                //         "value": "an informative error should show up, and this view will remain as-is until all issues are fixed"
                //     },
                //     {
                //         "name": "<:thonkang:219069250692841473>",
                //         "value": "these last two",
                //         "inline": true
                //     },
                //     {
                //         "name": "<:thonkang:219069250692841473>",
                //         "value": "are inline fields",
                //         "inline": true
                //     }
                // ]
                message.channel.send({ embed });
                break;

            // Special TI9 Fantasy
            case 'fantasy':

                let apiCall = function (title, sql) {

                    // Custom formatting
                    const color_atif = 'json'
                    const color_ini = 'ini'

                    const https = require('https')
                    const Table = require('easy-table')

                    const MAX_CHAR = 2000
                    const MESSAGE_TITLE = title
                    const CODE_BLOCK = '```'

                    var url = `${config.API.opendota}explorer?sql=${sql}`
                    https.get(url, (resp) => {
                        let data = '';
                        // A chunk of data has been recieved.
                        resp.on('data', (chunk) => {
                            data += chunk;
                        });
                        // The whole response has been received. Print out the result.
                        resp.on('end', () => {
                            rows = JSON.parse(data).rows
                            if (rows && rows.length > 0) {
                                var t = new Table
                                t.separator = '   '
                                for (var dat of rows) {
                                    t.cell('Name', dat["name"])
                                    t.cell('AVG', parseFloat(dat["AVG Fantasy Pts"]), Table.number(2))
                                    t.cell('Matches', parseInt(dat["count"]), Table.number(0))
                                    t.cell('Sum', parseFloat(dat["sum"]), Table.number(1))
                                    t.newRow()
                                }

                                // Check if sort is selected
                                if (args[1] === 'sort' && args[2] != undefined) {
                                    switch (args[2]) {
                                        case 'avg': t.sort(['AVG|des'])
                                            break
                                        case 'matches': t.sort(['Matches|des'])
                                            break
                                        case 'sum': t.sort(['Sum|des'])
                                            break
                                        default: 
                                    }
                                }


                                var messages = new Array()
                                var tables = t.toString()
                                while (tables.length > MAX_CHAR - CODE_BLOCK.length * 2) {
                                    const limit = tables.substring(0, Math.min(tables.length, MAX_CHAR - CODE_BLOCK.length * 2))
                                    const msg = limit.substring(0, limit.lastIndexOf("\n"));
                                    messages.push(msg)
                                    tables = tables.replace(msg, "")
                                }
                                messages.push(tables) // Remaining data

                                message.channel.send(MESSAGE_TITLE)
                                // Send message(s)
                                for (var msg of messages)
                                    message.channel.send(CODE_BLOCK + msg + CODE_BLOCK)

                                message.channel.send({
                                    embed: {
                                        "description": "Data retrieved from [OpenDota](" + config.opendota + ")",
                                        "color": parseInt(config.color.lightblue)
                                    }
                                })
                            } else message.channel.send('```Data not found. Please try again later```')
                        });
                    }).on("error", (err) => {
                        console.log("Error: " + err.message);
                    });
                }

                if (args[0] === 'total') {
                    apiCall('The International 2019 - Total Fantasy Point', encodeURIComponent(getTotalSQL()))
                }
                else if (args[0] === 'today') {
                    var today = new Date(new Date().toDateString())
                    var tomorrow = new Date(new Date(new Date().setDate(today.getDate() + 1)).toDateString())
                    apiCall('The International 2019 - Today Fantasy Point', encodeURIComponent(getRangedSQL(today.toJSON(), tomorrow.toJSON())))
                }
                else
                    message.channel.send('Invalid command. Available command: `!fantasy total` and `!fantasy today`')
                break

            case 'hi':
                message.channel.send(`Hey ${message.author}!`);
                break

            case 'ping':
                message.reply("pong!");
                break

            case 'clearalldata':
                if (message.author.id === config.adminId) {
                    helper.clearAllData()
                    message.reply("Ok bosskuu. Removed everything :D")
                }
                break

            case 'dotabuff':
                if (args[0] === 'match')
                    message.reply(`Check out your match here ${config.dotabuff}matches/${args[1]}`)
                else if (args[0] === 'player')
                    message.reply(`Check out player history here ${config.dotabuff}players/${args[1]}`)
                else
                    message.reply('Invalid command bro. Please insert type and id eg: `!dotabuff player 100846798`')
                break

            case 'remember':
                var getUserId = (arg) => {
                    if (arg === 'my')
                        return message.author.id
                    else if (arg.includes('@'))
                        return args[0].replace(/[<@>]/g, '')
                    else
                        return arg
                }
                var userid = getUserId(args[0])
                if (args[1] === 'dotaid') {
                    helper.saveData(userid, 'dotaid', args[2])
                    message.reply(`Alright I'll remember that`, args[0])
                }
                break

            case 'my':
                if (args[0] === 'dotaid') {
                    var value = helper.getData(message.author.id, 'dotaid').value
                    message.reply(`Your dotaid is ${value}`)
                }
                else if (args[0] === 'dotabuff') {
                    var value = helper.getData(message.author.id, 'dotaid').value
                    message.reply(`Your dotabuff is ${config.dotabuff}players/${value}`)
                }
                break

            case 'give':
                var getUserId = (arg) => {
                    if (arg === 'my')
                        return message.author.id
                    else if (arg.includes('@'))
                        return args[0].replace(/[<@>]/g, '')
                    else
                        return arg
                }
                var userid = getUserId(args[0])
                if (args[1] === 'dotaid') {
                    var value = helper.getData(userid, 'dotaid').value
                    message.reply(args[0] === 'my' ? `Your dotaid is ${value}` : `<@${userid}> dotaid is ${value}`)
                }
                else if (args[1] === 'dotabuff') {
                    var value = helper.getData(userid, 'dotaid').value
                    message.reply(args[0] === 'my' ? `Your dotabuff is ${config.dotabuff}players/${value}` : `<@${userid}> dotabuff is ${config.dotabuff}players/${value}`)
                }
                break
        }
    });

    // helper.saveData('atif', 'name', 'Atif')

    bot.login(process.env.BOT_TOKEN);
}
function getTotalSQL() {
    return `SELECT
    notable_players.name ,
    avg(round((0.3 * kills + (3 - 0.3 * deaths) + 0.003 * (last_hits + denies) + 0.002 * gold_per_min + towers_killed + roshans_killed + 3 * teamfight_participation + 0.5 * observers_placed + 0.5 * camps_stacked + 0.25 * rune_pickups + 4 * firstblood_claimed + 0.05 * stuns)::numeric, 1)) "AVG Fantasy Pts",
    count(distinct matches.match_id) count,
    sum(case when (player_matches.player_slot < 128) = radiant_win then 1 else 0 end)::float/count(1) winrate,
    ((sum(case when (player_matches.player_slot < 128) = radiant_win then 1 else 0 end)::float/count(1)) 
    + 1.96 * 1.96 / (2 * count(1)) 
    - 1.96 * sqrt((((sum(case when (player_matches.player_slot < 128) = radiant_win then 1 else 0 end)::float/count(1)) * (1 - (sum(case when (player_matches.player_slot < 128) = radiant_win then 1 else 0 end)::float/count(1))) + 1.96 * 1.96 / (4 * count(1))) / count(1))))
    / (1 + 1.96 * 1.96 / count(1)) winrate_wilson,
    sum(round((0.3 * kills + (3 - 0.3 * deaths) + 0.003 * (last_hits + denies) + 0.002 * gold_per_min + towers_killed + roshans_killed + 3 * teamfight_participation + 0.5 * observers_placed + 0.5 * camps_stacked + 0.25 * rune_pickups + 4 * firstblood_claimed + 0.05 * stuns)::numeric, 1)) sum,
    min(round((0.3 * kills + (3 - 0.3 * deaths) + 0.003 * (last_hits + denies) + 0.002 * gold_per_min + towers_killed + roshans_killed + 3 * teamfight_participation + 0.5 * observers_placed + 0.5 * camps_stacked + 0.25 * rune_pickups + 4 * firstblood_claimed + 0.05 * stuns)::numeric, 1)) min,
    max(round((0.3 * kills + (3 - 0.3 * deaths) + 0.003 * (last_hits + denies) + 0.002 * gold_per_min + towers_killed + roshans_killed + 3 * teamfight_participation + 0.5 * observers_placed + 0.5 * camps_stacked + 0.25 * rune_pickups + 4 * firstblood_claimed + 0.05 * stuns)::numeric, 1)) max,
    stddev(round((0.3 * kills + (3 - 0.3 * deaths) + 0.003 * (last_hits + denies) + 0.002 * gold_per_min + towers_killed + roshans_killed + 3 * teamfight_participation + 0.5 * observers_placed + 0.5 * camps_stacked + 0.25 * rune_pickups + 4 * firstblood_claimed + 0.05 * stuns)::numeric, 1)::numeric) stddev

    FROM matches
    JOIN match_patch using(match_id)
    JOIN leagues using(leagueid)
    JOIN player_matches using(match_id)
    JOIN heroes on heroes.id = player_matches.hero_id
    LEFT JOIN notable_players ON notable_players.account_id = player_matches.account_id
    LEFT JOIN teams using(team_id)
    WHERE TRUE
    AND round((0.3 * kills + (3 - 0.3 * deaths) + 0.003 * (last_hits + denies) + 0.002 * gold_per_min + towers_killed + roshans_killed + 3 * teamfight_participation + 0.5 * observers_placed + 0.5 * camps_stacked + 0.25 * rune_pickups + 4 * firstblood_claimed + 0.05 * stuns)::numeric, 1) IS NOT NULL 
    AND matches.start_time >= extract(epoch from timestamp '2019-08-14T16:00:00.000Z')
    AND teams.team_id IN (15, 36, 39, 2163, 111474, 350190, 543897, 726228, 1838315, 1883502, 2108395, 2586976, 2626685, 2672298, 6209804, 6214538, 6214973, 7203342)
    GROUP BY notable_players.name
    HAVING count(distinct matches.match_id) >= 1
    ORDER BY "AVG Fantasy Pts" DESC,count DESC NULLS LAST
    LIMIT 200`
}
function getRangedSQL(start, end) {
    return `SELECT
    notable_players.name ,
    avg(round((0.3 * kills + (3 - 0.3 * deaths) + 0.003 * (last_hits + denies) + 0.002 * gold_per_min + towers_killed + roshans_killed + 3 * teamfight_participation + 0.5 * observers_placed + 0.5 * camps_stacked + 0.25 * rune_pickups + 4 * firstblood_claimed + 0.05 * stuns)::numeric, 1)) "AVG Fantasy Pts",
    count(distinct matches.match_id) count,
    sum(case when (player_matches.player_slot < 128) = radiant_win then 1 else 0 end)::float/count(1) winrate,
    ((sum(case when (player_matches.player_slot < 128) = radiant_win then 1 else 0 end)::float/count(1)) 
    + 1.96 * 1.96 / (2 * count(1)) 
    - 1.96 * sqrt((((sum(case when (player_matches.player_slot < 128) = radiant_win then 1 else 0 end)::float/count(1)) * (1 - (sum(case when (player_matches.player_slot < 128) = radiant_win then 1 else 0 end)::float/count(1))) + 1.96 * 1.96 / (4 * count(1))) / count(1))))
    / (1 + 1.96 * 1.96 / count(1)) winrate_wilson,
    sum(round((0.3 * kills + (3 - 0.3 * deaths) + 0.003 * (last_hits + denies) + 0.002 * gold_per_min + towers_killed + roshans_killed + 3 * teamfight_participation + 0.5 * observers_placed + 0.5 * camps_stacked + 0.25 * rune_pickups + 4 * firstblood_claimed + 0.05 * stuns)::numeric, 1)) sum,
    min(round((0.3 * kills + (3 - 0.3 * deaths) + 0.003 * (last_hits + denies) + 0.002 * gold_per_min + towers_killed + roshans_killed + 3 * teamfight_participation + 0.5 * observers_placed + 0.5 * camps_stacked + 0.25 * rune_pickups + 4 * firstblood_claimed + 0.05 * stuns)::numeric, 1)) min,
    max(round((0.3 * kills + (3 - 0.3 * deaths) + 0.003 * (last_hits + denies) + 0.002 * gold_per_min + towers_killed + roshans_killed + 3 * teamfight_participation + 0.5 * observers_placed + 0.5 * camps_stacked + 0.25 * rune_pickups + 4 * firstblood_claimed + 0.05 * stuns)::numeric, 1)) max,
    stddev(round((0.3 * kills + (3 - 0.3 * deaths) + 0.003 * (last_hits + denies) + 0.002 * gold_per_min + towers_killed + roshans_killed + 3 * teamfight_participation + 0.5 * observers_placed + 0.5 * camps_stacked + 0.25 * rune_pickups + 4 * firstblood_claimed + 0.05 * stuns)::numeric, 1)::numeric) stddev
    
    FROM matches
    JOIN match_patch using(match_id)
    JOIN leagues using(leagueid)
    JOIN player_matches using(match_id)
    JOIN heroes on heroes.id = player_matches.hero_id
    LEFT JOIN notable_players ON notable_players.account_id = player_matches.account_id
    LEFT JOIN teams using(team_id)
    WHERE TRUE
    AND round((0.3 * kills + (3 - 0.3 * deaths) + 0.003 * (last_hits + denies) + 0.002 * gold_per_min + towers_killed + roshans_killed + 3 * teamfight_participation + 0.5 * observers_placed + 0.5 * camps_stacked + 0.25 * rune_pickups + 4 * firstblood_claimed + 0.05 * stuns)::numeric, 1) IS NOT NULL 
    AND matches.start_time >= extract(epoch from timestamp '${start}')
    AND matches.start_time <= extract(epoch from timestamp '${end}')
    AND teams.team_id IN (15, 36, 39, 2163, 111474, 350190, 543897, 726228, 1838315, 1883502, 2108395, 2586976, 2626685, 2672298, 6209804, 6214538, 6214973, 7203342)
    GROUP BY notable_players.name
    HAVING count(distinct matches.match_id) >= 1
    ORDER BY "AVG Fantasy Pts" DESC,count DESC NULLS LAST
    LIMIT 200`
}
function getTestSQL() {
    return `SELECT
    notable_players.name ,
    avg(round((0.3 * kills + (3 - 0.3 * deaths) + 0.003 * (last_hits + denies) + 0.002 * gold_per_min + towers_killed + roshans_killed + 3 * teamfight_participation + 0.5 * observers_placed + 0.5 * camps_stacked + 0.25 * rune_pickups + 4 * firstblood_claimed + 0.05 * stuns)::numeric, 1)) "AVG Fantasy Pts",
    count(distinct matches.match_id) count,
    sum(case when (player_matches.player_slot < 128) = radiant_win then 1 else 0 end)::float/count(1) winrate,
    ((sum(case when (player_matches.player_slot < 128) = radiant_win then 1 else 0 end)::float/count(1)) 
    + 1.96 * 1.96 / (2 * count(1)) 
    - 1.96 * sqrt((((sum(case when (player_matches.player_slot < 128) = radiant_win then 1 else 0 end)::float/count(1)) * (1 - (sum(case when (player_matches.player_slot < 128) = radiant_win then 1 else 0 end)::float/count(1))) + 1.96 * 1.96 / (4 * count(1))) / count(1))))
    / (1 + 1.96 * 1.96 / count(1)) winrate_wilson,
    sum(round((0.3 * kills + (3 - 0.3 * deaths) + 0.003 * (last_hits + denies) + 0.002 * gold_per_min + towers_killed + roshans_killed + 3 * teamfight_participation + 0.5 * observers_placed + 0.5 * camps_stacked + 0.25 * rune_pickups + 4 * firstblood_claimed + 0.05 * stuns)::numeric, 1)) sum,
    min(round((0.3 * kills + (3 - 0.3 * deaths) + 0.003 * (last_hits + denies) + 0.002 * gold_per_min + towers_killed + roshans_killed + 3 * teamfight_participation + 0.5 * observers_placed + 0.5 * camps_stacked + 0.25 * rune_pickups + 4 * firstblood_claimed + 0.05 * stuns)::numeric, 1)) min,
    max(round((0.3 * kills + (3 - 0.3 * deaths) + 0.003 * (last_hits + denies) + 0.002 * gold_per_min + towers_killed + roshans_killed + 3 * teamfight_participation + 0.5 * observers_placed + 0.5 * camps_stacked + 0.25 * rune_pickups + 4 * firstblood_claimed + 0.05 * stuns)::numeric, 1)) max,
    stddev(round((0.3 * kills + (3 - 0.3 * deaths) + 0.003 * (last_hits + denies) + 0.002 * gold_per_min + towers_killed + roshans_killed + 3 * teamfight_participation + 0.5 * observers_placed + 0.5 * camps_stacked + 0.25 * rune_pickups + 4 * firstblood_claimed + 0.05 * stuns)::numeric, 1)::numeric) stddev

    FROM matches
    JOIN match_patch using(match_id)
    JOIN leagues using(leagueid)
    JOIN player_matches using(match_id)
    JOIN heroes on heroes.id = player_matches.hero_id
    LEFT JOIN notable_players ON notable_players.account_id = player_matches.account_id
    LEFT JOIN teams using(team_id)
    WHERE TRUE
    AND round((0.3 * kills + (3 - 0.3 * deaths) + 0.003 * (last_hits + denies) + 0.002 * gold_per_min + towers_killed + roshans_killed + 3 * teamfight_participation + 0.5 * observers_placed + 0.5 * camps_stacked + 0.25 * rune_pickups + 4 * firstblood_claimed + 0.05 * stuns)::numeric, 1) IS NOT NULL 
    AND matches.start_time >= extract(epoch from timestamp '2019-06-04T16:00:00.000Z')
    AND matches.start_time <= extract(epoch from timestamp '2019-08-15T16:00:00.000Z')
    AND teams.team_id IN (15, 36, 39, 2163, 111474, 350190, 543897, 726228, 1838315, 1883502, 2108395, 2586976, 2626685, 2672298, 6209804, 6214538, 6214973, 7203342)
    GROUP BY notable_players.name
    HAVING count(distinct matches.match_id) >= 1
    ORDER BY "AVG Fantasy Pts" DESC,count DESC NULLS LAST
    LIMIT 200`
}
module.exports = {
    startBot: startBot
}
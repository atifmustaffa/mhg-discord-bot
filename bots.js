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

        var args = message.content.slice(config.prefix.length).trim().split(/ +/g);
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
                const https = require('https')
                const Table = require('easy-table')
                // var url = `https://api.opendota.com/api/explorer?sql=SELECT%0A%20%20%20%20%20%20%20%20notable_players.name%20%2C%0Aavg(round((0.3%20*%20kills%20%2B%20(3%20-%200.3%20*%20deaths)%20%2B%200.003%20*%20(last_hits%20%2B%20denies)%20%2B%200.002%20*%20gold_per_min%20%2B%20towers_killed%20%2B%20roshans_killed%20%2B%203%20*%20teamfight_participation%20%2B%200.5%20*%20observers_placed%20%2B%200.5%20*%20camps_stacked%20%2B%200.25%20*%20rune_pickups%20%2B%204%20*%20firstblood_claimed%20%2B%200.05%20*%20stuns)%3A%3Anumeric%2C%201))%20%22AVG%20Fantasy%20Pts%22%2C%0Acount(distinct%20matches.match_id)%20count%2C%0Asum(case%20when%20(player_matches.player_slot%20%3C%20128)%20%3D%20radiant_win%20then%201%20else%200%20end)%3A%3Afloat%2Fcount(1)%20winrate%2C%0A((sum(case%20when%20(player_matches.player_slot%20%3C%20128)%20%3D%20radiant_win%20then%201%20else%200%20end)%3A%3Afloat%2Fcount(1))%20%0A%2B%201.96%20*%201.96%20%2F%20(2%20*%20count(1))%20%0A-%201.96%20*%20sqrt((((sum(case%20when%20(player_matches.player_slot%20%3C%20128)%20%3D%20radiant_win%20then%201%20else%200%20end)%3A%3Afloat%2Fcount(1))%20*%20(1%20-%20(sum(case%20when%20(player_matches.player_slot%20%3C%20128)%20%3D%20radiant_win%20then%201%20else%200%20end)%3A%3Afloat%2Fcount(1)))%20%2B%201.96%20*%201.96%20%2F%20(4%20*%20count(1)))%20%2F%20count(1))))%0A%2F%20(1%20%2B%201.96%20*%201.96%20%2F%20count(1))%20winrate_wilson%2C%0Asum(round((0.3%20*%20kills%20%2B%20(3%20-%200.3%20*%20deaths)%20%2B%200.003%20*%20(last_hits%20%2B%20denies)%20%2B%200.002%20*%20gold_per_min%20%2B%20towers_killed%20%2B%20roshans_killed%20%2B%203%20*%20teamfight_participation%20%2B%200.5%20*%20observers_placed%20%2B%200.5%20*%20camps_stacked%20%2B%200.25%20*%20rune_pickups%20%2B%204%20*%20firstblood_claimed%20%2B%200.05%20*%20stuns)%3A%3Anumeric%2C%201))%20sum%2C%0Amin(round((0.3%20*%20kills%20%2B%20(3%20-%200.3%20*%20deaths)%20%2B%200.003%20*%20(last_hits%20%2B%20denies)%20%2B%200.002%20*%20gold_per_min%20%2B%20towers_killed%20%2B%20roshans_killed%20%2B%203%20*%20teamfight_participation%20%2B%200.5%20*%20observers_placed%20%2B%200.5%20*%20camps_stacked%20%2B%200.25%20*%20rune_pickups%20%2B%204%20*%20firstblood_claimed%20%2B%200.05%20*%20stuns)%3A%3Anumeric%2C%201))%20min%2C%0Amax(round((0.3%20*%20kills%20%2B%20(3%20-%200.3%20*%20deaths)%20%2B%200.003%20*%20(last_hits%20%2B%20denies)%20%2B%200.002%20*%20gold_per_min%20%2B%20towers_killed%20%2B%20roshans_killed%20%2B%203%20*%20teamfight_participation%20%2B%200.5%20*%20observers_placed%20%2B%200.5%20*%20camps_stacked%20%2B%200.25%20*%20rune_pickups%20%2B%204%20*%20firstblood_claimed%20%2B%200.05%20*%20stuns)%3A%3Anumeric%2C%201))%20max%2C%0Astddev(round((0.3%20*%20kills%20%2B%20(3%20-%200.3%20*%20deaths)%20%2B%200.003%20*%20(last_hits%20%2B%20denies)%20%2B%200.002%20*%20gold_per_min%20%2B%20towers_killed%20%2B%20roshans_killed%20%2B%203%20*%20teamfight_participation%20%2B%200.5%20*%20observers_placed%20%2B%200.5%20*%20camps_stacked%20%2B%200.25%20*%20rune_pickups%20%2B%204%20*%20firstblood_claimed%20%2B%200.05%20*%20stuns)%3A%3Anumeric%2C%201)%3A%3Anumeric)%20stddev%0A%20%20%0AFROM%20matches%0AJOIN%20match_patch%20using(match_id)%0AJOIN%20leagues%20using(leagueid)%0AJOIN%20player_matches%20using(match_id)%0AJOIN%20heroes%20on%20heroes.id%20%3D%20player_matches.hero_id%0ALEFT%20JOIN%20notable_players%20ON%20notable_players.account_id%20%3D%20player_matches.account_id%0ALEFT%20JOIN%20teams%20using(team_id)%0AWHERE%20TRUE%0AAND%20round((0.3%20*%20kills%20%2B%20(3%20-%200.3%20*%20deaths)%20%2B%200.003%20*%20(last_hits%20%2B%20denies)%20%2B%200.002%20*%20gold_per_min%20%2B%20towers_killed%20%2B%20roshans_killed%20%2B%203%20*%20teamfight_participation%20%2B%200.5%20*%20observers_placed%20%2B%200.5%20*%20camps_stacked%20%2B%200.25%20*%20rune_pickups%20%2B%204%20*%20firstblood_claimed%20%2B%200.05%20*%20stuns)%3A%3Anumeric%2C%201)%20IS%20NOT%20NULL%20%0AAND%20matches.start_time%20%3E%3D%20extract(epoch%20from%20timestamp%20%272019-07-11T16%3A00%3A00.000Z%27)%0AAND%20matches.start_time%20%3C%3D%20extract(epoch%20from%20timestamp%20%272019-08-15T16%3A00%3A00.000Z%27)%0AAND%20teams.team_id%20IN%20(15%2C%2036%2C%2039%2C%202163%2C%20111474%2C%20350190%2C%20543897%2C%20726228%2C%201838315%2C%201883502%2C%202108395%2C%202586976%2C%202626685%2C%202672298%2C%206209804%2C%206214538%2C%206214973%2C%207203342)%0AGROUP%20BY%20notable_players.name%0AHAVING%20count(distinct%20matches.match_id)%20%3E%3D%201%0AORDER%20BY%20%22AVG%20Fantasy%20Pts%22%20DESC%2Ccount%20DESC%20NULLS%20LAST%0ALIMIT%20200`
                var url = `${config.API.opendota}explorer?sql=${encodeURIComponent(getTestSQL())}`

                https.get(url, (resp) => {
                    let data = '';
                    // A chunk of data has been recieved.
                    resp.on('data', (chunk) => {
                        data += chunk;
                    });
                    // The whole response has been received. Print out the result.
                    resp.on('end', () => {
                        rows = JSON.parse(data).rows
                        // let table = `| name\t\t\t | avg | matches | sum |\n|--------|-----|---------|-----|\n`
                        // for (var x = 0; x < rows.length; x++) {
                        //     table += `| ${rows[x]["name"]}\t\t\t | ${rows[x]["AVG Fantasy Pts"]} | ${rows[x]["count"]} | ${rows[x]["sum"]} |\n`
                        // }
                        var t = new Table
                        var txt = ''
                        for(var dat of rows) {
                        // rows.forEach(function (dat) {
                            t.cell('Name', dat["name"])
                            t.cell('AVG', parseFloat(dat["AVG Fantasy Pts"]), Table.number(2))
                            t.cell('Matches', parseInt(dat["count"]), Table.number(0))
                            t.cell('Sum', parseFloat(dat["sum"]), Table.number(1))
                            t.newRow()
                            if (t.toString().length >= 2000) {
                                txt = t.toString().replace(/\r?\n?[^\r\n]*$/, "")
                                break
                            }
                        }
                        txt = t.toString()
                        message.channel.send('```' + txt.length + '```')
                        message.channel.send('```' + txt + '```')
                    });
                }).on("error", (err) => {
                    console.log("Error: " + err.message);
                });

                // https://api.opendota.com/api/
                // var today = new Date(new Date().toDateString())
                // var tomorrow = new Date(new Date(new Date().setDate(today.getDate() + 1)).toDateString())
                // if (args[0] == null || args[0] === '' || args[0] === 'total') {
                //     message.reply('')
                // }
                // else if (args[0] === 'today') {
                //     message.channel.send('tdy')
                // }
                // else
                //     message.channel.send('Invalid command. Available command: `!fantasy total` and `!fantasy today`')
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
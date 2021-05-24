// Imports
const config = require("./config.json");
const Discord = require("discord.js");
const helper = require('./helper.js');
const commands = require('./commands.json');
// Games
const TicTacToe = require('./games/tictactoe')

let bot = null;
let botReady = false;
let gamesCollection = Array()

const defaultActivityType = ['Playing', 'Streaming', 'Listening', 'Watching']

function startBot() {

    bot = new Discord.Client();

    // Loads data from file
    helper.loadData()

    bot.on("ready", async () => {
        botReady = true;

        helper.log(`${bot.user.username} is online on ${bot.guilds.size} server(s)!`);

        bot.user.setActivity(`Dota 2 Twitch Stream`, {
            type: "Watching"
        });
        let activityName = "Watching Dota 2 Twitch Stream"

        helper.log(`${bot.user.username} is ${activityName}`);
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
                        "url": "https://media.discordapp.net/attachments/660818037292924938/714796385781940234/mhg-250x150.png"
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

                // Custom formatting
                const TEXT_SYNTAX = 'md'
                const PLAYER_MATCH = helper.getData(message.author.id, 'highlight') ? helper.getData(message.author.id, 'highlight').value : ''
                let matchName = function (name) {
                    if (PLAYER_MATCH.includes(name.toLowerCase())) return '# ' + name
                    else return name
                }

                const https = require('https')
                const Table = require('easy-table')

                const MAX_CHAR = 2000
                const CODE_BLOCK = '```'

                // Default options
                var isHighlight = true
                var limit = 0 // No limit

                // Multiple args checking
                args.forEach(arg => {
                    if (arg.includes('limit=')) {
                        limit = parseInt(arg.replace('limit=', ""))
                    }
                    if (arg.includes('highlight=false'))
                        isHighlight = false
                });

                let apiCall = function (title, sql) {

                    var url = `${config.API.opendota}explorer?sql=${sql}`
                    https.get(url, (resp) => {
                        let data = '';
                        // A chunk of data has been recieved.
                        resp.on('data', (chunk) => {
                            data += chunk;
                        });
                        // The whole response has been received. Print out the result.
                        resp.on('end', () => {
                            var rows = new Array()
                            try {
                                rows = JSON.parse(data).rows
                            } catch (e) {
                                console.log('Error: ', e)
                                message.channel.send('```Server error. Try again later```')
                            }
                            if (rows && rows.length > 0) {
                                var t = new Table
                                t.separator = '   '
                                for (var row of rows) {
                                    t.cell('Name', isHighlight ? matchName(row["name"]) : row["name"])
                                    t.cell('AVG', parseFloat(row["AVG Fantasy Pts"]), Table.number(2))
                                    t.cell('Matches', parseInt(row["count"]), Table.number(0))
                                    t.cell('Sum', parseFloat(row["sum"]), Table.number(1))
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

                                // Cut tables to limit
                                if (limit != 0) t.rows = t.rows.slice(0, limit)

                                var messages = new Array()
                                var tables = t.toString()
                                while (tables.length > MAX_CHAR - CODE_BLOCK.length * 2) {
                                    const lim = tables.substring(0, Math.min(tables.length, MAX_CHAR - CODE_BLOCK.length * 2))
                                    const msg = lim.substring(0, lim.lastIndexOf("\n"));
                                    messages.push(msg)
                                    tables = tables.replace(msg, "")
                                }
                                messages.push(tables) // Remaining data

                                message.channel.send(title)
                                // Send message(s)
                                for (var msg of messages)
                                    message.channel.send(CODE_BLOCK + TEXT_SYNTAX + '\n' + msg + CODE_BLOCK)

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
                    apiCall('The International 2019 - Total Fantasy Points', encodeURIComponent(getTotalSQL()))
                }
                else if (args[0] === 'today') {
                    var today = new Date(new Date().toDateString())
                    var tomorrow = new Date(new Date(new Date().setDate(today.getDate() + 1)).toDateString())
                    apiCall('The International 2019 - Today Fantasy Points', encodeURIComponent(getRangedSQL(today.toJSON(), tomorrow.toJSON())))
                }
                else if (args[0] === 'set' && args[1] === 'highlight') {
                    if (args[2] != undefined) {
                        var name_str = ''
                        for (var x = 2; ; x++) {
                            if (args[x] === undefined) break
                            name_str += (x !== 2 ? " " : "") + args[x]
                        }
                        var players = name_str.replace(/,/g, "").split(/ +(?=(?:(?:[^"]*"){2})|(?:(?:[^']*'){2})*[^("|')]*$)/g); // Use regex to split between spaces except those in quotes (' or ")
                        for (var i = 0; i < players.length; i++) {
                            if ((players[i].charAt(0) === "\'" || players[i].charAt(0) === "\"") && (players[i].charAt(players[i].length - 1) === "\'" || players[i].charAt(players[i].length - 1) === "\""))
                                players[i] = players[i].slice(1, -1)
                        }
                        helper.saveData(message.author.id, 'highlight', players)
                        message.channel.send('Rest ease. Player names stored')
                    }
                }
                else if (args[0] === 'get' && args[1] === 'highlight') {
                    var text = '```Data not found / Data not set```'
                    if (helper.getData(message.author.id, 'highlight')) {
                        var names = helper.getData(message.author.id, 'highlight').value
                        for (var i = 0; i < names.length; i++) {
                            if (names[i].includes(" "))
                                names[i] = "\"" + names[i] + "\""
                        }
                        text = names.join(" ")
                    }
                    message.channel.send(text)
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

            case 'clear':
                if (args[0] != undefined) {
                    helper.removeItem(userid, args[0])
                }
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
                        return convertSnowflake(args[0])
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
                        return convertSnowflake(args[0])
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

            case 'setactivity':
                if (message.author.id === config.adminId) {

                    let newActivity = message.content.slice(config.prefix.length + command.length).trim()
                    let actType = newActivity.split(/ +/g)[0].toLowerCase()

                    let foundIndex = defaultActivityType.findIndex(name => name.toLowerCase() === actType)
                    let activityName = ''
                    if (foundIndex >= 0) {
                        activityName = newActivity.slice(actType.length).trim()
                    } else {
                        foundIndex = 3 // set to watching
                        activityName = 'Dota 2 Twitch Stream'
                    }

                    bot.user.setActivity(activityName, {
                        type: defaultActivityType[foundIndex]
                    });

                    helper.log(`${bot.user.username} is ${defaultActivityType[foundIndex]} ${activityName}`);
                    message.reply(`Bot activity status changed`)
                }
                break

            case 'getactivity':
                if (message.author.id === config.adminId) {
                    message.channel.send(`${bot.user.username} is ${defaultActivityType[bot.user.presence.activities[0].type]} ${bot.user.presence.activities[0].name}`)
                }
                break
            case 'delete':
                message.channel.bulkDelete(args[0] || 2)
                    .then((messages) => {
                        message.channel.send(`Bulk deleted ${messages.size} messages`).then(msg => msg.delete(2000))
                    })
                    .catch(console.error)
                break
            case 'meme':
                const scraper = require("./scraper.js")
                scraper.getRandomMeme().then((meme) => {
                    message.channel.send(`> ${meme.title}`, { files: [meme.url] })
                    message.delete(2000)
                })
                break
            case 'custommeme':
                if (message.author.id === config.adminId) {
                    if (args.length && args[args.length - 1].substr(0, 4) == "http") {
                        let title = args.slice(0, -1).join(' ')
                        title = title.charAt(0).toLocaleUpperCase() + title.slice(1)
                        message.channel.send(title ? `> ${title}` : '', { files: [args[args.length - 1]] })
                        message.delete(2000)
                    } else {
                        message.channel.send(`Invalid arguments`).then(msg => msg.delete(2000))
                    }
                }
                break

            case 'senddm':
                if (message.author.id === config.adminId && args.length > 1) {
                    var userid = convertSnowflake(args.shift())
                    var msg = args.join(' ')
                    // Fetch users
                    bot.fetchUser(userid, false).then((user) => {
                        user.send(msg);
                    });
                }
                break

            case 'sendembeddm':
                if (message.author.id === config.adminId && args.length > 2) {
                    var userid = convertSnowflake(args.shift())
                    if (args.join(' ').includes('```json')) {
                        var msg = args.join(' ').split('```json')[0].trim()
                        // Remove discord json text styling if used > parse to json
                        var embedConfig = JSON.parse(args.join(' ').substr(msg.length).trim().replace(/^((```)(json)(\s)*)|(```)$/g, ''))

                        // Fetch users
                        bot.fetchUser(userid, false).then((user) => {
                            user.send(msg, embedConfig);
                        });
                    } else {
                        message.channel.send(`Invalid embed attributes`).then(msg => msg.delete(2000))
                    }
                }
                break

            case 'embedthis':
                if (message.author.id === config.adminId) {
                    if (args.length) {
                        // Remove discord json text styling if used > parse to json
                        var embedConfig = JSON.parse(args.join(' ').replace(/^((```)(json)(\s)*)|(```)$/g, ''))
                        console.log(embedConfig)
                        message.channel.send(embedConfig)
                    } else {
                        message.channel.send(`Invalid embed attributes`).then(msg => msg.delete(2000))
                    }
                }
                break

            case 'tictactoe':
                if (args.length !== 1) {
                    message.channel.send(
                        'Please tag your opponent. Eg:`' +
                        config.prefix +
                        'tictactoe `' +
                        convertToSnowflake(config.adminId)
                    ).then(msg => msg.delete(5000))
                    break
                }
                else {
                    var players = Array()
                    // Fetch users
                    players.push(await bot.fetchUser(message.author.id, false))
                    players.push(await bot.fetchUser(convertSnowflake(args.shift()), false))
                    let size = 3
                    let tictactoe = new TicTacToe(players[0].id, size, players.map((u) => { return u.username }))
                    message.channel.send(
                        tictactoe.playerEmoji[0] +
                        ' TicTacToe ' +
                        tictactoe.playerEmoji[1] +
                        ' _Loading game..._'
                    ).then(async (msg) => {
                        for (var i = 1; i <= size * size; i++) {
                            await msg.react(tictactoe.numberEmoji[i])
                            if (i === size * size) {
                                msg.edit(
                                    tictactoe.printTable() +
                                    '\nCurrent move: ' +
                                    tictactoe.playerEmoji[tictactoe.getCurrentMoveIndex()] +
                                    ' ' +
                                    tictactoe.getCurrentMove() +
                                    '\n'
                                )
                            }
                        }
                        // Store message and reaction id into game collection
                        gamesCollection.push({ id: msg.id, game: tictactoe, players: players })
                    })
                }
                break
        }
    });

    bot.on("messageReactionAdd", async (messageReaction, user) => {
        // Make sure it is not bot itself
        if (user.bot) {
            return;
        }
        // Check if reaction is made onto game message
        let foundGameIndex = gamesCollection.findIndex(game => game.id === messageReaction.message.id)
        if (foundGameIndex >= 0) {
            let game = gamesCollection[foundGameIndex].game
            if (game instanceof TicTacToe && gamesCollection[foundGameIndex].players.find(p => p.id === user.id)) {
                game.setMovePos(game.numberEmoji.indexOf(messageReaction.emoji.toString()))
                if (game.checkMoves() === -1) {
                    messageReaction.message.edit(
                        game.printTable() +
                        '\nCurrent move: ' +
                        game.playerEmoji[game.getCurrentMoveIndex()] +
                        ' ' +
                        game.getCurrentMove() +
                        '\n'
                    )
                }
                else {
                    let emoji = game.checkMoves() === 0 ? '' : game.playerEmoji[game.winner] + ' '
                    let status = game.checkMoves() === 0 ? game.playerEmoji.join(' Draw ') : (game.getPlayer(game.winner) + ' wins')
                    messageReaction.message.edit(
                        game.printTable() +
                        '\n' + emoji + '**' + status + '**\n'
                    )
                    // Remove completed game from collection
                    gamesCollection.splice(foundGameIndex, 1)
                    // Remove all reactions from message
                    messageReaction.message.clearReactions().then(() => {
                        console.log(gamesCollection)
                    })
                }
            }
        }
    })

    // helper.saveData('atif', 'name', 'Atif')
    if (process.env.NODE_ENV === 'production') {
        bot.login(process.env.BOT_TOKEN);
    }
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

function convertSnowflake(strId) {
    return strId.replace(/[<@!>]/g, '')
}

function convertToSnowflake(strId) {
    return `<@!${strId}>`
}

function setActivity(type, title) {
    if (bot) {
        bot.user.setActivity(title, {
            type: type
        });
        // bot.user.setActivity("Dota 2 Twitch Stream", {
        //     type: "Watching"
        // });
    }
}

function getActivityString() {
    if (bot && bot.user && bot.user.presence && bot.user.presence.activities.length > 0) {
        return `${defaultActivityType[bot.user.presence.activities[0].type]} ${bot.user.presence.activities[0].name}`
    }
}

function isReady() {
    return botReady;
}

module.exports = {
    defaultActivityType: defaultActivityType,
    startBot: startBot,
    setActivity: setActivity,
    getActivityString: getActivityString,
    isReady: isReady
}
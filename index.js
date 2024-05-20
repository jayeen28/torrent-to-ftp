import TelegramBot from 'node-telegram-bot-api';
import QbApi from './lib/qb_api.js';
import { WELCOME, add_torrent, help, rm_torrent, see_torrents } from './lib/tg_message_handler.js';
import { checkUsers } from './lib/checkUsers.js';

const BOT_TOKEN = process.env.BOT_TOKEN;

const qb_api = new QbApi(process.env.QB_USERNAME, process.env.QB_PASSWORD);

const listeners = [
    {
        command: /\/start/,
        callback: ({ msg, bot }) => bot.sendMessage(msg.chat.id, WELCOME)
    },
    {
        command: /\/add/,
        callback: add_torrent
    },
    {
        command: /\/rm/,
        callback: rm_torrent
    },
    {
        command: /\/seeAll/,
        callback: see_torrents
    },
    {
        command: /\/help/,
        callback: help
    }
]

async function main() {
    await qb_api.authenticate();
    const bot = new TelegramBot(BOT_TOKEN, { polling: true, });
    listeners.forEach(({ command, callback }) => bot.onText(command, (msg) => {
        return checkUsers(msg, bot, () => callback({ msg, qb_api, bot }))
    }));
}


main();
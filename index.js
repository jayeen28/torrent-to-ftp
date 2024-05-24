import TelegramBot from 'node-telegram-bot-api';
import QbApi from './lib/qb_api.js';
import { WELCOME, add_torrent, help, rm_torrent, see_torrents } from './lib/tg_message_handler.js';
import { checkUsers } from './lib/checkUsers.js';
import { gracefulShutdown } from './lib/gracefulShutdown.js';

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
        command: /\/reauth/,
        callback: ({ msg, qb_api, bot }) => {
            const res = qb_api.authenticate();
            if (res) return bot.sendMessage(msg.chat.id, 're auth success');
            else return bot.sendMessage(msg.chat.id, 're auth failed');
        }
    },
    {
        command: /\/help/,
        callback: help
    }
];

async function main() {
    await qb_api.authenticate();
    const bot = new TelegramBot(BOT_TOKEN, { polling: true, });
    console.log('Telegram bot started');
    listeners.forEach(({ command, callback }) => bot.onText(command, (msg) => {
        return checkUsers(msg, bot, () => callback({ msg, qb_api, bot }))
    }));
    process.on('SIGTERM', () => gracefulShutdown({ qb_api }));
    process.on('SIGINT', () => gracefulShutdown({ qb_api }));
}


main();
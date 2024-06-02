const HELP = `➕ /add magnetLink
Start downloading from the provided magnet link.

👀 /seeAll
View all available torrents currently downloading.

🗑️ /rm hash
Delete any torrent using its hash. You can find the hash of each torrent using the /seeAll command.

ℹ️ /help
Get assistance and learn more about how to use our bot.`
export const WELCOME = `👋 Welcome to our Torrent Downloader Bot! To get started, you can use the following commands:
${HELP}
Feel free to explore and enjoy seamless torrent downloading with our bot! 🚀`;

export async function add_torrent({ bot, msg, qb_api }) {
    const [, magnetLink] = msg.text.split(' ');
    if (!magnetLink || !magnetLink.startsWith('magnet:')) return bot.sendMessage(msg.chat.id, 'Invalid magnet link');
    const { status, message } = await qb_api.add_torrent(magnetLink);
    if (status) return bot.sendMessage(msg.chat.id, 'Torrent added successfully. Starting to download');
    else {
        console.log(message);
        return bot.sendMessage(msg.chat.id, 'Something went wrong !!!');
    }
}

export async function see_torrents({ bot, msg, qb_api }) {
    const { data, status } = await qb_api.get_torrents();
    if (status) {
        const torrents = Object.entries(data.torrents)
        if (Array.isArray(torrents) && torrents.length === 0) return bot.sendMessage(msg.chat.id, 'No torrents found to serve');
        let message = torrents.reduce((acc, [key, data]) => {
            const addedDate = new Date(data.added_on * 1000).toUTCString();
            let downloaded = ((data.completed / data.size) * 100);
            if (isNaN(downloaded)) downloaded = 0.00;
            const singleMessage = `Hash: ${key}\nName: ${data.name}\nState: ${data.state}\nAdded at: ${addedDate}\nDownloaded: ${downloaded.toFixed(2)}%`
            return acc + singleMessage + '\n\n'
        }, '');
        return bot.sendMessage(msg.chat.id, message);
    }
    else return bot.sendMessage(msg.chat.id, 'Something went wrong !!!');
}

export async function rm_torrent({ bot, msg, qb_api }) {
    const [, hash] = msg.text.split(' ');
    if (!hash) return bot.sendMessage(msg.chat.id, 'Invalid hash');
    const { status } = await qb_api.rm_torrent(hash);
    if (status) return bot.sendMessage(msg.chat.id, 'Torrent removed successfully');
    else return bot.sendMessage(msg.chat.id, 'Something went wrong !!!');
}

export function help({ bot, msg }) {
    return bot.sendMessage(msg.chat.id, HELP);
}
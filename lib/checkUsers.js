export function checkUsers(msg, bot, cb) {
    const users = process.env.ALLOWED_USERS.split(',').map(Number);
    if (users.includes(msg.from.id)) return cb();
    else bot.sendMessage(msg.chat.id, 'You are not authorized to use this bot !!');
}
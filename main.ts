import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';
import config from './config.json';
import checkBalance from './commands/admin/checkBalance';
import createGiftCardHandler from './commands/admin/createGiftCard';
import myBalance from './commands/user/myBalance';
import redeemGiftCard from './commands/user/redeemGiftCard';
import dailyBonus from './commands/user/dailyBonus';


const bot = new TelegramBot(config.token, { polling: true });
let database = JSON.parse(fs.readFileSync('./database.json', 'utf8'));

const channelUrl = config.channel || "https://t.me/NineTailedFox20"; // URL padrão caso não esteja configurada

bot.on('polling_error', (error) => {
    console.error('Polling Error: ', error);
});


function getUserBalance(userId: number) {
    const user = database.users[userId];
    return user ? user.balance : 0; // Retorna o saldo do usuário ou 0 caso não encontrado
}


bot.onText(/\/saldo/, (msg: TelegramBot.Message) => {
    const userId = msg.chat.id;
    myBalance({ bot, userId, database });
});

bot.onText(/\/checksaldo/, (msg) => {
    const userId = msg.chat.id;
    checkBalance({ bot, userId, database });
});

bot.onText(/\/createGiftCard/, (msg) => {
    const userId = msg.chat.id;
    createGiftCardHandler({ bot, userId, database });
});


bot.onText(/\/(start|menu|help)/, async (msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;
    const userName = msg.from?.first_name;
    const userId = msg.from?.id ?? 0;


    const userBalance = getUserBalance(userId);


    const opts = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🎁 Resgatar Gift Card', callback_data: 'redeem_gift' }],
                [{ text: '🎉 Bônus Diário', callback_data: 'daily_bonus' }],
                [{ text: '📄 Termos', callback_data: 'terms' }],
                [{ text: '📢 Canal', url: channelUrl }],
                [{ text: 'ℹ️ Informações', callback_data: 'bot_info' }]
            ]
        },
        caption: `👤 Nome: ${userName}\n🆔 ID: ${userId}\n💰 Saldo: ${userBalance} Créditos`,
    };

    const photoUrl = 'https://imgur.com/a/Mev4l6n';
    bot.sendPhoto(chatId, photoUrl, opts);
});

bot.on('callback_query', async (callbackQuery) => {
    const msg = callbackQuery.message as TelegramBot.Message;
    const userId = msg.chat.id;
    const data = callbackQuery.data;

    if (data === 'redeem_gift') {
        redeemGiftCard({ bot, userId, database });
    }
    else if (data === 'daily_bonus') {
        dailyBonus({ bot, userId, database });
    }
    else if (data === 'bot_info') {
        bot.sendMessage(userId, `🤖 Bot criado por ${config.owner}`);
    }
});

console.log('Bot is running...');

const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const config = require('./config.json');
const { generatePixQrCode } = require('./utils/pixGenerator');
const { generateMercadoPagoQr } = require('./utils/mercadoPago');
const checkBalance = require('./commands/admin/checkBalance');
const createGiftCardHandler = require('./commands/admin/createGiftCard'); 
const myBalance = require('./commands/user/myBalance');
const redeemGiftCard = require('./commands/user/redeemGiftCard');
const dailyBonus = require('./commands/user/dailyBonus');


const bot = new TelegramBot(config.token, { polling: true });
let database = JSON.parse(fs.readFileSync('./database.json', 'utf8'));

const channelUrl = config.channel || "https://t.me/NineTailedFox20"; // URL padrão caso não esteja configurada

bot.on('polling_error', (error) => {
    console.error('Polling Error: ', error);
});


function getUserBalance(userId) {
    const user = database.users[userId]; 
    return user ? user.balance : 0; // Retorna o saldo do usuário ou 0 caso não encontrado
}


bot.onText(/\/saldo/, (msg) => {
    const userId = msg.chat.id;
    myBalance(bot, userId, database);
});

bot.onText(/\/checksaldo/, (msg) => {
    const userId = msg.chat.id;
    checkBalance(bot, userId, database);
});

bot.onText(/\/createGiftCard/, (msg) => {
    const userId = msg.chat.id;
    createGiftCardHandler(bot, userId, database); 
});


bot.onText(/\/(start|menu|help)/, async (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name;
    const userId = msg.from.id;
    
    
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
    const msg = callbackQuery.message;
    const userId = msg.chat.id;
    const data = callbackQuery.data;

    if (data === 'redeem_gift') {
        redeemGiftCard(bot, userId, database);
    }
    else if (data === 'daily_bonus') {
        dailyBonus(bot, userId, database);
    }
    else if (data === 'bot_info') {
        bot.sendMessage(userId, `🤖 Bot criado por ${config.owner}`); 
    }
});

console.log('Bot rodando...');

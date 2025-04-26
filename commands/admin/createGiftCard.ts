import { CommonCommandType } from "../../types/CommandType";

const crypto = require('crypto');
const fs = require('fs');


export default ({ bot, userId, database }: CommonCommandType) => {

    if (!database || !Array.isArray(database.admins) || !database.admins.includes(userId.toString())) {
        bot.sendMessage(userId, '❌ Você não tem permissão para usar este comando.');
        return;
    }


    bot.sendMessage(userId, 'Digite o valor do Gift Card:');


    bot.once('message', (msg) => {
        const value = parseFloat(msg.text);


        if (isNaN(value) || value <= 0) {
            bot.sendMessage(userId, '❌ Valor inválido! Por favor, digite um valor numérico positivo.');
            return;
        }


        const code = crypto.randomBytes(4).toString('hex');


        if (!database.giftCards) {
            database.giftCards = [];
        }
        database.giftCards.push({ code, value });


        fs.writeFileSync('./database.json', JSON.stringify(database, null, 2), 'utf8');


        bot.sendMessage(userId, `🎁 Gift Card criado! Código: ${code}, Valor: R$${value.toFixed(2)}`);
    });
};

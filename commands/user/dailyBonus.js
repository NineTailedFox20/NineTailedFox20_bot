module.exports = (bot, userId, database) => {
    
    if (!database.users[userId]) {
       
        database.users[userId] = {
            lastBonus: null,  
            balance: 0        
        };
    }

    const today = new Date().toISOString().split('T')[0];  
    
   
    if (database.users[userId].lastBonus === today) {
        bot.sendMessage(userId, '❌ Você já resgatou seu bônus diário hoje.');
    } else {
        const bonus = 5.00;
        database.users[userId].balance += bonus;  
        database.users[userId].lastBonus = today;  
        bot.sendMessage(userId, `🎁 Bônus diário recebido! Valor: R$${bonus.toFixed(2)}`);
    }

    
    const fs = require('fs');
    fs.writeFileSync('./database.json', JSON.stringify(database, null, 2));
};

module.exports = (bot, userId, database) => {
    try {
        
        if (!database.admins.includes(userId.toString())) {
            return bot.sendMessage(userId, '❌ Você não tem permissão para usar este comando.');
        }

        const userIds = Object.keys(database.users);
        if (userIds.length === 0) {
            return bot.sendMessage(userId, '📭 Nenhum usuário registrado no sistema.');
        }

        let message = '📊 <b>Saldo dos usuários:</b>\n\n';
        userIds.forEach(id => {
            const balance = database.users[id].balance.toFixed(2);
            message += `👤 <b>ID:</b> ${id} - 💰 <b>Saldo:</b> R$${balance}\n`;
        });

        
        if (message.length > 4096) {
            const parts = message.match(/[\s\S]{1,4000}/g);
            parts.forEach(part => bot.sendMessage(userId, part, { parse_mode: 'HTML' }));
        } else {
            bot.sendMessage(userId, message, { parse_mode: 'HTML' });
        }

    } catch (error) {
        console.error('Erro ao verificar saldo dos usuários:', error);
        bot.sendMessage(userId, '❌ Ocorreu um erro ao verificar o saldo dos usuários.');
    }
};

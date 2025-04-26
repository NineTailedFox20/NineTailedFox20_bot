const qrcode = require('qrcode');
const crc16 = require('crc').crc16ccitt;
const config = require('../config.json'); 


function generatePixPayload(chave, valor, descricao, nomeBeneficiario, cidade) {
    const valorFormatado = valor.toFixed(2).replace('.', '');
    const descricaoFormatada = descricao ? `020${descricao.length.toString().padStart(2, '0')}${descricao}` : '020600Teste';
    
    const payloadSemCRC = `00020126330014BR.GOV.BCB.PIX0114${chave}520400005303986540${valorFormatado}5802BR5913${nomeBeneficiario}6009${cidade}62${descricaoFormatada}6304`;

    
    const crc = crc16(payloadSemCRC).toString(16).toUpperCase().padStart(4, '0');
    return `${payloadSemCRC}${crc}`;
}


module.exports.generatePixQrCode = async (valor, descricao, bot, userId) => {
    try {
        const nomeBeneficiario = config.nomeBeneficiario || 'Nome Beneficiario';
        const cidade = config.cidade || 'SAO PAULO';
        const chavePix = config.pixKey;

        
        if (!chavePix) {
            return bot.sendMessage(userId, '❌ Chave PIX não configurada.');
        }

       
        const pixCode = generatePixPayload(chavePix, valor, descricao, nomeBeneficiario, cidade);
        
        
        const qrCodeImage = await qrcode.toDataURL(pixCode);

        
        bot.sendPhoto(userId, qrCodeImage, {
            caption: `📌 <b>PIX Gerado:</b>\n\n💰 <b>Valor:</b> R$${valor.toFixed(2)}\n🏦 <b>Chave:</b> ${chavePix}\n📝 <b>Descrição:</b> ${descricao}\n\n🔗 <b>Código Copia e Cola:</b>\n<code>${pixCode}</code>\n\n📎 Toque e segure para copiar.`,
            parse_mode: 'HTML'
        });

    } catch (error) {
        console.error('Erro ao gerar QR Code PIX:', error);
        bot.sendMessage(userId, '❌ Ocorreu um erro ao gerar o PIX. Tente novamente.');
    }
};

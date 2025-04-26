import qrcode from 'qrcode';
import { crc16ccitt as crc16 } from 'crc';
import '../config.ts'

interface PixPayload {
    key: string;
    value: number;
    description: string;
    nameBenefit: string;
    city: string;
}

interface PixQrCode {
    value: number;
    description: string;
    bot: any;
    userId: string;
}


function generatePixPayload({ key, value, description, nameBenefit, city }: PixPayload) {
    const valorFormatado = value.toFixed(2).replace('.', '');
    const formattedDescription = description ? `020${description.length.toString().padStart(2, '0')}${description}` : '020600Teste';

    const payloadSemCRC = `00020126330014BR.GOV.BCB.PIX0114${key}520400005303986540${valorFormatado}5802BR5913${nameBenefit}6009${city}62${formattedDescription}6304`;


    const crc = crc16(payloadSemCRC).toString(16).toUpperCase().padStart(4, '0');
    return `${payloadSemCRC}${crc}`;
}


export const generatePixQrCode = async ({ value, description, bot, userId }: PixQrCode) => {
    try {
        const nameBenefit = config.nameBenefit || 'Nome Beneficiario';
        const city = config.city || 'SAO PAULO';
        const pixKey = config.pixKey;


        if (!pixKey) {
            return bot.sendMessage(userId, '❌ Chave PIX não configurada.');
        }


        const pixCode = generatePixPayload({ key: pixKey, value, description, nameBenefit, city });


        const qrCodeImage = await qrcode.toDataURL(pixCode);


        bot.sendPhoto(userId, qrCodeImage, {
            caption: `📌 <b>PIX Gerado:</b>\n\n💰 <b>Valor:</b> R$${value.toFixed(2)}\n🏦 <b>Chave:</b> ${pixKey}\n📝 <b>Descrição:</b> ${description}\n\n🔗 <b>Código Copia e Cola:</b>\n<code>${pixCode}</code>\n\n📎 Toque e segure para copiar.`,
            parse_mode: 'HTML'
        });

    } catch (error) {
        console.error('Erro ao gerar QR Code PIX:', error);
        bot.sendMessage(userId, '❌ Ocorreu um erro ao gerar o PIX. Tente novamente.');
    }
};

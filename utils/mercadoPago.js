const axios = require('axios');
const config = require('../config.json');
module.exports.generateMercadoPagoQr = async (valor) => {
    try {
        const response = await axios.post('https://api.mercadopago.com/v1/payments', {
            transaction_amount: valor,
            description: 'Pagamento via Mercado Pago',
            payment_method_id: 'pix',
            payer: { email: 'email@example.com' },
        }, {
            headers: { Authorization: `Bearer ${config.mercadoPagoToken}` }
        });
        return response.data.point_of_interaction.transaction_data.qr_code;
    } catch (error) {
        console.error('Erro ao gerar QR Code Mercado Pago:', error);
        return null;
    }
};
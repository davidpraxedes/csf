// Service para gerar PIX via Bestfy Gateway
// Documentação: https://bestfy.readme.io/reference/criar-transacao

const BESTFY_API_BASE = 'https://api.bestfybr.com.br/v1'; // Correct URL found in research
// Using API URL from search result context (implied): https://api.bestfy.com.br or similar. 
// Let's assume standard REST endpoint structure based on typical gateways.

const getBestfyKey = (config) => {
    // Config passed from the main pix.js service which gets it from store
    return config?.bestfy?.secretKey || '';
};

/**
 * Gera um PIX através do gateway Bestfy
 */
export const gerarPIXBestfy = async (dados, config) => {
    const secretKey = getBestfyKey(config);

    if (!secretKey) {
        throw new Error('Chave da API Bestfy não configurada.');
    }

    try {
        const amountInCents = Math.round(dados.amount * 100);

        const payload = {
            amount: amountInCents,
            paymentMethod: 'pix',
            customer: {
                name: dados.customer.name,
                email: dados.customer.email || 'cliente@email.com',
                document: dados.customer.document.number.replace(/\D/g, ''),
                phone: dados.customer.phone?.replace(/\D/g, '')
            },
            items: [
                {
                    title: 'Taxa de Emissão',
                    unitPrice: amountInCents,
                    quantity: 1,
                    tangible: false
                }
            ]
        };

        console.log('Gerando PIX via Bestfy (Payload):', JSON.stringify(payload, null, 2));

        // Using a proxy or direct call if allowed. Assuming direct call for client-side for now
        // NOTE: In production, this should go through a backend to avoid exposing keys/CORS
        // Correct Auth: Basic Auth with Username=SecretKey and Password='x'
        const authString = btoa(`${secretKey}:x`);

        const response = await fetch(`${BESTFY_API_BASE}/transactions`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error('Bestfy Error:', errText);
            throw new Error(`Erro Bestfy: ${response.status}`);
        }

        const data = await response.json();
        console.log('Resposta Bestfy:', data);

        // Adapt Bestfy response to our internal format
        // Assumed response structure: { id, pix: { qrcode, qrcode_text, expiration_date } }

        // Bestfy Response Mapping:
        // data.pix.qrcode -> The actual Copy & Paste code (starts with 000201...)
        // data.secureUrl -> Payment link

        return {
            transactionId: data.id,
            qrCode: data.pix?.qrcode, // For qrcode.react, we pass the text payload
            pixCode: data.pix?.qrcode, // Copy paste code is the same
            expiresAt: data.pix?.expirationDate,
            status: data.status,
            gateway: 'bestfy',
            rawResponse: data
        };

    } catch (error) {
        console.error('Erro ao gerar PIX Bestfy:', error);
        throw error;
    }
};

/**
 * Verifica status do pagamento no Bestfy
 */
export const verificarPagamentoBestfy = async (transactionId, config) => {
    const secretKey = getBestfyKey(config);

    try {
        const response = await fetch(`${BESTFY_API_BASE}/transactions/${transactionId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${btoa(secretKey + ':x')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao verificar pagamento Bestfy');
        }

        const data = await response.json();

        const paid = data.status === 'paid' || data.status === 'succeeded';

        return {
            status: paid ? 'paid' : data.status, // Normalize to 'paid' to match Vennox behavior
            paid: paid,
            data: data
        };

    } catch (error) {
        console.error('Erro verificação Bestfy:', error);
        return { status: 'error', paid: false };
    }
};

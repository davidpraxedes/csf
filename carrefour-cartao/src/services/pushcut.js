// Serviço para enviar notificações Pushcut
// Documentação: https://www.pushcut.io/

const PUSHCUT_BASE_URL = 'https://api.pushcut.io/XPTr5Kloj05Rr37Saz0D1/notifications';

/**
 * Envia uma notificação Pushcut
 * @param {string} notificationName - Nome da notificação (ex: "Pendente delivery", "Aprovado delivery")
 * @param {string} text - Texto da notificação
 * @returns {Promise<Object>} Resposta da API
 */
export const enviarNotificacao = async (notificationName, text = '') => {
  try {
    // Pushcut aceita parâmetros via query string para customizar a mensagem
    const url = `${PUSHCUT_BASE_URL}/${encodeURIComponent(notificationName)}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: text ? JSON.stringify({ text }) : undefined,
    });

    if (!response.ok) {
      // Se POST falhar, tentar GET
      const getUrl = `${PUSHCUT_BASE_URL}/${encodeURIComponent(notificationName)}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
      const getResponse = await fetch(getUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!getResponse.ok) {
        throw new Error(`Erro ao enviar notificação: ${getResponse.status}`);
      }
      
      const getData = await getResponse.json();
      console.log('✅ Notificação Pushcut enviada (GET):', notificationName, getData);
      return getData;
    }

    const data = await response.json();
    console.log('✅ Notificação Pushcut enviada (POST):', notificationName, data);
    return data;
  } catch (error) {
    console.error('❌ Erro ao enviar notificação Pushcut:', error);
    // Não lançar erro para não quebrar o fluxo
    return { error: error.message };
  }
};

/**
 * Envia notificação de pedido pendente (quando PIX é gerado)
 * @param {string} transactionId - ID da transação
 * @param {number} valor - Valor do pagamento
 */
export const notificarPedidoPendente = async (transactionId, valor) => {
  const mensagem = `🛒 Novo pedido gerado!

💰 Valor: R$ ${valor.toFixed(2).replace('.', ',')}
📋 ID: ${transactionId?.substring(0, 8) || 'N/A'}

⏳ Aguardando pagamento PIX...`;
  
  return await enviarNotificacao('Pendente delivery', mensagem);
};

/**
 * Envia notificação de pagamento aprovado (quando PIX é pago)
 * @param {string} transactionId - ID da transação
 * @param {number} valor - Valor pago
 */
export const notificarPagamentoAprovado = async (transactionId, valor) => {
  const mensagem = `✅ Pagamento confirmado!

💰 Valor: R$ ${valor.toFixed(2).replace('.', ',')}
📋 ID: ${transactionId?.substring(0, 8) || 'N/A'}

🎉 Cartão será ativado em breve!`;
  
  return await enviarNotificacao('Aprovado delivery', mensagem);
};


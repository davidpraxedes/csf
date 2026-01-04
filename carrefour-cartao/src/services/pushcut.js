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
    // Pushcut aceita parâmetros via query string
    // Tentar com parâmetro 'text' que é comum em APIs de notificação
    const params = new URLSearchParams();
    if (text) {
      params.append('text', text);
      params.append('message', text); // Tentar ambos os nomes comuns
      params.append('body', text);
    }
    
    const url = `${PUSHCUT_BASE_URL}/${encodeURIComponent(notificationName)}${params.toString() ? `?${params.toString()}` : ''}`;
    
    console.log('📤 Enviando notificação Pushcut:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao enviar notificação: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Notificação Pushcut enviada:', notificationName, data);
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


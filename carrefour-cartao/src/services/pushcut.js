// Serviço para enviar notificações Pushcut
// Documentação: https://www.pushcut.io/

const PUSHCUT_BASE_URL = 'https://api.pushcut.io/XPTr5Kloj05Rr37Saz0D1/notifications';

/**
 * Envia uma notificação Pushcut
 * O Pushcut usa notificações pré-configuradas no app, apenas acionamos via API
 * @param {string} notificationName - Nome da notificação (ex: "Pendente delivery", "Aprovado delivery")
 * @returns {Promise<Object>} Resposta da API
 */
export const enviarNotificacao = async (notificationName) => {
  try {
    const url = `${PUSHCUT_BASE_URL}/${encodeURIComponent(notificationName)}`;
    
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
  // Pushcut usa notificações pré-configuradas no app
  // Apenas acionamos a notificação, o texto é configurado no Pushcut
  return await enviarNotificacao('Pendente delivery');
};

/**
 * Envia notificação de pagamento aprovado (quando PIX é pago)
 * @param {string} transactionId - ID da transação
 * @param {number} valor - Valor pago
 */
export const notificarPagamentoAprovado = async (transactionId, valor) => {
  // Pushcut usa notificações pré-configuradas no app
  // Apenas acionamos a notificação, o texto é configurado no Pushcut
  return await enviarNotificacao('Aprovado delivery');
};


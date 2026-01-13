// Serviço para enviar notificações Pushcut
// Documentação: https://www.pushcut.io/

const PUSHCUT_BASE_URL = 'https://api.pushcut.io/XPTr5Kloj05Rr37Saz0D1/notifications';

/**
 * Envia uma notificação Pushcut com texto customizado
 * @param {string} notificationName - Nome da notificação (ex: "Pendente delivery", "Aprovado delivery")
 * @param {string} title - Título da notificação
 * @param {string} text - Texto da notificação
 * @returns {Promise<Object>} Resposta da API
 */
export const enviarNotificacao = async (notificationName, title = '', text = '') => {
  try {
    const url = `${PUSHCUT_BASE_URL}/${encodeURIComponent(notificationName)}`;

    // Preparar body se houver título ou texto
    let body = null;
    let method = 'GET';
    const headers = {
      'Accept': 'application/json',
    };

    if (title || text) {
      method = 'POST';
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify({
        ...(title && { title }),
        ...(text && { text }),
      });
    }

    console.log('📤 Enviando notificação Pushcut:', { url, method, title, text });

    const response = await fetch(url, {
      method,
      headers,
      ...(body && { body }),
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
  const title = '🛒 Novo Pedido de Cartão Carrefour';
  const text = `Um novo pedido foi gerado! 💰 Valor: R$ ${valor.toFixed(2).replace('.', ',')} 📋 ID: ${String(transactionId || '').substring(0, 8) || 'N/A'} ⏳ Aguardando confirmação do pagamento PIX para ativar o cartão.`;

  return await enviarNotificacao('Pendente delivery', title, text);
};

/**
 * Envia notificação de pagamento aprovado (quando PIX é pago)
 * @param {string} transactionId - ID da transação
 * @param {number} valor - Valor pago
 */
export const notificarPagamentoAprovado = async (transactionId, valor) => {
  const title = '✅ Pagamento Confirmado - Cartão Carrefour';
  const text = `Pagamento confirmado com sucesso! 💰 Valor: R$ ${valor.toFixed(2).replace('.', ',')} 📋 ID: ${String(transactionId || '').substring(0, 8) || 'N/A'} 🎉 O cartão será ativado em até 2 minutos. O cliente já pode visualizar os dados do cartão virtual!`;

  return await enviarNotificacao('Aprovado delivery', title, text);
};


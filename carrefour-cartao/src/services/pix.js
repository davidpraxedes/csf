// Service para gerar PIX
// Você vai integrar com seu gateway aqui

export const gerarPIX = async (dados) => {
  // Dados esperados:
  // {
  //   amount: 29.00,
  //   customer: {
  //     name: string,
  //     email: string,
  //     phone: string,
  //     document: { number: string }
  //   },
  //   address: { ... }
  // }
  
  // TODO: Integrar com seu gateway PIX
  // Por enquanto, retorna dados mockados para desenvolvimento
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simula resposta do gateway
      const transactionId = `TXN${Date.now()}`;
      const qrCode = `00020126360014BR.GOV.BCB.PIX0114+5511999999999520400005303986540529.005802BR5913CARREFOUR CARTAO6009SAO PAULO62070503***6304${Math.random().toString(36).substring(7)}`;
      
      resolve({
        transactionId,
        qrCode,
        pixCode: qrCode,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
      });
    }, 1500);
  });
  
  // Exemplo de integração real (descomente e ajuste):
  /*
  try {
    const response = await fetch('SEU_ENDPOINT_PIX_AQUI', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer SEU_TOKEN_AQUI'
      },
      body: JSON.stringify({
        amount: dados.amount,
        description: 'Taxa de Emissão Cartão Carrefour',
        customer: dados.customer,
        address: dados.address
      })
    });
    
    const data = await response.json();
    return {
      transactionId: data.id,
      qrCode: data.qrCode,
      pixCode: data.pixCode,
      expiresAt: data.expiresAt
    };
  } catch (error) {
    throw new Error('Erro ao gerar PIX: ' + error.message);
  }
  */
};

// Verificar status do pagamento
export const verificarPagamento = async (transactionId) => {
  // TODO: Integrar com webhook do seu gateway
  
  // Por enquanto, simula verificação
  return new Promise((resolve) => {
    setTimeout(() => {
      // Em produção, isso seria uma chamada real à API
      resolve({
        status: 'pending', // pending, paid, expired
        paid: false
      });
    }, 500);
  });
};


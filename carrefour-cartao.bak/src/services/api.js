const SUPABASE_URL = "https://tsmbotzygympsfxvjeul.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWJvdHp5Z3ltcHNmeHZqZXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5Njg3NzMsImV4cCI6MjA4MjU0NDc3M30.W4AbPD6W1hksp0ZcM0-BG9c3aixIk5RejNxQrusV3M0";

// Limpar CPF (remove formatação)
export const limparCPF = (cpf) => {
  return cpf.replace(/\D/g, '');
};

// Format CPF
export const formatarCPF = (cpf) => {
  const limpo = limparCPF(cpf);
  if (limpo.length !== 11) return cpf;
  return limpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

// Consultar CPF
export const consultarCPF = async (cpf) => {
  const cpfLimpo = limparCPF(cpf);
  
  if (cpfLimpo.length !== 11) {
    throw new Error('CPF deve conter 11 dígitos');
  }
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/consulta-cpf`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ cpf: cpfLimpo })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Erro ao consultar CPF');
    }
    
    return {
      nomeCompleto: data.nomeCompleto || '',
      nomeMae: data.nomeDaMae || data.nomeMae || '',
      dataNascimento: data.dataDeNascimento || data.dataNascimento || '',
      email: data.emails?.[0]?.enderecoEmail || '',
      endereco: data.enderecos?.[0] || null,
      dadosCompletos: data
    };
  } catch (error) {
    throw error;
  }
};

// Consultar CEP
export const consultarCEP = async (cep) => {
  const cepLimpo = cep.replace(/\D/g, '');
  
  if (cepLimpo.length !== 8) {
    throw new Error('CEP deve conter 8 dígitos');
  }
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      throw new Error('CEP não encontrado');
    }
    
    return {
      logradouro: data.logradouro || '',
      bairro: data.bairro || '',
      cidade: data.localidade || '',
      estado: data.uf || '',
      cep: cepLimpo
    };
  } catch (error) {
    throw error;
  }
};

// Gerar número de cartão com BIN 544234
export const gerarNumeroCartao = () => {
  const BIN = '544234';
  // Gera os 10 dígitos restantes (total de 16 dígitos)
  const parte1 = String(Math.floor(Math.random() * 9000) + 1000); // 4 dígitos
  const parte2 = String(Math.floor(Math.random() * 9000) + 1000); // 4 dígitos
  const parte3 = String(Math.floor(Math.random() * 100)).padStart(2, '0'); // 2 dígitos
  // Retorna sem espaços (será formatado no componente)
  return BIN + parte1 + parte2 + parte3;
};

// Gerar CVV
export const gerarCVV = () => {
  return Math.floor(Math.random() * 900) + 100;
};

// Gerar validade
export const gerarValidade = () => {
  const mes = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const ano = String(new Date().getFullYear() + 5).slice(-2);
  return `${mes}/${ano}`;
};


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

// Consultar CPF - Usando API do Aprovado Direto
export const consultarCPF = async (cpf) => {
  const cpfLimpo = limparCPF(cpf);

  if (cpfLimpo.length !== 11) {
    throw new Error('CPF deve conter 11 dígitos');
  }

  try {
    // Detectar se está em produção e qual plataforma (Vercel ou Netlify)
    const isProduction = import.meta.env.PROD;
    const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');

    // Em produção no Vercel, usar /api/cpf-consult; no Netlify, usar /.netlify/functions/cpf-consult
    // Em desenvolvimento, usar proxy do Vite
    const url = isProduction
      ? (isVercel
        ? `/api/cpf-consult?cpf_consulta=${encodeURIComponent(cpfLimpo)}`
        : `/.netlify/functions/cpf-consult?cpf_consulta=${encodeURIComponent(cpfLimpo)}`)
      : `/api/cpf?cpf_consulta=${encodeURIComponent(cpfLimpo)}`;

    console.log('Consultando CPF na API:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    console.log('Resposta da API:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    // Verificar se a resposta é JSON válido
    let data;
    const contentType = response.headers.get('content-type');

    try {
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.log('Resposta (texto):', text.substring(0, 200));

        // Tentar fazer parse mesmo assim
        try {
          data = JSON.parse(text);
        } catch (e) {
          throw new Error('Resposta inválida da API');
        }
      }
    } catch (parseError) {
      console.error('Erro ao fazer parse:', parseError);
      throw new Error('Erro ao processar resposta da API');
    }

    console.log('Dados recebidos da API:', data);

    // Verificar se há erro na resposta
    if (data.error) {
      // Se o CPF não foi encontrado, não é um erro crítico - permite continuar
      if (data.message && data.message.includes('não encontrado')) {
        throw new Error('CPF não encontrado na base de dados. Você pode continuar mesmo assim.');
      }
      throw new Error(data.message || 'Erro ao consultar CPF');
    }

    // Se a resposta não for OK
    if (!response.ok) {
      const errorMessage = data?.message || `Erro ${response.status}: ${response.statusText}`;
      console.error('Erro na API:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });

      if (response.status >= 500) {
        throw new Error('Serviço temporariamente indisponível. Você pode continuar mesmo assim.');
      }

      throw new Error(errorMessage);
    }

    // Retornar dados formatados
    // A API do Aprovado Direto retorna: {cpf, nome, nome_mae, nascimento}
    return {
      nomeCompleto: data.nome || data.nomeCompleto || data.nome_completo || '',
      nomeMae: data.nome_mae || data.nomeMae || data.nomeDaMae || data.nome_da_mae || '',
      dataNascimento: data.nascimento || data.dataNascimento || data.dataDeNascimento || data.data_nascimento || data.data_de_nascimento || '',
      email: data.email || data.emails?.[0]?.enderecoEmail || data.emails?.[0] || '',
      endereco: data.endereco || data.enderecos?.[0] || null,
      dadosCompletos: data
    };
  } catch (error) {
    // Log detalhado do erro para debug
    console.error('Erro ao consultar CPF:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      cpf: cpfLimpo
    });

    // Se for erro de rede, fornecer mensagem mais clara
    if (error.name === 'TypeError' && (error.message.includes('fetch') || error.message.includes('Failed to fetch'))) {
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente. Você pode continuar mesmo assim.');
    }

    // Re-lançar o erro (já deve ter mensagem amigável)
    throw error;
  }
};

// Consultar CEP
export const consultarCEP = async (cep) => {
  const cepLimpo = cep.replace(/\D/g, '');

  console.log('🔍 [CEP API] Iniciando consulta de CEP:', cepLimpo);

  if (cepLimpo.length !== 8) {
    console.error('❌ [CEP API] CEP inválido - deve ter 8 dígitos:', cepLimpo);
    throw new Error('CEP deve conter 8 dígitos');
  }

  try {
    // Detectar se está em produção e qual plataforma (Vercel ou Netlify)
    const isProduction = import.meta.env.PROD;
    const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');

    // Em produção no Vercel, usar /api/cep-consult; no Netlify, usar /.netlify/functions/cep-consult
    // Em desenvolvimento, usar API direta
    const url = isProduction
      ? (isVercel
        ? `/api/cep-consult?cep=${encodeURIComponent(cepLimpo)}`
        : `/.netlify/functions/cep-consult?cep=${encodeURIComponent(cepLimpo)}`)
      : `https://viacep.com.br/ws/${cepLimpo}/json/`;

    console.log('📡 [CEP API] URL da requisição:', url);
    console.log('🌍 [CEP API] Ambiente:', isProduction ? 'PRODUÇÃO' : 'DESENVOLVIMENTO');

    const response = await fetch(url);

    console.log('📥 [CEP API] Resposta recebida:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      console.error('❌ [CEP API] Erro HTTP:', response.status, response.statusText);
      throw new Error(`Erro ao consultar CEP: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('📦 [CEP API] Dados recebidos:', data);

    if (data.erro) {
      console.error('❌ [CEP API] CEP não encontrado na base ViaCEP');
      throw new Error('CEP não encontrado');
    }

    const resultado = {
      logradouro: data.logradouro || '',
      bairro: data.bairro || '',
      cidade: data.localidade || data.cidade || '',
      estado: data.uf || data.estado || '',
      cep: cepLimpo
    };

    console.log('✅ [CEP API] Endereço encontrado:', resultado);

    return resultado;
  } catch (error) {
    console.error('💥 [CEP API] Erro ao consultar CEP:', {
      message: error.message,
      name: error.name,
      cep: cepLimpo
    });
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


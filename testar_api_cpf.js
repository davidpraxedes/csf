/**
 * Script de teste para API de Consulta de CPF
 * 
 * ATENÇÃO: Este script é apenas para fins educacionais e de teste.
 * Certifique-se de ter autorização e consentimento para consultar os dados.
 */

const SUPABASE_URL = "https://tsmbotzygympsfxvjeul.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWJvdHp5Z3ltcHNmeHZqZXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5Njg3NzMsImV4cCI6MjA4MjU0NDc3M30.W4AbPD6W1hksp0ZcM0-BG9c3aixIk5RejNxQrusV3M0";

/**
 * Consulta dados de CPF via API
 * @param {string} cpf - CPF apenas com números (11 dígitos)
 * @returns {Promise<Object>} Dados do CPF consultado
 */
async function consultarCPF(cpf) {
  // Remove formatação do CPF (pontos, traços, espaços)
  const cpfLimpo = cpf.replace(/\D/g, '');
  
  // Validação básica
  if (cpfLimpo.length !== 11) {
    throw new Error('CPF deve conter 11 dígitos');
  }
  
  const url = `${SUPABASE_URL}/functions/v1/consulta-cpf`;
  
  try {
    console.log('🔍 Consultando CPF:', cpfLimpo);
    console.log('📡 URL:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ cpf: cpfLimpo })
    });
    
    console.log('📊 Status:', response.status, response.statusText);
    
    // Tenta ler a resposta como texto primeiro
    const responseText = await response.text();
    console.log('📄 Resposta (texto):', responseText);
    
    let data = null;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.log('⚠️  Resposta não é JSON válido');
      return {
        error: true,
        status: response.status,
        statusText: response.statusText,
        rawResponse: responseText
      };
    }
    
    if (!response.ok) {
      return {
        error: true,
        status: response.status,
        statusText: response.statusText,
        data: data
      };
    }
    
    // Processa os dados como o site faz
    const resultado = {
      nomeCompleto: data.nomeCompleto || '',
      nomeMae: data.nomeDaMae || data.nomeMae || '',
      dataNascimento: data.dataDeNascimento || data.dataNascimento || '',
      email: data.emails?.[0]?.enderecoEmail || '',
      endereco: data.enderecos?.[0] || null,
      dadosCompletos: data
    };
    
    return {
      error: false,
      status: response.status,
      data: resultado
    };
    
  } catch (error) {
    console.error('❌ Erro na requisição:', error);
    
    // Tratamento específico para diferentes tipos de erro
    let mensagemErro = error.message;
    
    if (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('NetworkError')) {
      mensagemErro = 'Erro de conexão. Verifique sua internet ou se há bloqueio de firewall/VPN.';
    } else if (error.message.includes('timeout') || error.message.includes('aborted')) {
      mensagemErro = 'Tempo de espera esgotado. Verifique sua conexão com a internet.';
    } else if (error.message.includes('CORS')) {
      mensagemErro = 'Erro de configuração de segurança (CORS). Tente novamente.';
    }
    
    return {
      error: true,
      message: mensagemErro,
      originalError: error.message,
      stack: error.stack
    };
  }
}

// Função para formatar CPF (adiciona pontos e traço)
function formatarCPF(cpf) {
  const cpfLimpo = cpf.replace(/\D/g, '');
  return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Se executado diretamente (não como módulo)
if (typeof require !== 'undefined' && require.main === module) {
  // Exemplo de uso
  const readline = require('readline');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('Digite o CPF (apenas números ou com formatação): ', async (cpfInput) => {
    try {
      const resultado = await consultarCPF(cpfInput);
      
      console.log('\n' + '='.repeat(50));
      console.log('RESULTADO DA CONSULTA');
      console.log('='.repeat(50));
      
      if (resultado.error) {
        console.log('❌ Erro na consulta:');
        console.log('Status:', resultado.status);
        console.log('Mensagem:', resultado.statusText || resultado.message);
        if (resultado.data) {
          console.log('Detalhes:', JSON.stringify(resultado.data, null, 2));
        }
      } else {
        console.log('✅ Consulta realizada com sucesso!\n');
        console.log('📋 Dados encontrados:');
        console.log('─'.repeat(50));
        console.log('Nome Completo:', resultado.data.nomeCompleto || '(não encontrado)');
        console.log('Nome da Mãe:', resultado.data.nomeMae || '(não encontrado)');
        console.log('Data de Nascimento:', resultado.data.dataNascimento || '(não encontrado)');
        console.log('Email:', resultado.data.email || '(não encontrado)');
        if (resultado.data.endereco) {
          console.log('Endereço:', JSON.stringify(resultado.data.endereco, null, 2));
        }
        console.log('─'.repeat(50));
        console.log('\n📦 Dados completos:');
        console.log(JSON.stringify(resultado.data.dadosCompletos, null, 2));
      }
      
    } catch (error) {
      console.error('❌ Erro:', error.message);
    } finally {
      rl.close();
    }
  });
}

// Exporta para uso como módulo
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { consultarCPF, formatarCPF };
}


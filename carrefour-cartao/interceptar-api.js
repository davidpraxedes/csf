// ============================================
// SCRIPT PARA INTERCEPTAR API DE CPF
// Cole este código no Console do navegador (F12)
// quando estiver em: https://aprovedireto.com/oportunidade/4/
// ============================================

console.log('%c🔍 INTERCEPTADOR DE API ATIVADO', 'color: green; font-size: 16px; font-weight: bold;');

// Interceptar fetch
const originalFetch = window.fetch;
window.fetch = function(...args) {
  const url = args[0];
  const options = args[1] || {};
  
  // Verificar se é uma requisição relacionada a CPF
  if (url && (
    url.includes('cpf') || 
    url.includes('consulta') || 
    url.includes('supabase') ||
    url.includes('api')
  )) {
    console.log('%c═══════════════════════════════════════', 'color: cyan;');
    console.log('%c🔍 REQUISIÇÃO INTERCEPTADA!', 'color: yellow; font-weight: bold; font-size: 14px;');
    console.log('%c═══════════════════════════════════════', 'color: cyan;');
    console.log('📋 URL:', url);
    console.log('📋 Método:', options.method || 'GET');
    console.log('📋 Headers:', options.headers);
    
    if (options.body) {
      try {
        const bodyObj = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
        console.log('📋 Body:', bodyObj);
      } catch (e) {
        console.log('📋 Body (raw):', options.body);
      }
    }
    
    // Fazer a requisição e capturar a resposta
    return originalFetch.apply(this, args)
      .then(response => {
        console.log('✅ Status:', response.status, response.statusText);
        
        // Clonar a resposta para ler sem consumir
        response.clone().json()
          .then(data => {
            console.log('📦 Resposta (JSON):', data);
            console.log('%c═══════════════════════════════════════', 'color: cyan;');
            
            // Gerar código para usar no projeto
            console.log('%c💻 CÓDIGO PARA USAR NO PROJETO:', 'color: green; font-weight: bold;');
            console.log(`
const response = await fetch('${url}', {
  method: '${options.method || 'POST'}',
  headers: ${JSON.stringify(options.headers, null, 2)},
  body: JSON.stringify(${options.body ? JSON.stringify(JSON.parse(options.body), null, 2) : '{}'})
});

const data = await response.json();
            `);
          })
          .catch(err => {
            response.clone().text()
              .then(text => {
                console.log('📦 Resposta (texto):', text);
              })
              .catch(() => {});
          });
        
        return response;
      })
      .catch(error => {
        console.error('❌ Erro na requisição:', error);
        throw error;
      });
  }
  
  // Para outras requisições, apenas passar adiante
  return originalFetch.apply(this, args);
};

// Interceptar XMLHttpRequest também (caso o site use)
const originalXHROpen = XMLHttpRequest.prototype.open;
const originalXHRSend = XMLHttpRequest.prototype.send;

XMLHttpRequest.prototype.open = function(method, url, ...args) {
  this._method = method;
  this._url = url;
  return originalXHROpen.apply(this, [method, url, ...args]);
};

XMLHttpRequest.prototype.send = function(body) {
  if (this._url && (
    this._url.includes('cpf') || 
    this._url.includes('consulta') || 
    this._url.includes('supabase') ||
    this._url.includes('api')
  )) {
    console.log('%c═══════════════════════════════════════', 'color: cyan;');
    console.log('%c🔍 XMLHttpRequest INTERCEPTADO!', 'color: yellow; font-weight: bold;');
    console.log('📋 URL:', this._url);
    console.log('📋 Método:', this._method);
    console.log('📋 Body:', body);
    
    this.addEventListener('load', function() {
      console.log('✅ Status:', this.status, this.statusText);
      try {
        const data = JSON.parse(this.responseText);
        console.log('📦 Resposta:', data);
      } catch (e) {
        console.log('📦 Resposta (texto):', this.responseText);
      }
      console.log('%c═══════════════════════════════════════', 'color: cyan;');
    });
  }
  
  return originalXHRSend.apply(this, [body]);
};

console.log('%c✅ Pronto! Agora digite um CPF no site e clique em "Continuar"', 'color: green; font-weight: bold;');
console.log('A requisição será interceptada e mostrada aqui no console.');


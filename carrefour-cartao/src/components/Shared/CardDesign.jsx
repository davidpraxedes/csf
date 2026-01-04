export default function CardDesign({ nome, numero, validade, cvv, mostrarCvv = false }) {
  // Formatar número do cartão em 4 blocos de 4 dígitos (5442 34xx xxxx xxxx)
  const formatarNumero = (num) => {
    if (!num || num.includes('•')) return '5442 34•• •••• ••••';
    
    // Remove todos os espaços e caracteres não numéricos
    const limpo = num.replace(/\D/g, '');
    
    if (limpo.length === 0) return '5442 34•• •••• ••••';
    
    // Garante que comece com 544234
    let numeros = limpo;
    if (!numeros.startsWith('544234')) {
      // Se não começar com 544234, adiciona o BIN
      numeros = '544234' + numeros.slice(0, 10);
    }
    
    // Limita a 16 dígitos
    numeros = numeros.slice(0, 16);
    
    // Se tiver menos de 16 dígitos, completa com zeros ou mantém
    if (numeros.length < 16 && !num.includes('•')) {
      numeros = numeros.padEnd(16, '0');
    }
    
    // Formata em 4 blocos de 4 dígitos
    const bloco1 = numeros.slice(0, 4);
    const bloco2 = numeros.slice(4, 8);
    const bloco3 = numeros.slice(8, 12);
    const bloco4 = numeros.slice(12, 16);
    
    return `${bloco1} ${bloco2} ${bloco3} ${bloco4}`;
  };

  const numeroFormatado = formatarNumero(numero);
  const cvvFormatado = mostrarCvv && cvv ? cvv : '•••';
  const nomeFormatado = (nome && nome !== 'SEU NOME' && nome !== 'NOME DO TITULAR') 
    ? nome.toUpperCase() 
    : 'NOME DO TITULAR';
  const validadeFormatada = validade || '00/00';

  return (
    <div className="relative w-full max-w-md mx-auto" style={{ aspectRatio: '1.586 / 1' }}>
      {/* Mockup virgem do cartão como background */}
      <img
        src="/images/cartao-mockup-virgem.png"
        alt="Cartão Carrefour"
        className="w-full h-full object-cover rounded-2xl shadow-2xl"
        style={{ objectPosition: 'center' }}
      />
      
      {/* Overlay com dados do cartão - posicionamento absoluto sobre o mockup */}
      <div className="absolute inset-0 flex flex-col justify-between text-white" style={{ padding: '7% 6% 6% 6%' }}>
        
        {/* Número do cartão - posição mais baixa, abaixo do chip */}
        <div className="flex-1 flex items-end" style={{ paddingBottom: '2%' }}>
          <div className="w-full">
            <div 
              className="font-mono font-bold"
              style={{
                fontSize: 'clamp(1.1rem, 3.5vw, 1.5rem)',
                letterSpacing: '0.12em',
                lineHeight: '1.2',
                marginTop: 'auto',
                paddingTop: '25%', // Empurra o número para baixo, abaixo do chip
                color: '#ffffff',
                // Efeito embossed/relief como na imagem
                textShadow: `
                  1px 1px 0px rgba(255,255,255,0.3),
                  -1px -1px 0px rgba(0,0,0,0.3),
                  0px 1px 2px rgba(0,0,0,0.5),
                  0px -1px 1px rgba(255,255,255,0.2),
                  1px 2px 3px rgba(0,0,0,0.4)
                `,
                textTransform: 'uppercase',
                fontWeight: '700'
              }}
            >
              {numeroFormatado}
            </div>
          </div>
        </div>

        {/* Seção inferior - Validade e Nome */}
        <div className="w-full" style={{ marginTop: 'auto' }}>
          {/* Validade - apenas à esquerda */}
          <div className="flex justify-between items-end mb-3">
            <div>
              <div 
                className="text-white opacity-80 mb-1"
                style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}
              >
                VALID THRU
              </div>
              <div 
                className="font-mono font-semibold text-white"
                style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}
              >
                {validadeFormatada}
              </div>
            </div>
            {/* Customer Since removido - não precisa preencher */}
          </div>

          {/* Nome do titular */}
          <div>
            <div 
              className="font-semibold text-white uppercase tracking-wide"
              style={{
                fontSize: 'clamp(0.8rem, 2.2vw, 0.95rem)',
                letterSpacing: '0.08em',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                lineHeight: '1.3'
              }}
            >
              {nomeFormatado}
            </div>
          </div>
        </div>

        {/* CVV - se necessário mostrar (overlay no canto) */}
        {mostrarCvv && cvv && (
          <div 
            className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-sm px-3 py-2 rounded-lg"
            style={{ fontSize: '0.75rem' }}
          >
            <div className="text-white opacity-70 mb-1 text-xs">CVV</div>
            <div className="font-mono font-bold text-white">{cvvFormatado}</div>
          </div>
        )}
      </div>
    </div>
  );
}

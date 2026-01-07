import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import Logo from '../Shared/Logo';
import ProgressBar from '../Shared/ProgressBar';
import { FileText, CheckCircle, Shield, ChevronDown, Lock, PenTool } from 'lucide-react';

export default function ContractPage() {
    const navigate = useNavigate();
    const { nomeCompleto, email, endereco, setEtapaAtual } = useUserStore();
    const [accepted, setAccepted] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Data atual formatada
    const today = new Date().toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const [isSigning, setIsSigning] = useState(false);
    const [signStep, setSignStep] = useState(0);

    const handleScroll = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom) setScrolled(true);
    };

    const handleContinue = async () => {
        if (accepted) {
            setIsSigning(true);

            // Simulação de passos de assinatura para passar confiança
            setSignStep(1); // Criptografando
            await new Promise(r => setTimeout(r, 1500));

            setSignStep(2); // Validando Token
            await new Promise(r => setTimeout(r, 2000)); // Mais tempo

            setSignStep(3); // Assinado
            await new Promise(r => setTimeout(r, 2000)); // Mais tempo para ver o sucesso

            setSignStep(4); // Email enviado
            await new Promise(r => setTimeout(r, 2500)); // Tempo para ler a mensagem do email

            setEtapaAtual('delivery');
            navigate('/delivery');
        }
    };

    // Overlay de Assinatura
    const SigningOverlay = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-white/95 z-[60] flex items-center justify-center p-4 backdrop-blur-sm"
        >
            <div className="text-center max-w-sm w-full">
                <div className="mb-8 relative h-24 w-24 mx-auto">
                    {/* Anéis de loading */}
                    <div className={`absolute inset-0 border-4 border-gray-100 rounded-full`}></div>
                    <div className={`absolute inset-0 border-4 border-carrefour-blue border-t-transparent rounded-full animate-spin transition-all duration-500 ${signStep >= 3 ? 'border-green-500 border-t-green-500' : ''}`}></div>

                    {signStep >= 3 && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute inset-0 flex items-center justify-center text-green-500"
                        >
                            <CheckCircle className="w-10 h-10" />
                        </motion.div>
                    )}
                    {signStep < 3 && (
                        <div className="absolute inset-0 flex items-center justify-center text-carrefour-blue">
                            <Lock className="w-8 h-8 opacity-50" />
                        </div>
                    )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {signStep === 1 && 'Criptografando Dados...'}
                    {signStep === 2 && 'Validando Assinatura Digital...'}
                    {signStep === 3 && 'Contrato Assinado!'}
                    {signStep === 4 && 'Contrato Enviado!'}
                </h3>

                <p className="text-sm text-gray-500">
                    {signStep === 1 && 'Gerando hash de segurança único'}
                    {signStep === 2 && 'Autenticando com servidores do BACEN'}
                    {signStep === 3 && 'Registro efetuado com sucesso'}
                    {signStep === 4 && (
                        <span>
                            Uma cópia autenticada foi enviada para:<br />
                            <strong className="text-gray-900">{email}</strong>
                        </span>
                    )}
                </p>

                {/* Barra de progresso fake */}
                <div className="mt-8 bg-gray-100 h-1.5 rounded-full overflow-hidden w-full">
                    <motion.div
                        className="h-full bg-carrefour-blue"
                        initial={{ width: "0%" }}
                        animate={{ width: signStep === 1 ? "25%" : signStep === 2 ? "50%" : signStep === 3 ? "75%" : "100%" }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                    <Shield className="w-3 h-3" />
                    Ambiente Seguro 256-bit SSL
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col relative">
            <AnimatePresence>
                {isSigning && <SigningOverlay />}
            </AnimatePresence>

            <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <Logo size="md" />
                </div>
            </div>

            <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
                <ProgressBar etapaAtual="contract" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
                >
                    {/* Header do Contrato */}
                    <div className="bg-gray-900 text-white p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-carrefour-blue to-green-400"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
                                <PenTool className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold mb-2">Contrato de Emissão</h1>
                            <p className="text-gray-400 text-sm md:text-base">Termos de Uso e Adesão ao Cartão de Crédito</p>
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        {/* Info do Participante */}
                        <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">CONTRATANTE</p>
                                <p className="text-lg font-bold text-gray-900">{nomeCompleto || 'CLIENTE NÃO IDENTIFICADO'}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {endereco.logradouro}, {endereco.numero} {endereco.complemento && `- ${endereco.complemento}`}<br />
                                    {endereco.bairro} - {endereco.cidade}/{endereco.estado}<br />
                                    CEP: {endereco.cep}
                                </p>
                            </div>
                            <div className="md:text-right">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">CONTRATADA</p>
                                <p className="text-lg font-bold text-gray-900 flex items-center gap-2 md:justify-end">
                                    <Shield className="w-5 h-5 text-carrefour-blue" />
                                    CSF Bank S.A.
                                </p>
                            </div>
                        </div>

                        {/* Área do Contrato (Scroll) */}
                        <div
                            className="relative border rounded-xl bg-gray-50 h-96 mb-6"
                        >
                            <div
                                className="absolute inset-0 p-6 overflow-y-auto custom-scrollbar text-sm text-gray-600 leading-relaxed text-justify"
                                onScroll={handleScroll}
                            >
                                <h3 className="font-bold text-gray-900 mb-4">CLÁUSULA PRIMEIRA - DA ADESÃO</h3>
                                <p className="mb-4">
                                    Pelo presente instrumento, o <strong>{nomeCompleto || 'CONTRATANTE'}</strong>, doravante denominado TITULAR, adere aos termos e condições gerais para emissão e utilização do CARTÃO DE CRÉDITO CSF BANK, administrado pelo CSF BANK S.A., instituição financeira devidamente autorizada pelo Banco Central do Brasil.
                                </p>

                                <h3 className="font-bold text-gray-900 mb-4">CLÁUSULA SEGUNDA - DO LIMITE DE CRÉDITO</h3>
                                <p className="mb-4">
                                    O limite de crédito inicial pré-aprovado de <strong>R$ 5.500,00 (cinco mil e quinhentos reais)</strong> poderá ser revisado periodicamente, sujeito à análise de crédito e comportamento de pagamento do TITULAR. O uso do cartão implica na aceitação automática das tarifas vigentes, quando aplicáveis.
                                </p>

                                <h3 className="font-bold text-gray-900 mb-4">CLÁUSULA TERCEIRA - DA SEGURANÇA E FRAUDE</h3>
                                <p className="mb-4">
                                    O CSF BANK adota medidas rigorosas de segurança cibernética e monitoramento contra fraudes. O TITULAR se compromete a manter seus dados de acesso (senha e token) em sigilo absoluto, não os compartilhando com terceiros. Qualquer comunicação suspeita deve ser reportada imediatamente aos canais oficiais.
                                </p>

                                <h3 className="font-bold text-gray-900 mb-4">CLÁUSULA QUARTA - DO PAGAMENTO</h3>
                                <p className="mb-4">
                                    O não pagamento da fatura até a data de vencimento implicará na cobrança de juros remuneratórios, multa de 2% (dois por cento) e juros de mora de 1% (um por cento) ao mês, calculados pro rata die, além de IOF e demais encargos previstos na legislação vigente.
                                </p>

                                <h3 className="font-bold text-gray-900 mb-4">CLÁUSULA QUINTA - DISPOSIÇÕES GERAIS</h3>
                                <p className="mb-4">
                                    Este contrato é regido pelas leis da República Federativa do Brasil. As partes elegem o foro da Comarca da Capital do Estado de residência do TITULAR para dirimir quaisquer dúvidas oriundas deste instrumento.
                                </p>

                                <p className="mt-8 text-center text-gray-400 font-mono text-xs">
                                    Documento assinado digitalmente em {today}.<br />
                                    Hash de Segurança: 8f4k9-csf-2024-secure-token-x92
                                </p>
                            </div>
                        </div>

                        {/* Aceite */}
                        <div className="flex items-start gap-4 p-4 border rounded-xl hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setAccepted(!accepted)}>
                            <div className={`mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${accepted ? 'bg-carrefour-blue border-carrefour-blue' : 'border-gray-300 bg-white'}`}>
                                {accepted && <CheckCircle className="w-4 h-4 text-white" />}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900">Li e concordo com os Termos de Uso</p>
                                <p className="text-sm text-gray-500">Declaro que li o contrato acima e aceito todas as condições para emissão do meu cartão.</p>
                            </div>
                        </div>

                        {/* Botão */}
                        <button
                            onClick={handleContinue}
                            disabled={!accepted}
                            className="w-full mt-8 bg-carrefour-blue hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-5 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
                        >
                            <PenTool className="w-5 h-5" />
                            Assinar Digitalmente e Concluir
                        </button>

                        <p className="text-center mt-4 text-xs text-gray-400 flex items-center justify-center gap-1">
                            <Lock className="w-3 h-3" />
                            Seus dados estão protegidos por criptografia de ponta a ponta.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

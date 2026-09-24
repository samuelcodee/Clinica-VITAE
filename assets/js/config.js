/*
 * Clínica Vitae — configuração central do site.
 *
 * Todo dado da clínica mora aqui e é lido pelo main.js (WhatsApp, mapa,
 * lista de serviços, formulário, rodapé, perguntas frequentes).
 *
 * Regra da casa: campo vazio ('' / null / []) = informação pendente.
 * O site esconde o item ou mostra "a confirmar", nunca inventa.
 *
 * Fontes dos dados já preenchidos (material enviado pela clínica):
 *  - Instagram @clinicavitaece e @dra.karolynaborges
 *  - agenda online da clínica (lista de serviços)
 *  - vídeos institucionais (endereço, telefone, falas da Dra. Karolyna)
 */
window.CLINIC = {
  name: 'Clínica Vitae',
  tagline: 'Saúde Integral',
  segment: 'Clínica odontológica',

  // Só dígitos, com DDI + DDD. Usado no wa.me e no botão flutuante.
  whatsapp: '5585988404126',
  phone: '+5585988404126',
  phoneDisplay: '(85) 98840-4126',
  email: '', // PENDENTE

  address: {
    street: 'Av. das Adenanteras, 703',
    neighborhood: 'Cidade 2000',
    city: 'Fortaleza',
    state: 'CE',
    zip: '60190-560',
    reference: '' // ponto de referência, se houver
  },

  // Coordenadas exatas: preencher só com o valor confirmado. Não simular.
  geo: null, // ex.: { lat: -3.7, lng: -38.4 }

  // Opcional. Chave pública da Maps Embed API, restrita ao domínio do site
  // no Google Cloud. Sem chave, o mapa usa o embed público do Google Maps.
  googleMapsEmbedKey: '',

  // O primeiro perfil é o principal (usado nos botões e no menu).
  instagram: [
    { handle: 'clinicavitaece', url: 'https://www.instagram.com/clinicavitaece/' },
    { handle: 'clinicavitaebrasil', url: 'https://www.instagram.com/clinicavitaebrasil/' },
    { handle: 'clinicavitaceara', url: 'https://www.instagram.com/clinicavitaceara/' },
    { handle: 'dra.karolynaborges', url: 'https://www.instagram.com/dra.karolynaborges/' }
  ],

  // Atendimento com hora marcada. Se um dia houver horário fixo, liste aqui
  // (ex.: [{ days: 'Segunda a sexta', hours: '8h às 18h' }]) e ele passa a aparecer.
  openingHours: [],
  scheduleNote: 'Com hora marcada, agendada pelo WhatsApp.',

  // O CFO exige nome e CRO do responsável técnico na publicidade odontológica.
  technicalResponsible: { name: 'Dra. Karolyna Borges', cro: '' }, // CRO-CE PENDENTE

  professionals: [
    { id: 'karolyna', name: 'Dra. Karolyna Borges', role: 'Cirurgiã-dentista · Reabilitação oral' }
  ],

  /*
   * Serviços: os mesmos da agenda online da clínica.
   * As descrições são RASCUNHOS neutros (sem promessa de resultado):
   * revisar com a clínica antes de publicar.
   * icon: stethoscope | shield | sparkles | aligner | brackets | implant | tooth | canal | clock
   */
  services: [
    { id: 'avaliacao', name: 'Avaliação', category: 'Prevenção e diagnóstico', icon: 'stethoscope',
      description: 'Primeira consulta para ouvir sua queixa, examinar a saúde bucal e definir com clareza os próximos passos.' },
    { id: 'limpeza', name: 'Limpeza', category: 'Prevenção e diagnóstico', icon: 'shield',
      description: 'Remoção de placa e tártaro, com orientação de higiene para manter dentes e gengivas saudáveis.' },
    { id: 'clareamento', name: 'Clareamento', category: 'Estética do sorriso', icon: 'sparkles',
      description: 'Clareamento dental indicado após avaliação, com acompanhamento profissional em cada etapa.' },
    { id: 'alinhadores', name: 'Alinhadores', category: 'Ortodontia', icon: 'aligner',
      description: 'Alinhadores transparentes para corrigir a posição dos dentes, com planejamento individual.' },
    { id: 'aparelho', name: 'Aparelho', category: 'Ortodontia', icon: 'brackets',
      description: 'Aparelho ortodôntico para alinhar os dentes e ajustar a mordida, com manutenções periódicas.' },
    { id: 'implante', name: 'Implante', category: 'Reabilitação oral', icon: 'implant',
      description: 'Reposição de dentes perdidos com implantes, a partir de diagnóstico e planejamento cuidadosos.' },
    { id: 'protese', name: 'Prótese', category: 'Reabilitação oral', icon: 'tooth',
      description: 'Próteses planejadas para o seu caso, para devolver função e estética ao sorriso.' },
    { id: 'canal', name: 'Canal', category: 'Endodontia', icon: 'canal',
      description: 'Tratamento de canal para tratar a polpa do dente e aliviar a dor, preservando o dente natural sempre que possível.' },
    { id: 'urgencia', name: 'Urgência / dor', category: 'Atendimento de urgência', icon: 'clock',
      description: 'Está com dor ou incômodo? Envie uma mensagem: a equipe orienta sobre o atendimento e a disponibilidade.' }
  ],

  // Opção extra que aparece só no formulário de agendamento.
  otherServiceLabel: 'Outro',

  // Depoimentos: somente conteúdo real, com autorização por escrito do paciente.
  // Ainda não há seção visual para eles; adicionar quando houver conteúdo.
  testimonials: [],

  // Perguntas frequentes. {telefone} e {endereco} são trocados pelos dados acima.
  faq: [
    { q: 'Como posso agendar uma consulta?',
      a: 'Pelo formulário de agendamento deste site: escolha o serviço, a data e o horário de sua preferência e envie a solicitação pelo WhatsApp. Se preferir, fale direto com a equipe pelo {telefone}.' },
    { q: 'Como funciona a confirmação do agendamento?',
      a: 'A mensagem enviada é uma solicitação. A equipe da Clínica Vitae verifica a agenda e confirma o dia e o horário com você pelo WhatsApp. O horário só está garantido depois dessa confirmação.' },
    { q: 'Qual é o horário de atendimento?',
      a: 'O atendimento é feito com hora marcada. Escolha o dia e o horário de sua preferência no formulário de agendamento ou fale com a equipe pelo WhatsApp {telefone}.' },
    { q: 'Onde fica a Clínica Vitae?',
      a: 'Na {endereco}. Na seção Localização há um botão “Como chegar” que abre a rota no Google Maps.' },
    { q: 'Quais serviços estão disponíveis?',
      a: '{servicos}. O plano de cada paciente é definido depois da avaliação.' },
    { q: 'Estou com dor. Consigo um atendimento de urgência?',
      a: 'Escolha “Urgência / dor” no agendamento ou chame no WhatsApp ({telefone}). A equipe orienta sobre o atendimento e informa a disponibilidade.' },
    { q: 'Como posso entrar em contato?',
      a: 'Pelo WhatsApp e telefone {telefone} ou pelo Instagram: {instagram}.' }
  ]
};

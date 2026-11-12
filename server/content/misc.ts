// Demais conteúdos: dúvidas, sinais de alerta, listas, plano de parto e textos das ferramentas. Sem revisão médica.
const PRENATAL = 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/g/gravidez/pre-natal';
const CALENDARIO = 'https://www.gov.br/saude/pt-br/vacinacao/calendario';
const ALEITAMENTO = 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/a/aleitamento-materno';
const CADERNETA = 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-da-mulher/publicacoes/caderneta-brasileira-da-gestante.pdf/view';

export const FAQ = [
  { key: 'consultas', question: 'Quantas consultas de pré-natal devo ter?', answer: 'O Ministério da Saúde orienta pelo menos sete consultas, alternando médico e enfermeiro, e ao menos uma consulta odontológica. Sua equipe pode indicar mais.', source: 'Ministério da Saúde · Pré-natal', sourceUrl: PRENATAL },
  { key: 'quando-comecar', question: 'Quando começar o pré-natal?', answer: 'Assim que suspeitar ou confirmar a gravidez, procure a Unidade Básica de Saúde. O ideal é começar até a 12ª semana.', source: 'Ministério da Saúde · Pré-natal', sourceUrl: PRENATAL },
  { key: 'dtpa', question: 'Quando tomar a vacina dTpa?', answer: 'A dTpa é indicada em cada gestação, a partir da 20ª semana.', source: 'Ministério da Saúde · Calendário de vacinação', sourceUrl: CALENDARIO },
  { key: 'gripe', question: 'Gestante pode tomar vacina da gripe?', answer: 'Sim. A vacina contra a gripe é recomendada para gestantes em qualquer fase da gravidez, durante a campanha.', source: 'Ministério da Saúde · Calendário de vacinação', sourceUrl: CALENDARIO },
  { key: 'mexer', question: 'Quando vou sentir o bebê mexer?', answer: 'Na primeira gravidez, costuma ser entre 18 e 22 semanas. No terceiro trimestre, conheça o padrão do seu bebê; se perceber redução, procure a maternidade.', source: 'Ministério da Saúde · Caderneta da Gestante', sourceUrl: CADERNETA },
  { key: 'contracoes', question: 'Contrações antes da hora são normais?', answer: 'Contrações irregulares e sem dor são comuns. Se ficarem regulares, doloridas ou vierem com sangramento ou perda de líquido antes de 37 semanas, procure atendimento.', source: 'Ministério da Saúde · Caderneta da Gestante', sourceUrl: CADERNETA },
  { key: 'acompanhante', question: 'Posso ter acompanhante no parto?', answer: 'Sim. A gestante tem direito a um acompanhante de sua escolha durante o trabalho de parto, o parto e o pós-parto imediato.', source: 'Ministério da Saúde · Caderneta da Gestante', sourceUrl: CADERNETA },
  { key: 'amamentacao', question: 'Por quanto tempo amamentar?', answer: 'A recomendação é leite materno exclusivo até os seis meses e amamentação continuada até os dois anos ou mais.', source: 'Ministério da Saúde · Aleitamento materno', sourceUrl: ALEITAMENTO },
  { key: 'cafe', question: 'Posso tomar café?', answer: 'Em geral, o consumo moderado de cafeína é considerado aceitável na gestação. Confirme a quantidade com sua equipe.', source: 'Converse com sua equipe de saúde', sourceUrl: '' },
  { key: 'exercicio', question: 'Posso fazer exercício?', answer: 'Atividade física moderada costuma ser recomendada em gestações sem intercorrências, com liberação do profissional que acompanha você.', source: 'Ministério da Saúde · Caderneta da Gestante', sourceUrl: CADERNETA },
];

export const ALERTS = ['Sangramento vaginal', 'Perda de líquido pela vagina', 'Dor de cabeça forte com visão embaçada', 'Inchaço súbito no rosto e nas mãos', 'Redução dos movimentos do bebê', 'Febre ou dor forte na barriga', 'Contrações regulares antes de 37 semanas'];

export const CHECKLISTS = [
  { key: 'enx-roupas', list: 'enxoval', group: 'Roupas', items: ['Bodies RN (6)', 'Bodies P (6)', 'Macacões (4)', 'Meias e luvas', 'Gorros (2)', 'Mantas (2)'] },
  { key: 'enx-higiene', list: 'enxoval', group: 'Higiene', items: ['Banheira', 'Toalhas com capuz (3)', 'Fraldas RN', 'Lenços umedecidos', 'Pomada para assaduras', 'Termômetro'] },
  { key: 'enx-alimentacao', list: 'enxoval', group: 'Alimentação', items: ['Almofada de amamentação', 'Paninhos de boca (6)', 'Sutiã de amamentação (2)', 'Protetores de seio'] },
  { key: 'enx-quarto', list: 'enxoval', group: 'Quarto', items: ['Berço com colchão', 'Lençóis (3)', 'Trocador', 'Luz noturna'] },
  { key: 'enx-passeio', list: 'enxoval', group: 'Passeio', items: ['Bolsa do bebê', 'Carrinho', 'Sling ou canguru'] },
  { key: 'enx-seguranca', list: 'enxoval', group: 'Segurança', items: ['Bebê conforto', 'Base para carro', 'Protetores de tomada'] },
  { key: 'mala-mamae', list: 'mala', group: 'Mamãe', items: ['Documentos e caderneta da gestante', 'Camisolas abertas na frente (3)', 'Sutiã de amamentação', 'Calcinhas descartáveis', 'Absorventes pós-parto', 'Chinelo', 'Itens de higiene'] },
  { key: 'mala-bebe', list: 'mala', group: 'Bebê', items: ['Bodies (4)', 'Macacões (3)', 'Mantas (2)', 'Meias e luvas', 'Fraldas RN', 'Saída de maternidade'] },
  { key: 'mala-acompanhante', list: 'mala', group: 'Acompanhante', items: ['Documento com foto', 'Troca de roupa', 'Carregador de celular', 'Lanches', 'Garrafa de água'] },
  { key: 'nasc-agora', list: 'nascimento', group: 'Agora', range: '28 a 32 sem', items: ['Escolher a maternidade', 'Fazer a visita guiada', 'Montar a rede de apoio'] },
  { key: 'nasc-breve', list: 'nascimento', group: 'Em breve', range: '33 a 36 sem', items: ['Separar documentos', 'Mala pronta', 'Planejar o transporte'] },
  { key: 'nasc-dpp', list: 'nascimento', group: 'Perto da DPP', range: '37+ sem', items: ['Cuidados iniciais com o bebê', 'Contatos de emergência à mão'] },
];

export const BIRTH_PLAN = [
  { key: 'acompanhante', topic: 'Acompanhante', options: ['Parceiro(a)', 'Mãe', 'Doula', 'Outra pessoa'] },
  { key: 'ambiente', topic: 'Ambiente', options: ['Luz baixa', 'Música', 'Silêncio', 'Liberdade para me movimentar'] },
  { key: 'analgesia', topic: 'Analgesia', options: ['Métodos não farmacológicos primeiro', 'Analgesia se eu pedir', 'Decidir na hora'] },
  { key: 'pele-a-pele', topic: 'Contato pele a pele', options: ['Imediato, se possível', 'Após avaliação do bebê'] },
  { key: 'cordao', topic: 'Clampeamento do cordão', options: ['Clampeamento tardio', 'Acompanhante corta o cordão', 'Sem preferência'] },
  { key: 'amamentacao', topic: 'Amamentação', options: ['Na primeira hora', 'Apoio de consultora', 'Sem preferência'] },
];

export const TOOLS = [
  { key: 'kicks', title: 'Contador de movimentos', text: 'No terceiro trimestre, escolha um momento do dia em que o bebê costuma estar ativo, de preferência depois de uma refeição. Deite-se de lado e toque no botão a cada movimento.\n\nMuitas equipes usam como referência perceber 10 movimentos em até 2 horas. O mais importante é conhecer o padrão do seu bebê: se perceber que ele está se mexendo menos que o habitual, procure a maternidade.' },
  { key: 'contractions', title: 'Cronômetro de contrações', text: 'Toque em Começar quando a contração iniciar e em Terminar quando ela passar. O app calcula a duração e o intervalo entre elas.\n\nContrações irregulares e sem dor são comuns no fim da gestação. Contrações regulares e dolorosas, perda de líquido ou sangramento pedem contato com a maternidade, principalmente antes de 37 semanas. Siga o que foi combinado com sua equipe.' },
];

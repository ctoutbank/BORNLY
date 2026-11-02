// Conteúdo do protótipo. Textos clínicos e dados de exemplo ainda precisam de revisão antes de produção.

type BabyRow = [size: string, dev: string, you: string, cm: number, grams: number];

export const BABY: Record<number, BabyRow> = {
  8: ['uma framboesa', 'Mãos e pés começam a se formar, e o coração já bate rápido.', 'Enjoo e cansaço costumam ser mais intensos nestas semanas.', 1.6, 1],
  12: ['um limão', 'Os órgãos principais já estão formados e começam a amadurecer.', 'Para muitas mulheres, o enjoo começa a diminuir.', 5.4, 14],
  16: ['um abacate', 'Faz pequenos movimentos que logo você vai sentir.', 'A barriga começa a aparecer e a energia costuma voltar.', 11.6, 100],
  20: ['uma banana', 'Já ouve sons de fora e tem períodos de sono e vigília.', 'Metade do caminho. Os primeiros movimentos podem aparecer agora.', 25.6, 300],
  24: ['uma espiga de milho', 'Os pulmões começam a formar as ramificações que vão respirar.', 'A barriga ganha volume rápido. Dor nas costas e pés inchados ao fim do dia são comuns.', 30, 600],
  25: ['uma couve-flor', 'Começa a responder à sua voz e aos sons do ambiente.', 'O sono pode ficar mais leve. Uma almofada entre os joelhos costuma ajudar.', 34.6, 660],
  26: ['um pé de alface', 'Os olhos começam a se abrir e já reagem à luz.', 'Azia e falta de ar leve aparecem conforme o útero sobe.', 35.6, 760],
  27: ['uma couve', 'Já dorme e acorda em ciclos, e pode até soluçar.', 'Cãibras nas pernas à noite são frequentes. Alongar antes de dormir ajuda.', 36.6, 875],
  28: ['uma berinjela', 'Os olhos abrem e fecham, e o cérebro forma os primeiros sulcos. Começa a sonhar.', 'Último trimestre. A barriga cresce mais rápido; falta de ar, azia e cansaço são esperados. Os movimentos ficam mais nítidos.', 37.6, 1000],
  29: ['uma abóbora pequena', 'Ganha gordura e já regula melhor a própria temperatura.', 'Você pode sentir mais fome. Refeições menores e mais frequentes aliviam a azia.', 38.6, 1150],
  30: ['um repolho', 'Os movimentos ficam mais fortes, com menos espaço para virar.', 'Contrações de treino podem aparecer. Irregulares e sem dor são esperadas.', 39.9, 1300],
  31: ['um coco', 'Os cinco sentidos já funcionam e o bebê vira a cabeça em direção à luz.', 'Vontade de urinar mais vezes e sono interrompido são comuns nesta fase.', 41.1, 1500],
  32: ['um abacaxi', 'Pratica respirar, sugar e engolir. A pele fica mais lisa.', 'A barriga pode pesar na lombar. Alterne descanso e caminhadas curtas.', 42.4, 1700],
  34: ['um melão', 'Os pulmões estão quase prontos e o bebê ganha peso rápido.', 'Cansaço e pressão na pelve aumentam. Descansar de lado ajuda.', 45, 2100],
  36: ['um mamão', 'Começa a se posicionar para o nascimento, em geral de cabeça para baixo.', 'Você pode sentir a barriga baixar e respirar um pouco melhor.', 47.4, 2600],
  38: ['uma abóbora', 'Está pronto para nascer e segue ganhando gordura.', 'Contrações mais regulares podem começar. Siga o plano combinado com sua equipe.', 49.8, 3100],
  40: ['uma melancia pequena', 'Chegou a data provável. Cada bebê tem seu tempo.', 'Mantenha contato com sua equipe e observe os movimentos do bebê.', 51.2, 3400],
};

export const GUIDE =
  'Nesta fase o pré-natal costuma ficar quinzenal. Vale perguntar ao obstetra sobre a curva glicêmica e a vacina dTpa, se ainda não fez. Observe o padrão de movimentos do bebê ao longo do dia.';

export const ENX: Record<string, string[]> = {
  Roupas: ['Bodies RN (6)', 'Bodies P (6)', 'Macacões (4)', 'Meias e luvas', 'Gorros (2)', 'Mantas (2)'],
  Higiene: ['Banheira', 'Toalhas com capuz (3)', 'Fraldas RN', 'Lenços umedecidos', 'Pomada para assaduras', 'Termômetro'],
  Alimentação: ['Almofada de amamentação', 'Paninhos de boca (6)', 'Sutiã de amamentação (2)', 'Protetores de seio'],
  Quarto: ['Berço com colchão', 'Lençóis (3)', 'Trocador', 'Luz noturna'],
  Passeio: ['Bolsa do bebê', 'Carrinho', 'Sling ou canguru'],
  Segurança: ['Bebê conforto', 'Base para carro', 'Protetores de tomada'],
};

export const MALA: Record<string, string[]> = {
  Mamãe: ['Documentos e cartão do pré-natal', 'Camisolas abertas na frente (3)', 'Sutiã de amamentação', 'Calcinhas descartáveis', 'Absorventes pós-parto', 'Chinelo', 'Itens de higiene'],
  Bebê: ['Bodies (4)', 'Macacões (3)', 'Mantas (2)', 'Meias e luvas', 'Fraldas RN', 'Saída de maternidade'],
  Acompanhante: ['Documento com foto', 'Troca de roupa', 'Carregador de celular', 'Lanches', 'Garrafa de água'],
};

export const PLAN: [string, string[]][] = [
  ['Acompanhante', ['Parceiro(a)', 'Mãe', 'Doula', 'Outra pessoa']],
  ['Ambiente', ['Luz baixa', 'Música', 'Silêncio', 'Liberdade para me movimentar']],
  ['Analgesia', ['Métodos não farmacológicos primeiro', 'Analgesia se eu pedir', 'Decidir na hora']],
  ['Contato pele a pele', ['Imediato, se possível', 'Após avaliação do bebê']],
  ['Clampeamento do cordão', ['Clampeamento tardio', 'Acompanhante corta o cordão', 'Sem preferência']],
  ['Amamentação', ['Na primeira hora', 'Apoio de consultora', 'Sem preferência']],
];

export const BIRTH: [string, string, string[]][] = [
  ['Agora', '28 a 32 sem', ['Escolher a maternidade', 'Fazer a visita guiada', 'Montar a rede de apoio']],
  ['Em breve', '33 a 36 sem', ['Separar documentos', 'Mala pronta', 'Planejar o transporte']],
  ['Perto da DPP', '37+ sem', ['Cuidados iniciais com o bebê', 'Contatos de emergência à mão']],
];

export const ART = [
  { id: 'a1', cat: 'Gravidez', title: 'Contrações de treino: como reconhecer', min: 4 },
  { id: 'a2', cat: 'Exames', title: 'Exames do 3º trimestre', min: 5 },
  { id: 'a3', cat: 'Bem-estar', title: 'Dormir melhor no fim da gestação', min: 3 },
  { id: 'a4', cat: 'Gravidez', title: 'Como perceber os movimentos do bebê', min: 4 },
];

export const LIB: [string, number][] = [
  ['Gravidez e desenvolvimento', 42],
  ['Alimentação e nutrição', 28],
  ['Corpo e bem-estar', 31],
  ['Saúde emocional', 19],
  ['Parto e nascimento', 24],
  ['Amamentação', 17],
  ['Cuidados com o bebê', 26],
];

export const FAQ: [string, string, string][] = [
  ['Posso tomar café?', 'Em geral, até cerca de 200 mg de cafeína por dia, o equivalente a duas xícaras pequenas, é considerado seguro. Confirme com seu obstetra.', 'Organização Mundial da Saúde'],
  ['Quando vou sentir o bebê mexer?', 'Na primeira gravidez, costuma ser entre 18 e 22 semanas. No terceiro trimestre, conheça o padrão do seu bebê; se perceber redução, procure a maternidade.', 'Ministério da Saúde · Caderneta da Gestante'],
  ['Contrações antes da hora são normais?', 'Contrações irregulares e sem dor são comuns. Se ficarem regulares, doloridas ou vierem com sangramento ou perda de líquido antes de 37 semanas, procure atendimento.', 'FEBRASGO'],
  ['Posso fazer exercício?', 'Atividade física moderada costuma ser recomendada em gestações sem intercorrências, com liberação do profissional que acompanha você.', 'Ministério da Saúde'],
  ['Quantas consultas de pré-natal devo ter?', 'O mínimo recomendado são seis consultas, ficando mais frequentes no fim da gestação. Sua equipe pode indicar mais.', 'Ministério da Saúde · Caderneta da Gestante'],
];

export const ALERTS = ['Sangramento vaginal', 'Perda de líquido pela vagina', 'Dor de cabeça forte com visão embaçada', 'Inchaço súbito no rosto e nas mãos', 'Redução dos movimentos do bebê', 'Febre ou dor forte na barriga'];

export const MEDS = [
  { id: 'm1', name: 'Vitamina pré-natal', dose: '1 cápsula', when: 'café da manhã', time: '8h', slot: 'Manhã' },
  { id: 'm2', name: 'Sulfato ferroso', dose: '40 mg', when: 'almoço', time: '12h30', slot: 'Almoço' },
  { id: 'm3', name: 'Ômega 3', dose: '1 cápsula', when: 'jantar', time: '20h', slot: 'Noite' },
];

export const FEELINGS = ['Muito bem', 'Bem', 'Ok', 'Cansada', 'Difícil'];
export const FEEL_DOTS = ['#6F8F84', '#93AC9F', '#C9B8A8', '#D2A08A', '#A3604E'];
export const HUMORS = ['Calma', 'Animada', 'Sensível', 'Ansiosa', 'Irritada', 'Com saudade de dormir'];
export const SLEEP = ['Ruim', 'Regular', 'Bom', 'Ótimo'];
export const SYMPTOMS = ['Enjoo', 'Azia', 'Dor de cabeça', 'Cansaço', 'Inchaço', 'Dor nas costas', 'Cãibras', 'Insônia'];
export const INTENSITY = ['Leve', 'Moderada', 'Forte'];
export const DURATION = ['Minutos', 'Horas', 'O dia todo'];

export const MOMENTS: [string, string, string][] = [
  ['descobri', 'Acabei de descobrir', 'Primeiras semanas, muitas perguntas'],
  ['tentante', 'Estou tentando engravidar', 'Acompanhar ciclo e saúde'],
  ['gravida', 'Já sei que estou grávida', 'Acompanhar semana a semana'],
];

export const NOTIFS: [string, string, string][] = [
  ['c', 'Consultas e exames', 'Um dia antes e no dia'],
  ['m', 'Medicamentos e vitaminas', 'Nos horários da prescrição'],
  ['r', 'Registro diário', 'Um lembrete leve à noite'],
];

export const APPOINTMENTS = [
  { off: 4, title: 'Consulta pré-natal', who: 'Dra. Helena Prado', what: 'Pré-natal · 28 semanas', meta: '14h30 · Clínica Bem Nascer' },
  { off: 8, title: 'Curva glicêmica', who: 'Laboratório Vida', what: 'Exame', meta: '7h · em jejum de 8h' },
  { off: 18, title: 'Consulta pré-natal', who: 'Dra. Helena Prado', what: 'Pré-natal', meta: '10h · Clínica Bem Nascer' },
];

export const PAST_APPOINTMENTS: [string, number, string][] = [
  ['Consulta pré-natal', 14, 'Realizada'],
  ['Ultrassom morfológico', 28, 'Laudo anexado'],
  ['Hemograma e sorologias', 35, 'Resultado ok'],
  ['Consulta pré-natal', 42, 'Realizada'],
];

export const WEIGHTS = [61.2, 61.9, 62.6, 63.1, 63.8, 64.2, 64.9, 65.3, 65.8];

// Artigos com texto próprio e link para a fonte oficial. Não reproduzem o texto das fontes. Sem revisão médica.
const PRENATAL = 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/g/gravidez/pre-natal';
const EXAMES = 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/g/gravidez/exames-e-vacinas';
const CADERNETA = 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-da-mulher/publicacoes/caderneta-brasileira-da-gestante.pdf/view';
const CALENDARIO = 'https://www.gov.br/saude/pt-br/vacinacao/calendario';
const ALEITAMENTO = 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/a/aleitamento-materno';
const DEZ_PASSOS = 'https://www.gov.br/saude/pt-br/assuntos/noticias/2022/agosto/assistencia-as-mulheres-em-fase-de-aleitamento-conheca-os-dez-passos-para-o-sucesso-da-amamentacao';
const SAUDE_MATERNA = 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-da-mulher/saude-materna';
const SIFILIS = 'https://portalarquivos.saude.gov.br/campanhas/sifilis/';
const MS = 'Ministério da Saúde';

export type Article = { key: string; title: string; category: string; summary: string; body: string; minutes: number; weekFrom?: number; weekTo?: number; sourceName: string; sourceUrl: string; image?: string; imageCredit?: string };

export const ARTICLES: Article[] = [
  {
    key: 'pre-natal-quando-comecar', title: 'Pré-natal: quando começar e quantas consultas', category: 'Pré-natal', minutes: 3, weekFrom: 4, weekTo: 16, sourceName: `${MS} · Pré-natal`, sourceUrl: PRENATAL,
    summary: 'O acompanhamento começa na Unidade Básica de Saúde, de preferência até a 12ª semana.',
    body: 'O pré-natal é o acompanhamento da gestação pela equipe de saúde. No SUS, ele começa na Unidade Básica de Saúde mais próxima de casa, assim que a gravidez é suspeitada ou confirmada.\n\nO Ministério da Saúde orienta iniciar até a 12ª semana e realizar pelo menos sete consultas, alternando entre médico e enfermeiro, além de pelo menos uma consulta odontológica.\n\nAs consultas costumam ser mensais até a 28ª semana, quinzenais até a 36ª e semanais até o parto. Gestações com condições como hipertensão ou diabetes podem precisar de acompanhamento mais frequente.\n\nO acompanhamento não termina no parto: ele continua no pós-parto.',
  },
  {
    key: 'exames-do-pre-natal', title: 'Exames do pré-natal no SUS', category: 'Exames', minutes: 3, weekFrom: 4, weekTo: 41, sourceName: `${MS} · Exames e vacinas`, sourceUrl: EXAMES,
    summary: 'Tipo sanguíneo, urina, testes rápidos e outros exames fazem parte do acompanhamento.',
    body: 'Durante o pré-natal, a equipe solicita exames que ajudam a acompanhar a sua saúde e a do bebê.\n\nEntre eles estão a tipagem sanguínea com fator Rh, exames de urina e testes para sífilis, HIV e hepatites. Os testes rápidos costumam ser oferecidos já na primeira consulta.\n\nAlguns exames são repetidos ao longo da gestação, em especial no terceiro trimestre. Entre a 24ª e a 28ª semana, a equipe pode pedir um exame de glicose para investigar diabetes gestacional.\n\nGuarde os resultados e leve a caderneta da gestante em todas as consultas.',
  },
  {
    key: 'vacinas-na-gestacao', title: 'Vacinas na gestação', category: 'Vacinas', minutes: 3, weekFrom: 4, weekTo: 41, sourceName: `${MS} · Calendário de vacinação`, sourceUrl: CALENDARIO,
    summary: 'dTpa a partir da 20ª semana, gripe em qualquer fase e outras vacinas conforme o histórico.',
    body: 'Algumas vacinas protegem você e o bebê nos primeiros meses de vida.\n\nA vacina dTpa, que protege contra difteria, tétano e coqueluche, é indicada em cada gestação a partir da 20ª semana. Se não for aplicada na gravidez, pode ser feita no pós-parto.\n\nA vacina contra a gripe é recomendada para gestantes em qualquer fase da gravidez, durante a campanha. A vacina contra hepatite B é indicada para quem não tem o esquema completo.\n\nLeve seu cartão de vacinação às consultas para a equipe conferir o que está em dia.',
  },
  {
    key: 'caderneta-da-gestante', title: 'Caderneta da Gestante: para que serve', category: 'Pré-natal', minutes: 2, weekFrom: 4, weekTo: 41, sourceName: `${MS} · Caderneta Brasileira da Gestante`, sourceUrl: CADERNETA,
    summary: 'O documento reúne consultas, exames, vacinas e orientações da sua gestação.',
    body: 'A Caderneta da Gestante é entregue no início do pré-natal e acompanha você até o parto.\n\nNela a equipe registra consultas, peso, pressão, exames e vacinas. A caderneta também traz orientações sobre direitos, sinais de alerta, plano de parto, amamentação e cuidados com o bebê.\n\nLeve a caderneta a todas as consultas e também à maternidade no dia do parto. A versão digital está disponível no site do Ministério da Saúde.',
  },
  {
    key: 'testes-rapidos', title: 'Testes rápidos de sífilis, HIV e hepatites', category: 'Exames', minutes: 2, weekFrom: 4, weekTo: 41, sourceName: `${MS} · Combate à sífilis congênita`, sourceUrl: SIFILIS,
    summary: 'São gratuitos e fazem parte do pré-natal, na primeira consulta e no terceiro trimestre.',
    body: 'Os testes rápidos são feitos com uma gota de sangue e ficam prontos em poucos minutos.\n\nNo pré-natal, eles são oferecidos na primeira consulta, repetidos no terceiro trimestre e também no momento do parto.\n\nIdentificar a sífilis e outras infecções cedo permite o tratamento ainda na gestação e protege o bebê. Quando o resultado é reagente, a equipe orienta os próximos passos e o tratamento do parceiro também.',
  },
  {
    key: 'sinais-de-alerta', title: 'Sinais de alerta: quando procurar a maternidade', category: 'Cuidados', minutes: 2, weekFrom: 4, weekTo: 41, sourceName: `${MS} · Caderneta Brasileira da Gestante`, sourceUrl: CADERNETA,
    summary: 'Sangramento, perda de líquido e redução dos movimentos do bebê pedem atendimento.',
    body: 'Alguns sinais pedem atendimento imediato, sem esperar a próxima consulta.\n\nProcure a maternidade se tiver sangramento vaginal, perda de líquido, dor de cabeça forte com visão embaçada, inchaço súbito no rosto e nas mãos, febre, dor forte na barriga, contrações regulares antes de 37 semanas ou redução dos movimentos do bebê.\n\nEm emergência, ligue para o SAMU pelo número 192.',
  },
  {
    key: 'conhecer-a-maternidade', title: 'Direito de conhecer a maternidade e ao acompanhante', category: 'Direitos', minutes: 2, weekFrom: 20, weekTo: 41, sourceName: `${MS} · Pré-natal`, sourceUrl: PRENATAL,
    summary: 'Durante o pré-natal, você pode conhecer a maternidade onde será atendida.',
    body: 'Durante o pré-natal, é direito da gestante conhecer a maternidade de referência, onde será atendida em intercorrências e no parto.\n\nA visita ajuda a planejar o caminho, saber como funciona a entrada e tirar dúvidas com antecedência.\n\nA gestante também tem direito a um acompanhante de sua escolha durante o trabalho de parto, o parto e o pós-parto imediato.',
  },
  {
    key: 'saude-bucal', title: 'Saúde bucal na gravidez', category: 'Cuidados', minutes: 2, weekFrom: 4, weekTo: 41, sourceName: `${MS} · Pré-natal`, sourceUrl: PRENATAL,
    summary: 'Pelo menos uma consulta odontológica faz parte do pré-natal.',
    body: 'As mudanças hormonais da gestação podem deixar a gengiva mais sensível.\n\nO pré-natal inclui pelo menos uma consulta odontológica. Pergunte na sua unidade como agendar.\n\nEscovar os dentes com regularidade e usar fio dental continuam importantes durante toda a gravidez.',
  },
  {
    key: 'movimentos-do-bebe', title: 'Os movimentos do bebê', category: 'Gravidez', minutes: 2, weekFrom: 18, weekTo: 41, sourceName: `${MS} · Caderneta Brasileira da Gestante`, sourceUrl: CADERNETA,
    summary: 'Conhecer o padrão de movimentos ajuda a perceber quando algo muda.',
    body: 'Na primeira gestação, os movimentos costumam ser percebidos entre a 18ª e a 22ª semana.\n\nNo terceiro trimestre, vale conhecer o padrão de movimentos do seu bebê ao longo do dia. O contador de movimentos do app ajuda a registrar.\n\nSe perceber que o bebê está se mexendo menos do que o habitual, procure a maternidade.',
  },
  {
    key: 'pressao-alta', title: 'Pressão alta na gravidez', category: 'Cuidados', minutes: 2, weekFrom: 20, weekTo: 41, sourceName: `${MS} · Caderneta Brasileira da Gestante`, sourceUrl: CADERNETA,
    summary: 'A pressão é medida em todas as consultas por um motivo importante.',
    body: 'A pressão arterial é medida em todas as consultas de pré-natal.\n\nA pressão alta na gestação pode exigir acompanhamento mais próximo. Dor de cabeça forte, visão embaçada e inchaço súbito no rosto e nas mãos são sinais de alerta que pedem atendimento imediato.\n\nSiga as orientações da sua equipe e não deixe de comparecer às consultas.',
  },
  {
    key: 'diabetes-gestacional', title: 'Diabetes gestacional', category: 'Exames', minutes: 2, weekFrom: 20, weekTo: 32, sourceName: `${MS} · Exames e vacinas`, sourceUrl: EXAMES,
    summary: 'Um exame de glicose costuma ser feito entre a 24ª e a 28ª semana.',
    body: 'O diabetes gestacional é uma alteração da glicose que aparece durante a gravidez.\n\nPara investigar, a equipe costuma pedir um exame de glicose no início do pré-natal e outro entre a 24ª e a 28ª semana.\n\nQuando o diagnóstico é feito, a equipe orienta alimentação, atividade física e o acompanhamento necessário.',
  },
  {
    key: 'alimentacao', title: 'Alimentação na gestação', category: 'Alimentação', minutes: 3, weekFrom: 4, weekTo: 41, sourceName: `${MS} · Caderneta Brasileira da Gestante`, sourceUrl: CADERNETA,
    summary: 'Comida de verdade, refeições regulares e água ao longo do dia.',
    body: 'Uma alimentação variada, com base em alimentos naturais e pouco processados, ajuda você e o bebê.\n\nFazer refeições menores e mais frequentes pode aliviar enjoo e azia. Beba água ao longo do dia.\n\nConverse com a equipe sobre suplementos, como ácido fólico e ferro, e sobre qualquer restrição alimentar.',
  },
  {
    key: 'amamentacao-primeiros-passos', title: 'Amamentação: primeiros passos', category: 'Amamentação', minutes: 3, weekFrom: 28, weekTo: 41, sourceName: `${MS} · Aleitamento materno`, sourceUrl: ALEITAMENTO,
    summary: 'Leite materno exclusivo até os 6 meses e continuado até os 2 anos ou mais.',
    body: 'O Ministério da Saúde recomenda que o bebê receba só leite materno nos primeiros seis meses e que a amamentação continue até os dois anos ou mais.\n\nA orientação também desaconselha o uso de mamadeiras e chupetas, que podem atrapalhar a amamentação.\n\nNos primeiros dias, é comum ter dúvidas. Procure apoio da equipe de saúde, de bancos de leite e da sua rede de apoio.',
  },
  {
    key: 'dez-passos-amamentacao', title: 'Os dez passos para o sucesso da amamentação', category: 'Amamentação', minutes: 2, weekFrom: 30, weekTo: 41, sourceName: `${MS} · Notícias`, sourceUrl: DEZ_PASSOS,
    summary: 'Uma iniciativa que orienta maternidades a apoiar a amamentação desde o nascimento.',
    body: 'Os dez passos para o sucesso da amamentação orientam as maternidades a apoiar a mãe desde o nascimento, com ações como o contato pele a pele e o início da amamentação na primeira hora.\n\nHospitais que seguem esses passos podem receber o título de Hospital Amigo da Criança.\n\nNa visita à maternidade, pergunte como ela apoia a amamentação.',
  },
  {
    key: 'pos-parto', title: 'Pós-parto: o cuidado continua', category: 'Pós-parto', minutes: 2, weekFrom: 34, weekTo: 41, sourceName: `${MS} · Saúde materna`, sourceUrl: SAUDE_MATERNA,
    summary: 'O acompanhamento segue depois do nascimento, para você e para o bebê.',
    body: 'O pós-parto, também chamado de puerpério, é um período de muitas mudanças físicas e emocionais.\n\nO acompanhamento pela equipe de saúde continua depois do nascimento, com consultas para você e para o bebê.\n\nTristeza persistente, desânimo ou ansiedade intensa merecem atenção. Fale com a equipe e com sua rede de apoio.',
  },
];

// Capas: ilustrações próprias do Bornly, servidas pelo Worker (server/public/img/artigos). Trocáveis pela administração.
const COVERS = 'https://bornly-api.wt-pedagogia.workers.dev/img/artigos';
for (const a of ARTICLES) {
  // Tempo de leitura pelo tamanho do texto (cerca de 200 palavras por minuto).
  a.minutes = Math.max(1, Math.ceil(a.body.split(/\s+/).length / 200));
  a.image ??= `${COVERS}/${a.key}.jpg?v=2`;
  a.imageCredit ??= 'Ilustração: Bornly';
}

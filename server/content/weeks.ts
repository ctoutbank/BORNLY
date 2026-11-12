// Semanas 4 a 41. Medidas aproximadas; textos sem revisão médica.
type Week = [week: number, size: string, cm: number, grams: number, baby: string, body: string, guide: string];

const PRENATAL_EARLY = 'Se ainda não começou o pré-natal, procure a Unidade Básica de Saúde mais próxima. O ideal é iniciar até a 12ª semana.';
const MONTHLY = 'Até a 28ª semana, as consultas de pré-natal costumam ser mensais. Leve suas dúvidas anotadas.';
const BIWEEKLY = 'Entre a 28ª e a 36ª semana, as consultas costumam ficar quinzenais.';
const WEEKLY = 'Da 36ª semana até o parto, as consultas costumam ser semanais. Tenha à mão a caderneta e os documentos.';

export const WEEKS: Week[] = [
  [4, 'uma semente de papoula', 0.1, 0, 'O embrião acabou de se implantar no útero e começa a formar as estruturas que darão origem à placenta.', 'A menstruação atrasa. Algumas mulheres sentem cansaço, seios mais sensíveis ou leve cólica.', 'Um teste de gravidez positivo é o momento de procurar a Unidade Básica de Saúde. ' + PRENATAL_EARLY],
  [5, 'uma semente de gergelim', 0.2, 0, 'O tubo neural, que dará origem ao cérebro e à medula, começa a se formar.', 'Enjoo, sono e vontade de urinar com mais frequência podem aparecer.', PRENATAL_EARLY + ' Pergunte sobre o ácido fólico.'],
  [6, 'uma lentilha', 0.6, 0, 'O coração primitivo começa a pulsar e surgem os brotos dos braços e das pernas.', 'O enjoo costuma aumentar. Comer pouco e várias vezes ao dia pode ajudar.', PRENATAL_EARLY],
  [7, 'um mirtilo', 1.0, 0, 'O rosto começa a se desenhar e o cérebro cresce rápido.', 'Os seios podem aumentar e ficar mais sensíveis. Sono e cansaço são comuns.', 'Na primeira consulta, a equipe pede exames de sangue e urina e oferece testes rápidos.'],
  [8, 'uma framboesa', 1.6, 1, 'Mãos e pés começam a se formar, e o coração já bate rápido.', 'Enjoo e cansaço costumam ser mais intensos nestas semanas.', 'Os testes rápidos de sífilis, HIV e hepatites são oferecidos no início do pré-natal no SUS.'],
  [9, 'uma azeitona', 2.3, 2, 'Os dedos começam a se separar e os órgãos principais seguem se formando.', 'Mudanças de humor são comuns por causa dos hormônios.', 'Mantenha a caderneta da gestante sempre com você nas consultas.'],
  [10, 'um morango', 3.1, 4, 'O embrião passa a ser chamado de feto. Unhas e articulações começam a aparecer.', 'A cintura pode começar a mudar, mesmo que a barriga ainda não apareça.', 'Converse com a equipe sobre vacinas, alimentação e o que você já sente.'],
  [11, 'um figo', 4.1, 7, 'O bebê já faz pequenos movimentos, que você ainda não sente.', 'Algumas mulheres começam a sentir o enjoo diminuir.', 'Uma consulta odontológica faz parte do pré-natal. Pergunte como agendar na sua unidade.'],
  [12, 'um limão', 5.4, 14, 'Os órgãos principais já estão formados e começam a amadurecer.', 'Para muitas mulheres, o enjoo começa a diminuir.', 'Fim do primeiro trimestre. ' + MONTHLY],
  [13, 'uma vagem de ervilha', 7.4, 23, 'As digitais começam a se formar nas pontas dos dedos.', 'A energia costuma voltar aos poucos.', MONTHLY],
  [14, 'um limão-siciliano', 8.7, 43, 'O bebê começa a fazer expressões faciais.', 'O útero cresce e a barriga pode começar a aparecer.', 'Segundo trimestre. ' + MONTHLY],
  [15, 'uma maçã', 10.1, 70, 'Os ossos ficam mais firmes e o bebê já percebe luz através da pele.', 'O apetite pode aumentar.', MONTHLY],
  [16, 'um abacate', 11.6, 100, 'Faz pequenos movimentos que logo você vai sentir.', 'A barriga começa a aparecer e a energia costuma voltar.', MONTHLY],
  [17, 'uma romã', 13, 140, 'Começa a acumular gordura, que vai ajudar a manter a temperatura depois do nascimento.', 'O centro de gravidade muda; prefira calçados confortáveis.', MONTHLY],
  [18, 'um pimentão', 14.2, 190, 'A audição começa a funcionar.', 'Você pode sentir os primeiros movimentos, como bolhas ou borboletas.', MONTHLY],
  [19, 'uma manga', 15.3, 240, 'Uma camada protetora, o vérnix, cobre a pele do bebê.', 'Dores leves nas laterais da barriga podem aparecer conforme o útero cresce.', MONTHLY],
  [20, 'uma banana', 25.6, 300, 'Já ouve sons de fora e tem períodos de sono e vigília.', 'Metade do caminho. Os primeiros movimentos podem aparecer agora.', 'A partir da 20ª semana, a vacina dTpa é indicada em cada gestação. ' + MONTHLY],
  [21, 'uma cenoura', 26.7, 360, 'Os movimentos ficam mais coordenados.', 'Podem surgir estrias e coceira na pele da barriga. Hidratar ajuda no conforto.', 'Se ainda não tomou a dTpa, pergunte na próxima consulta.'],
  [22, 'um mamão papaia', 27.8, 430, 'Os olhos estão formados, mas as pálpebras seguem fechadas.', 'O umbigo pode ficar mais saliente.', MONTHLY],
  [23, 'uma toranja', 28.9, 500, 'O bebê já percebe seus movimentos e sua voz.', 'Os pés podem inchar no fim do dia. Elevar as pernas alivia.', MONTHLY],
  [24, 'uma espiga de milho', 30, 600, 'Os pulmões começam a formar as ramificações que vão respirar.', 'A barriga ganha volume rápido. Dor nas costas e pés inchados ao fim do dia são comuns.', 'Entre a 24ª e a 28ª semana, a equipe pode pedir o exame de glicose para investigar diabetes gestacional.'],
  [25, 'uma couve-flor', 34.6, 660, 'Começa a responder à sua voz e aos sons do ambiente.', 'O sono pode ficar mais leve. Uma almofada entre os joelhos costuma ajudar.', MONTHLY],
  [26, 'um pé de alface', 35.6, 760, 'Os olhos começam a se abrir e já reagem à luz.', 'Azia e falta de ar leve aparecem conforme o útero sobe.', MONTHLY],
  [27, 'uma couve', 36.6, 875, 'Já dorme e acorda em ciclos, e pode até soluçar.', 'Cãibras nas pernas à noite são frequentes. Alongar antes de dormir ajuda.', 'Fim do segundo trimestre. Pergunte sobre os exames do terceiro trimestre.'],
  [28, 'uma berinjela', 37.6, 1000, 'Os olhos abrem e fecham, e o cérebro forma os primeiros sulcos. Começa a sonhar.', 'Último trimestre. A barriga cresce mais rápido; falta de ar, azia e cansaço são esperados.', BIWEEKLY + ' Comece a observar o padrão de movimentos do bebê.'],
  [29, 'uma abóbora pequena', 38.6, 1150, 'Ganha gordura e já regula melhor a própria temperatura.', 'Você pode sentir mais fome. Refeições menores e mais frequentes aliviam a azia.', BIWEEKLY],
  [30, 'um repolho', 39.9, 1300, 'Os movimentos ficam mais fortes, com menos espaço para virar.', 'Contrações de treino podem aparecer. Irregulares e sem dor são esperadas.', BIWEEKLY + ' No terceiro trimestre, os testes de sífilis e HIV costumam ser repetidos.'],
  [31, 'um coco', 41.1, 1500, 'Os cinco sentidos já funcionam e o bebê vira a cabeça em direção à luz.', 'Vontade de urinar mais vezes e sono interrompido são comuns nesta fase.', BIWEEKLY],
  [32, 'um abacaxi', 42.4, 1700, 'Pratica respirar, sugar e engolir. A pele fica mais lisa.', 'A barriga pode pesar na lombar. Alterne descanso e caminhadas curtas.', BIWEEKLY + ' Bom momento para visitar a maternidade de referência.'],
  [33, 'um melão pequeno', 43.7, 1900, 'Os ossos endurecem, mas os do crânio continuam flexíveis para o parto.', 'Inchaço nos pés e tornozelos aumenta. Inchaço súbito no rosto e nas mãos é sinal de alerta.', BIWEEKLY],
  [34, 'um melão', 45, 2100, 'Os pulmões estão quase prontos e o bebê ganha peso rápido.', 'Cansaço e pressão na pelve aumentam. Descansar de lado ajuda.', BIWEEKLY + ' Deixe a mala da maternidade encaminhada.'],
  [35, 'um mamão formosa', 46.2, 2400, 'O espaço fica apertado e os movimentos mudam, mas continuam presentes.', 'Respirar pode ficar mais difícil até a barriga descer.', BIWEEKLY],
  [36, 'um mamão grande', 47.4, 2600, 'Começa a se posicionar para o nascimento, em geral de cabeça para baixo.', 'Você pode sentir a barriga baixar e respirar um pouco melhor.', WEEKLY],
  [37, 'uma abóbora-moranga', 48.6, 2900, 'O bebê é considerado a termo a partir desta semana.', 'Contrações de treino podem ficar mais frequentes.', WEEKLY + ' Combine com a equipe quando ir para a maternidade.'],
  [38, 'uma abóbora', 49.8, 3100, 'Está pronto para nascer e segue ganhando gordura.', 'Contrações mais regulares podem começar. Siga o plano combinado com sua equipe.', WEEKLY],
  [39, 'uma melancia pequena', 50.7, 3300, 'Os órgãos estão maduros; o bebê segue crescendo devagar.', 'Ansiedade é comum nesta reta final. Descanse quando puder.', WEEKLY],
  [40, 'uma melancia pequena', 51.2, 3400, 'Chegou a data provável. Cada bebê tem seu tempo.', 'Mantenha contato com sua equipe e observe os movimentos do bebê.', 'Depois da data provável, a equipe acompanha de perto o bem-estar seu e do bebê.'],
  [41, 'uma melancia', 51.7, 3600, 'O bebê continua sendo acompanhado até o nascimento.', 'É comum ficar ansiosa. Siga as orientações da equipe sobre os próximos passos.', 'Com 41 semanas, a equipe costuma avaliar a melhor conduta. Não deixe de comparecer às consultas.'],
];

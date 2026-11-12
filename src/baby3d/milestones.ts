// Marcos por parte do corpo. Semanas aproximadas: precisam de revisão obstétrica antes de produção.

export type PartId = 'eyes' | 'ears' | 'hands' | 'feet' | 'cord' | 'brain' | 'heart' | 'lungs' | 'liver' | 'spine';

type Stage = { from: number; title: string; text: string };

export const PARTS: Record<PartId, { label: string; inner: boolean; stages: Stage[] }> = {
  eyes: {
    label: 'Olhos',
    inner: false,
    stages: [
      { from: 6, title: 'Os olhos começam a se formar', text: 'Aparecem como pequenas manchas nas laterais da cabeça e, aos poucos, migram para a frente do rosto.' },
      { from: 10, title: 'Pálpebras fechadas', text: 'As pálpebras cobrem os olhos e permanecem fechadas por várias semanas enquanto eles amadurecem.' },
      { from: 27, title: 'Olhos que abrem e fecham', text: 'As pálpebras já se abrem, e os olhos começam a reagir à luz.' },
    ],
  },
  ears: {
    label: 'Orelhas',
    inner: false,
    stages: [
      { from: 8, title: 'As orelhas tomam forma', text: 'A parte externa da orelha vai se desenhando nas laterais da cabeça.' },
      { from: 18, title: 'Os primeiros sons', text: 'A audição começa a funcionar. Seu coração e sua voz podem ser alguns dos primeiros sons.' },
      { from: 25, title: 'Resposta à sua voz', text: 'O bebê pode responder a sons do ambiente, e sua voz vai ficando familiar.' },
    ],
  },
  hands: {
    label: 'Mãos',
    inner: false,
    stages: [
      { from: 6, title: 'Brotos dos braços', text: 'Os braços começam como pequenos brotos que vão se alongando.' },
      { from: 10, title: 'Dedos separados', text: 'Os dedos das mãos já estão separados e o bebê começa a fazer pequenos movimentos.' },
      { from: 12, title: 'As unhas começam a se formar', text: 'As unhas das mãos dão os primeiros sinais, e as mãos ficam mais ativas.' },
      { from: 18, title: 'Impressões digitais', text: 'Os desenhos únicos da ponta dos dedos já estão se definindo.' },
    ],
  },
  feet: {
    label: 'Pés',
    inner: false,
    stages: [
      { from: 7, title: 'Brotos das pernas', text: 'As pernas começam como brotos, um pouco depois dos braços.' },
      { from: 11, title: 'Dedos dos pés', text: 'Os dedos dos pés já estão separados.' },
      { from: 20, title: 'Chutes que você pode sentir', text: 'As pernas ganham força, e os movimentos costumam ficar perceptíveis nesta fase.' },
    ],
  },
  cord: {
    label: 'Cordão umbilical',
    inner: false,
    stages: [
      { from: 7, title: 'Cordão umbilical', text: 'Liga o bebê à placenta, levando oxigênio e nutrientes e retirando o que não é mais necessário.' },
    ],
  },
  brain: {
    label: 'Cérebro',
    inner: true,
    stages: [
      { from: 5, title: 'Início do sistema nervoso', text: 'O tubo neural se forma e dá origem ao cérebro e à medula.' },
      { from: 12, title: 'Cérebro em crescimento', text: 'O cérebro cresce rápido e já envia sinais para pequenos movimentos.' },
      { from: 28, title: 'Primeiros sulcos', text: 'A superfície do cérebro forma os primeiros sulcos, e os ciclos de sono ficam mais definidos.' },
    ],
  },
  heart: {
    label: 'Coração',
    inner: true,
    stages: [
      { from: 5, title: 'O coração começa a bater', text: 'Ainda é uma estrutura simples, mas o coração já começa a pulsar nestas semanas.' },
      { from: 10, title: 'Quatro câmaras', text: 'O coração já tem as quatro câmaras e bate bem mais rápido que o de um adulto.' },
      { from: 20, title: 'Batimentos fortes', text: 'Os batimentos costumam ser ouvidos com facilidade nas consultas de pré-natal.' },
    ],
  },
  lungs: {
    label: 'Pulmões',
    inner: true,
    stages: [
      { from: 8, title: 'Pulmões em formação', text: 'Os pulmões começam como pequenos brotos que vão se ramificando.' },
      { from: 24, title: 'Ramificações', text: 'Os pulmões formam as ramificações que vão respirar depois do nascimento.' },
      { from: 34, title: 'Quase prontos', text: 'Os pulmões estão quase maduros, e o bebê pratica movimentos de respiração.' },
    ],
  },
  liver: {
    label: 'Fígado',
    inner: true,
    stages: [
      { from: 8, title: 'Fígado em atividade', text: 'O fígado é um dos órgãos maiores nesta fase e ajuda a produzir células do sangue.' },
    ],
  },
  spine: {
    label: 'Coluna',
    inner: true,
    stages: [
      { from: 6, title: 'Coluna em formação', text: 'As vértebras começam a se organizar ao redor da medula.' },
      { from: 16, title: 'Ossos mais firmes', text: 'O esqueleto, antes macio, vai ficando mais firme ao longo das semanas.' },
    ],
  },
};

export function milestoneFor(part: PartId, week: number) {
  const stages = PARTS[part].stages.filter((s) => s.from <= week);
  return stages[stages.length - 1] ?? null;
}

export function visibleParts(week: number, inner: boolean) {
  return (Object.keys(PARTS) as PartId[]).filter((p) => PARTS[p].inner === inner && milestoneFor(p, week));
}

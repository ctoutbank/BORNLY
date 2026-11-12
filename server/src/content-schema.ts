// Coleções de conteúdo que a administração edita. `fields` define o formulário de cada item.

export type FieldType = 'text' | 'textarea' | 'number' | 'url' | 'list' | 'select';
export type Field = { name: string; label: string; type: FieldType; required?: boolean; options?: string[] };
export type Collection = { id: string; label: string; description: string; keyLabel: string; fields: Field[] };

export const COLLECTIONS: Collection[] = [
  {
    id: 'weeks', label: 'Semanas da gestação', description: 'Tamanho, desenvolvimento do bebê, mudanças no corpo e orientação de cada semana (4 a 41).', keyLabel: 'Semana',
    fields: [
      { name: 'size', label: 'Do tamanho de', type: 'text', required: true },
      { name: 'cm', label: 'Comprimento (cm)', type: 'number', required: true },
      { name: 'grams', label: 'Peso (g)', type: 'number', required: true },
      { name: 'baby', label: 'Como o bebê está crescendo', type: 'textarea', required: true },
      { name: 'body', label: 'O que muda no corpo', type: 'textarea', required: true },
      { name: 'guide', label: 'Orientação da semana', type: 'textarea', required: true },
    ],
  },
  {
    id: 'daily_messages', label: 'Mensagens do dia', description: 'Uma mensagem para cada dia da gestação (dia 1 a 294). Aparece na tela Hoje.', keyLabel: 'Dia',
    fields: [{ name: 'text', label: 'Mensagem', type: 'textarea', required: true }],
  },
  {
    id: 'articles', label: 'Artigos', description: 'Conteúdos da aba Aprender. Texto próprio com link para a fonte oficial.', keyLabel: 'Identificador',
    fields: [
      { name: 'title', label: 'Título', type: 'text', required: true },
      { name: 'category', label: 'Categoria', type: 'text', required: true },
      { name: 'summary', label: 'Resumo (cartão)', type: 'textarea', required: true },
      { name: 'body', label: 'Texto (parágrafos separados por linha em branco)', type: 'textarea', required: true },
      { name: 'minutes', label: 'Minutos de leitura', type: 'number' },
      { name: 'weekFrom', label: 'Mostrar a partir da semana', type: 'number' },
      { name: 'weekTo', label: 'Mostrar até a semana', type: 'number' },
      { name: 'image', label: 'Imagem (endereço)', type: 'url' },
      { name: 'imageCredit', label: 'Crédito da imagem', type: 'text' },
      { name: 'sourceName', label: 'Fonte', type: 'text' },
      { name: 'sourceUrl', label: 'Link da fonte', type: 'url' },
    ],
  },
  {
    id: 'faq', label: 'Guia de dúvidas', description: 'Perguntas e respostas curtas.', keyLabel: 'Identificador',
    fields: [
      { name: 'question', label: 'Pergunta', type: 'text', required: true },
      { name: 'answer', label: 'Resposta', type: 'textarea', required: true },
      { name: 'source', label: 'Fonte', type: 'text' },
      { name: 'sourceUrl', label: 'Link da fonte', type: 'url' },
    ],
  },
  {
    id: 'alerts', label: 'Sinais de alerta', description: 'Lista exibida na tela de sintomas.', keyLabel: 'Identificador',
    fields: [{ name: 'text', label: 'Sinal', type: 'text', required: true }],
  },
  {
    id: 'checklists', label: 'Listas (enxoval, mala, nascimento)', description: 'Cada item é um grupo: em qual lista aparece, nome do grupo e itens.', keyLabel: 'Identificador',
    fields: [
      { name: 'list', label: 'Lista', type: 'select', options: ['enxoval', 'mala', 'nascimento'], required: true },
      { name: 'group', label: 'Grupo', type: 'text', required: true },
      { name: 'range', label: 'Período (só nascimento)', type: 'text' },
      { name: 'items', label: 'Itens (um por linha)', type: 'list', required: true },
    ],
  },
  {
    id: 'birth_plan', label: 'Plano de parto', description: 'Tópicos e opções do plano de parto.', keyLabel: 'Identificador',
    fields: [
      { name: 'topic', label: 'Tópico', type: 'text', required: true },
      { name: 'options', label: 'Opções (uma por linha)', type: 'list', required: true },
    ],
  },
  {
    id: 'tools', label: 'Textos das ferramentas', description: 'Orientações do contador de movimentos e do cronômetro de contrações.', keyLabel: 'Identificador',
    fields: [
      { name: 'title', label: 'Título', type: 'text', required: true },
      { name: 'text', label: 'Texto', type: 'textarea', required: true },
    ],
  },
];

export const COLLECTION_IDS = new Set(COLLECTIONS.map((c) => c.id));

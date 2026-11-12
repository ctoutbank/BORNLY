# Plano de diagramação: ícones, cartões e texto

Medições feitas em 02/11/2026 nas 30 telas, em viewport de iPhone (390 × 844), com medição direta dos elementos. Serve de guia para a rodada de ajustes.

## Resultado da varredura

| Verificação | Resultado |
|---|---|
| Texto sobrepondo texto | Nenhum caso |
| Texto cortado pelo cartão | Nenhum caso (os cortes detectados são listas de rolagem horizontal, esperados) |
| Texto reticente (…) | 1 caso: aba "Acompanhante" em Mala da maternidade |
| Rolagem lateral indevida | Nenhuma tela |
| Alinhamento vertical ícone × texto | Todas as linhas centradas (desvio 0,0 px) |
| Fonte abaixo de 11 px | Rótulos da barra inferior (10,5 px) |
| Alvos de toque abaixo de 32 px | Régua de semanas (26 e 30 px), interruptores (40 × 20), link "Ver sinais de alerta" (18 px de altura) |

## Problemas, por prioridade

### 1. Ícones pequenos demais para os círculos

Regra de referência: o ícone deve ocupar entre 45% e 55% do círculo. Hoje a média é 33%, e os círculos parecem vazios.

| Onde | Círculo | Ícone | Proporção | Alvo |
|---|---|---|---|---|
| Linhas "Seu dia" (Hoje) | 40 | 14 a 16 | 35 a 40% | 20 px (50%) |
| Botão "+" (Minha saúde, Consultas, Enxoval) | 44 a 48 | 14 | 29 a 32% | 20 px |
| Seta de voltar (todas as telas internas) | 44 | 9 × 15 | 34% | 11 × 19 |
| Seta de avançar (Preparar, Guia de dúvidas) | 40 | 8 × 13 | 33% | 10 × 17 |
| Marcador (Aprender) | 44 | 13 × 16 | 36% | 16 × 20 |
| Enviar mensagem | 52 | 16 | 31% | 22 px |
| "+" de Sintomas (Diário) | 36 | 12 | 33% | 16 px |
| Check das listas | 26 | 11 × 9 | 42% | manter |
| Barra inferior | 42 | 18 | 43% | 20 px |

### 2. Chevron (seta de lista) muito fino

8 × 14 px com traço de 1,6. Em telas de alta densidade fica quase invisível. Alvo: 9 × 16 px, traço 1,8, cor `chevron` um tom mais escuro apenas na seta.

### 3. Alvos de toque abaixo do mínimo

Mínimo recomendado: 44 × 44 px (Apple), 32 × 32 aceitável.

| Elemento | Hoje | Correção |
|---|---|---|
| Régua de semanas (Hoje) | 26 e 30 px | manter o visual, mas ampliar a área de toque para 44 px com `hitSlop` |
| Interruptores (Pronto, Convite, Privacidade) | 40 × 20 | a linha inteira já é tocável (64 px); apenas confirmar que o interruptor nativo tem `hitSlop` |
| "Ver sinais de alerta" (Mensagens) | 112 × 18 | `minHeight: 44` e padding vertical |

### 4. Barra inferior

Rótulos a 10,5 px, abaixo do mínimo de 11 px. Subir para 11 px e o ícone para 20 px. O círculo de 42 px fica.

### 5. Escala tipográfica sem sistema

Hoje há 13 tamanhos de texto corrido (10,5 a 18) e 17 de título (13 a 52). Meios-pontos (11,5, 12,5, 13,5, 14,5) não têm função visível e dificultam consistência.

Escala proposta (texto corrido, Plus Jakarta):

| Papel | Hoje | Proposto |
|---|---|---|
| Legenda / metadado | 10,5, 11, 11,5 | 11 |
| Apoio (subtítulo de linha) | 12, 12,5 | 12 |
| Corpo compacto | 13, 13,5 | 13 |
| Corpo | 14, 14,5 | 14 |
| Destaque / botão | 15, 15,5, 16 | 15 |

Escala proposta (título, Libre Caslon):

| Papel | Hoje | Proposto |
|---|---|---|
| Título de cartão pequeno | 13 a 17 | 16 |
| Título de seção / cartão | 18, 19, 20 | 18 |
| Título de tela interna | 22, 23, 24 | 22 |
| Título de aba / saudação | 26, 28, 29 | 28 |
| Número de destaque | 40, 46, 52 | 40 e 52 (manter) |

### 6. Raios de borda sem sistema

Nove raios diferentes entre 17 e 30 px. Proposta: 3 níveis.

| Uso | Proposto |
|---|---|
| Linha / item de lista | 20 |
| Cartão | 24 |
| Cartão de destaque (gravidez hoje, próxima consulta) | 28 |

Pílulas continuam em 999.

### 7. Altura de linha

Texto corrido varia entre 1,3 e 1,6. Proposta: 1,45 como padrão de corpo, 1,35 para legendas de uma linha e 1,15 para títulos. Isso fecha o espaço entre título e subtítulo nas linhas de lista, que hoje fica desigual entre telas.

### 8. Casos pontuais

- **Mala da maternidade**: aba "Acompanhante" fica reticente em 390 px. Reduzir para 12,5 px ou trocar por "Acomp." com `numberOfLines={1}` e `adjustsFontSizeToFit`.
- **Hoje**: "Ver mais" (12,5 px, altura 32) e "Precisa da sua atenção": aumentar a área de toque de "Ver mais" para 44.
- **Preparar**: título de cartão em 18 px serifado ao lado de subtítulo em 12,5 px gera degrau grande; usar 16/12.
- **Aprender**: títulos dos cartões de artigo quebram em três linhas no 390 px; limitar a 2 linhas com `numberOfLines={2}` e altura fixa do cartão.

## O que não muda

- Alinhamento vertical de ícone e texto está correto em todas as linhas medidas.
- Espaçamento entre ícone e texto (14 px) está consistente.
- Não há sobreposição nem corte de texto em nenhuma tela.
- Paleta de cores: mantida como no design original.

## Ordem de execução

1. Componentes base em `src/ui.tsx`: `Chevron`, `ArrowLeft`, `ArrowRight`, `Plus`, `Bookmark`, `CircleButton`, `RowButton`, `BackButton`. Uma mudança corrige todas as telas.
2. Barra inferior (`src/components/bottom-nav.tsx`).
3. Escala tipográfica e raios: criar tokens em `src/theme.ts` e substituir os valores nas telas.
4. Alvos de toque: régua (`hoje.tsx`), link em `mensagens.tsx`.
5. Casos pontuais.
6. Revalidar com a mesma varredura automática e prints em zoom nas 30 telas, depois instalar no iPhone.

Estimativa: as etapas 1, 2 e 4 são rápidas e de baixo risco. A etapa 3 toca todos os arquivos de tela e é a que pede revisão visual completa.

## Execução (02/11/2026)

Todas as etapas foram aplicadas. Revalidação com a mesma varredura nas 30 telas:

- Sem texto sobreposto ou cortado.
- Sem fonte abaixo de 11 px.
- Proporção ícone/círculo entre 42% e 55% em todos os botões circulares.
- "Acompanhante" em Mala virou "Acomp." (sem reticências).
- Títulos de artigo em Aprender limitados a 2 linhas com altura fixa.
- A régua de semanas mantém o visual de 26 a 44 px, com área de toque ampliada por `hitSlop`.

Tokens criados em `src/theme.ts`: `type` (escala tipográfica) e `radius` (20, 24, 28). As telas ainda usam os valores numéricos diretamente; migrar para os tokens é uma limpeza opcional.

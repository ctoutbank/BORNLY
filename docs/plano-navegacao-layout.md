# Plano: navegação e refinamento de layout

Levantamento feito em 12/11/2026 lendo as telas de entrada, cadastro e conta, e a partir dos testes de fluxo da revisão anterior. Nada foi alterado ainda.

## Mapa atual

```
Abertura nativa (círculos, pêssego)
  → Abertura animada do app (index): espera fixa de 2,8 s
    → com sessão: Hoje
    → sem sessão: Tela de início
        ├─ Começar → Momento (1) → Data (2) → Sobre você (3) → Pronto (4) → Criar conta (4) → Hoje
        └─ Já tenho uma conta → Entrar → Hoje
                                   └─ Esqueci minha senha → Recuperar
```

## Problemas de navegação

| # | Onde | Problema | Gravidade |
|---|---|---|---|
| N1 | Criar conta | E-mail já cadastrado mostra "Tente entrar", mas não há botão. A pessoa volta cinco telas. | Alta (o caso relatado) |
| N2 | Criar conta | Não existe "Já tenho uma conta" em nenhuma tela do cadastro, só na tela de início. | Alta |
| N3 | Entrar | Não existe "Criar conta". Quem caiu no login por engano precisa voltar. | Média |
| N4 | Abertura animada | Toda abertura do app espera 2,8 s, mesmo com a sessão já carregada. | Média |
| N5 | Abertura animada | Usa outro símbolo, outro fundo e outro slogan ("Cuidado em cada semana") que a abertura nativa nova. Na prática, a usuária vê duas aberturas diferentes seguidas. | Média |
| N6 | Cadastro | "Pronto" e "Criar conta" mostram a mesma etapa (4 de 4). São 5 telas com 4 marcadores. | Baixa |
| N7 | Recuperar senha | Depois de enviar o link, não volta para Entrar com o e-mail preenchido. | Baixa |
| N8 | Conta | Só se chega pela inicial no canto de Hoje. Pouco visível. | Baixa |

## Proposta de navegação

1. **E-mail já cadastrado (N1):**
   - O aviso ganha o botão "Entrar com este e-mail", que abre Entrar com o e-mail preenchido.
   - Depois de entrar:
     - se a conta já tem perfil, vai para Hoje;
     - se não tem, aproveita as respostas que ela acabou de dar no cadastro, sem perguntar de novo.
2. **Saídas cruzadas (N2, N3):** "Já tenho uma conta" no rodapé de todas as telas do cadastro, e "Criar conta" em Entrar.
3. **Uma abertura só (N4, N5):**
   - A abertura animada passa a usar o mesmo símbolo, fundo e nome da abertura nativa (opção 2), como continuação dela, e não como uma segunda tela.
   - A espera fixa sai: ela segue assim que souber se há sessão, com no máximo 1 s de animação.
4. **Etapas (N6):** cinco marcadores, ou "Pronto" e "Criar conta" juntos numa tela só.
   - Recomendação: juntar. A autorização de dados e o lembrete ficam acima dos campos de e-mail e senha.
   - Assim o cadastro cai de 5 para 4 telas.
5. **Recuperar senha (N7):** depois do envio, um botão "Voltar para entrar", com o e-mail preenchido.
6. **Conta (N8):**
   - Um item "Conta e privacidade" no fim de Minha saúde.
   - A inicial no canto de Hoje continua.

## Refinamentos de layout (para confirmar com prints antes de executar)

| # | Tela | Ponto | Proposta |
|---|---|---|---|
| L1 | Hoje | O cartão do bebê usa uma ilustração genérica igual em todas as semanas. | Ilustração no traço das capas: a fruta ou objeto da semana, ou o desenho do bebê em 3 ou 4 fases. |
| L2 | Hoje | "Seu dia" tem cinco linhas seguidas e a tela fica longa. | Humor e próxima consulta continuam em linhas. Orientação, movimentos e contrações viram três blocos quadrados lado a lado. |
| L3 | Contrações e outras telas | Títulos longos quebram em duas linhas no cabeçalho ("Cronômetro de contrações"). | Encurtar para "Contrações" e "Movimentos", ou deixar o título em 20 pt quando passar do limite. |
| L4 | Preparar e Semana | Faixa grande de 180 px com ilustração genérica. | Preparar: um anel de progresso com "x% pronto". Semana: a capa do artigo da semana. |
| L5 | Cadastro | Telas com muito espaço vazio entre o conteúdo e o botão. | Botão sempre na mesma altura e conteúdo alinhado ao topo, igual em todas as etapas. |
| L6 | Geral | Os tokens de tipografia e raio existem em `src/theme.ts`, mas as telas usam números soltos. | Trocar pelos tokens enquanto mexemos em cada tela, sem rodada separada. |

## Ordem sugerida

1. **N1, N2, N3 e N7** (fluxo de entrada e conta): rápido, resolve o problema relatado.
2. **N4 e N5** (abertura única e sem espera).
3. **N6** (juntar Pronto e Criar conta).
4. **Layout:** primeiro uma rodada de prints das telas citadas para você aprovar L1 a L5; depois a execução.
5. **Teste completo:** cadastro novo, e-mail repetido, login, recuperar senha e abertura com e sem sessão. Depois, instalar no iPhone.

## O que não muda

- As rotas e a barra de abas.
- O visual aprovado da tela de início (linha do tempo) e da abertura (opção 2).
- O conteúdo editável pela administração.

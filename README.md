# Minhas Séries

App mobile para organizar as séries que eu assisto. Dá para cadastrar uma série (título, plataforma, temporadas e nota de 1 a 5 estrelas), editar, excluir, marcar como concluída e filtrar a lista entre **Todas**, **Assistindo** e **Concluídas**. Os dados ficam salvos no próprio celular com SQLite, então continuam lá depois de fechar o app.

Feito com Expo Router, NativeWind v4, expo-sqlite e TypeScript, usando o padrão Repository (as telas nunca acessam o banco direto, só pelo `serieRepository`).

## Como rodar

```bash
npm install --legacy-peer-deps
npx expo start
```

Depois é só ler o QR code com o Expo Go no celular.

## Estrutura

```
app/
  _layout.tsx      # Stack com as 3 rotas e chamada do runMigrations
  index.tsx        # lista com filtro
  form.tsx         # cadastro (/form) e edição (/form?id=3)
  detalhe.tsx      # detalhe com concluir, editar e excluir
src/
  types/serie.ts               # Serie, CreateSerieInput, UpdateSerieInput, SerieFilter
  database/database.ts         # conexão singleton, WAL e criação da tabela
  database/serieRepository.ts  # as 6 funções de acesso ao banco
```

## Teste de persistência (Etapa 8)

Passos que eu fiz:

1. Cadastrei 3 séries.
2. Marquei uma como concluída.
3. Editei outra.
4. Fechei o app completamente (tirei da lista de apps abertos) e abri de novo.
5. As 3 séries continuavam lá, com a concluída e a edição salvas, e o filtro funcionando.

<!-- Coloque aqui o vídeo ou os prints. Exemplo com prints na pasta docs/: -->

| Antes de fechar | Depois de reabrir | Filtro "Concluídas" |
| --- | --- | --- |
| ![antes](fotos/antes.jpg) | ![depois](fotos/depois.jpg) | ![filtro](fotos/filtro.jpg) |

<!-- Ou um link para o vídeo: [Vídeo do teste](link-do-video) -->

## Diário do copiloto

Usei o Claude como copiloto. Em vez de pedir o código pronto, eu pedia exemplos com outra entidade (um app de livros), tomava alguns elementos como base e adaptava para o que eu queria no meu app. Quando ficava com alguma dúvida ou aparecia um erro, mandava meu código para o Claude revisar.

### Registro 1 — Etapa 2
**O que eu pedi:** como escrever os tipos do `src/types/serie.ts`.
**O que a IA sugeriu (resumo):** um exemplo com `Livro`, `CreateLivroInput` (usando `Omit`) e `LivroFilter` (union de strings). Na revisão do meu código, apontou que `'nota-crescente' | 'nota-decrescente'` não deviam estar no `SerieFilter`, porque isso é ordenação e não filtro, e que faltava tirar `concluida` do `Omit` do `CreateSerieInput`.
**O que eu fiz:** aceitei a correção. O filtro escolhe quais séries aparecem e a ordenação escolhe em que ordem, então deixei só `'todas' | 'assistindo' | 'concluidas'`, como pede o enunciado.

### Registro 2 — Etapa 3
**O que eu pedi:** um exemplo de `database.ts` com conexão singleton e criação da tabela.
**O que a IA sugeriu (resumo):** um `database.ts` de uma biblioteca de livros, com `getDatabase` (singleton com `openDatabaseAsync`) e `runMigrations` (`PRAGMA journal_mode = WAL` e `CREATE TABLE IF NOT EXISTS livros` com 5 colunas).
**O que eu fiz:** adaptei. O exemplo não era o resultado final: tive que montar sozinho as 7 colunas que o enunciado pede (`titulo`, `plataforma`, `temporadas`, `nota`, `concluida`, `createdAt`), escolher `TEXT` ou `INTEGER` olhando meus tipos e deixar só a `nota` sem `NOT NULL`, porque ela pode ser `null`.

### Registro 3 — Etapa 3 (sugestão rejeitada)
**O que eu pedi:** ajuda com um `npm error ERESOLVE` (conflito entre `react-dom@19.3.0` e `react@19.2.3`) ao instalar o `expo-sqlite`.
**O que a IA sugeriu (resumo):** rodar `npx expo install --fix` para "alinhar" as versões, ou fixar o `react-dom` em `19.2.3` no `package.json`.
**O que eu fiz:** rejeitei, porque isso mudava versões do projeto, que é um dos erros que o professor avisou que a IA comete. Usei o mesmo recurso da aula: `npx expo install expo-sqlite -- --legacy-peer-deps`. O `react-dom` só é usado na versão web, que o app não usa.

### Registro 4 — Etapa 4
**O que eu pedi:** um exemplo de repositório para adaptar.
**O que a IA sugeriu (resumo):** um `livroRepository.ts` com só 3 funções (`getLivros` com filtro no `WHERE`, `createLivro` com `lastInsertRowId` e `deleteLivro`).
**O que eu fiz:** adaptei. As outras 3 funções que o enunciado pede (`getSerieById`, `updateSerie` e `toggleSerieConcluida`) eu escrevi sozinho. Na revisão, troquei `getAllAsync` por `getFirstAsync` no `getSerieById`, porque ele devolve uma série só ou `null`, e tipei o `updateSerie(id: number, input: CreateSerieInput)`, porque o formulário sempre manda todos os campos. Todas as queries usam `?`.

### Registro 5 — Etapa 5 (Parte 3: `useFocusEffect`)
**O que eu pedi:** por que a lista não atualizava com `useEffect(() => { carregar(); }, [])` e como usar o `useFocusEffect`.
**O que a IA sugeriu (resumo):** o `useEffect` com `[]` roda só quando a tela é montada. Quando vou da lista para o formulário, a lista continua montada por baixo na pilha do `Stack`, então ao voltar ela não roda de novo. O `useFocusEffect` roda toda vez que a tela ganha foco. O `useCallback` evita que a função seja recriada a cada render; com `[filtro]` nas dependências, ela só muda quando o filtro muda.
**O que eu fiz:** aceitei. Usei `useFocusEffect(useCallback(..., [filtro]))` na lista e também na tela de detalhe, para ela atualizar quando eu volto da edição.

### Registro 6 — Etapa 6 (sugestão rejeitada)
**O que eu pedi:** por que dava `unmatched route` quando eu tocava numa série da lista, se o formulário de cadastro já funcionava.
**O que a IA sugeriu (resumo):** o erro vinha do card da lista, que abria `/detalhe?id=...`, e o `app/detalhe.tsx` ainda não existia. Para testar a edição, sugeriu trocar o `onPress` do card para ir direto ao formulário (`/form?id=${item.id}`) e desfazer depois.
**O que eu fiz:** rejeitei a gambiarra. Ela pulava a tela de detalhe, que é onde ficam concluir, editar e excluir, e eu ainda corria o risco de esquecer de desfazer e entregar o fluxo errado. Fiz o commit da Etapa 6 e criei logo o `detalhe.tsx`, deixando o fluxo como o enunciado pede: lista → detalhe → Editar → `/form?id=3`.

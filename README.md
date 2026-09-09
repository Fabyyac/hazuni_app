# Hazuni App

O **Hazuni App** é um aplicativo moderno e simples criado para reunir pequenas ferramentas úteis do dia a dia em um único espaço.

A tela principal, chamada **Meu Espaço**, organiza os recursos em cartões intuitivos para que o usuário encontre rapidamente o que precisa.

No primeiro acesso, o usuário informa seu nome para personalizar o espaço. Essa identificação fica salva apenas no navegador atual. O avatar no canto superior permite sair e voltar à tela inicial de identificação.

## Recursos

- **Agenda**: organização de compromissos.
- **Alarmes**: lembretes para atividades importantes.
- **Calculadoras**: cálculos rápidos para o dia a dia.
- **Contas**: controle de orçamentos e gastos.
- **Pesquisar**: acesso rápido à pesquisa na internet.
- **Fotos**: organização de momentos e imagens.
- **Anotações**: registro de ideias e informações.
- **Arquivos**: centralização de arquivos importantes.

## Navegação

O aplicativo possui uma barra inferior para facilitar o acesso às principais áreas:

- Início
- Pesquisar
- Adicionar
- Favoritos
- Configurações

O botão **Adicionar** permite iniciar rapidamente uma nova anotação, compromisso, orçamento ou tarefa.

## Interface

O Hazuni App foi pensado para oferecer:

- Visual limpo e profissional.
- Navegação simples e rápida.
- Layout responsivo para celulares e telas maiores.
- Cartões organizados para acesso rápido.
- Estrutura modular para adicionar novas ferramentas no futuro.
- Estados de navegação para abrir cada ferramenta dentro do aplicativo.
- Tela de primeiro acesso com personalização do nome.
- Formulários para adicionar compromissos, alarmes, cálculos, contas, fotos, arquivos e anotações.
- Dados persistidos no aparelho com armazenamento local.
- Exclusão de itens salvos e contadores por ferramenta.
- Pesquisa na internet e criação rápida pelo botão Adicionar.

## Tecnologias

- HTML
- CSS
- TypeScript
- Vite

## Como executar o projeto

### Pré-requisitos

- Node.js instalado.
- npm instalado.

### Instalação

Clone o repositório e entre na pasta do projeto:

```bash
git clone https://github.com/SEU_USUARIO/hazuni_app.git
cd hazuni_app
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Depois, abra no navegador o endereço exibido pelo Vite, normalmente:

```text
http://localhost:5173
```

## Build de produção

Para gerar a versão otimizada do aplicativo:

```bash
npm run build
```

Para visualizar o build localmente:

```bash
npm run preview
```

## Estrutura principal

```text
src/
├── main.ts       # Interface, navegação e interações
├── style.css     # Estilos e responsividade
├── tools.ts      # Dados e configuração das ferramentas
└── assets/       # Recursos visuais do projeto
```

## Próximos passos

Algumas evoluções planejadas para o Hazuni App incluem:

- Persistência de notas, tarefas e compromissos.
- Alarmes e notificações reais.
- Calculadoras completas.
- Controle financeiro com histórico de gastos.
- Upload e organização de fotos e arquivos.
- Sistema de favoritos personalizado.
- Preferências do usuário e modo escuro.

## Fotos e pesquisa

As imagens escolhidas em **Fotos** são armazenadas no aparelho, exibidas em uma galeria com miniaturas e abertas em tamanho maior ao tocar sobre elas. A ferramenta **Pesquisar** envia a consulta para o Google em uma nova aba do navegador padrão do aparelho.

## Licença

Este projeto está em desenvolvimento e pode ser utilizado como base para a evolução do Hazuni App.

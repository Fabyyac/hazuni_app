import './style.css'
import { quickActions, tools, type Tool } from './tools'

const app = document.querySelector<HTMLDivElement>('#app')!
let activeTool: Tool | null = null
let activeNav = 'home'

function toolCard(tool: Tool) {
  return `<button class="tool-card" data-tool="${tool.id}" aria-label="Abrir ${tool.label}">
    <span class="tool-icon ${tool.color}">${tool.icon}</span>
    <span class="tool-copy"><strong>${tool.label}</strong><small>${tool.description}</small></span>
    ${tool.badge ? `<span class="tool-badge">${tool.badge}</span>` : ''}
    <span class="card-arrow">↗</span>
  </button>`
}

function render() {
  const isHome = activeNav === 'home' && !activeTool
  app.innerHTML = `<div class="app-shell">
    <header class="topbar">
      <div class="brand-mark"><span>H</span><div><strong>HAZUNI</strong><small>seu espaço, do seu jeito</small></div></div>
      <button class="avatar" aria-label="Abrir perfil">MC</button>
    </header>
    <main class="main-content">
      ${isHome ? homeView() : innerView()}
    </main>
    ${bottomNav()}
    <div id="modal-root"></div>
  </div>`
  bindEvents()
}

function homeView() {
  return `<section class="welcome reveal"><p class="eyebrow">QUARTA-FEIRA, 09 DE SETEMBRO</p><h1>Bom dia, Marina <span>✦</span></h1><p class="subtitle">Tudo o que você precisa, em um só lugar.</p></section>
    <section class="spotlight reveal-delay"><div><span class="spotlight-label">SEU DIA EM FOCO</span><h2>Pequenos passos,<br><em>grandes ideias.</em></h2><p>Tenha mais clareza sobre o que importa hoje.</p><button class="text-button" data-tool="agenda">Ver minha agenda <span>→</span></button></div><div class="sun-art" aria-hidden="true"><i></i><b>✦</b><strong>09</strong></div></section>
    <div class="section-heading"><div><p class="eyebrow">TUDO NO SEU RITMO</p><h2>Meu Espaço</h2></div><button class="view-all" data-nav="favorites">Ver favoritos <span>→</span></button></div>
    <section class="tool-grid">${tools.map(toolCard).join('')}</section>`
}

function innerView() {
  const tool = activeTool ?? tools.find((item) => item.id === activeNav)
  if (tool) return `<button class="back-button" data-nav="home">← Voltar para Meu Espaço</button><section class="inner-hero"><span class="tool-icon ${tool.color}">${tool.icon}</span><p class="eyebrow">FERRAMENTA HAZUNI</p><h1>${tool.label}</h1><p>${tool.description}.</p></section><div class="empty-state"><div>${tool.icon}</div><h2>Seu espaço de ${tool.label.toLowerCase()}</h2><p>Este módulo está pronto para receber seus dados. Comece adicionando algo novo.</p><button class="primary-button" data-add="true">＋ Adicionar agora</button></div>`
  return `<section class="inner-hero"><p class="eyebrow">HAZUNI APP</p><h1>${activeNav === 'search' ? 'Pesquisar' : activeNav === 'favorites' ? 'Favoritos' : 'Configurações'}</h1><p>Um lugar simples para manter tudo sob controle.</p></section><div class="empty-state"><div>✦</div><h2>Estamos preparando este espaço</h2><p>Em breve você encontrará novas possibilidades por aqui.</p></div>`
}

function bottomNav() {
  const items = [['home', '⌂', 'Início'], ['search', '⌕', 'Pesquisar'], ['add', '+', 'Adicionar'], ['favorites', '☆', 'Favoritos'], ['settings', '⚙', 'Configurações']]
  return `<nav class="bottom-nav">${items.map(([id, icon, label]) => `<button class="nav-item ${activeNav === id ? 'active' : ''} ${id === 'add' ? 'add-item' : ''}" data-nav="${id}"><span>${icon}</span><small>${label}</small></button>`).join('')}</nav>`
}

function showAddModal() {
  const root = document.querySelector<HTMLDivElement>('#modal-root')!
  root.innerHTML = `<div class="modal-backdrop" data-close="true"><section class="add-sheet" role="dialog" aria-modal="true"><button class="close-modal" data-close="true">×</button><p class="eyebrow">COMEÇAR ALGO NOVO</p><h2>O que você quer criar?</h2><div class="quick-actions">${quickActions.map((action) => `<button class="quick-action"><span>${action.icon}</span><strong>${action.label}</strong></button>`).join('')}</div></section></div>`
  root.querySelectorAll('[data-close]').forEach((element) => element.addEventListener('click', () => { root.innerHTML = '' }))
}

function bindEvents() {
  document.querySelectorAll<HTMLElement>('[data-tool]').forEach((element) => element.addEventListener('click', () => { activeTool = tools.find((tool) => tool.id === element.dataset.tool) ?? null; activeNav = activeTool?.id ?? 'home'; render() }))
  document.querySelectorAll<HTMLElement>('[data-nav]').forEach((element) => element.addEventListener('click', () => { const nav = element.dataset.nav!; if (nav === 'add') return showAddModal(); activeTool = null; activeNav = nav; render() }))
  document.querySelectorAll<HTMLElement>('[data-add]').forEach((element) => element.addEventListener('click', showAddModal))
}

render()

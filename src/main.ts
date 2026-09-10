import './style.css'
import { quickActions, tools, type Tool } from './tools'

type Item = { id: string; type: string; title: string; detail: string; createdAt: string; image?: string }
const app = document.querySelector<HTMLDivElement>('#app')!
let activeTool: Tool | null = null
let activeNav = 'home'
let userName = localStorage.getItem('hazuni-user-name') ?? ''

function initials(name: string) { return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() }
function escapeHtml(value: string) { return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character) }
function storageKey() { return `hazuni-items-${userName.toLowerCase()}` }
function getItems(): Item[] { return JSON.parse(localStorage.getItem(storageKey()) ?? '[]') as Item[] }
function saveItems(items: Item[]) { localStorage.setItem(storageKey(), JSON.stringify(items)) }
function deleteItem(id: string) { saveItems(getItems().filter((item) => item.id !== id)); render() }

function alarmNotificationKey(item: Item, date: Date) { return `hazuni-alarm-${item.id}-${date.toISOString().slice(0, 10)}` }
function checkAlarms() {
  const now = new Date()
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  getItems().filter((item) => item.type === 'alarmes' && item.detail === currentTime).forEach((item) => {
    const notificationKey = alarmNotificationKey(item, now)
    if (localStorage.getItem(notificationKey)) return
    localStorage.setItem(notificationKey, 'shown')
    if ('Notification' in window && Notification.permission === 'granted') new Notification(`Alarme: ${item.title}`, { body: `Está na hora: ${item.detail}`, tag: item.id })
    showInAppAlarm(item)
  })
}
setInterval(checkAlarms, 10000)

function showInAppAlarm(item: Item) {
  const root = document.querySelector<HTMLDivElement>('#modal-root')
  if (!root) return
  root.innerHTML = `<div class="alarm-alert" data-dismiss-alarm="true"><section class="alarm-alert-card"><div class="alarm-bell">⏰</div><p class="eyebrow">HORA DO ALARME</p><h2>${escapeHtml(item.title)}</h2><p>Está na hora do seu lembrete.</p><button class="primary-button" data-dismiss-alarm="true">Entendi</button></section></div>`
  root.querySelectorAll<HTMLElement>('[data-dismiss-alarm]').forEach((element) => element.addEventListener('click', () => { root.innerHTML = '' }))
  try {
    const audioContext = new AudioContext()
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()
    oscillator.frequency.value = 880
    oscillator.connect(gain)
    gain.connect(audioContext.destination)
    gain.gain.value = 0.12
    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.8)
  } catch { }
}

function toolCard(tool: Tool) {
  const count = getItems().filter((item) => item.type === tool.id).length
  return `<button class="tool-card" data-tool="${tool.id}" aria-label="Abrir ${tool.label}"><span class="tool-icon ${tool.color}">${tool.icon}</span><span class="tool-copy"><strong>${tool.label}</strong><small>${tool.description}</small></span>${count ? `<span class="tool-badge">${count} ${count === 1 ? 'item' : 'itens'}</span>` : tool.badge ? `<span class="tool-badge">${tool.badge}</span>` : ''}<span class="card-arrow">↗</span></button>`
}

function render() {
  if (!userName) { app.innerHTML = loginView(); bindEvents(); return }
  const isHome = activeNav === 'home' && !activeTool
  app.innerHTML = `<div class="app-shell"><header class="topbar"><button class="brand-mark" data-nav="home" type="button" aria-label="Voltar para Meu Espaço"><span>H</span><div><strong>HAZUNI</strong><small>seu espaço, do seu jeito</small></div></button><button class="avatar" data-logout="true" aria-label="Sair da conta">${initials(userName)}</button></header><main class="main-content">${isHome ? homeView() : innerView()}</main>${bottomNav()}<div id="modal-root"></div></div>`
  bindEvents()
}

function loginView() { return `<main class="login-page"><div class="login-brand"><span>H</span><strong>HAZUNI</strong></div><section class="login-card"><div class="login-mark">✦</div><p class="eyebrow">SEU ESPAÇO PESSOAL</p><h1>Como podemos<br><em>te chamar?</em></h1><p class="login-copy">Crie seu espaço no Hazuni e deixe tudo do seu jeito.</p><form id="login-form"><label for="user-name">Seu nome</label><input id="user-name" name="user-name" type="text" placeholder="Digite seu nome" maxlength="40" required><button class="primary-button" type="submit">Entrar no meu espaço <span>→</span></button></form><small class="login-note">Seus dados ficam salvos apenas neste aparelho.</small></section><div class="login-decoration" aria-hidden="true">✦</div></main>` }
function homeView() { return `<section class="welcome reveal"><p class="eyebrow">QUARTA-FEIRA, 09 DE SETEMBRO</p><h1>Bom dia, ${escapeHtml(userName)} <span>✦</span></h1><p class="subtitle">Tudo o que você precisa, em um só lugar.</p></section><section class="spotlight reveal-delay"><div><span class="spotlight-label">SEU DIA EM FOCO</span><h2>Pequenos passos,<br><em>grandes ideias.</em></h2><p>Tenha mais clareza sobre o que importa hoje.</p><button class="text-button" data-tool="agenda">Ver minha agenda <span>→</span></button></div><div class="sun-art" aria-hidden="true"><i></i><b>✦</b><strong>09</strong></div></section><div class="section-heading"><div><p class="eyebrow">TUDO NO SEU RITMO</p><h2>Meu Espaço</h2></div><button class="view-all" data-nav="favorites">Ver favoritos <span>→</span></button></div><section class="tool-grid">${tools.map(toolCard).join('')}</section>` }
function itemList(type: string) {
  const items = getItems().filter((item) => item.type === type)
  if (!items.length) return `<div class="empty-state"><div>✦</div><h2>Nada por aqui ainda</h2><p>Adicione seu primeiro item para começar a organizar sua rotina.</p></div>`
  if (type === 'fotos') return `<div class="photo-grid">${items.map((item) => `<article class="photo-item"><button class="photo-preview" data-photo="${item.id}" aria-label="Abrir ${escapeHtml(item.title)} em tamanho maior"><img src="${item.image ?? ''}" alt="${escapeHtml(item.title)}"></button><div class="photo-meta"><div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.detail)} · ${item.createdAt}</small></div><button class="delete-item" data-delete="${item.id}" aria-label="Excluir ${escapeHtml(item.title)}">×</button></div></article>`).join('')}</div>`
  const alarmPermission = 'Notification' in window ? Notification.permission : 'unsupported'
  const alarmStatus = alarmPermission === 'granted' ? 'notificação ativada' : alarmPermission === 'denied' ? 'notificação bloqueada nas configurações do navegador' : 'notificação ainda não autorizada'
  return `${type === 'alarmes' && alarmPermission !== 'granted' ? `<div class="permission-help"><strong>Ative as notificações para receber seus alarmes</strong><small>Toque no cadeado ou no ícone de configurações ao lado do endereço do Hazuni e permita as notificações. Depois, recarregue esta página.</small><button class="primary-button" data-notification-help="true">Tentar ativar notificações</button></div>` : ''}<div class="item-list">${items.map((item) => `<article class="saved-item"><div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.detail)}${type === 'alarmes' ? ` · ${alarmStatus}` : ''} · ${item.createdAt}</small></div><button class="delete-item" data-delete="${item.id}" aria-label="Excluir ${escapeHtml(item.title)}">×</button></article>`).join('')}</div>`
}

function innerView() {
  const tool = activeTool ?? tools.find((item) => item.id === activeNav)
  if (tool) return `<button class="back-button" data-nav="home">← Voltar para Meu Espaço</button><section class="inner-hero"><span class="tool-icon ${tool.color}">${tool.icon}</span><p class="eyebrow">FERRAMENTA HAZUNI</p><h1>${tool.label}</h1><p>${tool.description}.</p></section><div class="action-row"><button class="primary-button" data-add-tool="${tool.id}">＋ Adicionar</button></div>${itemList(tool.id)}`
  if (activeNav === 'search') return `<section class="inner-hero"><p class="eyebrow">HAZUNI APP</p><h1>Pesquisar</h1><p>Encontre rapidamente o que precisa na internet.</p></section><form class="feature-form" id="search-form"><label for="search-query">O que você procura?</label><div class="search-input"><input id="search-query" required placeholder="Digite sua pesquisa"><button class="primary-button" type="submit">Pesquisar</button></div></form>`
  if (activeNav === 'favorites') return `<section class="inner-hero"><p class="eyebrow">SEUS ATALHOS</p><h1>Favoritos</h1><p>Acesse seus itens salvos rapidamente.</p></section><div class="favorite-grid">${tools.filter((tool) => getItems().some((item) => item.type === tool.id)).map(toolCard).join('') || '<div class="empty-state"><div>☆</div><h2>Seus favoritos aparecem aqui</h2><p>Adicione itens nas ferramentas para criar seus atalhos.</p></div>'}</div>`
  return `<section class="inner-hero"><p class="eyebrow">SEU PERFIL</p><h1>Configurações</h1><p>Personalize o seu espaço no Hazuni.</p></section><form class="feature-form" id="settings-form"><label for="settings-name">Seu nome</label><input id="settings-name" value="${escapeHtml(userName)}" required maxlength="40"><button class="primary-button" type="submit">Salvar alterações</button></form><button class="danger-button" data-logout="true">Sair do aparelho</button>`
}
function bottomNav() { const items = [['home', '⌂', 'Início'], ['search', '⌕', 'Pesquisar'], ['add', '+', 'Adicionar'], ['favorites', '☆', 'Favoritos'], ['settings', '⚙', 'Configurações']]; return `<nav class="bottom-nav">${items.map(([id, icon, label]) => `<button class="nav-item ${activeNav === id ? 'active' : ''} ${id === 'add' ? 'add-item' : ''}" data-nav="${id}"><span>${icon}</span><small>${label}</small></button>`).join('')}</nav>` }
function formFields(type: string) {
  if (type === 'calculadoras') return `<label>Primeiro número<input name="first" type="number" step="any" required></label><label>Operação<select name="operation"><option value="+">Somar</option><option value="-">Subtrair</option><option value="*">Multiplicar</option><option value="/">Dividir</option></select></label><label>Segundo número<input name="second" type="number" step="any" required></label>`
  if (type === 'fotos' || type === 'arquivos') return `<label>Escolha um arquivo<input name="file" type="file" required></label><label>Descrição<input name="detail" placeholder="Opcional"></label>`
  if (type === 'agenda') return `<label>Compromisso<input name="title" required placeholder="Ex.: Reunião de trabalho"></label><label>Data e horário<input name="detail" type="datetime-local" required></label>`
  if (type === 'alarmes') return `<label>Nome do alarme<input name="title" required placeholder="Ex.: Tomar remédio"></label><label>Horário<input name="detail" type="time" required></label>`
  if (type === 'contas') return `<label>Descrição<input name="title" required placeholder="Ex.: Mercado"></label><label>Valor<input name="detail" type="number" step="0.01" required placeholder="0,00"></label>`
  return `<label>Título<input name="title" required placeholder="Dê um nome para isso"></label><label>Detalhes<textarea name="detail" rows="4" placeholder="Escreva aqui..."></textarea></label>`
}
function showForm(type: string) {
  const tool = tools.find((item) => item.id === type); if (!tool) return
  const root = document.querySelector<HTMLDivElement>('#modal-root')!
  root.innerHTML = `<div class="modal-backdrop" data-close="true"><section class="add-sheet" role="dialog" aria-modal="true"><button class="close-modal" data-close="true">×</button><p class="eyebrow">${tool.icon} NOVO ITEM</p><h2>Adicionar em ${tool.label}</h2><form class="feature-form" id="item-form" data-type="${type}">${formFields(type)}<button class="primary-button" type="submit">Salvar item</button></form></section></div>`
  root.querySelectorAll<HTMLElement>('[data-close]').forEach((element) => element.addEventListener('click', (event) => { if (event.target === element || element.classList.contains('close-modal')) root.innerHTML = '' }))
  root.querySelector<HTMLFormElement>('#item-form')?.addEventListener('submit', async (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget as HTMLFormElement)
    let title = String(data.get('title') ?? 'Item')
    let detail = String(data.get('detail') ?? '')
    let image: string | undefined
    if (type === 'calculadoras') { const first = Number(data.get('first')); const second = Number(data.get('second')); const operation = String(data.get('operation')); const result = operation === '+' ? first + second : operation === '-' ? first - second : operation === '*' ? first * second : second === 0 ? NaN : first / second; title = `Resultado: ${result}`; detail = `${first} ${operation} ${second}` }
    if (type === 'fotos' || type === 'arquivos') {
      const file = data.get('file') as File
      title = file?.name || 'Arquivo'
      if (type === 'fotos' && file?.type.startsWith('image/')) image = await fileToDataUrl(file)
    }
    if (type === 'alarmes' && 'Notification' in window && Notification.permission === 'default') await Notification.requestPermission()
    const items = getItems()
    items.unshift({ id: crypto.randomUUID(), type, title, detail: detail || 'Sem detalhes', createdAt: new Date().toLocaleDateString('pt-BR'), image })
    saveItems(items)
    root.innerHTML = ''
    render()
  })
}

function fileToDataUrl(file: File) { return new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(file) }) }

function showPhoto(id: string) {
  const item = getItems().find((savedItem) => savedItem.id === id)
  if (!item?.image) return
  const root = document.querySelector<HTMLDivElement>('#modal-root')!
  root.innerHTML = `<div class="photo-lightbox" data-close-photo="true"><button class="close-modal" data-close-photo="true">×</button><img src="${item.image}" alt="${escapeHtml(item.title)}"><p>${escapeHtml(item.title)}</p></div>`
  root.querySelectorAll<HTMLElement>('[data-close-photo]').forEach((element) => element.addEventListener('click', (event) => { if (event.target === element || element.classList.contains('close-modal')) root.innerHTML = '' }))
}

function requestNotifications() {
  if (!('Notification' in window)) { globalThis.alert('Este navegador não oferece notificações. Abra o Hazuni no Chrome ou Safari atualizado.'); return }
  if (Notification.permission === 'denied') { window.alert('As notificações estão bloqueadas. Abra as configurações do navegador, entre nas permissões do site do Hazuni, permita Notificações e recarregue a página.'); return }
  Notification.requestPermission().then(() => render())
}
function showAddModal() {
  const root = document.querySelector<HTMLDivElement>('#modal-root')!
  root.innerHTML = `<div class="modal-backdrop" data-close="true"><section class="add-sheet" role="dialog" aria-modal="true"><button class="close-modal" data-close="true">×</button><p class="eyebrow">COMEÇAR ALGO NOVO</p><h2>O que você quer criar?</h2><div class="quick-actions">${quickActions.map((action) => `<button class="quick-action" data-quick="${action.id}"><span>${action.icon}</span><strong>${action.label}</strong></button>`).join('')}</div></section></div>`
  root.querySelectorAll<HTMLElement>('[data-close]').forEach((element) => element.addEventListener('click', (event) => { if (event.target === element || element.classList.contains('close-modal')) root.innerHTML = '' }))
  root.querySelectorAll<HTMLElement>('[data-quick]').forEach((element) => element.addEventListener('click', () => { const types: Record<string, string> = { note: 'anotacoes', event: 'agenda', budget: 'contas', task: 'anotacoes' }; root.innerHTML = ''; showForm(types[element.dataset.quick!] ?? 'anotacoes') }))
}
function bindEvents() {
  document.querySelector<HTMLFormElement>('#login-form')?.addEventListener('submit', (event) => { event.preventDefault(); const input = document.querySelector<HTMLInputElement>('#user-name')!; userName = input.value.trim(); if (!userName) return; localStorage.setItem('hazuni-user-name', userName); render() })
  document.querySelector<HTMLElement>('[data-logout]')?.addEventListener('click', () => { localStorage.removeItem('hazuni-user-name'); userName = ''; activeTool = null; activeNav = 'home'; render() })
  document.querySelectorAll<HTMLElement>('[data-tool]').forEach((element) => element.addEventListener('click', () => { activeTool = tools.find((tool) => tool.id === element.dataset.tool) ?? null; activeNav = activeTool?.id ?? 'home'; render() }))
  document.querySelectorAll<HTMLElement>('[data-nav]').forEach((element) => element.addEventListener('click', () => { const nav = element.dataset.nav!; if (nav === 'add') return showAddModal(); activeTool = null; activeNav = nav; render() }))
  document.querySelectorAll<HTMLElement>('[data-add-tool]').forEach((element) => element.addEventListener('click', () => showForm(element.dataset.addTool!)))
  document.querySelectorAll<HTMLElement>('[data-delete]').forEach((element) => element.addEventListener('click', () => deleteItem(element.dataset.delete!)))
  document.querySelectorAll<HTMLElement>('[data-photo]').forEach((element) => element.addEventListener('click', () => showPhoto(element.dataset.photo!)))
  document.querySelector<HTMLElement>('[data-notification-help]')?.addEventListener('click', requestNotifications)
  document.querySelector<HTMLFormElement>('#search-form')?.addEventListener('submit', (event) => { event.preventDefault(); const query = document.querySelector<HTMLInputElement>('#search-query')!.value.trim(); if (query) window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank', 'noopener,noreferrer') })
  document.querySelector<HTMLFormElement>('#settings-form')?.addEventListener('submit', (event) => { event.preventDefault(); const oldKey = storageKey(); const value = document.querySelector<HTMLInputElement>('#settings-name')!.value.trim(); if (!value) return; const oldItems = localStorage.getItem(oldKey); userName = value; localStorage.setItem('hazuni-user-name', userName); if (oldItems) localStorage.setItem(storageKey(), oldItems); render() })
}
render()

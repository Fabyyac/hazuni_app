export type Tool = {
  id: string
  label: string
  description: string
  icon: string
  color: string
  badge?: string
}

export const tools: Tool[] = [
  { id: 'agenda', label: 'Agenda', description: 'Organize seus próximos compromissos', icon: '📅', color: 'coral', badge: 'Hoje' },
  { id: 'alarmes', label: 'Alarmes', description: 'Lembretes para o seu ritmo', icon: '⏰', color: 'yellow', badge: '2 ativos' },
  { id: 'calculadoras', label: 'Calculadoras', description: 'Contas rápidas para o dia a dia', icon: '🧮', color: 'mint' },
  { id: 'contas', label: 'Contas', description: 'Acompanhe orçamentos e gastos', icon: '💰', color: 'blue', badge: 'R$ 1.240' },
  { id: 'pesquisar', label: 'Pesquisar', description: 'Encontre o que precisa na internet', icon: '🔎', color: 'lavender' },
  { id: 'fotos', label: 'Fotos', description: 'Guarde momentos em ordem', icon: '🖼️', color: 'peach' },
  { id: 'anotacoes', label: 'Anotações', description: 'Ideias que merecem espaço', icon: '📝', color: 'sky', badge: '3 novas' },
  { id: 'arquivos', label: 'Arquivos', description: 'Tudo importante em um só lugar', icon: '📂', color: 'lilac' },
]

export const quickActions = [
  { id: 'note', label: 'Nova anotação', icon: '📝' },
  { id: 'event', label: 'Compromisso', icon: '📅' },
  { id: 'budget', label: 'Novo orçamento', icon: '💰' },
  { id: 'task', label: 'Nova tarefa', icon: '✓' },
]

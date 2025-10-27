# 🏆 Sistema de Torneio 1x1 - GTS 2025

Sistema completo para gerenciamento e sorteio de torneios 1x1 de Valorant, desenvolvido para o evento GTS 2025.

## 📋 Descrição

Este projeto é um sistema web responsivo que permite:
- Carregar lista de jogadores a partir de arquivo CSV
- Realizar sorteio automático de confrontos
- Gerenciar torneio eliminatório com sistema de classificação
- Salvar e carregar progresso do torneio
- Exibir classificação final com medalhas
- Interface moderna e intuitiva

## 🚀 Funcionalidades

### ✨ Principais Recursos
- **Sorteio Automático**: Sistema que embaralha jogadores e cria confrontos aleatórios
- **Torneio Eliminatório**: Gerenciamento completo de torneio com sistema de eliminação
- **Validação de Dados**: Verifica se a quantidade de jogadores é potência de 2
- **Persistência**: Salva automaticamente o progresso do torneio
- **Classificação Final**: Exibe ranking completo com medalhas (🥇🥈🥉)
- **Interface Responsiva**: Design moderno que funciona em desktop e mobile
- **Sistema de Backup**: Backup automático no servidor e localStorage

### 🎮 Sistema de Torneio
- **Eliminação Direta**: Torneio tradicional de eliminação
- **Disputa do 3º Lugar**: Partida especial entre perdedores das semifinais
- **Classificação por Rodada**: Rastreamento de em qual rodada cada jogador foi eliminado
- **Medalhas**: Sistema de premiação automático

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: PHP 7.4+
- **Armazenamento**: JSON (localStorage + arquivo servidor)
- **Dados**: CSV (importação de jogadores)
- **Design**: CSS Grid, Flexbox, Gradientes

## 📁 Estrutura do Projeto

```
randomizador/
├── index.php                          # Página principal
├── sorteio.php                        # API para sorteio de jogadores
├── load_tournament.php                # API para carregar torneio salvo
├── save_tournament.php                # API para salvar torneio
├── clear_tournament.php               # API para limpar backup
├── tournament_backup.json             # Backup do torneio (gerado automaticamente)
├── assets/
│   ├── script.js                      # Lógica principal do frontend
│   └── style.css                      # Estilos CSS
└── CAMPEONATO 1x1 VALORANT - GTS 2025 (respostas) - Respostas ao formulário 1.csv
```

## 🚀 Como Usar

### 1. Configuração do Servidor
- Coloque os arquivos em um servidor web com PHP 7.4+
- Certifique-se de que o PHP tem permissão de escrita na pasta do projeto

### 2. Preparação dos Dados
- O arquivo CSV deve conter os dados dos jogadores
- A coluna com os nomes deve estar na 3ª posição (índice 2)
- A quantidade de jogadores deve ser uma potência de 2 (2, 4, 8, 16, 32, 64, etc.)

### 3. Execução
1. Acesse `index.php` no navegador
2. Clique em "🎲 Sortear Duelos"
3. O sistema irá:
   - Carregar jogadores do CSV
   - Validar quantidade
   - Embaralhar e criar confrontos
   - Exibir o torneio

### 4. Gerenciamento do Torneio
- Clique nos nomes dos vencedores para avançar
- O sistema salva automaticamente o progresso
- Ao final, exibe classificação completa com medalhas

## 📊 Formato do CSV

O arquivo CSV deve seguir este formato:
```csv
Carimbo de data/hora,Endereço de e-mail,Nome Completo,...
2024-01-01,email@exemplo.com,João Silva,...
2024-01-01,email2@exemplo.com,Maria Santos,...
```

**Importante**: O nome do jogador deve estar na 3ª coluna (índice 2).

## 🔧 Configurações

### Validação de Jogadores
- Quantidade deve ser potência de 2
- Se não for, o sistema informa quantos jogadores faltam
- Exemplo: 10 jogadores → precisa de 16 (faltam 6)

### Sistema de Backup
- **LocalStorage**: Backup automático no navegador
- **Servidor**: Backup em `tournament_backup.json`
- **Recuperação**: Sistema tenta carregar automaticamente

## 🎨 Interface

### Design Responsivo
- **Desktop**: Layout em grid com cards organizados
- **Mobile**: Layout adaptativo com scroll vertical
- **Cores**: Gradiente azul/verde com acentos dourados
- **Tipografia**: Segoe UI para melhor legibilidade

### Elementos Visuais
- **Botões**: Estilo moderno com hover effects
- **Cards**: Sombras e bordas arredondadas
- **Medalhas**: Emojis para 1º, 2º e 3º lugar
- **Status**: Mensagens coloridas para feedback

## 🔄 Fluxo do Sistema

1. **Carregamento**: Sistema tenta carregar torneio salvo
2. **Sorteio**: Valida CSV e embaralha jogadores
3. **Torneio**: Interface para marcar vencedores
4. **Persistência**: Salva progresso automaticamente
5. **Finalização**: Exibe classificação e permite novo torneio

## 🐛 Tratamento de Erros

- **CSV não encontrado**: Mensagem clara de erro
- **Quantidade inválida**: Informa quantos jogadores faltam
- **Erro de servidor**: Fallback para localStorage
- **Dados corrompidos**: Validação e recuperação automática

## 📱 Compatibilidade

- **Navegadores**: Chrome, Firefox, Safari, Edge (versões recentes)
- **Dispositivos**: Desktop, tablet, mobile
- **Servidor**: Apache/Nginx com PHP 7.4+

## 🎯 Casos de Uso

- **Torneios de Valorant**: Principal uso do sistema
- **Eventos Esportivos**: Adaptável para outros jogos
- **Competições Locais**: Fácil configuração e uso
- **Eventos Escolares**: Interface amigável

## 🌊 GitFlow e CI/CD

Este projeto utiliza GitFlow para gerenciamento de branches e GitHub Actions para CI/CD:

### Estrutura de Branches
- **`main`**: Código de produção estável
- **`develop`**: Código de desenvolvimento integrado
- **`feature/*`**: Novas funcionalidades
- **`release/*`**: Preparação de releases
- **`hotfix/*`**: Correções urgentes

### Pipeline Automático
- ✅ Validação de sintaxe PHP e JavaScript
- ✅ Testes automáticos
- ✅ Deploy automático por ambiente
- ✅ Criação de releases automática

### Scripts de Automação
```bash
# Criar nova feature
./gitflow-helper.sh feature nome-da-feature

# Criar release
./gitflow-helper.sh release 1.0.0

# Criar hotfix
./gitflow-helper.sh hotfix 1.0.1
```

📚 **Documentação Completa**: [GITFLOW.md](GITFLOW.md) | [EXEMPLO-GITFLOW.md](EXEMPLO-GITFLOW.md)

## 📈 Melhorias Futuras

- [ ] Sistema de grupos/seeding
- [ ] Estatísticas detalhadas
- [ ] Exportação de resultados
- [ ] Sistema de pontuação
- [ ] Integração com APIs de jogos

## 👥 Desenvolvimento

Sistema desenvolvido para o evento GTS 2025, focado em simplicidade e usabilidade para organizadores de torneios.

---

**Desenvolvido com ❤️ para a comunidade gamer**

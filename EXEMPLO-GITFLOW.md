# 🚀 Exemplo Prático - GitFlow no Randomizador

Este documento mostra exemplos práticos de como usar o GitFlow no projeto Randomizador de Torneios.

## 📋 Cenários Comuns

### 1. 🆕 Desenvolvendo uma Nova Funcionalidade

**Situação**: Você quer adicionar um sistema de estatísticas ao torneio.

```bash
# 1. Criar nova feature
./gitflow-helper.sh feature sistema-estatisticas

# 2. Desenvolver a funcionalidade
# ... editar arquivos ...
git add .
git commit -m "feat(stats): adicionar sistema de estatísticas básicas"

# ... mais desenvolvimento ...
git add .
git commit -m "feat(stats): implementar gráficos de performance"

# 3. Finalizar feature
./gitflow-helper.sh finish-feature sistema-estatisticas
```

### 2. 🏷️ Preparando uma Nova Release

**Situação**: Você quer lançar a versão 1.1.0 com as novas funcionalidades.

```bash
# 1. Criar branch de release
./gitflow-helper.sh release 1.1.0

# 2. Preparar release
# ... ajustar versões nos arquivos ...
# ... atualizar CHANGELOG.md ...
# ... testar tudo ...

git add .
git commit -m "chore(release): preparar versão 1.1.0"

# 3. Finalizar release
./gitflow-helper.sh finish-release 1.1.0
```

### 3. 🚨 Corrigindo um Bug Crítico

**Situação**: Há um bug crítico na produção que precisa ser corrigido urgentemente.

```bash
# 1. Criar hotfix
./gitflow-helper.sh hotfix 1.1.1

# 2. Corrigir o bug
# ... editar arquivos ...
git add .
git commit -m "fix(tournament): corrigir erro de validação de CSV"

# 3. Finalizar hotfix
./gitflow-helper.sh finish-hotfix 1.1.1
```

## 🔄 Fluxo Completo de Desenvolvimento

### Cenário: Adicionando Sistema de Grupos

```bash
# 1. Começar desenvolvimento
git checkout develop
git pull origin develop

# 2. Criar feature
./gitflow-helper.sh feature sistema-grupos

# 3. Desenvolver (exemplo de commits)
git add assets/script.js
git commit -m "feat(groups): adicionar lógica de grupos no frontend"

git add sorteio.php
git commit -m "feat(groups): implementar API para criação de grupos"

git add index.php
git commit -m "feat(groups): adicionar interface para configuração de grupos"

# 4. Testar localmente
# ... executar testes ...

# 5. Finalizar feature
./gitflow-helper.sh finish-feature sistema-grupos

# 6. Criar release
./gitflow-helper.sh release 2.0.0

# 7. Preparar release
# ... ajustar documentação ...
# ... testar tudo ...

git add .
git commit -m "chore(release): preparar versão 2.0.0"

# 8. Finalizar release
./gitflow-helper.sh finish-release 2.0.0
```

## 📊 Monitoramento do Pipeline

### Verificar Status dos Workflows

1. Acesse: https://github.com/luizmont5/Randomizador-para-Torneios/actions
2. Monitore os workflows em tempo real
3. Verifique logs de deploy e testes

### Status Local

```bash
# Ver status atual
./gitflow-helper.sh status

# Ver branches disponíveis
git branch -a

# Ver histórico de commits
git log --oneline --graph --all
```

## 🚨 Resolução de Problemas

### Conflito de Merge

```bash
# 1. Resolver conflitos
git status
# ... editar arquivos com conflitos ...
git add arquivo-resolvido.php

# 2. Continuar merge
git commit -m "resolve merge conflict in arquivo-resolvido.php"
```

### Branch Desatualizada

```bash
# 1. Atualizar develop
git checkout develop
git pull origin develop

# 2. Rebase da feature
git checkout feature/minha-feature
git rebase develop

# 3. Resolver conflitos se houver
# ... resolver conflitos ...
git add .
git rebase --continue
```

### Deploy Falhou

```bash
# 1. Verificar logs no GitHub Actions
# 2. Corrigir problemas
# 3. Fazer novo commit
git add .
git commit -m "fix(deploy): corrigir problema de deploy"
git push origin develop
```

## 📝 Convenções de Commit

### Exemplos de Commits Válidos

```bash
# Funcionalidade
git commit -m "feat(tournament): adicionar sistema de grupos"

# Correção
git commit -m "fix(api): corrigir erro de validação de CSV"

# Documentação
git commit -m "docs(readme): atualizar instruções de instalação"

# Estilo
git commit -m "style(css): melhorar responsividade mobile"

# Refatoração
git commit -m "refactor(js): otimizar algoritmo de sorteio"

# Teste
git commit -m "test(api): adicionar testes para sorteio.php"

# Configuração
git commit -m "chore(ci): atualizar workflow de deploy"
```

### Commits de Release

```bash
# Preparação de release
git commit -m "chore(release): preparar versão 1.2.0"

# Finalização de release
git commit -m "chore(release): finalizar versão 1.2.0"
```

## 🔧 Comandos Úteis

### Limpeza de Branches

```bash
# Deletar branch local
git branch -d feature/nome-da-feature

# Deletar branch remota
git push origin --delete feature/nome-da-feature

# Limpar branches merged
git branch --merged | grep -v main | grep -v develop | xargs -n 1 git branch -d
```

### Backup e Sincronização

```bash
# Sincronizar tudo
git push origin --all
git push origin --tags

# Backup completo
git bundle create backup-$(date +%Y%m%d).bundle --all
```

### Visualização

```bash
# Ver diferenças
git diff develop..feature/minha-feature

# Ver arquivos modificados
git diff --name-only develop..feature/minha-feature

# Ver histórico de uma branch
git log --oneline feature/minha-feature
```

## 🎯 Dicas Importantes

### ✅ Boas Práticas

1. **Sempre** faça pull antes de começar uma nova feature
2. **Nunca** faça commit direto na main ou develop
3. **Sempre** teste localmente antes de finalizar uma feature
4. **Use** mensagens de commit descritivas
5. **Mantenha** branches atualizadas com rebase

### ❌ Evite

1. Commits diretos na main
2. Merge de develop em feature (use rebase)
3. Commits vazios ou sem mensagem
4. Deixar branches órfãs
5. Deploy sem testes

### 🚀 Otimizações

1. Use o script helper para automatizar tarefas
2. Configure aliases Git para comandos frequentes
3. Use hooks Git para validações automáticas
4. Monitore o pipeline regularmente
5. Mantenha documentação atualizada

---

**Lembre-se**: O GitFlow é uma ferramenta poderosa que, quando usada corretamente, facilita muito o desenvolvimento e manutenção do projeto! 🎉

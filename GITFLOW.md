# 🌊 GitFlow - Randomizador de Torneios

Este documento descreve o fluxo de trabalho GitFlow implementado para o projeto Randomizador de Torneios.

## 📋 Visão Geral

O GitFlow é um modelo de branching que define um rigoroso modelo de ramificação projetado em torno do lançamento do projeto. Este modelo define tipos específicos de branches e como elas interagem.

## 🌿 Estrutura de Branches

### Branches Principais

#### `main` (Produção)
- **Propósito**: Contém código estável e pronto para produção
- **Proteção**: Só aceita merges de `develop` ou `hotfix/*`
- **Deploy**: Automático para ambiente de produção

#### `develop` (Desenvolvimento)
- **Propósito**: Contém código de desenvolvimento integrado
- **Proteção**: Só aceita merges de `feature/*` ou `release/*`
- **Deploy**: Automático para ambiente de desenvolvimento

### Branches de Suporte

#### `feature/*` (Funcionalidades)
- **Formato**: `feature/nome-da-funcionalidade`
- **Exemplos**: 
  - `feature/melhorar-interface`
  - `feature/adicionar-estatisticas`
  - `feature/sistema-grupos`
- **Origem**: `develop`
- **Destino**: `develop`

#### `release/*` (Releases)
- **Formato**: `release/versao`
- **Exemplos**: 
  - `release/1.0.0`
  - `release/1.1.0`
  - `release/2.0.0`
- **Origem**: `develop`
- **Destino**: `main` e `develop`

#### `hotfix/*` (Correções Urgentes)
- **Formato**: `hotfix/versao`
- **Exemplos**: 
  - `hotfix/1.0.1`
  - `hotfix/1.1.1`
- **Origem**: `main`
- **Destino**: `main` e `develop`

## 🔄 Fluxo de Trabalho

### 1. Desenvolvimento de Funcionalidades

```bash
# Criar nova feature
git checkout develop
git pull origin develop
git checkout -b feature/nova-funcionalidade

# Desenvolver a funcionalidade
# ... fazer commits ...

# Finalizar feature
git checkout develop
git merge --no-ff feature/nova-funcionalidade
git push origin develop
git branch -d feature/nova-funcionalidade
```

### 2. Preparação de Release

```bash
# Criar branch de release
git checkout develop
git pull origin develop
git checkout -b release/1.0.0

# Preparar release
# ... ajustar versões, documentação ...

# Finalizar release
git checkout main
git merge --no-ff release/1.0.0
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin main --tags

git checkout develop
git merge --no-ff release/1.0.0
git push origin develop
git branch -d release/1.0.0
```

### 3. Correções Urgentes (Hotfix)

```bash
# Criar hotfix
git checkout main
git pull origin main
git checkout -b hotfix/1.0.1

# Corrigir problema
# ... fazer commits ...

# Finalizar hotfix
git checkout main
git merge --no-ff hotfix/1.0.1
git tag -a v1.0.1 -m "Hotfix 1.0.1"
git push origin main --tags

git checkout develop
git merge --no-ff hotfix/1.0.1
git push origin develop
git branch -d hotfix/1.0.1
```

## 🚀 Pipeline CI/CD

### Workflows Automáticos

#### 1. **CI/CD Principal** (`.github/workflows/ci-cd.yml`)
- **Trigger**: Push para `main` ou `develop`
- **Jobs**:
  - Testes e validação
  - Deploy automático
  - Criação de artefatos

#### 2. **GitFlow** (`.github/workflows/gitflow.yml`)
- **Trigger**: Push para qualquer branch
- **Validações**:
  - Nomes de branches
  - Estrutura de arquivos
  - Deploy automático por ambiente

### Ambientes

#### Desenvolvimento
- **Branch**: `develop`
- **Deploy**: Automático
- **URL**: `https://dev.randomizador.com`

#### Produção
- **Branch**: `main`
- **Deploy**: Automático
- **URL**: `https://randomizador.com`

## 📝 Convenções de Commit

### Formato
```
tipo(escopo): descrição

Corpo da mensagem (opcional)

Rodapé (opcional)
```

### Tipos
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação, sem mudança de código
- `refactor`: Refatoração de código
- `test`: Adição ou correção de testes
- `chore`: Mudanças em ferramentas, configurações

### Exemplos
```
feat(tournament): adicionar sistema de grupos
fix(api): corrigir erro de validação de CSV
docs(readme): atualizar instruções de instalação
style(css): melhorar responsividade mobile
```

## 🏷️ Versionamento

### Semântico (SemVer)
- **Formato**: `MAJOR.MINOR.PATCH`
- **Exemplos**: `1.0.0`, `1.1.0`, `2.0.0`

### Tipos de Versão
- **MAJOR**: Mudanças incompatíveis
- **MINOR**: Funcionalidades compatíveis
- **PATCH**: Correções compatíveis

## 🔒 Proteções de Branch

### `main`
- ✅ Requer Pull Request
- ✅ Requer revisão de código
- ✅ Requer status checks
- ✅ Requer branch atualizada

### `develop`
- ✅ Requer Pull Request
- ✅ Requer status checks
- ✅ Requer branch atualizada

## 📊 Métricas e Relatórios

### GitHub Insights
- Commits por branch
- Pull requests por período
- Tempo de merge
- Contribuidores ativos

### Artefatos
- Arquivos de deploy
- Relatórios de teste
- Logs de pipeline

## 🛠️ Comandos Úteis

### Visualizar Branches
```bash
git branch -a
git log --oneline --graph --all
```

### Limpeza
```bash
git branch -d feature/nome-da-feature
git push origin --delete feature/nome-da-feature
```

### Backup
```bash
git push origin --all
git push origin --tags
```

## 🚨 Troubleshooting

### Problemas Comuns

#### 1. Merge Conflitos
```bash
git status
git add arquivo-resolvido.php
git commit -m "resolve merge conflict"
```

#### 2. Branch Desatualizada
```bash
git checkout develop
git pull origin develop
git checkout feature/minha-feature
git rebase develop
```

#### 3. Commit Errado
```bash
git reset --soft HEAD~1  # Desfaz commit, mantém mudanças
git commit --amend       # Edita último commit
```

## 📚 Recursos Adicionais

- [GitFlow Original](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

---

**Desenvolvido para o projeto Randomizador de Torneios - GTS 2025**

#!/bin/bash

# GitFlow Helper Script para Randomizador de Torneios
# Este script facilita o uso do GitFlow no projeto

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para exibir ajuda
show_help() {
    echo -e "${BLUE}GitFlow Helper - Randomizador de Torneios${NC}"
    echo ""
    echo "Uso: ./gitflow-helper.sh [comando] [argumentos]"
    echo ""
    echo "Comandos disponíveis:"
    echo "  init                    - Inicializar GitFlow no repositório"
    echo "  feature [nome]          - Criar nova feature"
    echo "  release [versão]        - Criar nova release"
    echo "  hotfix [versão]         - Criar novo hotfix"
    echo "  finish-feature [nome]   - Finalizar feature"
    echo "  finish-release [versão] - Finalizar release"
    echo "  finish-hotfix [versão]  - Finalizar hotfix"
    echo "  status                  - Mostrar status do GitFlow"
    echo "  help                    - Mostrar esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  ./gitflow-helper.sh feature melhorar-interface"
    echo "  ./gitflow-helper.sh release 1.0.0"
    echo "  ./gitflow-helper.sh hotfix 1.0.1"
}

# Função para verificar se estamos em um repositório Git
check_git_repo() {
    if [ ! -d ".git" ]; then
        echo -e "${RED}Erro: Não é um repositório Git${NC}"
        exit 1
    fi
}

# Função para verificar se a branch existe
check_branch_exists() {
    local branch=$1
    if git show-ref --verify --quiet refs/heads/$branch; then
        return 0
    else
        return 1
    fi
}

# Função para criar feature
create_feature() {
    local feature_name=$1
    
    if [ -z "$feature_name" ]; then
        echo -e "${RED}Erro: Nome da feature é obrigatório${NC}"
        echo "Uso: ./gitflow-helper.sh feature nome-da-feature"
        exit 1
    fi
    
    echo -e "${BLUE}Criando feature: $feature_name${NC}"
    
    # Verificar se estamos em develop
    current_branch=$(git branch --show-current)
    if [ "$current_branch" != "develop" ]; then
        echo -e "${YELLOW}Mudando para branch develop...${NC}"
        git checkout develop
        git pull origin develop
    fi
    
    # Criar branch da feature
    feature_branch="feature/$feature_name"
    if check_branch_exists "$feature_branch"; then
        echo -e "${YELLOW}Branch $feature_branch já existe. Mudando para ela...${NC}"
        git checkout "$feature_branch"
    else
        git checkout -b "$feature_branch"
        echo -e "${GREEN}Feature $feature_name criada com sucesso!${NC}"
        echo -e "${BLUE}Branch atual: $feature_branch${NC}"
    fi
}

# Função para criar release
create_release() {
    local version=$1
    
    if [ -z "$version" ]; then
        echo -e "${RED}Erro: Versão da release é obrigatória${NC}"
        echo "Uso: ./gitflow-helper.sh release 1.0.0"
        exit 1
    fi
    
    echo -e "${BLUE}Criando release: $version${NC}"
    
    # Verificar se estamos em develop
    current_branch=$(git branch --show-current)
    if [ "$current_branch" != "develop" ]; then
        echo -e "${YELLOW}Mudando para branch develop...${NC}"
        git checkout develop
        git pull origin develop
    fi
    
    # Criar branch da release
    release_branch="release/$version"
    if check_branch_exists "$release_branch"; then
        echo -e "${YELLOW}Branch $release_branch já existe. Mudando para ela...${NC}"
        git checkout "$release_branch"
    else
        git checkout -b "$release_branch"
        echo -e "${GREEN}Release $version criada com sucesso!${NC}"
        echo -e "${BLUE}Branch atual: $release_branch${NC}"
    fi
}

# Função para criar hotfix
create_hotfix() {
    local version=$1
    
    if [ -z "$version" ]; then
        echo -e "${RED}Erro: Versão do hotfix é obrigatória${NC}"
        echo "Uso: ./gitflow-helper.sh hotfix 1.0.1"
        exit 1
    fi
    
    echo -e "${BLUE}Criando hotfix: $version${NC}"
    
    # Verificar se estamos em main
    current_branch=$(git branch --show-current)
    if [ "$current_branch" != "main" ]; then
        echo -e "${YELLOW}Mudando para branch main...${NC}"
        git checkout main
        git pull origin main
    fi
    
    # Criar branch do hotfix
    hotfix_branch="hotfix/$version"
    if check_branch_exists "$hotfix_branch"; then
        echo -e "${YELLOW}Branch $hotfix_branch já existe. Mudando para ela...${NC}"
        git checkout "$hotfix_branch"
    else
        git checkout -b "$hotfix_branch"
        echo -e "${GREEN}Hotfix $version criado com sucesso!${NC}"
        echo -e "${BLUE}Branch atual: $hotfix_branch${NC}"
    fi
}

# Função para finalizar feature
finish_feature() {
    local feature_name=$1
    
    if [ -z "$feature_name" ]; then
        echo -e "${RED}Erro: Nome da feature é obrigatório${NC}"
        echo "Uso: ./gitflow-helper.sh finish-feature nome-da-feature"
        exit 1
    fi
    
    feature_branch="feature/$feature_name"
    
    if ! check_branch_exists "$feature_branch"; then
        echo -e "${RED}Erro: Branch $feature_branch não existe${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}Finalizando feature: $feature_name${NC}"
    
    # Mudar para develop
    git checkout develop
    git pull origin develop
    
    # Merge da feature
    git merge --no-ff "$feature_branch" -m "Merge feature/$feature_name into develop"
    
    # Push para origin
    git push origin develop
    
    # Deletar branch local
    git branch -d "$feature_branch"
    
    echo -e "${GREEN}Feature $feature_name finalizada com sucesso!${NC}"
}

# Função para finalizar release
finish_release() {
    local version=$1
    
    if [ -z "$version" ]; then
        echo -e "${RED}Erro: Versão da release é obrigatória${NC}"
        echo "Uso: ./gitflow-helper.sh finish-release 1.0.0"
        exit 1
    fi
    
    release_branch="release/$version"
    
    if ! check_branch_exists "$release_branch"; then
        echo -e "${RED}Erro: Branch $release_branch não existe${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}Finalizando release: $version${NC}"
    
    # Merge para main
    git checkout main
    git pull origin main
    git merge --no-ff "$release_branch" -m "Release $version"
    
    # Criar tag
    git tag -a "v$version" -m "Release $version"
    
    # Push para origin
    git push origin main --tags
    
    # Merge para develop
    git checkout develop
    git pull origin develop
    git merge --no-ff "$release_branch" -m "Merge release/$version into develop"
    git push origin develop
    
    # Deletar branch local
    git branch -d "$release_branch"
    
    echo -e "${GREEN}Release $version finalizada com sucesso!${NC}"
}

# Função para finalizar hotfix
finish_hotfix() {
    local version=$1
    
    if [ -z "$version" ]; then
        echo -e "${RED}Erro: Versão do hotfix é obrigatória${NC}"
        echo "Uso: ./gitflow-helper.sh finish-hotfix 1.0.1"
        exit 1
    fi
    
    hotfix_branch="hotfix/$version"
    
    if ! check_branch_exists "$hotfix_branch"; then
        echo -e "${RED}Erro: Branch $hotfix_branch não existe${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}Finalizando hotfix: $version${NC}"
    
    # Merge para main
    git checkout main
    git pull origin main
    git merge --no-ff "$hotfix_branch" -m "Hotfix $version"
    
    # Criar tag
    git tag -a "v$version" -m "Hotfix $version"
    
    # Push para origin
    git push origin main --tags
    
    # Merge para develop
    git checkout develop
    git pull origin develop
    git merge --no-ff "$hotfix_branch" -m "Merge hotfix/$version into develop"
    git push origin develop
    
    # Deletar branch local
    git branch -d "$hotfix_branch"
    
    echo -e "${GREEN}Hotfix $version finalizado com sucesso!${NC}"
}

# Função para mostrar status
show_status() {
    echo -e "${BLUE}Status do GitFlow${NC}"
    echo ""
    
    # Branch atual
    current_branch=$(git branch --show-current)
    echo -e "Branch atual: ${GREEN}$current_branch${NC}"
    
    # Status do repositório
    echo ""
    echo -e "${BLUE}Status do repositório:${NC}"
    git status --short
    
    # Branches locais
    echo ""
    echo -e "${BLUE}Branches locais:${NC}"
    git branch
    
    # Últimos commits
    echo ""
    echo -e "${BLUE}Últimos commits:${NC}"
    git log --oneline -5
}

# Função principal
main() {
    check_git_repo
    
    case "$1" in
        "init")
            echo -e "${BLUE}Inicializando GitFlow...${NC}"
            git flow init -d
            echo -e "${GREEN}GitFlow inicializado com sucesso!${NC}"
            ;;
        "feature")
            create_feature "$2"
            ;;
        "release")
            create_release "$2"
            ;;
        "hotfix")
            create_hotfix "$2"
            ;;
        "finish-feature")
            finish_feature "$2"
            ;;
        "finish-release")
            finish_release "$2"
            ;;
        "finish-hotfix")
            finish_hotfix "$2"
            ;;
        "status")
            show_status
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        *)
            echo -e "${RED}Comando não reconhecido: $1${NC}"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Executar função principal
main "$@"

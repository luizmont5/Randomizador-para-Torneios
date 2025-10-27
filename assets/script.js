/**
 * Sistema de Torneio 1x1 - GTS 2025
 * Lógica principal do front-end
 */

class TournamentManager {
    constructor() {
        this.currentRound = [];
        this.roundNumber = 1;
        this.totalRounds = 0;
        this.originalPlayers = [];
        this.isTournamentActive = false;
        this.semifinalLosers = [];
        this.semifinalWinners = [];
        this.thirdPlaceMatch = null;
        this.isThirdPlaceActive = false;
        
        // Sistema de classificação
        this.tournamentResults = [];
        this.finalRanking = [];
        this.champion = null;
        this.secondPlace = null;
        this.thirdPlace = null;
        this.eliminatedByRound = {}; // Rastrear em qual rodada cada jogador foi eliminado
        
        // Sistema de eliminações por rodada
        this.eliminatedByRoundName = {
            'quarterfinal': [],  // Eliminados nas quartas
            'round16': [],        // Eliminados nas oitavas
            'round64': []         // Eliminados nas eliminatórias
        };
        
        // Sistema de persistência
        this.tournamentId = null;
        this.isLoading = false;
        
        this.initializeEventListeners();
        this.loadTournamentState();
    }

    /**
     * Carrega o estado do torneio salvo
     */
    async loadTournamentState() {
        try {
            // Verificar se há um torneio salvo no localStorage
            const savedState = localStorage.getItem('tournament_state');
            if (savedState) {
                const tournamentData = JSON.parse(savedState);
                console.log('Estado do torneio encontrado:', tournamentData);
                
                // Verificar se o torneio ainda está ativo
                if (tournamentData.isTournamentActive && tournamentData.currentRound && tournamentData.currentRound.length > 0) {
                    this.restoreTournamentState(tournamentData);
                    this.showSuccess('Torneio carregado automaticamente!');
                    return;
                }
            }
            
            // Tentar carregar do servidor
            await this.loadTournamentFromServer();
            
        } catch (error) {
            console.log('Nenhum torneio salvo encontrado ou erro ao carregar:', error.message);
        }
    }

    /**
     * Carrega torneio do servidor
     */
    async loadTournamentFromServer() {
        try {
            const response = await fetch('load_tournament.php');
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.tournament) {
                    console.log('Torneio carregado do servidor:', data.tournament);
                    this.restoreTournamentState(data.tournament);
                    this.showSuccess('Torneio carregado do servidor!');
                }
            }
        } catch (error) {
            console.log('Erro ao carregar do servidor:', error.message);
        }
    }

    /**
     * Restaura o estado do torneio
     */
    restoreTournamentState(tournamentData) {
        this.currentRound = tournamentData.currentRound || [];
        this.roundNumber = tournamentData.roundNumber || 1;
        this.totalRounds = tournamentData.totalRounds || 0;
        this.originalPlayers = tournamentData.originalPlayers || [];
        this.isTournamentActive = tournamentData.isTournamentActive || false;
        this.semifinalLosers = tournamentData.semifinalLosers || [];
        this.semifinalWinners = tournamentData.semifinalWinners || [];
        this.thirdPlaceMatch = tournamentData.thirdPlaceMatch || null;
        this.isThirdPlaceActive = tournamentData.isThirdPlaceActive || false;
        
        // Restaurar dados de classificação
        this.tournamentResults = tournamentData.tournamentResults || [];
        this.finalRanking = tournamentData.finalRanking || [];
        this.champion = tournamentData.champion || null;
        this.secondPlace = tournamentData.secondPlace || null;
        this.thirdPlace = tournamentData.thirdPlace || null;
        this.eliminatedByRound = tournamentData.eliminatedByRound || {};
        
        // Restaurar eliminações por rodada
        this.eliminatedByRoundName = tournamentData.eliminatedByRoundName || {
            'quarterfinal': [],
            'round16': [],
            'round64': []
        };
        
        this.tournamentId = tournamentData.tournamentId || null;
        
        // Renderizar o torneio se estiver ativo
        if (this.isTournamentActive && this.currentRound.length > 0) {
            this.renderTournament();
            this.showTournamentSection();
            this.showResetButton();
        } else if (this.champion) {
            // Se o torneio já terminou, mostrar resultados
            this.showChampion(this.champion);
        }
    }

    /**
     * Salva o estado atual do torneio
     */
    async saveTournamentState() {
        if (this.isLoading) return;
        
        const tournamentState = {
            currentRound: this.currentRound,
            roundNumber: this.roundNumber,
            totalRounds: this.totalRounds,
            originalPlayers: this.originalPlayers,
            isTournamentActive: this.isTournamentActive,
            semifinalLosers: this.semifinalLosers,
            semifinalWinners: this.semifinalWinners,
            thirdPlaceMatch: this.thirdPlaceMatch,
            isThirdPlaceActive: this.isThirdPlaceActive,
            tournamentResults: this.tournamentResults,
            finalRanking: this.finalRanking,
            champion: this.champion,
            secondPlace: this.secondPlace,
            thirdPlace: this.thirdPlace,
            eliminatedByRound: this.eliminatedByRound,
            eliminatedByRoundName: this.eliminatedByRoundName,
            tournamentId: this.tournamentId,
            lastSaved: new Date().toISOString()
        };
        
        try {
            // Salvar no localStorage
            localStorage.setItem('tournament_state', JSON.stringify(tournamentState));
            console.log('Estado do torneio salvo no localStorage');
            
            // Salvar no servidor
            await this.saveTournamentToServer(tournamentState);
            
            // Mostrar indicador de salvamento
            this.showSaveIndicator();
            
        } catch (error) {
            console.error('Erro ao salvar estado do torneio:', error);
        }
    }

    /**
     * Mostra indicador de salvamento
     */
    showSaveIndicator() {
        // Criar ou atualizar indicador de salvamento
        let saveIndicator = document.getElementById('saveIndicator');
        if (!saveIndicator) {
            saveIndicator = document.createElement('div');
            saveIndicator.id = 'saveIndicator';
            saveIndicator.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #28a745;
                color: white;
                padding: 8px 16px;
                border-radius: 4px;
                font-size: 14px;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(saveIndicator);
        }
        
        saveIndicator.textContent = '💾 Torneio salvo automaticamente';
        saveIndicator.style.opacity = '1';
        
        // Esconder após 2 segundos
        setTimeout(() => {
            saveIndicator.style.opacity = '0';
        }, 2000);
    }

    /**
     * Salva torneio no servidor
     */
    async saveTournamentToServer(tournamentState) {
        try {
            const response = await fetch('save_tournament.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tournamentState)
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    console.log('Torneio salvo no servidor com sucesso');
                    this.tournamentId = data.tournamentId;
                }
            }
        } catch (error) {
            console.error('Erro ao salvar no servidor:', error);
        }
    }

    /**
     * Limpa dados salvos
     */
    async clearSavedTournament() {
        localStorage.removeItem('tournament_state');
        this.tournamentId = null;
        console.log('Dados do torneio limpos');
        
        // Limpar backup do servidor
        try {
            await fetch('clear_tournament.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log('Backup do servidor limpo');
        } catch (error) {
            console.error('Erro ao limpar backup do servidor:', error);
        }
    }

    /**
     * Inicializa os event listeners
     */
    initializeEventListeners() {
        document.getElementById('sortearBtn').addEventListener('click', () => this.sortearDuelos());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetTournament());
        document.getElementById('newTournamentBtn').addEventListener('click', () => this.resetTournament());
        document.getElementById('printRankingBtn').addEventListener('click', () => this.printRanking());
        
        // Event delegation para botões de vencedor
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('winner-btn')) {
                const matchId = e.target.dataset.matchId;
                const playerNumber = parseInt(e.target.dataset.player);
                
                console.log('=== CLIQUE EM BOTÃO ===');
                console.log('Elemento clicado:', e.target);
                console.log('Match ID:', matchId);
                console.log('Player Number:', playerNumber);
                console.log('Classe do elemento pai:', e.target.closest('.match')?.className);
                console.log('É partida de 3º lugar?', e.target.closest('.third-place-match') ? 'SIM' : 'NÃO');
                console.log('Torneio ativo?', this.isTournamentActive);
                console.log('========================');
                
                if (matchId && playerNumber) {
                    this.selectWinnerById(matchId, playerNumber);
                }
            }
        });
    }

    /**
     * Faz a requisição para sortear os duelos
     */
    async sortearDuelos() {
        const sortearBtn = document.getElementById('sortearBtn');
        const statusSection = document.getElementById('statusSection');
        const errorSection = document.getElementById('errorSection');
        const tournamentSection = document.getElementById('tournamentSection');
        
        // Mostrar loading
        sortearBtn.textContent = '🔄 Carregando...';
        sortearBtn.disabled = true;
        
        // Limpar mensagens anteriores
        this.hideSections();
        
        try {
            const response = await fetch('sorteio.php');
            const data = await response.json();
            
            if (data.erro) {
                this.showError(data.mensagem, data.detalhes);
                return;
            }
            
            // Inicializar torneio
            this.initializeTournament(data);
            this.showSuccess(`Torneio iniciado com ${data.total_jogadores} jogadores!`);
            
        } catch (error) {
            this.showError('Erro ao conectar com o servidor: ' + error.message);
        } finally {
            sortearBtn.textContent = '🎲 Sortear Duelos';
            sortearBtn.disabled = false;
        }
    }

    /**
     * Inicializa o torneio com os dados recebidos
     */
    initializeTournament(data) {
        this.originalPlayers = [...data.jogadores];
        this.currentRound = [...data.confrontos];
        this.roundNumber = 1;
        this.totalRounds = Math.log2(data.total_jogadores);
        this.isTournamentActive = true;
        
        // Calcular nome da rodada
        const roundNames = this.getRoundNames(data.total_jogadores);
        this.totalRounds = roundNames.length;
        
        this.renderTournament();
        this.showTournamentSection();
        this.showResetButton();
        
        // Salvar estado inicial do torneio
        this.saveTournamentState();
    }

    /**
     * Retorna os nomes das rodadas baseado no número de jogadores
     */
    getRoundNames(totalPlayers) {
        const rounds = [];
        let players = totalPlayers;
        
        while (players > 1) {
            if (players === 2) {
                rounds.push('Final');
            } else if (players === 4) {
                rounds.push('Semifinal');
            } else if (players === 8) {
                rounds.push('Quartas de Final');
            } else if (players === 16) {
                rounds.push('Oitavas de Final');
            } else if (players === 32) {
                rounds.push('Eliminatórias');
            } else {
                rounds.push(`${players}ª de Final`);
            }
            players = players / 2;
        }
        
        return rounds;
    }

    /**
     * Renderiza a tabela do torneio em formato de bracket
     */
    renderTournament() {
        const container = document.getElementById('tournamentContainer');
        const roundTitle = document.getElementById('roundTitle');
        
        // Atualizar título da rodada (não sobrescrever se for partida de 3º lugar)
        if (!this.isThirdPlaceActive) {
            const roundNames = this.getRoundNames(this.originalPlayers.length);
            const currentRoundName = roundNames[this.roundNumber - 1] || `Rodada ${this.roundNumber}`;
            roundTitle.textContent = currentRoundName;
        }
        
        // Limpar container
        container.innerHTML = '';
        
        // Se restou apenas 1 jogador, mostrar campeão
        if (this.currentRound.length === 1 && this.currentRound[0].length === 1) {
            this.showChampion(this.currentRound[0][0]);
            return;
        }
        
        // Criar layout de bracket
        this.createBracketLayout(container);
    }

    /**
     * Cria o layout de bracket em grid - APENAS FASE ATUAL
     */
    createBracketLayout(container) {
        // Criar container centralizado para uma única fase
        const singlePhaseContainer = document.createElement('div');
        singlePhaseContainer.className = 'single-phase-container';
        
        // Criar coluna única para a fase atual (SEM TÍTULO DUPLICADO)
        const roundColumn = document.createElement('div');
        roundColumn.className = 'round-column active current-phase';
        
        // REMOVIDO: roundHeader duplicado - o título já está no roundTitle principal
        
        const matchesContainer = document.createElement('div');
        matchesContainer.className = 'matches-container current-matches';
        
        // Adicionar atributo data-matches para CSS específico
        matchesContainer.setAttribute('data-matches', this.currentRound.length);
        
        // Renderizar confrontos da rodada atual
        console.log('Renderizando confrontos da rodada atual:', this.currentRound);
        this.currentRound.forEach((match, matchIndex) => {
            console.log(`Criando confronto ${matchIndex}:`, match);
            const matchElement = this.createMatchElement(match, matchIndex);
            matchesContainer.appendChild(matchElement);
        });
        
        // REMOVIDO: Partida de 3º lugar não deve aparecer junto com a final
        // A partida de 3º lugar é uma fase separada
        
        roundColumn.appendChild(matchesContainer);
        singlePhaseContainer.appendChild(roundColumn);
        
        container.appendChild(singlePhaseContainer);
    }

    /**
     * Adiciona coluna de 3º lugar
     */
    addThirdPlaceColumn(gridContainer) {
        const thirdPlaceColumn = document.createElement('div');
        thirdPlaceColumn.className = 'round-column third-place';
        
        const roundHeader = document.createElement('div');
        roundHeader.className = 'round-header third-place-header';
        roundHeader.textContent = '3º LUGAR';
        thirdPlaceColumn.appendChild(roundHeader);
        
        const matchesContainer = document.createElement('div');
        matchesContainer.className = 'matches-container';
        
        if (this.thirdPlaceMatch) {
            // Partida de 3º lugar já criada
            const matchElement = this.createMatchElement(this.thirdPlaceMatch, 0);
            matchElement.className = 'match third-place-match';
            matchesContainer.appendChild(matchElement);
        } else if (this.semifinalLosers && this.semifinalLosers.length === 2) {
            // Criar partida de 3º lugar com os perdedores da semifinal
            this.thirdPlaceMatch = {
                jogador1: this.semifinalLosers[0],
                jogador2: this.semifinalLosers[1]
            };
            const matchElement = this.createMatchElement(this.thirdPlaceMatch, 0);
            matchElement.className = 'match third-place-match';
            matchesContainer.appendChild(matchElement);
        } else {
            // Slot vazio aguardando semifinal
            const emptySlot = document.createElement('div');
            emptySlot.className = 'empty-slot third-place-slot';
            emptySlot.innerHTML = '<div class="player-name">Aguardando semifinal</div>';
            matchesContainer.appendChild(emptySlot);
        }
        
        thirdPlaceColumn.appendChild(matchesContainer);
        gridContainer.appendChild(thirdPlaceColumn);
    }

    /**
     * Renderiza vencedores das rodadas anteriores
     */
    renderPreviousWinners(container, roundIndex) {
        const totalPlayers = this.originalPlayers.length;
        const playersInRound = totalPlayers / Math.pow(2, roundIndex + 1);
        
        for (let i = 0; i < playersInRound; i++) {
            const winnerSlot = document.createElement('div');
            winnerSlot.className = 'winner-slot';
            winnerSlot.innerHTML = `
                <div class="player-name">Vencedor ${i + 1}</div>
            `;
            container.appendChild(winnerSlot);
        }
    }

    /**
     * Renderiza slots vazios para rodadas futuras
     */
    renderEmptySlots(container, roundIndex) {
        const totalPlayers = this.originalPlayers.length;
        const playersInRound = totalPlayers / Math.pow(2, roundIndex + 1);
        
        for (let i = 0; i < playersInRound; i++) {
            const emptySlot = document.createElement('div');
            emptySlot.className = 'empty-slot';
            emptySlot.innerHTML = `
                <div class="player-name">-</div>
            `;
            container.appendChild(emptySlot);
        }
    }

    /**
     * Cria elemento HTML para um confronto
     */
    createMatchElement(match, index) {
        const matchDiv = document.createElement('div');
        matchDiv.className = 'match';
        matchDiv.dataset.matchIndex = index;
        
        // Verificar se é partida de 3º lugar
        const isThirdPlace = this.thirdPlaceMatch && 
            this.thirdPlaceMatch.jogador1 === match.jogador1 && 
            this.thirdPlaceMatch.jogador2 === match.jogador2;
        const matchId = isThirdPlace ? `third-place-match_${Date.now()}_${index}` : `match_${Date.now()}_${index}`;
        matchDiv.dataset.matchId = matchId;
        
        console.log('=== DETECÇÃO PARTIDA 3º LUGAR ===');
        console.log('this.thirdPlaceMatch:', this.thirdPlaceMatch);
        console.log('match atual:', match);
        console.log('isThirdPlace:', isThirdPlace);
        console.log('isThirdPlaceActive:', this.isThirdPlaceActive);
        
        if (isThirdPlace) {
            matchDiv.classList.add('third-place-match');
            console.log('PARTIDA DE 3º LUGAR DETECTADA E CRIADA:', match);
        }
        
        if (Array.isArray(match)) {
            // Match é um array de jogadores (próximas rodadas)
            const player1Name = this.formatPlayerName(match[0]);
            matchDiv.innerHTML = `
                <div class="match-header">
                    <h3>Confronto ${index + 1}</h3>
                </div>
                <div class="players">
                    <div class="player winner">
                        <span class="player-name" ${this.isLongName(match[0]) ? 'data-long="true"' : ''}>${player1Name}</span>
                    </div>
                </div>
            `;
        } else {
            // Match é um objeto com jogador1 e jogador2 (primeira rodada)
            const player1Name = this.formatPlayerName(match.jogador1);
            const player2Name = this.formatPlayerName(match.jogador2);
            matchDiv.innerHTML = `
                <div class="match-header">
                    <h3>Confronto ${index + 1}</h3>
                </div>
                <div class="players">
                    <div class="player" data-player="1">
                        <span class="player-name" ${this.isLongName(match.jogador1) ? 'data-long="true"' : ''}>${player1Name}</span>
                        <button class="winner-btn" data-match-id="${matchId}" data-player="1">
                            ✓ Vencedor
                        </button>
                    </div>
                    <div class="vs">VS</div>
                    <div class="player" data-player="2">
                        <span class="player-name" ${this.isLongName(match.jogador2) ? 'data-long="true"' : ''}>${player2Name}</span>
                        <button class="winner-btn" data-match-id="${matchId}" data-player="2">
                            ✓ Vencedor
                        </button>
                    </div>
                </div>
            `;
        }
        
        return matchDiv;
    }

    /**
     * Seleciona o vencedor de um confronto
     */
    selectWinner(matchIndex, playerNumber) {
        if (!this.isTournamentActive) return;
        
        const match = this.currentRound[matchIndex];
        const winner = playerNumber === 1 ? match.jogador1 : match.jogador2;
        
        // Marcar vencedor visualmente
        const matchElement = document.querySelector(`[data-match-index="${matchIndex}"]`);
        const players = matchElement.querySelectorAll('.player');
        
        players.forEach((player, index) => {
            const playerNum = index + 1;
            if (playerNum === playerNumber) {
                player.classList.add('winner');
                player.classList.remove('loser');
            } else {
                player.classList.add('loser');
                player.classList.remove('winner');
            }
        });
        
        // Desabilitar botões do confronto
        const buttons = matchElement.querySelectorAll('.winner-btn');
        buttons.forEach(btn => btn.disabled = true);
        
        // Verificar se todos os confrontos foram decididos
        this.checkRoundCompletion();
    }

    /**
     * Seleciona vencedor usando ID único do confronto
     */
    selectWinnerById(matchId, playerNumber) {
        console.log('=== SELECT WINNER BY ID ===');
        console.log('Match ID:', matchId);
        console.log('Player Number:', playerNumber);
        console.log('Torneio ativo?', this.isTournamentActive);
        
        if (!this.isTournamentActive) {
            console.log('Torneio não está ativo, saindo...');
            return;
        }
        
        // Encontrar o confronto pelo ID
        const matchElement = document.querySelector(`[data-match-id="${matchId}"]`);
        console.log('Match Element encontrado:', matchElement);
        
        if (!matchElement) {
            console.log('Match element não encontrado!');
            return;
        }
        
        const matchIndex = parseInt(matchElement.dataset.matchIndex);
        console.log('Match Index:', matchIndex);
        
        // Verificar se é partida de 3º lugar
        const isThirdPlace = matchElement.classList.contains('third-place-match');
        console.log('É partida de 3º lugar?', isThirdPlace);
        
        if (isThirdPlace) {
            console.log('Processando partida de 3º lugar...');
            this.handleThirdPlaceSelection(matchElement, playerNumber);
            return;
        }
        
        // Verificar se é partida de 3º lugar pelo ID (backup)
        if (matchId.includes('third-place') || matchElement.closest('.third-place')) {
            console.log('Partida de 3º lugar detectada pelo ID/container...');
            this.handleThirdPlaceSelection(matchElement, playerNumber);
            return;
        }
        
        // Verificar se é partida final (não deve ter transição)
        const roundNames = this.getRoundNames(this.originalPlayers.length);
        const currentRoundName = roundNames[this.roundNumber - 1];
        const isFinal = currentRoundName === 'Final';
        console.log('É partida final?', isFinal);
        
        if (isFinal) {
            console.log('Processando partida final (sem transição)...');
            this.handleFinalSelection(matchElement, playerNumber);
            return;
        }
        
        const match = this.currentRound[matchIndex];
        console.log('Match atual:', match);
        
        if (!match) {
            console.log('Match não encontrado no currentRound!');
            return;
        }
        
        const winner = playerNumber === 1 ? match.jogador1 : match.jogador2;
        console.log('Vencedor selecionado:', winner);
        
        // Marcar vencedor visualmente
        const players = matchElement.querySelectorAll('.player');
        
        players.forEach((player, index) => {
            const playerNum = index + 1;
            if (playerNum === playerNumber) {
                player.classList.add('winner');
                player.classList.remove('loser');
            } else {
                player.classList.add('loser');
                player.classList.remove('winner');
            }
        });
        
        // Desabilitar botões do confronto
        const buttons = matchElement.querySelectorAll('.winner-btn');
        buttons.forEach(btn => btn.disabled = true);
        
        // Salvar estado após seleção de vencedor
        this.saveTournamentState();
        
        // Verificar se todos os confrontos foram decididos
        this.checkRoundCompletion();
        console.log('=== FIM SELECT WINNER ===');
    }

    /**
     * Verifica se a rodada foi completada
     */
    checkRoundCompletion() {
        const allMatches = document.querySelectorAll('.match');
        let completedMatches = 0;
        
        console.log('=== CHECK ROUND COMPLETION ===');
        console.log('Total de confrontos:', allMatches.length);
        
        allMatches.forEach(match => {
            const hasWinner = match.querySelector('.player.winner');
            if (hasWinner) {
                completedMatches++;
            }
        });
        
        console.log('Confrontos completados:', completedMatches);
        
        if (completedMatches === allMatches.length) {
            console.log('Todos os confrontos foram completados!');
            
            // Verificar se é partida de 3º lugar
            const thirdPlaceMatch = document.querySelector('.third-place-match');
            console.log('Partida de 3º lugar encontrada?', thirdPlaceMatch ? 'SIM' : 'NÃO');
            
            if (thirdPlaceMatch) {
                console.log('Partida de 3º lugar completada - AVANÇANDO PARA FINAL');
                console.log('isThirdPlaceActive:', this.isThirdPlaceActive);
                console.log('thirdPlaceMatch:', this.thirdPlaceMatch);
                // Avançar para a final após partida de 3º lugar
                this.advanceToFinal();
            } else {
                console.log('Avançando para próxima rodada...');
                this.advanceToNextRound();
            }
        }
        console.log('=== FIM CHECK ROUND ===');
    }

    /**
     * Avança para a próxima rodada
     */
    advanceToNextRound() {
        console.log('=== ADVANCE TO NEXT ROUND ===');
        
        // Coletar vencedores e perdedores
        const winners = [];
        const losers = [];
        const allMatches = document.querySelectorAll('.match');
        
        console.log('Total de confrontos na rodada:', allMatches.length);
        
        allMatches.forEach(match => {
            const winnerElement = match.querySelector('.player.winner .player-name');
            const loserElement = match.querySelector('.player.loser .player-name');
            
            if (winnerElement) {
                winners.push(winnerElement.textContent);
            }
            if (loserElement) {
                losers.push(loserElement.textContent);
            }
        });
        
        console.log('Vencedores:', winners);
        console.log('Perdedores:', losers);
        
        // Salvar perdedores da rodada atual
        const roundNames = this.getRoundNames(this.originalPlayers.length);
        const currentRoundName = roundNames[this.roundNumber - 1];
        
        console.log('Rodada atual:', currentRoundName, 'Número da rodada:', this.roundNumber);
        
        // Salvar perdedores baseado na rodada atual
        if (currentRoundName === 'Quartas de Final') {
            this.eliminatedByRoundName.quarterfinal = [...losers];
            console.log('Perdedores das quartas salvos:', this.eliminatedByRoundName.quarterfinal);
        } else if (currentRoundName === 'Oitavas de Final') {
            this.eliminatedByRoundName.round16 = [...losers];
            console.log('Perdedores das oitavas salvos:', this.eliminatedByRoundName.round16);
        } else if (currentRoundName === 'Eliminatórias') {
            this.eliminatedByRoundName.round64 = [...losers];
            console.log('Perdedores das eliminatórias salvos:', this.eliminatedByRoundName.round64);
        } else if (currentRoundName === 'Semifinal') {
            this.semifinalLosers = [...losers];
            this.semifinalWinners = [...winners];
            this.isThirdPlaceActive = true;
            console.log('Perdedores da semifinal salvos:', this.semifinalLosers);
            console.log('Vencedores da semifinal salvos:', this.semifinalWinners);
            
            // Criar partida de 3º lugar PRIMEIRO
            this.thirdPlaceMatch = {
                jogador1: this.semifinalLosers[0],
                jogador2: this.semifinalLosers[1]
            };
            console.log('Partida de 3º lugar criada:', this.thirdPlaceMatch);
            console.log('Perdedores da semifinal:', this.semifinalLosers);
            
            // Criar partida de 3º lugar como currentRound
            this.currentRound = [this.thirdPlaceMatch];
            console.log('Partida de 3º lugar definida como currentRound:', this.currentRound);
            console.log('isThirdPlaceActive:', this.isThirdPlaceActive);
            
            // Atualizar título para 3º lugar
            document.getElementById('roundTitle').textContent = 'Confronto 3º Lugar';
            
            this.roundNumber++;
            this.renderTournament();
            return;
        }
        
        // Se restou apenas 1 jogador, mostrar campeão
        if (winners.length === 1) {
            console.log('Apenas 1 vencedor restante, chamando showChampion...');
            console.log('Campeão:', winners[0]);
            this.showChampion(winners[0]);
            return;
        }
        
        // Se estamos na final (2 jogadores), também verificar se é a última rodada
        if (winners.length === 2 && this.roundNumber >= this.getRoundNames(this.originalPlayers.length).length) {
            console.log('Final completada, mas ainda há 2 vencedores. Isso não deveria acontecer.');
        }
        
        // Verificar se é a final (2 jogadores restantes)
        if (winners.length === 2) {
            console.log('Final detectada com 2 jogadores:', winners);
            // Criar confronto da final
            this.currentRound = [{
                jogador1: winners[0],
                jogador2: winners[1]
            }];
            
            console.log('Final criada:', this.currentRound);
            this.roundNumber++;
            this.renderTournament();
            console.log('=== FIM ADVANCE TO NEXT ROUND ===');
            return;
        }
        
        // Criar confrontos para próxima rodada
        this.currentRound = [];
        for (let i = 0; i < winners.length; i += 2) {
            this.currentRound.push({
                jogador1: winners[i],
                jogador2: winners[i + 1]
            });
        }
        
        console.log('Próxima rodada criada:', this.currentRound);
        
        this.roundNumber++;
        this.renderTournament();
        
        // Salvar estado após avançar rodada
        this.saveTournamentState();
        
        console.log('=== FIM ADVANCE TO NEXT ROUND ===');
    }

    /**
     * Mostra o campeão
     */
    showChampion(championName) {
        console.log('Mostrando campeão:', championName);
        
        // Salvar campeão
        this.champion = championName;
        
        // Mostrar campeão
        document.getElementById('championName').textContent = championName;
        document.getElementById('championSection').style.display = 'block';
        document.getElementById('tournamentSection').style.display = 'none';
        this.isTournamentActive = false;
        
        // Salvar estado final
        this.saveTournamentState();
    }

    /**
     * Cria partida de 3º lugar independente
     */
    createThirdPlaceMatch() {
        console.log('=== CREATE THIRD PLACE MATCH ===');
        console.log('Perdedores da semifinal:', this.semifinalLosers);
        
        // Criar partida de 3º lugar
        this.thirdPlaceMatch = {
            jogador1: this.semifinalLosers[0],
            jogador2: this.semifinalLosers[1]
        };
        
        console.log('Third place match criado:', this.thirdPlaceMatch);
        
        // Atualizar currentRound para incluir a partida de 3º lugar
        this.currentRound = [this.thirdPlaceMatch];
        
        // Atualizar título
        document.getElementById('roundTitle').textContent = 'Partida de 3º Lugar';
        
        // Manter torneio ativo para partida de 3º lugar
        this.isTournamentActive = true;
        
        // Renderizar a partida de 3º lugar
        this.renderTournament();
        
        console.log('Partida de 3º lugar criada com sucesso!');
        console.log('=== FIM CREATE THIRD PLACE ===');
    }

    /**
     * Mostra seção de sucesso
     */
    showSuccess(message) {
        const statusSection = document.getElementById('statusSection');
        const statusMessage = document.getElementById('statusMessage');
        
        statusMessage.textContent = message;
        statusMessage.className = 'success';
        statusSection.style.display = 'block';
        
        setTimeout(() => {
            statusSection.style.display = 'none';
        }, 3000);
    }

    /**
     * Mostra seção de erro
     */
    showError(message, details = null) {
        const errorSection = document.getElementById('errorSection');
        const errorMessage = document.getElementById('errorMessage');
        
        let errorText = message;
        if (details) {
            errorText += '\n\nDetalhes:';
            if (details.jogadores_encontrados) {
                errorText += `\n• Jogadores encontrados: ${details.jogadores_encontrados}`;
            }
            if (details.quantidade_necessaria) {
                errorText += `\n• Quantidade necessária: ${details.quantidade_necessaria}`;
            }
            if (details.faltam_jogadores) {
                errorText += `\n• Faltam: ${details.faltam_jogadores} jogadores`;
            }
        }
        
        errorMessage.textContent = errorText;
        errorSection.style.display = 'block';
    }

    /**
     * Mostra seção do torneio
     */
    showTournamentSection() {
        document.getElementById('tournamentSection').style.display = 'block';
    }

    /**
     * Mostra botão de reset
     */
    showResetButton() {
        document.getElementById('resetBtn').style.display = 'inline-block';
    }

    /**
     * Esconde todas as seções
     */
    hideSections() {
        document.getElementById('statusSection').style.display = 'none';
        document.getElementById('errorSection').style.display = 'none';
        document.getElementById('tournamentSection').style.display = 'none';
        document.getElementById('championSection').style.display = 'none';
        document.getElementById('rankingSection').style.display = 'none';
    }

    /**
     * Gerencia a partida de 3º lugar
     */
    handleThirdPlaceMatch() {
        if (!this.thirdPlaceMatch) return;
        
        // Encontrar o vencedor da partida de 3º lugar
        const thirdPlaceMatch = document.querySelector('.third-place-match');
        if (thirdPlaceMatch) {
            const winnerElement = thirdPlaceMatch.querySelector('.player.winner .player-name');
            if (winnerElement) {
                const thirdPlaceWinner = winnerElement.textContent;
                console.log('Vencedor do 3º lugar:', thirdPlaceWinner);
                
                // NÃO FAZER NADA - É APENAS UM RESULTADO FINAL
                // A partida de 3º lugar não deve ter transição alguma
                console.log('Partida de 3º lugar completada - sem transição');
            }
        }
    }

    /**
     * Processa seleção de vencedor da partida de 3º lugar
     */
    handleThirdPlaceSelection(matchElement, playerNumber) {
        console.log('=== HANDLE THIRD PLACE SELECTION ===');
        console.log('Match Element:', matchElement);
        console.log('Player Number:', playerNumber);
        
        if (!this.thirdPlaceMatch) {
            console.log('Third place match não existe!');
            return;
        }
        
        const winner = playerNumber === 1 ? this.thirdPlaceMatch.jogador1 : this.thirdPlaceMatch.jogador2;
        console.log('Vencedor do 3º lugar:', winner);
        
        // Salvar resultado do 3º lugar
        this.thirdPlace = winner;
        
        // Marcar vencedor visualmente
        const players = matchElement.querySelectorAll('.player');
        
        players.forEach((player, index) => {
            const playerNum = index + 1;
            if (playerNum === playerNumber) {
                player.classList.add('winner');
                player.classList.remove('loser');
            } else {
                player.classList.add('loser');
                player.classList.remove('winner');
            }
        });
        
        // Desabilitar botões do confronto
        const buttons = matchElement.querySelectorAll('.winner-btn');
        buttons.forEach(btn => btn.disabled = true);
        
        // Salvar estado após partida de 3º lugar
        this.saveTournamentState();
        
        console.log('Partida de 3º lugar completada - RESULTADO SALVO');
        
        // Verificar se todos os confrontos foram completados para avançar
        this.checkRoundCompletion();
        
        console.log('=== FIM HANDLE THIRD PLACE ===');
    }

    /**
     * Processa seleção de vencedor da partida final
     */
    handleFinalSelection(matchElement, playerNumber) {
        console.log('=== HANDLE FINAL SELECTION ===');
        console.log('Match Element:', matchElement);
        console.log('Player Number:', playerNumber);
        
        const matchIndex = parseInt(matchElement.dataset.matchIndex);
        const match = this.currentRound[matchIndex];
        
        if (!match) {
            console.log('Match final não encontrado!');
            return;
        }
        
        const winner = playerNumber === 1 ? match.jogador1 : match.jogador2;
        const loser = playerNumber === 1 ? match.jogador2 : match.jogador1;
        console.log('Vencedor da final:', winner);
        console.log('Segundo lugar:', loser);
        
        // Salvar resultados da final
        this.champion = winner;
        this.secondPlace = loser;
        
        // Marcar vencedor visualmente
        const players = matchElement.querySelectorAll('.player');
        
        players.forEach((player, index) => {
            const playerNum = index + 1;
            if (playerNum === playerNumber) {
                player.classList.add('winner');
                player.classList.remove('loser');
            } else {
                player.classList.add('loser');
                player.classList.remove('winner');
            }
        });
        
        // Desabilitar botões do confronto
        const buttons = matchElement.querySelectorAll('.winner-btn');
        buttons.forEach(btn => btn.disabled = true);
        
        // Salvar estado após final
        this.saveTournamentState();
        
        // Gerar classificação final após a final
        this.generateFinalRanking();
        
        console.log('Partida final completada - GERANDO CLASSIFICAÇÃO');
        console.log('=== FIM HANDLE FINAL ===');
    }

    /**
     * Avança para a final após partida de 3º lugar
     */
    advanceToFinal() {
        console.log('=== ADVANCE TO FINAL ===');
        console.log('semifinalLosers:', this.semifinalLosers);
        console.log('originalPlayers:', this.originalPlayers);
        
        // CORRIGIDO: Encontrar vencedores da semifinal de forma mais precisa
        // Os vencedores da semifinal são os que NÃO estão nos perdedores da semifinal
        // mas que estavam na semifinal (não todos os jogadores originais)
        
        // Primeiro, vamos encontrar quem estava na semifinal
        // Na semifinal temos 4 jogadores: 2 vencem, 2 perdem
        // Os vencedores são os que não estão nos perdedores
        
        // Vamos usar uma abordagem diferente: salvar os vencedores da semifinal
        // quando a semifinal for completada
        const semifinalWinners = this.semifinalWinners || [];
        
        console.log('Vencedores da semifinal salvos:', semifinalWinners);
        
        if (semifinalWinners.length !== 2) {
            console.log('ERRO: Não temos 2 vencedores da semifinal salvos!');
            console.log('Vencedores encontrados:', semifinalWinners.length);
            console.log('Vencedores:', semifinalWinners);
            return;
        }
        
        // Criar confronto da final
        this.currentRound = [{
            jogador1: semifinalWinners[0],
            jogador2: semifinalWinners[1]
        }];
        
        console.log('Final criada:', this.currentRound);
        
        // Atualizar título
        document.getElementById('roundTitle').textContent = 'Final';
        
        // Desativar partida de 3º lugar
        this.isThirdPlaceActive = false;
        
        // Renderizar a final
        this.renderTournament();
        
        console.log('=== FIM ADVANCE TO FINAL ===');
    }

    /**
     * Mostra resultados finais (campeão e 3º lugar)
     */
    showFinalResults(thirdPlaceWinner) {
        // Pegar o nome do campeão da final (último vencedor do torneio principal)
        const championName = this.getChampionName();
        
        // Atualizar seção do campeão para incluir 3º lugar
        const championSection = document.getElementById('championSection');
        championSection.innerHTML = `
            <div class="champion-card">
                <h2>🏆 CAMPEÃO 🏆</h2>
                <div id="championName">${championName}</div>
            </div>
            <div class="third-place-card">
                <h2>🥉 3º LUGAR 🥉</h2>
                <div id="thirdPlaceName">${thirdPlaceWinner}</div>
            </div>
        `;
        
        championSection.style.display = 'block';
        document.getElementById('tournamentSection').style.display = 'none';
        this.isTournamentActive = false;
    }

    /**
     * Obtém o nome do campeão
     */
    getChampionName() {
        // Se temos perdedores da semifinal, o campeão é o vencedor da final
        // Vamos assumir que o campeão é o último vencedor do torneio principal
        if (this.semifinalLosers && this.semifinalLosers.length === 2) {
            // O campeão é o vencedor da final (não está nos perdedores da semifinal)
            const allPlayers = this.originalPlayers;
            const semifinalLosers = this.semifinalLosers;
            const champion = allPlayers.find(player => !semifinalLosers.includes(player));
            return champion || 'Campeão';
        }
        return 'Campeão';
    }

    /**
     * Coleta resultados de uma rodada
     */
    collectRoundResults() {
        const allMatches = document.querySelectorAll('.match');
        const roundResults = [];
        
        allMatches.forEach(match => {
            const winnerElement = match.querySelector('.player.winner .player-name');
            const loserElement = match.querySelector('.player.loser .player-name');
            
            if (winnerElement && loserElement) {
                const winner = winnerElement.textContent;
                const loser = loserElement.textContent;
                
                // Registrar eliminação
                this.eliminatedByRound[loser] = this.roundNumber;
                
                roundResults.push({
                    winner: winner,
                    loser: loser,
                    round: this.roundNumber
                });
            }
        });
        
        this.tournamentResults.push(...roundResults);
        console.log('Resultados da rodada coletados:', roundResults);
        console.log('Eliminados por rodada:', this.eliminatedByRound);
    }

    /**
     * Gera a classificação final do torneio
     */
    generateFinalRanking() {
        console.log('=== GERANDO CLASSIFICAÇÃO FINAL ===');
        
        // Coletar todos os resultados
        this.collectAllResults();
        
        // Criar ranking baseado nos resultados
        this.finalRanking = this.createRanking();
        
        // Exibir tela de classificação
        this.showFinalRanking();
        
        console.log('Classificação final gerada:', this.finalRanking);
        console.log('=== FIM CLASSIFICAÇÃO FINAL ===');
    }

    /**
     * Coleta todos os resultados do torneio
     */
    collectAllResults() {
        // Limpar resultados anteriores
        this.tournamentResults = [];
        this.eliminatedByRound = {};
        
        // Reconstruir eliminações baseado nos jogadores originais e resultados conhecidos
        this.reconstructEliminations();
        
        console.log('Todos os resultados coletados:', this.tournamentResults);
        console.log('Eliminados por rodada:', this.eliminatedByRound);
    }

    /**
     * Reconstrói as eliminações baseado nos jogadores originais
     */
    reconstructEliminations() {
        const allPlayers = [...this.originalPlayers];
        const totalPlayers = allPlayers.length;
        
        console.log('=== RECONSTRUINDO ELIMINAÇÕES ===');
        console.log('Jogadores originais:', allPlayers);
        console.log('Total de jogadores:', totalPlayers);
        console.log('Campeão:', this.champion);
        console.log('Vice:', this.secondPlace);
        console.log('3º lugar:', this.thirdPlace);
        console.log('Perdedores da semifinal:', this.semifinalLosers);
        console.log('Eliminados por rodada:', this.eliminatedByRoundName);
        
        // Limpar eliminações anteriores
        this.eliminatedByRound = {};
        
        // Adicionar perdedores da semifinal (4º lugar)
        if (this.semifinalLosers && this.semifinalLosers.length === 2) {
            this.semifinalLosers.forEach(player => {
                this.eliminatedByRound[player] = 'semifinal';
            });
            console.log('Perdedores da semifinal (4º lugar):', this.semifinalLosers);
        }
        
        // Adicionar perdedores das quartas (5º lugar)
        if (this.eliminatedByRoundName.quarterfinal && this.eliminatedByRoundName.quarterfinal.length > 0) {
            this.eliminatedByRoundName.quarterfinal.forEach(player => {
                this.eliminatedByRound[player] = 'quarterfinal';
            });
            console.log('Perdedores das quartas (5º lugar):', this.eliminatedByRoundName.quarterfinal);
        }
        
        // Adicionar perdedores das oitavas (6º lugar)
        if (this.eliminatedByRoundName.round16 && this.eliminatedByRoundName.round16.length > 0) {
            this.eliminatedByRoundName.round16.forEach(player => {
                this.eliminatedByRound[player] = 'round16';
            });
            console.log('Perdedores das oitavas (6º lugar):', this.eliminatedByRoundName.round16);
        }
        
        // Adicionar perdedores das eliminatórias (7º lugar)
        if (this.eliminatedByRoundName.round64 && this.eliminatedByRoundName.round64.length > 0) {
            this.eliminatedByRoundName.round64.forEach(player => {
                this.eliminatedByRound[player] = 'round64';
            });
            console.log('Perdedores das eliminatórias (7º lugar):', this.eliminatedByRoundName.round64);
        }
        
        // Verificar se todos os jogadores foram classificados
        const classifiedPlayers = new Set();
        classifiedPlayers.add(this.champion);
        classifiedPlayers.add(this.secondPlace);
        classifiedPlayers.add(this.thirdPlace);
        Object.keys(this.eliminatedByRound).forEach(player => classifiedPlayers.add(player));
        
        const unclassifiedPlayers = allPlayers.filter(player => !classifiedPlayers.has(player));
        if (unclassifiedPlayers.length > 0) {
            console.log('⚠️ JOGADORES NÃO CLASSIFICADOS:', unclassifiedPlayers);
            // Classificar jogadores não classificados como 6º lugar (oitavas)
            unclassifiedPlayers.forEach(player => {
                this.eliminatedByRound[player] = 'round16';
                console.log(`Classificando ${player} como 6º lugar (oitavas)`);
            });
        }
        
        console.log('Eliminações reconstruídas:', this.eliminatedByRound);
        console.log('=== FIM RECONSTRUÇÃO ===');
    }

    /**
     * Determina em qual rodada um jogador foi eliminado
     */
    determineEliminationRound(matchElement) {
        // Se é partida de 3º lugar, é rodada especial
        if (matchElement.classList.contains('third-place-match')) {
            return 'third-place';
        }
        
        // Obter nome da rodada atual
        const roundNames = this.getRoundNames(this.originalPlayers.length);
        const currentRoundName = roundNames[this.roundNumber - 1];
        
        // Mapear nomes das rodadas para identificadores
        const roundMapping = {
            'Final': 'semifinal',           // Perdeu na semifinal (vai para 4º lugar)
            'Semifinal': 'quarterfinal',    // Perdeu nas quartas (vai para 5º lugar)
            'Quartas de Final': 'quarterfinal',  // Perdeu nas quartas (vai para 5º lugar)
            'Oitavas de Final': 'round16',  // Perdeu nas oitavas (vai para 6º lugar)
            'Eliminatórias': 'round64'      // Perdeu nas eliminatórias (vai para 7º lugar)
        };
        
        return roundMapping[currentRoundName] || 'round16';
    }

    /**
     * Cria o ranking final baseado nos resultados
     */
    createRanking() {
        const ranking = [];
        const addedPlayers = new Set(); // Para evitar duplicatas
        
        console.log('=== CRIANDO RANKING (APENAS TOP 4) ===');
        console.log('Campeão:', this.champion);
        console.log('Vice:', this.secondPlace);
        console.log('3º lugar:', this.thirdPlace);
        console.log('Eliminados por rodada:', this.eliminatedByRound);
        
        // 1º lugar - Campeão
        if (this.champion) {
            ranking.push({ 
                position: 1, 
                player: this.champion, 
                medal: '🥇',
                status: '🏆 CAMPEÃO'
            });
            addedPlayers.add(this.champion);
            console.log('Adicionado campeão:', this.champion);
        }
        
        // 2º lugar - Vice-campeão
        if (this.secondPlace) {
            ranking.push({ 
                position: 2, 
                player: this.secondPlace, 
                medal: '🥈',
                status: '🥈 VICE-CAMPEÃO'
            });
            addedPlayers.add(this.secondPlace);
            console.log('Adicionado vice:', this.secondPlace);
        }
        
        // 3º lugar - verificar se temos resultado da partida de 3º lugar
        if (this.thirdPlace) {
            ranking.push({ 
                position: 3, 
                player: this.thirdPlace, 
                medal: '🥉',
                status: '🥉 3º LUGAR'
            });
            addedPlayers.add(this.thirdPlace);
            console.log('Adicionado 3º lugar:', this.thirdPlace);
        } else if (this.semifinalLosers && this.semifinalLosers.length === 2) {
            // Se não temos 3º lugar definido, mas temos perdedores da semifinal,
            // vamos assumir que o 3º lugar é o primeiro perdedor da semifinal
            const thirdPlacePlayer = this.semifinalLosers[0];
            ranking.push({ 
                position: 3, 
                player: thirdPlacePlayer, 
                medal: '🥉',
                status: '🥉 3º LUGAR'
            });
            addedPlayers.add(thirdPlacePlayer);
            console.log('Adicionado 3º lugar (primeiro perdedor da semifinal):', thirdPlacePlayer);
        }
        
        // 4º lugar - Apenas perdedores da semifinal que não são 3º lugar
        if (this.semifinalLosers && this.semifinalLosers.length === 2) {
            this.semifinalLosers.forEach(player => {
                if (!addedPlayers.has(player)) {
                    ranking.push({
                        position: 4,
                        player: player,
                        medal: '🏅',
                        status: '4º LUGAR'
                    });
                    addedPlayers.add(player);
                    console.log(`Adicionado ${player} na 4º posição`);
                }
            });
        }
        
        console.log('Ranking final criado (apenas top 4):', ranking);
        console.log('=== FIM CRIAÇÃO RANKING ===');
        
        return ranking;
    }

    /**
     * Agrupa jogadores por fase de eliminação
     */
    groupPlayersByEliminationRound() {
        const groups = {};
        
        // Adicionar jogadores eliminados
        Object.entries(this.eliminatedByRound).forEach(([player, round]) => {
            if (!groups[round]) {
                groups[round] = [];
            }
            groups[round].push(player);
        });
        
        return groups;
    }

    /**
     * Retorna a posição para uma fase de eliminação
     */
    getPositionForEliminationRound(round) {
        const totalPlayers = this.originalPlayers.length;
        
        // Determinar posições baseadas no número de jogadores
        let position = 4; // Começar do 4º lugar
        
        // Mapear fases para posições baseadas no número de jogadores
        if (totalPlayers >= 32) {
            // 32 jogadores: eliminatórias -> oitavas -> quartas -> semifinal
            const positionMap = {
                'round64': 7,        // 7º lugar - eliminados nas eliminatórias
                'round16': 6,        // 6º lugar - eliminados nas oitavas
                'quarterfinal': 5,   // 5º lugar - eliminados nas quartas
                'semifinal': 4       // 4º lugar - eliminados na semifinal
            };
            return positionMap[round] || 7;
        } else if (totalPlayers >= 16) {
            // 16 jogadores: oitavas -> quartas -> semifinal
            const positionMap = {
                'round16': 6,        // 6º lugar - eliminados nas oitavas
                'quarterfinal': 5,   // 5º lugar - eliminados nas quartas
                'semifinal': 4       // 4º lugar - eliminados na semifinal
            };
            return positionMap[round] || 6;
        } else if (totalPlayers >= 8) {
            // 8 jogadores: quartas -> semifinal
            const positionMap = {
                'quarterfinal': 5,   // 5º lugar - eliminados nas quartas
                'semifinal': 4       // 4º lugar - eliminados na semifinal
            };
            return positionMap[round] || 5;
        } else {
            // 4 jogadores: apenas semifinal
            const positionMap = {
                'semifinal': 4       // 4º lugar - eliminados na semifinal
            };
            return positionMap[round] || 4;
        }
    }

    /**
     * Obtém lista de jogadores eliminados
     */
    getEliminatedPlayers() {
        const allPlayers = [...this.originalPlayers];
        const eliminated = [];
        
        // Remover campeão, vice e 3º lugar
        const topPlayers = [this.champion, this.secondPlace, this.thirdPlace].filter(Boolean);
        
        allPlayers.forEach(player => {
            if (!topPlayers.includes(player)) {
                eliminated.push(player);
            }
        });
        
        return eliminated;
    }

    /**
     * Retorna emoji da posição
     */
    getPositionMedal(position) {
        if (position <= 3) return ['🥇', '🥈', '🥉'][position - 1];
        if (position <= 8) return '🏅';
        return '📊';
    }

    /**
     * Exibe a tela de classificação final
     */
    showFinalRanking() {
        // Esconder seção do torneio
        document.getElementById('tournamentSection').style.display = 'none';
        document.getElementById('championSection').style.display = 'none';
        
        // Mostrar seção de classificação
        document.getElementById('rankingSection').style.display = 'block';
        
        // Preencher dados da classificação
        this.populateRankingTable();
        
        // Desativar torneio
        this.isTournamentActive = false;
    }

    /**
     * Preenche a tabela de classificação
     */
    populateRankingTable() {
        const rankingTable = document.getElementById('rankingTable');
        const tbody = rankingTable.querySelector('tbody');
        
        console.log('=== POPULANDO TABELA DE RANKING ===');
        console.log('Final ranking:', this.finalRanking);
        
        // Limpar tabela
        tbody.innerHTML = '';
        
        // Agrupar por posição para mostrar posições iguais
        const groupedRanking = this.groupRankingByPosition();
        console.log('Ranking agrupado:', groupedRanking);
        
        // Adicionar cada grupo de posição
        Object.keys(groupedRanking).sort((a, b) => parseInt(a) - parseInt(b)).forEach(position => {
            const players = groupedRanking[position];
            console.log(`Processando posição ${position}:`, players);
            
            players.forEach((entry, index) => {
                const row = document.createElement('tr');
                row.className = `ranking-row position-${entry.position}`;
                
                // Mostrar posição apenas no primeiro jogador do grupo
                const positionDisplay = index === 0 ? `${entry.position}º` : '';
                
                console.log(`Adicionando jogador: ${entry.player} na posição ${entry.position} (display: ${positionDisplay})`);
                
                row.innerHTML = `
                    <td class="position">${positionDisplay}</td>
                    <td class="medal">${entry.medal}</td>
                    <td class="player-name">${entry.player}</td>
                `;
                
                tbody.appendChild(row);
            });
        });
        
        console.log('=== FIM POPULAÇÃO TABELA ===');
    }

    /**
     * Agrupa o ranking por posição
     */
    groupRankingByPosition() {
        const grouped = {};
        
        this.finalRanking.forEach(entry => {
            if (!grouped[entry.position]) {
                grouped[entry.position] = [];
            }
            grouped[entry.position].push(entry);
        });
        
        return grouped;
    }

    /**
     * Retorna status da posição
     */
    getPositionStatus(position) {
        if (position === 1) return '🏆 CAMPEÃO';
        if (position === 2) return '🥈 VICE-CAMPEÃO';
        if (position === 3) return '🥉 3º LUGAR';
        if (position <= 8) return 'Classificado';
        return 'Participante';
    }

    /**
     * Gera as linhas para impressão
     */
    generatePrintRows() {
        const groupedRanking = this.groupRankingByPosition();
        let html = '';
        
        Object.keys(groupedRanking).sort((a, b) => parseInt(a) - parseInt(b)).forEach(position => {
            const players = groupedRanking[position];
            
            players.forEach((entry, index) => {
                const positionDisplay = index === 0 ? `${entry.position}º` : '';
                html += `
                    <tr class="position-${entry.position}">
                        <td>${positionDisplay}</td>
                        <td>${entry.medal}</td>
                        <td>${entry.player}</td>
                    </tr>
                `;
            });
        });
        
        return html;
    }

    /**
     * Imprime a classificação final
     */
    printRanking() {
        // Criar uma nova janela para impressão
        const printWindow = window.open('', '_blank');
        
        // HTML para impressão
        const printContent = `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Classificação Final - Campeonato 1x1 - GTS 2025</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { text-align: center; color: #2c3e50; }
                    h2 { text-align: center; color: #495057; margin-bottom: 30px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { padding: 12px; text-align: left; border: 1px solid #ddd; }
                    th { background-color: #f8f9fa; font-weight: bold; }
                    .position-1 { background-color: #ffd700; }
                    .position-2 { background-color: #c0c0c0; }
                    .position-3 { background-color: #cd7f32; }
                    .footer { text-align: center; margin-top: 30px; color: #6c757d; }
                </style>
            </head>
            <body>
                <h1>🏆 CAMPEONATO 1x1 - GTS 2025 🏆</h1>
                <h2>CLASSIFICAÇÃO FINAL</h2>
                
                <table>
                    <thead>
                        <tr>
                            <th>Posição</th>
                            <th>Medalha</th>
                            <th>Jogador</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.generatePrintRows()}
                    </tbody>
                </table>
                
                <div class="footer">
                    <p>Desenvolvido para GTS 2025 - Sistema de Torneio</p>
                    <p>Data: ${new Date().toLocaleDateString('pt-BR')}</p>
                </div>
            </body>
            </html>
        `;
        
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    }

    /**
     * Verifica se um nome é muito longo
     */
    isLongName(name) {
        return name && name.length > 15;
    }

    /**
     * Formata o nome do jogador para exibição
     */
    formatPlayerName(name) {
        if (!name) return '';
        
        // Se o nome for muito longo, truncar mas manter legibilidade
        if (name.length > 20) {
            return name.substring(0, 17) + '...';
        }
        
        return name;
    }

    /**
     * Reinicia o torneio
     */
    async resetTournament() {
        this.currentRound = [];
        this.roundNumber = 1;
        this.totalRounds = 0;
        this.originalPlayers = [];
        this.isTournamentActive = false;
        this.semifinalLosers = [];
        this.semifinalWinners = [];
        this.thirdPlaceMatch = null;
        this.isThirdPlaceActive = false;
        
        // Limpar dados de classificação
        this.tournamentResults = [];
        this.finalRanking = [];
        this.champion = null;
        this.secondPlace = null;
        this.thirdPlace = null;
        this.eliminatedByRound = {};
        
        // Limpar dados de eliminações por rodada
        this.eliminatedByRoundName = {
            'quarterfinal': [],
            'round16': [],
            'round64': []
        };
        
        // Limpar dados salvos
        await this.clearSavedTournament();
        
        this.hideSections();
        document.getElementById('resetBtn').style.display = 'none';
        
        // Mostrar mensagem de confirmação
        this.showSuccess('Torneio reiniciado com sucesso!');
    }
}

// Inicializar o gerenciador do torneio
const tournament = new TournamentManager();

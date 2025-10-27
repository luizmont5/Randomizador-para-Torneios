<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🏆 Campeonato 1x1 - GTS 2025</title>
    <link rel="stylesheet" href="assets/style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>🏆 Campeonato 1x1 - GTS 2025</h1>
            <p>Sistema de Sorteio e Gerenciamento de Torneio</p>
        </header>

        <main>
            <!-- Seção de Controle -->
            <section class="controls">
                <button id="sortearBtn" class="btn-primary">
                    🎲 Sortear Duelos
                </button>
                <button id="resetBtn" class="btn-secondary" style="display: none;">
                    🔄 Reiniciar Torneio
                </button>
            </section>

            <!-- Seção de Status -->
            <section id="statusSection" class="status" style="display: none;">
                <div id="statusMessage"></div>
            </section>

            <!-- Seção de Erro -->
            <section id="errorSection" class="error" style="display: none;">
                <div id="errorMessage"></div>
            </section>

            <!-- Container do Torneio -->
            <section id="tournamentSection" class="tournament" style="display: none;">
                <h2 id="roundTitle">Torneio</h2>
                <div id="tournamentContainer"></div>
            </section>

            <!-- Seção do Campeão -->
            <section id="championSection" class="champion" style="display: none;">
                <div class="champion-card">
                    <h2>🏆 CAMPEÃO 🏆</h2>
                    <div id="championName"></div>
                </div>
            </section>

            <!-- Seção de Classificação Final -->
            <section id="rankingSection" class="ranking" style="display: none;">
                <div class="ranking-container">
                    <h2>🏆 CLASSIFICAÇÃO FINAL 🏆</h2>
                    <p class="ranking-subtitle">Resultado do Campeonato 1x1 - GTS 2025</p>
                    
                    <div class="ranking-table-container">
                        <table id="rankingTable" class="ranking-table">
                            <thead>
                                <tr>
                                    <th class="position-header">Posição</th>
                                    <th class="medal-header">Medalha</th>
                                    <th class="player-header">Jogador</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Dados serão preenchidos via JavaScript -->
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="ranking-actions">
                        <button id="newTournamentBtn" class="btn-primary">
                            🎲 Novo Torneio
                        </button>
                        <button id="printRankingBtn" class="btn-secondary">
                            🖨️ Imprimir Classificação
                        </button>
                    </div>
                </div>
            </section>
        </main>

        <footer>
            <p>Desenvolvido para GTS 2025 - Sistema de Torneio</p>
        </footer>
    </div>

    <script src="assets/script.js"></script>
</body>
</html>

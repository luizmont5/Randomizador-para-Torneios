<?php
/**
 * Arquivo para carregar o estado do torneio do servidor
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

try {
    // Nome do arquivo de backup
    $backupFile = 'tournament_backup.json';
    
    // Verificar se o arquivo existe
    if (!file_exists($backupFile)) {
        echo json_encode([
            'success' => false,
            'message' => 'Nenhum torneio salvo encontrado'
        ]);
        exit;
    }
    
    // Ler dados do arquivo
    $content = file_get_contents($backupFile);
    if ($content === false) {
        throw new Exception('Erro ao ler arquivo de backup');
    }
    
    $tournamentData = json_decode($content, true);
    if (!$tournamentData) {
        throw new Exception('Dados do torneio corrompidos');
    }
    
    // Verificar se o torneio ainda está ativo ou se tem resultados
    $isActive = isset($tournamentData['isTournamentActive']) && $tournamentData['isTournamentActive'];
    $hasResults = isset($tournamentData['champion']) && !empty($tournamentData['champion']);
    
    if (!$isActive && !$hasResults) {
        echo json_encode([
            'success' => false,
            'message' => 'Torneio não está ativo e não possui resultados'
        ]);
        exit;
    }
    
    // Resposta de sucesso
    echo json_encode([
        'success' => true,
        'message' => 'Torneio carregado com sucesso',
        'tournament' => $tournamentData,
        'loadedAt' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro ao carregar torneio: ' . $e->getMessage()
    ]);
}
?>

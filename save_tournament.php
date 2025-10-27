<?php
/**
 * Arquivo para salvar o estado do torneio no servidor
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Verificar se é uma requisição POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
    exit;
}

try {
    // Obter dados do POST
    $input = file_get_contents('php://input');
    $tournamentData = json_decode($input, true);
    
    if (!$tournamentData) {
        throw new Exception('Dados do torneio inválidos');
    }
    
    // Gerar ID único para o torneio se não existir
    if (!isset($tournamentData['tournamentId']) || empty($tournamentData['tournamentId'])) {
        $tournamentData['tournamentId'] = 'tournament_' . time() . '_' . uniqid();
    }
    
    // Adicionar timestamp de salvamento
    $tournamentData['savedAt'] = date('Y-m-d H:i:s');
    
    // Nome do arquivo de backup
    $backupFile = 'tournament_backup.json';
    
    // Salvar dados no arquivo
    $result = file_put_contents($backupFile, json_encode($tournamentData, JSON_PRETTY_PRINT));
    
    if ($result === false) {
        throw new Exception('Erro ao salvar arquivo de backup');
    }
    
    // Resposta de sucesso
    echo json_encode([
        'success' => true,
        'message' => 'Torneio salvo com sucesso',
        'tournamentId' => $tournamentData['tournamentId'],
        'savedAt' => $tournamentData['savedAt']
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro ao salvar torneio: ' . $e->getMessage()
    ]);
}
?>

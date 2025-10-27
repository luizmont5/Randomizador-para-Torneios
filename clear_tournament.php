<?php
/**
 * Arquivo para limpar o backup do torneio no servidor
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
    // Nome do arquivo de backup
    $backupFile = 'tournament_backup.json';
    
    // Verificar se o arquivo existe e removê-lo
    if (file_exists($backupFile)) {
        $result = unlink($backupFile);
        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Backup do torneio removido com sucesso'
            ]);
        } else {
            throw new Exception('Erro ao remover arquivo de backup');
        }
    } else {
        echo json_encode([
            'success' => true,
            'message' => 'Nenhum backup encontrado para remover'
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro ao limpar backup: ' . $e->getMessage()
    ]);
}
?>

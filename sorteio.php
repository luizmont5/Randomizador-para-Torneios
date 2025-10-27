<?php
header('Content-Type: application/json; charset=utf-8');

/**
 * Função para verificar se um número é potência de 2
 */
function isPowerOfTwo($n) {
    return $n > 0 && ($n & ($n - 1)) == 0;
}

/**
 * Função para encontrar a próxima potência de 2
 */
function nextPowerOfTwo($n) {
    if ($n <= 0) return 1;
    return pow(2, ceil(log($n, 2)));
}

try {
    // Caminho para o arquivo CSV
    $csvFile = 'CAMPEONATO 1x1 VALORANT - GTS 2025 (respostas) - Respostas ao formulário 1.csv';
    
    // Verificar se o arquivo existe
    if (!file_exists($csvFile)) {
        throw new Exception('Arquivo CSV não encontrado!');
    }
    
    // Ler o arquivo CSV
    $handle = fopen($csvFile, 'r');
    if (!$handle) {
        throw new Exception('Erro ao abrir o arquivo CSV!');
    }
    
    $jogadores = [];
    $linha = 0;
    
    // Ler linha por linha
    while (($data = fgetcsv($handle, 1000, ',')) !== FALSE) {
        $linha++;
        
        // Pular a primeira linha (cabeçalho)
        if ($linha === 1) {
            continue;
        }
        
        // Verificar se a linha tem dados suficientes
        if (count($data) >= 3 && !empty(trim($data[2]))) {
            $nome = trim($data[2]);
            if (!empty($nome)) {
                $jogadores[] = $nome;
            }
        }
    }
    
    fclose($handle);
    
    // Verificar se encontrou jogadores
    if (empty($jogadores)) {
        throw new Exception('Nenhum jogador encontrado no arquivo CSV!');
    }
    
    $quantidadeJogadores = count($jogadores);
    
    // Verificar se a quantidade é potência de 2
    if (!isPowerOfTwo($quantidadeJogadores)) {
        $proximaPotencia = nextPowerOfTwo($quantidadeJogadores);
        $faltam = $proximaPotencia - $quantidadeJogadores;
        
        $response = [
            'erro' => true,
            'mensagem' => "Quantidade de jogadores inválida!",
            'detalhes' => [
                'jogadores_encontrados' => $quantidadeJogadores,
                'quantidade_necessaria' => $proximaPotencia,
                'faltam_jogadores' => $faltam,
                'jogadores_atual' => $jogadores
            ]
        ];
        
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    // Embaralhar os jogadores aleatoriamente
    shuffle($jogadores);
    
    // Criar os confrontos (pares)
    $confrontos = [];
    for ($i = 0; $i < count($jogadores); $i += 2) {
        $confrontos[] = [
            'jogador1' => $jogadores[$i],
            'jogador2' => $jogadores[$i + 1]
        ];
    }
    
    // Resposta de sucesso
    $response = [
        'erro' => false,
        'jogadores' => $jogadores,
        'confrontos' => $confrontos,
        'total_jogadores' => $quantidadeJogadores,
        'total_confrontos' => count($confrontos)
    ];
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    $response = [
        'erro' => true,
        'mensagem' => $e->getMessage()
    ];
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
}
?>

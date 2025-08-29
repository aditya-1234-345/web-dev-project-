<?php
header('Content-Type: application/json');
require 'config.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success'=>false,'message'=>'Invalid request']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$mail  = trim($input['email']    ?? '');
$pass  =        $input['password'] ?? '';

if (!$mail || !$pass) {
    echo json_encode(['success'=>false,'message'=>'Email & password required']);
    exit;
}

$stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
$stmt->execute([$mail]);
$user = $stmt->fetch();

if ($user && password_verify($pass, $user['password'])) {
    $_SESSION['logged_in'] = true;
    $_SESSION['user_id']   = $user['id'];
    $_SESSION['user_name'] = $user['full_name'];
    $_SESSION['user_email']= $user['email'];

    echo json_encode([
        'success'=>true,
        'message'=>'Login successful',
        'user'=>[
            'id'=>$user['id'],
            'name'=>$user['full_name'],
            'email'=>$user['email']
        ]
    ]);
} else {
    echo json_encode(['success'=>false,'message'=>'User not found']);
}
?>
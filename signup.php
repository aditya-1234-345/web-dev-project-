<?php
header('Content-Type: application/json');
require 'config.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success'=>false,'message'=>'Invalid request']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$full  = trim($input['fullName'] ?? '');
$mail  = trim($input['email']    ?? '');
$phone = trim($input['phone']    ?? '');
$pass  =        $input['password'] ?? '';

if (!$full || !$mail || !$phone || !$pass) {
    echo json_encode(['success'=>false,'message'=>'All fields are required']);
    exit;
}
if (!filter_var($mail, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success'=>false,'message'=>'Invalid e-mail']);
    exit;
}
if (strlen($pass) < 6) {
    echo json_encode(['success'=>false,'message'=>'Password too short']);
    exit;
}

try {
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$mail]);
    if ($stmt->rowCount()) {
        echo json_encode(['success'=>false,'message'=>'User already exists']);
        exit;
    }

    $hash = password_hash($pass, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare('INSERT INTO users (full_name,email,phone,password) VALUES (?,?,?,?)');
    $stmt->execute([$full,$mail,$phone,$hash]);

    $_SESSION['logged_in'] = true;
    $_SESSION['user_id']   = $pdo->lastInsertId();
    $_SESSION['user_name'] = $full;
    $_SESSION['user_email']= $mail;

    echo json_encode([
        'success'=>true,
        'message'=>'Account created successfully',
        'user'=>[
            'id'=>$_SESSION['user_id'],
            'name'=>$full,
            'email'=>$mail
        ]
    ]);
} catch (PDOException $e) {
    echo json_encode(['success'=>false,'message'=>'Database error']);
}
?>

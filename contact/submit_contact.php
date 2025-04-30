<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../db.php';

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'All fields are required'
    ]);
    exit;
}

if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid email format'
    ]);
    exit;
}

try {
    // Prepare SQL statement
    $stmt = $conn->prepare("INSERT INTO contact_messages (name, email, message, submitted_at) VALUES (?, ?, ?, NOW())");
    
    // Bind parameters
    $stmt->bind_param("sss", $data['name'], $data['email'], $data['message']);
    
    // Execute query
    if ($stmt->execute()) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Message sent successfully'
        ]);
    } else {
        throw new Exception("Failed to insert message");
    }
    
    $stmt->close();
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to send message. Please try again later.'
    ]);
}

$conn->close();
?>
<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set proper CORS headers for React frontend
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'status' => 'error',
        'message' => 'Only POST method is allowed'
    ]);
    exit;
}

include '../db.php';

// Get raw POST data
$input = file_get_contents('php://input');

// Verify input is not empty
if (empty($input)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'No data received'
    ]);
    exit;
}

// Attempt to decode JSON
$data = json_decode($input, true);

// Check if JSON decoding failed
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid JSON data received: ' . json_last_error_msg()
    ]);
    exit;
}

// Extract and sanitize data
$title = isset($data['title']) ? trim($data['title']) : '';
$description = isset($data['description']) ? trim($data['description']) : '';

// Validate required fields
if (empty($title)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Title is required'
    ]);
    exit;
}

// Additional validation
if (strlen($title) > 255) { // Assuming title has a VARCHAR(255) constraint
    echo json_encode([
        'status' => 'error',
        'message' => 'Title is too long (maximum 255 characters)'
    ]);
    exit;
}

// Insert task into database
try {
    // Use a prepared statement with all three parameters bound explicitly
    $sql = "INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }
    
    // Define status explicitly as a variable
    $status = "Pending"; // Exact match for ENUM value
    
    // Bind all three parameters including status
    $stmt->bind_param("sss", $title, $description, $status);
    
    if ($stmt->execute()) {
        $response = [
            'status' => 'success',
            'message' => 'Task added successfully',
            'task_id' => $conn->insert_id
        ];
    } else {
        throw new Exception("Execute failed: " . $stmt->error);
    }
    
    $stmt->close();
} catch (Exception $e) {
    $response = [
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ];
}

// Return JSON response
echo json_encode($response);

// Close database connection
$conn->close();
?>
<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Allow CORS with proper methods
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header('Access-Control-Allow-Methods: POST, OPTIONS, DELETE');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include '../db.php';

// Log incoming request for debugging
$raw_data = file_get_contents("php://input");
error_log("Received delete request: " . $raw_data);

$data = json_decode($raw_data, true);

$id = $data['id'] ?? null;

$response = [];

if ($id !== null) {
    $sql = "DELETE FROM tasks WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        $response['status'] = 'success';
        $response['message'] = 'Task deleted successfully';
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Failed to delete task: ' . $conn->error;
    }

    $stmt->close();
} else {
    $response['status'] = 'error';
    $response['message'] = 'Task ID is required';
}

echo json_encode($response);

$conn->close();
?>
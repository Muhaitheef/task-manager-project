<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Allow CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Content-Type: application/json');

include '../db.php';

// Read and decode JSON body
$data = json_decode(file_get_contents("php://input"), true);

$id = isset($data['id']) ? (int) $data['id'] : null;
$title = isset($data['title']) ? trim($data['title']) : null;
$description = isset($data['description']) ? trim($data['description']) : null;
$status = isset($data['status']) ? trim($data['status']) : null;

$response = [];

if (!$id) {
    $response = [
        'status' => 'error',
        'message' => 'Task ID is required'
    ];
} else {
    // Build the SQL query dynamically based on provided fields
    $updates = [];
    $types = '';
    $values = [];

    if ($title !== null) {
        $updates[] = "title = ?";
        $types .= "s";
        $values[] = $title;
    }

    if ($description !== null) {
        $updates[] = "description = ?";
        $types .= "s";
        $values[] = $description;
    }

    if ($status !== null) {
        $updates[] = "status = ?";
        $types .= "s";
        $values[] = $status;
    }

    if (empty($updates)) {
        $response = [
            'status' => 'error',
            'message' => 'No fields to update'
        ];
    } else {
        $sql = "UPDATE tasks SET " . implode(", ", $updates) . " WHERE id = ?";
        $types .= "i";
        $values[] = $id;

        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$values);

        if ($stmt->execute()) {
            $response = [
                'status' => 'success',
                'message' => 'Task updated successfully'
            ];
        } else {
            $response = [
                'status' => 'error',
                'message' => 'Failed to update task: ' . $stmt->error
            ];
        }

        $stmt->close();
    }
}

echo json_encode($response);

$conn->close();
?>
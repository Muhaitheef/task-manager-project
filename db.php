<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = "sql306.byetcluster.com";  // ✅ Your MySQL Host
$user = "if0_38859774";            // ✅ Your MySQL Username
$password = "dMB94vZz67D";         // ✅ Your MySQL Password
$dbname = "if0_38859774_taskmanager"; // ✅ Your Database Name

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode([
        'status' => 'error',
        'message' => 'Database connection failed: ' . $conn->connect_error
    ]));
}

$conn->set_charset("utf8mb4");
?>
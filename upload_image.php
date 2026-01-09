<?php
// Image Upload Handler
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Check if file was uploaded
if (!isset($_FILES['file']) || $_FILES['file']['error'] === UPLOAD_ERR_NO_FILE) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'No file uploaded']);
    exit;
}

$file = $_FILES['file'];

// Validate file type
$allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
if (!in_array($file['type'], $allowed_types)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.']);
    exit;
}

// Validate file size (max 5MB)
$max_size = 5 * 1024 * 1024;
if ($file['size'] > $max_size) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'File too large. Maximum 5MB allowed.']);
    exit;
}

// Create assets directory if it doesn't exist
$assets_dir = __DIR__ . '/assets';
if (!is_dir($assets_dir)) {
    if (!mkdir($assets_dir, 0755, true)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to create assets directory']);
        exit;
    }
}

// Generate safe filename
$timestamp = time();
$original_name = basename($file['name']);
$original_name = preg_replace('/[^a-zA-Z0-9._-]/', '_', $original_name);
$ext = pathinfo($original_name, PATHINFO_EXTENSION);
$new_filename = $timestamp . '_' . uniqid() . '.' . strtolower($ext);
$file_path = $assets_dir . '/' . $new_filename;
$relative_path = 'assets/' . $new_filename;

// Move uploaded file
if (!move_uploaded_file($file['tmp_name'], $file_path)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to save file']);
    exit;
}

// Success
http_response_code(200);
echo json_encode([
    'success' => true,
    'path' => $relative_path,
    'message' => 'Image uploaded successfully'
]);
exit;
?>

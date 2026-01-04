<?php
// proxy.php - Simple Proxy for NAS
// Put this file in the 'web' folder (or project 'public' folder before build)

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Get the path from query string (passed by .htaccess)
$path = isset($_GET['path']) ? $_GET['path'] : '';

if (!$path) {
    http_response_code(400);
    echo json_encode(["error" => "No path provided"]);
    exit;
}

// Map prefixes to actual target Domains
$targets = [
    'kamis' => 'http://www.kamis.or.kr',
    'ncpms' => 'https://ncpms.rda.go.kr', // Revert to HTTPS as HTTP failed
    'public' => 'http://apis.data.go.kr', // Public Data Portal usually works better with HTTP on legacy keys
    'garak' => 'http://www.garak.co.kr',
    'nongsaro' => 'http://api.nongsaro.go.kr' // Added Nongsaro
];

// Identify which service is being called
$targetUrl = '';
foreach ($targets as $key => $domain) {
    if (strpos($path, $key) === 0) { // Starts with key
        // Remove the key from the path to get the rest
        // formatted: api/kamis/... -> path=kamis/...
        // We want: https://www.kamis.or.kr/...
        
        // logic: path="kamis/service/..." -> replace "kamis" with domain
        // actually, simpler: just construct the URL
        
        // If path is "kamis/service/price/..."
        // target is "https://www.kamis.or.kr/service/price/..."
        
        $realPath = substr($path, strlen($key)); // "/service/price..."
        $targetUrl = $domain . $realPath;
        break;
    }
}

if (!$targetUrl) {
    http_response_code(404);
    echo json_encode(["error" => "Unknown service proxy"]);
    exit;
}

// Append original query string (minus the 'path' parameter)
// CRITICAL: We must use the RAW query string to avoid double-encoding serviceKeys
$rawQuery = $_SERVER['QUERY_STRING'];

// Remove the 'path' parameter from the raw string
// Pattern: path=value& or &path=value or path=value
// We use a regex to cleanly remove 'path=...' and its ampersand
$finalQuery = preg_replace('/(&|^)path=[^&]*(&|$)/', '$2', $rawQuery);

// Clean up leading/trailing ampersands if left messily
$finalQuery = trim($finalQuery, '&');

if (!empty($finalQuery)) {
    $connector = (strpos($targetUrl, '?') !== false) ? '&' : '?';
    $targetUrl .= $connector . $finalQuery;
}

// Perform Request using Curl
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $targetUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // NAS often has old Cert bundles
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
// Add User-Agent to satisfy API firewalls (KMA, NCPMS)
curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
// Disable SSL Host Verify for broad compatibility
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);

// Forward headers if needed (optional)
// curl_setopt($ch, CURLOPT_HTTPHEADER, ["Accept: application/json"]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    echo json_encode(["error" => curl_error($ch)]);
} else {
    http_response_code($httpCode);
    echo $response;
}

curl_close($ch);
?>

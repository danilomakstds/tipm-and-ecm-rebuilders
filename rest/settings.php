<?php
$PRODUCTION_URL = 'http://localhost/wordpress';
$site = $_GET['site'];
switch ($site) {
    case 'devecm':
        $DEVELOPMENT_URL = 'https://dev.ecmrebuilders.com/';
        $CONSUMER_KEY = 'ck_c61742b41f792e2d8f3563ffec66dcad33b635db';
        $CONSUMER_SECRET = 'cs_ed1096f7c39a2362deddc6f9184c85cc87b99b65';
        break;
    case 'liveecm':
        $DEVELOPMENT_URL = 'https://ecmrebuilders.com/';
        $CONSUMER_KEY = 'ck_b5f3e8b9d2d1d6b59ccb27031e6d3261ff602a06';
        $CONSUMER_SECRET = 'cs_ff2e13a83f7bdd332d4f933f72f3e3ee4650dbbd';
        break;
    case 'devtipm': 
        $DEVELOPMENT_URL = 'https://dev.tipmrebuilders.com/';
        $CONSUMER_KEY = 'ck_11c60d25c936cdd7807e5e13952a8508a3729506';
        $CONSUMER_SECRET = 'cs_9260db4589af44e683e3562e15b19d932bd75b64';
        break;
    case 'livetipm':
        $DEVELOPMENT_URL = 'https://tipmrebuilders.com/';
        $CONSUMER_KEY = 'ck_2bdda24cf3a7b1364e50e4725cc28c88f207efc8';
        $CONSUMER_SECRET = 'cs_b54ade270f289c949a1efa427662e5c73b84bbe4';
        break;
}


//require __DIR__ . './autoload.php';
include('./autoload.php');
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,DELETE");
header("Access-Control-Max-Age: 86400");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

use Automattic\WooCommerce\Client;
use Automattic\WooCommerce\HttpClient\HttpClientException;

$woocommerce = new Client(
    $DEVELOPMENT_URL, 
    $CONSUMER_KEY, 
    $CONSUMER_SECRET,
    [
        'wp_api' => true,
        'version' => 'wc/v3',
        'verify_ssl' => false
    ]
);
?>
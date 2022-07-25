<?php
include('./settings.php');
$GENERALREPAIR_PRODUCT = '';
switch ($_GET['site']) {
    case 'devecm':
        $GENERALREPAIR_PRODUCT = '363499';
        break;
    case 'liveecm':
        $GENERALREPAIR_PRODUCT = '363499';
        break;
    case 'devtipm':
        $GENERALREPAIR_PRODUCT = '371864';
        $EVALUATION_FEE = '4254';
        break;
    case 'livetipm':
        $GENERALREPAIR_PRODUCT = '371864';
        $EVALUATION_FEE = '4254';
        break;
}

switch ($_GET['op']) {
    case 'all':
        $products_perpage = $_GET['products_perpage'];
        $page = $_GET['page'];
        $products = $woocommerce-> get('products', array('per_page' => $products_perpage, 'page' => $page));
        break;
    case 'popular':
        $products_perpage = $_GET['products_perpage'];
        $page = $_GET['page'];
        $tag = '';
        if ($_GET['site'] == 'liveecm' || $_GET['site'] == 'devecm') {
            $tag = 1564;
        } else {
            $tag = 29;
        }
        $products = $woocommerce-> get('products', array('per_page' => $products_perpage, 'page' => $page, 'orderby' => 'popularity', 'tag' => $tag));
        break;
    case 'search_by_sku':
        $sku = $_GET['sku'];
        $products = $woocommerce-> get('products', array('sku' => $sku));
        break;
    case 'search_for_new':
        $products_perpage = $_GET['products_perpage'];
        $page = $_GET['page'];
        $products = $woocommerce-> get('products', array('per_page' => $products_perpage, 'page' => $page, 'search' => 'NEW OEM TIPM'));
        break;
    case 'search_all_tipm':
        $products_perpage = $_GET['products_perpage'];
        $page = $_GET['page'];
        $products = $woocommerce-> get('products', array('per_page' => $products_perpage, 'page' => $page, 'search' => 'OEM TIPM'));
        break;
    case 'search_all_ecm':
        $products_perpage = $_GET['products_perpage'];
        $page = $_GET['page'];
        $products = $woocommerce-> get('products', array('per_page' => $products_perpage, 'page' => $page, 'search' => 'OEM ECM'));
        break;
    case 'search_keyword':
        $products_perpage = $_GET['products_perpage'];
        $page = $_GET['page'];
        $search_keyword = $_GET['search_keyword'];
        $products = $woocommerce-> get('products', array('per_page' => $products_perpage, 'page' => $page, 'search' => $search_keyword));
        break;
    case 'update_new_product_desc':
        $description = $_POST['new_description'];
        $meta_data = $_POST['new_meta_data'];
        echo(json_decode($meta_data));
        $data = [
            'description' => $description,
            'meta_data' => json_decode($meta_data)
        ];
        $products = print_r($woocommerce->put('products/'.$_GET['id'], $data));
        break;
    case 'get_all_products':
        $productSearch = str_replace('-',' ',$_GET['searchfor']);
        $repair = (array) $woocommerce-> get('products/'.$GENERALREPAIR_PRODUCT);
        $products = (array) $woocommerce-> get('products', array('search' => $productSearch));
        array_push($products, $repair);
        if (!empty($EVALUATION_FEE)) {
            $evaluation = (array) $woocommerce-> get('products/'.$EVALUATION_FEE);
            array_push($products, $evaluation);
        }
        break;
    case 'get_details':
        $products = $woocommerce->get('products/'.$_GET['product_id']);
        break;
    case 'get_product_under_category':
        $categoryId = $_GET['categoryId'];
        if (!empty($_GET['engine'])) {
            $engine = $_GET['engine'];
            $products = $woocommerce-> get('products', array('category' => $categoryId, 'search' => $engine, 'per_page' => '100'));
        } else {
            $products = $woocommerce-> get('products', array('category' => $categoryId, 'per_page' => '100'));
        }
        break;
    case 'get_general_repair_evaluation':
        $products = (array) null;
        $repair = (array) $woocommerce-> get('products/'.$GENERALREPAIR_PRODUCT);
        array_push($products, $repair);
        if (!empty($EVALUATION_FEE)) {
            $evaluation = (array) $woocommerce-> get('products/'.$EVALUATION_FEE);
            array_push($products, $evaluation);
        }
        break;
    case 'add_product_tag':
        $tag = (int)$_GET['tag'];
        $data = [
            'tags' => [['id' => $tag]]
        ];
        $products = print_r($woocommerce->put('products/'.$_GET['id'], $data));
        break;
    case 'create_new_product':
        $data = [
            'name' => $_POST['name'],
            'regular_price' => $_POST['regular_price'],
            'description' => $_POST['description'],
            'short_description' => $_POST['short_description'],
            'categories' => json_decode($_POST['categories']),
            'images' => json_decode($_POST['images']),
            'attributes' => json_decode($_POST['attributes']),
            'sku' => $_POST['sku'],
            'tags' => json_decode($_POST['tags']),
            'meta_data' => json_decode($_POST['meta_data'])
        ];
        $products = print_r($woocommerce->post('products', $data));
        break;
}

$json = json_encode($products);
print($json);

?>
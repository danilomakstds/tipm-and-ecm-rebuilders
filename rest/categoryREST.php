<?php
include('./settings.php');

switch ($_GET['op']) {
    case 'all':
        $parent = $_GET['parent'];
        $per_page = $_GET['per_page'];
        $page = $_GET['page'];
        $category = $woocommerce-> get('products/categories', array('per_page' => $per_page, 'page' => $page));
        break;
    case 'get_all_category':
        $parent = $_GET['parent'];
        $per_page = $_GET['per_page'];
        $page = $_GET['page'];
        $category = $woocommerce-> get('products/categories', array('per_page' => $per_page, 'parent' => $parent, 'hide_empty' => true, 'page' => $page));
        break;
    case 'search_category':
        $parent = $_GET['parent'];
        $search = $_GET['search'];
        $category = $woocommerce-> get('products/categories', array('parent' => $parent, 'search' => $search));
        break;
    case 'get_category_byslug':
        $slug = $_GET['slug'];
        $category = $woocommerce-> get('products/categories', array('slug' => $slug));
        break;
    case 'add_new_category':
        $data = [
            'name' => $_POST['name'],
            'slug' => $_POST['slug'],
            'parent' => $_POST['parent'],
            'description' => $_POST['description'],
            'image' => [
                'id' => $_POST['image_id']
            ]
        ];
        $category = $woocommerce->post('products/categories', $data);
        break;
}
$json = json_encode($category);
print($json);

?>
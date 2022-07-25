<?php
$site = $_GET['site'];
include('./settings.php');

switch ($_GET['op']) {
    case 'get_all_orders':
        $order_perpage = $_GET['perpage'];
        $page = $_GET['page'];
        $orders = $woocommerce->get('orders', array('per_page' => $order_perpage, 'page' => $page));
        break;
    case 'get_all_orders_by_agent':
        $orders = $woocommerce->get('orders', array('customer' => $customerid));
        break;
    case 'get_all_orders_by_date':
        $order_perpage = $_GET['perpage'];
        $page = $_GET['page'];
        $date = $_GET['date'];
        $orders = $woocommerce->get('orders', array('per_page' => $order_perpage, 'page' => $page, 'after' => $date));
        break;
    case 'get_all_orders_from_to':
        $order_perpage = $_GET['perpage'];
        $page = $_GET['page'];
        $dateFrom = $_GET['from'];
        $dateTo = $_GET['to'];
        $orders = $woocommerce->get('orders', array('per_page' => $order_perpage, 'page' => $page, 'after' => $dateFrom, 'before' => $dateTo));
        break;
    case 'update_orders':
        $data = [
            'customer_id' => '0'
        ];
        $orderid = $_GET['order_id'];
        $orders = $woocommerce->put('orders/'.$orderid, $data);
        break;
    case 'update_order_status_to_completed':
        $data = [
            'status' => 'completed'
        ];
        $orderid = $_GET['order_id'];
        $orders = $woocommerce->put('orders/'.$orderid, $data);
        break;
    case 'update_order_status_to_cancelled':
        $data = [
            'status' => 'cancelled'
        ];
        $orderid = $_GET['order_id'];
        $orders = $woocommerce->put('orders/'.$orderid, $data);
        break;
}

$json = json_encode($orders);
print($json);

?>
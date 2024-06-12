<?php
	session_set_cookie_params(0);
	ob_start();
	session_start();

	include "../config.php";
	
	$res = array();
	
	$res['ok'] = false;
	
	$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);

	$ids = $_POST['ids'];
	$price = $_POST['price'];
	$idr = $_POST['id'];

	$q = "UPDATE reservations SET price = $price, activities = '$ids' WHERE id = $idr";

	$conn->query($q);

	$res['ok'] = true;

	echo json_encode($res);
?>
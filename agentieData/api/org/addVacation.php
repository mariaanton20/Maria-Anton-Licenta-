<?php
	session_set_cookie_params(0);
	ob_start();
	session_start();

	include "../config.php";
	
	$res = array();
	
	$res['ok'] = false;
	
	$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);

	$orgId = $_SESSION['id'];
	$startDate = $_POST['startDate'];
	$endDate = $_POST['endDate'];
	$description = $_POST['description'];
	$name = $_POST['name'];
	$price = $_POST['price'];
	$activities = $_POST['activities'];
	$file = $_POST['file'];

	$q = "INSERT INTO vacation (idorg, start_time, end_time, description, name, price, allowed_activities, img) 
	VALUES ('$orgId', '$startDate', '$endDate', '$description', '$name', '$price', '$activities', '$file')";

	$conn->query($q);

	$res['ok'] = true;

	echo json_encode($res);
?>
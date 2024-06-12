<?php	
	session_set_cookie_params(0);
	ob_start();
	session_start();
	
	include "../config.php";
	
	$name = $_POST['name'];
	$price = $_POST['price'];
	$description = $_POST['description'];
	
	$res = array();
	
	$res['ok'] = false;
	
	$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);
	
	$q = "INSERT INTO activityes (name, price, description) VALUES ('$name', '$price', '$description')";
	
	$conn->query($q);

	$res['ok'] = true;	
	
	echo json_encode($res);

?>
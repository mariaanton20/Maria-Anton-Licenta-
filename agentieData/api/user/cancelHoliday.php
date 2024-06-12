<?php
	session_set_cookie_params(0);
	ob_start();
	session_start();

	include "../config.php";
	
	$res = array();
	
	$res['ok'] = false;
	
	$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);

	$id = $_POST['id'];

	$q = "DELETE FROM reservations WHERE id = $id";

	$conn->query($q);

	$res['ok'] = true;

	echo json_encode($res);
?>
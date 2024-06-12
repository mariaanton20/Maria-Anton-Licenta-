<?php
	session_set_cookie_params(0);
	ob_start();
	session_start();

	include "../config.php";
	
	$res = array();
	
	$res['ok'] = false;
	
	$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);

	$id = $_SESSION['id'];

	$now = time();

	$q = "SELECT COUNT(*) AS cnt FROM reservations WHERE iduser = $id AND end_time < $now";

	$result = $conn->query($q);

	$row = $result->fetch_assoc();

	$cnt = $row['cnt'];

	if($cnt > 40)
		$cnt = 40;

	$reduction = 100 - $cnt;

	$reduction = $reduction / 100;

	$res['reduction'] = $reduction;

	$res['ok'] = true;

	echo json_encode($res);
?>
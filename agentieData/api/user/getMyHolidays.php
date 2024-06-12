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
	
	$q = "SELECT r.*, u.firstName, u.lastName FROM reservations r
	JOIN users u ON r.idorg = u.id
	WHERE r.iduser = $id AND r.start_time > $now";

	$result = $conn->query($q);

	$res['data'] = array();

	while($row = $result->fetch_assoc()) {
		$res['data'][] = $row;
	}

	$res['ok'] = true;

	echo json_encode($res);
?>
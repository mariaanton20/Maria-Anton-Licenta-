<?php
	session_set_cookie_params(0);
	ob_start();
	session_start();
	
	include "../config.php";
	
	$res = array();
	
	$res['ok'] = false;
	
	$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);
	
	$now = time();

	

	$q = "SELECT v.*, u.firstName, u.lastName FROM vacation v
	JOIN users u on v.idorg = u.id
	WHERE start_time > $now";	

	$result = $conn->query($q);	

	$res['vacations'] = array();	

	while($row = $result->fetch_assoc()) {
		$res['vacations'][] = $row;
	}

	$q = "SELECT p.*, u.firstName, u.lastName FROM package p
	JOIN users u on p.idorg = u.id
	WHERE start_time > $now";

	$result = $conn->query($q);

	$res['packages'] = array();

	while($row = $result->fetch_assoc()) {
		$res['packages'][] = $row;
	}

	$res['ok'] = true;

	echo json_encode($res);
?>
<?php
	session_set_cookie_params(0);
	ob_start();
	session_start();
	
	include "../config.php";
	
	$res = array();
	
	$res['ok'] = false;
	
	$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);
	
	$q = "SELECT * FROM activityes";
	
	$result = $conn->query($q);
	
	$data = array();
	
	while($row = $result->fetch_assoc()) {
		$data[] = $row;
	}
	
	$res['data'] = $data;
	
	$res['ok'] = true;
	
	echo json_encode($res);


?>
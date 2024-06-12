<?php
	session_set_cookie_params(0);
	ob_start();
	session_start();
	
	include "../config.php";

	$email = $_POST['email'];

	$res = array();

	$res['ok'] = false;

	$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);

	$q = "SELECT * FROM users WHERE email = '$email'";

	$result = $conn->query($q);

	if($result->num_rows > 0) {
		$res['exists'] = true;
	}
	else {
		$res['exists'] = false;
	}

	$res['ok'] = true;

	echo json_encode($res);
?>
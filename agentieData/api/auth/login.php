<?php
	session_set_cookie_params(0);
	ob_start();
	session_start();
	
	include "../config.php";

	$email = $_POST['email'];
	$pass = $_POST['password'];

	$pass = hash('sha256', $pass);

	$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);

	$res = array();

	$res['ok'] = false;

	$q = "SELECT * FROM users WHERE email = '$email' AND pass = '$pass'";

	$result = $conn->query($q);

	if($result->num_rows > 0) {
		$result = $result->fetch_assoc();
		$res['ok'] = true;
		$_SESSION['loggedIn'] = true;
		$res['id'] = $result['id'];
		$res['type'] = $result['type'];
		$_SESSION['id'] = $result['id'];

		echo json_encode($res);
	}
	else{
		echo json_encode($res);
	}	
?>
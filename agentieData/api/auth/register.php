<?php
	session_set_cookie_params(0);
	ob_start();
	session_start();
	
	include "../config.php";

	$email = $_POST['email'];
	$pass = $_POST['password'];
	$firstName = $_POST['firstName'];
	$lastName = $_POST['lastName'];

	$pass = hash('sha256', $pass);

	$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);

	$res = array();

	$res['ok'] = false;

	$q = "INSERT INTO users (email, pass, firstName, lastName) VALUES ('$email', '$pass', '$firstName', '$lastName')";

	$conn->query($q);	

	$res['ok'] = true;

	echo json_encode($res);


?>
<?php
	session_set_cookie_params(0);
	ob_start();
	session_start();
	
	include "../config.php";
	
	$res = array();
	
	$res['ok'] = false;
	
	$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);

	$iduser = $_SESSION['id'];
	$idv = $_POST['id'];
	$type = $_POST['type'];
	

	$conn->begin_transaction();

	$now = time();

	try{
		$q = "SELECT COUNT(*) AS cnt FROM reservations WHERE iduser = $iduser AND end_time < $now";

		$result = $conn->query($q);

		$row = $result->fetch_assoc();

		$cnt = $row['cnt'];

		if($cnt > 40)
			$cnt = 40;

		$reduction = 100 - $cnt;

		$reduction = $reduction / 100;



		$q2 = "";
		if($type == 'package'){
			$q = "SELECT * FROM package WHERE id = $idv";

			$result = $conn->query($q);

			$row = $result->fetch_assoc();

			$name = $row['name'];
			$description = $row['description'];
			$price = $row['price'];
			$activities = $row['included_activities'];
			$idorg = $row['idorg'];
			$img = $row['img'];
			$start_time = $row['start_time'];
			$end_time = $row['end_time'];

			$price = $price * $reduction;

			$q2 = "INSERT INTO reservations (name, description, price, start_time, end_time, activities, allowed, idorg, iduser, img, type, forid) VALUES
				('$name', '$description', '$price', '$start_time', '$end_time', '$activities', '$activities', $idorg, $iduser, '$img', '$type', $idv)";

		}
		else{
			$q = "SELECT * FROM vacation WHERE id = $idv";

			$result = $conn->query($q);

			$row = $result->fetch_assoc();

			$name = $row['name'];
			$description = $row['description'];
			$price = $row['price'];
			$activities = $row['allowed_activities'];
			$idorg = $row['idorg'];
			$img = $row['img'];
			$start_time = $row['start_time'];
			$end_time = $row['end_time'];

			$price = $price * $reduction;

			$q2 = "INSERT INTO reservations (name, description, price, start_time, end_time, activities, allowed, idorg, iduser, img, type, forid) VALUES
				('$name', '$description', '$price', '$start_time', '$end_time', '', '$activities', $idorg, $iduser, '$img', '$type', $idv)";
		}

		$conn->query($q2);

		$conn->commit();

		$res['ok'] = true;

		echo json_encode($res);
	}
	catch(Exception $e){
		$conn->rollback();
		$res['ok'] = false;
		$res['err'] = $e->getMessage();
		echo json_encode($res);
	}	
?>
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
	JOIN users u ON r.iduser = u.id
	WHERE r.idorg = $id AND r.start_time > $now";

	$result = $conn->query($q);

	$res['data'] = array();

	while($row = $result->fetch_assoc()) {
		$res['data'][] = $row;
	}

	$q = "SELECT SUM(price) AS sum FROM reservations WHERE idorg = $id AND end_time < $now";

	$result = $conn->query($q);

	$res['totalRevenue'] = $result->fetch_assoc()['sum'];

	$q = "SELECT SUM(price) AS sum FROM reservations WHERE idorg = $id AND end_time < $now AND type = 'vacation'";

	$result = $conn->query($q);

	$res['vacationRevenue'] = $result->fetch_assoc()['sum'];

	$q = "SELECT SUM(price) AS sum FROM reservations WHERE idorg = $id AND end_time < $now AND type = 'package'";

	$result = $conn->query($q);

	$res['packageRevenue'] = $result->fetch_assoc()['sum'];

	$q = "SELECT activities FROM reservations WHERE idorg = $id AND end_time > $now";

	$result = $conn->query($q);

	$actvities = array();

	while($row = $result->fetch_assoc()) {
		$acts = json_decode($row['activities']);

		foreach($acts as $act) {			
			$activities[] = $act;
		}		
	}

	$activitiesUNQ = array_unique($activities);

	$activitiesUNQ = implode(',', $activitiesUNQ);

	$q = "SELECT SUM(price) as sum FROM activityes WHERE id IN ($activitiesUNQ)";

	$result = $conn->query($q);

	$res['activitiesRevenue'] = $result->fetch_assoc()['sum'];

	$activs = array();

	foreach($activities as $act){
		$q = "SELECT * FROM activityes WHERE id = $act";

		$result = $conn->query($q);

		while($row = $result->fetch_assoc()) {
			$name = $row['name'];
			$price = $row['price'];

			if(isset($activs[$name])){
				$activs[$name] += $price;
			}
			else{
				$activs[$name] = $price;
			}
		}
	}	

	$res['activities'] = $activs;

	$res['ok'] = true;

	echo json_encode($res);
?>
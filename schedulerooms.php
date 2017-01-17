<?php
define('MYSITE', 1);

require_once('config.php');

session_start();
header('Content-Type: application/json');
//header('Content-Type: text/html; charset=utf-8');

try
{
	$dbh = new PDO("mysql:dbname={$dbName};host={$dbHost};port={$dbPort}", $dbUser, $dbPass);
}
catch(PDOException $e)
{
	header('500 Internal Server Error', true, 500);
	echo '�� ���������� ������������ � ���� ������';
	echo $e->getMessage();
	die();
}

try
{
	$weekdays=[1=>'��', 2=>'��', 3=>'��', 4=>'��', 5=>'��', 6=>'��'];
	$groupsname=$_POST["Groups_name"];
	$groupsname=json_decode($groupsname);
	$groupsname=filter_var_array($groupsname, FILTER_SANITIZE_STRING);
	$groupsname="'".implode("','",$groupsname)."'";
	$stmt = $dbh->prepare("
SELECT DISTINCT appointments_rooms.Appointment_ID, rooms.name, buildings.abr
FROM groups 
INNER JOIN appointments_groups ON groups.id=appointments_groups.Group_ID
INNER JOIN appointments ON appointments_groups.Appointment_ID=appointments.UniqueID
INNER JOIN appointments_rooms ON appointments_rooms.Appointment_ID=appointments.UniqueID
INNER JOIN rooms ON rooms.id=appointments_rooms.Room_ID
INNER JOIN buildings ON rooms.building_id=buildings.id
WHERE groups.name IN ({$groupsname})
ORDER BY groups.id;");
	$stmt->execute();
	$res=$stmt->fetchAll(PDO::FETCH_ASSOC);
	echo json_encode($res);
}
catch(PDOException $e)
{
	header('500 Internal Server Error', true, 500);
		echo '������!'; 
		die();
		//header('Location: index.php');
}
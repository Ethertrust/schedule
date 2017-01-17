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
	echo 'Не получилось подключиться к базе данных';
	echo $e->getMessage();
	die();
}

try
{
	$weekdays=[1=>'ПН', 2=>'ВТ', 3=>'СР', 4=>'ЧТ', 5=>'ПТ', 6=>'СБ'];
	$groupsname=$_POST["Groups_name"];
	$groupsname=json_decode($groupsname);
	$groupsname=filter_var_array($groupsname, FILTER_SANITIZE_STRING);
	$groupsname="'".implode("','",$groupsname)."'";
	$stmt = $dbh->prepare("
SELECT DISTINCT specialities.id as specialities_ID, groups.kurs, specialities.name as specialityname,
 appointments_groups.Appointment_ID, groups.name as groupname,
 ((HOUR(appointments.StartDate) * 2) + if(MINUTE(appointments.StartDate)>0, 1, 0)) as StartPair,
 ((HOUR(appointments.EndDate) * 2) + if(MINUTE(appointments.EndDate)>0, 1, 0)) as EndPair,
 dayofmonth(appointments.StartDate) as weekday, if(month(appointments.StartDate)>7,'autumn','spring') as semester, year(appointments.StartDate) as studyyear,
 appointments.periodicity, appointments.AllDay as SubGroup, appointments.TotalSubgroups as TotalSubgroups, appointments.aptID as Child, appointments.Parent 
FROM groups 
INNER JOIN appointments_groups ON groups.id=appointments_groups.Group_ID
INNER JOIN appointments ON appointments_groups.Appointment_ID=appointments.UniqueID
INNER JOIN specialities ON specialities.id=groups.speciality_id
WHERE groups.name IN ({$groupsname})
ORDER BY groups.id;");
	$stmt->execute();
	$res=$stmt->fetchAll(PDO::FETCH_ASSOC);
	echo json_encode($res);
}
catch(PDOException $e)
{
	header('500 Internal Server Error', true, 500);
		echo 'Ошибка!'; 
		die();
		//header('Location: index.php');
}
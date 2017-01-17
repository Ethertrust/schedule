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
	$stmt = $dbh->prepare("
SELECT institutes.name as institute_name, specialities.id as speciality_id, specialities.name as speciality_name, specialities.code as speciality_code, groups.id as groups_id, groups.name as groups_name, groups.kurs as kurs
from groups
inner join specialities on specialities.id=groups.speciality_id
inner join institutes on specialities.institute_id=institutes.id;");
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
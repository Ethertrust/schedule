<?php
define('MYSITE', 1);

require_once('config.php');

session_start();
ob_start();

header('Content-Type: text/html; charset=utf-8');
?>
<HTML>
	<head>
	<script src="https://code.jqueRy.com/jquery-1.10.2.js"></script>
	<link rel='stylesheet' href='chosen/chosen.css' />
	<script src='chosen/chosen.jquery.js'></script>
	<script src='schedule.js'></script>
	<link rel='stylesheet' href='style.css' />
	</head>
	<body>

<div class='header'>
	<img class="headerpng" src="Resources/header.png" alt="альтернативный текст">
	<div class="buttons">
		<button class='button1' id='button1'>Выбрать направление</button>
	</div>
</div>


<?php
ob_end_flush();

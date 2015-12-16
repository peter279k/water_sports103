<?php
	require_once("../Controller/controller.php");
	$url = $_SERVER["REQUEST_URI"];
	$url_arr = explode("=", $url);
	$url_len = count($url_arr);
	if($url_len>2 || $url_len<2)
	{
		echo "request-error";
	}
	else
	{
		$act_arr = explode("_",$url_arr[1]);
		$act_len = count($act_arr);
		if($act_len!=3)
		{
			echo "action-error";
		}
		else
		{
			$control = new my_controller();
			$data = array();
			if(!empty($_POST["data"]))
				$data = $_POST["data"];
			echo $control -> invoke($url_arr[1],$data);
		}
	}
?>
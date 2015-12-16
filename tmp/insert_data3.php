<?php
	define("host", "mysql:host=localhost;dbname=sports");
	define("user_name", "sports");
	define("user_pwd", "sportsdpo1903");
	
	$link = null;
	$link = new PDO(host,user_name,user_pwd);
	
	if($link==null)
	{
		echo "cannot link db.";
	}
	else
	{
		$link -> query("SET NAMES utf8");
		//$sql = "SELECT email FROM student67";
		$result = $link -> query($sql);
		//把email補起來
		
		$file_open = fopen("studentdata.csv", "r");
		while(!feof($file_open))
		{
			$str = fgets($file_open);
			$arr = explode(",",$str);
			if(trim($arr[5])=="")
			{
				$arr[5] = "NONE";
			}
			$stmt = $link -> prepare("UPDATE student67 SET email = :email WHERE stu_number = :stu_number");
			$stmt -> execute(array(":email"=>$arr[5],":stu_number"=>$arr[1]));
			//echo "UPDATE student67 SET email = ".$arr[5]." WHERE stu_number = ".$arr[1]."<br>";
		}
		
		fclose($file_open);
		$link = null;
	}
	
?>
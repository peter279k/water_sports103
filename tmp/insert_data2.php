<?php
	define("host", "mysql:host=localhost;dbname=sports");
	define("user_name", "sports");
	define("user_pwd", "sportsdpo1903");
	
	function hash_pwd($pwd)
	{
		$salt = strtr(base64_encode(mcrypt_create_iv(16, MCRYPT_DEV_URANDOM )), '+', '.');
		$salt = sprintf("$2a$%02d$", 10) . $salt;
		$hash = crypt($pwd,$salt);
		return $hash;
	}
	
	function hash_verify($pwd,$db_pass)
	{
		if($db_pass==crypt($pwd, $db_pass))
			return true;
		else
			return;
	}
	
	$link = null;
	$link = new PDO(host,user_name,user_pwd);
	
	if($link==null)
	{
		echo "cannot link db.";
	}
	else
	{
		$link -> query("SET NAMES utf8");
		$sql = "SELECT stu_number,pwd FROM student67";
		$result = $link -> query($sql);
		while($res = $result -> fetch())
		{
			echo (hash_verify("u".$res["stu_number"]."@ms".substr($res["stu_number"],0,3).".nttu.edu.tw",$res["pwd"]))."<br>";
				
			/*$hash = hash_pwd("u".$res["stu_number"]."@ms".substr($res["stu_number"],0,3).".nttu.edu.tw");
			$stmt = $link -> prepare("UPDATE student67 SET pwd = :pwd,default_pwd = :default_pwd WHERE stu_number = :stu_number");
			$stmt -> execute(array(
				":pwd"=>$hash,
				":default_pwd"=>$hash,
				":stu_number"=>$res["stu_number"],
			));*/
		}
		$link = null;
	}
	
?>
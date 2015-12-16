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
	
	$link = null;
	$link = new PDO(host,user_name,user_pwd);
	
	if($link==null)
	{
		echo "cannot link db.";
	}
	else
	{
		$link -> query("SET NAMES utf8");
		if(file_exists("studentdata.csv"))
		{
			$file_open = fopen("studentdata.csv", "r");
			while(!feof($file_open))
			{
				$str = fgets($file_open);
				$arr = explode(",",$str);
				$arr_len = count($arr);
				for($i=0;$i<$arr_len;$i++)
				{
					if($arr[$i]=="")
					{
						$arr[$i] = "NONE";
					}
				}
				
				//$str = $arr[0].','.$arr[1].','.$arr[2].','.$arr[3].','.$arr[4].','.$arr[5];
				//$hash = hash_pwd("u".$arr[1]."@ms".substr($arr[1],0,3).".nttu.edu.tw");
				//$hash = hash_pwd("u".$arr[1]);
				$sql = "INSERT INTO student67(class,stu_number,name,sex,phone,email)
							VALUES(:class,:stu_number,:name,:sex,:phone,:email)";
				$stmt = $link -> prepare($sql);	
				$stmt -> execute(array(
						":class"=>$arr[0],
						":stu_number"=>$arr[1],
						":name"=>$arr[2],
						":sex"=>$arr[3],
						":phone"=>$arr[4],
						":email"=>$arr[5]
					));
			}
			fclose($file_open);
		}
		else
		{
			echo "csv file exists.";
		}
		$link = null;
	}
	
?>
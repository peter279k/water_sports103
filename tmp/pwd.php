<?php
	function hash_pwd($pwd)
	{
		$salt = strtr(base64_encode(mcrypt_create_iv(16, MCRYPT_RAND )), '+', '.');
		$salt = sprintf("$2a$%02d$", 10) . $salt;
		$hash = crypt($pwd,$salt);
		return $hash;
	}
	
	echo hash_pwd("u10011204@ms100.nttu.edu.tw");
	phpinfo();
?>
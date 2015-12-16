<?php
	require_once("../interface/session.php");
	ini_set('session.cookie_httponly',1);
	session_start();
	class my_session implements Session
	{
		protected $str = "_acc";
		
		public function get_session($who)
		{
			if(empty($_SESSION[$who.$str]))
			{
				return false;
			}
			else
			{
				return $_SESSION[$who.$str];
			}
		}
		
		public function set_session($who,$account)
		{
			if(!empty($_SESSION[$who.$str]))
			{
				unset($_SESSION[$who.$str]);
			}
			session_regenerate_id();
			$_SESSION[$who.$str] = $account;
		}
		
		public function kill_session($who)
		{
			if(!empty($_SESSION[$who.$str]))
			{
				unset($_SESSION[$who.$str]);
			}
		}
	}
?>
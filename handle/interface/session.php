<?php
	interface Session
	{
		public function get_session($who);
		public function set_session($who,$account);
		public function kill_session($who);
	}
?>
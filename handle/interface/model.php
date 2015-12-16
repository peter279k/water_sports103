<?php
	interface Model
	{
		public function handle_login($table_name,$account,$pwd,$recaptcha);
		//public function update_pwd($table_name,$pwd1,$pwd2);
		public function check_login($who);
		public function get_volunteer_item();
		public function admin_volunteer_item();
		public function get_checkvolunteer_item();
		public function post_user_id($user_id);
		public function post_check_item($item_id,$user_id);
		public function handle_signup($signId,$signup_open);
		public function get_volunteer_list($item_name,$user_id);
		public function post_agree_volunteer($item_id,$student_number,$user_id);
		public function cancel_agree_volunteer($item_id,$student_number,$user_id);
		public function edit_volunteer_item($new_item_id,$item_id,$user_id,$student_number);
		public function volunteer_signup_stat();
		public function post_sign_up($user_id,$item_number,$student_number);
		public function download_excel_file($user_id,$select_item);
		public function get_contest_list();
		public function product_signup_form($contest_id);
		public function cloth_set_action($cloth_size);
	}
?>
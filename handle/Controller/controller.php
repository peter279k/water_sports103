<?php
	require_once("../interface/controller.php");
	require_once("../Model/model.php");
	class my_controller implements Controller
	{
		public function __construct()
		{
			$this->model = new my_model();
		}
		
		public function invoke($action,$data)
		{
			$response = array();
			$arr = explode("_",$action);
			$arr_index = count($arr)-1;
			switch($action)
			{
				case "check_login_student":
					$response["result"] = $this->model->check_login($arr[$arr_index]);
					break;
				case "handle_login_student":
					$response["result"] = $this->model->handle_login("student_water103",$data[0]["user-acc"],$data[0]["user-pwd"],$data[0]["recaptcha"]);
					break;
				case "handle_logon_student":
					$response["result"] = $this->model->handle_logon($arr[$arr_index]);
					break;
				case "get_volunteer_item":
					$response["result"] = $this->model->get_volunteer_item();
					break;
				case "cloth_set_action":
					$response["result"] = $this->model->cloth_set_action($data);
					break;
				case "handle_signup_volunteer":
					$response["result"] = $this->model->handle_signup($data[0]["id_name"],$data[0]["signup_time"]);
					break;
				case "admin_volunteer_item":
					$response["result"] = $this->model->admin_volunteer_item();
					break;
				case "get_volunteer_list":
					$response["result"] = $this->model->get_volunteer_list($data[0]["item-list"],$data[0]["user_id"]);
					break;
				case "post_agree_volunteer":
					$response["result"] = $this->model->post_agree_volunteer($data[0]["item_id"],$data[0]["student_number"],$data[0]["user_id"]);
					break;
				case "edit_volunteer_item":
					$response["result"] = $this->model->edit_volunteer_item($data[0]["new_item_id"],$data[0]["item_id"],$data[0]["user_id"],$data[0]["student_number"]);
					break;
				case "cancel_agree_volunteer":
					$response["result"] = $this->model->cancel_agree_volunteer($data[0]["item_id"],$data[0]["student_number"],$data[0]["user_id"]);
					break;
				case "get_checkvolunteer_item":
					$response["result"] = $this->model->get_checkvolunteer_item();
					break;
				case "post_check_volunteeritem":
					$response["result"] = $this->model->post_check_item($data[0]["item_id"],$data[0]["user_id"]);
					break;
				case "post_user_id":
					$response["result"] = $this->model->post_user_id($data[0]["user_id"]);
					break;
				case "volunteer_signup_stat":
					$response["result"] = $this->model->volunteer_signup_stat();
					break;
				case "post_sign_up":
					$response["result"] = $this->model->post_sign_up($data[0]["user_id"],$data[0]["item-number"],$data[0]["student_number"]);
					break;
				case "download_excel_file":
					$response["result"] = $this->model->download_excel_file($data[0]["user_id"],$data[0]["select-item"]);
					break;
				case "get_contest_list":
					$response["result"] = $this->model->get_contest_list();
					break;
				case "cloth_size_cal":
					$response["result"] = $this->model->cloth_size_cal($data[0]["user_id"]);
					break;
				default:
					$response["result"] = "route-error";
					break;
			}
			
			return json_encode($response);
		}
	}
?>
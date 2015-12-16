<?php
	require_once('../interface/model.php');
	require_once('db_conn.php');
	require_once('session.php');
	require_once('PHPExcel/PHPExcel.php');
	class my_model implements Model
	{
		//simulate database.
		public function check_login($who)
		{
			$session = new my_session();
			$result = $session->get_session($who);
			return $result;
		}
		
		/*更改密碼方法
		public function update_pwd($table_name,$pwd1,$pwd2)
		{
			
		}*/
		
		public function handle_login($table_name,$account,$pwd,$recaptcha)
		{
			$response = "";
			if($account=="" || $pwd=="" || $recaptcha=="")
			{
				$response = "post-error";
			}
			else
			{
				$link = $this->link_db();
				$sql = "SELECT pwd FROM ".$table_name." WHERE stu_number = :account";
				$rs = $link -> prepare($sql);
				$rs -> execute(array(":account"=>$account));
				$user = $rs -> fetch(PDO::FETCH_ASSOC);
				if(count($user)!=1)
				{
					$response = "login-error";
				}
				else
				{
					if($this->hash_verify($pwd,$user["pwd"]))
					{
						$sess = new my_session();
						$sess -> set_session("student",$account);
						$response = "login-success";
					}
					else
						$response = "login-error";
				}
				$link = null;
			}
			
			return $response;
		}
		
		public function handle_logon($who)
		{
			$sess = new my_session();
			$sess -> kill_session($who);
			return true;
		}
		
		public function cloth_set_action($cloth_size)
		{
			$sess = new my_session();
			$response = "";
			
			if(!$sess -> get_session("student"))
			{
				$response = "請先登入!";
			}
			else if($cloth_size=="")
			{
				$response = "cloth-size-error";
			}
			else
			{
				$link = $this->link_db();
				$sql = "SELECT size FROM  cloth_size103 WHERE student_number = :stu_number";
				$stmt = $link -> prepare($sql);
				$stmt -> execute(array(":stu_number"=>$sess->get_session("student")));
				$stu_size = $stmt -> fetch();
				if($stu_size["size"]!="")
				{
					$response = "T-Shirt的size您已經設定成".$stu_size["size"]."了!";
				}
				else
				{
					$sql = "INSERT INTO cloth_size103(student_number,size) VALUES(:student_number,:cloth_size)";
					$stmt = $link -> prepare($sql);
					$stmt -> execute(array(":student_number"=>$sess->get_session("student"), ":cloth_size"=>$cloth_size));
					$response = "設定T-Shirt的size成功!";
				}
				
				$link = null;
			}
			
			return $response;
		}
		
		public function post_sign_up($user_id,$item_number,$student_number)
		{
			$response = null;
			$res = $this -> check_admin_account($user_id);
			if($res==0)
			{
				$response = "account-error";
			}
			else
			{
				$time = new DateTime("NOW",new DateTimeZone("Asia/Taipei"));
				$today = $time -> format('Y-m-d H:i:s');
				
				$link = $this->link_db();
				$sql = "SELECT COUNT(*) FROM volunteer_list103 WHERE student_number = :student_number AND item = :item";
				$stmt = $link -> prepare($sql);
				$stmt -> execute(array(":student_number"=>$student_number,":item"=>$item_number));
				if(((int)$stmt -> fetchColumn())==0)
				{
					$sql = "INSERT INTO  volunteer_list103(item,student_number,signup_time,agree) VALUES(:item,:student_number,:signup_time,'1')";
					$stmt = $link -> prepare($sql);
					$stmt -> execute(array(":item"=>$item_number,":student_number"=>$student_number,":signup_time"=>$today));
					$response = "報名成功!";
				}
				else
				{
					$response = "重複報名!";
				}
				$link = null;
			}
			return $response;
		}
		
		public function get_volunteer_item()
		{
			$link = $this->link_db();
			$result = $link -> query("SELECT * FROM volunteer_item103");
			$row = array();
			$row_i = 0;
			
			date_default_timezone_set("Asia/Taipei");
			$today = date('Y-m-d H:i:s');
			$todate = date('Y-m-d');
			
			while($res = $result->fetch())
			{
				$item_id = $res["ID"];
				$stmt = $link -> query("SELECT signup_open FROM volunteer_item103 WHERE ID = '$item_id'");
				$stmt_row = $stmt -> fetch();
				
				$rs = $link -> prepare("SELECT COUNT(*) FROM volunteer_item103 WHERE ID = '$item_id' AND signup_close<'$today'");
				$rs -> execute();
				
				$row[$row_i]["link_sign"] = "我要報名";
				
				if((strtotime($stmt_row["signup_open"])-strtotime($todate))<0)
					$row[$row_i]["link_sign"] = "報名未開始";
				if((int)$res["isCheck"]==1)
					$row[$row_i]["link_sign"] = "已經額滿";
				if((int)$rs->fetchColumn()!=0)
					$row[$row_i]["link_sign"] = "報名截止";
		
				$row[$row_i]["ID"] = $res["ID"];
				$rs = $link -> prepare("SELECT COUNT(*) FROM  volunteer_list103 WHERE item = ".$row[$row_i]["ID"]);
				$rs -> execute();
				$row[$row_i]["sign_people"] = (int)$rs -> fetchColumn()."人";
				$row[$row_i]["item"] = $res["item"];
				$row[$row_i]["signup_open"] = $res["signup_open"];
				$row[$row_i]["signup_close"] = $res["signup_close"];
				$row[$row_i]["limit_number"] = $res["limit_number"];
				$row_i++;
			}
			
			$link = null;
			return $row;
		}
		
		public function volunteer_signup_stat()
		{
			$sess = new my_session();
			$response = "";
			
			if(!$sess -> get_session("student"))
			{
				$response = "請先登入!";
			}
			else
			{
				$stu_number = $sess -> get_session("student");
				$link = $this -> link_db();
				$sql = "SELECT COUNT(*) FROM  volunteer_list103 WHERE student_number = :student_number";
				$stmt = $link -> prepare($sql);
				$stmt -> execute(array(":student_number"=>$stu_number));
				$count = (int)$stmt -> fetchColumn();
				if($count==0)
				{
					$response = "no-record";
				}
				else
				{
					$sql = "SELECT volunteer_list103.agree AS agree,volunteer_item103.item AS item,volunteer_item103.isCheck AS isCheck FROM  volunteer_list103,volunteer_item103 WHERE volunteer_item103.ID =  volunteer_list103.item AND volunteer_list103.student_number = :student_number";
					$stmt = $link -> prepare($sql);
					$stmt -> execute(array(":student_number"=>$stu_number));
					$row = array();
					$len = 0;
					while($res = $stmt -> fetch())
					{
						$row[$len]["item"] = $res["item"];
						$row[$len]["size"] = $res["size"];
						if($res["isCheck"]==0)
						{
							$row[$len]["agree"] = "處理中";
						}
						else
						{
							if($res["agree"]==0)
							{
								$row[$len]["agree"] = "不同意";
							}
							else
							{
								$row[$len]["agree"] = "同意";
							}
						}
						$len++;
					}
					$response = $row;
				}
				$link = null;
			}
			return $response;
		}
		
		public function admin_volunteer_item()
		{
			$link = $this -> link_db();
			$sql = "SELECT * FROM volunteer_item103";
			$result = $link -> query($sql);
			$row = array();
			$len = 0;
			while($res = $result -> fetch())
			{
				$row[$len]["ID"] = $res["ID"];
				$row[$len]["item"] = $res["item"];
				$row[$len]["isCheck"] = $res["isCheck"];
				$len++;
			}
			$link = null;
			return $row;
		}
		
		public function cloth_size_cal($user_id)
		{
			$response = null;
			$res = $this -> check_admin_account($user_id);
			if($res==0)
			{
				$response = "account-error";
			}
			else
			{
				$link = $this -> link_db();
				$sql = "SELECT student_number,size FROM cloth_size103";
				$res = $link -> query($sql);
				$row = array();
				$cloth_count = 0;
				
				$row[$cloth_count]["3XS"] = 0;
				$row[$cloth_count]["2XS"] = 0;
				$row[$cloth_count]["XS"] = 0;
				$row[$cloth_count]["S"] = 0;
				$row[$cloth_count]["M"] = 0;
				$row[$cloth_count]["L"] = 0;
				$row[$cloth_count]["XL"] = 0;
				$row[$cloth_count]["2L"] = 0;
				$row[$cloth_count]["3L"] = 0;
				
				$row[$cloth_count+1]["3XS"] = 0;
				$row[$cloth_count+1]["2XS"] = 0;
				$row[$cloth_count+1]["XS"] = 0;
				$row[$cloth_count+1]["S"] = 0;
				$row[$cloth_count+1]["M"] = 0;
				$row[$cloth_count+1]["L"] = 0;
				$row[$cloth_count+1]["XL"] = 0;
				$row[$cloth_count+1]["2L"] = 0;
				$row[$cloth_count+1]["3L"] = 0;
				
				while($res_cloth = $res -> fetch())
				{
					switch($res_cloth["size"])
					{
						case "3XS";
							$row[0]["3XS"] += 1;
							break;
						case "2XS":
							$row[0]["2XS"] += 1;
							break;
						case "XS":
							$row[0]["XS"] += 1;
							break;
						case "S":
							$row[0]["S"] += 1;
							break;
						case "M":
							$row[0]["M"] += 1;
							break;
						case "L":
							$row[0]["L"] += 1;
							break;
						case "XL":
							$row[0]["XL"] += 1;
							break;
						case "2L":
							$row[0]["2L"] += 1;
							break;
						case "3L":
							$row[0]["3L"] += 1;
							break;
					}
					$sql = "SELECT student_number FROM volunteer_list103 WHERE student_number = :student_number";
					$stmt = $link -> prepare($sql);
					$stmt -> execute(array(":student_number"=>$res_cloth["student_number"]));
					$result = $stmt -> fetch();
					if($result["student_number"]!=null)
					{
						$row[$cloth_count]["student_number"] = "no-problem";
					}
					else
					{
						$row[$cloth_count]["student_number"] = $res_cloth["student_number"];
						$sql = "SELECT class,stu_number,name,sex FROM student_water103 WHERE stu_number = :stu_number";
						$stmt = $link -> prepare($sql);
						$stmt -> execute(array(":stu_number"=>$row[$cloth_count]["student_number"]));
						$student = $stmt -> fetch();
						$row[$cloth_count]["class"] = $student["class"];
						$row[$cloth_count]["stu_number"] = $student["stu_number"];
						$row[$cloth_count]["name"] = $student["name"];
						$row[$cloth_count]["sex"] = $student["sex"];
						$row[$cloth_count]["size"] = $res_cloth["size"];
						switch($res_cloth["size"])
						{
							case "3XS";
								$row[1]["3XS"] += 1;
								break;
							case "2XS":
								$row[1]["2XS"] += 1;
								break;
							case "XS":
								$row[1]["XS"] += 1;
								break;
							case "S":
								$row[1]["S"] += 1;
								break;
							case "M":
								$row[1]["M"] += 1;
								break;
							case "L":
								$row[1]["L"] += 1;
								break;
							case "XL":
								$row[1]["XL"] += 1;
								break;
							case "2L":
								$row[1]["2L"] += 1;
								break;
							case "3L":
								$row[1]["3L"] += 1;
								break;
						}
					}
					$cloth_count++;
				}
				
				$sql = "SELECT COUNT(*) FROM cloth_size103";
				$check_size = $link -> prepare($sql);
				$check_size -> execute();
				if((int)$check_size -> fetchColumn()==0)
					$response = "no-record";
				else
				{
					$row[0]["clothes"] = $row[0]["3XS"]+$row[0]["2XS"]+$row[0]["XS"]+$row[0]["S"]+$row[0]["M"]+$row[0]["L"]+$row[0]["XL"]+$row[0]["2L"]+$row[0]["3L"];
					$row[0]["no_sign_clothes"] =  $row[1]["3XS"]+$row[1]["2XS"]+$row[1]["XS"]+$row[1]["S"]+$row[1]["M"]+$row[1]["L"]+$row[1]["XL"]+$row[1]["2L"]+$row[1]["3L"];
				
					$response = $row;
				}
			}
			return $response;
		}
		
		public function download_excel_file($user_id,$select_item)
		{
			$response = null;
			$res = $this -> check_admin_account($user_id);
			if($res==0)
			{
				$response = "account-error";
			}
			else
			{
				$item_arr = explode(",", $select_item);
				$item_len = count($item_arr);
				$link = $this -> link_db();
				$row_data_excel = array();
				$sheet_count = 0;
				$objPHPEXCEL = new PHPExcel();
				for($item_count=0;$item_count<$item_len;$item_count++)
				{
					$sql = "SELECT cloth_size103.size AS size,volunteer_item103.ID AS ID,volunteer_item103.item AS item,student_water103.class AS class,student_water103.stu_number AS stu_number,student_water103.name AS name,student_water103.sex AS sex,student_water103.phone AS phone,student_water103.email AS email,volunteer_item103.isCheck AS isCheck,volunteer_list103.agree AS agree FROM student_water103,volunteer_item103,volunteer_list103,cloth_size103 WHERE volunteer_list103.item = :item AND volunteer_item103.ID = :item AND student_water103.stu_number = volunteer_list103.student_number AND volunteer_list103.student_number = cloth_size103.student_number";
					$stmt = $link -> prepare($sql);
					$stmt -> execute(array(":item"=>$item_arr[$item_count]));
					$row_len = 0;
					while($res = $stmt -> fetch())
					{
						$row_data_excel[$row_len]["item"] = $res["item"];
						$row_data_excel[$row_len]["ID"] = $res["ID"];
						$row_data_excel[$row_len]["size"] = $res["size"];
						$row_data_excel[$row_len]["class"] = $res["class"];
						$row_data_excel[$row_len]["stu_number"] = $res["stu_number"];
						$row_data_excel[$row_len]["name"] = $res["name"];
						$row_data_excel[$row_len]["sex"] = $res["sex"];
						$row_data_excel[$row_len]["phone"] = $res["phone"];
						$row_data_excel[$row_len]["email"] = $res["email"];
						$row_data_excel[$row_len]["isCheck"] = $res["isCheck"];
						$row_data_excel[$row_len]["agree"] = $res["agree"];
						$row_len++;
					}
					$objPHPEXCEL = $this -> excel_writer($objPHPEXCEL,$row_data_excel,$item_count);
					$row_data_excel = array();
				}
				$link = null;
				$response = $this -> excel_save($objPHPEXCEL);
				return $response;
			}
		}
		
		public function get_checkvolunteer_item()
		{
			$link = $this -> link_db();
			$sql = "SELECT isCheck,limit_number,item,ID FROM volunteer_item103";
			$result = $link -> query($sql);
			$row = array();
			$len = 0;
			while($res = $result -> fetch())
			{
				$row[$len]["isCheck"] = $res["isCheck"];
				$row[$len]["limit_number"] = $res["limit_number"];
				$row[$len]["item"] = $res["item"];
				$row[$len]["ID"] = $res["ID"];
				$sql = "SELECT COUNT( * ) FROM  volunteer_list103 WHERE ".$res['ID']." = item AND agree =1";
				$stmt = $link -> prepare($sql);
				$stmt -> execute();
				$row[$len]["signup_people"] = $stmt -> fetchColumn();
				$len++;
			}
			
			$link = null;
			return $row;
		}
		
		public function post_check_item($item_id,$user_id)
		{
			$response = null;
			$res = $this -> check_admin_account($user_id);
			if($res==0)
			{
				$response = "account-error";
			}
			else
			{
				$link = $this -> link_db();
				$sql = "UPDATE volunteer_item103 SET isCheck = 1 WHERE ID = :ID";
				$stmt = $link -> prepare($sql);
				$stmt -> execute(array(":ID"=>$item_id));
				$response = "確認成功!";
				$link = null;
			}
			
			return $response;
		}
		
		public function post_user_id($user_id)
		{
			$response = null;
			$link = $this -> link_db();
			$sql = "SELECT account FROM admin103 WHERE account = :account";
			$stmt = $link -> prepare($sql);
			$stmt -> execute(array(":account"=>$user_id));
			$userID = $stmt -> fetch();
			$response = "註冊管理員已到上限!";
			/*
			if($userID["account"]=="")
			{
				$sql = "INSERT INTO admin103(account,pwd,isFB) VALUES(:account,'facebooklogin',1)";
				$stmt = $link -> prepare($sql);
				$stmt -> execute(array(":account"=>$user_id));
				$response = "註冊成功!";
			}
			else
			{
				$response = "已經註冊!";
			}
			*/
			$link = null;
			return $response;
		}
		
		public function post_agree_volunteer($item_id,$student_number,$user_id)
		{
			$response = null;
			$res = $this -> check_admin_account($user_id);
			if($res==0)
			{
				$response = "account-error";
			}
			else
			{
				$link = $this -> link_db();
				$result = $link -> prepare("SELECT limit_number FROM volunteer_item103 WHERE ID = :ID");
				$result -> execute(array(":ID"=>$item_id));
				$row = $result -> fetch();
				
				$sql = "SELECT COUNT(*) FROM  volunteer_list103 WHERE agree = 1 AND item = :item";
				$stmt = $link -> prepare($sql);
				$stmt -> execute(array(":item"=>$item_id));
				
				$sql = "SELECT item FROM  volunteer_list103 WHERE student_number = :student_number AND item != :item";
				$stmt2 = $link -> prepare($sql);
				$stmt2 -> execute(array(":student_number"=>$student_number,":item"=>$item_id));
				$stmt2_row = array();
				$len = 0;
				while($tmp = $stmt2 -> fetch())
				{
					$stmt2_row[$len]["item"] = $tmp["item"];
					$len++;
				}
				
				if((int)$stmt -> fetchColumn()==(int)$row["limit_number"])
				{
					$response = "is-limit-number";
				}
				else
				{
					$sql = "UPDATE  volunteer_list103 SET agree = 1 WHERE student_number = :student_number AND item = :item";
					$stmt = $link -> prepare($sql);
					$stmt -> execute(array(":student_number"=>$student_number,":item"=>$item_id));
					if(count($stmt2_row)>1)
						$response = $stmt2_row;
					else
						$response = "agree-success";
				}
				$link = null;
			}
			return $response;
		}
		
		public function cancel_agree_volunteer($item_id,$student_number,$user_id)
		{
			$response = null;
			$res = $this -> check_admin_account($user_id);
			if($res==0)
			{
				$response = "account-error";
			}
			else
			{
				$link = $this -> link_db();
				$sql = "UPDATE  volunteer_list103 SET agree = 0 WHERE student_number = :student_number AND item = :item";
				$stmt = $link -> prepare($sql);
				$stmt -> execute(array(":student_number"=>$student_number,":item"=>$item_id));
				$response = "update-agree-success";
			}
			return $response;
		}
		
		public function edit_volunteer_item($new_item_id,$item_id,$user_id,$student_number)
		{
			$response = null;
			$res = $this -> check_admin_account($user_id);
			if($res==0)
			{
				$response = "account-error";
			}
			else
			{
				$link = $this->link_db();
				$sql = "SELECT MAX( ID ) AS ID FROM volunteer_item103";
				$stmt = $link -> prepare($sql);
				$stmt -> execute();
				$max_id = $stmt->fetch(PDO::FETCH_ASSOC);
				if((int)$new_item_id<=0 || (int)$new_item_id>(int)$max_id["ID"])
				{
					$response = "item-error";
				}
				else
				{
					$sql = "UPDATE  volunteer_list103 SET item = :item WHERE student_number = :student_number AND item = :old_item";
					$stmt = $link -> prepare($sql);
					$stmt -> execute(array(":item"=>$new_item_id,":student_number"=>$student_number,":old_item"=>$item_id));
					$response = "update-item-success";
				}
				$link = null;
			}
			
			return $response;
		}
		
		public function get_volunteer_list($item_name,$user_id)
		{
			$response = null;
			$link = $this->link_db();
			$res = $this -> check_admin_account($user_id);
			if($res==0)
			{
				$response = "account-error";
			}
			else
			{
				$sql = "SELECT  volunteer_list103.agree AS agree, student_water103.sex AS sex, student_water103.name AS name, student_water103.class AS class, volunteer_list103.student_number AS student_number, volunteer_list103.signup_time AS signup_time,cloth_size103.size AS size FROM  student_water103, volunteer_list103,cloth_size103 WHERE volunteer_list103.student_number =  student_water103.stu_number AND  volunteer_list103.item = :item AND student_water103.stu_number=cloth_size103.student_number";
				$stmt = $link -> prepare($sql);
				$stmt -> execute(array(":item"=>$item_name));
				$row = array();
				$len = 0;
				while($res = $stmt->fetch())
				{
					$row[$len]["student_number"] = $res["student_number"];
					$row[$len]["signup_time"] = $res["signup_time"];
					$row[$len]["class"] = $res["class"];
					$row[$len]["name"] = $res["name"];
					$row[$len]["sex"] = $res["sex"];
					$row[$len]["size"] = $res["size"];
					$row[$len]["agree"] = $res["agree"];
					$len++;
				}
				$response = $row;
			}
			
			$link = null;
			return $response;
		}
		
		public function handle_signup($signId,$signup_open)
		{
			$response = "";
			if($signup_open==null)
			{
				$response = "post-error";
			}
			else
			{
				$sess = new my_session();
				$link = $this->link_db();
				$time = new DateTime("NOW",new DateTimeZone("Asia/Taipei"));
				$today = $time -> format('Y-m-d');
				
				$result = $link -> prepare("SELECT COUNT(*) FROM volunteer_item103 WHERE ID = :ID AND isCheck = 1");
				$result -> execute(array(":ID"=>$signId));
				$is_check = $result -> fetchColumn();
				
				if(!$sess->get_session("student"))
				{
					$response = "登入後才可報名!";
				}
				else if((int)$is_check!=0)
				{
					$response = $is_check["item"]."已經額滿!";
				}
				else
				{
					$stmt = $link -> prepare("SELECT COUNT(*) FROM volunteer_list103 WHERE student_number = :student_number AND item = :item");
					$stmt -> execute(array(":student_number"=>$sess->get_session("student"),":item"=>$signId));
					$res = (int)$stmt -> fetchColumn();
					$is_post_again = true;
					if($res==1)
						$is_post_again = false;
					
					$today = $time -> format('Y-m-d H:i:s');
					$rs = $link -> prepare("SELECT COUNT(*) FROM volunteer_item103 WHERE ID = :ID AND signup_close<':signup_close'");
					$rs -> execute(array(":ID"=>$signId,":signup_close"=>$today));
					
					$cloth_set = $link -> prepare("SELECT COUNT(*) FROM cloth_size103 WHERE student_number = :student_number");
					$cloth_set -> execute(array(":student_number"=>$sess->get_session("student")));
					
					if((int)$rs->fetchColumn()!=0)
					{
						$response = "報名已經截止，下次請早!";
					}
					else if((int)$cloth_set->fetchColumn()==0)
					{
						$response = "請先將運動會T-shirt尺寸設定好!";
					}
					else if(!$is_post_again)
					{
						$response = "不可重複報名同一個志工項目!";
					}
					else
					{
						$sql = "INSERT INTO  volunteer_list103(item,student_number,signup_time) VALUES(:item,:student_number,:signup_time)";
						$stmt = $link -> prepare($sql);
						$stmt -> execute(array(":item"=>$signId,":student_number"=>$sess->get_session("student"),":signup_time"=>$today));
						$link = null;
						$response = "報名成功!";
					}
				}
			}
			
			return $response;
		}
		
		public function get_contest_list()
		{
			$link = null;
			$response = null;
			$link = $this -> link_db();
			if($link==null)
				$response = "cannot link db.";
			else
			{
				$sql = "SELECT * FROM  contest_item103";
				$result = $link -> query($sql);
				$contest_row = array();
				$contest_len = 0;
				while($res = $result -> fetch())
				{
					$contest_row[$contest_len]['ID'] = $res['ID'];
					$contest_row[$contest_len]['item'] = $res['item'];
					$contest_row[$contest_len]['a_b'] = $res['a_b'];
					$contest_row[$contest_len]['least_number'] = $res['least_number'];
					$contest_row[$contest_len]['max_number'] = $res['max_number'];
					$contest_row[$contest_len]['category'] = $res['category'];
					$contest_len++;
				}
				$response = $contest_row;
			}
			return $response;
		}
		
		public function product_signup_form($contest_id)
		{
			$link = null;
			$response = null;
			$link = $this -> link_db();
			if($link==null)
				$response = "cannot link db.";
			else
			{
				$sql = "SELECT * FROM contest_item103 WHERE ID = :ID";
				$stmt = $link -> prepare($sql);
				$stmt -> execute(array(":ID"=>$contest_id));
				$contest_row = array();
				$contest_len = 0;
				while($res = $stmt -> fetch())
				{
					$contest_row[$contest_len]['ID'] = $res['ID'];
					$contest_row[$contest_len]['item'] = $res['item'];
					$contest_row[$contest_len]['a_b'] = $res['a_b'];
					$contest_row[$contest_len]['least_number'] = $res['least_number'];
					$contest_row[$contest_len]['max_number'] = $res['max_number'];
					$contest_row[$contest_len]['category'] = $res['category'];
					$contest_len++;
				}
				$response = $contest_row;
			}
			
			return $response;
		}
		
		private function check_admin_account($user_id)
		{
			$link = $this->link_db();
			$sql = "SELECT COUNT(*) FROM admin103 WHERE account = :account AND isFB = 1";
			$res = $link -> prepare($sql);
			$res -> execute(array(":account"=>$user_id));
			$link = null;
			return (int)$res -> fetchColumn();
		}
		
		private function link_db()
		{
			$link_db = null;
			try
			{
				$link_db = new PDO(host, user_name, user_pwd);
			}
			catch(PDOEcxception $e)
			{
				$link_db = null;
			}
			
			if($link_db!=null)
				$link_db -> query("SET NAMES utf8");
			return $link_db;
		}
		
		private function hash_pwd($pwd)
		{
			$salt = strtr(base64_encode(mcrypt_create_iv(16, MCRYPT_DEV_URANDOM)), '+', '.');
			$salt = "$2a$10$".$salt;
			return crypt($pwd,$salt);
		}
		
		private function hash_verify($pwd,$db_pass)
		{
			if($db_pass==crypt($pwd, $db_pass))
				return true;
			else
				return false;
		}
		
		private function excel_writer($objPHPEXCEL,$row_data_excel,$sheet_count)
		{
			$row_count = 0;
			$row_len = count($row_data_excel);
			if($row_len==0)
				return $objPHPEXCEL;
			$myWorkSheet = new PHPExcel_WorkSheet($objPHPEXCEL, $row_data_excel[$row_count]["item"].'('.$row_data_excel[$row_count]["ID"].')');
			$objPHPEXCEL -> addSheet($myWorkSheet, $sheet_count);
			$objPHPEXCEL -> getSheet($sheet_count) -> setCellValueByColumnAndRow(0, 1, "班級");
			$objPHPEXCEL -> getSheet($sheet_count) -> setCellValueByColumnAndRow(1, 1, "學號");
			$objPHPEXCEL -> getSheet($sheet_count) -> setCellValueByColumnAndRow(2, 1, "姓名");
			$objPHPEXCEL -> getSheet($sheet_count) -> setCellValueByColumnAndRow(3, 1, "性別");
			$objPHPEXCEL -> getSheet($sheet_count) -> setCellValueByColumnAndRow(4, 1, "電話");
			$objPHPEXCEL -> getSheet($sheet_count) -> setCellValueByColumnAndRow(5, 1, "信箱");
			$objPHPEXCEL -> getSheet($sheet_count) -> setCellValueByColumnAndRow(6, 1, "同不同意");
			$styleArray = array(
				'font' => array(
					'color' => array(
						'rgb' => '0066FF',
						'name' => 'Arial',
					),
				),
			);
			if($row_data_excel[$row_count]["isCheck"]==1)
			{
				$objPHPEXCEL -> getSheet($sheet_count) -> setCellValueByColumnAndRow(7, 1, "已最後確認");
				$styleArray['font']['color']['rgb'] = '336600';
			}
			else
				$objPHPEXCEL -> getSheet($sheet_count) -> setCellValueByColumnAndRow(7, 1, "未最後確認");
			$objPHPEXCEL -> getSheet($sheet_count) -> getColumnDimension('E')->setWidth(15);
			$objPHPEXCEL -> getSheet($sheet_count) -> getColumnDimension('F')->setWidth(30);
			$objPHPEXCEL -> getSheet($sheet_count) -> getColumnDimension('G')->setWidth(30);
			$objPHPEXCEL -> getSheet($sheet_count) -> getColumnDimension('H')->setWidth(30);
			
			$myWorkSheet -> getStyle('H1') -> applyFromArray($styleArray);
			
			$styleArray = array(
				'font' => array(
					'color' => array(
						'rgb' => 'FF0000',
						'name' => 'Arial',
					),
				),
			);
			
			$column = 2;
			while($row_count<$row_len)
			{
				if($row_data_excel[$row_count]["agree"]==1)
					$row_data_excel[$row_count]["agree"] = "同意";
				else
				{
					$row_data_excel[$row_count]["agree"] = "不同意";
					$myWorkSheet -> getStyle('A'.$column.':'.'H'.$column) -> applyFromArray($styleArray);
				}
				$objPHPEXCEL -> getSheet($sheet_count) -> setCellValueByColumnAndRow(0, $column, $row_data_excel[$row_count]["class"]);
				$objPHPEXCEL -> getSheet($sheet_count) -> setCellValueByColumnAndRow(1, $column, $row_data_excel[$row_count]["stu_number"]);
				$objPHPEXCEL -> getSheet($sheet_count) -> setCellValueByColumnAndRow(2, $column, $row_data_excel[$row_count]["name"]);
				$objPHPEXCEL -> getSheet($sheet_count) -> setCellValueByColumnAndRow(3, $column, $row_data_excel[$row_count]["sex"]);
				$objPHPEXCEL -> getSheet($sheet_count) -> setCellValueExplicitByColumnAndRow(4, $column, $row_data_excel[$row_count]["phone"]);
				$objPHPEXCEL -> getSheet($sheet_count) -> setCellValueByColumnAndRow(5, $column, $row_data_excel[$row_count]["email"]);
				$objPHPEXCEL -> getSheet($sheet_count) -> setCellValueByColumnAndRow(6, $column, $row_data_excel[$row_count]["agree"]);
				$column += 1;
				$row_count++;
			}	
			
			return $objPHPEXCEL;
		}
		
		private function excel_save($objPHPEXCEL)
		{
			$objWriter = PHPExcel_IOFactory::createWriter($objPHPEXCEL, 'Excel5');
			$objWriter -> save("/var/www/sports/67/admin/excel/志工組別.xls");
			$objPHPEXCEL -> disconnectWorksheets();
			unset($objPHPEXCEL);
			return "/sports/67/admin/excel/志工組別.xls";
		}
		
	}
?>
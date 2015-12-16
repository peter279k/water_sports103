<?php
	require_once("handle/Model/PHPExcel/PHPExcel.php");
	define("host", "mysql:host=localhost;dbname=sports");
	define("user_name", "sports");
	define("user_pwd", "sportsdpo1903");
	
	function excel_writer($row_data_excel)
	{
		$objPHPEXCEL = new PHPExcel();
		$row_len = count($row_data_excel);
		$row_count = 0;
		$myWorkSheet = new PHPExcel_WorkSheet($objPHPEXCEL, "班級");
		$objPHPEXCEL -> addSheet($myWorkSheet, 0);
		$objPHPEXCEL -> getSheet(0) -> setCellValueByColumnAndRow(0, 1, "班級");
		
		$objPHPEXCEL -> getSheet(0) -> getColumnDimension('A')->setWidth(12);
		$column = 2;
		while($row_count<$row_len)
		{
			$objPHPEXCEL -> getSheet(0) -> setCellValueByColumnAndRow(0, $column, $row_data_excel[$row_count]["class"]);
			$row_count++;
			$column++;
		}
		
		$objWriter = PHPExcel_IOFactory::createWriter($objPHPEXCEL, 'Excel5');
		$objWriter -> save("/var/www/sports/67/admin/excel/class.xls");
		$objPHPEXCEL -> disconnectWorksheets();
		unset($objPHPEXCEL);
		header("Location: http://dpo.nttu.edu.tw/sports/67/admin/excel/class.xls");
	}
	
	$link = null;
	$link = new PDO(host,user_name,user_pwd);
	
	if($link==null)
	{
		echo "cannot link db.";
	}
	else
	{
		$objPHPEXCEL = new PHPExcel();
		
		$sql = "SELECT DISTINCT class FROM student67";
		$link -> query("SET NAMES utf8");
		$result = $link -> query($sql);
		$row = array();
		$row_len = 0;
		while($res = $result -> fetch())
		{
			$row[$row_len]["class"] = $res["class"];
			$row_len++;
		}
		excel_writer($row);
	}
?>
<?php

//
// 連接 MySQL 並開啟資料庫
//
$conn = mysqli_connect("localhost","sports","sportsdpo1903");
if (mysqli_connect_errno($conn))
  {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }
mysqli_query($conn, "SET NAMES utf8");

$conn2 = mysqli_connect("localhost","water_sports","waterdpo1903");
if (mysqli_connect_errno($conn2))
  {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }
mysqli_query($conn2, "SET NAMES utf8");
$conn3 = mysqli_connect("localhost","nttustd","stddpo1903");
if (mysqli_connect_errno($conn3))
  {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }
mysqli_query($conn3, "SET NAMES utf8");

?>

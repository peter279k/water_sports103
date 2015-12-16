$(function(){
	
	alertify.set({
		labels:{
			ok: "確定",
			cancel: "取消"
		}
	});
	
	var res = "";
	$("#main-page").show();
	var dat = new Date();
	var start_date = Date.parse("2015-03-02");
	var today = dat.getFullYear()+'-'+(dat.getMonth()+1)+'-'+dat.getDate();
	/*
	if(Date.parse(today)-start_date<0)
		alertify.alert("我們3/2開始報名!", function() {
			location.href = "/sports/water_sports103/";
		});
	else
		$("#main-page").show();*/
	
	$.post("/sports/water_sports103/handle/Route/route?action=get_volunteer_item", function(response){
		res = $.parseJSON(response);
		var row = res["result"];
		var row_i = 0;
		
		var str = "<thead>"+
			"<tr><th>項目</th><th>志工項目名稱</th>"+
			"<th>報名開放時間</th><th>報名截止時間</th><th>每組上限人數</th>"+
			"<th>目前報名人數</th>"+
			"<th>報名</th></tr></thead><tbody>";
		
		var link_sign = "";
		for(;row_i<row.length;row_i++){
			
			if(row[row_i]["link_sign"]=="報名尚未開始")
				link_sign = "<td class='mytext3'>"+row[row_i]["link_sign"]+"</td>";
			else if(row[row_i]["link_sign"]=="報名截止")	
				link_sign = "<td class='mytext6'>"+row[row_i]["link_sign"]+"</td>";
			else if(row[row_i]["link_sign"]=="已經額滿")
				link_sign = "<td class='mytext5'>"+row[row_i]["link_sign"]+"</td>";
			else
				link_sign = "<td><a href='javascript:post_item("+row[row_i]["ID"]+','+'"'+row[row_i]["signup_open"]+'"'+")'>我要報名</a></td>";
			str += "<tr>"+
				"<th>"+row[row_i]["ID"]+"</th>"+
				"<td>"+row[row_i]["item"]+"</td>"+
				"<td>"+row[row_i]["signup_open"]+"</td>"+
				"<td>"+row[row_i]["signup_close"]+"</td>"+
				"<td>"+row[row_i]["limit_number"]+"</td>"+
				"<td class='mytext3'>"+row[row_i]["sign_people"]+"</td>"+
				link_sign+"</tr>";
		}
		
		$("#volunteer-table").append(str+"</tbody>");
		$("#volunteer-table").table("refresh");
		
	});
	
	$.post("/sports/water_sports103/handle/Route/route?action=check_login_student", function(response){
		res = $.parseJSON(response);
		if(!res["result"]){
			$("#panel-login").show();
		}
		else{
			$("#panel-login").hide();
		}
	});
	
	$("#login-btn").bind("click", function(){
		var account = null;
		var pwd = null;
		var recaptcha = null;
		
		account = $("#user-acc").val();
		pwd = $("#user-pwd").val();
		recaptcha = $("#g-recaptcha-response").val();
		if($("#user-acc").val()==""){
			alertify.alert("未輸入帳號!");
		}
		else if($("#user-pwd").val()==""){
			alertify.alert("未輸入密碼!");
		}
		else if(recaptcha==""){
			alertify.alert("未通過驗證!");
		}
		else{
			$.post("/sports/water_sports103/handle/Route/route?action=handle_login_student", {"data": [{"user-acc": account,"user-pwd": pwd,"recaptcha": recaptcha}]} ,function(response){
				console.log(response);
				res = $.parseJSON(response);
				if(res["result"]=="login-success"){
					location.reload();
				}
				else{
					alertify.alert("<h2 class='mytext2'>登入失敗!</h2>");
				}
			});
		}
	});
	
	$("#update-people").click(function(){
		location.reload();
	});
	
	$("#cloth-set-action").click(function(){
		alertify.confirm("確定尺寸嗎?一但送出之後便無法更改", function(e){
			if(e){
				$.post("/sports/water_sports103/handle/Route/route?action=cloth_set_action",{"data": $("#select-cloth-size").val()} , function(response){
					res = $.parseJSON(response);
					alertify.alert("<h2 class='mytext5'>"+res["result"]+"</h2>");
				});
			}
		});
	});
	
});

function post_item(id_name,signup_time){
	alertify.confirm("確定要報名此項目嗎?一但送出之後便無法更改", function(e){
		if(e){
			$.post("/sports/water_sports103/handle/Route/route?action=handle_signup_volunteer", {"data": [{"id_name": id_name, "signup_time": signup_time}]}, function(response){
				res = $.parseJSON(response);
				alertify.alert(res["result"]);
			});
		}
	});	
}
$(function(){
	
	alertify.set({
		labels:{
			ok: "確定",
			cancel: "取消"
		}
	});
	
	var det_os = navigator.userAgent;
	
	if(det_os.indexOf("Mozilla")>-1){
		$("#main-page").show();
	}
	else{
		alertify.alert("Chrome與Firefox比較好用!");
		$("#main-page").hide();
	}
	
	var res = "";
	
	$.post("/sports/67/handle/Route/route?action=check_login_student", function(response){
		//console.log(response);
		res = $.parseJSON(response);
		if(!res["result"]){
			$("#panel-login").show();
			$("#panel-logon").hide();
		}
		else{
			$("#panel-login").hide();
			$("#panel-logon").show();
		}
	});
	
	$("#panel-logon").click(function(){
		$.post("/sports/67/handle/Route/route?action=handle_logon_student", function(response){
			//console.log(response);
			location.reload();
		});
	});
	
	$( document ).on( "pagecreate", function() {
		$( ".photopopup" ).on({
			popupbeforeposition: function() {
				var maxHeight = $( window ).height() - 60 + "px";
				$( ".photopopup img" ).css( "max-height", maxHeight );
			}
		});
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
			$.post("/sports/67/handle/Route/route?action=handle_login_student", {"data": [{"user-acc": account,"user-pwd": pwd,"recaptcha": recaptcha}]} ,function(response){
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
	
});
$(function() {
	
	alertify.set({
		labels:{
			ok: "確定",
			cancel: "取消"
		}
	});
	
	var res = "";
	$("#main-page").hide();
	
	$.post("/sports/67/handle/Route/route?action=lightrun_date_check", function(response) {
		res = $.parseJSON(response);
		res = res["result"];
		if(res["check_date"].indexOf("報名即將")!=-1) {
			alertify.alert(res["check_date"], function() {
				location.href = "http://dpo.nttu.edu.tw/sports/67/";
			});
		}
		else if(res["check_date"]=="報名結束!") {
			alertify.alert(res["check_date"], function() {
				location.href = "http://dpo.nttu.edu.tw/sports/67/";
			});
		}
		else if(res["signup-id"]=="報名已經到上限350人!") {
			alertify.alert(res["signup-id"], function() {
				location.href = "http://dpo.nttu.edu.tw/sports/67/";
			});
		}
		else {
			check_login();
		}
	});
	
	$("#signup-action").click(function() {
		alertify.confirm("<h2>因有名額上限350人，送出不可取消，確定送出?</h2>", function(e) {
			if(e) {
				$.post("/sports/67/handle/Route/route?action=post_light_run",{data: [{"stu-number": $("#stu-number").val(),"cloth-size": $("#cloth-size").val()}]} ,function(response) {
					res = $.parseJSON(response);
					res = res["result"];
					if(res=="has-signed-up") {
						alertify.alert("對不起，您已經報名過了!");
					}
					else {
						alertify.alert(res, function() {
							location.href = "http://dpo.nttu.edu.tw/sports/67/";
						});
					}
				});	
			}
		});
	});
	
});

function check_login() {
	$.post("/sports/67/handle/Route/route?action=check_login_student", function(response) {
		res = $.parseJSON(response);
		if(!res["result"]){
			alertify.alert("尚未登入!", function() {
				location.href = "http://dpo.nttu.edu.tw/sports/67/";
			});
		}
		else{
			$("#main-page").show();
			$("#stu-number").val(res["result"]);
		}
	});
}
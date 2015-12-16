$(function(){
	var res = "";
	
	alertify.set({
		labels:{
			ok: "確定",
			cancel: "取消"
		}
	});
	
	$.post("/sports/water_sports103/handle/Route/route?action=volunteer_signup_stat", signup_stat);
	$("#update-stat").click(function() {
		$.post("/sports/water_sports103/handle/Route/route?action=volunteer_signup_stat", signup_stat);
	});
});

function signup_stat(response) {
	console.log(response);
	res = $.parseJSON(response);
	res = res["result"];
	$("#main-page").show();
	if(res=="請先登入!") {
		$("#main-page").hide();
		alertify.alert(res, function() {
			location.href = "http://dpo.nttu.edu.tw/sports/water_sports103/";
		});
	}
	else {
		if(res=="no-record") {
			$("#cloth-size").html("未有報名紀錄!");
		}
		else {
			var str = "<thead>"+
				"<tr><th>項目</th><th>項目名稱</th><th>報名結果</th>"+
				"</tr></thead><tbody>";
			for(var len=0;len<res.length;len++) {
				str += "<tr><th>"+(len+1)+"</th>"
					+"<td>"+res[len]["item"]+"</td>"
					+"<td>"+res[len]["agree"]+"</td></tr>"
			}
			
			$("#signup-stat-table").html('');
			$("#signup-stat-table").append(str+"</tbody>");
		}
	}
}
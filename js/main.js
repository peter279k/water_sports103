$(function(){
	var res = "";
	//facebook js sdk initial
	alertify.set({
		labels:{
			ok: "確定",
			cancel: "取消"
		}
	});
	
	$("#main-page").hide();
	var user_id = "";
	var token = "";
	window.fbAsyncInit = function() {
		FB.init({
			appId      : '777894535619247', // Set YOUR APP ID
			//channelUrl : 'http://hayageek.com/examples/oauth/facebook/oauth-javascript/channel.html', // Channel File
			status     : true, // check login status
			cookie     : true, // enable cookies to allow the server to access the session
			xfbml      : true  // parse XFBML
		});
		
		FB.getLoginStatus(function(response) {
			if (response.status === 'connected') {
				// the user is logged in and has authenticated your
				// app, and response.authResponse supplies
				// the user's ID, a valid access token, a signed
				// request, and the time the access token 
				// and signed request each expire
				$("#main-page").show();
				console.log("Connected to Facebook");
			}
			else if (response.status === 'not_authorized') {
				// the user is logged in to Facebook, 
				// but has not authenticated your app
				console.log('not_authorized');
				location.href = "admin.html";
			}
			else {
				// the user isn't logged in to Facebook.
				console.log('not_logged');
				location.href = "admin.html";
			}
		});
    };
	
	$("#team-search").click(team_search);
	
	
	$.post("/sports/water_sports103/handle/Route/route?action=admin_volunteer_item", function(response){
		res = $.parseJSON(response);
		res = res["result"];
		var len = 0;
		var sports = "";
		for(;len<res.length;len++){
			if(res[len]["isCheck"]!=1) {
				sports += '<option value="'+res[len]["ID"]+'">'+res[len]['item']+'('+res[len]["ID"]+')'+'</option>';
			}
			
		}
		
		$("#item-list").append(sports);
		$("#item-list").selectmenu( "refresh");
	});
	
	$("#cloth-cal").click(function() {
		res = check_login();
		if(res === "not_authorized" || res === "not_logged") {
			$("#main-page").hide();
			location.href = "admin.html";
		}
		else {
			var user_id = res.authResponse.userID;
			$.post("/sports/water_sports103/handle/Route/route?action=cloth_size_cal", {"data": [{"user_id": user_id}]} , function(response) {
				res = $.parseJSON(response);
				res = res["result"];
				var result = 0;
				var str2 = "<thead>"+
						"<tr><th>項目</th><th>班級</th><th>學號</th><th>姓名</th>"+
						"<th>性別</th><th>衣服尺寸</th>"+"</tr></thead><tbody>";
				var no_cloth_len = 1;
				if(res=="no-record") {
					alertify.alert("沒有紀錄!");
				}
				else {
					for(var len=0;len<res.length;len++) {
						if(res[len]["student_number"]!="no-problem") {
							result += 1;
							str2 += "<tr><th>"+(no_cloth_len)+"</th>"+
								"<td>"+res[len]["class"]+"</td>"+
								"<td>"+res[len]["stu_number"]+"</td>"+
								"<td>"+res[len]["name"]+"</td>"+
								"<td>"+res[len]["sex"]+"</td>"+
								"<td>"+res[len]["size"]+"</td></tr>";
							no_cloth_len += 1;	
						}
					}
				
					if(res=="account-error") {
						location.href = "admin.html";
					}
					else {
						var len = 0;
						var str = "<thead>"+
						"<tr><th>項目</th><th>尺寸</th><th>件數</th>"+
						"<th>備註</th></tr></thead><tbody>";
						str += "<tr>"+"<td>"+(++len)+"</td>"+"<td>3XS</td>"+
							"<td class='mytext2'>"+res[0]["3XS"]+"</td>"+
							"<td class='mytext3'>"+res[1]["3XS"]+"件衣服未報名志工組別</td>"+"</tr>";
						str += "<tr>"+"<td>"+(++len)+"</td>"+"<td>2XS</td>"+
							"<td class='mytext2'>"+res[0]["2XS"]+"</td>"+
							"<td class='mytext3'>"+res[1]["2XS"]+"件衣服未報名志工組別</td>"+"</tr>";
						str += "<tr>"+"<td>"+(++len)+"</td>"+"<td>XS</td>"+
							"<td class='mytext2'>"+res[0]["XS"]+"</td>"+
							"<td class='mytext3'>"+res[1]["XS"]+"件衣服未報名志工組別</td>"+"</tr>";
						str += "<tr>"+"<td>"+(++len)+"</td>"+"<td>S</td>"+
							"<td class='mytext2'>"+res[0]["S"]+"</td>"+
							"<td class='mytext3'>"+res[1]["S"]+"件衣服未報名志工組別</td>"+"</tr>";
						str += "<tr>"+"<td>"+(++len)+"</td>"+"<td>M</td>"+
							"<td class='mytext2'>"+res[0]["M"]+"</td>"+
							"<td class='mytext3'>"+res[1]["M"]+"件衣服未報名志工組別</td>"+"</tr>";
						str += "<tr>"+"<td>"+(++len)+"</td>"+"<td>L</td>"+
							"<td class='mytext2'>"+res[0]["L"]+"</td>"+
							"<td class='mytext3'>"+res[1]["L"]+"件衣服未報名志工組別</td>"+"</tr>";
						str += "<tr>"+"<td>"+(++len)+"</td>"+"<td>XL</td>"+
							"<td class='mytext2'>"+res[0]["XL"]+"</td>"+
							"<td class='mytext3'>"+res[1]["XL"]+"件衣服未報名志工組別</td>"+"</tr>";	
						str += "<tr>"+"<td>"+(++len)+"</td>"+"<td>2L</td>"+
							"<td class='mytext2'>"+res[0]["2L"]+"</td>"+
							"<td class='mytext3'>"+res[1]["2L"]+"件衣服未報名志工組別</td>"+"</tr>";
						str += "<tr>"+"<td>"+(++len)+"</td>"+"<td>3L</td>"+
							"<td class='mytext2'>"+res[0]["3L"]+"</td>"+
							"<td class='mytext3'>"+res[1]["3L"]+"件衣服未報名志工組別</td>"+"</tr>";

					
						$("#clothes").html("衣服總件數: "+res[0]["clothes"]);	
						$("#no-sign-clothes").html("未報名組別衣服總件數: "+res[0]["no_sign_clothes"]);	
						$("#volunteer-list-table").html("");	
						$("#volunteer-list-table").append(str+"</tbody>");	
					
						$("#no-signup-table").html("");	
						$("#no-signup").html("未報名志工組別");
						$("#no-signup-table").append(str2+"</tbody>");	
					}
				}
			});
		}
	});
	
	$("#logon-action").click(function() {
		Logout();
	});
	
	// Load the SDK asynchronously
	(function(d){
		var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement('script'); js.id = id; js.async = true;
		js.src = "//connect.facebook.net/zh_TW/all.js";
		ref.parentNode.insertBefore(js, ref);
	}(document));
	
});

function check_login(){
	var result = "";
	FB.getLoginStatus(function(response) {
		if (response.status === 'connected') {
			// the user is logged in and has authenticated your
			// app, and response.authResponse supplies
			// the user's ID, a valid access token, a signed
			// request, and the time the access token 
			// and signed request each expire
			//var uid = response.authResponse.userID;
			//var accessToken = response.authResponse.accessToken;
			result = response;
		}
		else if (response.status === 'not_authorized') {
			// the user is logged in to Facebook, 
			// but has not authenticated your app
			result = 'not_authorized';
		}
		else {
			// the user isn't logged in to Facebook.
			result = 'not_logged';
		}
	});
	
	return result;
}

function post_agree(item_id,student_number,user_id) {
	res = check_login();
	if(res === "not_authorized" || res === "not_logged") {
		$("#main-page").hide();
		location.href = "admin.html";
	}
	else {
		$.post("/sports/water_sports103/handle/Route/route?action=post_agree_volunteer", {"data": [{"item_id": item_id, "student_number": student_number, "user_id": user_id}]}, function(response){
			res = $.parseJSON(response);
			res = res["result"];
			if(res=="account-error") {
				location.href = "admin.html";
			}
			else if(res=="agree-success") {
				alertify.alert("同意成功!", function() {
					team_search();
				});
			}
			else if(res=="is-limit-number") {
				alertify.alert("已到同意上限人數!");
			}
			else {
				var str = "<p>也有報名下列志工組別(代號):<p>";
				var arr = new Array();
				for(var len=0;len<res.length;len++) {
					arr[len] = res[len]["item"];
				}
				str += arr.join();
				alertify.alert(str, function() {
					team_search();
				});
			}
		});
	}
}

function cancel_agree(item_id,student_number,user_id) {
	res = check_login();
	if(res === "not_authorized" || res === "not_logged") {
		$("#main-page").hide();
		location.href = "admin.html";
	}
	else {
		$.post("/sports/water_sports103/handle/Route/route?action=cancel_agree_volunteer", {"data": [{"item_id": item_id, "student_number": student_number, "user_id": user_id}]}, function(response){
			res = $.parseJSON(response);
			res = res["result"];
			if(res=="account-error") {
				location.href = "admin.html";
			}
			else if(res=="update-agree-success") {
				alertify.alert("修改成功!", function() {
					team_search();
				});
			}
			else {
				console.log(response);
			}
		});
	}
}

function edit_item(item_id,student_number,user_id) {
	res = check_login();
	if(res === "not_authorized" || res === "not_logged") {
		$("#main-page").hide();
		location.href = "admin.html";
	}
	else {
		// prompt dialog
		alertify.prompt("請輸入要修改的新項目號碼", function (e, str) {
			// str is the input text
			if (e) {
				// user clicked "ok"
				$.post("/sports/water_sports103/handle/Route/route?action=edit_volunteer_item", {"data": [{"new_item_id": str, "item_id": item_id, "user_id": user_id, "student_number": student_number}]}, function(response){
					res = $.parseJSON(response);
					res = res["result"];
					if(res=="account-error") {
						location.href = "admin.html";
					}
					else if(res=="item-error") {
						alertify.alert("輸入項目錯誤!");
					}
					else if(res=="update-item-success") {
						alertify.alert("修改項目成功!", function() {
							team_search();
						});
					}
					else {
						console.log(res);
					}
				});
			}
		}, "ex: 1");
	}
}

function Logout() {
    FB.logout(function(){location.href="admin.html";});
	location.href="admin.html";
}

function team_search() {
	res = check_login();
	var user_id = res.authResponse.userID;
	if(res === "not_authorized" || res === "not_logged") {
		$("#main-page").hide();
		location.href = "admin.html";
	}
	else {
		$.post("/sports/water_sports103/handle/Route/route?action=get_volunteer_list", {"data": [{"user_id": res.authResponse.userID,"item-list": $("#item-list").val()}]}, function(response){
			$("#volunteer-list-table").html('');
			res = $.parseJSON(response);
			res = res["result"];
			if(res === "account-error") {
				location.href = "admin.html";
			}
			else {
				var len = 0;
				var str = "<thead>"+
					"<tr><th>項目</th><th>班級</th><th>學號</th><th>姓名</th>"+
					"<th>性別</th><th>衣服尺寸</th><th>報名時間</th><th>是否同意</th>"+
					"<th>我要修改</th>"+
					"</tr></thead><tbody>";
				var agree = "";	
				var edit = "";	
				for(;len<res.length;len++) {
					if(res[len]['agree']==0) {
						agree = "<td><a href='javascript:post_agree("+$("#item-list").val()+','+'"'+res[len]["student_number"]+'"'+','+'"'+user_id+'"'+")'>我要同意</a></td>";
					}
					else {
						agree = "<td><a href='javascript:cancel_agree("+$("#item-list").val()+','+'"'+res[len]["student_number"]+'"'+','+'"'+user_id+'"'+")'>取消同意</a></td>";
					}
					edit = "<td><a href='javascript:edit_item("+$("#item-list").val()+','+'"'+res[len]["student_number"]+'"'+','+'"'+user_id+'"'+")'>我要修改</a></td>";
					str += "<tr><th>"+(len+1)+"</th>"+
						"<td>"+res[len]['class']+"</td>"+
						"<td>"+res[len]['student_number']+"</td>"+
						"<td>"+res[len]['name']+"</td>"+
						"<td>"+res[len]['sex']+"</td>"+
						"<td>"+res[len]['size']+"</td>"+
						"<td>"+res[len]['signup_time']+"</td>"+
						agree+edit+"</tr>";
				}
				
				$("#volunteer-list-table").html('');
				$("#no-signup-table").html("");	
				$("#volunteer-list-table").append(str+"</tbody>");
				$("#volunteer-list-table").table("refresh");
			}
		});
	}
}
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
	
	$.post("/sports/water_sports103/handle/Route/route?action=get_checkvolunteer_item", get_checkvolunteer_item);
	
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

function get_checkvolunteer_item(response) {
	res = $.parseJSON(response);
	res = res["result"];
	var len = 0;
		/*$row[$len]["isCheck"] = $res["isCheck"];
				$row[$len]["limit_number"] = $res["limit_number"];
				$row[$len]["ID"] = $res["ID"];*/
	var str = "<thead>"+
		"<tr><th>項目</th>"+"<th>項目名稱</th>"+"<th>上限人數</th><th>同意人數</th><th>我要確認</th>"+
		"</tr></thead><tbody>";
	var check_str = "";	
	for(;len<res.length;len++) {
		if(res[len]["limit_number"]!=res[len]["signup_people"]) {
			check_str = "<td class='mytext'>未能確認</td></tr>";
		}
		else if(res[len]["isCheck"]==0) {
			check_str = "<td><a href='javascript:post_check_item("+res[len]["ID"]+")'>我要確認</a></td></tr>";
		}
		else {
			check_str = "<td class='mytext2'>已經確認</td></tr>";
		}
		
		str += "<tr><td>"+res[len]["ID"]+"</td>";
		str += "<td>"+res[len]["item"]+"</td>";
		str += "<td>"+res[len]["limit_number"]+"人</td>";
		str += "<td class='mytext3'>"+res[len]["signup_people"]+"人</td>";
		str += check_str;
	}
	
	$("#final-check-table").html('');
	$("#final-check-table").append(str);
	$("#final-check-table").table('refresh');
}

function post_check_item(item_id) {
	res = check_login();
	var user_id = "";
	if(res.status === "connected") {
		user_id = res.authResponse.userID;
	}
	else {
		location.href = "admin.html";
	}
	
	$.post("/sports/water_sports103/handle/Route/route?action=post_check_volunteeritem", {"data": [{"item_id": item_id,"user_id": user_id}]} , function(response) {
		res = $.parseJSON(response);
		res = res["result"];
		if(res=="account-error") {
			location.href = "admin.html";
		}
		else {
			alertify.alert(res);
		}
	});
	
	$.post("/sports/water_sports103/handle/Route/route?action=get_checkvolunteer_item", get_checkvolunteer_item);
}

function Logout() {
    FB.logout(function(){location.href="admin.html";});
	location.href="admin.html";
}
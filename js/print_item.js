$(function() {
	
	alertify.set({
		labels:{
			ok: "確定",
			cancel: "取消"
		}
	});
	
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
	
	var res = "";
	
	$.post("/sports/water_sports103/handle/Route/route?action=admin_volunteer_item", function(response) {
		res = $.parseJSON(response);
		res = res["result"];
		var str = "<legend class='mytext2'>水運會</legend>"+"<input id='check-all1' onchange=check_all('sports-check') type='checkbox'>"+
						'<label for="check-all1">全選</label>';
		
		var temp = "";
		for(var len=0;len<res.length;len++) {
			str += "<input name='sports-check' data-theme='b' type='checkbox' id='"+res[len]["ID"]+"'>"+
					'<label for="'+res[len]["ID"]+'">'+res[len]["item"]+'</label>';
		}
		
		$("#checkbox-item").append(str);
		$("input[type='checkbox']").checkboxradio();
		$("input[type='checkbox']").checkboxradio('refresh');
	});
	
	$("#download-excel-file").click(function() {
		res = check_login();
		if(res === "not_authorized" || res === "not_logged") {
			$("#main-page").hide();
			location.href = "admin.html";
		}
		else {
			var item_arr = new Array();
			var len = 0;
			for(var i=1;i<=27;i++) {
				if($("#"+i).prop('checked')) {
					item_arr[len] = i;
					len++;
				}
			}
		
			if(item_arr.length==0) {
				alertify.alert("未選取組別!");
			}
			else {
				var user_id = res.authResponse.userID;
				$.post("/sports/water_sports103/handle/Route/route?action=download_excel_file", {"data": [{"user_id": user_id, "select-item": item_arr.join()}]}, function(response) {
					console.log(response);
					res = $.parseJSON(response);
					res = res["result"];
					location.href = res;
				});
			}
		}
	});
	
	$("#download-excel-all-file").click(function() {
		res = check_login();
		if(res === "not_authorized" || res === "not_logged") {
			$("#main-page").hide();
			location.href = "admin.html";
		}
		else {
			var item_arr = new Array();
			var len = 0;
			for(var i=1;i<=27;i++) {
				item_arr[len] = i;
				len++;
			}
			
			var user_id = res.authResponse.userID;
			$.post("/sports/water_sports103/handle/Route/route?action=download_excel_file", {"data": [{"user_id": user_id, "select-item": item_arr.join()}]}, function(response) {
				res = $.parseJSON(response);
				res = res["result"];
				location.href = res;
			});
		}
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

function check_all(check_str) {
	var check = false;
	for(var i=1;i<=6;i++) {
		if($("#check-all"+i).prop('checked')) {
			$('input[name="'+check_str+'"]').prop('checked', true).checkboxradio('refresh');
			check = true;
		}
	}
	if(!check)
		$('input[name="'+check_str+'"]').prop('checked', false).checkboxradio('refresh');
}
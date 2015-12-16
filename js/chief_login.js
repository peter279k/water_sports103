$(function() {
	alertify.set({
		labels:{
			ok: "確定",
			cancel: "取消"
		}
	});
	
	var res = "";
	$("#main-page").hide();
	
	window.fbAsyncInit = function() {
		FB.init({
			appId      : '904767256210916', // Set YOUR APP ID
			//channelUrl : 'http://hayageek.com/examples/oauth/facebook/oauth-javascript/channel.html', // Channel File
			status     : true, // check login status
			cookie     : true, // enable cookies to allow the server to access the session
			xfbml      : true  // parse XFBML
		});
		
		FB.Event.subscribe('auth.authResponseChange', function(response) {
			if (response.status === 'connected') {
				// the user is logged in and has authenticated your
				// app, and response.authResponse supplies
				// the user's ID, a valid access token, a signed
				// request, and the time the access token 
				// and signed request each expire
				console.log("Connected to Facebook");
			}
			else if (response.status === 'not_authorized') {
				// the user is logged in to Facebook, 
				// but has not authenticated your app
				console.log('not_authorized');
				alertify.alert("註冊未成功!");
			}
			else {
				// the user isn't logged in to Facebook.
				alertify.alert("註冊未成功!");
			}
		});
    };
	
	$("#facebook-login").click(fb_login);
	$("#login-btn").click(function() {
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
		else {
			account = $("#user-acc").val();
			pwd = $("#user-pwd").val();
			$.post("/sports/67/handle/Route/route?action=handle_chief_login",{"data": [{"user-acc": account,"user-pwd": pwd,"recaptcha": recaptcha}]}  , function(response) {
				res = $.parseJSON(response);
				res = res["result"];
				if(res=="login-success") {
					location.href = "/sports/67/chief/main";
				}
				else if(res=="login-error") {
					alertify.alert("登入失敗!");
				}
				else {
					console.log(res);
				}
			});
		}
	});
	
	//check-login
	$.post("/sports/67/handle/Route/route?action=check_chief_login", function(response) {
		res = $.parseJSON(response);
		res = res["result"];
		if(!res) {
			console.log("no-login");
		}
		else {
			location.href = "/sports/67/chief/main";
		}
	});
	
	$.post("/sports/67/handle/Route/route?action=contest_date_check", function(response) {
		res = $.parseJSON(response);
		res = res["result"];
		if(res!="OK") {
			alertify.alert(res, function() {
				location.href = "/sports/67/";
			});
		}
		else {
			$("#main-page").show();
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

function fb_login() {
	FB.login(function(response) {
		if (response.authResponse) {
			$.post("/sports/67/handle/Route/route?action=handle_chief_fblogin",{data: [{"user-id": response.authResponse.userID}]} , function(response) {
				res = $.parseJSON(response);
				res = res["result"];
				if(res=="fb-login-success") {
					location.href = "/sports/67/chief/main";
				}
				else {
					alertify.alert("登入失敗!");
				}
			});
		}
		else {
			console.log('User cancelled login or did not fully authorize.');
		}
	},{scope: 'email,public_profile'});
}
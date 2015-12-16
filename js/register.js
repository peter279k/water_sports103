$(function() {
	alertify.set({
		labels:{
			ok: "確定",
			cancel: "取消"
		}
	});
	
	var res = "";
	$("#main-page").hide();
	
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
	
	$("#normal-register-btn").click(function() {
		recaptcha = $("#g-recaptcha-response").val();
		
		if($("#user-acc").val()=="") {
			alertify.alert("<h2>請輸入學號!</h2>");
		}
		else if($("#user-pwd").val()=="" || $("#user-pwd2").val()=="") {
			alertify.alert("<h2>請輸入密碼!</h2>");
		}
		else if($("#user-pwd").val()!=$("#user-pwd2").val()) {
			alertify.alert("<h2>密碼輸入不一致!</h2>");
		}
		else if(recaptcha==""){
			alertify.alert("<h2>未通過驗證!</h2>");
		}
		else {
			$.post("/sports/67/handle/Route/route?action=register_chief_account",{data: [{"user-acc": $("#user-acc").val(),"user-pwd": $("#user-pwd").val(),"recaptcha": recaptcha}]} , function(response) {
				res = $.parseJSON(response);
				res = res["result"];
				if(res=="is-register") {
					alertify.alert("<h2>此學號已有人註冊!</h2>");
				}
				else if(res=="no-stuNum-found") {
					alertify.alert("<h2>查無此學號!</h2>");
				}
				else if(res=="register-success") {
					alertify.alert("<h2>註冊成功!</h2>", function() {
						location.href = "/sports/67/chief/login";
					});
				}
				else {
					console.log(res);
				}
			});
		}
	});
	
	$("#facebook-register-btn").click(Register);
	
	// Load the SDK asynchronously
	(function(d){
		var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement('script'); js.id = id; js.async = true;
		js.src = "//connect.facebook.net/zh_TW/all.js";
		ref.parentNode.insertBefore(js, ref);
	}(document));
	
});

function Register() {
	if($("#user-facebook-acc").val()=="" || $("#user-facebook-acc2").val()=="") {
		alertify.alert("<h2>請輸入學號!</h2>");
	}
	else if($("#user-facebook-acc").val()!=$("#user-facebook-acc2").val()) {
		alertify.alert("<h2>學號輸入不一致!</h2>");
	}
	else {
		FB.login(function(response) {
			if (response.authResponse) {
				$.post("/sports/67/handle/Route/route?action=register_chief_fbaccount",{data: [{"user-fbacc": $("#user-facebook-acc").val(),"user-id": response.authResponse.userID}]} , function(response) {
					res = $.parseJSON(response);
					res = res["result"];
					if(res=="is-register") {
						alertify.alert("<h2>此學號已有人註冊!</h2>");
					}
					else if(res=="no-stuNum-found") {
						alertify.alert("<h2>查無此學號!</h2>");
					}
					else if(res=="register-success") {
						alertify.alert("<h2>註冊成功!</h2>", function() {
							location.href = "/sports/67/chief/login";
						});
					}
					else {
						console.log(res);
					}
				});
			}
			else {
				alertify.alert("註冊取消!");
				console.log('User cancelled login or did not fully authorize.');
			}
		},{scope: 'email,public_profile'});
	}
}
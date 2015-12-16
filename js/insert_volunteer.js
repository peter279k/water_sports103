$(function() {
	alertify.set({
		labels:{
			ok: "確定",
			cancel: "取消"
		}
	});
	
	window.fbAsyncInit = function() {
		FB.init({
			appId      : '439241719561429', // Set YOUR APP ID
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
	
	$.post("/sports/67/handle/Route/route?action=admin_volunteer_item", function(response) {
		res = $.parseJSON(response);
		res = res["result"];
		var sports = '<optgroup class="mytext" label="運動會">';
		var night = '<optgroup class="mytext2" label="晚會">';
		var night_sport = '<optgroup class="mytext3" label="運動會+晚會">';
		var len = 0;
		for(;len<res.length;len++){
			if(res[len]["night_sport"]=="運動會") {
				sports += '<option value="'+res[len]["ID"]+'">'+res[len]['item']+'('+res[len]["ID"]+')'+'</option>';
			}
			else if(res[len]["night_sport"]=="晚會") {
				night += '<option value="'+res[len]["ID"]+'">'+res[len]['item']+'('+res[len]["ID"]+')'+'</option>';
			}
			else {
				night_sport += '<option value="'+res[len]["ID"]+'">'+res[len]['item']+'('+res[len]["ID"]+')'+'</option>';
			}
			
		}
		
		sports += "</optgroup>";
		night += "</optgroup>";
		night_sport += "</optgroup>";
		
		$("#item-number").append(sports+night+night_sport);
		$("#item-number").selectmenu( "refresh");
	});
	
	$("#post-action").click(function() {
		res = check_login();
		if(res === "not_authorized" || res === "not_logged") {
			$("#main-page").hide();
			location.href = "admin.html";
		}
		else if($("#student_number").val()=="") {
			alertify.alert("請輸入學號!");
		}
		else {
			var user_id = res.authResponse.userID;
			$.post("/sports/67/handle/Route/route?action=post_sign_up", {data: [{"user_id": user_id,"item-number": $("#item-number").val(),"student_number": $("#student_number").val()}]} , function(response) {
				res = $.parseJSON(response);
				res = res["result"];
				$("#message").css("color", "#006837");
				$("#message").text(res);
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
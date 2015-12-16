$(function(){
	$.post("/sports/67/handle/Route/route?action=check_login_student", function(response){
		res = $.parseJSON(response);
		if(!res["result"]){
			location.reload();
		}
	});
	
	
	
});
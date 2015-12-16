$(function() {
	alertify.set({
		labels:{
			ok: "確定",
			cancel: "取消"
		}
	});
	
	var res = "";
	$("#main-page").hide();
	
	$.post("/sports/67/handle/Route/route?action=check_chief_login", function(response) {
		res = $.parseJSON(response);
		res = res["result"];
		if(!res) {
			alertify.alert("尚未登入!", function() {
				location.href = "/sports/67/chief/login";
			});
		}
		else {
			$("#main-page").show();
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
	
	$.post("/sports/67/handle/Route/route?action=get_contest_list", function(response) {
		res = $.parseJSON(response);
		res = res["result"];
		if(res[0]["a_b"]=="甲組") {
			var contest1 = '<optgroup class="mytext" label="單項徑賽(男子甲組)">';
			var contest2 = '<optgroup class="mytext2" label="單項田賽(男子甲組)">';
			var contest3 = '<optgroup class="mytext3" label="接力項目(男子甲組)">';	
			var contest4 = '<optgroup class="mytext4" label="單項徑賽(女子甲組)">';
			var contest5 = '<optgroup class="mytext5" label="單項田賽(女子甲組)">';
			var contest6 = '<optgroup class="mytext6" label="接力項目(女子甲組)">';
		}
		else {
			var contest1 = '<optgroup class="mytext" label="單項徑賽(男子乙組)">';
			var contest2 = '<optgroup class="mytext2" label="單項田賽(男子乙組)">';
			var contest3 = '<optgroup class="mytext3" label="接力項目(男子乙組)">';	
			var contest4 = '<optgroup class="mytext4" label="單項徑賽(女子乙組)">';
			var contest5 = '<optgroup class="mytext5" label="單項田賽(女子乙組)">';
			var contest6 = '<optgroup class="mytext6" label="接力項目(女子乙組)">';
		}
		var other_contest = '<optgroup label="不分組">';
		/*
			$contest_row[$len]["item"] = $contest_item["item"];
			$contest_row[$len]["category"] = $contest_item["category"];
			$contest_row[$len]["least_number"] = $contest_item["least_number"];
			$contest_row[$len]["max_number"] = $contest_item["max_number"];
			$contest_row[$len]["a_b"] = $contest_item["a_b"];
		*/
		var contest_count = 0;
		for(;contest_count<res.length;contest_count++) {
			if(res[contest_count]["male_female"].indexOf("男子")!=-1) {
				switch(res[contest_count]["item"]) {
					case "單項徑賽":
						contest1 += '<option value="'+res[contest_count]["ID"]+'">'+res[contest_count]["category"]+'</option>';
						break;
					case "單項田賽":
						contest2 += '<option value="'+res[contest_count]["ID"]+'">'+res[contest_count]["category"]+'</option>';
						break;
					case "接力項目":
						contest3 += '<option value="'+res[contest_count]["ID"]+'">'+res[contest_count]["category"]+'</option>';
						break;
				}
			}
			else if(res[contest_count]["male_female"].indexOf("女子")!=-1) {
				switch(res[contest_count]["item"]) {
					case "單項徑賽":
						contest4 += '<option value="'+res[contest_count]["ID"]+'">'+res[contest_count]["category"]+'</option>';
						break;
					case "單項田賽":
						contest5 += '<option value="'+res[contest_count]["ID"]+'">'+res[contest_count]["category"]+'</option>';
						break;
					case "接力項目":
						contest6 += '<option value="'+res[contest_count]["ID"]+'">'+res[contest_count]["category"]+'</option>';
						break;
				}
			}
			else {
				other_contest += '<option value="'+res[contest_count]["ID"]+'">'+res[contest_count]["category"]+'</option>';
			}
		}
		
		contest1 += "</optgroup>";
		contest2 += "</optgroup>";
		contest3 += "</optgroup>";
		contest4 += "</optgroup>";
		contest5 += "</optgroup>";
		contest6 += "</optgroup>";
		other_contest += "</optgroup>";
		
		$("#contest-list").html('');
		$("#contest-list").append(contest1+contest2+contest3+contest4+contest5+contest6+other_contest);
		$("#contest-list").selectmenu( "refresh");
	});
	
	$("#produce-signup-form").click(function() {
		$("#signup-form").html('');
		var contest_count = 0;
		var form_str = "";
		var contest_id = $("#contest-list").val();
		$.post("/sports/67/handle/Route/route?action=get_contest_form",{"data": [{"contest-id": contest_id}]} , function(response) {
			res = $.parseJSON(response);
			res = res["result"];
			
			if(res[contest_count]["max_number"]=="participate") {
				form_str += '<fieldset data-role="controlgroup">'+
						'<h2>要參加請勾選</h2>'+
						'<label for="checkbox-signup">參加</label>'+
						'<input data-theme="b" type="checkbox" id="checkbox-signup">'+
						'</fieldset>'+
						'<input value="送出" type="button" id="post-contest-action" onclick="javascript:post_contest('+contest_id+')">';
				$("#signup-form").html(form_str);
				$("input[type='checkbox']").checkboxradio();
				$("input[type='checkbox']").checkboxradio('refresh');
			}
			else if(res[contest_count]["max_number"]=="10") {
				form_str += '<h2>最多可以報名兩組，一組四個人第五個為候補。</h2>'+
					'<label for="people1">第一位(請輸入學號)</label>'+
					'<input id="people1" type="text">'+
					'<label for="people2">第二位(請輸入學號)</label>'+
					'<input id="people2" type="text">'+
					'<label for="people3">第三位(請輸入學號)</label>'+
					'<input id="people3" type="text">'+
					'<label for="people4">第四位(請輸入學號)</label>'+
					'<input id="people4" type="text">'+
					'<label for="people5">第五位(候補，選填，請輸入學號)</label>'+
					'<input id="people5" type="text">'+
					'<input value="送出" type="button" id="post-contest-action" onclick="javascript:post_contest2('+contest_id+')">';		
					//$("input[type='checkbox']").checkboxradio('refresh');
				$("#signup-form").html(form_str);
				$("input[type='text']").textinput();
				$("input[type='text']").textinput('refresh');
			}
			else {
				form_str += '<h2>最多可以報名五個人。</h2>'+
					'<label for="people-one">請輸入學號</label>'+
					'<input id="people-one" type="text">'+
					'<input value="送出" type="button" id="post-contest-action" onclick="javascript:post_contest3('+contest_id+')">';
				$("#signup-form").html(form_str);
				$("input[type='text']").textinput();
				$("input[type='text']").textinput('refresh');
			}
			
			$("input[type='button']").button();
			$("input[type='button']").button('refresh');
		});
		
	});
	
	/*
	$("#content-result")click(function() {
		$.post("/sports/67/handle/Route/route?action=", function(response) {
			
		});
	});*/
	
	$("#logon-action").click(function() {
		$.post("/sports/67/handle/Route/route?action=handle_chief_logon", function(response) {
			res = $.parseJSON(response);
			res = res["result"];
			location.href = "/sports/67/chief/login";
		});
	});
	
});

function post_contest(contest_id) {
	if($("#checkbox-signup").prop('checked')) {
		$.post("/sports/67/handle/Route/route?action=post_contest_form", {data: [{"contest_id": contest_id}]}, function(response) {
			res = $.parseJSON(response);
			res = res["result"];
			alertify.alert(res);
		});
	}
}

function post_contest2(contest_id) {
	for(var i=1;i<=4;i++) {
		if($("#people"+i).val()=="") {
			alertify.alert("第"+i+"位未填寫!");
			return false;
		}
	}
	
	$.post("/sports/67/handle/Route/route?action=post_contest_form2", {data: [{"contest_id": contest_id,"people1": $("#people1").val(),"people2": $("#people2").val(),"people3": $("#people3").val(),"people4": $("#people4").val(),"people5": $("#people5").val()}]}, function(response) {
		res = $.parseJSON(response);
		res = res["result"];
		alertify.alert(res);
	});
}

function post_contest3(contest_id) {
	if($("#people-one").val()=="") {
		alertify.alert("未輸入學號!");
	}
	else {
		$.post("/sports/67/handle/Route/route?action=post_contest_form3", {data: [{"contest_id": contest_id,"people-one": $("#people-one").val()}]}, function(response) {
			res = $.parseJSON(response);
			res = res["result"];
			alertify.alert(res);
		});
	}
}
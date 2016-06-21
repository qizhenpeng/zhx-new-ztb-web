$(function(){
	var $btnLogin = $("#btn-login");

	/**
	 * 登录按钮 事件绑定
	 */
	$btnLogin.click(function(){
		var name = $("#name").val();
		var pwd = $("#pwd").val();
		if(name == "admin" && pwd == "admin"){
			window.location.href = techvalley.getRootPath()+"/modules/demo/list.jsp";
		}else{
			alert("登录失败，请检查用户名或密码是否输入有误！");
		}
	});

	/**
	 * 回车键 事件绑定
	 */
	$(document).keypress(function(e){
        if(e.keyCode == "13"){
        	$btnLogin.trigger("click");
        	return false;
        }
    });
});
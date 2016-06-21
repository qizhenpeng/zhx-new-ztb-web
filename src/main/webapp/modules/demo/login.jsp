<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%
String path = request.getContextPath();  
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"";  
%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=Edge">
<title>XXXX招标平台Demo</title>
    <link rel="icon" type="image/ico" href="favicon.ico"/>
    <link href="<%=basePath %>/static/aquarius/css/stylesheets.css" rel="stylesheet" type="text/css" />
<!-- self css -->
	<link rel="stylesheet" type="text/css" href="css/login.css">
</head>
<body>
	<div class="pnlMain">
		<div class="row">
			<div class="pnlImg">
				<img src="img/login.png" alt="招标平台"/>
			</div>
			<div class="pnlForm">
				<img src="img/techLogo.png" alt="科技谷|招标平台"/>
				<div class="form-horizontal" id="formLogin">
					<div class="control-group">
						 <label class="control-label" for="name">用户名</label>
						<div class="controls">
							<input type="text" id="name" name="name" value="admin">
						</div>
					</div>
					<div class="control-group">
						 <label class="control-label" for="pwd">密码</label>
						<div class="controls">
							<input type="password" id="pwd" name="pwd" value="admin">
						</div>
					</div>
					<div class="control-group">
						<div class="controls">
							<a id="btn-login" class="btn btn-primary" href="javascript:void(0);">登 录</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<script type='text/javascript' src='<%=basePath %>/static/jquery.js'></script>
	<script type='text/javascript' src='<%=basePath %>/static/aquarius/js/actions.js'></script>
	<script type='text/javascript' src='<%=basePath %>/common/js/techvalley.js'></script>
	<script type='text/javascript' src='<%=basePath %>/modules/demo/js/login.js'></script>
</body>
</html>
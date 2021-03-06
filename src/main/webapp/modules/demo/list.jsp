<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%
String path = request.getContextPath();  
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"";  
%>
<!DOCTYPE html>
<html lang="en">
<head>        
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
    <!--[if gt IE 8]>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <![endif]-->
    
    <title>XXXX招标平台Demo</title>

    <link rel="icon" type="image/ico" href="favicon.ico"/>
    
    <link href="<%=basePath %>/static/aquarius/css/stylesheets.css" rel="stylesheet" type="text/css" />  
    <!--[if lt IE 8]>
        <link href="<%=basePath %>/static/aquarius/css/ie7.css" rel="stylesheet" type="text/css" />
    <![endif]-->            
    <link rel='stylesheet' type='text/css' href='<%=basePath %>/static/aquarius/css/fullcalendar.print.css' media='print' />
    <link rel='stylesheet' type='text/css' href='<%=basePath %>/common/css/common.css'/>
</head>
<body>
    
    <div class="header">
        <h4 class="header_title">招标平台</h4>
        <ul class="header_menu">
            <li class="list_icon"><a href="#">&nbsp;</a></li>
        </ul>    
    </div>
    
    <div class="menu">                
        
        <div class="breadLine">            
            <div class="arrow"></div>
            <div class="adminControl active">
                	你好，测试者
            </div>
        </div>
        
        <div class="admin">
            <div class="image">
                <img src="<%=basePath %>/static/aquarius/img/users/aqvatarius.jpg" class="img-polaroid"/>                
            </div>
            <ul class="control">                
                <li><span class="icon-comment"></span> <a href="javascript:void(0);">消息</a> <a href="javascript:void(0);" class="caption red">12</a></li>
                <li><span class="icon-cog"></span> <a href="javascript:void(0);">设置</a></li>
                <li><span class="icon-share-alt"></span> <a href="login.jsp">注销</a></li>
            </ul>
            <div class="info">
                <span>欢迎回来！最近一次登录时间：2015-02-03 09:55</span>
            </div>
        </div>
        
        <ul class="navigation">            
            <li class="active">
                <a href="list.jsp">
                    <span class="isw-grid"></span><span class="text">招标项目管理</span>
                </a>
            </li>                    
        </ul>
        
        <div class="dr"><span></span></div>
        
        <div class="widget-fluid">
            
            <div class="wBlock clearfix">
                <div class="dSpace">
                    <h3>最近投标</h3>
                    <span class="number">6,302</span>                    
                    <span>5,774 <b>进行中</b></span>
                    <span>3,512 <b>已结束</b></span>
                </div>
                <div class="rSpace">
                    <h3>今天</h3>
                    <span class="mChartBar" sparkType="bar" sparkBarColor="white"><!--240,234,150,290,310,240,210,400,320,198,250,222,111,240,221,340,250,190--></span>                                                                                
                    <span>&nbsp;</span>
                    <span>65% <b>进行中</b></span>
                    <span>35% <b>已结束</b></span>
                </div>
            </div>
            
        </div>
        
    </div>
        
    <div class="content">
        
        <div class="breadLine">
            <ul class="breadcrumb">
                <li><a href="#">首页</a> <span class="divider">></span></li>                
                <li class="active">招标项目列表</li>
            </ul>
        </div>
        
        <div class="workplace">
<!-- 
			<div class="row-fluid">
				<div class="span12">
					<div class="input-append">
		                <input type="text" placeholder="请输入关键字"><button class="btn" type="button">搜索</button>
		            </div>
				</div>
			</div>
 -->
            <div class="row-fluid">
                <div class="span12">                    
                    <div class="head clearfix">
                        <div class="isw-grid"></div>
                        <h1>招标项目列表</h1>      
                        <ul class="buttons">
                            <li><a href="detail.jsp" class="isw-plus"></a></li>                                                        
                            <li><a href="#" class="isw-delete"></a></li>
                        </ul>                               
                    </div>
                    <div class="block-fluid table-sorting clearfix">
                        <table cellpadding="0" cellspacing="0" class="table" id="demo-list-table"></table>
                    </div>
                </div>                                
            </div>            
            
            <div class="dr"><span></span></div>
            
        </div>
        
    </div>   
    
    <script type='text/javascript' src='<%=basePath %>/static/jquery.js'></script>
    <script type='text/javascript' src='<%=basePath %>/static/aquarius/js/plugins/dataTables/jquery.dataTables.min.js'></script>
    <script type='text/javascript' src='<%=basePath %>/common/js/techvalley.js'></script>
    <script type='text/javascript' src='<%=basePath %>/common/js/actions.js'></script>
	<script type='text/javascript' src='<%=basePath %>/modules/demo/js/list.js'></script>
</body>
</html>

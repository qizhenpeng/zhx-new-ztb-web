<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="java.util.Date" %>
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%
String path = request.getContextPath();  
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"";
String uuid = request.getParameter("uuid");
uuid = null == uuid?"":uuid;
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
    <link rel="stylesheet" type="text/css" href="<%=basePath %>/static/webuploader/webuploader.css" />
</head>
<body>
    
    <div class="header">
        	<h4 class="header_title">招标平台</h4>
        	<%-- 
        <a class="logo" href="javascript:void(0);">
        	<img src="<%=basePath %>/static/aquarius/img/logo.png" alt="招标平台" title="招标平台"/>
        </a>
        	 --%>
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
                <li><a href="#">首页</a> <span class="divider">&#62;</span></li>                
                <li><a href="list.jsp">招标项目列表</a> <span class="divider">&#62;</span></li>                
                <li class="active">招标项目信息</li>
            </ul>
        </div>
        
        <div class="workplace">
                        
            <div class="row-fluid">
                
                <div class="span12">
                    <div class="head clearfix">
                        <div class="isw-grid"></div>
                        <h1>招标项目信息</h1>
                    </div>
                    <div class="block-fluid">
                    	<form id="ztbForm" class="form-horizontal" name="ztbForm" action="<%=basePath %>/router/rest" target="_parent">
                            <input type="hidden" id="uuid" name="uuid" value="<%=uuid %>">
                            <input type="hidden" id="filePath" name="filePath" value="">
                            <input type="hidden" id="jdbmmc" name="jdbmmc" value="部门一">
                            <input type="hidden" id="shbmmc" name="shbmmc" value="部门二">
                            <input type="hidden" name="mode" value="rest">
                            <input type="hidden" name="method" value="ztb.post"> 

	                        <div class="row-form simple clearfix">
	                            <div class="span2"><label class="control-label">项目编号<i class="req"></i>:</label></div>
	                            <div class="span3">
	                            	<input id="xmbh" class="required" maxlength=100
	                            		type="text" name="xmbh" value="<%=System.currentTimeMillis() %>">
	                            </div>
	                            <div class="span2"><label class="control-label">项目名称<i class="req"></i>:</label></div>
	                            <div class="span3"><input id="xmmc" class="required" type="text" name="xmmc" value="项目<%=new SimpleDateFormat("yyyyMMdd").format(new Date())  %>"></div>
	                        </div>
	                        <div class="row-form simple clearfix">
	                            <div class="span2"><label class="control-label">招标人（机构）:</label></div>
	                            <div class="span3"><input type="text" id="zbjg" name="zbjg" value="招标人"></div>
	                            <div class="span2"><label class="control-label">代理机构:</label></div>
	                            <div class="span3"><input type="text" id="dljg" name="dljg" value="代理机构"></div>
	                        </div>
	                        <div class="row-form simple clearfix">
	                            <div class="span2"><label class="control-label">方案说明:</label></div>
	                            <div class="span8">
	                            	<textarea id="fasm" name="fasm">方案说明</textarea>
	                            </div>
	                        </div>
	                        <div class="row-form simple clearfix">
	                            <div class="span2"><label class="control-label">招标方式:</label></div>
	                            <div class="span3"><input type="text" id="zbfs" name="zbfs" value="other"></div>
	                            <div class="span2"><label class="control-label">交易平台:</label></div>
	                            <div class="span3"><input type="text" id="jypt" name="jypt" value="Demo平台"></div>
	                        </div>
	                        <div class="row-form simple clearfix">
	                            <div class="span2"><label class="control-label">责任人:</label></div>
	                            <div class="span3"><input type="text" id="sbzrr" name="sbzrr" value="小张"></div>
	                            <div class="span2"><label class="control-label">创建时间:</label></div>
	                            <div class="span3"><input type="text" readonly="readonly"  id="cjsj"  name="cjsj" value="<%=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date())  %>"></div>
	                        </div>
	                        <div class="row-form simple clearfix">
	                            <div class="span2"><label class="control-label">监督部门:</label></div>
	                            <div class="span3">
		                            <select id="jdbmbh" name="jdbmbh">
	                                    <option value="bm1">部门1</option>
	                                    <option value="bm2">部门2</option>
	                                    <option value="bm3">部门3</option>
	                                </select>
                                </div>
	                            <div class="span2"><label class="control-label">审核部门:</label></div>
	                            <div class="span3">
		                            <select id="shbmbh" name="shbmbh">
                                        <option value="bm1">部门1</option>
                                        <option value="bm2" selected>部门2</option>
                                        <option value="bm3">部门3</option>
	                                </select>
                                </div>
	                        </div>
	                        <div class="row-form clearfix">
                                <div class="span2"><label class="control-label">关联文件:</label></div>
                                <div class="span3">
                                     <div id="uploader">
                                         <!--用来存放文件信息-->
                                         <div id="thelist" class="uploader-list" style="width:300px;"></div>
                                         <div class="btns">
                                             <div id="picker" class="uploader-picker">选择文件</div>
                                             <!-- <button id="ctlBtn" class="btn btn-default">开始上传</button> -->
                                         </div>
                                     </div>
                                </div>
	                        </div>

	                        <div class="row-form clearfix" id="btnDiv">
	                            <div class="span2"></div>
	                            <div class="span8">
	                            	<input type="button" class="btn btn-primary" value="保存">
	                            	<input id="demo-detail-btn-back" type="button" class="btn btn-white" value="返回">
	                            </div>
	                        </div>
                    	</form>
                    </div>
                </div>

            </div>

            <div class="dr"><span></span></div>

        </div>

    </div>
    <script type='text/javascript' src='<%=basePath %>/static/jquery.js'></script>
    <script type="text/javascript" src="<%=basePath %>/static/bootstrap/js/bootstrap.min.js"></script>
    <script type='text/javascript' src='<%=basePath %>/static/aquarius/js/actions.js'></script>

    <script type="text/javascript" src="<%=basePath %>/static/webuploader/webuploader.min.js"></script>
    <script type='text/javascript' src='<%=basePath %>/static/form.js'></script>
    <script type='text/javascript' src='<%=basePath %>/static/jquery.validate.min.js'></script>

	<script type='text/javascript' src='<%=basePath %>/common/js/techvalley.js'></script>
	<script type='text/javascript' src='<%=basePath %>/modules/demo/js/detail.js'></script>
</body>
</html>

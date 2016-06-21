(function(){
	if(window.techvalley) return;
	
	//内置参数（一次生成，多次调用）
	var strFullPath = window.document.location.href;
	var strPath = window.document.location.pathname;
	var hostPath = strFullPath.substring(0,strFullPath.indexOf(strPath)+1);
	var pos = strFullPath.indexOf(strPath);
	var prePath = strFullPath.substring(0, pos);
	var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
	var rootPath = prePath + postPath;
	
	//主区域对象
	var $main = null;
	window.techvalley = {
		/**
		 * 初始化方法
		 * @param settings
		 */
		init: function(settings){
			$main = settings.$main;
		},

		/**
		 * Router Rest（数据请求）统一接口
		 * @param settings
		 */
		routerRest:function(settings){
			settings.data = $.extend({
				mode : "rest",
				format : "json",
				v : "1.0"
			}, settings.data);
			
			techvalley.ajax($.extend({
				url : techvalley.getRootPath() + "/router/rest",
				type : "post",
				cache : false,
				dataType : "json"
			}, settings));
		},
		
		/**
		 * 页面跳转方法
		 * @param settings
		 */
		showPage: function(settings){
			var $container = settings.container || $main;
			techvalley.ajax({
        	    url: settings.url,
        	    type: 'post',
        	    dataType: 'html',
        	    data: $.extend(settings.data, {
        	    	__partial_refresh: 'y'	//该值不允许被修改
        	    }),
        	    success: function(data, textStatus, jqXHR) {
        	    	$container.html(data);
				},
				error:function(XMLHttpRequest,textStatus,errorThrown){
					$container.html(XMLHttpRequest.responseText);
        	    }
        	});
		},
		
		/**
		 * Ajax调用方法
		 * @param settings
		 */
		ajax: function(settings){
			$.ajax({
				url : settings.url,
				type : settings.type || 'post',
				dataType : settings.dataType || 'json',
				data : settings.data,
				success : function(data, textStatus, jqXHR){
					var error = data && data.__error;
					if(error){
						if(error.code == 'E0000001'){
							//TODO: 先提示后跳转
							window.location.href = techvalley.getRootPath() + "/page/login";
							return;
						}
						console.info("后端服务器运行报错，错误码: ", arguments);
						if(window.console){console.log("后端服务器运行报错，错误码：" + error.code);}
						//TODO: 根据错误编码，细化执行内容
						return;
					}
					
					if(settings.success){
						settings.success(data, textStatus, jqXHR);
					}
				},
				error:function(XMLHttpRequest,textStatus,errorThrown){
					console.info("error: ", arguments);
					if(window.console){console.log("HTTP请求失败, 错误码："+XMLHttpRequest.status);}
					if(settings.error){
						settings.error(XMLHttpRequest,textStatus,errorThrown);
					}
				}
			});
		},
		
		alertWarning: function(){
		},
		
		alertError: function(){
		},
		
		alertSuccess: function(){
		},
		
		alert: function(){
			
		},
		
		/**
		 * 显示当前时间
		 */
		getDate : function(){
			var d = new Date();
			var week = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六']; 
			var date = d.getFullYear() +"年"+ (d.getMonth()+1) +"月"+ d.getDate() + "日 " + week[d.getDay()];
			//$(".user-info span.time").append(date);
			return date;
		},
		
		/**
		 * 获得根目录
		 * @returns
		 */
		getRootPath : function(){
		    return rootPath;
		},

		getHostPath:function(){
			return hostPath;
		},
		
		/**
		 * 获得url中的参数
		 * @param valname
		 * @returns
		 */
		getUrlParam : function(valname){
			var reg = new RegExp("(^|&)"+ valname +"=([^&]*)(&|$)");//构造正则表达式对象
			var r = window.location.search.substr(1).match(reg);//匹配目标参数
			if (r!=null)
				return unescape(r[2]);
			return null;
		},

		format: function(){
		    var args = arguments;
		    return args[0].replace(/\{(\d+)\}/g,                    
		        function(m,i){
		    		var val = args[i-(-1)];
		    		if(val === undefined){
		    			val = "";
		    		}
		            return val; 
		        });
		}
	};
	
})();
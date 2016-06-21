$(function(){
	var $table = $("#demo-list-table");
	$(".isw-delete").click(function(){
		var uuid = "";
		$('input[name="uuid"]:checked').each(function(){
			 uuid = uuid + $(this).val()+",";
		});
		if(""==uuid){
			alert("请至少选择一个招标信息进行删除");
			return;
		}
		if(confirm("你确定删除选中的投标信息吗")){
			$.ajax({
				url: techvalley.getRootPath()+"/router/rest",
				dataType:"json",
				type:"post",
				data: {
					mode: "rest",
					method: "ztb.delete",
					uuid:uuid
				},
				error: function(msg){
					alert( "获取数据失败");
				},
				success: function(data) {
					if(data.status=="200"){
						alert("数据删除成功");
						window.location.reload();
					}else{
						alert("数据删除失败");
					}
				}
			});
		}
	})

	$table.delegate("input.table-checkall", "click", function(){
        $table.find("input.tr-check").prop("checked", $(this).prop("checked"));
    });
	
	$table.dataTable({
		"bServerSide" : true,
		"iDisplayLength" : 10,
		"aLengthMenu" : [10, 30, 50, 100 ],
		"sPaginationType" : "full_numbers",
	    "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
	    	$('td:eq(1)', nRow).html(iDisplayIndexFull+1);
	    },
		"aoColumns" : [{
			"mData" : "uuid",
			"sTitle" : '<input class="table-checkall" type="checkbox" name="checkall"/>',
			"sWidth" : "10px",
			"bSortable": false,
			"mRender" : function(data, type, full) {
				return '<input class="tr-check" type="checkbox" name="uuid" value="'+data+'">';
			}
		}, {
			"sTitle" : "编号",
			"sWidth" : "40px",
			"sDefaultContent":""
		}, {
			"mData" : "xmmc",
			"sTitle" : "项目名称"
		}, {
			"mData" : "fasm",
			"sTitle" : "方案说明"
		}, {
			"mData" : "content_m",
			"sTitle" : "摘要",
			"mRender" : function(data, type, full) {
				return '<p class="text" style="width: 320px;" title="'+data+'">'+data+'</p>';
			}
		}, {
			"mData" : "uuid",
			"sTitle" : "操作",
			"sWidth" : "120px",
			"mRender" : function(data, type, full) {
				return '<a href="ztb.jsp?uuid='+data+'" target="_blank">查看</a><a href="../../fileDownload?uuid='+data+'">文件下载</a>';
			}
		} ],
		"sAjaxDataProp" : "resultList",
		"fnServerData": function (sSource, aoData, fnCallback) {
			var pageIndex = 1;
			var pageSize = 10;
			var sEcho = 1;
			var keyword = "";
			$.each(aoData,function(index, data) {
				if (data.name == "iDisplayStart") {
					pageIndex = data.value;
				} else if (data.name == "iDisplayLength") {
					pageSize = data.value;
				} else if (data.name == "sEcho") {
					sEcho = data.value;
				} else if(data.name == "sSearch"){
					keyword = data.value;
				}
			});
			pageIndex = Math.floor(pageIndex / pageSize) + 1;
			
		    $.ajax({
		        url: techvalley.getRootPath() + "/router/rest",
		        dataType:"json",
		        type:"post",
		        data: {
		        	method: "ztb.query",
		        	mode: "rest",
		        	pageIndex: pageIndex,
		        	pageSize: pageSize,
		        	sEcho: sEcho,
		        	keyword: keyword
		        },
		        error: function(msg){
		            alert( "获取数据失败");
		            fnCallback({
						"iTotalRecords": 0,
						"iTotalDisplayRecords": 0,
						"resultList": []
					});
		        },
		        success: function(result) {
		        	var data = JSON.parse(result.data);
		        	fnCallback({
						"iTotalRecords": data.sum,
						"iTotalDisplayRecords": data.sum,
						"resultList": data.lists
					});
		        }
		    });
	    }
	});
});

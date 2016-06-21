$(function(){
    var uuid = $("#uuid").val();
    $.ajax({
        url: techvalley.getRootPath()+"/router/rest",
        dataType:"json",
        type:"get",
        data: {
            mode: "rest",
            method: "ztb.get."+uuid
        },
        error: function(msg){
            alert( "获取数据失败");
        },
        success: function(result) {
            showData(result);//TODO
        }
    });
    function showData(result){
        var data = JSON.parse(result.data);

        $("#uuid").val(data.uuid);
        $("#filePath").val(data.filePath);
        $("#jdbmmc").val(data.jdbmmc);
        $("#shbmmc").val(data.shbmmc);
        $("#jdbmbh").val(data.jdbmbh);
        $("#shbmbh").val(data.shbmbh);
        $("#xmbh").val(data.xmbh);
        $("#xmmc").val(data.xmmc);
        $("#zbjg").val(data.zbjg);
        $("#dljg").val(data.dljg);
        $("#fasm").val(data.fasm);
        $("#zbfs").val(data.zbfs);
        $("#jypt").val(data.jypt);
        $("#sbzrr").val(data.sbzrr);
        $("#cjsj").val(data.cjsj);
        $("#jypt").val(data.jypt);
        $("#wjzy").val(data.content);
        var file = data.path;
        var strs = file.split("/");
        var filename = strs[strs.length-1]
        $("#filename").html(filename);
        $("#downfile").attr("href","../../fileDownload?uuid="+data.uuid);
    }
});
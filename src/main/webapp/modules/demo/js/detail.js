$(function(){
    var MAX_FILE_NUM=1;
    var MAX_FILE_SIZE=1024*1024*500;//500M
    var MAX_FILE_SIZE_NAME='500M';
    var templateUploadItem = '<div id="{0}" class="item"><div class="info">{1}<div style="float:right;"><a href="javascript:void(0);" class="remove-this btn btn-link">取消</a></div></div><p class="state">等待上传...</p></div>';
    var templateUploadProgress = '<div class="progress progress-striped active"><div class="bar" role="progressbar" style="width: 0;"></div></div>';
    var fileCount = 0;
    var uploader = null;
    var $form = $("#ztbForm");
    function check() {
        var progressNum = uploader.getStats().progressNum;
        if(progressNum > 0) {
            alert("请等待文件上传完成后再提交");
            return false;
        }
        return true;
    }
    //$form.submit(function(){
    //    $form.submitAjax({
    //        callback:function(data){
    //            window.location.href="list.jsp";
    //            //if (data.status == "200") {
    //            //    alert("保存成功");
    //            //    window.location.href="list.jsp";
    //            //} else {
    //            //    alert("保存失败");
    //            //}
    //        }
    //    });
    //})
    
    /**
     * 表单数据校验
     */
    $form.validate();
    
    $("#jdbmbh").change(function(){
        $("#jdbmmc").val($(this).find("option:selected").text());
    });
    $("#shbmbh").change(function(){
        $("#shbmmc").val($(this).find("option:selected").text());
    });

    $(".btn-primary").click(function(){
        var filePath = $("#filePath").val();
        if(""==filePath){
            alert("请上传关联文件");
            return false;
        }
        var uuid = $("#uuid").val();
        var jdbmmc = $("#jdbmmc").val();
        var shbmmc = $("#shbmmc").val();
        var jdbmbh = $("#jdbmbh").val();
        var shbmbh = $("#shbmbh").val();
        var xmbh = $("#xmbh").val();
        var xmmc = $("#xmmc").val();
        var zbjg = $("#zbjg").val();
        var dljg = $("#dljg").val();
        var fasm = $("#fasm").val();
        var zbfs = $("#zbfs").val();
        var jypt = $("#jypt").val();
        var sbzrr = $("#sbzrr").val();
        var cjsj = $("#cjsj").val();
        var jypt = $("#jypt").val();

        $.ajax({
            url: techvalley.getRootPath()+"/router/rest",
            dataType:"json",
            type:"post",
            data: {
                mode: "rest",
                method: "ztb.post.",
                uuid : uuid,
                filePath : filePath,
                jdbmmc : jdbmmc,
                shbmmc: shbmmc,
                jdbmbh : jdbmbh,
                shbmbh : shbmbh,
                xmbh : xmbh,
                xmmc : xmmc,
                zbjg :zbjg,
                dljg : dljg,
                fasm : fasm,
                zbfs : zbfs,
                jypt : jypt,
                sbzrr : sbzrr,
                cjsj : cjsj,
                jypt : jypt
            },
            error: function(msg){
                alert( "保存失败");
            },
            success: function(data) {
                if (data.status == "200") {
                    window.location.href="success.jsp";
                } else {
                    alert("保存失败");
                }
            }
        });
    });

    uploader = WebUploader.create({
        swf: techvalley.getRootPath()+"/static/webuploader/Uploader.swf",
        server: techvalley.getRootPath()+"/fileUpload",
        pick: '#picker',
        resize: false,
        //fileNumLimit : MAX_FILE_NUM,
        //fileSizeLimit : MAX_FILE_SIZE,
        multiple : false,
        duplicate : true,
        auto: true
    });
    // 当有文件被添加进队列的时候
    uploader.on( 'filesQueued', function( files ) {
        if(files.length + fileCount > MAX_FILE_NUM) {
            alert('总文件个数不能超过'+MAX_FILE_NUM+'个');
            uploader.reset();
            return;
        }

        for(var i in files) {
//            console.log(files[i].size);
            if(files[i].size > MAX_FILE_SIZE) {
                alert('文件大小不能超过'+MAX_FILE_SIZE_NAME);
                uploader.reset();
                return;
            }
        }
        fileCount = files.length + fileCount;
        for(var i in files) {
            var file = files[i];
            $('#thelist').append(techvalley.format(templateUploadItem, file.id, file.name));
            $li = $('#'+file.id);
            $li.find('.remove-this').on('click', function() {
                uploader.cancelFile( file );
                $li.remove();
                $('#filePath').val('');
                fileCount--;
            });
        }
    });

    // 文件上传过程中创建进度条实时显示。
    uploader.on( 'uploadProgress', function( file, percentage ) {
        var $li = $( '#'+file.id ),
            $percent = $li.find('div.bar');
        
        // 避免重复创建
        if ( !$percent.length ) {
        	$percent = $li.append(templateUploadProgress).find('.bar');
        }
        $li.find('p.state').text('上传中...');
        $percent.css('width', percentage * 100 + '%' );
    });

    uploader.on( 'uploadSuccess', function( file, data ) {
        var $li = $( '#'+file.id );
        $li.find('p.state').text('上传成功！');
        $li.find('div.progress').remove();
        $('#filePath').val(data.savePath);
        $('#uuid').val(data.uuid);
    });
    
    uploader.on( 'uploadError', function( file, data ) {
        var $li = $( '#'+file.id );
        $li.find('p.state').text('上传失败，请检查文件类型是否有误！');
        $li.find('div.progress').remove();
        $('#filePath').val('');
        $('#uuid').val('');
    });
    
    //返回按钮事件绑定
    $("#demo-detail-btn-back").click(function(){
    	window.location.href = techvalley.getRootPath()+"/modules/demo/list.jsp";
    });

});
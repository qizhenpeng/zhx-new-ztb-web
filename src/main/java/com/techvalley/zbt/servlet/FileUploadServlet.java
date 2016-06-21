package com.techvalley.zbt.servlet;

import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FSDataOutputStream;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.json.simple.JSONObject;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.Writer;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;

@SuppressWarnings("serial")
public class FileUploadServlet extends HttpServlet {
	/**
	 * hdfs上文件的基础路径
	 */
	private final String BASE_FILE_PATH = "/zbt/file/";
	private ServletFileUpload upload = null;
    private FileSystem fs = null;
	
	public void init(ServletConfig config) throws ServletException {
		DiskFileItemFactory factory = new DiskFileItemFactory();
		// 临时目录 webapp/tmp
		String tmpDirPath = config.getServletContext().getRealPath("/") + "/tmp";
		File tmpDir = new File(tmpDirPath);
		if (!tmpDir.exists()) {
			tmpDir.mkdirs();
		}
		// 阀值设置为0,让文件都存在硬盘上,方便httpfsClient操作
		factory.setSizeThreshold(0);
		// 临时文件目录
		factory.setRepository(tmpDir);
		this.upload = new ServletFileUpload(factory);
		this.upload.setHeaderEncoding("UTF-8");

        Configuration conf = new Configuration();
        HadoopConf hc = null;
        try {
            hc = new HadoopConf("default-site.properties");
            conf.set("fs.defaultFS", hc.getValue("fs.defaultFS").toString());
        } catch (IOException e) {
            e.printStackTrace();
        }

        try {
            conf.addResource(new Resource("core-site.xml").getInputStream());
        } catch (IOException e) {
            e.printStackTrace();
        }

        System.out.println("conf : " + conf.get("fs.defaultFS"));

        try {
            this.fs = FileSystem.get(conf);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
	/**
	 * 文件上传接口
	 * 输出json字符串:
	 * {
	 * 	status: 1|0, ## 1:成功 0:失败
	 * 	msg:'出错消息',
	 * 	savePath: '文件存储路径',
	 * }
	 */
	@SuppressWarnings("unchecked")
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JSONObject json = new JSONObject();
        FSDataOutputStream out = null;
        InputStream in = null;
		try {
			List items = upload.parseRequest(request);
			Iterator<DiskFileItem> iter = items.iterator();
			while (iter.hasNext()) {
				DiskFileItem item = iter.next();
				if (!item.isFormField()) {
                    String uuid = UUID.randomUUID().toString();
					String saveDir = BASE_FILE_PATH +uuid;
					// 上传文件
					String savePath = saveDir +"/"+ item.getName();

                    if(fs.exists(new Path(saveDir)) || !fs.isDirectory(new Path(saveDir))){
                       saveDir = BASE_FILE_PATH + UUID.randomUUID().toString();
                    }
                    // create directory;
                    fs.mkdirs(new Path(saveDir));

                    //File Upload;
					out = fs.create(new Path(savePath), true); //写入到HDFS；
					System.out.println("SavePath : " + new Path(savePath).toString());
					byte[] b  = new byte[1024 * 12];
					in = item.getInputStream();
                    int size = in.read(b);
                    while(size > 0){
                        out.write(b, 0, size);
                        size = in.read(b);
                    }
                    out.flush();
                    out.hflush();

					item.delete();
					json.put("status", 1);
					json.put("savePath", savePath);
					json.put("uuid", uuid);
					break;
				}
			}
		} catch (FileUploadException e) {
			// 用户自行中上传或者其他异常处理
			e.printStackTrace();
			json.put("status", 0);
			json.put("msg", e.getMessage());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
            if(out != null){
                out.close();
            }
            if(in != null){
                in.close();
            }
        }

		response.setHeader("Access-Control-Allow-Origin", "*");
		Writer writer = null;
		try {
			writer = response.getWriter();
			writer.write(json.toString());
			writer.flush();
		} finally {
			if (writer != null)
				writer.close();
		}
	}


}
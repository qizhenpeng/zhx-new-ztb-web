package com.techvalley.zbt.servlet;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileStatus;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;

@SuppressWarnings("serial")
public class FileDownloadServlet extends HttpServlet{

	private Log log = LogFactory.getLog(FileDownloadServlet.class);
	private String DOWNLOAD_TMP;
	private static String BASE_PATH="/zbt/file";
	private Configuration conf;
	private FileSystem fs;
	
	@Override
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		
		//配置hadoop配置；
		this.conf = new Configuration();
		HadoopConf hc;
		try {
			hc = new HadoopConf("default-site.properties");
			this.conf.set("fs.defaultFS", hc.getValue("fs.defaultFS").toString());
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		this.DOWNLOAD_TMP = config.getServletContext().getRealPath("/")+"/download_tmp";
		
		//初始化默认Hadoop文件系统；
		try {
			this.fs = FileSystem.get(conf);
		} catch (IOException e) {
			e.printStackTrace();
		}
		
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		String uuid = req.getParameter("uuid");
		log.info("Download the file with uuid=>" + uuid);
		if(uuid == null || "".equals(uuid)){
			return; //nothing to do;
		}
		
		//判断是否删除临时文件；
		this.deleteTmp(new File(this.DOWNLOAD_TMP));
		
		//获取HDFS文件路径和文件后缀；
		Path hdfsPath = new Path(BASE_PATH+ "/" + uuid);
		InputStream in = null;
		StringBuffer strbuf = new StringBuffer();
		in = this.downFormHDFS(hdfsPath, strbuf);
		String suffix = strbuf.toString();
		
		//将文件下载到临时文件夹中；
		File tmpFile = new File(this.DOWNLOAD_TMP + "/" + uuid + suffix);
		if(!tmpFile.getParentFile().exists()){
			tmpFile.getParentFile().mkdirs();
		}
		String location = req.getContextPath() + "/download_tmp" + "/" + uuid +suffix;
		OutputStream out = null;
		try {
			out = new FileOutputStream(tmpFile);
			this.copy(in, out);
		} catch (IOException e) {
			e.printStackTrace();
		}finally{
			if(in != null) in.close();
			if(out != null) out.close();
		}
		
		log.info("Download file=>" + location);
		resp.sendRedirect(location);
	}

	private void copy(InputStream in, OutputStream out) throws IOException{
		byte[] b = new byte[4 * 1024];
		int size = in.read(b);
		while(size != -1){
			out.write(b, 0, size);
			size = in.read(b);
		}
	}
	
	private InputStream downFormHDFS(Path dirPath, StringBuffer strbuf) throws IOException, SecurityException, FileNotFoundException{
		if(!this.fs.exists(dirPath) && this.fs.isDirectory(dirPath)){
			throw new FileNotFoundException("the file=> " + dirPath.toString() + " not found!");
		}
		
		//读取目录下的文件；
		FileStatus[] lists = fs.listStatus(dirPath);
		if(lists != null && lists.length > 0){  //HDFS目录下有文件；
		    for(FileStatus fstatus: lists){
		    	if(fstatus.isFile()){
		    		int begin = fstatus.getPath().toString().lastIndexOf(".");
		    		String suffix = fstatus.getPath().toString().substring(begin);
		    		strbuf.append(suffix);
		    		return this.fs.open(fstatus.getPath());
		    	}
		    }
		    throw new FileNotFoundException("the file=>" + dirPath.toString() + " not found!");
		}else{
			throw new FileNotFoundException("the file=>" + dirPath.toString() + " not found!");
		}
	}
	
	private void deleteTmp(File file){
		DeleteFilter isDelete = new DeleteFilter(){

			public boolean isDelete(File file) {
				return false;
			}
			
		};
		if(isDelete.isDelete(file)){
			file.deleteOnExit();
		}else{
			//不删除文件；
		}
	}
}

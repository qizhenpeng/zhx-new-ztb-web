package com.techvalley.zbt.servlet;

import java.io.IOException;
import java.io.Writer;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;

@SuppressWarnings("serial")
public class FileDeleteServlet extends HttpServlet {
    private FileSystem fs;
    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);

        Configuration conf = new Configuration();
        HadoopConf hc = null;
        try {
            hc = new HadoopConf("default-site.properties");
            conf.set("fs.defaultFS", hc.getValue("fs.defaultFS").toString());
        } catch (IOException e) {
            e.printStackTrace();
        }

        try {
            this.fs = FileSystem.get(conf);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
	 * 文件删除
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String filePath = request.getParameter("path");
		boolean isDelete = fs.deleteOnExit(new Path(filePath));
		response.setHeader("Access-Control-Allow-Origin", "*");
		Writer writer = null;
		try {
			writer = response.getWriter();
			writer.write(isDelete ? "success" : "failed");
		} finally {
			if (writer != null)
				writer.close();
		}
	}

}
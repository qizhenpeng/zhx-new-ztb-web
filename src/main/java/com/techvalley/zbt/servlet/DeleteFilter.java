package com.techvalley.zbt.servlet;

import java.io.File;

public interface DeleteFilter {

	/**
	 * 判断是否应该删除文件；
	 * @param file 
	 * @return true：删除， false：不删除；
	 */
	boolean isDelete(File file);
}

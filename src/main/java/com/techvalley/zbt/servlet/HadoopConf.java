package com.techvalley.zbt.servlet;

import java.io.IOException;
import java.util.Properties;

/**
 * Created by promise on 2/10/15.
 */
public class HadoopConf {

    private Properties pro;
    public HadoopConf(String name) throws IOException {
        Resource res = new Resource(name);
        pro = new Properties();
        pro.load(res.getInputStream());
    }

    public Object getValue(String key){
        return pro.getProperty(key);
    }

}

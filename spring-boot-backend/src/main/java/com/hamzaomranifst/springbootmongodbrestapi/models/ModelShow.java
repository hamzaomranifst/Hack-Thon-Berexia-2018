package com.hamzaomranifst.springbootmongodbrestapi.models;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class ModelShow {

    private String lid;
    private String sid;
    private String amr;

    public ModelShow() {
    }

    public String getLid() {
        return lid;
    }

    public void setLid(String lid) {
        this.lid = lid;
    }

    public String getSid() {
        return sid;
    }

    public void setSid(String sid) {
        this.sid = sid;
    }

    public String getAmr() {
        return amr;
    }

    public void setAmr(String amr) {
        this.amr = amr;
    }

    @Override
    public String toString() {
        return "ModelShow{" +
                "lid='" + lid + '\'' +
                ", sid='" + sid + '\'' +
                ", amr='" + amr + '\'' +
                '}';
    }
}

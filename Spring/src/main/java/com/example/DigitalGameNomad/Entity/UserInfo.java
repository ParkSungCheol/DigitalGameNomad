package com.example.DigitalGameNomad.Entity;

import javax.persistence.*;

@Entity
@Table (name = "user_info")
public class UserInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_key")
    private Long userKey;

    @Column(name = "user_id")
    private String userId;
    @Column
    private String user_pw;
    @Column
    private String user_name;
    @Column
    private String user_phone;
    @Column
    private Long user_level;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public UserInfo() {
    }

    public Long getUserKey() {
        return userKey;
    }

    public void setUserKey(Long userKey) {
        this.userKey = userKey;
    }

    public String getUser_id() {
        return userId;
    }

    public void setUser_id(String user_id) {
        this.userId = user_id;
    }

    public String getUser_pw() {
        return user_pw;
    }

    public void setUser_pw(String user_pw) {
        this.user_pw = user_pw;
    }

    public String getUser_name() {
        return user_name;
    }

    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }

    public String getUser_phone() {
        return user_phone;
    }

    public void setUser_phone(String user_phone) {
        this.user_phone = user_phone;
    }

    public Long getUser_level() {
        return user_level;
    }

    public void setUser_level(Long user_level) {
        this.user_level = user_level;
    }

    @Override
    public String toString() {
        return "UserInfo{" +
                "userKey=" + userKey +
                ", user_id='" + userId + '\'' +
                ", user_pw='" + user_pw + '\'' +
                ", user_name='" + user_name + '\'' +
                ", user_phone='" + user_phone + '\'' +
                ", user_level=" + user_level +
                '}';
    }
}

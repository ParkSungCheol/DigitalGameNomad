package com.example.DigitalGameNomad.Entity;

import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;


@Entity
@Table (name = "company_info")
@DynamicInsert // insert 할 때 null 값인 field 제외 => DB에 설정된 default 값으로 설정된 값으로 DB 저장
public class Companyinfo {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column(name = "company_key")
    private Long companykey;

    @Column
    private String company_name;

    @Column
    private String company_text;

    @Column
    private String game_name;

    @Column
    private String game_url;

    @Column
    private String company_date;

    @Column
    private Integer company_pass;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_key")

    private UserInfo userKey;

    @Column
    private String youtube_url;

    @Column
    private String company_deny;

    public Companyinfo() {

    }

    public Companyinfo(Long companykey, String company_name, String company_text, String game_name, String game_url, String company_date, Integer company_pass, UserInfo userKey, String youtube_url, String company_deny) {
        this.companykey = companykey;
        this.company_name = company_name;
        this.company_text = company_text;
        this.game_name = game_name;
        this.game_url = game_url;
        this.company_date = company_date;
        this.company_pass = company_pass;
        this.userKey = userKey;
        this.youtube_url = youtube_url;
        this.company_deny = company_deny;
    }

    public Long getCompanykey() {
        return companykey;
    }

    public void setCompanykey(Long companykey) {
        this.companykey = companykey;
    }

    public String getCompany_name() {
        return company_name;
    }

    public void setCompany_name(String company_name) {
        this.company_name = company_name;
    }

    public String getCompany_text() {
        return company_text;
    }

    public void setCompany_text(String company_text) {
        this.company_text = company_text;
    }

    public String getGame_name() {
        return game_name;
    }

    public void setGame_name(String game_name) {
        this.game_name = game_name;
    }

    public String getGame_url() {
        return game_url;
    }

    public void setGame_url(String game_url) {
        this.game_url = game_url;
    }

    public String getCompany_date() {
        return company_date;
    }

    public void setCompany_date(String company_date) {
        this.company_date = company_date;
    }

    public Integer getCompany_pass() {
        return company_pass;
    }

    public void setCompany_pass(Integer company_pass) {
        this.company_pass = company_pass;
    }

    public UserInfo getUserKey() {
        return userKey;
    }

    public void setUserKey(UserInfo userKey) {
        this.userKey = userKey;
    }

    public String getYoutube_url() {
        return youtube_url;
    }

    public void setYoutube_url(String youtube_url) {
        this.youtube_url = youtube_url;
    }

    public String getCompany_deny() {
        return company_deny;
    }

    public void setCompany_deny(String company_deny) {
        this.company_deny = company_deny;
    }

    @Override
    public String toString() {
        return "Companyinfo{" +
                "companykey=" + companykey +
                ", company_name='" + company_name + '\'' +
                ", company_text='" + company_text + '\'' +
                ", game_name='" + game_name + '\'' +
                ", game_url='" + game_url + '\'' +
                ", company_date='" + company_date + '\'' +
                ", company_pass=" + company_pass +
                ", userKey=" + userKey +
                ", youtube_url='" + youtube_url + '\'' +
                ", company_deny='" + company_deny + '\'' +
                '}';
    }
}

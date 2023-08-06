package com.example.DigitalGameNomad.DTO;

import com.example.DigitalGameNomad.Entity.Companyinfo;
import com.example.DigitalGameNomad.Entity.UserInfo;
import org.springframework.lang.Nullable;

import javax.persistence.*;

public class CompanyDTO {

    private  Long company_key;

    private String company_name;

    @Nullable
    private String company_text;
    @Nullable
    private String game_name;
    @Nullable
    private String game_url;

    private String company_date;

    private Integer company_pass;

    @Nullable
    private String youtube_url;

    @Nullable
    private String company_deny;

    public CompanyDTO(Long company_key, String company_name, @Nullable String company_text, @Nullable String game_name, @Nullable String game_url, String company_date, Integer company_pass, @Nullable String youtube_url, @Nullable String company_deny) {
        this.company_key = company_key;
        this.company_name = company_name;
        this.company_text = company_text;
        this.game_name = game_name;
        this.game_url = game_url;
        this.company_date = company_date;
        this.company_pass = company_pass;
        this.youtube_url = youtube_url;
        this.company_deny = company_deny;
    }

    public Companyinfo toEntity(){
        return new Companyinfo(company_key,company_name,company_text,game_name,game_url,company_date ,company_pass,null,youtube_url,company_deny);
   }

    @Override
    public String toString() {
        return "CompanyDTO{" +
                "company_key=" + company_key +
                ", company_name='" + company_name + '\'' +
                ", company_text='" + company_text + '\'' +
                ", game_name='" + game_name + '\'' +
                ", game_url='" + game_url + '\'' +
                ", company_date='" + company_date + '\'' +
                ", company_pass=" + company_pass +
                ", youtube_url='" + youtube_url + '\'' +
                ", company_deny='" + company_deny + '\'' +
                '}';
    }
}

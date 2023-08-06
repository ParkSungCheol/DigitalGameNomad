package com.example.DigitalGameNomad.Entity;

import org.hibernate.annotations.DynamicInsert;
import org.springframework.lang.Nullable;

import javax.persistence.*;


@Entity
@Table (name = "post_info")
@DynamicInsert // insert 할 때 null 값인 field 제외 => DB에 설정된 default 값으로 설정된 값으로 DB 저장
public class PostInfo {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column(name = "post_key")
    private Long postKey;
    @Column(name = "post_title")
    private String postTitle;
    @Column
    private String post_text;
    @Column
    private Long post_view;
    @Column
    private String post_date;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_key")
    private UserInfo userKey;
    @Column
    private String post_topic;
    @Column
    private Integer post_score;
    @Column
    private String game_name;

    public String getGame_name() {
        return game_name;
    }

    public void setGame_name(String game_name) {
        this.game_name = game_name;
    }

    public PostInfo() {
    }

    public Long getPostKey() {
        return postKey;
    }

    public void setPostKey(Long postKey) {
        this.postKey = postKey;
    }

    public String getPostTitle() {
        return postTitle;
    }

    public void setPostTitle(String PostTitle) {
        this.postTitle = PostTitle;
    }

    public String getPost_text() {
        return post_text;
    }

    public void setPost_text(String post_text) {
        this.post_text = post_text;
    }

    public Long getPost_view() {
        return post_view;
    }

    public void setPost_view(Long post_view) {
        this.post_view = post_view;
    }

    public String getPost_date() {
        return post_date;
    }

    public void setPost_date(String post_date) {
        this.post_date = post_date;
    }

    public UserInfo getUserKey() {
        return userKey;
    }

    public void setUserKey(UserInfo userKey) {
        this.userKey = userKey;
    }

    public String getPost_topic() {
        return post_topic;
    }

    public void setPost_topic(String post_topic) {
        this.post_topic = post_topic;
    }

    public Integer getPost_score() {
        return post_score;
    }

    public void setPost_score(Integer post_score) {
        this.post_score = post_score;
    }

    @Override
    public String toString() {
        return "PostInfo{" +
                "postKey=" + postKey +
                ", post_title='" + postTitle + '\'' +
                ", post_text='" + post_text + '\'' +
                ", post_view=" + post_view +
                ", post_date='" + post_date + '\'' +
                ", userKey=" + userKey +
                '}';
    }
}

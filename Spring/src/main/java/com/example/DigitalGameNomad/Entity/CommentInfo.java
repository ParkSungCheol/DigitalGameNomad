package com.example.DigitalGameNomad.Entity;

import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;

@Entity
@Table(name = "comment_info")
@DynamicInsert // insert 할 때 null 값인 field 제외 => DB에 설정된 default 값으로 설정된 값으로 DB 저장
public class CommentInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_key")
    private Long commentKey;
    @Column
    private String comment_text;
    @Column
    private String comment_date;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_key")
    private UserInfo userKey;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "post_key")
    private PostInfo postKey;

    public Long getCommentKey() {
        return commentKey;
    }

    public void setCommentKey(Long commentKey) {
        this.commentKey = commentKey;
    }

    public String getComment_text() {
        return comment_text;
    }

    public void setComment_text(String comment_text) {
        this.comment_text = comment_text;
    }

    public String getComment_date() {
        return comment_date;
    }

    public void setComment_date(String comment_date) {
        this.comment_date = comment_date;
    }

    public UserInfo getUserKey() {
        return userKey;
    }

    public void setUserKey(UserInfo userKey) {
        this.userKey = userKey;
    }

    public PostInfo getPostKey() {
        return postKey;
    }

    public void setPostKey(PostInfo postKey) {
        this.postKey = postKey;
    }
}

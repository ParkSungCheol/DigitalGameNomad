package com.example.DigitalGameNomad.Entity;


import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;

@Entity
@Table (name = "questions_info")
@DynamicInsert // insert 할 때 null 값인 field 제외 => DB에 설정된 default 값으로 설정된 값으로 DB 저장
public class QuestionsInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "questions_key")
    private Long questionsKey;
    @Column
    private String questions_title;
    @Column
    private String questions_text;
    @Column
    private String questions_date;
    @Column(name = "questions_result")
    private boolean questionsResult;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="user_key")
    private UserInfo userKey;

    public QuestionsInfo() {
    }

    public Long getQuestionsKey() {
        return questionsKey;
    }

    public void setQuestionsKey(Long questionsKey) {
        this.questionsKey = questionsKey;
    }

    public String getQuestions_title() {
        return questions_title;
    }

    public void setQuestions_title(String questions_title) {
        this.questions_title = questions_title;
    }

    public String getQuestions_text() {
        return questions_text;
    }

    public void setQuestions_text(String questions_text) {
        this.questions_text = questions_text;
    }

    public String getQuestions_date() {
        return questions_date;
    }

    public void setQuestions_date(String questions_date) {
        this.questions_date = questions_date;
    }

    public boolean isQuestionsResult() {
        return questionsResult;
    }

    public void setQuestionsResult(boolean questionsResult) {
        this.questionsResult = questionsResult;
    }

    public UserInfo getUserKey() {
        return userKey;
    }

    public void setUserKey(UserInfo userKey) {
        this.userKey = userKey;
    }

    @Override
    public String toString() {
        return "QuestionsInfo{" +
                "questionsKey='" + questionsKey + '\'' +
                ", questions_title='" + questions_title + '\'' +
                ", questions_text='" + questions_text + '\'' +
                ", questions_date='" + questions_date + '\'' +
                ", questionsResult=" + questionsResult +
                ", userKey=" + userKey +
                '}';
    }
}

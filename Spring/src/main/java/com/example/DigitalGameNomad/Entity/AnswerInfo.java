package com.example.DigitalGameNomad.Entity;


import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;

@Entity
@Table(name = "answer_info")
@DynamicInsert
public class AnswerInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "answer_key")
    private Long answerKey;
    @Column
    private String answer_text;
    @Column
    private String answer_date;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "questions_key")
    private QuestionsInfo questionsKey;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_key")
    private UserInfo userKey;

    public AnswerInfo() {
    }

    public Long getAnswerKey() {
        return answerKey;
    }

    public void setAnswerKey(Long answerKey) {
        this.answerKey = answerKey;
    }

    public String getAnswer_text() {
        return answer_text;
    }

    public void setAnswer_text(String answer_text) {
        this.answer_text = answer_text;
    }

    public String getAnswer_date() {
        return answer_date;
    }

    public void setAnswer_date(String answer_date) {
        this.answer_date = answer_date;
    }

    public QuestionsInfo getQuestionsKey() {
        return questionsKey;
    }

    public void setQuestionsKey(QuestionsInfo questionsKey) {
        this.questionsKey = questionsKey;
    }

    public UserInfo getUserKey() {
        return userKey;
    }

    public void setUserKey(UserInfo userKey) {
        this.userKey = userKey;
    }

    @Override
    public String toString() {
        return "AnswerInfo{" +
                "answerKey=" + answerKey +
                ", answer_text='" + answer_text + '\'' +
                ", answer_date='" + answer_date + '\'' +
                ", questionsKey=" + questionsKey +
                ", userKey=" + userKey +
                '}';
    }
}

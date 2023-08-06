package com.example.DigitalGameNomad.Repository;

import com.example.DigitalGameNomad.Entity.AnswerInfo;
import com.example.DigitalGameNomad.Entity.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AnswerInfoRepository extends JpaRepository<AnswerInfo, Long> {
    AnswerInfo findByAnswerKey(Long answerKey);

    @Query( "select a\n" +
            "from UserInfo u, QuestionsInfo q, AnswerInfo a\n" +
            "where u.userKey = q.userKey and q.questionsKey = a.questionsKey and u.userKey = :userKey")
    List<AnswerInfo> findAllByAnswer(@Param("userKey") Long userKey);

}

package com.example.DigitalGameNomad.Repository;

import com.example.DigitalGameNomad.Entity.QuestionsInfo;
import com.example.DigitalGameNomad.Entity.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionsInfoRepository extends JpaRepository<QuestionsInfo, Long> {
    QuestionsInfo findByQuestionsKey(Long questionsKey);
    List<QuestionsInfo> findAllByUserKey(UserInfo userKey);
    List<QuestionsInfo> findAllByQuestionsResult(boolean questionsResult);
}

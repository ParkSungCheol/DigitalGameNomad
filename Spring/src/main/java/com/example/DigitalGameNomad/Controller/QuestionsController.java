package com.example.DigitalGameNomad.Controller;


import com.example.DigitalGameNomad.Entity.QuestionsInfo;
import com.example.DigitalGameNomad.Entity.UserInfo;
import com.example.DigitalGameNomad.Repository.QuestionsInfoRepository;
import com.example.DigitalGameNomad.Repository.UserInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;

@Controller
@CrossOrigin("*")
public class QuestionsController {

    @Autowired
    UserInfoRepository userInfoRepository;
    @Autowired
    QuestionsInfoRepository questionsInfoRepository;


    @PostMapping("/inputQuestion")
    @ResponseBody
    public String inputQuestion(@RequestBody(required = true)HashMap <String, String> questionData) {

        String title = questionData.get("title");
        String text = questionData.get("text");
        UserInfo user = userInfoRepository.findByUserKey(Long.valueOf(questionData.get("userKey")));

        QuestionsInfo question = new QuestionsInfo();
        question.setQuestions_title(title);
        question.setQuestions_text(text);
        question.setUserKey(user);

        questionsInfoRepository.save(question);

        return "Spring ===> 질문 등록 완료";
    }

    @PostMapping("/getQuestions")
    @ResponseBody
    public List<QuestionsInfo> getQuestionData(@RequestBody(required = true) HashMap<String, Long> userKey) {

        UserInfo user = userInfoRepository.findByUserKey(userKey.get("userKey"));

        return questionsInfoRepository.findAllByUserKey(user);
    }

    @PostMapping("/waitingQuestions")
    @ResponseBody
    public List<QuestionsInfo> waitingQuestions() {

        // 운영자가 답변할 질문 목록 (questionsResult => false)
        return questionsInfoRepository.findAllByQuestionsResult(false);
    }

}

package com.example.DigitalGameNomad.Controller;

import com.example.DigitalGameNomad.Entity.AnswerInfo;
import com.example.DigitalGameNomad.Entity.QuestionsInfo;
import com.example.DigitalGameNomad.Entity.UserInfo;
import com.example.DigitalGameNomad.Repository.AnswerInfoRepository;
import com.example.DigitalGameNomad.Repository.QuestionsInfoRepository;
import com.example.DigitalGameNomad.Repository.UserInfoRepository;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Controller
@CrossOrigin("*")
public class AnswerController {

    @Autowired
    AnswerInfoRepository answerInfoRepository;
    @Autowired
    UserInfoRepository userInfoRepository;
    @Autowired
    QuestionsInfoRepository questionsInfoRepository;


    @PostMapping("/inputAnswer")
    @ResponseBody
    public String inputAnswer(@RequestBody(required = true) HashMap<String, String> answerData) {

        UserInfo user = userInfoRepository.findByUserKey(Long.valueOf(answerData.get("userKey")));
        QuestionsInfo question = questionsInfoRepository.findByQuestionsKey(Long.valueOf(answerData.get("questionsKey")));
        question.setQuestionsResult(true);

        AnswerInfo answer = new AnswerInfo();
        answer.setAnswer_text(answerData.get("answer_text"));
        answer.setUserKey(user);
        answer.setQuestionsKey(question);
        answerInfoRepository.save(answer);

        return "Spring ===> 답변 완료";
    }

    @PostMapping("/getAnswers")
    @ResponseBody
    public List<HashMap<String, String>> getAnswers(@RequestBody(required = true) HashMap<String, Long> userKey) {

        System.out.println(userKey == null);

        UserInfo user = userInfoRepository.findByUserKey(userKey.get("userKey"));
        List<AnswerInfo> answerInfoList = answerInfoRepository.findAllByAnswer(user.getUserKey());

        System.out.println(userKey);

        if (answerInfoList == null) {
            return null;
        } else {

            List<HashMap<String, String>> responseDataList = new ArrayList<>();

            for(AnswerInfo answer : answerInfoList) {
                HashMap<String, String> responseData = new HashMap<>();
                responseData.put("answerKey", String.valueOf(answer.getAnswerKey()));
                responseData.put("questionsKey", String.valueOf(answer.getQuestionsKey().getQuestionsKey()));
                responseData.put("answer_text", answer.getAnswer_text());
                responseDataList.add(responseData);
            }

            return responseDataList;
        }
    }


}

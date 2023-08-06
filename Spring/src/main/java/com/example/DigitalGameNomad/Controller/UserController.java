package com.example.DigitalGameNomad.Controller;

import com.example.DigitalGameNomad.Entity.UserInfo;
import com.example.DigitalGameNomad.Repository.UserInfoRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.*;
import org.apache.catalina.User;
import org.apache.commons.codec.binary.Base64;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.Timestamp;
import java.text.ParseException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

@RestController
@CrossOrigin("*")
public class UserController {

    @Autowired
    UserInfoRepository userInfoRepository;
    @Autowired
    PasswordEncoder passwordEncoder;

    @RequestMapping("/")
    public ModelAndView Home() {

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("index.html");
        return modelAndView;
    }

    @PostMapping("/idCheck")
    public boolean idCheck(@RequestBody(required = true) HashMap<String, Object> userId) {

        String checkId = (String) userId.get("id");
        String mobile = (String) userId.get("mobile");
        UserInfo u1 = userInfoRepository.findByUserId(checkId);
        if(u1 == null) {
            return true;
        }
        if(mobile != null && !mobile.equals(u1.getUser_phone())) {
            return true;
        }
        return false;
    }


    @PostMapping("/signUp")
    public String signUp(@RequestBody(required = true) HashMap<String, Object> userData) {

        System.out.println(userData);
        String id = (String) userData.get("id");
        String password = (String) userData.get("password");
        String name = (String) userData.get("name");
        String phone = (String) userData.get("phone");
        String level = (String) userData.get("grade");

        UserInfo newUser = new UserInfo();
        if(password != null) {
            String encodedPassword = passwordEncoder.encode(password);
            newUser.setUser_pw(encodedPassword);
        }
        newUser.setUser_id(id);
        newUser.setUser_name(name);
        newUser.setUser_phone(phone);
        newUser.setUser_level(Long.valueOf(level));

        userInfoRepository.save(newUser);

        return "Spring ===> 회원 가입 성공!";
    }

    @PostMapping("/login")
    public UserInfo login(@RequestBody(required = true) HashMap<String, String> loginData, HttpServletRequest request,
                          HttpServletResponse response) {

        String loginId = loginData.get("userId");
        String password = loginData.get("password");
        String token = loginData.get("token");
        // System.out.println(token);
        // System.out.println(token.length());

        UserInfo loginUser = userInfoRepository.findByUserId(loginId);
        // System.out.println(loginUser.getToken());
        // System.out.println(loginUser.getToken().length());
        // System.out.println(token.equals(loginUser.getToken()));

        if(loginUser == null) {
            System.out.println("로그인 컨트롤러 ===> 없는 아이디");
            return null;
        }
        else if(password != null && !passwordEncoder.matches(password, loginUser.getUser_pw())) {
            System.out.println("로그인 컨트롤러 ===> 비밀번호 다름");
            return null;
        }
        else if(token == null && password == null) {
            System.out.println("로그인 컨트롤러 ===> 비밀번호 없음");
            return null;
        }
        else {
            System.out.println("로그인 컨트롤러 ===> 로그인 성공");
            return loginUser;
        }
    }

    @PostMapping("/updateUser")
    public String updateUser(@RequestBody(required = true) HashMap<String, String> loginData) {
        String userId = (String)loginData.get("loginUserId");
        System.out.println(loginData);
        UserInfo userInfo = userInfoRepository.findByUserId(userId);
        if(loginData.get("loginUserPw") != null) {
            String loginUserPw = (String)loginData.get("loginUserPw");
            String encodedPassword = passwordEncoder.encode(loginUserPw);
            userInfo.setUser_pw(encodedPassword);
        }
        if(loginData.get("loginUserPhone") != null) {
            userInfo.setUser_phone((String)loginData.get("loginUserPhone"));
        }
        userInfoRepository.flush();
        return "success";
    }

    @PostMapping("/showlogin")
    public UserInfo showlogin(@RequestBody(required = true) HashMap<String, String> loginData) {
        String userId = (String)loginData.get("loginUserId");
        System.out.println("loginUserId" + userId);
        UserInfo userInfo = userInfoRepository.findByUserId(userId);
        System.out.println("userid" + userInfo.getUser_id());
        return userInfo;
    }

    @PostMapping("/test")
    public void test(@RequestBody(required = true) HashMap<String, String> loginData) {
        String phone = (String) loginData.get("phone");
        String num = (String) loginData.get("num");
        System.out.println(num);
        String hostNameUrl ="https://sens.apigw.ntruss.com";
        String requestUrl = "/sms/v2/services/";
        String requestUrlType = "/messages";
        String accessKey = "3A0HBI2aRLoejJmHYxtq";
        String secretKey = "obvxcJF2Pgvv5vlOy8zfYpgvjjcAy6nebTirwmkx";
        String serviceId = "ncp:sms:kr:282646524917:digitalgamenomad";
        String method = "POST";
        String timestamp = Long.toString(System.currentTimeMillis());
        requestUrl += serviceId + requestUrlType;
        String apiUrl = hostNameUrl + requestUrl;

        // JSON을 활용한 body data 생성
        JSONObject bodyJson = new JSONObject();
        JSONObject toJson = new JSONObject();
        JSONArray toArr = new JSONArray();

        toJson.put("subject", "");
        toJson.put("content", "DigitalGameNomad 인증번호 [" + num +"]");
        toJson.put("to", phone);
        toArr.add(toJson);

        bodyJson.put("type", "sms");
        bodyJson.put("contentType", "COMM");
        bodyJson.put("countryCode", "82");
        bodyJson.put("from", "01099253868");
        bodyJson.put("subject", "");
        bodyJson.put("content", "안녕!");
        bodyJson.put("messages", toArr);

        String body = bodyJson.toJSONString();
        System.out.println(body);

        try {
            URL url = new URL(apiUrl);

            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setUseCaches(false);
            con.setDoOutput(true);
            con.setDoInput(true);
            con.setRequestProperty("content-type", "application/json");
            con.setRequestProperty("x-ncp-apigw-timestamp", timestamp);
            con.setRequestProperty("x-ncp-iam-access-key", accessKey);
            con.setRequestProperty("x-ncp-apigw-signature-v2", makeSignature(timestamp));
            con.setRequestMethod(method);
            con.setDoOutput(true);
            DataOutputStream wr = new DataOutputStream(con.getOutputStream());

            wr.write(body.getBytes());
            wr.flush();
            wr.close();

            int responseCode = con.getResponseCode();
            BufferedReader br;
            System.out.println("responseCode" + " " + responseCode);
            if(responseCode == 202) {
                //정상호출
                br = new BufferedReader(new InputStreamReader(con.getInputStream()));
            }
            else {
                //에러발생
                br = new BufferedReader(new InputStreamReader(con.getInputStream()));
            }

            String inputLine;
            StringBuffer response = new StringBuffer();
            while((inputLine = br.readLine()) != null) {
                response.append(inputLine);
            }
            br.close();
            System.out.println(response.toString());
        }
        catch (Exception e) {
            System.out.println(e);
        }
    }


    public String makeSignature(String timestamp) throws UnsupportedEncodingException, InvalidKeyException, NoSuchAlgorithmException {
        String space = " "; // one space
        String newLine = "\n"; // new line
        String method = "POST"; // method String
        String url = "/sms/v2/services/" + "ncp:sms:kr:282646524917:digitalgamenomad" + "/messages"; // url (include query string)
        String accessKey = "3A0HBI2aRLoejJmHYxtq"; // access key id (from portal or Sub Account)
        String secretKey = "obvxcJF2Pgvv5vlOy8zfYpgvjjcAy6nebTirwmkx";
        String message = new StringBuilder()
                .append(method)
                .append(space)
                .append(url)
                .append(newLine)
                .append(timestamp)
                .append(newLine)
                .append(accessKey)
                .toString();
        SecretKeySpec signingKey = new SecretKeySpec(secretKey.getBytes("UTF-8"), "HmacSHA256");
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(signingKey);
        byte[] rawHmac = mac.doFinal(message.getBytes("UTF-8"));
        String encodeBase64String = Base64.encodeBase64String(rawHmac);
        return encodeBase64String;
    }

}














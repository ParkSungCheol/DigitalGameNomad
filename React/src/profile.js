import React, { useEffect, useState } from "react";
import Axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import KakaoLogoning from './imgs/KakaoLogoning.jpg';
import { SERVER_URL } from './Config';

const Profile = () => {
  const dispatch = useDispatch();

  const getProfile = async () => {
    try {
      // Kakao SDK API를 이용해 사용자 정보 획득
      let data = await window.Kakao.API.request({
        url: "/v2/user/me",
      });
      // 사용자 정보 변수에 저장
      let nickname = data.properties.nickname;
      let account_email = data.kakao_account.email + "k";
      let token = data.id;
      if(account_email == "" || account_email == null) {
        alert("이메일은 필수정보입니다. 정보제공을 동의해주세요.");
        window.location.replace("http://localhost/");
      }
      else {
        let URL = SERVER_URL + "/login";
        let data = {
            token : token,
            userId : account_email,
        }
        Axios.post(URL, data) 
        .then ( response => {
            const getUserData = response.data;
            console.log(getUserData);
            if(response.data == "") {
                data = {
                    token : token,
                    name : nickname,
                    phone : "01000000000",
                    id : account_email,
                    grade : "3",
                }
                URL = SERVER_URL + "/signUp";
                Axios.post(URL, data) 
                .then ( response => {
                    URL = SERVER_URL + "/login";
                    data = {
                        token : token,
                        userId : account_email,
                    }
                    Axios.post(URL, data) 
                    .then ( response => {
                        const getUserData = response.data;
                        dispatch( { type: "login", data: getUserData } );
                        alert("회원가입이 완료되었습니다.");
                        window.location.replace("http://localhost/");
                    })
                })
                .catch( error => {
                    console.log(error);
                    alert("네트워크 에러! 다시 확인!");
                })
            }
            else {
                dispatch( { type: "login", data: getUserData } );

                setTimeout(() => {
                  let email = getUserData.user_id.split("@");
                  if(email[1] == "" || email[1] == null) {
                      alert(`${getUserData.user_id}님 안녕하세요!`);
                  }
                  else {
                      alert(`${email[0]}님 안녕하세요!`);
                  }
                    window.location.replace("http://localhost/");
                }, 300);
            }
        })
        .catch( error => {
            console.log(error);
            alert("네트워크 에러! 다시 확인!");
        })
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="kakao-logining">
      
      <div className="Kakao-logoning-img">
        <img src={KakaoLogoning} className="KakaoLogoning" alt="logo" />
      </div>

      <h1 style={{textAlign : "center"}}>KAKAO 로그인 진행중입니다.</h1>
    </div>
    
  );
};

export default Profile;
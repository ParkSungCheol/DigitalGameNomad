import "./PasswordChange.css";

import { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import DGN2 from './imgs/DGN2.png';
import "./ModifyLogin.css";
import React, { useState, useEffect, useRef } from "react";
import Axios from 'axios';
import Login from './Login';
import $ from 'jquery';


import "./PasswordChange.css"
import { useSelector } from "react-redux";
import { SERVER_URL } from './Config';



const PasswordChange  = () => {

    const user = useSelector(state => state.login);
    const [loginUserId, setLoginUserId] = useState(null);
    const [password, setPassword] = useState(null);
    let test = false;
    const handleGoBack = () => {
        window.location.replace("/UserInquiry");
    };
    const saveData = () => {
        if(test == false) {
            alert("비밀번호를 잘못 입력하셨습니다.");
            return;
        }
        console.log(loginUserId);
        const URL = SERVER_URL + "/updateUser";
            const postData = {
                loginUserId: loginUserId,
                loginUserPw : password
            }
           
            Axios.post(URL, postData)
                .then(response => {
                    alert("변경완료");
                    window.location.replace("/UserInquiry");
                })
                .catch(error => {
                    console.log(error);
                })
    }

    useEffect(()=>{
        if(user) {
            setLoginUserId(user.loginUserId);
        }
    }, [user])

    const registerRegExCheck = (regEx, value) => {
        if (regEx.test(value)) {
            return true;
        } else {
            return false;
        }
    }

    
        return (
            <div className='passwordchange'>
                <div>
                    <img src={DGN2} className='passwordchange-logo' alt="logo" />
                </div>
                
                <div className="passowordchange-text1">
                    🔑 Digital Game Nomad는 회원님의 개인정보를 안전하게 보호하고 있으며, 가입하신 정보는 회원님의 명백한 동의없이는 공개 또는 제 3자에게 제공되지 않습니다.
                </div>
                
                <div className="passowrdchange-textbox">
                    <div className="passowordchange-text2">
                        비밀번호는 8자 이상의 영문자(대, 소문자), 숫자, 특수문자를 혼용해 사용할 수 있습니다.<br/>
                        동일한 문자반복, 키보드상의 연속된 문자들의 집합등 특정 패턴을 갖는 비밀번호로 지정하지 마세요. <br/>
                        제 3자가 쉽게 알 수 있는 이름, 생일 휴대전화 등으로 비밀번호를 구현하지 마세요. <br/>
                        이전과 동일한 비밀번호로 지정하지 마세요.
                    </div>
                </div>

                <div>
                    <label className="passwordchange-text">새로운 비밀번호 입력</label>
                    <input className="passwordchange-login" type="password" placeholder="  비밀번호를 입력해주세요." maxLength={16}
                        onChange={(e) => {
                      
                            const regExPw = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,16}$/;
                            if(registerRegExCheck(regExPw, e.target.value)) {
                                $("#error1").hide();
                                setPassword(e.target.value);
                            }
                            else {
                                $("#error1").show();
                                setPassword(null);
                            }
                        }}
                    />
                    <br></br>
                    <span id="error1" style={{color:"red"}}>비밀번호는 8자 이상의 영문자(대, 소문자), 숫자, 특수문자를 혼용해 사용할 수 있습니다.</span>
                </div>

                <div>
                    <label className="passwordchange-text">새로운 비밀번호 확인</label>
                    <input className="passwordchange-login" type="password" placeholder="  비밀번호를 다시 입력해주세요." maxLength={16}
                        onChange={(e) => {
                           
                            if(password!= null && password == e.target.value) {
                                $("#error2").hide();
                                test = true;
                            }
                            else {
                                $("#error2").show();
                                test = false;
                            }
                        }}
                    />
                    <br></br>
                    <span id="error2" style={{color:"red"}}>비밀번호 확인은 입력하신 비밀번호와 일치해야합니다.</span>
                </div>


                <button className='passwordchange-button1'onClick={handleGoBack}>취소</button>
                <button className='passwordchange-button2'onClick={saveData}>확인</button>


                <Switch>
                    <Route path="/Login" component={Login} />
                </Switch>
            </div>
        
        );
}

export default PasswordChange;
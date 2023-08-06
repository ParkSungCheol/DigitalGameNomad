import "./PhonenumberChange.css";

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



const PhonenumberChange = () => {

    const user = useSelector(state => state.login);
    const [loginUserId, setLoginUserId] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [newPhoneNumber, setNewPhoneNumber] = useState(null);
    const [phone1, setPhone1] = useState(null);
    const [phone2, setPhone2] = useState(null);
    const [phone3, setPhone3] = useState(null);
    let test;
    const handleGoBack = () => {
        window.location.replace("/UserInquiry");
    };
    const saveData = () => {
     
        if(test == false) {
            alert("핸드폰번호를 잘못 입력하셨습니다.");
            return;
        }
        const URL = SERVER_URL + "/updateUser";
            const postData = {
                loginUserId: loginUserId,
                loginUserPhone : newPhoneNumber
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
            setPhoneNumber(user.loginUserPhone.substring(0,3) + "-" + user.loginUserPhone.substring(3,user.loginUserPhone.length-4) + "-" + user.loginUserPhone.slice(-4));
            test = false;
        }
    }, [user])

    useEffect(() => {
        let phone = phone1 + phone2 + phone3;
        const regExPhone = /^[0-9]{10,11}$/;
        if(registerRegExCheck(regExPhone, phone)) {
            $("#error1").hide();
            test = true;
            setNewPhoneNumber(phone);
        }
        else {
            $("#error1").show();
            test = false;
        }
    }, [phone1, phone2, phone3])

    const registerRegExCheck = (regEx, value) => {
        if (regEx.test(value)) {
            return true;
        } else {
            return false;
        }
    }

        return (
            <div className='phonenumberchange'>
                <div>
                    <img src={DGN2} className='phonenumberchange-logo' alt="logo" />
                </div>

                <div>
                    <label className="phonenumberchange-text">현재 핸드폰 번호</label>
                    {phoneNumber}
                    
                </div>

                <div>
                    <label className="phonenumberchange-text">변경할 번호 입력</label>
                    <input className="phonenumberchange-number" type="text" placeholder="" maxLength={3}
                        onChange={(e) => {
                            const regExPhone = /^[0-9]{3}$/;
                        
                            if(registerRegExCheck(regExPhone, e.target.value)) {
                                setPhone1(e.target.value);
                            }
                            else {
                                $("#error1").show();
                                setPhone1(null);
                            }
                        }}
                    ></input>-
                     <input className="phonenumberchange-number" type="text" placeholder="" maxLength={4}
                        onChange={(e) => {
                            const regExPhone = /^[0-9]{3,4}$/;
                          
                            if(registerRegExCheck(regExPhone, e.target.value)) {
                                setPhone2(e.target.value);
                            }
                            else {
                                $("#error1").show();
                                setPhone2(null);
                            }
                        }}

                    ></input>-
                    <input className="phonenumberchange-number" type="text" placeholder="" maxLength={4}
                        onChange={(e) => {
                            const regExPhone = /^[0-9]{4}$/;
                        
                            if(registerRegExCheck(regExPhone, e.target.value)) {
                                setPhone3(e.target.value);
                            }
                            else {
                                $("#error1").show();
                                setPhone3(null);
                            }
                        }}
                    ></input>
                    <br></br>
                    <span id="error1" style={{color:"red"}}>핸드폰 번호를 다시 확인해 주세요.</span>
                </div>


                <button className='phonenumberchange-button1'onClick={handleGoBack}>취소</button>
                <button className='phonenumberchange-button2'onClick={saveData}>확인</button>

                <Switch>
                    <Route path="/Login" component={Login} />
                </Switch>
            </div>
        
        );
}

export default PhonenumberChange;
import { Route, Link, Switch } from 'react-router-dom';
import React, { useState, useEffect, useRef } from "react";
import DGN2 from './imgs/DGN2.png';
import "./ModifyLogin.css";
import Axios from 'axios';

import UserInquiry from './UserInquiry';
import { useSelector } from "react-redux";
import $ from 'jquery';

import { SERVER_URL } from './Config';


import "./ModifyLogin.css"

const ModifyLogin = () => {

    const user = useSelector(state => state.login);
    const [loginUserId, setLoginUserId] = useState(null);
    const nameInput = useRef();

    useEffect(() => {
        setLoginUserId(user.loginUserId);
    }, [user])

    const login = () => {
        const URL = SERVER_URL + "/login";
        const postData = {
            userId: loginUserId,
            password : nameInput.current.value
        }
       
        Axios.post(URL, postData)
            .then(response => {
                const getUserData = response.data;
                if (getUserData === "") {
                    alert("비밀번호를 다시 확인해주세요.");
                }
                else{
                    window.location.replace("http://localhost/UserInquiry");
                }
            })
            .catch(error => {
                $("#input").val("");
                alert("네트워크 에러입니다.");
            })
    }

    return (
        <div className='modifylogin'>
            <div>
                <img src={DGN2} className='modifylogin-logo' alt="logo" />
            </div>

            <div>
                <input type="password" id="input" className='modifylogin-login' placeholder='  비밀번호를 입력해주세요.' ref={nameInput} />
            </div>


            <button className='modify-button' onClick={login} >
                🔒 확인
            </button>


            <Switch>
                <Route path="/UserInquiry" component={UserInquiry} />
            </Switch>
        </div>
    )
}

export default ModifyLogin;
import React, {useState} from "react"; 
import Axios from 'axios';
import "./Login.css"; 
import TermsRegister from "./TermsRegister";
import { Route, Link, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

function Login() {

    //useDispatch => Redux 값 변경
    const dispatch = useDispatch();

    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    const login = () => {

        //const URL = "http://localhost:8088/login";
        const URL = "http://49.50.174.251:8088/login";
        const postData = {
            userId: userId,
            password: password
        }
        Axios.post(URL, postData) 
        .then ( response => {
            const getUserData = response.data;
            if (getUserData === "") {
                alert("아이디와 비밀번호를 다시 확인해주세요.");
            }
            else {
                dispatch( { type: "login", data: getUserData } );

                setTimeout(() => {
                    alert(`${getUserData.user_id}님 안녕하세요!`);
                    window.location.replace("http://localhost:3000/");
                }, 300);
                
            }
        })
        .catch( error => {
            console.log(error);
            alert("네트워크 에러! 다시 확인!");
        })
            
    };

    return (
        <div className="login">
                <h1 className="login-header">로그인</h1>
                <hr className="login-hr" />                        
                <div className="login-main">
                    <div className="login-id">
                        <label className="login-id-text">아이디</label>
                        <input className="login-id-box" type="text" placeholder="아이디를 입력해주세요." maxLength={12}
                            onChange={(e) =>{
                                setUserId(e.target.value);
                            }} 
                        />
                    </div>

                    <div className="login-password">
                        <label className="login-password-text">비밀번호</label>
                        <input className="login-password-box" type="password" placeholder="비밀번호를 입력해주세요." maxLength={16}
                            onChange={(e) =>{
                            setPassword(e.target.value);
                            }} 
                        />
                    </div>
                    <div><button className="login-button-register"><Link to="/TermsRegister">회원가입하기</Link></button></div>
                </div>

                <div className="login-button-main">
                    <div className="login-button-box">
                        <button className="login-button" onClick={login}> 로그인 </button>
                    </div>

                    <div className="login-button-kakao-box">
                        <button className="login-button-kakao"> 카카오 로그인 </button>
                    </div>
                </div>
                <hr className="login-hr" />        

        </div>
    );
    <Switch>
        <Route path="/TermsRegister" component={TermsRegister} />
    </Switch>
}

export default Login;
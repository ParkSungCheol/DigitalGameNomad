import { useRef, useState } from "react";
import "./FindPassword.css";
import Axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import $ from 'jquery';
import { SERVER_URL } from './Config';

function FindPassowrd() {

    const nameInput = useRef();
    const idInput = useRef();
    const mobile1Input = useRef();
    const mobile2Input = useRef();
    const mobile3Input = useRef();
    const dispatch = useDispatch();
    const [number, setNumber] = useState(null);
    const [id, setId] = useState(null);
    
    const cellphone = () => {
        let id = idInput.current.value;
        let mobile = mobile1Input.current.value + mobile2Input.current.value + mobile3Input.current.value;

        const data = {
            id : id,
            mobile : mobile,
        }
        setId(id);
        const URL = SERVER_URL + "/idCheck";

            Axios.post(URL, data)
                .then(response => {
                    if(response.data) {
                        alert("정보가 일치하지 않습니다.");
                    }
                    else {
                        const URL = SERVER_URL + "/test";
                        let num = 0;
                        while (num <= 1000) {
                            num = Math.round(Math.random() * 10000);
                        }
                        const postData = {
                            phone: mobile,
                            num: num,
                        }
                        Axios.post(URL, postData)
                            .then(response => {
                                setNumber(num);
                                $("#certification1, #certification2").show();
                            })
                            .catch(error => {
                                console.log(error);
                            })
                    }
                })
                .catch(error => {
                    console.log(error);
                })
    }

    const certification = () => {

        if(number == nameInput.current.value) {
            dispatch( { type: "login", data: {
                user_id : id,
            } } );
            setTimeout(()=>{
                window.location.replace("http://localhost/PasswordChange");
            }, 300);
        }
        else {
            nameInput.current.value = "";
            alert("인증번호가 일치하지 않습니다.");
        }
        
    }
    return (
        <div className="findpassword">
            <div>

                <div>
                    <h1 className="findpassword-header">비밀번호 찾기</h1>
                    <hr />
                </div>

                <div className="findpassword-id">
                    <label className="findpassword-text">아이디</label>
                    <input className="findpassword-box-id" type="text" placeholder="  아이디를 입력해주세요." maxLength={16}
                      ref={idInput}
                    />
                </div>

                <div className="findpassword-number">
                    <label className="findpassword-text">전화번호</label>
                    <select className="findpassword-select-number">
                        <option disabled>통신사</option>
                        <option defaultValue={null}>SKT</option>
                        <option>KT</option>
                        <option>LG</option>
                        <option>알뜰</option>
                    </select>
                    <input  className="findpassword-box-number" id="mobile1" type="text" placeholder="" maxLength={3}
                       ref={mobile1Input}
                    ></input>-
                    <input className="findpassword-box-number" id="mobile2" type="text" placeholder="" maxLength={4}
                      ref={mobile2Input}
                    ></input>-
                    <input className="findpassword-box-number" id="mobile3" type="text" placeholder="" maxLength={4}
                      ref={mobile3Input}
                    ></input>

                    <button className="register-certification1" onClick={cellphone}>인증</button>
                    <br></br>
                    <div className="register-box-certification1">
                    <input className="register-input-certification1" ref={nameInput} placeholder="인증번호 4자리를 입력해주세요" type="text" id="certification1" style={{ display: "none" }}></input>
                    <button className="register-certification-btn1" onClick={certification} id="certification2" style={{ display: "none" }}>확인</button>
                    </div>
                </div>
              
                <hr />

            </div>
        </div>
    );
}

export default FindPassowrd;
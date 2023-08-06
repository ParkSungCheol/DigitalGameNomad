import axios from "axios";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "./Inquiry.css";
import { SERVER_URL } from './Config';

function Inquiry() {

    const user = useSelector(state => state.login);
    const history = useHistory();
    const questionData = useRef({
        title: "",
        text: ""
    });

    const submitQuestion = () => {
        if (questionData.current.title === "") {
            alert("제목을 입력해 주세요");
            return;
        }
        else if (questionData.current.text === "") {
            alert("문의 내용을 입력해 주세요");
            return;
        }

        const URL = SERVER_URL + " /inputQuestion";
        const postData = {
            title: questionData.current.title,
            text: questionData.current.text,
            userKey: user.loginUserKey
        }
        axios.post(URL, postData)
            .then(response => {
       
                alert("문의가 등록되었습니다.");
                document.querySelectorAll("input").forEach(field => field.value = "");
                //window.location.replace("http://localhost:3000/Service");
                history.push("/Service");
            })
            .catch(error => {
                console.log(error);
            })
    }


    return (
        <div className="inquiry">
            <div>
                <div>
                    <h1 className="inquiry-header">문의하기</h1>
                    <hr />

                    <div className="inquiry-title">
                        <label className="inquiry-text">제목</label>
                        <input className="inquiry-box-title" type="text" placeholder="  재목을 입력해주세요."
                            onChange={(e) => questionData.current.title = e.target.value}
                        />
                    </div>
                </div>

                <div className="inquiry-info">
                    <label className="inquiry-text">내용</label>
                    <input className="inquiry-box-info" type="text" placeholder="  문의 내용을 입력해주세요."
                        onChange={(e) => questionData.current.text = e.target.value}
                    />
                </div>

                <hr />

                <div className="inquiry-button">
                    <button className="inquiry-button-box" onClick={submitQuestion}> 작성하기 </button>
                </div>

            </div>
        </div>
    );
}

export default Inquiry;
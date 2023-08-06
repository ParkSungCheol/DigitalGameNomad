import React, { useState, useEffect } from "react";
import { Link, useHistory } from 'react-router-dom';
import axios from "axios"; //Vue에서도 사용한다.
import "./Apply.css";
import { useSelector } from 'react-redux';
import { SERVER_URL } from './Config';


var today = new Date();
var year = today.getFullYear();
var month = ('0' + (today.getMonth() + 1)).slice(-2);
var day = ('0' + today.getDate()).slice(-2);
const week = ['일', '월', '화', '수', '목', '금', '토'];
// let dayOfWeek = week[today.getDay()];
let hours = ('0' + today.getHours()).slice(-2);;
let minutes = ('0' + today.getMinutes()).slice(-2);;
var dateString = year + '-' + month + '-' + day + '  '+ hours + ':' + minutes;

console.log(dateString);


function Apply() {
  const user = useSelector(state => state.login);
  const history = useHistory();


  const [previewimage, setPreViewImage] = useState("");
  const [savefile, setSaveFile] = useState("");
  // 파일 저장
  const saveFileImage = (e) => {
    setPreViewImage(URL.createObjectURL(e.target.files[0]));
    setSaveFile(e.target.files[0]);
  };

  // 파일 삭제
  const deleteFileImage = () => {
    URL.revokeObjectURL(previewimage);
    setPreViewImage("");
    setSaveFile("");
  };


  const [CompanyNameValue, setCompanyNameValue] = useState("");
  const [CompanyText, setCompanyText] = useState("");
  const [GameName, setGameName] = useState("");
  const [GameUrl, setGameUrl] = useState("");
  const [YoutubeUrl, setYoutubeUrl] = useState("");
  const [check, setCheck] = useState(false);
  const saveData = () => {


   

    const file = new FormData();
    file.append("file", savefile);


    const api = axios.create({
      baseURL: SERVER_URL
    })

    api.post('/companysiginup', file, {
      params: {

        company_name: CompanyNameValue,
        company_text: CompanyText,
        game_name: GameName,
        game_url: GameUrl,
        company_date: dateString,
        company_pass: 0,
        userkey: user.loginUserKey,
        youtube_url: YoutubeUrl
        // image_url: board_2.image_url

      }
    }).then(function (response) {
      alert("신청되었습니다");
    
      history.push("/");
    }).catch(function (error) {
      console.log(error)

    });





  };

  const onChangeCompanyNameValue = (e) => {
    setCompanyNameValue(e.target.value);
    setCheck(false);
  };

  const onChangeCompanyText = (e) => {
    setCompanyText(e.target.value);
    setCheck(false);
  };


  const onChangeGameName = (e) => {
    setGameName(e.target.value);
    setCheck(false);
  };

  const onChangeGameUrl = (e) => {
    setGameUrl(e.target.value);
    setCheck(false);
  };

  const onChangeYoutubeUrl = (e) => {
    setYoutubeUrl(e.target.value);
    setCheck(false);
  };





  return (
    <div className="apply">
      <div className="registration">
        <div>
          <h1 className="apply-header">참여신청</h1>
          <hr />

          <div className="apply-name">
            <label className="apply-text">기업 이름</label>
            <input
              className="apply-box-name"
              type="text"
              name="company_name"
              value={CompanyNameValue}
              onChange={onChangeCompanyNameValue}
              placeholder="  기업 이름을 입력해주세요."
            />
          </div>
        </div>

        <div className="apply-game">
          <label className="apply-text">게임 이름</label>
          <input
            className="apply-box-game"
            type="text"
            value={GameName}
            onChange={onChangeGameName}
            placeholder="  게임 이름을 입력해주세요."
          />
        </div>

        <div className="apply-info">
          <label className="apply-text">전시 내용</label>
          <input
            className="apply-box-info"
            type="text"
            value={CompanyText}
            onChange={onChangeCompanyText}
            placeholder="  전시 내용을 입력해주세요."
          />
        </div>

        <div className="apply-url">
          <labal className="apply-text">게임 URL</labal>
          <input
            className="apply-box-name"
            type="text"
            value={GameUrl}
            onChange={onChangeGameUrl}
            placeholder="  게임 URL을 입력해주세요."
          ></input>
        </div>

        <div className="apply-url">
          <labal className="apply-text">유튜브 URL</labal>
          <input
            id="apply-urls"
            className="apply-box-name"
            type="text"
            value={YoutubeUrl}
            onChange={onChangeYoutubeUrl}
            placeholder="  유튜브 URL을 입력해주세요."
          ></input>
        </div>

        <div>
          {previewimage && (
            <img
              className="upload-img"
              alt="sample"
              src={previewimage}
            
            />
          )}
          <div style={{ alignItems: "center", justifyContent: "center" }}>
            <labal className="apply-text-img">이미지</labal>
            <input
              className="upload"
              name="imgUpload"
              type="file"
              accept="image/*"
              onChange={saveFileImage}
            />

            <button
            className="apply-upload-button"
              style={{
                fontFamily: "NotoSansCJKkrMedium",
                border:"0",
                backgroundColor: "#a52a2a",
                color: "white",
                width: "100px",
                height: "40px",
                cursor: "pointer",
                borderRadius: "8px",
              }}
              onClick={() => deleteFileImage()}
            >
              {" "}
              삭제{" "}
            </button>
          </div>
        </div>
        <br />
        <br />

        <hr />
        <div className="apply-button">
          <button className="apply-button-box" onClick={saveData}>
            <Link to="/">참여신청</Link>{" "}
          </button>
        </div>
      </div>
    </div>
  );
}
export default Apply;
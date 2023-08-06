import React from "react";
import leader from "./imgs/leader.png";
import backend from "./imgs/backend.png";
import frontend from "./imgs/frontend.png";
import "./Team.css";

function Team() {
  return (
    <div className="team">
      <h1 className="t__h1">역할분담</h1>
      <span className="t__s">-팀원소개</span>
      <div className="t__div1">
        <ul className="t__ul1">
          <li className="t__li1">
            <img src={leader} className="t__img" alt="이미지" />
            <p className="t__p">안희선</p>
            <p className="t__p1">heeheesun00@gmail.com</p>
            <p className="t__p1">TeamLeader</p>
            <p className="t__p1">BackEnd</p>
          </li>
          <li className="t__li1">
            <img src={backend} className="t__img1" alt="이미지" />
            <p className="t__p">박성철</p>
            <p className="t__p1">skfo8gmlakd@naver.com</p>
            <p className="t__p1">BackEnd</p>
            <p className="t__p1">Leader</p>
          </li>
          <li className="t__li1">
            <img src={frontend} className="t__img1" alt="이미지" />
            <p className="t__p">유대현</p>
            <p className="t__p1">eogus2604@hanmail.net</p>
            <p className="t__p1">FrontEnd</p>
            <p className="t__p1">Leader</p>
           
          </li>
        </ul>
      </div>
      <div className="t__div2">
        <ul className="t__ul2">
          <li className="t__li1">
            <img src={backend} className="t__img" alt="이미지" />
            <p className="t__p">성동인</p>
            <p className="t__p1">ddongin10@naver.com</p>
            <p className="t__p1">BackEnd</p>
          </li>
          <li className="t__li1">
            <img src={backend} className="t__img" alt="이미지" />
            <p className="t__p">탁원석</p>
            <p className="t__p1">abctoe@naver.com</p>
            <p className="t__p1">BackEnd</p>
          </li>
          <li className="t__li1">
            <img src={frontend} className="t__img" alt="이미지" />
            <p className="t__p">최우혁</p>
            <p className="t__p1">usajoi@naver.com</p>
            <p className="t__p1">FrontEnd</p>
          </li>
        </ul>
      </div>
      <div className="mark__line"></div>
    </div>
  );
}

export default Team;

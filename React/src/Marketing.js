import React from "react";
import covid from "./imgs/covid.png";
import dimension from "./imgs/dimension.png";
import talk from "./imgs/talk.png";
import place from "./imgs/place.png";
import board from "./imgs/board.png";
import experience from "./imgs/experience.png";
import "./Marketing.css";

function Marketting() {
  return (
    <div className="marketing">
      <h1 className="mark__h1">요구사항</h1>
      <span className="mark__s">-사용자 요구사항</span>
      <div className="mark__div1">
        <ul className="mark__ul1">
          <li className="mark__li1">
            <img src={covid} className="mark__img" alt="이미지" />
            <span className="mark__lis">전염병의 위험 감소</span>
          </li>
          <li className="mark__li1">
            <img src={dimension} className="mark__img" alt="이미지" />
            <span className="mark__lis"> 3D 전시관 구현</span>
          </li>
          <li className="mark__li1">
            <img src={talk} className="mark__img" alt="이미지" />
            <span className="mark__lis">유저들간의 소통</span>
          </li>
        </ul>
      </div>
      <div className="mark__div2">
        <ul className="mark__ul2">
          <li className="mark__li2">
            <img src={place} className="mark__img" alt="이미지" />
            <span className="mark__lis">공간의 제약 없음</span>
          </li>
          <li className="mark__li2">
            <img src={board} className="mark__img" alt="이미지" />
            <span className="mark__lis">게시판 기능</span>
          </li>
          <li className="mark__li2">
            <img src={experience} className="mark__img" alt="이미지" />
            <span className="mark__lis">간단한 게임 체험</span>
          </li>
        </ul>
      </div>
      <div className="mark__line"></div>
    </div>
  );
}

export default Marketting;

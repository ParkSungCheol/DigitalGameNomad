import React from "react";
import company from "./imgs/company.png";
import director from "./imgs/director.png";
import lock from "./imgs/lock.png";
import unlock from "./imgs/unlock.png";
import "./Marketing.css";

function Surpport() {
  return (
    <div className="marketing">
      <h1 className="mark__h1">요구사항</h1>
      <span className="mark__s">-사용자 요구사항</span>
      <div className="mark__div3">
        <ul className="mark__ul3">
          <li className="mark__li3">
            <img src={company} className="mark__img" alt="이미지" />
            <p className="mark__p">기업회원</p>
            <p className="mark__p1">-전시참여신청</p>
            <p className="mark__p1">-문의요청</p>
          </li>
          <li className="mark__li3">
            <img src={lock} className="mark__img" alt="이미지" />
            <p className="mark__p">일반회원</p>
            <p className="mark__p1">-게시판이용</p>
            <p className="mark__p1">-별점기능</p>
            <p className="mark__p1">-문의요청</p>
          </li>
          <li className="mark__li3">
            <img src={unlock} className="mark__img" alt="이미지" />
            <p className="mark__p">비회원(공통)</p>
            <p className="mark__p1">-전시관 관람</p>
            <p className="mark__p1">-게임 체험</p>
            <p className="mark__p1">-게시판 조회</p>
            <p className="mark__p1">-별점 조회</p>
          </li>
          <li className="mark__li3">
            <img src={director} className="mark__img" alt="이미지" />
            <p className="mark__p">관리자</p>
            <p className="mark__p1">-모든 게시물 관리</p>
            <p className="mark__p1">-Q&A 운영</p>
            <p className="mark__p1">-기업 전시요청 응답</p>
          </li>
        </ul>
      </div>
      <div className="mark__line"></div>
    </div>
  );
}

export default Surpport;

import React from "react";
import "./Information.css";
import DGNw1 from "./imgs/DGNw1.png";

function Information() {
  return (
    <div className="info">
      <div className="i__header">
        <h1 className="i__h1">DIGITAL GAME NOMAD</h1>
        <img src={DGNw1} className="i__img" alt="이미지"></img>
      </div>
      <div className="i__main">
        <h1 className="i__h1">게임 소비자를 위한 온라인 게임전시회 플랫폼</h1>
        <p className="i__p">
          디지털게임노마드는{" "}
          <span className="i__s">
            기업의 게임전시회 참가 업무를 지원하는 서비스
          </span>{" "}
          를 지원하고 운영하는 기업입니다.
        </p>
        <p className="i__p">
          국내 게임 기업들이 코로나 현상으로 인해 오프라인 박람회에 참가할 수
          있는 기회가 점차 사라지는 것에 도움을 드리고자 시작하게 되었습니다.{" "}
        </p>
        <p className="i__p">
          첫째로{" "}
          <span className="i__s">
            다양한 게임들을 소비자들에게 온라인으로 쉽게 확인
          </span>
          할 수 있도록 온라인 게임전시회를 통해 게임에 대한 정보를 제공하고
          있습니다.
        </p>
        <p className="i__p">
          둘째로{" "}
          <span className="i__s">
            기업이 박람회 준비에 어려움을 줄이고 바이어 미팅과 참가목표에 집중
          </span>
          할 수 있도록 참가업무 지원 플랫폼을 제공합니다.
        </p>
        <p className="i__p">
          DIGITAL GAME NOMAD는 전시회와 IT서비스에 대한 전문성을 바탕으로 온라인
          게임 전문 전시회의 디지털 허브입니다.
        </p>
      </div>
      <div className="i__line"></div>
      <div className="i__article">
        <h1 className="i__a">
          게임에 관련된 기업들은 언제든지 <br></br> DIGITAL GAME NOMAD에 손쉽게
          참가할 수 있습니다.
        </h1>
        <ul className="i__ul1">
          <li className="i__li1">
            <p className="i__p1">01</p>
            <p className="i__p2">부스 신청</p>
            <p className="i__p3">기업회원은 간편하게 부스를 신청하실 수 있습니다.</p>
          </li>
          <li className="i__li1">
            <p className="i__p1">02</p>
            <p className="i__p2">다양한 게임 정보제공</p>
            <p className="i__p3">
              다양한 기업의 게임 정보를 찾아 보실수 있습니다.
            </p>
          </li>
          <li className="i__li1">
            <p className="i__p1">03</p>
            <p className="i__p2">게시판</p>
            <p className="i__p3">다양한 사람들과 소통하고 별점기능을 활용하여 게임을 평가하실 수 있습니다.</p>
          </li>
        </ul>
        <ul className="i__ul2">
          <li className="i__li2">
            <p className="i__p1">04</p>
            <p className="i__p2">간단한 게임 체험</p>
            <p className="i__p3">게임을 체험 하실 수 있습니다.</p>
          </li>
          <li className="i__li2">
            <p className="i__p1">05</p>
            <p className="i__p2">고객센터</p>
            <p className="i__p3">문의 사항을 남겨두시면 답변해 드립니다.</p>
          </li>
          <li className="i__li2">
            <p className="i__p1">06</p>
            <p className="i__p2">3D 전시관 구현</p>
            <p className="i__p3">
              3D를 통해 온라인에서의 현장감을 느낄수 있도록 표현하였습니다.
            </p>
          </li>
        </ul>
      </div>
      <div className="i__blank"></div>
    </div>
  );
}

export default Information;

import "./BoardFree.css";
import React, { useState, useEffect } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import Board from './Board';
import BoardWrite from './BoardWrite';
import BoardFreeSee from './BoardFreeSee';
import BoardReview from './BoardReview';
import BoardList from './BoardList';
import { useDispatch, useSelector } from "react-redux";
import Flip from 'react-reveal/Flip';
import GSTARLIVE from './imgs/GSTARLIVE.png';

const BoardFree = () => {
  let login = useSelector(state => state.login);

    return (
        <div className="board">
          <img src={GSTARLIVE} className="GSTARLIVE" alt="logo" /> 
          <div className="board-board">
      <div className="board-nav1">
      <Flip top>
        <h1>자유게시판</h1>
        </Flip>
      </div>
      <div className="board-navs">
        <ul className="board-navs1">
          <li className="b__nli">
            <Link to="/Board">전체</Link>
          </li>
          <li className="b__nli" id="board-free-nav">
            <Link to="/BoardFree">자유</Link>
          </li>
          <li className="b__nli">
            <Link to="/BoardReview">후기</Link>
          </li>
        </ul>
      </div>
      <hr className="board-board-hr"/>
      <div className="board-click-title">※타이틀을 클릭하여 정렬할 수 있습니다.</div>

          <BoardList/>
            {/* <hr className="free-hr"/> */}

            {/* <ul className="free-number">
                <li>1</li>
                <li>2</li>
      
                <li>&gt;</li>
                <li>&gt;&gt;</li>
            </ul>
            <div>
                <select className="free-select">
                    <option selected disabled >선택</option>
                    <option>제목</option>
                    <option>내용</option>
                    <option>작성자</option>
                </select>
                <input className="boardsearch" type="text" placeholder=" 내용을 입력해주세요."></input>
                
                <button className="free-button-search">검색</button> */}

                {function(){
                    if(login.loginUserKey && login.loginUserGrade != 2) return (
                    <div className="free-button-nav">
                    <button className="free-button" ><Link to="/BoardWrite">글쓰기</Link></button>
                    </div>)
                }()}
            {/* </div> */}
            </div>
            <Switch>
                <Route path="/Board" component={Board} />
                <Route path="/BoardWrite" component={BoardWrite} />
                <Route path="/BoardFreeSee" component={BoardFreeSee} />
                <Route path="/BoardReview" component={BoardReview} />
            </Switch>

        </div>
    );
}

export default BoardFree;

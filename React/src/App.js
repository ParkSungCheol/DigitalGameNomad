import { Route, Link, Switch, useLocation } from 'react-router-dom';
import './App.css';
import About from './About';
import Home from './Home';
import Company from './Company';
import Board from './Board';
import DGNw2 from './imgs/DGNw2.png';
import DGN2 from './imgs/DGN2.png';
import Homes from './imgs/Homes.png';
import Hamburger from './imgs/Hamburger.png';
import facebook from './imgs/facebook.png';
import twitter from './imgs/twitter.png';
import Conversation from './Conversation';
import Login from './Login';
import Register from './Register';
import Service from './Service';
import Apply from "./Apply";
import TermsRegister from "./TermsRegister";
import TermsCompany from "./TermsCompany";
import BoardFree from './BoardFree';
import BoardWrite from './BoardWrite';
import BoardFreeSee from './BoardFreeSee';
import BoardReview from './BoardReview';
import BoardReviewSee from './BoardReviewSee';
import BoardWriteReview from './BoardWriteReview';
import board from './Data.js';
import Logout from './Logout.js';
import Character from './Character.js';
import $ from 'jquery';

import ApplyMaster from './ApplyMaster';
import ApplyMasterList from './ApplyMasterList';
import UserInquiry from './UserInquiry';
import PasswordChange from './PasswordChange';
import PhonenumberChange from './PhonenumberChange';
import ModifyLogin from './ModifyLogin';
import FindPassword from './FindPassword';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Inquiry from './Inquiry';

import Information from './Information';
import Team from './Team';
import Surpport from './Surpport';
import Privercy from './Privecy';
import Marcketing from './Marketing';
import profile from './profile';
import { SERVER_URL } from './Config';

const App = () => {
  board();
  const user = useSelector(state => state.login);

  var count;
  const dispatch = useDispatch();
  window.onload = () => {
    $("#refresh").on("click", (event) => {
      event.preventDefault();
      dispatch({ type: "board_out", data: null });
      dispatch({ type: "comment_out", data: null });
      dispatch({ type: "company_out", data: null });
      board();
    })
    $(".toogle-logo").on("click", () => {
      $(".navbar-menu").toggle();
      $(".navbar-links").toggle();
    });
    if(window.matchMedia('(max-width: 768px)').matches) {
      $(".navbar-menu").on("click", () => {
        $(".navbar-menu").hide();
        $(".navbar-links").hide();
      });
      $(".navbar-links").on("click", () => {
        $(".navbar-menu").hide();
        $(".navbar-links").hide();
      })
    }
    count = 0;
  }

  $( window ).resize(function() {
    //창크기 변화 감지
    if(window.matchMedia('(min-width: 768px)').matches) {
      $(".navbar-menu").show();
      $(".navbar-links").show();
      $(".navbar-menu").css("display", "flex");
      $(".navbar-links").css("display", "flex");
      $(".navbar-menu").off("click");
      $(".navbar-links").off("click");
      count = 0;
    }
    else if(count == 0) {
      $(".navbar-menu").hide();
      $(".navbar-links").hide();
      $(".navbar-menu").on("click", () => {
        $(".navbar-menu").hide();
        $(".navbar-links").hide();
      });
      $(".navbar-links").on("click", () => {
        $(".navbar-menu").hide();
        $(".navbar-links").hide();
      })
      count++;
    }
  });

  //공유버튼 주소연결 
  const onClicFacebook = () => {
    window.open('https://www.facebook.com/sharer/sharer.php?u=https://localhost/')
  }
  const onClicTwitter = () => {
    window.open('https://www.twitter.com/intent/tweet?&url=https://localhost/')
  }


  ////////////////////////////
  //////신청내역 알림벨////////
  ////////////////////////////
  let url ;

  let unum = user.loginUserKey;
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    getcompanydata();
  }, []);

  function getcompanydata() {

    if(user.loginUserGrade == 2){
       url = SERVER_URL + " /requestedcompanyUser/" + unum; //backend의 데이터 불러오기\
       axios
      .get(url)
      .then((response) => {
        setDataList(response.data);
        
      })
    }else if(user.loginUserGrade == 1){
       url = SERVER_URL + "/requestedCompany";//backend의 데이터 불러오기\
       axios
      .get(url)
      .then((response) => {
        setDataList(response.data);
     
      })
    }
  }


let see = true;


  return (
    <nav className='HomeMenu'>
      <header className='HomeNavbar'>
  
        <nav className='navbar'>
          <div className='navbar-logo'>
            <Link to="/"><img src={DGNw2} className="App-logo1" alt="logo" />  </Link><img id="tooglelogoid" src={Hamburger} className="toogle-logo" alt="logo" /> 
          </div>

          <ul className='navbar-menu'>
            <li><Link to="/Conversation">소개페이지</Link></li>
            <li><Link to="/Company">기업참여신청</Link></li>
            <li><Link to="/board">게시판</Link></li>
            <li><Link to="/Service">고객센터</Link></li>

          
          </ul>

          <ul className='navbar-links'>

            <ul className='navbar-links'>

    
            {dataList.length != 0 ? dataList.map(dataL => {
         if(dataL.company_pass == 0) {
         
         }
            // if( dataL.company_pass == 1 && user.loginUserGrade == 2 ||  dataL.company_pass == 2 && user.loginUserGrade == 2  ){
            //   return ( <div key={dataL.userKey.userKey}>  
            //   <li><strong>🔔</strong></li> 
            //   </div>
            //   )  

            // }else if( dataL.company_pass == 0 && user.loginUserGrade == 1 && see == true ){
            //   see = false;
            //   return  ( <div key={dataL.userKey.userKey}>  
            //     <li><strong>🔔</strong></li> 
            //     </div>
                
            //     )}
              
            if( user.loginUserGrade == 2  ){
              if(dataL.company_pass == 1){
              return ( <div key={dataL.userKey.userKey}>  
              <li><strong>🔔</strong></li> 
              </div>
              ) 
              }else if(dataL.company_pass == 2 ){
                return ( <div key={dataL.userKey.userKey}>  
                  <li><strong>🔔</strong></li> 
                  </div>
                  ) 
              }
            }
            // console.log( see);

            if(user.loginUserGrade == 1 && dataL.company_pass == 0 && see == true){
              see = false;
              return (<div key={dataL.userKey.userKey}>  
                <li><strong>🔔</strong></li> 
                </div>)
            
       
            }
            
              }
              )  : null} 






              {user.loginUserGrade === 1 && user.loginPassword != null ? <li><Link to="/ApplyMasterList">신청기업리스트</Link></li> : user.loginUserGrade === 2 ?
                <li><Link to="/ApplyMasterList">신청내역보기</Link></li> : null}
              
              {user.loginUserGrade === 3 && user.loginPassword != null ? <li><Link to="/ModifyLogin">회원정보(일반)</Link></li> : user.loginUserGrade === 2 ?
              <li><Link to="/ModifyLogin">회원정보(기업)</Link></li> : null}

              {user.loginUserGrade === 3 && user.loginPassword == null ? <li><Link to="/UserInquiry">회원정보(일반)</Link></li> : null}

              {user.loginUserGrade == undefined || null ? <li><Link to="/Login">로그인</Link></li> : null}

              {!(Object.keys(user).length) ? <li><Link to="/TermsRegister">회원가입</Link></li> : <Logout />}
            </ul>

            <li><button className='refresh' id="refresh">↻</button></li>
          </ul>

           

        </nav>
       
      </header>
     


      <Switch>
      <Route path="/" component={Home} exact={true}/>
      <Route path={['/about', '/info']} component={About} />
      <Route path="/board" component={Board} />
      <Route path="/Conversation" component={Conversation} />
      <Route path="/Company" component={Company} />
      <Route path="/Login" component={Login} />
      <Route path="/Register" component={Register} />
      <Route path="/Service" component={Service} />
      <Route path="/Apply" component={Apply} />
      <Route path="/TermsRegister" component={TermsRegister} />
      <Route path="/TermsCompany" component={TermsCompany} />
      <Route path="/BoardFree" component={BoardFree} />
      <Route path="/BoardWrite/:no?" component={BoardWrite} />
      <Route path="/BoardFreeSee/:no" component={BoardFreeSee} />
      <Route path="/BoardReview" component={BoardReview} />
      <Route path="/BoardReviewSee/:no" component={BoardReviewSee} />
      <Route path="/BoardWriteReview/:no?" component={BoardWriteReview} />
      <Route path="/ApplyMasterList" component={ApplyMasterList} />
      <Route path="/Inquiry" component={Inquiry} />
      <Route path="/ApplyMaster/:no" component={ApplyMaster} />
      <Route path="/UserInquiry" component={UserInquiry} />
      <Route path="/PasswordChange" component={PasswordChange} />
      <Route path="/PhonenumberChange" component={PhonenumberChange} />
      <Route path="/ModifyLogin" component={ModifyLogin} />
        <Route path="/Information" component={Information} />
        <Route path="/Team" component={Team} />
        <Route path="/Surpport" component={Surpport} />
        <Route path="/Privercy" component={Privercy} />
        <Route path="/Marcketing" component={Marcketing} />
        <Route path="/Character" component={Character} />
        <Route path="/FindPassword" component={FindPassword} />
        <Route path="/profile" component={profile} />
        <Route
          // path를 따로 정의하지 않으면 모든 상황에 렌더링됨
          render={({ location }) => (
            <div className='page-null'>
              <img src={DGN2}  alt="logo" /> 
              <h2>이 페이지는 존재하지 않습니다.</h2>
              <p>{location.pathname}</p>

            </div>
          )}
        />
      </Switch>
      <Link to="/"><img src={Homes} className="Homes" alt="logo" /></Link>
      <footer className='foot'>
        <div className='foot-div1'>
          <Link to="/"><img src={DGNw2} className="App-logo2" alt="logo" />Digital Game Nomad</Link>
        </div>

        
        <div className='foot-div2'>
          <div className='foot-div2-1'>
            <li><Link to="/Information">info</Link></li>
            <li><Link to="/Surpport">Surpport</Link></li>
            <li><Link to="/Marcketing">User requirements</Link></li>
          </div>

          <div className='foot-div2-2'>
            <li><Link to="/Team">Team of Use</Link></li>
            <li><Link to="/Privercy">Privecy Policy</Link></li>
          </div>

        </div>

        <div className='foot-div3'>
          <div className='foot-div3-1'>
            <li><button className='foot-div3-1-button' onClick={onClicFacebook}><img src={facebook} className="icon-logo" alt="logo" /></button> </li>
            <li><button className='foot-div3-1-button' onClick={onClicTwitter}><img src={twitter} className="icon-logo" alt="logo" /></button> </li>

          </div>

          <div className='foot-div3-2'>
            <li>@Digital Game Nomad</li>
          </div>
        </div>


      </footer>
    </nav>
  );
};

export default App;
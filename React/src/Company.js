import booth1 from "./imgs/booth1.png"
import booth2 from "./imgs/booth2.png"
import "./Company.css"
import React, { useState, useEffect } from 'react';
import Fade from 'react-reveal/Fade';
import { Route, Link, Switch } from 'react-router-dom'; 
import TermsCompany from "./TermsCompany";
import { useSelector } from 'react-redux';
import axios from "axios"; 
import Flip from 'react-reveal/Flip';
import Bounce from 'react-reveal/Bounce';
import Slide from 'react-reveal/Slide';
import { SERVER_URL } from './Config';

const Company = () => {
    const [dataList, setDataList] = useState([]);
    const user = useSelector(state => state.login);
    useEffect(() => {
        getcompanydata();
        
    }, []);
   
    let unum = user.loginUserKey;
   
    function getcompanydata(){
         let url = SERVER_URL + "/requestedcompanyUser/"+unum; //backend의 데이터 불러오기
         axios
           .get(url)
           .then((response) => {

           setDataList(response.data);
           })
       }
    return (
        <div className="Company-all">

        <div className="Company-nav">
            <Flip top>
                <h1 >기업참여신청</h1>
                </Flip>
            </div>
        
        <nav className="booth1-nav">
            <Fade left>
            <img src={booth1} className="booth1-img" alt="img1" />
            </Fade>
        <div className="booth1-text">

                <div className="service-color-case">
                    <div className="service-tc11">         
                        <Bounce top>
                            <div className="service-color1"> Digital Game Nomad</div>
                        </Bounce> 
                        <Slide right> 
                            <div className="service-text1">는 온라인 &nbsp;웹&nbsp; 플랫폼으로</div>
                        </Slide>
                    </div>      
                    <div className="service-tct223">
                        <Slide left>
                            <div className="service-text2"> 사용자에게</div>
                        </Slide> 
                        <Bounce top>
                            <div className="service-color2"> 3D 맵</div>
                        </Bounce>
                        <Slide right>
                            <div className="service-text3">에서</div>
                        </Slide>
                    </div>
                    <div className="service-tct435">
                        <Slide left>
                            <div className="service-text4">직접&nbsp; 상호작용을&nbsp; 함으로써</div>
                        </Slide>
                        <Bounce top>
                            <div className="service-color3">현장감</div>
                        </Bounce>
                        <Slide right>
                            <div className="service-text5">과&nbsp; 사용자&nbsp; 이용경험을&nbsp; 동시에&nbsp; 제공합니다. </div>     
                        </Slide>
                    </div>
                </div> 
                
            </div>
        </nav>
        
            <div className="booth2-nav">
                <h1>부스배치도</h1>
            </div>

            <div className="booth2">
            <Fade bottom>
                <img src={booth2} className="booth2-img" alt="img2" />
                </Fade>
            </div>
            

               {/* //////////////////////
            ////기업 신청 제한/////
            ////////////////////// */}

{user.loginUserGrade == 2 ?

dataList.length != 0  ? 
//companyinfo 정보가 하나라도 있을때 
dataList.map(dataL => {
        if(dataL.company_pass == 0|| dataL.company_pass == 2 ){
          alert("이전 신청이 진행중입니다.")
        }else if( dataL.company_pass == 1 || dataL.company_pass == 3){
            alert("신청이 승인되었습니다.")
        }})

        //companyinfo 정보가 하나도 없을때 
     :  <ul className="button-nav">
       <Link className="button" to="/TermsCompany">참여신청 하기</Link>
       </ul> 
       
       : <ul className="button-nav">
       <Link className="button" to="/">기업 등급 회원만 신청 가능합니다.</Link>
       </ul> }  

{/* //////////////////////////////////////////////////// */}


            <Switch>
                <Route path="/TermsCompany" component={TermsCompany} />
            </Switch>
        </div>


    );
};

export default Company;
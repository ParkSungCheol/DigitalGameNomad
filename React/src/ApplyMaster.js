import React, { useState, useEffect } from 'react';
import "./ApplyMaster.css";
import { Route, Link, Switch,useParams } from 'react-router-dom';
import ApplyMasterList from './ApplyMasterList';
import axios from "axios"; 
import ReactPlayer from 'react-player'
import { useSelector } from 'react-redux';
import styled from "styled-components";
import Modal from "react-modal";

import { SERVER_URL } from './Config';

Modal.setAppElement("#root");

const ApplyMaster = ( ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [RejectFirm, setRejectFirm] = useState("");
    const [check, setCheck] = useState(false);
    let denytext = RejectFirm;
    console.log(denytext);
    console.log(typeof(denytext));
 
  function toggleModal() {
    setIsOpen(!isOpen);
  }



    const user = useSelector(state => state.login);

    const [dataList, setDataList] = useState([]);

    let { no } = useParams(); 
    let cnum = no;

    const [imagefile, setimagefile] = useState(null);
   
    useEffect(() => {
        getcompanydata();
        getcompanyimagedata()
    }, []);


 
   
    function getcompanydata(){
   
         let url = SERVER_URL + "/requestedCompany/"+cnum; //backend의 데이터 불러오기
         axios
           .get(url)
           .then((response) => {
           setDataList(response.data);
          
           })
       }

       function getcompanyimagedata(){
   
        let url = SERVER_URL + "/requestedCompanyimage/"+cnum; //backend의 데이터 불러오기
        axios
          .get(url)
          .then((response) => {
            setimagefile(response.data);
        
          })
      }


       const approve = () => {
  
     
            const api = axios.create({
              baseURL: SERVER_URL
            })
        
            api.post('/companyupdate/'+cnum, null, { params : {
               
         
                company_pass : 1
              
        
            }}).then(function (response){
              
                window.location.replace("/ApplyMasterList")
          
            }).catch(function(error){
                console.log(error)
                alert("승인기업이 6개 이하여야 합니다");
            });
        };
        
        const approvecheck = () => {
  
          
                const api = axios.create({
                  baseURL: SERVER_URL
                })
                api.post('/companyupdate/'+cnum, null, { params : {
                    company_pass : 3
                }}).then(function (response){
                    window.location.replace("/ApplyMasterList")
                }).catch(function(error){
                    console.log(error)
                });
            };

        const deny = () => {
  
                const api = axios.create({
                  baseURL: SERVER_URL
                })
            
                api.post('/companyupdate/'+cnum, null, { params : {
                   
                    company_pass : 2,
                    company_deny : denytext
            
                }}).then(function (response){
             
                    window.location.replace("/ApplyMasterList")
                }).catch(function(error){
                    console.log(error)
                 
                });
            };
    
            const deletecompany = () => {
  
                 
                    const api = axios.create({
                      baseURL: SERVER_URL
                    })
                
                    api.get('/comapnydelete/'+cnum, null, { params : {
                       
                
                    }}).then(function (response){
                
                        window.location.replace("/ApplyMasterList")
                        alert("삭제 되었습니다.")
                    }).catch(function(error){
                        console.log(error)
                     
                    });
                };
         
                const onChangeRejectFirm = (e) => {
                    setRejectFirm(e.target.value);
                    setCheck(false);
                  };
              
                  //모달 CSS  CSS 부탁드립니다~
                  const customStyles = {
                    content: {
                      top: '35%',
                      left: '50%',
                      bottom: 'auto',
                      width: '260px',
                      transform: 'translate(-40%, -10%)',
                      borderRadius: '8px'
                    },
                  };



    return(
        <div className="master">
            
            <div className="master-header">
                {user.loginUserGrade == 2 ? <h1 className="master-header-text">내 기업신청 조회</h1> : <h1 className="master-header-text">신청 기업 조회</h1>}
            </div>

         
            {dataList.map(dataL => {
               
          
                if(dataL.companykey == no){          
                   return (
                    <div className="master-nav">
        <ul key={dataL.companykey}>
         
            <li>기업 이름 : {dataL.company_name}</li><br/>
            <li>게임 이름 : {dataL.game_name}</li><br />  
            <li>전시 내용 : {dataL.company_text}</li><br /> 
            <li>게임 URL : <a target="_blank" href={dataL.game_url}>클릭시 이동</a></li><br /> 
            <li>신청 일자 : {dataL.company_date}</li> <br/>
         
            <li>승인 여부 : {dataL.company_pass === 0 ? "대기" : dataL.company_pass === 1 ? "승인": "거부"}</li>

       

                <br/>
            
                   
                  <img src={`data:image/jpeg;base64,${imagefile}`} alt="Can't Loading..." id="apply-img"
                   />
                    <br/>

                   <div className='wrapper'>
                    <ReactPlayer id="apply-player" className="apply-player"   url={dataL.youtube_url} playing controls width={"90%"}
                  height={"350px"} /> 
                  </div>
               

                            {dataL.company_pass === 2 ?

                                    //CSS 부탁드립니다~ 거부사유 조회부분 
                            <div className='refuse-reason'>거부사유 <br/>
                                <div className='refuse-text'>{dataL.company_deny} </div>
                            </div> 
                            : null }
              

                    </ul>
                    <div className="master-button-nav">
                    {user.loginUserGrade == 1 ?     
                    <button id="master-button1" className="master-button" onClick={approve}>
                        <Link to="/ApplyMasterList">승인</Link>
                    </button>
                    : null}

                    {user.loginUserGrade == 2 && dataL.company_pass == 1 ?     
                    <button className="master-button" onClick={approvecheck}>
                        <Link to="/ApplyMasterList">승인확인</Link>
                    </button>
                    : null}

                    {user.loginUserGrade == 1 ?   
                     <button id="master-button2"className="master-button" onClick={toggleModal}>
                        거부
                    </button>
                    : null}



                    {user.loginUserGrade == 1 ?   
                    <button id="master-button3" className="master-button" onClick={deletecompany}>
                        <Link to="/ApplyMasterList">삭제</Link>
                    </button>
                    : user.loginUserGrade == 2 && dataL.company_pass == 2 ? 
                    <button className="master-button" onClick={deletecompany}>
                        <Link to="/ApplyMasterList">확인(삭제)</Link>
                    </button>:
                    <button className="master-button" onClick={deletecompany}>
                        <Link to="/ApplyMasterList">삭제</Link>
                    </button>}

                    </div>
                    </div>




                    )
                  }
                  })}  
      

      {/* 거부 팝업창 부분   CSS 부탁드립니다~*/}
         <Modal  style={customStyles}
      isOpen={isOpen} onRequestClose={toggleModal}>
         <div >
            <div className='apply-refuse-text' >기업신청 거부사유</div>
             <input
                    className="apply-box-name2"
                    type="text"
                    value={RejectFirm}
                    onChange={onChangeRejectFirm}
                    placeholder="300자 이내로 입력해주세요"
             ></input>

           <br/><br/>

            <button id="master-button1"className="master-button" onClick={deny}>
            <Link to="/ApplyMasterList">확인</Link> </button>

            <button  id="master-button2"className="master-button"onClick={toggleModal}>취소</button>

        </div>

      
      </Modal>
          

        
            <Switch>
                <Route path="/ApplyMasterList" component={ApplyMasterList} />
            </Switch>
        </div>
    )
}

export default ApplyMaster;



    

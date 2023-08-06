import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, useLocation, withRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createStore } from 'redux';
import { Provider, useSelector, useDispatch, connect } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage/session';

import ScrollToTop from './ScrollToTop';



function reducer(currentState, action) {
  if (currentState === undefined) {
    return {
      login : {},
      board : ["re"],
      comment : ["re"],
      company : ["re"],
    }
  }

  const newState = { ...currentState };

  if (action.type === "login") {
    console.log(action.data);
    let login = {
      loginUserKey : action.data.userKey,
      loginUserId : action.data.user_id,
      loginUserName : action.data.user_name,
      loginUserPhone : action.data.user_phone,
      loginPassword : action.data.user_pw,
      loginUserGrade : action.data.user_level,
    }
    newState.login = login;
  }
  else if(action.type === "board") {
    let board = [];
    action.data.forEach(e => {
    
      if(e.imageKey){
        let board_1 = {
          postKey : e.postKey.postKey,
          postTitle : e.postKey.postTitle,
          postText : e.postKey.post_text,
          post_view : e.postKey.post_view,
          post_date : e.postKey.post_date,
          post_topic : e.postKey.post_topic,
          post_score : e.postKey.post_score,
          game_name : e.postKey.game_name,
          user : e.postKey.userKey,
          companyKey: e.companyKey,
          imageKey: e.imageKey,
          image_url: e.image_url,
          show : true,
        }
          board.push(board_1);
      }
      else{
        let board_1 = {
          postKey : e.postKey,
          postTitle : e.postTitle,
          postText : e.post_text,
          post_view : e.post_view,
          post_date : e.post_date,
          post_topic : e.post_topic,
          post_score : e.post_score,
          game_name : e.game_name,
          user : e.userKey,
          companyKey: null,
          imageKey: null,
          image_url: null,
          show : true,
        }
          board.push(board_1);
      }
    })
    
    newState.board = board;
  }
  else if(action.type === "comment") {
    let comment = [];
    action.data.forEach(e => {
      let comment_1 = {
        commentKey : e.commentKey,
        comment_date : e.comment_date,
        comment_text : e.comment_text,
        post : e.postKey,
        user : e.userKey,
      }
      comment.push(comment_1);
    })

    newState.comment = comment;
  }
  else if(action.type === "company") {
    let company = [];

    action.data.forEach(e => {
      let company_1 = {
        companyKey : e.companyKey,
        company_date : e.company_date,
        company_name : e.company_name,
        company_pass : e.company_pass,
        company_text : e.company_text,
        game_name : e.game_name,
        youtube_url : e.youtube_url,
        userKey : e.userKey,
      }
      company.push(company_1);
    })

    newState.company = company;
  }
  else if(action.type === "count") {
    let board = [];

    newState.board.forEach((e) => {if(e.postKey === action.data){
      e.post_view = e.post_view+1;
    }
    board.push(e);});

    newState.board = board;

  }
  else if (action.type === "logout") {
    newState.login = {};
  }
  else if (action.type === "board_out") {
    newState.board = ["re"];
  }
  else if (action.type === "comment_out") {
    newState.comment = ["re"];
  }
  else if (action.type === "company_out") {
    newState.company = ["re"];
  }

  return newState;
}

const persistConfig = {
  key: 'root',
  storage: storage
}
const persistedReducer = persistReducer(persistConfig, reducer);
const store = createStore(persistedReducer);
const persistor = persistStore(store);


ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <ScrollToTop>
          <App />
        </ScrollToTop>  
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

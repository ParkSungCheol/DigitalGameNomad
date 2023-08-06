import "./BoardReviewSee.css";
import { Route, Link, Switch } from "react-router-dom";
import BoardReview from "./BoardReview";
import board from "./Data.js";
import $ from "jquery";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Comments from "./Comment.js";
import font from './font.js';
import { SERVER_URL } from './Config';

const BoardSee = (props) => {
  let board_1 = board().board;
  let num = props.match.params.no;
  let board_2;
  const user = useSelector((state) => state.login);
  const [imagefile, setimagefile] = useState(null);
  const [postTitle, setPostTitle] = useState("로딩중입니다.");
  const [user_id, setUser_id] = useState(null);
  const [post_date, setPost_date] = useState(null);
  const [image_url, setImage_url] = useState(null);
  const [postText, setPostText] = useState(null);
  const [userKey, setUserKey] = useState(null);
  const [game_name, setGame_name] = useState(null);
  const [post_score, setPost_score] = useState(null);
  const [postKey, setPostKey] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (board_1[0] == "re") {
      return;
    }
    let board_2 = board_1.find((e) => e.postKey == num);
    if (board_2.image_url != null) {
      const URL = SERVER_URL + "/imageshow";
      const postData = {
        image_url: board_2.image_url,
      };
      axios.post(URL, postData).then((response) => {
      
        setimagefile(response.data);
      });
    }
    setImage_url(board_2.image_url);
    setPostText(board_2.postText);
    setPostTitle(board_2.postTitle);
    setPost_date(board_2.post_date);
    setUserKey(board_2.user.userKey);
    setUser_id(board_2.user.user_id);
    setGame_name(board_2.game_name);
    setPost_score(board_2.post_score);
    setPostKey(board_2.postKey);

  }, [board_1]);

  useEffect(() => {
    if (board_1[0] == "re") {
      return;
    }
    let board_2 = board_1.find((e) => e.postKey == num);
    const URL = SERVER_URL + "/boardCount";
    const postData = {
      postKey: board_2.postKey,
    };
    axios.post(URL, postData).then((response) => {
      dispatch({ type: "count", data: board_2.postKey });
    });
    if (board_2.image_url != null) {
      const URL = SERVER_URL + "/imageshow";
      const postData = {
        image_url: board_2.image_url,
      };
      axios.post(URL, postData).then((response) => {
   
        setimagefile(response.data);
      });
    }
    setImage_url(board_2.image_url);
    setPostText(board_2.postText);
    setPostTitle(board_2.postTitle);
    setPost_date(board_2.post_date);
    setUserKey(board_2.user.userKey);
    setUser_id(board_2.user.user_id);
    setGame_name(board_2.game_name);
    setPost_score(board_2.post_score);
    setPostKey(board_2.postKey);

  }, []);

  const deleteBoard = () => {
    const URL = SERVER_URL + "/deleteBoard";
    const postData = {
      postKey: postKey,
      image_url: image_url,
    };
    axios.post(URL, postData).then((response) => {
 
      dispatch({ type: "board_out", data: null });
      alert("완료되었습니다.");
      window.location.replace("/BoardReview");
    });
  };

  const star = () => {
    if (post_score == 0) return "☆☆☆☆☆";
    else if (post_score == 20) return "★☆☆☆☆";
    else if (post_score == 40) return "★★☆☆☆";
    else if (post_score == 60) return "★★★☆☆";
    else if (post_score == 80) return "★★★★☆";
    else if (post_score == 100) return "★★★★★";
    return "";
  };

  return (
    <div className="see-all">
      <h1 className="see-title">게시글 조회</h1>

      <div className="see-frame">
          <div className="main-user">&#91; 작성자	&#93; {font(user_id)}</div>
          <div className="main-date">{post_date}</div>
        </div>


      <div className="see-main">
      <div className="main-title1">{	"[" + " " + game_name + " " + "]" + " " + star()}</div>
        <div className="main-title2">{postTitle}</div>
        

        
        {(function () {
          if (image_url)
            return (
              <div className="main-picture">
                <img
                  src={`data:image/jpeg;base64,${imagefile}`}
                  alt="이미 삭제된 게시글입니다."
                />
              </div>
            );
        })()}
        <div className="main-text">{postText}</div>
      </div>


      <div className="b__commentbox">
        <div id="comment">
          <Comments no={num} />
        </div>
      </div>



      <div className="button-nav">
        {(function () {
          if (user.loginUserKey === userKey) {
            return (
              <>
                <Link to={"/BoardWriteReview/" + num}>
                  <button id="see-button1" className="see-button">수정</button>
                </Link>
             
                <Link to="/BoardReview">
                  <button id="see-button3" className="see-button" onClick={deleteBoard}>
                    삭제
                  </button>
                </Link>
              </>
            );
          }
          else if(user.loginUserGrade === 1) {
            return (
              <>
                <Link to="/BoardFree">
                  <button id="see-button3" className="see-button" onClick={deleteBoard}>
                    삭제
                  </button>
                </Link>
              </>
            )
          }
        })()}
          <Link to="/BoardReview">
          <button id="see-button2" className="see-button">목록</button>
        </Link>
      </div>

      <Switch>
        <Route path="/BoardReview" component={BoardReview} />
      </Switch>
    </div>
  );
};

export default BoardSee;

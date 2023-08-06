import React, { useEffect, useState } from "react";
import styles from "./BoardWriteReview.module.css";
import { Rating } from 'react-simple-star-rating';
import axios from "axios"; //Vue에서도 사용한다.
import { useDispatch, useSelector } from "react-redux";
import { Route, Link, Switch } from 'react-router-dom';
import BoardReview from './BoardReview';
import board from './Data.js';
import { SERVER_URL } from './Config';

function BoardWriteReview(props) {
  var today = new Date();
  var year = today.getFullYear();
  var month = ('0' + (today.getMonth() + 1)).slice(-2);
  var day = ('0' + today.getDate()).slice(-2);
  const week = ['일', '월', '화', '수', '목', '금', '토'];
  // let dayOfWeek = week[today.getDay()];
  let hours = ('0' + today.getHours()).slice(-2);;
  let minutes = ('0' + today.getMinutes()).slice(-2);;
  var dateString = year + '-' + month + '-' + day + '  '+ hours + ':' + minutes;


  const [TitleValue, setTitleValue] = useState("");
  const [ContentValue, setContentValue] = useState("");
  const [ImagetValue, setImageValue] = useState("");
  const [loadImg, setLoadImg] = useState("");
  const [searchValue, setSearchValue] = useState(null);
  const [rating, setRating] = useState(0); // initial rating value
  const [게임제목, setGamelist] = useState([]);
  const dispatch = useDispatch();

  let board_1 = board().board;
  let num = props.match.params.no;
  let board_2 = board_1.find((e) => e.postKey == num);
  let board_3 = board().company;

  useEffect(() => {
    if (board_3[0] != "re") {
     
      let gameList = board_3.filter((e) => e.company_pass == "1" || e.company_pass == "3").map((e) => e.game_name);
      setGamelist(gameList);
    }
  }, [board_3])

  useEffect(() => {
    setSearchValue(게임제목[0]);
  }, [게임제목]);

  useEffect(() => {
    if (board_2) {
      if (board_2.image_url) {
        const URL = SERVER_URL + " /imageshow";
        const postData = {
          image_url: board_2.image_url,
        }
        axios.post(URL, postData)
          .then((response) => {
        
            setImageValue(`data:image/jpeg;base64,${response.data}`);
            setTitleValue(board_2.postTitle);
            setContentValue(board_2.postText);
            setSearchValue(board_2.game_name);
            setRating(board_2.post_score);
          });
      }
      else {
        setTitleValue(board_2.postTitle);
        setContentValue(board_2.postText);
        setSearchValue(board_2.game_name);
        setRating(board_2.post_score);
      }
    }
  }, [])

  const onTitleChange = (e) => {
    setTitleValue(e.currentTarget.value);
  };

  const onContentChange = (e) => {
    setContentValue(e.currentTarget.value);
  };

  const onImageChange = (e) => {
    const localImg = e.target.files[0];
    setLoadImg(localImg);

    let fd = new FileReader();

    if (localImg) {
      fd.readAsDataURL(localImg);
   
    }

    fd.onloadend = () => {
      const previewImgUrl = fd.result;

      if (previewImgUrl) {
        setImageValue(previewImgUrl);
      }
    }
  };

  const deleteImgHandler = (event) => {
    event.preventDefault();
    setImageValue("");
    setLoadImg("");
  }

  let login = useSelector(state => state.login);
  const saveData = (event) => {

    event.preventDefault();

    if(TitleValue == "" || ContentValue == "") {
      alert("제목과 내용은 반드시 작성하셔야합니다.")
      return;
    }

    if(TitleValue.length > 20) {
      alert("제목은 20자를 넘을 수 없습니다.");
      return;
    }

    let original = true;
    if (ImagetValue == "") {
      original = false;
    }
    console.log(original);
    const userData = {
      post_num: num,
      post_title: TitleValue,
      post_text: ContentValue,
      post_date: dateString,
      post_topic: "후기",
      post_score: rating,
      game_name: searchValue,
      user_key: login.loginUserKey,
      original: original,
    }
    const file = new FormData();
    file.append("file", loadImg);
    file.append("userData", new Blob([JSON.stringify(userData)], { type: "application/json" }));
    

    const updateURL = SERVER_URL + "/createBoard";
    axios
      .post(updateURL, file,
        {

        }
      ).then((response) => {
   
        dispatch({ type: "board_out", data: null });
        alert("완료되었습니다.");
        window.location.replace("/BoardReview");
      })
      .catch(error => {
        alert("이미지파일은 1048576 byte 까지 업로드 가능합니다.");
      });

  };

  function selectBoxChange(e) {

    setSearchValue(e.target.value);
  }

  // Catch Rating value
  const handleRating = (rate) => {
    setRating(rate);
    // other logic
  }

  useEffect(() => {

  }, [rating])

  return (
    <div className={styles.Register}>

      <h2 className={styles.r__h2}>글 작성하기</h2>

      <form className={styles.r__form} onSubmit>

        <div className={styles.r__title}>
          <select className={styles.freeselect} onChange={selectBoxChange} value={searchValue}>
            {function () {
              const result = [];
              for (let i = 0; i < 게임제목.length; i++) {
                result.push(<option value={게임제목[i]}>{게임제목[i]}</option>);
              }
              return result;
            }()}
          </select>

          <div className={styles.starrating}>
            <Rating onClick={handleRating} ratingValue={rating} /* Available Props */ />
          </div>

          <label className={styles.label}>제목</label>
          <input
            className={styles.t__input}
            onChange={onTitleChange}
            value={TitleValue}
            type="text"
            name="title"
            placeholder="제목을 입력하세요."
            maxLength='20'
          />
        </div>
        <div className={styles.r__content}>
          <label className={styles.label}>내용</label>
          <input
            className={styles.r__textarea}
            onChange={onContentChange}
            value={ContentValue}
            name="content"
            placeholder="내용을 입력하세요."
          />
        </div>

        <div className={styles.r__image}>
          <label className={styles.label}>이미지</label>

          <div className={styles.previewImg}>
            <img src={ImagetValue} />
          </div>

          <form encType='multipart/form-data'>
            <label className={styles.b__select} htmlFor='file'>파일선택</label>
            <input type="file" className={styles.file} id="file" accept='image/*'
              onChange={onImageChange}
              onClick={(e) => {
                e.target.value = null;
              }} /> </form>

          <button className={styles.deleteImgBtn} onClick={deleteImgHandler}>삭제</button>
        </div>
        <Link to="/BoardReview">
          <button className={styles.r__submit} onClick={saveData}>
            확인
          </button>
        </Link>
      </form>
      <Switch>
        <Route path="/BoardReview" component={BoardReview} />
      </Switch>
    </div>
  );
}

export default BoardWriteReview;

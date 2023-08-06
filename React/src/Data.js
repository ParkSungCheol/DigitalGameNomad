import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { SERVER_URL } from './Config';

const Data = () => {

    let board = useSelector(state => state.board);
    let comment = useSelector(state => state.comment);
    let company = useSelector(state => state.company);
    //useDispatch => Redux 값 변경
    const dispatch = useDispatch();

    if(board[0] === "re" || comment[0] === "re" || company[0] === "re") {
        if(board[0] === "re") {

            let url = SERVER_URL + "/boardshow"; //backend의 데이터 불러오기

            axios
            .get(url)
            .then((response) => {
         
                dispatch( { type: "board", data: response.data } );
            });
        }

        if(comment[0] === "re") {
            
            let url = SERVER_URL + "/allcomments"; //backend의 데이터 불러오기
    
            axios
            .get(url)
            .then((response) => {
           
                dispatch( { type: "comment", data: response.data } );
            });
        }

        if(company[0] === "re") {
            
            let url = SERVER_URL + "/allcompany"; //backend의 데이터 불러오기
    
            axios
            .get(url)
            .then((response) => {

                dispatch( { type: "company", data: response.data } );
            });
        }
    }
    
    let object = {
        board : useSelector(state => state.board).sort((a, b) => b.postKey - a.postKey),
        comment : useSelector(state => state.comment).sort((a, b) => b.commentKey - a.commentKey),
        company : useSelector(state => state.company).sort((a, b) => b.companyKey - a.companyKey),
    }


    return object;

}


export default Data;
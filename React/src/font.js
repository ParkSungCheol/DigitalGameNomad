import React from 'react';
import './font.css';

function font (string, index = 0) {
    if(string == "" || string == null) {
        return;
    }
    let email = string.split("@");
    if(email[1] == "" || email[1] == null) {
        return string;
    }
    else if(email[1] == "naver.com") {
        if(index == 0) {
        return (
            <font id="naver">{email[0]}<span>N</span></font>
        )
        }
        else {
            return (
                `<font id="naver">${email[0]}<span>N</span></font>`
            )
        }
    }
    else if(email[1] == "gmail.com") {
        if(index == 0) {
        return (
            <font id="google">{email[0]}<span>G</span></font>
        )
        }
        else {
            return (
                `<font id="google">${email[0]}<span>G</span></font>`
            )
        }
    }
    else {
        if(index == 0) {
        return (
            <font id="kakao">{email[0]}<span>K</span></font>
        )
        }
        else {
            return (
                `<font id="kakao">${email[0]}<span>K</span></font>`
            )
        }
    }
}

export default font;
import "./index.css";
import React from "react";
import { render } from "react-dom";

render(
    <div onClick={()=>{
        chrome.management.getSelf(function (res) {
            let url='chrome-extension://' + res.id + '/popup.html';
            window.url=url;
            chrome.tabs.create({ url: url});

        });
    }} style={{width:'inherit'}}>hello world</div>,
    window.document.getElementById("app")
);
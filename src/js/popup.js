import "../css/popup.css";
import Greeting from "./popup/app.js";
import React from "react";
import { render } from "react-dom";
import {bookmark,indexDb,storage,history} from './service/chrome';

let tt=async ()=>{
    // storage.saveChanges("tags","key")
    // let b=await storage.getBytes();
    // console.log(b);
    let o=await history.search("https://www.youtube.com");
    console.log(o)
    o=await history.getVisits("https://www.youtube.com/watch?v=oJ-mvkA__Yc")
    console.log(o);
};
tt()
render(
  <Greeting/>,
  window.document.getElementById("app-container")
);

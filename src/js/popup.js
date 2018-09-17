import "../css/popup.css";
import Greeting from "./popup/app.js";
import React from "react";
import { render } from "react-dom";
import {bookmark,indexDb,storage,history} from './service/chrome';

render(
  <Greeting/>,
  window.document.getElementById("app-container")
);

import React from "react";
import icon from "../../img/icon-128.png"
import { hot } from "react-hot-loader";
import { Button } from 'antd';
import 'ant-design-pro/dist/ant-design-pro.css';
import 'antd/dist/antd.css'
class GreetingComponent extends React.Component {
  render () {
    return (
      <div>

          <div>
              <Button type="primary">Primary</Button>
              <Button>Default</Button>
              <Button type="dashed">Dashed</Button>
              <Button type="danger">Danger</Button>
          </div>
        <img src={icon} />
      </div>
    )
  }
};

export default hot(module)(GreetingComponent)

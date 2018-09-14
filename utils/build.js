var webpack = require("webpack"),
    config = require("../webpack.config");

delete config.chromeExtensionBoilerplate;
const MinifyPlugin = require("babel-minify-webpack-plugin");
config.plugins.push(new MinifyPlugin(null,{comments:false}))
//

webpack(
  config,
  function (err) { if (err) throw err; }
);

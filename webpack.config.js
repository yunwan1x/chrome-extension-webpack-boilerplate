var webpack = require("webpack"),
    path = require("path"),
    fileSystem = require("fs"),
    env = require("./utils/env"),
    CleanWebpackPlugin = require("clean-webpack-plugin"),
    CopyWebpackPlugin = require("copy-webpack-plugin"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    WriteFilePlugin = require("write-file-webpack-plugin");

// load the secrets
var alias = {
    js:path.resolve(__dirname ,"src/js")

};
const MinifyPlugin = require("babel-minify-webpack-plugin");
var secretsPath = path.join(__dirname, ("secrets." + env.NODE_ENV + ".js"));

var fileExtensions = ["jpg", "jpeg", "png", "gif", "eot", "otf", "svg", "ttf", "woff", "woff2"];

if (fileSystem.existsSync(secretsPath)) {
    alias["secrets"] = secretsPath;
}
let cssmodule = {
    importLoaders: 3,
    modules: true,
    localIdentName: '[name]_[local]_[hash:base64:5]'
};
var options = {
    entry: {
        popup: path.join(__dirname, "src", "js", "popup.js"),
        index: path.join(__dirname, "src", "js/index", "index.js"),


    },
    output: {
        path: path.join(__dirname, "build"),
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                test: /\.(css)$/,
                loader: "style-loader!css-loader",
            },
            {
                test: /\.(less)$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader', options: cssmodule },
                    'less-loader'
                ]

            },
            {
                test: new RegExp('\.(' + fileExtensions.join('|') + ')$'),
                loader: "file-loader?name=[name].[ext]",
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                loader: "html-loader",
                exclude: /node_modules/
            },
            {
                test: /\.(js|jsx)$/,
                loader: "babel-loader",
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        alias: alias,
        extensions: fileExtensions.map(extension => ("." + extension)).concat([".jsx", ".js", ".css"])
    },
    plugins: [
        // clean the build folder
        // expose and write the allowed env vars on the compiled bundle
        new CleanWebpackPlugin(["build"]),

        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV)
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            minChunks: function(module){
                return module.resource && /node_modules/.test(module.resource)
            }
        }),
        new CopyWebpackPlugin([{
            from: "src/manifest.json"
        },{
            from: "src/img/",
        },{
            from: "src/js/background.js",
        }]),

        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "popup.html"),
            filename: "popup.html",
            chunks: ["vendor","popup"]
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "index.html"),
            filename: "index.html",
            chunks: ["index","vendor"]
        }),
        // new MinifyPlugin(null,{comments:false}),
        new WriteFilePlugin(),
    ]
};

if (env.NODE_ENV === "development") {
    // options.devtool = "inline-source-map";
}

module.exports = options;

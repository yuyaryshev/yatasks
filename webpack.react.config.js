// Based on:
// Based on:
// https://github.com/gaearon/react-hot-loader
// https://github.com/gaearon/react-hot-loader/blob/master/examples/typescript/webpack.config.babel.js

const hot = true; // Enables hot reloading
const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const outputPath = path.resolve(__dirname, "public");
const NODE_ENV = "development";
const isDevelopment = process.env.NODE_ENV !== "production";

let BUILD_DATE = new Date();
BUILD_DATE.setTime(BUILD_DATE.getTime() + 3 * 60 * 60 * 1000);
BUILD_DATE = JSON.stringify(BUILD_DATE);
BUILD_DATE = BUILD_DATE.substr(1, 10) + " " + BUILD_DATE.substr(12, 8);

console.log("");
console.log("BUILD_DATE = " + BUILD_DATE);
console.log("outputPath = " + outputPath);
console.log("HOT = " + (hot ? "ON" : "OFF"));
console.log("");

let package_json;
let manifest_json;

let moduleAliases = {};
package_json = JSON.parse(fs.readFileSync(path.resolve(__dirname, "package.json"), { encoding: "utf-8" }));
let allDeps = { ...package_json.dependencies, ...package_json.devDependencies };
try {
    manifest_json = JSON.parse(fs.readFileSync(path.resolve(__dirname, "dist/manifest.json"), { encoding: "utf-8" }));
} catch (e) {}
let tsconf = {};
try {
    tsconf = eval("(()=>(" + fs.readFileSync("tsconfig.json", "utf-8") + "))()");
    for (let k in tsconf.compilerOptions.paths) {
        let v = tsconf.compilerOptions.paths[k];
        moduleAliases[k] = path.resolve("./" + v[0]);
    }
} catch (e) {}

let excludedModules = ["fs", "sql-prettier", "prettier", "express", "socket.io"];

const webpack4LegacyConfig = (v) => v;

module.exports = Object.assign(
    {},
    {
        devServer: {
            contentBase: "./dist",
            hot,
        },
        node: webpack4LegacyConfig({
            fs: "empty",
            //        console: 'empty',
            net: "empty",
            tls: "empty",
        }),
        mode: "development",
        entry: ["./src/client/index.tsx"],
        devtool: "inline-source-map", // slow
        //        devtool: "eval-cheap-module-source-map",  // fast rebuild
        //        devtool: "none",  // fastest rebuild
        //        devtool: "eval",  // faster rebuild
        resolve: {
            //        root:               path.join(__dirname, 'js'),
            //        modulesDirectories: ['node_modules'],
            extensions: [".ts", ".tsx", ".js", ".jsx"],
            alias: {
                //            'react-dom': '@hot-loader/react-dom',
                ...moduleAliases,
            },
        },
        output: {
            path: outputPath,
            filename: "bundle.js",
        },
        module: {
            rules: [
                {
                    test: (modulePath0) => {
                        let modulePath = modulePath0.split(path.sep);
                        for (let excludedModule of excludedModules)
                            if (modulePath.includes(excludedModule)) return true;
                        return false;
                    },
                    use: "null-loader",
                },
                // {
                // test: /\.scss$/,
                // use: [
                //     "style-loader", // creates style nodes from JS strings
                //     "css-loader", // translates CSS into CommonJS
                //     "sass-loader" // compiles Sass to CSS, using Node Sass by default
                // ]
                // },
                {
                    test: /\.(j|t)sx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true,
                            babelrc: false,
                            presets: [
                                // [
                                //     "@babel/preset-env",
                                //     { targets: { browsers: "last 2 versions" } } // or whatever your project requires
                                // ],
                                "@babel/preset-typescript",
                                "@babel/preset-react",
                            ],
                            plugins: [
                                // plugin-proposal-decorators is only needed if you're using experimental decorators in TypeScript
                                ["@babel/plugin-proposal-decorators", { legacy: true }],
                                ["@babel/plugin-proposal-class-properties", { loose: true }],
                                "@babel/plugin-proposal-optional-chaining",
                                //                            "react-hot-loader/babel"
                                hot && isDevelopment && require.resolve("react-refresh/babel"),
                            ].filter((b) => b),
                        },
                    },
                },
            ],
        },
        optimization: { moduleIds: "named" },
        plugins: [
            new webpack.DefinePlugin({
                BROWSER: "true",
                "process.env.BROWSER": "true",
                "process.env.hot": JSON.stringify(hot),
                NODE_ENV: JSON.stringify(NODE_ENV),
                BUILD_DATE: JSON.stringify(BUILD_DATE),
            }),
            new CleanWebpackPlugin(),
            // new webpack.NamedModulesPlugin(),

            new HtmlWebpackPlugin({
                title: manifest_json ? manifest_json.name : package_json.name,
                // inject: false,
                template: "./src/index.html",
            }),
            hot && isDevelopment && new webpack.HotModuleReplacementPlugin(),
            hot && isDevelopment && new ReactRefreshWebpackPlugin(),
        ].filter((b) => b),
        //	watchOptions : {
        //		aggregateTimeout : 300
        //	},
    }
);

require("./inc_version.js");

// pnpm i express-node-sspi node-sspi
// node server_with_sspi.js

"use strict";

let express = require("express");
let app = express();
let server = require("http").createServer(app);
let nodeSSPI = require("express-node-sspi");

app.use(
    nodeSSPI({
        retrieveGroups: true,
    })
);

app.get("/", function (req, res, next) {
    // Инфа про пользователя req.connection.user;
    // Инфа про пользователя req.connection.userSid;
    // Инфа про пользователя req.connection.userGroups;

    var out =
        "Hello " +
        req.connection.user +
        "! Your sid is " +
        req.connection.userSid +
        " and you belong to following groups:<br/><ul>";
    if (req.connection.userGroups) {
        for (var i in req.connection.userGroups) {
            out += "<li>" + req.connection.userGroups[i] + "</li><br/>\n";
        }
    }
    out += "</ul>";
    res.send(out);
});
// Start server
var port = process.env.PORT || 3000;
server.listen(port, function () {
    console.log("Express server listening on port %d in %s mode", port, app.get("env"));
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeRequest = void 0;
var querystring = require("querystring");
var https = require("https");
function MakeRequest(req, cb) {
    // Build the post string from an object
    var post_data = querystring.stringify(req.data);
    // An object of options to indicate where to post to
    var post_options = {
        host: req.host,
        path: req.url,
        port: 443,
        method: req.method || "post",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": Buffer.byteLength(post_data),
        },
    };
    // Set up the request
    var post_req = https.request(post_options, function (res) {
        res.setEncoding("utf8");
        res.on("data", function (chunk) {
            cb(null, JSON.parse(chunk));
        });
    });
    post_req.on("error", (error) => {
        cb(error);
    });
    // post the data
    post_req.write(post_data);
    post_req.end();
}
exports.MakeRequest = MakeRequest;

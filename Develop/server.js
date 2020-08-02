// Dependencies
var http = require("http");
var fs = require("fs");
var express = require("express");

// Set our port to 8080
var app = express();
var PORT = 8080;
app.use(express.static("public"))

// Create our server
var server = http.createServer(handleRequest);

// Create a function for handling the requests and responses coming into our server
function handleRequest(req, res) {

    // Capture the url the request is made to
    var path = req.url;

    // When we visit different urls, call the function with different arguments
    switch (path) {

        case "/public/index":
        case "/public/notes":
            return renderHTML(path + ".html", res);

        default:
            return renderHTML("/public/index.html", res);
    }
}

// function to take a filepath and respond with html
function renderHTML(filePath, res) {
    return fs.readFile(__dirname + filePath, function (err, data) {
        if (err) throw err;
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
}

// Starts our server
server.listen(PORT, function () {
    console.log("Server is listening on PORT: " + PORT);
});

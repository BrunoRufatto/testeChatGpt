/*
Copyright (c) 2017, ZOHO CORPORATION
License: MIT
*/
var fs = require("fs");
var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var errorHandler = require("errorhandler");
var morgan = require("morgan");
var serveIndex = require("serve-index");
var https = require("http");
var chalk = require("chalk");
var cors = require("cors");
var routes = require("../app/js/routes");

process.env.PWD = process.env.PWD || process.cwd();

var expressApp = express();
var port = process.env.PORT || 5003;

var corsOptions = {
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

expressApp.set("port", port);
expressApp.use(morgan("dev"), function (req, res, next) {
	console.log(req.headers);
	next();
});
expressApp.use(bodyParser.json());
expressApp.use(
	bodyParser.urlencoded({
		extended: false,
	}),
);
expressApp.use(errorHandler());

expressApp.use("/whatsapphub/sandbox", function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	next();
});

expressApp.use(routes);

expressApp.get(
	"/whatsapphub/sandbox/plugin-manifest.json",
	function (req, res) {
		res.sendfile("plugin-manifest.json");
	},
);

expressApp.use("/whatsapphub/sandbox/app/", express.static("app"));
expressApp.use("/whatsapphub/sandbox/api", express.static("api"));
//expressApp.use('/whatsapphub/sandbox/app/', serveIndex('app'));

expressApp.get("/whatsapphub/sandbox", cors(corsOptions), function (req, res) {
	res.redirect("/whatsapphub/sandbox/app");
});

var options = {
	key: fs.readFileSync("./key.pem"),
	cert: fs.readFileSync("./cert.pem"),
};

https
	.createServer(options, expressApp)
	.listen(port, function () {
		console.log(
			chalk.green("Zet running at ht" + "tps://127.0.0.1:" + port),
		);
		console.log(
			chalk.bold.cyan(
				"Note: Please enable the host (https://127.0.0.1:" +
					port +
					") in a new tab and authorize the connection by clicking Advanced->Proceed to 127.0.0.1 (unsafe).",
			),
		);
	})
	.on("error", function (err) {
		if (err.code === "EADDRINUSE") {
			console.log(chalk.bold.red(port + " port is already in use"));
		}
	});

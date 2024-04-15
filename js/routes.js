const express = require("express");
const routes = new express.Router();

const s3Controller = require("./zapphub");
//console.log(s3Controller);
routes.post("/whatsapphub/sandbox/api/file", s3Controller.pegafile);
routes.post("/whatsapphub/sandbox/api/sendmessage", s3Controller.sendMessage);
routes.post("/whatsapphub/sandbox/api/getagent", s3Controller.getAgent);
routes.post("/whatsapphub/sandbox/api/deletefile", s3Controller.deleteFile);
routes.post("/whatsapphub/sandbox/api/geturl", s3Controller.getUrl);
routes.get("/whatsapphub/sandbox/api/sprintsend", s3Controller.sprintSend);
//routes.post("/whatsapphub/api/file", s3Controller.pegafile);
//routes.post("/whatsapphub/api/sendmessage", s3Controller.sendMessage);
//routes.post("/whatsapphub/api/getagent", s3Controller.getAgent);
//routes.post("/whatsapphub/api/deletefile", s3Controller.deleteFile);


//routes.post("/gotoconnect/api", s3Controller.pegafile);
//routes.post("/api/file", s3Controller.pegafile);
//routes.post("/file", s3Controller.pegafile);


module.exports = routes;
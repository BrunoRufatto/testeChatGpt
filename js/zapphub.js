module.exports = {
    async pegafile(req, res) {
        console.log(req);
        const request = require('request');
        const http = require("https");
        const fs = require("fs");
        var url = req.query.url;
        var token = req.query.Token;
        var extension = req.query.extension;
        var file_id = req.query.file_id;
        var blobFile = "";

        const options = {
            method: 'GET',
            url: url,
            headers: { 'Content-Type': 'application/json', 'Token': token },
            json: true
        };
        
        var stream = request(options, function(error, response, body) {
            if (error) throw new Error(error);
            //console.log(body);
            //res.send(body);//
        }).pipe(fs.createWriteStream('app/temp/'+file_id+'.'+extension));
        stream.on('finish', function () { 
            res.send();
        });
        //res.send();
        

    },
    async getUrl(req, res){
        var origin = req;
        //console.log(origin);
        console.log(origin.headers);
        res.send();
    },
    async deleteFile(req, res){
        const http = require("https");
        const fs = require("fs");
        var extension = req.query.extension;
        var file_id = req.query.file_id;
        const path = "app/temp/"+file_id+"." + extension;

        try {
        fs.unlinkSync(path);
        console.log("File removed:", path);
        } catch (err) {
        console.error(err);
        }
        res.send();
    },
    async sendMessage(req, res) {
        const request = require('request');
        console.log("----------");
        var token = req.body.token;
        var numCel = req.body.phone;
        var walimsg = req.body.message;
        console.log(walimsg);
        var reference = req.body.reference;
        var device = req.body.device;
        var agent = req.body.agent;
        var bodymessage = '{"phone":"' + numCel + '","message":"' + walimsg + '","reference":"' + reference + '","device":"' + device + '","agent":"'+agent+'"}';
        console.log(bodymessage);

        const options = {
            method: 'POST',
            url: 'https://api.zapphub.com/v1/messages',
            headers: { 'Content-Type': 'application/json', Token: token },
            body: JSON.parse(bodymessage),
            json: true
        };

        request(options, function(error, response, body) {
            if (error) throw new Error(error);

            res.send(body);
        });
    },
    async getAgent(req, res){
        console.log(req.body);
        var token = req.body.token;
        var device_id = req.body.device_id;
        return "[{'email':'gustavo.couto@otentecnologia.com.br'}]";
    },
    async sprintSend(req, res){
        const request = require('request');
        let horas = req.query.horas;
        let nome = req.query.nome;
        let phone = req.query.phone;
        let token = req.query.token;
        let device = req.query.device;
        let wmsg = "Uma tarefa com o nome: "+nome+" foi criada! Seu tempo de duração é de: " + horas;
        var bodymessage = '{"phone":"' + phone + '","message":"' + wmsg + '","device":"' + device + '"}';
        console.log(bodymessage);

        const options = {
            method: 'POST',
            url: 'https://api.zapphub.com/v1/messages',
            headers: { 'Content-Type': 'application/json', Token: token },
            body: JSON.parse(bodymessage),
            json: true
        };

        request(options, function(error, response, body) {
            if (error) throw new Error(error);
            console.log(body);
            res.send(body);
        });
    }
}
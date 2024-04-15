var Const = {
    apinames: {
        apiphonelead: "whatsapphubforzohocrm__leads",
        apiphoneaccount: "whatsapphubforzohocrm__accounts",
        apiphonedeal: "whatsapphubforzohocrm__deals",
        apiphonecontact: "whatsapphubforzohocrm__contacts",
        apicomportamento: "whatsapphubforzohocrm__comportamento",
        apiaplicativo: "whatsapphubforzohocrm__aplicativo",
        apiconfiguracao: "whatsapphubforzohocrm__configuracao"

    },
    chatId: "chat_",
    apifieldname: "",
    apimodulename: ""
}

//parent.postMessage('onChatShow', *)
const eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
const eventer = window[eventMethod];
const messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message';


// Listen to message from child window
eventer(messageEvent, e => {
    const key = e.message ? 'message' : 'data';
    const data = e[key];
    if (data === 'onChatShow') {
        this.onLoadHandler();
    }
}, false);


function initializeWidget() {

    /*
     * Subscribe to the EmbeddedApp onPageLoad event before initializing the widget
     */
    ZOHO.embeddedApp.on("PageLoad", async function(data) {
        //alert("huu")
        await checkFieldName(data).then(async function() {
            //alert("entrou")
            //console.log(Const.chatId);

            //chatId = 
            //debugger;
            // Definição da página de aplicativos
            await ZOHO.CRM.API.getOrgVariable(Const.apinames.apiaplicativo).then(async function(data) {
                var respApp = '';
                var resposta = data.Success.Content;
                if (resposta != '' && resposta != null) {
                    resposta = JSON.parse(resposta);
                    respApp = resposta.app.toLowerCase();
                }

                var continua = false;
                if (respApp == "zapbox" || respApp == "winzap") {

                    continua = true;

                } else {
                    $("#cont").slideUp();
                    $('#ErroMsg').find('.erroText').text("Não há nenhum Broker de WhatsApp selecionado, vá até configurações e defina o seu.");
                    $('#ErroMsg').slideDown();
                }

                if (continua) {
                    ZOHO.CRM.API.getOrgVariable(Const.apinames.apiconfiguracao).then(async function(data) {
                        //alert(respApp)
                        var structure = data.Success.Content;
                        if (structure != "") {
                            var tokenZap = JSON.parse(structure);
                            if (respApp == "zapbox") {
                                if (tokenZap.token !== null && tokenZap.token !== '') { //&& tokenZap.status == "true") {
                                    $("#chat").html('<iframe id="chatzapbox" class="zapboxframe" scrolling="no" allow="geolocation; microphone; camera; midi; encrypted-media" src="https://talk.umbler.com/v1/chat/' + tokenZap.token.trim() + '/" onload=\"iframeIsLoaded(Const.chatId)\""></iframe>');
                                    //$("#chat").html('<iframe id="chatzapbox" class="zapboxframe" scrolling="no" allow="geolocation; microphone; camera; midi; encrypted-media" src="https://talk.umbler.com/v1/chat/' + tokenZap.token.trim() + '/" \""></iframe>');
                                    //onLoadHandler(Const.chatId);
                                } else {
                                    $("#cont").slideUp();
                                    $('#ErroMsg').find('.erroText').text("Não há token configurado, complete a configuração e tente novamente.");
                                    $('#ErroMsg').slideDown();

                                    //$("#chat").html('<iframe id="chatzapbox" class="zapboxframe" scrolling="no" allow="geolocation; microphone; camera; midi; encrypted-media" src='+window.location.href.replace("Chat","Settings")+'"></iframe>');
                                }
                            } else if (respApp == "zapphub") {
                                $("#chat").html('<iframe id="chatzapbox" class="zapboxframe" scrolling="no" allow="geolocation; microphone; camera; midi; encrypted-media" src="https://app.zapphub.com/chat/6036a3b9fa215201084e2a0f" onload=\"iframeIsLoaded(Const.chatId)\""></iframe>');
                                //$("#chat").html('<h1>Este recurso não está disponível para o zapphub.</h1><br><h2><a href="http://zapbox.app/?utm_adm=otentecnologia" target="_blank" style="text-decoration: underline;">Clique Aqui</a> e conheça o ZapBox que têm este recurso disponível.</h2>');
                            } else {
                                $("#cont").slideUp();
                                $('#ErroMsg').find('.erroText').text("Não há token configurado, complete a configuração e tente novamente.");
                                $('#ErroMsg').slideDown();
                            }
                        } else {
                            $("#cont").slideUp();
                            $('#ErroMsg').find('.erroText').text("Não há configuração, complete a mesma e tente novamente.");
                            $('#ErroMsg').slideDown();
                        }

                    });
                }

            });
        });
    });
    /*
     * initialize the widget.
     */

    ZOHO.embeddedApp.init();

}

async function checkFieldName(data) {

    var module = data.Entity;
    var idreg = data.EntityId[0];
    var actualapiname = "";
    var contentapiname;
    if (module.toLowerCase().trim() == "leads") {
        actualapiname = Const.apinames.apiphonelead;
    } else if (module.toLowerCase().trim() == "contacts") {
        actualapiname = Const.apinames.apiphonecontact;
    } else if (module.toLowerCase().trim() == "accounts") {
        actualapiname = Const.apinames.apiphoneaccount;
    } else {
        actualapiname = Const.apinames.apiphonedeal;
    }
    //alert("chegou")
    await ZOHO.CRM.API.getOrgVariable(actualapiname).then(async function(data) {
        //alert(data.Success.Content)
        contentapiname = JSON.parse(data.Success.Content);
        Const.apifieldname = contentapiname.name;
        Const.apimodulename = contentapiname.module;

        if (Const.apimodulename.toLowerCase().trim() == "deals") {
            await ZOHO.CRM.API.getRecord({ Entity: module, RecordID: idreg }).then(async function(data) {
                var result = JSON.parse(data.Success.Content);
                var nameField = "";

                if (module.toLowerCase().trim() == "contacts") {
                    nameField = "Contact_Name";
                } else {
                    nameField = "Account_Name";
                }
                await ZOHO.CRM.API.getRecord({ Entity: Const.apimodulename, RecordID: result.data[0][nameField].id }).then(async function(data) {
                    Const.chatId = Const.chatId + data.data[0][Const.apifieldname];
                    console.log(data)
                });
            });
        } else {

            await ZOHO.CRM.API.getRecord({ Entity: Const.apimodulename, RecordID: idreg }).then(async function(data) {
                console.log(data)
                Const.chatId = Const.chatId + data.data[0][Const.apifieldname];
            });
        }

    });
}

function iframeIsLoaded(id) {
    document.getElementById("chatzapbox").contentWindow.postMessage({ event: "onChatShow", chat: id }, "*");
}

function onLoadHandler() {

    alert(document.getElementsByClassName('goog-te-combo')[0].options.length);
    /*$(".lds-ring").slideUp();
    $("#tbchat").show();
    $("#chatzapbox").slideDown();
    */

}

/*$("#chatzapbox").ready(function (){
    // do something once the iframe is loaded
    $("#chat_5519971327006")[0].click();
    $(".ladoA").hide();
    $(".ladoB").css("width","99%");
});*/

function reloadWebtab() {
    location.reload();
}

function closeSpanMsg(idDiv) {
    $("#" + idDiv).hide();
}

//ButtonPosition: "DetailView"
//Entity: "Leads"
//EntityId: ["4482434000000062053"]
//$("#chat_5519971327006")[0].click();
//$(".ladoA").hide();
//$(".ladoB").css("width","99%");



function display(vid) {

    var video = document.getElementById("video");
    video.src = window.URL.createObjectURL(vid);

}

$(document).ready(function() {
    //debugger;
    initializeWidget();
    //console.log("aqui");


})



/*
eventer(messageEvent, e => {
    const key = e.message ? 'message' : 'data';
    const data = e[key];
    
    if (data.includes('chat_') {
        this.onChatShow(Const.chatId);
    }
}, false);


function onChatShow(id) {
    //execute code after DOM is ready

    var actualChat = $("#" + id);
    parent.postMessage('onChatShow', *)
    $(".lds-ring").slideUp();
    $("#tbchat").show();

    $("#btManipulaChat").hide();
    $(".ladoA").hide();
    $(".ladoB").css("width", "99%");
    $("#chatzapbox").slideDown();
    //}
    //checkChat();
}
*/
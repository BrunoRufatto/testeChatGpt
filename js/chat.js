Const = {

    languages: ["en_US", "pt_BR", "es_ES"],
    deflang: "en_US",
    desclanguage: {}

}

function initializeWidget() {

    /*
     * Subscribe to the EmbeddedApp onPageLoad event before initializing the widget
     */
    ZOHO.embeddedApp.on("PageLoad", async function(data) {

        await ZOHO.CRM.CONFIG.getCurrentUser().then(function(data) {

            return ZOHO.CRM.API.getUser({ ID: data.users[0].id })
                .then(async function(data) {

                    if (Const.languages.includes(data.users[0].language)) {
                        Const.deflang = data.users[0].language;
                    }
                    return Utils.RenderTemplate(Const.deflang);
                    //$("#allPage").show();

                })
        })

        // Definição da página de aplicativos
        ZOHO.CRM.API.getOrgVariable("whatsapphubforzohocrm__aplicativo").then(async function(data) {
            var respApp = '';
            var resposta = data.Success.Content;
            if (resposta != '' && resposta != null) {
                if (resposta.toLowerCase() != "zapbox") {
                    resposta = JSON.parse(resposta);
                    respApp = resposta.app.toLowerCase();
                } else {
                    respApp = resposta.toLowerCase();
                }
            }
            var continua = false;
            if (respApp == "zapbox" || respApp == "zapphub") {

                continua = true;

            } else {
                Utils.errorMsg("ErroMsg", "msg-error-sel-app");
                /*$('#ErroMsg').find('.erroText').text("Não há nenhum Broker de WhatsApp selecionado, vá até configurações e defina o seu.");
                $('#ErroMsg').slideDown();*/
            }

            //debugger;
            if (continua) {
                ZOHO.CRM.API.getOrgVariable("whatsapphubforzohocrm__configuracao").then(async function(data) {

                    var structure = data.Success.Content;
                    if (structure != "") {
                        var tokenZap = JSON.parse(structure);
                        if (respApp == "zapbox") {
                            if (tokenZap.token !== null && tokenZap.token !== '') { //&& tokenZap.status == "true") {
                                //https://app.zapphub.com/chat/6036a3b9fa215201084e2a0f/5511994695169@c.us/
                                tokenZap = JSON.parse(tokenZap);
                                $("#chat").html('<iframe id="chatzapbox" class="zapboxframe" scrolling="no" allow="geolocation; microphone *; camera *; midi; encrypted-media" src="https://talk.umbler.com/v1/chat/' + tokenZap.token.trim() + '/" onload="onLoadHandler();"></iframe>');
                                //$("#chat").html('<iframe id="chatzapbox" class="zapboxframe" scrolling="no" allow="geolocation; microphone *; camera *; midi; encrypted-media" src="https://app.zapphub.com/chat/6036a3b9fa215201084e2a0f" onload="onLoadHandler();"></iframe>');
                            } else {

                                $('#ErroMsg').find('.erroText').text("Não há token configurado, complete a configuração e tente novamente.");
                                $('#ErroMsg').slideDown();

                                //$("#chat").html('<iframe id="chatzapbox" class="zapboxframe" scrolling="no" allow="geolocation; microphone; camera; midi; encrypted-media" src='+window.location.href.replace("Chat","Settings")+'"></iframe>');
                            }
                        } else if (respApp == "zapphub") {

                            if (tokenZap.token !== null && tokenZap.token !== '') { //&& tokenZap.status == "true") {
                               
                                if(tokenZap.device_id != undefined && tokenZap.device_id != "" && tokenZap.device_id != null){
                                    $("#chat").html('<iframe scrolling="no" allow="geolocation; microphone *; camera *; midi; encrypted-media" src="https://app.zapphub.com/chat/' + tokenZap.device_id + '" width="100%" height="900"></iframe>');
                                } else{
                                    $("#chat").html('<iframe scrolling="no" allow="geolocation; microphone *; camera *; midi; encrypted-media" src="https://app.zapphub.com/chat/" width="100%" height="900"></iframe>');
                                }
                            } else {
                                $('#ErroMsg').find('.erroText').text("Não há token configurado, complete a configuração e tente novamente.");
                                $('#ErroMsg').slideDown();
                            }
                        }
                    } else {
                        $("#cont").slideUp();
                        Utils.errorMsg("ErroMsg", "msg-error-token-app");
                        /*$('#ErroMsg').find('.erroText').text("Não há configuração, complete a mesma e tente novamente.");
                        $('#ErroMsg').slideDown();
                        */
                    }
                });
            }
        });


    });

    /*
     * initialize the widget.
     */

    ZOHO.embeddedApp.init();
}

function onLoadHandler() {
    //debugger;
}

function reloadWebtab() {
    location.reload();
}

function closeSpanMsg(idDiv) {
    $("#" + idDiv).hide();
}

//$("#chat_5519971327006")[0].click();
//$(".ladoA").hide();
//$(".ladoB").css("width","99%");

Utils = {};

//Utils.successMsg("SuccessMsg","msg-success-setup");
Utils.successMsg = function(id, message, reload = false, close = false, refreshback = null) {
    $('#' + id + " .sucesText").text(Const.desclanguage[message]);
    $('#' + id).slideDown(function() {

        if (reload || close) {
            $('#' + id).delay(3000).slideUp(function() {
                if (reload) {
                    reloadWebtab();
                }
                if (close) {
                    closePopup();
                }
                if (refreshback != null) {
                    refreshback();
                }
            });
        }
    });
}

//Utils.errorMsg("ErroMsg","msg-error-setup");
Utils.errorMsg = function(id, message, reload = false, close = false, refreshback = null) {
    $('#' + id + " .erroText").text(Const.desclanguage[message]);
    $('#' + id).slideDown(function() {
        if (reload || close) {
            $('#' + id).delay(3000).slideUp(function() {
                $("#newLoad").hide();
                if (reload) {
                    reloadWebtab();
                }
                if (close) {
                    closePopup();
                }
                if (refreshback != null) {
                    refreshback();
                }
            });
        }
    });

}


Utils.RenderTemplate = async function(lang) {
    //console.log(data);
    $.getJSON("../translations/" + lang + ".json", function(data) {
        Const.desclanguage = data;
        $("[key='translate']").each(function() {
            var template = $(this).html();
            var compiledTemplate = Handlebars.compile(template);
            var widgetsDiv = $(this);
            widgetsDiv.html(compiledTemplate(data));
        });
        //$("#allPage").show();

        /*if (callBack) {
            callBack();
        }*/

    });
}
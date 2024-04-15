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

function onLoadHandler() {

    alert(document.getElementsByClassName('goog-te-combo')[0].options.length);
}

function initializeWidget() {

    /*
     * Subscribe to the EmbeddedApp onPageLoad event before initializing the widget
     */
    ZOHO.embeddedApp.on("PageLoad", async function(data) {
        // Definição da página de aplicativos
        ZOHO.CRM.API.getOrgVariable("whatsapphubforzohocrm__aplicativo").then(async function(data) {
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
                $('#ErroMsg').find('.erroText').text("Não há nenhum Broker de WhatsApp selecionado, vá até configurações e defina o seu.");
                $('#ErroMsg').slideDown();
            }

            //debugger;
            if (continua) {
                ZOHO.CRM.API.getOrgVariable("whatsapphubforzohocrm__configuracao").then(async function(data) {

                    var structure = data.Success.Content;
                    if (structure != "") {
                        var tokenZap = JSON.parse(structure);
                        if (respApp == "zapbox") {
                            if (tokenZap.token !== null && tokenZap.token !== '') { //&& tokenZap.status == "true") {
                                $("#chat").html('<iframe id="chatzapbox" class="zapboxframe" scrolling="no" allow="geolocation; microphone; camera; midi; encrypted-media" src="https://talk.umbler.com/v1/chat/' + tokenZap.token.trim() + '/" onload="onLoadHandler();"></iframe>');

                            } else {

                                $('#ErroMsg').find('.erroText').text("Não há token configurado, complete a configuração e tente novamente.");
                                $('#ErroMsg').slideDown();

                                //$("#chat").html('<iframe id="chatzapbox" class="zapboxframe" scrolling="no" allow="geolocation; microphone; camera; midi; encrypted-media" src='+window.location.href.replace("Chat","Settings")+'"></iframe>');
                            }
                        } else if (respApp == "winzap") {
                            $("#chat").html('<p>Nao tem</p>');
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

    /*
     * initialize the widget.
     */

    ZOHO.embeddedApp.init();
}

function onLoadHandler() {
    debugger;
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
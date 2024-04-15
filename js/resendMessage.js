var Const = {
    apinames: {
        apiphonelead: "whatsapphubforzohocrm__leads",
        apiphoneaccount: "whatsapphubforzohocrm__accounts",
        apiphonedeal: "whatsapphubforzohocrm__deals",
        apiphonecontact: "whatsapphubforzohocrm__contacts",
        apicomportamento: "whatsapphubforzohocrm__comportamento",
        apiurlbase: "whatsapphubforzohocrm__urlBase",
        apiconfiguracao: "whatsapphubforzohocrm__configuracao",
        apitemplate: "whatsapphubforzohocrm__WhatsApp_Templates"
    },
    languages: ["en_US", "pt_BR", "es_ES"],
    deflang: "en_US",
    desclanguage: {},
    idModulo: "",
    entityName: "",
    orgVariable: "",
    phonelead: "",
    leadfieldnames: [],
    phoneaccount: "",
    accountfieldnames: [],
    phonedeal: "",
    dealfieldnames: [],
    phonecontact: "",
    contactfieldnames: [],
    msglead: "",
    msgcontact: "",
    msgaccount: "",
    msgdeal: "",
    allfieldsleads: [],
    allfieldscontacts: [],
    allfieldsaccounts: [],
    allfieldsdeals: [],
    allfieldsusers: [],
    allfieldsorgs: [],
    modules: [],
    enablemodule: {},
    linha: {},
    configPurify: { ALLOWED_TAGS: ['b'], KEEP_CONTENT: false },
    getallmodules: []
}

//function initializeWidget() {

ZOHO.embeddedApp.on("PageLoad", async function(data) {

    this.entityName = data.Entity;
    this.entityIds = data.EntityId[0];
    Const.idModulo = entityIds;
    Const.entityName = entityName;

    await ZOHO.CRM.CONFIG.getCurrentUser().then(function(data) {

        return ZOHO.CRM.API.getUser({ ID: data.users[0].id })
            .then(async function(data) {

                if (Const.languages.includes(data.users[0].language)) {
                    Const.deflang = data.users[0].language;
                }
                await Utils.RenderTemplate(Const.deflang);
                return getAllInfo();
                //$("#allPage").show();
            })

    })


});

ZOHO.embeddedApp.init();

function getAllInfo() {
    ZOHO.CRM.API.getRecord({ Entity: Const.entityName, RecordID: Const.idModulo })
        .then(function(data) {
            console.log(data)
            if (data.data[0].whatsapphubforzohocrm__Status.toLowerCase() == "sending" && data.data[0].whatsapphubforzohocrm__Direction.toLowerCase() == "outgoing") {
                var field = '<input type="text" class="form-control inputtext input-text-error" id="telefoneText" name="fname" value="' + data.data[0].whatsapphubforzohocrm__Phone_Number + '"/>';
                $("#leadDefault").html(field);
                $("#textMsg").val(data.data[0].whatsapphubforzohocrm__Message).prop("disabled", "true");
                var register = data.data[0];
                if (register.whatsapphubforzohocrm__Lead != null && register.whatsapphubforzohocrm__Lead != "" && register.whatsapphubforzohocrm__Lead != undefined) {
                    ZOHO.CRM.API.getOrgVariable(Const.apinames.apiphonelead).then(function(data) {
                        console.log(data);
                        var api_name = JSON.parse(data.Success.Content).name;
                        Const.getallmodules.push({
                            module: "Leads",
                            id: register.whatsapphubforzohocrm__Lead.id,
                            api_name: api_name
                        });
                    });
                }
                if (register.whatsapphubforzohocrm__Contact != null && register.whatsapphubforzohocrm__Contact != "" && register.whatsapphubforzohocrm__Contact != undefined) {
                    ZOHO.CRM.API.getOrgVariable(Const.apinames.apiphonecontact).then(function(data) {
                        var api_name = JSON.parse(data.Success.Content).name;
                        Const.getallmodules.push({
                            module: "Contacts",
                            id: register.whatsapphubforzohocrm__Contact.id,
                            api_name: api_name
                        });
                    });
                }
                if (register.whatsapphubforzohocrm__Account != null && register.whatsapphubforzohocrm__Account != "" && register.whatsapphubforzohocrm__Account != undefined) {
                    ZOHO.CRM.API.getOrgVariable(Const.apinames.apiphoneaccount).then(function(data) {
                        var api_name = JSON.parse(data.Success.Content).name;
                        Const.getallmodules.push({
                            module: "Accounts",
                            id: register.whatsapphubforzohocrm__Account.id,
                            api_name: api_name
                        });
                    });
                }
                if (register.whatsapphubforzohocrm__Deal != null && register.whatsapphubforzohocrm__Deal != "" && register.whatsapphubforzohocrm__Deal != undefined) {
                    ZOHO.CRM.API.getOrgVariable(Const.apinames.apiphonedeal).then(function(data) {
                        var result = JSON.parse(data.Success.Content);
                        Const.getallmodules.push({
                            module: result.module,
                            id: register.whatsapphubforzohocrm__Deal.id,
                            api_name: result.name
                        });
                    });
                }
                $("#cont").delay(2000).slideUp(function() {
                    $("#app").slideDown();
                });
            } else {

                Utils.errorMsg("ErroMsgBig", "msg-error-sending", false, true);
            }

        })

}

function reloadWebtab() {
    location.reload();
}

async function sendMsg() {
    $("#newLoad").slideDown();
    var numCel = $("#telefoneText").val();
    var msg = $("#textMsg").val();
    var continua = true;

    await ZOHO.CRM.API.getOrgVariable(Const.apinames.apiurlbase).then(async function(data) {
        Const.apiurlbase = data.Success.Content;
    });


    if (numCel != null && numCel != "") {
        numCel = numCel.replace("(", "").replace(")", "").replace("-", "").replace("+", "").replace("|", "").replace("/", "").replace(" ", "").trim();

        var func_name = "whatsapphubforzohocrm__validphonenumber";
        var req_data = {
            "record": JSON.stringify({ "phone": numCel }),
            "phoneAPI": "phone",
            "ddi": ""
        };
        await ZOHO.CRM.FUNCTIONS.execute(func_name, req_data)
            .then(function(data) {
                if (data.code == "success" && data.details.output != undefined) {
                    if (JSON.parse(data.details.output).status == "error") {
                        continua = false;
                        $("#newLoad").slideUp();
                        Utils.errorMsg("ErroMsg", "msg-error-invalid-num");
                    }
                }
            });
        if (continua) {
            if (msg != null && msg != "") {
                return ZOHO.CRM.API.getOrgVariable(Const.apinames.apiconfiguracao).then(function(data) {
                    var resp = data.Success.Content;
                    resp = JSON.parse(resp);
                    var appName = resp.aplicativo;
                    var tokenApp = resp.token;
                    if (tokenApp !== null && tokenApp !== '') {
                        msg = encodeURI(msg);
                        var reqUrl = "";
                        if (appName == "zapbox") {
                            reqUrl = Const.apiurlbase + "/send/" + tokenApp + "?cmd=chat&id=" + Const.entityName.toLowerCase() + "-" + Const.idModulo + "&to=" + numCel + "@c.us&msg=" + msg;
                        } else if (appName == "winzap") {
                            reqUrl = Const.apiurlbase + "/send/?token=" + tokenApp + "&cmd=chat&id=" + Const.entityName.toLowerCase() + "-" + Const.idModulo + "&to=" + numCel + "@c.us&msg=" + msg;
                        } else {
                            $("#newLoad").slideUp();
                            Utils.errorMsg("ErroMsg", "msg-error-sel-app", false, true);
                        }
                        var request = {
                            url: reqUrl,
                        }
                        ZOHO.CRM.HTTP.get(request)
                            .then(function(res) {
                                if ($("#myonoffswitchtemplate").is(':checked')) {
                                    Const.getallmodules.forEach(register => {
                                        var param = {
                                            Entity: register.module,
                                            APIData: {
                                                "id": register.id
                                            },
                                            Trigger: ["workflow"]
                                        }
                                        param.APIData[register.api_name] = numCel;
                                        ZOHO.CRM.API.updateRecord(param);
                                    });
                                }
                                var config = {
                                    Entity: "whatsapphubforzohocrm__WhatsApp_Messages",
                                    APIData: {
                                        "id": Const.idModulo,
                                        "whatsapphubforzohocrm__Phone_Number": numCel
                                    }
                                }
                                ZOHO.CRM.API.updateRecord(config);
                                $("#newLoad").slideUp();
                                Utils.successMsg("SuccessMsg", "msg-success-sent-message", false, true);
                            })
                    } else {
                        $("#newLoad").slideUp();
                        Utils.errorMsg("ErroMsg", "msg-error-token-app", false, true);
                    }
                });

            } else {
                $("#newLoad").slideUp();
                Utils.errorMsg("ErroMsg", "msg-error-null-msg", false, false);
            }
        }
    } else {
        $("#newLoad").slideUp();
        Utils.errorMsg("ErroMsg", "msg-error-invalid-fill", false, false);
    }


}

function closePopup() {
    ZOHO.CRM.UI.Popup.close();
}

function closeSpanMsg(idDiv) {
    $("#" + idDiv).hide();
}

function maxLength(el) {
    if (el != null) {
        if (!('maxlength' in el)) {
            var max = el.attributes.maxLength.value;
            el.onkeypress = function() {
                if (this.value.length >= max) return false;
            };
        }
    }
}

maxLength(document.getElementById("textMsg"));

Utils = {};

//Utils.successMsg("SuccessMsg","msg-success-setup");
Utils.successMsg = function(id, message, reload = false, close = false, refreshback = null) {
    $('#' + id + " .sucesText").text(Const.desclanguage[message]);
    $('#' + id).slideDown(function() {
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
    });
}

//Utils.errorMsg("ErroMsg","msg-error-setup");
Utils.errorMsg = function(id, message, reload = false, close = false, refreshback = null) {
    $('#' + id + " .erroText").text(Const.desclanguage[message]);
    $('#' + id).slideDown(function() {
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
    });

}


Utils.RenderTemplate = async function(lang) {
    //console.log(data);
    await $.getJSON("../translations/" + lang + ".json", function(data) {
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
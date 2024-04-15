var Const = {
    apinames: {
        apiphonelead: "whatsapphubforzohocrm__leads",
        apiphoneaccount: "whatsapphubforzohocrm__accounts",
        apiphonedeal: "whatsapphubforzohocrm__deals",
        apiphonecontact: "whatsapphubforzohocrm__contacts",
        apicomportamento: "whatsapphubforzohocrm__comportamento",
        apileadsource: "whatsapphubforzohocrm__leadsource",
        apiativacao: "whatsapphubforzohocrm__ativacao",
        apiconfiguracao: "whatsapphubforzohocrm__configuracao",
        apiaplicativo: "whatsapphubforzohocrm__aplicativo",
        apistatusaplicativo: "whatsapphubforzohocrm__aplicativostatus",
        apiwebhook: "whatsapphubforzohocrm__webhook",
        apirequiredfield: "whatsapphubforzohocrm__requiredfields",
        apiurlbase: "whatsapphubforzohocrm__urlBase",
        apiwebhookwhatsapp: "whatsapphubforzohocrm__webhookwhatsapp",
        fields: {
            modulemessage: "whatsapphubforzohocrm__modulemessages"
        },
        module: {
            apimessages: "whatsapphubforzohocrm__WhatsApp_Messages"
        }
    },
    languages: ["en_US", "pt_BR"],
    deflang: "en_US",
    desclanguage: {},
    orgVariable: "",
    phonelead: "",
    leadfieldnames: [],
    phoneaccount: "",
    accountfieldnames: [],
    phonedeal: "",
    dealfieldnames: [],
    phonecontact: "",
    contactfieldnames: [],
    leadsourcenames: [],
    sourcelead: "",
    msglead: "",
    msgcontact: "",
    msgaccount: "",
    msgdeal: "",
    requiredfield: { "layout": { "desc": "", "id": "" }, "required": [], "requiredPhone": [] },
    allfieldsleads: [],
    allfieldscontacts: [],
    allfieldsaccounts: [],
    allfieldsdeals: [],
    allfieldsusers: [],
    allfieldsorgs: [],
    requiredLeadFields: [],
    requiredPhoneLeadFields: [],
    modules: [],
    enablemodule: {},
    emptyField: { "desc": "", "name": "", "type": "", "module": "" },
    urlbase: "",
    configPurify: { ALLOWED_TAGS: ['b'], KEEP_CONTENT: false },
    layoutName: "",
    infocountry: ""
}

var structure = "";
var respApp = "";

async function initializeWidget() {
    $('#newLoad').slideDown();

    /*
     * Subscribe to the EmbeddedApp onPageLoad event before initializing the widget
     */
    await ZOHO.embeddedApp.on("PageLoad", async function (data) {
        var aplicativostatus = "";
        var respAti = "";


        var tokenZap = {};

        await ZOHO.CRM.CONFIG.getCurrentUser().then(function (data) {
            $("#nomeText").val(data.users[0].full_name);
            $("#nomeText").prop("disabled", true);
            $("#emailText").val(data.users[0].email);
            $("#emailText").prop("disabled", true);

            return ZOHO.CRM.API.getUser({ ID: data.users[0].id })
                .then(async function (data) {

                    if (Const.languages.includes(data.users[0].language)) {
                        Const.deflang = data.users[0].language;
                    }
                    await Utils.RenderTemplate(Const.deflang);
                    //$("#allPage").show();

                })

        })

        // Definição da página de aplicativos
        return ZOHO.CRM.META.getModules().then(async function (data) {
            data.modules.forEach(modulo => {
                var apimodulo = modulo.api_name;

                if (apimodulo.toLowerCase() == "leads") {

                    if (!modulo.visible) {
                        $("#leadDIV").hide();
                        $("#leadbtnDIV").hide();
                        Const.enablemodule.leads = false;
                        var parameterMap = {
                            apiname: Const.apinames.apiphonelead,
                            value: Const.emptyField
                        };
                        ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap);
                        parameterMap = {
                            apiname: Const.apinames.apileadsource,
                            value: Const.emptyField
                        };
                        ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap);
                        parameterMap = {
                            "apiname": Const.apinames.apicomportamento,
                            "value": false
                        };
                        ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap);
                    } else {
                        Const.enablemodule.leads = true;
                    }
                } else if (apimodulo.toLowerCase() == "contacts") {
                    if (!modulo.visible) {
                        $("#contactDIV").hide();
                        Const.enablemodule.contacts = false;
                        var parameterMap = {
                            apiname: Const.apinames.apiphonecontact,
                            value: Const.emptyField
                        };
                        ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap);
                    } else {
                        Const.enablemodule.contacts = true;
                    }
                } else if (apimodulo.toLowerCase() == "accounts") {
                    if (!modulo.visible) {
                        $("#accountDIV").hide();
                        Const.enablemodule.accounts = false;
                        var parameterMap = {
                            apiname: Const.apinames.apiphoneaccount,
                            value: Const.emptyField
                        };
                        ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap);
                    } else {
                        Const.enablemodule.accounts = true;
                    }
                } else if (apimodulo.toLowerCase() == "deals") {
                    if (!modulo.visible) {
                        $("#dealDIV").hide();
                        Const.enablemodule.deals = false;
                        var parameterMap = {
                            apiname: Const.apinames.apiphonedeal,
                            value: Const.emptyField
                        };
                        ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap);
                    } else {
                        Const.enablemodule.deals = true;
                    }
                }
            })
            //alert(JSON.stringify(Const.enablemodule));
            if (!Const.enablemodule.leads && !Const.enablemodule.contacts && !Const.enablemodule.accounts && !Const.enablemodule.deals) {
                $("#comportamentoDIV").hide();
                $("#erroDIV").show();
            }
            if (Const.enablemodule.leads) {
                ZOHO.CRM.API.getOrgVariable(Const.apinames.apiaplicativo).then(async function (data) {
                    $("#layoutField").text();
                });
            } else {
                $("#layoutDiv").hide();
            }

            return ZOHO.CRM.API.getOrgVariable(Const.apinames.apiurlbase).then(async function (data) {
                Const.apiurlbase = data.Success.Content;

                return ZOHO.CRM.API.getOrgVariable(Const.apinames.apiaplicativo).then(async function (data) {

                    if (data.Success.Content != '' && data.Success.Content != null && data.Success.Content.includes("{")) {
                        resposta = JSON.parse(data.Success.Content);
                        respApp = resposta.app.toLowerCase();
                        Const.infocountry = resposta.country;
                        if (Const.infocountry.code.toUpperCase() == "BR") {
                            $("#countryDiv").html(Const.infocountry.name);
                            $("#idLabelUtalk").show();
                            $("#ZapboxR").show();
                        } else {
                            $("#countryDiv").html(Const.infocountry.name);
                        }
                    } else if (data.Success.Content != '' && data.Success.Content != null && data.Success.Content == "zapbox") {
                        respApp = data.Success.Content;
                    } else {
                        showConfig()
                    }

                    if (!respApp.toUpperCase().includes("DOCTYPE") && !respApp.includes("error")) {

                        return ZOHO.CRM.API.getOrgVariable(Const.apinames.apistatusaplicativo).then(async function (stats) {
                            aplicativostatus = stats.Success.Content;
                            if (!aplicativostatus.toUpperCase().includes("DOCTYPE") && !aplicativostatus.includes("error")) {


                                if (respApp == "zapbox") {

                                    document.getElementById("ZapboxR").checked = true;
                                    //document.getElementById("ativacaoTab").removeAttribute("disabled");
                                    document.getElementById("zapboxContent").style.display = "block";
                                    document.getElementById("zapboxConfig").style.display = "block";
                                } else if (respApp == "zapphub") {
                                    document.getElementById("ZappHubR").checked = true;
                                    //document.getElementById("WinzapR").checked = true;
                                    //document.getElementById("ativacaoTab").removeAttribute("disabled");
                                    document.getElementById("winzapContent").style.display = "block";
                                    document.getElementById("zapboxConfig").style.display = "block";
                                } else {
                                    document.getElementById("NenhumaR").checked = true;
                                    aplicativostatus = false;
                                }
                                // Definição da página de ativação
                                return ZOHO.CRM.API.getOrgVariable(Const.apinames.apiativacao).then(async function (data) {
                                    respAti = data.Success.Content.toLowerCase();
                                    if (!respAti.toUpperCase().includes("DOCTYPE") && !respAti.includes("error")) {
                                        if (respAti == "truezn" && respApp == "zapbox") {

                                            //document.getElementById("configuracaoTab").removeAttribute("disabled");
                                            $(".activeTab").removeClass();
                                            $('.tab-body').hide();
                                            $('#' + 'tab3').show();
                                            $('#configuracaoTab').addClass("activeTab");

                                            var parameterMap = {
                                                apiname: Const.apinames.apiativacao,
                                                value: DOMPurify.sanitize("truez", Const.configPurify),
                                            };
                                            ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap).then(async function (data) { });

                                        } else if (respAti == "truewc" && respApp == "zapphub") {
                                            //document.getElementById("configuracaoTab").removeAttribute("disabled");
                                            $(".activeTab").removeClass();
                                            $('.tab-body').hide();
                                            $('#' + 'tab3').show();
                                            $('#configuracaoTab').addClass("activeTab");
                                            var parameterMap = {
                                                apiname: Const.apinames.apiativacao,
                                                value: DOMPurify.sanitize("truew", Const.configPurify),
                                            };
                                            ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap).then(async function (data) { });

                                        } else if (respAti == "truez" && respApp == "zapbox") {
                                            //document.getElementById("configuracaoTab").removeAttribute("disabled");

                                        } else if (respAti == "truew" && respApp == "winzap") {
                                            //document.getElementById("configuracaoTab").removeAttribute("disabled");

                                        }
                                        return ZOHO.CRM.API.getOrgVariable(Const.apinames.apiconfiguracao).then(async function (data) {
                                            structure = data.Success.Content;
                                            if (structure.includes("{") && !structure.toUpperCase().includes("DOCTYPE") && !structure.includes("error")) {

                                                tokenZap = JSON.parse(structure);
                                                if (respApp == "zapbox") {
                                                    if (tokenZap.token !== null && tokenZap.token !== '' && tokenZap.status == "true") {
                                                        $(".activeTab").removeClass();
                                                        $('.tab-body').hide();
                                                        $('#' + 'tab4').show();
                                                        $('#comportamentoTab').addClass("activeTab");

                                                        var parameterMap = {
                                                            apiname: Const.apinames.apiconfiguracao,
                                                            value: DOMPurify.sanitize(structure.replace("true", "false"), Const.configPurify),
                                                        };
                                                        ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap);
                                                        document.getElementById("apiText").value = tokenZap.token;
                                                        if (tokenZap.allow == "true") {
                                                            //Xdocument.getElementById("comportamentoTab").removeAttribute("disabled");
                                                            await verificaCampos();
                                                        }
                                                    } else if (tokenZap.token !== null && tokenZap.token !== '' && tokenZap.status == "false") {
                                                        document.getElementById("apiText").value = tokenZap.token;
                                                        if (tokenZap.allow == "true") {
                                                            //document.getElementById("comportamentoTab").removeAttribute("disabled");
                                                            await verificaCampos();
                                                        }

                                                    }
                                                    if (tokenZap.token !== null && tokenZap.token !== '') {
                                                        var demo = "<iframe frameborder=\"0\" src=\"" + Const.apiurlbase + "/qrcode/" + tokenZap.token + "\" width=\"100%\" height=\"400px\" scrolling=\"no\"></iframe>"
                                                        $("#demo").html(demo)
                                                    }
                                                } else if (respApp == "zapphub") {
                                                    if (tokenZap.token !== null && tokenZap.token !== '' && tokenZap.status == "true") {
                                                        $(".activeTab").removeClass();
                                                        $('.tab-body').hide();
                                                        $('#' + 'tab4').show();
                                                        $('#comportamentoTab').addClass("activeTab");

                                                        var parameterMap = {
                                                            apiname: Const.apinames.apiconfiguracao,
                                                            value: DOMPurify.sanitize(structure.replace("true", "false"), Const.configPurify),
                                                        };
                                                        ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap);
                                                        document.getElementById("apiText").value = tokenZap.token;
                                                        if (tokenZap.allow == "true") {
                                                            //Xdocument.getElementById("comportamentoTab").removeAttribute("disabled");
                                                            await verificaCampos();
                                                        }
                                                    } else if (tokenZap.token !== null && tokenZap.token !== '' && tokenZap.status == "false") {
                                                        document.getElementById("apiText").value = tokenZap.token;
                                                        if (tokenZap.allow == "true") {
                                                            //document.getElementById("comportamentoTab").removeAttribute("disabled");
                                                            await verificaCampos();
                                                        }

                                                    }
                                                    if (tokenZap.token !== null && tokenZap.token !== '') {
                                                        //qrcode
                                                    }
                                                }

                                            } else {
                                                Utils.errorMsg("ErroMsg", "msg-error-setup");
                                            }

                                        });

                                    } else {
                                        Utils.errorMsg("ErroMsg", "msg-error-activate");
                                    }
                                });
                            } else {
                                Utils.errorMsg("ErroMsg", "msg-error-statusapp");
                            }
                        });
                    } else {
                        Utils.errorMsg("ErroMsg", "msg-error-defapp");
                    }
                }).then(function () {

                    $('#newLoad').delay(5000).slideUp(function () {
                        //$('#allPage').show();

                        $("#aplicativoTab").removeAttr("disabled");
                        $("#btnEdit").removeAttr("disabled");

                        if (aplicativostatus == "true") {
                            $(".activeTab").removeClass();
                            $('.tab-body').hide();
                            $('#' + 'tab2').show();
                            $('#ativacaoTab').addClass("activeTab");
                            var parameterMap = {
                                apiname: Const.apinames.apistatusaplicativo,
                                value: DOMPurify.sanitize("false", Const.configPurify),
                            };
                            ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap);
                        }

                        if (respApp == "zapbox" || respApp == "zapphub") {
                            $("#ativacaoTab").removeAttr("disabled");
                            $("#btnNextZapBox").removeAttr("disabled");
                            $("#btnNextZappHub").removeAttr("disabled");


                            if ((respAti == "truezn" && respApp == "zapbox") || (respAti == "truewc" && respApp == "zapphub") || (respAti == "truez" && respApp == "zapbox") || (respAti == "truew" && respApp == "zapphub")) {
                                $("#configuracaoTab").removeAttr("disabled");
                                $("#btnEditar").removeAttr("disabled");
                            }


                            if (tokenZap.token !== null && tokenZap.token !== '' && tokenZap.allow) {
                                $("#comportamentoTab").removeAttr("disabled");
                                $("#btnfieldedit").removeAttr("disabled");
                            }
                            lLibera = true;
                            if (Const.enablemodule.leads && Const.phonelead.desc != null && Const.phonelead.desc != "" && Const.phonelead.desc != "undefined") {

                                //$("#suporteTab").removeAttr("disabled");

                            } else { lLibera = false; }
                            if (Const.enablemodule.contacts && Const.phonecontact.desc != null && Const.phonecontact.desc != "" && Const.phonecontact.desc != "undefined") {

                                $("#suporteTab").removeAttr("disabled");

                            } else { lLibera = false; }
                            if (Const.enablemodule.accounts && Const.phoneaccount.desc != null && Const.phoneaccount.desc != "" && Const.phoneaccount.desc != "undefined") {

                                $("#suporteTab").removeAttr("disabled");

                            } else { lLibera = false; }
                            if (Const.enablemodule.deals && Const.phonedeal.desc != null && Const.phonedeal.desc != "" && Const.phonedeal.desc != "undefined") { } else { lLibera = false; }
                            if (lLibera) {
                                $("#suporteTab").removeAttr("disabled");
                            }

                            $("select").multipleSelect({
                                filter: true
                            })
                        }
                    });
                });
            });
        });
    });

    /*
     * initialize the widget.
     */

    ZOHO.embeddedApp.init();
}

function showtab(id, obj) {
    $(".activeTab").removeClass();
    $('.tab-body').hide();
    $('#' + id).show();
    $(obj).addClass("activeTab");
}

function reloadWebtab() {
    location.reload();
}

function showConfig() {
    Utils.loadCountries();
    $("#saveNcancel").show();
    $("#edit").hide();
    document.getElementById("NenhumaR").removeAttribute("disabled");
    document.getElementById("ZapboxR").removeAttribute("disabled");
    document.getElementById("ZappHubR").removeAttribute("disabled");
    //document.getElementById("WinzapR").removeAttribute("disabled");
}

function myFunction() {

    //grava definicao de modulo do chat
    ZOHO.CRM.META.getModules().then(function (data) {
        //console.log(data);	
        for (mod in data.modules) {
            if (data.modules[mod].api_name.toLowerCase() == Const.apinames.module.apimessages.toLowerCase()) {
                var parameterMaps = {
                    apiname: Const.apinames.fields.modulemessage,
                    value: DOMPurify.sanitize(data.modules[mod].module_name, Const.configPurify)
                };
                ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMaps);
            }

        }
    });

    var aplicativos = document.getElementsByName('aplicativo');
    for (var i = 0, length = aplicativos.length; i < length; i++) {
        if (aplicativos[i].checked) {
            var aplicativo = aplicativos[i].value;
            break;
        }
    }

    /*var parameterMap = {
        apiname: Const.apinames.apiconfiguracao,
        value: DOMPurify.sanitize(""),
    };
    ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap);*/
    saveapp = {};
    saveapp.app = aplicativo;
    saveapp.country = {};
    saveapp.country.name = $("#countrySelect option:selected").text();

    saveapp.country.code = $("#countrySelect option:selected").val();
    var lContinuaCountry = true;
    if (aplicativo.toLowerCase() == "nenhuma" && saveapp.country.code.toUpperCase() != "BR") {
        Utils.errorMsg("ErroMsg", "msg-error-country");
        lContinuaCountry = false;
    }
    if (lContinuaCountry) {
        var parameterMap2 = {
            apiname: Const.apinames.apiaplicativo,
            value: DOMPurify.sanitize(JSON.stringify(saveapp), Const.configPurify),
        };
        ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap2).then(function (data) {
            var parameterMap3 = {
                apiname: Const.apinames.apistatusaplicativo,
                value: DOMPurify.sanitize("true", Const.configPurify),
            };
            ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap3);
            reloadWebtab();
        });
    }

}

function proximoPasso() {
    var aplicativos = document.getElementsByName('aplicativo');
    for (var i = 0, length = aplicativos.length; i < length; i++) {
        if (aplicativos[i].checked) {
            var aplicativo = aplicativos[i].value;
            break;
        }
    }
    aplicativo = aplicativo.toLowerCase();

    var valorP = "false";
    if (aplicativo == "zapphub") {
        valorP = "truewc";
    } else {
        valorP = "truezn";
    }

    var parameterMap = {
        apiname: Const.apinames.apiativacao,
        value: DOMPurify.sanitize(valorP, Const.configPurify),
    };
    ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap).then(function (data) {
        reloadWebtab();
    });
}
// Mostra campo do token para preenchimento
function showConfigApi() {
    $("#saveNcancel2").show();
    $("#btnEditar").hide();
    document.getElementById("apiText").removeAttribute("disabled");
    document.getElementById("apiText").classList.add("fldtype");
}
// Salva página de configurações - Token
function saveConf() {
    var aplicativos = document.getElementsByName('aplicativo');
    for (var i = 0, length = aplicativos.length; i < length; i++) {
        if (aplicativos[i].checked) {
            var aplicativo = aplicativos[i].value;
            break;
        }
    }
    aplicativo = aplicativo.toLowerCase();
    if (aplicativo == "zapbox" || aplicativo == "zapphub") {
        var token = DOMPurify.sanitize(document.getElementById("apiText").value, Const.configPurify);
        var estrutura = "{\"aplicativo\": \"" + aplicativo + "\", \"token\": \"" + token + "\", \"status\":\"true\", \"allow\":\"true\", \"numberPhone\":\"\"}";
    }
    var parameterMap = {
        apiname: Const.apinames.apiconfiguracao,
        value: DOMPurify.sanitize(estrutura, Const.configPurify),
    };
    ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap).then(function (data) {
        //ZOHO.CRM.API.getOrgVariable(Const.apinames.apiconfiguracao).then(async function(data) {

        ZOHO.CRM.API.getOrgVariable(Const.apinames.apiaplicativo).then(async function (app) {
            var respApp = "";
            var answer = app.Success.Content;
            if (answer != "" && answer.includes("{")) {
                answer = JSON.parse(answer);
                respApp = answer.app.toLowerCase();
            } else {
                respApp = answer.toLowerCase();
            }
            var structure = JSON.parse(data).response; //data.Success.Content;
            var tokenZap = JSON.parse(JSON.parse(structure)[Const.apinames.apiconfiguracao]);
            if (respApp == "zapbox") {

                var parameterMap = {
                    apiname: Const.apinames.apiconfiguracao,
                    value: DOMPurify.sanitize(JSON.stringify(tokenZap).replace("true", "false"), Const.configPurify),
                };
                ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap).then(async function (data) { });

                document.getElementById("apiText").value = tokenZap.token;
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        var verificaQr = this.responseText.toLowerCase();
                        if (verificaQr.contains("desligar sessão")) {
                            var demo = "<iframe frameborder=\"0\" src=\"" + Const.apiurlbase + "/qrcode/" + tokenZap.token + "\" width=\"100%\" height=\"400px\" scrolling=\"no\"></iframe>"
                            $("#demo").html(demo)
                            if (verificaQr.contains("abrir chat") && tokenZap.aplicativo.toLowerCase() == "zapbox") {
                                ZOHO.CRM.API.getOrgVariable(Const.apinames.apiwebhook).then(function (data) {
                                    var webhookSite = Const.apiurlbase + "/webhook/" + tokenZap.token;
                                    var request = {
                                        url: webhookSite,
                                        headers: {
                                            ContentType: "application/json; charset=utf-8"
                                        },
                                        params: {
                                            webhook: data.Success.Content
                                        }
                                    }
                                    ZOHO.CRM.HTTP.get(request)
                                        .then(async function (data) {
                                            if (data !== null || data !== '') {
                                                document.getElementById("comportamentoTab").removeAttribute("disabled");
                                                await verificaCampos();
                                                if (aplicativo == "zapbox") {
                                                    var token = document.getElementById("apiText").value;
                                                    var estrutura = "{\"aplicativo\": \"" + aplicativo + "\", \"token\": \"" + token + "\", \"status\":\"true\", \"allow\":\"true\", \"numberPhone\":\"\"}";
                                                }
                                                var parameterMap2 = {
                                                    apiname: Const.apinames.apiconfiguracao,
                                                    value: DOMPurify.sanitize(JSON.stringify(JSON.parse(estrutura)), Const.configPurify)
                                                };
                                                ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap2).then(async function (data) { });
                                                reloadWebtab();
                                            }
                                        })
                                })
                            }
                        } else {
                            var demo = "<iframe id=\"frameid\" frameborder=\"0\" src=\"" + Const.apiurlbase + "/qrcode/" + tokenZap.token + "\" width=\"100%\" height=\"400px\" scrolling=\"no\"></iframe>"
                            $("#demo").html(demo)

                        }

                    }
                }

                var authSite = Const.apiurlbase + '/qrcode/' + tokenZap.token;
                var resp = xhttp.open("GET", authSite, true);
                xhttp.send();

            } else if (respApp == 'zapphub') {

                var func_name = "whatsapphubforzohocrm__getdeviceid";
                var req_data = {
                    "arguments": JSON.stringify({
                        "device_number": "+5511964796926"
                    })
                };
                ZOHO.CRM.FUNCTIONS.execute(func_name, req_data)
                    .then(function (data) {
                        console.log(data.details.output);
                    })


            }
        });
    });
    //});

}

async function showInput2() {
    $("#saveNcancel3").show();
    document.getElementById("btnfieldok").removeAttribute("disabled");
    document.getElementById("btnfieldcanc").removeAttribute("disabled");
    document.getElementById("myonoffswitch").removeAttribute("disabled");
    $("#btnfieldedit").hide();

    var fldSel = "<select id=\"modifiedLeads\" class=\"newSelect\" style=\"width:200px\" required=\"true\" >";

    for (id in Const.leadfieldnames) {
        var atual = Const.leadfieldnames[id];
        if (atual["name"] == Const.phonelead.name) {
            fldSel = fldSel + "<option value=\"" + atual["name"] + "\" selected>" + atual["desc"] + "</option>";
        } else {
            fldSel = fldSel + "<option value=\"" + atual["name"] + "\">" + atual["desc"] + "</option>";
        }
    }
    fldSel = fldSel + "</select>";

    $("#leadDefault").html(fldSel);


    if (Const.enablemodule.leads) {

        ZOHO.CRM.META.getLayouts({ "Entity": "Leads" }).then(function (data) {
            var respLayout = data.layouts;
            var selectLayout = '<select id="idSelectLayout" onchange="layoutChange()" class="newSelect" style="width:200px;"><option value="none">-- none --</option>';
            respLayout.forEach(layout => {
                if (layout.name.toLowerCase() == Const.requiredfield.layout.desc.toLowerCase()) {
                    selectLayout = selectLayout + '<option value="' + layout.id + '" selected>' + layout.name + '</option>';
                } else {
                    selectLayout = selectLayout + '<option value="' + layout.id + '">' + layout.name + '</option>';
                }
            });
            selectLayout = selectLayout + '</select>';
            $("#layoutField").html(selectLayout);
            $('#idSelectLayout').multipleSelect({
                filter: true
            })
        });
    }
    /*$("#leadDefault").each(function () {

        $($(this).find("#modifiedLeads option")).each(function () {
            var currentopton = $(this).val();
            if (currentopton == Const.phonelead["name"]) {
                //$(this).attr("selected", "selected");
                $(this).prop("selected", true);
            }
        });

    })*/

    var fldSel = "<select id=\"modifiedSources\" style=\"width: 200px;\" class=\"newSelect\" required=\"true\">";

    for (id in Const.leadsourcenames) {
        var atual = Const.leadsourcenames[id];
        if (atual["name"] == Const.sourcelead.name) {
            fldSel = fldSel + "<option value=\"" + atual["name"] + "\" selected >" + atual["name"] + "</option>";
        } else {
            fldSel = fldSel + "<option value=\"" + atual["name"] + "\" >" + atual["name"] + "</option>";
        }
    }
    fldSel = fldSel + "</select>";

    $("#leadSourceField").html(fldSel);

    /*$("#leadSourceField").each(function () {

        $($(this).find("#modifiedLeads option")).each(function () {
            var currentopton = $(this).val();
            if (currentopton == Const.sourcelead["name"]) {
                //$(this).attr("selected", "selected");
                $(this).prop("selected", true);
            }
        });

    });*/

    var fldSel = "<select id=\"modifiedContacts\" class=\"newSelect\" style=\"width:200px\" required=\"true\" >";

    for (id in Const.contactfieldnames) {
        var atual = Const.contactfieldnames[id];
        if (atual["name"] == Const.phonecontact.name) {
            fldSel = fldSel + "<option value=\"" + atual["name"] + "\" selected>" + atual["desc"] + "</option>";
        } else {
            fldSel = fldSel + "<option value=\"" + atual["name"] + "\">" + atual["desc"] + "</option>";
        }
    }
    fldSel = fldSel + "</select>";

    $("#contactDefault").html(fldSel);


    /*$("#contactDefault").each(function () {

        $($(this).find("#modifiedContacts option")).each(function () {
            var currentopton = $(this).val();
            if (currentopton == Const.phonecontact["name"]) {
                //$(this).attr("selected", "selected");
                $(this).prop("selected", true);
            }
        });

    })*/

    var fldSel = "<select id=\"modifiedAccounts\" class=\"newSelect\" style=\"width:200px\" required=\"true\" >";

    for (id in Const.accountfieldnames) {
        var atual = Const.accountfieldnames[id];
        if (atual["name"] == Const.phoneaccount.name) {
            fldSel = fldSel + "<option value=\"" + atual["name"] + "\" selected>" + atual["desc"] + "</option>";
        } else {
            fldSel = fldSel + "<option value=\"" + atual["name"] + "\">" + atual["desc"] + "</option>";
        }
    }
    fldSel = fldSel + "</select>";

    $("#accountDefault").html(fldSel);

    /*$("#accountDefault").each(function () {

        $($(this).find("#modifiedAccounts option")).each(function () {
            var currentopton = $(this).val();
            if (currentopton == Const.phoneaccount["name"]) {
                //$(this).attr("selected", "selected");
                $(this).prop("selected", true);
            }
        });

    })*/

    if (Const.enablemodule.deals) {
        var fldSel = "<select id=\"modifiedDeals\" class=\"newSelect\" style=\"width:200px\" required=\"true\" >";

        if (Const.dealfieldnames.length > 0) {
            if (!Const.dealfieldnames[0].name.toLowerCase().includes("none")) {
                fldSel = fldSel + "<optgroup label=\"Negócios\">";
                //}
                for (id in Const.dealfieldnames) {
                    var atual = Const.dealfieldnames[id];
                    if (atual["name"] == Const.phonedeal.name && atual["module"] == "Deals") {
                        fldSel = fldSel + "<option value=\"" + atual["name"] + "\" selected data-group=\"" + atual["module"] + "\">" + atual["desc"] + "</option>";
                    } else {
                        fldSel = fldSel + "<option value=\"" + atual["name"] + "\" data-group=\"" + atual["module"] + "\">" + atual["desc"] + "</option>";
                    }
                }
                //if (!Const.dealfieldnames[0].name.toLowerCase().includes("None")) {
                fldSel = fldSel + "</optgroup>";
            }
        }
        if (Const.enablemodule.contacts) {
            if (Const.contactfieldnames.length > 1) {
                fldSel = fldSel + "<optgroup label=\"Contatos\">";
                for (id in Const.contactfieldnames) {
                    var atual = Const.contactfieldnames[id];
                    if (!atual.name.toLowerCase().includes("none")) {

                        if (atual["name"] == Const.phonedeal.name && atual["module"] == "Contacts") {
                            fldSel = fldSel + "<option value=\"" + atual["name"] + "\" selected data-group=\"" + atual["module"] + "\">" + atual["desc"] + "</option>";
                        } else {
                            fldSel = fldSel + "<option value=\"" + atual["name"] + "\" data-group=\"" + atual["module"] + "\">" + atual["desc"] + "</option>";
                        }
                    }
                }
                fldSel = fldSel + "</optgroup>";
            }
        }
        if (Const.enablemodule.accounts) {
            if (Const.accountfieldnames.length > 1) {
                fldSel = fldSel + "<optgroup label=\"Contas\">";
                for (id in Const.accountfieldnames) {
                    var atual = Const.accountfieldnames[id];
                    if (!atual.name.toLowerCase().includes("none")) {
                        if (atual["name"] == Const.phonedeal.name && atual["module"] == "Accounts") {
                            fldSel = fldSel + "<option value=\"" + atual["name"] + "\" selected data-group=\"" + atual["module"] + "\">" + atual["desc"] + "</option>";
                        } else {
                            fldSel = fldSel + "<option value=\"" + atual["name"] + "\" data-group=\"" + atual["module"] + "\">" + atual["desc"] + "</option>";
                        }
                    }
                }
                fldSel = fldSel + "</optgroup>";
            }
        }
        fldSel = fldSel + "</select>";

        $("#dealDefault").html(fldSel);

    }

    /*$("#dealDefault").each(function () {

        $($(this).find("#modifiedDeals option")).each(function () {
            var currentopton = $(this).val();
            var currdataopt = $(this).data("group");
            if (currentopton == Const.phonedeal["name"] && currdataopt == Const.phonedeal["module"]) {
                //$(this).attr("selected", "selected");
                $(this).prop("selected", true);
            }
        });

    })*/
    var foundButton = document.getElementById("myonoffswitch");
    var buttonStatus = foundButton.checked;


    var reqField = "";
    for (id in Const.requiredLeadFields) {
        var atual = Const.requiredLeadFields[id];
        reqField = reqField + atual["html"];
    }
    if (reqField.length > 0) {

        $("#detailRequired").html(reqField);


        for (id in Const.requiredLeadFields) {
            var atual = Const.requiredLeadFields[id];
            var jsonReqField = Const.requiredfield.required;
            for (x in jsonReqField) {
                var atu = jsonReqField[x];
                if (atu["api"] == atual["fieldstruct"]["api_name"]) {
                    $("#" + atual["fieldstruct"]["column_name"] + "ID").val(atu["value"]);
                }
            }
        }
    }


    $(function () {
        $('#tab4 select').multipleSelect({
            filter: true
        })

    });

}

async function saveOrgVar2() {

    var foundLead;
    var foundContact;
    var foundAccount;
    var foundDeal;
    var foundSource;
    var foundButton = document.getElementById("myonoffswitch");
    var buttonStatus = foundButton.checked;

    var leadFld = $("#modifiedLeads option:selected").val();
    var sourceFld = $("#modifiedSources option:selected").val();
    var contactFld = $("#modifiedContacts option:selected").val();
    var accountFld = $("#modifiedAccounts option:selected").val();
    var dealFld = $("#modifiedDeals option:selected").val();
    var groupFld = $("#modifiedDeals option:selected").data("group");
    var lsegue = true;

    if ((leadFld == "-None-" || leadFld == "" || leadFld == null || leadFld == "undefined") && Const.enablemodule.leads) {
        $("#leadEmpty").show();
        lsegue = false;
    }
    if (buttonStatus && Const.enablemodule.leads) {
        if (sourceFld == "-None-" || sourceFld == "" || sourceFld == null || sourceFld == "undefined") {
            $("#leadSourceEmpty").show();
            lsegue = false;
        }
        if (await checkEmptyFieldsReq()) {
            lsegue = false;
        }
    }

    if ((contactFld == "-None-" || contactFld == "" || contactFld == null || contactFld == "undefined") && Const.enablemodule.contacts) {
        $("#contactEmpty").show();
        lsegue = false;
    }

    if ((accountFld == "-None-" || accountFld == "" || accountFld == null || accountFld == "undefined") && Const.enablemodule.accounts) {
        $("#accountEmpty").show();
        lsegue = false;
    }

    if ((dealFld == "-None-" || dealFld == "" || dealFld == null || dealFld == "undefined") && Const.enablemodule.deals) {
        $("#dealEmpty").show();
        lsegue = false;
    }

    if (lsegue) {
        //foundButton = document.getElementById("myonoffswitch");
        //buttonStatus = foundButton.checked;
        strButtonStatus = buttonStatus.toString();
        foundLead = JSON.stringify(Const.leadfieldnames.find(elem => elem.name == leadFld));
        foundSource = JSON.stringify(Const.leadsourcenames.find(elem => elem.name == sourceFld));
        foundContact = JSON.stringify(Const.contactfieldnames.find(elem => elem.name == contactFld));
        foundAccount = JSON.stringify(Const.accountfieldnames.find(elem => elem.name == accountFld));
        foundDeal = Const.contactfieldnames.find(elem => elem.name == dealFld && elem.module == groupFld);
        if (foundDeal == undefined) {
            foundDeal = Const.accountfieldnames.find(elem => elem.name == dealFld && elem.module == groupFld);
        }
        foundDeal = JSON.stringify(foundDeal);

        parameterMap = {
            "apiname": Const.apinames.apiphonelead,
            "value": DOMPurify.sanitize(foundLead, Const.configPurify)
        };
        ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap)
            .then(function (data) {
                parameterMap = {
                    "apiname": Const.apinames.apiphoneaccount,
                    "value": DOMPurify.sanitize(foundAccount, Const.configPurify)
                };
                return ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap)
            }).then(function (data) {
                parameterMap = {
                    "apiname": Const.apinames.apileadsource,
                    "value": DOMPurify.sanitize(foundSource, Const.configPurify)
                };
                return ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap)
            }).then(function (data) {
                parameterMap = {
                    "apiname": Const.apinames.apiphonecontact,
                    "value": DOMPurify.sanitize(foundContact, Const.configPurify)
                };
                return ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap)
            }).then(function (data) {
                parameterMap = {
                    "apiname": Const.apinames.apiphonedeal,
                    "value": DOMPurify.sanitize(foundDeal, Const.configPurify)
                };
                return ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap)
            }).then(function (data) {
                parameterMap = {
                    "apiname": Const.apinames.apirequiredfield,
                    "value": DOMPurify.sanitize(JSON.stringify(Const.requiredfield), Const.configPurify)
                };
                return ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap)
            }).then(function (data) {
                parameterMap = {
                    "apiname": Const.apinames.apicomportamento,
                    "value": DOMPurify.sanitize(strButtonStatus, Const.configPurify)
                };
                return ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap)
            }).then(function (data) {
                Utils.successMsg("SuccessMsg", "msg-success-behavior", true);
            });


    } else {
        return lsegue;
    }

}

async function verificaCampos() {

    return ZOHO.CRM.API.getOrgVariable(Const.apinames.apileadsource).then(function (data) {
        Const.sourcelead = JSON.parse(data.Success.Content);


        return ZOHO.CRM.API.getOrgVariable(Const.apinames.apicomportamento).then(function (data) {

            var statusComportamento = data.Success.Content;
            if (statusComportamento == "true") {
                document.getElementById("myonoffswitch").checked = true;
                $("#leadSourceDiv").show();
            } else {
                document.getElementById("myonoffswitch").checked = false;
                $("#leadSourceDiv").hide();
            }


            return ZOHO.CRM.API.getOrgVariable(Const.apinames.apiphonelead).then(async function (data) {


                Const.phonelead = JSON.parse(data.Success.Content);


                Const.leadfieldnames.push({
                    desc: "-None-",
                    name: "-None-",
                    type: "text",
                    module: "Leads"
                })
                if (Const.enablemodule.leads) {
                    await ZOHO.CRM.META.getLayouts({
                        "Entity": "Leads"
                    }).then(async function (data) {
                        await ZOHO.CRM.API.getOrgVariable(Const.apinames.apirequiredfield).then(function (layout) {
                            Const.layoutName = JSON.parse(layout.Success.Content).layout.desc;
                            if (Const.layoutName == null || Const.layoutName == "" || Const.layoutName == undefined) {
                                Const.layoutName = data.layouts[0].name;
                                data.layouts[0].sections.forEach(section => {

                                    var allFields = section.fields;
                                    for (x in allFields) {
                                        if (allFields[x].api_name == "Lead_Source") {
                                            //console.log(allFields[x].pick_list_values);

                                            leadSourceList = allFields[x].pick_list_values;
                                            for (y in leadSourceList) {
                                                Const.leadsourcenames.push({
                                                    name: leadSourceList[y].display_value,
                                                    desc: leadSourceList[y].display_value
                                                })
                                            }
                                        }
                                    }
                                    var resp = section;
                                    for (i in resp.fields) {
                                        var field = resp.fields[i];
                                        if (field.data_type == "phone") {
                                            Const.leadfieldnames.push({
                                                desc: resp.fields[i].field_label,
                                                name: resp.fields[i].api_name,
                                                type: resp.fields[i].data_type,
                                                module: "Leads"
                                            });

                                            Const.allfieldsleads.push({
                                                desc: resp.fields[i].field_label,
                                                name: resp.fields[i].api_name,
                                                type: resp.fields[i].data_type,
                                                module: "Leads"
                                            });

                                        } else {

                                            Const.allfieldsleads.push({
                                                desc: resp.fields[i].field_label,
                                                name: resp.fields[i].api_name,
                                                type: resp.fields[i].data_type,
                                                module: "Leads"
                                            });
                                        }

                                    }

                                })

                            } else {
                                data.layouts.forEach(leadLayout => {

                                    if (Const.layoutName == leadLayout.name) {

                                        leadLayout.sections.forEach(section => {
                                            var allFields = section.fields;
                                            for (x in allFields) {
                                                if (allFields[x].api_name == "Lead_Source") {
                                                    //console.log(allFields[x].pick_list_values);

                                                    leadSourceList = allFields[x].pick_list_values;
                                                    for (y in leadSourceList) {
                                                        Const.leadsourcenames.push({
                                                            name: leadSourceList[y].display_value,
                                                            desc: leadSourceList[y].display_value
                                                        })
                                                    }
                                                }
                                            }
                                            var resp = section;
                                            for (i in resp.fields) {
                                                var field = resp.fields[i];
                                                if (field.data_type == "phone") {
                                                    Const.leadfieldnames.push({
                                                        desc: resp.fields[i].field_label,
                                                        name: resp.fields[i].api_name,
                                                        type: resp.fields[i].data_type,
                                                        module: "Leads"
                                                    });

                                                    Const.allfieldsleads.push({
                                                        desc: resp.fields[i].field_label,
                                                        name: resp.fields[i].api_name,
                                                        type: resp.fields[i].data_type,
                                                        module: "Leads"
                                                    });

                                                } else {

                                                    Const.allfieldsleads.push({
                                                        desc: resp.fields[i].field_label,
                                                        name: resp.fields[i].api_name,
                                                        type: resp.fields[i].data_type,
                                                        module: "Leads"
                                                    });
                                                }

                                            }
                                        });

                                    }

                                });
                            }
                        });
                    })
                }





                return ZOHO.CRM.API.getOrgVariable(Const.apinames.apiphonecontact).then(async function (data) {
                    Const.phonecontact = JSON.parse(data.Success.Content);

                    Const.contactfieldnames.push({
                        desc: "-None-",
                        name: "-None-",
                        type: "text",
                        module: "Contacts"
                    });

                    if (Const.enablemodule.contacts) {
                        await ZOHO.CRM.META.getFields({
                            "Entity": "Contacts"
                        }).then(function (data) {
                            var resp = data;
                            for (i in resp.fields) {
                                var field = resp.fields[i];
                                if (field.data_type == "phone") {
                                    Const.contactfieldnames.push({
                                        desc: resp.fields[i].field_label,
                                        name: resp.fields[i].api_name,
                                        type: resp.fields[i].data_type,
                                        module: "Contacts"
                                    });

                                    Const.allfieldscontacts.push({
                                        desc: resp.fields[i].field_label,
                                        name: resp.fields[i].api_name,
                                        type: resp.fields[i].data_type,
                                        module: "Contacts"
                                    });


                                } else {

                                    Const.allfieldscontacts.push({
                                        desc: resp.fields[i].field_label,
                                        name: resp.fields[i].api_name,
                                        type: resp.fields[i].data_type,
                                        module: "Contacts"
                                    });
                                }
                            }
                        });
                    }


                    return ZOHO.CRM.API.getOrgVariable(Const.apinames.apiphoneaccount).then(async function (data) {
                        Const.phoneaccount = JSON.parse(data.Success.Content);

                        Const.accountfieldnames.push({
                            desc: "-None-",
                            name: "-None-",
                            type: "text",
                            module: "Accounts"
                        });
                        if (Const.enablemodule.accounts) {
                            await ZOHO.CRM.META.getFields({
                                "Entity": "Accounts"
                            }).then(function (data) {
                                var resp = data;
                                for (i in resp.fields) {
                                    var field = resp.fields[i];
                                    if (field.data_type == "phone") {
                                        Const.accountfieldnames.push({
                                            desc: resp.fields[i].field_label,
                                            name: resp.fields[i].api_name,
                                            type: resp.fields[i].data_type,
                                            module: "Accounts"
                                        });

                                        Const.allfieldsaccounts.push({
                                            desc: resp.fields[i].field_label,
                                            name: resp.fields[i].api_name,
                                            type: resp.fields[i].data_type,
                                            module: "Accounts"
                                        });



                                    } else {

                                        Const.allfieldsaccounts.push({
                                            desc: resp.fields[i].field_label,
                                            name: resp.fields[i].api_name,
                                            type: resp.fields[i].data_type,
                                            module: "Accounts"
                                        });
                                    }



                                }

                            });
                        }




                        return ZOHO.CRM.API.getOrgVariable(Const.apinames.apiphonedeal).then(async function (data) {
                            Const.phonedeal = JSON.parse(data.Success.Content);

                            Const.dealfieldnames.push({
                                desc: "-None-",
                                name: "-None-",
                                type: "text",
                                module: "Deals"
                            });
                            if (Const.enablemodule.deals) {
                                await ZOHO.CRM.META.getFields({
                                    "Entity": "Deals"
                                }).then(function (data) {

                                    var resp = data;
                                    for (i in resp.fields) {
                                        var field = resp.fields[i];
                                        if (field.data_type == "phone") {
                                            Const.dealfieldnames.push({
                                                desc: resp.fields[i].field_label,
                                                name: resp.fields[i].api_name,
                                                type: resp.fields[i].data_type,
                                                module: "Deals"
                                            });

                                            Const.allfieldsdeals.push({
                                                desc: resp.fields[i].field_label,
                                                name: resp.fields[i].api_name,
                                                type: resp.fields[i].data_type,
                                                module: "Deals"
                                            });

                                        } else {

                                            if (!field.api_name.includes("Account_Name") && !field.api_name.includes("Contact_Name")) {
                                                Const.allfieldsdeals.push({
                                                    desc: resp.fields[i].field_label,
                                                    name: resp.fields[i].api_name,
                                                    type: resp.fields[i].data_type,
                                                    module: "Deals"
                                                });
                                            }
                                        }
                                    }
                                })
                            }

                        });

                    });
                });
            });
        });
    }).then(async function () {

        if (Const.enablemodule.leads) {
            await verificaRequired();
        }

        if (Const.enablemodule.leads || Const.enablemodule.contacts || Const.enablemodule.accounts || Const.enablemodule.deals) {
            $("#leadSourceField").text(Const.sourcelead.desc);
            $("#leadDefault").text(Const.phonelead.desc);
            $("#contactDefault").text(Const.phonecontact.desc);
            $("#accountDefault").text(Const.phoneaccount.desc);
            $("#dealDefault").text(Const.phonedeal.desc);


            $("#edit2").show();
            $("#saveNcancel2").hide();


        } else {
            $("#saveNcancel2").show();

            var fldSel = "<select id=\"modifiedLeads\" class=\"newSelect\" required=\"true\">";

            for (id in Const.leadfieldnames) {
                var atual = Const.leadfieldnames[id];
                if (atual["name"] == Const.phonelead.name) {
                    fldSel = fldSel + "<option value=\"" + atual["name"] + "\" selected >" + atual["desc"] + "</option>";
                } else {
                    fldSel = fldSel + "<option value=\"" + atual["name"] + "\" >" + atual["desc"] + "</option>";
                }
            }
            fldSel = fldSel + "</select>";

            $("#leadDefault").html(fldSel);

            var fldSel = "<select id=\"modifiedSources\" style=\"width: 200px;\" class=\"newSelect\" required=\"true\">";

            for (id in Const.leadsourcenames) {
                var atual = Const.leadsourcenames[id];
                if (atual["name"] == Const.sourcelead.name) {
                    fldSel = fldSel + "<option value=\"" + atual["name"] + "\" selected >" + atual["name"] + "</option>";
                } else {
                    fldSel = fldSel + "<option value=\"" + atual["name"] + "\" >" + atual["name"] + "</option>";
                }
            }
            fldSel = fldSel + "</select>";

            $("#leadSourceField").html(fldSel);
            if (Const.enablemodule.contacts) {
                var fldSel = "<select id=\"modifiedContacts\" class=\"newSelect\" required=\"true\" >";

                for (id in Const.contactfieldnames) {
                    var atual = Const.contactfieldnames[id];
                    if (atual["name"] == Const.phonecontact.name) {
                        fldSel = fldSel + "<option value=\"" + atual["name"] + "\" selected>" + atual["desc"] + "</option>";
                    } else {
                        fldSel = fldSel + "<option value=\"" + atual["name"] + "\">" + atual["desc"] + "</option>";
                    }
                }
                fldSel = fldSel + "</select>";

                $("#contactDefault").html(fldSel);
            }
            if (Const.enablemodule.accounts) {
                var fldSel = "<select id=\"modifiedAccounts\" class=\"newSelect\" required=\"true\" >";

                for (id in Const.accountfieldnames) {
                    var atual = Const.accountfieldnames[id];
                    if (atual["name"] == Const.phoneaccount.name) {
                        fldSel = fldSel + "<option value=\"" + atual["name"] + "\" selected>" + atual["desc"] + "</option>";
                    } else {
                        fldSel = fldSel + "<option value=\"" + atual["name"] + "\">" + atual["desc"] + "</option>";
                    }
                }
                fldSel = fldSel + "</select>";

                $("#accountDefault").html(fldSel);
            }
            var fldSel = "<select id=\"modifiedDeals\" class=\"newSelect\" required=\"true\" >";

            if (Const.dealfieldnames.length > 0) {
                if (!Const.dealfieldnames[0].name.toLowerCase().includes("none")) {
                    fldSel = fldSel + "<optgroup label=\"Negócios\">";

                    for (id in Const.dealfieldnames) {
                        var atual = Const.dealfieldnames[id];
                        if (atual["name"] == Const.phonedeal.name && atual["module"] == "Deals") {
                            fldSel = fldSel + "<option value=\"" + atual["name"] + "\" selected data-group=\"" + atual["module"] + "\">" + atual["desc"] + "</option>";
                        } else {
                            fldSel = fldSel + "<option value=\"" + atual["name"] + "\" data-group=\"" + atual["module"] + "\">" + atual["desc"] + "</option>";
                        }
                    }
                    //if (!Const.dealfieldnames[0].name.toLowerCase().includes("None")) {
                    fldSel = fldSel + "</optgroup>";
                }
            }
            if (Const.enablemodule.contacts) {
                if (Const.contactfieldnames.length > 1) {
                    fldSel = fldSel + "<optgroup label=\"Contatos\">";
                    for (id in Const.contactfieldnames) {
                        var atual = Const.contactfieldnames[id];
                        if (!atual.name.toLowerCase().includes("none")) {

                            if (atual["name"] == Const.phonedeal.name && atual["module"] == "Contacts") {
                                fldSel = fldSel + "<option value=\"" + atual["name"] + "\" selected data-group=\"" + atual["module"] + "\">" + atual["desc"] + "</option>";
                            } else {
                                fldSel = fldSel + "<option value=\"" + atual["name"] + "\" data-group=\"" + atual["module"] + "\">" + atual["desc"] + "</option>";
                            }
                        }
                    }
                    fldSel = fldSel + "</optgroup>";
                }
            }
            if (Const.enablemodule.accounts) {
                if (Const.accountfieldnames.length > 1) {
                    fldSel = fldSel + "<optgroup label=\"Contas\">";
                    for (id in Const.accountfieldnames) {
                        var atual = Const.accountfieldnames[id];
                        if (!atual.name.toLowerCase().includes("none")) {
                            if (atual["name"] == Const.phonedeal.name && atual["module"] == "Accounts") {
                                fldSel = fldSel + "<option value=\"" + atual["name"] + "\" selected data-group=\"" + atual["module"] + "\">" + atual["desc"] + "</option>";
                            } else {
                                fldSel = fldSel + "<option value=\"" + atual["name"] + "\" data-group=\"" + atual["module"] + "\">" + atual["desc"] + "</option>";
                            }
                        }
                    }
                    fldSel = fldSel + "</optgroup>";
                }
            }

            fldSel = fldSel + "</select>";


            $("#dealDefault").html(fldSel);

        }
    })


}



Utils = {}

//Utils.successMsg("ErroMsg","msg-success-setup",Const.deflang);
Utils.successMsg = function (id, message, reload = false) {
    $('#' + id + " .sucesText").text(Const.desclanguage[message]);
    $('#' + id).slideDown(function () {
        $('#' + id).delay(4000).slideUp(function () {
            if (reload) {
                reloadWebtab();
            }
        });
    });
}

//Utils.errorMsg("ErroMsg","msg-error-setup",Const.deflang);
Utils.errorMsg = function (id, message, reload = false) {
    $('#' + id + " .erroText").text(Const.desclanguage[message]);
    $('#' + id).slideDown(function () {
        $('#' + id).delay(3000).slideUp(function () {
            $("#newLoad").hide();
            if (reload) {
                reloadWebtab();
            }
        });
    });

}


Utils.RenderTemplate = async function (lang) {
    //console.log(data);
    $.getJSON("../translations/" + lang + ".json", function (data) {
        Const.desclanguage = data;
        $("[key='translate']").each(function () {
            var template = $(this).html();
            var compiledTemplate = Handlebars.compile(template);
            var widgetsDiv = $(this);
            widgetsDiv.html(compiledTemplate(data));
        });
        $("#allPage").show();

        /*if (callBack) {
            callBack();
        }*/

    });
}

Utils.loadCountries = async function () {

    $.getJSON("../countries/countries.json", function (data) {

        var selectCountry = '<select id="countrySelect" onchange="selectedCountry()" class="newSelect" style="width:200px;" required="true">';
        for (var i in data) {
            if (Const.infocountry != null && Const.infocountry != '') {
                if (Const.infocountry.code.toUpperCase() == data[i].code.toUpperCase()) {
                    selectCountry = selectCountry + '<option value="' + data[i].code + '" selected>' + data[i].name + '</option>';
                } else {
                    selectCountry = selectCountry + '<option value="' + data[i].code + '">' + data[i].name + '</option>';
                }
            } else {
                selectCountry = selectCountry + '<option value="' + data[i].code + '">' + data[i].name + '</option>';
            }
        }

        selectCountry = selectCountry + "</select>";
        $("#countryDiv").html(selectCountry);
        $("#countrySelect").multipleSelect({
            filter: true
        });

    });
}

function selectedCountry() {
    if ($("#countrySelect").val().toUpperCase() == "BR") {
        $("#ZapboxR").show();
        $("#idLabelUtalk").show();
        $("#textNotUtalk").hide();
    } else {
        $("#ZapboxR").hide();
        $("#idLabelUtalk").hide();
        $("#textNotUtalk").show();
        $("#NenhumaR").prop('checked', true);
    }
}

function closeSpanMsg(idDiv) {
    $("#" + idDiv).hide();
}

function leadSource() {
    var status = document.getElementById("myonoffswitch").checked;
    if (status) {
        $("#leadSourceDiv").show();
        $("#campoObrigatorio").show();
        if (Const.requiredLeadFields.length > 0) {
            $("#fieldRequired").show();
            $("#detailRequired").show();
        }
    } else {
        $("#leadSourceDiv").hide();
        $("#campoObrigatorio").hide();
        if (Const.requiredLeadFields.length > 0) {
            $("#fieldRequired").hide();
            $("#detailRequired").hide();
        }
    }
}

function sendTicket() {
    var nomeT = DOMPurify.sanitize($("#nomeText").val(), Const.configPurify);
    var emailT = DOMPurify.sanitize($("#emailText").val(), Const.configPurify);
    var subT = DOMPurify.sanitize($("#subjectText").val(), Const.configPurify);
    var descT = DOMPurify.sanitize($("#descText").val(), Const.configPurify);
    var selT = DOMPurify.sanitize($("#ticketType").val(), Const.configPurify);
    lContinua = true;
    if (nomeT == null || nomeT == "" || nomeT == "undefined") {
        $("#emptyNome").show();
        $("#nomeText").addClass("erro-text");
        lContinua = false;
    } else {
        $("#emptyNome").hide();
        $("#nomeText").removeClass("erro-text");
    }
    if (emailT == null || emailT == "" || emailT == "undefined") {
        $("#emptyEmail").show();
        $("#emailText").addClass("erro-text");
        lContinua = false;
    } else {
        $("#emptyEmail").hide();
        $("#emailText").removeClass("erro-text");
    }
    if (subT == null || subT == "" || subT == "undefined") {
        $("#emptySubject").show();
        $("#subjectText").addClass("erro-text");
        lContinua = false;
    } else {
        $("#emptySubject").hide();
        $("#subjectText").removeClass("erro-text");
    }
    if (descT == null || descT == "" || descT == "undefined") {
        $("#emptyDesc").show();
        $("#descText").addClass("erro-text");
        lContinua = false;
    } else {
        $("#emptyDesc").hide();
        $("#descText").removeClass("erro-text");
    }
    if (lContinua) {
        //var func_name = "rdstation__createticket";
        var req_data = {
            "name": nomeT,
            "email": emailT,
            "type": selT,
            "subject": subT,
            "desc": descT,
            "productId": "53339000013847098",
            "channel": "Extension"
        };
        var request = {
            url: "https://www.zohoapis.com/crm/v2/functions/createsupportticket/actions/execute?auth_type=apikey&zapikey=1003.21b0cabbad36496839c70625300a756a.c6a56cbe6cdb0e2aba1fb1d47070c23e",
            headers: {
                ContentType: "application/json; charset=utf-8"
            },
            params: {
                webhook: JSON.stringify(req_data)
            }
        }
        ZOHO.CRM.HTTP.get(request)
            .then(async function (data) {
                //console.log(data);
                if (data.toString().contains("success")) {
                    $("#btnSendTicket").prop('disabled', true);
                    Utils.successMsg("SuccessMsg", "msg-success-ticket");
                    setTimeout(function () { location.reload(); }, 3000);
                } else {

                    //erro
                    Utils.errorMsg("ErroMsg", "msg-error-ticket");

                }

            });
    }
}

function requiredFields() {
    var reqField = "";

    for (id in Const.requiredLeadFields) {
        var atual = Const.requiredLeadFields[id];

        //console.log(atual["fieldstruct"]["api_name"]);
        for (x in Const.requiredfield.required) {
            var atu = Const.requiredfield.required[x];
            if (atu["api"] == atual["fieldstruct"]["api_name"]) {

                reqField =
                    reqField +
                    getLineHtml(
                        atual["fieldstruct"]["api_name"],
                        atual["fieldstruct"]["field_label"],
                        atu["value"]
                    );

            }
        }
    }

    if (reqField.length > 0) {
        $("#fieldRequired").show();
        $("#detailRequired").html(reqField);
        $("#detailRequired").show();
    }
}
//ajustar URGENTE esta vindo com texto
function checkRequiredFields() {
    var lret = false;
    if (Const.requiredLeadFields.length > 0) {
        var requireFields = Const.requiredfield.required;
        if (requireFields.length == 0) {
            lret = true;
        } else {
            for (id in requireFields) {
                var atual = requireFields[id];
                if (atual["value"] == "" || atual["value"] == undefined) {
                    lret = true;
                }
            }
        }
    }

    return lret;
}

async function checkEmptyFieldsReq() {
    var fieldsValues = [];
    var phoneValues = [];
    var tam = Const.requiredLeadFields.length;
    Const.requiredfield.layout.desc = $("#idSelectLayout").find("option:selected").text();
    Const.requiredfield.layout.id = $("#idSelectLayout").find("option:selected").val();
    if (Const.requiredPhoneLeadFields.length > 0) {
        for (id in Const.requiredPhoneLeadFields) {
            var atual = Const.requiredPhoneLeadFields[id];
            //for (x in Const.jsonDateDeal.required_fields) {
            //var atu = Const.jsonDateDeal.required_fields[x];
            //if (atu["api"] == atual["fieldstruct"]["api_name"]) {
            var idField = atual["fieldstruct"]["column_name"] + "ID";

            phoneValues.push({
                api: atual["api"],
                id: idField,
                value: "",
                type: atual["type"],
            });
        }
        Const.requiredfield.requiredPhone = phoneValues;
    }
    if (Const.requiredLeadFields.length > 0) {
        for (id in Const.requiredLeadFields) {
            var atual = Const.requiredLeadFields[id];
            //for (x in Const.jsonDateDeal.required_fields) {
            //var atu = Const.jsonDateDeal.required_fields[x];
            //if (atu["api"] == atual["fieldstruct"]["api_name"]) {
            var idField = atual["fieldstruct"]["column_name"] + "ID";
            if (atual["type"] == "picklist") {
                var indice = document.getElementById(idField).selectedIndex;
                var opt = document.getElementById(idField).options;
                var newopt = opt[indice].value;
                var disp = opt[indice].innerText;

                if (indice <= 0) {
                    document.getElementById(idField).style.borderBottomColor = "#ff0000";
                    $("#" + atual["api"] + "Empty").show();
                } else {
                    fieldsValues.push({
                        api: atual["api"],
                        id: idField,
                        value: newopt,
                        type: atual["type"],
                    });
                }
            } else {
                var valor = $("#" + idField).val();

                if (valor == "" || valor == undefined) {
                    document.getElementById(idField).style.borderBottomColor = "#ff0000";
                    $("#" + atual["api"] + "Empty").show();
                } else {
                    fieldsValues.push({
                        api: atual["api"],
                        id: idField,
                        value: valor,
                        type: atual["type"],
                    });
                }
            }
        }

        if (fieldsValues.length == tam) {
            Const.requiredfield.layout.desc = $("#idSelectLayout").find("option:selected").text();
            Const.requiredfield.layout.id = $("#idSelectLayout").find("option:selected").val();
            Const.requiredfield.required = fieldsValues;
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

function getValuesField(field) {
    var ret = "";
    if (
        "date|datatime|boolean|text|integer|textarea|email|phone|currency|double|bigint|website".contains(
            field.data_type
        )
    ) {
        ret = field.default_value;
    } else if (
        "picklist".contains(field.data_type) &&
        !"multiselectpicklist".contains(field.data_type)
    ) {
        ret = field.pick_list_values;
    } else if (
        "lookup".contains(field.data_type) &&
        !"ownerlookup".contains(field.data_type)
    ) {
        ret = field.lookup.module.api_name;
    }

    return ret;
}

function getLineHtml(name, lable, html) {

    ret = "";

    ret =
        ret + '<div class="filed clearfix CB mB10" style="padding-bottom:0px;">';
    ret =
        ret + '  <label class="fldText" style="width:30%;">' + lable + "</label>";
    ret =
        ret +
        '  <div id="' +
        name +
        'Line" class="field flt" style="width:70%;">' +
        html +
        "</div>";
    ret = ret + "</div>";
    ret =
        ret +
        '<div style="float:left; display: none;font-size: 10px;color: rgb(255,0,0);padding-left: 360px;" id="' +
        name +
        'Empty">' + Const.desclanguage["fld-req-message"] + '</div>';

    return ret;
}


function getHtmlField(field, datatag, valtag, disabled) {
    var ret = "";
    prefix = field.column_name;

    disabled = disabled == undefined ? false : disabled;

    if ("date".contains(field.data_type)) {
        ret =
            '<input type="date" id="' +
            prefix +
            'ID" name="' +
            prefix +
            'Name" value="';
        if (field.default_value != null) {
            ret = ret + field.default_value + '" class="fldtype flt"';
        } else {
            ret = ret + '" class="fldtype flt"';
        }
        if (datatag != "" && datatag != null && datatag != undefined) {
            ret = ret + " data-" + datatag + '="' + valtag + '"';
        }
        if (field.required) {
            ret = ret + " required";
        }
        if (disabled) {
            ret = ret + ' disabled="true"';
        }
        ret = ret + " ></input>";
    }
    if ("datatime".contains(field.data_type)) {
        ret =
            '<input type="datetime-local" id="' +
            prefix +
            'ID" name="' +
            prefix +
            'Name" value="';
        if (field.default_value != null) {
            ret = ret + field.default_value + '" class="fldtype flt"';
        } else {
            ret = ret + '" class="fldtype flt"';
        }
        if (datatag != "" && datatag != null && datatag != undefined) {
            ret = ret + " data-" + datatag + '="' + valtag + '"';
        }
        if (field.required) {
            ret = ret + " required";
        }
        if (disabled) {
            ret = ret + ' disabled="true"';
        }
        ret = ret + " ></input>";
    }
    if ("integer|bigint|currency|double".contains(field.data_type)) {
        ret =
            '<input type="number" id="' +
            prefix +
            'ID" name="' +
            prefix +
            'Name" value="';
        if (field.default_value != null) {
            ret = ret + field.default_value + '" class="fldtype flt"';
        } else {
            ret = ret + '" class="fldtype flt"';
        }
        if (datatag != "" && datatag != null && datatag != undefined) {
            ret = ret + " data-" + datatag + '="' + valtag + '"';
        }
        if (field.required) {
            ret = ret + " required";
        }
        if (disabled) {
            ret = ret + ' disabled="true"';
        }
        ret = ret + " ></input>";
    }
    if ("phone".contains(field.data_type)) {
        ret =
            '<input type="tel" id="' +
            prefix +
            'ID" name="' +
            prefix +
            'Name" value="';
        if (field.default_value != null) {
            ret = ret + field.default_value + '" class="fldtype flt"';
        } else {
            ret = ret + '" class="fldtype flt"';
        }
        if (datatag != "" && datatag != null && datatag != undefined) {
            ret = ret + " data-" + datatag + '="' + valtag + '"';
        }
        if (field.required) {
            ret = ret + " required";
        }
        if (disabled) {
            ret = ret + ' disabled="true"';
        }
        ret = ret + " ></input>";
    }
    if ("website".contains(field.data_type)) {
        ret =
            '<input type="url" id="' +
            prefix +
            'ID" name="' +
            prefix +
            'Name" value="';
        if (field.default_value != null) {
            ret = ret + field.default_value + '" class="fldtype flt"';
        } else {
            ret = ret + '" class="fldtype flt"';
        }
        if (datatag != "" && datatag != null && datatag != undefined) {
            ret = ret + " data-" + datatag + '="' + valtag + '"';
        }
        if (field.required) {
            ret = ret + " required";
        }
        if (disabled) {
            ret = ret + ' disabled="true"';
        }
        ret = ret + " ></input>";
    }
    if ("email".contains(field.data_type)) {
        ret =
            '<input type="email" id="' +
            prefix +
            'ID" name="' +
            prefix +
            'Name" value="';
        if (field.default_value != null) {
            ret = ret + field.default_value + '" class="fldtype flt"';
        } else {
            ret = ret + '" class="fldtype flt"';
        }
        if (datatag != "" && datatag != null && datatag != undefined) {
            ret = ret + " data-" + datatag + '="' + valtag + '"';
        }
        if (field.required) {
            ret = ret + " required";
        }
        if (disabled) {
            ret = ret + ' disabled="true"';
        }
        ret = ret + " ></input>";
    }
    if ("boolean".contains(field.data_type)) {
        ret =
            '<input type="checkbox" id="' +
            prefix +
            'ID" name="' +
            prefix +
            'Name" value="';
        if (field.default_value != null) {
            ret = ret + field.default_value + '" class="form-check-input"';
        } else {
            ret = ret + '" class="form-check-input"';
        }
        if (datatag != "" && datatag != null && datatag != undefined) {
            ret = ret + " data-" + datatag + '="' + valtag + '"';
        }
        if (field.required) {
            ret = ret + " required";
        }
        if (disabled) {
            ret = ret + ' disabled="true"';
        }
        ret = ret + " ></input>";
    }
    if ("textarea" == field.data_type.toLowerCase()) {
        ret = '<textarea id="' + prefix + 'ID" name="' + prefix + 'Name" value="';
        if (field.default_value != null) {
            ret = ret + field.default_value + '" class="fldtypearea flt"';
        } else {
            ret = ret + '" class="fldtypearea flt"';
        }
        if (datatag != "" && datatag != null && datatag != undefined) {
            ret = ret + " data-" + datatag + '="' + valtag + '"';
        }
        if (field.required) {
            ret = ret + " required";
        }
        if (disabled) {
            ret = ret + ' disabled="true"';
        }
        if (field.length > 0) {
            ret = ret + ' maxlength="' + field.length.toString() + '"';
        }
        ret = ret + " ></textarea>";
    } else if ("picklist".contains(field.data_type)) {
        ret =
            '<select id="' +
            prefix +
            'ID" name="' +
            prefix +
            'Name" class="newSelect" style="width:200px"';
        if (field.required) {
            ret = ret + " required";
        }
        if (disabled) {
            ret = ret + ' disabled="true"';
        }
        if ("multiselectpicklist" == field.data_type.toLowerCase()) {
            ret = ret + ' multiple="multiple"';
        }
        ret = ret + ">";
        for (id in field.pick_list_values) {
            var atual = field.pick_list_values[id];

            if (
                atual["actual_value"].contains(field.default_value) &&
                field.default_value != null
            ) {
                ret = ret + '<option value="' + atual["actual_value"] + '" selected ';
            } else {
                ret = ret + '<option value="' + atual["actual_value"] + '" ';
            }

            if (datatag != "" && datatag != null && datatag != undefined) {
                ret = ret + " data-" + datatag + '="' + valtag + '"';
            }
            ret = ret + " >" + atual["display_value"] + "</option>";
        }
        ret = ret + "</select>";
    } else {
        /*else if("lookup".contains(field.data_type) && !"ownerlookup".contains(field.data_type))
                                                                                                      {
                                                                                                          ret = field.lookup.module.api_name;
                                                                                                      }*/
        ret =
            '<input type="text" id="' +
            prefix +
            'ID" name="' +
            prefix +
            'Name" value="';
        if (field.default_value != null) {
            ret = ret + field.default_value + '" class="fldtype flt"';
        } else {
            ret = ret + '" class="fldtype flt"';
        }

        if (datatag != "" && datatag != null && datatag != undefined) {
            ret = ret + " data-" + datatag + '="' + valtag + '"';
        }
        if (field.required) {
            ret = ret + " required";
        }
        if (disabled) {
            ret = ret + ' disabled="true"';
        }
        if (field.length > 0) {
            ret = ret + ' maxLength="' + field.length.toString() + '"';
        }
        ret = ret + " ></input>";
    }


    return ret;
}

async function layoutChange() {
    var layoutEscolhido = $("#idSelectLayout").find("option:selected").text();
    var layoutIdEscolhido = $("#idSelectLayout").find("option:selected").val();
    var lContinua = true;
    if (layoutIdEscolhido.toLowerCase() == "none") {
        lContinua = false;
        Utils.errorMsg("ErroMsg", "msg-error-layout");
    }

    if (lContinua) {
        Const.requiredfield.layout.desc = "";
        Const.requiredfield.layout.id = "";
        Const.requiredfield.layout.desc = layoutEscolhido;
        Const.requiredfield.layout.id = layoutIdEscolhido;

        Const.requiredfield.required = [];
        Const.requiredfield.requiredPhone = [];
        var parameterMap2 = {
            apiname: Const.apinames.apiconfiguracao,
            value: DOMPurify.sanitize(structure.replace("false", "true"), Const.configPurify),
        };
        ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap2);
        var parameterMap = {
            apiname: Const.apinames.apirequiredfield,
            value: DOMPurify.sanitize(JSON.stringify(Const.requiredfield), Const.configPurify)
        };
        ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap).then(function (data) {
            location.reload();
        });
    }

}

async function verificaRequired() {
    ZOHO.CRM.META.getLayouts({ "Entity": "Leads" }).then(async function (data) {

        data.layouts.forEach(layout => {
            if (layout.name == Const.layoutName) {
                layout.sections.forEach(resp => {

                    resp.fields.forEach(field => {

                        if (
                            field.required &&
                            field.data_type != "ownerlookup" &&
                            field.data_type != "lookup" &&
                            field.data_type != "userlookup"
                        ) {

                            //remover voltar
                            if (
                                field.api_name.toUpperCase() !=
                                "EMAIL" &&
                                field.api_name.toUpperCase() != "FIRST_NAME" &&
                                field.api_name.toUpperCase() != "LAST_NAME" && field.api_name.toUpperCase() != "COMPANY"
                            ) {
                                if (field.data_type != "phone") {
                                    Const.requiredLeadFields.push({
                                        desc: field.field_label,
                                        api: field.api_name,
                                        type: field.data_type,
                                        values: getValuesField(field),
                                        html: getLineHtml(
                                            field.api_name,
                                            field.field_label,
                                            getHtmlField(field, null, null, false)
                                        ),
                                        fieldstruct: field,
                                    });
                                } else {
                                    Const.requiredPhoneLeadFields.push({
                                        desc: field.field_label,
                                        api: field.api_name,
                                        type: field.data_type,
                                        values: getValuesField(field),
                                        html: getLineHtml(
                                            field.api_name,
                                            field.field_label,
                                            getHtmlField(field, null, null, false)
                                        ),
                                        fieldstruct: field,
                                    });
                                }


                            }
                        }
                    })
                });

                ZOHO.CRM.API.getOrgVariable(Const.apinames.apirequiredfield).then(async function (data) {
                    if (data.Success.Content != "" && data.Success.Content != null && data.Success.Content != undefined) {
                        Const.requiredfield = JSON.parse(data.Success.Content);

                        if (Const.requiredfield.required != null && Const.requiredfield.required != "" && Const.requiredfield.required != undefined) {
                            //Const.requiredfield.required = JSON.parse(Const.requiredfield.required);
                        }
                        if (Const.requiredfield.layout != null && Const.requiredfield.layout != "" && Const.requiredfield.layout != undefined) {
                            if (Const.requiredfield.layout.desc == null || Const.requiredfield.layout.desc == "" || Const.requiredfield.layout.desc == undefined || Const.requiredfield.layout.id == null || Const.requiredfield.layout.id == "" || Const.requiredfield.layout.id == undefined) {
                                Const.requiredfield.layout = { "desc": "", "id": "" };
                            }
                        }

                        if (Const.enablemodule.leads) {
                            $("#layoutField").text(Const.requiredfield.layout.desc);
                        } else {
                            $("#layoutDiv").hide();
                        }
                    }

                    var verifica = await checkRequiredFields();
                    var foundButton = document.getElementById("myonoffswitch");
                    var buttonStatus = foundButton.checked;


                    if (verifica && buttonStatus) {
                        showInput2();
                    } else {
                        requiredFields();
                    }


                })
            }
        })


    });
}
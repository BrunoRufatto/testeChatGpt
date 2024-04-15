var Const = {
    apinames: {
        apiphonelead: "whatsapphubforzohocrm__leads",
        apiphoneaccount: "whatsapphubforzohocrm__accounts",
        apiphonedeal: "whatsapphubforzohocrm__deals",
        apiphonecontact: "whatsapphubforzohocrm__contacts",
        apicomportamento: "whatsapphubforzohocrm__comportamento",
        apiurlbase: "whatsapphubforzohocrm__urlBase",
        apiconfiguracao: "whatsapphubforzohocrm__configuracao",
        apitemplate: "whatsapphubforzohocrm__WhatsApp_Templates",
        apiversion: "whatsapphubforzohocrm__version",
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
    configPurify: {
        ALLOWED_TAGS: ["b"],
        KEEP_CONTENT: false
    },
    contact: "",
    account: "",
    contactinfo: "",
    accountinfo: "",
    newversion: false,
    version: "",
    record_details: null,
    current_email: "",
    fldSel: "",
    lVerifyOption: false,
    lAgentAllow: false,
    lDeviceStatus: false,
    lDeviceHabilitado: false,
    lead_data: {},
    contact_data: {},
    account_data: {},
    deal_data: {},
    user_data: {},
    org_data: {},
    lead_owner: {},
    contact_owner: {},
    account_owner: {},
    deal_owner: {},
    agent_id: null,
    permissions: {
        leads: null,
        contacts: null,
        accounts: null,
        deals: null
    },
};

//function initializeWidget() {

ZOHO.embeddedApp.on("PageLoad", async function (data) {
    var input = document.getElementById("textMsg");
    //var inputtemp = document.getElementById("textCreate");

    var picker = new EmojiButton({
        position: "bottom-start",
    });

    /*var pickertemp = new EmojiButtonTemp({
           position: "bottom-start",
       });*/

    picker.on("emoji", function (emoji) {
        var curPos = document.getElementById("textMsg").selectionStart;
        let x = $("#textMsg").val();
        let text_to_insert = emoji;
        $("#textMsg").val(x.slice(0, curPos) + text_to_insert + x.slice(curPos));
    });

    /*pickertemp.on("emoji", function (emoji) {
   
           var curPos = document.getElementById("textCreate").selectionStart;
           let x = $("#textCreate").val();
           let text_to_insert = emoji;
           $("#textCreate").val(
               x.slice(0, curPos) + text_to_insert + x.slice(curPos)
           );
       });*/

    $("#btnEmoji").click(function () {
        picker.pickerVisible ? picker.hidePicker() : picker.showPicker(input);
    });
    /*$("#btnEmojiTemp").click(function () {
           pickertemp.pickerVisible ? pickertemp.hidePicker() : pickertemp.showPicker(inputtemp);
       });*/

    this.entityName = data.Entity;
    this.entityIds = data.EntityId[0];
    Const.idModulo = entityIds;
    Const.entityName = entityName;

    await ZOHO.CRM.CONFIG.getCurrentUser().then(async function (data) {
        await ZOHO.CRM.API.getProfile({ ID: data.users[0].profile.id }).then(function (data) {
            const permissions_details = data.profiles[0].permissions_details;

            Const.permissions.leads = permissions_details.find(objeto => objeto.name === 'Crm_Implied_View_Leads' && objeto.module.api_name === 'Leads');
            Const.permissions.contacts = permissions_details.find(objeto => objeto.name === 'Crm_Implied_View_Contacts' && objeto.module.api_name === 'Contacts');
            Const.permissions.accounts = permissions_details.find(objeto => objeto.name === 'Crm_Implied_View_Accounts' && objeto.module.api_name === 'Accounts');
            Const.permissions.deals = permissions_details.find(objeto => objeto.name === 'Crm_Implied_View_Deals' && objeto.module.api_name === 'Deals');
        });
    });

    console.log(Const.permissions);

    ZOHO.CRM.API.getRecord({
        Entity: Const.entityName,
        RecordID: Const.idModulo
    })
        .then(async function (data) {
            if (Const.entityName.toLowerCase() == "leads") {
                Const.lead_data = data.data[0];
                ZOHO.CRM.API.getUser({
                    ID: Const.lead_data.Owner.id
                })
                    .then(async function (user_response) {
                        Const.lead_owner = user_response.users[0];
                    });
            } else if (Const.entityName.toLowerCase() == "contacts") {
                Const.contact_data = data.data[0];
                ZOHO.CRM.API.getUser({
                    ID: Const.contact_data.Owner.id
                })
                    .then(async function (user_response) {
                        Const.contact_owner = user_response.users[0];
                    });
            } else if (Const.entityName.toLowerCase() == "accounts") {
                Const.account_data = data.data[0];
                ZOHO.CRM.API.getUser({
                    ID: Const.account_data.Owner.id
                })
                    .then(async function (user_response) {
                        Const.account_owner = user_response.users[0];
                    });
            } else if (Const.entityName.toLowerCase() == "deals") {
                Const.deal_data = data.data[0];
                ZOHO.CRM.API.getUser({
                    ID: Const.deal_data.Owner.id
                })
                    .then(async function (user_response) {
                        Const.deal_owner = user_response.users[0];
                    });
                var account_info = Const.deal_data.Account_Name;
                var contact_info = Const.deal_data.Contact_Name;
                if (account_info != null && account_info != "" && account_info != undefined) {
                    var account_id = account_info.id;
                    ZOHO.CRM.API.getRecord({
                        Entity: "Accounts",
                        RecordID: account_id
                    })
                        .then(async function (account_req) {
                            Const.account_data = account_req.data[0];
                            ZOHO.CRM.API.getUser({
                                ID: Const.account_data.Owner.id
                            })
                                .then(async function (user_response) {
                                    Const.account_owner = user_response.users[0];
                                });
                        })
                }
                if (contact_info != null && contact_info != "" && contact_info != undefined) {
                    var contact_id = contact_info.id;
                    ZOHO.CRM.API.getRecord({
                        Entity: "Contacts",
                        RecordID: contact_id
                    })
                        .then(async function (contact_req) {

                            Const.contact_data = contact_req.data[0];
                            ZOHO.CRM.API.getUser({
                                ID: Const.contact_data.Owner.id
                            })
                                .then(async function (user_response) {
                                    Const.contact_owner = user_response.users[0];
                                });
                        })
                }
            }
        })
    ZOHO.CRM.CONNECTOR.invokeAPI("crm.getorg", {}).then(async function (data) {
        var orgInfo = JSON.parse(data);
        if (orgInfo.status_code != 403) {
            orgInfo = JSON.parse(orgInfo.response).org[0];
            Const.org_data = orgInfo;
        }
    });

    ZOHO.CRM.CONFIG.getCurrentUser().then(async function (current_user) {
        current_user_id = current_user.users[0].id;
        ZOHO.CRM.API.getUser({
            ID: current_user_id
        })
            .then(function (user_req) {
                Const.user_data = user_req.users[0];
            })
    });



    ZOHO.CRM.API.getOrgVariable(Const.apinames.apiversion).then(async function (
        data
    ) {
        if (
            data.Success != undefined &&
            data.Success != "" &&
            data.Success != null
        ) {
            Const.version = JSON.parse(data.Success.Content).version;
        } else {
            Const.version = "2.0";

            var dominio =
                window.location.ancestorOrigins[0].split(".")[
                window.location.ancestorOrigins[0].split(".").length - 1
                ];
            await Utils.errorMsgMore("ErroMsgGrande", "msg-error-version", true);
            var clique_aqui = Const.desclanguage["btn-click"];
            $(".erro-version").append(
                '<a href="https://crm.zoho.' +
                dominio +
                '/crm/settings/extensions/all" target="_blank">' +
                clique_aqui +
                "!</a>"
            );
        }
    });

    await ZOHO.CRM.CONFIG.getCurrentUser().then(function (data) {
        Const.current_email = data.users[0].email;
        return ZOHO.CRM.API.getUser({
            ID: data.users[0].id
        }).then(async function (
            data
        ) {
            if (Const.languages.includes(data.users[0].language)) {
                Const.deflang = data.users[0].language;
            }
            return Utils.RenderTemplate(Const.deflang);
            //$("#allPage").show();
        });
    });

    ///////////////SELECT DEVICES////////////////
    ZOHO.CRM.API.getOrgVariable(Const.apinames.apiconfiguracao).then(async function (
        data
    ) {
        var config = JSON.parse(data.Success.Content);

        if (config.hasOwnProperty("devices")) {
            var request = {
                url: "https://api.zapphub.com/v1/devices",
                params: {
                    size: 10,
                    page: 0
                },
                headers: {
                    Token: config.token,
                },
            };
            var resp = "";
            ZOHO.CRM.HTTP.get(request).then(async function (data) {
                data = JSON.parse(data);
                var devices = config.devices;
                if (devices.length > 0) {
                    Const.newversion = true;
                    Const.fldSel =
                        '<select id="deviceSelected" class="newSelect" style="width:300px" required="true" >';

                    await create_options(devices, data, config).then(function () {
                        if (Const.lVerifyOption) {
                            Const.fldSel = Const.fldSel + "</select>";
                            $("#divDevice").html(Const.fldSel);
                            $("#deviceSelected").multipleSelect({
                                filter: true,
                            });
                            $("#showDeviceList").show();
                        } else {
                            if (!Const.lDeviceHabilitado) {
                                Utils.errorMsg(
                                    "ErroMsgGrande",
                                    "msg-error-device-app",
                                    false,
                                    true
                                );
                            } else if (!Const.lDeviceStatus) {
                                Utils.errorMsg(
                                    "ErroMsgGrande",
                                    "msg-error-device-offline",
                                    false,
                                    true
                                );
                            } else if (!Const.lAgentAllow) {
                                Utils.errorMsg(
                                    "ErroMsgGrande",
                                    "msg-error-device-agent",
                                    false,
                                    true
                                );
                            }

                        }
                    })





                } else {
                    Utils.errorMsg("ErroMsgGrande", "msg-error-device-app", false, true);
                }
            });
        } else if (config.hasOwnProperty("device_id")) {
            //CONFIGURACAO ANTIGA
        }
    });
    /////////////////////////////////////////////

    //data.org[0].currency_locale = en_US language - tratar tradução
    //ZOHO.CRM.CONFIG.getOrgInfo().then(function(data){
    //    console.log(data);
    //});
    await ZOHO.CRM.META.getModules().then(async function (data) {
        data.modules.forEach((modulo) => {
            var apimodulo = modulo.api_name;

            if (apimodulo.toLowerCase() == "leads") {
                if (!modulo.visible) {
                    $("#leadDIV").hide();
                    $("#leadbtnDIV").hide();
                    Const.enablemodule.leads = false;
                    var parameterMap = {
                        apiname: Const.apinames.apiphonelead,
                        value: Const.emptyField,
                    };
                    ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap);
                    parameterMap = {
                        apiname: Const.apinames.apileadsource,
                        value: Const.emptyField,
                    };
                    ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap);
                    parameterMap = {
                        apiname: Const.apinames.apicomportamento,
                        value: false,
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
                        value: Const.emptyField,
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
                        value: Const.emptyField,
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
                        value: Const.emptyField,
                    };
                    ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap);
                } else {
                    Const.enablemodule.deals = true;
                }
            }
        });
    });
    loadingPage();
});

ZOHO.embeddedApp.init();

async function create_options(devices, data, config) {
    for (const device of devices) {
        if (device.status) {
            Const.lDeviceHabilitado = true;
            for (const devices of data) {
                var status_device = devices.session.status;
                var device_id_device = devices.id;
                if (device_id_device == device.device_id) {
                    if (status_device == "online") {
                        Const.lDeviceStatus = true;
                        var agent_request = {
                            url: "https://api.zapphub.com/v1/devices/" + device.device_id + "/team",
                            headers: {
                                Token: config.token,
                            }
                        }
                        await ZOHO.CRM.HTTP.get(agent_request).then(function (agent_data) {
                            JSON.parse(agent_data).forEach((agent) => {
                                if (Const.current_email == "user3@demo8.otentecnologia.com.br" || Const.current_email == "projeto+show@otentecnologia.com.br") {
                                    Const.current_email = "gustavo.couto@otentecnologia.com.br";
                                }
                                if (Const.current_email == agent.email) {
                                    Const.agent_id = agent.id;
                                    Const.lAgentAllow = true;
                                    Const.lVerifyOption = true;
                                    Const.fldSel =
                                        Const.fldSel +
                                        '<option value="' +
                                        device.device_id +
                                        '">' +
                                        device.device_name +
                                        " (" +
                                        device.phone +
                                        ")</option>";
                                }
                            });
                        })

                    }
                }
            }
        }
    }
}

function loadingPage() {
    return ZOHO.CRM.API.getRecord({
        Entity: entityName,
        RecordID: entityIds,
    })
        .then(async function (record) {
            Const.record_details = record;
            //console.log(record)
            return ZOHO.CRM.META.getFields({
                Entity: entityName,
            })
                .then(async function (resp) {
                    //estrutura = "[";
                    resp.fields.forEach((field) => {
                        if (field.data_type == "phone") {
                            valor = record.data[0][field.api_name];
                            if (valor == null) {
                                valor = "Vazio";
                            }
                            //console.log(field);
                            Const.leadfieldnames.push({
                                desc: field.field_label,
                                name: field.api_name,
                                type: field.data_type,
                                module: entityName,
                                value: valor,
                            });
                            // if (!estrutura.includes("{")) {
                            //     estrutura = estrutura + "{\"api_name\":\"" + field.api_name + "\",\"name\":\"" + field.field_label + "\",\"value\":\"" + valor + "\"}";
                            // } else {
                            //     estrutura = estrutura + ",{\"api_name\":\"" + field.api_name + "\",\"name\":\"" + field.field_label + "\",\"value\":\"" + valor + "\"}";
                            // }
                        }
                    });
                    //estrutura = estrutura + "]";

                    if (entityName.toLowerCase() == "leads") {
                        //incluir funcao
                        await Utils.getTemplates(entityName);

                        await ZOHO.CRM.API.getOrgVariable(Const.apinames.apiphonelead).then(
                            function (data) {
                                Const.phonelead = JSON.parse(data.Success.Content);

                                var fldSel =
                                    '<select id="modifiedLeads" class="newSelect" onchange="changeFunc();" style="width:300px" required="true" >';
                                var id = 0;
                                for (id in Const.leadfieldnames) {
                                    var atual = Const.leadfieldnames[id];
                                    if (atual["name"] == Const.phonelead.name) {
                                        if (atual["value"].includes("Vazio")) {
                                            fldSel =
                                                fldSel +
                                                '<option value="' +
                                                atual["value"] +
                                                '" disabled>' +
                                                atual["desc"] +
                                                " (" +
                                                atual["value"] +
                                                ") </option>";
                                        } else {
                                            fldSel =
                                                fldSel +
                                                '<option value="' +
                                                atual["value"] +
                                                '" selected>' +
                                                atual["desc"] +
                                                " (" +
                                                atual["value"] +
                                                ") </option>";
                                        }
                                    } else {
                                        if (atual["value"].includes("Vazio")) {
                                            fldSel =
                                                fldSel +
                                                '<option value="' +
                                                atual["value"] +
                                                '" disabled>' +
                                                atual["desc"] +
                                                " (" +
                                                atual["value"] +
                                                ") </option>";
                                        } else {
                                            fldSel =
                                                fldSel +
                                                '<option value="' +
                                                atual["value"] +
                                                '">' +
                                                atual["desc"] +
                                                " (" +
                                                atual["value"] +
                                                ") </option>";
                                        }
                                    }
                                }
                                fldSel = fldSel + "</select>";

                                $("#leadDefault").html(fldSel);

                                $("#leadDefault").each(function () {
                                    $($(this).find("#modifiedLeads option")).each(function () {
                                        //var currentopton = $(this).val();

                                        //alert(Const.phonelead["name"]);
                                        var currentlabel = $(this)[0].label;
                                        //alert(Const.phonelead["desc"]);
                                        if (
                                            currentlabel.includes(Const.phonelead["desc"]) &&
                                            !currentlabel.includes("Vazio")
                                        ) {
                                            //$(this).attr("selected", "selected");
                                            $(this).prop("selected", true);
                                        }
                                        if (currentlabel.includes("Vazio")) {
                                            $(this).prop("selected", false);
                                        }
                                    });
                                });
                            }
                        );
                    } else if (entityName.toLowerCase() == "contacts") {
                        await Utils.getTemplates(entityName);
                        await ZOHO.CRM.API.getOrgVariable(
                            Const.apinames.apiphonecontact
                        ).then(async function (data) {
                            Const.phonelead = JSON.parse(data.Success.Content);

                            var fldSel =
                                '<select id="modifiedLeads" class="newSelect" style="width:300px" required="true" >';
                            var id = 0;
                            for (id in Const.leadfieldnames) {
                                var atual = Const.leadfieldnames[id];
                                if (atual["name"] == Const.phonelead.name) {
                                    if (atual["value"].includes("Vazio")) {
                                        fldSel =
                                            fldSel +
                                            '<option value="' +
                                            atual["value"] +
                                            '" disabled>' +
                                            atual["desc"] +
                                            " (" +
                                            atual["value"] +
                                            ") </option>";
                                    } else {
                                        fldSel =
                                            fldSel +
                                            '<option value="' +
                                            atual["value"] +
                                            '" selected>' +
                                            atual["desc"] +
                                            " (" +
                                            atual["value"] +
                                            ") </option>";
                                    }
                                } else {
                                    if (atual["value"].includes("Vazio")) {
                                        fldSel =
                                            fldSel +
                                            '<option value="' +
                                            atual["value"] +
                                            '" disabled>' +
                                            atual["desc"] +
                                            " (" +
                                            atual["value"] +
                                            ") </option>";
                                    } else {
                                        fldSel =
                                            fldSel +
                                            '<option value="' +
                                            atual["value"] +
                                            '">' +
                                            atual["desc"] +
                                            " (" +
                                            atual["value"] +
                                            ") </option>";
                                    }
                                }
                            }
                            fldSel = fldSel + "</select>";

                            $("#leadDefault").html(fldSel);

                            $("#leadDefault").each(function () {
                                $($(this).find("#modifiedLeads option")).each(function () {
                                    //var currentopton = $(this).val();

                                    //alert(Const.phonelead["name"]);
                                    var currentlabel = $(this)[0].label;
                                    //alert(Const.phonelead["desc"]);
                                    if (
                                        currentlabel.includes(Const.phonelead["desc"]) &&
                                        !currentlabel.includes("Vazio")
                                    ) {
                                        //$(this).attr("selected", "selected");
                                        $(this).prop("selected", true);
                                    }
                                    if (currentlabel.includes("Vazio")) {
                                        $(this).prop("selected", false);
                                        $(this).prop("disabled", true);
                                    }
                                });
                            });
                        });
                    } else if (entityName.toLowerCase() == "accounts") {
                        await Utils.getTemplates(entityName);
                        await ZOHO.CRM.API.getOrgVariable(
                            Const.apinames.apiphoneaccount
                        ).then(async function (data) {
                            Const.phonelead = JSON.parse(data.Success.Content);

                            var fldSel =
                                '<select id="modifiedLeads" class="newSelect" style="width:300px" required="true" >';
                            var id = 0;
                            for (id in Const.leadfieldnames) {
                                var atual = Const.leadfieldnames[id];
                                if (atual["name"] == Const.phonelead.name) {
                                    if (atual["value"].includes("Vazio")) {
                                        fldSel =
                                            fldSel +
                                            '<option value="' +
                                            atual["value"] +
                                            '" disabled>' +
                                            atual["desc"] +
                                            " (" +
                                            atual["value"] +
                                            ") </option>";
                                    } else {
                                        fldSel =
                                            fldSel +
                                            '<option value="' +
                                            atual["value"] +
                                            '" selected>' +
                                            atual["desc"] +
                                            " (" +
                                            atual["value"] +
                                            ") </option>";
                                    }
                                } else {
                                    if (atual["value"].includes("Vazio")) {
                                        fldSel =
                                            fldSel +
                                            '<option value="' +
                                            atual["value"] +
                                            '" disabled>' +
                                            atual["desc"] +
                                            " (" +
                                            atual["value"] +
                                            ") </option>";
                                    } else {
                                        fldSel =
                                            fldSel +
                                            '<option value="' +
                                            atual["value"] +
                                            '">' +
                                            atual["desc"] +
                                            " (" +
                                            atual["value"] +
                                            ") </option>";
                                    }
                                }
                            }
                            fldSel = fldSel + "</select>";

                            $("#leadDefault").html(fldSel);

                            $("#leadDefault").each(function () {
                                $($(this).find("#modifiedLeads option")).each(function () {
                                    //var currentopton = $(this).val();

                                    //alert(Const.phonelead["name"]);
                                    var currentlabel = $(this)[0].label;
                                    //alert(Const.phonelead["desc"]);
                                    if (
                                        currentlabel.includes(Const.phonelead["desc"]) &&
                                        !currentlabel.includes("Vazio")
                                    ) {
                                        //$(this).attr("selected", "selected");
                                        $(this).prop("selected", true);
                                    }
                                    if (currentlabel.includes("Vazio")) {
                                        $(this).prop("selected", false);
                                        $(this).prop("disabled", true);
                                    }
                                });
                            });
                        });
                    } else if (entityName.toLowerCase() == "deals") {
                        await Utils.getTemplates(entityName);
                        await getContactPhoneField().then(async function () {
                            await getAccountPhoneField().then(async function () {
                                await getDealPhoneField().then(async function () {
                                    await ZOHO.CRM.API.getOrgVariable(
                                        Const.apinames.apiphonedeal
                                    ).then(async function (data) {
                                        Const.phonedeal = JSON.parse(data.Success.Content);

                                        var fldSel =
                                            '<select id="modifiedLeads" class="newSelect" style="width:300px" required="true" >';

                                        if (Const.dealfieldnames.length > 0) {
                                            fldSel = fldSel + '<optgroup label="Deals">';
                                            var id = 0;
                                            for (id in Const.dealfieldnames) {
                                                var atual = Const.dealfieldnames[id];
                                                if (!atual.name.toLowerCase().includes("none")) {
                                                    if (
                                                        atual["name"] == Const.phonedeal.name &&
                                                        atual["module"] == "Deals"
                                                    ) {
                                                        fldSel =
                                                            fldSel +
                                                            '<option value="' +
                                                            atual["value"] +
                                                            '" selected data-group="' +
                                                            atual["module"] +
                                                            '">' +
                                                            atual["desc"] +
                                                            " (" +
                                                            atual["value"] +
                                                            ")" +
                                                            "</option>";
                                                    } else {
                                                        fldSel =
                                                            fldSel +
                                                            '<option value="' +
                                                            atual["value"] +
                                                            '" data-group="' +
                                                            atual["module"] +
                                                            '">' +
                                                            atual["desc"] +
                                                            " (" +
                                                            atual["value"] +
                                                            ")" +
                                                            "</option>";
                                                    }
                                                }
                                            }
                                            fldSel = fldSel + "</optgroup>";
                                        }

                                        if (Const.contactfieldnames.length > 1) {
                                            fldSel = fldSel + '<optgroup label="Contacts">';
                                            var id = 0;
                                            for (id in Const.contactfieldnames) {
                                                var atual = Const.contactfieldnames[id];
                                                if (!atual.name.toLowerCase().includes("none")) {
                                                    if (
                                                        atual["name"] == Const.phonedeal.name &&
                                                        atual["module"] == "Contacts"
                                                    ) {
                                                        fldSel =
                                                            fldSel +
                                                            '<option value="' +
                                                            atual["value"] +
                                                            '" selected data-group="' +
                                                            atual["module"] +
                                                            '">' +
                                                            atual["desc"] +
                                                            " (" +
                                                            atual["value"] +
                                                            ")" +
                                                            "</option>";
                                                    } else {
                                                        fldSel =
                                                            fldSel +
                                                            '<option value="' +
                                                            atual["value"] +
                                                            '" data-group="' +
                                                            atual["module"] +
                                                            '">' +
                                                            atual["desc"] +
                                                            " (" +
                                                            atual["value"] +
                                                            ")" +
                                                            "</option>";
                                                    }
                                                }
                                            }
                                            fldSel = fldSel + "</optgroup>";
                                        }
                                        //console.log(Const.accountfieldnames);
                                        //console.log(Const.accountfieldnames.length);
                                        if (Const.accountfieldnames.length > 0) {
                                            fldSel = fldSel + '<optgroup label="Accounts">';
                                            var id = 0;
                                            for (id in Const.accountfieldnames) {
                                                var atual = Const.accountfieldnames[id];
                                                if (!atual.name.toLowerCase().includes("none")) {
                                                    if (
                                                        atual["name"] == Const.phonedeal.name &&
                                                        atual["module"] == "Accounts"
                                                    ) {
                                                        fldSel =
                                                            fldSel +
                                                            '<option value="' +
                                                            atual["value"] +
                                                            '" selected data-group="' +
                                                            atual["module"] +
                                                            '">' +
                                                            atual["desc"] +
                                                            " (" +
                                                            atual["value"] +
                                                            ")" +
                                                            "</option>";
                                                    } else {
                                                        fldSel =
                                                            fldSel +
                                                            '<option value="' +
                                                            atual["value"] +
                                                            '" data-group="' +
                                                            atual["module"] +
                                                            '">' +
                                                            atual["desc"] +
                                                            " (" +
                                                            atual["value"] +
                                                            ")" +
                                                            "</option>";
                                                    }
                                                }
                                            }
                                            fldSel = fldSel + "</optgroup>";
                                        }

                                        fldSel = fldSel + "</select>";

                                        $("#leadDefault").html(fldSel);

                                        $("#leadDefault").each(async function () {
                                            var lContinua = true;
                                            $($(this).find("#modifiedLeads option")).each(
                                                async function () {
                                                    var currentopton = $(this).val();
                                                    console.log(currentopton);
                                                    var currdataopt = $(this).data("group");
                                                    var currentlabel = $(this)[0].label;
                                                    //console.log(currentlabel);

                                                    if (
                                                        currentlabel.includes(Const.phonedeal["desc"]) &&
                                                        !currentlabel.includes("Vazio") &&
                                                        currdataopt == Const.phonedeal["module"] &&
                                                        !currentlabel.includes("undefined")
                                                    ) {
                                                        //$(this).attr("selected", "selected");
                                                        lContinua = false;
                                                        $(this).prop("selected", true);
                                                    }
                                                    if (
                                                        currentlabel.includes("Vazio") ||
                                                        currentlabel.includes("undefined")
                                                    ) {
                                                        $(this).prop("disabled", true);
                                                    }
                                                }
                                            );
                                            if (lContinua) {
                                                $($(this).find("#modifiedLeads option")).each(
                                                    async function () {
                                                        var currentlabel = $(this)[0].label;
                                                        if (
                                                            !currentlabel.includes("Vazio") &&
                                                            !currentlabel.includes("undefined")
                                                        ) {
                                                            $(this).prop("selected", true);
                                                        }
                                                    }
                                                );
                                            }
                                        });
                                    });
                                });
                            });
                        });
                    }
                })
                .then(async function () {
                    if (Const.enablemodule.leads && Const.permissions.leads.enabled) {
                        await ZOHO.CRM.META.getFields({
                            Entity: "Leads",
                        }).then(function (data) {
                            var resp = data;
                            for (i in resp.fields) {
                                var field = resp.fields[i];
                                if (field.data_type == "phone") {
                                    Const.allfieldsleads.push({
                                        desc: resp.fields[i].field_label,
                                        name: resp.fields[i].api_name,
                                        type: resp.fields[i].data_type,
                                        module: "Leads",
                                    });
                                } else {
                                    Const.allfieldsleads.push({
                                        desc: resp.fields[i].field_label,
                                        name: resp.fields[i].api_name,
                                        type: resp.fields[i].data_type,
                                        module: "Leads",
                                    });
                                }
                            }
                        });
                    }
                    if (Const.enablemodule.contacts && Const.permissions.contacts.enabled) {
                        await ZOHO.CRM.META.getFields({
                            Entity: "Contacts",
                        }).then(function (data) {
                            var resp = data;
                            for (i in resp.fields) {
                                var field = resp.fields[i];
                                if (field.data_type == "phone") {
                                    Const.allfieldscontacts.push({
                                        desc: resp.fields[i].field_label,
                                        name: resp.fields[i].api_name,
                                        type: resp.fields[i].data_type,
                                        module: "Contacts",
                                    });
                                } else {
                                    Const.allfieldscontacts.push({
                                        desc: resp.fields[i].field_label,
                                        name: resp.fields[i].api_name,
                                        type: resp.fields[i].data_type,
                                        module: "Contacts",
                                    });
                                }
                            }
                        });
                    }
                    if (Const.enablemodule.accounts && Const.permissions.accounts.enabled) {
                        await ZOHO.CRM.META.getFields({
                            Entity: "Accounts",
                        }).then(function (data) {
                            var resp = data;
                            for (i in resp.fields) {
                                var field = resp.fields[i];
                                if (field.data_type == "phone") {
                                    Const.accountfieldnames.push({
                                        desc: resp.fields[i].field_label,
                                        name: resp.fields[i].api_name,
                                        type: resp.fields[i].data_type,
                                        module: "Accounts",
                                    });

                                    Const.allfieldsaccounts.push({
                                        desc: resp.fields[i].field_label,
                                        name: resp.fields[i].api_name,
                                        type: resp.fields[i].data_type,
                                        module: "Accounts",
                                    });
                                } else {
                                    Const.allfieldsaccounts.push({
                                        desc: resp.fields[i].field_label,
                                        name: resp.fields[i].api_name,
                                        type: resp.fields[i].data_type,
                                        module: "Accounts",
                                    });
                                }
                            }
                        });
                    }
                    if (Const.enablemodule.deals && Const.permissions.deals.enabled) {
                        await ZOHO.CRM.META.getFields({
                            Entity: "Deals",
                        }).then(function (data) {
                            var resp = data;
                            for (i in resp.fields) {
                                var field = resp.fields[i];
                                if (field.data_type == "phone") {
                                    Const.dealfieldnames.push({
                                        desc: resp.fields[i].field_label,
                                        name: resp.fields[i].api_name,
                                        type: resp.fields[i].data_type,
                                        module: "Deals",
                                    });

                                    Const.allfieldsdeals.push({
                                        desc: resp.fields[i].field_label,
                                        name: resp.fields[i].api_name,
                                        type: resp.fields[i].data_type,
                                        module: "Deals",
                                    });
                                } else {
                                    if (
                                        !field.api_name.includes("Account_Name") &&
                                        !field.api_name.includes("Contact_Name")
                                    ) {
                                        Const.allfieldsdeals.push({
                                            desc: resp.fields[i].field_label,
                                            name: resp.fields[i].api_name,
                                            type: resp.fields[i].data_type,
                                            module: "Deals",
                                        });
                                    }
                                }
                            }
                        });
                    }
                    await ZOHO.CRM.META.getFields({
                        Entity: "Users",
                    }).then(async function (data) {
                        var resp = data;
                        for (i in resp.fields) {
                            var field = resp.fields[i];
                            Const.allfieldsusers.push({
                                desc: resp.fields[i].field_label,
                                name: resp.fields[i].api_name,
                                type: resp.fields[i].data_type,
                                module: "Users",
                            });
                        }
                        return ZOHO.CRM.CONNECTOR.invokeAPI("crm.getorg", {})
                            .then(function (data) {
                                var orgInfo = JSON.parse(data);
                                if (orgInfo.status_code != 403) {
                                    orgInfo = JSON.parse(orgInfo.response).org[0];
                                    //console.log(orgInfo);
                                    Object.keys(orgInfo).forEach((apiName) => {
                                        var nome = apiName
                                            .replace(/_/g, " ")
                                            .replace("/n", "")
                                            .split(" ");
                                        var palavra = "";
                                        nome.forEach((word) => {
                                            palavra =
                                                palavra +
                                                word.charAt(0).toUpperCase() +
                                                word.slice(1) +
                                                " ";
                                        });

                                        //console.log(palavra.trim());
                                        Const.allfieldsorgs.push({
                                            desc: palavra.trim(),
                                            name: apiName,
                                            type: "text",
                                            module: "Orgs",
                                        });
                                    });
                                }
                            })
                            .then(async function () {
                                activeFields2();
                                activeFields();
                                document.addEventListener("click", (evt) => {
                                    const flyoutElement = document.getElementById(
                                        "templateMergeValuesDIV"
                                    );

                                    let targetElement = evt.target; // clicked element

                                    do {
                                        if (targetElement == flyoutElement) {
                                            // This is a click inside. Do nothing, just return.

                                            return;
                                        }
                                        // Go up the DOM
                                        targetElement = targetElement.parentNode;
                                    } while (targetElement);

                                    const flyoutElement2 = document.getElementById(
                                        "templateMergeValuesDIV2"
                                    );

                                    let targetElement2 = evt.target; // clicked element

                                    do {
                                        if (targetElement2 == flyoutElement2) {
                                            // This is a click inside. Do nothing, just return.

                                            return;
                                        }
                                        // Go up the DOM
                                        targetElement2 = targetElement2.parentNode;
                                    } while (targetElement2);
                                    // This is a click outside.
                                    $("#templateMergeValuesDIV").hide();
                                    $("#templateMergeValuesDIV2").hide();

                                    var contentArea = $("#textCreate").val();
                                    if (contentArea == undefined) {
                                        contentArea = "";
                                    }
                                    if (contentArea.includes("#")) {
                                        //(contentArea.includes("#")) {
                                        $("#textCreate").val(contentArea.replace("#", ""));
                                        $("#textCreate").focus();
                                    }

                                    var contentArea2 = $("textarea#textMsg").val();
                                    if (contentArea2 == undefined) {
                                        contentArea2 = "";
                                    }
                                    if (contentArea2.includes("#")) {
                                        //(contentArea.includes("#")) {
                                        $("textarea#textMsg").val(contentArea2.replace("#", ""));
                                        $("#textMsg").focus();
                                    }
                                });
                            });
                    });
                }).catch(err => {
                    //CASO OCORRA ERRO DE PERMISSÃO DE ACESSO A ALGUM MÓDULO IRÁ CONSTRUIR UMA DIV COM UMA MENSAGEM DE ERRO
                    if (err.code === "NO_PERMISSION") {
                        const app = document.querySelector('#app');
                        app.classList.add('d-none');

                        const main = document.createElement('div');
                        main.className = 'container text-center mt-2';

                        const msg_erro = document.querySelector('#msg-erro');
                        const div = document.createElement('div');
                        div.className = 'alert alert-danger';
                        div.textContent = Const.desclanguage["msg-no-permission"]

                        main.appendChild(div);
                        msg_erro.appendChild(main);

                        ZOHO.CRM.UI.Resize({ height: "90", width: "740" });
                    }
                });
        })
        .then(function () {
            $(document).ready(function () {
                $("#cont")
                    .delay(2000)
                    .slideUp(function () {
                        $("#app").slideDown();
                        $(function () {
                            $("#selTemplate").multipleSelect({
                                filter: true,
                                onClick: function (view) {
                                    var message = view.value;
                                    $("textarea#textMsg").val("");
                                    changeFunc(message);
                                },
                                /*onAfterCreate: function() {
                                                $("#tempSelect").children().find("ul").parent().append('<div style="text-align: center;border-top: solid 0.1px;border-color: #d4d4d8;"><a href="#" onclick="criaTemplate()"><label class=""><span style="cursor:pointer;">Criar Template</span></label></a></div>');
                                            }*/
                            });
                        });
                        $("#modifiedLeads").multipleSelect({
                            filter: true,
                            onAfterCreate: function () {
                                $("#tempSelect")
                                    .children()
                                    .find("ul")
                                    .parent()
                                    .append(
                                        '<div style="text-align: center;border-top: solid 0.1px;border-color: #d4d4d8;"><a href="#" onclick="criaTemplate()"><label class=""><span style="cursor:pointer;">' +
                                        Const.desclanguage["send-message-link-template"] +
                                        "</span></label></a></div>"
                                    );
                            },
                        });
                        $("#modulesSelect").multipleSelect({
                            filter: true,
                        });
                    }); //document.getElementById("loader").classList.remove("is-active");
            });
        });
}

async function getDealPhoneField() {
    await ZOHO.CRM.META.getFields({
        Entity: "Deals",
    }).then(async function (data) {
        var resp = data;
        await ZOHO.CRM.API.getRecord({
            Entity: "Deals",
            RecordID: Const.idModulo,
        }).then(async function (deal) {
            var i = 0;
            for (i in resp.fields) {
                var field = resp.fields[i];
                if (field.data_type == "phone") {
                    apiField = field.api_name;
                    valor = deal.data[0][apiField];
                    if (valor === null || valor === "") {
                        valor = "Vazio";
                    }
                    Const.dealfieldnames.push({
                        desc: resp.fields[i].field_label,
                        name: resp.fields[i].api_name,
                        type: resp.fields[i].data_type,
                        module: "Deals",
                        value: valor,
                    });
                }
            }
        });
    });
}

async function getContactPhoneField() {
    if (Const.enablemodule.contacts && Const.permissions.contacts.enabled) {
        await ZOHO.CRM.META.getFields({
            Entity: "Contacts",
        }).then(async function (data) {
            var resp = data;
            idContact = Const.record_details.data[0].Contact_Name;
            var valor;
            if (idContact !== null && idContact !== "") {
                idContact = idContact.id;
            } else {
                valor = "Vazio";
            }
            await ZOHO.CRM.API.getRecord({
                Entity: "Contacts",
                RecordID: idContact,
            }).then(async function (contact) {
                var i = 0;
                for (i in resp.fields) {
                    var field = resp.fields[i];
                    if (field.data_type == "phone") {
                        apiField = field.api_name;
                        valor = contact.data[0][apiField];
                        if (valor === null || valor === "") {
                            valor = "Vazio";
                        }
                        Const.contactfieldnames.push({
                            desc: resp.fields[i].field_label,
                            name: resp.fields[i].api_name,
                            type: resp.fields[i].data_type,
                            module: "Contacts",
                            value: valor,
                        });
                    }
                }
            });
        });
    }
}

async function getAccountPhoneField() {
    if (Const.enablemodule.accounts && Const.permissions.accounts.enabled) {
        await ZOHO.CRM.API.getOrgVariable(Const.apinames.apiphoneaccount).then(
            async function (data) {
                Const.phoneaccount = JSON.parse(data.Success.Content);
                ZOHO.CRM.META.getFields({
                    Entity: "Accounts",
                }).then(async function (data) {
                    var resp = data;
                    idAccount = Const.record_details.data[0].Account_Name;
                    var valor;
                    if (idAccount !== null && idAccount !== "") {
                        idAccount = idAccount.id;
                    } else {
                        valor = "Vazio";
                    }
                    await ZOHO.CRM.API.getRecord({
                        Entity: "Accounts",
                        RecordID: idAccount,
                    }).then(async function (account) {
                        var i = 0;
                        for (i in resp.fields) {
                            var field = resp.fields[i];
                            if (field.data_type == "phone") {
                                apiField = resp.fields[i].api_name;
                                valor = account.data[0][apiField];
                                if (valor === null || valor === "") {
                                    valor = "Vazio";
                                }
                                Const.accountfieldnames.push({
                                    desc: resp.fields[i].field_label,
                                    name: resp.fields[i].api_name,
                                    type: resp.fields[i].data_type,
                                    module: "Accounts",
                                    value: valor,
                                });
                            }
                        }
                    });
                });
            }
        );
    }
}

function moduleLoading() {
    optionSelected = $("#modulesSelect").val();
    $("#textCreate").val("");
    if (optionSelected.toLowerCase().includes("vazio")) {
        $("#linhaTextArea").hide();
        $("#createTemp").hide();
    } else {
        $("#linhaTextArea").show();
        $("#createTemp").show();
    }
    activeFields();
}

function criarTemplate() {
    var lContinua = true;

    var txtMSG = DOMPurify.sanitize($("#textCreate").val(), Const.configPurify);
    var myINPUT = DOMPurify.sanitize($("#myInput").val(), Const.configPurify);
    var selModule = DOMPurify.sanitize(
        $("#modulesSelect").val(),
        Const.configPurify
    );

    if (txtMSG == null || txtMSG == "") {
        $("#textEmpty2").show();
        $("#textCreate").addClass("texterror");
        lContinua = false;
    } else {
        $("#textEmpty2").hide();
        $("#textCreate").removeClass("texterror");
    }

    if (myINPUT == null || myINPUT == "") {
        $("#myInput").removeClass("inputtext");
        $("#fieldEmpty").show();
        $("#myInput").addClass("texterror");
        lContinua = false;
    } else {
        $("#fieldEmpty").hide();
        $("#myInput").removeClass("texterror");
        $("#myInput").addClass("inputtext");
    }

    if (selModule.includes("Vazio")) {
        $("#selectEmpty").show();
        lContinua = false;
    } else {
        $("#selectEmpty").hide();
    }

    if (lContinua) {
        var recordData = {
            Name: myINPUT,
            whatsapphubforzohocrm__Module: selModule,
            whatsapphubforzohocrm__Message: txtMSG,
        };

        ZOHO.CRM.API.insertRecord({
            Entity: "whatsapphubforzohocrm__WhatsApp_Templates",
            APIData: recordData,
            Trigger: ["workflow"],
        }).then(function (data) {
            //console.log(data);
            if (
                data.data[0].details.id != null &&
                data.data[0].details.id != undefined &&
                data.data[0].details.id != ""
            ) {
                //await Utils.getTemplates(entityName);
                //$("#selTemplate").multipleSelect('destroy');
                //var optionSel = '<option value="' + $("#textCreate").val() + '">' + $("#myInput").val() + '</option>'
                var $opt = $("<option />", {
                    value: DOMPurify.sanitize($("#textCreate").val(), Const.configPurify),
                    text: DOMPurify.sanitize($("#myInput").val(), Const.configPurify),
                });
                $opt.prop("selected", true);
                $("#selTemplate option:first").after($opt);
                $("#selTemplate").multipleSelect("refresh");
                changeFunc($("#textCreate").val());
                $("#myInput").val("");
                $("#textCreate").val("");
                Utils.successMsg(
                    "SuccessMsg",
                    "msg-success-template",
                    false,
                    false,
                    fechaTemplate
                );
                /*$('#SuccessMsg').find('.sucesText').html("Template criado com sucesso.");
                        $('#SuccessMsg').slideDown(function() {
                            $('#SuccessMsg').delay(3000).slideUp(function() {
                                $("#myForm").slideUp();
                            });
                        });*/
            } else {
                Utils.errorMsg(
                    "ErroMsg",
                    "msg-error-template",
                    false,
                    false,
                    erroTemplate
                );
                /*$('#ErroMsg').find('.error').html("Erro na criação do template, tente novamente.");
                        $('#ErroMsg').slideDown(function() {
                            $('#ErroMsg').delay(3000).slideUp(function() {
                                $("#myInput").val("");
                                $("#textCreate").val("");
                                $("#myForm").slideUp();
                            });
                        });*/
            }
            //document.location.href = document.location.href;
        });
    }
}

function activeFields2() {
    //console.log("2")
    optionSelected = Const.entityName;
    if (optionSelected.toLowerCase() == "leads") {
        $("#textMsg").on("keydown", function (e) {
            if ((e.which == 51 || e.which == 222) && e.key == "#") {
                //shift+#

                var fldSel =
                    '<select id="moduleOptions2" data-zcqa="moduleOptions2" tabindex="-1" class="newSelect" aria-hidden="true" onchange="Utils.selectFields2()">';
                fldSel =
                    fldSel +
                    '<option value="Leads" type="system" selected>Leads</option>';
                fldSel = fldSel + '<option value="Users" type="system">Users</option>';
                fldSel =
                    fldSel + '<option value="Orgs" type="system">Organization</option>';
                fldSel = fldSel + "</select>";
                $("#moduleOptionsList2").html(fldSel);

                var ulFld = "";

                if (Const.allfieldsleads.length > 0) {
                    ulFld =
                        ulFld +
                        '<ul class="modulesFields m0 p0 colfff fontSmooth" modname="' +
                        Const.allfieldsleads[0]["module"] +
                        '" data-zcqa="system_' +
                        Const.allfieldsleads[0]["module"] +
                        '_ModuleFields2" id="system_' +
                        Const.allfieldsleads[0]["module"] +
                        '_ModuleFields2" style="display: block;" >';

                    for (id in Const.allfieldsleads) {
                        var atual = Const.allfieldsleads[id];

                        ulFld =
                            ulFld +
                            '<li class="mergeOptions colfff cP pT5 pB5 pR20" val="' +
                            atual["module"].toLowerCase().slice(0, -1) +
                            "." +
                            atual["name"] +
                            '" onclick="Utils.setMergeModules(this)">' +
                            atual["desc"] +
                            "</li>";
                    }

                    ulFld = ulFld + "</ul>";
                }
                if (Const.allfieldsusers.length > 0) {
                    ulFld =
                        ulFld +
                        '<ul class="modulesFields m0 p0 colfff fontSmooth" modname="' +
                        Const.allfieldsusers[0]["module"] +
                        '" data-zcqa="system_' +
                        Const.allfieldsusers[0]["module"] +
                        '_ModuleFields2" id="system_' +
                        Const.allfieldsusers[0]["module"] +
                        '_ModuleFields2" style="display: none;" >';

                    for (id in Const.allfieldsusers) {
                        var atual = Const.allfieldsusers[id];

                        ulFld =
                            ulFld +
                            '<li class="mergeOptions colfff cP pT5 pB5 pR20" val="' +
                            atual["module"].toLowerCase().slice(0, -1) +
                            "." +
                            atual["name"] +
                            '" onclick="Utils.setMergeModules(this)">' +
                            atual["desc"] +
                            "</li>";
                    }

                    ulFld = ulFld + "</ul>";
                }
                if (Const.allfieldsorgs.length > 0) {
                    ulFld =
                        ulFld +
                        '<ul class="modulesFields m0 p0 colfff fontSmooth" modname="' +
                        Const.allfieldsorgs[0]["module"] +
                        '" data-zcqa="system_' +
                        Const.allfieldsorgs[0]["module"] +
                        '_ModuleFields2" id="system_' +
                        Const.allfieldsorgs[0]["module"] +
                        '_ModuleFields2" style="display: none;" >';

                    for (id in Const.allfieldsorgs) {
                        var atual = Const.allfieldsorgs[id];

                        ulFld =
                            ulFld +
                            '<li class="mergeOptions colfff cP pT5 pB5 pR20" val="' +
                            atual["module"].toLowerCase().slice(0, -1) +
                            "." +
                            atual["name"] +
                            '" onclick="Utils.setMergeModules(this)">' +
                            atual["desc"] +
                            "</li>";
                    }

                    ulFld = ulFld + "</ul>";
                }

                $(".oA2").html(ulFld);

                var pos = $(this).getCaretPosition();
                pos.top = getLineNumber("textMsg");
                pos.left = getColumnNumber(
                    "textMsg",
                    pos.left,
                    "templateMergeValuesDIV2"
                );
                var tamTop = e.target.offsetTop + pos.top;
                var tamLeft = e.target.offsetLeft + pos.left + 15;

                $("#templateMergeValuesDIV2").hide();
                $("#templateMergeValuesDIV2").css({
                    top: tamTop,
                    left: tamLeft,
                    position: "absolute",
                    border: "1px solid black",
                });

                $("#templateMergeValuesDIV2").show();
            } else if (e.which == 8 || e.which == 27) {
                $("#templateMergeValuesDIV2").hide();
                var contentArea = $("textarea#textMsg").val();
                if (contentArea.includes("#")) {
                    $("textarea#textMsg").val(contentArea.replace("#", ""));
                    $("#textMsg").focus();
                }
            }
        });
    } else if (optionSelected.toLowerCase() == "contacts") {
        $("#textMsg").on("keydown", function (e) {
            if ((e.which == 51 || e.which == 222) && e.key == "#") {
                //shift+#

                var fldSel =
                    '<select id="moduleOptions2" data-zcqa="moduleOptions2" tabindex="-1" class="newSelect" aria-hidden="true" onchange="Utils.selectFields2()">';
                fldSel =
                    fldSel +
                    '<option value="Contacts" type="system" selected>Contacts</option>';
                fldSel = fldSel + '<option value="Users" type="system">Users</option>';
                fldSel =
                    fldSel + '<option value="Orgs" type="system">Organization</option>';
                fldSel = fldSel + "</select>";
                $("#moduleOptionsList2").html(fldSel);

                var ulFld = "";

                if (Const.allfieldscontacts.length > 0) {
                    ulFld =
                        ulFld +
                        '<ul class="modulesFields m0 p0 colfff fontSmooth" modname="' +
                        Const.allfieldscontacts[0]["module"] +
                        '" data-zcqa="system_' +
                        Const.allfieldscontacts[0]["module"] +
                        '_ModuleFields2" id="system_' +
                        Const.allfieldscontacts[0]["module"] +
                        '_ModuleFields2" style="display: block;" >';

                    for (id in Const.allfieldscontacts) {
                        var atual = Const.allfieldscontacts[id];

                        ulFld =
                            ulFld +
                            '<li class="mergeOptions colfff cP pT5 pB5 pR20" val="' +
                            atual["module"].toLowerCase().slice(0, -1) +
                            "." +
                            atual["name"] +
                            '" onclick="Utils.setMergeModules(this)">' +
                            atual["desc"] +
                            "</li>";
                    }

                    ulFld = ulFld + "</ul>";
                }
                if (Const.allfieldsusers.length > 0) {
                    ulFld =
                        ulFld +
                        '<ul class="modulesFields m0 p0 colfff fontSmooth" modname="' +
                        Const.allfieldsusers[0]["module"] +
                        '" data-zcqa="system_' +
                        Const.allfieldsusers[0]["module"] +
                        '_ModuleFields2" id="system_' +
                        Const.allfieldsusers[0]["module"] +
                        '_ModuleFields2" style="display: none;" >';

                    for (id in Const.allfieldsusers) {
                        var atual = Const.allfieldsusers[id];

                        ulFld =
                            ulFld +
                            '<li class="mergeOptions colfff cP pT5 pB5 pR20" val="' +
                            atual["module"].toLowerCase().slice(0, -1) +
                            "." +
                            atual["name"] +
                            '" onclick="Utils.setMergeModules(this)">' +
                            atual["desc"] +
                            "</li>";
                    }

                    ulFld = ulFld + "</ul>";
                }
                if (Const.allfieldsorgs.length > 0) {
                    ulFld =
                        ulFld +
                        '<ul class="modulesFields m0 p0 colfff fontSmooth" modname="' +
                        Const.allfieldsorgs[0]["module"] +
                        '" data-zcqa="system_' +
                        Const.allfieldsorgs[0]["module"] +
                        '_ModuleFields2" id="system_' +
                        Const.allfieldsorgs[0]["module"] +
                        '_ModuleFields2" style="display: none;" >';

                    for (id in Const.allfieldsorgs) {
                        var atual = Const.allfieldsorgs[id];

                        ulFld =
                            ulFld +
                            '<li class="mergeOptions colfff cP pT5 pB5 pR20" val="' +
                            atual["module"].toLowerCase().slice(0, -1) +
                            "." +
                            atual["name"] +
                            '" onclick="Utils.setMergeModules(this)">' +
                            atual["desc"] +
                            "</li>";
                    }

                    ulFld = ulFld + "</ul>";
                }

                $(".oA2").html(ulFld);

                var pos = $(this).getCaretPosition();

                pos.top = getLineNumber("textMsg");
                pos.left = getColumnNumber(
                    "textMsg",
                    pos.left,
                    "templateMergeValuesDIV2"
                );
                var tamTop = e.target.offsetTop + pos.top + 15;
                var tamLeft = e.target.offsetLeft + pos.left + 20;

                $("#templateMergeValuesDIV2").hide();
                $("#templateMergeValuesDIV2").css({
                    top: tamTop,
                    left: tamLeft,
                    position: "absolute",
                    border: "1px solid black",
                });
                $("#templateMergeValuesDIV2").show();
            } else if (e.which == 8 || e.which == 27) {
                $("#templateMergeValuesDIV2").hide();
                var contentArea = $("#textMsg").val();
                if (contentArea.includes("#")) {
                    $("textarea#textMsg").val(contentArea.replace("#", ""));
                    $("#textMsg").focus();
                }
            }
        });
    } else if (optionSelected.toLowerCase() == "accounts") {
        $("#textMsg").on("keydown", function (e) {
            if ((e.which == 51 || e.which == 222) && e.key == "#") {
                //shift+#

                var fldSel =
                    '<select id="moduleOptions2" data-zcqa="moduleOptions2" tabindex="-1" class="newSelect" aria-hidden="true" onchange="Utils.selectFields2()">';
                fldSel =
                    fldSel +
                    '<option value="Accounts" type="system" selected>Accounts</option>';
                fldSel = fldSel + '<option value="Users" type="system">Users</option>';
                fldSel =
                    fldSel + '<option value="Orgs" type="system">Organization</option>';
                fldSel = fldSel + "</select>";
                $("#moduleOptionsList2").html(fldSel);

                var ulFld = "";

                if (Const.allfieldsaccounts.length > 0) {
                    ulFld =
                        ulFld +
                        '<ul class="modulesFields m0 p0 colfff fontSmooth" modname="' +
                        Const.allfieldsaccounts[0]["module"] +
                        '" data-zcqa="system_' +
                        Const.allfieldsaccounts[0]["module"] +
                        '_ModuleFields2" id="system_' +
                        Const.allfieldsaccounts[0]["module"] +
                        '_ModuleFields2" style="display: block;" >';

                    for (id in Const.allfieldsaccounts) {
                        var atual = Const.allfieldsaccounts[id];

                        ulFld =
                            ulFld +
                            '<li class="mergeOptions colfff cP pT5 pB5 pR20" val="' +
                            atual["module"].toLowerCase().slice(0, -1) +
                            "." +
                            atual["name"] +
                            '" onclick="Utils.setMergeModules(this)">' +
                            atual["desc"] +
                            "</li>";
                    }

                    ulFld = ulFld + "</ul>";
                }
                if (Const.allfieldsusers.length > 0) {
                    ulFld =
                        ulFld +
                        '<ul class="modulesFields m0 p0 colfff fontSmooth" modname="' +
                        Const.allfieldsusers[0]["module"] +
                        '" data-zcqa="system_' +
                        Const.allfieldsusers[0]["module"] +
                        '_ModuleFields2" id="system_' +
                        Const.allfieldsusers[0]["module"] +
                        '_ModuleFields2" style="display: none;" >';

                    for (id in Const.allfieldsusers) {
                        var atual = Const.allfieldsusers[id];

                        ulFld =
                            ulFld +
                            '<li class="mergeOptions colfff cP pT5 pB5 pR20" val="' +
                            atual["module"].toLowerCase().slice(0, -1) +
                            "." +
                            atual["name"] +
                            '" onclick="Utils.setMergeModules(this)">' +
                            atual["desc"] +
                            "</li>";
                    }

                    ulFld = ulFld + "</ul>";
                }
                if (Const.allfieldsorgs.length > 0) {
                    ulFld =
                        ulFld +
                        '<ul class="modulesFields m0 p0 colfff fontSmooth" modname="' +
                        Const.allfieldsorgs[0]["module"] +
                        '" data-zcqa="system_' +
                        Const.allfieldsorgs[0]["module"] +
                        '_ModuleFields2" id="system_' +
                        Const.allfieldsorgs[0]["module"] +
                        '_ModuleFields2" style="display: none;" >';

                    for (id in Const.allfieldsorgs) {
                        var atual = Const.allfieldsorgs[id];

                        ulFld =
                            ulFld +
                            '<li class="mergeOptions colfff cP pT5 pB5 pR20" val="' +
                            atual["module"].toLowerCase().slice(0, -1) +
                            "." +
                            atual["name"] +
                            '" onclick="Utils.setMergeModules(this)">' +
                            atual["desc"] +
                            "</li>";
                    }

                    ulFld = ulFld + "</ul>";
                }

                $(".oA2").html(ulFld);

                var pos = $(this).getCaretPosition();

                pos.top = getLineNumber("textMsg");
                pos.left = getColumnNumber(
                    "textMsg",
                    pos.left,
                    "templateMergeValuesDIV2"
                );
                var tamTop = e.target.offsetTop + pos.top + 15;
                var tamLeft = e.target.offsetLeft + pos.left + 20;

                $("#templateMergeValuesDIV2").hide();
                $("#templateMergeValuesDIV2").css({
                    top: tamTop,
                    left: tamLeft,
                    position: "absolute",
                    border: "1px solid black",
                });
                $("#templateMergeValuesDIV2").show();
            } else if (e.which == 8 || e.which == 27) {
                $("#templateMergeValuesDIV2").hide();
                var contentArea = $("textarea").val();
                if (contentArea.includes("#")) {
                    $("textarea#textMsg").val(contentArea.replace("#", ""));
                    $("#textMsg").focus();
                }
            }
        });
    } else if (optionSelected.toLowerCase() == "deals") {
        $("#textMsg").on("keydown", function (e) {
            if ((e.which == 51 || e.which == 222) && e.key == "#") {
                //shift+#

                var fldSel =
                    '<select id="moduleOptions2" data-zcqa="moduleOptions2" tabindex="-1" class="newSelect" aria-hidden="true" onchange="Utils.selectFields2()">';
                fldSel =
                    fldSel +
                    '<option value="Deals" type="system" selected>Deals</option>';
                if (Const.enablemodule.accounts) {
                    fldSel =
                        fldSel + '<option value="Accounts" type="system">Accounts</option>';
                }
                if (Const.enablemodule.contacts) {
                    fldSel =
                        fldSel + '<option value="Contacts" type="system">Contacts</option>';
                }
                fldSel = fldSel + '<option value="Users" type="system">Users</option>';
                fldSel =
                    fldSel + '<option value="Orgs" type="system">Organization</option>';
                fldSel = fldSel + "</select>";
                $("#moduleOptionsList2").html(fldSel);
                $(function () {
                    $("moduleOptions2").multipleSelect({
                        filter: true,
                    });
                });

                var ulFld = "";

                if (Const.allfieldsdeals.length > 0) {
                    ulFld =
                        ulFld +
                        '<ul class="modulesFields m0 p0 colfff fontSmooth" modname="' +
                        Const.allfieldsdeals[0]["module"] +
                        '" data-zcqa="system_' +
                        Const.allfieldsdeals[0]["module"] +
                        '_ModuleFields2" id="system_' +
                        Const.allfieldsdeals[0]["module"] +
                        '_ModuleFields2" style="display: block;" >';

                    for (id in Const.allfieldsdeals) {
                        var atual = Const.allfieldsdeals[id];

                        ulFld =
                            ulFld +
                            '<li class="mergeOptions colfff cP pT5 pB5 pR20" val="' +
                            atual["module"].toLowerCase().slice(0, -1) +
                            "." +
                            atual["name"] +
                            '" onclick="Utils.setMergeModules(this)">' +
                            atual["desc"] +
                            "</li>";
                    }

                    ulFld = ulFld + "</ul>";
                }
                if (Const.allfieldsaccounts.length > 0) {
                    ulFld =
                        ulFld +
                        '<ul class="modulesFields m0 p0 colfff fontSmooth" modname="' +
                        Const.allfieldsaccounts[0]["module"] +
                        '" data-zcqa="system_' +
                        Const.allfieldsaccounts[0]["module"] +
                        '_ModuleFields2" id="system_' +
                        Const.allfieldsaccounts[0]["module"] +
                        '_ModuleFields2" style="display: none;" >';

                    for (id in Const.allfieldsaccounts) {
                        var atual = Const.allfieldsaccounts[id];

                        ulFld =
                            ulFld +
                            '<li class="mergeOptions colfff cP pT5 pB5 pR20" val="' +
                            atual["module"].toLowerCase().slice(0, -1) +
                            "." +
                            atual["name"] +
                            '" onclick="Utils.setMergeModules(this)">' +
                            atual["desc"] +
                            "</li>";
                    }

                    ulFld = ulFld + "</ul>";
                }
                if (Const.allfieldscontacts.length > 0) {
                    ulFld =
                        ulFld +
                        '<ul class="modulesFields m0 p0 colfff fontSmooth" modname="' +
                        Const.allfieldscontacts[0]["module"] +
                        '" data-zcqa="system_' +
                        Const.allfieldscontacts[0]["module"] +
                        '_ModuleFields2" id="system_' +
                        Const.allfieldscontacts[0]["module"] +
                        '_ModuleFields2" style="display: none;" >';

                    for (id in Const.allfieldscontacts) {
                        var atual = Const.allfieldscontacts[id];

                        ulFld =
                            ulFld +
                            '<li class="mergeOptions colfff cP pT5 pB5 pR20" val="' +
                            atual["module"].toLowerCase().slice(0, -1) +
                            "." +
                            atual["name"] +
                            '" onclick="Utils.setMergeModules(this)">' +
                            atual["desc"] +
                            "</li>";
                    }

                    ulFld = ulFld + "</ul>";
                }
                if (Const.allfieldsusers.length > 0) {
                    ulFld =
                        ulFld +
                        '<ul class="modulesFields m0 p0 colfff fontSmooth" modname="' +
                        Const.allfieldsusers[0]["module"] +
                        '" data-zcqa="system_' +
                        Const.allfieldsusers[0]["module"] +
                        '_ModuleFields2" id="system_' +
                        Const.allfieldsusers[0]["module"] +
                        '_ModuleFields2" style="display: none;" >';

                    for (id in Const.allfieldsusers) {
                        var atual = Const.allfieldsusers[id];

                        ulFld =
                            ulFld +
                            '<li class="mergeOptions colfff cP pT5 pB5 pR20" val="' +
                            atual["module"].toLowerCase().slice(0, -1) +
                            "." +
                            atual["name"] +
                            '" onclick="Utils.setMergeModules(this)">' +
                            atual["desc"] +
                            "</li>";
                    }

                    ulFld = ulFld + "</ul>";
                }
                if (Const.allfieldsorgs.length > 0) {
                    ulFld =
                        ulFld +
                        '<ul class="modulesFields m0 p0 colfff fontSmooth" modname="' +
                        Const.allfieldsorgs[0]["module"] +
                        '" data-zcqa="system_' +
                        Const.allfieldsorgs[0]["module"] +
                        '_ModuleFields2" id="system_' +
                        Const.allfieldsorgs[0]["module"] +
                        '_ModuleFields2" style="display: none;" >';

                    for (id in Const.allfieldsorgs) {
                        var atual = Const.allfieldsorgs[id];

                        ulFld =
                            ulFld +
                            '<li class="mergeOptions colfff cP pT5 pB5 pR20" val="' +
                            atual["module"].toLowerCase().slice(0, -1) +
                            "." +
                            atual["name"] +
                            '" onclick="Utils.setMergeModules(this)">' +
                            atual["desc"] +
                            "</li>";
                    }

                    ulFld = ulFld + "</ul>";
                }

                $(".oA2").html(ulFld);

                var pos = $(this).getCaretPosition();

                pos.top = getLineNumber("textMsg");
                pos.left = getColumnNumber(
                    "textMsg",
                    pos.left,
                    "templateMergeValuesDIV2"
                );
                var tamTop = e.target.offsetTop + pos.top + 15;
                var tamLeft = e.target.offsetLeft + pos.left + 20;

                $("#templateMergeValuesDIV2").hide();
                $("#templateMergeValuesDIV2").css({
                    top: tamTop,
                    left: tamLeft,
                    position: "absolute",
                    border: "1px solid black",
                });
                $("#templateMergeValuesDIV2").show();
            } else if (e.which == 8 || e.which == 27) {
                $("#templateMergeValuesDIV2").hide();
                var contentArea = $("textarea#textMsg").val();
                if (contentArea.includes("#")) {
                    $("textarea#textMsg").val(contentArea.replace("#", ""));
                    $("#textMsg").focus();
                }
            }
        });
    }
}

function activeFields() {
    //console.log("1")
    optionSelected = $("#modulesSelect").val();
    if (optionSelected.toLowerCase() == "leads") {
        $("#textCreate").on("keydown", function (e) {
            if ((e.which == 51 || e.which == 222) && e.key == "#") {
                //} && e.val().includes("#")) { //shift+#

                var fldSel =
                    '<select id="moduleOptions" data-zcqa="moduleOptions" tabindex="-1" class="newSelect" aria-hidden="true" onchange="Utils.selectFields()">';
                fldSel =
                    fldSel +
                    '<option value="Leads" type="system" selected>Leads</option>';
                fldSel = fldSel + '<option value="Users" type="system">Users</option>';
                fldSel =
                    fldSel + '<option value="Orgs" type="system">Organization</option>';
                fldSel = fldSel + "</select>";
                $("#moduleOptionsList").html(fldSel);

                var ulFld = "";

                if (Const.allfieldsleads.length > 0) {
                    ulFld =
                        ulFld +
                        '<ul class="modulesFields m0 p0 colfff fontSmooth" modname="' +
                        Const.allfieldsleads[0]["module"] +
                        '" data-zcqa="system_' +
                        Const.allfieldsleads[0]["module"] +
                        '_ModuleFields" id="system_' +
                        Const.allfieldsleads[0]["module"] +
                        '_ModuleFields" style="display: block;" >';

                    for (id in Const.allfieldsleads) {
                        var atual = Const.allfieldsleads[id];

                        ulFld =
                            ulFld +
                            '<li class="mergeOptions colfff cP pT5 pB5 pR20" val="' +
                            atual["module"].toLowerCase().slice(0, -1) +
                            "." +
                            atual["name"] +
                            '" onclick="Utils.setMergeLead(this)">' +
                            atual["desc"] +
                            "</li>";
                    }

                    ulFld = ulFld + "</ul>";
                }
                if (Const.allfieldsusers.length > 0) {
                    ulFld =
                        ulFld +
                        '<ul class="modulesFields m0 p0 colfff fontSmooth" modname="' +
                        Const.allfieldsusers[0]["module"] +
                        '" data-zcqa="system_' +
                        Const.allfieldsusers[0]["module"] +
                        '_ModuleFields" id="system_' +
                        Const.allfieldsusers[0]["module"] +
                        '_ModuleFields" style="display: none;" >';

                    for (id in Const.allfieldsusers) {
                        var atual = Const.allfieldsusers[id];

                        ulFld =
                            ulFld +
                            '<li class="mergeOptions colfff cP pT5 pB5 pR20" val="' +
                            atual["module"].toLowerCase().slice(0, -1) +
                            "." +
                            atual["name"] +
                            '" onclick="Utils.setMergeLead(this)">' +
                            atual["desc"] +
                            "</li>";
                    }

                    ulFld = ulFld + "</ul>";
                }
                if (Const.allfieldsorgs.length > 0) {
                    ulFld =
                        ulFld +
                        '<ul class="modulesFields m0 p0 colfff fontSmooth" modname="' +
                        Const.allfieldsorgs[0]["module"] +
                        '" data-zcqa="system_' +
                        Const.allfieldsorgs[0]["module"] +
                        '_ModuleFields" id="system_' +
                        Const.allfieldsorgs[0]["module"] +
                        '_ModuleFields" style="display: none;" >';

                    for (id in Const.allfieldsorgs) {
                        var atual = Const.allfieldsorgs[id];

                        ulFld =
                            ulFld +
                            '<li class="mergeOptions colfff cP pT5 pB5 pR20" val="' +
                            atual["module"].toLowerCase().slice(0, -1) +
                            "." +
                            atual["name"] +
                            '" onclick="Utils.setMergeLead(this)">' +
                            atual["desc"] +
                            "</li>";
                    }

                    ulFld = ulFld + "</ul>";
                }

                $(".oA").html(ulFld);

                var pos = $(this).getCaretPosition();
                pos.top = getLineNumber("textCreate");
                pos.left = getColumnNumber(
                    "textCreate",
                    pos.left,
                    "templateMergeValuesDIV"
                );
                $("#templateMergeValuesDIV").hide();
                $("#templateMergeValuesDIV").css({
                    top: e.target.offsetTop + pos.top + $("#textCreate").offset().top,
                    left: e.target.offsetLeft + pos.left + $("#textCreate").offset().left,
                    position: "absolute",
                    border: "1px solid black",
                });
                $("#templateMergeValuesDIV").show();
            } else if (e.which == 8 || e.which == 27) {
                $("#templateMergeValuesDIV").hide();
                var contentArea = $("#textCreate").val();
                if (contentArea.includes("#")) {
                    $("#textCreate").val(contentArea.replace("#", ""));
                    $("#textCreate").focus();
                }
            }
        });
    } else if (optionSelected.toLowerCase() == "contacts") {
        $("#textCreate").on("keydown", function (e) {
            if ((e.which == 51 || e.which == 222) && e.key == "#") {
                //shift+#

                var fldSel =
                    '<select id="moduleOptions" data-zcqa="moduleOptions" tabindex="-1" class="newSelect" aria-hidden="true" onchange="Utils.selectFields()">';
                fldSel =
                    fldSel +
                    '<option value="Contacts" type="system" selected>Contacts</option>';
                fldSel = fldSel + '<option value="Users" type="system">Users</option>';
                fldSel =
                    fldSel + '<option value="Orgs" type="system">Organization</option>';
                fldSel = fldSel + "</select>";
                $("#moduleOptionsList").html(fldSel);

                var ulFld = "";

                if (Const.allfieldscontacts.length > 0) {
                    ulFld =
                        ulFld +
                        '<ul class="modulesFields m0 p0 colfff fontSmooth" modname="' +
                        Const.allfieldscontacts[0]["module"] +
                        '" data-zcqa="system_' +
                        Const.allfieldscontacts[0]["module"] +
                        '_ModuleFields" id="system_' +
                        Const.allfieldscontacts[0]["module"] +
                        '_ModuleFields" style="display: block;" >';

                    for (id in Const.allfieldscontacts) {
                        var atual = Const.allfieldscontacts[id];

                        ulFld =
                            ulFld +
                            '<li class="mergeOptions colfff cP pT5 pB5 pR20" val="' +
                            atual["module"].toLowerCase().slice(0, -1) +
                            "." +
                            atual["name"] +
                            '" onclick="Utils.setMergeContact(this)">' +
                            atual["desc"] +
                            "</li>";
                    }

                    ulFld = ulFld + "</ul>";
                }
                if (Const.allfieldsusers.length > 0) {
                    ulFld =
                        ulFld +
                        '<ul class="modulesFields m0 p0 colfff fontSmooth" modname="' +
                        Const.allfieldsusers[0]["module"] +
                        '" data-zcqa="system_' +
                        Const.allfieldsusers[0]["module"] +
                        '_ModuleFields" id="system_' +
                        Const.allfieldsusers[0]["module"] +
                        '_ModuleFields" style="display: none;" >';

                    for (id in Const.allfieldsusers) {
                        var atual = Const.allfieldsusers[id];

                        ulFld =
                            ulFld +
                            '<li class="mergeOptions colfff cP pT5 pB5 pR20" val="' +
                            atual["module"].toLowerCase().slice(0, -1) +
                            "." +
                            atual["name"] +
                            '" onclick="Utils.setMergeContact(this)">' +
                            atual["desc"] +
                            "</li>";
                    }

                    ulFld = ulFld + "</ul>";
                }
                if (Const.allfieldsorgs.length > 0) {
                    ulFld =
                        ulFld +
                        '<ul class="modulesFields m0 p0 colfff fontSmooth" modname="' +
                        Const.allfieldsorgs[0]["module"] +
                        '" data-zcqa="system_' +
                        Const.allfieldsorgs[0]["module"] +
                        '_ModuleFields" id="system_' +
                        Const.allfieldsorgs[0]["module"] +
                        '_ModuleFields" style="display: none;" >';

                    for (id in Const.allfieldsorgs) {
                        var atual = Const.allfieldsorgs[id];

                        ulFld =
                            ulFld +
                            '<li class="mergeOptions colfff cP pT5 pB5 pR20" val="' +
                            atual["module"].toLowerCase().slice(0, -1) +
                            "." +
                            atual["name"] +
                            '" onclick="Utils.setMergeContact(this)">' +
                            atual["desc"] +
                            "</li>";
                    }

                    ulFld = ulFld + "</ul>";
                }

                $(".oA").html(ulFld);

                var pos = $(this).getCaretPosition();
                pos.top = getLineNumber("textCreate");
                pos.left = getColumnNumber(
                    "textCreate",
                    pos.left,
                    "templateMergeValuesDIV"
                );
                $("#templateMergeValuesDIV").hide();
                $("#templateMergeValuesDIV").css({
                    top: e.target.offsetTop + pos.top + +$("#textCreate").offset().top,
                    left: e.target.offsetLeft + pos.left + +$("#textCreate").offset().left,
                    position: "absolute",
                    border: "1px solid black",
                });
                $("#templateMergeValuesDIV").show();
            } else if (e.which == 8 || e.which == 27) {
                $("#templateMergeValuesDIV").hide();
                var contentArea = $("#textCreate").val();
                if (contentArea.includes("#")) {
                    $("#textCreate").val(contentArea.replace("#", ""));
                    $("#textCreate").focus();
                }
            }
        });
    } else if (optionSelected.toLowerCase() == "accounts") {
        $("#textCreate").on("keydown", function (e) {
            if ((e.which == 51 || e.which == 222) && e.key == "#") {
                //shift+#

                var fldSel =
                    '<select id="moduleOptions" data-zcqa="moduleOptions" tabindex="-1" class="newSelect" aria-hidden="true" onchange="Utils.selectFields()">';
                fldSel =
                    fldSel +
                    '<option value="Accounts" type="system" selected>Accounts</option>';
                fldSel = fldSel + '<option value="Users" type="system">Users</option>';
                fldSel =
                    fldSel + '<option value="Orgs" type="system">Organization</option>';
                fldSel = fldSel + "</select>";
                $("#moduleOptionsList").html(fldSel);

                var ulFld = "";

                if (Const.allfieldsaccounts.length > 0) {
                    ulFld =
                        ulFld +
                        '<ul class="modulesFields m0 p0 colfff fontSmooth" modname="' +
                        Const.allfieldsaccounts[0]["module"] +
                        '" data-zcqa="system_' +
                        Const.allfieldsaccounts[0]["module"] +
                        '_ModuleFields" id="system_' +
                        Const.allfieldsaccounts[0]["module"] +
                        '_ModuleFields" style="display: block;" >';

                    for (id in Const.allfieldsaccounts) {
                        var atual = Const.allfieldsaccounts[id];

                        ulFld =
                            ulFld +
                            '<li class="mergeOptions colfff cP pT5 pB5 pR20" val="' +
                            atual["module"].toLowerCase().slice(0, -1) +
                            "." +
                            atual["name"] +
                            '" onclick="Utils.setMergeAccount(this)">' +
                            atual["desc"] +
                            "</li>";
                    }

                    ulFld = ulFld + "</ul>";
                }
                if (Const.allfieldsusers.length > 0) {
                    ulFld =
                        ulFld +
                        '<ul class="modulesFields m0 p0 colfff fontSmooth" modname="' +
                        Const.allfieldsusers[0]["module"] +
                        '" data-zcqa="system_' +
                        Const.allfieldsusers[0]["module"] +
                        '_ModuleFields" id="system_' +
                        Const.allfieldsusers[0]["module"] +
                        '_ModuleFields" style="display: none;" >';

                    for (id in Const.allfieldsusers) {
                        var atual = Const.allfieldsusers[id];

                        ulFld =
                            ulFld +
                            '<li class="mergeOptions colfff cP pT5 pB5 pR20" val="' +
                            atual["module"].toLowerCase().slice(0, -1) +
                            "." +
                            atual["name"] +
                            '" onclick="Utils.setMergeAccount(this)">' +
                            atual["desc"] +
                            "</li>";
                    }

                    ulFld = ulFld + "</ul>";
                }
                if (Const.allfieldsorgs.length > 0) {
                    ulFld =
                        ulFld +
                        '<ul class="modulesFields m0 p0 colfff fontSmooth" modname="' +
                        Const.allfieldsorgs[0]["module"] +
                        '" data-zcqa="system_' +
                        Const.allfieldsorgs[0]["module"] +
                        '_ModuleFields" id="system_' +
                        Const.allfieldsorgs[0]["module"] +
                        '_ModuleFields" style="display: none;" >';

                    for (id in Const.allfieldsorgs) {
                        var atual = Const.allfieldsorgs[id];

                        ulFld =
                            ulFld +
                            '<li class="mergeOptions colfff cP pT5 pB5 pR20" val="' +
                            atual["module"].toLowerCase().slice(0, -1) +
                            "." +
                            atual["name"] +
                            '" onclick="Utils.setMergeAccount(this)">' +
                            atual["desc"] +
                            "</li>";
                    }

                    ulFld = ulFld + "</ul>";
                }

                $(".oA").html(ulFld);

                var pos = $(this).getCaretPosition();
                pos.top = getLineNumber("textCreate");
                pos.left = getColumnNumber(
                    "textCreate",
                    pos.left,
                    "templateMergeValuesDIV"
                );
                $("#templateMergeValuesDIV").hide();
                $("#templateMergeValuesDIV").css({
                    top: e.target.offsetTop + pos.top + +$("#textCreate").offset().top,
                    left: e.target.offsetLeft + pos.left + +$("#textCreate").offset().left,
                    position: "absolute",
                    border: "1px solid black",
                });
                $("#templateMergeValuesDIV").show();
            } else if (e.which == 8 || e.which == 27) {
                $("#templateMergeValuesDIV").hide();
                var contentArea = $("#textCreate").val();
                if (contentArea.includes("#")) {
                    $("#textCreate").val(contentArea.replace("#", ""));
                    $("#textCreate").focus();
                }
            }
        });
    } else if (optionSelected.toLowerCase() == "deals") {
        $("#textCreate").on("keydown", function (e) {
            if ((e.which == 51 || e.which == 222) && e.key == "#") {
                //shift+#

                var fldSel =
                    '<select id="moduleOptions" data-zcqa="moduleOptions" tabindex="-1" class="newSelect" aria-hidden="true" onchange="Utils.selectFields()">';
                fldSel =
                    fldSel +
                    '<option value="Deals" type="system" selected>Deals</option>';
                if (Const.enablemodule.accounts) {
                    fldSel =
                        fldSel + '<option value="Accounts" type="system">Accounts</option>';
                }
                if (Const.enablemodule.contacts) {
                    fldSel =
                        fldSel + '<option value="Contacts" type="system">Contacts</option>';
                }
                fldSel = fldSel + '<option value="Users" type="system">Users</option>';
                fldSel =
                    fldSel + '<option value="Orgs" type="system">Organization</option>';
                fldSel = fldSel + "</select>";
                $("#moduleOptionsList").html(fldSel);
                $(function () {
                    $("moduleOptions").multipleSelect({
                        filter: true,
                    });
                });

                var ulFld = "";

                if (Const.allfieldsdeals.length > 0) {
                    ulFld =
                        ulFld +
                        '<ul class="modulesFields m0 p0 colfff fontSmooth" modname="' +
                        Const.allfieldsdeals[0]["module"] +
                        '" data-zcqa="system_' +
                        Const.allfieldsdeals[0]["module"] +
                        '_ModuleFields" id="system_' +
                        Const.allfieldsdeals[0]["module"] +
                        '_ModuleFields" style="display: block;" >';

                    for (id in Const.allfieldsdeals) {
                        var atual = Const.allfieldsdeals[id];

                        ulFld =
                            ulFld +
                            '<li class="mergeOptions colfff cP pT5 pB5 pR20" val="' +
                            atual["module"].toLowerCase().slice(0, -1) +
                            "." +
                            atual["name"] +
                            '" onclick="Utils.setMergeDeal(this)">' +
                            atual["desc"] +
                            "</li>";
                    }

                    ulFld = ulFld + "</ul>";
                }
                if (Const.allfieldsaccounts.length > 0) {
                    ulFld =
                        ulFld +
                        '<ul class="modulesFields m0 p0 colfff fontSmooth" modname="' +
                        Const.allfieldsaccounts[0]["module"] +
                        '" data-zcqa="system_' +
                        Const.allfieldsaccounts[0]["module"] +
                        '_ModuleFields" id="system_' +
                        Const.allfieldsaccounts[0]["module"] +
                        '_ModuleFields" style="display: none;" >';

                    for (id in Const.allfieldsaccounts) {
                        var atual = Const.allfieldsaccounts[id];

                        ulFld =
                            ulFld +
                            '<li class="mergeOptions colfff cP pT5 pB5 pR20" val="' +
                            atual["module"].toLowerCase().slice(0, -1) +
                            "." +
                            atual["name"] +
                            '" onclick="Utils.setMergeDeal(this)">' +
                            atual["desc"] +
                            "</li>";
                    }

                    ulFld = ulFld + "</ul>";
                }
                if (Const.allfieldscontacts.length > 0) {
                    ulFld =
                        ulFld +
                        '<ul class="modulesFields m0 p0 colfff fontSmooth" modname="' +
                        Const.allfieldscontacts[0]["module"] +
                        '" data-zcqa="system_' +
                        Const.allfieldscontacts[0]["module"] +
                        '_ModuleFields" id="system_' +
                        Const.allfieldscontacts[0]["module"] +
                        '_ModuleFields" style="display: none;" >';

                    for (id in Const.allfieldscontacts) {
                        var atual = Const.allfieldscontacts[id];

                        ulFld =
                            ulFld +
                            '<li class="mergeOptions colfff cP pT5 pB5 pR20" val="' +
                            atual["module"].toLowerCase().slice(0, -1) +
                            "." +
                            atual["name"] +
                            '" onclick="Utils.setMergeDeal(this)">' +
                            atual["desc"] +
                            "</li>";
                    }

                    ulFld = ulFld + "</ul>";
                }
                if (Const.allfieldsusers.length > 0) {
                    ulFld =
                        ulFld +
                        '<ul class="modulesFields m0 p0 colfff fontSmooth" modname="' +
                        Const.allfieldsusers[0]["module"] +
                        '" data-zcqa="system_' +
                        Const.allfieldsusers[0]["module"] +
                        '_ModuleFields" id="system_' +
                        Const.allfieldsusers[0]["module"] +
                        '_ModuleFields" style="display: none;" >';

                    for (id in Const.allfieldsusers) {
                        var atual = Const.allfieldsusers[id];

                        ulFld =
                            ulFld +
                            '<li class="mergeOptions colfff cP pT5 pB5 pR20" val="' +
                            atual["module"].toLowerCase().slice(0, -1) +
                            "." +
                            atual["name"] +
                            '" onclick="Utils.setMergeDeal(this)">' +
                            atual["desc"] +
                            "</li>";
                    }

                    ulFld = ulFld + "</ul>";
                }
                if (Const.allfieldsorgs.length > 0) {
                    ulFld =
                        ulFld +
                        '<ul class="modulesFields m0 p0 colfff fontSmooth" modname="' +
                        Const.allfieldsorgs[0]["module"] +
                        '" data-zcqa="system_' +
                        Const.allfieldsorgs[0]["module"] +
                        '_ModuleFields" id="system_' +
                        Const.allfieldsorgs[0]["module"] +
                        '_ModuleFields" style="display: none;" >';

                    for (id in Const.allfieldsorgs) {
                        var atual = Const.allfieldsorgs[id];

                        ulFld =
                            ulFld +
                            '<li class="mergeOptions colfff cP pT5 pB5 pR20" val="' +
                            atual["module"].toLowerCase().slice(0, -1) +
                            "." +
                            atual["name"] +
                            '" onclick="Utils.setMergeDeal(this)">' +
                            atual["desc"] +
                            "</li>";
                    }

                    ulFld = ulFld + "</ul>";
                }

                $(".oA").html(ulFld);

                var pos = $(this).getCaretPosition();
                pos.top = getLineNumber("textCreate");
                pos.left = getColumnNumber(
                    "textCreate",
                    pos.left,
                    "templateMergeValuesDIV"
                );
                var tamTop =
                    e.target.offsetTop + pos.top + $("#textCreate").offset().top;
                var tamLeft =
                    e.target.offsetLeft + pos.left + $("#textCreate").offset().left;

                $("#templateMergeValuesDIV").hide();
                $("#templateMergeValuesDIV").css({
                    top: tamTop,
                    left: tamLeft,
                    position: "absolute",
                    border: "1px solid black",
                });
                $("#templateMergeValuesDIV").show();
            } else if (e.which == 8 || e.which == 27) {
                $("#templateMergeValuesDIV").hide();
                var contentArea = $("#textCreate").val();
                if (contentArea.includes("#")) {
                    $("#textCreate").val(contentArea.replace("#", ""));
                    $("#textCreate").focus();
                }
            }
        });
    }
}

function getLineNumber(idtextarea) {
    textarea = document.getElementById(idtextarea);
    var indicador = 1;
    var linha = textarea.value
        .substr(0, textarea.selectionStart)
        .split("\n").length;
    if (idtextarea == "textCreate") {
        if (linha > 10) {
            indicador = 264;
        } else {
            indicador = linha * 24;
        }
    } else {
        if (linha == 1) {
            indicador = 36;
        } else if (linha == 2) {
            indicador = 59;
        } else if (linha == 3) {
            indicador = 84;
        } else if (linha == 4) {
            indicador = 104;
        } else if (linha == 5) {
            indicador = 130;
        } else if (linha == 6) {
            indicador = 154;
        } else if (linha == 7) {
            indicador = 180;
        } else if (linha == 8) {
            indicador = 204;
        } else if (linha == 9) {
            indicador = 224;
        } else if (linha == 10) {
            indicador = 250;
        } else {
            indicador = 282;
        }
    }
    return indicador;
}

function getColumnNumber(idtextarea, posleft, divpop) {
    var textarea = $("#" + idtextarea).val();

    var ret = 0;
    if (idtextarea == "textMsg") {
        if (posleft > 285) {
            ret = posleft - 230;
            var triangulo = $("#" + divpop)
                .find("i")
                .css({
                    right: "6px",
                    left: "auto",
                });
        } else {
            ret = posleft;
            var triangulo = $("#" + divpop)
                .find("i")
                .css({
                    left: "6px",
                    right: "auto",
                });
        }
    } else {
        if (posleft > 165) {
            ret = posleft - 210;
            var triangulo = $("#" + divpop)
                .find("i")
                .css({
                    right: "6px",
                    left: "auto",
                });
        } else {
            ret = posleft;
            var triangulo = $("#" + divpop)
                .find("i")
                .css({
                    left: "6px",
                    right: "auto",
                });
        }
    }

    return ret;
}

function erroTemplate() {
    $("#myInput").val("");
    $("#textCreate").val("");
    $("#myForm").slideUp();
}

function reloadWebtab() {
    location.reload();
}

function fechaTemplate() {
    $("#myForm").slideUp();
    $("textarea#textCreate").val("");
    $("#myInput").val("");
    $("#modulesSelect").val("Vazio");
}

function criaTemplate() {
    $("#myForm").slideDown();
    $("#selTemplate").multipleSelect("close");
    $("#modulesSelect option").each(function () {
        var currentopton = $(this).val();

        if (currentopton == entityName) {
            $("#modulesSelect").multipleSelect("setSelects", currentopton);
            activeFields();
        }
    });
}

async function changeFunc(message) {
    var main_msg = message;
    $("textarea#textMsg").val(main_msg);
    message = message.replace(/\r?\n|\r/g, " ");
    message = message.replace(/[&\/\\#,+()$~%'":*?!<>{}]/g, "");
    lista_message = message.split(" ");
    for (i in lista_message) {
        if (lista_message[i].includes(".") && (lista_message[i].includes("lead") || lista_message[i].includes("contact") || lista_message[i].includes("account") || lista_message[i].includes("deal") || lista_message[i].includes("user") || lista_message[i].includes("org")) && !lista_message[i].includes("https")) {
            var module_name = lista_message[i].split(".")[0];
            var api_name = lista_message[i].split(".")[1];
            var valor_field = Const[module_name + "_data"][api_name];
            if (valor_field != null && valor_field != "" && valor_field != undefined) {
                if (typeof valor_field != "string" && typeof valor_field != "number") {
                    if (lista_message[i].split(".").length == 2) {
                        valor_field = valor_field.name;
                    } else {
                        if (lista_message[i].includes(".Owner.mobile") || lista_message[i].includes(".Owner.phone")) {
                            valor_field = Const[module_name + "_owner"][lista_message[i].split(".")[2]];
                        } else {
                            valor_field = valor_field.name[lista_message[i].split(".")[2]];
                        }
                    }
                } else {
                    valor_field = String(valor_field);
                }
            } else {
                valor_field = "";
            }
            if (valor_field != null && valor_field != undefined && valor_field != "") {
                if (valor_field.includes("-")) {
                    if (valor_field.split("-").length == 3 || valor_field.split("-").length == 4) {
                        var createdata = Const.user_data.date_format;
                        var i = 0;
                        var data_separada = valor_field.split("-");
                        for (x in data_separada) {
                            var data = data_separada[x];
                            var y = parseInt(x) + 1;
                            if (y == 1) {
                                createdata = createdata.replace("yyyy", data);
                            } else if (y == 2) {
                                createdata = createdata.replace("MM", data);
                            } else if (y == 3) {
                                createdata = createdata.replace(
                                    "dd",
                                    data.slice(0, 2)
                                );
                                if (data.includes("T")) {
                                    createdata = createdata + " " + data.slice(3, 11);
                                }
                            }
                        };
                        valor_field = createdata;
                    }
                }

            } else {
                valor_field = "";
            }
            main_msg = main_msg.replace(lista_message[i], valor_field);
        }
    }
    $("textarea#textMsg").val(main_msg);
}

async function sendMsg() {
    $("#newLoad").show();
    $(".btn-primary").attr("disabled", true);
    var numCel = $("#leadDefault option:selected").val();
    var msg = $("textarea#textMsg").val();
    var continua = true;

    await ZOHO.CRM.API.getOrgVariable(Const.apinames.apiurlbase).then(
        async function (data) {
            Const.apiurlbase = data.Success.Content;
        }
    );

    if (numCel != null && numCel != "") {
        numCel = numCel
            .replace("(", "")
            .replace(")", "")
            .replace("-", "")
            .replace("+", "")
            .replace("|", "")
            .replace("/", "")
            .replace(" ", "")
            .trim();

        var func_name = "whatsapphubforzohocrm__validphonenumber";
        var req_data = {
            record: JSON.stringify({
                phone: numCel
            }),
            phoneAPI: "phone",
            ddi: "",
        };

        await ZOHO.CRM.FUNCTIONS.execute(func_name, req_data).then(function (data) {
            if (data.code == "success" && data.details.output != undefined) {
                if (JSON.parse(data.details.output).status == "error") {
                    continua = false;
                    $("#newLoad").hide();
                    Utils.errorMsg("ErroMsg", "msg-error-invalid-num", false, false);
                }
            }
        });

        if (continua) {
            if (msg != null && msg != "") {
                return ZOHO.CRM.API.getOrgVariable(Const.apinames.apiconfiguracao).then(
                    function (data) {
                        var resp = data.Success.Content;
                        resp = JSON.parse(resp);
                        if (typeof resp == 'string') {
                            resp = JSON.parse(resp);
                        }
                        var appName = resp.aplicativo;
                        var tokenApp = resp.token;
                        if (tokenApp !== null && tokenApp !== "") {
                            zapphubmsg = msg;
                            msg = encodeURI(msg);
                            var reqUrl = "";
                            if (appName == "zapbox") {
                                reqUrl =
                                    Const.apiurlbase +
                                    "/send/" +
                                    tokenApp +
                                    "?cmd=chat&id=" +
                                    Const.entityName.toLowerCase() +
                                    "-" +
                                    Const.idModulo +
                                    "&to=" +
                                    numCel +
                                    "@c.us&msg=" +
                                    msg;
                                var request = {
                                    url: reqUrl,
                                };
                                ZOHO.CRM.HTTP.get(request).then(function (res) {
                                    res = JSON.parse(res);
                                    if (JSON.stringify(res).toLowerCase().includes("servidor")) {
                                        $("#newLoad").hide();
                                        Utils.successMsg(
                                            "SuccessMsg",
                                            "msg-success-sent-message",
                                            false,
                                            true
                                        );
                                    } else {
                                        $("#newLoad").hide();
                                        Utils.errorMsg("ErroMsg", "msg-error-server", false, true);
                                    }
                                });
                            } else if (appName == "zapphub") {
                                //body: '{"phone":"' + numCel + '","message":"' + walimsg + '","reference":"' + Const.entityName.toLowerCase() + "-" + Const.idModulo + '","device_id":"' + resp.device_id + '"}',
                                var zapphubmsg = decodeURI(msg).replace(/\n/gi, "\\n");
                                if (!Const.newversion) {
                                    var request = {
                                        url: "https://api.zapphub.com/v1/messages",
                                        params: {},
                                        body: '{"phone":"' +
                                            numCel +
                                            '","agent":"' + Const.agent_id + '","message":"' +
                                            zapphubmsg +
                                            '","reference":"' +
                                            Const.entityName.toLowerCase() +
                                            "-" +
                                            Const.idModulo +
                                            '","device":"' +
                                            resp.device_id +
                                            '","enqueue":"opportunistic", "retries":0}',
                                        headers: {
                                            "Content-Type": "application/json",
                                            Token: tokenApp,
                                        },
                                    };
                                } else {
                                    var new_device_id = $(
                                        "#deviceSelected option:selected"
                                    ).val();

                                    var request = {
                                        url: "https://api.zapphub.com/v1/messages",
                                        params: {},
                                        body: '{"phone":"' +
                                            numCel +
                                            '","message":"' +
                                            zapphubmsg +
                                            '","agent":"' + Const.agent_id + '","reference":"' +
                                            Const.entityName.toLowerCase() +
                                            "-" +
                                            Const.idModulo +
                                            '","device":"' +
                                            new_device_id +
                                            '","enqueue":"opportunistic", "retries":0}',
                                        headers: {
                                            "Content-Type": "application/json",
                                            Token: tokenApp,
                                        },
                                    };
                                }

                                return ZOHO.CRM.HTTP.post(request).then(function (data) {
                                    var updAgent = {
                                        url: "https://api.zapphub.com/v1/chat/" + new_device_id + "/chats/"+ numCel+ "/owner",
                                        params: {},
                                        body: '{"email":"'+Const.current_email+'"}',
                                        headers: {
                                            "Content-Type": "application/json",
                                            Token: tokenApp,
                                        },
                                    };
                                    ZOHO.CRM.HTTP.patch(updAgent);
                                    console.log(data);
                                    data = JSON.parse(data);
                                    console.log(data);
                                    if (data.status == "queued" || data.status == "processed") {
                                        $("#newLoad").hide();
                                        Utils.successMsg(
                                            "SuccessMsg",
                                            "msg-success-sent-message",
                                            false,
                                            true
                                        );
                                    } else {
                                        //msg-error-send-message
                                        $("#newLoad").hide();
                                        Utils.errorMsg("ErroMsg", "msg-error-send-message");
                                    }
                                });
                            } else {
                                $("#newLoad").hide();
                                Utils.errorMsg("ErroMsg", "msg-error-sel-app", false, true);
                            }
                        } else {
                            $("#newLoad").hide();
                            Utils.errorMsg("ErroMsg", "msg-error-token-app", false, true);
                        }
                    }
                );
            } else {
                $("#newLoad").hide();
                Utils.errorMsg("ErroMsg", "msg-error-null-msg", false, false);
            }
        }
    } else {
        $("#newLoad").hide();
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
        if (!("maxlength" in el)) {
            var max = el.attributes.maxLength.value;
            el.onkeypress = function () {
                if (this.value.length >= max) return false;
            };
        }
    }
}

maxLength(document.getElementById("textMsg"));

Utils = {};

Utils.setMergeLead = function (e) {
    var contentArea = $("#textCreate").val();

    $("#textCreate").val(contentArea.replace("#", e.getAttribute("val")));
    $("#templateMergeValuesDIV").hide();
    $("#textCreate").focus();
};

Utils.setMergeContact = function (e) {
    var contentArea = $("#textCreate").val();
    $("#textCreate").val(contentArea.replace("#", e.getAttribute("val")));
    $("#templateMergeValuesDIV").hide();
    $("#textCreate").focus();
};

Utils.setMergeAccount = function (e) {
    var contentArea = $("#textCreate").val();
    $("#textCreate").val(contentArea.replace("#", e.getAttribute("val")));
    $("#templateMergeValuesDIV").hide();
    $("#textCreate").focus();
};

Utils.setMergeModules = function (e) {
    var content_area = $("textarea#textMsg").val();
    var content_text = e.getAttribute("val");
    var module_name = content_text.split(".")[0];
    var api_name = content_text.split(".")[1];
    var valor_field = Const[module_name + "_data"][api_name];
    if (valor_field != null && valor_field != "" && valor_field != undefined) {
        if (typeof valor_field != "string" && typeof valor_field != "number") {
            valor_field = valor_field.name;
        } else {
            valor_field = String(valor_field);
        }
    } else {
        valor_field = "";
    }
    if (valor_field != null && valor_field != undefined && valor_field != "") {
        if (valor_field.includes("-")) {
            if (valor_field.split("-").length == 3 || valor_field.split("-").length == 4) {
                var createdata = Const.user_data.date_format;
                var i = 0;
                var data_separada = valor_field.split("-");
                for (x in data_separada) {
                    var data = data_separada[x];
                    var y = parseInt(x) + 1;
                    if (y == 1) {
                        createdata = createdata.replace("yyyy", data);
                    } else if (y == 2) {
                        createdata = createdata.replace("MM", data);
                    } else if (y == 3) {
                        createdata = createdata.replace(
                            "dd",
                            data.slice(0, 2)
                        );
                        if (data.includes("T")) {
                            createdata = createdata + " " + data.slice(3, 11);
                        }
                    }
                };
                valor_field = createdata;
            }
        }
    } else {
        valor_field = "";
    }
    $("textarea#textMsg").val(content_area.replace("#", valor_field));
    $("#templateMergeValuesDIV2").hide();
    $("#textMsg").focus();
};

Utils.setMergeDeal = function (e) {
    var contentArea = $("#textCreate").val();
    $("#textCreate").val(contentArea.replace("#", e.getAttribute("val")));
    $("#templateMergeValuesDIV").hide();
    $("#textCreate").focus();
};


Utils.selectFields = function () {
    var content = $("#moduleOptions").val();
    $("#system_Leads_ModuleFields").hide();
    $("#system_Users_ModuleFields").hide();
    $("#system_Orgs_ModuleFields").hide();
    $("#system_Accounts_ModuleFields").hide();
    $("#system_Contacts_ModuleFields").hide();
    $("#system_Deals_ModuleFields").hide();
    if (content.toLowerCase() == "leads") {
        $("#system_Leads_ModuleFields").show();
    } else if (content.toLowerCase() == "users") {
        $("#system_Users_ModuleFields").show();
    } else if (content.toLowerCase() == "orgs") {
        $("#system_Orgs_ModuleFields").show();
    } else if (content.toLowerCase() == "accounts") {
        $("#system_Accounts_ModuleFields").show();
    } else if (content.toLowerCase() == "contacts") {
        $("#system_Contacts_ModuleFields").show();
    } else if (content.toLowerCase() == "deals") {
        $("#system_Deals_ModuleFields").show();
    }
};

Utils.selectFields2 = function () {
    var content = $("#moduleOptions2").val();
    $("#system_Leads_ModuleFields2").hide();
    $("#system_Users_ModuleFields2").hide();
    $("#system_Orgs_ModuleFields2").hide();
    $("#system_Accounts_ModuleFields2").hide();
    $("#system_Contacts_ModuleFields2").hide();
    $("#system_Deals_ModuleFields2").hide();
    if (content.toLowerCase() == "leads") {
        $("#system_Leads_ModuleFields2").show();
    } else if (content.toLowerCase() == "users") {
        $("#system_Users_ModuleFields2").show();
    } else if (content.toLowerCase() == "orgs") {
        $("#system_Orgs_ModuleFields2").show();
    } else if (content.toLowerCase() == "accounts") {
        $("#system_Accounts_ModuleFields2").show();
    } else if (content.toLowerCase() == "contacts") {
        $("#system_Contacts_ModuleFields2").show();
    } else if (content.toLowerCase() == "deals") {
        $("#system_Deals_ModuleFields2").show();
    }
};

Utils.getTemplates = function (entityName) {
    ZOHO.CRM.API.searchRecord({
        Entity: Const.apinames.apitemplate,
        Type: "criteria",
        Query: "(whatsapphubforzohocrm__Module:equals:" + entityName + ")",
    }).then(function (data) {
        //console.log(data);
        var fldSel =
            '<select id="selTemplate" class="newSelect" style="width:300px" required="true" ><option value="Vazio">-None-</option>';
        if (data.data != null && data.data != "" && data.data != undefined) {
            data.data.forEach((template) => {
                //console.log(template.whatsapphubforzohocrm__Message)
                fldSel =
                    fldSel +
                    '<option value="' +
                    template.whatsapphubforzohocrm__Message +
                    '">' +
                    template.Name +
                    "</option>";
            });
        }
        fldSel = fldSel + "</select>";

        $("#tempSelect").html(fldSel);
    });
    $("#selTemplate").multipleSelect({
        filter: true,
    });
};

//Utils.successMsg("SuccessMsg","msg-success-setup");
Utils.successMsg = function (
    id,
    message,
    reload = false,
    close = false,
    refreshback = null
) {
    $("#" + id + " .sucesText").text(Const.desclanguage[message]);
    $("#" + id).slideDown(function () {
        $("#" + id)
            .delay(3000)
            .slideUp(function () {
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
};

//Utils.errorMsg("ErroMsg","msg-error-setup");
Utils.errorMsg = function (
    id,
    message,
    reload = false,
    close = false,
    refreshback = null
) {
    $("#" + id + " .erroText").text(Const.desclanguage[message]);
    $("#" + id).slideDown(function () {
        $("#" + id)
            .delay(3000)
            .slideUp(function () {
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
};

Utils.RenderTemplate = async function (lang) {
    //console.log(data);
    await $.getJSON("../translations/" + lang + ".json", function (data) {
        Const.desclanguage = data;
        $("[key='translate']").each(function () {
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
};

function typeBold() {
    var textSelected = getSelectionText();

    var curPos = document.getElementById("textMsg").selectionStart;
    let text_to_insert = "";
    let x = $("#textMsg").val();
    if (textSelected != "" && textSelected != null && textSelected != undefined) {
        getSel("*", "textMsg");
    } else {
        text_to_insert = "*<bold>*";
        $("#textMsg").val(x.slice(0, curPos) + text_to_insert + x.slice(curPos));
    }
}

function typeItalico() {
    var textSelected = getSelectionText();

    var curPos = document.getElementById("textMsg").selectionStart;
    let text_to_insert = "";
    let x = $("#textMsg").val();
    if (textSelected != "" && textSelected != null && textSelected != undefined) {
        getSel("_", "textMsg");
    } else {
        text_to_insert = "_<italic>_";
        $("#textMsg").val(x.slice(0, curPos) + text_to_insert + x.slice(curPos));
    }
}

function typeCitacao() {
    var textSelected = getSelectionText();

    var curPos = document.getElementById("textMsg").selectionStart;
    let text_to_insert = "";
    let x = $("#textMsg").val();
    if (textSelected != "" && textSelected != null && textSelected != undefined) {
        getSel("```", "textMsg");
    } else {
        text_to_insert = "```<quote>```";
        $("#textMsg").val(
            x.slice(0, curPos) + text_to_insert.trim() + x.slice(curPos)
        );
    }
}

function typeStrike() {
    var textSelected = getSelectionText();

    var curPos = document.getElementById("textMsg").selectionStart;
    let text_to_insert = "";
    let x = $("#textMsg").val();
    if (textSelected != "" && textSelected != null && textSelected != undefined) {
        getSel("~", "textMsg");
    } else {
        text_to_insert = "~<strike>~";
        $("#textMsg").val(x.slice(0, curPos) + text_to_insert + x.slice(curPos));
    }
}

function makeAttachment() {
    $("#alertWarning").slideDown(function () {
        $("#alertWarning").delay(3000).slideUp();
    });
}

function typeBoldTemp() {
    var textSelected = getSelectionText();

    var curPos = document.getElementById("textCreate").selectionStart;
    let text_to_insert = "";
    let x = $("#textCreate").val();
    if (textSelected != "" && textSelected != null && textSelected != undefined) {
        getSel("*", "textCreate");
    } else {
        text_to_insert = "*<bold>*";
        $("#textCreate").val(x.slice(0, curPos) + text_to_insert + x.slice(curPos));
    }
}

function typeItalicoTemp() {
    var textSelected = getSelectionText();

    var curPos = document.getElementById("textCreate").selectionStart;
    let text_to_insert = "";
    let x = $("#textCreate").val();
    if (textSelected != "" && textSelected != null && textSelected != undefined) {
        getSel("_", "textCreate");
    } else {
        text_to_insert = "_<italic>_";
        $("#textCreate").val(x.slice(0, curPos) + text_to_insert + x.slice(curPos));
    }
}

function typeCitacaoTemp() {
    var textSelected = getSelectionText();

    var curPos = document.getElementById("textCreate").selectionStart;
    let text_to_insert = "";
    let x = $("#textCreate").val();
    if (textSelected != "" && textSelected != null && textSelected != undefined) {
        getSel("```", "textCreate");
    } else {
        text_to_insert = "```<quote>```";
        $("#textCreate").val(
            x.slice(0, curPos) + text_to_insert.trim() + x.slice(curPos)
        );
    }
}

function typeStrikeTemp() {
    var textSelected = getSelectionText();

    var curPos = document.getElementById("textCreate").selectionStart;
    let text_to_insert = "";
    let x = $("#textCreate").val();
    if (textSelected != "" && textSelected != null && textSelected != undefined) {
        getSel("~", "textCreate");
    } else {
        text_to_insert = "~<strike>~";
        $("#textCreate").val(x.slice(0, curPos) + text_to_insert + x.slice(curPos));
    }
}

function getSelectionText() {
    var text = "";
    var activeEl = document.activeElement;
    var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
    if (
        activeElTagName == "textarea" ||
        (activeElTagName == "input" &&
            /^(?:text|search|password|tel|url)$/i.test(activeEl.type) &&
            typeof activeEl.selectionStart == "number")
    ) {
        text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
    } else if (window.getSelection) {
        text = window.getSelection().toString();
    }
    return text;
}

function getSel(teste, id) {
    // javascript
    // obtain the object reference for the textarea>
    var txtarea = document.getElementById(id);
    // obtain the index of the first selected character
    var start = txtarea.selectionStart;
    // obtain the index of the last selected character
    var finish = txtarea.selectionEnd;
    //obtain all Text
    var allText = txtarea.value;

    // obtain the selected text
    var sel = allText.substring(start, finish).trim();
    //append te text;
    var newText =
        allText.substring(0, start) +
        teste +
        sel +
        teste +
        allText.substring(finish, allText.length);

    txtarea.value = newText;
}
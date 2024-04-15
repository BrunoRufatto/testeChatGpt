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
    languages: ["en_US", "pt_BR"],
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
    configPurify: { ALLOWED_TAGS: ['b'], KEEP_CONTENT: false }
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
                return Utils.RenderTemplate(Const.deflang);
                //$("#allPage").show();

            })

    })


    //data.org[0].currency_locale = en_US language - tratar tradução
    //ZOHO.CRM.CONFIG.getOrgInfo().then(function(data){
    //    console.log(data);
    //});
    await ZOHO.CRM.META.getModules().then(async function(data) {
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
    });
    loadingPage();


})

ZOHO.embeddedApp.init();

function loadingPage() {
    return ZOHO.CRM.API.getRecord({
            Entity: entityName,
            RecordID: entityIds
        })
        .then(async function(record) {
            //console.log(record)
            return ZOHO.CRM.META.getFields({
                "Entity": entityName
            }).then(async function(resp) {
                //estrutura = "[";
                resp.fields.forEach(field => {
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
                            value: valor
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

                    await ZOHO.CRM.API.getOrgVariable(Const.apinames.apiphonelead).then(function(data) {


                        Const.phonelead = JSON.parse(data.Success.Content);

                        var fldSel = "<select id=\"modifiedLeads\" class=\"newSelect\" onchange=\"changeFunc();\" style=\"width:300px\" required=\"true\" >";
                        var id = 0;
                        for (id in Const.leadfieldnames) {

                            var atual = Const.leadfieldnames[id];
                            if (atual["name"] == Const.phonelead.name) {
                                if (atual["value"].includes("Vazio")) {
                                    fldSel = fldSel + "<option value=\"" + atual["value"] + "\" disabled>" + atual["desc"] + " (" + atual["value"] + ") </option>";
                                } else {
                                    fldSel = fldSel + "<option value=\"" + atual["value"] + "\" selected>" + atual["desc"] + " (" + atual["value"] + ") </option>";
                                }
                            } else {
                                if (atual["value"].includes("Vazio")) {
                                    fldSel = fldSel + "<option value=\"" + atual["value"] + "\" disabled>" + atual["desc"] + " (" + atual["value"] + ") </option>";
                                } else {
                                    fldSel = fldSel + "<option value=\"" + atual["value"] + "\">" + atual["desc"] + " (" + atual["value"] + ") </option>";
                                }
                            }
                        }
                        fldSel = fldSel + "</select>";

                        $("#leadDefault").html(fldSel);



                        $("#leadDefault").each(function() {

                            $($(this).find("#modifiedLeads option")).each(function() {

                                //var currentopton = $(this).val();

                                //alert(Const.phonelead["name"]);
                                var currentlabel = $(this)[0].label;
                                //alert(Const.phonelead["desc"]);
                                if (currentlabel.includes(Const.phonelead["desc"]) && !currentlabel.includes("Vazio")) {
                                    //$(this).attr("selected", "selected");
                                    $(this).prop("selected", true);
                                }
                                if (currentlabel.includes("Vazio")) {
                                    $(this).prop("selected", false);
                                }

                            });

                        });
                    });
                } else if (entityName.toLowerCase() == "contacts") {
                    await Utils.getTemplates(entityName);
                    await ZOHO.CRM.API.getOrgVariable(Const.apinames.apiphonecontact).then(async function(data) {


                        Const.phonelead = JSON.parse(data.Success.Content);

                        var fldSel = "<select id=\"modifiedLeads\" class=\"newSelect\" style=\"width:300px\" required=\"true\" >";
                        var id = 0;
                        for (id in Const.leadfieldnames) {

                            var atual = Const.leadfieldnames[id];
                            if (atual["name"] == Const.phonelead.name) {
                                if (atual["value"].includes("Vazio")) {
                                    fldSel = fldSel + "<option value=\"" + atual["value"] + "\" disabled>" + atual["desc"] + " (" + atual["value"] + ") </option>";
                                } else {
                                    fldSel = fldSel + "<option value=\"" + atual["value"] + "\" selected>" + atual["desc"] + " (" + atual["value"] + ") </option>";
                                }
                            } else {
                                if (atual["value"].includes("Vazio")) {
                                    fldSel = fldSel + "<option value=\"" + atual["value"] + "\" disabled>" + atual["desc"] + " (" + atual["value"] + ") </option>";
                                } else {
                                    fldSel = fldSel + "<option value=\"" + atual["value"] + "\">" + atual["desc"] + " (" + atual["value"] + ") </option>";
                                }
                            }
                        }
                        fldSel = fldSel + "</select>";

                        $("#leadDefault").html(fldSel);



                        $("#leadDefault").each(function() {

                            $($(this).find("#modifiedLeads option")).each(function() {

                                //var currentopton = $(this).val();

                                //alert(Const.phonelead["name"]);
                                var currentlabel = $(this)[0].label;
                                //alert(Const.phonelead["desc"]);
                                if (currentlabel.includes(Const.phonelead["desc"]) && !currentlabel.includes("Vazio")) {
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
                    await ZOHO.CRM.API.getOrgVariable(Const.apinames.apiphoneaccount).then(async function(data) {


                        Const.phonelead = JSON.parse(data.Success.Content);

                        var fldSel = "<select id=\"modifiedLeads\" class=\"newSelect\" style=\"width:300px\" required=\"true\" >";
                        var id = 0;
                        for (id in Const.leadfieldnames) {

                            var atual = Const.leadfieldnames[id];
                            if (atual["name"] == Const.phonelead.name) {
                                if (atual["value"].includes("Vazio")) {
                                    fldSel = fldSel + "<option value=\"" + atual["value"] + "\" disabled>" + atual["desc"] + " (" + atual["value"] + ") </option>";
                                } else {
                                    fldSel = fldSel + "<option value=\"" + atual["value"] + "\" selected>" + atual["desc"] + " (" + atual["value"] + ") </option>";
                                }
                            } else {
                                if (atual["value"].includes("Vazio")) {
                                    fldSel = fldSel + "<option value=\"" + atual["value"] + "\" disabled>" + atual["desc"] + " (" + atual["value"] + ") </option>";
                                } else {
                                    fldSel = fldSel + "<option value=\"" + atual["value"] + "\">" + atual["desc"] + " (" + atual["value"] + ") </option>";
                                }
                            }
                        }
                        fldSel = fldSel + "</select>";

                        $("#leadDefault").html(fldSel);



                        $("#leadDefault").each(function() {

                            $($(this).find("#modifiedLeads option")).each(function() {

                                //var currentopton = $(this).val();

                                //alert(Const.phonelead["name"]);
                                var currentlabel = $(this)[0].label;
                                //alert(Const.phonelead["desc"]);
                                if (currentlabel.includes(Const.phonelead["desc"]) && !currentlabel.includes("Vazio")) {
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
                    await ZOHO.CRM.META.getFields({
                        "Entity": "Contacts"
                    }).then(async function(data) {
                        var resp = data;
                        idContact = record.data[0].Contact_Name;
                        var valor;
                        if (idContact !== null && idContact !== "") {
                            idContact = idContact.id;
                        } else {
                            valor = "Vazio";
                        }

                        return ZOHO.CRM.API.getRecord({
                                Entity: "Contacts",
                                RecordID: idContact
                            })
                            .then(async function(contact) {
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
                                            value: valor
                                        });
                                    }
                                }

                                return ZOHO.CRM.API.getOrgVariable(Const.apinames.apiphoneaccount)

                            }).then(async function(data) {
                                Const.phoneaccount = JSON.parse(data.Success.Content);

                                // Const.accountfieldnames.push({
                                //     desc: "-- none --",
                                //     name: "-- none --",
                                //     type: "text",
                                //     module: "Accounts",
                                //     value: "Vazio"
                                // });

                                return ZOHO.CRM.META.getFields({
                                    "Entity": "Accounts"
                                }).then(async function(data) {
                                    var resp = data;
                                    idAccount = record.data[0].Account_Name;
                                    var valor;
                                    if (idAccount !== null && idAccount !== "") {
                                        idAccount = idAccount.id;
                                    } else {
                                        valor = "Vazio";
                                    }
                                    return ZOHO.CRM.API.getRecord({
                                            Entity: "Accounts",
                                            RecordID: idAccount
                                        })
                                        .then(async function(account) {
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
                                                        value: valor
                                                    });


                                                }
                                            }

                                            return ZOHO.CRM.API.getOrgVariable(Const.apinames.apiphonedeal).then(async function(data) {


                                                Const.phonedeal = JSON.parse(data.Success.Content);

                                                var fldSel = "<select id=\"modifiedLeads\" class=\"newSelect\" style=\"width:300px\" required=\"true\" >";

                                                if (Const.dealfieldnames.length > 0) {
                                                    if (!Const.dealfieldnames[0].name.toLowerCase().includes("none")) {
                                                        fldSel = fldSel + "<optgroup label=\"Negócios\">";
                                                    }
                                                    var id = 0;
                                                    for (id in Const.dealfieldnames) {
                                                        var atual = Const.dealfieldnames[id];
                                                        if (atual["name"] == Const.phonedeal.name && atual["module"] == "Deals") {
                                                            fldSel = fldSel + "<option value=\"" + atual["value"] + "\" selected data-group=\"" + atual["module"] + "\">" + atual["desc"] + " (" + atual["value"] + ")" + "</option>";
                                                        } else {
                                                            fldSel = fldSel + "<option value=\"" + atual["value"] + "\" data-group=\"" + atual["module"] + "\">" + atual["desc"] + " (" + atual["value"] + ")" + "</option>";
                                                        }
                                                    }
                                                    if (!Const.dealfieldnames[0].name.toLowerCase().includes("none")) {
                                                        fldSel = fldSel + "</optgroup>";
                                                    }
                                                }

                                                if (Const.contactfieldnames.length > 1) {
                                                    fldSel = fldSel + "<optgroup label=\"Contatos\">";
                                                    var id = 0;
                                                    for (id in Const.contactfieldnames) {
                                                        var atual = Const.contactfieldnames[id];
                                                        if (!atual.name.toLowerCase().includes("none")) {

                                                            if (atual["name"] == Const.phonedeal.name && atual["module"] == "Contacts") {
                                                                fldSel = fldSel + "<option value=\"" + atual["value"] + "\" selected data-group=\"" + atual["module"] + "\">" + atual["desc"] + " (" + atual["value"] + ")" + "</option>";
                                                            } else {
                                                                fldSel = fldSel + "<option value=\"" + atual["value"] + "\" data-group=\"" + atual["module"] + "\">" + atual["desc"] + " (" + atual["value"] + ")" + "</option>";
                                                            }
                                                        }
                                                    }
                                                    fldSel = fldSel + "</optgroup>";
                                                }
                                                //console.log(Const.accountfieldnames);
                                                //console.log(Const.accountfieldnames.length);
                                                if (Const.accountfieldnames.length > 0) {
                                                    fldSel = fldSel + "<optgroup label=\"Contas\">";
                                                    var id = 0;
                                                    for (id in Const.accountfieldnames) {
                                                        var atual = Const.accountfieldnames[id];
                                                        if (!atual.name.toLowerCase().includes("none")) {

                                                            if (atual["name"] == Const.phonedeal.name && atual["module"] == "Accounts") {
                                                                fldSel = fldSel + "<option value=\"" + atual["value"] + "\" selected data-group=\"" + atual["module"] + "\">" + atual["desc"] + " (" + atual["value"] + ")" + "</option>";
                                                            } else {
                                                                fldSel = fldSel + "<option value=\"" + atual["value"] + "\" data-group=\"" + atual["module"] + "\">" + atual["desc"] + " (" + atual["value"] + ")" + "</option>";
                                                            }
                                                        }
                                                    }
                                                    fldSel = fldSel + "</optgroup>";
                                                }

                                                fldSel = fldSel + "</select>";

                                                $("#leadDefault").html(fldSel);

                                                $("#leadDefault").each(async function() {

                                                    $($(this).find("#modifiedLeads option")).each(async function() {
                                                        var currentopton = $(this).val();
                                                        var currdataopt = $(this).data("group");
                                                        var currentlabel = $(this)[0].label;
                                                        //console.log(currentlabel);
                                                        if (currentlabel.includes(Const.phonedeal["desc"]) && !currentlabel.includes("Vazio") && currdataopt == Const.phonedeal["module"] && !currentlabel.includes("undefined")) {
                                                            //$(this).attr("selected", "selected");
                                                            $(this).prop("selected", true);
                                                        }
                                                        if (currentlabel.includes("Vazio") || currentlabel.includes("undefined")) {
                                                            $(this).prop("disabled", true);
                                                        }
                                                    });


                                                });

                                            });
                                        });
                                });
                            });
                    });
                }
            }).then(async function() {
                if (Const.enablemodule.leads) {
                    await ZOHO.CRM.META.getFields({
                        "Entity": "Leads"
                    }).then(function(data) {
                        var resp = data;
                        for (i in resp.fields) {
                            var field = resp.fields[i];
                            if (field.data_type == "phone") {

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
                }
                if (Const.enablemodule.contacts) {
                    await ZOHO.CRM.META.getFields({
                        "Entity": "Contacts"
                    }).then(function(data) {

                        var resp = data;
                        for (i in resp.fields) {
                            var field = resp.fields[i];
                            if (field.data_type == "phone") {

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
                    })
                }
                if (Const.enablemodule.accounts) {
                    await ZOHO.CRM.META.getFields({
                        "Entity": "Accounts"
                    }).then(function(data) {

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
                    })
                }
                if (Const.enablemodule.deals) {
                    await ZOHO.CRM.META.getFields({
                        "Entity": "Deals"
                    }).then(function(data) {
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
                await ZOHO.CRM.META.getFields({
                    "Entity": "Users"
                }).then(async function(data) {
                    var resp = data;
                    for (i in resp.fields) {
                        var field = resp.fields[i];
                        Const.allfieldsusers.push({
                            desc: resp.fields[i].field_label,
                            name: resp.fields[i].api_name,
                            type: resp.fields[i].data_type,
                            module: "Users"
                        });
                    }
                    return ZOHO.CRM.CONNECTOR.invokeAPI("crm.getorg", {}).then(function(data) {
                        var orgInfo = JSON.parse(data);
                        orgInfo = JSON.parse(orgInfo.response).org[0];
                        //console.log(orgInfo);
                        Object.keys(orgInfo).forEach(apiName => {
                            var nome = apiName.replace(/_/g, " ").replace("/n", "").split(" ");
                            var palavra = "";
                            nome.forEach(word => {
                                palavra = palavra + word.charAt(0).toUpperCase() + word.slice(1) + " ";
                            })

                            //console.log(palavra.trim());
                            Const.allfieldsorgs.push({
                                desc: palavra.trim(),
                                name: apiName,
                                type: "text",
                                module: "Orgs"
                            });
                        })


                    }).then(async function() {
                        activeFields2();
                        activeFields();
                        document.addEventListener("click", (evt) => {
                            const flyoutElement = document.getElementById("templateMergeValuesDIV");

                            let targetElement = evt.target; // clicked element

                            do {
                                if (targetElement == flyoutElement) {
                                    // This is a click inside. Do nothing, just return.

                                    return;
                                }
                                // Go up the DOM
                                targetElement = targetElement.parentNode;
                            } while (targetElement);

                            const flyoutElement2 = document.getElementById("templateMergeValuesDIV2");

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
                            if (contentArea.includes("#")) { //(contentArea.includes("#")) {
                                $("#textCreate").val(contentArea.replace("#", ""));
                                $("#textCreate").focus();
                            }

                            var contentArea2 = $("textarea#textMsg").val();
                            if (contentArea2 == undefined) {
                                contentArea2 = "";
                            }
                            if (contentArea2.includes("#")) { //(contentArea.includes("#")) {
                                $("textarea#textMsg").val(contentArea2.replace("#", ""));
                                $("#textMsg").focus();
                            }



                        });


                    });

                });
            })
        }).then(function() {
            $(document).ready(function() {

                $("#cont").delay(2000).slideUp(function() {
                        $("#app").slideDown();
                        $(function() {
                            $("#selTemplate").multipleSelect({
                                filter: true,
                                onClick: function(view) {
                                    var message = view.value;
                                    $("textarea#textMsg").val("");
                                    changeFunc(message);

                                },
                                /*onAfterCreate: function() {
                                    $("#tempSelect").children().find("ul").parent().append('<div style="text-align: center;border-top: solid 0.1px;border-color: #d4d4d8;"><a href="#" onclick="criaTemplate()"><label class=""><span style="cursor:pointer;">Criar Template</span></label></a></div>');
                                }*/
                            })
                        })
                        $("#modifiedLeads").multipleSelect({
                            filter: true,
                            onAfterCreate: function() {
                                $("#tempSelect").children().find("ul").parent().append('<div style="text-align: center;border-top: solid 0.1px;border-color: #d4d4d8;"><a href="#" onclick="criaTemplate()"><label class=""><span style="cursor:pointer;">' + Const.desclanguage["send-message-link-template"] + '</span></label></a></div>');
                            }
                        });
                        $("#modulesSelect").multipleSelect({
                            filter: true,
                        });



                    }) //document.getElementById("loader").classList.remove("is-active");
            })
        })
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
    var selModule = DOMPurify.sanitize($("#modulesSelect").val(), Const.configPurify);

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
        }).then(function(data) {
            //console.log(data);
            if (data.data[0].details.id != null && data.data[0].details.id != undefined && data.data[0].details.id != "") { //await Utils.getTemplates(entityName);
                //$("#selTemplate").multipleSelect('destroy');
                //var optionSel = '<option value="' + $("#textCreate").val() + '">' + $("#myInput").val() + '</option>'
                var $opt = $('<option />', {
                    value: DOMPurify.sanitize($("#textCreate").val(), Const.configPurify),
                    text: DOMPurify.sanitize($("#myInput").val(), Const.configPurify)
                })
                $opt.prop('selected', true);
                $("#selTemplate option:first").after($opt);
                $("#selTemplate").multipleSelect('refresh');
                changeFunc($("#textCreate").val());
                $("#myInput").val("");
                $("#textCreate").val("");
                Utils.successMsg("SuccessMsg", "msg-success-template", false, false, fechaTemplate);
                /*$('#SuccessMsg').find('.sucesText').html("Template criado com sucesso.");
                $('#SuccessMsg').slideDown(function() {
                    $('#SuccessMsg').delay(3000).slideUp(function() {
                        $("#myForm").slideUp();
                    });
                });*/


            } else {
                Utils.errorMsg("ErroMsg", "msg-error-template", false, false, erroTemplate);
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
        $("#textMsg").on("keydown", function(e) {

            if (e.which == 51 && e.key == "#") { //shift+#


                var fldSel = "<select id=\"moduleOptions2\" data-zcqa=\"moduleOptions2\" tabindex=\"-1\" class=\"newSelect\" aria-hidden=\"true\" onchange=\"Utils.selectFields2()\">";
                fldSel = fldSel + "<option value=\"Leads\" type=\"system\" selected>Leads</option>";
                fldSel = fldSel + "<option value=\"Users\" type=\"system\">Users</option>";
                fldSel = fldSel + "<option value=\"Orgs\" type=\"system\">Organization</option>";
                fldSel = fldSel + "</select>";
                $("#moduleOptionsList2").html(fldSel);


                var ulFld = "";

                if (Const.allfieldsleads.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsleads[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsleads[0]["module"] + "_ModuleFields2\" id=\"system_" + Const.allfieldsleads[0]["module"] + "_ModuleFields2\" style=\"display: block;\" >";


                    for (id in Const.allfieldsleads) {
                        var atual = Const.allfieldsleads[id];

                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeLead2(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";

                }
                if (Const.allfieldsusers.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsusers[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsusers[0]["module"] + "_ModuleFields2\" id=\"system_" + Const.allfieldsusers[0]["module"] + "_ModuleFields2\" style=\"display: none;\" >";


                    for (id in Const.allfieldsusers) {
                        var atual = Const.allfieldsusers[id];


                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeLead2(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";


                }
                if (Const.allfieldsorgs.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsorgs[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsorgs[0]["module"] + "_ModuleFields2\" id=\"system_" + Const.allfieldsorgs[0]["module"] + "_ModuleFields2\" style=\"display: none;\" >";

                    for (id in Const.allfieldsorgs) {
                        var atual = Const.allfieldsorgs[id];


                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeLead2(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";

                }


                $(".oA2").html(ulFld);

                var pos = $(this).getCaretPosition();
                pos.top = getLineNumber("textMsg");
                pos.left = getColumnNumber("textMsg", pos.left, "templateMergeValuesDIV2");
                var tamTop = e.target.offsetTop + pos.top;
                var tamLeft = e.target.offsetLeft + pos.left + 15;


                $('#templateMergeValuesDIV2').hide();
                $('#templateMergeValuesDIV2').css({
                    'top': tamTop,
                    'left': tamLeft,
                    'position': 'absolute',
                    'border': '1px solid black'
                });

                $('#templateMergeValuesDIV2').show();


            } else if (e.which == 8 || e.which == 27) {
                $('#templateMergeValuesDIV2').hide();
                var contentArea = $("textarea#textMsg").val();
                if (contentArea.includes("#")) {
                    $("textarea#textMsg").val(contentArea.replace("#", ""));
                    $("#textMsg").focus();
                }
            }

        });
    } else if (optionSelected.toLowerCase() == "contacts") {
        $("#textMsg").on("keydown", function(e) {



            if (e.which == 51 && e.key == "#") { //shift+#


                var fldSel = "<select id=\"moduleOptions2\" data-zcqa=\"moduleOptions2\" tabindex=\"-1\" class=\"newSelect\" aria-hidden=\"true\" onchange=\"Utils.selectFields2()\">";
                fldSel = fldSel + "<option value=\"Contacts\" type=\"system\" selected>Contacts</option>";
                fldSel = fldSel + "<option value=\"Users\" type=\"system\">Users</option>";
                fldSel = fldSel + "<option value=\"Orgs\" type=\"system\">Organization</option>";
                fldSel = fldSel + "</select>";
                $("#moduleOptionsList2").html(fldSel);


                var ulFld = "";

                if (Const.allfieldscontacts.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldscontacts[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldscontacts[0]["module"] + "_ModuleFields2\" id=\"system_" + Const.allfieldscontacts[0]["module"] + "_ModuleFields2\" style=\"display: block;\" >";


                    for (id in Const.allfieldscontacts) {
                        var atual = Const.allfieldscontacts[id];

                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeContact2(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";

                }
                if (Const.allfieldsusers.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsusers[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsusers[0]["module"] + "_ModuleFields2\" id=\"system_" + Const.allfieldsusers[0]["module"] + "_ModuleFields2\" style=\"display: none;\" >";


                    for (id in Const.allfieldsusers) {
                        var atual = Const.allfieldsusers[id];


                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeContact2(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";


                }
                if (Const.allfieldsorgs.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsorgs[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsorgs[0]["module"] + "_ModuleFields2\" id=\"system_" + Const.allfieldsorgs[0]["module"] + "_ModuleFields2\" style=\"display: none;\" >";

                    for (id in Const.allfieldsorgs) {
                        var atual = Const.allfieldsorgs[id];


                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeContact2(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";

                }


                $(".oA2").html(ulFld);

                var pos = $(this).getCaretPosition();

                pos.top = getLineNumber("textMsg");
                pos.left = getColumnNumber("textMsg", pos.left, "templateMergeValuesDIV2");
                var tamTop = e.target.offsetTop + pos.top + 15;
                var tamLeft = e.target.offsetLeft + pos.left + 20;


                $('#templateMergeValuesDIV2').hide();
                $('#templateMergeValuesDIV2').css({
                    'top': tamTop,
                    'left': tamLeft,
                    'position': 'absolute',
                    'border': '1px solid black'
                });
                $('#templateMergeValuesDIV2').show();


            } else if (e.which == 8 || e.which == 27) {
                $('#templateMergeValuesDIV2').hide();
                var contentArea = $("#textMsg").val();
                if (contentArea.includes("#")) {
                    $("textarea#textMsg").val(contentArea.replace("#", ""));
                    $("#textMsg").focus();
                }
            }

        });
    } else if (optionSelected.toLowerCase() == "accounts") {
        $("#textMsg").on("keydown", function(e) {



            if (e.which == 51 && e.key == "#") { //shift+#


                var fldSel = "<select id=\"moduleOptions2\" data-zcqa=\"moduleOptions2\" tabindex=\"-1\" class=\"newSelect\" aria-hidden=\"true\" onchange=\"Utils.selectFields2()\">";
                fldSel = fldSel + "<option value=\"Accounts\" type=\"system\" selected>Accounts</option>";
                fldSel = fldSel + "<option value=\"Users\" type=\"system\">Users</option>";
                fldSel = fldSel + "<option value=\"Orgs\" type=\"system\">Organization</option>";
                fldSel = fldSel + "</select>";
                $("#moduleOptionsList2").html(fldSel);


                var ulFld = "";

                if (Const.allfieldsaccounts.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsaccounts[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsaccounts[0]["module"] + "_ModuleFields2\" id=\"system_" + Const.allfieldsaccounts[0]["module"] + "_ModuleFields2\" style=\"display: block;\" >";


                    for (id in Const.allfieldsaccounts) {
                        var atual = Const.allfieldsaccounts[id];

                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeAccount2(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";

                }
                if (Const.allfieldsusers.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsusers[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsusers[0]["module"] + "_ModuleFields2\" id=\"system_" + Const.allfieldsusers[0]["module"] + "_ModuleFields2\" style=\"display: none;\" >";


                    for (id in Const.allfieldsusers) {
                        var atual = Const.allfieldsusers[id];


                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeAccount2(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";


                }
                if (Const.allfieldsorgs.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsorgs[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsorgs[0]["module"] + "_ModuleFields2\" id=\"system_" + Const.allfieldsorgs[0]["module"] + "_ModuleFields2\" style=\"display: none;\" >";

                    for (id in Const.allfieldsorgs) {
                        var atual = Const.allfieldsorgs[id];


                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeAccount2(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";

                }


                $(".oA2").html(ulFld);

                var pos = $(this).getCaretPosition();

                pos.top = getLineNumber("textMsg");
                pos.left = getColumnNumber("textMsg", pos.left, "templateMergeValuesDIV2");
                var tamTop = e.target.offsetTop + pos.top + 15;
                var tamLeft = e.target.offsetLeft + pos.left + 20;


                $('#templateMergeValuesDIV2').hide();
                $('#templateMergeValuesDIV2').css({
                    'top': tamTop,
                    'left': tamLeft,
                    'position': 'absolute',
                    'border': '1px solid black'
                });
                $('#templateMergeValuesDIV2').show();


            } else if (e.which == 8 || e.which == 27) {
                $('#templateMergeValuesDIV2').hide();
                var contentArea = $("textarea").val();
                if (contentArea.includes("#")) {
                    $("textarea#textMsg").val(contentArea.replace("#", ""));
                    $("#textMsg").focus();
                }
            }

        });
    } else if (optionSelected.toLowerCase() == "deals") {
        $("#textMsg").on("keydown", function(e) {



            if (e.which == 51 && e.key == "#") { //shift+#


                var fldSel = "<select id=\"moduleOptions2\" data-zcqa=\"moduleOptions2\" tabindex=\"-1\" class=\"newSelect\" aria-hidden=\"true\" onchange=\"Utils.selectFields2()\">";
                fldSel = fldSel + "<option value=\"Deals\" type=\"system\" selected>Deals</option>";
                fldSel = fldSel + "<option value=\"Accounts\" type=\"system\">Accounts</option>";
                fldSel = fldSel + "<option value=\"Contacts\" type=\"system\">Contacts</option>";
                fldSel = fldSel + "<option value=\"Users\" type=\"system\">Users</option>";
                fldSel = fldSel + "<option value=\"Orgs\" type=\"system\">Organization</option>";
                fldSel = fldSel + "</select>";
                $("#moduleOptionsList2").html(fldSel);
                $(function() {
                    $("moduleOptions2").multipleSelect({
                        filter: true,
                    });
                });


                var ulFld = "";

                if (Const.allfieldsdeals.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsdeals[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsdeals[0]["module"] + "_ModuleFields2\" id=\"system_" + Const.allfieldsdeals[0]["module"] + "_ModuleFields2\" style=\"display: block;\" >";


                    for (id in Const.allfieldsdeals) {
                        var atual = Const.allfieldsdeals[id];

                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeDeal2(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";

                }
                if (Const.allfieldsaccounts.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsaccounts[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsaccounts[0]["module"] + "_ModuleFields2\" id=\"system_" + Const.allfieldsaccounts[0]["module"] + "_ModuleFields2\" style=\"display: none;\" >";


                    for (id in Const.allfieldsaccounts) {
                        var atual = Const.allfieldsaccounts[id];

                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeDeal2(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";

                }
                if (Const.allfieldscontacts.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldscontacts[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldscontacts[0]["module"] + "_ModuleFields2\" id=\"system_" + Const.allfieldscontacts[0]["module"] + "_ModuleFields2\" style=\"display: none;\" >";


                    for (id in Const.allfieldscontacts) {
                        var atual = Const.allfieldscontacts[id];

                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeDeal2(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";

                }
                if (Const.allfieldsusers.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsusers[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsusers[0]["module"] + "_ModuleFields2\" id=\"system_" + Const.allfieldsusers[0]["module"] + "_ModuleFields2\" style=\"display: none;\" >";


                    for (id in Const.allfieldsusers) {
                        var atual = Const.allfieldsusers[id];


                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeDeal2(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";


                }
                if (Const.allfieldsorgs.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsorgs[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsorgs[0]["module"] + "_ModuleFields2\" id=\"system_" + Const.allfieldsorgs[0]["module"] + "_ModuleFields2\" style=\"display: none;\" >";

                    for (id in Const.allfieldsorgs) {
                        var atual = Const.allfieldsorgs[id];


                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeDeal2(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";

                }

                $(".oA2").html(ulFld);

                var pos = $(this).getCaretPosition();

                pos.top = getLineNumber("textMsg");
                pos.left = getColumnNumber("textMsg", pos.left, "templateMergeValuesDIV2");
                var tamTop = e.target.offsetTop + pos.top + 15;
                var tamLeft = e.target.offsetLeft + pos.left + 20;


                $('#templateMergeValuesDIV2').hide();
                $('#templateMergeValuesDIV2').css({
                    'top': tamTop,
                    'left': tamLeft,
                    'position': 'absolute',
                    'border': '1px solid black'
                });
                $('#templateMergeValuesDIV2').show();


            } else if (e.which == 8 || e.which == 27) {
                $('#templateMergeValuesDIV2').hide();
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
        $("#textCreate").on("keydown", function(e) {

            if (e.which == 51 && e.key == "#") { //} && e.val().includes("#")) { //shift+#


                var fldSel = "<select id=\"moduleOptions\" data-zcqa=\"moduleOptions\" tabindex=\"-1\" class=\"newSelect\" aria-hidden=\"true\" onchange=\"Utils.selectFields()\">";
                fldSel = fldSel + "<option value=\"Leads\" type=\"system\" selected>Leads</option>";
                fldSel = fldSel + "<option value=\"Users\" type=\"system\">Users</option>";
                fldSel = fldSel + "<option value=\"Orgs\" type=\"system\">Organization</option>";
                fldSel = fldSel + "</select>";
                $("#moduleOptionsList").html(fldSel);


                var ulFld = "";

                if (Const.allfieldsleads.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsleads[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsleads[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsleads[0]["module"] + "_ModuleFields\" style=\"display: block;\" >";


                    for (id in Const.allfieldsleads) {
                        var atual = Const.allfieldsleads[id];

                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeLead(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";

                }
                if (Const.allfieldsusers.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsusers[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsusers[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsusers[0]["module"] + "_ModuleFields\" style=\"display: none;\" >";


                    for (id in Const.allfieldsusers) {
                        var atual = Const.allfieldsusers[id];


                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeLead(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";


                }
                if (Const.allfieldsorgs.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsorgs[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsorgs[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsorgs[0]["module"] + "_ModuleFields\" style=\"display: none;\" >";

                    for (id in Const.allfieldsorgs) {
                        var atual = Const.allfieldsorgs[id];


                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeLead(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";

                }


                $(".oA").html(ulFld);

                var pos = $(this).getCaretPosition();
                pos.top = getLineNumber("textCreate");
                pos.left = getColumnNumber("textCreate", pos.left, "templateMergeValuesDIV");
                $('#templateMergeValuesDIV').hide();
                $('#templateMergeValuesDIV').css({
                    'top': e.target.offsetTop + pos.top + $("#textCreate").offset().top,
                    'left': e.target.offsetLeft + pos.left + $("#textCreate").offset().left,
                    'position': 'absolute',
                    'border': '1px solid black'
                });
                $('#templateMergeValuesDIV').show();


            } else if (e.which == 8 || e.which == 27) {
                $('#templateMergeValuesDIV').hide();
                var contentArea = $("#textCreate").val();
                if (contentArea.includes("#")) {
                    $("#textCreate").val(contentArea.replace("#", ""));
                    $("#textCreate").focus();
                }
            }

        });
    } else if (optionSelected.toLowerCase() == "contacts") {
        $("#textCreate").on("keydown", function(e) {



            if (e.which == 51 && e.key == "#") { //shift+#


                var fldSel = "<select id=\"moduleOptions\" data-zcqa=\"moduleOptions\" tabindex=\"-1\" class=\"newSelect\" aria-hidden=\"true\" onchange=\"Utils.selectFields()\">";
                fldSel = fldSel + "<option value=\"Contacts\" type=\"system\" selected>Contacts</option>";
                fldSel = fldSel + "<option value=\"Users\" type=\"system\">Users</option>";
                fldSel = fldSel + "<option value=\"Orgs\" type=\"system\">Organization</option>";
                fldSel = fldSel + "</select>";
                $("#moduleOptionsList").html(fldSel);


                var ulFld = "";

                if (Const.allfieldscontacts.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldscontacts[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldscontacts[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldscontacts[0]["module"] + "_ModuleFields\" style=\"display: block;\" >";


                    for (id in Const.allfieldscontacts) {
                        var atual = Const.allfieldscontacts[id];

                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeContact(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";

                }
                if (Const.allfieldsusers.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsusers[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsusers[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsusers[0]["module"] + "_ModuleFields\" style=\"display: none;\" >";


                    for (id in Const.allfieldsusers) {
                        var atual = Const.allfieldsusers[id];


                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeContact(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";


                }
                if (Const.allfieldsorgs.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsorgs[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsorgs[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsorgs[0]["module"] + "_ModuleFields\" style=\"display: none;\" >";

                    for (id in Const.allfieldsorgs) {
                        var atual = Const.allfieldsorgs[id];


                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeContact(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";

                }


                $(".oA").html(ulFld);

                var pos = $(this).getCaretPosition();
                pos.top = getLineNumber("textCreate");
                pos.left = getColumnNumber("textCreate", pos.left, "templateMergeValuesDIV");
                $('#templateMergeValuesDIV').hide();
                $('#templateMergeValuesDIV').css({
                    'top': e.target.offsetTop + pos.top + +$("#textCreate").offset().top,
                    'left': e.target.offsetLeft + pos.left + +$("#textCreate").offset().left,
                    'position': 'absolute',
                    'border': '1px solid black'
                });
                $('#templateMergeValuesDIV').show();


            } else if (e.which == 8 || e.which == 27) {
                $('#templateMergeValuesDIV').hide();
                var contentArea = $("#textCreate").val();
                if (contentArea.includes("#")) {
                    $("#textCreate").val(contentArea.replace("#", ""));
                    $("#textCreate").focus();
                }
            }

        });
    } else if (optionSelected.toLowerCase() == "accounts") {
        $("#textCreate").on("keydown", function(e) {



            if (e.which == 51 && e.key == "#") { //shift+#


                var fldSel = "<select id=\"moduleOptions\" data-zcqa=\"moduleOptions\" tabindex=\"-1\" class=\"newSelect\" aria-hidden=\"true\" onchange=\"Utils.selectFields()\">";
                fldSel = fldSel + "<option value=\"Accounts\" type=\"system\" selected>Accounts</option>";
                fldSel = fldSel + "<option value=\"Users\" type=\"system\">Users</option>";
                fldSel = fldSel + "<option value=\"Orgs\" type=\"system\">Organization</option>";
                fldSel = fldSel + "</select>";
                $("#moduleOptionsList").html(fldSel);


                var ulFld = "";

                if (Const.allfieldsaccounts.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsaccounts[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsaccounts[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsaccounts[0]["module"] + "_ModuleFields\" style=\"display: block;\" >";


                    for (id in Const.allfieldsaccounts) {
                        var atual = Const.allfieldsaccounts[id];

                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeAccount(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";

                }
                if (Const.allfieldsusers.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsusers[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsusers[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsusers[0]["module"] + "_ModuleFields\" style=\"display: none;\" >";


                    for (id in Const.allfieldsusers) {
                        var atual = Const.allfieldsusers[id];


                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeAccount(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";


                }
                if (Const.allfieldsorgs.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsorgs[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsorgs[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsorgs[0]["module"] + "_ModuleFields\" style=\"display: none;\" >";

                    for (id in Const.allfieldsorgs) {
                        var atual = Const.allfieldsorgs[id];


                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeAccount(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";

                }


                $(".oA").html(ulFld);

                var pos = $(this).getCaretPosition();
                pos.top = getLineNumber("textCreate");
                pos.left = getColumnNumber("textCreate", pos.left, "templateMergeValuesDIV");
                $('#templateMergeValuesDIV').hide();
                $('#templateMergeValuesDIV').css({
                    'top': e.target.offsetTop + pos.top + +$("#textCreate").offset().top,
                    'left': e.target.offsetLeft + pos.left + +$("#textCreate").offset().left,
                    'position': 'absolute',
                    'border': '1px solid black'
                });
                $('#templateMergeValuesDIV').show();


            } else if (e.which == 8 || e.which == 27) {
                $('#templateMergeValuesDIV').hide();
                var contentArea = $("#textCreate").val();
                if (contentArea.includes("#")) {
                    $("#textCreate").val(contentArea.replace("#", ""));
                    $("#textCreate").focus();
                }
            }

        });
    } else if (optionSelected.toLowerCase() == "deals") {
        $("#textCreate").on("keydown", function(e) {



            if (e.which == 51 && e.key == "#") { //shift+#


                var fldSel = "<select id=\"moduleOptions\" data-zcqa=\"moduleOptions\" tabindex=\"-1\" class=\"newSelect\" aria-hidden=\"true\" onchange=\"Utils.selectFields()\">";
                fldSel = fldSel + "<option value=\"Deals\" type=\"system\" selected>Deals</option>";
                fldSel = fldSel + "<option value=\"Accounts\" type=\"system\">Accounts</option>";
                fldSel = fldSel + "<option value=\"Contacts\" type=\"system\">Contacts</option>";
                fldSel = fldSel + "<option value=\"Users\" type=\"system\">Users</option>";
                fldSel = fldSel + "<option value=\"Orgs\" type=\"system\">Organization</option>";
                fldSel = fldSel + "</select>";
                $("#moduleOptionsList").html(fldSel);
                $(function() {
                    $("moduleOptions").multipleSelect({
                        filter: true,
                    });
                });


                var ulFld = "";

                if (Const.allfieldsdeals.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsdeals[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsdeals[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsdeals[0]["module"] + "_ModuleFields\" style=\"display: block;\" >";


                    for (id in Const.allfieldsdeals) {
                        var atual = Const.allfieldsdeals[id];

                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeDeal(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";

                }
                if (Const.allfieldsaccounts.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsaccounts[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsaccounts[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsaccounts[0]["module"] + "_ModuleFields\" style=\"display: none;\" >";


                    for (id in Const.allfieldsaccounts) {
                        var atual = Const.allfieldsaccounts[id];

                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeDeal(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";

                }
                if (Const.allfieldscontacts.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldscontacts[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldscontacts[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldscontacts[0]["module"] + "_ModuleFields\" style=\"display: none;\" >";


                    for (id in Const.allfieldscontacts) {
                        var atual = Const.allfieldscontacts[id];

                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeDeal(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";

                }
                if (Const.allfieldsusers.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsusers[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsusers[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsusers[0]["module"] + "_ModuleFields\" style=\"display: none;\" >";


                    for (id in Const.allfieldsusers) {
                        var atual = Const.allfieldsusers[id];


                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeDeal(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";


                }
                if (Const.allfieldsorgs.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsorgs[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsorgs[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsorgs[0]["module"] + "_ModuleFields\" style=\"display: none;\" >";

                    for (id in Const.allfieldsorgs) {
                        var atual = Const.allfieldsorgs[id];


                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeDeal(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";

                }

                $(".oA").html(ulFld);

                var pos = $(this).getCaretPosition();
                pos.top = getLineNumber("textCreate");
                pos.left = getColumnNumber("textCreate", pos.left, "templateMergeValuesDIV");
                var tamTop = e.target.offsetTop + pos.top + $("#textCreate").offset().top;
                var tamLeft = e.target.offsetLeft + pos.left + $("#textCreate").offset().left;


                $('#templateMergeValuesDIV').hide();
                $('#templateMergeValuesDIV').css({
                    'top': tamTop,
                    'left': tamLeft,
                    'position': 'absolute',
                    'border': '1px solid black'
                });
                $('#templateMergeValuesDIV').show();


            } else if (e.which == 8 || e.which == 27) {
                $('#templateMergeValuesDIV').hide();
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
    var linha = textarea.value.substr(0, textarea.selectionStart).split("\n").length;
    if (idtextarea == "textCreate") {
        if (linha > 4) {
            indicador = 92;
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
        } else {
            indicador = 104;
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
            var triangulo = $("#" + divpop).find("i").css({
                'right': '6px',
                'left': 'auto'
            });
        } else {
            ret = posleft;
            var triangulo = $("#" + divpop).find("i").css({
                'left': '6px',
                'right': 'auto'
            });
        }
    } else {
        if (posleft > 165) {
            ret = posleft - 210;
            var triangulo = $("#" + divpop).find("i").css({
                'right': '6px',
                'left': 'auto'
            });
        } else {
            ret = posleft;
            var triangulo = $("#" + divpop).find("i").css({
                'left': '6px',
                'right': 'auto'
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
    $("#selTemplate").multipleSelect('close');
    $("#modulesSelect option").each(function() {
        var currentopton = $(this).val();

        if (currentopton == entityName) {
            $("#modulesSelect").multipleSelect("setSelects", currentopton);
            activeFields()
        }
    });
}

function changeFunc(message) {
    //$("#textMsg").attr("disabled", true);
    if (message.includes("lead.")) {
        ZOHO.CRM.API.getRecord({ Entity: "Leads", RecordID: Const.idModulo })
            .then(function(data) {
                ZOHO.CRM.CONFIG.getCurrentUser().then(function(user) {
                    ZOHO.CRM.CONNECTOR.invokeAPI("crm.getorg", {}).then(function(org) {
                        var mensagem = message;
                        var listaPalavra = message.replace(/\n/ig, ' ').split(" ");

                        listaPalavra.forEach(word => {
                            if (word.includes("lead.")) {
                                //debugger;
                                var apiword = word.replace("lead.", "").replace(/,/g, "").replace(".", "").replace("!", "").replace("?", "").replace(";", "").replace(/\*/g, "");

                                var palavra = data.data[0][apiword];
                                if (palavra != null && palavra != "" && palavra != undefined) {

                                    if (palavra.name != undefined && palavra.name != "" && palavra.name != null) {
                                        palavra = data.data[0][apiword].name;
                                        if (palavra == null || palavra == "" || palavra == undefined) {
                                            palavra = "";
                                        }

                                    }
                                } else {
                                    palavra = "";
                                }

                                mensagem = mensagem.replace("lead." + apiword, palavra)


                            } else if (word.includes("user.")) {

                                var apiword = word.replace("user.", "").replace(/,/g, "").replace(".", "").replace("!", "").replace("?", "").replace(";", "").replace(/\*/g, "");
                                var palavra = user.users[0][apiword];
                                if (palavra.name != null && palavra.name != "" && palavra.name != "undefined") {
                                    palavra = palavra.name;
                                }

                                mensagem = mensagem.replace("user." + apiword, palavra);
                            } else if (word.includes("org.")) {
                                var orgInfo = JSON.parse(org);
                                orgInfo = JSON.parse(orgInfo.response).org[0];
                                var apiword = word.replace("org.", "").replace(/,/g, "").replace(".", "").replace("!", "").replace("?", "").replace(";", "").replace(/\*/g, "");
                                Object.keys(orgInfo).forEach(apiName => {
                                    if (apiName == apiword) {
                                        var palavra = orgInfo[apiword];
                                        if (orgInfo[apiword].name != null && orgInfo[apiword].name != "" && orgInfo[apiword].name != "undefined") {
                                            palavra = orgInfo[apiword].name;
                                        }
                                        mensagem = mensagem.replace("org." + apiword, palavra);

                                    }
                                });
                            }
                        })
                        $("textarea#textMsg").val(mensagem);

                    })
                })
            })

    } else if (message.includes("contact.") && !message.includes("deal.")) {
        ZOHO.CRM.API.getRecord({ Entity: "Contacts", RecordID: Const.idModulo })
            .then(function(data) {
                ZOHO.CRM.CONFIG.getCurrentUser().then(function(user) {
                    ZOHO.CRM.CONNECTOR.invokeAPI("crm.getorg", {}).then(function(org) {
                        var mensagem = message;
                        var listaPalavra = message.replace(/\n/ig, ' ').split(" ");
                        listaPalavra.forEach(word => {
                            if (word.includes("contact.")) {
                                var apiword = word.replace("contact.", "").replace(/,/g, "").replace(".", "").replace("!", "").replace("?", "").replace(";", "").replace(/\*/g, "");
                                if (data.data[0][apiword].name == "undefined" || data.data[0][apiword].name == "" || data.data[0][apiword].name == null) {
                                    mensagem = mensagem.replace("contact." + apiword, data.data[0][apiword])
                                } else {
                                    mensagem = mensagem.replace("contact." + apiword, data.data[0][apiword].name)
                                }

                            } else if (word.includes("user.")) {

                                var apiword = word.replace("user.", "").replace(/,/g, "").replace(".", "").replace("!", "").replace("?", "").replace(";", "").replace(/\*/g, "");
                                var palavra = user.users[0][apiword];
                                if (palavra.name != null && palavra.name != "" && palavra.name != "undefined") {
                                    palavra = palavra.name;
                                }

                                mensagem = mensagem.replace("user." + apiword, palavra);
                            } else if (word.includes("org.")) {
                                var orgInfo = JSON.parse(org);
                                orgInfo = JSON.parse(orgInfo.response).org[0];
                                var apiword = word.replace("org.", "").replace(/,/g, "").replace(".", "").replace("!", "").replace("?", "").replace(";", "").replace(/\*/g, "");
                                Object.keys(orgInfo).forEach(apiName => {
                                    if (apiName == apiword) {
                                        var palavra = orgInfo[apiword];
                                        if (orgInfo[apiword].name != null && orgInfo[apiword].name != "" && orgInfo[apiword].name != "undefined") {
                                            palavra = orgInfo[apiword].name;
                                        }
                                        mensagem = mensagem.replace("org." + apiword, palavra);

                                    }
                                });
                            }
                        })
                        $("textarea#textMsg").val(mensagem);

                    })
                })
            })
    } else if (message.includes("account." && !message.includes("deal."))) {
        ZOHO.CRM.API.getRecord({ Entity: "Accounts", RecordID: Const.idModulo })
            .then(function(data) {
                ZOHO.CRM.CONFIG.getCurrentUser().then(function(user) {
                    ZOHO.CRM.CONNECTOR.invokeAPI("crm.getorg", {}).then(function(org) {
                        var mensagem = message;
                        var listaPalavra = message.replace(/\n/ig, ' ').split(" ");
                        listaPalavra.forEach(word => {
                            if (word.includes("account.")) {
                                var apiword = word.replace("account.", "").replace(/,/g, "").replace(".", "").replace("!", "").replace("?", "").replace(";", "").replace(/\*/g, "");
                                if (data.data[0][apiword].name == "undefined" || data.data[0][apiword].name == "" || data.data[0][apiword].name == null) {
                                    mensagem = mensagem.replace("account." + apiword, data.data[0][apiword])
                                } else {
                                    mensagem = mensagem.replace("account." + apiword, data.data[0][apiword].name)
                                }

                            } else if (word.includes("user.")) {

                                var apiword = word.replace("user.", "").replace(/,/g, "").replace(".", "").replace("!", "").replace("?", "").replace(";", "").replace(/\*/g, "");
                                var palavra = user.users[0][apiword];
                                if (palavra.name != null && palavra.name != "" && palavra.name != "undefined") {
                                    palavra = palavra.name;
                                }

                                mensagem = mensagem.replace("user." + apiword, palavra);
                            } else if (word.includes("org.")) {
                                var orgInfo = JSON.parse(org);
                                orgInfo = JSON.parse(orgInfo.response).org[0];
                                var apiword = word.replace("org.", "").replace(/,/g, "").replace(".", "").replace("!", "").replace("?", "").replace(";", "").replace(/\*/g, "");
                                Object.keys(orgInfo).forEach(apiName => {
                                    if (apiName == apiword) {
                                        var palavra = orgInfo[apiword];
                                        if (orgInfo[apiword].name != null && orgInfo[apiword].name != "" && orgInfo[apiword].name != "undefined") {
                                            palavra = orgInfo[apiword].name;
                                        }
                                        mensagem = mensagem.replace("org." + apiword, palavra);

                                    }
                                });
                            }
                        })
                        $("textarea#textMsg").val(mensagem);

                    })
                })
            })
    } else if (message.includes("deal.")) {
        ZOHO.CRM.API.getRecord({ Entity: "Deals", RecordID: Const.idModulo })
            .then(function(data) {
                var idCont = "";
                var idConta = "";
                if (data.data[0].Contact_Name != null && data.data[0].Contact_Name != "" && data.data[0].Contact_Name != undefined) {
                    idCont = data.data[0].Contact_Name.id;
                } else {
                    idCont = Const.idModulo;
                }
                if (data.data[0].Account_Name != null && data.data[0].Account_Name != "" && data.data[0].Account_Name != undefined) {
                    idConta = data.data[0].Contact_Name.id;
                } else {
                    idConta = Const.idModulo;
                }
                ZOHO.CRM.API.getRecord({ Entity: "Contacts", RecordID: idCont })
                    .then(function(contact) {
                        ZOHO.CRM.API.getRecord({ Entity: "Accounts", RecordID: idConta })
                            .then(function(account) {
                                ZOHO.CRM.CONFIG.getCurrentUser().then(function(user) {
                                    ZOHO.CRM.CONNECTOR.invokeAPI("crm.getorg", {}).then(function(org) {
                                        var mensagem = message;
                                        var listaPalavra = message.replace(/\n/ig, ' ').split(" ");
                                        listaPalavra.forEach(word => {
                                            if (word.includes("deal.")) {
                                                var apiword = word.replace("deal.", "").replace(/,/g, "").replace(".", "").replace("!", "").replace("?", "").replace(";", "").replace(/\*/g, "");
                                                if (data.data[0][apiword].name == undefined || data.data[0][apiword].name == "" || data.data[0][apiword].name == null) {
                                                    mensagem = mensagem.replace("deal." + apiword, data.data[0][apiword])
                                                } else {
                                                    mensagem = mensagem.replace("deal." + apiword, data.data[0][apiword].name)
                                                }

                                            } else if (word.includes("user.")) {

                                                var apiword = word.replace("user.", "").replace(/,/g, "").replace(".", "").replace("!", "").replace("?", "").replace(";", "").replace(/\*/g, "");
                                                var palavra = user.users[0][apiword];
                                                if (palavra.name != null && palavra.name != "" && palavra.name != "undefined") {
                                                    palavra = palavra.name;
                                                }

                                                mensagem = mensagem.replace("user." + apiword, palavra);
                                            } else if (word.includes("org.")) {
                                                var orgInfo = JSON.parse(org);
                                                orgInfo = JSON.parse(orgInfo.response).org[0];
                                                var apiword = word.replace("org.", "").replace(/,/g, "").replace(".", "").replace("!", "").replace("?", "").replace(";", "").replace(/\*/g, "");
                                                Object.keys(orgInfo).forEach(apiName => {
                                                    if (apiName == apiword) {
                                                        var palavra = orgInfo[apiword];
                                                        if (orgInfo[apiword].name != null && orgInfo[apiword].name != "" && orgInfo[apiword].name != "undefined") {
                                                            palavra = orgInfo[apiword].name;
                                                        }
                                                        mensagem = mensagem.replace("org." + apiword, palavra);

                                                    }
                                                });
                                            } else if (word.includes("contact.")) {

                                                var apiword = word.replace("contact.", "").replace(",", "").replace(".", "").replace("!", "").replace("?", "").replace(";", "").replace(/\*/g, "");
                                                if (typeof contact.data[0][apiword] != "object") {
                                                    mensagem = mensagem.replace("contact." + apiword, contact.data[0][apiword])
                                                } else {
                                                    mensagem = mensagem.replace("contact." + apiword, contact.data[0][apiword].name)
                                                }
                                            } else if (word.includes("account.")) {
                                                var apiword = word.replace("account.", "").replace(/,/g, "").replace(".", "").replace("!", "").replace("?", "").replace(";", "").replace(/\*/g, "");
                                                if (typeof account.data[0][apiword] != "object") {
                                                    mensagem = mensagem.replace("account." + apiword, account.data[0][apiword]);
                                                } else {
                                                    mensagem = mensagem.replace("account." + apiword, account.data[0][apiword].name);
                                                }
                                            }
                                        })
                                        $("textarea#textMsg").val(mensagem);

                                    })
                                })
                            })
                    })
            })
    } else {
        if (message != "Vazio") {
            $("textarea#textMsg").val(message);

        }
    }

    if (message.includes("org.") && !message.includes("lead.") && !message.includes("contact.") && !message.includes("account.") && !message.includes("deal.")) {

        ZOHO.CRM.CONNECTOR.invokeAPI("crm.getorg", {}).then(function(data) {
            var mensagem = $("textarea#textMsg").val();
            var listaPalavra = mensagem.replace(/\n/ig, ' ').split(" ");
            listaPalavra.forEach(word => {
                if (word.includes("org.")) {
                    var apiword = word.replace("org.", "").replace(/,/g, "").replace(".", "").replace("!", "").replace("?", "").replace(";", "").replace(/\*/g, "");
                    var orgInfo = JSON.parse(data);
                    orgInfo = JSON.parse(orgInfo.response).org[0];
                    Object.keys(orgInfo).forEach(apiName => {

                        if (apiName == apiword) {
                            var palavra = orgInfo[apiword];
                            if (orgInfo[apiword].name != null && orgInfo[apiword].name != "" && orgInfo[apiword].name != "undefined") {
                                palavra = orgInfo[apiword].name;
                            }
                            mensagem = mensagem.replace("org." + apiword, palavra);
                            $("textarea#textMsg").val(mensagem);

                        }
                    })

                }
            });

        });
    } else {
        if (message != "Vazio") {
            $("textarea#textMsg").val(message);

        }
    }
    if (message.includes("user.") && !message.includes("lead.") && !message.includes("contact.") && !message.includes("account.") && !message.includes("deal.")) {
        ZOHO.CRM.CONFIG.getCurrentUser().then(function(data) {
            var mensagem = $("textarea#textMsg").val();
            var listaPalavra = mensagem.replace(/\n/ig, ' ').split(" ");
            listaPalavra.forEach(word => {
                if (word.includes("user.")) {
                    var apiword = word.replace("user.", "").replace(/,/g, "").replace(".", "").replace("!", "").replace("?", "").replace(";", "").replace(/\*/g, "");
                    var palavra = data.users[0][apiword];
                    if (palavra.name != null && palavra.name != "" && palavra.name != "undefined") {
                        palavra = palavra.name;
                    }
                    mensagem = mensagem.replace("user." + apiword, palavra);
                    $("textarea#textMsg").val(mensagem);

                    $("textarea#textMsg").focus();
                }
            });
        });
    } else {
        if (message != "Vazio") {
            $("textarea#textMsg").val(message);

        }
    }
}

async function sendMsg() {
    var numCel = $("#leadDefault option:selected").val();
    var msg = $("textarea#textMsg").val();
    var continua = true;

    await ZOHO.CRM.API.getOrgVariable(Const.apinames.apiurlbase).then(async function(data) {
        Const.apiurlbase = data.Success.Content;
    });


    if (numCel != null && numCel != "") {
        numCel = numCel.replace("(", "").replace(")", "").replace("-").replace("+").replace("|").replace("/").replace(" ").trim();

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
                        Utils.errorMsg("ErroMsg", "msg-error-invalid-num", false, false);
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
                        walimsg = msg;
                        msg = encodeURI(msg);
                        var reqUrl = "";
                        if (appName == "zapbox") {
                            reqUrl = Const.apiurlbase + "/send/" + tokenApp + "?cmd=chat&id=" + Const.entityName.toLowerCase() + "-" + Const.idModulo + "&to=" + numCel + "@c.us&msg=" + msg;
                            var request = {
                                url: reqUrl,
                            }
                            ZOHO.CRM.HTTP.get(request)
                                .then(function(res) {
                                    //console.log(res)
                                    Utils.successMsg("SuccessMsg", "msg-success-sent-message", false, true);
                                    /*$('#SuccessMsg').find('.sucesText').html("Mensagem enviada com sucesso.");
                                    $('#SuccessMsg').slideDown(function() {
                                        $('#SuccessMsg').delay(3000).slideUp(function() {
                                            ZOHO.CRM.UI.Popup.close();
                                        });
                                    });*/

                                })
                        } else if (appName == "zapphub") {
                            var func_name = "whatsapphubforzohocrm__sendmessagezapphub";
                            var req_data = {
                                "arguments": JSON.stringify({
                                    "actualModule": Const.entityName.toLowerCase(),
                                    "actualId": Const.idModulo,
                                    "numCel": numCel,
                                    "messages": msg
                                })
                            };
                            ZOHO.CRM.FUNCTIONS.execute(func_name, req_data).then(async function(data) {
                                console.log(data);
                                Utils.successMsg("SuccessMsg", "msg-success-sent-message", false, true);
                            });

                        } else {

                            Utils.errorMsg("ErroMsg", "msg-error-sel-app", false, true);

                        }




                    } else {
                        Utils.errorMsg("ErroMsg", "msg-error-token-app", false, true);
                        /*$('#ErroMsg').find('.erroText').html("Não há token configurado, complete a configuração e tente novamente.");
                        $('#ErroMsg').slideDown(function() {
                            $('#ErroMsg').delay(3000).slideUp(function() {
                                ZOHO.CRM.UI.Popup.close();
                            });
                        });*/
                    }
                });

            } else {
                Utils.errorMsg("ErroMsg", "msg-error-null-msg", false, false);
                /*
                $('#ErroMsg').find('.erroText').html("A mensagem não pode ser nula");
                $('#ErroMsg').slideDown(function() {
                    $('#ErroMsg').delay(3000).slideUp();
                });*/
                //alert("A mensagem não pode ser nula");
            }
        }
    } else {
        Utils.errorMsg("ErroMsg", "msg-error-invalid-fill", false, false);
        /*$('#ErroMsg').find('.erroText').html("Preencha com um número telefônico");
        $('#ErroMsg').slideDown(function() {
            $('#ErroMsg').delay(3000).slideUp();
        });*/
        //alert("Preencha com um número telefônico");
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

Utils.setMergeLead = function(e) {
    var contentArea = $("#textCreate").val();
    $("#textCreate").val(contentArea.replace("#", e.getAttribute("val")));
    $('#templateMergeValuesDIV').hide();
    $("#textCreate").focus();
}

Utils.setMergeLead2 = function(e) {
    var contentArea = $("textarea#textMsg").val();
    var leadField = "";
    if (e.getAttribute("val").includes("lead.")) {
        ZOHO.CRM.API.getRecord({ Entity: "Leads", RecordID: Const.idModulo })
            .then(function(data) {
                if (e.getAttribute("val").includes("lead.")) {
                    var apiword = e.getAttribute("val").replace("lead.", "").replace(/,/g, "").replace(".", "").replace("!", "").replace("?", "").replace(";", "").replace(/\*/g, "");
                    leadField = data.data[0][apiword];

                    if (leadField != "" && leadField != null && leadField != "undefined") {

                        if (leadField.name != null && leadField.name != "" && leadField.name != "undefined") {
                            leadField = leadField.name;
                        }
                        $("textarea#textMsg").val(contentArea.replace("#", leadField));

                    } else {
                        $("textarea#textMsg").val(contentArea.replace("#", ""));
                    }
                }
                //$("#textMsg").val(contentArea.replace("#", leadField));
                $('#templateMergeValuesDIV2').hide();
                $("#textMsg").focus();

            })

    } else if (e.getAttribute("val").includes("org.")) {
        ZOHO.CRM.CONNECTOR.invokeAPI("crm.getorg", {}).then(function(data) {
            var orgInfo = JSON.parse(data);
            orgInfo = JSON.parse(orgInfo.response).org[0];
            Object.keys(orgInfo).forEach(apiName => {
                if (apiName == e.getAttribute("val").replace("org.", "")) {
                    $("textarea#textMsg").val(contentArea.replace("#", orgInfo[apiName]));
                    $('#templateMergeValuesDIV2').hide();
                    $("#textMsg").focus();
                }
            })
        })
    } else if (e.getAttribute("val").includes("user.")) {
        ZOHO.CRM.CONFIG.getCurrentUser().then(function(data) {
            var palavra = data.users[0][e.getAttribute("val").replace("user.", "")];
            if (palavra.name != null && palavra.name != "" && palavra.name != "undefined") {
                palavra = palavra.name;
            }
            $("textarea#textMsg").val(contentArea.replace("#", palavra));
            $('#templateMergeValuesDIV2').hide();
            $("#textMsg").focus();
        });

    } else {
        $("textarea#textMsg").val(contentArea.replace("#", ""));
        $('#templateMergeValuesDIV2').hide();
        $("#textMsg").focus();
    }
}

Utils.setMergeContact = function(e) {
    var contentArea = $("#textCreate").val();
    $("#textCreate").val(contentArea.replace("#", e.getAttribute("val")));
    $('#templateMergeValuesDIV').hide();
    $("#textCreate").focus();
}

Utils.setMergeContact2 = function(e) {
    var contentArea = $("textarea#textMsg").val();
    var contactField = "";
    if (e.getAttribute("val").includes("contact.")) {
        ZOHO.CRM.API.getRecord({ Entity: "Contacts", RecordID: Const.idModulo })
            .then(function(data) {
                if (e.getAttribute("val").includes("contact.")) {
                    var apiword = e.getAttribute("val").replace("contact.", "").replace(/,/g, "").replace(".", "").replace("!", "").replace("?", "").replace(";", "").replace(/\*/g, "");
                    contactField = data.data[0][apiword];
                    if (contactField.name != null && contactField.name != "" && contactField.name != "undefined") {
                        contactField = contactField.name;
                    }
                }
                $("textarea#textMsg").val(contentArea.replace("#", contactField));
                $('#templateMergeValuesDIV2').hide();
                $("#textMsg").focus();
            });
    } else if (e.getAttribute("val").includes("org.")) {
        ZOHO.CRM.CONNECTOR.invokeAPI("crm.getorg", {}).then(function(data) {
            var orgInfo = JSON.parse(data);
            orgInfo = JSON.parse(orgInfo.response).org[0];
            Object.keys(orgInfo).forEach(apiName => {
                if (apiName == e.getAttribute("val").replace("org.", "")) {
                    $("textarea#textMsg").val(contentArea.replace("#", orgInfo[apiName]));
                    $('#templateMergeValuesDIV2').hide();
                    $("#textMsg").focus();
                }
            })
        })
    } else if (e.getAttribute("val").includes("user.")) {
        ZOHO.CRM.CONFIG.getCurrentUser().then(function(data) {
            var palavra = data.users[0][e.getAttribute("val").replace("user.", "")];
            if (palavra.name != null && palavra.name != "" && palavra.name != "undefined") {
                palavra = palavra.name;
            }
            $("textarea#textMsg").val(contentArea.replace("#", palavra));
            $('#templateMergeValuesDIV2').hide();
            $("#textMsg").focus();
        });

    } else {
        $("textarea#textMsg").val(contentArea.replace("#", ""));
        $('#templateMergeValuesDIV2').hide();
        $("#textMsg").focus();
    }
}

Utils.setMergeAccount = function(e) {
    var contentArea = $("#textCreate").val();
    $("#textCreate").val(contentArea.replace("#", e.getAttribute("val")));
    $('#templateMergeValuesDIV').hide();
    $("#textCreate").focus();
}

Utils.setMergeAccount2 = function(e) {
    var contentArea = $("textarea#textMsg").val();
    var accountField = "";
    if (e.getAttribute("val").includes("account.")) {
        ZOHO.CRM.API.getRecord({ Entity: "Accounts", RecordID: Const.idModulo })
            .then(function(data) {
                if (e.getAttribute("val").includes("account.")) {
                    var apiword = e.getAttribute("val").replace("account.", "").replace(/,/g, "").replace(".", "").replace("!", "").replace("?", "").replace(";", "").replace(/\*/g, "");
                    accountField = data.data[0][apiword];
                    if (accountField.name != null && accountField.name != "" && accountField.name != "undefined") {
                        accountField = accountField.name;
                    }
                }

                $("textarea#textMsg").val(contentArea.replace("#", accountField));
                $('#templateMergeValuesDIV2').hide();
                $("#textMsg").focus();
            });
    } else if (e.getAttribute("val").includes("org.")) {
        ZOHO.CRM.CONNECTOR.invokeAPI("crm.getorg", {}).then(function(data) {
            var orgInfo = JSON.parse(data);
            orgInfo = JSON.parse(orgInfo.response).org[0];
            Object.keys(orgInfo).forEach(apiName => {
                if (apiName == e.getAttribute("val").replace("org.", "")) {
                    $("textarea#textMsg").val(contentArea.replace("#", orgInfo[apiName]));
                    $('#templateMergeValuesDIV2').hide();
                    $("#textMsg").focus();
                }
            })
        })
    } else if (e.getAttribute("val").includes("user.")) {
        ZOHO.CRM.CONFIG.getCurrentUser().then(function(data) {
            var palavra = data.users[0][e.getAttribute("val").replace("user.", "")];
            if (palavra.name != null && palavra.name != "" && palavra.name != "undefined") {
                palavra = palavra.name;
            }
            $("textarea#textMsg").val(contentArea.replace("#", palavra));
            $('#templateMergeValuesDIV2').hide();
            $("#textMsg").focus();
        });

    } else {
        $("textarea#textMsg").val(contentArea.replace("#", ""));
        $('#templateMergeValuesDIV2').hide();
        $("#textMsg").focus();
    }
}

Utils.setMergeDeal = function(e) {
    var contentArea = $("#textCreate").val();
    $("#textCreate").val(contentArea.replace("#", e.getAttribute("val")));
    $('#templateMergeValuesDIV').hide();
    $("#textCreate").focus();
}

Utils.setMergeDeal2 = function(e) {
    var contentArea = $("textarea#textMsg").val();
    var dealField = "";
    if (e.getAttribute("val").includes("deal.")) {
        ZOHO.CRM.API.getRecord({ Entity: "Deals", RecordID: Const.idModulo })
            .then(function(data) {
                if (e.getAttribute("val").includes("deal.")) {
                    var apiword = e.getAttribute("val").replace("deal.", "").replace(/,/g, "").replace(".", "").replace("!", "").replace("?", "").replace(";", "").replace(/\*/g, "");
                    dealField = data.data[0][apiword];
                    if (dealField.name != null && dealField.name != "" && dealField.name != "undefined") {
                        dealField = dealField.name;
                    }
                }
                $("textarea#textMsg").val(contentArea.replace("#", dealField));
                $('#templateMergeValuesDIV2').hide();
                $("#textMsg").focus();
            });
    } else if (e.getAttribute("val").includes("account.")) {
        ZOHO.CRM.API.getRecord({ Entity: "Deals", RecordID: Const.idModulo })
            .then(function(deal) {

                ZOHO.CRM.API.getRecord({ Entity: "Accounts", RecordID: deal.data[0].Account_Name.id })
                    .then(function(data) {

                        if (e.getAttribute("val").includes("account.")) {
                            var apiword = e.getAttribute("val").replace("account.", "").replace(/,/g, "").replace(".", "").replace("!", "").replace("?", "").replace(";", "").replace(/\*/g, "");
                            accountField = data.data[0][apiword];
                            if (accountField.name != null && accountField.name != "" && accountField.name != "undefined") {
                                accountField = accountField.name;
                            }
                        }

                        $("textarea#textMsg").val(contentArea.replace("#", accountField));
                        $('#templateMergeValuesDIV2').hide();
                        $("#textMsg").focus();
                    });
            });
    } else if (e.getAttribute("val").includes("contact.")) {
        ZOHO.CRM.API.getRecord({ Entity: "Deals", RecordID: Const.idModulo })
            .then(function(deal) {
                ZOHO.CRM.API.getRecord({ Entity: "Contacts", RecordID: deal.data[0].Contact_Name.id })
                    .then(function(data) {
                        if (e.getAttribute("val").includes("contact.")) {
                            var apiword = e.getAttribute("val").replace("contact.", "").replace(/,/g, "").replace(".", "").replace("!", "").replace("?", "").replace(";", "").replace(/\*/g, "");
                            contactField = data.data[0][apiword];
                            if (contactField.name != null && contactField.name != "" && contactField.name != "undefined") {
                                contactField = contactField.name;
                            }
                        }
                        $("textarea#textMsg").val(contentArea.replace("#", contactField));
                        $('#templateMergeValuesDIV2').hide();
                        $("#textMsg").focus();
                    });
            });
    } else if (e.getAttribute("val").includes("org.")) {
        ZOHO.CRM.CONNECTOR.invokeAPI("crm.getorg", {}).then(function(data) {
            var orgInfo = JSON.parse(data);
            orgInfo = JSON.parse(orgInfo.response).org[0];
            Object.keys(orgInfo).forEach(apiName => {
                if (apiName == e.getAttribute("val").replace("org.", "")) {
                    $("textarea#textMsg").val(contentArea.replace("#", orgInfo[apiName]));
                    $('#templateMergeValuesDIV2').hide();
                    $("#textMsg").focus();
                }
            })

        })
    } else if (e.getAttribute("val").includes("user.")) {
        ZOHO.CRM.CONFIG.getCurrentUser().then(function(data) {
            var palavra = data.users[0][e.getAttribute("val").replace("user.", "")];
            if (palavra.name != null && palavra.name != "" && palavra.name != "undefined") {
                palavra = palavra.name;
            }
            $("textarea#textMsg").val(contentArea.replace("#", palavra));
            $('#templateMergeValuesDIV2').hide();
            $("#textMsg").focus();
        });

    } else {
        $("textarea#textMsg").val(contentArea.replace("#", ""));
        $('#templateMergeValuesDIV2').hide();
        $("#textMsg").focus();
    }
}

Utils.selectFields = function() {
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
}

Utils.selectFields2 = function() {

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
}

Utils.getTemplates = function(entityName) {
    ZOHO.CRM.API.searchRecord({ Entity: Const.apinames.apitemplate, Type: "criteria", Query: "(whatsapphubforzohocrm__Module:equals:" + entityName + ")" })
        .then(function(data) {
            //console.log(data);
            var fldSel = "<select id=\"selTemplate\" class=\"newSelect\" style=\"width:300px\" required=\"true\" ><option value=\"Vazio\">-None-</option>";
            if (data.data != null && data.data != "" && data.data != undefined) {
                data.data.forEach(template => {
                    //console.log(template.whatsapphubforzohocrm__Message)
                    fldSel = fldSel + "<option value=\"" + template.whatsapphubforzohocrm__Message + "\">" + template.Name + "</option>";
                })
            }
            fldSel = fldSel + "</select>";

            $("#tempSelect").html(fldSel);
        })
    $("#selTemplate").multipleSelect({
        filter: true,
    });
}


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
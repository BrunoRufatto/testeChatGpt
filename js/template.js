var Const = {
    apinames: {
        apitemplates: "whatsapphubforzohocrm__WhatsApp_Templates"

    },
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
    languages: ["en_US", "pt_BR", "es_ES"],
    deflang: "en_US",
    desclanguage: {},
    pesquisa: "",
    configPurify: { ALLOWED_TAGS: ['b'], KEEP_CONTENT: false }
}

var idEdit = "";
var paginaatual = 1;

function initializeWidget() {
    ZOHO.embeddedApp.on("PageLoad", async function(data) {
        console.log(data);
        var input = document.getElementById("textMsg");
        var inputtemp = document.getElementById("tempMessage");

        /*var picker = new EmojiButton({
            position: "bottom-start",
        });

        var pickertemp = new EmojiButtonTemp({
            position: "bottom-start",
        });

        picker.on("emoji", function(emoji) {

            var curPos = document.getElementById("textMsg").selectionStart;
            let x = $("#textMsg").val();
            let text_to_insert = emoji;
            $("#textMsg").val(
                x.slice(0, curPos) + text_to_insert + x.slice(curPos)
            );
        });

        pickertemp.on("emoji", function(emoji) {

            var curPos = document.getElementById("tempMessage").selectionStart;
            let x = $("#tempMessage").val();
            let text_to_insert = emoji;
            $("#tempMessage").val(
                x.slice(0, curPos) + text_to_insert + x.slice(curPos)
            );
        });

        $("#btnEmoji").click(function() {
            picker.pickerVisible ? picker.hidePicker() : picker.showPicker(input);
        });
        $("#btnEmojiTemp").click(function() {
            pickertemp.pickerVisible ? pickertemp.hidePicker() : pickertemp.showPicker(inputtemp);
        });*/

        await ZOHO.CRM.CONFIG.getCurrentUser().then(function(data) {
            console.log(data);
            return ZOHO.CRM.API.getUser({ ID: data.users[0].id })
                .then(async function(data) {
                    console.log(data);
                    if (Const.languages.includes(data.users[0].language)) {
                        Const.deflang = data.users[0].language;
                    }
                    return Utils.RenderTemplate(Const.deflang);
                    //$("#allPage").show();

                })

        })

        await ZOHO.CRM.META.getModules().then(async function(data) {
            console.log(data);
            data.modules.forEach(modulo => {
                var apimodulo = modulo.api_name;

                if (apimodulo.toLowerCase() == "leads") {

                    if (!modulo.visible) {

                        Const.enablemodule.leads = false;
                    } else {
                        Const.enablemodule.leads = true;
                    }
                } else if (apimodulo.toLowerCase() == "contacts") {
                    if (!modulo.visible) {

                        Const.enablemodule.contacts = false;
                    } else {
                        Const.enablemodule.contacts = true;
                    }
                } else if (apimodulo.toLowerCase() == "accounts") {
                    if (!modulo.visible) {

                        Const.enablemodule.accounts = false;
                    } else {
                        Const.enablemodule.accounts = true;
                    }
                } else if (apimodulo.toLowerCase() == "deals") {
                    if (!modulo.visible) {

                        Const.enablemodule.deals = false;
                    } else {
                        Const.enablemodule.deals = true;
                    }
                }
            })
            console.log(Const.enablemodule);

            await ZOHO.CRM.API.getAllRecords({
                Entity: Const.apinames.apitemplates,
                sort_order: "asc",
                per_page: 10,
                page: 1,
            }).then(function(template) {
                paginatotal = template.info;
                if (paginatotal != undefined && paginatotal != "" && paginatotal != null) {
                    paginatotal = paginatotal.more_records;
                } else {
                    $("#closeShowMore").hide();
                }
                if (!paginatotal) {
                    $("#closeShowMore").hide();
                }
                if (template.data != null && template.data != "" && template.data != undefined) {
                    template.data.forEach((temp) => {
                        createLine =
                            '<tr><td class="id-reg">' +
                            temp.id +
                            "</td><td>" +
                            temp.Name +
                            "</td><td>" +
                            temp.whatsapphubforzohocrm__Module +
                            '</td><td><button class="button button1 tablebutton show-reg">' + Const.desclanguage["btn-view"] + '</button></td><td><button class="button button1 tablebutton edit-reg">' + Const.desclanguage["btn-edit"] + '</button></td><td><button class="button button1 tablebutton del-reg">' + Const.desclanguage["btn-delete"] + '</button></td>';
                        $("#ealine").append(createLine);
                    });
                }

                if (Const.enablemodule.leads) {
                    ZOHO.CRM.META.getFields({
                        "Entity": "Leads"
                    }).then(function(data) {
                        var resp = data;
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
                if (Const.enablemodule.contacts) {
                    ZOHO.CRM.META.getFields({
                        "Entity": "Contacts"
                    }).then(function(data) {

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
                debugger;
                if (Const.enablemodule.accounts) {

                    ZOHO.CRM.META.getFields({
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
                    });
                }
                debugger;
                if (Const.enablemodule.deals) {
                    ZOHO.CRM.META.getFields({
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
                    });
                } 
                debugger;
                ZOHO.CRM.META.getFields({
                    "Entity": "Users"
                }).then(function(data) {
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
                        Object.keys(orgInfo).forEach(apiName => {
                                var nome = apiName.replace(/_/g, " ").split(" ");
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
                            //console.log(data);
                            /*
                            Const.allfieldsorgs.push({
                                desc: "Id",
                                name: "id",
                                type: "text",
                                module: "Orgs"
                            });
                            Const.allfieldsorgs.push({
                                desc: "Company Name",
                                name: "company_name",
                                type: "text",
                                module: "Orgs"
                            });
                            Const.allfieldsorgs.push({
                                desc: "Alias",
                                name: "alias",
                                type: "text",
                                module: "Orgs"
                            });
                            Const.allfieldsorgs.push({
                                desc: "Employee Count",
                                name: "employee_count",
                                type: "text",
                                module: "Orgs"
                            });
                            Const.allfieldsorgs.push({
                                desc: "Phone",
                                name: "phone",
                                type: "text",
                                module: "Orgs"
                            });
                            Const.allfieldsorgs.push({
                                desc: "Mobile",
                                name: "mobile",
                                type: "text",
                                module: "Orgs"
                            });
                            Const.allfieldsorgs.push({
                                desc: "Fax",
                                name: "fax",
                                type: "text",
                                module: "Orgs"
                            });
                            Const.allfieldsorgs.push({
                                desc: "WebSite",
                                name: "website",
                                type: "text",
                                module: "Orgs"
                            });
                            Const.allfieldsorgs.push({
                                desc: "Primary Email",
                                name: "primary_email",
                                type: "text",
                                module: "Orgs"
                            });
                            Const.allfieldsorgs.push({
                                desc: "Street",
                                name: "street",
                                type: "text",
                                module: "Orgs"
                            });
                            Const.allfieldsorgs.push({
                                desc: "City",
                                name: "city",
                                type: "text",
                                module: "Orgs"
                            });
                            Const.allfieldsorgs.push({
                                desc: "State",
                                name: "state",
                                type: "text",
                                module: "Orgs"
                            });
                            Const.allfieldsorgs.push({
                                desc: "Zip Code",
                                name: "zip",
                                type: "text",
                                module: "Orgs"
                            });
                            Const.allfieldsorgs.push({
                                desc: "Country",
                                name: "country",
                                type: "text",
                                module: "Orgs"
                            });
                            Const.allfieldsorgs.push({
                                desc: "Currency",
                                name: "currency",
                                type: "text",
                                module: "Orgs"
                            });
                            Const.allfieldsorgs.push({
                                desc: "Currency Code",
                                name: "iso_code",
                                type: "text",
                                module: "Orgs"
                            });
                            Const.allfieldsorgs.push({
                                desc: "Currency Symbol",
                                name: "currency_symbol",
                                type: "text",
                                module: "Orgs"
                            });
                            Const.allfieldsorgs.push({
                                desc: "Currency Locale",
                                name: "currency_locale",
                                type: "text",
                                module: "Orgs"
                            });
                            Const.allfieldsorgs.push({
                                desc: "Contry Code",
                                name: "contry_code",
                                type: "text",
                                module: "Orgs"
                            });*/

                    }).then(function() {
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

                            var contentArea = $("#textMsg").val();
                            if (contentArea == undefined) {
                                contentArea = "";
                            }
                            if (contentArea.includes("#")) { //(contentArea.includes("#")) {
                                $("#textMsg").val(contentArea.replace("#", ""));
                                $("#textMsg").focus();
                            }

                            var contentArea2 = $("#tempMessage").val();
                            if (contentArea2 == undefined) {
                                contentArea2 = "";
                            }
                            if (contentArea2.includes("#")) { //(contentArea.includes("#")) {
                                $("#tempMessage").val(contentArea2.replace("#", ""));
                                $("#tempMessage").focus();
                            }

                        });
                    });


                });

            }).then(function() {

                $("#cont").delay(1000).slideUp(function() {
                    $("#mainDiv").slideDown();

                });
            });
        });
    });

    ZOHO.embeddedApp.init();

    $(document).on("click", ".show-reg", function() {
        var item = $(this).closest("tr").find(".id-reg").text();

        ZOHO.CRM.API.getRecord({
            Entity: Const.apinames.apitemplates,
            RecordID: item,
        }).then(function(data) {
            $("#exibirPopup").show();
            $("#exibeName").val(data.data[0].Name);
            $("#exibeMessage").val(data.data[0].whatsapphubforzohocrm__Message);
            $("#exibeSelect").val(data.data[0].whatsapphubforzohocrm__Module);
        });
        $("#mainDiv").css("pointer-events", "none");
    });

    $(document).on("click", ".edit-reg", function() {

        idEdit = "";
        var item = $(this).closest("tr").find(".id-reg").text();
        idEdit = item;

        ZOHO.CRM.API.getRecord({
            Entity: Const.apinames.apitemplates,
            RecordID: item,
        }).then(function(data) {

            $("#editPopup").show();
            $("#tempMessage").val(data.data[0].whatsapphubforzohocrm__Message);
            $("#tempName").val(data.data[0].Name);
            $("#tempSelect").multipleSelect('destroy');

            $("#tempSelect option").each(async function() {

                if (!Const.enablemodule.leads) {

                    if ($(this).val().toLowerCase() == "leads") {
                        $(this).attr('disabled', 'disabled');
                    }
                }
                if (!Const.enablemodule.contacts) {
                    if ($(this).val().toLowerCase() == "contacts") {
                        $(this).attr('disabled', 'disabled');
                    }
                }
                if (!Const.enablemodule.accounts) {
                    if ($(this).val().toLowerCase() == "accounts") {
                        $(this).attr('disabled', 'disabled');
                    }
                }
                if (!Const.enablemodule.deals) {
                    if ($(this).val().toLowerCase() == "deals") {
                        $(this).attr('disabled', 'disabled');
                    }
                }

                var currentopton = $(this).val();
                if (currentopton == data.data[0].whatsapphubforzohocrm__Module) {
                    $(this).prop("selected", true);
                    activeFields2();
                }

            });

            $("#tempSelect").multipleSelect()

            /*$("#tempSelect option").each(function() {

                var currentopton = $(this).val();

                if (currentopton == data.data[0].whatsapphubforzohocrm__Module) {
                    $(this).prop("selected", true);
                    $("#tempSelect").multipleSelect("setSelects", currentopton);
                    activeFields2()
                }
            });*/



        });

        $("#mainDiv").css("pointer-events", "none");
    });

    $(document).on("click", ".del-reg", function() {
        var item = $(this).closest("tr").find(".id-reg").text();

        ZOHO.CRM.API.deleteRecord({
            Entity: Const.apinames.apitemplates,
            RecordID: item,
        }).then(function(data) {
            Utils.successMsg("SuccessMsg", "msg-success-delete-template", true);
            /*$("#SuccessMsg")
                .find(".sucesText")
                .html("Registro excluído com sucesso!");
            $("#SuccessMsg").slideDown(function() {
                debugger;
                $("#SuccessMsg")
                    .delay(3000)
                    .slideUp(function() {
                        location.reload();
                    });
            });*/
        });
        $("#mainDiv").css("pointer-events", "none");
    });
}

function closeSpanMsg(idDiv) {
    $("#" + idDiv).hide();
}

function openForm() {
    document.getElementById("myForm").style.display = "block";

    $("#modulesSelect option").each(function() {

        if (!Const.enablemodule.leads) {

            if ($(this).val().toLowerCase() == "leads") {
                $(this).attr('disabled', 'disabled');
            }
        }
        if (!Const.enablemodule.contacts) {
            if ($(this).val().toLowerCase() == "contacts") {
                $(this).attr('disabled', 'disabled');
            }
        }
        if (!Const.enablemodule.accounts) {
            if ($(this).val().toLowerCase() == "accounts") {
                $(this).attr('disabled', 'disabled');
            }
        }
        if (!Const.enablemodule.deals) {
            if ($(this).val().toLowerCase() == "deals") {
                $(this).attr('disabled', 'disabled');
            }
        }
        $("#modulesSelect").multipleSelect('destroy');
        $("#modulesSelect").multipleSelect();
    });

    $("#mainDiv").css("pointer-events", "none");
}

function moduleLoading() {
    optionSelected = $("#modulesSelect").val();
    $("#textMsg").val("");
    if (optionSelected.toLowerCase().includes("vazio")) {
        $("#linhaTextArea").hide();
        $("#createTemp").hide();
    } else {
        $("#linhaTextArea").show();
        $("#createTemp").show();
    }
    activeFields();

}

function moduleLoading2() {
    optionSelected = $("#tempSelect").val();
    $("#tempMessage").val("");
    activeFields2();
}

function activeFields() {
    optionSelected = $("#modulesSelect").val();
    if (optionSelected.toLowerCase() == "leads") {
        $("#textMsg").on("keydown", function(e) {

            if ((e.which == 51 || e.which == 222) && e.key == "#") { //shift+#

                debugger;
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
                pos.top = getLineNumber("textMsg");
                $('#templateMergeValuesDIV').hide();
                $('#templateMergeValuesDIV').css({
                    'top': e.target.offsetTop + pos.top + 195,
                    'left': e.target.offsetLeft + pos.left + 195,
                    'position': 'absolute',
                    'border': '1px solid black'
                });
                $('#templateMergeValuesDIV').show();


            } else if (e.which == 8 || e.which == 27) {
                $('#templateMergeValuesDIV').hide();
                var contentArea = $("#textMsg").val();
                if (contentArea.includes("#")) {
                    $("#textMsg").val(contentArea.replace("#", ""));
                    $("#textMsg").focus();
                }
            }

        });
    } else if (optionSelected.toLowerCase() == "contacts") {
        $("#textMsg").on("keydown", function(e) {



            if ((e.which == 51 || e.which == 222) && e.key == "#") { //shift+#


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
                pos.top = getLineNumber("textMsg");

                $('#templateMergeValuesDIV').hide();
                $('#templateMergeValuesDIV').css({
                    'top': e.target.offsetTop + pos.top + 195,
                    'left': e.target.offsetLeft + pos.left + 195,
                    'position': 'absolute',
                    'border': '1px solid black'
                });
                $('#templateMergeValuesDIV').show();


            } else if (e.which == 8 || e.which == 27) {
                $('#templateMergeValuesDIV').hide();
                var contentArea = $("#textMsg").val();
                if (contentArea.includes("#")) {
                    $("#textMsg").val(contentArea.replace("#", ""));
                    $("#textMsg").focus();
                }
            }

        });
    } else if (optionSelected.toLowerCase() == "accounts") {
        $("#textMsg").on("keydown", function(e) {



            if ((e.which == 51 || e.which == 222) && e.key == "#") { //shift+#


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
                pos.top = getLineNumber("textMsg");

                $('#templateMergeValuesDIV').hide();
                $('#templateMergeValuesDIV').css({
                    'top': e.target.offsetTop + pos.top + 195,
                    'left': e.target.offsetLeft + pos.left + 195,
                    'position': 'absolute',
                    'border': '1px solid black'
                });
                $('#templateMergeValuesDIV').show();


            } else if (e.which == 8 || e.which == 27) {
                $('#templateMergeValuesDIV').hide();
                var contentArea = $("#textMsg").val();
                if (contentArea.includes("#")) {
                    $("#textMsg").val(contentArea.replace("#", ""));
                    $("#textMsg").focus();
                }
            }

        });
    } else if (optionSelected.toLowerCase() == "deals") {
        $("#textMsg").on("keydown", function(e) {



            if ((e.which == 51 || e.which == 222) && e.key == "#") { //shift+#


                var fldSel = "<select id=\"moduleOptions\" data-zcqa=\"moduleOptions\" tabindex=\"-1\" class=\"newSelect\" aria-hidden=\"true\" onchange=\"Utils.selectFields()\">";
                fldSel = fldSel + "<option value=\"Deals\" type=\"system\" selected>Deals</option>";
                fldSel = fldSel + "<option value=\"Accounts\" type=\"system\">Accounts</option>";
                fldSel = fldSel + "<option value=\"Contacts\" type=\"system\">Contacts</option>";
                fldSel = fldSel + "<option value=\"Users\" type=\"system\">Users</option>";
                fldSel = fldSel + "<option value=\"Orgs\" type=\"system\">Organization</option>";
                fldSel = fldSel + "</select>";
                $("#moduleOptionsList").html(fldSel);
                /*$(function() {
                    $("select").multipleSelect({
                        filter: true,
                    });
                });*/


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
                pos.top = getLineNumber("textMsg");

                var tamTop = e.target.offsetTop + pos.top + 195;
                var tamLeft = e.target.offsetLeft + pos.left + 195;


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
                var contentArea = $("#textMsg").val();
                if (contentArea.includes("#")) {
                    $("#textMsg").val(contentArea.replace("#", ""));
                    $("#textMsg").focus();
                }
            }

        });
    }
}

function activeFields2() {
    optionSelected = $("#tempSelect").val();
    if (optionSelected.toLowerCase() == "leads") {
        $("#tempMessage").on("keydown", function(e) {

            if ((e.which == 51 || e.which == 222) && e.key == "#") { //shift+#
                debugger;

                var fldSel = "<select id=\"moduleOptionsEdit\" data-zcqa=\"moduleOptions\" tabindex=\"-1\" class=\"newSelect\" aria-hidden=\"true\" onchange=\"Utils.selectFieldsEdit()\">";
                fldSel = fldSel + "<option value=\"Leads\" type=\"system\" selected>Leads</option>";
                fldSel = fldSel + "<option value=\"Users\" type=\"system\">Users</option>";
                fldSel = fldSel + "<option value=\"Orgs\" type=\"system\">Organization</option>";
                fldSel = fldSel + "</select>";
                $("#moduleOptionsList2").html(fldSel);


                var ulFld = "";

                if (Const.allfieldsleads.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsleads[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsleads[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsleads[0]["module"] + "_ModuleFieldsEdit\" style=\"display: block;\" >";


                    for (id in Const.allfieldsleads) {
                        var atual = Const.allfieldsleads[id];

                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeLead2(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";

                }
                if (Const.allfieldsusers.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsusers[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsusers[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsusers[0]["module"] + "_ModuleFieldsEdit\" style=\"display: none;\" >";


                    for (id in Const.allfieldsusers) {
                        var atual = Const.allfieldsusers[id];


                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeLead2(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";


                }
                if (Const.allfieldsorgs.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsorgs[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsorgs[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsorgs[0]["module"] + "_ModuleFieldsEdit\" style=\"display: none;\" >";

                    for (id in Const.allfieldsorgs) {
                        var atual = Const.allfieldsorgs[id];


                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeLead2(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";

                }


                $("#editOA").html(ulFld);

                var pos = $(this).getCaretPosition();
                pos.top = getLineNumber("tempMessage");
                $('#templateMergeValuesDIV2').hide();
                $('#templateMergeValuesDIV2').css({
                    'top': e.target.offsetTop + pos.top + 200,
                    'left': e.target.offsetLeft + pos.left + 235,
                    'position': 'absolute',
                    'border': '1px solid black'
                });
                $('#templateMergeValuesDIV2').show();


            } else if (e.which == 8 || e.which == 27) {
                $('#templateMergeValuesDIV2').hide();
                var contentArea = $("#tempMessage").val();
                if (contentArea.includes("#")) {
                    $("#tempMessage").val(contentArea.replace("#", ""));
                    $("#tempMessage").focus();
                }
            }

        });
    } else if (optionSelected.toLowerCase() == "contacts") {
        $("#tempMessage").on("keydown", function(e) {



            if ((e.which == 51 || e.which == 222) && e.key == "#") { //shift+#


                var fldSel = "<select id=\"moduleOptionsEdit\" data-zcqa=\"moduleOptions\" tabindex=\"-1\" class=\"newSelect\" aria-hidden=\"true\" onchange=\"Utils.selectFieldsEdit()\">";
                fldSel = fldSel + "<option value=\"Contacts\" type=\"system\" selected>Contacts</option>";
                fldSel = fldSel + "<option value=\"Users\" type=\"system\">Users</option>";
                fldSel = fldSel + "<option value=\"Orgs\" type=\"system\">Organization</option>";
                fldSel = fldSel + "</select>";
                $("#moduleOptionsList2").html(fldSel);


                var ulFld = "";

                if (Const.allfieldscontacts.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldscontacts[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldscontacts[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldscontacts[0]["module"] + "_ModuleFieldsEdit\" style=\"display: block;\" >";


                    for (id in Const.allfieldscontacts) {
                        var atual = Const.allfieldscontacts[id];

                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeContact2(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";

                }
                if (Const.allfieldsusers.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsusers[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsusers[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsusers[0]["module"] + "_ModuleFieldsEdit\" style=\"display: none;\" >";


                    for (id in Const.allfieldsusers) {
                        var atual = Const.allfieldsusers[id];


                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeContact2(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";


                }
                if (Const.allfieldsorgs.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsorgs[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsorgs[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsorgs[0]["module"] + "_ModuleFieldsEdit\" style=\"display: none;\" >";

                    for (id in Const.allfieldsorgs) {
                        var atual = Const.allfieldsorgs[id];


                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeContact2(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";

                }


                $("#editOA").html(ulFld);

                var pos = $(this).getCaretPosition();
                pos.top = getLineNumber("tempMessage");

                $('#templateMergeValuesDIV2').hide();
                $('#templateMergeValuesDIV2').css({
                    'top': e.target.offsetTop + pos.top + 200,
                    'left': e.target.offsetLeft + pos.left + 235,
                    'position': 'absolute',
                    'border': '1px solid black'
                });
                $('#templateMergeValuesDIV2').show();


            } else if (e.which == 8 || e.which == 27) {
                $('#templateMergeValuesDIV2').hide();
                var contentArea = $("#tempMessage").val();
                if (contentArea.includes("#")) {
                    $("#tempMessage").val(contentArea.replace("#", ""));
                    $("#tempMessage").focus();
                }
            }

        });
    } else if (optionSelected.toLowerCase() == "accounts") {
        $("#tempMessage").on("keydown", function(e) {



            if ((e.which == 51 || e.which == 222) && e.key == "#") { //shift+#


                var fldSel = "<select id=\"moduleOptionsEdit\" data-zcqa=\"moduleOptions\" tabindex=\"-1\" class=\"newSelect\" aria-hidden=\"true\" onchange=\"Utils.selectFieldsEdit()\">";
                fldSel = fldSel + "<option value=\"Accounts\" type=\"system\" selected>Accounts</option>";
                fldSel = fldSel + "<option value=\"Users\" type=\"system\">Users</option>";
                fldSel = fldSel + "<option value=\"Orgs\" type=\"system\">Organization</option>";
                fldSel = fldSel + "</select>";
                $("#moduleOptionsList2").html(fldSel);

                var ulFld = "";

                if (Const.allfieldsaccounts.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsaccounts[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsaccounts[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsaccounts[0]["module"] + "_ModuleFieldsEdit\" style=\"display: block;\" >";


                    for (id in Const.allfieldsaccounts) {
                        var atual = Const.allfieldsaccounts[id];

                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeAccount2(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";

                }
                if (Const.allfieldsusers.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsusers[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsusers[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsusers[0]["module"] + "_ModuleFieldsEdit\" style=\"display: none;\" >";


                    for (id in Const.allfieldsusers) {
                        var atual = Const.allfieldsusers[id];


                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeAccount2(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";


                }
                if (Const.allfieldsorgs.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsorgs[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsorgs[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsorgs[0]["module"] + "_ModuleFieldsEdit\" style=\"display: none;\" >";

                    for (id in Const.allfieldsorgs) {
                        var atual = Const.allfieldsorgs[id];


                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeAccount2(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";

                }


                $("#editOA").html(ulFld);

                var pos = $(this).getCaretPosition();

                pos.top = getLineNumber("tempMessage");
                $('#templateMergeValuesDIV2').hide();
                $('#templateMergeValuesDIV2').css({
                    'top': e.target.offsetTop + pos.top + 200,
                    'left': e.target.offsetLeft + pos.left + 235,
                    'position': 'absolute',
                    'border': '1px solid black'
                });
                $('#templateMergeValuesDIV2').show();


            } else if (e.which == 8 || e.which == 27) {
                $('#templateMergeValuesDIV2').hide();
                var contentArea = $("#tempMessage").val();
                if (contentArea.includes("#")) {
                    $("#tempMessage").val(contentArea.replace("#", ""));
                    $("#tempMessage").focus();
                }
            }

        });
    } else if (optionSelected.toLowerCase() == "deals") {
        $("#tempMessage").on("keydown", function(e) {



            if ((e.which == 51 || e.which == 222) && e.key == "#") { //shift+#


                var fldSel = "<select id=\"moduleOptionsEdit\" data-zcqa=\"moduleOptions\" tabindex=\"-1\" class=\"newSelect\" aria-hidden=\"true\" onchange=\"Utils.selectFieldsEdit()\">";
                fldSel = fldSel + "<option value=\"Deals\" type=\"system\" selected>Deals</option>";
                fldSel = fldSel + "<option value=\"Accounts\" type=\"system\">Accounts</option>";
                fldSel = fldSel + "<option value=\"Contacts\" type=\"system\">Contacts</option>";
                fldSel = fldSel + "<option value=\"Users\" type=\"system\">Users</option>";
                fldSel = fldSel + "<option value=\"Orgs\" type=\"system\">Organization</option>";
                fldSel = fldSel + "</select>";
                $("#moduleOptionsList2").html(fldSel);
                /*$(function() {
                    $("#moduleOptionsEdit").multipleSelect({
                        filter: true,
                    });
                });*/

                var ulFld = "";

                if (Const.allfieldsdeals.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsdeals[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsdeals[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsdeals[0]["module"] + "_ModuleFieldsEdit\" style=\"display: block;\" >";


                    for (id in Const.allfieldsdeals) {
                        var atual = Const.allfieldsdeals[id];

                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeDeal2(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";

                }
                if (Const.allfieldsaccounts.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsaccounts[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsaccounts[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsaccounts[0]["module"] + "_ModuleFieldsEdit\" style=\"display: none;\" >";


                    for (id in Const.allfieldsaccounts) {
                        var atual = Const.allfieldsaccounts[id];

                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeDeal2(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";

                }
                if (Const.allfieldscontacts.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldscontacts[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldscontacts[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldscontacts[0]["module"] + "_ModuleFieldsEdit\" style=\"display: none;\" >";


                    for (id in Const.allfieldscontacts) {
                        var atual = Const.allfieldscontacts[id];

                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeDeal2(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";

                }
                if (Const.allfieldsusers.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsusers[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsusers[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsusers[0]["module"] + "_ModuleFieldsEdit\" style=\"display: none;\" >";


                    for (id in Const.allfieldsusers) {
                        var atual = Const.allfieldsusers[id];


                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeDeal2(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";


                }
                if (Const.allfieldsorgs.length > 0) {

                    ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsorgs[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsorgs[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsorgs[0]["module"] + "_ModuleFieldsEdit\" style=\"display: none;\" >";

                    for (id in Const.allfieldsorgs) {
                        var atual = Const.allfieldsorgs[id];


                        ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Utils.setMergeDeal2(this)\">" + atual["desc"] + "</li>";

                    }

                    ulFld = ulFld + "</ul>";

                }

                $("#editOA").html(ulFld);

                var pos = $(this).getCaretPosition();
                pos.top = getLineNumber("tempMessage");
                var tamTop = e.target.offsetTop + pos.top + 200;
                var tamLeft = e.target.offsetLeft + pos.left + 235;


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
                var contentArea = $("#tempMessage").val();
                if (contentArea.includes("#")) {
                    $("#tempMessage").val(contentArea.replace("#", ""));
                    $("#tempMessage").focus();
                }
            }

        });
    }
}

function criarTemplate() {
    var lContinua = true;
    var txtMSG = DOMPurify.sanitize($("#textMsg").val(), Const.configPurify);
    var myINPUT = DOMPurify.sanitize($("#myInput").val(), Const.configPurify);
    var selModule = DOMPurify.sanitize($("#modulesSelect").val(), Const.configPurify);

    if (txtMSG == null || txtMSG == "") {
        $("#textEmpty").show();
        $("#textMsg").addClass("texterror");
        lContinua = false;
    } else {
        $("#textEmpty").hide();
        $("#textMsg").removeClass("texterror");
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
            whatsapphubforzohocrm__Message: txtMSG
        };

        ZOHO.CRM.API.insertRecord({
            Entity: Const.apinames.apitemplates,
            APIData: recordData,
            Trigger: ["workflow"],
        }).then(function(data) {
            //console.log(data);
            fechaTemplate();
            Utils.successMsg("SuccessMsg", "msg-success-template", true);

        });
    }
}

function closePopup() {
    ZOHO.CRM.UI.Popup.close();

}

function closeTempPopup() {
    $("#editPopup").hide();
    $("#mainDiv").css("pointer-events", "auto");

}

function fechaTemplate() {
    $("#myForm").hide();
    $("#textMsg").val("");
    $("#myInput").val("");
    $("#modulesSelect").val("Vazio");
    $("#mainDiv").css("pointer-events", "auto");

}

function editTemplate() {
    var mensagem = DOMPurify.sanitize($("#tempMessage").val(), Const.configPurify);
    var nome = DOMPurify.sanitize($("#tempName").val(), Const.configPurify);
    var modulo = DOMPurify.sanitize($("#tempSelect").val(), Const.configPurify);
    var lContinua = true;
    if (mensagem == null || mensagem == "") {
        lContinua = false;
    }
    if (nome == null || nome == "") {
        lContinua = false;
    }
    if (lContinua) {
        var config = {
            Entity: Const.apinames.apitemplates,
            APIData: {
                id: DOMPurify.sanitize(idEdit, Const.configPurify),
                Name: nome,
                whatsapphubforzohocrm__Message: mensagem,
                whatsapphubforzohocrm__Module: modulo,
            },
            Trigger: ["workflow"],
        };
        ZOHO.CRM.API.updateRecord(config).then(function(data) {
            //console.log(data);
            //location.reload();
            closeTempPopup();
            Utils.successMsg("SuccessMsg", "msg-success-edit-template", true);
        });
    }

    $("#mainDiv").css("pointer-events", "auto");
}

function fecharExibePopup() {
    $("#exibirPopup").hide();
    $("#mainDiv").css("pointer-events", "auto");
}

function searchTemplate() {
    var pesquisa = $("#searchField").val().trim();
    if (pesquisa.toLowerCase().includes("contato")) {
        pesquisa = "Contacts";
    } else if (pesquisa.toLowerCase().includes("conta")) {
        pesquisa = "Accounts";
    } else if (pesquisa.toLowerCase().includes("cliente potencial")) {
        pesquisa = "Leads";
    } else if (pesquisa.toLowerCase().includes("clientes potenciais")) {
        pesquisa = "Leads";
    } else if (pesquisa.toLowerCase().includes("negócio")) {
        pesquisa = "Deals";
    } else if (pesquisa.toLowerCase().includes("oportunidade")) {
        pesquisa = "Deals";
    } else {
        pesquisa = pesquisa;
    }
    Const.pesquisa = pesquisa;

    if (pesquisa != "") {
        ZOHO.CRM.API.searchRecord({
            Entity: Const.apinames.apitemplates,
            Type: "criteria",
            Query: "(Name:starts_with:" +
                pesquisa +
                ") or (whatsapphubforzohocrm__Module:starts_with:" +
                pesquisa +
                ")",
            per_page: 10,
            page: 1
        }).then(function(data) {
            //console.log(data);
            if (data.statusText == "nocontent") {
                Utils.errorMsg("ErroMsg", "msg-error-search-template");
                //alert("");
            } else {
                $("#mainTable tbody tr").remove();
                data.data.forEach((linha) => {
                    createLine =
                        '<tr><td class="id-reg">' +
                        linha.id +
                        "</td><td>" +
                        linha.Name +
                        "</td><td>" +
                        linha.whatsapphubforzohocrm__Module +
                        '</td><td><button class="button button1 tablebutton show-reg">' + Const.desclanguage["btn-view"] + '</button></td><td><button class="button button1 tablebutton edit-reg">' + Const.desclanguage["btn-edit"] + '</button></td><td><button class="button button1 tablebutton del-reg">' + Const.desclanguage["btn-delete"] + '</button></td>';
                    $("#ealine").append(createLine);
                });
            }
        });
    } else {
        Utils.errorMsg("ErroMsg", "msg-error-nosearch-template");
    }
}

function showMore() {
    //$("#mainTable tbody tr").remove();
    paginaatual = paginaatual + 1;

    if (Const.pesquisa != "") {
        ZOHO.CRM.API.searchRecord({
            Entity: Const.apinames.apitemplates,
            Type: "criteria",
            Query: "(Name:starts_with:" +
                Const.pesquisa +
                ") or (whatsapphubforzohocrm__Module:starts_with:" +
                Const.pesquisa +
                ")",
            per_page: 10,
            page: paginaatual
        }).then(function(template) {
            //console.log(data);
            if (template.statusText == "nocontent") {
                Utils.errorMsg("ErroMsg", "msg-error-search-template");
                //alert("");
            } else {
                paginatotal = template.info.more_records;
                if (!paginatotal) {
                    $("#closeShowMore").hide();
                }
                template.data.forEach((temp) => {

                    createLine =
                        '<tr><td class="id-reg">' +
                        temp.id +
                        "</td><td>" +
                        temp.Name +
                        "</td><td>" +
                        temp.whatsapphubforzohocrm__Module +
                        '</td><td><button class="button button1 tablebutton show-reg">' + Const.desclanguage["btn-view"] + '</button></td><td><button class="button button1 tablebutton edit-reg">' + Const.desclanguage["btn-edit"] + '</button></td><td><button class="button button1 tablebutton del-reg">' + Const.desclanguage["btn-delete"] + '</button></td>';
                    $("#ealine").append(createLine);
                });
            }
        });
    } else {
        ZOHO.CRM.API.getAllRecords({
            Entity: Const.apinames.apitemplates,
            sort_order: "asc",
            per_page: 10,
            page: paginaatual,
        }).then(function(template) {
            paginatotal = template.info.more_records;
            if (!paginatotal) {
                $("#closeShowMore").hide();
            }
            template.data.forEach((temp) => {

                createLine =
                    '<tr><td class="id-reg">' +
                    temp.id +
                    "</td><td>" +
                    temp.Name +
                    "</td><td>" +
                    temp.whatsapphubforzohocrm__Module +
                    '</td><td><button class="button button1 tablebutton show-reg">' + Const.desclanguage["btn-view"] + '</button></td><td><button class="button button1 tablebutton edit-reg">' + Const.desclanguage["btn-edit"] + '</button></td><td><button class="button button1 tablebutton del-reg">' + Const.desclanguage["btn-delete"] + '</button></td>';
                $("#ealine").append(createLine);
            });
        });
    }
}

function reloadWebtab() {
    location.reload();
}

Utils = {};

Utils.setMergeLead = function(e) {
    var contentArea = $("#textMsg").val();
    $("#textMsg").val(contentArea.replace("#", e.getAttribute("val")));
    $('#templateMergeValuesDIV').hide();
    $("#textMsg").focus();
}

Utils.setMergeLead2 = function(e) {
    var contentArea = $("#tempMessage").val();
    $("#tempMessage").val(contentArea.replace("#", e.getAttribute("val")));
    $('#templateMergeValuesDIV2').hide();
    $("#tempMessage").focus();
}

Utils.setMergeContact = function(e) {
    var contentArea = $("#textMsg").val();
    $("#textMsg").val(contentArea.replace("#", e.getAttribute("val")));
    $('#templateMergeValuesDIV').hide();
    $("#textMsg").focus();
}

Utils.setMergeContact2 = function(e) {
    var contentArea = $("#tempMessage").val();
    $("#tempMessage").val(contentArea.replace("#", e.getAttribute("val")));
    $('#templateMergeValuesDIV2').hide();
    $("#tempMessage").focus();
}

Utils.setMergeAccount = function(e) {
    var contentArea = $("#textMsg").val();
    $("#textMsg").val(contentArea.replace("#", e.getAttribute("val")));
    $('#templateMergeValuesDIV').hide();
    $("#textMsg").focus();
}

Utils.setMergeAccount2 = function(e) {
    var contentArea = $("#tempMessage").val();
    $("#tempMessage").val(contentArea.replace("#", e.getAttribute("val")));
    $('#templateMergeValuesDIV2').hide();
    $("#tempMessage").focus();
}

Utils.setMergeDeal = function(e) {
    var contentArea = $("#textMsg").val();
    $("#textMsg").val(contentArea.replace("#", e.getAttribute("val")));
    $('#templateMergeValuesDIV').hide();
    $("#textMsg").focus();
}

Utils.setMergeDeal2 = function(e) {
    var contentArea = $("#tempMessage").val();
    $("#tempMessage").val(contentArea.replace("#", e.getAttribute("val")));
    $('#templateMergeValuesDIV2').hide();
    $("#tempMessage").focus();
}

Utils.selectFields = function() {
    debugger;
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

Utils.selectFieldsEdit = function() {
    debugger;
    var content = $("#moduleOptionsEdit").val();
    $("#system_Leads_ModuleFieldsEdit").hide();
    $("#system_Users_ModuleFieldsEdit").hide();
    $("#system_Orgs_ModuleFieldsEdit").hide();
    $("#system_Accounts_ModuleFieldsEdit").hide();
    $("#system_Contacts_ModuleFieldsEdit").hide();
    $("#system_Deals_ModuleFieldsEdit").hide();
    if (content.toLowerCase() == "leads") {
        $("#system_Leads_ModuleFieldsEdit").show();

    } else if (content.toLowerCase() == "users") {

        $("#system_Users_ModuleFieldsEdit").show();

    } else if (content.toLowerCase() == "orgs") {
        $("#system_Orgs_ModuleFieldsEdit").show();

    } else if (content.toLowerCase() == "accounts") {
        $("#system_Accounts_ModuleFieldsEdit").show();

    } else if (content.toLowerCase() == "contacts") {
        $("#system_Contacts_ModuleFieldsEdit").show();

    } else if (content.toLowerCase() == "deals") {
        $("#system_Deals_ModuleFieldsEdit").show();
    }
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

function getLineNumber(idtextarea) {
    textarea = document.getElementById(idtextarea);
    var indicador = 1;
    var linha = textarea.value.substr(0, textarea.selectionStart).split("\n").length;

    if (idtextarea == "textMsg" || idtextarea == "tempMessage") {
        if (linha == 1) {
            indicador = 30;
        } else if (linha == 2) {
            indicador = 53;
        } else if (linha == 3) {
            indicador = 78;
        } else if (linha == 4) {
            indicador = 98;
        } else if (linha == 5) {
            indicador = 124;
        } else if (linha == 6) {
            indicador = 148;
        } else if (linha == 7) {
            indicador = 174;
        } else if (linha == 8) {
            indicador = 198;
        } else if (linha == 9) {
            indicador = 218;
        } else if (linha == 10) {
            indicador = 244;
        } else {
            indicador = 276;
        }
    }

    return indicador;
}

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
        $("#textMsg").val(x.slice(0, curPos) + text_to_insert.trim() + x.slice(curPos));
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
    $("#alertWarning").slideDown(function() {
        $("#alertWarning").delay(3000).slideUp();
    });
}

function typeBoldTemp() {
    var textSelected = getSelectionText();

    var curPos = document.getElementById("tempMessage").selectionStart;
    let text_to_insert = "";
    let x = $("#tempMessage").val();
    if (textSelected != "" && textSelected != null && textSelected != undefined) {
        getSel("*", "tempMessage");
    } else {
        text_to_insert = "*<bold>*";
        $("#tempMessage").val(x.slice(0, curPos) + text_to_insert + x.slice(curPos));
    }
}

function typeItalicoTemp() {
    var textSelected = getSelectionText();

    var curPos = document.getElementById("tempMessage").selectionStart;
    let text_to_insert = "";
    let x = $("#tempMessage").val();
    if (textSelected != "" && textSelected != null && textSelected != undefined) {
        getSel("_", "tempMessage");
    } else {
        text_to_insert = "_<italic>_";
        $("#tempMessage").val(x.slice(0, curPos) + text_to_insert + x.slice(curPos));
    }
}

function typeCitacaoTemp() {
    var textSelected = getSelectionText();

    var curPos = document.getElementById("tempMessage").selectionStart;
    let text_to_insert = "";
    let x = $("#tempMessage").val();
    if (textSelected != "" && textSelected != null && textSelected != undefined) {
        getSel("```", "tempMessage");
    } else {
        text_to_insert = "```<quote>```";
        $("#tempMessage").val(x.slice(0, curPos) + text_to_insert.trim() + x.slice(curPos));
    }

}

function typeStrikeTemp() {
    var textSelected = getSelectionText();

    var curPos = document.getElementById("tempMessage").selectionStart;
    let text_to_insert = "";
    let x = $("#tempMessage").val();
    if (textSelected != "" && textSelected != null && textSelected != undefined) {
        getSel("~", "tempMessage");
    } else {
        text_to_insert = "~<strike>~";
        $("#tempMessage").val(x.slice(0, curPos) + text_to_insert + x.slice(curPos));
    }

}


function getSelectionText() {
    var text = "";
    var activeEl = document.activeElement;
    var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
    if (
        (activeElTagName == "textarea") || (activeElTagName == "input" &&
            /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
        (typeof activeEl.selectionStart == "number")
    ) {
        text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
    } else if (window.getSelection) {
        text = window.getSelection().toString();
    }
    return text;
}

function getSel(teste, id) // javascript
{
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
    var newText = allText.substring(0, start) + teste + sel + teste + allText.substring(finish, allText.length);

    txtarea.value = newText;

}
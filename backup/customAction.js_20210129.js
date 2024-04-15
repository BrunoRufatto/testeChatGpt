class customAction {
    constructor(data) {
        //debugger;
        this.config = {
            module: data.module, //data.Entity
            configdata: data.configdata
        }
        this.fields = {
            id: "",
            module: "",
            note: "",
            idtemplate: "",
            test: false
        }
        //this.msg = Const.desclanguage["custom-action-error-msg-module"];
        this.msg = "";
        //this.resize()

        this.init()
    }

    /********************************************************************************
     *                              Start
     */

    async init() {
        try {
            //debugger;
            this.showloading()

            if (await this.loadParams()) {

                await this.validateModule()
                await this.loadingAllFields()
                await this.activeFields()

                //this.loadFields()
                this.hideloading()
            } else {
                this.hideloading()
                this.showfault(Const.desclanguage["custom-action-error-msg-module"])
            }

        } catch (error) {

            console.log(error)
            this.showfault(error.message || error)
        }
    }

    /********************************************************************************
     *                              UI Methods
     */

    resize() {
        return ZOHO.CRM.UI.Resize({ height: 480, width: 620 }).then(function (data) {
            //console.log('Resized', data)
        })
    }

    async activeFields() {

        var optionSelected = this.config.module;
        if (optionSelected.toLowerCase() == "leads") {
            $("#modifiedNote").on("keydown", function (e) {

                if (e.which == 51 && e.key == "#") { //} && e.val().includes("#")) { //shift+#


                    var fldSel = "<select id=\"moduleOptions\" data-zcqa=\"moduleOptions\" tabindex=\"-1\" class=\"newSelect\" aria-hidden=\"true\" onchange=\"Const.customAct.selectFields()\">";
                    fldSel = fldSel + "<option value=\"Leads\" type=\"system\" selected>Leads</option>";
                    fldSel = fldSel + "<option value=\"Users\" type=\"system\">Users</option>";
                    fldSel = fldSel + "<option value=\"Orgs\" type=\"system\">Organization</option>";
                    fldSel = fldSel + "</select>";
                    $("#moduleOptionsList").html(fldSel);


                    var ulFld = "";

                    if (Const.allfieldsleads.length > 0) {

                        ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsleads[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsleads[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsleads[0]["module"] + "_ModuleFields\" style=\"display: block;\" >";


                        for (var id in Const.allfieldsleads) {
                            var atual = Const.allfieldsleads[id];

                            ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Const.customAct.setMergeLead(this)\">" + atual["desc"] + "</li>";

                        }

                        ulFld = ulFld + "</ul>";

                    }
                    if (Const.allfieldsusers.length > 0) {

                        ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsusers[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsusers[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsusers[0]["module"] + "_ModuleFields\" style=\"display: none;\" >";


                        for (var id in Const.allfieldsusers) {
                            var atual = Const.allfieldsusers[id];


                            ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Const.customAct.setMergeLead(this)\">" + atual["desc"] + "</li>";

                        }

                        ulFld = ulFld + "</ul>";


                    }
                    if (Const.allfieldsorgs.length > 0) {

                        ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsorgs[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsorgs[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsorgs[0]["module"] + "_ModuleFields\" style=\"display: none;\" >";

                        for (var id in Const.allfieldsorgs) {
                            var atual = Const.allfieldsorgs[id];


                            ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Const.customAct.setMergeLead(this)\">" + atual["desc"] + "</li>";

                        }

                        ulFld = ulFld + "</ul>";

                    }


                    $(".oA").html(ulFld);

                    var pos = $(this).getCaretPosition();
                    pos.top = Const.customAct.getLineNumber("modifiedNote");
                    pos.left = Const.customAct.getColumnNumber("modifiedNote", pos.left, "templateMergeValuesDIV");
                    $('#templateMergeValuesDIV').hide();
                    $('#templateMergeValuesDIV').css({
                        'top': e.target.offsetTop + pos.top + $("#modifiedNote").offset().top,
                        'left': e.target.offsetLeft + pos.left + $("#modifiedNote").offset().left,
                        'position': 'absolute',
                        'border': '1px solid black',
                        'padding': '5px'
                    });
                    $('#templateMergeValuesDIV').show();


                } else if (e.which == 8 || e.which == 27) {
                    $('#templateMergeValuesDIV').hide();
                    var contentArea = $("#modifiedNote").val();
                    if (contentArea.includes("#")) {
                        $("#modifiedNote").val(contentArea.replace("#", ""));
                        $("#modifiedNote").focus();
                    }
                }

            });
        } else if (optionSelected.toLowerCase() == "contacts") {
            $("#modifiedNote").on("keydown", function (e) {



                if (e.which == 51 && e.key == "#") { //shift+#


                    var fldSel = "<select id=\"moduleOptions\" data-zcqa=\"moduleOptions\" tabindex=\"-1\" class=\"newSelect\" aria-hidden=\"true\" onchange=\"Const.customAct.selectFields()\">";
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

                            ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Const.customAct.setMergeContact(this)\">" + atual["desc"] + "</li>";

                        }

                        ulFld = ulFld + "</ul>";

                    }
                    if (Const.allfieldsusers.length > 0) {

                        ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsusers[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsusers[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsusers[0]["module"] + "_ModuleFields\" style=\"display: none;\" >";


                        for (var id in Const.allfieldsusers) {
                            var atual = Const.allfieldsusers[id];


                            ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Const.customAct.setMergeContact(this)\">" + atual["desc"] + "</li>";

                        }

                        ulFld = ulFld + "</ul>";


                    }
                    if (Const.allfieldsorgs.length > 0) {

                        ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsorgs[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsorgs[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsorgs[0]["module"] + "_ModuleFields\" style=\"display: none;\" >";

                        for (var id in Const.allfieldsorgs) {
                            var atual = Const.allfieldsorgs[id];


                            ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Const.customAct.setMergeContact(this)\">" + atual["desc"] + "</li>";

                        }

                        ulFld = ulFld + "</ul>";

                    }


                    $(".oA").html(ulFld);

                    var pos = $(this).getCaretPosition();
                    pos.top = Const.customAct.getLineNumber("modifiedNote");
                    pos.left = Const.customAct.getColumnNumber("modifiedNote", pos.left, "templateMergeValuesDIV");
                    $('#templateMergeValuesDIV').hide();
                    $('#templateMergeValuesDIV').css({
                        'top': e.target.offsetTop + pos.top + +$("#modifiedNote").offset().top,
                        'left': e.target.offsetLeft + pos.left + +$("#modifiedNote").offset().left,
                        'position': 'absolute',
                        'border': '1px solid black',
                        'padding': '5px'
                    });
                    $('#templateMergeValuesDIV').show();


                } else if (e.which == 8 || e.which == 27) {
                    $('#templateMergeValuesDIV').hide();
                    var contentArea = $("#modifiedNote").val();
                    if (contentArea.includes("#")) {
                        $("#modifiedNote").val(contentArea.replace("#", ""));
                        $("#modifiedNote").focus();
                    }
                }

            });
        } else if (optionSelected.toLowerCase() == "accounts") {
            $("#modifiedNote").on("keydown", function (e) {



                if (e.which == 51 && e.key == "#") { //shift+#


                    var fldSel = "<select id=\"moduleOptions\" data-zcqa=\"moduleOptions\" tabindex=\"-1\" class=\"newSelect\" aria-hidden=\"true\" onchange=\"Const.customAct.selectFields()\">";
                    fldSel = fldSel + "<option value=\"Accounts\" type=\"system\" selected>Accounts</option>";
                    fldSel = fldSel + "<option value=\"Users\" type=\"system\">Users</option>";
                    fldSel = fldSel + "<option value=\"Orgs\" type=\"system\">Organization</option>";
                    fldSel = fldSel + "</select>";
                    $("#moduleOptionsList").html(fldSel);


                    var ulFld = "";

                    if (Const.allfieldsaccounts.length > 0) {

                        ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsaccounts[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsaccounts[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsaccounts[0]["module"] + "_ModuleFields\" style=\"display: block;\" >";


                        for (var id in Const.allfieldsaccounts) {
                            var atual = Const.allfieldsaccounts[id];

                            ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Const.customAct.setMergeAccount(this)\">" + atual["desc"] + "</li>";

                        }

                        ulFld = ulFld + "</ul>";

                    }
                    if (Const.allfieldsusers.length > 0) {

                        ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsusers[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsusers[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsusers[0]["module"] + "_ModuleFields\" style=\"display: none;\" >";


                        for (var id in Const.allfieldsusers) {
                            var atual = Const.allfieldsusers[id];


                            ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Const.customAct.setMergeAccount(this)\">" + atual["desc"] + "</li>";

                        }

                        ulFld = ulFld + "</ul>";


                    }
                    if (Const.allfieldsorgs.length > 0) {

                        ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsorgs[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsorgs[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsorgs[0]["module"] + "_ModuleFields\" style=\"display: none;\" >";

                        for (var id in Const.allfieldsorgs) {
                            var atual = Const.allfieldsorgs[id];


                            ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Const.customAct.setMergeAccount(this)\">" + atual["desc"] + "</li>";

                        }

                        ulFld = ulFld + "</ul>";

                    }


                    $(".oA").html(ulFld);

                    var pos = $(this).getCaretPosition();
                    pos.top = Const.customAct.getLineNumber("modifiedNote");
                    pos.left = Const.customAct.getColumnNumber("modifiedNote", pos.left, "templateMergeValuesDIV");
                    $('#templateMergeValuesDIV').hide();
                    $('#templateMergeValuesDIV').css({
                        'top': e.target.offsetTop + pos.top + +$("#modifiedNote").offset().top,
                        'left': e.target.offsetLeft + pos.left + +$("#modifiedNote").offset().left,
                        'position': 'absolute',
                        'border': '1px solid black',
                        'padding': '5px'
                    });
                    $('#templateMergeValuesDIV').show();


                } else if (e.which == 8 || e.which == 27) {
                    $('#templateMergeValuesDIV').hide();
                    var contentArea = $("#modifiedNote").val();
                    if (contentArea.includes("#")) {
                        $("#modifiedNote").val(contentArea.replace("#", ""));
                        $("#modifiedNote").focus();
                    }
                }

            });
        } else if (optionSelected.toLowerCase() == "deals") {
            $("#modifiedNote").on("keydown", function (e) {



                if (e.which == 51 && e.key == "#") { //shift+#


                    var fldSel = "<select id=\"moduleOptions\" data-zcqa=\"moduleOptions\" tabindex=\"-1\" class=\"newSelect\" aria-hidden=\"true\" onchange=\"Const.customAct.selectFields()\">";
                    fldSel = fldSel + "<option value=\"Deals\" type=\"system\" selected>Deals</option>";
                    fldSel = fldSel + "<option value=\"Accounts\" type=\"system\">Accounts</option>";
                    fldSel = fldSel + "<option value=\"Contacts\" type=\"system\">Contacts</option>";
                    fldSel = fldSel + "<option value=\"Users\" type=\"system\">Users</option>";
                    fldSel = fldSel + "<option value=\"Orgs\" type=\"system\">Organization</option>";
                    fldSel = fldSel + "</select>";
                    $("#moduleOptionsList").html(fldSel);
                    $(function () {
                        $("moduleOptions").multipleSelect({
                            filter: true,
                        });
                    });


                    var ulFld = "";

                    if (Const.allfieldsdeals.length > 0) {

                        ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsdeals[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsdeals[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsdeals[0]["module"] + "_ModuleFields\" style=\"display: block;\" >";


                        for (var id in Const.allfieldsdeals) {
                            var atual = Const.allfieldsdeals[id];

                            ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Const.customAct.setMergeDeal(this)\">" + atual["desc"] + "</li>";

                        }

                        ulFld = ulFld + "</ul>";

                    }
                    if (Const.allfieldsaccounts.length > 0) {

                        ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsaccounts[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsaccounts[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsaccounts[0]["module"] + "_ModuleFields\" style=\"display: none;\" >";


                        for (var id in Const.allfieldsaccounts) {
                            var atual = Const.allfieldsaccounts[id];

                            ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Const.customAct.setMergeDeal(this)\">" + atual["desc"] + "</li>";

                        }

                        ulFld = ulFld + "</ul>";

                    }
                    if (Const.allfieldscontacts.length > 0) {

                        ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldscontacts[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldscontacts[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldscontacts[0]["module"] + "_ModuleFields\" style=\"display: none;\" >";


                        for (var id in Const.allfieldscontacts) {
                            var atual = Const.allfieldscontacts[id];

                            ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Const.customAct.setMergeDeal(this)\">" + atual["desc"] + "</li>";

                        }

                        ulFld = ulFld + "</ul>";

                    }
                    if (Const.allfieldsusers.length > 0) {

                        ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsusers[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsusers[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsusers[0]["module"] + "_ModuleFields\" style=\"display: none;\" >";


                        for (var id in Const.allfieldsusers) {
                            var atual = Const.allfieldsusers[id];


                            ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Const.customAct.setMergeDeal(this)\">" + atual["desc"] + "</li>";

                        }

                        ulFld = ulFld + "</ul>";


                    }
                    if (Const.allfieldsorgs.length > 0) {

                        ulFld = ulFld + "<ul class=\"modulesFields m0 p0 colfff fontSmooth\" modname=\"" + Const.allfieldsorgs[0]["module"] + "\" data-zcqa=\"system_" + Const.allfieldsorgs[0]["module"] + "_ModuleFields\" id=\"system_" + Const.allfieldsorgs[0]["module"] + "_ModuleFields\" style=\"display: none;\" >";

                        for (var id in Const.allfieldsorgs) {
                            var atual = Const.allfieldsorgs[id];


                            ulFld = ulFld + "<li class=\"mergeOptions colfff cP pT5 pB5 pR20\" val=\"" + atual["module"].toLowerCase().slice(0, -1) + "." + atual["name"] + "\" onclick=\"Const.customAct.setMergeDeal(this)\">" + atual["desc"] + "</li>";

                        }

                        ulFld = ulFld + "</ul>";

                    }

                    $(".oA").html(ulFld);

                    var pos = $(this).getCaretPosition();
                    pos.top = Const.customAct.getLineNumber("modifiedNote");
                    pos.left = Const.customAct.getColumnNumber("modifiedNote", pos.left, "templateMergeValuesDIV");
                    var tamTop = e.target.offsetTop + pos.top + $("#modifiedNote").offset().top;
                    var tamLeft = e.target.offsetLeft + pos.left + $("#modifiedNote").offset().left;


                    $('#templateMergeValuesDIV').hide();
                    $('#templateMergeValuesDIV').css({
                        'top': tamTop,
                        'left': tamLeft,
                        'position': 'absolute',
                        'border': '1px solid black',
                        'padding': '5px'
                    });
                    $('#templateMergeValuesDIV').show();


                } else if (e.which == 8 || e.which == 27) {
                    $('#templateMergeValuesDIV').hide();
                    var contentArea = $("#modifiedNote").val();
                    if (contentArea.includes("#")) {
                        $("#modifiedNote").val(contentArea.replace("#", ""));
                        $("#modifiedNote").focus();
                    }
                }

            });
        }
    }

    async loadingAllFields() {
        ZOHO.CRM.META.getFields({
            "Entity": "Leads"
        }).then(function (data) {
            var resp = data;
            for (var i in resp.fields) {
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
        }).then(function () {
            ZOHO.CRM.META.getFields({
                "Entity": "Contacts"
            }).then(function (data) {

                var resp = data;
                for (var i in resp.fields) {
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
            }).then(function () {
                ZOHO.CRM.META.getFields({
                    "Entity": "Accounts"
                }).then(function (data) {

                    var resp = data;
                    for (var i in resp.fields) {
                        var field = resp.fields[i];
                        if (field.data_type == "phone") {

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
                }).then(function () {
                    ZOHO.CRM.META.getFields({
                        "Entity": "Deals"
                    }).then(function (data) {
                        var resp = data;
                        for (var i in resp.fields) {
                            var field = resp.fields[i];
                            if (field.data_type == "phone") {


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
                    }).then(function () {
                        ZOHO.CRM.META.getFields({
                            "Entity": "Users"
                        }).then(function (data) {
                            var resp = data;
                            for (var i in resp.fields) {
                                var field = resp.fields[i];
                                Const.allfieldsusers.push({
                                    desc: resp.fields[i].field_label,
                                    name: resp.fields[i].api_name,
                                    type: resp.fields[i].data_type,
                                    module: "Users"
                                });
                            }
                        }).then(function () {
                            ZOHO.CRM.CONNECTOR.invokeAPI("crm.getorg", {}).then(function (data) {
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
                            }).then(function () {
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

                                    $("#templateMergeValuesDIV").hide();

                                    var contentArea = $("#modifiedNote").val();
                                    if (contentArea == undefined) {
                                        contentArea = "";
                                    }
                                    if (contentArea.includes("#")) { //(contentArea.includes("#")) {
                                        $("#modifiedNote").val(contentArea.replace("#", ""));
                                        $("#modifiedNote").focus();
                                    }

                                });

                            });
                        });
                    });
                });
            });
        });
    }
    async validateModule() {


        if (this.config.configdata != undefined) {
            //this.fields = this.config.configdata;
            Const.actualFields = this.config.configdata;
        }
        else {
            Const.actualFields = this.fields;
        }

        if (this.config.module.toLowerCase() == "leads" || this.config.module.toLowerCase() == "contacts" || this.config.module.toLowerCase() == "accounts" || this.config.module.toLowerCase() == "deals") {
            //this.fields.id = await this.getModuleFieldId(this.config.module);
            //this.fields.module = this.config.module;
            Const.actualFields.id = await this.getModuleFieldId(this.config.module);
            Const.actualFields.module = this.config.module;
            $("#contentDivActionAddToCustomAct").slideDown();
            
            this.loadFields(false)



            //$("#modifiedNote").focus()
        } else {
            $('#newLoad').delay(1000).slideUp()
            this.showfault(Const.desclanguage["custom-action-error-msg-module"])
        }
    }

    async loadParams() {
        //var msg = this.msg;
        var ret = true;
        await ZOHO.CRM.CONFIG.getCurrentUser().then(function (data) {
    
            return ZOHO.CRM.API.getUser({ ID: data.users[0].id })
                .then(async function (data) {
    
                    if (Const.languages.includes(data.users[0].language)) {
                        Const.deflang = data.users[0].language;
                    }
                    await Utils.RenderTemplate(Const.deflang)
                    //await this.renderTemplate(Const.deflang)
                    //$("#allPage").show();
    
                })
    
        })
    
        return ZOHO.CRM.API.getOrgVariable(Const.apinames.apidparameters).then(function (data) {
            try {
                Const.optionParam = data.Success.Content;
                Const.jsonParam = JSON.parse(Const.optionParam).allow;
                $("#defineTemplate").show();
                if (Const.optionParam == "" || !Const.jsonParam) {
                    this.showfault(Const.desclanguage["custom-action-error-msg-params"])
                    ret = false;
                }
            } catch (error) {
                this.showfault(error.message || error)
                ret = false;
            }

            return ret;

        })
    }

    setMergeLead(e) {
        var contentArea = $("#modifiedNote").val();
        $("#modifiedNote").val(contentArea.replace("#", e.getAttribute("val")));
        $('#templateMergeValuesDIV').hide();
        $("#modifiedNote").focus();
    }

    setMergeContact(e) {
        var contentArea = $("#modifiedNote").val();
        $("#modifiedNote").val(contentArea.replace("#", e.getAttribute("val")));
        $('#templateMergeValuesDIV').hide();
        $("#modifiedNote").focus();
    }

    setMergeAccount(e) {
        var contentArea = $("#modifiedNote").val();
        $("#modifiedNote").val(contentArea.replace("#", e.getAttribute("val")));
        $('#templateMergeValuesDIV').hide();
        $("#modifiedNote").focus();
    }

    setMergeDeal(e) {
        var contentArea = $("#modifiedNote").val();
        $("#modifiedNote").val(contentArea.replace("#", e.getAttribute("val")));
        $('#templateMergeValuesDIV').hide();
        $("#modifiedNote").focus();
    }

    selectFields() {
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

    getLineNumber(idtextarea) {

        var textarea = document.getElementById(idtextarea);

        var indicador = 1;
        var linha = textarea.value.substr(0, textarea.selectionStart).split("\n").length;

        if (linha == 1) {
            indicador = 36;
        } else if (linha == 2) {
            indicador = 54;
        } else if (linha >= 3) {
            indicador = 70;
        }

        return indicador;
    }

    getColumnNumber(idtextarea, posleft, divpop) {
        var textarea = $("#" + idtextarea).val();

        var ret = 0;

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


        return ret;
    }

    async loadFields(cont) {

        var $radios = $('input:radio[name=gender]');
        

        var radioChecked = $("input[type=radio]:checked")
        var radioVal = radioChecked.val();

        switch (radioVal) {
            case 'custom':
                break;
            case 'template':
                Const.selectTemplate = [];
                await ZOHO.CRM.API.searchRecord({ Entity: Const.apinames.apitemplates, Type: "criteria", Query: "(" + Const.apinames.apifieldmoduletemplate + ":equals:" + this.config.module + ")" })
                    .then(function (data) {

                        
                        if (data.data != undefined && data.data != null && data.data != "") {

                            var index;
                            for (index in data.data) {

                                Const.selectTemplate.push({ id: data.data[index].id, name: data.data[index].Name, value: data.data[index].whatsapphubforzohocrm__Message });

                            }
                        }
                        // não há template para ser escolhido
                        if (Const.selectTemplate.length <= 1) {
                            $("#nocampaignEmpty").show();
                        }

                        var fldSel = "<select id=\"modifiedTemplate\" class=\"newSelect\" style=\"width: 220px\"><option value=\"none\" data-id=\"0\">-None-</option>";
                        var listTemplate = Const.selectTemplate;
                        if (listTemplate != null && listTemplate != "" && listTemplate != undefined) {
                            var id;
                            if (Const.actualFields.idtemplate != "" && Const.actualFields.note == "" && !cont) {
                            for (id in listTemplate) {
                                var atual = listTemplate[id];
                                
                                if(atual["id"] == Const.actualFields.idtemplate)
                                {
                                    fldSel = fldSel + "<option value=\"" + atual["value"] + "\" data-id=\"" + atual["id"] + "\" selected=\"selected\">" + atual["name"] + "</option>";
                                    $("#templateText").val(atual["value"]);
                                }
                                else{
                                fldSel = fldSel + "<option value=\"" + atual["value"] + "\" data-id=\"" + atual["id"] + "\" >" + atual["name"] + "</option>";
                                }
                            }
                        }
                        else{
                            for (id in listTemplate) {
                                
                                var atual = listTemplate[id];
                                
                                fldSel = fldSel + "<option value=\"" + atual["value"] + "\" data-id=\"" + atual["id"] + "\" >" + atual["name"] + "</option>";

                            }
                        }
                        }
                        fldSel = fldSel + "</select>";

                        $("#divTemplate").html(fldSel);
                        
                        $("#modifiedTemplate").multipleSelect({
                            filter: true,
                            onClick: function () {
                                var mensagem = $("#modifiedTemplate").val();
                                if (mensagem != "none") {
                                    $("#templateText").val(mensagem);
                                } else {
                                    $("#templateText").val("");
                                }
                            }
                        })
                    });
                break;

        }

        if (Const.actualFields.idtemplate != "" && Const.actualFields.note == "" && !cont) {

            if ($radios.is(':checked') === true) {
                $radios.filter('[value=template]').prop('checked', true);
                if (!cont) {
                    this.changeRadio(true);
                    
                }
            }
            
        }
        else if (Const.actualFields.idtemplate == "" && Const.actualFields.note != "" && !cont) {
            if ($radios.is(':checked') === true) {
                $radios.filter('[value=custom]').prop('checked', true);
                if (!cont) {
                    this.changeRadio(true);
                    $("#modifiedNote").val(Const.actualFields.note);
                }
            }
        }


    }

    //functions HTML
    changeRadio(cont) {

        
        

        var radioChecked = $("input[type=radio]:checked")
        var divSelect = radioChecked.data("div")
        var radioVal = radioChecked.val();


        $(".divradio").hide()

        $("#" + divSelect).delay(500).slideDown()

        switch (radioVal) {
            case 'custom':
                //this.loadingAllFields()
                if (cont) {
                    
                    this.loadFields(true)
                }
                $("#modifiedNote").focus()
                Const.actualFields.idtemplate = ""
                

                break;
            case 'template':
                
                
                if (!cont) {
                    $("#templateText").val("");
                this.loadFields(true)
                }
                $("#modifiedTemplate").focus()
                break;
        }
    }

    async saveAction() {
        var radioChecked = $("input[type=radio]:checked")
        var radioVal = radioChecked.val();
        var temptext = "";
        var mensagem = "";
        var lContinua = true;

        switch (radioVal) {
            case 'template':
                temptext = DOMPurify.sanitize($("#templateText").val(),Const.configPurify);
                if (temptext == "" || temptext == null || temptext == "undefined" || temptext == "none") {
                    lContinua = false;
                    $("#templateText").addClass("erro-vazio");
                    $("#selEmpty").show();
                } else {
                    Const.actualFields.module = DOMPurify.sanitize(Const.actualFields.module,Const.configPurify);
                    //Const.actualFields.idtemplate = DOMPurify.sanitize($("#modifiedTemplate").find("option:selected").data("id"));
                    Const.actualFields.idtemplate = DOMPurify.sanitize($("#modifiedTemplate").find("option:selected")[0].dataset.id,Const.configPurify);
                    Const.actualFields.note = "";
                }
                break;
            case 'custom':
                mensagem = DOMPurify.sanitize($("#modifiedNote").val(),Const.configPurify);
                if (mensagem == "" || mensagem == null || mensagem == "undefined") {
                    lContinua = false;
                    $("#modifiedNote").addClass("erro-vazio");
                    $("#noteEmpty").show();
                } else {
                    Const.actualFields.module = DOMPurify.sanitize(Const.actualFields.module,Const.configPurify);
                    Const.actualFields.note = DOMPurify.sanitize(mensagem,Const.configPurify);
                }
                break;
        }

        if (lContinua) {
            //return Promise.resolve(true);
            this.fields = Const.actualFields;
            //debugger;
            this.fields.test = false;
            ZOHO.CRM.ACTION.setConfig(this.fields);

        }
    }


    showloading() {
        $('#newLoad').show();
        return Promise.resolve(true);
    }
    hideloading() {
        $('#newLoad').slideUp();
        return Promise.resolve(true);
    }

    showfault(msg) {

        msg = msg == undefined ? this.msg : msg;
        $("#contentDivActionAddToCustomAct").slideUp();
        if (msg != null || msg != "" || msg != undefined) {
            $('#ErroMsg').find('.erroText').text(msg);
        }
        $('#ErroMsg').slideDown();

    }

    async renderTemplate(lang) {
    //console.log(data);
        $.getJSON("../translations/" + lang + ".json", function (data) {
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
    }

    /********************************************************************************
     *                              API Methods
     */

    async getorg() {
        var response = await ZOHO.CRM.CONFIG.getOrgInfo()
        this.config.org = response.org[0]
    }

    async getModuleFieldId(module) {

        return ZOHO.CRM.META.getModules().then(function (data) {
            //console.log(data);
            var ret = "none";
            var mod;
            for (mod in data.modules) {
                if (data.modules[mod].api_name.toLowerCase() == module.toLowerCase()) {
                    //ret = "${!" + data.modules[mod].plural_label + "." + data.modules[mod].api_name+"}";
                    ret = "${!" + data.modules[mod].plural_label + ".Id}";
                    //ret = "${!" + data.modules[mod].api_name+"__id}"; //+ ".ID}";
                    //break;
                }

            }

            return ret;
        });
    }


}

Const = {
    customAct: null,
    apinames: {
        apidparameters: "whatsapphubforzohocrm__configuracao",
        apitemplates: "whatsapphubforzohocrm__WhatsApp_Templates",
        apifieldmoduletemplate: "whatsapphubforzohocrm__Module"
    },
    languages: ["en_US", "pt_BR"],
    deflang: "en_US",
    desclanguage: {},
    actualFields: {},
    optionParam: "",
    jsonParam: {},
    mappingStatus: "",
    jsonMappingStatus: {},
    backparam: "",
    jsonBackparam: {},
    selectCampaign: [],
    allfieldsleads: [],
    allfieldscontacts: [],
    allfieldsaccounts: [],
    allfieldsdeals: [],
    allfieldsusers: [],
    allfieldsorgs: [],
    configPurify: {ALLOWED_TAGS: ['b'], KEEP_CONTENT: false }
}

Utils = {};



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
        //$("#allPage").show();

        /*if (callBack) {
            callBack();
        }*/

    });
}


$(document).ready(function () {
    ZOHO.embeddedApp.on('PageLoad', async function (data) {

        Const.customAct = new customAction(data);
    });
    //debugger;
    ZOHO.embeddedApp.init();
})
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
    apiversion: "whatsapphubforzohocrm__version",
    fields: {
      modulemessage: "whatsapphubforzohocrm__modulemessages",
    },
    module: {
      apimessages: "whatsapphubforzohocrm__WhatsApp_Messages",
    },
  },
  languages: ["en_US", "pt_BR", "es_ES"],
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
  requiredfield: {
    layout: { desc: "", id: "" },
    required: [],
    requiredPhone: [],
  },
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
  emptyField: { desc: "", name: "", type: "", module: "" },
  urlbase: "",
  configPurify: { ALLOWED_TAGS: ["b"], KEEP_CONTENT: false },
  layoutName: "",
  infocountry: "",
  config: "",
  device_list: "",
  response: "",
  version: "",
  url_token_base: "https://utalk.umbler.com/v1/chat/",
};

var structure = "";
var respApp = "";

async function initializeWidget() {
  $("td[colspan=6]").hide();
  $("td[colspan=6]").find("p").hide();
  /*$(".btn-drop").click(function(event) {
          event.stopPropagation();
  
          var $target = $(event.target);
  
          // Open and close the appropriate thing
          if ( $target.closest("td").attr("colspan") > 1 ) {
              $target.slideUp();
          } else {
              if($target.hasClass("inverte-vertical")){
                  $target.removeClass("inverte-vertical");
              } else{
                  $target.addClass("inverte-vertical");
              }
              $target.closest("tr").next().find("td").slideToggle();
              $target.closest("tr").next().find("p").slideToggle();
          }          
      });*/

  await ZOHO.embeddedApp.on("PageLoad", async function (data) {
    $("#newLoad").slideDown();

    var aplicativostatus = "";
    var respAti = "";
    var tokenZap = {};

    await ZOHO.CRM.CONFIG.getCurrentUser().then(function (data) {
      $("#nomeText").val(data.users[0].full_name);
      $("#nomeText").prop("disabled", true);
      $("#emailText").val(data.users[0].email);
      $("#emailText").prop("disabled", true);

      return ZOHO.CRM.API.getUser({ ID: data.users[0].id }).then(
        async function (data) {
          //console.log(data.users[0].language);
          if (Const.languages.includes(data.users[0].language)) {
            Const.deflang = data.users[0].language;
          }
          await Utils.RenderTemplate(Const.deflang);
          //$("#allPage").show();
        }
      );
    });

    ZOHO.CRM.API.getOrgVariable(Const.apinames.apiversion).then(async function (data) {
      if (data.Success != undefined && data.Success != "" && data.Success != null) {
        Const.version = JSON.parse(data.Success.Content).version;
      } else {
        Const.version = "2.0";
        var dominio = window.location.ancestorOrigins[0].split(".")[
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

    await ZOHO.CRM.API.getOrgVariable(Const.apinames.apiwebhookwhatsapp).then(function (data) {
      var urlwebhook = data.Success.Content;
      $("#myWebhook").val(urlwebhook);
      var text = $("#curlSpanCode").text();
      $("#curlSpanCode").text(text.replace("{{url}}", urlwebhook));
      var textJava = $("#javaSpanCode").text();
      $("#javaSpanCode").text(textJava.replace("{{url}}", urlwebhook));
      var baseurlList = urlwebhook.split("/");
      var baseurl = "";
      var i = 0;
      baseurlList.forEach((trecho) => {
        i = i + 1;
        if (i < 3) {
          baseurl = baseurl + trecho + "/";
        } else if (i == 3) {
          baseurl = baseurl + trecho;
        }
      });

      var textPython = $("#pythonSpanCode").text();
      textPython = textPython.replace("{{urlbase}}", baseurl);
      textPython = textPython.replace(
        "{{url}}",
        urlwebhook.replace(baseurl, "")
      );

      $("#pythonSpanCode").text(textPython);
      var textPhp = $("#phpSpanCode").text();
      $("#phpSpanCode").text(textPhp.replace("{{url}}", urlwebhook));
      var textCsharp = $("#csharpSpanCode").text();
      $("#csharpSpanCode").text(textCsharp.replace("{{url}}", urlwebhook));
      var delugeList = urlwebhook.split("?");
      var zapikey = "";
      var mainUrl = "";

      for (i in delugeList) {
        zapikey = delugeList[1].replace("auth_type=apikey&zapikey=", "");
        mainUrl = delugeList[0].replace("s", "");
      }

      var textDeluge = $("#delugeSpanCode").text();
      textDeluge = textDeluge.replace("{{mainurl}}", mainUrl);
      textDeluge = textDeluge.replace("{{zapikey}}", zapikey);
      $("#delugeSpanCode").text(textDeluge);

      var textDeluge2 = $("#delugeSpanCode2").text();
      textDeluge2 = textDeluge2.replace("{{mainurl}}", mainUrl);
      textDeluge2 = textDeluge2.replace("{{zapikey}}", zapikey);
      $("#delugeSpanCode2").text(textDeluge2);
    }
    );

    // Definição da página de aplicativos
    return ZOHO.CRM.META.getModules().then(async function (data) {
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
      //alert(JSON.stringify(Const.enablemodule));
      if (!Const.enablemodule.leads && !Const.enablemodule.contacts &&
        !Const.enablemodule.accounts && !Const.enablemodule.deals) {
        $("#comportamentoDIV").hide();
        $("#erroDIV").show();
      }

      if (Const.enablemodule.leads) {
        ZOHO.CRM.API.getOrgVariable(Const.apinames.apiaplicativo).then(
          async function (data) {
            $("#layoutField").text();
          }
        );
      } else {
        $("#layoutDiv").hide();
        $("#mapping_fields_div").show();
      }

      return ZOHO.CRM.API.getOrgVariable(Const.apinames.apiurlbase).then(async function (data) {
        Const.apiurlbase = data.Success.Content;

        return ZOHO.CRM.API.getOrgVariable(Const.apinames.apiaplicativo).then(async function (data) {
          if (data.Success.Content != "" &&
            data.Success.Content != null &&
            data.Success.Content.includes("{")
          ) {
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
          } else if (
            data.Success.Content != "" &&
            data.Success.Content != null &&
            data.Success.Content == "zapbox"
          ) {
            respApp = data.Success.Content;
          } else {
            showConfig();
          }

          if (
            !respApp.toUpperCase().includes("DOCTYPE") &&
            !respApp.includes("error")
          ) {
            return ZOHO.CRM.API.getOrgVariable(
              Const.apinames.apistatusaplicativo
            ).then(async function (stats) {
              aplicativostatus = stats.Success.Content;
              if (
                !aplicativostatus.toUpperCase().includes("DOCTYPE") &&
                !aplicativostatus.includes("error")
              ) {
                if (respApp == "zapbox") {
                  document.getElementById("ZapboxR").checked = true;
                  $("#divDeviceNumber").hide();
                  //document.getElementById("ativacaoTab").removeAttribute("disabled");
                  document.getElementById("zapboxContent").style.display =
                    "block";
                  document.getElementById("zapboxConfig").style.display =
                    "block";
                } else if (respApp == "zapphub") {
                  document.getElementById("ZappHubR").checked = true;
                  //document.getElementById("WinzapR").checked = true;
                  //document.getElementById("ativacaoTab").removeAttribute("disabled");
                  document.getElementById("zapphubContent").style.display =
                    "block";
                  document.getElementById("zapboxConfig").style.display =
                    "block";
                } else {
                  document.getElementById("NenhumaR").checked = true;
                  aplicativostatus = false;
                }
                // Definição da página de ativação
                return ZOHO.CRM.API.getOrgVariable(
                  Const.apinames.apiativacao
                ).then(async function (data) {
                  respAti = data.Success.Content.toLowerCase();
                  if (
                    !respAti.toUpperCase().includes("DOCTYPE") &&
                    !respAti.includes("error")
                  ) {
                    if (respAti == "truezn" && respApp == "zapbox") {
                      //document.getElementById("configuracaoTab").removeAttribute("disabled");
                      $(".activeTab").removeClass();
                      $(".tab-body").hide();
                      $("#" + "tab3").show();
                      $("#configuracaoTab").addClass("activeTab");

                      var parameterMap = {
                        apiname: Const.apinames.apiativacao,
                        value: DOMPurify.sanitize(
                          "truez",
                          Const.configPurify
                        ),
                      };
                      ZOHO.CRM.CONNECTOR.invokeAPI(
                        "crm.set",
                        parameterMap
                      ).then(async function (data) { });
                    } else if (
                      respAti == "truewc" &&
                      respApp == "zapphub"
                    ) {
                      //document.getElementById("configuracaoTab").removeAttribute("disabled");
                      $(".activeTab").removeClass();
                      $(".tab-body").hide();
                      $("#" + "tab3").show();
                      $("#configuracaoTab").addClass("activeTab");
                      var parameterMap = {
                        apiname: Const.apinames.apiativacao,
                        value: DOMPurify.sanitize(
                          "truew",
                          Const.configPurify
                        ),
                      };
                      ZOHO.CRM.CONNECTOR.invokeAPI(
                        "crm.set",
                        parameterMap
                      ).then(async function (data) { });
                    }
                    return ZOHO.CRM.API.getOrgVariable(
                      Const.apinames.apiconfiguracao
                    ).then(async function (data) {
                      structure = data.Success.Content;
                      if (
                        structure.includes("{") &&
                        !structure.toUpperCase().includes("DOCTYPE") &&
                        !structure.includes("error")
                      ) {
                        tokenZap = JSON.parse(structure);
                        if (typeof tokenZap == "string") {
                          tokenZap = JSON.parse(tokenZap);
                        }

                        if (respApp == "zapbox") {
                          if (
                            tokenZap.token !== null &&
                            tokenZap.token !== "" &&
                            tokenZap.status == "true"
                          ) {
                            $(".activeTab").removeClass();
                            $(".tab-body").hide();
                            $("#" + "tab4").show();
                            $("#comportamentoTab").addClass("activeTab");

                            var parameterMap = {
                              apiname: Const.apinames.apiconfiguracao,
                              value: DOMPurify.sanitize(
                                structure.replace("true", "false"),
                                Const.configPurify
                              ),
                            };
                            ZOHO.CRM.CONNECTOR.invokeAPI(
                              "crm.set",
                              parameterMap
                            );
                            document.getElementById("apiText").value =
                              tokenZap.token;
                            if (tokenZap.allow == "true") {
                              //Xdocument.getElementById("comportamentoTab").removeAttribute("disabled");
                              await verificaCampos();
                            }
                          } else if (
                            tokenZap.token !== null &&
                            tokenZap.token !== "" &&
                            tokenZap.status == "false"
                          ) {
                            document.getElementById("apiText").value =
                              tokenZap.token;
                            if (tokenZap.allow == "true") {
                              //document.getElementById("comportamentoTab").removeAttribute("disabled");
                              await verificaCampos();
                            }
                          }
                          if (
                            tokenZap.token !== null &&
                            tokenZap.token !== ""
                          ) {
                            var demo =
                              '<iframe frameborder="0" src="' +
                              Const.apiurlbase +
                              "/qrcode/" +
                              tokenZap.token +
                              '" width="100%" height="400px" scrolling="no"></iframe>';
                            $("#demo").html(demo);
                          }
                        } else if (respApp == "zapphub") {
                          Const.config = tokenZap;

                          if (
                            tokenZap.token !== null &&
                            tokenZap.token !== ""
                          ) {
                            await verificaCampos();
                            $("#apiText").val(tokenZap.token);
                            getDevices(tokenZap.token, tokenZap.devices);
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
        })
          .then(function () {
            $("#newLoad")
              .delay(5000)
              .slideUp(function () {
                //$('#allPage').show();

                $("#aplicativoTab").removeAttr("disabled");
                $("#btnEdit").removeAttr("disabled");

                if (aplicativostatus == "true") {
                  $(".activeTab").removeClass();
                  $(".tab-body").hide();
                  $("#" + "tab2").show();
                  $("#ativacaoTab").addClass("activeTab");
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

                  if (
                    (respAti == "truezn" && respApp == "zapbox") ||
                    (respAti == "truewc" && respApp == "zapphub") ||
                    (respAti == "truez" && respApp == "zapbox") ||
                    (respAti == "truew" && respApp == "zapphub")
                  ) {
                    $("#configuracaoTab").removeAttr("disabled");
                    $("#btnEditar").removeAttr("disabled");
                  }

                  if (
                    tokenZap.token !== null &&
                    tokenZap.token !== "" &&
                    tokenZap.allow &&
                    respApp == "zapbox"
                  ) {
                    $("#comportamentoTab").removeAttr("disabled");
                    $("#btnfieldedit").removeAttr("disabled");
                  }
                  if (
                    tokenZap.devices !== null &&
                    tokenZap.devices !== "" &&
                    tokenZap.allow &&
                    respApp == "zapphub"
                  ) {
                    $("#comportamentoTab").removeAttr("disabled");
                    $("#btnfieldedit").removeAttr("disabled");
                    $("#apiText").val(tokenZap.token);
                    getDevices(tokenZap.token, tokenZap.devices);
                  }
                  lLibera = true;
                  if (
                    Const.enablemodule.leads &&
                    Const.phonelead.desc != null &&
                    Const.phonelead.desc != "" &&
                    Const.phonelead.desc != "undefined"
                  ) {
                    //$("#suporteTab").removeAttr("disabled");
                  } else {
                    lLibera = false;
                  }
                  if (
                    Const.enablemodule.contacts &&
                    Const.phonecontact.desc != null &&
                    Const.phonecontact.desc != "" &&
                    Const.phonecontact.desc != "undefined"
                  ) {
                    $("#suporteTab").removeAttr("disabled");
                  } else {
                    lLibera = false;
                  }
                  if (
                    Const.enablemodule.accounts &&
                    Const.phoneaccount.desc != null &&
                    Const.phoneaccount.desc != "" &&
                    Const.phoneaccount.desc != "undefined"
                  ) {
                    $("#suporteTab").removeAttr("disabled");
                  } else {
                    lLibera = false;
                  }
                  if (
                    Const.enablemodule.deals &&
                    Const.phonedeal.desc != null &&
                    Const.phonedeal.desc != "" &&
                    Const.phonedeal.desc != "undefined"
                  ) {
                  } else {
                    lLibera = false;
                  }
                  if (lLibera) {
                    $("#suporteTab").removeAttr("disabled");
                  }

                  $("select").multipleSelect({
                    filter: true,
                  });
                }
              });
          });
      }
      );
    });
  });
  /*
   * initialize the widget.
   */

  ZOHO.embeddedApp.init();
}

function getDevices(token, devices) {
  //console.log("getDevices Function activated");
  var request = {
    url: "https://api.zapphub.com/v1/devices",
    params: { size: 10, page: 0 },
    headers: {
      Token: token,
    },
  };
  var resp = "";
  ZOHO.CRM.HTTP.get(request).then(async function (data) {
    data = JSON.parse(data);
    lista_de_devices = [];

    if (data.length > 0) {
      var linhas_device = "";
      i = 0;
      var p = 0;
      data.forEach((device) => {
        i = i + 1;
        p = p + 1;
        var status = device.session.status;
        var device_id = device.id;
        var phone = device.phone;
        var alias = device.alias;
        i = 0;
        x = 0;

        var lContinua = false;
        devices.forEach((dvcinfo) => {
          if (dvcinfo.device_id == device_id) {
            x = i;
            lContinua = true;
          }
          i += 1;
        });
        if (lContinua) {
          lista_de_devices.push({
            device_id: device_id,
            phone: phone,
            device_name: alias,
            status: devices[x].status,
          });
        } else {
          lista_de_devices.push({
            device_id: device_id,
            phone: phone,
            device_name: alias,
            status: false,
          });
        }

        var linha =
          '<tr class="main-tr"><th scope="row"> <div class="onoffswitch">';
        if (lContinua) {
          if (devices[x].status) {
            var input =
              '<input type="checkbox" name="onoffswitch" onchange="ativaDispositivo(this)" class="onoffswitch-checkbox onoffswitch-device" id="myonoffswitch' +
              p +
              '" tabindex="0" disabled="disabled" checked>';
          } else {
            var input =
              '<input type="checkbox" name="onoffswitch" onchange="ativaDispositivo(this)" class="onoffswitch-checkbox onoffswitch-device" id="myonoffswitch' +
              p +
              '" tabindex="0" disabled="disabled">';
          }
        } else {
          var input =
            '<input type="checkbox" name="onoffswitch" onchange="ativaDispositivo(this)" class="onoffswitch-checkbox onoffswitch-device" id="myonoffswitch' +
            p +
            '" tabindex="0" disabled="disabled">';
        }
        input =
          input +
          '<label class="onoffswitch-label" for="myonoffswitch' +
          p +
          '"><span class="onoffswitch-inner"></span><span class="onoffswitch-switch"></span></label>';
        linha = linha + input + "</div></th>";
        linha = linha + "<td>" + alias + "</td>";
        linha = linha + "<td>" + phone + "</td>";
        linha = linha + "<td>" + device_id + "</td>";
        linha = linha + "<td>" + status + "</td>";
        linha =
          linha +
          "<td>" +
          '<button id="btnDevice' +
          p +
          '" type="button" class="btn-drop" onclick="selectDevice(event)"></button>' +
          "</td>";
        linha = linha + "</tr>";
        linha = linha + "<tr>";
        linha = linha + '<td colspan="6">';
        linha =
          linha +
          '<div id="loading' +
          p +
          '" class="lds-ring" style="display:block;"><div></div><div></div><div></div><div></div></div>';
        linha = linha + "</td>";
        linha = linha + "</tr>";
        linhas_device = linhas_device + linha;
        //console.log(linhas_device);
      });
      $("#tbId").html(linhas_device);
      $("#tableDiv").show();

      Const.device_list = lista_de_devices;
      lista_de_devices = JSON.stringify(lista_de_devices);

      $("td[colspan=6]").hide();
      $("#saveNcancel2").hide();
      $("#btnEditar").show();
      //$("#comportamentoTab").removeAttr("disabled");
      $("#btnfieldedit").removeAttr("disabled");
    } else {
      $("#newLoad").slideUp();
      Utils.errorMsg("ErroMsg", "msg-error-device");
    }
  });
}

function copyFunc() {
  var copyText = document.getElementById("myWebhook");
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
}

function showtab(id, obj) {
  $(".activeTab").removeClass();
  $(".tab-body").hide();
  $("#" + id).show();
  $(obj).addClass("activeTab");
}

function reloadWebtab() {
  location.reload();
}

function copyTextToClipboard(btn, element) {
  var $temp = $("<input>");
  $("body").append($temp);
  //$temp.val($(element).text()).select();
  $temp.val(element).select();
  document.execCommand("copy");
  $temp.remove();
}

function showcode(id, obj) {
  $("a.active").removeClass("active");
  $(".api-code-panel-inner").removeClass("active");
  $("." + id).addClass("active");
  $(obj).addClass("active");
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
  var url_list = window.location.search.split(".");
  var dom_url = url_list[url_list.length - 1];
  //console.log(dom_url);
  ZOHO.CRM.API.getOrgVariable(Const.apinames.apiwebhookwhatsapp).then(function (data) {
    var url_webhook = data.Success.Content;
    var sub_url = url_webhook.split("/")[2].replace("com", dom_url);
    var new_url = url_webhook.replace(url_webhook.split("/")[2], sub_url);
    var update_url = {
      apiname: Const.apinames.apiwebhookwhatsapp,
      value: DOMPurify.sanitize(
        new_url,
        Const.configPurify
      ),
    };
    ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", update_url);
  });
  ZOHO.CRM.API.getOrgVariable(Const.apinames.apiwebhook).then(function (data) {
    var webhook_urls = JSON.parse(data.Success.Content);
    url_zapphub = webhook_urls.zapphubv2;
    url_webhook = webhook_urls.zapphub;
    url_utalk = webhook_urls.utalk;

    var sub_url = url_webhook.split("/")[2].replace("com", dom_url);
    var new_url = url_webhook.replace(url_webhook.split("/")[2], sub_url);
    webhook_urls["zapphub"] = new_url;

    var sub_urlv2 = url_zapphub.split("/")[2].replace("com", dom_url);
    var new_urlv2 = url_zapphub.replace(url_webhook.split("/")[2], sub_urlv2);
    webhook_urls["zapphubv2"] = new_urlv2;

    var sub_utalk = url_utalk.split("/")[2].replace("com", dom_url);
    var new_utalk = url_utalk.replace(url_utalk.split("/")[2], sub_utalk);
    webhook_urls["utalk"] = new_utalk;

    var update_url = {
      apiname: Const.apinames.apiwebhook,
      value: DOMPurify.sanitize(
        JSON.stringify(webhook_urls),
        Const.configPurify
      ),
    };
    ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", update_url);
  });
  ZOHO.CRM.META.getModules().then(function (data) {
    //console.log(data);
    for (mod in data.modules) {
      if (
        data.modules[mod].api_name.toLowerCase() ==
        Const.apinames.module.apimessages.toLowerCase()
      ) {
        var parameterMaps = {
          apiname: Const.apinames.fields.modulemessage,
          value: DOMPurify.sanitize(
            data.modules[mod].module_name,
            Const.configPurify
          ),
        };
        ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMaps);
      }
    }
  });

  var aplicativos = document.getElementsByName("aplicativo");
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
  if (
    aplicativo.toLowerCase() == "nenhuma" &&
    saveapp.country.code.toUpperCase() != "BR"
  ) {
    Utils.errorMsg("ErroMsg", "msg-error-country");
    lContinuaCountry = false;
  }
  if (lContinuaCountry) {
    var parameterMap2 = {
      apiname: Const.apinames.apiaplicativo,
      value: DOMPurify.sanitize(JSON.stringify(saveapp), Const.configPurify),
    };
    ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap2).then(function (
      data
    ) {
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
  var aplicativos = document.getElementsByName("aplicativo");
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
async function saveConf() {
  //console.log("SaveConf function");
  Const.config.token = DOMPurify.sanitize(
    document.getElementById("apiText").value,
    Const.configPurify
  );
  var aplicativos = document.getElementsByName("aplicativo");
  for (var i = 0, length = aplicativos.length; i < length; i++) {
    if (aplicativos[i].checked) {
      var aplicativo = aplicativos[i].value;
      break;
    }
  }
  aplicativo = aplicativo.toLowerCase();
  if (aplicativo == "zapbox") {
    var token = DOMPurify.sanitize(
      document.getElementById("apiText").value,
      Const.configPurify
    );
    if (token.includes("https")) {
      token = token.replace(Const.url_token_base, "");
      token = token.replace("/", "");
    }
    var estrutura =
      '{"aplicativo": "' +
      aplicativo +
      '", "token": "' +
      token +
      '", "status":"true", "allow":"true", "numberPhone":""}';
    //estrutura = JSON.parse(estrutura);
    //estrutura = JSON.stringify(estrutura);
    //console.log(estrutura);
  }
  var parameterMap = {
    apiname: Const.apinames.apiconfiguracao,
    value: DOMPurify.sanitize(estrutura, Const.configPurify),
  };
  ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap).then(function (data) {
    //ZOHO.CRM.API.getOrgVariable(Const.apinames.apiconfiguracao).then(async function(data) {

    ZOHO.CRM.API.getOrgVariable(Const.apinames.apiaplicativo).then(
      async function (app) {
        var respApp = "";
        var answer = app.Success.Content;
        if (answer != "" && answer.includes("{")) {
          answer = JSON.parse(answer);
          respApp = answer.app.toLowerCase();
        } else {
          respApp = answer.toLowerCase();
        }

        if (respApp == "zapbox") {
          var structure = JSON.parse(data).response; //data.Success.Content;
          var tokenZap = JSON.parse(structure)[Const.apinames.apiconfiguracao];
          var parameterMap = {
            apiname: Const.apinames.apiconfiguracao,
            value: DOMPurify.sanitize(
              JSON.stringify(tokenZap).replace("true", "false"),
              Const.configPurify
            ),
          };
          ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap).then(
            async function (data) { }
          );
          tokenZap = JSON.parse(tokenZap);
          document.getElementById("apiText").value = tokenZap.token;
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
              var verificaQr = this.responseText.toLowerCase();
              if (verificaQr.contains("desligar sessão")) {
                var demo =
                  '<iframe frameborder="0" src="' +
                  Const.apiurlbase +
                  "/qrcode/" +
                  tokenZap.token +
                  '" width="100%" height="400px" scrolling="no"></iframe>';
                $("#demo").html(demo);
                if (
                  verificaQr.contains("abrir chat") &&
                  tokenZap.aplicativo.toLowerCase() == "zapbox"
                ) {
                  ZOHO.CRM.API.getOrgVariable(Const.apinames.apiwebhook).then(
                    function (data) {
                      var webhookSite =
                        Const.apiurlbase + "/webhook/" + tokenZap.token;
                      var request = {
                        url: webhookSite,
                        headers: {
                          ContentType: "application/json; charset=utf-8",
                        },
                        params: {
                          webhook: JSON.parse(data.Success.Content).utalk,
                        },
                      };
                      ZOHO.CRM.HTTP.get(request).then(async function (data) {
                        if (data !== null || data !== "") {
                          $("#comportamentoTab").removeAttr("disabled");
                          await verificaCampos();
                          if (aplicativo == "zapbox") {
                            var token =
                              document.getElementById("apiText").value;
                            var estrutura =
                              '{"aplicativo": "' +
                              aplicativo +
                              '", "token": "' +
                              token +
                              '", "status":"true", "allow":"true", "numberPhone":""}';
                          }
                          var parameterMap2 = {
                            apiname: Const.apinames.apiconfiguracao,
                            value: DOMPurify.sanitize(
                              estrutura,
                              Const.configPurify
                            ),
                          };
                          ZOHO.CRM.CONNECTOR.invokeAPI(
                            "crm.set",
                            parameterMap2
                          ).then(async function (data) { });
                          reloadWebtab();
                        }
                      });
                    }
                  );
                }
              } else {
                var demo =
                  '<iframe id="frameid" frameborder="0" src="' +
                  Const.apiurlbase +
                  "/qrcode/" +
                  tokenZap.token +
                  '" width="100%" height="400px" scrolling="no"></iframe>';
                $("#demo").html(demo);
              }
            }
          };

          var authSite = Const.apiurlbase + "/qrcode/" + tokenZap.token;
          var resp = xhttp.open("GET", authSite, true);
          xhttp.send();
        } else if (respApp == "zapphub") {
          var request = {
            url: "https://api.zapphub.com/v1/devices",
            params: { size: 10, page: 0 },
            headers: {
              Token: $("#apiText").val(),
            },
          };
          var resp = "";
          ZOHO.CRM.HTTP.get(request).then(async function (data) {
            data = JSON.parse(data);
            lista_de_devices = [];

            if (data.length > 0) {
              //////////////WEBHOOK////////////////
              var request = {
                url: "https://api.zapphub.com/v1/webhooks",
                params: {},
                headers: {
                  Token: $("#apiText").val(),
                  "Content-Type": "application/json",
                },
              };
              ZOHO.CRM.API.getOrgVariable(Const.apinames.apiwebhook).then(
                function (data) {
                  var urlwebhook = JSON.parse(data.Success.Content);
                  if ("zapphubv2" in urlwebhook) {
                    urlwebhook = urlwebhook.zapphubv2;
                  } else {
                    urlwebhook = urlwebhook.zapphub;
                  }
                  //console.log(urlwebhook);
                  ZOHO.CRM.HTTP.get(request).then(async function (data) {
                    var lContinua = true;
                    data = JSON.parse(data);
                    if (data.length > 0) {
                      data.forEach((webhk) => {
                        if (webhk.name == "zoho-webhook") {
                          //PATCH
                          lContinua = false;
                          var request = {
                            url:
                              "https://api.zapphub.com/v1/webhooks/" + webhk.id,
                            params: {},
                            body:
                              '{"name":"zoho-webhook","url":"' +
                              urlwebhook +
                              "&token=" +
                              $("#apiText").val() +
                              '", "events":["message:in:new","message:out:new"]}',
                            headers: {
                              Token: $("#apiText").val(),
                              "Content-Type": "application/json",
                            },
                          };
                          //console.log(request);
                          ZOHO.CRM.HTTP.patch(request).then((data) => {
                            console.log(data);
                          });
                        }
                      });
                    }
                    if (lContinua) {
                      //POST
                      var request = {
                        url: "https://api.zapphub.com/v1/webhooks",
                        params: {},
                        body:
                          '{"name":"zoho-webhook","url":"' +
                          urlwebhook +
                          "&token=" +
                          $("#apiText").val() +
                          '", "events":["message:in:new","message:out:new"]}',
                        headers: {
                          Token: $("#apiText").val(),
                          "Content-Type": "application/json",
                        },
                      };
                      //console.log(request);
                      ZOHO.CRM.HTTP.post(request).then((data) => {
                        console.log(data);
                      });
                    }
                  });
                }
              );
              /////////////////////////////////////

              var linhas_device = "";
              i = 0;
              data.forEach((device) => {
                i = i + 1;

                var status = device.session.status;
                var device_id = device.id;
                //console.log(device);
                var phone = device.phone;
                var alias = device.alias;

                var linha =
                  '<tr class="main-tr"><th scope="row"> <div class="onoffswitch">';
                var input = "";
                var lContinue = false;
                if (Const.config != null && Const.config != undefined && Const.config != "") {
                  if (Const.config.devices != null && Const.config.devices != undefined && Const.config.devices != "") {
                    Const.config.devices.forEach((device_config) => {
                      if (device_config.device_id == device_id) {
                        if (device_config.status) {
                          input =
                            '<input type="checkbox" name="onoffswitch" onchange="ativaDispositivo(this)" class="onoffswitch-checkbox onoffswitch-device" id="myonoffswitch' +
                            i +
                            '" tabindex="0" disabled="disabled" checked>';
                          lista_de_devices.push({
                            device_id: device_id,
                            phone: phone,
                            device_name: alias,
                            status: true,
                          });
                        } else {
                          input =
                            '<input type="checkbox" name="onoffswitch" onchange="ativaDispositivo(this)" class="onoffswitch-checkbox onoffswitch-device" id="myonoffswitch' +
                            i +
                            '" tabindex="0" disabled="disabled">';
                          lista_de_devices.push({
                            device_id: device_id,
                            phone: phone,
                            device_name: alias,
                            status: false,
                          });
                        }
                        lContinue = true;
                      }
                    });
                  }
                }
                if (!lContinue) {
                  input =
                    '<input type="checkbox" name="onoffswitch" onchange="ativaDispositivo(this)" class="onoffswitch-checkbox onoffswitch-device" id="myonoffswitch' +
                    i +
                    '" tabindex="0" disabled="disabled">';
                  lista_de_devices.push({
                    device_id: device_id,
                    phone: phone,
                    device_name: alias,
                    status: false,
                  });
                }
                input =
                  input +
                  '<label class="onoffswitch-label" for="myonoffswitch' +
                  i +
                  '"><span class="onoffswitch-inner"></span><span class="onoffswitch-switch"></span></label>';
                linha = linha + input + "</div></th>";
                linha = linha + "<td>" + alias + "</td>";
                linha = linha + "<td>" + phone + "</td>";
                linha = linha + "<td>" + device_id + "</td>";
                linha = linha + "<td>" + status + "</td>";
                linha =
                  linha +
                  "<td>" +
                  '<button id="btnDevice' +
                  i +
                  '" type="button" class="btn-drop" onclick="selectDevice(event)"></button>' +
                  "</td>";
                linha = linha + "</tr>";
                linha = linha + "<tr>";
                linha = linha + '<td colspan="6">';
                linha =
                  linha +
                  '<div id="loading' +
                  i +
                  '" class="lds-ring" style="display:block;"><div></div><div></div><div></div><div></div></div>';
                linha = linha + "</td>";
                linha = linha + "</tr>";
                linhas_device = linhas_device + linha;
              });
              $("#tbId").html(linhas_device);
              $("#tableDiv").show();

              Const.device_list = lista_de_devices;
              lista_de_devices = JSON.stringify(lista_de_devices);

              $("td[colspan=6]").hide();

              $("#newLoad").slideDown();
              var token = DOMPurify.sanitize(
                document.getElementById("apiText").value,
                Const.configPurify
              );
              var estrutura =
                '{"aplicativo": "' +
                aplicativo +
                '", "token": "' +
                token +
                '","devices":' +
                lista_de_devices +
                ', "status":"true", "allow":"true", "numberPhone":""}';
              Const.config = JSON.parse(estrutura);
              var parameterMap2 = {
                apiname: Const.apinames.apiconfiguracao,
                value: DOMPurify.sanitize(
                  JSON.stringify(JSON.parse(estrutura)),
                  Const.configPurify
                ),
              };
              await ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap2).then(
                async function (data) {
                  $("#saveNcancel2").hide();
                  $("#btnEditar").show();
                  $("#newLoad").slideUp();
                  $("#apiText").removeClass("fldtype");
                  $("#apiText").attr("disabled", true);
                }
              );
              $("#comportamentoTab").removeAttr("disabled");
              $("#btnfieldedit").removeAttr("disabled");
            } else if (data.length == 0) {
              var token = DOMPurify.sanitize(
                document.getElementById("apiText").value,
                Const.configPurify
              );
              var estrutura =
                '{"aplicativo": "' +
                aplicativo +
                '", "token": "' +
                token +
                '","devices":[], "status":"true", "allow":"true", "numberPhone":""}';
              Const.config = JSON.parse(estrutura);
              var parameterMap2 = {
                apiname: Const.apinames.apiconfiguracao,
                value: DOMPurify.sanitize(
                  JSON.stringify(JSON.parse(estrutura)),
                  Const.configPurify
                ),
              };

              await ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap2).then(
                function () {
                  $("#newLoad").slideUp();
                  Utils.errorMsg("ErroMsg", "msg-error-device");
                }
              );
            } else {
              $("#newLoad").slideUp();
              Utils.errorMsg("ErroMsg", "msg-error-device");
            }
          });
        } else {
          $("#newLoad").slideUp();
          Utils.errorMsg("ErroMsg", "msg-error-token");
        }
      }
    );
  });
  //});
}

function ativaDispositivo(obj) {
  var idAtivacao = obj.attributes.id.value;
  var isChecked = $("#" + idAtivacao).is(":checked");
  var device_id = $("#" + idAtivacao)
    .parents(":eq(2)")
    .children(":eq(3)")[0].textContent;
  if (isChecked) {
    i = 0;
    Const.device_list.forEach((device) => {
      if (device.device_id == device_id) {
        Const.device_list[i].status = true;
      }
      i = i + 1;
    });
  } else {
    i = 0;
    Const.device_list.forEach((device) => {
      if (device.device_id == device_id) {
        Const.device_list[i].status = false;
      }
      i = i + 1;
    });
  }
  console.log(Const.device_list);
}
function configureDevices() {
  $("#btnTable").hide();
  $("#saveNcancelTable").show();
  $(".onoffswitch-device").removeAttr("disabled");
}

function saveDevices() {
  console.log("saveDevices function");
  ZOHO.CRM.API.getOrgVariable(Const.apinames.apiconfiguracao).then(function (
    data
  ) {
    var estrutura = JSON.parse(data.Success.Content);
    estrutura.devices = Const.device_list;
    parameterMap = {
      apiname: Const.apinames.apiconfiguracao,
      value: DOMPurify.sanitize(JSON.stringify(estrutura), Const.configPurify),
    };
    ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap).then(function (data) {
      Utils.successMsg("SuccessMsg", "msg-success-device", true);
    });
  });
}

async function selectDevice(event) {
  console.log("selectDevice function");
  event.stopPropagation();

  var $target = $(event.target);

  if ($target.closest("td").attr("colspan") > 1) {
    $target.slideUp();
  } else {
    if ($target.hasClass("inverte-vertical")) {
      var device_id = $target.closest("tr").children()[3].textContent;
      $target
        .closest("tr")
        .next()
        .find("td")
        .find("button")
        .remove(".reset-button");
      $target
        .closest("tr")
        .next()
        .find("td")
        .find("button")
        .remove(".reset-qrcode");
      $target
        .closest("tr")
        .next()
        .find("td")
        .find("button")
        .remove(".verifica-sessao");
      $target.closest("tr").next().find("td").find("svg").parent().remove();
      $target.removeClass("inverte-vertical");
    } else {
      $target.closest("tr").next().find("div").show();
      $target.addClass("inverte-vertical");
    }
    $target.closest("tr").next().find("td").slideToggle();
  }
  var id_loading = $target.closest("tr").next().find("div")[0].attributes
    .id.value;
  if ($target.hasClass("inverte-vertical")) {
    var device_id = $target.closest("tr").children()[3].textContent;
    var token = $("#apiText").val();
    var qrcode = await createQRCode(device_id, token, false);
    var jsonqrcode = JSON.parse(qrcode);
    console.log(jsonqrcode);
    if (
      jsonqrcode.status == 409 &&
      (jsonqrcode.message.toLowerCase() ==
        "device is already authenticated and synchronized" ||
        jsonqrcode.message.toLowerCase() == "device was already authorized")
    ) {
      var button_input =
        '<button class="reset-button" onclick="resetSession(\'' +
        device_id.trim() +
        "','" +
        id_loading.trim() +
        '\')" style="padding: 14px 40px; display: block; font-size: 16px; margin: 4px 2px;  cursor: pointer; text-decoration: none; text-align: center; color: white; border: none;background-color: #f44336;margin: auto;">' + Const.desclanguage["zapphub-close-session"] + '</button>';
      if (
        !$target
          .closest("tr")
          .next()
          .find("td")
          .find("button")
          .hasClass("reset-button")
      ) {
        $target.closest("tr").next().find("td").append(button_input);
      }
      $("#" + id_loading).hide();
    } else if (
      (jsonqrcode.status == 503 || jsonqrcode.status == 429) &&
      (jsonqrcode.message.toLowerCase() ==
        "cannot authorize device. please, try again in a few seconds." ||
        jsonqrcode.message
          .toLowerCase()
          .includes("device scanning already in progress. please, try again"))
    ) {
      var lContinua = false;
      var resp = "";
      setTimeout(async () => {
        var qrcodeagain = await callCreateQRCode(device_id, token, false);
        var jsonqrcodeagain = JSON.parse(qrcodeagain);
        if (
          jsonqrcodeagain.data != "" &&
          jsonqrcodeagain.data != null &&
          jsonqrcodeagain.data != undefined &&
          jsonqrcodeagain.data.includes("image/svg")
        ) {
          resp = jsonqrcodeagain;
          lContinua = true;
        }
      }, 10000);

      if (resp.data != null && resp.data != "") {
        var svg_img =
          '<div style="text-align:center;"><h2>' + Const.desclanguage["zapphub-camera"] + '</h2><h4>' + Const.desclanguage["zapphub-conflicts"] + '</h4><br>' +
          resp.data.replace("data:image/svg+xml;utf8,", "") +
          "</div>";
        if ($target.closest("tr").next().find("td").find("svg").length > 0) {
          $target.closest("tr").next().find("td").find("svg").parent().remove();
        }
        $target.closest("tr").next().find("td").append(svg_img);
        var lVerifica = false;

        var qrcode = await callCreateQRCode(device_id, token, false);
        var jsonqrcode = JSON.parse(qrcode);
        if (
          jsonqrcode.data != "" &&
          jsonqrcode.data != null &&
          jsonqrcode.data != undefined &&
          jsonqrcode.includes("image/svg")
        ) {
          var svg_img =
            '<div style="text-align: center;"><h2>' + Const.desclanguage["zapphub-camera"] + '</h2><h4>' + Const.desclanguage["zapphub-conflicts"] + '</h4><br>' +
            jsonqrcode.data.replace("data:image/svg+xml;utf8,", "") +
            "</div>";
          if ($target.closest("tr").next().find("td").find("svg").length > 0) {
            $target
              .closest("tr")
              .next()
              .find("td")
              .find("svg")
              .parent()
              .remove();
          }
          $target.closest("tr").next().find("td").append(svg_img);
          callCreateQRCode(device_id, token, false);
        } else {
          lVerifica = true;
        }
      } else {
        console.log(resp);
      }
      $("#" + id_loading).hide();
    } else if (
      jsonqrcode.data != null &&
      jsonqrcode.data != "" &&
      jsonqrcode.data != undefined &&
      jsonqrcode.data.includes("image/svg")
    ) {
      var button_input =
        '<div class="div-qrcode"><button id="btnSessao_' +
        device_id.trim() +
        '" class="verifica-sessao btn-qrcode-green" onclick="verificaSessao(\'' +
        device_id.trim() +
        "','" +
        id_loading.trim() +
        "')\">" + Const.desclanguage['zapphub-verify-session'] + "</button>";

      button_input =
        button_input +
        '<button id="btnQrcode_' +
        device_id.trim() +
        '" class="reset-qrcode btn-qrcode-red" onclick="resetQrCodeAgain(\'' +
        device_id.trim() +
        "','" +
        id_loading.trim() +
        '\')" style="margin-left:20px;">' + Const.desclanguage["zapphub-reset-qrcode"] + '</button></div>';

      if (
        !$target
          .closest("tr")
          .next()
          .find("td")
          .find("button")
          .hasClass("reset-qrcode")
      ) {
        $target.closest("tr").next().find("td").append(button_input);
      }
      var svg_img =
        '<div style="text-align: center;"><h2>' + Const.desclanguage["zapphub-camera"] + '</h2><h4>' + Const.desclanguage["zapphub-conflicts"] + '</h4><br>' +
        jsonqrcode.data.replace("data:image/svg+xml;utf8,", "") +
        "</div>";
      if ($target.closest("tr").next().find("td").find("svg").length > 0) {
        $target.closest("tr").next().find("td").find("svg").parent().remove();
      }
      $target.closest("tr").next().find("td").append(svg_img);
      $("#" + id_loading).hide();
      var lVerifica = false;
    }
  }
}

async function resetQrCodeAgain(device_id, loading_id) {
  $("#newLoad").slideDown();
  var qrcode = await createQRCode(device_id, Const.config.token, true);
  qrcodeagain = JSON.parse(qrcode);
  if (
    qrcodeagain.data != null &&
    qrcodeagain.data != "" &&
    qrcodeagain.data != undefined &&
    qrcodeagain.data.includes("image/svg")
  ) {
    var $target = $("#btnQrcode_" + device_id)
      .parent()
      .parent()
      .parent();
    var svg_img =
      '<div style="text-align: center;"><h2>' + Const.desclanguage["zapphub-camera"] + '</h2><h4>' + Const.desclanguage["zapphub-conflicts"] + '</h4><br>' +
      qrcodeagain.data.replace("data:image/svg+xml;utf8,", "") +
      "</div>";
    if ($target.find("td").find("svg").length > 0) {
      $target.find("td").find("svg").parent().remove();
    }
    $target.find("td").append(svg_img);
    $("#newLoad").slideUp();
  } else {
    $("#newLoad").slideUp();
    Utils.errorMsg("ErroMsg", qrcodeagain.message);
  }
}

async function verificaSessao(device_id, id_loading) {
  console.log("verificaSession function");
  $("#newLoad").slideDown();
  var request = {
    url: "https://api.zapphub.com/v1/devices/" + device_id + "/start?wait=true",
    params: {},
    headers: {
      Token: Const.config.token,
    },
  };
  await ZOHO.CRM.HTTP.post(request).then(async function (data) {
    var result = JSON.parse(data);
    var session_details = result.session;
    if (session_details.status == "online") {
      var $target = $("#btnSessao_" + device_id)
        .parent()
        .parent()
        .parent();
      var button_input =
        '<button class="reset-button" onclick="resetSession(\'' +
        device_id.trim() +
        "','" +
        id_loading.trim() +
        '\')" style="padding: 14px 40px; display: block; font-size: 16px; margin: 4px 2px;  cursor: pointer; text-decoration: none; text-align: center; color: white; border: none;background-color: #f44336;margin: auto;">' + Const.desclanguage["zapphub-close-session"] + '/button>';
      if (!$target.find("td").find("button").hasClass("reset-button")) {
        $target.find("td").append(button_input);
      }
      $target.find("td").find("button").remove(".reset-qrcode");
      $target.find("td").find("button").remove(".verifica-sessao");
      $target.find("td").find("svg").parent().remove();
      await saveConf();
      $("#newLoad").slideUp();
    } else {
      Utils.errorMsg(
        "ErroMsgSession",
        "zapphub-session"
      );
    }
  });
}

async function resetSession(device_id, id_loading) {
  $("#" + id_loading).show();
  var request = {
    url:
      "https://api.zapphub.com/v1/devices/" +
      device_id +
      "/reboot?wait=true&force=true&sync=true",
    params: {},
    headers: {
      Token: Const.config.token,
    },
  };
  await ZOHO.CRM.HTTP.post(request).then(async function (data) {
    console.log(data);
  });
  $("#" + id_loading).hide();
  /*var qrcode = await createQRCode(device_id, Const.config.token, true);
    qrcode = JSON.parse(qrcode);
    if (
        qrcode.status == 503 &&
        qrcode.message.toLowerCase() ==
        "cannot authorize device. please, try again in a few seconds."
    ) {
        var lContinua = false;
        var qrcodeagain = "";
        var resp = "";

            setTimeout(async () => {
                qrcodeagain = await createQRCode(device_id, Const.config.token, false);
                qrcodeagain = JSON.parse(qrcodeagain);
                if (
                    (qrcodeagain.status != 503 && qrcodeagain.status != 429) ||
                    (qrcodeagain.data != "" &&
                        qrcodeagain.data != null &&
                        qrcodeagain.data != undefined &&
                        qrcodeagain.data.includes("image/svg"))
                ) {
                    resp = qrcodeagain;
                    lContinua = true;
                }
            }, 10000);
        
        if (resp != "" && resp != null) {

        }
        $target
                .closest("tr")
                .next()
                .find("td")
                .find("button")
                .remove(".reset-button");
        $("#" + id_loading).hide();
    } else {
        var $target = $("#" + id_loading).parent().parent().parent();
        $target
            .find("td")
            .find("button")
            .remove(".reset-button");
        $("#" + id_loading).hide();
    }*/
}
async function callCreateQRCode(device_id, token, force = false) {
  var response = await createQRCode(device_id, token, force);
  response = JSON.parse(response);

  if (
    response.data != "" &&
    response.data != null &&
    response.data != undefined &&
    response.data.includes("image/svg")
  ) {
    return response;
  } else if (response.status == 503 || response.status == 429) {
    console.log(response);
    setTimeout(function () {
      callCreateQRCode(device_id, token, force);
    }, 10000);
  }
}

async function createQRCode(device_id, token, force = false) {
  var param_dev = { encoding: "uri" };
  if (force) {
    param_dev = { encoding: "uri", force: true };
  }
  var request = {
    url: "https://api.zapphub.com/v1/devices/" + device_id + "/scan",
    params: param_dev,
    headers: {
      Token: token,
    },
  };
  var resp = "";
  await ZOHO.CRM.HTTP.get(request).then(async function (data) {
    resp = data;
  });

  return resp;
}

function getSession() {
  console.log("getSession function");
  verificaSession(Const.config.device_id, Const.config.token);
}

async function verificaSession(device_id, token) {
  console.log("verificaSession function");
  var request = {
    url: "https://api.zapphub.com/v1/devices/" + device_id + "/start?wait=true",
    params: {},
    headers: {
      Token: token,
    },
  };

  ZOHO.CRM.HTTP.post(request).then(async function (data) {
    var resp = JSON.parse(data);

    if (
      resp.status == "400" &&
      resp.message.toLowerCase().includes("deviceid")
    ) {
      Utils.errorMsg("ErroMsg", "msg-error-number-device");
    } else if (
      resp.status == "403" &&
      resp.message.toLowerCase().includes("api token")
    ) {
      Utils.errorMsg("ErroMsg", "msg-error-token");
    } else if (resp.status == "401") {
      Utils.errorMsg("ErroMsg", "msg-error-token");
    } else if (resp.status == "404") {
      Utils.errorMsg("ErroMsg", "msg-error-device");
    } else if (data.status == "503") {
      Utils.errorMsg("ErroMsg", "msg-error-server-unavailable");
    } else if (resp.session.status.toLowerCase() != "online") {
      Utils.errorMsg("ErroMsg", "msg-error-qrcode");
      showtab("tab3", "#configuracaoTab");
    } else {
      await createQRCode(device_id, token);
      /*var func_name = "whatsapphubforzohocrm__registerwebhook";
                      var req_data = {};
                      ZOHO.CRM.FUNCTIONS.execute(func_name, req_data);*/
      var request = {
        url: "https://api.zapphub.com/v1/webhooks",
        params: {},
        headers: {
          Token: token,
          "Content-Type": "application/json",
        },
      };
      ZOHO.CRM.API.getOrgVariable(Const.apinames.apiwebhook).then(function (
        data
      ) {
        var urlwebhook = JSON.parse(data.Success.Content).zapphub;

        ZOHO.CRM.HTTP.get(request).then(async function (data) {
          var lContinua = true;
          data = JSON.parse(data);
          if (data.length > 0) {
            data.forEach((webhk) => {
              if (webhk.name == "zoho-webhook") {
                //PATCH
                lContinua = false;
                var request = {
                  url: "https://api.zapphub.com/v1/webhooks/" + webhk.id,
                  params: {},
                  body:
                    '{"name":"zoho-webhook","url":"' +
                    urlwebhook +
                    "&token=" +
                    token +
                    '", "events": ' + ["message:in:new","message:out:new"] + '}',
                  headers: {
                    Token: token,
                    "Content-Type": "application/json",
                  },
                };

                ZOHO.CRM.HTTP.patch(request);
              }
            });
          }
          if (lContinua) {
            //POST
            var request = {
              url: "https://api.zapphub.com/v1/webhooks",
              params: {},
              body:
                '{"name":"zoho-webhook","url":"' +
                urlwebhook +
                "&token=" +
                token +
                '", "events":' + ["message:in:new","message:out:new"] + '}',
              headers: {
                Token: token,
                "Content-Type": "application/json",
              },
            };

            ZOHO.CRM.HTTP.post(request);
          }
        });

        showtab("tab4", "#comportamentoTab");
        $("#resetSessionId").show();
        $("#startSessionId").hide();
        $("#img_qr").hide();
        $("#resetQrcodeId").hide();
        $("#comportamentoTab").removeAttr("disabled");
      });
    }
  });

  /*var func_name = "whatsapphubforzohocrm__startsession";
      var req_data = {
          "arguments": JSON.stringify({
              "device_id": device_id,
              "token": token
          })
      };
      ZOHO.CRM.FUNCTIONS.execute(func_name, req_data).then(async function(data) {
          var resp = JSON.parse(data.details.output);
  
          if (resp.status == "400" && resp.message.toLowerCase().includes("deviceid")) {
              Utils.errorMsg("ErroMsg", "msg-error-number-device");
          } else if (resp.status == "403" && resp.message.toLowerCase().includes("api token")) {
              Utils.errorMsg("ErroMsg", "msg-error-token");
          } else if (resp.session.status.toLowerCase() != "online") {
              Utils.errorMsg("ErroMsg", "msg-error-qrcode");
              showtab("tab3", "#configuracaoTab");
  
          } else {
              await createQRCode(device_id, token);
              var func_name = "whatsapphubforzohocrm__registerwebhook";
              var req_data = {};
              ZOHO.CRM.FUNCTIONS.execute(func_name, req_data);
              showtab("tab4", "#comportamentoTab");
              $("#resetSessionId").show();
              $("#startSessionId").hide();
              $("#img_qr").hide();
              $("#resetQrcodeId").hide();
              document.getElementById("comportamentoTab").removeAttribute("disabled");
          }
      });*/
}

async function showInput2() {
  $("#saveNcancel3").show();
  document.getElementById("btnfieldok").removeAttribute("disabled");
  document.getElementById("btnfieldcanc").removeAttribute("disabled");
  document.getElementById("myonoffswitch").removeAttribute("disabled");
  $("#btnfieldedit").hide();

  var fldSel =
    '<select id="modifiedLeads" class="newSelect" style="width:200px" required="true" >';

  for (id in Const.leadfieldnames) {
    var atual = Const.leadfieldnames[id];
    if (atual["name"] == Const.phonelead.name) {
      fldSel =
        fldSel +
        '<option value="' +
        atual["name"] +
        '" selected>' +
        atual["desc"] +
        "</option>";
    } else {
      fldSel =
        fldSel +
        '<option value="' +
        atual["name"] +
        '">' +
        atual["desc"] +
        "</option>";
    }
  }
  fldSel = fldSel + "</select>";

  $("#leadDefault").html(fldSel);

  if (Const.enablemodule.leads) {
    ZOHO.CRM.META.getLayouts({ Entity: "Leads" }).then(function (data) {
      var respLayout = data.layouts;
      if (Const.requiredfield.layout.desc != "" && Const.requiredfield.layout.desc != null && Const.requiredfield.layout.desc != undefined) {
        $("#mapping_fields_div").show();
      }
      var selectLayout =
        '<select id="idSelectLayout" onchange="layoutChange()" class="newSelect" style="width:200px;"><option value="none">-- none --</option>';
      respLayout.forEach((layout) => {
        if (
          layout.name.toLowerCase() ==
          Const.requiredfield.layout.desc.toLowerCase()
        ) {
          selectLayout =
            selectLayout +
            '<option value="' +
            layout.id +
            '" selected>' +
            layout.name +
            "</option>";
        } else {
          selectLayout =
            selectLayout +
            '<option value="' +
            layout.id +
            '">' +
            layout.name +
            "</option>";
        }
      });
      selectLayout = selectLayout + "</select>";
      $("#layoutField").html(selectLayout);
      $("#idSelectLayout").multipleSelect({
        filter: true,
      });
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

  var fldSel =
    '<select id="modifiedSources" style="width: 200px;" class="newSelect" required="true">';

  for (id in Const.leadsourcenames) {
    var atual = Const.leadsourcenames[id];
    if (atual["name"] == Const.sourcelead.name) {
      fldSel =
        fldSel +
        '<option value="' +
        atual["name"] +
        '" selected >' +
        atual["name"] +
        "</option>";
    } else {
      fldSel =
        fldSel +
        '<option value="' +
        atual["name"] +
        '" >' +
        atual["name"] +
        "</option>";
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

  var fldSel =
    '<select id="modifiedContacts" class="newSelect" style="width:200px" required="true" >';

  for (id in Const.contactfieldnames) {
    var atual = Const.contactfieldnames[id];
    if (atual["name"] == Const.phonecontact.name) {
      fldSel =
        fldSel +
        '<option value="' +
        atual["name"] +
        '" selected>' +
        atual["desc"] +
        "</option>";
    } else {
      fldSel =
        fldSel +
        '<option value="' +
        atual["name"] +
        '">' +
        atual["desc"] +
        "</option>";
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

  var fldSel =
    '<select id="modifiedAccounts" class="newSelect" style="width:200px" required="true" >';

  for (id in Const.accountfieldnames) {
    var atual = Const.accountfieldnames[id];
    if (atual["name"] == Const.phoneaccount.name) {
      fldSel =
        fldSel +
        '<option value="' +
        atual["name"] +
        '" selected>' +
        atual["desc"] +
        "</option>";
    } else {
      fldSel =
        fldSel +
        '<option value="' +
        atual["name"] +
        '">' +
        atual["desc"] +
        "</option>";
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
    var fldSel =
      '<select id="modifiedDeals" class="newSelect" style="width:200px" required="true" >';

    if (Const.dealfieldnames.length > 1) {
      fldSel = fldSel + '<optgroup label="Deals">';
      //}
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
              atual["name"] +
              '" selected data-group="' +
              atual["module"] +
              '">' +
              atual["desc"] +
              "</option>";
          } else {
            fldSel =
              fldSel +
              '<option value="' +
              atual["name"] +
              '" data-group="' +
              atual["module"] +
              '">' +
              atual["desc"] +
              "</option>";
          }
        }
      }
      //if (!Const.dealfieldnames[0].name.toLowerCase().includes("None")) {
      fldSel = fldSel + "</optgroup>";
    }
    if (Const.enablemodule.contacts) {
      if (Const.contactfieldnames.length > 1) {
        fldSel = fldSel + '<optgroup label="Contacts">';
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
                atual["name"] +
                '" selected data-group="' +
                atual["module"] +
                '">' +
                atual["desc"] +
                "</option>";
            } else {
              fldSel =
                fldSel +
                '<option value="' +
                atual["name"] +
                '" data-group="' +
                atual["module"] +
                '">' +
                atual["desc"] +
                "</option>";
            }
          }
        }
        fldSel = fldSel + "</optgroup>";
      }
    }
    if (Const.enablemodule.accounts) {
      if (Const.accountfieldnames.length > 1) {
        fldSel = fldSel + '<optgroup label="Accounts">';
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
                atual["name"] +
                '" selected data-group="' +
                atual["module"] +
                '">' +
                atual["desc"] +
                "</option>";
            } else {
              fldSel =
                fldSel +
                '<option value="' +
                atual["name"] +
                '" data-group="' +
                atual["module"] +
                '">' +
                atual["desc"] +
                "</option>";
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
    $("#tab4 select").multipleSelect({
      filter: true,
    });
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

  if (
    (leadFld == "-None-" ||
      leadFld == "" ||
      leadFld == null ||
      leadFld == "undefined") &&
    Const.enablemodule.leads
  ) {
    if (Const.leadfieldnames.length > 1) {
      $("#leadEmpty").show();
      lsegue = false;
    }
  }
  if (buttonStatus && Const.enablemodule.leads) {
    if (
      sourceFld == "-None-" ||
      sourceFld == "" ||
      sourceFld == null ||
      sourceFld == "undefined"
    ) {
      $("#leadSourceEmpty").show();
      lsegue = false;
    }
    if (await checkEmptyFieldsReq()) {
      lsegue = false;
    }
  }

  if (
    (contactFld == "-None-" ||
      contactFld == "" ||
      contactFld == null ||
      contactFld == "undefined") &&
    Const.enablemodule.contacts
  ) {
    if (Const.contactfieldnames.length > 1) {
      $("#contactEmpty").show();
      lsegue = false;
    }
  }

  if (
    (accountFld == "-None-" ||
      accountFld == "" ||
      accountFld == null ||
      accountFld == "undefined") &&
    Const.enablemodule.accounts
  ) {
    if (Const.accountfieldnames.length > 1) {
      $("#accountEmpty").show();
      lsegue = false;
    }
  }

  if (
    (dealFld == "-None-" ||
      dealFld == "" ||
      dealFld == null ||
      dealFld == "undefined") &&
    Const.enablemodule.deals
  ) {
    if (Const.dealfieldnames.length > 1) {
      $("#dealEmpty").show();
      lsegue = false;
    }
  }

  if (lsegue) {
    //foundButton = document.getElementById("myonoffswitch");
    //buttonStatus = foundButton.checked;
    strButtonStatus = buttonStatus.toString();
    foundLead = JSON.stringify(
      Const.leadfieldnames.find((elem) => elem.name == leadFld)
    );
    foundSource = JSON.stringify(
      Const.leadsourcenames.find((elem) => elem.name == sourceFld)
    );
    foundContact = JSON.stringify(
      Const.contactfieldnames.find((elem) => elem.name == contactFld)
    );
    foundAccount = JSON.stringify(
      Const.accountfieldnames.find((elem) => elem.name == accountFld)
    );
    foundDeal = Const.contactfieldnames.find(
      (elem) => elem.name == dealFld && elem.module == groupFld
    );
    if (foundDeal == undefined) {
      foundDeal = Const.accountfieldnames.find(
        (elem) => elem.name == dealFld && elem.module == groupFld
      );
    }
    if (foundDeal == undefined) {
      foundDeal = Const.dealfieldnames.find(
        (elem) => elem.name == dealFld && elem.module == groupFld
      );
    }
    foundDeal = JSON.stringify(foundDeal);

    parameterMap = {
      apiname: Const.apinames.apiphonelead,
      value: DOMPurify.sanitize(foundLead, Const.configPurify),
    };
    ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap)
      .then(function (data) {
        parameterMap = {
          apiname: Const.apinames.apiphoneaccount,
          value: DOMPurify.sanitize(foundAccount, Const.configPurify),
        };
        return ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap);
      })
      .then(function (data) {
        parameterMap = {
          apiname: Const.apinames.apileadsource,
          value: DOMPurify.sanitize(foundSource, Const.configPurify),
        };
        return ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap);
      })
      .then(function (data) {
        parameterMap = {
          apiname: Const.apinames.apiphonecontact,
          value: DOMPurify.sanitize(foundContact, Const.configPurify),
        };
        return ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap);
      })
      .then(function (data) {
        parameterMap = {
          apiname: Const.apinames.apiphonedeal,
          value: DOMPurify.sanitize(foundDeal, Const.configPurify),
        };
        return ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap);
      })
      .then(function (data) {
        parameterMap = {
          apiname: Const.apinames.apirequiredfield,
          value: DOMPurify.sanitize(
            JSON.stringify(Const.requiredfield),
            Const.configPurify
          ),
        };
        return ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap);
      })
      .then(function (data) {
        parameterMap = {
          apiname: Const.apinames.apicomportamento,
          value: DOMPurify.sanitize(strButtonStatus, Const.configPurify),
        };
        return ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap);
      })
      .then(function (data) {
        Utils.successMsg("SuccessMsg", "msg-success-behavior", true);
      });
  } else {
    return lsegue;
  }
}

async function verificaCampos() {
  return await ZOHO.CRM.API.getOrgVariable(Const.apinames.apileadsource)
    .then(async function (data) {
      Const.sourcelead = JSON.parse(data.Success.Content);

      return await ZOHO.CRM.API.getOrgVariable(Const.apinames.apicomportamento).then(
        async function (data) {
          var statusComportamento = data.Success.Content;
          if (statusComportamento == "true") {
            document.getElementById("myonoffswitch").checked = true;
            $("#leadSourceDiv").show();
          } else {
            document.getElementById("myonoffswitch").checked = false;
            $("#leadSourceDiv").hide();
          }

          return await ZOHO.CRM.API.getOrgVariable(Const.apinames.apiphonelead).then(
            async function (data) {
              Const.phonelead = JSON.parse(data.Success.Content);

              Const.leadfieldnames.push({
                desc: "-None-",
                name: "-None-",
                type: "text",
                module: "Leads",
              });
              if (Const.enablemodule.leads) {
                await ZOHO.CRM.META.getLayouts({
                  Entity: "Leads",
                }).then(async function (data) {
                  await ZOHO.CRM.API.getOrgVariable(
                    Const.apinames.apirequiredfield
                  ).then(function (layout) {
                    Const.layoutName = JSON.parse(
                      layout.Success.Content
                    ).layout.desc;
                    if (
                      Const.layoutName == null ||
                      Const.layoutName == "" ||
                      Const.layoutName == undefined
                    ) {
                      Const.layoutName = data.layouts[0].name;
                      data.layouts[0].sections.forEach((section) => {
                        var allFields = section.fields;
                        for (x in allFields) {
                          if (allFields[x].api_name == "Lead_Source") {
                            //console.log(allFields[x].pick_list_values);

                            leadSourceList = allFields[x].pick_list_values;
                            for (y in leadSourceList) {
                              Const.leadsourcenames.push({
                                name: leadSourceList[y].display_value,
                                desc: leadSourceList[y].display_value,
                              });
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
                              module: "Leads",
                            });

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
                    } else {
                      data.layouts.forEach((leadLayout) => {
                        if (Const.layoutName == leadLayout.name) {
                          leadLayout.sections.forEach((section) => {
                            var allFields = section.fields;
                            for (x in allFields) {
                              if (allFields[x].api_name == "Lead_Source") {
                                //console.log(allFields[x].pick_list_values);

                                leadSourceList = allFields[x].pick_list_values;
                                for (y in leadSourceList) {
                                  Const.leadsourcenames.push({
                                    name: leadSourceList[y].display_value,
                                    desc: leadSourceList[y].display_value,
                                  });
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
                                  module: "Leads",
                                });

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
                      });
                    }
                  });
                });
              }

              return await ZOHO.CRM.API.getOrgVariable(
                Const.apinames.apiphonecontact
              ).then(async function (data) {
                Const.phonecontact = JSON.parse(data.Success.Content);

                Const.contactfieldnames.push({
                  desc: "-None-",
                  name: "-None-",
                  type: "text",
                  module: "Contacts",
                });

                if (Const.enablemodule.contacts) {
                  await ZOHO.CRM.META.getFields({
                    Entity: "Contacts",
                  }).then(function (data) {
                    var resp = data;
                    for (i in resp.fields) {
                      var field = resp.fields[i];
                      if (field.data_type == "phone") {
                        Const.contactfieldnames.push({
                          desc: resp.fields[i].field_label,
                          name: resp.fields[i].api_name,
                          type: resp.fields[i].data_type,
                          module: "Contacts",
                        });

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

                return await ZOHO.CRM.API.getOrgVariable(
                  Const.apinames.apiphoneaccount
                ).then(async function (data) {
                  Const.phoneaccount = JSON.parse(data.Success.Content);

                  Const.accountfieldnames.push({
                    desc: "-None-",
                    name: "-None-",
                    type: "text",
                    module: "Accounts",
                  });
                  if (Const.enablemodule.accounts) {
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

                  return await ZOHO.CRM.API.getOrgVariable(
                    Const.apinames.apiphonedeal
                  ).then(async function (data) {
                    Const.phonedeal = JSON.parse(data.Success.Content);

                    Const.dealfieldnames.push({
                      desc: "-None-",
                      name: "-None-",
                      type: "text",
                      module: "Deals",
                    });
                    if (Const.enablemodule.deals) {
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
                  });
                });
              });
            }
          );
        }
      );
    })
    .then(async function () {
      if (Const.enablemodule.leads) {
        await verificaRequired();
      }

      if (
        Const.enablemodule.leads ||
        Const.enablemodule.contacts ||
        Const.enablemodule.accounts ||
        Const.enablemodule.deals
      ) {
        $("#leadSourceField").text(Const.sourcelead.desc);
        $("#leadDefault").text(Const.phonelead.desc);
        $("#contactDefault").text(Const.phonecontact.desc);
        $("#accountDefault").text(Const.phoneaccount.desc);
        $("#dealDefault").text(Const.phonedeal.desc);

        $("#edit2").show();
        $("#saveNcancel2").hide();
      } else {
        $("#saveNcancel2").show();

        var fldSel =
          '<select id="modifiedLeads" class="newSelect" required="true">';

        for (id in Const.leadfieldnames) {
          var atual = Const.leadfieldnames[id];
          if (atual["name"] == Const.phonelead.name) {
            fldSel =
              fldSel +
              '<option value="' +
              atual["name"] +
              '" selected >' +
              atual["desc"] +
              "</option>";
          } else {
            fldSel =
              fldSel +
              '<option value="' +
              atual["name"] +
              '" >' +
              atual["desc"] +
              "</option>";
          }
        }
        fldSel = fldSel + "</select>";

        $("#leadDefault").html(fldSel);

        var fldSel =
          '<select id="modifiedSources" style="width: 200px;" class="newSelect" required="true">';

        for (id in Const.leadsourcenames) {
          var atual = Const.leadsourcenames[id];
          if (atual["name"] == Const.sourcelead.name) {
            fldSel =
              fldSel +
              '<option value="' +
              atual["name"] +
              '" selected >' +
              atual["name"] +
              "</option>";
          } else {
            fldSel =
              fldSel +
              '<option value="' +
              atual["name"] +
              '" >' +
              atual["name"] +
              "</option>";
          }
        }
        fldSel = fldSel + "</select>";

        $("#leadSourceField").html(fldSel);
        if (Const.enablemodule.contacts) {
          var fldSel =
            '<select id="modifiedContacts" class="newSelect" required="true" >';

          for (id in Const.contactfieldnames) {
            var atual = Const.contactfieldnames[id];
            if (atual["name"] == Const.phonecontact.name) {
              fldSel =
                fldSel +
                '<option value="' +
                atual["name"] +
                '" selected>' +
                atual["desc"] +
                "</option>";
            } else {
              fldSel =
                fldSel +
                '<option value="' +
                atual["name"] +
                '">' +
                atual["desc"] +
                "</option>";
            }
          }
          fldSel = fldSel + "</select>";

          $("#contactDefault").html(fldSel);
        }
        if (Const.enablemodule.accounts) {
          var fldSel =
            '<select id="modifiedAccounts" class="newSelect" required="true" >';

          for (id in Const.accountfieldnames) {
            var atual = Const.accountfieldnames[id];
            if (atual["name"] == Const.phoneaccount.name) {
              fldSel =
                fldSel +
                '<option value="' +
                atual["name"] +
                '" selected>' +
                atual["desc"] +
                "</option>";
            } else {
              fldSel =
                fldSel +
                '<option value="' +
                atual["name"] +
                '">' +
                atual["desc"] +
                "</option>";
            }
          }
          fldSel = fldSel + "</select>";

          $("#accountDefault").html(fldSel);
        }
        var fldSel =
          '<select id="modifiedDeals" class="newSelect" required="true" >';

        if (Const.dealfieldnames.length > 1) {
          fldSel = fldSel + '<optgroup label="Deals">';

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
                  atual["name"] +
                  '" selected data-group="' +
                  atual["module"] +
                  '">' +
                  atual["desc"] +
                  "</option>";
              } else {
                fldSel =
                  fldSel +
                  '<option value="' +
                  atual["name"] +
                  '" data-group="' +
                  atual["module"] +
                  '">' +
                  atual["desc"] +
                  "</option>";
              }
            }
          }
          //if (!Const.dealfieldnames[0].name.toLowerCase().includes("None")) {
          fldSel = fldSel + "</optgroup>";
        }
        if (Const.enablemodule.contacts) {
          if (Const.contactfieldnames.length > 1) {
            fldSel = fldSel + '<optgroup label="Contacts">';
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
                    atual["name"] +
                    '" selected data-group="' +
                    atual["module"] +
                    '">' +
                    atual["desc"] +
                    "</option>";
                } else {
                  fldSel =
                    fldSel +
                    '<option value="' +
                    atual["name"] +
                    '" data-group="' +
                    atual["module"] +
                    '">' +
                    atual["desc"] +
                    "</option>";
                }
              }
            }
            fldSel = fldSel + "</optgroup>";
          }
        }
        if (Const.enablemodule.accounts) {
          if (Const.accountfieldnames.length > 1) {
            fldSel = fldSel + '<optgroup label="Accounts">';
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
                    atual["name"] +
                    '" selected data-group="' +
                    atual["module"] +
                    '">' +
                    atual["desc"] +
                    "</option>";
                } else {
                  fldSel =
                    fldSel +
                    '<option value="' +
                    atual["name"] +
                    '" data-group="' +
                    atual["module"] +
                    '">' +
                    atual["desc"] +
                    "</option>";
                }
              }
            }
            fldSel = fldSel + "</optgroup>";
          }
        }

        fldSel = fldSel + "</select>";

        $("#dealDefault").html(fldSel);
      }
    });
}

Utils = {};

//Utils.successMsg("ErroMsg","msg-success-setup",Const.deflang);
Utils.successMsg = function (id, message, reload = false) {
  $("#" + id + " .sucesText").text(Const.desclanguage[message]);
  $("#" + id).slideDown(function () {
    $("#" + id)
      .delay(4000)
      .slideUp(function () {
        if (reload) {
          reloadWebtab();
        }
      });
  });
};

//Utils.errorMsg("ErroMsg","msg-error-setup",Const.deflang);
Utils.errorMsg = function (id, message, reload = false) {
  if (
    Const.desclanguage[message] != undefined &&
    Const.desclanguage[message] != null &&
    Const.desclanguage[message] != ""
  ) {
    $("#" + id + " .erroText").text(Const.desclanguage[message]);
  } else {
    $("#" + id + " .erroText").text(message);
  }
  $("#" + id).slideDown(function () {
    $("#" + id)
      .delay(3000)
      .slideUp(function () {
        $("#newLoad").hide();
        if (reload) {
          reloadWebtab();
        }
      });
  });
};

Utils.errorMsgMore = async function (id, message, reload = false) {
  if (
    Const.desclanguage[message] != undefined &&
    Const.desclanguage[message] != null &&
    Const.desclanguage[message] != ""
  ) {
    $("#" + id + " .erroText").text(Const.desclanguage[message]);
  } else {
    $("#" + id + " .erroText").text(message);
  }
  $("#" + id).slideDown(function () {
    $("#" + id)
      .delay(30000)
      .slideUp(function () {
        $("#newLoad").hide();
        if (reload) {
          reloadWebtab();
        }
      });
  });
};

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
};

Utils.loadCountries = async function () {
  $.getJSON("../countries/countries.json", function (data) {
    var selectCountry =
      '<select id="countrySelect" onchange="selectedCountry()" class="newSelect" style="width:200px;" required="true">';
    for (var i in data) {
      if (Const.infocountry != null && Const.infocountry != "") {
        if (
          Const.infocountry.code.toUpperCase() == data[i].code.toUpperCase()
        ) {
          selectCountry =
            selectCountry +
            '<option value="' +
            data[i].code +
            '" selected>' +
            data[i].name +
            "</option>";
        } else {
          selectCountry =
            selectCountry +
            '<option value="' +
            data[i].code +
            '">' +
            data[i].name +
            "</option>";
        }
      } else {
        selectCountry =
          selectCountry +
          '<option value="' +
          data[i].code +
          '">' +
          data[i].name +
          "</option>";
      }
    }

    selectCountry = selectCountry + "</select>";
    $("#countryDiv").html(selectCountry);
    $("#countrySelect").multipleSelect({
      filter: true,
    });
  });
};

function selectedCountry() {
  if ($("#countrySelect").val().toUpperCase() == "BR") {
    $("#ZapboxR").show();
    $("#idLabelUtalk").show();
    $("#textNotUtalk").hide();
  } else {
    $("#ZapboxR").hide();
    $("#idLabelUtalk").hide();
    $("#textNotUtalk").show();
    $("#NenhumaR").prop("checked", true);
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
      name: nomeT,
      email: emailT,
      type: selT,
      subject: subT,
      desc: descT,
      productId: "53339000013847098",
      channel: "Extension",
    };
    var request = {
      url: "https://www.zohoapis.com/crm/v2/functions/createsupportticket/actions/execute?auth_type=apikey&zapikey=1003.21b0cabbad36496839c70625300a756a.c6a56cbe6cdb0e2aba1fb1d47070c23e",
      headers: {
        ContentType: "application/json; charset=utf-8",
      },
      params: {
        webhook: JSON.stringify(req_data),
      },
    };
    ZOHO.CRM.HTTP.get(request).then(async function (data) {
      //console.log(data);
      if (data.toString().contains("success")) {
        $("#btnSendTicket").prop("disabled", true);
        Utils.successMsg("SuccessMsg", "msg-success-ticket");
        setTimeout(function () {
          location.reload();
        }, 3000);
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
    if (atual.api.toLowerCase() != "lead_source") {
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
  Const.requiredfield.layout.desc = $("#idSelectLayout")
    .find("option:selected")
    .text();
  Const.requiredfield.layout.id = $("#idSelectLayout")
    .find("option:selected")
    .val();
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
      Const.requiredfield.layout.desc = $("#idSelectLayout")
        .find("option:selected")
        .text();
      Const.requiredfield.layout.id = $("#idSelectLayout")
        .find("option:selected")
        .val();
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
    'Empty">' +
    Const.desclanguage["fld-req-message"] +
    "</div>";

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
      value: DOMPurify.sanitize(
        structure.replace("false", "true"),
        Const.configPurify
      ),
    };
    ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap2);
    var parameterMap = {
      apiname: Const.apinames.apirequiredfield,
      value: DOMPurify.sanitize(
        JSON.stringify(Const.requiredfield),
        Const.configPurify
      ),
    };
    ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", parameterMap).then(function (data) {
      location.reload();
    });
  }
}

async function verificaRequired() {
  ZOHO.CRM.META.getLayouts({ Entity: "Leads" }).then(async function (data) {
    data.layouts.forEach((layout) => {
      if (layout.name == Const.layoutName) {
        layout.sections.forEach((resp) => {
          resp.fields.forEach((field) => {
            if (
              field.required &&
              field.data_type != "ownerlookup" &&
              field.data_type != "lookup" &&
              field.data_type != "userlookup"
            ) {
              //remover voltar
              if (
                field.api_name.toUpperCase() != "EMAIL" &&
                field.api_name.toUpperCase() != "FIRST_NAME" &&
                field.api_name.toUpperCase() != "LAST_NAME" &&
                field.api_name.toUpperCase() != "COMPANY"
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
          });
        });

        ZOHO.CRM.API.getOrgVariable(Const.apinames.apirequiredfield).then(
          async function (data) {
            if (
              data.Success.Content != "" &&
              data.Success.Content != null &&
              data.Success.Content != undefined
            ) {
              Const.requiredfield = JSON.parse(data.Success.Content);

              /*if (
                Const.requiredfield.required != null &&
                Const.requiredfield.required != "" &&
                Const.requiredfield.required != undefined
              ) {
                //Const.requiredfield.required = JSON.parse(Const.requiredfield.required);
              }*/
              if (
                Const.requiredfield.layout != null &&
                Const.requiredfield.layout != "" &&
                Const.requiredfield.layout != undefined
              ) {
                if (
                  Const.requiredfield.layout.desc == null ||
                  Const.requiredfield.layout.desc == "" ||
                  Const.requiredfield.layout.desc == undefined ||
                  Const.requiredfield.layout.id == null ||
                  Const.requiredfield.layout.id == "" ||
                  Const.requiredfield.layout.id == undefined
                ) {
                  Const.requiredfield.layout = { desc: "", id: "" };
                }
              }

              if (Const.enablemodule.leads) {
                $("#layoutField").text(Const.requiredfield.layout.desc);
                if (Const.requiredfield.layout.desc != "" && Const.requiredfield.layout.desc != null && Const.requiredfield.layout.desc != undefined) {
                  $("#mapping_fields_div").show();
                }
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
          }
        );
      }
    });
  });
}

async function setWebhook() {
  const button = document.querySelector('#set-webhook');
  const btnText = button.children[0];
  const btnSpinner = button.children[1];

  btnText.textContent = "Aplicando...";
  btnSpinner.classList.remove('d-none');
  button.setAttribute('disabled', true);

  let token = null;
  let urlList = null;
  let urlwebhook = null;

  await ZOHO.CRM.API.getOrgVariable(Const.apinames.apiconfiguracao).then((data) => {
    const configuracao = JSON.parse(data.Success.Content);
    token = configuracao.token;
  });

  await ZOHO.CRM.API.getOrgVariable(Const.apinames.apiwebhook).then((data) => {
    urlList = JSON.parse(data.Success.Content);
    console.log(urlList);
  });

  if ("zapphubv2" in urlList) {
    urlwebhook = urlList.zapphubv2;
  } else {
    urlwebhook = urlList.zapphub;
  }

  let request = {
    url: "https://api.zapphub.com/v1/webhooks",
    body: {
      "name": "zoho-webhook",
      "url": `${urlwebhook}&token=${token}`,
      "events": ["message:in:new","message:out:new"]
    },
    headers: {
      Token: token,
      "Content-Type": "application/json",
    }
  }
  console.log(request);
  await ZOHO.CRM.HTTP.post(request).then((data) => {
    const webhookResponse = JSON.parse(data);

    if (webhookResponse.status !== "active") {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: webhookResponse.message,
        customClass: {
          confirmButton: 'btn btn-secondary',
        },
        buttonsStyling: false,
        footer: `<a target="_blank" href="https://app.zapphub.com/developers/webhooks">${Const.desclanguage["msg-webhooks"]}</a>`
      })
    } else {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: Const.desclanguage["msg-webhook-success"],
        showConfirmButton: true,
        customClass: {
          confirmButton: 'btn btn-secondary',
        },
        buttonsStyling: false
      });
    }
  });

  btnText.textContent = "Aplicar Webhook";
  btnSpinner.classList.add('d-none');
  button.removeAttribute('disabled');
}

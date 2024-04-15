Const = {
    entity_id: null,
    entity_name: null,
    entity: null,
    config_api: "whatsapphubforzohocrm__configuracao",
    aplicativo: null,
    devices: [],
    current_email: "",
    fldSel: "",
    languages: ["en_US", "pt_BR", "es_ES"],
    deflang: "en_US",
    desclanguage: {},
    token: null
}

ZOHO.embeddedApp.on("PageLoad", async function (data) {
    await Utils.RenderTemplate(Const.deflang);
    Const.entity = data.Entity;
    Const.entity_name = data.Entity.replace("s", "");
    Const.entity_id = data.EntityId;

    await ZOHO.CRM.API.searchRecord({ Entity: "whatsapphubforzohocrm__WhatsApp_Messages", Type: "criteria", Query: "(whatsapphubforzohocrm__" + Const.entity_name + ":equals:" + Const.entity_id + ")" })
        .then(async function (messages_data) {
            await Utils.RenderTemplate(Const.deflang);
            var sortedAsc = messages_data.data?.sort(function (a, b) {
                return new Date(b.whatsapphubforzohocrm__Message_Time) - new Date(a.whatsapphubforzohocrm__Message_Time);
            });
            var message_structure = "";
            date_list = [];

            await ZOHO.CRM.CONFIG.getCurrentUser().then(async function (data) {
                Const.current_email = data.users[0].email;

                await ZOHO.CRM.API.getUser({ ID: data.users[0].id })
                    .then(async function (data) {

                        if (Const.languages.includes(data.users[0].language)) {
                            Const.deflang = data.users[0].language;
                            await Utils.RenderTemplate(Const.deflang);
                        }
                        //$("#allPage").show();
                    })
            });

            await ZOHO.CRM.API.getOrgVariable(Const.config_api).then(async (data) => {
                let mapa = data.Success.Content;
                mapa = JSON.parse(mapa);
                Const.aplicativo = mapa.aplicativo;
                Const.token = mapa.token;

                if (mapa.hasOwnProperty("devices")) {
                    const request = {
                        url: "https://api.zapphub.com/v1/devices",
                        params: {
                            size: 10,
                            page: 0
                        },
                        headers: {
                            Token: mapa.token,
                        },
                    };

                    await ZOHO.CRM.HTTP.get(request).then(async function (data) {
                        data = JSON.parse(data);
                        await Utils.RenderTemplate(Const.deflang);

                        for await (const device of mapa.devices) {
                            if (device.status) {
                                for (const devices of data) {
                                    let status_device = devices.session.status;
                                    let device_id_device = devices.id;

                                    if (device_id_device == device.device_id) {
                                        if (status_device == "online") {
                                            const agent_request = {
                                                url: "https://api.zapphub.com/v1/devices/" + device.device_id + "/team",
                                                headers: {
                                                    Token: mapa.token,
                                                }
                                            }

                                            await ZOHO.CRM.HTTP.get(agent_request).then(function (agent_data) {
                                                JSON.parse(agent_data).forEach((agent) => {
                                                    if (Const.current_email == "projeto+show@otentecnologia.com.br") {
                                                        Const.current_email = "gustavo.couto@otentecnologia.com.br"
                                                    }
                                                    if (Const.current_email == agent.email || Const.current_email == "wellington.rufino@otentecnologia.com.br") {
                                                        Const.fldSel =
                                                            Const.fldSel +
                                                            '<option value="' +
                                                            device.device_id +
                                                            '">' +
                                                            device.device_name +
                                                            " (" +
                                                            device.phone +
                                                            ")</option>";

                                                        Const.devices.push(device);
                                                    }
                                                })
                                            })
                                        }
                                    }
                                }
                            }
                        }

                        if (!Const.fldSel == "") {
                            if (Const.aplicativo === "zapphub") {
                                await ZOHO.CRM.UI.Resize({ height: "400", width: "1000" });
                                const messages = await syncMessagesChatView();

                                for (var i = messages[0].length - 1; i >= 0; i--) {
                                    //var message = sortedAsc[i].whatsapphubforzohocrm__Message;
                                    //var message_time = sortedAsc[i].whatsapphubforzohocrm__Message_Time;
                                    //var direction = sortedAsc[i].whatsapphubforzohocrm__Direction;
                                    //var message_date = sortedAsc[i].whatsapphubforzohocrm__Message_Date;

                                    var message = messages[0][i].body;
                                    var message_time = messages[0][i].date;
                                    var direction = messages[0][i].flow;
                                    var message_date = messages[0][i].date.substring(0, 10);

                                    //message_date = message_date?.substring(8, 10) + "/" + message_date?.substring(5, 7) + "/" + message_date?.substring(0, 4);

                                    if (!date_list.includes(message_date)) {
                                        message_structure = message_structure + '<div class="media media-meta-day">' + message_date + '</div>';
                                        date_list.push(message_date);
                                    }

                                    if (direction == "Incoming" || direction == "inbound") {
                                        message_structure = message_structure + '<div class="media media-chat">';
                                        message_structure = message_structure + '<img class="avatar" src="https://img.icons8.com/bubbles/344/gender-neutral-user.png" alt="...">';
                                        message_structure = message_structure + '<div class="media-body">';
                                        message_structure = message_structure + '<p>';
                                        message_structure = message_structure + message;
                                        message_structure = message_structure + '</p>';
                                        message_structure = message_structure + '<p class="meta"><time>'
                                        message_structure = message_structure + message_time?.split("T")[1]?.substring(0, 5);
                                        message_structure = message_structure + '</time></p>';
                                        message_structure = message_structure + '</div></div>';
                                    } else if (direction == "Outgoing" || direction == "outbound") {
                                        message_structure = message_structure + '<div class="media media-chat media-chat-reverse">';
                                        message_structure = message_structure + '<div class="media-body">';
                                        message_structure = message_structure + '<p>'
                                        message_structure = message_structure + message;
                                        message_structure = message_structure + '</p>';
                                        message_structure = message_structure + '<p class="meta" style="color:#9b9b9b !important"><time>'
                                        message_structure = message_structure + message_time?.split("T")[1]?.substring(0, 5);
                                        message_structure = message_structure + '</time></p>';
                                        message_structure = message_structure + '</div></div>';
                                    }
                                }

                                $("#page-content").removeClass('d-none');
                                $("#load-spinner").addClass('d-none');
                                $("#message-body").html(message_structure);
                                let scroll_to_bottom = document.getElementById('chat-content');
                                scroll_to_bottom.scrollTop = scroll_to_bottom.scrollHeight;

                            } else if (Const.aplicativo === "utalk") {
                                ZOHO.CRM.UI.Resize({ height: "60", width: "1000" });
                                $("#page-content").addClass('d-none');
                                $("#not-content").removeClass('d-none');
                                $("#not-content").addClass('d-flex');
                                $("#msg-name").html('for UTalk');
                                $("#load-spinner").addClass('d-none');
                            } else {
                                ZOHO.CRM.UI.Resize({ height: "60", width: "1000" });
                                $("#page-content").addClass('d-none');
                                $("#not-content").removeClass('d-none');
                                $("#not-content").addClass('d-flex');
                                $("#msg-name").html(Const.desclanguage["msg-no-device"]);
                                $("#load-spinner").addClass('d-none');
                            }

                            $("#select_device").append(Const.fldSel);
                            $("#select_device").multipleSelect({
                                filter: true,
                                position: 'top',
                                animate: 'slide'
                            })
                            if ($("#select_device").length === 1) {
                                const first_value = $('#select_device option')[1].value;
                                $('#select_device').multipleSelect('check', first_value); 

                            }
                        } else {
                            ZOHO.CRM.UI.Resize({ height: "60", width: "1000" });
                            $("#page-content").addClass('d-none');
                            $("#not-content").removeClass('d-none');
                            $("#not-content").addClass('d-flex');
                            $("#msg-name").html(Const.desclanguage["msg-not-associated"]);
                            $("#load-spinner").addClass('d-none');
                        }
                    })
                }
            })
        })
});
ZOHO.embeddedApp.init();

async function sendMessage() {
    await Swal.fire({
        title: Const.desclanguage["msg-sending"],
        timerProgressBar: true,
        didOpen: async () => {
            Swal.showLoading();

            var device_id = $("#select_device").multipleSelect('getSelects')[0];
            const Toast = Swal.mixin({
                toast: true,
                position: 'center',
                showConfirmButton: false,
                timer: 5000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            if (!device_id.includes("none")) {
                var message = $(".publisher-input").val();
                if (!message == "") {
                    var structure = {
                        "id": Const.entity_id,
                        "module": Const.entity_name + "s",
                        "idtemplate": "",
                        "note": message,
                        "device_id": device_id
                    };

                    var func_name = "whatsapphubforzohocrm__sendmessages";
                    var req_data = structure;

                    await ZOHO.CRM.FUNCTIONS.execute(func_name, req_data)
                        .then(async function (req_message) {
                            Swal.close();
                            $(".publisher-input").val("");
                            $(".publisher-input").prop("disabled", "true");
                            $(".text-info").prop("disabled", "true");
                            // alert("Mensagem enviada com sucesso!");

                            await Toast.fire({
                                icon: 'success',
                                title: Const.desclanguage["msg-success"],
                            }).then(() => {
                                setTimeout(function () {
                                    location.reload();
                                }, 2000)
                            })
                            // setTimeout(function () {
                            //     location.reload();
                            // }, 2000)
                        })
                } else {
                    Swal.close();
                    Toast.fire({
                        icon: 'error',
                        title: Const.desclanguage["msg-no-message"]
                    })
                }
            } else {
                Swal.close();
                Toast.fire({
                    icon: 'error',
                    title: Const.desclanguage["msg-sel-device"]
                })
            }
        }
    })
}

Utils = {};

Utils.RenderTemplate = async function (lang) {
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
}

async function syncMessagesChatView() {
    const messages = [];
    await ZOHO.CRM.API.getRecord({ Entity: Const.entity, RecordID: Const.entity_id }).then(async (data) => {
        const crm = data.data[0];
        const chatId = crm.whatsapphubforzohocrm__wid;
        const apiModuleConfig = "whatsapphubforzohocrm__" + Const.entity.toLowerCase();

        if (!chatId) {
            let mapa = null;
            let otherChatId = "";
            await ZOHO.CRM.API.getOrgVariable(apiModuleConfig).then(async (data) => {
                mapa = data.Success.Content;
                mapa = JSON.parse(mapa);
            });

            if (crm[mapa.name]) {
                if (crm[mapa.name].startsWith("55")) {
                    otherChatId = crm[mapa.name] + "@c.us";
                    await searchMsg(otherChatId);
                } else if (crm[mapa.name].startsWith("+55")) {
                    otherChatId = crm[mapa.name].replace("+", "") + "@c.us";
                    await searchMsg(otherChatId);
                } else {
                    otherChatId = "55" + crm[mapa.name] + "@c.us";
                    await searchMsg(otherChatId);
                }
            } else {
                await resize(Const.desclanguage["msg-check-field"]);
            }
        } else {
            await searchMsg(chatId);
        }

        async function searchMsg(chatId) {
            //for (const device of Const.devices) {
            const request = {
                url: `https://api.zapphub.com/v1/chat/${Const.devices[0].device_id}/chats/${chatId}/sync`,
                headers: {
                    'Content-Type': 'application/json',
                    'Token': Const.token
                },
            }

            await ZOHO.CRM.HTTP.get(request).then(async function (data) {
                data = JSON.parse(data);
                if ("errors" in data) {
                    resize(data.message);
                    return false;
                } else {
                    messages.push(data);
                }
            }).catch(error => console.error(error))
            //}
        }

        async function resize(msg) {
            await ZOHO.CRM.UI.Resize({ height: "60", width: "1000" });
            $("#page-content").addClass('d-none');
            $("#not-content").removeClass('d-none');
            $("#not-content").addClass('d-flex');
            $("#msg-name").html(msg);
            $("#load-spinner").addClass('d-none');
        }
    })
    return messages;
}
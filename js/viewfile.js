var Const = {
    apinames: {
        apiphonelead: "whatsapphubforzohocrm__leads",
        apiphoneaccount: "whatsapphubforzohocrm__accounts",
        apiphonedeal: "whatsapphubforzohocrm__deals",
        apiphonecontact: "whatsapphubforzohocrm__contacts",
        apicomportamento: "whatsapphubforzohocrm__comportamento",
        apiaplicativo: "whatsapphubforzohocrm__aplicativo",
        apiconfiguracao: "whatsapphubforzohocrm__configuracao"

    },
    apimodulename: "",
    idreg: null,
    file_id: "",
    extension: "",
    languages: ["en_US", "pt_BR", "es_ES"],
    deflang: "en_US",
    desclanguage: {}
}

async function initializeWidget() {


    /*
     * Subscribe to the EmbeddedApp onPageLoad event before initializing the widget
     */
    ZOHO.embeddedApp.on("PageLoad", async function(data) {
        ZOHO.CRM.UI.Resize({height:"50",width:"800"});
        $("#newLoad").slideDown();
        
        Const.apimodulename = data.Entity;
        Const.idreg = data.EntityId[0];

        await ZOHO.CRM.CONFIG.getCurrentUser().then(function (data) {
            return ZOHO.CRM.API.getUser({ ID: data.users[0].id }).then(
              async function (data) {
                console.log(data.users[0].language);
                if (Const.languages.includes(data.users[0].language)) {
                  Const.deflang = data.users[0].language;
                }
                await Utils.RenderTemplate(Const.deflang);
                //$("#allPage").show();
              }
            );
          });
        await ZOHO.CRM.API.getOrgVariable(Const.apinames.apiaplicativo).then(async function(data) {
            var respApp = '';
            var resposta = data.Success.Content;
            if (resposta != '' && resposta != null) {
                resposta = JSON.parse(resposta);
                respApp = resposta.app.toLowerCase();
            }

            var continua = false;
            if (respApp == "zapbox" || respApp == "zapphub") {

                continua = true;

            } else {
                $("#newLoad").slideUp();
                $('#ErroMsg').find('.erroText').text("Não há nenhum Broker de WhatsApp selecionado, vá até configurações e defina o seu.");
                $('#ErroMsg').slideDown();
            }

            if (continua) {
                await ZOHO.CRM.API.getOrgVariable(Const.apinames.apiconfiguracao).then(async function(data) {

                    var structure = data.Success.Content;
                    if (structure != "") {
                        var tokenZap = JSON.parse(structure);
                        if (respApp == "zapphub") {
                            if (tokenZap.token !== null && tokenZap.token !== '') {
                                await ZOHO.CRM.API.getRecord({ Entity: Const.apimodulename, RecordID: Const.idreg }).then(function(data) {
                                    urlFilePreview = data.data[0].whatsapphubforzohocrm__File_ID;
                                    //https://api.zapphub.com/v1/files/
                                    file_id = urlFilePreview.replace("/download", "");
                                    var files_info = {
                                        url: "https://api.zapphub.com" + file_id,
                                        headers:{
                                            "Content-Type": "application/json",
                                            "Token": tokenZap.token
                                       }
                    
                                    }
                                    
                                    ZOHO.CRM.HTTP.get(files_info)
                                            .then(async function(file_info) {
                                                
                                    file_info = JSON.parse(file_info);
                                    console.log(file_info);
                                    var extension = file_info.extension;  
                                    if(extension == null || extension == undefined || extension == ""){
                                        extension = file_info.ext;
                                    } else if(extension == "false" || !extension){
                                        extension = file_info.format;
                                    }
                                    var file_id = file_info.id; 
                                    var type = file_info.type;
                                    

                                    if (urlFilePreview != null && urlFilePreview != "" && urlFilePreview != undefined) {


                                        var request = {
                                            url: "https://extensions.otentecnologia.com.br/whatsapphub/sandbox/api/file",
                                            params: {
                                                "url": "https://api.zapphub.com" + urlFilePreview,
                                                "Token": tokenZap.token,
                                                "extension": extension,
                                                "file_id": file_id
                                            }
                                        }

                                        ZOHO.CRM.HTTP.post(request)
                                            .then(async function(data) {
                                                var path = "https://extensions.otentecnologia.com.br/whatsapphub/sandbox/app/temp/" + file_id + "." + extension;
                                               
                                                fetch(path).then(async function(response) {
                                                    return response.blob();
                                                  }).then(function(myBlob) {
                                                    var objetoURL = window.URL.createObjectURL(myBlob);
                                                    var html_image = "";
                                                    if(type == "image"){
                                                        html_image = '<a class="image-link" onclick="openImage()" href="'+objetoURL+'">'+Const.desclanguage["viewfile-image-preview"]+'</a><br>';
                                                        html_image = html_image + '<a class="download-image" download="'+file_id + '.' + extension +'" href="'+objetoURL+'">'+Const.desclanguage["viewfile-download"]+'</a>';
                                                    } else{
                                                        if(type == "video"){
                                                            var mime = file_info.mime;
                                                            html_image = html_image + '<video style="margin-top:20px;" width="500" height="300" controls>';
                                                            html_image = html_image + '<source src="'+objetoURL+'" type="'+mime+'">';
                                                            html_image = html_image + '</video><br>';
                                                        } else if(type == "audio" || type == "ptt"){
                                                            var mime = file_info.mime;
                                                            html_image = html_image + '<audio style="margin-top:20px;" controls autoplay>';
                                                            html_image = html_image + '<source src="'+objetoURL+'" type="'+mime+'">';
                                                            html_image = html_image + '</audio><br>';
                                                        }
                                                        html_image = html_image + '<a class="download-image" style="margin-top: 20px" download="'+file_id + '.' + extension +'" href="'+objetoURL+'">'+Const.desclanguage["viewfile-download"]+'</a>'
                                                    }
                                                    
                                                    $("#div_img").append(html_image); 
                                                    var request = {
                                                        url: "https://extensions.otentecnologia.com.br/whatsapphub/sandbox/api/deletefile",
                                                        params: {
                                                            "extension": extension,
                                                            "file_id": file_id
                                                        }
                                                    }
                                                    ZOHO.CRM.HTTP.post(request);
                                                        
                                                  }).then(async function(){
                                                      //setTimeout(async function(){
                                                          if(type == "image"){
                                                            $('.image-link').magnificPopup({type:'image'});
                                                          }
                                                            $("#newLoad").slideUp();
                                                            $("#div_img").show();     
                                                            if(type == "image"){
                                                                ZOHO.CRM.UI.Resize({height:"200",width:"400"}); 
                                                            } else if(type == "video"){
                                                                ZOHO.CRM.UI.Resize({height:"500",width:"800"}); 
                                                            } else if(type == "ptt" || type == "audio"){
                                                                ZOHO.CRM.UI.Resize({height:"200",width:"400"}); 
                                                            } else{
                                                                ZOHO.CRM.UI.Resize({height:"120",width:"400"}); 
                                                            }
                                                      //},500);
                                                   
                                                    
                                                        
                                                
                                                    
                                                  })
       
                                            })
                                        }
                                    });
                                });
                            }
                        }
                    } else {
                        $("#newLoad").slideUp();
                        $('#ErroMsg').find('.erroText').text(Const.desclanguage["viewfile_error"]);
                        $('#ErroMsg').slideDown();
                    }

                });
            }

        });
    });

    
    ZOHO.embeddedApp.init();

}

async function openImage(){
    ZOHO.CRM.UI.Resize({height:"500",width:"800"}); 
}

async function createImg( path, nodeID ) { 

    var img = new Image(),
        isLoaded = false;

    img.onload = async function() {
        isLoaded = true;
        document.getElementById( nodeID ).appendChild( img );
        $("#" + nodeID).show();
        $("#newLoad").slideUp();  
        ZOHO.CRM.UI.Resize({height:"500",width:"800"}); 

    };

    img.src = path;
};

function reloadWebtab() {
    location.reload();
}

function closeSpanMsg(idDiv) {
    $("#" + idDiv).hide();
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
      $("#allPage").show();
  
      /*if (callBack) {
                  callBack();
              }*/
    });
  };
function initializeWidget() {
    /*
     * Subscribe to the EmbeddedApp onPageLoad event before initializing the widget
     */
    ZOHO.embeddedApp.on("PageLoad", function(data) {
        /*
         * Verify if EntityInformation is Passed
         */
        if (data && data.Entity) {
            /*
             * Fetch Information of Record passed in PageLoad
             * and insert the response into the dom
             */
            ZOHO.CRM.API.getRecord({
                Entity: data.Entity,
                RecordID: data.EntityId,
            }).then(function(response) {
                document.getElementById("recordInfo").innerHTML = JSON.stringify(
                    response,
                    null,
                    2
                );
            });
        }

        /*
         * Fetch Current User Information from CRM
         * and insert the response into the dom
         */

        var roles = [];

        ZOHO.CRM.API.getAllRecords({
            Entity: "Leads",
        }).then(function(data) {
            document.getElementById("recordInfo").innerHTML = JSON.stringify(
                data.data[0].Owner.name,
                null,
                2
            );

            var lista = data.data.length;
            var index = 0;
            var company = JSON.stringify(data.data[0].Company);
            company = company.replace(/"/g, "");
            roles.push(company);
            owners = company;
            var x = document.getElementById("funct");
            var option = document.createElement("option");
            option.text = owners;
            option.value = company;
            x.add(option);

            for (index = 0; index <= lista; index++) {
                var x = 0;
                var lContinua = true;
                var tam = roles.length;
                for (x = 0; x <= tam; x++) {
                    company = JSON.stringify(data.data[index].Company);
                    company = company.replace(/"/g, "");

                    if (roles[x] == company) {
                        lContinua = false;
                        break;
                    }
                }
                if (lContinua == true) {
                    roles.push(data.data[index].Company);
                    functs = data.data[index].Company;
                    var x = document.getElementById("funct");
                    var option = document.createElement("option");
                    option.text = functs;
                    option.value = data.data[index].Company;
                    x.add(option);
                }
                ZOHO.CRM.API.getUser({
                    ID: data.data[index].Owner.id
                }).then(function(
                    resposta
                ) {
                    document.getElementById("userInfo").innerHTML = JSON.stringify(
                        resposta.users[0].role.name
                    );
                });

                //document.getElementById("respostas").innerHTML = roles;
            }
        });

        /*
                                                                                                                                                                                                                                                                                                                                                        ZOHO.CRM.CONFIG.getCurrentUser().then(function(response) {
                                                                                                                                                                                                                                                                                                                                                            document.getElementById("userInfo").innerHTML = JSON.stringify(
                                                                                                                                                                                                                                                                                                                                                                response,
                                                                                                                                                                                                                                                                                                                                                                null,
                                                                                                                                                                                                                                                                                                                                                                2
                                                                                                                                                                                                                                                                                                                                                            );
                                                                                                                                                                                                                                                                                                                                                        });*/
    });

    /*
     * initialize the widget.
     */
    ZOHO.embeddedApp.init();
}
var i = 0;
var vetor = []

function adicionarFuncao() {
    i++;
    var ing = document.getElementById(
        "funct"
    ).value;

    var lista = document.getElementById("lista").innerHTML;
    lista = lista + "<li id=i>" + ing + "</li>";
    vetor.push(ing);
    document.getElementById("lista").innerHTML = lista;
}

function removerFuncao() {

    var rem = document.getElementById("i");
    if (rem.parentNode) {
        rem.parentNode.removeChild(rem);
    }
}

function distributeLead() {
    var lead = true;
    var contact = false;
    var tamanho1 = i;
    var texto = "";
    for (z = 0; z < tamanho1; z++) {
        if ((z + 1) == tamanho1) {
            texto = texto + vetor[z];
        } else {
            texto = texto + vetor[z] + ", ";
        }
    }
    ZOHO.CRM.API.getAllUsers({
            Type: "ActiveUsers"
        })
        .then(function(data) {
            console.log(data)
        })
    document.getElementById("respostas").innerHTML = texto;
    ZOHO.CRM.API.getAllRecords({
            Entity: "Leads",
            sort_order: "asc",
            per_page: 200,
            page: 1,
            converted: false
        })
        .then(function(data) {
            lFound = false;
            lastID = "";
            var i = 0;
            var tam = data.data.length;
            for (i = 0; i < tam; i++) {
                if (lFound) {
                    lastID = data.data[i].id;
                    lFound = false;
                    break;
                } else {
                    if (data.data[i].id == "4440656000000319040") {
                        lFound = true;
                    }
                }
            }
        })
}
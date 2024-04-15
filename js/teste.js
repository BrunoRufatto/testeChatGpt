async function initializeWidget() {
    ZOHO.embeddedApp.on("PageLoad", async function(data) {
        console.log("teste eeee");
    });

    ZOHO.embeddedApp.on("NotifyAndWait", function (data) {
        console.log("Client Script synchronous flyout notification", data);
        ZDK.Client.sendResponse(data.id, { choice: 'mail', value: 'gustavo.couto@otentecnologia.com.br' });
    });

    ZOHO.embeddedApp.on("Notify", function (data) {
        console.log("Client Script flyout notification", data);
    });

    ZOHO.embeddedApp.init();
}
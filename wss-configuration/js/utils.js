WsPropertyUtils = {
    newPropertiesMap: {},

// initialize global objects
    initializeGlobalObjects: function () {
        HtmlCreator.jsonFile = "";
        HtmlCreator.propertiesData = {};
        HtmlCreator.disabledProperties = [];
        HtmlCreator.groupMap = [];
        HtmlCreator.advancedPropertiesIds = [];
        HtmlCreator.requireProperties = [];
        HtmlCreator.advancedPropertyTabs = [];
    },

// add new property to specific dictionary
    addProperty: function (key, value, dictionary) {
        dictionary[key] = value;
    },

// get property from specific dictionary
    getProperty: function (key, dictionary) {
        return dictionary[key];
    },

// copy text from input box
    copyToClipboard: function () {
        let copyText = document.getElementById("copy");
        copyText.select();
        document.execCommand("copy");
    },

// import file when pressing on import button
    importFile: function (event) {
        //WsPropertyUtils.initializeGlobalObjects();
        //let jsonFile = HtmlCreator.jsonFile;
        let jsonFile = event.target.files[0];
        let reader = new FileReader();
        reader.onload = (function () {
            return function (e) {
                // Render thumbnail.
                //HtmlCreator.handleJsonContent(reader.result);
                WsPropertyUtils.handleJsonFile(reader.result);
            };
        })(jsonFile);
        // Read in the image file as a data URL.
        if (jsonFile !== undefined) {
            reader.readAsText(jsonFile);
        }

    },

    handleJsonFile: function (result) {
        let oldPropertiesData = HtmlCreator.propertiesData;
        if (Object.keys(oldPropertiesData).length === 0 && oldPropertiesData.constructor === Object) {
            HtmlCreator.handleJsonContent(result);
        } else {
            let newPropertiesData = JSON.parse(result);
            WsPropertyUtils.overlayJson(oldPropertiesData, newPropertiesData);
        }
    },

    overlayJson(oldJson, newJson) {
        let oldProperties = oldJson.properties;
        let newProperties = newJson.properties;
        WsPropertyUtils.insertNewPropertiesInMap(newProperties);
        for (let i = 0; i < oldProperties.length; i++) {
            let propertyIndex = WsPropertyUtils.getProperty(oldProperties[i].propertyName, WsPropertyUtils.newPropertiesMap);
            if (propertyIndex !== undefined) {
                newProperties[propertyIndex].propertyValue = oldProperties[i].propertyValue;
            }
        }
        newJson.properties = newProperties;
        WsPropertyUtils.initializeGlobalObjects();
        WsPropertyUtils.initializeHtml();
        HtmlCreator.handleJsonContent(JSON.stringify(newJson));
    },

    insertNewPropertiesInMap: function (newProperties) {
        for (let i = 0; i < newProperties.length; i++) {
            WsPropertyUtils.addProperty(newProperties[i].propertyName, i, WsPropertyUtils.newPropertiesMap);
        }
    },

    // exporting new json with new changes
    exportFile: function (event) {
        event.preventDefault();
        let blob = new Blob([JSON.stringify(HtmlCreator.propertiesData)], {
            "type": "application/json"
        });
        let a = document.createElement("a");
        a.download = name;
        a.href = URL.createObjectURL(blob);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    },

    // create a password of certain length
    generatePassword: function (passwordLength) {
        let retValue = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < passwordLength; i++)
            retValue += possible.charAt(Math.floor(Math.random() * possible.length));

        return retValue;
    },

    initializeHtml: function () {
        let ulNode = document.getElementById("ul-tabs");
        let boxNode = document.getElementById("box-div");
        WsPropertyUtils.clearInner(boxNode);
        WsPropertyUtils.clearInner(ulNode);
    },

    clearInner: function (node) {
        let children = node.children;
        for (let i = 0; i < children.length; i++) {
            let id = children[i].id;
            if (id !== "home-tab-li" && id !== "home-tab-anchor" && id !== "ul-tabs" && id !== "home-tab-span" && id !== "home-tab" && id !== "box-div" && id !== "advanced-cb-home") {
                WsPropertyUtils.clear(children[i]);
            }
        }
    },

    clear: function (node) {
        while (node.hasChildNodes()) {
            WsPropertyUtils.clear(node.firstChild);
        }
        node.parentNode.removeChild(node);
    }


}
;
HtmlCreator = {
    jsonFile: "",
    propertiesData: {},
    disabledProperties: [],
    groupMap: [],
    advancedPropertiesIds: [],
    requireProperties: [],
    advancedPropertyTabs: [],

    // create the content html
    handleJsonContent: function (result) {
        HtmlCreator.propertiesData = JSON.parse(result);
        let properties = HtmlCreator.propertiesData.properties;
        for (let i = 0; i < properties.length; i++) {
            if (properties[i].hidden === false || properties[i].hidden === undefined) {
                let property = properties[i];
                let propertyIds = WsPropertyUtils.getProperty(property.group, HtmlCreator.groupMap);
                if (typeof propertyIds === "undefined") {
                    let propertiesGroup = [];
                    propertiesGroup.push(i);
                    WsPropertyUtils.addProperty(property.group, propertiesGroup, HtmlCreator.groupMap);
                } else {
                    propertyIds.push(i);
                }
                HtmlCreator.createPropertyHtml(property, i);
                if (properties[i].advanced !== undefined && properties[i].advanced) {
                    HtmlCreator.advancedPropertiesIds.push(i);
                }
            }
        }
        let exportBtn = document.getElementById('exportFile');
        exportBtn.removeAttribute('disabled');
        //exportBtn.classList.add("Ws-btn");
        HtmlCreator.createGroupTabs();
    },

    // check which property is not enable and disable it
    disableProperties: function () {
        Object.keys(HtmlCreator.disabledProperties).forEach(function (key) {
            document.getElementById("property_" + key).setAttribute('disabled', 'true');
            let prop = WsPropertyUtils.getProperty(key, HtmlCreator.disabledProperties);
            if (!prop.enabled) {
                document.getElementById("property_disabled_" + key).checked = false;
            }
        });
    },

    // create tab for each group
    createGroupTabs: function () {
        let indexId = 1;
        let requireCounter = 0;
        let boxDiv = document.getElementById("box-div");
        Object.keys(HtmlCreator.groupMap).forEach(function (key) {
                WsTabEvents.createGroupTab(key, indexId, boxDiv, requireCounter);
                requireCounter = 0;
                indexId++;
            }
        );
        WsPropertyEvents.manageAdvancedTabs(false);
        $("#div-tabs").tabs("refresh");
    },

    // create property html including enable/disable check box, property name, property value and property documentation
    createPropertyHtml: function (property, i) {
        let newProp = new Property(property, i);
        let propertyData = newProp.getHtml();
        propertyData.appendChild(document.createElement("br"));
        document.getElementById('content').appendChild(propertyData);
        if (!property.enabled) {
            WsPropertyUtils.addProperty(i, property, HtmlCreator.disabledProperties);
        }
    },

    createHomeTab: function () {
        let homeTab = document.getElementById("home-tab");
        let advancedCheckBoxDiv = WsPropertyEvents.createAdvancedCheckBox();
        let homeContentDiv = document.createElement("div");
        homeContentDiv.className = "home-content";
        homeTab.appendChild(homeContentDiv);
        homeTab.appendChild(document.createElement("br"));
        homeTab.appendChild(advancedCheckBoxDiv);
        fetch('config/prop.json')
            .then(r => r.json())
            .then(data => {
                homeContentDiv.innerHTML = data.general.tabs.Home.contentsHtml;
            });
    }

};
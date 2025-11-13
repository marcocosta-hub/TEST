WsTabEvents = {

    // create new group tab
    createGroupTab: function (key, indexId, boxDiv, requireCounter) {
        let propertyIds = WsPropertyUtils.getProperty(key, HtmlCreator.groupMap);
        let anchorTab = document.createElement("a");
        let spanTab = document.createElement("span");
        /*let imgTab = document.createElement("img");*/
        let li = document.createElement("li");
        let divTab = document.createElement("div");
        divTab.id = "tabs-" + indexId;
        /*imgTab.id = "img-tab-" + indexId;*/
        spanTab.className = "span-tab";
        anchorTab.className = "anchor-tab";
        anchorTab.id = "anchorTab-" + indexId;
        spanTab.innerText = key;
        anchorTab.href = "#tabs-" + indexId;
        anchorTab.appendChild(spanTab);
        /*anchorTab.appendChild(imgTab);*/
        li.appendChild(anchorTab);
        document.getElementById("ul-tabs").appendChild(document.createElement("li")).appendChild(anchorTab);
        divTab.onchange = function () {
            WsTabEvents.checkMandatoryFieldsInTab(divTab, spanTab);
        };
        $("#ul-tabs").append(li);
        boxDiv.appendChild(divTab);
        requireCounter = WsTabEvents.createTabProperties(propertyIds, divTab, requireCounter);
        if (requireCounter > 0) {
            //imgTab.className = "alert-img";
            spanTab.classList.add("required-field");
        } else {
            //imgTab.className = "none";
            spanTab.classList.remove("required-field");
        }
        //anchorTab.style.display = "none";

        WsTabEvents.lookForAdvancedPropertiesInTab(indexId);
    },

    // create all the properties under specific group tab
    createTabProperties: function (propertyIds, divTab, requireCounter) {
        for (let propertyId in propertyIds) {
            let property = document.getElementById("property_data_" + propertyIds[propertyId]);
            divTab.appendChild(property);
            let require = property.getElementsByClassName("required-field");
            if (require.length > 0) {
                requireCounter++
            }
        }
        return requireCounter;
    },

    // check mandatory fields to change the icon of the specific tab
    checkMandatoryFieldsInTab: function (divTab, spanTab) {
        let count = 0;
        $(divTab).each(function () {
            let requireFields = divTab.getElementsByClassName("required-field");
            count += requireFields.length;
        });
        if (count > 0) {
            //imgTab.className = "alert-img";
            spanTab.classList.add("required-field");
        } else {
            spanTab.classList.remove("required-field");
        }
    },

    lookForAdvancedPropertiesInTab(indexId) {
        let tab = document.getElementById("tabs-" + indexId);
        let showTab = false;
        let children = tab.children;
        for (let i = 0; i < children.length; i++) {
            if (children[i].style !== null && children[i].style.display !== "none") {
                showTab = true;
                break;
            }
        }
        if (!showTab) {
            HtmlCreator.advancedPropertyTabs.push(indexId);
        }
    }
};
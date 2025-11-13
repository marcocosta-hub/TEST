WsPropertyEvents = {

    // create advanced check box to show and hide advanced properties
    createAdvancedCheckBox: function () {
        let checkBoxDiv = document.createElement("div");
        checkBoxDiv.id = "advanced-cb-home";
        checkBoxDiv.style.marginLeft = "-7px";
        let checkBoxTextLabel = document.createElement("label");
        checkBoxTextLabel.innerText = "Advanced Properties";
        checkBoxTextLabel.style.fontSize = "12px";
        let checkBoxLabel = document.createElement("label");
        checkBoxLabel.id = "advanced-cb-label";
        checkBoxLabel.className = "container";
        checkBoxLabel.style.fontSize = "15px";
        checkBoxLabel.style.background = "mediumseagreen";
        let checkBoxInput = document.createElement("input");
        checkBoxInput.id = "advanced-cb-input";
        checkBoxInput.type = "checkbox";
        let checkBoxSpan = document.createElement("span");
        checkBoxSpan.className = "checkmark";
        this.handleCheckBoxEvent(checkBoxInput);
        checkBoxLabel.appendChild(checkBoxInput);
        checkBoxLabel.appendChild(checkBoxSpan);
        checkBoxDiv.appendChild(checkBoxLabel);
        checkBoxDiv.appendChild(checkBoxTextLabel);
        return checkBoxDiv;
    },

    // update property value in propertiesData object
    updatePropertyValue: function (event, index) {
        let optionList = document.getElementById(event.target.id);
        HtmlCreator.propertiesData.properties[index].propertyValue = optionList.options[optionList.selectedIndex].value;
    },

    // when a  value of property changes the specific property in propertiesData change as well
    propertyChanged: function (event) {
        let property = document.getElementById(event.target.id);
        property.setAttribute('value', event.target.value);
        let indexOfId = event.target.id.lastIndexOf("_") + 1;
        let propertyId = event.target.id.substring(indexOfId, event.target.id.length);
        HtmlCreator.propertiesData.properties[propertyId].propertyValue = event.target.value;
    },

    // show property documentation when pressing on property i button
    showPropertyDocToolTip: function (propertyInfoImg) {
        $(propertyInfoImg).tooltip({
            items: "img",
            content: function () {
                let element = $(this);
                return element.attr("alt");
            }
        });

    },

    // disable/enable property
    disableProperty: function (event) {
        let propertyCheckBox = document.getElementById(event.target.id);
        let indexOfId = propertyCheckBox.id.lastIndexOf("_") + 1;
        let propertyId = propertyCheckBox.id.substring(indexOfId, propertyCheckBox.id.length);
        let property = document.getElementById("property_" + propertyId);
        if (propertyCheckBox.checked) {
            property.removeAttribute('disabled');
            HtmlCreator.propertiesData.properties[propertyId].enabled = true;
        } else {
            document.getElementById("property_" + propertyId).setAttribute('disabled', 'true');
            HtmlCreator.propertiesData.properties[propertyId].enabled = false;
        }
    },

    // on focus property change the require class from require to not require or vice versa
    onFocusPropertyValue: function (propertyType, propertyJson, event) {
        if (event.target.value !== undefined && event.target.value !== null && event.target.value !== "") {
            propertyType.classList.remove("required-field");
            propertyType.classList.add("required-field-changed");
        } else {
            propertyType.classList.remove("required-field-changed");
            propertyType.classList.add("required-field");
        }
    },

    // check if the password confirmation input is the same like the password input
    passwordConfirmation: function (password, passwordConfirm, message) {
        if (password.value ===
            passwordConfirm.value) {
            message.style.color = 'green';
            message.innerText = 'matching';
            message.style.marginLeft = "5px";
            return true;
        } else {
            message.style.color = 'red';
            message.innerText = 'not matching';
            message.style.marginLeft = "5px";
            return false;
        }
    },

    manageAdvancedTabs(checked) {
        HtmlCreator.advancedPropertyTabs.forEach(function (key) {
            //let id = key;
            let anchorTab = document.getElementById("anchorTab-" + key);
            let divTab = document.getElementById("tabs-" + key);
            if (checked) {
                anchorTab.style.display = "block";
                divTab.style.display = "block";
            }
            else {
                anchorTab.style.display = "none";
                divTab.style.display = "none";
            }
        })
    },

    handleCheckBoxEvent(checkBoxInput) {
        checkBoxInput.onclick = function () {
            let checked = checkBoxInput.checked;
            HtmlCreator.advancedPropertiesIds.forEach(function (id) {
                let property = document.getElementById("property_data_" + id);
                if (checked) {
                    property.style.display = "block";
                }
                if (!checked) {
                    property.style.display = "none";
                }
            });
            WsPropertyEvents.manageAdvancedTabs(checked);
            $("#div-tabs").tabs("refresh");
        };
    }

};
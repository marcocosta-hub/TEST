class Property {

    constructor(propertyJson, index) {
        this.propertyJson = propertyJson;
        this.index = index;
    };

    // build the entire property
    getHtml() {
        let propertyData = this.createPropertyDataDiv(this.propertyJson, this.index);
        let propertyField = this.createPropertyInputField(this.propertyJson, this.index);
        let brDiv = document.createElement("div");
        brDiv.style.height = "90px";
        propertyData.appendChild(propertyField);
        propertyData.appendChild(brDiv);
        return propertyData;
    }

    // create the main property div
    createPropertyDataDiv(propertyJson, index) {
        let propertyDataDiv = document.createElement("div");
        propertyDataDiv.id = "property_data_" + index;
        propertyDataDiv.className = "row";
        if (propertyJson.advanced) {
            propertyDataDiv.style.display = "none";
        }
        return propertyDataDiv;
    };

    // create property info icon to show property documentation
    createPropertyInfo(propertyJson, index) {
        let propertyInfoDiv = document.createElement("div");
        let propertyInfoSpan = document.createElement("label");
        propertyInfoDiv.id = ("property_info" + index);
        propertyInfoDiv.className = "info-img-tooltip";
        propertyInfoSpan.innerHTML = propertyJson.propertyDoc;
        propertyInfoDiv.appendChild(propertyInfoSpan);
        return propertyInfoDiv;
    };

    // create property documentation div
    createPropertyDoc(propertyJson, index) {
        let propertyDocDiv = document.createElement("div");
        propertyDocDiv.className = "column";
        let propertyDocInput = document.createElement("p");
        propertyDocInput.id = "propertyDoc_" + index;
        propertyDocInput.className = "property-doc";
        propertyDocInput.style.display = "none";
        propertyDocInput.innerHTML = propertyJson.propertyDoc;
        propertyDocDiv.appendChild(propertyDocInput);
        return propertyDocDiv;
    };

    // create property label and property type fields
    createPropertyInputField(propertyJson, index) {
        let propertyFieldDiv = document.createElement("div");
        propertyFieldDiv.className = "column";
        let propertyType = this.getPropertyType(propertyJson, index);
        propertyFieldDiv.appendChild(propertyType);
        return propertyFieldDiv;
    };

    // get the property type from the json file and create it
    getPropertyType(propertyJson, index) {
        let propertyType = {};
        let propertyInfo = this.createPropertyInfo(propertyJson, index);
        let selectProperty = false;
        let typeConfig = propertyJson.typeConfig;
        let propertyDiv = document.createElement("div");
        let propertyLabel = document.createElement("label");
        propertyLabel.className = "property-label";
        let propertyLabelName = propertyJson.propertyLabel;
        if (propertyLabelName !== undefined && propertyLabelName !== null) {
            propertyLabel.innerText = propertyLabelName + ": ";
        } else {
            propertyLabel.innerText = propertyJson.propertyName + ": ";
        }
        if (propertyJson.mandatory && (propertyJson.propertyValue === undefined || propertyJson.propertyValue === "")) {
            propertyLabel.classList.add("required-field");
        }
        switch (propertyJson.propertyType) {
            case "options":
                propertyType = this.createSelectProperty(propertyJson, index);
                selectProperty = true;
                break;
            case "password":
                propertyType = this.createPasswordProperty(propertyJson, index, propertyLabel, typeConfig);
                break;
            case "textArea":
                propertyType = this.createTextAreaProperty(propertyJson, index, typeConfig);
                break;
            default:
                propertyType = this.createDefaultProperty(propertyJson, index, propertyLabel);
        }
        if (propertyLabel !== undefined && propertyLabel !== null && propertyType !== undefined && propertyType !== null) {
            if (propertyJson.inputLength !== undefined && propertyJson.inputLength !== "") {
                propertyType.style.width = propertyJson.inputLength;
            }
            propertyDiv.appendChild(propertyLabel);
            propertyDiv.appendChild(document.createElement("br"));
            propertyDiv.appendChild(propertyType);
            propertyDiv.appendChild(document.createElement("br"));
            if (selectProperty) {
                propertyDiv.appendChild(document.createElement("br"));
                propertyInfo.style.marginTop = "-5px";
            }
            propertyDiv.appendChild(propertyInfo);
        }
        return propertyDiv;
    };

    // create password property field (including confirmation field)
    createPasswordProperty(propertyJson, index, propertyLabel, typeConfig) {
        let passwordDiv = document.createElement("div");
        let passwordInput = document.createElement("input");
        let passwordInputConfirm = document.createElement("input");
        let passwordConfirmLabel = document.createElement("label");
        let generateBtn = document.createElement("input");
        let message = document.createElement("span");
        let confirm = false;
        generateBtn.type = "button";
        generateBtn.value = "Generate";
        generateBtn.className = "Ws-btn";
        generateBtn.style.marginLeft = "6px";
        passwordInputConfirm.type = "password";
        passwordInputConfirm.id = "property_confirm_" + index;
        passwordInputConfirm.style.marginLeft = "5px";
        passwordConfirmLabel.innerText = "Confirm:";
        passwordConfirmLabel.style.marginLeft = "5px";
        passwordInput.id = "property_" + index;
        passwordInput.type = "password";
        generateBtn.onclick = function () {
            let password = WsPropertyUtils.generatePassword(8);
            passwordInput.value = password;
            passwordInputConfirm.value = password;
            confirm = WsPropertyEvents.passwordConfirmation(passwordInput, passwordInputConfirm, message);
            if (confirm) {
                HtmlCreator.propertiesData.properties[index].propertyValue = passwordInput.value;
            }
        };
        passwordInput.oninput = function () {
            confirm = WsPropertyEvents.passwordConfirmation(passwordInput, passwordInputConfirm, message);
        };
        passwordInputConfirm.oninput = function () {
            confirm = WsPropertyEvents.passwordConfirmation(passwordInput, passwordInputConfirm, message);
        };
        if (propertyJson.propertyValue !== undefined && propertyJson.propertyValue !== "") {
            passwordInput.value = propertyJson.propertyValue;
            passwordInputConfirm.value = propertyJson.propertyValue;
        }
        if (propertyJson.mandatory) {
            passwordInput.onfocusout = function () {
                WsPropertyEvents.onFocusPropertyValue(propertyLabel, propertyJson, event);
            };
        }
        passwordInputConfirm.onchange = function () {
            if (confirm) {
                WsPropertyEvents.propertyChanged(event)
            }
        };
        passwordConfirmLabel.appendChild(passwordInputConfirm);
        passwordConfirmLabel.appendChild(message);
        passwordDiv.appendChild(passwordInput);
        passwordDiv.appendChild(passwordConfirmLabel);
        if (typeConfig !== undefined && typeConfig !== null) {
            if (typeConfig.password !== undefined && typeConfig.password != null) {
                if (typeConfig.password.allowGenerate) {
                    passwordDiv.appendChild(generateBtn);
                }
            }
        }
        passwordDiv.className = "column";
        passwordDiv.style.cssFloat = "left";
        passwordDiv.style.display = "inline-block";
        passwordDiv.style.width = ((elementById.value.length + 1) * 7) + 'px';
        return passwordDiv
    }

    // create default property field with (label and input text)
    createDefaultProperty(propertyJson, index, propertyLabel) {
        let propertyInput = document.createElement("input");
        propertyInput.id = "property_" + index;
        if (propertyJson.propertyValue !== undefined && propertyJson.propertyValue !== "") {
            propertyInput.value = propertyJson.propertyValue;
        }
        if (!propertyJson.readOnly) {
            if (propertyJson.mandatory) {
                propertyInput.oninput = function () {
                    WsPropertyEvents.onFocusPropertyValue(propertyLabel, propertyJson, event);
                };
            }
            propertyInput.onchange = function () {
                WsPropertyEvents.propertyChanged(event)
            };
        } else {
            propertyInput.readOnly = true;
        }
        propertyInput.className = "property-span";
        propertyInput.style.width = ((elementById.value.length + 1) * 6) + 'px';
        return propertyInput;
    }

    // create selection property field with options
    createSelectProperty(propertyJson, index) {
        let propertySelect = document.createElement("select");
        propertySelect.id = "select" + index;
        propertySelect.onchange = function () {
            WsPropertyEvents.updatePropertyValue(event, index)
        };
        this.createOptions(propertyJson, propertySelect);
        propertySelect.className = "property-span";
        propertySelect.style.width = ((elementById.value.length + 1) * 2) + 'px';
        return propertySelect;
    }

    // create text area property field
    createTextAreaProperty(propertyJson, index, typeConfig) {
        let textArea = null;
        let textAreaInput = null;
        if (typeConfig !== undefined && typeConfig != null) {
            let typeConfigTextArea = typeConfig.textArea;
            if (typeConfigTextArea !== undefined && typeConfigTextArea !== null) {
                textArea = typeConfigTextArea;
            }
        }
        if (textArea !== null && textArea !== undefined) {
            textAreaInput = document.createElement("textarea");
            textAreaInput.id = "property_" + index;
            textAreaInput.cols = textArea["cols"];
            textAreaInput.rows = textArea["rows"];
            textAreaInput.style.resize = "none";
            textAreaInput.onchange = function () {
                WsPropertyEvents.propertyChanged(event)
            };
            textAreaInput.className = "property-span";
        }
        return textAreaInput;
    }

    // create the options for selection property field
    createOptions(propertyJson, propertyType) {
        let propertyOptions = propertyJson.typeConfig[propertyJson.propertyType];
        for (let i = 0; i < propertyOptions.length; i++) {
            propertyType.options[i] = new Option(propertyOptions[i].label, propertyOptions[i].value);
            if (propertyJson.propertyValue === propertyOptions[i].value) {
                propertyType.options[i].selected = propertyJson.propertyValue;
            }
        }
    };
}
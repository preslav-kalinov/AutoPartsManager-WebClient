const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

function onPageLoaded() {
    $.ajax({
        type: 'GET',
        url: APICONFIG.host + '/parts/' + id,
        success: function (result) {
            parsePart(result);
            hideElement("#loadingContainer");
            showElement("#returnToPartsListingContainer");
            showElement("#sellPartForm");
        },
        error: function(xhr, status, code) {
            onSellPartPageLoadError(xhr, status, code);
        }
    });
}

function onSellPartPageLoadError(xhr, status, code) {
    hideElement("#loadingContainer");
    showElement("#returnToPartsListingContainer");
    showSellPartError(xhr, status, code);
}

function showSellPartError(xhr, status, code) {
    showElement("#errorMessageContainer");
    hideElement("#successMessageContainer");
    if(xhr.status == 404 || xhr.status == 400) {
        $("#errorMessageContent").html(JSON.parse(xhr.responseText).errorMessage);
        return;
    }
    $("#errorMessageContent").append("Cannot connect to server");
}

function parsePart(part) {
    $("#partId").val(part.id);
    $("#partName").val(part.name);
    $("#partQuantity").val(part.quantity);
    $("#partPrice").val(part.price);
}

function submitPart() {
    showElement("#formSubmitLoadingContainer");
    hideElement("#formSubmitButton");
    const dataToBeSent = {
        soldQuantity: $("#partSoldQuantity").val()
    };
    $.ajax({
        type: 'POST',
        url: APICONFIG.host + '/parts/' + id + "/sale",
        data: JSON.stringify(dataToBeSent),
        contentType: "application/json",
        success: function (result) {
            hideElement("#formSubmitLoadingContainer");
            showElement("#formSubmitButton");
            partSoldSuccessfully(result);
        },
        error: function (xhr, status, error) {
            hideElement("#formSubmitLoadingContainer");
            showElement("#formSubmitButton");
            showSellPartError(xhr, status, error);
        }
    });
}

function partSoldSuccessfully(part) {
    hideElement("#errorMessageContainer");
    showElement("#successMessageContainer");
    $("#partQuantity").val(part.quantity);
    $("#partSoldQuantity").val("");
}
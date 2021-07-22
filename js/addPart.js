let categories;
let cars;
let categoryChosen;
let carChosen;

function onPageLoaded() {
    $.ajax({
        type: 'GET',
        url: APICONFIG.host + '/parts/categories',
        success: function (result) {
            parseCategories(result);
            getCarsAvailable();
        },
        error: function(xhr, status, code) {
            onAddPartPageLoadError(xhr, status, code);
        }
    });
}

function onAddPartPageLoadError(xhr, status, code) {
    hideElement("#loadingContainer");
    showElement("#returnToPartsListingContainer");
    showAddPartError(xhr, status, code);
}

function showAddPartError(xhr, status, code) {
    showElement("#errorMessageContainer");
    hideElement("#successMessageContainer");
    if(xhr.status == 404 || xhr.status == 400) {
        $("#errorMessageContent").html(JSON.parse(xhr.responseText).errorMessage);
        return;
    }
    $("#errorMessageContent").append("Cannot connect to server.");
}

function getCarsAvailable() {
    $.ajax({
        type: 'GET',
        url: APICONFIG.host + '/parts/cars',
        success: function (result) {
            parseCars(result);
            hideElement("#loadingContainer");
            showElement("#returnToPartsListingContainer");
            showElement("#addPartForm");
        },
        error: function(xhr, status, code) {
            onAddPartPageLoadError(xhr, status, code);
        }
    });
}

function parseCategories(arr) {
    categories = arr;
    for(const category of categories){
        $("#categoryItems").append('<a categoryId="' + category.id + '" class="dropdown-item" onclick="setCategory(' + category.id + ')">' + category.name + '</a>');
    }
}

function parseCars(arr) {
    cars = arr;
    for(const car of cars){
        $("#carItems").append('<a carId="' + car.id + '" class="dropdown-item" onclick="setCar(' + car.id + ')">' + car.brand + ' ' + car.model + '</a>');
    }
}

function setCategory(id) {
    categoryChosen = id;
    $('#categoryItems').find('a').each(function() {
        if($(this).attr('categoryId') == id && !$(this).hasClass("active")) {
            $(this).addClass("active");
        } else if($(this).attr('categoryId') != id && $(this).hasClass("active")) {
            $(this).removeClass("active");
        }
    });
}

function setCar(id) {
    carChosen = id;
    $('#carItems').find('a').each(function() {
        if($(this).attr('carId') == id && !$(this).hasClass("active")) {
            $(this).addClass("active");
        } else if($(this).attr('carId') != id && $(this).hasClass("active")) {
            $(this).removeClass("active");
        }
    });
}

function carSearchInputChanged() {
    const userInputRegex = new RegExp(quotemeta($("#carSearch").val()), "i");
    $('#carItems').find('a').each(function() {
        if(!userInputRegex.test($(this).text()) && !$(this).hasClass("visually-hidden")) {
            $(this).addClass("visually-hidden");
        } else if(userInputRegex.test($(this).text()) && $(this).hasClass("visually-hidden")) {
            $(this).removeClass("visually-hidden");
        }
    });
}

function categorySearchInputChanged() {
    const userInputRegex = new RegExp(quotemeta($("#categorySearch").val()), "i");
    $('#categoryItems').find('a').each(function() {
        if(!userInputRegex.test($(this).text()) && !$(this).hasClass("visually-hidden")) {
            $(this).addClass("visually-hidden");
        } else if(userInputRegex.test($(this).text()) && $(this).hasClass("visually-hidden")) {
            $(this).removeClass("visually-hidden");
        }
    });
}

function submitPart() {
    showElement("#formSubmitLoadingContainer");
    hideElement("#formSubmitButton");
    const dataToBeSent = {
        name: $("#partName").val(),
        quantity: $("#partQuantity").val(),
        price: $("#partPrice").val(),
        categoryId: categoryChosen,
        carId: carChosen
    };
    $.ajax({
        type: 'POST',
        url: APICONFIG.host + '/parts',
        data: JSON.stringify(dataToBeSent),
        contentType: "application/json",
        success: function (result) {
            hideElement("#formSubmitLoadingContainer");
            showElement("#formSubmitButton");
            partAddedSuccessfully();
        },
        error: function (xhr, status, error) {
            hideElement("#formSubmitLoadingContainer");
            showElement("#formSubmitButton");
            showAddPartError(xhr, status, error);
        }
    });
}

function partAddedSuccessfully() {
    hideElement("#errorMessageContainer");
    showElement("#successMessageContainer");
    categoryChosen = undefined;
    carChosen = undefined;
    $("#categorySearch").val("");
    $("#carSearch").val("");
    $('#categoryItems').find('a').each(function() {
        if($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
        if($(this).hasClass("visually-hidden")) {
            $(this).removeClass("visually-hidden");
        }
    });
    $('#carItems').find('a').each(function() {
        if($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
        if($(this).hasClass("visually-hidden")) {
            $(this).removeClass("visually-hidden");
        }
    });
    $("#partName").val("");
    $("#partQuantity").val("");
    $("#partPrice").val("");
}
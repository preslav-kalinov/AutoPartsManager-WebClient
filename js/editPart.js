let categories;
let cars;
let categoryChosen;
let carChosen;

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

function onPageLoaded() {
    $.ajax({
        type: 'GET',
        url: APICONFIG.host + '/parts/categories',
        success: function (result) {
            parseCategories(result);
            getCarsAvailable();
        },
        error: function(xhr, status, code) {
            onEditPartPageLoadError(xhr, status, code);
        }
    });
}

function onEditPartPageLoadError(xhr, status, code) {
    hideElement("#loadingContainer");
    showElement("#returnToPartsListingContainer");
    showEditPartError(xhr, status, code);
}

function showEditPartError(xhr, status, code) {
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
            getOnePart();
        },
        error: function(xhr, status, code) {
            onEditPartPageLoadError(xhr, status, code);
        }
    });
}

function getOnePart() {
    $.ajax({
        type: 'GET',
        url: APICONFIG.host + '/parts/' + id,
        success: function (result) {
            parsePart(result);
            hideElement("#loadingContainer");
            showElement("#returnToPartsListingContainer");
            showElement("#editPartForm");
        },
        error: function(xhr, status, code) {
            onEditPartPageLoadError(xhr, status, code);
        }
    });
}

function parsePart(part) {
    $("#partId").val(part.id);
    $("#partName").val(part.name);
    $("#partQuantity").val(part.quantity);
    $("#partPrice").val(part.price);
    $('#categoryItems').find('a').each(function() {
        if($(this).attr('categoryId') == part.category.id) {
            if(!$(this).hasClass("active")) {
                $(this).addClass("active");
            }
            categoryChosen = part.category.id;
        }
    });
    $('#carItems').find('a').each(function() {
        if($(this).attr('carId') == part.car.id) {
            if(!$(this).hasClass("active"))
                $(this).addClass("active");
        }
        carChosen = part.car.id;
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
        type: 'PUT',
        url: APICONFIG.host + '/parts/' + id,
        data: JSON.stringify(dataToBeSent),
        contentType: "application/json",
        success: function (result) {
            hideElement("#formSubmitLoadingContainer");
            showElement("#formSubmitButton");
            partEditedSuccessfully();
        },
        error: function (xhr, status, error) {
            hideElement("#formSubmitLoadingContainer");
            showElement("#formSubmitButton");
            showEditPartError(xhr, status, error);
        }
    });
}

function partEditedSuccessfully() {
    hideElement("#errorMessageContainer");
    showElement("#successMessageContainer");
}
function showElement(element) {
    if($(element).hasClass("visually-hidden")) {
        $(element).removeClass("visually-hidden");
    }
}

function hideElement(element) {
    if(!$(element).hasClass("visually-hidden")) {
        $(element).addClass("visually-hidden");
    }
}

function quotemeta(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
function onPageLoaded() {
    $.ajax({
        type: 'GET',
        url: APICONFIG.host + '/parts',
        success: function (result) {
            hideElement("#loadingContainer");
            hideElement("#errorMessageContainer");
            showElement("#addPartContainer");
            showElement("#partsListingContainer");
            showPartsListing(result);
        },
        error: function(xhr, status, code) {
            hideElement("#loadingContainer");
            showElement("#errorMessageContainer");
            hideElement('#addPartContainer');
            hideElement('#partsListingContainer');
            if(xhr.status == 404) {
                $("#errorMessage").append(JSON.parse(xhr.responseText).errorMessage);
                showElement("#addPartContainer");
                return;
            }
            $("#errorMessage").append("Cannot connect to server");
        }
    });
}

function showPartsListing(result) {
    for(const part of result) {
        let tableRow = "<tr>";
        tableRow += "<td>" + part.id + "</td>";
        tableRow += "<td>" + part.name + "</td>";
        tableRow += "<td>" + part.quantity + "</td>";
        tableRow += "<td>" + part.price + "</td>";
        tableRow += "<td>" + part.category.name + "</td>";
        tableRow += "<td>" + part.car.brand + ' ' + part.car.model + "</td>";
        tableRow += '<td><a href="edit.html?id=' + part.id + '"><button type="button" class="btn btn-outline-warning btn-rounded" data-mdb-ripple-color="light">Edit</button></a> <button type="button" class="btn btn-outline-danger btn-rounded" data-mdb-ripple-color="light" data-mdb-toggle="modal" data-mdb-target="#deletePartModal" onclick="changePartDeleteModal(' + part.id + ', \'' + part.name + '\', \'' + part.category.name + '\', \'' + part.car.brand + '\', \'' + part.car.model + '\')">Delete</button> <a href="sell.html?id='+ part.id + '"> <button type="button" class="btn btn-outline-success btn-rounded" data-mdb-ripple-color="light">Sell</button></a></td>';
        tableRow += "</tr>";
        $("#partsListingTableContent").append(tableRow);
    }
}

function changePartDeleteModal(id, name, categoryName, carBrand, carModel){
    $("#deletePartModalBody").text("Are you sure you want to delete part '" +  name + "' (ID " + id + "), category - '" + categoryName + "' , car - '" + carBrand + " " + carModel + "' ?");
    $("#deletePartModalYesButton").attr("onclick", "deletePart(" + id + ")");
}

function deletePart(id){
    $.ajax({
        type: 'DELETE',
        url: APICONFIG.host + '/parts/' + id ,
        success: function (result){
            location.reload();
        },
        error: function (xhr, status, code) {
            $("#deletePartModalNoButton").click();
            showElement("#errorMessageContainer");
            hideElement('#addPartContainer');
            hideElement('#partsListingContainer');
            if(xhr.status == 404 || xhr.status == 400) {
                $("#errorMessage").append(JSON.parse(xhr.responseText).errorMessage);
                return;
            }
            $("#errorMessage").append("Cannot connect to server");
        }
    })
}
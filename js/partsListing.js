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
            $("#errorMessage").append("Cannot connect to server.");
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
        tableRow += '<td><a href="edit.html?id=' + part.id + '"><button type="button" class="btn btn-outline-warning btn-rounded" data-mdb-ripple-color="light">Edit</button></a> <button type="button" class="btn btn-outline-danger btn-rounded" data-mdb-ripple-color="light" onclick="deleteProduct(' + part.id + ')">Delete</button> <a href="sell.html?id='+ part.id + '"> <button type="button" class="btn btn-outline-success btn-rounded" data-mdb-ripple-color="light">Sell</button></a></td>';
        tableRow += "</tr>";
        $("#partsListingTableContent").append(tableRow);
    }
}

function deleteProduct(id) {
    console.log(id);
}
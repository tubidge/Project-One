// API KEYS
// ===============================
const apiKey = "2b234cc922a51464a58cf79b75660ac3f3e79eea2715849b5b48ea92fcb9901f";
const numbers = ["one", "two", "three", "four", "five"]
// queryURL for Giphy API
var queryURLBase = `https://api.unsplash.com/search/photos?client_id=${apiKey}`;

function runQuery(queryURL) {
    // AJAX function
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (res) {
        console.log(res);
        for (var i = 0; i < numbers.length; i++) {
            var src = res.results[i].urls.small;
            var newImage = $(`<img src="${src}">`);
            newImage.css('height', '300px')
            $(`#${numbers[i]}`).html(newImage);

        };
        $('#results-card').css('display', 'block')
    });

};

runQuery(queryURLBase);

$("#search-location").on("click", function () {
    // Search parameters
    var city = $("#city").val().trim();
    var country = $("#country").val().trim();
    var search = `${city},${country}`;
    var newURL = `${queryURLBase}&query=${search}`;
    runQuery(newURL);
});

// FUNCTIONS
// ===============================

// MAIN PROCESS
// ===============================

$(document).ready(function () {
    $('.carousel').carousel();
    $('.collapsible').collapsible();
})
// API KEYS
// ===============================
// unsplash
const apiKey = "2b234cc922a51464a58cf79b75660ac3f3e79eea2715849b5b48ea92fcb9901f";

// API - unsplash: pulls images based on search terms
const numbers = ["one", "two", "three", "four", "five"];
var queryURLBase = `https://api.unsplash.com/search/photos?client_id=${apiKey}`;

// FUNCTIONS
// ===============================
function runQuery(queryURL) {
    // AJAX function
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (res) {
        for (var i = 0; i < numbers.length; i++) {
            var src = res.results[i].urls.small;
            var newImage = $(`<img src="${src}">`);
            newImage.css('height', '300px')
            $(`#${numbers[i]}`).html(newImage);
        };
        $('#results-card').css('display', 'block')
    });
};

function runQuery2(queryURL) {
    // AJAX function
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (res) {
        console.log(res[0]);
        // Set variables
        var capital = res[0].capital;
        var language = res[0].languages[0].name;
        var currency = res[0].currencies[0].name;
        var population = res[0].population;
        var newPop = parseFloat(population).toLocaleString('en')
        // Update HTML
        $("#info").html(`
        <p>Capital: ${capital}</p>
        <p>Language: ${language}</p>
        <p>Currency: ${currency}</p>
        <p>Population: ${newPop}</p>
        `);
    });
};

// MAIN PROCESS
// ===============================
$('#search-location').on('click', function () {
    // Search parameters
    var city = $('#city').val().trim();
    var country = $('#country').val().trim();
    var search = `${city},${country}`;
    var newURL = `${queryURLBase}&query=${search}`;
    // pulls images from unsplash API
    runQuery(newURL);

    // API - restcountries: pulls basic info about country
    var queryURL2 = `https://restcountries.eu/rest/v2/name/${country}`;
    // pulls info from rest countries API
    runQuery2(queryURL2);
});

$(document).ready(function () {
    $('.carousel').carousel();
    $('.collapsible').collapsible();
})
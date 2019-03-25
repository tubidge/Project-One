// SETUP VARIABLES
// ===============================
// Top 30 countries visited
var countries = ["france", "united states", "usa", "spain", "china", "italy", "united kingdom", "germany", "mexico", "thailand", "turkey", "austria", "malaysia", "hong kong", "greece", "russia", "japan", "canada", "saudi arabia", "poland", "south korea", "netherlands", "macao", "hungary", "united arab emirates", "india", "croatia", "ukraine", "singapore", "indonesia", "czech republic"];

// API keys
const apiKeyUn = "2b234cc922a51464a58cf79b75660ac3f3e79eea2715849b5b48ea92fcb9901f"; // Unsplash
const clientID = "L3RXDSOLTBMHGMY1AUZ20JLONBYUQU5WWAD4JWLIW2JHYDXK"; // Foursquare
const clientIDSec = "XKRLZ531CQ0FC334PIBNNDQRER5PGCR0AQCNJRZ4EH1WSMNR"; // Foursquare

// Base URLs
var queryURLBase = `https://api.unsplash.com/search/photos?client_id=${apiKeyUn}`; // Unsplash
var queryURLBase2 = `https://restcountries.eu/rest/v2/name/`; // Rest Countries
var queryURLBase3 = `https://api.foursquare.com/v2/venues/explore?section=topPicks&client_id=${clientID}&client_secret=${clientIDSec}&v=20180323`; // Foursquare

// FUNCTIONS
// ===============================
// Render images
function runQuery(queryURL) {
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (res) {
		console.log(`Images: ${queryURL}`);
		// Array to add id each image
		const numbers = ["one", "two", "three", "four", "five"];
		
        for (var i = 0; i < numbers.length; i++) {
			// Brings in an image with a width of 400px
            var src = res.results[i].urls.small;
            var newImage = $(`<img src="${src}">`);
			// This is squeezing the image, need to fix, figure out how to crop the image
            newImage.css('height', '300px')
            $(`#${numbers[i]}`).html(newImage);
        };
		
        $('#results-card').css('display', 'block')
    });
};

// Render country information
function runQuery2(queryURL) {
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (res) {
		console.log(`Information: ${queryURL}`);
        var capital = res[0].capital;
        var language = res[0].languages[0].name;
        var currency = res[0].currencies[0].name;
        var population = res[0].population;
        var newPop = parseFloat(population).toLocaleString('en')

        $("#info").html(`
		<h5>Information</h5>
        <p><strong>Language:</strong> ${language}</p>
        <p><strong>Currency:</strong> ${currency}</p>
        <p><strong>Population:</strong> ${newPop}</p>
        `);
    });
};

// Render popular places
function runQuery3(queryURL) {
	$.ajax({
		url: queryURL,
		method: "GET"
	}).then(function (res) {
		console.log(`Places: ${queryURL}`);
		var venues = res.response.groups[0].items;
		$("#info").append(`<h5>Popular Places</h5>`);
		
		for (var i = 0; i < venues.length; i ++) {
			var name = venues[i].venue.name;
			var venueID = venues[i].venue.id;
			var category = venues[i].venue.categories[0].name;
			var newPlace = $("<p>");
			var newPlaceLink = $("<a>");
			newPlaceLink.addClass("place");
			newPlaceLink.attr("data-name", name);
			newPlaceLink.attr("data-id", venueID);
			newPlaceLink.attr("href", `https://www.google.com/search?source=hp&ei=IECZXL2eN43J0PEPk9KM6Ak&q=${name}`);
			newPlaceLink.text(`${name} - ${category}`);
			newPlace.html(newPlaceLink);
			$("#info").append(newPlace);
		};
	});
};

// MAIN PROCESS
// ===============================
$('#search-location').on('click', function () {
    // Search parameters
    var city = $('#city').val().trim();
    var country = $('#country').val().trim();
    var search = `${city},${country}`;
    var queryURL = `${queryURLBase}&query=${search}`;
	
	// Validate country input
	if (countries.indexOf(country) === -1) {
		alert("Sorry, that's not a country in our database :/");
		$("#country").val("");
		return false;
	};
	
	// Run queries
    runQuery(queryURL);
    var queryURL2 = queryURLBase2 + country;
    runQuery2(queryURL2);
	var queryURL3 = queryURLBase3 + "&near=" + search + "&limit=3";
	runQuery3(queryURL3);
});

$(document).ready(function () {
    $('.carousel').carousel();
    $('.collapsible').collapsible();
})
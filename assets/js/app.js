$(document).ready(function () {
	M.AutoInit();

	// SETUP VARIABLES
	// ===============================
	// Top 30 countries visited
	var countries = ["france", "united states", "usa", "spain", "china", "italy", "united kingdom", "germany", "mexico", "thailand", "turkey", "austria", "malaysia", "hong kong", "greece", "russia", "japan", "canada", "saudi arabia", "poland", "south korea", "netherlands", "macao", "hungary", "united arab emirates", "india", "croatia", "ukraine", "singapore", "indonesia", "czech republic"];
	var city;
	var country;
	var search;
	var queryURL;

	// API keys
	const apiKey = "2b234cc922a51464a58cf79b75660ac3f3e79eea2715849b5b48ea92fcb9901f"; // Unsplash
	const clientID = "L3RXDSOLTBMHGMY1AUZ20JLONBYUQU5WWAD4JWLIW2JHYDXK"; // Foursquare
	const clientIDSec = "XKRLZ531CQ0FC334PIBNNDQRER5PGCR0AQCNJRZ4EH1WSMNR"; // Foursquare

	// Base URLs
	var queryURLBase = `https://api.unsplash.com/search/photos?client_id=${apiKey}`; // Unsplash
	var queryURLBase2 = `https://restcountries.eu/rest/v2/name/`; // Rest Countries
	var queryURLBase3 = `https://api.foursquare.com/v2/venues/explore?client_id=${clientID}&client_secret=${clientIDSec}&v=20180323&limit=5`

	// FUNCTIONS
	// ===============================
	// Render images
	function runQuery(queryURL) {
		$.ajax({
			url: queryURL,
			method: "GET"
		}).then(function (res) {
			console.log(`Images: ${queryURL}`);
			// Array to add id to each image
			const numbers = ["one", "two", "three", "four", "five"];
			
			for (var i = 0; i < numbers.length; i++) {
				// Brings in an image with a width of 400px
				var src = res.results[i].urls.small;
				var newImage = $(`<img src="${src}">`);
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
			<h5>Country Information</h5>
			<p><strong>Capital:</strong> ${capital}</p>
			<p><strong>Language:</strong> ${language}</p>
			<p><strong>Currency:</strong> ${currency}</p>
			<p><strong>Population:</strong> ${newPop}</p>
			`);
		});
	};

	// Render places
	function runQuery3(queryURL) {
		$.ajax({
			url: queryURL,
			method: "GET"
		}).then(function (res) {
			console.log(`Places: ${queryURL}`);
			var venues = res.response.groups[0].items;
			for (var i = 0; i < venues.length; i ++) {
				var name = venues[i].venue.name;
				var venueID = venues[i].venue.id;
				var category = venues[i].venue.categories[0].name;
				var newPlace = $("<p>");
				var newPlaceLink = $("<a>");
				newPlaceLink.addClass("place");
				newPlaceLink.attr("target", "_blank");
				newPlaceLink.attr("data-name", name);
				newPlaceLink.attr("data-id", venueID);
				newPlaceLink.attr("href", `https://www.google.com/search?source=hp&ei=IECZXL2eN43J0PEPk9KM6Ak&q=${name}`);
				newPlaceLink.text(`${name} - ${category}`);
				newPlace.html(newPlaceLink);
				$("#places").append(newPlace);
			};
		});
	};

// MAIN PROCESS
// ===============================
	$('#search-location').on('click', function () {
		$("#places").empty();
		
		// Search parameters
		city = $('#city').val().trim();
		country = $('#country').val().trim();
		search = `${city},${country}`;
		queryURL = `${queryURLBase}&query=${search}`;
		
		// Validate country input
		if (countries.indexOf(country) === -1) {
			M.toast({html: "Sorry, that's not a country in our database :/"})
			$("#country").val("");
			return false;
		};
	
		// Run queries
		runQuery(queryURL);
		var queryURL2 = queryURLBase2 + country;
		runQuery2(queryURL2);
	});
		
	// Get selected section
	$(document).on("change", "#sections", function () {
		var sel = $("#sections");
		var opt = sel[0].options;
		var length = opt.length;
		$("#places").empty();
		for (var i = 0; i < length; i++) {
			selected = opt[i].value;
			if (opt[i].selected === true) {
					var currentSection = opt[i].value;
					// Render list of places
					city = $('#city').val().trim();
					country = $('#country').val().trim();
					search = `${city},${country}`;
					queryURL = `${queryURLBase}&query=${search}`;
					var section = currentSection;
					var queryURL3 = queryURLBase3 + "&near=" + search + "&section=" + section;
					runQuery3(queryURL3);
				};
			};
	});
});

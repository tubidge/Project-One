$(document).ready(function () {
	M.AutoInit();
	
	$('.slider').slider({
		interval: 2800,
		duration: 700,
		indicators: false,
	});
	
	$(".carousel").hide();
	$("#results-card").hide();
	$("#display-places").hide();

	// SETUP VARIABLES
	// ===============================
	var city;
	var park;
	var search;
	var queryURL;

	// API keys
	const apiKey = "2b234cc922a51464a58cf79b75660ac3f3e79eea2715849b5b48ea92fcb9901f"; // Unsplash
	const clientID = "L3RXDSOLTBMHGMY1AUZ20JLONBYUQU5WWAD4JWLIW2JHYDXK"; // Foursquare
	const clientIDSec = "XKRLZ531CQ0FC334PIBNNDQRER5PGCR0AQCNJRZ4EH1WSMNR"; // Foursquare
	const parksKey = 'ijY3T1c8GJfW6s8gD4MAUVZYbfM7hnEnGNoxpOet'; // National parks

	// Base URLs
	var queryURLBase = `https://api.unsplash.com/search/photos?client_id=${apiKey}`; // Unsplash
	var queryURLBase2 = `https://api.foursquare.com/v2/venues/explore?client_id=${clientID}&client_secret=${clientIDSec}&v=20180323&limit=5`
	var queryURLBase3 = `https://developer.nps.gov/api/v1/parks?api_key=${parksKey}`;

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
			
			$("#results-card").show();

		});
	};

	// Render places
	function runQuery2(queryURL) {
		$.ajax({
			url: queryURL,
			method: "GET"
		}).then(function (res) {
			console.log(`Places: ${queryURL}`);
			$("#display-places").show();
			var venues = res.response.groups[0].items;
			for (var i = 0; i < venues.length; i++) {
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

	// Render national park info
	function runQuery3(queryURL) {
		$.ajax({
			url: queryURL,
			method: "GET",
		}).then(function (res) {
			console.log(res);
			var results = res.data;
			var length = results.length
			for (var i = 0; i < length; i++) {
				var currentResult = results[i];
				console.log(currentResult.name.toLowerCase())
				if (currentResult.name.toLowerCase() === park || currentResult.fullName.toLowerCase() === park) {
					var description = $('<p>').text(currentResult.description);
					var directions = $('<p>').text(currentResult.directionsInfo)
					$('#weather').append(currentResult.weatherInfo);
					$('#info').append(description).append(directions);
				}
			};
		});
	};

	$(".start-btn").on("click", function () {
		$(".card").css("display", "block");
		$(".slider").empty();
	});
	
	// MAIN PROCESS
	// ===============================
	$('#search-cities').on('click', function () {
		$(".carousel").show();
		$("#weather").empty();
		$("#info").empty();
		$("#places").empty();
		$("#display-places").show();
		// Search parameters
		city = $('#city').val().trim();
		state = $('#state').val().trim();
		search = (`${city},${state}`);
		queryURL = `${queryURLBase}&query=${search}`;
		// Run queries
		runQuery(queryURL);
	});

	$('#search-parks').on('click', function () {
		$(".carousel").show();
		$("#places").empty();
		$("#display-places").hide();
		$("#info").show();
		park = $("#parks").val().trim();
		var parkInfoURL = `${queryURLBase3}&q=${park}`;
		var parkImageURL = `${queryURLBase}&query=${park}`;
		runQuery3(parkInfoURL);
		runQuery(parkImageURL);
		$("#parks").val('');
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
				var city = $('#city').val().trim();
				var state = $('#state').val().trim();
				var search = (`${city},${state}`);
				var section = currentSection;
				var queryURL2 = queryURLBase2 + "&near=" + search + "&section=" + section;
				runQuery2(queryURL2);
			};
		};
	});
	
	$('#cities-start').click(function () {
		$('#start-buttons').addClass('hide');
		$('#city-search').removeClass('hide');
		$('#backCurrent').removeClass('orange accent-4')
		$('#backCurrent').addClass('deep-purple darken-4')
		$('#back-button').removeClass('hide')
	});

	$('#parks-start').click(function () {
		$('#start-buttons').addClass('hide');
		$('#parks-search').removeClass('hide');
		$('#backCurrent').removeClass('deep-purple darken-4')
		$('#backCurrent').addClass('orange accent-4')
		$('#back-button').removeClass('hide')
	});

	$(document).on('click', '#back-button', function () {
		$('#start-buttons').removeClass('hide');
		$('#parks-search').addClass('hide');
		$('#city-search').addClass('hide');
		$('#back-button').addClass('hide');
		$(".carousel").hide();
		$("#results-card").hide();
		$("#info").empty();
		$("#weather").empty();
		$('#city').val('');
		$('#state').val('');
	});
});
$(document).ready(function () {
	M.AutoInit();

	// INITIAL DISPLAY
	// ===============================
	$('.slider').slider({
		interval: 2800,
		duration: 700,
		indicators: false,
	});

	// Hide until cities or park search buttons clicked
	$('.carousel').hide();
	$('#results-card').hide();
	// Hide until cities search button clicked
	$('#display-places').hide();

	// SETUP VARIABLES
	// ===============================
	var city;
	var park;
	var search;
	var queryURL;

	// API keys
	const imageKey = '2b234cc922a51464a58cf79b75660ac3f3e79eea2715849b5b48ea92fcb9901f'; // Unsplash
	const clientID = 'L3RXDSOLTBMHGMY1AUZ20JLONBYUQU5WWAD4JWLIW2JHYDXK'; // Foursquare
	const clientIDSec = 'XKRLZ531CQ0FC334PIBNNDQRER5PGCR0AQCNJRZ4EH1WSMNR'; // Foursquare
	const parksKey = 'ijY3T1c8GJfW6s8gD4MAUVZYbfM7hnEnGNoxpOet'; // National parks

	// Base URLs
	const queryURLBaseImages = `https://api.unsplash.com/search/photos?client_id=${imageKey}&page=1&per_page=30`; // Unsplash
	const queryURLBasePlaces = `https://api.foursquare.com/v2/venues/explore?client_id=${clientID}&client_secret=${clientIDSec}&v=20180323`; // Foursquare
	const queryURLBaseParks = `https://developer.nps.gov/api/v1/parks?api_key=${parksKey}`; // National parks

	// FUNCTIONS
	// ===============================
	// Render images
	function runQueryImages(queryURL) {
		$.ajax({
			url: queryURL,
			method: 'GET'
		}).then(function (res) {
			console.log(`Images: ${queryURL}`);
			// Array to add id to each image
			const numbers = ['one', 'two', 'three', 'four', 'five'];
			for (var i = 0; i < numbers.length; i++) {
				// Loads in an image 400px width
				var src = res.results[i].urls.small;
				var newImage = $(`<img src="${src}">`);
				$(`#${numbers[i]}`).html(newImage);
			};
			$('#results-card').show();
		});
	};

	// Render list of places
	function runQueryPlaces(queryURL) {
		$.ajax({
			url: queryURL,
			method: 'GET'
		}).then(function (res) {
			console.log(`Places: ${queryURL}`);
			$('#display-places').show();
			var venues = res.response.groups[0].items;
			for (var i = 0; i < venues.length; i++) {
				var name = venues[i].venue.name;
				var venueID = venues[i].venue.id;
				var category = venues[i].venue.categories[0].name;
				console.log(venueID);
				var newPlace = $('<p>');
				var newPlaceLink = $('<a>');
				newPlaceLink.addClass('place');
				newPlaceLink.attr('target", "_blank');
				newPlaceLink.attr('data-name', name);
				newPlaceLink.attr('data-id', venueID);
				newPlaceLink.attr('href', `https://www.google.com/search?source=hp&ei=IECZXL2eN43J0PEPk9KM6Ak&q=${name}`);
				newPlaceLink.text(`${name} - ${category}`);
				newPlace.html(newPlaceLink);
				$('#places').append(newPlace);
			};
		});
	};

	// Render national park info
	function runQueryParksAll(queryURL) {
		$.ajax({
			url: queryURL,
			method: 'GET',
		}).then(function (res) {
			for (var i = 0; i < res.data.length; i++) {
				console.log(res.data[i].name);
			};
		});
	};

	function runQueryParks(queryURL) {
		$.ajax({
			url: queryURL,
			method: 'GET',
		}).then(function (res) {
			console.log(queryURL);
			var results = res.data;
			var length = results.length
			for (var i = 0; i < length; i++) {
				var currentResult = results[i];
				console.log(currentResult.name.toLowerCase());
				if (currentResult.name.toLowerCase() === park || currentResult.fullName.toLowerCase() === park) {
					var description = $('<p>').text(currentResult.description);
					var directions = $('<p>').text(currentResult.directionsinfo);
					$('#weather').append(currentResult.weatherinfo);
					$('#park-info').append(description).append(directions);
				};
			};
		});
	};

	// MAIN PROCESS
	// ===============================
	// Display city and park search options and hide slider
	$('.start-btn').on('click', function () {
		$('.card').css('display', 'block');
		$('.slider').empty();
		$('#main-content').css('display', 'block');
	});

	$('#search-cities').on('click', function () {
		goodImages = [];
		// Display images
		$('.carousel').show();

		// Empty information from previous searches
		$('#weather').empty();
		$('#park-info').empty();
		$('#places').empty();

		// Display list of places
		$('#display-places').show();

		// Search parameters
		city = $('#city').val().trim();
		state = $('#state').val().trim();
		search = (`${city}%20${state}`);
		queryURL = `${queryURLBaseImages}&query=${search}`;

		runQueryImages(queryURL);
	});

	$('#search-parks').on('click', function () {
		// Display images
		$('.carousel').show();

		// Empty information from previous searches
		$('#places').empty();

		// Hide list of places
		$('#display-places').hide();
		$('#park-info').show();
		park = $("#parks").val().trim();

		var parkInfoURL = `${queryURLBaseParks}&q=${park}`;
		var parkImageURL = `${queryURLBaseImages}&query=${park}%20national%20park`;

		runQueryParks(parkInfoURL);
		runQueryImages(parkImageURL);

		$('#parks').val('');
	});

	// Get selected section
	$(document).on('change', '#sections', function () {
		var sel = $('#sections');
		var opt = sel[0].options;
		var length = opt.length;
		$('#places').empty();
		for (var i = 0; i < length; i++) {
			selected = opt[i].value;
			if (opt[i].selected === true) {
				var currentSection = opt[i].value;
				// Render list of places
				var city = $('#city').val().trim();
				var state = $('#state').val().trim();
				var search = (`${city},${state}`);
				var section = currentSection;
				var queryURLSelected = queryURLBasePlaces + '&near=' + search + '&section=' + section + '&limit=5';
				runQueryPlaces(queryURLSelected);
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

	// Clear everything when back button clicked
	$(document).on('click', '#back-button', function () {
		$('#start-buttons').removeClass('hide');
		$('#parks-search').addClass('hide');
		$('#city-search').addClass('hide');
		$('#back-button').addClass('hide');
		$('.carousel').hide();
		$('#results-card').hide();
		$('#park-info').empty();
		$('#weather').empty();
		$('#city').val('');
		$('#state').val('');
	});
});
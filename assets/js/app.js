$(document).ready(function () {
	M.AutoInit();

	// INITIAL DISPLAY
	// ===============================
	$('.slider').slider({
		interval: 2800,
		duration: 700,
		indicators: false,
	});
	
	$('input.autocomplete').autocomplete({
		data: {
			"AL": null,
			"AK": null,
			"AZ": null,
			"AR": null,
			"CA": null,
			"CO": null,
			"CT": null,
			"DE": null,
			"FL": null,
			"GA": null,
			"HI": null,
			"ID": null,
			"IL": null,
			"IN": null,
			"IA": null,
			"KS": null,
			"KY": null,
			"LA": null,
			"ME": null,
			"MD": null,
			"MA": null,
			"MI": null,
			"MN": null,
			"MS": null,
			"MO": null,
			"MT": null,
			"NE": null,
			"NV": null,
			"NH": null,
			"NJ": null,
			"NM": null,
			"NY": null,
			"NC": null,
			"ND": null,
			"OH": null,
			"OK": null,
			"OR": null,
			"PA": null,
			"RI": null,
			"SC": null,
			"SD": null,
			"TN": null,
			"TX": null,
			"UT": null,
			"VT": null,
			"VA": null,
			"WA": null,
			"WV": null,
			"WI": null,
			"WY": null,
			"DC": null,
			"PR": null,
		},
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
	
	// Data Validation
	var states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC", "PR"]

	// API keys
	const imageKey = '2b234cc922a51464a58cf79b75660ac3f3e79eea2715849b5b48ea92fcb9901f'; // Unsplash
	const clientID = 'L3RXDSOLTBMHGMY1AUZ20JLONBYUQU5WWAD4JWLIW2JHYDXK'; // Foursquare
	const clientIDSec = 'XKRLZ531CQ0FC334PIBNNDQRER5PGCR0AQCNJRZ4EH1WSMNR'; // Foursquare
	const parksKey = 'ijY3T1c8GJfW6s8gD4MAUVZYbfM7hnEnGNoxpOet'; // National parks

	// Base URLs
	const queryURLBaseImages = `https://api.unsplash.com/search/photos?client_id=${imageKey}&page=1&per_page=30&orientation=landscape`; // Unsplash
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
			const numbers = ['one', 'two', 'three'];
			var images = [];
			var goodImages = [];
			
			for (var i = 0; i < res.results.length; i++) {
				var src = res.results[i].urls.small;
				var likes = res.results[i].user.total_likes;
				var tags = res.results[i].tags; 
				var photoTags = res.results[i].photo_tags;
				
				if (likes > 0) {
					for (var j = 0; j < tags.length; j++) { 
						var tag = tags[j].title; 
						
						city = $('#city').val().trim();  
						state = $('#state').val().trim();
						
						if (tag === city || tag === "city" || tag === "mountains" || tag === "beach" || tag === "snow" || tag === "cityscape" || tag === "skyline" || tag === "landscape" || tag === "ocean" || tag === "lights" || tag === "downtown" || tag === "building" || tag === "theme park" || tag === "sunset" || tag === "architecture" || tag == "state") {
							if (images.indexOf(src) === -1) {	
									images.push(src);
								}
							};
						};
					for (var k = 0; k < photoTags.length; k++) { 
						var photoTag = photoTags[k].title; 
						
						if (photoTag === "person" || photoTag === "human" || photoTag === "street sign" || photoTag === "traffic") {
							var index = images.indexOf(src);
							images.splice(index, 1);
						};
					};
				};
			};
			for (var i = 0; i < numbers.length; i++) {
				var newImage = $(`<img src="${images[i]}">`);
				$(`#${numbers[i]}`).html(newImage);
			};
			console.log(images);
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

	// Search cities and states
	$('#search-cities').on('click', function () {
		// Empty information from previous searches
		$('#weather').empty();
		$('#park-info').empty();
		$('#places').empty();

		// Display list of places
		$('#display-places').show();

		// Search parameters		
		var city = $('#city').val().trim();  
		city = city.replace(/ /g, "%20");  
		state = $('#state').val().trim();
		state = state.toUpperCase();
		if (states.indexOf(state) === -1) {
			M.toast({html: "That's not a valid state"})
		} else {
			// Display images
			$('.carousel').show();
			search = (`${city}%20${state}`);
			queryURL = `${queryURLBaseImages}&query=${search}`;
			runQueryImages(queryURL);
		};
	});
	
	// Search national parks
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
				city = city.replace(/ /g, "%20"); 
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
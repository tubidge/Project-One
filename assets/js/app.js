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
    var key = "fe8bb39cf6f11fec454d5ca72722773e";
    var hikesKey = '200439802-40135efa1850c123fbd61e5f8746dc12';
    var forecastApiResponse = {};
    var windDirection = "";
    var parkResults = true;
    const numbers = ['one', 'two', 'three'];
    var hikingTrails = [];
    // Data Validation
    var states = [
        "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC", "PR"
    ];
    // API keys
    const imageKey = '2b234cc922a51464a58cf79b75660ac3f3e79eea2715849b5b48ea92fcb9901f'; // Unsplash
    const clientID = 'L3RXDSOLTBMHGMY1AUZ20JLONBYUQU5WWAD4JWLIW2JHYDXK'; // Foursquare
    const clientIDSec = 'XKRLZ531CQ0FC334PIBNNDQRER5PGCR0AQCNJRZ4EH1WSMNR'; // Foursquare
    const parksKey = 'ijY3T1c8GJfW6s8gD4MAUVZYbfM7hnEnGNoxpOet'; // National parks
    // Base URLs
    const queryURLBaseImages = `https://api.unsplash.com/search/photos?client_id=${imageKey}&orientation=landscape&per_page=30`; // Unsplash
    const queryURLBasePlaces = `https://api.foursquare.com/v2/venues/explore?client_id=${clientID}&client_secret=${clientIDSec}&v=20180323`; // Foursquare
    const queryURLBaseParks = `https://developer.nps.gov/api/v1/parks?api_key=${parksKey}`; // National parks
    // FUNCTIONS
    // ===============================
    // Set Timeout
    function parkSearchTimeout() {
        console.log(parkResults)
        $('#image-card').hide();
        if (parkResults) {
            $('.helper-text').attr('data-success', '');
            $('#image-card').show();
            $("#parks").val('');
        } else {
            $('#parks').addClass('invalid')
            $('.helper-text').attr('data-error', 'No Results Found')
            $("#parks").val('');
        };
    };
    // Render images
    function runQueryImages(queryURL) {
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function (res) {
            var images = [];
            console.log(`Images: ${queryURL}`);
            // Array to add id to each image
            city = $('#city').val().trim();
            state = $('#state').val().trim();
            for (var i = 0; i < res.results.length; i++) {
                var src = res.results[i].urls.small;
                var likes = res.results[i].user.total_likes;
                var tags = res.results[i].tags;
                var photoTags = res.results[i].photo_tags;
                if (images.length < numbers.length) {
                    if (likes > 0) {
                        for (var j = 0; j < tags.length; j++) {
                            var tag = tags[j].title;
                            if (tag === city || tag === "usa" || tag === "resort" || tag === "nature" || tag === "city" || tag === "mountains" || tag === "snow" || tag === "cityscape" || tag === "skyline" || tag === "landscape" || tag === "downtown" || tag === "theme park" || tag === "park") {
                                if (images.indexOf(src) === -1) {
                                    images.push(src);
                                };
                            };
                        };
                        for (var k = 0; k < photoTags.length; k++) {
                            var photoTag = photoTags[k].title;
                            if (photoTag === "person" || photoTag === "man" || photoTag === "bird" || photoTag === "woman" || photoTag === "face" || photoTag === "old" || photoTag === "human" || photoTag === "sign" || photoTag === "traffic" || photoTag === "animal") {
                                var index = images.indexOf(src);
                                images.splice(index, 1);
                            };
                        };
                    };
                };
            };
            if (images.length < numbers.length) {
                console.log("not enough images");
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
    function runQueryParks(queryURL, queryURL2) {
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (res) {
            console.log(res);
            parkResults = true;
            console.log(parkResults)
            var results = res.data;
            var length = results.length;
            // added a if/then statement to check and make sure we get a proper ajax response
            if (length == 0) {
                parkResults = false;
                console.log(parkResults)
                $('#results-card').css('display', 'none');
                parkSearchTimeout()
            } else {
                parkSearchTimeout()
                runQueryImages(queryURL2)
                for (var i = 0; i < length; i++) {
                    var currentResult = results[i];
                    console.log(currentResult.name.toLowerCase())
                    console.log(park)
                    console.log(currentResult.fullname.toLowerCase())
                    if (currentResult.name.toLowerCase() === park || currentResult.fullname.toLowerCase() === park) {
                        console.log('working')
                        console.log(currentResult.description)
                        console.log(currentResult.directionsinfo)
                        console.log(currentResult.weatherinfo)
                        var description = $('<p>').text(currentResult.description);
                        var directions = $('<p>').text(currentResult.directionsinfo)
                        console.log(description);
                        console.log(directions);
                        $("#general-weather").empty();
                        $("#park-info").empty();
                        $("#general-weather").append(currentResult.weatherinfo);
                        $('#park-info').append(description).append(directions);
                    };
                };
                // Weather Forecast API call for national Parks

                var latLong = results[0].latlong.split(", ");

                var lat = Math.floor(latLong[0].slice(4, -1));
                var long = Math.floor(latLong[1].slice(5, -1));



                var queryURL =
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=imperial&appid=${key}`;
                var encodeURL = encodeURI(queryURL);
                console.log(encodeURL);
                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).then(function (response) {
                    console.log(response)
                    $('#weather').empty()
                    // Create a table to hold weather data on page.
                    var table = $("#weather");
                    // Adding temperature to page.
                    var currentTemp = $("<tr>").text(`Current Temperature: ${response.main.temp} F`);
                    table.append(currentTemp);
                    // Adding wind speed to page.
                    var windSpeed = $("<tr>").text(`Wind Speed: ${response.wind.speed} mph`);
                    table.append(windSpeed);
                    // Calling function to calculate wind direction.
                    calcWindDir(response.wind.deg);
                    // Adding wind direction to page.
                    var windDir = $("<tr>").text(`Wind Direction: ${windDirection}`);
                    table.append(windDir);
                    // Adding humidity to page.
                    var humid = $("<tr>").text(`Humidity: ${response.main.humidity}%`);
                    table.append(humid);

                });

                // Forecast Call

                var forecastURL =
                    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=imperial&appid=${key}`;
                var encodeURL = encodeURI(forecastURL);
                console.log(encodeURL)
                $.ajax({
                    url: forecastURL,
                    method: "GET"
                }).then(function (results) {
                    $('#row1, #row2, #row3, #row4, #row5, #row6').empty();
                    forecastApiResponse = results;
                    console.log(`Forecast Response: ${forecastApiResponse}`);
                    var day1 = forecastApiResponse.list[5];
                    var day2 = forecastApiResponse.list[13];
                    var day3 = forecastApiResponse.list[21];
                    var day4 = forecastApiResponse.list[29];
                    var day5 = forecastApiResponse.list[37];

                    $("#row1").html("<th> 5 Day Forecast </th>");

                    var row2 = $("#row2");
                    var day1Date = $("<th>").text(moment.unix(day1.dt).format("MMM Do YYYY"));
                    var day2Date = $("<th>").text(moment.unix(day2.dt).format("MMM Do YYYY"));
                    var day4Date = $("<th>").text(moment.unix(day4.dt).format("MMM Do YYYY"));
                    var day3Date = $("<th>").text(moment.unix(day3.dt).format("MMM Do YYYY"));
                    var day5Date = $("<th>").text(moment.unix(day5.dt).format("MMM Do YYYY"));
                    row2.append(day1Date);
                    row2.append(day2Date);
                    row2.append(day3Date);
                    row2.append(day4Date);
                    row2.append(day5Date);

                    var row3 = $("#row3");
                    var day1Temp = $("<td>").text(`Temperature: ${day1.main.temp}`)
                    var day2Temp = $("<td>").text(`Temperature: ${day2.main.temp}`);
                    var day3Temp = $("<td>").text(`Temperature: ${day3.main.temp}`);
                    var day4Temp = $("<td>").text(`Temperature: ${day4.main.temp}`);
                    var day5Temp = $("<td>").text(`Temperature: ${day5.main.temp}`);
                    row3.append(day1Temp);
                    row3.append(day2Temp);
                    row3.append(day3Temp);
                    row3.append(day4Temp);
                    row3.append(day5Temp);

                    var row4 = $("#row4");
                    var day1WindSpeed = $("<td>").text(`Wind Speed: ${day1.wind.speed} mph`);
                    var day2WindSpeed = $("<td>").text(`Wind Speed: ${day2.wind.speed} mph`);
                    var day3WindSpeed = $("<td>").text(`Wind Speed: ${day3.wind.speed} mph`);
                    var day4WindSpeed = $("<td>").text(`Wind Speed: ${day4.wind.speed} mph`);
                    var day5WindSpeed = $("<td>").text(`Wind Speed: ${day5.wind.speed} mph`);
                    row4.append(day1WindSpeed);
                    row4.append(day2WindSpeed);
                    row4.append(day3WindSpeed);
                    row4.append(day4WindSpeed);
                    row4.append(day5WindSpeed);

                    var row5 = $("#row5");
                    calcWindDir(day1.wind.deg);
                    var day1WindDir = $("<td>").text(`Wind Direction: ${windDirection}`);
                    calcWindDir(day2.wind.deg);
                    var day2WindDir = $("<td>").text(`Wind Direction: ${windDirection}`);
                    calcWindDir(day3.wind.deg);
                    var day3WindDir = $("<td>").text(`Wind Direction: ${windDirection}`);
                    calcWindDir(day4.wind.deg);
                    var day4WindDir = $("<td>").text(`Wind Direction: ${windDirection}`);
                    calcWindDir(day5.wind.deg);
                    var day5WindDir = $("<td>").text(`Wind Direction: ${windDirection}`);
                    row5.append(day1WindDir);
                    row5.append(day2WindDir);
                    row5.append(day3WindDir);
                    row5.append(day4WindDir);
                    row5.append(day5WindDir);

                    var row6 = $("#row6");
                    var day1Humidity = $("<td>").text(`Humidity: ${day1.main.humidity}%`);
                    var day2Humidity = $("<td>").text(`Humidity: ${day2.main.humidity}%`);
                    var day3Humidity = $("<td>").text(`Humidity: ${day3.main.humidity}%`);
                    var day4Humidity = $("<td>").text(`Humidity: ${day4.main.humidity}%`);
                    var day5Humidity = $("<td>").text(`Humidity: ${day5.main.humidity}%`);
                    row6.append(day1Humidity);
                    row6.append(day2Humidity);
                    row6.append(day3Humidity);
                    row6.append(day4Humidity);
                    row6.append(day5Humidity);
                });

                // Hiking Trails Call

                var hikingURL = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${long}&maxDistance=100&key=${hikesKey}`;
                $.ajax({
                    url: hikingURL,
                    method: "GET"
                }).then(function (hike) {
                    console.log(hike);
                    var results = hike.trails;
                    hikingTrails = [];



                    for (i = 0; i < results.length; i++) {
                        var btn = $('<a>').addClass('waves-effect waves-light btn hike').text(results[i].name).css('display', 'block');
                        btn.attr('data-number', i)
                        $('#trails').append(btn)

                        var trail = results[i].name;
                        var trailPic = results[i].imgMedium;

                        var trailRating = results[i].stars;

                        var difficulty = results[i].difficulty;

                        var status = results[i].conditionStatus;

                        var description = results[i].summary;

                        var trailObject = {
                            trail: trail,
                            trailPic: trailPic,
                            trailRating: trailRating,
                            difficulty: difficulty,
                            status: status,
                            description: description

                        }

                        hikingTrails.push(trailObject);



                    }
                    console.log(hikingTrails)
                })
            };
        });
    };

    // START OF WEATHER API FUNCTIONS
    // Function to make current weather API call, then display current weather.
    function currentWeatherCall() {
        var queryURL =
            `https://api.openweathermap.org/data/2.5/weather?q=${city},usa&units=imperial&appid=${key}`;
        var encodeURL = encodeURI(queryURL);
        console.log(encodeURL);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            // Create a table to hold weather data on page.
            var table = $("#weather");
            // Adding temperature to page.
            var currentTemp = $("<tr>").text(`Current Temperature: ${response.main.temp} F`);
            table.append(currentTemp);
            // Adding wind speed to page.
            var windSpeed = $("<tr>").text(`Wind Speed: ${response.wind.speed} mph`);
            table.append(windSpeed);
            // Calling function to calculate wind direction.
            calcWindDir(response.wind.deg);
            // Adding wind direction to page.
            var windDir = $("<tr>").text(`Wind Direction: ${windDirection}`);
            table.append(windDir);
            // Adding humidity to page.
            var humid = $("<tr>").text(`Humidity: ${response.main.humidity}%`);
            table.append(humid);
        });
    };

    // Function to make weather forecast API call, then display forecast.
    function forecastCall() {
        var queryURL =
            `https://api.openweathermap.org/data/2.5/forecast?q=${city},usa&units=imperial&appid=${key}`;
        var encodeURL = encodeURI(queryURL);
        console.log(encodeURL)
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            forecastApiResponse = response;
            console.log(`Forecast Response: ${forecastApiResponse}`);
            var day1 = forecastApiResponse.list[5];
            var day2 = forecastApiResponse.list[13];
            var day3 = forecastApiResponse.list[21];
            var day4 = forecastApiResponse.list[29];
            var day5 = forecastApiResponse.list[37];

            $("#row1").html("<th> 5 Day Forecast </th>");

            var row2 = $("#row2");
            var day1Date = $("<th>").text(moment.unix(day1.dt).format("MMM Do YYYY"));
            var day2Date = $("<th>").text(moment.unix(day2.dt).format("MMM Do YYYY"));
            var day4Date = $("<th>").text(moment.unix(day4.dt).format("MMM Do YYYY"));
            var day3Date = $("<th>").text(moment.unix(day3.dt).format("MMM Do YYYY"));
            var day5Date = $("<th>").text(moment.unix(day5.dt).format("MMM Do YYYY"));
            row2.append(day1Date);
            row2.append(day2Date);
            row2.append(day3Date);
            row2.append(day4Date);
            row2.append(day5Date);

            var row3 = $("#row3");
            var day1Temp = $("<td>").text(`Temperature: ${day1.main.temp}`)
            var day2Temp = $("<td>").text(`Temperature: ${day2.main.temp}`);
            var day3Temp = $("<td>").text(`Temperature: ${day3.main.temp}`);
            var day4Temp = $("<td>").text(`Temperature: ${day4.main.temp}`);
            var day5Temp = $("<td>").text(`Temperature: ${day5.main.temp}`);
            row3.append(day1Temp);
            row3.append(day2Temp);
            row3.append(day3Temp);
            row3.append(day4Temp);
            row3.append(day5Temp);

            var row4 = $("#row4");
            var day1WindSpeed = $("<td>").text(`Wind Speed: ${day1.wind.speed} mph`);
            var day2WindSpeed = $("<td>").text(`Wind Speed: ${day2.wind.speed} mph`);
            var day3WindSpeed = $("<td>").text(`Wind Speed: ${day3.wind.speed} mph`);
            var day4WindSpeed = $("<td>").text(`Wind Speed: ${day4.wind.speed} mph`);
            var day5WindSpeed = $("<td>").text(`Wind Speed: ${day5.wind.speed} mph`);
            row4.append(day1WindSpeed);
            row4.append(day2WindSpeed);
            row4.append(day3WindSpeed);
            row4.append(day4WindSpeed);
            row4.append(day5WindSpeed);

            var row5 = $("#row5");
            calcWindDir(day1.wind.deg);
            var day1WindDir = $("<td>").text(`Wind Direction: ${windDirection}`);
            calcWindDir(day2.wind.deg);
            var day2WindDir = $("<td>").text(`Wind Direction: ${windDirection}`);
            calcWindDir(day3.wind.deg);
            var day3WindDir = $("<td>").text(`Wind Direction: ${windDirection}`);
            calcWindDir(day4.wind.deg);
            var day4WindDir = $("<td>").text(`Wind Direction: ${windDirection}`);
            calcWindDir(day5.wind.deg);
            var day5WindDir = $("<td>").text(`Wind Direction: ${windDirection}`);
            row5.append(day1WindDir);
            row5.append(day2WindDir);
            row5.append(day3WindDir);
            row5.append(day4WindDir);
            row5.append(day5WindDir);

            var row6 = $("#row6");
            var day1Humidity = $("<td>").text(`Humidity: ${day1.main.humidity}%`);
            var day2Humidity = $("<td>").text(`Humidity: ${day2.main.humidity}%`);
            var day3Humidity = $("<td>").text(`Humidity: ${day3.main.humidity}%`);
            var day4Humidity = $("<td>").text(`Humidity: ${day4.main.humidity}%`);
            var day5Humidity = $("<td>").text(`Humidity: ${day5.main.humidity}%`);
            row6.append(day1Humidity);
            row6.append(day2Humidity);
            row6.append(day3Humidity);
            row6.append(day4Humidity);
            row6.append(day5Humidity);
        });
    };

    // Function to calculate wind direction.
    function calcWindDir(deg) {
        // var deg = weatherApiResponse.wind.deg;
        if (deg <= 22.5 || deg >= 337.501) {
            windDirection = "N";
        } else if (deg >= 22.501 && deg <= 67.5) {
            windDirection = "NE";
        } else if (deg >= 67.501 && deg <= 112.5) {
            windDirection = "E";
        } else if (deg >= 112.501 && deg <= 157.5) {
            windDirection = "SE";
        } else if (deg >= 157.501 && deg <= 202.5) {
            windDirection = "S";
        } else if (deg >= 202.501 && deg <= 247.5) {
            windDirection = "SW";
        } else if (deg >= 247.501 && deg <= 292.5) {
            windDirection = "W";
        } else {
            windDirection = "NW";
        };
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
        $('#row1, #row2, #row3, #row4, #row5, #row6').empty();
        $('#park-info').empty();
        $('#places').empty();
        // Display list of places
        $('#display-places').show();
        // Search parameters        
        city = $('#city').val().trim();
        city = city.replace(/ /g, "%20");
        state = $('#state').val().trim();
        state = state.toUpperCase();
        if (states.indexOf(state) === -1) {
            M.toast({
                html: "That's not a valid state"
            })
        } else {
            // Display images
            $('.carousel').show();
            search = `${city}%20${state}`;
            queryURL = `${queryURLBaseImages}&query=${search}&page=1&per_page=30`;
            runQueryImages(queryURL);
            currentWeatherCall();
            forecastCall();
        };
    });
    // Search national parks
    $(document).on('click', '#search-parks', function () {
        $('.helper-text').attr('data-success', 'Searching...');
        $("#display-places").css("display", "none");
        park = $("#parks").val().trim().toLowerCase();
        var parkInfoURL = `${queryURLBaseParks}&q=${park}`;
        var parkImageURL = `${queryURLBaseImages}&query=${park}`;
        runQueryParks(parkInfoURL, parkImageURL);
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

    // Function to capture input, reset form, then call API function.
    $("#submit").on("click", function (event) {
        city = $("#city").val().trim();
        $("#input-form").each(function () {
            this.reset();
        });
        console.log(country, city);
        currentWeatherCall();
        forecastCall();
    });

    $(document).on('click', '.hike', function () {
        $('.trail-card').remove();
        var event = $(this).attr('data-number');
        console.log(hikingTrails[event]);
        var trail = hikingTrails[event];
        var trailCard = $('<div>').addClass('card trail-card');
        var trailImage = $('<div>').addClass('card-image');
        var trailPic = $('<img>');
        trailPic.attr('src', trail.trailPic)
        var title = $('<span>').addClass('card-title').text(trail.trail);
        trailImage.append(trailPic).append(title);
        trailCard.append(trailImage)
        var list = $('<ul>').css('margin-left', '2rem')
        var trailRating = $('<li>').text(`Average Rating: ${trail.trailRating}`)
        var difficulty = $('<li>').text(`Trail Difficulty: ${trail.difficulty}`)
        var status = $('<li>').text(`Trail Status: ${trail.status}`)
        list.append(trailRating).append(difficulty).append(status);
        var description = $('<p>').text(trail.description);
        trailCard.append(list).append(description)



        trailCard.insertAfter(this)
    })

});
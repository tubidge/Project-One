$(document).ready(function () {
    M.AutoInit();

    // SETUP VARIABLES
    // ===============================
    var city;
    var park;
    var search;
    var queryURL;
    var parkResults = true;


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

    // Set Timeout 
    function parkSearchTimeout() {
        console.log(parkResults)
        $('#image-card').hide();
        if (parkResults) {
            $('.helper-text').attr('data-success', '');
            $('#image-card').show();
            $("#parks").val('')

        } else {
            $('#parks').addClass('invalid')
            $('.helper-text').attr('data-error', 'No Results Found')
            $("#parks").val('')

        }

    }




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

    // Render places
    function runQuery2(queryURL) {
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (res) {
            console.log(`Places: ${queryURL}`);
            $("#display-places").css("display", "block");
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
    function runQuery3(queryURL, queryURL2) {
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
                runQuery(queryURL2)
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
                        $("#weather").empty();
                        $("#info").empty();
                        $("#weather").append(currentResult.weatherinfo);
                        $('#info').append(description).append(directions);

                    }
                };
            }
        });
    };

    // MAIN PROCESS
    // ===============================
    $('#search-cities').on('click', function () {
        $("#places").empty();
        // Search parameters
        city = $('#city').val().trim();
        state = $('#state').val().trim();
        search = (`${city},${state}`);
        queryURL = `${queryURLBase}&query=${search}`;
        // Run queries
        runQuery(queryURL);
    });

    $(document).on('click', '#search-parks', function () {
        $('.helper-text').attr('data-success', 'Searching...');
        $("#display-places").css("display", "none");
        park = $("#parks").val().trim().toLowerCase();
        var parkInfoURL = `${queryURLBase3}&q=${park}`;
        var parkImageURL = `${queryURLBase}&query=${park}`;
        runQuery3(parkInfoURL, parkImageURL);



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
                state = $('#state').val().trim();
                search = (`${city},${state}`);
                queryURL = `${queryURLBase}&query=${search}`;
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
    });


});
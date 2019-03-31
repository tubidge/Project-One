var config = {
  apiKey: "AIzaSyCW6ZM7sC6YZq_9zl8VFcf8nK2IlYfzKKA",
  authDomain: "group-project-1-4ed9a.firebaseapp.com",
  databaseURL: "https://group-project-1-4ed9a.firebaseio.com",
  projectId: "group-project-1-4ed9a",
  storageBucket: "group-project-1-4ed9a.appspot.com",
  messagingSenderId: "256297252067"
};

firebase.initializeApp(config);

var database = firebase.database()

$(document).ready(function () {
  M.AutoInit();
  M.updateTextFields();
  // INITIAL DISPLAY
  // ===============================
  $('.slider').slider({
    interval: 4000,
    duration: 1600,
    // indicators: false,
  });
  $('input.autocomplete').autocomplete({
    data: {
      "alabama": null,
      "alaska": null,
      "arizona": null,
      "arkansas": null,
      "california": null,
      "colorado": null,
      "connecticut": null,
      "delaware": null,
      "florida": null,
      "georgia": null,
      "hawaii": null,
      "idaho": null,
      "illinois": null,
      "indiana": null,
      "iowa": null,
      "kansas": null,
      "kentucky": null,
      "louisiana": null,
      "maine": null,
      "maryland": null,
      "massachusetts": null,
      "michigan": null,
      "minnesota": null,
      "mississippi": null,
      "missouri": null,
      "montana": null,
      "nebraska": null,
      "nevada": null,
      "new hampshire": null,
      "new jersey": null,
      "new mexico": null,
      "new york": null,
      "north carolina": null,
      "north dakota": null,
      "ohio": null,
      "oklahoma": null,
      "oregon": null,
      "pennsylvania": null,
      "rhode island": null,
      "south carolina": null,
      "south dakota": null,
      "tennessee": null,
      "texas": null,
      "utah": null,
      "vermont": null,
      "virginia": null,
      "washington": null,
      "west virginia": null,
      "wisconsin": null,
      "wyoming": null,
      "american samoa": null,
      "district of columbia": null,
      "federated states of micronesia": null,
      "guam": null,
      "marshall islands": null,
      "northern mariana islands": null,
      "palau": null,
      "puerto rico": null,
      "virgin islands": null,
    },
  });
  // Hide until cities or park search buttons clicked
  $('#results-card').hide();
  // Hide until cities search button clicked
  $('#display-places').hide();
  $('#image-card').show();
  $('#image-card').hide();

  // SETUP VARIABLES
  // ===============================
  var city;
  var park;
  var search;
  var queryURL;
  var key = "fe8bb39cf6f11fec454d5ca72722773e";
  var forecastApiResponse = {};
  var windDirection = "";
  var parkResults = true;
  var hikingTrails = [];
  var favImage = [];
  var currentTitle = '';
  const numbers = ['one', 'two', 'three'];
  // Data Validation
  var states = [
    "alabama",
    "alaska",
    "arizona",
    "arkansas",
    "california",
    "colorado",
    "connecticut",
    "delaware",
    "florida",
    "georgia",
    "hawaii",
    "idaho",
    "illinois",
    "indiana",
    "iowa",
    "kansas",
    "kentucky",
    "louisiana",
    "maine",
    "maryland",
    "massachusetts",
    "michigan",
    "minnesota",
    "mississippi",
    "missouri",
    "montana",
    "nebraska",
    "nevada",
    "new hampshire",
    "new jersey",
    "new mexico",
    "new york",
    "north carolina",
    "north dakota",
    "ohio",
    "oklahoma",
    "oregon",
    "pennsylvania",
    "rhode island",
    "south carolina",
    "south dakota",
    "tennessee",
    "texas",
    "utah",
    "vermont",
    "virginia",
    "washington",
    "west virginia",
    "wisconsin",
    "wyoming",
    "american samoa",
    "district of columbia",
    "federated states of micronesia",
    "guam",
    "marshall islands",
    "northern mariana islands",
    "palau",
    "puerto rico",
    "virgin islands",
  ];

  // API keys
  const imageKey = '12030619-aa9394d6920571270adf414a0'; // Pixabay
  const clientID = 'L3RXDSOLTBMHGMY1AUZ20JLONBYUQU5WWAD4JWLIW2JHYDXK'; // Foursquare
  const clientIDSec = 'XKRLZ531CQ0FC334PIBNNDQRER5PGCR0AQCNJRZ4EH1WSMNR'; // Foursquare
  const parksKey = 'ijY3T1c8GJfW6s8gD4MAUVZYbfM7hnEnGNoxpOet'; // National parks
  const hikesKey = '200439802-40135efa1850c123fbd61e5f8746dc12';

  // Base URLs
  const queryURLBaseImages = `https://pixabay.com/api/?key=${imageKey}&safesearch=true&category=travel&per_page=200`;
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
      var hits = res.hits;
      var length = res.hits.length;
      for (var i = 0; i < length; i++) {
        var image = hits[i];
        var url = hits[i].largeImageURL;
        var tags = hits[i].tags;
        var str = tags;
        var height = hits[i].webformatHeight;
        city = $('#city').val().trim();

        city = city.toLowerCase();
        state = $('#state').val().trim();
        state = state.toLowerCase();
        var n = tags.includes(city);
        if (n) {
          if (height > 300) {
            images.push(url);
          };
        };
      };
      favImage = [];
      favImage.push(images[0]);

      if (images.length > 2) {
        // Array to add id to each image
        var numbers = ['one', 'two', 'three'];

        for (var i = 0; i < numbers.length; i++) {
          var src = images[i];
          var newImage = $(`<img src="${src}" width="400px">`);
          $(`#${numbers[i]}`).html(newImage);
        };
      } else if (images.length === 1 || images.length === 2) {
        newImage = $(`<img src="${images[0]}" width="400px">`);
        $('#image-card').hide();
        $('#single-image').html(newImage);
        $('#single-image').show();
      } else {
        $('#image-card').hide();
        M.toast({
          html: "No image results"
        });
      };
      $('#image-card').show();
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
        newPlaceLink.attr('target', '_blank');
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

          if (currentResult.name.toLowerCase() === park || currentResult.fullname.toLowerCase() === park) {
            console.log('working')
            currentTitle = currentResult.fullname;
            console.log(currentTitle)
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
          $("#current-weather").html("<b> Current Weather </b>");
          // Adding temperature to page.
          var currentTemp = $("<tr>").text("Temperature: " + (Math.round(response.main.temp)) + String
            .fromCharCode(176) + " F");
          table.append(currentTemp);
          // Adding wind speed to page.
          var windSpeed = $("<tr>").text(`Wind Speed: ${Math.round(response.wind.speed)} mph`);
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
          // $("#row1").html("<th id='forecastTh'> 5 Day Forecast </th>");
          $("#forecast-head").html("<b> 5 Day Forecast (mid-day)</b>");
          var row2 = $("#row2");
          var day2Date = $("<th class='forecastDt'>").text(moment.unix(day2.dt).format("MMM Do YYYY"));
          var day1Date = $("<th class='forecastDt'>").text(moment.unix(day1.dt).format("MMM Do YYYY"));
          var day4Date = $("<th class='forecastDt'>").text(moment.unix(day4.dt).format("MMM Do YYYY"));
          var day3Date = $("<th class='forecastDt'>").text(moment.unix(day3.dt).format("MMM Do YYYY"));
          var day5Date = $("<th class='forecastDt'>").text(moment.unix(day5.dt).format("MMM Do YYYY"));
          row2.append(day1Date);
          row2.append(day2Date);
          row2.append(day3Date);
          row2.append(day4Date);
          row2.append(day5Date);
          var row3 = $("#row3");
          var day1Temp = $("<td>").text("Temperature: " + (Math.round(day1.main.temp)) + String
            .fromCharCode(176) + " F");
          var day2Temp = $("<td>").text("Temperature: " + (Math.round(day2.main.temp)) + String
            .fromCharCode(176) + " F");
          var day3Temp = $("<td>").text("Temperature: " + (Math.round(day3.main.temp)) + String
            .fromCharCode(176) + " F");
          var day4Temp = $("<td>").text("Temperature: " + (Math.round(day4.main.temp)) + String
            .fromCharCode(176) + " F");
          var day5Temp = $("<td>").text("Temperature: " + (Math.round(day5.main.temp)) + String
            .fromCharCode(176) + " F");
          row3.append(day1Temp);
          row3.append(day2Temp);
          row3.append(day3Temp);
          row3.append(day4Temp);
          row3.append(day5Temp);
          var row4 = $("#row4");
          var day1WindSpeed = $("<td>").text(`Wind Speed: ${Math.round(day1.wind.speed)} mph`);
          var day2WindSpeed = $("<td>").text(`Wind Speed: ${Math.round(day2.wind.speed)} mph`);
          var day3WindSpeed = $("<td>").text(`Wind Speed: ${Math.round(day3.wind.speed)} mph`);
          var day4WindSpeed = $("<td>").text(`Wind Speed: ${Math.round(day4.wind.speed)} mph`);
          var day5WindSpeed = $("<td>").text(`Wind Speed: ${Math.round(day5.wind.speed)} mph`);
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
        var hikingURL = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${long}&maxDistance=50&key=${hikesKey}`;
        $.ajax({
          url: hikingURL,
          method: "GET"
        }).then(function (hike) {
          console.log(hike);
          var results = hike.trails;
          hikingTrails = [];
          for (i = 0; i < results.length; i++) {
            var btn = $('<a>').addClass('waves-effect waves-light btn hike orange accent-3').text(results[i].name).css('display', 'block');
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
    console.log(queryURL);
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      // Create a table to hold weather data on page.
      var table = $("#weather");
      $("#current-weather").html("<b> Current Weather </b>");
      // Adding temperature to page.
      var currentTemp = $("<tr>").text("Temperature: " + (Math.round(response.main.temp)) + String
        .fromCharCode(176) + " F");
      table.append(currentTemp);
      // Adding wind speed to page.
      var windSpeed = $("<tr>").text(`Wind Speed: ${Math.round(response.wind.speed)} mph`);
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
    console.log(queryURL)
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

      $("#forecast-head").html("<b> 5 Day Forecast (mid-day)</b>");

      var row2 = $("#row2");
      var day1Date = $("<th class='forecastDt'>").text(moment.unix(day1.dt).format("MMM Do YYYY"));
      var day2Date = $("<th class='forecastDt'>").text(moment.unix(day2.dt).format("MMM Do YYYY"));
      var day4Date = $("<th class='forecastDt'>").text(moment.unix(day4.dt).format("MMM Do YYYY"));
      var day3Date = $("<th class='forecastDt'>").text(moment.unix(day3.dt).format("MMM Do YYYY"));
      var day5Date = $("<th class='forecastDt'>").text(moment.unix(day5.dt).format("MMM Do YYYY"));
      row2.append(day1Date);
      row2.append(day2Date);
      row2.append(day3Date);
      row2.append(day4Date);
      row2.append(day5Date);

      var row3 = $("#row3");
      var day1Temp = $("<td>").text("Temperature: " + (Math.round(day1.main.temp)) + String
        .fromCharCode(176) + " F");
      var day2Temp = $("<td>").text("Temperature: " + (Math.round(day2.main.temp)) + String
        .fromCharCode(176) + " F");
      var day3Temp = $("<td>").text("Temperature: " + (Math.round(day3.main.temp)) + String
        .fromCharCode(176) + " F");
      var day4Temp = $("<td>").text("Temperature: " + (Math.round(day4.main.temp)) + String
        .fromCharCode(176) + " F");
      var day5Temp = $("<td>").text("Temperature: " + (Math.round(day5.main.temp)) + String
        .fromCharCode(176) + " F");
      row3.append(day1Temp);
      row3.append(day2Temp);
      row3.append(day3Temp);
      row3.append(day4Temp);
      row3.append(day5Temp);

      var row4 = $("#row4");
      var day1WindSpeed = $("<td>").text(`Wind Speed: ${Math.round(day1.wind.speed)} mph`);
      var day2WindSpeed = $("<td>").text(`Wind Speed: ${Math.round(day2.wind.speed)} mph`);
      var day3WindSpeed = $("<td>").text(`Wind Speed: ${Math.round(day3.wind.speed)} mph`);
      var day4WindSpeed = $("<td>").text(`Wind Speed: ${Math.round(day4.wind.speed)} mph`);
      var day5WindSpeed = $("<td>").text(`Wind Speed: ${Math.round(day5.wind.speed)} mph`);
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
    $('.slider').remove();
    $('#main-content').css('display', 'block');
  });
  // Search cities and states
  $('#search-cities').on('click', function () {
    console.log('here')
    $("#trails-display").hide();
    $('.select-dropdown').val('What kind of place are you looking for?');
    $('#info-display').removeClass('active');
    $('#weather-display').removeClass('active');
    $('.collapsible-body').css('display', 'none');
    $('#sections').prop('selectedIndex', 0);
    $('.collapsible-body').attr("style");
    // Empty information from previous searches
    $('#single-image').hide();
    $('#image-card').hide();
    $('#weather').empty();
    $('#row1, #row2, #row3, #row4, #row5, #row6').empty();
    $('#park-info').empty();
    $('#places').empty();
    // Display list of places
    $('#display-places').show();
    // Search parameters      
    // $('#city').val(getUrlParameter('city'))
    city = $('#city').val().trim();
    console.log(city)
    city = city.replace(/ /g, "%20");
    city = city.toLowerCase();
    state = $('#state').val().trim();
    state = state.toLowerCase();
    if (states.indexOf(state) === -1) {
      M.toast({
        html: "That's not a valid state"
      })
      $('#state').val('');
    } else {

      var cityDisplay = $('#city').val().trim();
      cityDisplay = cityDisplay.toUpperCase();

      var stateDisplay = $('#state').val().trim();
      stateDisplay = stateDisplay.toUpperCase();
      currentTitle = `${cityDisplay}, ${stateDisplay}`;
      var searchResult = (`${cityDisplay}, ${stateDisplay}`);
      var currentResult = $(`<h1 class="center-align white-text">${searchResult}</h1>`);
      $('#current-result').show();
      $('#current-result').html(currentResult);
      // Display images
      search = `${city}%20${state}`;
      // queryURL = `${queryURLBaseImages}&query=${search}`;
      queryURL = `${queryURLBaseImages}&q=${search}`;
      runQueryImages(queryURL);
      currentWeatherCall();
      forecastCall();
    };
  });
  // Search national parks
  $(document).on('click', '#search-parks', function () {
    $("#trails-display").show();
    $('#info-display').removeClass('active');
    $('#weather-display').removeClass('active');
    $('.collapsible-body').css('display', 'none');
    $('.collapsible-body').attr("style");
    $('#single-image').hide();
    $('#image-card').hide();
    $('.helper-text').attr('data-success', 'Searching...');
    $("#display-places").css("display", "none");
    $('#trails').empty();
    park = $("#parks").val().trim().toLowerCase();
    var parkInfoURL = `${queryURLBaseParks}&q=${park}`;
    var parkImageURL = `${queryURLBaseImages}&q=${park}`;
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
    $('#city').val(getUrlParameter('city'))
    $('#state').val(getUrlParameter('state'))
    $("html").css("background-image", "url('assets/images/bg-cities.jpg')");
    $('.collapsible-header').css('background-color', '#311B92');
    $('.collapsible-header').css('border-color', '#150851');
    $('.favButton').css('background-color', '#311B92');

    $('#start-buttons').addClass('hide');
    $('#city-search').removeClass('hide');
    $('#backCurrent').removeClass('orange accent-4')
    $('#backCurrent').addClass('deep-purple darken-4')
    $('#back-button').removeClass('hide')
  });


  $('#parks-start').click(function () {
    $("html").css("background-image", "url('assets/images/bg-parks.jpg')");
    $('.collapsible-header').css('background-color', '#FF6D00');
    $('.collapsible-header').css('border-color', '#d85c04');
    $('.favButton').css('background-color', '#FF6D00');

    $('#start-buttons').addClass('hide');
    $('#parks-search').removeClass('hide');
    $('#backCurrent').removeClass('deep-purple darken-4')
    $('#backCurrent').addClass('orange accent-4')
    $('#back-button').removeClass('hide')
  });
  // Clear everything when back button clicked
  $(document).on('click', '#back-button', function () {
    $("#trails-display").hide();
    $('#current-result').hide();
    $('#current-result').empty();
    $("html").css("background-image", "url('assets/images/bg.jpg')");
    $('#start-buttons').removeClass('hide');
    $('#parks-search').addClass('hide');
    $('#city-search').addClass('hide');
    $('#back-button').addClass('hide');
    $('#one, #two, #three').empty();
    $('#results-card').hide();
    $('#park-info').empty();
    $('#weather').empty();
    $('#city').val('');
    $('#state').val('');
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

  $(document).on('click', '.favButton', function () {
    //search database
    //loop through search results
    //if search results don't exist, push to database.
    //if else, error message
    var pushToFavs = true;

    database.ref('/Favorites').on("value", function (snap) {
      var results = snap.val();
      console.log(results)
      for (const key in results) {
        if (results.hasOwnProperty(key)) {
          const element = results[key];
          console.log(key);
          if (element.img === favImage[0] || element.title === currentTitle) {
            pushToFavs = false;
            console.log("dont push to favorites")
          }

        }
      }
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
    if (pushToFavs) {
      let type;
      if (currentTitle.indexOf(",") > -1) {
        type = "city"
      } else {
        type = "park"
      }
      database.ref('/Favorites').push({
        title: currentTitle,
        img: favImage[0],
        type: type
      });
    }


  })

  database.ref('/Favorites').on('child_added', function (snap) {
    var city;
    let state;
    let park;
    let type = snap.val().type;
    let goTo;
    if (type === 'city') {
      city = snap.val().title.split(',')[0];
      state = snap.val().title.split(',')[1];
      goTo = `index.html?city=${city}&state=${state}`;
    } else {
      park = snap.val().title;
      goTo = `index.html?parkName=${park}`;
    }

    var favCard = $('<div>').addClass('card trail-card');
    var favImage = $('<div>').addClass('card-image');
    var favPic = $('<img>');
    favPic.attr('src', snap.val().img)
    favPic.css('height', '25rem')
    var title = $('<span>').addClass('card-title').text(snap.val().title);
    var search = $('<i>').addClass('material-icons black-text').text('search')
    var btn = $('<a>').attr('href', goTo).addClass('btn-floating halfway-fab waves-effect waves-light fav-search').css({
      'margin-bottom': '3.5rem',
      'text-align': 'center',
      'background-color': 'white',
      'opacity': '.8',


    }).html(search)
    favImage.append(favPic).append(title).append(btn)
    favCard.append(favImage)
    favCard.css({
      "width": "25rem",
      "display": "inline-block",
      'margin': '1rem'
    })
    $('#favorite-list').append(favCard)
  })

  $('#favorite-search').click(function () {
    $('#city').val(getUrlParameter('city'))
    $('#state').val(getUrlParameter('state'))
    $("html").css("background-image", "url('assets/images/bg-cities.jpg')");
    $('.collapsible-header').css('background-color', '#311B92');
    $('.collapsible-header').css('border-color', '#150851');
    $('.favButton').css('background-color', '#311B92');
    console.log('here')
    $('#start-buttons').addClass('hide');
    $('#city-search').removeClass('hide');
    $('#backCurrent').removeClass('orange accent-4')
    $('#backCurrent').addClass('deep-purple darken-4')
    $('#back-button').removeClass('hide')
  });

  //Gets a parameter from the url
  var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
      }
    }
  };
  console.log(getUrlParameter('city'))
  console.log(getUrlParameter('state'))
  if (window.location.href.indexOf('city=') > -1) {
    $('#city').val(getUrlParameter('city'))
    $('#state').val(getUrlParameter('state'))
    $("html").css("background-image", "url('assets/images/bg-cities.jpg')");
    $('.collapsible-header').css('background-color', '#311B92');
    $('.collapsible-header').css('border-color', '#150851');
    $('.favButton').css('background-color', '#311B92');
    $('.card').css('display', 'block');
    $('.slider').remove();
    $('#main-content').css('display', 'block');
    console.log('here')
    $('#start-buttons').addClass('hide');
    $('#city-search').removeClass('hide');
    $('#backCurrent').removeClass('orange accent-4');
    $('#backCurrent').addClass('deep-purple darken-4');
    $('#back-button').removeClass('hide');

    $('.select-dropdown').val('What kind of place are you looking for?');
    $('#info-display').removeClass('active');
    $('#weather-display').removeClass('active');
    $('.collapsible-body').css('display', 'none');
    $('#sections').prop('selectedIndex', 0);
    $('.collapsible-body').attr("style");
    // Empty information from previous searches
    $('#single-image').hide();
    $('#image-card').hide();
    $('#weather').empty();
    $('#row1, #row2, #row3, #row4, #row5, #row6').empty();
    $('#park-info').empty();
    $('#places').empty();
    // Display list of places
    $('#display-places').show();
    // Search parameters      
    $('#city').val(getUrlParameter('city'))
    city = $('#city').val().trim();
    city = city.replace(/ /g, "%20");
    city = city.toLowerCase();
    state = $('#state').val().trim();
    state = state.toLowerCase();
    if (states.indexOf(state) === -1) {
      M.toast({
        html: "That's not a valid state"
      })
      $('#state').val('');
    } else {

      var cityDisplay = $('#city').val().trim();
      cityDisplay = cityDisplay.toUpperCase();

      var stateDisplay = $('#state').val().trim();
      stateDisplay = stateDisplay.toUpperCase();
      currentTitle = `${cityDisplay}, ${stateDisplay}`;
      var searchResult = (`${cityDisplay}, ${stateDisplay}`);
      var currentResult = $(`<h1 class="center-align white-text">${searchResult}</h1>`);
      $('#current-result').show();
      $('#current-result').html(currentResult);
      // Display images
      search = `${city}%20${state}`;
      // queryURL = `${queryURLBaseImages}&query=${search}`;
      queryURL = `${queryURLBaseImages}&q=${search}`;
      runQueryImages(queryURL);
      currentWeatherCall();
      forecastCall();
    };
  } else if (window.location.href.indexOf('parkName=') > -1) {
    $('#parks').val(getUrlParameter('parkName'))
    $("html").css("background-image", "url('assets/images/bg-parks.jpg')");
    $('.collapsible-header').css('background-color', '#FF6D00');
    $('.collapsible-header').css('border-color', '#d85c04');
    $('.favButton').css('background-color', '#FF6D00');
    $('.card').css('display', 'block');
    $('.slider').remove();
    $('#main-content').css('display', 'block');
    $('#start-buttons').addClass('hide');
    $('#parks-search').removeClass('hide');
    $('#backCurrent').removeClass('deep-purple darken-4')
    $('#backCurrent').addClass('orange accent-4')
    $('#back-button').removeClass('hide')
    $('#info-display').removeClass('active');
    $('#weather-display').removeClass('active');
    $('.collapsible-body').css('display', 'none');
    $('.collapsible-body').attr("style");
    $('#single-image').hide();
    $('#image-card').hide();
    $('.helper-text').attr('data-success', 'Searching...');
    $("#display-places").css("display", "none");
    $('#trails').empty();
    park = $("#parks").val().trim().toLowerCase();
    var parkInfoURL = `${queryURLBaseParks}&q=${park}`;
    var parkImageURL = `${queryURLBaseImages}&q=${park}`;
    runQueryParks(parkInfoURL, parkImageURL);
  }
  // Get the input field
  var input = $('#state');
  // Execute a function when the user releases a key on the keyboard
  input.on("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      $('#search-cities').click();
    }
  });
});
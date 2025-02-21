// General info here

genre_dict = {'Alternative': 'KnvZfZ7vAvv',
              'Blues': 'KnvZfZ7vAvd',
              'Classical': 'KnvZfZ7v7nJ',
              'Country': 'KnvZfZ7vAv6',
              'Dance': 'KnvZfZ7v7nI',
              'Dance/Electronic': 'KnvZfZ7vAvF',
              'Folk': 'KnvZfZ7vAva',
              'Hip-Hop/Rap': 'KnvZfZ7vAv1',
              'Jazz': 'KnvZfZ7vAvE',
              'Latin': 'KnvZfZ7vAJ6',
              'Metal': 'KnvZfZ7vAvt',
              'Pop': 'KnvZfZ7vAev',
              'Reggae': 'KnvZfZ7vAed',
              'Rock': 'KnvZfZ7vAeA',
              'R&B': 'KnvZfZ7vAee',
              'Other': 'KnvZfZ7vAvl',
              'World': 'KnvZfZ7vAeF',
}

// Get a reference to the genre dropdown element
// and populate it with options from the genre_dict
const genreDropdown = document.getElementById('selectGenre');
for (var key in genre_dict) {
    const option = document.createElement('option');
    option.textContent = key;
    genreDropdown.appendChild(option);
}

var map = L.map('map', {
    center: [39,-95],
    zoom: 5
  });

L.tileLayer('https://api.mapbox.com/styles/v1/lmcclintock2/clv33n4v401xx01pebykv37ls/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibG1jY2xpbnRvY2syIiwiYSI6ImNsbzY0c2IweTBnNXcycm84dnEyMXBvaHAifQ.gZQ4VJyURj991pygjGxm3w',{
    attribution: 'Imagery &copy; <a href="http://mapbox.com">Mapbox</a>'
}).addTo(map);

// Create a layer group for the markers
var eventsLayer = L.layerGroup().addTo(map);

// This adds a splash screen with basic user info to the map at startup
var popup = L.popup({
  closeButton: true,
  autoClose: true,
  className: "splash"
})
.setLatLng([29,-95])
.setContent('<text class="t">Explore Summer Music!</text><br>' 
+ '<text class="p">Click on each record to find out more information about each festival.<center><br><img src="img/record1.png" class="img"/></center>')
.openOn(map)
 

function getConcertInfo(filter_keyword, filter_event_type, filter_event_date, genreID, map){
 
//  this will remove any marker data from map so new data can be loaded
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
       layer.remove();
    }
  });
// This function will impliment a date selection. If no nate was pass the function a default 
// start and and date is assigned
  if (filter_event_date == null){
    var eventStartDate = '2024-06-01T00:01:00Z';
    var eventEndDate = '2024-08-31T23:59:59Z';
  } else {
    var eventStartDate = `${filter_event_date}T00:01:00Z`;
    var eventEndDate = `${filter_event_date}T23:59:59Z`;
  }

  if (filter_event_type == null){
    filter_event_type = ''
  };

  
  // Define Ticketmaster API endpoint and parameters
  var url = "https://app.ticketmaster.com/discovery/v2/events.json";
  var apiKey = "VcXVvrZqh1bwyvCeGQQgoMomydmwFLtm";

  // Parameters for the query this is how the data is filtered
  // this will return only events in the summer months 
  // in the us. The max number is set by size (200 max)
  var params = {
    apikey: apiKey,
    // classificationName: filter_event_type,
    keyword: filter_event_type,
    genreId: genreID,
    classificationId: 'KZFzniwnSyZfZ7v7nJ', // this is the filter to be only music events
    startDateTime: eventStartDate, // Default - '2024-06-01T00:00:00Z',
    endDateTime: eventEndDate, // Default - '2024-08-31T23:59:00Z',
    countryCode: 'US',
    size: 100,
  };

  // Construct query URL with parameters
  var queryString = new URLSearchParams(params).toString();
  var queryUrl = `${url}?${queryString}`;

  var recordIcon = L.icon({
      iconUrl: 'img/record.png',
      iconSize: [25,25]
  });
  // Make the API request
  fetch(queryUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {

      if ('_embedded' in data){
        console.log(data);
        var eventMarkerList = []

        // Extract event information from the response
        const events = data._embedded.events;
        events.forEach(event => {
          const eventName = event.name;
          const eventDate = event.dates.start.localDate
          venues = event._embedded.venues;
          venues.forEach(venue => {
            const venueName = venue.name;
            const latitude = venue.location.latitude;
            const longitude = venue.location.longitude;
            
            // Popup with a button - still testing
            // var popupContent = '<center><img src="' + event.images[1].url +'"class="popImg"/><br>' + '<text class="popTitle">' +
            // eventName + '</text><br><text class="popInfo">' + venueName + '<br>' + eventDate + 
            // '</text><br>' + '<a href ="' + event.url +'"><text class="popLink">Get Tickets</a></text><button id="tourBtn">Add Concert to Tour</button></center>'

            // Popup contents with no button
            var popupContent = '<center><img src="' + event.images[1].url +'"class="popImg"/><br>' + '<text class="popTitle">' +
            eventName + '</text><br><text class="popInfo">' + venueName + '<br>' + eventDate + 
            '</text><br>' + '<a href ="' + event.url +'"><text class="popLink">Get Tickets</a></text></center>'

            // Add marker to map at coordinates of venue with a popup containing event info
            marker = L.marker([latitude, longitude], {icon: recordIcon}).bindPopup(popupContent, {className: 'popStyle'});
            eventMarkerList.push(marker);   
          });
        });
        L.layerGroup(eventMarkerList).addLayer(eventsLayer).addTo(map);
      };
    })
    .catch(error => {
      console.error("Error:", error);
    });
};

document.addEventListener('DOMContentLoaded',getConcertInfo(filter_keyword='', filter_event_type=null, filter_event_date=null, genreID=genre_dict['Rock'], map))

const dateInput = document.getElementById("festivalDate");
dateInput.addEventListener('change', function(selectedDate) {
    getConcertInfo(filter_keyword='', filter_event_type=null, filter_event_date=selectedDate.target.value, genreID=genre_dict['Rock'], map);
});

// Add an event listener for the 'change' event
genreDropdown.addEventListener('change', function(selectedGenre) {
  // console.log(selectedGenre.target.value)
  getConcertInfo(filter_keyword='', filter_event_type=null, filter_event_date=null, genreID=genre_dict[selectedGenre.target.value], map);  
});

const eventTypeDropdown = document.getElementById('selectEventType');
// Add an event listener for the 'change' event
eventTypeDropdown.addEventListener('change', function(selectedEventType) {
  // console.log(selectedEventType.target.value)
  if (selectedEventType.target.value === "Festivals"){
    eventType = 'Music Festival'
  } else {
    eventType = 'Music Concert'
  }
  getConcertInfo(filter_keyword='', filter_event_type=eventType, filter_event_date=null, genreID=genre_dict['Rock'], map);  
});
//insert code here!
var map = L.map('map', {
    center: [39,-95],
    zoom: 5
});


L.tileLayer('https://api.mapbox.com/styles/v1/lmcclintock2/clv33n4v401xx01pebykv37ls/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibG1jY2xpbnRvY2syIiwiYSI6ImNsbzY0c2IweTBnNXcycm84dnEyMXBvaHAifQ.gZQ4VJyURj991pygjGxm3w',{
    attribution: 'Imagery &copy; <a href="http://mapbox.com">Mapbox</a>'
}).addTo(map);


var popup = L.popup({
  closeButton: true,
  autoClose: true,
  className: "splash"
})
.setLatLng([29,-95])
.setContent('<text class="t">Explore Summer Music!</text><br>' 
+ '<text class="p">Click on each record to find out more information about each festival.<center><br><img src="img/record1.png" class="img"/></center>')
.openOn(map)


// Define Ticketmaster API endpoint and parameters
var url = "https://app.ticketmaster.com/discovery/v2/events.json";
var artistId = "K8vZ917QTXV"; // Replace with the ID of the artist you're interested in
var apiKey = "VcXVvrZqh1bwyvCeGQQgoMomydmwFLtm"; // Replace with your Ticketmaster API key

// Parameters for the query this is how the data is filtered
// this will return only festivals in the summer months 
// in the us. The max number is set by size (200 max)
var params = {
  apikey: apiKey,
  classificationName: 'festival',
  classificationId: 'KZFzniwnSyZfZ7v7nJ',
  startDateTime: '2024-06-01T00:00:00Z',
  endDateTime: '2024-08-31T23:59:00Z',
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

function getData(){
// Make the API request
fetch(queryUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // console.log(data);
    // Extract event information from the response
    const events = data._embedded.events;
    events.forEach(event => {
      const eventName = event.name;
      const eventDate = event.dates.start.localDate
      // console.log(eventDate);
      venues = event._embedded.venues;
      venues.forEach(venue => {
        const venueName = venue.name;
        const latitude = venue.location.latitude;
        const longitude = venue.location.longitude;
        // console.log(venueName,latitude,longitude);
        var popupContent = '<center><img src="' + event.images[1].url +'"class="popImg"/><br>' + '<text class="popTitle">' +
        eventName + '</text><br><text class="popInfo">' + venueName + '<br>' + eventDate + 
        '</text><br>' + '<a href ="' + event.url +'"><text class="popLink">Get Tickets</a></text><button id="tourBtn">Add Concert to Tour</button></center>'
        marker = L.marker([latitude, longitude], {icon: recordIcon}).addTo(map).bindPopup(popupContent, {className: 'popStyle'});
           
    })
   
      // document.getElementById('tourBtn').addEventListener('click', function() {
      //   alert('Button clicked!');
      // });
     //const venue = event._embedded.venues[0]; // Assuming one venue per event
      
      
    // });
  }) 

})

  .catch(error => {
    console.error("Error:", error);
  });

}

function dateFilter(){
  var inputDate = document.getElementById("festivalDate").value;
  document.getElementById("results").innerHTML='';
  var eventList = []
  eventList.length = 0

  fetch(queryUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // console.log(data);
    // Extract event information from the response
    const events = data._embedded.events;
    events.forEach(event => {
      const eventName = event.name;
      const eventDate = event.dates.start.localDate
      const eventUrl = event.url
      if (eventDate == inputDate) {
        // console.log(events)
        eventList.push('<br><a href ="' + eventUrl +'"><text class="listLink">'+eventName+'</a></text><br>')
        document.getElementById("results").insertAdjacentHTML('beforeend',eventList)
        
        
      } 
        
    })}
    
)}

 
document.getElementById("festivalDate").addEventListener("change", dateFilter)
document.addEventListener('DOMContentLoaded',getData()) 
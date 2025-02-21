//insert code here!

genre_dict = {'Metal': 'KnvZfZ7vAvt',
              'Other': 'KnvZfZ7vAvl',
              'Pop': 'KnvZfZ7vAev',
              'Rock': 'KnvZfZ7vAeA',
              'Dance/Electronic': 'KnvZfZ7vAvF',
              'Hip-Hop/Rap': 'KnvZfZ7vAv1',
              'Latin': 'KnvZfZ7vAJ6',
              'Alternative': 'KnvZfZ7vAvv',
              'Country': 'KnvZfZ7vAv6',
              'Jazz': 'KnvZfZ7vAvE',
              'R&B': 'KnvZfZ7vAee',
              'Blues': 'KnvZfZ7vAvd',
              'Classical': 'KnvZfZ7v7nJ',
              'Dance': 'KnvZfZ7v7nI',
              'Folk': 'KnvZfZ7vAva',
              'World': 'KnvZfZ7vAeF',
              'Reggae': 'KnvZfZ7vAed',

}



function createMap(){
    var map = L.map('map', {
        center: [39,-95],
        zoom: 5
      });

    L.tileLayer('https://api.mapbox.com/styles/v1/lmcclintock2/clv33n4v401xx01pebykv37ls/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibG1jY2xpbnRvY2syIiwiYSI6ImNsbzY0c2IweTBnNXcycm84dnEyMXBvaHAifQ.gZQ4VJyURj991pygjGxm3w',{
        attribution: 'Imagery &copy; <a href="http://mapbox.com">Mapbox</a>'
    }).addTo(map);

    // loads the basic concert icons onto the map at startup
    // getConcertInfo(filter_keyword='', filter_event_type='Festival', genreID=genre_dict['Rock'], map)
    getConcertInfo(filter_keyword='', filter_event_type='Concert', genreID=genre_dict['Rock'], map)
};




function getConcertInfo(filter_keyword, filter_event_type, genreID, map){
  // Define Ticketmaster API endpoint and parameters
  var url = "https://app.ticketmaster.com/discovery/v2/events.json";
  var apiKey = "VcXVvrZqh1bwyvCeGQQgoMomydmwFLtm"; // Replace with your Ticketmaster API key

  // Parameters for the query this is how the data is filtered
  // this will return only festivals in the summer months 
  // in the us. The max number is set by size (200 max)
  var params = {
    apikey: apiKey,
    classificationName: filter_event_type,
    keyword: filter_keyword,
    genreId: genreID,
    classificationId: 'KZFzniwnSyZfZ7v7nJ', // this is the filter to be only music events
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
        // console.log(event)
        const eventName = event.name;
        venues = event._embedded.venues;
        venues.forEach(venue => {
          const venueName = venue.name;
          const latitude = venue.location.latitude;
          const longitude = venue.location.longitude;
          console.log(venueName,latitude,longitude);
          var popupHTML = popupContents(event);
          marker = L.marker([latitude, longitude], {icon: recordIcon}).addTo(map).bindPopup(popupHTML);
        })
      })
    })
    .catch(error => {
      console.error("Error:", error);
    });
};

function getImageInfo(image_list){  
  image_list.forEach(image =>{
    if(image_list.length > 0 && image_list[0] === image){
      imageHeight = image.height;
      imageWidth = image.width;
      imageUrl = image.url
    }

    if(image.height < imageHeight){
      imageHeight = image.height;
      imageWidth = image.width;
      imageUrl = image.url
    };
  });
  imageHTML = `<img src=${imageUrl} alt="Concert Logo" style="width:${imageWidth}px;height:${imageHeight}px;"></img>`
  return imageHTML
};

function popupContents(event){
  
  // This code gets the url for the smallest image for an event
  event_image = getImageInfo(event.images)
  
  var artist_table = "<table><tr>"

  var artist_count = 0
  var artists_list = event._embedded.attractions
  var artist_table_list = []

  if (artists_list.length > 3){
    artists_list.forEach(artist =>{
      if (artist_count <= 3){
        var artitsName = artist.name;
        artistImage = getImageInfo(artist.images);
        artist_table_list.push([artistImage,artitsName]);
        artist_count += 1;
      };
    });
  } else {
    artists_list.forEach(artist =>{
        var artitsName = artist.name
        artistImage = getImageInfo(artist.images)
        artist_table_list.push([artistImage,artitsName])
    });
  };


  // add image html to the table
  artist_table_list.forEach(aUrl =>{
    artist_table = artist_table + '<td>' + aUrl[0] + '</td>'
  });

  artist_table = artist_table + '</tr><tr>'

  // add artist name to the table
  artist_table_list.forEach(aName =>{
    artist_table = artist_table + '<td>' + aName[1] + '</td>'
  });
  // close the table 
  artist_table = artist_table + '</tr></table>';


  // console.log(artist_table)
  // add elements into html for the popup
  popupContent = `<p><b>${event.name}</b></p><p>${event_image}<br>${artist_table}`
  // popupContent = `<p><b>${event.name}</b>`;
  return popupContent

};

document.addEventListener('DOMContentLoaded',createMap())
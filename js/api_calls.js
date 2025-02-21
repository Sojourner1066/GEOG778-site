function getVenueLocation(){

// Define Ticketmaster API endpoint and parameters
const url = "https://app.ticketmaster.com/discovery/v2/events.json";
const artistId = "K8vZ917QTXV"; // Replace with the ID of the artist you're interested in
const apiKey = "VcXVvrZqh1bwyvCeGQQgoMomydmwFLtm"; // Replace with your Ticketmaster API key

// Parameters for the query
const params = {
  apikey: apiKey,
  attractionId: artistId
};

// Construct query URL with parameters
const queryString = new URLSearchParams(params).toString();
const queryUrl = `${url}?${queryString}`;

// Make the API request
fetch(queryUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
    // Extract event information from the response
    const events = data._embedded.events;
    events.forEach(event => {
      const eventName = event.name;
      venues = event._embedded.venues;
      venues.forEach(venue => {
        const venueName = venue.name;
        const latitude = venue.location.latitude;
        const longitude = venue.location.longitude;
        console.log(venueName,latitude,longitude);
      })
      //const venue = event._embedded.venues[0]; // Assuming one venue per event
      
    // });
  })
})
  .catch(error => {
    console.error("Error:", error);
  });
 return([venueName,latitude,longitude]) 
};

function getArtistsEvents(){}



function getGenreData(){
  // Define Ticketmaster API endpoint and parameters
  var url = "https://app.ticketmaster.com/discovery/v2/attractions.json";
  // var url = "https://app.ticketmaster.com/discovery/v2/events.json";
  var apiKey = "VcXVvrZqh1bwyvCeGQQgoMomydmwFLtm"; // Replace with your Ticketmaster API key

  // Parameters for the query this is how the data is filtered
  // this will return only festivals in the summer months 
  // in the us. The max number is set by size (200 max)
  var params = {
    apikey: apiKey,
    //classificationName: filter_event_type,
    keyword: filter_keyword,
    //classificationId: 'KZFzniwnSyZfZ7v7nJ',
    //startDateTime: '2024-06-01T00:00:00Z',
    //endDateTime: '2024-08-31T23:59:00Z',
    //countryCode: 'US',
    size: 200,
  };

  // Construct query URL with parameters
  var queryString = new URLSearchParams(params).toString();
  var queryUrl = `${url}?${queryString}`;

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
      // use this if getting data from attractions query
      if (data._embedded !== undefined){
        const events = data._embedded.attractions;
        events.forEach(event => {
          //console.log(event.classifications[0].genre)
          if (event.classifications[0].genre !== undefined){
            genre_dict[event.classifications[0].genre.name] = event.classifications[0].genre.id
          };
        })
      };

      // use this if getting data from events query
      // if (data._embedded !== undefined){
      //   const events = data._embedded.events;
      //   events.forEach(event => {
      //     //console.log(event.classifications[0].genre)
      //     if (event.classifications[0].genre !== undefined){
      //       genre_dict[event.classifications[0].genre.name] = event.classifications[0].genre.id
      //     };
      //   })
      // };
    })
    .catch(error => {
      console.error("Error:", error);
    });
  console.log(genre_dict)
};
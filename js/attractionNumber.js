var attractionUrl = 'discovery/v2/attractions/K8vZ917pAm7?locale=en-us'



function attractionQuery(attractionUrl){
    var apikey = 'VcXVvrZqh1bwyvCeGQQgoMomydmwFLtm',
    startDate = '2024-06-01T00:00:00Z'
    endDate = '2024-08-31T23:59:00Z'
    musicSegmentId = 'KZFzniwnSyZfZ7v7nJ'
    size = 50,
    //builtUrl = `https://app.ticketmaster.com/${attractionUrl}&apikey=${apikey}`
    // console.log(builtUrl)
     builtUrl = `https://app.ticketmaster.com/discovery/v2/attractions.json?classificationName=festival&classificationId=${musicSegmentId}&startDateTime=${startDate}&endDateTime=${endDate}&countryCode=US&size=${size}&apikey=${apikey}`

    $.ajax({
        type:"GET",
        url:builtUrl,
        async:true,
        dataType: "json",
        success: function(json) {
                   console.log(json);
                    const attractions = json._embedded.attractions;
                    attractions.forEach(attraction => {
                        // console.log(attraction);
                        num_event = attraction.upcomingEvents.ticketmaster
                        // console.log(num_event)
                        if (num_event>1){
                            console.log(attraction)
                             }
                         })
                },
        error: function(xhr, status, err) {
                    // This time, we do not end up here!
                }
        });
    };


document.addEventListener('DOMContentLoaded',attractionQuery(attractionUrl))
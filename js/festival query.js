

function festivalQuery(){
    var apikey = 'VcXVvrZqh1bwyvCeGQQgoMomydmwFLtm',
    // these parameters filter the results to only 50 music
    // festivals in the US during the summer of 2024  
    musicSegmentId = 'KZFzniwnSyZfZ7v7nJ',
    startDate = '2024-06-01T00:00:00Z'
    endDate = '2024-08-31T23:59:00Z'
    size = 50,
    builtUrl = `https://app.ticketmaster.com/discovery/v2/attractions.json?classificationName=festival&classificationId=${musicSegmentId}&startDateTime=${startDate}&endDateTime=${endDate}&countryCode=US&size=${size}&apikey=${apikey}`

    $.ajax({
        type:"GET",
        url:builtUrl,
        async:true,
        dataType: "json",
        success: function(json) {
                //    console.log(json);
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


document.addEventListener('DOMContentLoaded',festivalQuery())
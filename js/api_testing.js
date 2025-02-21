
var apikey = 'VcXVvrZqh1bwyvCeGQQgoMomydmwFLtm',
    //this key filters to only music events
    musicSegmentId = 'KZFzniwnSyZfZ7v7nJ',
    //folk genre is KnvZfZ7vAva
    // genre_id = 'KnvZfZ7vAva',
    startDate = '2024-06-01T00:00:00Z'
    endDate = '2024-08-31T23:59:00Z'

    genre_id = '*',
    size = 50,
    // builtUrl = `https://app.ticketmaster.com/discovery/v2/events.json?classificationId=${musicSegmentId}&size=${size}&apikey=${apikey}`

    // attractions can be bands
    builtUrl = `https://app.ticketmaster.com/discovery/v2/attractions.json?classificationName=festival&classificationId=${musicSegmentId}&startDateTime=${startDate}&endDateTime=${endDate}&countryCode=US&size=${size}&apikey=${apikey}`

    // Event search - a single event can include many bands ie a festival
    //builtUrl = `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&apikey=${apikey}`

function testapi(builtUrl){
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


document.addEventListener('DOMContentLoaded',testapi(builtUrl))



// Define the start and end coordinates (latitude, longitude)
coordinates_list = ['33.95371247,-118.3368854','38.867998,-77.013642','38.96034787,-119.94291253']

// coordinates_list = ['47.6062,-122.3321','34.0522,-118.2437']

function getRouteDistance(coordinates_list){
    geojson_to_return =  {
        "type": "FeatureCollection",
        "name": "line",
        "crs": {
            "type": "name",
            "properties": {
                "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
            }
        },
        "features": [
            
        ]
    }

    // const apiUrl = `https://dev.virtualearth.net/REST/v1/Routes/Driving?waypoint.1=${startCoord}&waypoint.2=${endCoord}&distanceUnit=mi&key=${apiKey}`;
    var apiUrl = 'https://dev.virtualearth.net/REST/v1/Routes/Driving?o=json';
    const apiKey = 'AnlY8QF0iexa84_PKbKa68Gevl_aafwuBNTi1CapzJCtXldlgqnJ7LOaZ30ux9XB';
    
    coordinates_list.forEach(coordSet =>{
        apiUrl = apiUrl + `&waypoint.${coordinates_list.indexOf(coordSet)+1}=${coordSet}`
        // if (coordinates_list.indexOf(coordSet)===0){
        //     apiUrl = apiUrl + `&waypoint.1=${coordSet}`
        // } else {
        //     apiUrl = apiUrl + `&waypoint.${coordinates_list.indexOf(coordSet)+1}=${coordSet}`
        // }
    });
    queryUrl = apiUrl + `&distanceUnit=mi&key=${apiKey}`
    // console.log(apiUrl)

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
        
        var distance = data.resourceSets[0].resources[0].travelDistance;
        var duration = data.resourceSets[0].resources[0].travelDuration;
        
        geojson_to_return.features[0].properties['TravelDistanceMiles'] = distance;
        geojson_to_return.features[0].properties['TravelDurationSeconds'] = duration;
        
        var route_segments = data.resourceSets[0].resources[0].routeLegs;
        route_segments.forEach(route_legs => {
          route_num = route_segments.indexOf(route_legs);
          var route = route_legs.itineraryItems;
          geojson_feature = {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "MultiLineString",
                "coordinates": [
                    [
                    ]
                ]
            }
          }

          route.forEach(wpt =>{
            var lat = wpt.maneuverPoint.coordinates[0];
            var long = wpt.maneuverPoint.coordinates[1];

            // I think I need to just push another list of coordinates in the coordinates array

            geojson_feature.geometry.coordinates[0].push([long, lat]);
          })
        geojson_to_return.features.push(geojson_feature) 
        })

        // var route = data.resourceSets[0].resources[0].routeLegs[0].itineraryItems;
        // route.forEach(wpt =>{
        //     var lat = wpt.maneuverPoint.coordinates[0];
        //     var long = wpt.maneuverPoint.coordinates[1];
        //     geojson_to_return.features[0].geometry.coordinates[0].push([long, lat]);
        // })
        console.log(geojson_to_return);
      })
      .catch(error => {
        console.error("Error:", error);
      });
    // return geojson_to_return
};

document.addEventListener('DOMContentLoaded',getRouteDistance(coordinates_list))
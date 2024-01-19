const axios = require('axios')

async function getCoordinates(query, app_email) {
    try {
        let coordinates

        const results = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: query,
                'format': 'json',
                'accept-language': 'en',
                'countrycodes':'us',
                'limit':1,
                'email': app_email
            }
        })
        
        if (results.status == 200) {
            if (results.data.length == 0) {
                coordinates = 'e001'
            } else {
                coordinates = {
                    'lat':results.data[0].lat, 
                    'lon':results.data[0].lon,
                    "addresstype": results.data[0].addresstype,
                    "addressname": results.data[0].name,
                }
            }
        }
        return coordinates

      } catch (error) {
        console.error('Error fetching openstreetmap data', error)
        return 'e001'
      }
}

// console.log('Collection is empty, requesting lat/lon');

// const query = search_query;
// console.log(query);
//  try {
//       const mapdata_results = await axios.get('https://nominatim.openstreetmap.org/search', {
//           params: {
//               q: query,
//               'format': 'json',
//               'accept-language': 'en',
//               'countrycodes':'us',
//               'limit':1,
//               'email':'support@domain.com'
//           }
//       });
  
//       mapdata = mapdata_results.data;
//       console.log(mapdata[0].lat + ',' + mapdata[0].lon)
  
//       if (isEmptyObject(mapdata)) {
//         console.error('Error in the query value');
//         return;
//       } else if (lengthObject(mapdata) > 1) {
//         console.error('Query is returning multiple results');
//         console.log(Object.keys(mapdata).length);
//         console.log(mapdata);
//         return;
//       } else {
//         console.log('Querying OpenStreetMapData successful');
//       }
//     } catch (error) {
//       console.error('Error fetching openstreetmap data', error);
//     }

    module.exports = {
        getCoordinates,
    }
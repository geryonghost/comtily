const timezonedb_key = process.env.timezonedb_key

const axios = require('axios')
const moment = require('moment-timezone')

// async function getAlerts(coordinates, variables) {
//   try {
//     const location = coordinates.lat + ',' + coordinates.lon
//     const userAgent = variables.userAgent
//     const results = await axios.get('https://api.weather.gov/alerts/active?point=' + location, {headers: {userAgent}})

//     if (results.status == 200) {
//         const forecast = await results.data.properties
//         return forecast
//     } else {
//         console.log('IWO:Error', 'getting forecast alerts')
//         return 'error'
//     }
//   } catch (error) {
//     console.log('IWO:Error', 'getting forecast alerts', error)
//     return 'error'
//   }
// }

async function getCoordinates(query, variables) {
    console.log('IWO:Info', 'requesting coordinates from openstreetmap')
    try {
        const results = await axios.get(
            'https://nominatim.openstreetmap.org/search',
            {
                params: {
                    q: query,
                    format: 'json',
                    'accept-language': 'en',
                    countrycodes: 'us',
                    limit: 1,
                    email: variables.appEmail,
                },
            }
        )

        if (results.status == 200) {
            if (results.data.length == 0) {
                console.log('IWO:Error', 'getting coordinates')
                return 'error'
            } else {
                const coordinates = {
                    lat: results.data[0].lat,
                    lon: results.data[0].lon,
                    addresstype: results.data[0].addresstype,
                    addressname: results.data[0].name,
                }
                return coordinates
            }
        }
    } catch (error) {
        console.log('IWO:Error', 'fetching openstreetmap data', error)
        return 'error'
    }
}

async function getForecastUrl(coordinates, variables) {
    console.log('IWO:Info', 'requesting forecasturl from weather.gov')
    const weatherForecastUrl =
        'https://api.weather.gov/points/' +
        coordinates.lat +
        ',' +
        coordinates.lon
    const userAgent = variables.userAgent

    try {
        const results = await axios.get(weatherForecastUrl, {
            headers: { userAgent },
        })
        if (results.status == 200) {
            const forecastUrl = await results.data.properties.forecastGridData
            return forecastUrl
        } else {
            console.log('IWO:Error', 'query results in bad response status')
            return 'error'
        }
    } catch (error) {
        console.log('IWO:Error', 'fetching forecast URL', error)
        return 'error'
    }
}

async function getGridData(location, variables) {
    console.log('IWO:Info', 'Getting GridData for ', location.query)

    try {
        const results = await axios.get(location.forecastUrl, {
            headers: variables.userAgent,
        })
        if (results.status == 200) {
            const gridData = await results.data.properties
            return gridData
        } else {
            console.log(
                'IWO:Error',
                'getting forecast griddata',
                location.orecastUrl
            )
            return 'error'
        }
    } catch (error) {
        console.log(
            'IWO:Error',
            'getting forecast griddata',
            location.forecastUrl,
            error
        )
        return 'error'
    }
}

async function getTwilight(location) {
    try {
        const currentTime = moment.tz(location.timeZone.zoneName).format()
        let createMap = []

        for (let i = 0; i < 7; i++) {
            const useDate = moment(currentTime)
                .add(i, 'day')
                .format('YYYY-MM-DD')
            const apiURL =
                'https://api.sunrise-sunset.org/json?formatted=0&lat=' +
                location.lat +
                '&lng=' +
                location.lon +
                '&date=' +
                useDate

            const results = await axios.get(apiURL)

            if (results.status == 200) {
                const sunrise = moment(results.data.results.sunrise)
                    .tz(location.timeZone.zoneName)
                    .format()
                const sunset = moment(results.data.results.sunset)
                    .tz(location.timeZone.zoneName)
                    .format()
                const dayLength = results.data.results.day_length

                const mapResults = {
                    sunrise: sunrise,
                    sunset: sunset,
                    dayLength: dayLength,
                }
                createMap.push(mapResults)
            } else {
                console.log('IWO:Error', 'getting sunrise and sunset')
                return 'error'
            }
        }
        const twilight = {
            validTime: currentTime,
            values: createMap,
        }

        return twilight
    } catch (error) {
        console.log('IWO:Error', 'getting sunrise and sunset', error)
        return 'error'
    }
}

async function getTimeZone(coordinates) {
    try {
        const apiURL =
            'http://api.timezonedb.com/v2.1/get-time-zone?key=' +
            timezonedb_key +
            '&format=json&by=position&fields=zoneName,abbreviation&lat=' +
            coordinates.lat +
            '&lng=' +
            coordinates.lon
        const results = await axios.get(apiURL)

        if (results.status == 200) {
            const timeZone = {
                zoneName: results.data.zoneName,
                abbreviation: results.data.abbreviation,
            }
            return timeZone
        } else if (results.status == 400) {
            console.log('IWO:Error', 'getting time zone, status 400')
            return 'error'
        }
    } catch (error) {
        console.log('IWO:Error', 'fetching time zone data', error)
        return 'error'
    }
}

module.exports = {
    getCoordinates,
    getForecastUrl,
    getGridData,
    getTwilight,
    getTimeZone,
}

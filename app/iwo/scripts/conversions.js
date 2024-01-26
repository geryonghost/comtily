const moment = require('moment-timezone')

function convertLength(unit, data) {
    const measurement = data.slice(0,-1)
    const unitCode = data.substr(data.length - 1)
    let length

    if (unit = 'us' && unitCode == 'm') {
        const math  = Math.round(measurement * 3.2808399)
        length = math + 'ft'
    }
    if (unit = 'us' && unitCode == 'f') {
        length = data
    }
    return length
}

function formatUnitCode(unitcode) {
    let unit = unitcode.substring(unitcode.lastIndexOf(':') + 1)
  
    if (unit == "degC") { unit = "C" }
    if (unit == "percent") { unit = "%"}
  
    return unit
  }

function getTimeZoneName(offset) {
    let timezone = []
    switch(offset) {
        case "-05:00":
            timezone[0] = "America/New_York"
            timezone[1] = "Eastern"
            timezone[2] = "-05:00"
            break;
        case "-06:00":
            timezone[0] = "America/Chicago"
            timezone[1] = "Central"
            timezone[2] = "-06:00"
            break;
        case "-07:00":
            timezone[0] = "America/Denver"
            timezone[1] = "Mountain"
            timezone[2] = "-07:00"
            break;
        case "-08:00":
            timezone[0] = "America/Los_Angeles"
            timezone[1] = "Pacific"
            timezone[2] = "-08:00"
            break;
        case "-09:00":
            timezone[0] = "America/Anchorage"
            timezone[1] = "Alaska"
            timezone[2] = "-09:00"
        case "-10:00":
            timezone[0] = "Pacific/Honolulu"
            timezone[1] = "Hawaii"
            timezone[2] = "-10:00"
        default:
            timezone[0] = ""
            timezone[1] = ""
            timezone[2] = ""
    }
    return timezone
}

function getCurrentDate(timeZone, dateOffset = 0) {
    const date = new Date()
    date.setDate(date.getDate() + dateOffset)

    const clientDate = moment.tz(date, timeZone[0]).format(moment.HTML5_FMT.DATE)
    return clientDate
}

function convertTime(time, timeZone) {
    const clientTime = moment.tz(time, timeZone).format('LT')
    
    return clientTime
}

module.exports = {
    convertLength,
    formatUnitCode,
    getTimeZoneName,
    getCurrentDate,
    convertTime 
}
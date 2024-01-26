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
            break;
        case "-06:00":
            timezone[0] = "America/Chicago"
            timezone[1] = "Central"
            break;
        case "-07:00":
            timezone[0] = "America/Denver"
            timezone[1] = "Mountain"
            break;
        case "-08:00":
            timezone[0] = "America/Los_Angeles"
            timezone[1] = "Pacific"
            break;
        case "-09:00":
            timezone[0] = "America/Anchorage"
            timezone[1] = "Alaska"
        case "-10:00":
            timezone[0] = "Pacific/Honolulu"
            timezone[1] = "Hawaii"
        default:
            timezone[0] = ""
            timezone[1] = ""
            timezone[2] = ""
    }
    return timezone
}

function getTodaysDate() {
    const today = new Date()

// Get the year, month, and day
var year = today.getFullYear();
var month = today.getMonth() + 1; // Month is zero-based, so we add 1
var day = today.getDate();

// Create a string representation of the date in the format "YYYY-MM-DD"
var todayDateString = year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;

console.log(todayDateString);

}


  module.exports = {
    convertLength,
    formatUnitCode,
    getTimeZoneName,
    getTodaysDate,    
}
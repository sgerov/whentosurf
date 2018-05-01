console.log('Starting scraper')

let Xray = require('x-ray');
let x = Xray({
  filters: {
    trim: function (value) {
      return typeof value === 'string' ? value.trim() : value
    },
    except: function (value, word) {
      return typeof value === 'string' ? value.replace(word, '') : value
    },
    transformMonth: function (value) {
      const monthQualityRegex = /([0-9]+)\.gif$/;

      return typeof value === 'string' ? monthQualityRegex.exec(value)[1] : value
    },
    toBoolean: function(value) {
      return Boolean(value)
    }
  }
});
// get all countries that have spots
//x('https://www.wannasurf.com/spot/index.html', {
  //items: x('.countryWithSpot', [{
    //name: '@text',
    //href: '@href'
  //}])
//}).write('countries.json')

// get all locations for a country (like Indonesia)
//x('https://www.wannasurf.com/spot/Asia/Indonesia/index.html', {
  //items: x('.wanna-tabzonespot-item-title', [{
    //name: '@text',
    //href: '@href'
  //}]),
  //monthsQuality: ['#wanna-season-table tr:first-of-type img@src | transformMonth'],
  //hasSurfSpots: '#wanna-table th:first-of-type:contains("Surf Spots") | toBoolean'
//}).write('indonesia-zones.json')

// get spots from a location
//x('https://www.wannasurf.com/spot/Asia/Indonesia/Mentawai/index.html', {
  //items: x('.wanna-tabzonespot-item-title', [{
    //name: '@text',
    //href: '@href',
  //}]),
  //monthsQuality: ['#wanna-season-table tr:first-of-type img@src | transformMonth']
//}).write('mentawai-spots.json')

// get spot info
//x('https://www.wannasurf.com/spot/Asia/Indonesia/Mentawai/macaronis/index.html', {
  //name: '.wanna-item-title-title | trim',
  //bottom: 'p:contains("Bottom")@text | except:Bottom | trim',
//})(function(err, obj) {
  //console.log(obj)
//})

//monthsQuality: ['#wanna-season-table tr:first-of-type img@src | transformMonth'],
//
const result = {
  countries: []
}

const hasSurfSpots = (url) =>
  x(url, '#wanna-table th:first-of-type:contains("Surf Spots") | toBoolean')

const getLocations = (url) =>
  x(url, {
    items: x('.wanna-tabzonespot-item-title', [{
      name: '@text',
      href: '@href',
    }]),
    monthsQuality: ['#wanna-season-table tr:first-of-type img@src | transformMonth']
  })

const getSpot = (url) =>
  x(url, {
    name: '.wanna-item-title-title | trim',
    bottom: 'p:contains("Bottom")@text | except:Bottom | trim',
  })

x('https://www.wannasurf.com/spot/index.html', {
  items: x('.countryWithSpot', [{
    name: '@text',
    href: '@href'
  }])
})(function(err, fetched_countries) {
  const countries = fetched_countries.items;
  console.log('Countries found:', countries.length)

  Object.keys(countries).forEach(function(key) {
    const country = countries[key]
    locations = []

    console.log('Fetching', country.name)

    hasSurfSpots(country.href)( (err, hasSpots) => {
      if(hasSpots) {
        console.log('has no locations')
        getLocations(country.href)( (err, listed_spots) => {
          listed_spots = listed_spots.items
          new_spots = []
          console.log('spots fetched:', listed_spots.length)
          listed_spots.forEach(function(spot) {
            getSpot(spot.href)( (err, spot_data) => {
              new_spots.push({ name: spot_data.name, bottom: spot_data.bottom })
            })
          })
          locations.push({ name: "unknown", spots: new_spots, monthsQuality: [] });
        })
      } else {
        console.log('has locations')
        getLocations(country.href)( (err, fetched_locations) => {
          fetched_locations = fetched_locations.items
          console.log('locations fetched:', fetched_locations.length)
          Object.keys(fetched_locations).forEach(function(fetched_location) {
            console.log('fetched location:', fetched_location.name)
            getLocations(fetched_location.href)( (err, listed_spots) => {
              listed_spots = listed_spots.items
              new_spots = []
              console.log('spots fetched:', listed_spots.length)
              Object.keys(listed_spots).forEach(function(spot) {
                getSpot(spot.href)( (err, spot_data) => {
                  new_spots.push({ name: spot_data.name, bottom: spot_data.bottom })
                })
              })
              locations.push({ name: "unknown", spots: new_spots, monthsQuality: [] });
            })
          })
        })
      }

      console.log('locations', locations)
      result.countries.push({ name: country.name, locations: locations })
      console.log(JSON.stringify(result));
      return;
    })

    return;
  });
  // write to json
});

var artists = [
  {
    fbid: '12a',
    name: 'Wiggity Wooty',
    image: 'https://s3.amazonaws.com/bit-photos/thumb/4304043.jpeg',
    email: 'rofl@gmail.com',
    twitter: '@nanner',
    artist: true,
    artist_info: {
      paypal_link: 'https://www.paypal.com/home',
      upcoming_events: [{
        id: 2,
        title: 'Awesome show',
        datetime: new Date(),
        description: 'This is quite a description and stuff',
        venue: {
          name: 'Omni HOtel',
          city: 'Austin, TX',
          country: 'USA',
          latitude: 24,
          longitude: 24
        }
      },
      {
        id: 3,
        title: 'Be show',
        datetime: new Date(),
        description: 'Description and stuff',
        venue: {
          name: 'Fire HOtel',
          city: 'ko, TX',
          country: 'USA',
          latitude: 60,
          longitude: 24
        }
      },
      {
        id: 4,
        title: 'See show',
        datetime: new Date(),
        description: 'stuff',
        venue: {
          name: 'Water HOtel',
          city: 'so, TX',
          country: 'USA',
          latitude: 40,
          longitude: 24
        }
      }


    ]
    }
  },
  {
    fbid: '12b',
    name: 'Swiggity Swooty',
    image: 'https://s3.amazonaws.com/bit-photos/thumb/3217488.jpeg',
    email: 'Skilly@gmail.com',
    twitter: '@skrillsauce',
    artist: true,
    artist_info: {
      paypal_link: 'https://www.paypal.com/home',
      upcoming_events: [{
        id: 3,
        title: 'A later awesome show',
        datetime: new Date(),
        description: 'This show happens after the awesome one interesting',
        venue: {
          name: 'Omnay Hizzy',
          city: 'Fleugerville, TX',
          country: 'US',
          latitude: 82,
          longitude: 82
        }
      }]
    }
  }
];

exports.findAll = function (req, res, next) {
  res.send(artists);
};

exports.findAllEvents = function(req, res, next) {
  res.send(artists.map(element => element.artist_info.upcoming_events));
};

exports.findById = function (req, res, next) {
  var fbid = req.params.id;
  res.send(artists.filter(element => element.fbid === fbid)[0]);
};

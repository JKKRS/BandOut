var artists = [
  {
    fbid: '12a',
    name: 'Wiggity Wooty',
    image: 'https://s3.amazonaws.com/bit-photos/thumb/4304043.jpeg',
    email: 'rofl@gmail.com',
    twitter: '@nanner',
    artist: true,
    artist_info: {
      paypal_link: 'paypal.com',
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
      }]
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
      paypal_link: 'anotherlink.paypal.com',
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

exports.findById = function (req, res, next) {
  console.log(req.params);
  var fbid = req.params.id;
  res.send(artists.filter(e => e.fbid === fbid)[0]);
};

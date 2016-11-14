/* eslint-disable max-len*/

if (process.env.NODE_ENV !== 'production')
  require('dotenv').config();

const db = require('./');
const User = db.model('user');
const Goal = db.model('goal');
const Bucket = db.model('bucket');
const Picture = db.model('picture');
const Story = db.model('story');
const Promise = require('bluebird');
const chalk = require('chalk');

const getRandomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const firstNames = ['John', 'Jane', 'Michael', 'Tim', 'Janet', 'Hussein', 'Holly', 'Molly', 'Jim', 'Mitch', 'Mary', 'Larry', 'Sarah', 'Sally', 'Dick', 'Justin', 'Sue', 'Moe', 'Hutch'];
const lastNames = ['Doe', 'Jones', 'Duncan', 'Yellen', 'Faraday', 'Einstein', 'Johnson', 'Stevens', 'Grove', 'McGary', 'Bird', 'Costolo', 'Marshall', 'Nixo', 'Bader-Ginsburg'];
const profilePics = ['https://premium.wpmudev.org/forums/?bb_attachments=712464&bbat=47619&inline', 'http://helpgrowchange.com/wp-content/uploads/2014/03/tb_profile_201303_round.png', 'http://i1028.photobucket.com/albums/y341/tepandoro/Profile%20Picture%20Round%202_zpskjsfozw5.png', 'https://www.aptitudesoftware.com/wp-content/uploads/Round-profile-2.png', 'http://www.abbieterpening.com/wp-content/uploads/2013/10/profile-pic-round-200px.png', 'http://cyclesurfstudio.com/wp-content/uploads/2015/09/profile-pic-round.png', 'https://lh6.googleusercontent.com/RPzAuHdIotBE0CqE7fdDFntiHH45k3wvLmdGWFSMlRyPXLOdiLQ04mSL7XgO72DyfDtzggcm9rTMiI_XzTmLYI7qIFVYX8Xdm0vFMSh7VIGy6W9Q-Rtw0dAuoWgzWHis0g', 'http://sociallyaligned.com/wp-content/uploads/2014/06/Profile-pic-round.png', 'http://acevasupportservices.com/wp-content/uploads/2014/11/profile-pic-round-300x295.jpg', 'http://techli.com/wp-content/uploads/Avesta_profile_round.png', 'http://192.185.89.43/~iaf/local/staticpage/pages/perfil1.png', 'https://uploads.teamtreehouse.com/production/profile-photos/129727/thumb_Paul_Profile_Round.png', 'http://i1246.photobucket.com/albums/gg611/theofficechic/Design/profile-round.png'];
const randomUsers = (num) =>
  Array(num).fill(null).map(() => {
    const first_name = firstNames[getRandomNum(0, firstNames.length - 1)];
    const last_name = lastNames[getRandomNum(0, lastNames.length - 1)];
    return {
      first_name,
      last_name,
      email: `${first_name.toLowerCase()}.${last_name.toLowerCase()}@example.com`,
      password: 123,
      private: false,
      profile_pic_url: profilePics[getRandomNum(0, profilePics.length - 1)],
      location: 'New York, NY, USA'
    }
  })

const randomBuckets = (num) =>
  Array(num).fill(null).map((val, i) => ({
    status: i % 2 ? 'completed' : 'in_progress'
  }))

const tables = {
  category: [
    { category: 'Travel', action: 'travel to' }
  ],
  goal: [
    { name: 'Berlin', banner_pic_url: 'https://afar-production.imgix.net/uploads/destination/headers/images/U7tCoW7VKN/original_BERLIN_banner.jpg?1473269740?ixlib=rails-0.3.0&w=985&h=380&fit=crop',
      category_id: 1, price_range: '3', location: 'Berlin, Germany', lat: 52.5200, lon: 13.4049},
    { name: 'Seoul', banner_pic_url: 'https://afar-production.imgix.net/uploads/destination/headers/images/2Gie8bY8Z4/original_SEOUL_banner.jpg?1473270668?ixlib=rails-0.3.0&w=985&h=380&fit=crop',
      category_id: 1, price_range: '2', location: 'Seoul, South Korea', lat: 37.5665, lon: 126.9779},
    { name: 'Charleston', banner_pic_url: 'https://afar-production.imgix.net/uploads/destination/headers/images/QjfKDtiGAR/original_CHARLESTON_banner.jpg?1473269848?ixlib=rails-0.3.0&w=985&h=380&fit=crop',
      category_id: 1, price_range: '3', location: 'Charleston, South Carolina, USA', lat: 32.776475, lon: -79.931051},
    { name: 'Martinique', banner_pic_url: 'https://afar-production.imgix.net/uploads/destination/headers/images/MhLj5sKWJh/original_MARTINIQUE_banner_03.jpg?1478037991?ixlib=rails-0.3.0&w=985&h=380&fit=crop',
      category_id: 1, price_range: '1', location: 'Martinique, Caribbean Islands', lat: 14.641528, lon: -61.024174},
    { name: 'Jordan', banner_pic_url: 'https://afar-production.imgix.net/uploads/destination/headers/images/awDvvqjRYY/original_JORDAN_banner.jpg?1473279951?ixlib=rails-0.3.0&w=985&h=380&fit=crop',
      category_id: 1, price_range: '1', location: 'Jordan', lat: 30.585164, lon: 36.238414},
    { name: 'Lisbon', banner_pic_url: 'https://afar-production.imgix.net/uploads/destination/headers/images/AsV7Sf9gBf/original_LISBON_banner.jpg?1473270072?ixlib=rails-0.3.0&w=985&h=380&fit=crop',
      category_id: 1, price_range: '2', location: 'Lisbon, Portugal', lat: 38.722252, lon: -9.139337},
    { name: 'Taiwan', banner_pic_url: 'https://afar-production.imgix.net/uploads/destination/headers/images/tGkmTswGrg/original_TAIWAN_banner.jpg?1473270791?ixlib=rails-0.3.0&w=985&h=380&fit=crop',
      category_id: 1, price_range: '1', location: 'Taiwan', lat: 23.697810, lon: 120.960515},
    { name: 'Paris', banner_pic_url: 'https://afar-production.imgix.net/uploads/destination/headers/images/EMfjf3jWnn/original_PARIS_banner.jpg?1473270441?ixlib=rails-0.3.0&w=985&h=380&fit=crop',
      category_id: 1, price_range: '4', location: 'Paris, France', lat: 48.856614, lon: 2.352222},
    { name: 'British Columbia', banner_pic_url: 'https://afar-production.imgix.net/uploads/destination/headers/images/Tx8ls3haTQ/original_CANADA_banner.jpg?1473269793?ixlib=rails-0.3.0&w=985&h=380&fit=crop',
      category_id: 1, price_range: '2', location: 'British Columbia, Canada', lat: 53.726668, lon: -127.647621},
    { name: 'Bagan', banner_pic_url: 'https://afar-production.imgix.net/uploads/destination/headers/images/bQ44QpjCGf/original_MYANMAR_banner.jpg?1473280656?ixlib=rails-0.3.0&w=985&h=380&fit=crop',
      category_id: 1, price_range: '1', location: 'Bagan, Myanmar', lat: 21.171727, lon: 94.858546}
  ],
  user: [...randomUsers(60), { first_name: 'Jake', last_name: 'Peyser', email: 'jake.peyser@example.com', password: '123', private: false, profile_pic_url: 'https://gravatar.com/avatar/aa0e7d89cbed7e3876a97aa9640f44a2?s=96&d=https://dashboard.heroku.com%2Fimages%2Fstatic%2Fninja-avatar-48x48.png', location: 'New York, NY, USA' }],
  snippet: [
    { goal_id: 1, title: 'Overview', description: 'Berlin—mecca of artists, bohemians, and Europe’s creative class—is an old, historic city made new again thanks to a torn-down wall, a reunified country, and an influx of young, trendsetting individuals from around the world. What was once a divided city is now a cultural capital of Europe. Maybe it\'s the up-all-night clubs or wealth of provocative art, but visitors often stay longer than expected and return frequently.' },
    { goal_id: 1, title: 'When to Go', description: 'Berlin is famous for its summers—not that they’re especially warm, but there is just so much to do. The summer season can be wet, so it’s best to pack an umbrella—though rain doesn’t stop Berliners from enjoying their city. May is often considered the best time to visit, with good weather and plenty of festivals and events. Winters in Berlin are cold (below freezing in January and February), but the cultural events don’t disappear. Locals stay busy with seasonal festivities and quirky adventures like skiing on the grounds of the former Tempelhof Airport, which is now a giant city park.' },
    { goal_id: 1, title: 'Can\'t Miss', description: 'To really get a feel for Berlin\'s cultural life, it’s best to visit one of the many parks and public spaces on a sunny afternoon or early in the evening. Görlitzer Park is one of the most popular hangouts, but you’ll find more locals at the Volkspark Friedrichshain. There’s a beer garden, a small hill for hiking, and even a fairy-tale fountain (the Märchenbrunnen).' },
    { goal_id: 2, title: 'Overview', description: 'South Korea\'s capital city is a living, breathing mashup of history and modernity. Centuries-old courtyards hug the roots of brand-new high-rises, and traditional teashops vie with Starbucks for customers. You\'ll find this contrast everywhere: from the glitz and glamour of the Gangnam district (which the world now knows thanks to Korean pop star Psy\'s massive hit song "Gangnam Style") to the grand, tranquil palaces of the Jongno area. The dynamic capital burgeons with inventive restaurants, galleries, and boutiques. Having rebuilt after the Korean War and hosted the world for the 1988 Summer Olympics, Seoul has now emerged as one of eastern Asia’s most vibrant cities.' },
    { goal_id: 3, title: 'When to Go', description: 'Seoul\'s humid subtropical climate has four distinct seasons, and there is no official “off season.” Some say that the city is at its best in the spring when cherry blossoms bloom, while others prefer fall, when leaves turn into a fiery mass of red, gold, and brown. Winters can be brutal, but they lend the capital city a whitewashed beauty. Summer temperatures often rise into the 90s, with rain falling during the late-summer typhoon period. No matter when you visit, however, there’s plenty to do both indoors and out.' },
    { goal_id: 4, title: 'When to Go', description: 'Seoul\'s humid subtropical climate has four distinct seasons, and there is no official “off season.” Some say that the city is at its best in the spring when cherry blossoms bloom, while others prefer fall, when leaves turn into a fiery mass of red, gold, and brown. Winters can be brutal, but they lend the capital city a whitewashed beauty. Summer temperatures often rise into the 90s, with rain falling during the late-summer typhoon period. No matter when you visit, however, there’s plenty to do both indoors and out.' },
    { goal_id: 5, title: 'When to Go', description: 'Seoul\'s humid subtropical climate has four distinct seasons, and there is no official “off season.” Some say that the city is at its best in the spring when cherry blossoms bloom, while others prefer fall, when leaves turn into a fiery mass of red, gold, and brown. Winters can be brutal, but they lend the capital city a whitewashed beauty. Summer temperatures often rise into the 90s, with rain falling during the late-summer typhoon period. No matter when you visit, however, there’s plenty to do both indoors and out.' },
    { goal_id: 6, title: 'When to Go', description: 'Seoul\'s humid subtropical climate has four distinct seasons, and there is no official “off season.” Some say that the city is at its best in the spring when cherry blossoms bloom, while others prefer fall, when leaves turn into a fiery mass of red, gold, and brown. Winters can be brutal, but they lend the capital city a whitewashed beauty. Summer temperatures often rise into the 90s, with rain falling during the late-summer typhoon period. No matter when you visit, however, there’s plenty to do both indoors and out.' },
    { goal_id: 7, title: 'When to Go', description: 'Seoul\'s humid subtropical climate has four distinct seasons, and there is no official “off season.” Some say that the city is at its best in the spring when cherry blossoms bloom, while others prefer fall, when leaves turn into a fiery mass of red, gold, and brown. Winters can be brutal, but they lend the capital city a whitewashed beauty. Summer temperatures often rise into the 90s, with rain falling during the late-summer typhoon period. No matter when you visit, however, there’s plenty to do both indoors and out.' },
    { goal_id: 8, title: 'When to Go', description: 'Seoul\'s humid subtropical climate has four distinct seasons, and there is no official “off season.” Some say that the city is at its best in the spring when cherry blossoms bloom, while others prefer fall, when leaves turn into a fiery mass of red, gold, and brown. Winters can be brutal, but they lend the capital city a whitewashed beauty. Summer temperatures often rise into the 90s, with rain falling during the late-summer typhoon period. No matter when you visit, however, there’s plenty to do both indoors and out.' },
    { goal_id: 9, title: 'When to Go', description: 'Seoul\'s humid subtropical climate has four distinct seasons, and there is no official “off season.” Some say that the city is at its best in the spring when cherry blossoms bloom, while others prefer fall, when leaves turn into a fiery mass of red, gold, and brown. Winters can be brutal, but they lend the capital city a whitewashed beauty. Summer temperatures often rise into the 90s, with rain falling during the late-summer typhoon period. No matter when you visit, however, there’s plenty to do both indoors and out.' },
    { goal_id: 10, title: 'When to Go', description: 'Seoul\'s humid subtropical climate has four distinct seasons, and there is no official “off season.” Some say that the city is at its best in the spring when cherry blossoms bloom, while others prefer fall, when leaves turn into a fiery mass of red, gold, and brown. Winters can be brutal, but they lend the capital city a whitewashed beauty. Summer temperatures often rise into the 90s, with rain falling during the late-summer typhoon period. No matter when you visit, however, there’s plenty to do both indoors and out.' }
  ],
  bucket: randomBuckets(30),
  picture: [
    { picture_url: 'http://euro-events.co/images/events/Conferences/Bancassurance2016/Brandenburg-Gate-West-Berlin.jpg'},
    { picture_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/%C3%9Cber_den_D%C3%A4chern_von_Berlin.jpg/310px-%C3%9Cber_den_D%C3%A4chern_von_Berlin.jpg'},
    { picture_url: 'http://www.visitberlin.de/sites/default/files/imagecache/high_l_300_155/I111_Neue_Synagoge_960x768_c_Pierre-Adenis.jpg'},
    { picture_url: 'https://s-media-cache-ak0.pinimg.com/originals/3f/fb/b8/3ffbb8b2b5608f2ecee6f16890935371.jpg'},
    { picture_url: 'https://www.deutschland.de/sites/default/files/styles/stage/public/field_visuals/berlin-spree-molecule-man_a.jpg?itok=H2BNTVaO'},
    { picture_url: 'http://cdn-image.travelandleisure.com/sites/default/files/styles/1600x1000/public/berlin0615-museum.jpg?itok=1MAcLZka'},
    { picture_url: 'http://cdn.ek.aero/english/images/Seoul-1_tcm233-2364446.jpg'},
    { picture_url: 'https://asiatourism.co/wp-content/uploads/2016/05/seoul.jpg'},
    { picture_url: 'http://teanabroad.org/wp-content/uploads/2015/12/Seoul-Media-3.jpg'},
    { picture_url: 'http://triphackr.com/wp-content/uploads/2015/05/A-Walking-Tour-of-Seoul.jpg'},
    { picture_url: 'http://www.fourseasons.com/content/dam/fourseasons/images/web/SKO/SKO_064_aspect16x9.jpg/jcr:content/renditions/cq5dam.web.637.358.jpeg'},
    { picture_url: 'http://tong.visitkorea.or.kr/cms/resource_etc/24/2382924_image_2.jpg'},
    { picture_url: 'http://www.scaquarium.org/wp-content/uploads/2015/11/charleston-visit-south-carolina-aquarium.jpg'},
    { picture_url: 'http://www.elliotthouseinn.com/wp-content/uploads/2013/08/Church-Street.jpg'},
    { picture_url: 'http://cdn-image.travelandleisure.com/sites/default/files/styles/tnl_redesign_article_landing_page/public/wbcities0715-charleston.jpg?itok=M4JoOYbB'},
    { picture_url: 'https://s.yimg.com/ny/api/res/1.2/Goa1bweVOupUMPEKRl6Kpw--/YXBwaWQ9aGlnaGxhbmRlcjtzbT0xO3c9ODAwO2lsPXBsYW5l/http://media.zenfs.com/en_US/News/US-AFPRelax/istock_91753775.62e9b082749.original.jpg'},
    { picture_url: 'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-476467958_super.jpg?sharp=10&vib=20&w=1200'},
    { picture_url: 'http://charlestonsouthcarolinaart.com/wp-content/uploads/2016/05/charlstonimage.jpg'},
    { picture_url: 'http://www.yachts.travel/wp-content/uploads/Martinique-Island-845x321.jpg'},
    { picture_url: 'http://vacations.aircanada.com/media/images/common/csstorage/destination/MexicoCaribbean/Martinique_Anse-dArlet.jpg'},
    { picture_url: 'https://thenypost.files.wordpress.com/2013/12/martiniuweeee.jpg'},
    { picture_url: 'https://media-cdn.tripadvisor.com/media/photo-s/01/15/29/08/st-luce.jpg'},
    { picture_url: 'https://www.msccruises.com/en-gl/Assets/martinique_5267_12229_433-265_Images.jpg'},
    { picture_url: 'http://blog.davidgiralphoto.com/wp-content/uploads/2014/03/11-editorial-travel-martinique-spectacular-sunset-plage-des-boucaniers-club-med.jpg'},
    { picture_url: 'http://ichef.bbci.co.uk/news/560/media/images/65395000/jpg/_65395231_jordan_petra_g.jpg'},
    { picture_url: 'http://www.urdumania.net/wp-content/uploads/2010/09/jordan-country-history-culture-and-information.jpg'},
    { picture_url: 'http://atlas.media.mit.edu/static/img/headers/country/asjor.jpg'},
    { picture_url: 'http://travel.nationalgeographic.com/u/TvyamNb-BivtNwpvn7Sct0VFDulyAfA9wBcU0gVHVnqC5ghvVKKpDVenphf7QKpLqFEHewkjde0MBNuAP_M/'},
    { picture_url: 'https://www.dcrainmaker.com/images/2011/01/cycling-in-jordan-and-other-adventures-in-the-desert.jpg'},
    { picture_url: 'https://s3.amazonaws.com/aphs.worldnomads.com/safetyhub/12392/Abu_Derwish_Mosque_in_Amman___Jordan.jpg'},
    { picture_url: 'http://assets.mshanken.com/wso/Articles/2015/RC_LisbonScenic_1600.jpg'},
    { picture_url: 'http://travelgot.com/wp-content/uploads/2016/10/Lisbon-Old-Town1-1.jpg'},
    { picture_url: 'http://www.telegraph.co.uk/content/dam/Travel/Destinations/Europe/Portugal/Lisbon/Lisbon---36-Hours---Rossio-Square-night-xlarge.jpg'},
    { picture_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Lisbon,_Portugal_April_2010_(5127652338).jpg/230px-Lisbon,_Portugal_April_2010_(5127652338).jpg'},
    { picture_url: 'http://img1.10bestmedia.com/Images/Photos/315130/Poco-1_54_990x660.jpg'},
    { picture_url: 'http://www.planetware.com/photos-large/P/portugal-lisbon-se.jpg'},
    { picture_url: 'http://cdn.ek.aero/english/images/Taiwan-Large_tcm233-2396552.jpg'},
    { picture_url: 'http://www.coxandkingsusa.com/resources/images/countries/taiwan.jpg'},
    { picture_url: 'http://f.tqn.com/y/geography/1/W/S/d/1/Taiwan.jpg'},
    { picture_url: 'http://assets.inhabitat.com/wp-content/blogs.dir/1/files/2016/01/Cinderella-Glass-Slipper-Church-in-Chiayi-Taiwan-7.jpg'},
    { picture_url: 'http://i.forbesimg.com/media/lists/places/taiwan_416x416.jpg'},
    { picture_url: 'http://ovationdmc.com/wp-content/uploads/2015/05/Kaohsiung-Taiwan.jpg'},
    { picture_url: 'https://cache-graphicslib.viator.com/graphicslib/thumbs360x240/7845/SITours/eiffel-tower-priority-access-ticket-with-host-in-paris-299567.jpg'},
    { picture_url: 'http://en.parisinfo.com/var/otcp/sites/images/_aliases/carrousel2/node_43/node_51/node_233/carrousel-noel-a-paris-%7C-740x380-%7C-%C2%A9-dr/15983189-1-fre-FR/Carrousel-Noel-a-Paris-%7C-740x380-%7C-%C2%A9-DR.jpg'},
    { picture_url: 'http://www.bourbon-paris-hotel.com/media/galerie/accueil2-hotel-3-etoiles-paris-1.jpg'},
    { picture_url: 'http://assets.fodors.com/destinations/6996/tuileries-garden-around-the-louvre-paris-france_main.jpg'},
    { picture_url: 'http://www.thetimes.co.uk/travel/s3/growthtravel-prod/uploads/2016/04/Paris-on-a-budget.jpg'},
    { picture_url: 'https://www.ciee.org/study-abroad/images/programs/0778/headers/desktop/paris-france-global-institute-open-campus-main.jpg'},
    { picture_url: 'http://www.hellobc.com/getmedia/627ba64c-2772-4ff0-932f-aeef266b5d19/4-RM-013-3-0076-Kicking-Horse-Pass.jpg.aspx'},
    { picture_url: 'http://www.hellobc.co.uk/getmedia/1dab36e2-3292-480a-b173-bb2cedb3153a/5-acp31781-great-bear-rainforest-spirit-bear-RM.jpg.aspx?width=990&height=530&ext=.jpg'},
    { picture_url: 'http://infobonos.com/wp-content/uploads/2015/06/British-Columbia-interior.jpg'},
    { picture_url: 'http://www.hellobc.com/getmedia/ec32812f-2ea6-4c34-9e19-a2fca4998c9f/1-2610-Cowichan-Valley.jpg.aspx'},
    { picture_url: 'http://www.hellobc.com/getmedia/cdce7f4c-f375-4602-8c0c-324aa7db1c45/6-0691-Gwaii-Haanas-hiking.jpg.aspx'},
    { picture_url: 'http://www.alux.com/wp-content/uploads/2016/08/British-Columbia-Canada..jpg'},
    { picture_url: 'https://www.grasshopperadventures.com/_Resources/Persistent/94912cbbb72c876e2bc82192bbff41c53cd67f74/cycle-mandalay-to-bagan-masthead-2.jpg'},
    { picture_url: 'http://www.placestoseeinyourlifetime.com/wp-content/uploads/2014/04/Anuparb-Papapan3.jpg'},
    { picture_url: 'http://www.go-myanmar.com/files/destination-photo/5_the_gawdaw_palin_temple.jpg'},
    { picture_url: 'http://www.leeabbamonte.com/wp-content/uploads/2015/10/IMG_0823-1024x768.jpg'},
    { picture_url: 'http://www.ailinktravelandtour.com/wp-content/uploads/2013/10/bagan01.jpg'},
    { picture_url: 'http://wikitravel.org/upload/en/thumb/c/c7/Bagan.jpg/300px-Bagan.jpg'}
  ]
}

const stories = [
  { title: 'Aenean accumsan', comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent posuere, massa ac vestibulum accumsan, lorem quam interdum erat, nec sodales sapien ex nec quam. Etiam blandit purus eget dui ullamcorper porttitor. Nulla vitae sapien eget nulla finibus tincidunt ut vel justo. Proin condimentum vestibulum tellus, ac posuere quam rutrum ut. Aenean accumsan, ipsum ac semper dignissim, sem elit placerat tellus, ac semper justo nibh a nibh.', rating: 4 },
  { title: 'Maecenas id ornare est', comment: 'Vestibulum leo est, hendrerit sit amet ipsum eget, blandit pretium ex. Cras interdum metus vel dolor convallis, in tempus turpis vulputate. Maecenas ullamcorper fermentum elit sit amet aliquam. Sed varius lorem risus, non tincidunt neque accumsan id. Nullam varius est ut ipsum dictum dictum. Praesent varius nisl a velit fermentum, ut tincidunt quam malesuada. Aliquam justo lectus, luctus ac sodales vel, porta at libero. Sed accumsan, lorem ac malesuada dictum, lectus sem placerat nisl, dapibus placerat leo nisi id risus. Aliquam cursus sagittis nibh vel tincidunt.', rating: 5 },
  { title: 'Aliquam sed orci', comment: 'Proin suscipit, ipsum et pharetra sollicitudin, augue nisl vestibulum tellus, nec ultricies risus sapien et quam. Vestibulum sit amet gravida elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam sed turpis nec risus pellentesque aliquet vel a quam. Fusce sed gravida nunc.', rating: 2 },
  { title: 'Cras mattis purus', comment: 'Nam ut egestas velit. Donec ullamcorper volutpat velit eget pellentesque. Nulla efficitur ante ut elit volutpat hendrerit varius fermentum neque. Etiam vehicula cursus nisl sit amet fringilla. Fusce risus ex, eleifend ac semper non, tempor in orci. Mauris vitae rutrum elit.', rating: 3 },
  { title: 'Nam elementum pharetra est', comment: 'Vivamus eget finibus dui. Cras vel luctus magna. Integer finibus nunc sit amet felis egestas, ac laoreet arcu finibus. Etiam rhoncus diam enim, eu consequat erat interdum sit amet. Donec maximus purus eget risus scelerisque elementum. Pellentesque orci libero, dapibus quis efficitur eget, vulputate ut dui.', rating: 1 },
  { title: 'In hac habitasse platea dictumst', comment: 'ullam feugiat erat vitae purus pulvinar tristique. In hac habitasse platea dictumst. Sed nibh massa, convallis a augue sed, gravida eleifend velit. Integer eget felis ut neque posuere euismod eget et risus. Vivamus orci felis, vestibulum ac tempus at, tempus non mauris. Suspendisse potenti. Nullam pellentesque arcu diam, id cursus metus aliquam auctor. Ut pretium sed lacus id volutpat.', rating: 4 }
]

db.didSync
  .then(() => db.sync({ force: true }))
  // Fill tables with all seed data
  .then(() => {
    return Promise.all(Object.keys(tables).map(table =>
      db.Promise.map(tables[table], result => db.model(table).create(result))))
  })
  // Create user likes
  .then(() => {
    return Promise.all([ User.findAll(), Goal.findAll() ])
  })
  .spread((users, goals) => {
    const addGoals = [];
    users.forEach(user => {
      addGoals.push(user.addGoal(goals.sort( () => 0.5 - Math.random() ).slice(0, 5)));
    })
    return Promise.all(addGoals)
  })
  // Create goal buckets
  .then(() => {
    return Promise.all([ Goal.findAll(), Bucket.findAll() ])
  })
  .spread((goals, buckets) => {
    const addBuckets = [];
    goals.forEach((goal, idx) => {
      for (let i = 3 * idx; i < 3 * (idx + 1); i++)
        addBuckets.push(goal.addBucket(buckets[i]));
    })
    return Promise.all(addBuckets)
  })
  // Add pictures and fellowships to each bucket
  .then(() => {
    return Promise.all([ Bucket.findAll(), Picture.findAll(), User.findAll() ])
  })
  .spread((buckets, pictures, users) => {
    const addChildren = [];
    buckets.forEach((bucket, idx) => {
      for (let i = 2 * idx; i < 2 * (idx + 1); i++) {
        addChildren.push(bucket.addPicture(pictures[i]));
        addChildren.push(bucket.addUser(users[i]));
      }
    })
    return Promise.all(addChildren)
  })
  .then(() => Bucket.findAll({ include: [User] }))
  .then(buckets => {
    const newStories = [];
    buckets.forEach(bucket => {
      if (bucket.status === 'completed') {
        bucket.users.forEach(user => {
          let newStory = Object.assign(
            { bucket_id: bucket.id, user_id: user.id },
            stories[getRandomNum(0, stories.length - 1)]
          );
          newStories.push(Story.create(newStory));
        })
      }
    })
    return Promise.all(newStories);
  })
  .then(() => console.log(chalk.green('Database seeded')))
  .catch(error => console.log(chalk.red(error)))
  .finally(() => db.close())

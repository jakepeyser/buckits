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
      category_id: 1, price_range: '2', location: 'Seoul, South Korea', lat: 37.5665, lon: 126.9779}
  ],
  user: [
    { first_name: 'John', last_name: 'Doe', email: 'johndoe@example.com', password: '123',
      private: false, profile_pic_url: 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png', location: 'Austin, TX' },
    { first_name: 'Jane', last_name: 'Doe', email: 'janedoe@example.com', password: '123',
      private: false, profile_pic_url: 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png', location: 'New York, NY' },
    { first_name: 'Michael', last_name: 'Jones', email: 'mikejones@example.com', password: '123',
      private: false, profile_pic_url: 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png', location: 'Atlanta, GA' },
    { first_name: 'Tim', last_name: 'Duncan', email: 'timduncan@example.com', password: '123',
      private: false, profile_pic_url: 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png', location: 'San Antonio, TX' },
    { first_name: 'Janet', last_name: 'Yellen', email: 'makemoneymoney@example.com', password: '123',
      private: false, profile_pic_url: 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png', location: 'Washington, DC' },
    { first_name: 'Hussein', last_name: 'Faraday', email: 'thecage@example.com', password: '123',
      private: false, profile_pic_url: 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png', location: 'London, England' },
    { first_name: 'Holly', last_name: 'Grove', email: 'thadrought@example.com', password: '123',
      private: false, profile_pic_url: 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png', location: 'New Orleans, LA' },
    { first_name: 'Mitch', last_name: 'McGary', email: 'meeshigan@example.com', password: '123',
      private: false, profile_pic_url: 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png', location: 'Milwaukee, WI' },
    { first_name: 'Larry', last_name: 'Bird', email: 'larrybird@example.com', password: '123',
      private: false, profile_pic_url: 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png', location: 'Boston, MA' },
    { first_name: 'Sarah', last_name: 'Silverman', email: 'funnygirl@example.com', password: '123',
      private: false, profile_pic_url: 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png', location: 'Los Angeles, CA' },
    { first_name: 'Dick', last_name: 'Costolo', email: 'tweettweet@example.com', password: '123',
      private: false, profile_pic_url: 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png', location: 'San Francisco, CA' },
    { first_name: 'Justin', last_name: 'Trudeau', email: 'mrcanada@example.com', password: '123',
      private: false, profile_pic_url: 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png', location: 'Ottawa, Canada' }
  ],
  snippet: [
    { goal_id: 1, title: 'Overview', description: 'Berlin—mecca of artists, bohemians, and Europe’s creative class—is an old, historic city made new again thanks to a torn-down wall, a reunified country, and an influx of young, trendsetting individuals from around the world. What was once a divided city is now a cultural capital of Europe. Maybe it\'s the up-all-night clubs or wealth of provocative art, but visitors often stay longer than expected and return frequently.' },
    { goal_id: 1, title: 'When to Go', description: 'Berlin is famous for its summers—not that they’re especially warm, but there is just so much to do. The summer season can be wet, so it’s best to pack an umbrella—though rain doesn’t stop Berliners from enjoying their city. May is often considered the best time to visit, with good weather and plenty of festivals and events. Winters in Berlin are cold (below freezing in January and February), but the cultural events don’t disappear. Locals stay busy with seasonal festivities and quirky adventures like skiing on the grounds of the former Tempelhof Airport, which is now a giant city park.' },
    { goal_id: 1, title: 'Can\'t Miss', description: 'To really get a feel for Berlin\'s cultural life, it’s best to visit one of the many parks and public spaces on a sunny afternoon or early in the evening. Görlitzer Park is one of the most popular hangouts, but you’ll find more locals at the Volkspark Friedrichshain. There’s a beer garden, a small hill for hiking, and even a fairy-tale fountain (the Märchenbrunnen).' },
    { goal_id: 2, title: 'Overview', description: 'South Korea\'s capital city is a living, breathing mashup of history and modernity. Centuries-old courtyards hug the roots of brand-new high-rises, and traditional teashops vie with Starbucks for customers. You\'ll find this contrast everywhere: from the glitz and glamour of the Gangnam district (which the world now knows thanks to Korean pop star Psy\'s massive hit song "Gangnam Style") to the grand, tranquil palaces of the Jongno area. The dynamic capital burgeons with inventive restaurants, galleries, and boutiques. Having rebuilt after the Korean War and hosted the world for the 1988 Summer Olympics, Seoul has now emerged as one of eastern Asia’s most vibrant cities.' },
    { goal_id: 2, title: 'When to Go', description: 'Seoul\'s humid subtropical climate has four distinct seasons, and there is no official “off season.” Some say that the city is at its best in the spring when cherry blossoms bloom, while others prefer fall, when leaves turn into a fiery mass of red, gold, and brown. Winters can be brutal, but they lend the capital city a whitewashed beauty. Summer temperatures often rise into the 90s, with rain falling during the late-summer typhoon period. No matter when you visit, however, there’s plenty to do both indoors and out.' }
  ],
  bucket: randomBuckets(6),
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
    { picture_url: 'http://tong.visitkorea.or.kr/cms/resource_etc/24/2382924_image_2.jpg'}
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
      addGoals.push(user.addGoal(goals));
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

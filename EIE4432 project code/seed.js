const mongoose = require('mongoose');
const Event = require('./models/Event');
const Seat = require('./models/Seat');

async function seed() {
  await mongoose.connect('mongodb+srv://23079398d:J1xt5MFMamYxb5RF@3112nosql.pkhakve.mongodb.net/?appName=3112NoSQL', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await Event.deleteMany({});
  await Seat.deleteMany({});

  const event1 = new Event({
    title: "The Mystery - Symphony Orchestra of India",
    dateTime: new Date("2026-01-05T18:00:00"),
    venue: "Hong Kong Concert Hall",
    description: "Join us for an enchanting evening as the Symphony Orchestra of India presents \"The Mystery.\" This captivating performance will explore themes of intrigue and suspense through a carefully curated selection of orchestral pieces. Experience the power of live music as talented musicians take you on a journey through rich harmonies and dynamic compositions. Don't miss this opportunity to witness a stellar performance in the acoustically renowned Hong Kong Concert Hall.",
    coverImage: "event_india.png",
  });
  await event1.save();

  const seatsEvent1 = [];
  for (let r = 0; r < 10; r++) {
    let rowChar = String.fromCharCode(65 + r); 
    let priceTier = r < 2 ? 'premium' : 'economy';
    let price = r < 2 ? 800 : 500;

    for (let c = 1; c <= 10; c++) {
      seatsEvent1.push({
        eventId: event1._id,
        seatNumber: rowChar + c,
        floor: 1,
        status: 'available',
        priceTier,
        price,
      });
    }
  }
  await Seat.insertMany(seatsEvent1);

  const event2 = new Event({
    title: "USA High School Orchestra",
    dateTime: new Date("2026-01-15T19:00:00"),
    venue: "Hong Kong Cultural Centre Concert Hall",
    description: "Celebrate the talent and dedication of young musicians at the USA High School Orchestra performance. This event will showcase a diverse repertoire, highlighting the skills and passion of high school students from across the United States. Enjoy an inspiring evening filled with youthful energy, creativity, and the joy of orchestral music. Join us in supporting the next generation of musicians at the beautiful Hong Kong Cultural Centre Concert Hall.",
    coverImage: "event_USA.png",
  });
  await event2.save();

  const seatsEvent2 = [];
  for (let r = 0; r < 7; r++) {
    let rowChar = String.fromCharCode(65 + r);
    let priceTier = r < 1 ? 'premium' : 'economy';
    let price = r < 1 ? 500 : 300;

    for (let c = 1; c <= 7; c++) {
      seatsEvent2.push({
        eventId: event2._id,
        seatNumber: rowChar + c,
        floor: 1,
        status: 'available',
        priceTier,
        price,
      });
    }
  }
  await Seat.insertMany(seatsEvent2);

  console.log('Seeding done!');
  mongoose.disconnect();
}

seed().catch(console.error);

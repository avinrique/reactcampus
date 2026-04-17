const College = require('../models/College.model');
const City = require('../models/City.model');
const logger = require('../config/logger');

const cities = [
  { name: 'Mumbai', state: 'Maharashtra', description: 'India\'s financial capital, home to IIT Bombay and numerous premier institutions.', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&h=600&fit=crop', featured: true },
  { name: 'New Delhi', state: 'Delhi', description: 'The national capital with top universities including IIT Delhi, JNU, and Delhi University.', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&h=600&fit=crop', featured: true },
  { name: 'Chennai', state: 'Tamil Nadu', description: 'Cultural capital of South India, home to IIT Madras, Anna University, and SRM.', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&h=600&fit=crop', featured: true },
  { name: 'Hyderabad', state: 'Telangana', description: 'The City of Pearls, a major IT hub with IIIT Hyderabad and University of Hyderabad.', image: 'https://images.unsplash.com/photo-1572435555646-7ad9a149ad91?w=1200&h=600&fit=crop', featured: true },
  { name: 'Kolkata', state: 'West Bengal', description: 'The cultural capital of India with Jadavpur University, Presidency University, and ISI.', image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=1200&h=600&fit=crop', featured: true },
  { name: 'Pune', state: 'Maharashtra', description: 'Known as the Oxford of the East, home to COEP, Symbiosis, and Savitribai Phule University.', image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e13?w=1200&h=600&fit=crop', featured: true },
  { name: 'Kanpur', state: 'Uttar Pradesh', description: 'Home to IIT Kanpur, one of India\'s premier engineering institutions.', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&h=600&fit=crop', featured: false },
  { name: 'Kharagpur', state: 'West Bengal', description: 'Known for IIT Kharagpur, the oldest and largest IIT in India.', image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=600&fit=crop', featured: false },
  { name: 'Roorkee', state: 'Uttarakhand', description: 'Home to IIT Roorkee, one of the oldest technical institutions in Asia.', image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=600&fit=crop', featured: false },
  { name: 'Guwahati', state: 'Assam', description: 'Gateway to Northeast India, home to IIT Guwahati on the banks of Brahmaputra.', image: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1200&h=600&fit=crop', featured: false },
  { name: 'Varanasi', state: 'Uttar Pradesh', description: 'One of the world\'s oldest cities, home to BHU and IIT BHU.', image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&h=600&fit=crop', featured: false },
  { name: 'Pilani', state: 'Rajasthan', description: 'Home to BITS Pilani, India\'s leading private engineering university.', image: 'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=1200&h=600&fit=crop', featured: false },
  { name: 'Vellore', state: 'Tamil Nadu', description: 'Known for VIT University, one of India\'s top private universities.', image: 'https://images.unsplash.com/photo-1574958269340-fa927503f3dd?w=1200&h=600&fit=crop', featured: false },
  { name: 'Mangalore', state: 'Karnataka', description: 'Coastal city home to NIT Surathkal and other engineering colleges.', image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1200&h=600&fit=crop', featured: false },
  { name: 'Manipal', state: 'Karnataka', description: 'A university town known for Manipal Academy of Higher Education.', image: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=1200&h=600&fit=crop', featured: false },
  { name: 'Noida', state: 'Uttar Pradesh', description: 'Part of Delhi NCR, home to Amity University and other institutions.', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=600&fit=crop', featured: false },
  { name: 'Greater Noida', state: 'Uttar Pradesh', description: 'Fast-growing education hub in Delhi NCR with Shiv Nadar University.', image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=600&fit=crop', featured: false },
  { name: 'Coimbatore', state: 'Tamil Nadu', description: 'The Manchester of South India, home to PSG College of Technology.', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c6f1?w=1200&h=600&fit=crop', featured: false },
  { name: 'Mohali', state: 'Punjab', description: 'Part of Chandigarh Tricity, home to Chandigarh University.', image: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=1200&h=600&fit=crop', featured: false },
  { name: 'Patiala', state: 'Punjab', description: 'Home to Thapar Institute of Engineering and Technology.', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=600&fit=crop', featured: false },
  { name: 'Indore', state: 'Madhya Pradesh', description: 'India\'s cleanest city, home to IIT Indore.', image: 'https://images.unsplash.com/photo-1568792923760-d70635a89fdc?w=1200&h=600&fit=crop', featured: false },
  { name: 'Nagpur', state: 'Maharashtra', description: 'The Orange City, home to VNIT Nagpur.', image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&h=600&fit=crop', featured: false },
  { name: 'Warangal', state: 'Telangana', description: 'Historic city home to NIT Warangal, one of the top NITs in India.', image: 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=1200&h=600&fit=crop', featured: false },
  { name: 'Bhubaneswar', state: 'Odisha', description: 'The Temple City of India, home to KIIT University.', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1200&h=600&fit=crop', featured: false },
  { name: 'Kochi', state: 'Kerala', description: 'The Queen of the Arabian Sea, home to CUSAT.', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&h=600&fit=crop', featured: false },
  { name: 'Kozhikode', state: 'Kerala', description: 'Home to NIT Calicut, a premier technical institution.', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&h=600&fit=crop', featured: false },
  { name: 'Rourkela', state: 'Odisha', description: 'Steel city home to NIT Rourkela with excellent research facilities.', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&h=600&fit=crop', featured: false },
  { name: 'Aligarh', state: 'Uttar Pradesh', description: 'Known for Aligarh Muslim University, a prestigious central university.', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&h=600&fit=crop', featured: false },
  { name: 'Gandhinagar', state: 'Gujarat', description: 'Capital of Gujarat, home to DA-IICT and IIT Gandhinagar.', image: 'https://images.unsplash.com/photo-1572435555646-7ad9a149ad91?w=1200&h=600&fit=crop', featured: false },
  { name: 'Dhanbad', state: 'Jharkhand', description: 'The Coal Capital of India, home to IIT (ISM) Dhanbad.', image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=1200&h=600&fit=crop', featured: false },
  { name: 'Phagwara', state: 'Punjab', description: 'Home to Lovely Professional University, India\'s largest single-campus university.', image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e13?w=1200&h=600&fit=crop', featured: false },
  { name: 'Sonipat', state: 'Haryana', description: 'Emerging education hub near Delhi, home to Ashoka University.', image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&h=600&fit=crop', featured: false },
  { name: 'Durgapur', state: 'West Bengal', description: 'Industrial city with NIT Durgapur and other engineering colleges.', image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=600&fit=crop', featured: false },
  { name: 'Tiruchirappalli', state: 'Tamil Nadu', description: 'Home to NIT Trichy, the top-ranked NIT in India.', image: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1200&h=600&fit=crop', featured: false },
];

const seedCities = async () => {
  const slugify = require('slugify');

  for (const data of cities) {
    const slug = slugify(data.name, { lower: true, strict: true });

    // Count published colleges for this city
    const collegeCount = await College.countDocuments({
      'location.city': { $regex: `^${data.name}$`, $options: 'i' },
      status: 'published',
    });

    await City.findOneAndUpdate(
      { slug },
      { ...data, slug, isActive: true, collegeCount },
      { upsert: true, setDefaultsOnInsert: true }
    );
  }

  logger.info(`Seeded ${cities.length} cities`);
};

module.exports = seedCities;

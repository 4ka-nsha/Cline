/**
 * Curated dropdown data for the farm-setup form.
 *
 * Deliberately a SMALL hand-picked list rather than a maps/geo integration
 * (out of scope). Districts are representative, not exhaustive.
 */

export const STATES: Record<string, string[]> = {
  Maharashtra: [
    'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara',
    'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli',
    'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Nagpur', 'Nanded', 'Nandurbar',
    'Nashik', 'Osmanabad', 'Palghar', 'Parbhani', 'Pune', 'Raigad',
    'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane',
    'Wardha', 'Washim', 'Yavatmal',
  ],
  'Madhya Pradesh': [
    'Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Barwani', 'Betul',
    'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara', 'Damoh', 'Datia',
    'Dewas', 'Dhar', 'Dindori', 'Guna', 'Gwalior', 'Harda', 'Hoshangabad',
    'Indore', 'Jabalpur', 'Jhabua', 'Katni', 'Khandwa', 'Khargone',
    'Mandla', 'Mandsaur', 'Morena', 'Narsinghpur', 'Neemuch', 'Panna',
    'Raisen', 'Ratlam', 'Rewa', 'Sagar', 'Satna', 'Sehore', 'Seoni',
    'Shahdol', 'Shajapur', 'Sheopur', 'Shivpuri', 'Sidhi', 'Singrauli',
    'Tikamgarh', 'Ujjain', 'Umaria', 'Vidisha',
  ],
  'Uttar Pradesh': [
    'Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya',
    'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda',
    'Barabanki', 'Bareilly', 'Basti', 'Bhadohi', 'Budaun', 'Bulandshahr',
    'Chandauli', 'Chitrakoot', 'Deoria', 'Etah', 'Etawa', 'Farrukhabad',
    'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur',
    'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras',
    'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar',
    'Kasganj', 'Kaushambi', 'Kheri', 'Kushinagar', 'Lalitpur', 'Lucknow',
    'Maharajganj', 'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur',
    'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'Prayagraj',
    'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar',
    'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur',
    'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi',
  ],

  Rajasthan: [
    'Ajmer', 'Alwar', 'Banswara', 'Baran', 'Barmer', 'Bharatpur',
    'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa',
    'Dholpur', 'Dungarpur', 'Hanumangarh', 'Jaipur', 'Jaisalmer', 'Jalore',
    'Jhalawar', 'Jodhpur', 'Karauli', 'Kota', 'Nagaur', 'Pali',
    'Pratapgarh', 'Rajsamand', 'Sawai Madhopur', 'Sikar', 'Sirohi',
    'Sri Ganganagar', 'Tonk', 'Udaipur',
  ],
  Punjab: [
    'Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib',
    'Fazilka', 'Ferozepur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar',
    'Kapurthala', 'Ludhiana', 'Mansa', 'Moga', 'Muktsar', 'Pathankot',
    'Patiala', 'Rupnagar', 'Sangrur', 'Shahid Bhagat Singh Nagar',
    'Tarn Taran',
  ],
  Haryana: [
    'Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad',
    'Gurugram', 'Hisar', 'Jhajjar', 'Jind', 'Kaithal', 'Karnal',
    'Kurukshetra', 'Mahendragarh', 'Nuh', 'Palwal', 'Panchkula', 'Panipat',
    'Rewari', 'Rohtak', 'Sirsa', 'Sonipat', 'Yamunanagar',
  ],
  Gujarat: [
    'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch',
    'Bhavnagar', 'Botad', 'Chhota Udaipur', 'Dahod', 'Dang',
    'Devbhoomi Dwarka', 'Gandhinagar', 'Gir Somnath', 'Jamnagar',
    'Junagadh', 'Kheda', 'Kutch', 'Mahisagar', 'Mehsana', 'Morbi',
    'Narmada', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot',
    'Sabarkantha', 'Surat', 'Surendranagar', 'Tapi', 'Vadodara', 'Valsad',
  ],
  'Andhra Pradesh': [
    'Anantapur', 'Annamayya', 'Bapatla', 'Chittoor',
    'Dr. B.R. Ambedkar Konaseema', 'East Godavari', 'Eluru', 'Guntur',
    'Kakinada', 'Krishna', 'Kurnool', 'Nandyal', 'NTR', 'Palnadu',
    'Prakasam', 'Sri Potti Sriramulu Nellore', 'Srikakulam', 'Tirupati',
    'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa',
  ],
  Telangana: [
    'Adilabad', 'Bhadradri Kothagudem', 'Hanumakonda', 'Hyderabad',
    'Jagtial', 'Jangaon', 'Jayashankar Bhupalpally', 'Jogulamba Gadwal',
    'Kamareddy', 'Karimnagar', 'Khammam', 'Komaram Bheem Asifabad',
    'Mahabubabad', 'Mahabubnagar', 'Mancherial', 'Medak',
    'Medchal-Malkajgiri', 'Mulugu', 'Nagarkurnool', 'Nalgonda',
    'Narayanpet', 'Nirmal', 'Nizamabad', 'Peddapalli', 'Rajanna Sircilla',
    'Rangareddy', 'Sangareddy', 'Siddipet', 'Suryapet', 'Vikarabad',
    'Wanaparthy', 'Warangal', 'Yadadri Bhuvanagiri',
  ],
  Karnataka: [
    'Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban',
    'Bidar', 'Chamarajanagar', 'Chikkaballapur', 'Chikkamagaluru',
    'Chitradurga', 'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag',
    'Hassan', 'Haveri', 'Kalaburagi', 'Kolar', 'Koppal', 'Mandya',
    'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi',
    'Uttara Kannada', 'Vijayapura', 'Yadgir',
  ],
  'Tamil Nadu': [
    'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore',
    'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kancheepuram',
    'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam',
    'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram',
    'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni',
    'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tiruppur',
    'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Villupuram',
    'Virudhunagar',
  ],
  'West Bengal': [
    'Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur',
    'Darjeeling', 'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram',
    'Kalimpong', 'Kolkata', 'Malda', 'Murshidabad', 'Nadia',
    'North 24 Parganas', 'Paschim Bardhaman', 'Paschim Medinipur',
    'Purba Bardhaman', 'Purba Medinipur', 'Purulia', 'South 24 Parganas',
    'Uttar Dinajpur',
  ],
  Bihar: [
    'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur',
    'Bhojpur', 'Buxar', 'Darbhanga', 'East Champaran', 'Gaya',
    'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur', 'Katihar', 'Khagaria',
    'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani', 'Muzaffarpur',
    'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa',
    'Samastipur', 'Sheikhpura', 'Sheohar', 'Siwan', 'Supaul', 'Vaishali',
    'West Champaran',
  ],
};

export const SOIL_TYPES = [
  'Black (Regur)',
  'Red',
  'Laterite',
  'Alluvial',
  'Sandy',
  'Clayey',
  'Loamy',
  'Saline',
  'Peaty',
  'Desert (Arid)',
  'Not sure',
];

export const CROP_PREFERENCES = [
  'Kharif (kharif season)',
  'Rabi (rabi season)',
  'Zaid (summer season)',
  'Perennial / plantation',
  'Vegetables',
  'Pulses',
  'Oilseeds',
  'No preference',
];

export const CROP_TYPES = [
  'Wheat', 'Rice', 'Maize', 'Soybean', 'Cotton', 'Sugarcane', 'Groundnut',
  'Mustard', 'Gram', 'Tur (Arhar)', 'Moong', 'Urad', 'Bajra', 'Jowar',
  'Ragi', 'Barley', 'Sesame', 'Castor', 'Onion', 'Potato', 'Tomato',
  'Chilli', 'Garlic', 'Ginger', 'Turmeric', 'Cabbage', 'Cauliflower',
  'Brinjal', 'Okra', 'Cucumber', 'Watermelon', 'Muskmelon', 'Pumpkin',
  'Spinach', 'Coriander', 'Banana', 'Mango', 'Grapes', 'Pomegranate',
  'Orange', 'Apple', 'Guava', 'Papaya', 'Coconut', 'Areca nut',
  'Cashew', 'Sunflower', 'Jute', 'Tobacco', 'Tea', 'Coffee', 'Rubber',
  'Peas', 'Lady finger', 'Other',
];

export const GROWTH_STAGES = [
  'Not sown yet',
  'Land preparation',
  'Sowing / transplanting done',
  'Germination',
  'Vegetative growth',
  'Flowering',
  'Fruit / grain development',
  'Maturity',
  'Harvested',
  'Other',
];

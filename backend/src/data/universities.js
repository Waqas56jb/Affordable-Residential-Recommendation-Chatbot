/**
 * Major universities in UK and Qatar with coordinates for distance calculations.
 * Sources: public data, official university sites.
 */
export const UNIVERSITIES = [
  // UK
  { id: 'ucl', name: 'UCL', fullName: 'University College London', city: 'London', country: 'UK', lat: 51.5246, lon: -0.1340 },
  { id: 'imperial', name: 'Imperial College London', fullName: 'Imperial College London', city: 'London', country: 'UK', lat: 51.4988, lon: -0.1749 },
  { id: 'lse', name: 'LSE', fullName: 'London School of Economics', city: 'London', country: 'UK', lat: 51.5145, lon: -0.1167 },
  { id: 'kcl', name: 'King\'s College London', fullName: 'King\'s College London', city: 'London', country: 'UK', lat: 51.5113, lon: -0.1160 },
  { id: 'manchester', name: 'University of Manchester', fullName: 'University of Manchester', city: 'Manchester', country: 'UK', lat: 53.4668, lon: -2.2339 },
  { id: 'birmingham', name: 'University of Birmingham', fullName: 'University of Birmingham', city: 'Birmingham', country: 'UK', lat: 52.4489, lon: -1.9308 },
  { id: 'leeds', name: 'University of Leeds', fullName: 'University of Leeds', city: 'Leeds', country: 'UK', lat: 53.8074, lon: -1.5558 },
  { id: 'edinburgh', name: 'University of Edinburgh', fullName: 'University of Edinburgh', city: 'Edinburgh', country: 'UK', lat: 55.9444, lon: -3.1883 },
  { id: 'oxford', name: 'University of Oxford', fullName: 'University of Oxford', city: 'Oxford', country: 'UK', lat: 51.7548, lon: -1.2544 },
  { id: 'cambridge', name: 'University of Cambridge', fullName: 'University of Cambridge', city: 'Cambridge', country: 'UK', lat: 52.2053, lon: 0.1218 },
  // Qatar
  { id: 'qu', name: 'Qatar University', fullName: 'Qatar University', city: 'Doha', country: 'Qatar', lat: 25.3134, lon: 51.4974 },
  { id: 'cmu-q', name: 'Carnegie Mellon Qatar', fullName: 'Carnegie Mellon University in Qatar', city: 'Doha', country: 'Qatar', lat: 25.3152, lon: 51.4394 },
  { id: 'georgetown-q', name: 'Georgetown Qatar', fullName: 'Georgetown University in Qatar', city: 'Doha', country: 'Qatar', lat: 25.3148, lon: 51.4394 },
  { id: 'northwestern-q', name: 'Northwestern Qatar', fullName: 'Northwestern University in Qatar', city: 'Doha', country: 'Qatar', lat: 25.3150, lon: 51.4395 },
  { id: 'texas-am-q', name: 'Texas A&M Qatar', fullName: 'Texas A&M University at Qatar', city: 'Doha', country: 'Qatar', lat: 25.3145, lon: 51.4396 },
  { id: 'virginia-commonwealth-q', name: 'VCUarts Qatar', fullName: 'Virginia Commonwealth University School of the Arts in Qatar', city: 'Doha', country: 'Qatar', lat: 25.3140, lon: 51.4390 },
  { id: 'hbsp', name: 'HBKU', fullName: 'Hamad Bin Khalifa University', city: 'Doha', country: 'Qatar', lat: 25.3142, lon: 51.4392 },
]

export const CITIES_WEATHER = [
  { id: 'london', name: 'London', country: 'UK', lat: 51.5074, lon: -0.1278, timezone: 'Europe/London' },
  { id: 'manchester', name: 'Manchester', country: 'UK', lat: 53.4808, lon: -2.2426, timezone: 'Europe/London' },
  { id: 'birmingham', name: 'Birmingham', country: 'UK', lat: 52.4862, lon: -1.8904, timezone: 'Europe/London' },
  { id: 'edinburgh', name: 'Edinburgh', country: 'UK', lat: 55.9533, lon: -3.1883, timezone: 'Europe/London' },
  { id: 'leeds', name: 'Leeds', country: 'UK', lat: 53.8008, lon: -1.5491, timezone: 'Europe/London' },
  { id: 'doha', name: 'Doha', country: 'Qatar', lat: 25.2854, lon: 51.5310, timezone: 'Asia/Qatar' },
]

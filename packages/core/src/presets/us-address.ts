import type { AddressConfig } from '../types.js';

/**
 * Default US-leaning address generation pool used by the original Curtain
 * extension. Preserved bit-for-bit from the pre-refactor `data.js`.
 *
 * Regions carry their own ZIP-prefix ranges so postal codes correlate with the
 * city/state pair. ZIP ranges previously lived inline in `content.js`; they
 * are colocated here for clarity.
 */
export const US_ADDRESS_DEFAULT: AddressConfig = {
  streetBases: [
    'Oak', 'Main', 'Maple', 'Cedar', 'Pine', 'Elm', 'Washington', 'Park', 'Lake', 'Hill',
    'Forest', 'River', 'Sunset', 'Valley', 'Mountain', 'Ocean', 'Garden', 'Spring', 'Meadow', 'Birch',
    'Willow', 'Sycamore', 'Chestnut', 'Highland', 'Ridge', 'Canyon', 'Creek', 'Summit', 'Crossing', 'Vista',
    'Grove', 'Laurel', 'Juniper', 'Spruce', 'Hickory', 'Aspen', 'Magnolia', 'Cherry', 'Walnut', 'Cypress',
  ],
  streetSuffixes: [
    { suffix: 'St', weight: 0.20 },
    { suffix: 'Ave', weight: 0.15 },
    { suffix: 'Rd', weight: 0.12 },
    { suffix: 'Dr', weight: 0.12 },
    { suffix: 'Ln', weight: 0.10 },
    { suffix: 'Way', weight: 0.08 },
    { suffix: 'Blvd', weight: 0.06 },
    { suffix: 'Ct', weight: 0.05 },
    { suffix: 'Pl', weight: 0.04 },
    { suffix: 'Cir', weight: 0.03 },
    { suffix: 'Pkwy', weight: 0.02 },
    { suffix: 'Ter', weight: 0.02 },
    { suffix: 'Trl', weight: 0.01 },
  ],
  unitDesignators: [
    { format: 'Apt', weight: 0.40 },
    { format: 'Unit', weight: 0.25 },
    { format: '#', weight: 0.15 },
    { format: 'Suite', weight: 0.10 },
    { format: 'Floor', weight: 0.10 },
  ],
  regions: {
    west: {
      weight: 0.25,
      zipRange: { min: 90000, max: 99999 },
      states: ['CA', 'WA', 'OR', 'CO', 'NV'],
      cities: [
        'San Mateo', 'Redwood City', 'Mountain View', 'Santa Clara', 'Sunnyvale',
        'Palo Alto', 'Berkeley', 'Fremont', 'San Ramon', 'Walnut Creek',
        'Irvine', 'Pasadena', 'Torrance', 'Glendale', 'Burbank',
        'Bellevue', 'Kirkland', 'Redmond', 'Tacoma', 'Olympia',
      ],
    },
    southwest: {
      weight: 0.20,
      zipRange: { min: 75000, max: 88999 },
      states: ['TX', 'AZ', 'NM'],
      cities: [
        'Scottsdale', 'Tempe', 'Mesa', 'Chandler', 'Gilbert',
        'Peoria', 'Goodyear', 'Surprise', 'Flagstaff', 'Sedona',
        'Plano', 'Frisco', 'McKinney', 'Richardson', 'Arlington',
        'Round Rock', 'Cedar Park', 'Georgetown', 'Leander', 'Pflugerville',
      ],
    },
    midwest: {
      weight: 0.20,
      zipRange: { min: 43000, max: 62999 },
      states: ['IL', 'OH', 'MI', 'IN', 'MO', 'MN', 'WI'],
      cities: [
        'Naperville', 'Evanston', 'Oak Park', 'Schaumburg', 'Arlington Heights',
        'Bloomington', 'Westfield', 'Fishers', 'Carmel', 'Plainfield',
        'Grand Rapids', 'Ann Arbor', 'Troy', 'Farmington Hills', 'Novi',
        'Dublin', 'Westerville', 'Upper Arlington', 'Gahanna', 'Powell',
      ],
    },
    northeast: {
      weight: 0.20,
      zipRange: { min: 1000, max: 19999 },
      states: ['NY', 'NJ', 'MA', 'PA', 'CT'],
      cities: [
        'Cambridge', 'Somerville', 'Brookline', 'Newton', 'Arlington',
        'Lexington', 'Medford', 'Watertown', 'Needham', 'Wellesley',
        'Hoboken', 'Jersey City', 'Princeton', 'Morristown', 'Montclair',
        'White Plains', 'Yonkers', 'New Rochelle', 'Stamford', 'Greenwich',
      ],
    },
    southeast: {
      weight: 0.15,
      zipRange: { min: 30000, max: 39999 },
      states: ['FL', 'GA', 'NC', 'TN', 'VA', 'MD'],
      cities: [
        'Marietta', 'Roswell', 'Alpharetta', 'Sandy Springs', 'Dunwoody',
        'Decatur', 'Smyrna', 'Kennesaw', 'Johns Creek', 'Peachtree City',
        'Cary', 'Durham', 'Chapel Hill', 'Raleigh', 'Apex',
        'Coral Springs', 'Pembroke Pines', 'Boca Raton', 'Delray Beach', 'Wellington',
      ],
    },
  },
  unitProbability: 0.30,
  sameRegionStateProbability: 0.80,
};

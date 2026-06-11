/**
 * Curtain — Shared Data (GENERATED — DO NOT EDIT BY HAND)
 *
 * Source of truth lives in:
 *   - @texturehq/curtain-core      (demographics, address pools)
 *   - @texturehq/curtain-industries (energy industry data)
 *
 * Regenerate with: yarn --cwd extension build:data
 */

// Use IIFE to avoid polluting global scope (Chrome content scripts share scope)
(function() {
const DATA = {
  "NAME_BUCKETS": {
    "anglo": {
      "weight": 0.45,
      "firstNames": [
        {
          "name": "Michael",
          "gender": "male"
        },
        {
          "name": "James",
          "gender": "male"
        },
        {
          "name": "David",
          "gender": "male"
        },
        {
          "name": "John",
          "gender": "male"
        },
        {
          "name": "Robert",
          "gender": "male"
        },
        {
          "name": "Daniel",
          "gender": "male"
        },
        {
          "name": "William",
          "gender": "male"
        },
        {
          "name": "Matthew",
          "gender": "male"
        },
        {
          "name": "Andrew",
          "gender": "male"
        },
        {
          "name": "Ryan",
          "gender": "male"
        },
        {
          "name": "Christopher",
          "gender": "male"
        },
        {
          "name": "Joshua",
          "gender": "male"
        },
        {
          "name": "Brandon",
          "gender": "male"
        },
        {
          "name": "Tyler",
          "gender": "male"
        },
        {
          "name": "Kevin",
          "gender": "male"
        },
        {
          "name": "Brian",
          "gender": "male"
        },
        {
          "name": "Justin",
          "gender": "male"
        },
        {
          "name": "Steven",
          "gender": "male"
        },
        {
          "name": "Jason",
          "gender": "male"
        },
        {
          "name": "Jeffrey",
          "gender": "male"
        },
        {
          "name": "Emily",
          "gender": "female"
        },
        {
          "name": "Jessica",
          "gender": "female"
        },
        {
          "name": "Ashley",
          "gender": "female"
        },
        {
          "name": "Sarah",
          "gender": "female"
        },
        {
          "name": "Jennifer",
          "gender": "female"
        },
        {
          "name": "Amanda",
          "gender": "female"
        },
        {
          "name": "Elizabeth",
          "gender": "female"
        },
        {
          "name": "Rachel",
          "gender": "female"
        },
        {
          "name": "Nicole",
          "gender": "female"
        },
        {
          "name": "Samantha",
          "gender": "female"
        },
        {
          "name": "Megan",
          "gender": "female"
        },
        {
          "name": "Stephanie",
          "gender": "female"
        },
        {
          "name": "Lauren",
          "gender": "female"
        },
        {
          "name": "Christina",
          "gender": "female"
        },
        {
          "name": "Brittany",
          "gender": "female"
        },
        {
          "name": "Heather",
          "gender": "female"
        },
        {
          "name": "Kimberly",
          "gender": "female"
        },
        {
          "name": "Michelle",
          "gender": "female"
        },
        {
          "name": "Amber",
          "gender": "female"
        },
        {
          "name": "Melissa",
          "gender": "female"
        }
      ],
      "lastNames": [
        "Smith",
        "Johnson",
        "Williams",
        "Brown",
        "Jones",
        "Miller",
        "Davis",
        "Wilson",
        "Anderson",
        "Taylor",
        "Moore",
        "Jackson",
        "White",
        "Harris",
        "Clark",
        "Lewis",
        "Walker",
        "Hall",
        "Young",
        "King",
        "Wright",
        "Scott",
        "Green",
        "Baker",
        "Adams",
        "Nelson",
        "Hill",
        "Campbell",
        "Mitchell",
        "Roberts",
        "Carter",
        "Phillips",
        "Evans",
        "Turner",
        "Parker",
        "Collins",
        "Edwards",
        "Stewart",
        "Morris",
        "Murphy",
        "Cook",
        "Rogers",
        "Morgan",
        "Peterson",
        "Cooper",
        "Reed",
        "Bailey",
        "Bell",
        "Howard",
        "Ward",
        "Cox",
        "Richardson",
        "Wood",
        "Watson",
        "Brooks",
        "Bennett",
        "Gray",
        "Price",
        "Sanders",
        "Powell",
        "Russell",
        "Fisher",
        "Hayes",
        "Sullivan",
        "Wallace",
        "Burns",
        "Palmer",
        "Porter",
        "Graham",
        "Spencer"
      ]
    },
    "hispanic": {
      "weight": 0.25,
      "firstNames": [
        {
          "name": "Jose",
          "gender": "male"
        },
        {
          "name": "Luis",
          "gender": "male"
        },
        {
          "name": "Miguel",
          "gender": "male"
        },
        {
          "name": "Juan",
          "gender": "male"
        },
        {
          "name": "Carlos",
          "gender": "male"
        },
        {
          "name": "Diego",
          "gender": "male"
        },
        {
          "name": "Alejandro",
          "gender": "male"
        },
        {
          "name": "Gabriel",
          "gender": "male"
        },
        {
          "name": "Mateo",
          "gender": "male"
        },
        {
          "name": "Andres",
          "gender": "male"
        },
        {
          "name": "Ricardo",
          "gender": "male"
        },
        {
          "name": "Eduardo",
          "gender": "male"
        },
        {
          "name": "Antonio",
          "gender": "male"
        },
        {
          "name": "Francisco",
          "gender": "male"
        },
        {
          "name": "Manuel",
          "gender": "male"
        },
        {
          "name": "Rafael",
          "gender": "male"
        },
        {
          "name": "Pablo",
          "gender": "male"
        },
        {
          "name": "Oscar",
          "gender": "male"
        },
        {
          "name": "Sergio",
          "gender": "male"
        },
        {
          "name": "Alberto",
          "gender": "male"
        },
        {
          "name": "Fernando",
          "gender": "male"
        },
        {
          "name": "Ana",
          "gender": "female"
        },
        {
          "name": "Maria",
          "gender": "female"
        },
        {
          "name": "Sofia",
          "gender": "female"
        },
        {
          "name": "Isabella",
          "gender": "female"
        },
        {
          "name": "Rosa",
          "gender": "female"
        },
        {
          "name": "Carmen",
          "gender": "female"
        },
        {
          "name": "Lucia",
          "gender": "female"
        },
        {
          "name": "Elena",
          "gender": "female"
        },
        {
          "name": "Mariana",
          "gender": "female"
        },
        {
          "name": "Patricia",
          "gender": "female"
        },
        {
          "name": "Daniela",
          "gender": "female"
        },
        {
          "name": "Valentina",
          "gender": "female"
        },
        {
          "name": "Camila",
          "gender": "female"
        },
        {
          "name": "Alejandra",
          "gender": "female"
        },
        {
          "name": "Gabriela",
          "gender": "female"
        },
        {
          "name": "Andrea",
          "gender": "female"
        },
        {
          "name": "Paula",
          "gender": "female"
        },
        {
          "name": "Carolina",
          "gender": "female"
        },
        {
          "name": "Monica",
          "gender": "female"
        }
      ],
      "lastNames": [
        "Garcia",
        "Martinez",
        "Rodriguez",
        "Hernandez",
        "Lopez",
        "Gonzalez",
        "Perez",
        "Sanchez",
        "Ramirez",
        "Torres",
        "Flores",
        "Rivera",
        "Gomez",
        "Diaz",
        "Morales",
        "Vasquez",
        "Castillo",
        "Romero",
        "Alvarez",
        "Ruiz",
        "Reyes",
        "Cruz",
        "Ortiz",
        "Gutierrez",
        "Chavez",
        "Ramos",
        "Vargas",
        "Mendoza",
        "Aguilar",
        "Medina",
        "Castro",
        "Guzman",
        "Munoz",
        "Rojas",
        "Jimenez",
        "Herrera",
        "Contreras",
        "Salazar",
        "Luna",
        "Delgado",
        "Soto",
        "Vega",
        "Sandoval",
        "Dominguez",
        "Guerrero",
        "Mendez",
        "Silva",
        "Rios",
        "Espinoza",
        "Carrillo",
        "Estrada",
        "Nunez",
        "Figueroa",
        "Fuentes",
        "Campos",
        "Padilla",
        "Acosta",
        "Santiago",
        "Navarro",
        "Cordova"
      ]
    },
    "black": {
      "weight": 0.15,
      "firstNames": [
        {
          "name": "Andre",
          "gender": "male"
        },
        {
          "name": "Marcus",
          "gender": "male"
        },
        {
          "name": "Terrence",
          "gender": "male"
        },
        {
          "name": "Darnell",
          "gender": "male"
        },
        {
          "name": "Tyrone",
          "gender": "male"
        },
        {
          "name": "Malik",
          "gender": "male"
        },
        {
          "name": "Jamal",
          "gender": "male"
        },
        {
          "name": "DeShawn",
          "gender": "male"
        },
        {
          "name": "Darius",
          "gender": "male"
        },
        {
          "name": "Xavier",
          "gender": "male"
        },
        {
          "name": "Lamar",
          "gender": "male"
        },
        {
          "name": "Dante",
          "gender": "male"
        },
        {
          "name": "Jalen",
          "gender": "male"
        },
        {
          "name": "Dwayne",
          "gender": "male"
        },
        {
          "name": "Shaun",
          "gender": "male"
        },
        {
          "name": "Terrell",
          "gender": "male"
        },
        {
          "name": "Devin",
          "gender": "male"
        },
        {
          "name": "Corey",
          "gender": "male"
        },
        {
          "name": "Jerome",
          "gender": "male"
        },
        {
          "name": "Kendrick",
          "gender": "male"
        },
        {
          "name": "Kevin",
          "gender": "male"
        },
        {
          "name": "Aaliyah",
          "gender": "female"
        },
        {
          "name": "Latoya",
          "gender": "female"
        },
        {
          "name": "Monique",
          "gender": "female"
        },
        {
          "name": "Keisha",
          "gender": "female"
        },
        {
          "name": "Imani",
          "gender": "female"
        },
        {
          "name": "Jasmine",
          "gender": "female"
        },
        {
          "name": "Brianna",
          "gender": "female"
        },
        {
          "name": "Michelle",
          "gender": "female"
        },
        {
          "name": "Ebony",
          "gender": "female"
        },
        {
          "name": "Tamika",
          "gender": "female"
        },
        {
          "name": "Tasha",
          "gender": "female"
        },
        {
          "name": "Shaniqua",
          "gender": "female"
        },
        {
          "name": "Destiny",
          "gender": "female"
        },
        {
          "name": "Diamond",
          "gender": "female"
        },
        {
          "name": "Precious",
          "gender": "female"
        },
        {
          "name": "Jasmin",
          "gender": "female"
        },
        {
          "name": "Alicia",
          "gender": "female"
        },
        {
          "name": "Tiffany",
          "gender": "female"
        },
        {
          "name": "Jordan",
          "gender": "neutral"
        }
      ],
      "lastNames": [
        "Washington",
        "Jefferson",
        "Henderson",
        "Robinson",
        "Carter",
        "Mitchell",
        "Turner",
        "Parker",
        "Brooks",
        "Collins",
        "Reed",
        "Cooper",
        "Morgan",
        "Bell",
        "Murphy",
        "Bailey",
        "Howard",
        "Ward",
        "Foster",
        "Gray",
        "Jenkins",
        "Perry",
        "Powell",
        "Long",
        "Patterson",
        "Hughes",
        "Price",
        "Sanders",
        "Butler",
        "Barnes",
        "Ross",
        "Jordan",
        "Coleman",
        "Wallace",
        "Bryant",
        "Alexander",
        "Russell",
        "Griffin",
        "Hayes",
        "Myers",
        "Ford",
        "Hamilton",
        "Graham",
        "Sullivan",
        "Freeman",
        "Simmons",
        "Gordon",
        "Hunter",
        "Crawford",
        "Mason",
        "Boyd",
        "Kennedy",
        "Warren",
        "Dixon",
        "Raines",
        "Hawkins",
        "Armstrong",
        "Berry",
        "Owens",
        "Ellis"
      ]
    },
    "asian": {
      "weight": 0.1,
      "firstNames": [
        {
          "name": "Minh",
          "gender": "male"
        },
        {
          "name": "Tuan",
          "gender": "male"
        },
        {
          "name": "Arjun",
          "gender": "male"
        },
        {
          "name": "Rahul",
          "gender": "male"
        },
        {
          "name": "Amit",
          "gender": "male"
        },
        {
          "name": "Hao",
          "gender": "male"
        },
        {
          "name": "Kevin",
          "gender": "male"
        },
        {
          "name": "Daniel",
          "gender": "male"
        },
        {
          "name": "Andrew",
          "gender": "male"
        },
        {
          "name": "Raj",
          "gender": "male"
        },
        {
          "name": "Deepak",
          "gender": "male"
        },
        {
          "name": "Vikram",
          "gender": "male"
        },
        {
          "name": "Sanjay",
          "gender": "male"
        },
        {
          "name": "Ravi",
          "gender": "male"
        },
        {
          "name": "Suresh",
          "gender": "male"
        },
        {
          "name": "Jin",
          "gender": "male"
        },
        {
          "name": "Hiroshi",
          "gender": "male"
        },
        {
          "name": "Kenji",
          "gender": "male"
        },
        {
          "name": "Takeshi",
          "gender": "male"
        },
        {
          "name": "Ken",
          "gender": "male"
        },
        {
          "name": "Anh",
          "gender": "female"
        },
        {
          "name": "Linh",
          "gender": "female"
        },
        {
          "name": "Neha",
          "gender": "female"
        },
        {
          "name": "Sunita",
          "gender": "female"
        },
        {
          "name": "Mei",
          "gender": "female"
        },
        {
          "name": "Michelle",
          "gender": "female"
        },
        {
          "name": "Grace",
          "gender": "female"
        },
        {
          "name": "Priya",
          "gender": "female"
        },
        {
          "name": "Anita",
          "gender": "female"
        },
        {
          "name": "Kavita",
          "gender": "female"
        },
        {
          "name": "Pooja",
          "gender": "female"
        },
        {
          "name": "Yuki",
          "gender": "female"
        },
        {
          "name": "Yoko",
          "gender": "female"
        },
        {
          "name": "Sakura",
          "gender": "female"
        },
        {
          "name": "Naomi",
          "gender": "female"
        },
        {
          "name": "Lily",
          "gender": "female"
        },
        {
          "name": "Wei",
          "gender": "neutral"
        },
        {
          "name": "Chen",
          "gender": "neutral"
        },
        {
          "name": "Li",
          "gender": "neutral"
        },
        {
          "name": "Bao",
          "gender": "neutral"
        }
      ],
      "lastNames": [
        "Nguyen",
        "Tran",
        "Le",
        "Pham",
        "Patel",
        "Shah",
        "Singh",
        "Kaur",
        "Kim",
        "Lee",
        "Park",
        "Choi",
        "Chen",
        "Wang",
        "Zhang",
        "Liu",
        "Huang",
        "Wu",
        "Gupta",
        "Mehta",
        "Sharma",
        "Kumar",
        "Reddy",
        "Rao",
        "Nair",
        "Iyer",
        "Desai",
        "Kapoor",
        "Malhotra",
        "Joshi",
        "Tanaka",
        "Yamamoto",
        "Suzuki",
        "Watanabe",
        "Ito",
        "Nakamura",
        "Kobayashi",
        "Saito",
        "Kato",
        "Yoshida",
        "Yang",
        "Xu",
        "Sun",
        "Ma",
        "Hu",
        "Guo",
        "Lin",
        "Luo",
        "Zheng",
        "Zhu",
        "Vo",
        "Do",
        "Bui",
        "Dang",
        "Ho",
        "Ngo",
        "Duong",
        "Ly",
        "Huynh",
        "Truong"
      ]
    },
    "neutral": {
      "weight": 0.05,
      "firstNames": [
        {
          "name": "Alex",
          "gender": "neutral"
        },
        {
          "name": "Jordan",
          "gender": "neutral"
        },
        {
          "name": "Taylor",
          "gender": "neutral"
        },
        {
          "name": "Morgan",
          "gender": "neutral"
        },
        {
          "name": "Casey",
          "gender": "neutral"
        },
        {
          "name": "Riley",
          "gender": "neutral"
        },
        {
          "name": "Quinn",
          "gender": "neutral"
        },
        {
          "name": "Avery",
          "gender": "neutral"
        },
        {
          "name": "Cameron",
          "gender": "neutral"
        },
        {
          "name": "Dakota",
          "gender": "neutral"
        },
        {
          "name": "Emerson",
          "gender": "neutral"
        },
        {
          "name": "Harper",
          "gender": "neutral"
        },
        {
          "name": "Jamie",
          "gender": "neutral"
        },
        {
          "name": "Kendall",
          "gender": "neutral"
        },
        {
          "name": "Logan",
          "gender": "neutral"
        },
        {
          "name": "Parker",
          "gender": "neutral"
        },
        {
          "name": "Rowan",
          "gender": "neutral"
        },
        {
          "name": "Skyler",
          "gender": "neutral"
        },
        {
          "name": "Sam",
          "gender": "neutral"
        },
        {
          "name": "Sasha",
          "gender": "neutral"
        },
        {
          "name": "Drew",
          "gender": "neutral"
        },
        {
          "name": "Blake",
          "gender": "neutral"
        },
        {
          "name": "Reese",
          "gender": "neutral"
        },
        {
          "name": "Finley",
          "gender": "neutral"
        },
        {
          "name": "Hayden",
          "gender": "neutral"
        },
        {
          "name": "Peyton",
          "gender": "neutral"
        },
        {
          "name": "Sydney",
          "gender": "neutral"
        },
        {
          "name": "Jessie",
          "gender": "neutral"
        },
        {
          "name": "Charlie",
          "gender": "neutral"
        },
        {
          "name": "Frankie",
          "gender": "neutral"
        }
      ],
      "lastNames": [
        "Smith",
        "Johnson",
        "Lee",
        "Garcia",
        "Brown",
        "Martinez",
        "Kim",
        "Nguyen",
        "Patel",
        "Harris",
        "Clark",
        "Robinson",
        "Walker",
        "Young",
        "Hall",
        "Allen",
        "Scott",
        "Adams",
        "Baker",
        "Nelson",
        "Wright",
        "Green",
        "Mitchell",
        "Campbell",
        "Roberts",
        "Phillips",
        "Evans",
        "Turner",
        "Torres",
        "Parker",
        "Collins",
        "Edwards",
        "Stewart",
        "Morris",
        "Rogers",
        "Reed",
        "Cook",
        "Morgan",
        "Bell",
        "Bailey"
      ]
    }
  },
  "STREET_BASES": [
    "Oak",
    "Main",
    "Maple",
    "Cedar",
    "Pine",
    "Elm",
    "Washington",
    "Park",
    "Lake",
    "Hill",
    "Forest",
    "River",
    "Sunset",
    "Valley",
    "Mountain",
    "Ocean",
    "Garden",
    "Spring",
    "Meadow",
    "Birch",
    "Willow",
    "Sycamore",
    "Chestnut",
    "Highland",
    "Ridge",
    "Canyon",
    "Creek",
    "Summit",
    "Crossing",
    "Vista",
    "Grove",
    "Laurel",
    "Juniper",
    "Spruce",
    "Hickory",
    "Aspen",
    "Magnolia",
    "Cherry",
    "Walnut",
    "Cypress"
  ],
  "STREET_SUFFIXES": [
    {
      "suffix": "St",
      "weight": 0.2
    },
    {
      "suffix": "Ave",
      "weight": 0.15
    },
    {
      "suffix": "Rd",
      "weight": 0.12
    },
    {
      "suffix": "Dr",
      "weight": 0.12
    },
    {
      "suffix": "Ln",
      "weight": 0.1
    },
    {
      "suffix": "Way",
      "weight": 0.08
    },
    {
      "suffix": "Blvd",
      "weight": 0.06
    },
    {
      "suffix": "Ct",
      "weight": 0.05
    },
    {
      "suffix": "Pl",
      "weight": 0.04
    },
    {
      "suffix": "Cir",
      "weight": 0.03
    },
    {
      "suffix": "Pkwy",
      "weight": 0.02
    },
    {
      "suffix": "Ter",
      "weight": 0.02
    },
    {
      "suffix": "Trl",
      "weight": 0.01
    }
  ],
  "UNIT_DESIGNATORS": [
    {
      "format": "Apt",
      "weight": 0.4
    },
    {
      "format": "Unit",
      "weight": 0.25
    },
    {
      "format": "#",
      "weight": 0.15
    },
    {
      "format": "Suite",
      "weight": 0.1
    },
    {
      "format": "Floor",
      "weight": 0.1
    }
  ],
  "LOCATION_REGIONS": {
    "west": {
      "weight": 0.25,
      "states": [
        "CA",
        "WA",
        "OR",
        "CO",
        "NV"
      ],
      "cities": [
        "San Mateo",
        "Redwood City",
        "Mountain View",
        "Santa Clara",
        "Sunnyvale",
        "Palo Alto",
        "Berkeley",
        "Fremont",
        "San Ramon",
        "Walnut Creek",
        "Irvine",
        "Pasadena",
        "Torrance",
        "Glendale",
        "Burbank",
        "Bellevue",
        "Kirkland",
        "Redmond",
        "Tacoma",
        "Olympia"
      ]
    },
    "southwest": {
      "weight": 0.2,
      "states": [
        "TX",
        "AZ",
        "NM"
      ],
      "cities": [
        "Scottsdale",
        "Tempe",
        "Mesa",
        "Chandler",
        "Gilbert",
        "Peoria",
        "Goodyear",
        "Surprise",
        "Flagstaff",
        "Sedona",
        "Plano",
        "Frisco",
        "McKinney",
        "Richardson",
        "Arlington",
        "Round Rock",
        "Cedar Park",
        "Georgetown",
        "Leander",
        "Pflugerville"
      ]
    },
    "midwest": {
      "weight": 0.2,
      "states": [
        "IL",
        "OH",
        "MI",
        "IN",
        "MO",
        "MN",
        "WI"
      ],
      "cities": [
        "Naperville",
        "Evanston",
        "Oak Park",
        "Schaumburg",
        "Arlington Heights",
        "Bloomington",
        "Westfield",
        "Fishers",
        "Carmel",
        "Plainfield",
        "Grand Rapids",
        "Ann Arbor",
        "Troy",
        "Farmington Hills",
        "Novi",
        "Dublin",
        "Westerville",
        "Upper Arlington",
        "Gahanna",
        "Powell"
      ]
    },
    "northeast": {
      "weight": 0.2,
      "states": [
        "NY",
        "NJ",
        "MA",
        "PA",
        "CT"
      ],
      "cities": [
        "Cambridge",
        "Somerville",
        "Brookline",
        "Newton",
        "Arlington",
        "Lexington",
        "Medford",
        "Watertown",
        "Needham",
        "Wellesley",
        "Hoboken",
        "Jersey City",
        "Princeton",
        "Morristown",
        "Montclair",
        "White Plains",
        "Yonkers",
        "New Rochelle",
        "Stamford",
        "Greenwich"
      ]
    },
    "southeast": {
      "weight": 0.15,
      "states": [
        "FL",
        "GA",
        "NC",
        "TN",
        "VA",
        "MD"
      ],
      "cities": [
        "Marietta",
        "Roswell",
        "Alpharetta",
        "Sandy Springs",
        "Dunwoody",
        "Decatur",
        "Smyrna",
        "Kennesaw",
        "Johns Creek",
        "Peachtree City",
        "Cary",
        "Durham",
        "Chapel Hill",
        "Raleigh",
        "Apex",
        "Coral Springs",
        "Pembroke Pines",
        "Boca Raton",
        "Delray Beach",
        "Wellington"
      ]
    }
  },
  "ORGANIZATIONS": [
    {
      "id": "org_001",
      "name": "Timber Ridge Electric Cooperative",
      "type": "coop"
    },
    {
      "id": "org_002",
      "name": "Pinecrest Rural Electric",
      "type": "coop"
    },
    {
      "id": "org_003",
      "name": "Clearwater Basin REC",
      "type": "coop"
    },
    {
      "id": "org_004",
      "name": "Riverbend Electric Cooperative",
      "type": "coop"
    },
    {
      "id": "org_005",
      "name": "Sunrise Valley Electric Membership Corp",
      "type": "coop"
    },
    {
      "id": "org_006",
      "name": "Crossroads Energy Cooperative",
      "type": "coop"
    },
    {
      "id": "org_007",
      "name": "Twin Rivers Electric Cooperative",
      "type": "coop"
    },
    {
      "id": "org_008",
      "name": "Ridgeline Rural Electric",
      "type": "coop"
    },
    {
      "id": "org_009",
      "name": "Harvest Plains Electric Cooperative",
      "type": "coop"
    },
    {
      "id": "org_010",
      "name": "Redstone Electric Cooperative",
      "type": "coop"
    },
    {
      "id": "org_011",
      "name": "Meadowbrook Rural Electric",
      "type": "coop"
    },
    {
      "id": "org_012",
      "name": "Summit Creek Electric Cooperative",
      "type": "coop"
    },
    {
      "id": "org_013",
      "name": "Ironwood Electric Cooperative",
      "type": "coop"
    },
    {
      "id": "org_014",
      "name": "Copperhead Basin REC",
      "type": "coop"
    },
    {
      "id": "org_015",
      "name": "Silver Lake Electric Cooperative",
      "type": "coop"
    },
    {
      "id": "org_016",
      "name": "Northstar Electric",
      "type": "iou"
    },
    {
      "id": "org_017",
      "name": "Valley Stream Power",
      "type": "iou"
    },
    {
      "id": "org_018",
      "name": "Summit Power Company",
      "type": "iou"
    },
    {
      "id": "org_019",
      "name": "Aurora Power",
      "type": "iou"
    },
    {
      "id": "org_020",
      "name": "Evergreen Utilities",
      "type": "iou"
    },
    {
      "id": "org_021",
      "name": "Prairie State Energy",
      "type": "iou"
    },
    {
      "id": "org_022",
      "name": "Golden State Electric",
      "type": "iou"
    },
    {
      "id": "org_023",
      "name": "Piedmont Power",
      "type": "iou"
    },
    {
      "id": "org_024",
      "name": "Great Plains Energy",
      "type": "iou"
    },
    {
      "id": "org_025",
      "name": "Atlantic Electric",
      "type": "iou"
    },
    {
      "id": "org_026",
      "name": "Pacific Coast Power",
      "type": "iou"
    },
    {
      "id": "org_027",
      "name": "Midwestern Energy",
      "type": "iou"
    },
    {
      "id": "org_028",
      "name": "Southern Regional Electric",
      "type": "iou"
    },
    {
      "id": "org_029",
      "name": "Continental Power",
      "type": "iou"
    },
    {
      "id": "org_030",
      "name": "Heartland Power Holdings",
      "type": "iou"
    },
    {
      "id": "org_031",
      "name": "Willowbrook Municipal Electric",
      "type": "municipal"
    },
    {
      "id": "org_032",
      "name": "Cedarwood Public Utilities",
      "type": "municipal"
    },
    {
      "id": "org_033",
      "name": "Stonegate Electric Department",
      "type": "municipal"
    },
    {
      "id": "org_034",
      "name": "Maplecrest Power & Light",
      "type": "municipal"
    },
    {
      "id": "org_035",
      "name": "Thornhill Municipal Utilities",
      "type": "municipal"
    },
    {
      "id": "org_036",
      "name": "Elmdale Public Power",
      "type": "municipal"
    },
    {
      "id": "org_037",
      "name": "Pinewood Public Utilities",
      "type": "municipal"
    },
    {
      "id": "org_038",
      "name": "Hawthorne Electric Department",
      "type": "municipal"
    },
    {
      "id": "org_039",
      "name": "Briarwood Power & Light",
      "type": "municipal"
    },
    {
      "id": "org_040",
      "name": "Summerville Utilities",
      "type": "municipal"
    },
    {
      "id": "org_041",
      "name": "Oakmont Municipal Electric",
      "type": "municipal"
    },
    {
      "id": "org_042",
      "name": "Clearfield Public Power",
      "type": "municipal"
    },
    {
      "id": "org_043",
      "name": "Northbrook Electric Department",
      "type": "municipal"
    },
    {
      "id": "org_044",
      "name": "Ridgemont Public Utilities",
      "type": "municipal"
    },
    {
      "id": "org_045",
      "name": "Silverdale Power & Light",
      "type": "municipal"
    },
    {
      "id": "org_046",
      "name": "Redwood Energy Group",
      "type": "der"
    },
    {
      "id": "org_047",
      "name": "Pacific Grid Solutions",
      "type": "der"
    },
    {
      "id": "org_048",
      "name": "Blue Sky Energy",
      "type": "der"
    },
    {
      "id": "org_049",
      "name": "Horizon Energy Systems",
      "type": "der"
    },
    {
      "id": "org_050",
      "name": "NextWave Power",
      "type": "der"
    },
    {
      "id": "org_051",
      "name": "Clearwater Energy",
      "type": "der"
    },
    {
      "id": "org_052",
      "name": "Summit Grid Technologies",
      "type": "der"
    },
    {
      "id": "org_053",
      "name": "VoltEdge Energy",
      "type": "der"
    },
    {
      "id": "org_054",
      "name": "Northstar Power Systems",
      "type": "der"
    },
    {
      "id": "org_055",
      "name": "Suncrest Energy",
      "type": "der"
    },
    {
      "id": "org_056",
      "name": "GridPoint Technologies",
      "type": "der"
    },
    {
      "id": "org_057",
      "name": "EnergyHub Solutions",
      "type": "der"
    },
    {
      "id": "org_058",
      "name": "FlexGrid Systems",
      "type": "der"
    },
    {
      "id": "org_059",
      "name": "PowerSync Technologies",
      "type": "der"
    },
    {
      "id": "org_060",
      "name": "CleanTech Energy",
      "type": "der"
    }
  ],
  "PROGRAM_BUCKETS": {
    "battery": {
      "weight": 0.4,
      "names": [
        "Home Battery System",
        "Battery System Rebates",
        "Smart Battery Program",
        "Power+FLEX",
        "Peak Time Payback",
        "Peak Time Payback Battery",
        "SmartConnect Battery",
        "Flexible Load",
        "PowerStore Home",
        "GridRewards Battery",
        "Home Energy Storage",
        "Battery Backup Rebate",
        "PowerBank Program",
        "FlexPower Battery",
        "Smart Storage Rewards",
        "Battery Saver Plus",
        "Home Powerwall Program",
        "Energy Vault",
        "StorageSmart",
        "BatteryWise",
        "PowerReserve Program"
      ]
    },
    "ev": {
      "weight": 0.3,
      "names": [
        "EV TOU",
        "EV Managed Charging",
        "EnergySmart EV",
        "EV Pilot",
        "EV Energy Management",
        "ChargeReady",
        "SmartCharge Rewards",
        "EV Home Charging",
        "DriveGreen",
        "Charge@Home",
        "EV Connect",
        "PowerDrive EV",
        "CleanRide Program",
        "EV Saver",
        "ChargeWise",
        "EV Time-of-Use",
        "SmartEV",
        "GreenCharge",
        "EV FlexCharge",
        "Managed EV Charging",
        "EV Peak Rewards"
      ]
    },
    "demandResponse": {
      "weight": 0.15,
      "names": [
        "Demand Response",
        "Peak Rewards",
        "FlexSaver",
        "GridSmart",
        "Peak Time Rebates",
        "Smart Thermostat Program",
        "ConnectedSavings",
        "CoolCredits",
        "PowerDown Rewards",
        "Rush Hour Rewards",
        "SmartAC",
        "Summer Saver"
      ]
    },
    "vpp": {
      "weight": 0.15,
      "names": [
        "Virtual Power Plant",
        "GridFlex VPP",
        "Connected Home VPP",
        "PowerGrid Partners",
        "Community Battery Network",
        "Grid Services",
        "Distributed Energy Network",
        "FlexGrid Program",
        "PowerShare",
        "GridSync",
        "VPP Rewards",
        "Connected Resources"
      ]
    }
  },
  "DEVICE_NAMES": [
    "Home Battery",
    "Main Thermostat",
    "EV Charger",
    "Solar Inverter",
    "Smart Panel",
    "Heat Pump",
    "Water Heater",
    "Pool Pump",
    "HVAC System",
    "Backup Generator",
    "Energy Monitor",
    "Smart Outlet",
    "Garage Charger",
    "Office Thermostat",
    "Guest House Battery"
  ],
  "APPEARANCE_RANGE_WEIGHTS": {
    "light": 0.35,
    "medium": 0.35,
    "dark": 0.3
  },
  "PLACEHOLDER_AVATAR": "data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"%3E%3Ccircle cx=\"50\" cy=\"50\" r=\"50\" fill=\"%23E5E7EB\"/%3E%3Ccircle cx=\"50\" cy=\"40\" r=\"20\" fill=\"%239CA3AF\"/%3E%3Cellipse cx=\"50\" cy=\"85\" rx=\"35\" ry=\"25\" fill=\"%239CA3AF\"/%3E%3C/svg%3E",
  "PLACEHOLDER_LOGO": "data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"%3E%3Crect width=\"100\" height=\"100\" fill=\"%23E5E7EB\"/%3E%3Crect x=\"20\" y=\"30\" width=\"60\" height=\"40\" fill=\"%239CA3AF\"/%3E%3C/svg%3E",
  "AVATAR_MANIFEST": {
    "basePath": "src/shared/avatars/v1",
    "buckets": {
      "female_light": [
        "avatar_0001.webp",
        "avatar_0002.webp",
        "avatar_0003.webp"
      ],
      "female_medium": [
        "avatar_0001.webp",
        "avatar_0002.webp",
        "avatar_0003.webp"
      ],
      "female_dark": [
        "avatar_0001.webp",
        "avatar_0002.webp",
        "avatar_0003.webp"
      ],
      "male_light": [
        "avatar_0001.webp",
        "avatar_0002.webp",
        "avatar_0003.webp"
      ],
      "male_medium": [
        "avatar_0001.webp",
        "avatar_0002.webp",
        "avatar_0003.webp"
      ],
      "male_dark": [
        "avatar_0001.webp",
        "avatar_0002.webp",
        "avatar_0003.webp"
      ],
      "neutral_light": [
        "avatar_0001.webp",
        "avatar_0002.webp",
        "avatar_0003.webp"
      ],
      "neutral_medium": [
        "avatar_0001.webp",
        "avatar_0002.webp",
        "avatar_0003.webp"
      ],
      "neutral_dark": [
        "avatar_0001.webp",
        "avatar_0002.webp",
        "avatar_0003.webp"
      ]
    }
  },
  "LOGO_MANIFEST": {
    "basePath": "src/shared/logos",
    "logos": {
      "org_001": "org_001.png",
      "org_002": "org_002.png",
      "org_003": "org_003.png",
      "org_004": "org_004.png",
      "org_005": "org_005.png",
      "org_006": "org_006.png",
      "org_007": "org_007.png",
      "org_008": "org_008.png",
      "org_009": "org_009.png",
      "org_010": "org_010.png",
      "org_011": "org_011.png",
      "org_012": "org_012.png",
      "org_013": "org_013.png",
      "org_014": "org_014.png",
      "org_015": "org_015.png",
      "org_016": "org_016.png",
      "org_017": "org_017.png",
      "org_018": "org_018.png",
      "org_019": "org_019.png",
      "org_020": "org_020.png",
      "org_021": "org_021.png",
      "org_022": "org_022.png",
      "org_023": "org_023.png",
      "org_024": "org_024.png",
      "org_025": "org_025.png",
      "org_026": "org_026.png",
      "org_027": "org_027.png",
      "org_028": "org_028.png",
      "org_029": "org_029.png",
      "org_030": "org_030.png",
      "org_031": "org_031.png",
      "org_032": "org_032.png",
      "org_033": "org_033.png",
      "org_034": "org_034.png",
      "org_035": "org_035.png",
      "org_036": "org_036.png",
      "org_037": "org_037.png",
      "org_038": "org_038.png",
      "org_039": "org_039.png",
      "org_040": "org_040.png",
      "org_041": "org_041.png",
      "org_042": "org_042.png",
      "org_043": "org_043.png",
      "org_044": "org_044.png",
      "org_045": "org_045.png",
      "org_046": "org_046.png",
      "org_047": "org_047.png",
      "org_048": "org_048.png",
      "org_049": "org_049.png",
      "org_050": "org_050.png",
      "org_051": "org_051.png",
      "org_052": "org_052.png",
      "org_053": "org_053.png",
      "org_054": "org_054.png",
      "org_055": "org_055.png",
      "org_056": "org_056.png",
      "org_057": "org_057.png",
      "org_058": "org_058.png",
      "org_059": "org_059.png",
      "org_060": "org_060.png"
    }
  }
};

if (typeof window !== 'undefined') {
  window.CurtainData = DATA;
}
})();

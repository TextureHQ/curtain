import type { DemographicsConfig } from '../types.js';

/**
 * Default US-representative demographic pool used by the original Curtain
 * extension. Weights and name lists are preserved bit-for-bit from the
 * pre-refactor `extension/src/shared/data.js` so that existing seeded
 * identities continue to resolve to the same values.
 *
 * Library users should treat this as one possible preset — `DemographicsConfig`
 * is designed to accept arbitrary buckets so global teams can ship culturally
 * appropriate pools.
 */
export const US_DEMOGRAPHICS_DEFAULT: DemographicsConfig = {
  buckets: {
    anglo: {
      weight: 0.45,
      firstNames: [
        { name: 'Michael', gender: 'male' }, { name: 'James', gender: 'male' }, { name: 'David', gender: 'male' },
        { name: 'John', gender: 'male' }, { name: 'Robert', gender: 'male' }, { name: 'Daniel', gender: 'male' },
        { name: 'William', gender: 'male' }, { name: 'Matthew', gender: 'male' }, { name: 'Andrew', gender: 'male' },
        { name: 'Ryan', gender: 'male' }, { name: 'Christopher', gender: 'male' }, { name: 'Joshua', gender: 'male' },
        { name: 'Brandon', gender: 'male' }, { name: 'Tyler', gender: 'male' }, { name: 'Kevin', gender: 'male' },
        { name: 'Brian', gender: 'male' }, { name: 'Justin', gender: 'male' }, { name: 'Steven', gender: 'male' },
        { name: 'Jason', gender: 'male' }, { name: 'Jeffrey', gender: 'male' },
        { name: 'Emily', gender: 'female' }, { name: 'Jessica', gender: 'female' }, { name: 'Ashley', gender: 'female' },
        { name: 'Sarah', gender: 'female' }, { name: 'Jennifer', gender: 'female' }, { name: 'Amanda', gender: 'female' },
        { name: 'Elizabeth', gender: 'female' }, { name: 'Rachel', gender: 'female' }, { name: 'Nicole', gender: 'female' },
        { name: 'Samantha', gender: 'female' }, { name: 'Megan', gender: 'female' }, { name: 'Stephanie', gender: 'female' },
        { name: 'Lauren', gender: 'female' }, { name: 'Christina', gender: 'female' }, { name: 'Brittany', gender: 'female' },
        { name: 'Heather', gender: 'female' }, { name: 'Kimberly', gender: 'female' }, { name: 'Michelle', gender: 'female' },
        { name: 'Amber', gender: 'female' }, { name: 'Melissa', gender: 'female' },
      ],
      lastNames: [
        'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson', 'Anderson', 'Taylor',
        'Moore', 'Jackson', 'White', 'Harris', 'Clark', 'Lewis', 'Walker', 'Hall', 'Young', 'King',
        'Wright', 'Scott', 'Green', 'Baker', 'Adams', 'Nelson', 'Hill', 'Campbell', 'Mitchell', 'Roberts',
        'Carter', 'Phillips', 'Evans', 'Turner', 'Parker', 'Collins', 'Edwards', 'Stewart', 'Morris', 'Murphy',
        'Cook', 'Rogers', 'Morgan', 'Peterson', 'Cooper', 'Reed', 'Bailey', 'Bell', 'Howard', 'Ward',
        'Cox', 'Richardson', 'Wood', 'Watson', 'Brooks', 'Bennett', 'Gray', 'Price', 'Sanders', 'Powell',
        'Russell', 'Fisher', 'Hayes', 'Sullivan', 'Wallace', 'Burns', 'Palmer', 'Porter', 'Graham', 'Spencer',
      ],
    },
    hispanic: {
      weight: 0.25,
      firstNames: [
        { name: 'Jose', gender: 'male' }, { name: 'Luis', gender: 'male' }, { name: 'Miguel', gender: 'male' },
        { name: 'Juan', gender: 'male' }, { name: 'Carlos', gender: 'male' }, { name: 'Diego', gender: 'male' },
        { name: 'Alejandro', gender: 'male' }, { name: 'Gabriel', gender: 'male' }, { name: 'Mateo', gender: 'male' },
        { name: 'Andres', gender: 'male' }, { name: 'Ricardo', gender: 'male' }, { name: 'Eduardo', gender: 'male' },
        { name: 'Antonio', gender: 'male' }, { name: 'Francisco', gender: 'male' }, { name: 'Manuel', gender: 'male' },
        { name: 'Rafael', gender: 'male' }, { name: 'Pablo', gender: 'male' }, { name: 'Oscar', gender: 'male' },
        { name: 'Sergio', gender: 'male' }, { name: 'Alberto', gender: 'male' }, { name: 'Fernando', gender: 'male' },
        { name: 'Ana', gender: 'female' }, { name: 'Maria', gender: 'female' }, { name: 'Sofia', gender: 'female' },
        { name: 'Isabella', gender: 'female' }, { name: 'Rosa', gender: 'female' }, { name: 'Carmen', gender: 'female' },
        { name: 'Lucia', gender: 'female' }, { name: 'Elena', gender: 'female' }, { name: 'Mariana', gender: 'female' },
        { name: 'Patricia', gender: 'female' }, { name: 'Daniela', gender: 'female' }, { name: 'Valentina', gender: 'female' },
        { name: 'Camila', gender: 'female' }, { name: 'Alejandra', gender: 'female' }, { name: 'Gabriela', gender: 'female' },
        { name: 'Andrea', gender: 'female' }, { name: 'Paula', gender: 'female' }, { name: 'Carolina', gender: 'female' },
        { name: 'Monica', gender: 'female' },
      ],
      lastNames: [
        'Garcia', 'Martinez', 'Rodriguez', 'Hernandez', 'Lopez', 'Gonzalez', 'Perez', 'Sanchez', 'Ramirez', 'Torres',
        'Flores', 'Rivera', 'Gomez', 'Diaz', 'Morales', 'Vasquez', 'Castillo', 'Romero', 'Alvarez', 'Ruiz',
        'Reyes', 'Cruz', 'Ortiz', 'Gutierrez', 'Chavez', 'Ramos', 'Vargas', 'Mendoza', 'Aguilar', 'Medina',
        'Castro', 'Guzman', 'Munoz', 'Rojas', 'Jimenez', 'Herrera', 'Contreras', 'Salazar', 'Luna', 'Delgado',
        'Soto', 'Vega', 'Sandoval', 'Dominguez', 'Guerrero', 'Mendez', 'Silva', 'Rios', 'Espinoza', 'Carrillo',
        'Estrada', 'Nunez', 'Figueroa', 'Fuentes', 'Campos', 'Padilla', 'Acosta', 'Santiago', 'Navarro', 'Cordova',
      ],
    },
    black: {
      weight: 0.15,
      firstNames: [
        { name: 'Andre', gender: 'male' }, { name: 'Marcus', gender: 'male' }, { name: 'Terrence', gender: 'male' },
        { name: 'Darnell', gender: 'male' }, { name: 'Tyrone', gender: 'male' }, { name: 'Malik', gender: 'male' },
        { name: 'Jamal', gender: 'male' }, { name: 'DeShawn', gender: 'male' }, { name: 'Darius', gender: 'male' },
        { name: 'Xavier', gender: 'male' }, { name: 'Lamar', gender: 'male' }, { name: 'Dante', gender: 'male' },
        { name: 'Jalen', gender: 'male' }, { name: 'Dwayne', gender: 'male' }, { name: 'Shaun', gender: 'male' },
        { name: 'Terrell', gender: 'male' }, { name: 'Devin', gender: 'male' }, { name: 'Corey', gender: 'male' },
        { name: 'Jerome', gender: 'male' }, { name: 'Kendrick', gender: 'male' }, { name: 'Kevin', gender: 'male' },
        { name: 'Aaliyah', gender: 'female' }, { name: 'Latoya', gender: 'female' }, { name: 'Monique', gender: 'female' },
        { name: 'Keisha', gender: 'female' }, { name: 'Imani', gender: 'female' }, { name: 'Jasmine', gender: 'female' },
        { name: 'Brianna', gender: 'female' }, { name: 'Michelle', gender: 'female' }, { name: 'Ebony', gender: 'female' },
        { name: 'Tamika', gender: 'female' }, { name: 'Tasha', gender: 'female' }, { name: 'Shaniqua', gender: 'female' },
        { name: 'Destiny', gender: 'female' }, { name: 'Diamond', gender: 'female' }, { name: 'Precious', gender: 'female' },
        { name: 'Jasmin', gender: 'female' }, { name: 'Alicia', gender: 'female' }, { name: 'Tiffany', gender: 'female' },
        { name: 'Jordan', gender: 'neutral' },
      ],
      lastNames: [
        'Washington', 'Jefferson', 'Henderson', 'Robinson', 'Carter', 'Mitchell', 'Turner', 'Parker', 'Brooks', 'Collins',
        'Reed', 'Cooper', 'Morgan', 'Bell', 'Murphy', 'Bailey', 'Howard', 'Ward', 'Foster', 'Gray',
        'Jenkins', 'Perry', 'Powell', 'Long', 'Patterson', 'Hughes', 'Price', 'Sanders', 'Butler', 'Barnes',
        'Ross', 'Jordan', 'Coleman', 'Wallace', 'Bryant', 'Alexander', 'Russell', 'Griffin', 'Hayes', 'Myers',
        'Ford', 'Hamilton', 'Graham', 'Sullivan', 'Freeman', 'Simmons', 'Gordon', 'Hunter', 'Crawford', 'Mason',
        'Boyd', 'Kennedy', 'Warren', 'Dixon', 'Raines', 'Hawkins', 'Armstrong', 'Berry', 'Owens', 'Ellis',
      ],
    },
    asian: {
      weight: 0.10,
      firstNames: [
        { name: 'Minh', gender: 'male' }, { name: 'Tuan', gender: 'male' }, { name: 'Arjun', gender: 'male' },
        { name: 'Rahul', gender: 'male' }, { name: 'Amit', gender: 'male' }, { name: 'Hao', gender: 'male' },
        { name: 'Kevin', gender: 'male' }, { name: 'Daniel', gender: 'male' }, { name: 'Andrew', gender: 'male' },
        { name: 'Raj', gender: 'male' }, { name: 'Deepak', gender: 'male' }, { name: 'Vikram', gender: 'male' },
        { name: 'Sanjay', gender: 'male' }, { name: 'Ravi', gender: 'male' }, { name: 'Suresh', gender: 'male' },
        { name: 'Jin', gender: 'male' }, { name: 'Hiroshi', gender: 'male' }, { name: 'Kenji', gender: 'male' },
        { name: 'Takeshi', gender: 'male' }, { name: 'Ken', gender: 'male' },
        { name: 'Anh', gender: 'female' }, { name: 'Linh', gender: 'female' }, { name: 'Neha', gender: 'female' },
        { name: 'Sunita', gender: 'female' }, { name: 'Mei', gender: 'female' }, { name: 'Michelle', gender: 'female' },
        { name: 'Grace', gender: 'female' }, { name: 'Priya', gender: 'female' }, { name: 'Anita', gender: 'female' },
        { name: 'Kavita', gender: 'female' }, { name: 'Pooja', gender: 'female' }, { name: 'Yuki', gender: 'female' },
        { name: 'Yoko', gender: 'female' }, { name: 'Sakura', gender: 'female' }, { name: 'Naomi', gender: 'female' },
        { name: 'Lily', gender: 'female' },
        { name: 'Wei', gender: 'neutral' }, { name: 'Chen', gender: 'neutral' }, { name: 'Li', gender: 'neutral' },
        { name: 'Bao', gender: 'neutral' },
      ],
      lastNames: [
        'Nguyen', 'Tran', 'Le', 'Pham', 'Patel', 'Shah', 'Singh', 'Kaur', 'Kim', 'Lee',
        'Park', 'Choi', 'Chen', 'Wang', 'Zhang', 'Liu', 'Huang', 'Wu', 'Gupta', 'Mehta',
        'Sharma', 'Kumar', 'Reddy', 'Rao', 'Nair', 'Iyer', 'Desai', 'Kapoor', 'Malhotra', 'Joshi',
        'Tanaka', 'Yamamoto', 'Suzuki', 'Watanabe', 'Ito', 'Nakamura', 'Kobayashi', 'Saito', 'Kato', 'Yoshida',
        'Yang', 'Xu', 'Sun', 'Ma', 'Hu', 'Guo', 'Lin', 'Luo', 'Zheng', 'Zhu',
        'Vo', 'Do', 'Bui', 'Dang', 'Ho', 'Ngo', 'Duong', 'Ly', 'Huynh', 'Truong',
      ],
    },
    neutral: {
      weight: 0.05,
      firstNames: [
        { name: 'Alex', gender: 'neutral' }, { name: 'Jordan', gender: 'neutral' }, { name: 'Taylor', gender: 'neutral' },
        { name: 'Morgan', gender: 'neutral' }, { name: 'Casey', gender: 'neutral' }, { name: 'Riley', gender: 'neutral' },
        { name: 'Quinn', gender: 'neutral' }, { name: 'Avery', gender: 'neutral' }, { name: 'Cameron', gender: 'neutral' },
        { name: 'Dakota', gender: 'neutral' }, { name: 'Emerson', gender: 'neutral' }, { name: 'Harper', gender: 'neutral' },
        { name: 'Jamie', gender: 'neutral' }, { name: 'Kendall', gender: 'neutral' }, { name: 'Logan', gender: 'neutral' },
        { name: 'Parker', gender: 'neutral' }, { name: 'Rowan', gender: 'neutral' }, { name: 'Skyler', gender: 'neutral' },
        { name: 'Sam', gender: 'neutral' }, { name: 'Sasha', gender: 'neutral' }, { name: 'Drew', gender: 'neutral' },
        { name: 'Blake', gender: 'neutral' }, { name: 'Reese', gender: 'neutral' }, { name: 'Finley', gender: 'neutral' },
        { name: 'Hayden', gender: 'neutral' }, { name: 'Peyton', gender: 'neutral' }, { name: 'Sydney', gender: 'neutral' },
        { name: 'Jessie', gender: 'neutral' }, { name: 'Charlie', gender: 'neutral' }, { name: 'Frankie', gender: 'neutral' },
      ],
      lastNames: [
        'Smith', 'Johnson', 'Lee', 'Garcia', 'Brown', 'Martinez', 'Kim', 'Nguyen', 'Patel', 'Harris',
        'Clark', 'Robinson', 'Walker', 'Young', 'Hall', 'Allen', 'Scott', 'Adams', 'Baker', 'Nelson',
        'Wright', 'Green', 'Mitchell', 'Campbell', 'Roberts', 'Phillips', 'Evans', 'Turner', 'Torres', 'Parker',
        'Collins', 'Edwards', 'Stewart', 'Morris', 'Rogers', 'Reed', 'Cook', 'Morgan', 'Bell', 'Bailey',
      ],
    },
  },
  mixingRules: {
    sameBucketProbability: 0.75,
  },
};

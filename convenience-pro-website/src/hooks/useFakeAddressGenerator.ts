import { useState, useCallback } from 'react';

export type Country = 'us' | 'uk' | 'ca' | 'au' | 'de';

export interface FakeAddress {
  id: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  fullAddress: string;
}

interface UseFakeAddressGeneratorReturn {
  addresses: FakeAddress[];
  generateAddress: (country: Country) => FakeAddress;
  generateMultiple: (country: Country, count: number) => FakeAddress[];
  clearAddresses: () => void;
}

// US Data
const US_STREETS = [
  'Main St', 'Oak Ave', 'Maple Dr', 'Cedar Ln', 'Pine Rd', 'Elm St', 'Washington Blvd',
  'Park Ave', 'Lake Dr', 'Hill Rd', 'Forest Way', 'Sunset Blvd', 'River Rd', 'Valley View Dr',
  'Meadow Ln', 'Spring St', 'Church St', 'Mill Rd', 'School St', 'High St',
];

const US_CITIES_BY_STATE: Record<string, string[]> = {
  'CA': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'Fresno', 'Oakland'],
  'NY': ['New York', 'Buffalo', 'Rochester', 'Albany', 'Syracuse', 'Yonkers'],
  'TX': ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso'],
  'FL': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale', 'Tallahassee'],
  'IL': ['Chicago', 'Aurora', 'Naperville', 'Rockford', 'Springfield', 'Peoria'],
  'PA': ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading', 'Scranton'],
  'OH': ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron', 'Dayton'],
  'GA': ['Atlanta', 'Savannah', 'Augusta', 'Columbus', 'Macon', 'Athens'],
  'WA': ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue', 'Everett'],
  'AZ': ['Phoenix', 'Tucson', 'Mesa', 'Scottsdale', 'Chandler', 'Tempe'],
};

const US_ZIP_PREFIXES: Record<string, string[]> = {
  'CA': ['90', '91', '92', '93', '94', '95'],
  'NY': ['10', '11', '12', '13', '14'],
  'TX': ['75', '76', '77', '78', '79'],
  'FL': ['32', '33', '34'],
  'IL': ['60', '61', '62'],
  'PA': ['15', '16', '17', '18', '19'],
  'OH': ['43', '44', '45'],
  'GA': ['30', '31'],
  'WA': ['98', '99'],
  'AZ': ['85', '86'],
};

// UK Data
const UK_STREETS = ['High St', 'Church Rd', 'Station Rd', 'Victoria Rd', 'Manor Way', 'Park Lane'];
const UK_CITIES = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Liverpool', 'Bristol'];
const UK_COUNTIES = ['Greater London', 'West Midlands', 'Greater Manchester', 'West Yorkshire'];

// Canada Data
const CA_STREETS = ['King St', 'Queen St', 'Main St', 'Yonge St', 'Bay St', 'Dundas St'];
const CA_CITIES_BY_PROVINCE: Record<string, string[]> = {
  'ON': ['Toronto', 'Ottawa', 'Hamilton', 'London', 'Mississauga'],
  'BC': ['Vancouver', 'Victoria', 'Surrey', 'Burnaby'],
  'AB': ['Calgary', 'Edmonton', 'Red Deer'],
  'QC': ['Montreal', 'Quebec City', 'Laval'],
};

// Australia Data
const AU_STREETS = ['George St', 'King St', 'Queen St', 'Elizabeth St', 'Victoria Ave'];
const AU_CITIES_BY_STATE: Record<string, string[]> = {
  'NSW': ['Sydney', 'Newcastle', 'Wollongong'],
  'VIC': ['Melbourne', 'Geelong', 'Ballarat'],
  'QLD': ['Brisbane', 'Gold Coast', 'Cairns'],
};

// Germany Data
const DE_STREETS = ['Hauptstrasse', 'Bahnhofstrasse', 'Kirchstrasse', 'Schulstrasse', 'Gartenstrasse'];
const DE_CITIES_BY_STATE: Record<string, string[]> = {
  'Bayern': ['Munich', 'Nuremberg', 'Augsburg'],
  'NRW': ['Cologne', 'Dusseldorf', 'Dortmund'],
  'Berlin': ['Berlin'],
};

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function generateUSAddress(): FakeAddress {
  const state = randomElement(Object.keys(US_CITIES_BY_STATE));
  const city = randomElement(US_CITIES_BY_STATE[state]);
  const street = `${randomNumber(100, 9999)} ${randomElement(US_STREETS)}`;
  const zipPrefix = randomElement(US_ZIP_PREFIXES[state]);
  const zip = `${zipPrefix}${randomNumber(100, 999).toString().padStart(3, '0')}`;

  return {
    id: generateId(),
    street,
    city,
    state,
    zip,
    country: 'United States',
    fullAddress: `${street}, ${city}, ${state} ${zip}, USA`,
  };
}

function generateUKAddress(): FakeAddress {
  const street = `${randomNumber(1, 200)} ${randomElement(UK_STREETS)}`;
  const city = randomElement(UK_CITIES);
  const county = randomElement(UK_COUNTIES);
  const postcode = `${String.fromCharCode(65 + randomNumber(0, 25))}${String.fromCharCode(65 + randomNumber(0, 25))}${randomNumber(1, 99)} ${randomNumber(1, 9)}${String.fromCharCode(65 + randomNumber(0, 25))}${String.fromCharCode(65 + randomNumber(0, 25))}`;

  return {
    id: generateId(),
    street,
    city,
    state: county,
    zip: postcode,
    country: 'United Kingdom',
    fullAddress: `${street}, ${city}, ${county}, ${postcode}, UK`,
  };
}

function generateCAAddress(): FakeAddress {
  const province = randomElement(Object.keys(CA_CITIES_BY_PROVINCE));
  const city = randomElement(CA_CITIES_BY_PROVINCE[province]);
  const street = `${randomNumber(1, 999)} ${randomElement(CA_STREETS)}`;
  const postalCode = `${String.fromCharCode(65 + randomNumber(0, 25))}${randomNumber(0, 9)}${String.fromCharCode(65 + randomNumber(0, 25))} ${randomNumber(0, 9)}${String.fromCharCode(65 + randomNumber(0, 25))}${randomNumber(0, 9)}`;

  return {
    id: generateId(),
    street,
    city,
    state: province,
    zip: postalCode,
    country: 'Canada',
    fullAddress: `${street}, ${city}, ${province} ${postalCode}, Canada`,
  };
}

function generateAUAddress(): FakeAddress {
  const state = randomElement(Object.keys(AU_CITIES_BY_STATE));
  const city = randomElement(AU_CITIES_BY_STATE[state]);
  const street = `${randomNumber(1, 500)} ${randomElement(AU_STREETS)}`;
  const postcode = randomNumber(1000, 9999).toString();

  return {
    id: generateId(),
    street,
    city,
    state,
    zip: postcode,
    country: 'Australia',
    fullAddress: `${street}, ${city}, ${state} ${postcode}, Australia`,
  };
}

function generateDEAddress(): FakeAddress {
  const state = randomElement(Object.keys(DE_CITIES_BY_STATE));
  const city = randomElement(DE_CITIES_BY_STATE[state]);
  const street = `${randomElement(DE_STREETS)} ${randomNumber(1, 200)}`;
  const plz = randomNumber(10000, 99999).toString();

  return {
    id: generateId(),
    street,
    city,
    state,
    zip: plz,
    country: 'Germany',
    fullAddress: `${street}, ${plz} ${city}, Germany`,
  };
}

export function useFakeAddressGenerator(): UseFakeAddressGeneratorReturn {
  const [addresses, setAddresses] = useState<FakeAddress[]>([]);

  const generateAddress = useCallback((country: Country): FakeAddress => {
    let address: FakeAddress;

    switch (country) {
      case 'uk':
        address = generateUKAddress();
        break;
      case 'ca':
        address = generateCAAddress();
        break;
      case 'au':
        address = generateAUAddress();
        break;
      case 'de':
        address = generateDEAddress();
        break;
      default:
        address = generateUSAddress();
    }

    setAddresses((prev) => [address, ...prev]);
    return address;
  }, []);

  const generateMultiple = useCallback((country: Country, count: number): FakeAddress[] => {
    const newAddresses: FakeAddress[] = [];
    for (let i = 0; i < count; i++) {
      let address: FakeAddress;
      switch (country) {
        case 'uk':
          address = generateUKAddress();
          break;
        case 'ca':
          address = generateCAAddress();
          break;
        case 'au':
          address = generateAUAddress();
          break;
        case 'de':
          address = generateDEAddress();
          break;
        default:
          address = generateUSAddress();
      }
      newAddresses.push(address);
    }
    setAddresses((prev) => [...newAddresses, ...prev]);
    return newAddresses;
  }, []);

  const clearAddresses = useCallback(() => {
    setAddresses([]);
  }, []);

  return {
    addresses,
    generateAddress,
    generateMultiple,
    clearAddresses,
  };
}

import type { Patient } from '../types.ts';

const patients: Patient[] = [
  {
    id: 'd2773336-f723-11e9-8f0b-362b9e155667',
    name: 'John McClane',
    dateOfBirth: '1986-07-09',
    ssn: '090786-122X',
    gender: 'male',
    occupation: 'New york city cop',
    entries: [
      {
        id: 'b4f4eca1-5e2d-4f3a-9b01-7fdc0a7f6f4d',
        date: '2019-01-01',
        type: 'Hospital',
        specialist: 'MD House',
        diagnosisCodes: ['S62.5'],
        description: 'Thumb has healed',
        discharge: {
          date: '2019-01-02',
          criteria: 'Thumb healed',
        },
      },
    ],
  },
  {
    id: 'd2773598-f723-11e9-8f0b-362b9e155667',
    name: 'Martin Riggs',
    dateOfBirth: '1979-01-30',
    ssn: '300179-77A',
    gender: 'male',
    occupation: 'Cop',
    entries: [],
  },
  {
    id: 'd27736f4-f723-11e9-8f0b-362b9e155667',
    name: 'Hans Gruber',
    dateOfBirth: '1970-04-25',
    ssn: '250470-555L',
    gender: 'male',
    occupation: 'Technician',
    entries: [],
  },
];

export default patients;

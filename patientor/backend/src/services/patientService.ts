import { v4 as uuid } from 'uuid';
import patients from '../data/patients.ts';
import type { Diagnosis, Entry, NewEntry, NewPatient, Patient, PublicPatient } from '../types.ts';

const diagnoses: Diagnosis[] = [
  { code: 'S62.5', name: 'Fracture of thumb', latin: 'Fractura ossis metacarpi primi' },
  { code: 'L20', name: 'Atopic dermatitis', latin: 'Atopic dermatitis' },
  { code: 'M24.2', name: 'Disorder of ligament', latin: 'Disorder of ligament' },
  { code: 'J10', name: 'Influenza', latin: 'Influenza' },
  { code: 'H35.8', name: 'Retinal disorders', latin: 'Retinal disorders' },
  { code: 'Z57.1', name: 'Occupational exposure to radiation', latin: 'Exposura ad radiorum' },
  { code: 'N30.0', name: 'Acute cystitis', latin: 'Cystitis acuta' },
  { code: 'M51.2', name: 'Lumbar disc herniation', latin: 'Discus herniatus lumbalis' },
  { code: 'A15.0', name: 'Tuberculosis of lung', latin: 'Tuberculosis pulmonis' },
  { code: 'J06.9', name: 'Acute upper respiratory infection', latin: 'Infectio acuta respiratorii superioris' },
];

const getPatients = (): Patient[] => patients;

const getPublicPatients = (): PublicPatient[] => patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
  id,
  name,
  dateOfBirth,
  gender,
  occupation,
}));

const getDiagnoses = (): Diagnosis[] => diagnoses;

const addPatient = (patient: NewPatient): Patient => {
  const newPatient: Patient = {
    ...patient,
    id: uuid(),
    entries: [],
  };

  patients.push(newPatient);
  return newPatient;
};

const findById = (id: string): Patient | undefined => patients.find((patient) => patient.id === id);

const addEntry = (patientId: string, entry: NewEntry): Patient => {
  const patient = findById(patientId);

  if (!patient) {
    throw new Error('Patient not found');
  }

  const newEntry: Entry = {
    ...entry,
    id: uuid(),
  };

  patient.entries.push(newEntry);
  return patient;
};

export default {
  getPatients,
  getPublicPatients,
  getDiagnoses,
  addPatient,
  findById,
  addEntry,
};

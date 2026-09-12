import { z } from 'zod';

export const Gender = {
  Male: 'male',
  Female: 'female',
  Other: 'other',
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];

export type HealthCheckRating = 0 | 1 | 2 | 3;

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}

export interface HealthCheckEntry extends BaseEntry {
  type: 'HealthCheck';
  healthCheckRating: HealthCheckRating;
}

export interface HospitalEntry extends BaseEntry {
  type: 'Hospital';
  discharge: {
    date: string;
    criteria: string;
  };
}

export interface OccupationalHealthcareEntry extends BaseEntry {
  type: 'OccupationalHealthcare';
  employerName: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
}

export type Entry = HospitalEntry | OccupationalHealthcareEntry | HealthCheckEntry;

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries: Entry[];
}

export type PublicPatient = Omit<Patient, 'ssn' | 'entries'>;

export const NewPatientSchema = z.object({
  name: z.string().min(1),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  ssn: z.string().min(1),
  gender: z.enum(['male', 'female', 'other']),
  occupation: z.string().min(1),
});

export type NewPatient = z.infer<typeof NewPatientSchema>;

const NewEntryBaseSchema = {
  description: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  specialist: z.string().min(1),
  diagnosisCodes: z.array(z.string()).optional(),
};

const HealthCheckEntrySchema = z.object({
  ...NewEntryBaseSchema,
  type: z.literal('HealthCheck'),
  healthCheckRating: z.union([
    z.literal(0),
    z.literal(1),
    z.literal(2),
    z.literal(3),
  ]),
});

const HospitalEntrySchema = z.object({
  ...NewEntryBaseSchema,
  type: z.literal('Hospital'),
  discharge: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    criteria: z.string().min(1),
  }),
});

const OccupationalHealthcareEntrySchema = z.object({
  ...NewEntryBaseSchema,
  type: z.literal('OccupationalHealthcare'),
  employerName: z.string().min(1),
  sickLeave: z.object({
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }).optional(),
});

export const NewEntrySchema = z.discriminatedUnion('type', [
  HealthCheckEntrySchema,
  HospitalEntrySchema,
  OccupationalHealthcareEntrySchema,
]);

export type NewEntry = z.infer<typeof NewEntrySchema>;

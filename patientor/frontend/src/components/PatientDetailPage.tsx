import { useEffect, useState, type SyntheticEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useParams } from 'react-router-dom';

import patientService from '../services/patients';
import type {
  Diagnosis,
  Entry,
  HealthCheckEntry,
  NewEntry,
  Patient,
} from '../types';

type EntryType = NewEntry['type'];

type EntryFormState = {
  type: EntryType;
  date: string;
  description: string;
  specialist: string;
  diagnosisCodes: string;
  healthCheckRating: HealthCheckEntry['healthCheckRating'];
  dischargeDate: string;
  dischargeCriteria: string;
  employerName: string;
  sickLeaveStart: string;
  sickLeaveEnd: string;
};

const initialForm: EntryFormState = {
  type: 'HealthCheck',
  date: '',
  description: '',
  specialist: '',
  diagnosisCodes: '',
  healthCheckRating: 0,
  dischargeDate: '',
  dischargeCriteria: '',
  employerName: '',
  sickLeaveStart: '',
  sickLeaveEnd: '',
};

const assertNever = (value: never): never => {
  throw new Error(`Unhandled entry type: ${JSON.stringify(value)}`);
};

const diagnosisLabel = (code: string, diagnoses: Diagnosis[]) => {
  const diagnosis = diagnoses.find((item) => item.code === code);
  return diagnosis ? `${code}: ${diagnosis.name}` : code;
};

const EntryDetails = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case 'HealthCheck':
      return <Typography>Health rating: {entry.healthCheckRating}/3</Typography>;
    case 'Hospital':
      return (
        <Typography>
          Discharged {entry.discharge.date}: {entry.discharge.criteria}
        </Typography>
      );
    case 'OccupationalHealthcare':
      return (
        <Stack spacing={0.5}>
          <Typography>Employer: {entry.employerName}</Typography>
          {entry.sickLeave && (
            <Typography>
              Sick leave: {entry.sickLeave.startDate} to {entry.sickLeave.endDate}
            </Typography>
          )}
        </Stack>
      );
    default:
      return assertNever(entry);
  }
};

const PatientDetailPage = ({ diagnoses }: { diagnoses: Diagnosis[] }) => {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<EntryFormState>(initialForm);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const loadPatient = async () => {
      try {
        const result = await patientService.getById(id);
        if (!cancelled) setPatient(result);
      } catch {
        if (!cancelled) setError('Patient not found');
      }
    };

    void loadPatient();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const updateForm = <Key extends keyof EntryFormState>(key: Key, value: EntryFormState[Key]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const closeModal = () => {
    setModalOpen(false);
    setError(null);
    setForm(initialForm);
  };

  const handleAddEntry = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (!id) return;

    const base = {
      date: form.date,
      description: form.description,
      specialist: form.specialist,
      diagnosisCodes: form.diagnosisCodes
        .split(',')
        .map((code) => code.trim())
        .filter(Boolean),
    };

    let entry: NewEntry;
    switch (form.type) {
      case 'HealthCheck':
        entry = { ...base, type: 'HealthCheck', healthCheckRating: form.healthCheckRating };
        break;
      case 'Hospital':
        entry = {
          ...base,
          type: 'Hospital',
          discharge: { date: form.dischargeDate, criteria: form.dischargeCriteria },
        };
        break;
      case 'OccupationalHealthcare':
        entry = {
          ...base,
          type: 'OccupationalHealthcare',
          employerName: form.employerName,
          ...(form.sickLeaveStart && form.sickLeaveEnd
            ? { sickLeave: { startDate: form.sickLeaveStart, endDate: form.sickLeaveEnd } }
            : {}),
        };
        break;
      default:
        return assertNever(form.type);
    }

    try {
      const updatedPatient = await patientService.addEntry(id, entry);
      setPatient(updatedPatient);
      closeModal();
    } catch {
      setError('Could not add entry. Check the required fields and dates.');
    }
  };

  if (error && !modalOpen) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!patient) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Stack spacing={3} className="patient-detail">
      <Box className="patient-hero">
        <Typography variant="overline" color="primary">Patient record</Typography>
        <Typography variant="h4">{patient.name}</Typography>
        <Typography color="text.secondary">{patient.occupation}</Typography>
      </Box>
      <Box className="patient-facts">
        <Typography><strong>SSN:</strong> {patient.ssn}</Typography>
        <Typography><strong>Gender:</strong> {patient.gender}</Typography>
        <Typography><strong>Date of birth:</strong> {patient.dateOfBirth}</Typography>
      </Box>
      <Divider />
      <Box className="section-heading">
        <div>
          <Typography variant="overline" color="primary">Medical record</Typography>
          <Typography variant="h5">Entries</Typography>
        </div>
        <Button variant="contained" onClick={() => setModalOpen(true)}>Add New Entry</Button>
      </Box>
      {(patient.entries ?? []).length === 0 && (
        <Typography color="text.secondary">No entries recorded yet.</Typography>
      )}
      {(patient.entries ?? []).map((entry) => (
        <Card key={entry.id} className="entry-card" variant="outlined">
          <CardContent>
            <Stack spacing={1}>
              <Box className="entry-heading">
                <Typography variant="subtitle1" fontWeight={700}>{entry.date}</Typography>
                <Chip size="small" label={entry.type} color="primary" variant="outlined" />
              </Box>
              <Typography>{entry.description}</Typography>
              <Typography color="text.secondary">Specialist: {entry.specialist}</Typography>
              {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
                <Typography color="text.secondary">
                  Diagnoses: {entry.diagnosisCodes.map((code) => diagnosisLabel(code, diagnoses)).join(', ')}
                </Typography>
              )}
              <EntryDetails entry={entry} />
            </Stack>
          </CardContent>
        </Card>
      ))}

      <Dialog open={modalOpen} onClose={closeModal} fullWidth maxWidth="sm">
        <DialogTitle>Add a new entry</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleAddEntry} className="entry-form">
            {error && <Alert severity="error">{error}</Alert>}
            <TextField label="Date" type="date" value={form.date} onChange={(event) => updateForm('date', event.target.value)} InputLabelProps={{ shrink: true }} required />
            <TextField label="Description" value={form.description} onChange={(event) => updateForm('description', event.target.value)} required />
            <TextField label="Specialist" value={form.specialist} onChange={(event) => updateForm('specialist', event.target.value)} required />
            <TextField label="Diagnosis codes" value={form.diagnosisCodes} onChange={(event) => updateForm('diagnosisCodes', event.target.value)} helperText="Separate codes with commas" />
            <FormControl fullWidth>
              <InputLabel id="entry-type-label">Entry type</InputLabel>
              <Select labelId="entry-type-label" label="Entry type" value={form.type} onChange={(event) => updateForm('type', event.target.value as EntryType)}>
                <MenuItem value="HealthCheck">Health check</MenuItem>
                <MenuItem value="Hospital">Hospital</MenuItem>
                <MenuItem value="OccupationalHealthcare">Occupational healthcare</MenuItem>
              </Select>
            </FormControl>
            {form.type === 'HealthCheck' && (
              <FormControl fullWidth>
                <InputLabel id="health-rating-label">Health rating</InputLabel>
                <Select labelId="health-rating-label" label="Health rating" value={form.healthCheckRating} onChange={(event) => updateForm('healthCheckRating', Number(event.target.value) as HealthCheckEntry['healthCheckRating'])}>
                  <MenuItem value={0}>0 - Healthy</MenuItem>
                  <MenuItem value={1}>1 - Low risk</MenuItem>
                  <MenuItem value={2}>2 - High risk</MenuItem>
                  <MenuItem value={3}>3 - Critical risk</MenuItem>
                </Select>
              </FormControl>
            )}
            {form.type === 'Hospital' && (
              <>
                <TextField label="Discharge date" type="date" value={form.dischargeDate} onChange={(event) => updateForm('dischargeDate', event.target.value)} InputLabelProps={{ shrink: true }} required />
                <TextField label="Discharge criteria" value={form.dischargeCriteria} onChange={(event) => updateForm('dischargeCriteria', event.target.value)} required />
              </>
            )}
            {form.type === 'OccupationalHealthcare' && (
              <>
                <TextField label="Employer name" value={form.employerName} onChange={(event) => updateForm('employerName', event.target.value)} required />
                <TextField label="Sick leave start" type="date" value={form.sickLeaveStart} onChange={(event) => updateForm('sickLeaveStart', event.target.value)} InputLabelProps={{ shrink: true }} />
                <TextField label="Sick leave end" type="date" value={form.sickLeaveEnd} onChange={(event) => updateForm('sickLeaveEnd', event.target.value)} InputLabelProps={{ shrink: true }} />
              </>
            )}
            <Button type="submit" variant="contained">Add</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Stack>
  );
};

export default PatientDetailPage;

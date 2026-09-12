import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useParams } from 'react-router-dom';

import patientService from '../services/patients';
import { Patient } from '../types';

const PatientDetailPage = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [specialist, setSpecialist] = useState('');

  const fetchPatient = async () => {
    if (!id) return;

    try {
      const result = await patientService.getById(id);
      setPatient(result);
    } catch {
      setError('Patient not found');
    }
  };

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const loadPatient = async () => {
      try {
        const result = await patientService.getById(id);
        if (!cancelled) {
          setPatient(result);
        }
      } catch {
        if (!cancelled) {
          setError('Patient not found');
        }
      }
    };

    void loadPatient();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleAddEntry = async () => {
    if (!id) return;

    try {
      await patientService.addEntry(id, {
        type: 'HealthCheck',
        healthCheckRating: 0,
        date,
        description,
        specialist,
      });
      setModalOpen(false);
      setDate('');
      setDescription('');
      setSpecialist('');
      await fetchPatient();
    } catch {
      setError('Could not add entry');
    }
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!patient) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h4">{patient.name}</Typography>
      <Typography>SSN: {patient.ssn}</Typography>
      <Typography>Occupation: {patient.occupation}</Typography>
      <Typography>Date of birth: {patient.dateOfBirth}</Typography>
      <Divider />
      <Typography variant="h5">Entries</Typography>
      {(patient.entries ?? []).map((entry) => (
        <Card key={entry.id} variant="outlined">
          <CardContent>
            <Typography variant="subtitle1">{entry.date} — {entry.description}</Typography>
            <Typography>Specialist: {entry.specialist}</Typography>
            <Typography>Type: {entry.type}</Typography>
            {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
              <Typography>Diagnosis codes: {entry.diagnosisCodes.join(', ')}</Typography>
            )}
          </CardContent>
        </Card>
      ))}
      <Button variant="contained" onClick={() => setModalOpen(true)}>
        Add New Entry
      </Button>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth>
        <DialogTitle>Add a new entry</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Date" value={date} onChange={({ target }) => setDate(target.value)} />
            <TextField
              label="Description"
              value={description}
              onChange={({ target }) => setDescription(target.value)}
            />
            <TextField
              label="Specialist"
              value={specialist}
              onChange={({ target }) => setSpecialist(target.value)}
            />
            <Button variant="contained" onClick={handleAddEntry}>
              Add
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Stack>
  );
};

export default PatientDetailPage;

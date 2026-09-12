import cors from 'cors';
import express, { type Request, type Response } from 'express';
import patientService from './services/patientService.ts';
import { NewEntrySchema, NewPatientSchema } from './types.ts';
import { errorHandler } from './middleware.ts';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

app.get('/api/ping', (_req: Request, res: Response) => {
  res.send('pong');
});

app.get('/api/diagnoses', (_req: Request, res: Response) => {
  res.json(patientService.getDiagnoses());
});

app.get('/api/patients', (_req: Request, res: Response) => {
  res.json(patientService.getPublicPatients());
});

app.post('/api/patients', (req: Request, res: Response, next: express.NextFunction) => {
  try {
    const patientInput = NewPatientSchema.parse(req.body);
    const patient = patientService.addPatient(patientInput);
    res.json(patient);
  } catch (error: unknown) {
    next(error);
  }
});

app.get('/api/patients/:id', (req: Request<{ id: string }>, res: Response) => {
  const patient = patientService.findById(req.params.id);

  if (!patient) {
    res.status(404).json({ error: 'Patient not found' });
    return;
  }

  res.json(patient);
});

app.post('/api/patients/:id/entries', (req: Request<{ id: string }>, res: Response, next: express.NextFunction) => {
  try {
    const input = NewEntrySchema.parse(req.body);
    const patient = patientService.addEntry(req.params.id, input);
    res.json(patient);
  } catch (error: unknown) {
    next(error);
  }
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Patientor backend running on port ${PORT}`);
});

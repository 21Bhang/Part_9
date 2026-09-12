import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { Button, Divider, Container, createTheme, ThemeProvider, Typography } from '@mui/material';

import { apiBaseUrl } from "./constants";
import { Diagnosis, Patient } from "./types";

import patientService from "./services/patients";
import PatientListPage from "./components/PatientListPage";
import PatientDetailPage from "./components/PatientDetailPage";

const theme = createTheme({
  palette: {
    primary: { main: '#1261a0', dark: '#0b3d66', light: '#4e9bd4' },
    secondary: { main: '#e7f2fb' },
    background: { default: '#f5f9fd', paper: '#ffffff' },
  },
  typography: {
    fontFamily: '"Source Sans 3", "Segoe UI", sans-serif',
    h3: { fontFamily: 'Georgia, serif', fontWeight: 700 },
    h4: { fontFamily: 'Georgia, serif', fontWeight: 700 },
    h5: { fontFamily: 'Georgia, serif', fontWeight: 700 },
  },
  shape: { borderRadius: 8 },
});

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      const patients = await patientService.getAll();
      setPatients(patients);
    };
    const fetchDiagnoses = async () => {
      const diagnoses = await patientService.getDiagnoses();
      setDiagnoses(diagnoses);
    };
    void fetchPatientList();
    void fetchDiagnoses();
  }, []);

  return (
    <ThemeProvider theme={theme}>
    <div className="App">
      <Router>
        <Container>
          <Typography variant="h3" sx={{ marginBottom: "0.5em" }}>
            Patientor
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary">
            Home
          </Button>
          <Divider sx={{ marginY: 2 }} />
          <Routes>
            <Route path="/" element={<PatientListPage patients={patients} setPatients={setPatients} />} />
            <Route path="/patients/:id" element={<PatientDetailPage diagnoses={diagnoses} />} />
          </Routes>
        </Container>
      </Router>
    </div>
    </ThemeProvider>
  );
};

export default App;

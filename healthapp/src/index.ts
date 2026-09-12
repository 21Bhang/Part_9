import express, { type Request, type Response } from 'express';
import { z } from 'zod';

const app = express();
app.use(express.json());

const PORT = 3000;

const exerciseSchema = z.object({
  daily_exercises: z.array(z.coerce.number()).min(1),
  target: z.coerce.number(),
});

const calculateBmi = (height: number, weight: number): string => {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  if (bmi < 16) return 'Underweight (Severe thinness)';
  if (bmi < 17) return 'Underweight (Moderate thinness)';
  if (bmi < 18.5) return 'Underweight (Mild thinness)';
  if (bmi < 25) return 'Normal (healthy weight)';
  if (bmi < 30) return 'Overweight (Pre-obesity)';
  if (bmi < 35) return 'Obese (Class I)';
  if (bmi < 40) return 'Obese (Class II)';
  return 'Obese (Class III)';
};

const calculateExercises = (dailyExercises: number[], target: number) => {
  const periodLength = dailyExercises.length;
  const trainingDays = dailyExercises.filter((days) => days > 0).length;
  const average = dailyExercises.reduce((sum, value) => sum + value, 0) / periodLength;
  const success = average >= target;
  const rating = average >= target ? 3 : average >= target * 0.8 ? 2 : 1;
  const ratingDescription =
    rating === 3 ? 'Excellent work! Keep it up.' :
    rating === 2 ? 'Not too bad but could be better.' :
    'Needs improvement.';

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

app.get('/hello', (_req: Request, res: Response) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req: Request, res: Response) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (!req.query.height || !req.query.weight || Number.isNaN(height) || Number.isNaN(weight)) {
    res.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  const result = { weight, height, bmi: calculateBmi(height, weight) };
  res.json(result);
});

app.post('/exercises', (req: Request, res: Response) => {
  const { daily_exercises, target } = req.body as { daily_exercises?: unknown; target?: unknown };

  if (daily_exercises === undefined || target === undefined) {
    res.status(400).json({ error: 'parameters missing' });
    return;
  }

  try {
    const validated = exerciseSchema.parse({ daily_exercises, target });
    const result = calculateExercises(validated.daily_exercises, validated.target);
    res.json(result);
  } catch {
    res.status(400).json({ error: 'malformatted parameters' });
  }
});

app.use((_req: Request, res: Response) => {
  res.status(404).send({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Health app running on port ${PORT}`);
});

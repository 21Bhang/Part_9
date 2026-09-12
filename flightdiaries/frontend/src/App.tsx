import { useEffect, useState, type SyntheticEvent } from 'react'
import axios from 'axios'
import diaryService from './diaryService'
import {
  visibilityOptions,
  weatherOptions,
  type DiaryEntry,
  type NewDiaryEntry,
  type Visibility,
  type Weather,
} from './types'
import './App.css'

const App = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [date, setDate] = useState('')
  const [weather, setWeather] = useState<Weather>('sunny')
  const [visibility, setVisibility] = useState<Visibility>('good')
  const [comment, setComment] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadEntries = async () => {
      try {
        const initialEntries = await diaryService.getAll()
        if (!cancelled) setEntries(initialEntries)
      } catch {
        if (!cancelled) setError('Could not load diary entries')
      }
    }

    void loadEntries()
    return () => {
      cancelled = true
    }
  }, [])

  const createEntry = async (event: SyntheticEvent) => {
    event.preventDefault()
    setError(null)

    const newEntry: NewDiaryEntry = { date, weather, visibility, comment }

    try {
      const returnedEntry = await diaryService.create(newEntry)
      setEntries((currentEntries) => currentEntries.concat(returnedEntry))
      setDate('')
      setComment('')
    } catch (requestError: unknown) {
      if (axios.isAxiosError<{ error?: Array<{ message?: string }> }>(requestError)) {
        const issues = requestError.response?.data?.error
        const reason = Array.isArray(issues)
          ? issues.map((issue) => issue.message).filter(Boolean).join(', ')
          : undefined
        setError(reason ? `Could not create entry: ${reason}` : 'Could not create entry')
      } else {
        setError('Could not create entry')
      }
    }
  }

  return (
    <main>
      <header>
        <p className="eyebrow">FLIGHT LOG / 2026</p>
        <h1>Ilari&apos;s flight diaries</h1>
        <p className="intro">A clear record of the sky, one landing at a time.</p>
      </header>

      <section className="layout">
        <div>
          <h2>Recorded flights</h2>
          {entries.length === 0 && <p>No diary entries yet.</p>}
          <div className="entries">
            {entries.map((entry) => (
              <article className="entry" key={entry.id}>
                <div className="entry-date">{entry.date}</div>
                <div>
                  <h3>{entry.weather}</h3>
                  <p>Visibility: {entry.visibility}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <form className="entry-form" onSubmit={createEntry}>
          <h2>Add a flight</h2>
          <label>
            Date
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
          </label>
          <fieldset>
            <legend>Weather</legend>
            {weatherOptions.map((option) => (
              <label key={option}>
                <input
                  type="radio"
                  name="weather"
                  value={option}
                  checked={weather === option}
                  onChange={() => setWeather(option)}
                />
                {option}
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>Visibility</legend>
            {visibilityOptions.map((option) => (
              <label key={option}>
                <input
                  type="radio"
                  name="visibility"
                  value={option}
                  checked={visibility === option}
                  onChange={() => setVisibility(option)}
                />
                {option}
              </label>
            ))}
          </fieldset>
          <label>
            Comment
            <textarea value={comment} onChange={(event) => setComment(event.target.value)} />
          </label>
          <button type="submit">Save entry</button>
          {error && <p className="error" role="alert">{error}</p>}
        </form>
      </section>
    </main>
  )
}

export default App

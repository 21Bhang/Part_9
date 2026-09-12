export type Weather = 'sunny' | 'rainy' | 'cloudy' | 'windy' | 'stormy'

export type Visibility = 'great' | 'good' | 'ok' | 'poor'

export interface DiaryEntry {
  id: number
  date: string
  weather: Weather
  visibility: Visibility
}

export interface NewDiaryEntry {
  date: string
  weather: Weather
  visibility: Visibility
  comment: string
}

export const weatherOptions: Weather[] = ['sunny', 'rainy', 'cloudy', 'windy', 'stormy']
export const visibilityOptions: Visibility[] = ['great', 'good', 'ok', 'poor']

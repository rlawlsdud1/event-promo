import axios from 'axios'
import type { EventData, EntryFormData } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// 이벤트 정보 조회
export const getEventInfo = async (): Promise<EventData> => {
  try {
    const response = await api.get<EventData[]>('/event')
    // MockAPI는 배열을 반환하므로 첫 번째 항목을 가져옴
    return Array.isArray(response.data) ? response.data[0] : response.data
  } catch (error) {
    console.error('Failed to fetch event info:', error)
    throw error
  }
}

// 응모 데이터 제출
export const submitEntry = async (entryData: EntryFormData): Promise<EntryFormData> => {
  try {
    const response = await api.post<EntryFormData>('/entries', entryData)
    return response.data
  } catch (error) {
    console.error('Failed to submit entry:', error)
    throw error
  }
}

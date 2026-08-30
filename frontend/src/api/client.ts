// API Client Wrapper with JWT Support

const API_BASE = '/api/v1';

export class APIClientError extends Error {
  code: string;
  constructor(message: string, code: string = 'API_ERROR') {
    super(message);
    this.code = code;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('urjaa_access_token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    const errorMsg = data.error?.message || response.statusText || 'An unexpected error occurred';
    const errorCode = data.error?.code || `HTTP_${response.status}`;
    
    if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
      localStorage.removeItem('urjaa_access_token');
      localStorage.removeItem('urjaa_refresh_token');
      window.dispatchEvent(new Event('urjaa_logout'));
    }

    throw new APIClientError(errorMsg, errorCode);
  }

  return data.data as T;
}

export const api = {
  // Auth
  register: (body: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: any) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request<any>('/auth/me'),
  logout: () => request<any>('/auth/logout', { method: 'POST' }),

  // Profile & Onboarding
  completeOnboarding: (body: any) => request<any>('/onboarding', { method: 'POST', body: JSON.stringify(body) }),
  getProfile: () => request<any>('/profile'),
  updateProfile: (body: any) => request<any>('/profile', { method: 'PUT', body: JSON.stringify(body) }),
  exportData: () => request<any>('/profile/export'),
  deleteAccount: () => request<any>('/profile', { method: 'DELETE' }),

  // Settings
  getSettings: () => request<any>('/settings'),
  updateSettings: (body: any) => request<any>('/settings', { method: 'PUT', body: JSON.stringify(body) }),

  // Cycle
  getCurrentCycle: () => request<any>('/cycle/current'),
  getCyclePhase: (date?: string) => request<any>(`/cycle/phase${date ? `?date=${date}` : ''}`),
  getCycleHistory: () => request<any>('/cycle/history'),
  logPeriodStart: (body: { start_date: string; notes?: string }) =>
    request<any>('/cycle/period-start', { method: 'POST', body: JSON.stringify(body) }),
  logPeriodEnd: (body: { end_date: string }) =>
    request<any>('/cycle/period-end', { method: 'POST', body: JSON.stringify(body) }),

  // Checkins
  getTodayCheckin: () => request<any>('/checkins/today'),
  saveCheckin: (body: any) => request<any>('/checkins', { method: 'POST', body: JSON.stringify(body) }),
  getCheckinHistory: () => request<any>('/checkins/history'),

  // Nutrition
  getTodayNutrition: () => request<any>('/nutrition/today'),
  getNutritionProgress: () => request<any>('/nutrition/progress'),
  toggleMealComplete: (mealId: string) => request<any>(`/nutrition/meals/${mealId}/complete`, { method: 'POST' }),
  getSubstitutions: (mealItemId: string) => request<any>(`/nutrition/substitutions/${mealItemId}`),

  // Workouts
  getRecommendedWorkout: () => request<any>('/workouts/recommended'),
  getWorkouts: () => request<any>('/workouts'),
  getWorkout: (id: string) => request<any>(`/workouts/${id}`),
  startWorkout: (id: string) => request<any>(`/workouts/${id}/start`, { method: 'POST' }),
  completeSession: (sessionId: string, body: any) =>
    request<any>(`/workouts/sessions/${sessionId}/complete`, { method: 'POST', body: JSON.stringify(body) }),
  replaceExercise: (exerciseId: string, reason: string) =>
    request<any>(`/workouts/exercises/${exerciseId}/replace`, { method: 'POST', body: JSON.stringify({ reason }) }),

  // Calendar
  getMonthCalendar: (month?: string, filter: string = 'all') =>
    request<any>(`/calendar?month=${month || ''}&filter=${filter}`),
  getDateDetail: (date: string) => request<any>(`/calendar/${date}`),

  // Insights
  getCycleInsights: () => request<any>('/insights/cycle'),
  getWellnessInsights: () => request<any>('/insights/wellness'),
  getFitnessInsights: () => request<any>('/insights/fitness'),
  getNutritionInsights: () => request<any>('/insights/nutrition'),
};

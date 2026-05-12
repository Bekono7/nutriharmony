import axios from 'axios';

/** Origine du backend (médias, URLs absolues) */
export const API_ORIGIN = 'http://localhost:8000';

/**
 * Endpoints nutrition (préfixe /api/) :
 * GET/POST     /dishes/  |  GET/PATCH/DELETE /dishes/{id}/
 * GET/PATCH/DELETE /health-profile/
 * GET/POST     /meal-plans/  |  GET/PATCH/DELETE /meal-plans/{id}/
 */
const api = axios.create({
  baseURL: `${API_ORIGIN}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type HealthProfile = {
  id: number;
  age: number | null;
  gender: string;
  tribe: string;
  health_info: string;
  allergies: string;
  updated_at: string;
};

export type Dish = {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  calories: number | null;
  proteins: string | null;
  carbs: string | null;
  fat: string | null;
  badges: string[];
  image: string | null;
  image_url: string | null;
  created_by: number | null;
  created_at: string;
  updated_at: string;
};

export type MealPlanItem = {
  id: number;
  dish: number;
  dish_detail: Dish;
  sort_order: number;
};

export type MealPlan = {
  id: number;
  name: string;
  plan_date: string;
  items: MealPlanItem[];
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: number;
  dish: number;
  dish_detail: Dish;
  quantity: number;
  unit_price: string;
};

export type Order = {
  id: number;
  status: "pending" | "paid" | "cancelled";
  full_name: string;
  phone: string;
  address: string;
  note: string;
  items: OrderItem[];
  total: string;
  created_at: string;
  updated_at: string;
};

export type Comment = {
  id: number;
  dish: number;
  user_email: string;
  user_name: string;
  rating: number;
  text: string;
  created_at: string;
  updated_at: string;
};

export function resolveMediaUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${API_ORIGIN}${p}`;
}

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
type ErrorResponse = {
  config?: any;
  response?: {
    status: number;
    data: {
      detail?: string;
      [key: string]: any;
    };
  };
  message: string;
  _retry?: boolean;
};

api.interceptors.response.use(
  (response) => response,
  async (error: ErrorResponse) => {
    const originalRequest = error.config;
    
    // Si l'erreur est 401 et qu'on n'est pas en train de rafraîchir le token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_ORIGIN}/api/auth/token/refresh/`, {
            refresh: refreshToken
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          // Mettre à jour le header d'autorisation
          originalRequest.headers.Authorization = `Bearer ${access}`;
          
          // Renvoyer la requête originale avec le nouveau token
          return api(originalRequest);
        }
      } catch (error) {
        // En cas d'échec du rafraîchissement du token, déconnecter l'utilisateur
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export const auth = {
  register: (data: {
    email: string;
    username?: string;
    password: string;
    password2: string;
    first_name: string;
    last_name: string;
    additional_data?: Record<string, any>;
  }) => api.post('/auth/register/', data),
  
  login: (data: { email: string; password: string }) => 
    api.post('/auth/token/', { email: data.email, password: data.password }),
    
  getProfile: () => api.get('/auth/profile/'),
  
  refreshToken: (refresh: string) => 
    api.post('/auth/token/refresh/', { refresh }),
};

export const healthProfileApi = {
  get: () => api.get<HealthProfile>('/health-profile/'),
  patch: (data: Partial<HealthProfile>) =>
    api.patch<HealthProfile>('/health-profile/', data),
  delete: () => api.delete('/health-profile/'),
};

export const dishesApi = {
  list: (params?: {
    category?: string;
    search?: string;
    page?: number;
    page_size?: number;
    mine?: boolean;
  }) =>
    api.get<Paginated<Dish>>('/dishes/', {
      params: {
        ...params,
        mine: params?.mine ? 1 : undefined,
      },
    }),
  get: (id: number) => api.get<Dish>(`/dishes/${id}/`),
  create: (data: {
    name: string;
    description?: string;
    price?: number | string;
    category: string;
    calories?: number | null;
    proteins?: number | string | null;
    carbs?: number | string | null;
    fat?: number | string | null;
    badges?: string[];
  }) => api.post<Dish>('/dishes/', data),
  update: (id: number, data: Partial<Dish>) => api.patch<Dish>(`/dishes/${id}/`, data),
  delete: (id: number) => api.delete(`/dishes/${id}/`),
};

export type MealPlanItemInput = { dish: number; sort_order?: number };

export const mealPlansApi = {
  list: (params?: { page?: number }) =>
    api.get<Paginated<MealPlan>>('/meal-plans/', { params }),
  get: (id: number) => api.get<MealPlan>(`/meal-plans/${id}/`),
  create: (data: {
    name: string;
    plan_date: string;
    items?: MealPlanItemInput[];
  }) => api.post<MealPlan>('/meal-plans/', data),
  update: (
    id: number,
    data: Partial<{
      name: string;
      plan_date: string;
      items: MealPlanItemInput[];
    }>,
  ) => api.patch<MealPlan>(`/meal-plans/${id}/`, data),
  delete: (id: number) => api.delete(`/meal-plans/${id}/`),
};

export const ordersApi = {
  list: (params?: { page?: number }) =>
    api.get<Paginated<Order>>("/orders/", { params }),
  get: (id: number) => api.get<Order>(`/orders/${id}/`),
  create: (data: {
    full_name?: string;
    phone?: string;
    address?: string;
    note?: string;
    items: Array<{ dish: number; quantity: number }>;
  }) => api.post<Order>("/orders/", data),
  delete: (id: number) => api.delete(`/orders/${id}/`),
};

export const commentsApi = {
  list: (dishId: number) =>
    api.get<Paginated<Comment>>(`/dishes/${dishId}/comments/`),
  create: (dishId: number, data: { rating: number; text: string }) =>
    api.post<Comment>(`/dishes/${dishId}/comments/`, data),
};

export default api;

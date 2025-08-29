// API configuration and base setup
const API_BASE_URL = 'http://localhost:8001';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    isEmailVerified: boolean;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    isEmailVerified: boolean;
    emailVerificationToken?: string;
  };
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  passwordResetToken: string;
  password: string;
}

export interface CreateCaseRequest {
  currentClaim: string;
  prevClaimDOS: string;
  prevClaimCPT: string;
  denialText?: string;
  encounterText?: string;
  primaryPayer?: string;
  denialScreenShots?: File[];
  encounterScreenShots?: File[];
}

export interface CaseResponse {
  _id: string;
  currentClaim: string;
  prevClaimDOS: string;
  prevClaimCPT: string;
  denialScreenShots: string[];
  encounterScreenShots: string[];
  denialText?: string;
  encounterText?: string;
  primaryPayer?: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface AiAnalysisResponse {
  _id: string;
  case: string;
  user: string;
  analysis: {
    flows: string[];
    improvements: string[];
  };
  likes: string[];
  dislikes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LikeDislikeResponse {
  analysisId: string;
  liked?: boolean;
  disliked?: boolean;
  likesCount: number;
  dislikesCount: number;
}

export interface AnalysisDetailsResponse {
  analysis: AiAnalysisResponse;
  userInteraction: {
    hasLiked: boolean;
    hasDisliked: boolean;
    likesCount: number;
    dislikesCount: number;
  };
}

export interface PlanRequest {
  title: string;
  description: string;
  type: string;
  amount: number;
  currency: string;
  duration?: string;
}

export interface PlanResponse {
  product: {
    id: string;
    name: string;
    description: string;
    metadata: Record<string, string>;
    active: boolean;
  };
  price: {
    id: string;
    unit_amount: number;
    currency: string;
    recurring: {
      interval: string;
    };
  };
}

export interface PaymentRequest {
  productId: string;
}

export interface PaymentResponse {
  url: string;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isFreeTrialUser: boolean;
  noOfCasesLeft: number;
  planType?: string;
  planId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsersListResponse {
  totalCount: { count: number };
  data: UserProfile[];
}

export interface PlansListResponse {
  products: {
    data: Record<string, unknown>[];
  };
  prices: {
    data: Record<string, unknown>[];
  };
}

export interface CasesListResponse {
  totalCount: number;
  data: CaseResponse[];
  page: number;
  limit: number;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const defaultHeaders: Record<string, string> = {};

      // Don't set Content-Type for FormData requests
      if (!(options.body instanceof FormData)) {
        defaultHeaders['Content-Type'] = 'application/json';
      }

      // Add auth token if available
      const token = localStorage.getItem('auth_token');
      if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP error! status: ${response.status}`,
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      console.error('Request error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.makeRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    return this.makeRequest<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async verifyEmail(verificationData: VerifyEmailRequest): Promise<ApiResponse<{ message: string }>> {
    return this.makeRequest<{ message: string }>('/auth/verifyEmail', {
      method: 'POST',
      body: JSON.stringify(verificationData),
    });
  }

  async forgotPassword(emailData: ForgotPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return this.makeRequest<{ message: string }>('/auth/forgotPassword', {
      method: 'POST',
      body: JSON.stringify(emailData),
    });
  }

  async resetPassword(resetData: ResetPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return this.makeRequest<{ message: string }>('/auth/resetPassword', {
      method: 'PUT',
      body: JSON.stringify(resetData),
    });
  }

  async getCurrentUser(): Promise<ApiResponse<UserProfile>> {
    return this.makeRequest<UserProfile>('/auth/me', {
      method: 'GET',
    });
  }

  // Case endpoints
  async createCase(caseData: CreateCaseRequest): Promise<ApiResponse<{user: CaseResponse, newAiAnalysis: AiAnalysisResponse}>> {
    const formData = new FormData();
    
    // Add text fields
    formData.append('currentClaim', caseData.currentClaim);
    formData.append('prevClaimDOS', caseData.prevClaimDOS);
    formData.append('prevClaimCPT', caseData.prevClaimCPT);
    
    if (caseData.denialText) formData.append('denialText', caseData.denialText);
    if (caseData.encounterText) formData.append('encounterText', caseData.encounterText);
    if (caseData.primaryPayer) formData.append('primaryPayer', caseData.primaryPayer);
    
    // Add file uploads
    if (caseData.denialScreenShots) {
      caseData.denialScreenShots.forEach((file) => {
        formData.append('denialScreenShots', file);
      });
    }
    
    if (caseData.encounterScreenShots) {
      caseData.encounterScreenShots.forEach((file) => {
        formData.append('encounterScreenShots', file);
      });
    }

    return this.makeRequest<{user: CaseResponse, newAiAnalysis: AiAnalysisResponse}>('/case', {
      method: 'POST',
      body: formData,
    });
  }

  async getMyCases(page: number = 1, limit: number = 10): Promise<ApiResponse<CasesListResponse>> {
    return this.makeRequest<CasesListResponse>(`/case/getMine?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
  }

  async getAllCases(page: number = 1, limit: number = 10): Promise<ApiResponse<CasesListResponse>> {
    return this.makeRequest<CasesListResponse>(`/case/getAll?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
  }

  // Like an AI analysis
  async likeAnalysis(analysisId: string): Promise<ApiResponse<LikeDislikeResponse>> {
    return this.makeRequest<LikeDislikeResponse>(`/ai-analysis/${analysisId}/like`, {
      method: 'POST'
    });
  }

  // Dislike an AI analysis
  async dislikeAnalysis(analysisId: string): Promise<ApiResponse<LikeDislikeResponse>> {
    return this.makeRequest<LikeDislikeResponse>(`/ai-analysis/${analysisId}/dislike`, {
      method: 'POST'
    });
  }

  // Get analysis details with like/dislike status
  async getAnalysisDetails(analysisId: string): Promise<ApiResponse<AnalysisDetailsResponse>> {
    return this.makeRequest<AnalysisDetailsResponse>(`/ai-analysis/${analysisId}`, {
      method: 'GET'
    });
  }

  // Utility methods
  setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  removeAuthToken(): void {
    localStorage.removeItem('auth_token');
  }

  getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Plan endpoints (Admin only)
  async createPlan(planData: PlanRequest): Promise<ApiResponse<PlanResponse>> {
    return this.makeRequest<PlanResponse>('/plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(planData),
    });
  }

  async getAllPlans(): Promise<ApiResponse<PlansListResponse>> {
    return this.makeRequest<PlansListResponse>('/plan', {
      method: 'GET',
    });
  }

  async getSinglePlan(planId: string): Promise<ApiResponse<PlanResponse>> {
    return this.makeRequest<PlanResponse>(`/plan/${planId}`, {
      method: 'GET',
    });
  }

  async updatePlan(planId: string, planData: Partial<PlanRequest>): Promise<ApiResponse<PlanResponse>> {
    return this.makeRequest<PlanResponse>(`/plan/${planId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(planData),
    });
  }

  // Payment endpoints
  async createPaymentSession(paymentData: PaymentRequest): Promise<ApiResponse<PaymentResponse>> {
    return this.makeRequest<PaymentResponse>('/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
  }

  // Admin endpoints
  async getAllUsers(page: number = 1, limit: number = 10): Promise<ApiResponse<UsersListResponse>> {
    return this.makeRequest<UsersListResponse>(`/user?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
  }
}

export const apiService = new ApiService(API_BASE_URL);

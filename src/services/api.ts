// API configuration and base setup
const API_BASE_URL = 'http://localhost:8001';
// const API_BASE_URL = 'https://deniel-assistance-be.onrender.com';
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

export interface UpdateProfileRequest {
  name: string;
  email: string;
}

export interface CreateCaseRequest {
  currentClaim: string;
  previousClaimDOS?: string;
  previousClaimCPT?: string;
  primaryPayer: string;
  denialText?: string;
  encounterText?: string;
  diagnosisText?: string;
  denialScreenShots?: File[];
  encounterScreenShots?: File[];
  diagnosisScreenShots?: File[];
}

export interface CaseResponse {
  _id: string;
  currentClaim: string;
  previousClaimDOS?: string;
  previousClaimCPT?: string;
  primaryPayer: string;
  denialScreenShots: string[];
  encounterScreenShots: string[];
  diagnosisScreenShots?: string[];
  denialText?: string;
  encounterText?: string;
  diagnosisText?: string;
  user: string | {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TransactionResponse {
  _id: string;
  stripeSessionId?: string;
  amountTotal?: number;
  currency?: string;
  paymentStatus?: string;
  subscriptionId?: string;
  type?: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TransactionsListResponse {
  data: TransactionResponse[];
  totalCount: number;
  page: number;
  limit: number;
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

export interface AiAnalysisWithDetailsResponse {
  _id: string;
  case: {
    _id: string;
    currentClaim: string;
    previousClaimDOS?: string;
    previousClaimCPT?: string;
    primaryPayer: string;
    denialText?: string;
    encounterText?: string;
    diagnosisText?: string;
    createdAt: string;
  };
  user: {
    _id: string;
    name: string;
    email: string;
  };
  analysis: {
    flows?: string[];
    improvements?: string[];
    [key: string]: any;
  };
  likes: string[];
  dislikes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AiAnalysesListResponse {
  data: AiAnalysisWithDetailsResponse[];
  totalCount: number;
  page: number;
  limit: number;
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
  prices: {
    data: Array<{
      id: string;
      unit_amount: number;
      currency: string;
      recurring: {
        interval: string;
      };
      product: {
        id: string;
        name: string;
        description: string;
        active: boolean;
        metadata?: Record<string, string>;
      };
    }>;
  };
}

export interface CasesListResponse {
  totalCount: number;
  data: CaseResponse[];
  page: number;
  limit: number;
}

export interface AdminStatsResponse {
  stats: {
    totalUsers: number;
    totalCases: number;
    totalFeedbacks: number;
    totalTransactions: number;
    feedbackBreakdown: {
      likes: number;
      dislikes: number;
    };
  };
  recentUsers: {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
    planType?: string;
    noOfCasesLeft: number;
    isFreeTrialUser: boolean;
  }[];
  recentTransactions: TransactionResponse[];
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
      
      // Add debugging for admin stats endpoint
      if (endpoint.includes('admin-stats')) {
        console.log('Admin stats response status:', response.status);
        console.log('Admin stats response data:', data);
      }

      if (!response.ok) {
        console.error('API Error:', {
          url,
          status: response.status,
          data
        });
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

   async schedule(userData: any): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('/schedule', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
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

  async resendToken(userData: RegisterRequest): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('/auth/resendToken', {
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

  async manageSubscription(): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('/payment/manage-subscription', {
      method: 'GET',
    });
  }

  async updateProfile(profileData: UpdateProfileRequest): Promise<ApiResponse<UserProfile>> {
    return this.makeRequest<UserProfile>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Case endpoints
  async createCase(caseData: any): Promise<ApiResponse<{user: CaseResponse, newAiAnalysis: AiAnalysisResponse}>> {
    console.log('=== SENDING CASE DATA TO BACKEND ===');
    console.log('Case data:', caseData);
    console.log('Denial images count:', caseData.denialImages?.length || 0);
    console.log('Encounter images count:', caseData.encounterImages?.length || 0);
    console.log('Diagnosis images count:', caseData.diagnosisImages?.length || 0);

    return this.makeRequest<{user: CaseResponse, newAiAnalysis: AiAnalysisResponse}>('/case', {
      method: 'POST',
      body: JSON.stringify(caseData),
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

  async getAllTransactions(page: number = 1, limit: number = 10, search?: string): Promise<ApiResponse<TransactionsListResponse>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search && search.trim()) {
      params.append('search', search.trim());
    }
    
    return this.makeRequest<TransactionsListResponse>(`/case/transactions?${params.toString()}`, {
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

  // Get all AI analyses for admin
  async getAllAiAnalyses(page: number = 1, limit: number = 10): Promise<ApiResponse<AiAnalysesListResponse>> {
    return this.makeRequest<AiAnalysesListResponse>(`/ai-analysis/getAll?page=${page}&limit=${limit}`, {
      method: 'GET',
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

  async deletePlan(planId: string): Promise<ApiResponse<{ message: string }>> {
    return this.makeRequest<{ message: string }>(`/plan/${planId}`, {
      method: 'DELETE',
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
  async getAllUsers(page: number = 1, limit: number = 10, search?: string): Promise<ApiResponse<UsersListResponse>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search && search.trim()) {
      params.append('search', search.trim());
    }
    
    return this.makeRequest<UsersListResponse>(`/user?${params.toString()}`, {
      method: 'GET',
    });
  }

  async getAdminStats(): Promise<ApiResponse<AdminStatsResponse>> {
    console.log('Making admin stats request to:', `${this.baseURL}/user/admin-stats`);
    const token = this.getAuthToken();
    console.log('Using auth token:', token ? 'Present' : 'Missing');
    
    return this.makeRequest<AdminStatsResponse>('/user/admin-stats', {
      method: 'GET',
    });
  }

  async testDbContent(): Promise<ApiResponse<{
    users: UserProfile[];
    cases: CaseResponse[];
    analysis: unknown[];
  }>> {
    console.log('Testing database content...');
    return this.makeRequest<{
      users: UserProfile[];
      cases: CaseResponse[];
      analysis: unknown[];
    }>('/user/test-db', {
      method: 'GET',
    });
  }
}

export const apiService = new ApiService(API_BASE_URL);

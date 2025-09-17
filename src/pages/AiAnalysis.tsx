import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Brain, 
  CheckCircle, 
  FileText, 
  Calendar,
  User,
  Sparkles,
  Target,
  ArrowRight,
  Download,
  Share,
  ThumbsUp,
  ThumbsDown,
  RefreshCw
} from 'lucide-react';

interface CaseData {
  _id: string;
  currentClaim: string;
  previousClaimDOS?: string;
  previousClaimCPT?: string;
  denialText?: string;
  encounterText?: string;
  primaryPayer?: string;
  denialScreenShots: string[];
  encounterScreenShots: string[];
  createdAt: string;
  user: string;
}

interface AiAnalysisData {
  _id: string;
  case: string;
  user: string;
  analysis: {
    // Legacy fields for backward compatibility
    flows?: string[] | Record<string, unknown>;
    improvements?: string[] | Record<string, unknown>;
    
    // New Gemini output format
    report_title?: string;
    claim_number?: string;
    analysis_time?: string;
    confidence?: {
      level?: string;
      justification?: string;
    };
    recommended_pathway?: {
      type?: string;
      instruction?: string;
    };
    denial_summary?: {
      reason_code?: string;
      remark_code?: string;
    };
    root_cause_analysis?: {
      issue_identified?: string;
      cms_guidelines?: string;
    };
    staff_instructions?: {
      instruction_type?: string;
      detail?: string;
    };
    provider_education?: {
      future_prevention?: string;
    };
    
    // Fallback for any other fields
      [key: string]: unknown;
  };
  likes: string[];
  dislikes: string[];
  createdAt: string;
  updatedAt: string;
}

interface LocationState {
  case: CaseData;
  newAiAnalysis: AiAnalysisData;
}

const AiAnalysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [dislikeLoading, setDislikeLoading] = useState(false);
  
  // Get data from navigation state
  const state = location.state as LocationState;
  const caseData = state?.case;
  const analysisData = state?.newAiAnalysis;
  
  // Like/Dislike state
  const [userInteraction, setUserInteraction] = useState({
    hasLiked: false,
    hasDisliked: false,
    likesCount: analysisData?.likes?.length || 0,
    dislikesCount: analysisData?.dislikes?.length || 0
  });

  // If no data is provided, redirect back
  useEffect(() => {
    if (!caseData || !analysisData) {
      toast.error('No analysis data found. Redirecting to dashboard...');
      navigate('/dashboard');
      return;
    }
    
    // Initialize user interaction state based on current user
    if (user?._id && analysisData) {
      setUserInteraction({
        hasLiked: analysisData.likes?.includes(user._id) || false,
        hasDisliked: analysisData.dislikes?.includes(user._id) || false,
        likesCount: analysisData.likes?.length || 0,
        dislikesCount: analysisData.dislikes?.length || 0
      });
    }
  }, [caseData, analysisData, navigate, user?._id]);

  if (!caseData || !analysisData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleDownloadReport = () => {
    toast.success('Report download feature coming soon!');
  };

  const handleShareAnalysis = () => {
    toast.success('Share feature coming soon!');
  };

  const handleLike = async () => {
    if (!analysisData?._id) return;
    
    setLikeLoading(true);
    try {
      const response = await apiService.likeAnalysis(analysisData._id);
      if (response.success && response.data) {
        setUserInteraction({
          hasLiked: response.data.liked || false,
          hasDisliked: false, // Remove dislike when liking
          likesCount: response.data.likesCount,
          dislikesCount: response.data.dislikesCount
        });
        toast.success(response.data.liked ? 'Analysis liked!' : 'Like removed');
      }
    } catch (error) {
      toast.error('Failed to like analysis');
      console.error('Like error:', error);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDislike = async () => {
    if (!analysisData?._id) return;
    
    setDislikeLoading(true);
    try {
      const response = await apiService.dislikeAnalysis(analysisData._id);
      if (response.success && response.data) {
        setUserInteraction({
          hasLiked: false, // Remove like when disliking
          hasDisliked: response.data.disliked || false,
          likesCount: response.data.likesCount,
          dislikesCount: response.data.dislikesCount
        });
        toast.success(response.data.disliked ? 'Analysis disliked!' : 'Dislike removed');
      }
    } catch (error) {
      toast.error('Failed to dislike analysis');
      console.error('Dislike error:', error);
    } finally {
      setDislikeLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to convert analysis data to arrays
  const getRecommendationsArray = () => {
    if (!analysisData?.analysis) return [];
    
    const { improvements } = analysisData.analysis;
    
    // Convert improvements to array
    let recommendationsArray: string[] = [];
    if (Array.isArray(improvements)) {
      recommendationsArray = improvements.map(item => {
        // Handle nested objects in array
        if (typeof item === 'object' && item !== null) {
          const obj = item as Record<string, any>;
          if ('issue' in obj && 'suggestion' in obj && obj.issue && obj.suggestion) {
            return `Issue: ${obj.issue} | Suggestion: ${obj.suggestion}`;
          } else if ('clarity' in obj && obj.clarity) {
            return String(obj.clarity);
          } else if ('actionItems' in obj && obj.actionItems) {
            return String(obj.actionItems);
          } else if ('documentation' in obj && obj.documentation) {
            return String(obj.documentation);
          }
          // Generic object handling
          return Object.entries(obj).map(([key, value]) => `${key}: ${String(value)}`).join(' | ');
        }
        return String(item);
      });
    } else if (typeof improvements === 'object' && improvements !== null) {
      recommendationsArray = Object.entries(improvements).map(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          return `${key}: ${JSON.stringify(value)}`;
        }
        return `${key}: ${String(value)}`;
      });
    }
    
    return recommendationsArray;
  };

  const recommendationsArray = getRecommendationsArray();
  
  // Debug logging
  console.log('Analysis Data:', analysisData);
  console.log('Recommendations Array:', recommendationsArray);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-subtle"></div>
      
      {/* Decorative Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/15 to-primary/8 blur-3xl transform translate-x-32 -translate-y-32 animate-float blob-1"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-primary/12 to-primary/6 blur-2xl transform -translate-x-24 translate-y-24 animate-float delay-1000 blob-2"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-48 bg-primary/10 rounded-full blur-xl transform rotate-45 animate-pulse delay-500"></div>
        
        {/* Consultation pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="consultation-pattern"></div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-primary/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="text-primary hover:text-primary-dark hover:bg-primary/5 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                Back to Dashboard
              </Button>
              <div className="h-6 border-l border-primary/20" />
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-primary/10 rounded-lg">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
                <h1 className="text-xl font-bold text-foreground">AI Analysis Results</h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareAnalysis}
                className="border-primary/20 text-primary hover:bg-primary/5"
              >
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadReport}
                className="border-primary/20 text-primary hover:bg-primary/5"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* Success Banner */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-primary-50 to-primary/5 border-primary-200 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary-100 rounded-full">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-primary-900">Case Analysis Complete!</h2>
                  <p className="text-primary-700 mt-1">
                    Your case has been successfully analyzed by our AI system. Review the insights below to improve your appeal strategy.
                  </p>
                </div>
                
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Case Details */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Case Summary */}
            <Card className="shadow-elegant bg-white/95 backdrop-blur-sm border border-primary/10 hover:border-primary/20 transition-all duration-500">
              <CardHeader className="bg-primary text-primary-foreground">
                <CardTitle className="flex items-center space-x-2">
                  <div className="p-1 bg-white/20 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span>Case Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Current Claim</label>
                    <p className="text-foreground font-medium">{caseData.currentClaim}</p>
                  </div>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Previous Claim DOS</label>
                    <p className="text-foreground">{caseData.previousClaimDOS || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Previous Claim CPT</label>
                    <p className="text-foreground">{caseData.previousClaimCPT || 'Not provided'}</p>
                  </div>
                  {caseData.primaryPayer && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Primary Payer</label>
                      <p className="text-foreground">{caseData.primaryPayer}</p>
                    </div>
                  )}
                </div>
                
                {/* Creation Info */}
                <Separator />
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Created {formatDate(caseData.createdAt)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Files Uploaded */}
            {(caseData.denialScreenShots.length > 0 || caseData.encounterScreenShots.length > 0) && (
              <Card className="shadow-elegant bg-white/95 backdrop-blur-sm border border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-foreground">
                    <FileText className="w-5 h-5 text-primary" />
                    <span>Uploaded Files</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {caseData.denialScreenShots.length > 0 && (
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Denial Screenshots</h4>
                      <Badge variant="secondary">{caseData.denialScreenShots.length} files</Badge>
                    </div>
                  )}
                  {caseData.encounterScreenShots.length > 0 && (
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Encounter Screenshots</h4>
                      <Badge variant="secondary">{caseData.encounterScreenShots.length} files</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - AI Analysis */}
          <div className="lg:col-span-2 space-y-6">
            
                         {/* AI Report Header - Similar to US Healthcare App */}
            <div className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground rounded-2xl p-6 mb-6 shadow-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {analysisData.analysis.report_title || 'AI Denial Analysis Report'}
                    </h2>
                    <p className="text-white/90 mt-1">
                      Claim #: {analysisData.analysis.claim_number || 'N/A'} | Analysis completed in {analysisData.analysis.analysis_time || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="bg-white/25 border-2 border-white/50 rounded-full px-4 py-2 flex items-center space-x-2 backdrop-blur-sm">
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span className="text-white font-semibold">
                    {analysisData.analysis.confidence?.level || 'Medium'} Confidence
                  </span>
                </div>
              </div>
              
              {/* Like/Dislike Section */}
              <div className="mt-6 pt-4 border-t border-white/20">
                <div className="flex items-center justify-between">
                  <div className="text-white/80 text-sm">
                    Rate this AI analysis to help us improve
                  </div>
                  <div className="flex items-center space-x-4">
                    {/* Like Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLike}
                        disabled={likeLoading}
                        className={`flex items-center space-x-2 transition-all duration-300 bg-white/20 border-white/50 text-white hover:bg-white/30 ${
                          userInteraction.hasLiked ? 'bg-primary hover:bg-primary-dark border-primary' : ''
                        }`}
                      >
                      {likeLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                      ) : (
                        <ThumbsUp className={`w-4 h-4 ${userInteraction.hasLiked ? 'fill-current' : ''}`} />
                      )}
                      <span>{userInteraction.likesCount}</span>
                    </Button>
                    
                    {/* Dislike Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDislike}
                      disabled={dislikeLoading}
                      className={`flex items-center space-x-2 transition-all duration-300 bg-white/20 border-white/50 text-white hover:bg-white/30 ${
                        userInteraction.hasDisliked ? 'bg-red-500 hover:bg-red-600 border-red-500' : ''
                      }`}
                    >
                      {dislikeLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                      ) : (
                        <ThumbsDown className={`w-4 h-4 ${userInteraction.hasDisliked ? 'fill-current' : ''}`} />
                      )}
                      <span>{userInteraction.dislikesCount}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            


            {/* Recommended Pathway - Similar to US Healthcare App */}
            {analysisData.analysis.recommended_pathway && (
              <div className="analysis-section bg-white rounded-2xl p-6 mb-6 shadow-lg border-l-4 border-primary bg-gradient-to-r from-primary-50 to-white">
                <div className="section-header">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Target className="w-6 h-6 text-primary section-icon" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Recommended Pathway</h3>
                </div>
                <div className="space-y-4">
                  {analysisData.analysis.recommended_pathway.type && (
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2 text-primary font-semibold text-lg">
                        <CheckCircle className="w-6 h-6" />
                        <span>{analysisData.analysis.recommended_pathway.type}</span>
                      </div>
                    </div>
                  )}
                  {analysisData.analysis.recommended_pathway.instruction && (
                    <div className="p-4 bg-primary-50 rounded-xl border-l-4 border-primary">
                      <p className="text-gray-800 leading-relaxed font-medium highlight-important">
                        {analysisData.analysis.recommended_pathway.instruction}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Denial Summary - Similar to US Healthcare App */}
            {analysisData.analysis.denial_summary && (
              <div className="analysis-section bg-white rounded-2xl p-6 mb-6 shadow-lg border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-white">
                <div className="section-header">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <FileText className="w-6 h-6 text-red-600 section-icon" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Denial Summary</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Reason Code</div>
                    <div className="text-lg font-bold text-gray-900 code-display">
                      {analysisData.analysis.denial_summary.reason_code || 'N/A'}
                    </div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Remark Code</div>
                    <div className="text-lg font-bold text-gray-900 code-display">
                      {analysisData.analysis.denial_summary.remark_code || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Root Cause Analysis - Similar to US Healthcare App */}
            {analysisData.analysis.root_cause_analysis && (
              <div className="analysis-section bg-white rounded-2xl p-6 mb-6 shadow-lg border-l-4 border-orange-500 bg-gradient-to-r from-orange-50 to-white">
                <div className="section-header">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Target className="w-6 h-6 text-orange-600 section-icon" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Root Cause Analysis</h3>
                </div>
                <div className="space-y-4">
                  {analysisData.analysis.root_cause_analysis.issue_identified && (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                      <div className="text-sm font-semibold text-orange-800 mb-2">Issue Identified:</div>
                      <div className="text-orange-900 font-medium leading-relaxed highlight-important">
                        {analysisData.analysis.root_cause_analysis.issue_identified}
                      </div>
                    </div>
                  )}
                  {analysisData.analysis.root_cause_analysis.cms_guidelines && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <div className="text-sm font-semibold text-yellow-800 mb-2">CMS Guidelines:</div>
                      <div className="text-yellow-900 font-medium leading-relaxed highlight-important">
                        {analysisData.analysis.root_cause_analysis.cms_guidelines}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Staff Instructions - Similar to US Healthcare App */}
            {analysisData.analysis.staff_instructions && (
              <div className="analysis-section bg-white rounded-2xl p-6 mb-6 shadow-lg border-l-4 border-purple-500 bg-gradient-to-r from-purple-50 to-white">
                <div className="section-header">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <User className="w-6 h-6 text-purple-600 section-icon" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Staff Instructions</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="text-sm font-semibold text-gray-600 mb-2">
                      1 {analysisData.analysis.staff_instructions.instruction_type || 'Submit Corrected Claim'}:
                    </div>
                    <div className="text-gray-800 font-medium leading-relaxed highlight-important">
                      {analysisData.analysis.staff_instructions.detail || 'No specific instructions provided'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Provider Education - Similar to US Healthcare App */}
            {analysisData.analysis.provider_education && (
              <div className="analysis-section bg-white rounded-2xl p-6 mb-6 shadow-lg border-l-4 border-indigo-500 bg-gradient-to-r from-indigo-50 to-white">
                <div className="section-header">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Sparkles className="w-6 h-6 text-indigo-600 section-icon" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Provider Education</h3>
                </div>
                <div className="space-y-4">
                  {analysisData.analysis.provider_education.future_prevention && (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                      <div className="text-sm font-semibold text-indigo-800 mb-2">Future Prevention:</div>
                      <div className="text-indigo-900 font-medium leading-relaxed highlight-important">
                        {analysisData.analysis.provider_education.future_prevention}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Additional Analysis Fields */}
            {(() => {
              const knownFields = [
                'report_title', 'claim_number', 'analysis_time', 'confidence', 
                'recommended_pathway', 'denial_summary', 'root_cause_analysis', 
                'staff_instructions', 'provider_education', 'flows', 'improvements'
              ];
              const additionalFields = Object.entries(analysisData.analysis)
                .filter(([key, value]) => !knownFields.includes(key) && value !== null && value !== undefined);
              
              return additionalFields.length > 0 ? (
                <Card className="shadow-elegant bg-white/95 backdrop-blur-sm border border-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-foreground">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <FileText className="w-5 h-5 text-gray-600" />
                      </div>
                      <span>Additional Analysis Data</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {additionalFields.map(([key, value]) => (
                        <div key={key} className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                          <label className="text-sm font-medium text-muted-foreground capitalize">
                            {key.replace(/_/g, ' ')}
                          </label>
                          <div className="mt-2">
                            {typeof value === 'object' ? (
                              <pre className="text-sm text-foreground whitespace-pre-wrap">
                                {JSON.stringify(value, null, 2)}
                              </pre>
                            ) : (
                              <p className="text-foreground">{String(value)}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : null;
            })()}

            {/* Legacy Improvements (fallback) */}
            {recommendationsArray.length > 0 && !analysisData.analysis.recommended_pathway && (
            <Card className="shadow-elegant bg-white/95 backdrop-blur-sm border border-primary/10 hover:border-primary/20 transition-all duration-500">
              <CardHeader className="bg-gradient-to-r from-primary-50 to-primary/5 border-b border-primary/10">
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                                     <span>AI Recommendations</span>
                   <Badge variant="secondary" className="ml-auto">
                     {recommendationsArray.length} recommendations
                   </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                  <div className="space-y-4">
                    {recommendationsArray.map((improvement, index) => (
                      <div key={index} className="flex items-start space-x-3 p-4 bg-primary-50/50 rounded-xl border border-primary-100">
                        <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-primary text-sm font-medium mt-0.5">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-foreground leading-relaxed">{improvement}</p>
                        </div>
                      </div>
                    ))}
                  </div>
              </CardContent>
            </Card>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-primary hover:bg-primary-dark text-primary-foreground"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/appeal')}
                className="flex-1 border-primary/20 text-primary hover:bg-primary/5"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Create New Case
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAnalysis;

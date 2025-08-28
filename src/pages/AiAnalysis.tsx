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
  prevClaimDOS: string;
  prevClaimCPT: string;
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
    flows: string[] | Record<string, unknown>;
    improvements: string[] | Record<string, unknown> | Array<{
      issue?: string;
      suggestion?: string;
      clarity?: string;
      actionItems?: string;
      documentation?: string;
      [key: string]: unknown;
    }>;
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
          if (item.issue && item.suggestion) {
            return `Issue: ${item.issue} | Suggestion: ${item.suggestion}`;
          } else if (item.clarity) {
            return String(item.clarity);
          } else if (item.actionItems) {
            return String(item.actionItems);
          } else if (item.documentation) {
            return String(item.documentation);
          }
          // Generic object handling
          return Object.entries(item).map(([key, value]) => `${key}: ${String(value)}`).join(' | ');
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
          <Card className="bg-gradient-to-r from-green-50 to-primary/5 border-green-200 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-green-800">Case Analysis Complete!</h2>
                  <p className="text-green-700 mt-1">
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
                    <p className="text-foreground">{caseData.prevClaimDOS}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Previous Claim CPT</label>
                    <p className="text-foreground">{caseData.prevClaimCPT}</p>
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
            
                         {/* AI Analysis Header */}
             <Card className="shadow-elegant bg-white/95 backdrop-blur-sm border border-primary/10">
               <CardContent className="p-6">
                 <div className="flex items-center space-x-4">
                   <div className="p-3 bg-primary/10 rounded-xl">
                     <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                   </div>
                   <div className="flex-1">
                     <h2 className="text-2xl font-bold text-foreground">AI-Powered Analysis</h2>
                     <p className="text-muted-foreground mt-1">
                       Comprehensive insights generated by advanced AI to optimize your appeal strategy
                     </p>
                   </div>
                   <div className="text-right">
                     <div className="text-sm text-muted-foreground">Generated</div>
                     <div className="text-sm font-medium text-foreground">{formatDate(analysisData.createdAt)}</div>
                   </div>
                 </div>
                 
                 {/* Like/Dislike Section */}
                 <div className="mt-6 pt-4 border-t border-primary/10">
                   <div className="flex items-center justify-between">
                     <div className="text-sm text-muted-foreground">
                       Rate this AI analysis to help us improve
                     </div>
                     <div className="flex items-center space-x-4">
                       {/* Like Button */}
                       <Button
                         variant={userInteraction.hasLiked ? "default" : "outline"}
                         size="sm"
                         onClick={handleLike}
                         disabled={likeLoading}
                         className={`flex items-center space-x-2 transition-all duration-300 ${
                           userInteraction.hasLiked 
                             ? 'bg-green-500 hover:bg-green-600 text-white border-green-500' 
                             : 'border-primary/20 text-primary hover:bg-green-50 hover:border-green-300 hover:text-green-600'
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
                         variant={userInteraction.hasDisliked ? "destructive" : "outline"}
                         size="sm"
                         onClick={handleDislike}
                         disabled={dislikeLoading}
                         className={`flex items-center space-x-2 transition-all duration-300 ${
                           userInteraction.hasDisliked 
                             ? 'bg-red-500 hover:bg-red-600 text-white border-red-500' 
                             : 'border-primary/20 text-primary hover:bg-red-50 hover:border-red-300 hover:text-red-600'
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
               </CardContent>
             </Card>

            

            {/* Improvements */}
            <Card className="shadow-elegant bg-white/95 backdrop-blur-sm border border-primary/10 hover:border-primary/20 transition-all duration-500">
              <CardHeader className="bg-gradient-to-r from-green-50 to-primary/5 border-b border-primary/10">
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Target className="w-5 h-5 text-green-600" />
                  </div>
                                     <span>AI Recommendations</span>
                   <Badge variant="secondary" className="ml-auto">
                     {recommendationsArray.length} recommendations
                   </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {recommendationsArray.length > 0 ? (
                  <div className="space-y-4">
                    {recommendationsArray.map((improvement, index) => (
                      <div key={index} className="flex items-start space-x-3 p-4 bg-green-50/50 rounded-xl border border-green-100">
                        <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm font-medium mt-0.5">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-foreground leading-relaxed">{improvement}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                                 ) : (
                   <div className="text-center py-8 text-muted-foreground">
                     <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                     <p>No recommendations generated for this case</p>
                   </div>
                 )}
              </CardContent>
            </Card>

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

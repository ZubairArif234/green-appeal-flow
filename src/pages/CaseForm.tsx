import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, CreateCaseRequest } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Upload, 
  FileText, 
  Image, 
  X, 
  AlertCircle, 
  ArrowLeft,
  Calendar,
  CreditCard,
  Building2,
  FileImage,
  File
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FileWithPreview extends File {
  preview?: string;
}

const CaseForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<CreateCaseRequest>({
    currentClaim: '',
    prevClaimDOS: '',
    prevClaimCPT: '',
    denialText: '',
    encounterText: '',
    primaryPayer: '',
    denialScreenShots: [],
    encounterScreenShots: []
  });
  
  const [denialFiles, setDenialFiles] = useState<FileWithPreview[]>([]);
  const [encounterFiles, setEncounterFiles] = useState<FileWithPreview[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle text input changes
  const handleInputChange = (field: keyof CreateCaseRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle file upload
  const handleFileUpload = (
    files: FileList | null, 
    type: 'denial' | 'encounter'
  ) => {
    if (!files) return;
    
    const maxFiles = 5;
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf'
    ];
    
    const currentFiles = type === 'denial' ? denialFiles : encounterFiles;
    
    if (currentFiles.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed per section`);
      return;
    }
    
    const validFiles: FileWithPreview[] = [];
    
    Array.from(files).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid file format. Please upload images or PDFs only.`);
        return;
      }
      
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Maximum size is 10MB`);
        return;
      }
      
      const fileWithPreview = file as FileWithPreview;
      
      // Create preview only for images, not PDFs
      if (file.type.startsWith('image/')) {
        fileWithPreview.preview = URL.createObjectURL(file);
      }
      
      validFiles.push(fileWithPreview);
    });
    
    if (type === 'denial') {
      setDenialFiles(prev => [...prev, ...validFiles]);
      setFormData(prev => ({ 
        ...prev, 
        denialScreenShots: [...(prev.denialScreenShots || []), ...validFiles] 
      }));
    } else {
      setEncounterFiles(prev => [...prev, ...validFiles]);
      setFormData(prev => ({ 
        ...prev, 
        encounterScreenShots: [...(prev.encounterScreenShots || []), ...validFiles] 
      }));
    }
  };

  // Remove file
  const removeFile = (index: number, type: 'denial' | 'encounter') => {
    if (type === 'denial') {
      const newFiles = denialFiles.filter((_, i) => i !== index);
      // Revoke object URL to prevent memory leaks
      if (denialFiles[index].preview) {
        URL.revokeObjectURL(denialFiles[index].preview!);
      }
      setDenialFiles(newFiles);
      setFormData(prev => ({ ...prev, denialScreenShots: newFiles }));
    } else {
      const newFiles = encounterFiles.filter((_, i) => i !== index);
      if (encounterFiles[index].preview) {
        URL.revokeObjectURL(encounterFiles[index].preview!);
      }
      setEncounterFiles(newFiles);
      setFormData(prev => ({ ...prev, encounterScreenShots: newFiles }));
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.currentClaim.trim()) {
      newErrors.currentClaim = 'Current claim is required';
    }
    
    if (!formData.prevClaimDOS.trim()) {
      newErrors.prevClaimDOS = 'Previous claim DOS is required';
    }
    
    if (!formData.prevClaimCPT.trim()) {
      newErrors.prevClaimCPT = 'Previous claim CPT is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await apiService.createCase(formData);
      
      if (response.success && response.data) {
        toast.success('Case created successfully with AI analysis!');
        
        // Navigate to AI analysis page with the response data
        navigate('/analysis', {
          state: {
            case: response.data.user, // Backend returns case as 'user' field
            newAiAnalysis: response.data.newAiAnalysis
          }
        });
      } else {
        toast.error(response.error || 'Failed to create case');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Case creation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/8 relative overflow-hidden">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-primary/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="text-primary hover:text-primary-dark hover:bg-primary/5 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="h-6 border-l border-primary/20" />
              <h1 className="text-xl font-bold text-foreground">Create New Case</h1>
            </div>
            <div className="text-sm text-muted-foreground">
              Welcome, {user?.name}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Basic Information */}
          <Card className="shadow-lg bg-white/95 backdrop-blur-sm border border-primary/10 rounded-2xl">
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Case Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Current Claim */}
                <div className="space-y-2">
                  <Label htmlFor="currentClaim" className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-primary" />
                    <span>Current Claim *</span>
                  </Label>
                  <Input
                    id="currentClaim"
                    value={formData.currentClaim}
                    onChange={(e) => handleInputChange('currentClaim', e.target.value)}
                    placeholder="Enter current claim information"
                    className={errors.currentClaim ? 'border-destructive' : ''}
                  />
                  {errors.currentClaim && (
                    <p className="text-destructive text-sm">{errors.currentClaim}</p>
                  )}
                </div>
                
                {/* Previous Claim DOS */}
                <div className="space-y-2">
                  <Label htmlFor="prevClaimDOS" className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>Previous Claim DOS *</span>
                  </Label>
                  <Input
                    id="prevClaimDOS"
                    value={formData.prevClaimDOS}
                    onChange={(e) => handleInputChange('prevClaimDOS', e.target.value)}
                    placeholder="Enter previous claim date of service"
                    className={errors.prevClaimDOS ? 'border-destructive' : ''}
                  />
                  {errors.prevClaimDOS && (
                    <p className="text-destructive text-sm">{errors.prevClaimDOS}</p>
                  )}
                </div>
                
                {/* Previous Claim CPT */}
                <div className="space-y-2">
                  <Label htmlFor="prevClaimCPT" className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span>Previous Claim CPT *</span>
                  </Label>
                  <Input
                    id="prevClaimCPT"
                    value={formData.prevClaimCPT}
                    onChange={(e) => handleInputChange('prevClaimCPT', e.target.value)}
                    placeholder="Enter previous claim CPT code"
                    className={errors.prevClaimCPT ? 'border-destructive' : ''}
                  />
                  {errors.prevClaimCPT && (
                    <p className="text-destructive text-sm">{errors.prevClaimCPT}</p>
                  )}
                </div>
                
                {/* Primary Payer */}
                <div className="space-y-2">
                  <Label htmlFor="primaryPayer" className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    <span>Primary Payer</span>
                  </Label>
                  <Input
                    id="primaryPayer"
                    value={formData.primaryPayer}
                    onChange={(e) => handleInputChange('primaryPayer', e.target.value)}
                    placeholder="Enter primary payer information"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Text Information */}
          <Card className="shadow-lg bg-white/95 backdrop-blur-sm border border-primary/10 rounded-2xl">
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Additional Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              {/* Denial Text */}
              <div className="space-y-3">
                <Label htmlFor="denialText" className="text-lg font-semibold">
                  Denial Text
                </Label>
                <Textarea
                  id="denialText"
                  value={formData.denialText}
                  onChange={(e) => handleInputChange('denialText', e.target.value)}
                  placeholder="Enter denial text or reasoning..."
                  rows={4}
                />
              </div>
              
              {/* Encounter Text */}
              <div className="space-y-3">
                <Label htmlFor="encounterText" className="text-lg font-semibold">
                  Encounter Text
                </Label>
                <Textarea
                  id="encounterText"
                  value={formData.encounterText}
                  onChange={(e) => handleInputChange('encounterText', e.target.value)}
                  placeholder="Enter encounter text or notes..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* File Uploads */}
          <Card className="shadow-lg bg-white/95 backdrop-blur-sm border border-primary/10 rounded-2xl">
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="flex items-center space-x-2">
                <FileImage className="w-5 h-5" />
                <span>Supporting Documents</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              
              {/* Denial Screenshots */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Image className="w-5 h-5 text-primary" />
                  <Label className="text-lg font-semibold">Denial Documents</Label>
                </div>
                
                <div className="border-2 border-dashed border-primary/20 rounded-xl p-8 hover:border-primary/40 transition-all duration-300 hover:bg-primary/5 group">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Upload className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">
                        <label 
                          htmlFor="denial-upload"
                          className="cursor-pointer text-primary hover:text-primary-dark font-semibold underline underline-offset-2 hover:underline-offset-4 transition-all"
                        >
                          Click to upload denial documents
                        </label>
                        {' '}or drag and drop
                      </div>
                      <p className="text-xs text-muted-foreground">Images (PNG, JPG, GIF) or PDF files up to 10MB (max 5 files)</p>
                    </div>
                    <input
                      id="denial-upload"
                      type="file"
                      multiple
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files, 'denial')}
                    />
                  </div>
                </div>
                
                {denialFiles.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {denialFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-primary/5 border border-primary/20 rounded-xl overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-lg flex items-center justify-center">
                          {file.type === 'application/pdf' ? (
                            <div className="text-center p-4">
                              <File className="w-12 h-12 text-red-500 mx-auto mb-2" />
                              <p className="text-xs text-gray-600 font-medium">PDF</p>
                            </div>
                          ) : (
                            <img
                              src={file.preview}
                              alt={file.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index, 'denial')}
                          className="absolute -top-2 -right-2 bg-destructive hover:bg-destructive/90 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-lg"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <p className="text-xs text-muted-foreground mt-2 truncate font-medium">{file.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Encounter Screenshots */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <Label className="text-lg font-semibold">Encounter Documents</Label>
                </div>
                
                <div className="border-2 border-dashed border-primary/20 rounded-xl p-8 hover:border-primary/40 transition-all duration-300 hover:bg-primary/5 group">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Upload className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">
                        <label 
                          htmlFor="encounter-upload"
                          className="cursor-pointer text-primary hover:text-primary-dark font-semibold underline underline-offset-2 hover:underline-offset-4 transition-all"
                        >
                          Click to upload encounter documents
                        </label>
                        {' '}or drag and drop
                      </div>
                      <p className="text-xs text-muted-foreground">Images (PNG, JPG, GIF) or PDF files up to 10MB (max 5 files)</p>
                    </div>
                    <input
                      id="encounter-upload"
                      type="file"
                      multiple
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files, 'encounter')}
                    />
                  </div>
                </div>
                
                {encounterFiles.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {encounterFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-primary/5 border border-primary/20 rounded-xl overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-lg flex items-center justify-center">
                          {file.type === 'application/pdf' ? (
                            <div className="text-center p-4">
                              <File className="w-12 h-12 text-red-500 mx-auto mb-2" />
                              <p className="text-xs text-gray-600 font-medium">PDF</p>
                            </div>
                          ) : (
                            <img
                              src={file.preview}
                              alt={file.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index, 'encounter')}
                          className="absolute -top-2 -right-2 bg-destructive hover:bg-destructive/90 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-lg"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <p className="text-xs text-muted-foreground mt-2 truncate font-medium">{file.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Info Alert */}
          <Alert className="border-primary/30 bg-primary/8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              All information will be securely processed and analyzed by our AI system to provide the best appeal recommendations.
            </AlertDescription>
          </Alert>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary-dark text-primary-foreground"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creating Case...
                </>
              ) : (
                'Create Case'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CaseForm;

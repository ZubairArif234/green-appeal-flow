import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, CreateCaseRequest } from '@/services/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, X, Check, AlertCircle, Send } from "lucide-react";
import { toast } from "sonner";
import LoadingPage from "@/components/LoadingPage";

interface FileWithId extends File {
  id: string;
}

const AppealForm = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [currentTab, setCurrentTab] = useState("upload");
  const [formData, setFormData] = useState<CreateCaseRequest>({
    currentClaim: "",
    previousClaimDOS: "",
    previousClaimCPT: "",
    primaryPayer: "",
    denialText: "",
    encounterText: "",
    diagnosisText: "",
    denialScreenShots: [],
    encounterScreenShots: [],
    diagnosisScreenShots: []
  });

  useEffect(()=>{
if (user?.noOfCasesLeft < 1){
  navigate("/dashboard")
}
  },[])
  const [denialFiles, setDenialFiles] = useState<FileWithId[]>([]);

  const [encounterFiles, setEncounterFiles] = useState<FileWithId[]>([]);
  const [diagnosisFiles, setDiagnosisFiles] = useState<FileWithId[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentLoadingStep, setCurrentLoadingStep] = useState("Preparing your case...");

  const denialInputRef = useRef<HTMLInputElement>(null);
  const encounterInputRef = useRef<HTMLInputElement>(null);
  const diagnosisInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof CreateCaseRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };


  const addFilesToState = (
  files: FileList | File[],
  setter: React.Dispatch<React.SetStateAction<FileWithId[]>>,
  formField: 'denialScreenShots' | 'encounterScreenShots' | 'diagnosisScreenShots'
) => {
  const newFiles = Array.from(files).map(file => {
    const fileWithId = file as FileWithId;
    fileWithId.id = Math.random().toString(36).substr(2, 9);
    return fileWithId;
  });

  setter(prev => [...prev, ...newFiles]);
};



  const removeFile = (fileId: string, setter: React.Dispatch<React.SetStateAction<FileWithId[]>>, formField: 'denialScreenShots' | 'encounterScreenShots' | 'diagnosisScreenShots') => {
    setter(prev => prev.filter(f => f.id !== fileId));
  };

  const handleFileUpload = (files: FileList | any | null, setter: React.Dispatch<React.SetStateAction<FileWithId[]>>, formField: 'denialScreenShots' | 'encounterScreenShots' | 'diagnosisScreenShots') => {

    if (!files) return;
    
    const validFiles = Array.from(files).filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid file type. Please upload images only (JPG, PNG, GIF, WebP).`);
        return false;
      }
      
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Please upload files under 10MB.`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length > 0) {
      console.log('Uploading files:', validFiles);
      addFilesToState(validFiles, setter, formField);
      toast.success(`${validFiles.length} image(s) uploaded successfully!`);
    }
  };
  

 const handlePaste = (
  e: React.ClipboardEvent<HTMLInputElement>,
  setter: React.Dispatch<React.SetStateAction<FileWithId[]>>,
  formField: 'denialScreenShots' | 'encounterScreenShots' | 'diagnosisScreenShots'
) => {
  const items = e.clipboardData.items;
  const files: File[] = [];

  for (let i = 0; i < items.length; i++) {
    if (items[i].type.startsWith("image/")) {
      const file = items[i].getAsFile();
      if (file) files.push(file);
    }
  }

  if (files.length > 0) {
    handleFileUpload(files, setter, formField);
    e.currentTarget.value = ""; // ✅ clear the input text after paste
  }
};

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const validateForm = () => {
    // Check required fields
    if (!formData.currentClaim.trim()) {
      toast.error("Please enter the Current Claim Date of Service.");
      return false;
    }

    if (!formData.primaryPayer.trim()) {
      toast.error("Please enter the Primary Payer.");
      return false;
    }

    // Check that user has provided SOME denial and encounter information
    if (currentTab === "upload") {
      // Upload mode - require images
      if (denialFiles.length === 0) {
        toast.error("Please upload at least one denial screenshot.");
        return false;
      }
      if (encounterFiles.length === 0) {
        toast.error("Please upload at least one encounter screenshot.");
        return false;
      }
    } else {
      // Paste mode - require text
      if (!formData.denialText?.trim()) {
        toast.error("Please paste the denial text.");
        return false;
      }
      if (!formData.encounterText?.trim()) {
        toast.error("Please paste the encounter/chart documentation text.");
        return false;
      }
      if (!formData.diagnosisText?.trim()) {
        toast.error("Please paste the diagnosis codes and DX pointers information.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setLoadingProgress(0);
    setCurrentLoadingStep("Preparing your case...");
    
    try {
      console.log('=== CONVERTING IMAGES TO BASE64 ===');
      setCurrentLoadingStep("Processing uploaded files...");
      setLoadingProgress(0.1);
      
      // Convert files to base64
      const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            // Remove the data:image/...;base64, prefix
            const base64 = result.split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      };

      // Convert all files to base64
      setCurrentLoadingStep("Converting images to base64...");
      setLoadingProgress(0.2);
      
      const denialImages = await Promise.all(
        denialFiles.map(async (file) => ({
          name: file.name,
          type: file.type,
          base64: await convertFileToBase64(file)
        }))
      );

      setLoadingProgress(0.4);

      const encounterImages = await Promise.all(
        encounterFiles.map(async (file) => ({
          name: file.name,
          type: file.type,
          base64: await convertFileToBase64(file)
        }))
      );

      setLoadingProgress(0.6);

      const diagnosisImages = await Promise.all(
        diagnosisFiles.map(async (file) => ({
          name: file.name,
          type: file.type,
          base64: await convertFileToBase64(file)
        }))
      );

      console.log('=== SUBMITTING CASE WITH BASE64 IMAGES ===');
      console.log('Denial images:', denialImages.length);
      console.log('Encounter images:', encounterImages.length);
      console.log('Diagnosis images:', diagnosisImages.length);

      // Create request data with base64 images
      const requestData = {
        currentClaim: formData.currentClaim,
        previousClaimDOS: formData.previousClaimDOS || null,
        previousClaimCPT: formData.previousClaimCPT || null,
        primaryPayer: formData.primaryPayer,
        denialText: formData.denialText || null,
        encounterText: formData.encounterText || null,
        diagnosisText: formData.diagnosisText || null,
        denialImages,
        encounterImages,
        diagnosisImages
      };

      console.log('Request data:', requestData);
      
      setCurrentLoadingStep("Sending data to AI for analysis...");
      setLoadingProgress(0.7);
      
      const response = await apiService.createCase(requestData);
      
      setCurrentLoadingStep("AI is analyzing your case...");
      setLoadingProgress(0.8);
      
      if (response.success && response.data) {
        setCurrentLoadingStep("Finalizing your analysis...");
        setLoadingProgress(0.9);
        
        toast.success('Case created successfully with AI analysis!');
        
        // Refresh user data to update case count
        await refreshUser();
        
        setCurrentLoadingStep("Redirecting to results...");
        setLoadingProgress(1.0);
        
        // Small delay to show completion
        await new Promise(resolve => setTimeout(resolve, 500));
        
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
      setLoadingProgress(0);
      setCurrentLoadingStep("Preparing your case...");
    }
  };

 const FileUploadZone = ({ 
  files, 
  onFileChange, 
  onPasteChange,
  onRemove, 
  inputRef, 
  title, 
  subtitle 
}: {
  files: FileWithId[];
  onFileChange: (files: FileList | null) => void;
  onPasteChange: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  onRemove: (fileId: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  title: string;
  subtitle: string;
}) => (
  <div className="space-y-4">
    <div>
      <Label className="text-base font-semibold text-gray-900">{title}</Label>
      <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
    </div>
    
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onFileChange(e.dataTransfer.files);
      }}
      className="border-2 border-dashed border-gray-200 hover:border-primary/50 transition-colors duration-200 rounded-2xl p-8 text-center cursor-pointer group hover:bg-primary/5"
    >
      <div className="flex flex-col items-center space-y-3">
        <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <Upload className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-base font-medium text-gray-900">Click to upload or drag & drop</p>
          <p className="text-sm text-gray-500">Images only (JPG, PNG, GIF, WebP) up to 10MB each</p>
        </div>
      </div>
      
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => onFileChange(e.target.files)}
        className="hidden"
      />
    </div>

    {/* Paste input */}
    <Input
      type="text"
      placeholder="Paste Image here ..."
      onPaste={onPasteChange}
    />

    {files.length > 0 && (
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Uploaded Files:</Label>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {files.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(file.id);
                }}
                className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/8">
      {/* Loading Page */}
      <LoadingPage 
        isVisible={isSubmitting} 
        currentStep={currentLoadingStep}
        progress={loadingProgress}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
            <div className="flex text-sm px-2 py-1 mb-4 bg-green-50 border text-green-600 border-green-600 rounded-full">
        <Link to={"/dashboard"}>Go to dashboard</Link>
      </div>
          <h1 className="text-4xl font-bold text-primary mb-4">
            Appeal Your Denial
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Provide the denial and supporting docs, and we'll help you identify next steps to resolve it.
          </p>
        </div>

        {/* Main Form Card */}
        <Card className="shadow-2xl border border-primary/10 bg-white/95 backdrop-blur-sm rounded-2xl">
          <CardContent className="p-8">
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
              {/* Tab Navigation */}
              <div className="flex items-center justify-center">
                <TabsList className="grid w-full max-w-md grid-cols-2 h-12 bg-primary/10 p-1 rounded-2xl">
                  <TabsTrigger 
                    value="upload" 
                    className="rounded-xl font-semibold data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Files
                  </TabsTrigger>
                  <TabsTrigger 
                    value="paste" 
                    className="rounded-xl font-semibold data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Paste Text
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Upload Mode */}
              <TabsContent value="upload" className="space-y-8">
                {/* Step 1: Claim Information */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Step 1
                    </Badge>
                    <h3 className="text-xl font-semibold text-gray-900">Claim Information</h3>
                  </div>
                  <p className="text-gray-600">Provide claim and past visit details (No PHI)</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentClaim">Current Claim Date of Service *</Label>

                       <div className="relative">
            <input
              type="date"
              id="currentClaim"
              value={formData.currentClaim}
              onChange={(e) => handleInputChange("currentClaim", e.target.value)}
              placeholder="MM/DD/YYYY"
               className="w-full ring-offset-0 !outline-none px-3 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-primary/20"
             
            />
          </div>
                    </div>
                    <div className="space-y-2">

                      <Label htmlFor="previousClaimDOS">Previous Claim Date of Service (If Applicable)</Label>

                     
                       <div className="relative">
            <input
              type="date"
              id="previousClaimDOS"
              value={formData.previousClaimDOS}
              onChange={(e) => handleInputChange("previousClaimDOS", e.target.value)}
              placeholder="MM/DD/YYYY"
              className="w-full ring-offset-0 !outline-none px-3 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-primary/20"
             
            />
          </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="previousClaimCPT">Previous Claim CPTs (If Applicable)</Label>
                     
                       <div className="relative">
            <input
              id="previousClaimCPT"
              value={formData.previousClaimCPT}
              onChange={(e) => handleInputChange("previousClaimCPT", e.target.value)}
               placeholder="CPT codes"
              className="w-full ring-offset-0 !outline-none px-3 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-primary/20"
              
            />
          </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="primaryPayer">Primary Payer *</Label>
                      
                       <div className="relative">
            <input
              id="primaryPayer"
              value={formData.primaryPayer}
              onChange={(e) => handleInputChange("primaryPayer", e.target.value)}
               placeholder="Insurance provider"
              className="w-full ring-offset-0 !outline-none px-3 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-primary/20"
            
            />
          </div>
                    </div>
                  </div>
                </div>

                {/* Step 2: Upload Denial Screenshots */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Step 2
                    </Badge>
                    <h3 className="text-lg font-semibold text-gray-900">Upload Denial Screenshots</h3>

                  </div>
                  {/* <p className="text-gray-600">Upload screenshots of the payer denial. Images only (JPG, PNG). (No PHI)</p> */}
                  <p className="text-gray-600">Ensure that the screenshot includes payer denial reason codes - no PHI</p>
                  
                 <FileUploadZone
  files={denialFiles}
  onFileChange={(files) => handleFileUpload(files, setDenialFiles, "denialScreenShots")}
  onPasteChange={(e) => handlePaste(e, setDenialFiles, "denialScreenShots")}
  onRemove={(fileId) => removeFile(fileId, setDenialFiles, "denialScreenShots")}
  inputRef={denialInputRef}
  title=""
  subtitle=""
/>
                </div>

                {/* Step 3: Upload Clinical Documentation Screenshots */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Step 3
                    </Badge>
                    <h3 className="text-lg font-semibold text-gray-900">Upload Clinical Documentation Screenshots</h3>
                  </div>
                  <h4 className="text-base font-medium text-gray-800">Upload Encounter Screenshots</h4>
                  {/* <p className="text-gray-600">Upload screenshots of encounter forms, charts, etc. Images only (JPG, PNG). (No PHI)</p> */}
                  <p className="text-gray-600">Upload screenshots of the provider's documentation from the visit (e.g., encounter notes, progress notes, or visit summary) - No PHI.</p>
                  
                  <FileUploadZone
                    files={encounterFiles}
                    onFileChange={(files) => handleFileUpload(files, setEncounterFiles, 'encounterScreenShots')}
  onPasteChange={(e) => handlePaste(e, setEncounterFiles, "encounterScreenShots")}
                    onRemove={(fileId) => removeFile(fileId, setEncounterFiles, 'encounterScreenShots')}
                    inputRef={encounterInputRef}
                    title=""
                    subtitle=""
                  />
                </div>

                {/* Step 4: Upload Diagnosis Codes and DX Pointers */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Step 4
                    </Badge>
                    <h3 className="text-lg font-semibold text-gray-900">Upload Diagnosis Codes and DX Pointers</h3>
                  </div>
                  <h4 className="text-base font-medium text-gray-800">Upload Encounter Screenshots</h4>
                  <p className="text-gray-600">Upload screenshots showing both the diagnosis codes and the DX Pointers showing how they were linked to the specific CPTs billed - No PHI.</p>
                  
                  <FileUploadZone
                    files={diagnosisFiles}
                    onFileChange={(files) => handleFileUpload(files, setDiagnosisFiles, 'diagnosisScreenShots')}
                      onPasteChange={(e) => handlePaste(e, setDiagnosisFiles, "diagnosisScreenShots")}
                    onRemove={(fileId) => removeFile(fileId, setDiagnosisFiles, 'diagnosisScreenShots')}
                    inputRef={diagnosisInputRef}
                    title=""
                    subtitle=""
                  />
                </div>

              </TabsContent>

              {/* Paste Mode */}
              <TabsContent value="paste" className="space-y-8">
                {/* Step 1: Claim Information */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Step 1
                    </Badge>
                    <h3 className="text-xl font-semibold text-gray-900">Claim Information</h3>
                  </div>
                  <p className="text-gray-600">Provide claim and past visit details (No PHI)</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentClaim2">Current Claim Date of Service *</Label>
                      <Input
                        id="currentClaim2"
                        value={formData.currentClaim}
                        onChange={(e) => handleInputChange("currentClaim", e.target.value)}
                        placeholder="MM/DD/YYYY"
                        className="h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="previousClaimDOS2">Previous Claim Date of Service (If Applicable)</Label>
                      <Input
                        id="previousClaimDOS2"
                        value={formData.previousClaimDOS || ""}
                        onChange={(e) => handleInputChange("previousClaimDOS", e.target.value)}
                        placeholder="MM/DD/YYYY"
                        className="h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="previousClaimCPT2">Previous Claim CPTs (If Applicable)</Label>
                      <Input
                        id="previousClaimCPT2"
                        value={formData.previousClaimCPT || ""}
                        onChange={(e) => handleInputChange("previousClaimCPT", e.target.value)}
                        placeholder="CPT codes"
                        className="h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="primaryPayer2">Primary Payer *</Label>
                      <Input
                        id="primaryPayer2"
                        value={formData.primaryPayer}
                        onChange={(e) => handleInputChange("primaryPayer", e.target.value)}
                        placeholder="Insurance provider"
                        className="h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 2: Paste Denial Text */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Step 2
                    </Badge>
                    <h3 className="text-lg font-semibold text-gray-900">Paste Denial Text</h3>
                  </div>
                  <p className="text-gray-600">Paste the payer denial text or letter contents. (No PHI)</p>
                  
                  <Textarea
                    value={formData.denialText || ""}
                    onChange={(e) => handleInputChange("denialText", e.target.value)}
                    placeholder="Paste the payer denial text or letter contents here..."
                    className="min-h-[220px] rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20"
                  />
                </div>

                {/* Step 3: Paste Encounter Text */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Step 3
                    </Badge>
                    <h3 className="text-lg font-semibold text-gray-900">Paste Encounter Text</h3>
                  </div>
                  <p className="text-gray-600">Paste encounter form, DX pointers, diagnosis list, and chart information. (No PHI)</p>
                  
                  <Textarea
                    value={formData.encounterText || ""}
                    onChange={(e) => handleInputChange("encounterText", e.target.value)}
                    placeholder="Paste relevant chart notes, op notes, labs, referral/auth info, etc..."
                    className="min-h-[220px] rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20"
                  />
                </div>

                {/* Step 4: Paste Diagnosis Text */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Step 4
                    </Badge>
                    <h3 className="text-lg font-semibold text-gray-900">Paste Diagnosis Text</h3>
                  </div>
                  <p className="text-gray-600">Paste diagnosis codes and DX pointers information. (No PHI)</p>
                  
                  <Textarea
                    value={formData.diagnosisText || ""}
                    onChange={(e) => handleInputChange("diagnosisText", e.target.value)}
                    placeholder="Paste diagnosis codes and DX pointers information here..."
                    className="min-h-[220px] rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20"
                  />
                </div>

              </TabsContent>

              {/* Submit Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <AlertCircle className="w-4 h-4" />
                  <span>Images only (JPG, PNG, GIF) up to 10MB each • Provide files, text, or both</span>
                </div>
                
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {currentLoadingStep}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppealForm;

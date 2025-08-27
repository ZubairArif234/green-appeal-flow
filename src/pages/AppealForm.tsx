import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, X, Check, AlertCircle, Send } from "lucide-react";
import { toast } from "sonner";

interface FileWithId extends File {
  id: string;
}

const AppealForm = () => {
  const [currentTab, setCurrentTab] = useState("upload");
  const [formData, setFormData] = useState({
    currentClaimDOS: "",
    previousClaimDOS: "",
    previousClaimCPTs: "",
    denialText: "",
    chartText: "",
  });
  const [denialFiles, setDenialFiles] = useState<FileWithId[]>([]);
  const [chartFiles, setChartFiles] = useState<FileWithId[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const denialInputRef = useRef<HTMLInputElement>(null);
  const chartInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addFilesToState = (files: FileList | File[], setter: React.Dispatch<React.SetStateAction<FileWithId[]>>) => {
    const newFiles = Array.from(files).map(file => ({
      ...file,
      id: Math.random().toString(36).substr(2, 9)
    }));
    
    setter(prev => {
      const existingNames = prev.map(f => f.name);
      const uniqueFiles = newFiles.filter(f => !existingNames.includes(f.name));
      return [...prev, ...uniqueFiles];
    });
  };

  const removeFile = (fileId: string, setter: React.Dispatch<React.SetStateAction<FileWithId[]>>) => {
    setter(prev => prev.filter(f => f.id !== fileId));
  };

  const handleFileUpload = (files: FileList | null, setter: React.Dispatch<React.SetStateAction<FileWithId[]>>) => {
    if (!files) return;
    
    const validFiles = Array.from(files).filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid file type. Please upload PDF, JPG, or PNG files.`);
        return false;
      }
      
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Please upload files under 10MB.`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length > 0) {
      addFilesToState(validFiles, setter);
      toast.success(`${validFiles.length} file(s) uploaded successfully!`);
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
    if (!formData.currentClaimDOS.trim()) {
      toast.error("Please enter the Current Claim DOS.");
      return false;
    }

    if (currentTab === "upload") {
      if (denialFiles.length === 0) {
        toast.error("Please upload at least one denial screenshot.");
        return false;
      }
      if (chartFiles.length === 0) {
        toast.error("Please upload chart/documentation files.");
        return false;
      }
    } else {
      if (!formData.denialText.trim()) {
        toast.error("Please paste the denial text.");
        return false;
      }
      if (!formData.chartText.trim()) {
        toast.error("Please paste the chart/documentation text.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Appeal submitted successfully! We'll analyze your case and get back to you soon.");
      
      // Reset form
      setFormData({
        currentClaimDOS: "",
        previousClaimDOS: "",
        previousClaimCPTs: "",
        denialText: "",
        chartText: "",
      });
      setDenialFiles([]);
      setChartFiles([]);
    }, 2000);
  };

  const FileUploadZone = ({ 
    files, 
    onFileChange, 
    onRemove, 
    inputRef, 
    title, 
    subtitle 
  }: {
    files: FileWithId[];
    onFileChange: (files: FileList | null) => void;
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
            <p className="text-sm text-gray-500">PDF, JPG, PNG up to 10MB each</p>
          </div>
        </div>
        
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => onFileChange(e.target.files)}
          className="hidden"
        />
      </div>

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-green-600 to-primary-dark bg-clip-text text-transparent mb-4">
            Appeal Your Denial
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Provide the denial and supporting docs, and we'll help you identify next steps to resolve it.
          </p>
        </div>

        {/* Main Form Card */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
              {/* Tab Navigation */}
              <div className="flex items-center justify-center">
                <TabsList className="grid w-full max-w-md grid-cols-2 h-12 bg-gray-100 p-1 rounded-2xl">
                  <TabsTrigger 
                    value="upload" 
                    className="rounded-xl font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Files
                  </TabsTrigger>
                  <TabsTrigger 
                    value="paste" 
                    className="rounded-xl font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentDOS">Current Claim DOS *</Label>
                      <Input
                        id="currentDOS"
                        value={formData.currentClaimDOS}
                        onChange={(e) => handleInputChange("currentClaimDOS", e.target.value)}
                        placeholder="MM/DD/YYYY"
                        className="h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="previousDOS">Previous Claim DOS</Label>
                      <Input
                        id="previousDOS"
                        value={formData.previousClaimDOS}
                        onChange={(e) => handleInputChange("previousClaimDOS", e.target.value)}
                        placeholder="MM/DD/YYYY (if applicable)"
                        className="h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="previousCPTs">Previous Claim CPTs</Label>
                      <Input
                        id="previousCPTs"
                        value={formData.previousClaimCPTs}
                        onChange={(e) => handleInputChange("previousClaimCPTs", e.target.value)}
                        placeholder="CPT codes (if applicable)"
                        className="h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Step 2: Upload Denial Screenshots */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        Step 2
                      </Badge>
                      <h3 className="text-lg font-semibold text-gray-900">Upload Denial Screenshots</h3>
                    </div>
                    
                    <FileUploadZone
                      files={denialFiles}
                      onFileChange={(files) => handleFileUpload(files, setDenialFiles)}
                      onRemove={(fileId) => removeFile(fileId, setDenialFiles)}
                      inputRef={denialInputRef}
                      title=""
                      subtitle="Upload one or more screenshots of the payer denial. (No PHI)"
                    />
                  </div>

                  {/* Step 3: Upload Chart Documentation */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        Step 3
                      </Badge>
                      <h3 className="text-lg font-semibold text-gray-900">Upload Documentation</h3>
                    </div>
                    
                    <FileUploadZone
                      files={chartFiles}
                      onFileChange={(files) => handleFileUpload(files, setChartFiles)}
                      onRemove={(fileId) => removeFile(fileId, setChartFiles)}
                      inputRef={chartInputRef}
                      title=""
                      subtitle="Upload encounter form, DX pointers, diagnosis list, and chart information. (No PHI)"
                    />
                  </div>
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentDOS2">Current Claim DOS *</Label>
                      <Input
                        id="currentDOS2"
                        value={formData.currentClaimDOS}
                        onChange={(e) => handleInputChange("currentClaimDOS", e.target.value)}
                        placeholder="MM/DD/YYYY"
                        className="h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="previousDOS2">Previous Claim DOS</Label>
                      <Input
                        id="previousDOS2"
                        value={formData.previousClaimDOS}
                        onChange={(e) => handleInputChange("previousClaimDOS", e.target.value)}
                        placeholder="MM/DD/YYYY (if applicable)"
                        className="h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="previousCPTs2">Previous Claim CPTs</Label>
                      <Input
                        id="previousCPTs2"
                        value={formData.previousClaimCPTs}
                        onChange={(e) => handleInputChange("previousClaimCPTs", e.target.value)}
                        placeholder="CPT codes (if applicable)"
                        className="h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                      value={formData.denialText}
                      onChange={(e) => handleInputChange("denialText", e.target.value)}
                      placeholder="Paste the payer denial text or letter contents here..."
                      className="min-h-[220px] rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20"
                    />
                  </div>

                  {/* Step 3: Paste Chart Text */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        Step 3
                      </Badge>
                      <h3 className="text-lg font-semibold text-gray-900">Paste Documentation</h3>
                    </div>
                    <p className="text-gray-600">Paste encounter form, DX pointers, diagnosis list, and chart information. (No PHI)</p>
                    
                    <Textarea
                      value={formData.chartText}
                      onChange={(e) => handleInputChange("chartText", e.target.value)}
                      placeholder="Paste relevant chart notes, op notes, labs, referral/auth info, etc..."
                      className="min-h-[220px] rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Submit Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <AlertCircle className="w-4 h-4" />
                  <span>PDF, JPG, PNG up to 10MB each</span>
                </div>
                
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-primary via-green-600 to-primary-dark hover:from-primary-dark hover:via-green-700 hover:to-primary text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Submit Appeal
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

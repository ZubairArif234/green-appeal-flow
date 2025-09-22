import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiService, CaseResponse } from '@/services/api';
import { ArrowLeft, Brain, CheckCircle, Eye, FileText, Loader2, Sparkles, Target, User } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const PastClaims = () => {
    const navigate = useNavigate()
     const [selectedCase, setSelectedCase] = useState<any | null>(null);
      const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
      
      const [cases, setCases] = useState<CaseResponse[]>([]);
      const [casesLoading, setCasesLoading] = useState(false);
      const [casesPage, setCasesPage] = useState(1);
      const [casesTotal, setCasesTotal] = useState(0);

     const fetchCases = async (page: number = 1) => {
    setCasesLoading(true);
    try {
      console.log('Fetching cases with page:', page);
      const casesResponse = await apiService.getMyCases(page, 10);
      console.log('Cases response:', casesResponse);
      
      if (casesResponse.success && casesResponse.data) {
        console.log('Cases data received:', casesResponse.data.data);
        console.log('Sample case user:', casesResponse.data.data[0]?.user);
        setCases(casesResponse.data.data);
        setCasesTotal(casesResponse.data.totalCount);
        setCasesPage(page);
      } else {
        console.error('Failed to get cases:', casesResponse.error);
        toast.error(casesResponse.error || 'Failed to load cases');
      }
    } catch (error) {
      toast.error('Failed to load cases');
      console.error('Cases fetch error:', error);
    } finally {
      setCasesLoading(false);
    }
  };

  useEffect(()=>{
fetchCases()
  },[])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  return (
     <div className="">
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
                <h1 className="text-xl font-bold text-foreground">My Past Claims</h1>
              </div>
            </div>
            {/* <div className="flex items-center space-x-3">
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
            </div> */}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">

              <Card>
                <CardHeader>
                  <CardTitle>My Past Claims</CardTitle>
                  <CardDescription>
                    View my all past claims
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {casesLoading ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                      <p className="text-muted-foreground">Loading cases...</p>
                    </div>
                  ) : cases.length > 0 ? (
                    <>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Current Claim</TableHead>
                            <TableHead>Previous Claim DOS</TableHead>
                            <TableHead>Previous Claim CPT</TableHead>
                            <TableHead>Primary Payer</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {cases.map((caseItem) => (
                            <TableRow key={caseItem._id}>
                              <TableCell className="font-medium">
                                {typeof caseItem.user === 'object' ? caseItem.user.name : 'Unknown User'}
                                <div className="text-xs text-gray-500">
                                  {typeof caseItem.user === 'object' ? caseItem.user.email : ''}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="max-w-48 truncate">
                                  {caseItem?.case?.currentClaim}
                                </div>
                              </TableCell>
                              <TableCell>{caseItem?.case?.previousClaimDOS || 'Not provided'}</TableCell>
                              <TableCell>{caseItem?.case?.previousClaimCPT || 'Not provided'}</TableCell>
                              <TableCell>{caseItem?.case?.primaryPayer || 'N/A'}</TableCell>
                              <TableCell>{formatDate(caseItem?.case?.createdAt)}</TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedCase(caseItem);
                                    setIsCaseModalOpen(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                      
                      {/* Pagination */}
                      <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-muted-foreground">
                          Showing {((casesPage - 1) * 10) + 1} to {Math.min(casesPage * 10, casesTotal)} of {casesTotal} cases
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchCases(casesPage - 1)}
                            disabled={casesPage <= 1 || casesLoading}
                          >
                            Previous
                          </Button>
                          <span className="text-sm">
                            Page {casesPage} of {Math.ceil(casesTotal / 10)}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchCases(casesPage + 1)}
                            disabled={casesPage >= Math.ceil(casesTotal / 10) || casesLoading}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No cases found</p>
                      <Button onClick={() => fetchCases(1)} variant="outline" className="mt-2">
                        <Loader2 className="w-4 h-4 mr-2" />
                        Load Cases
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
      </div>

       <Dialog open={isCaseModalOpen} onOpenChange={setIsCaseModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Case Details</DialogTitle>
            <DialogDescription>Complete case information and claim details</DialogDescription>
          </DialogHeader>
          
          {selectedCase && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">User Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="font-medium">Name:</span> {typeof selectedCase.user === 'object' ? selectedCase.user.name : 'Unknown User'}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {typeof selectedCase.user === 'object' ? selectedCase.user.email : 'N/A'}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Case Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="font-medium">Case ID:</span>
                      <p className="text-xs font-mono">{selectedCase?.case?._id}</p>
                    </div>
                    <div>
                      <span className="font-medium">Created:</span> {new Date(selectedCase?.case?.createdAt).toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Updated:</span> {new Date(selectedCase?.case?.updatedAt).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Claim Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="font-medium">Current Claim:</span>
                    <p className="text-sm mt-1 p-2 bg-slate-50 rounded">{selectedCase?.case?.currentClaim}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="font-medium">Previous Claim DOS:</span>
                      <p className="text-sm text-gray-500">{selectedCase?.case?.previousClaimDOS || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Previous Claim CPT:</span>
                      <p className="text-sm text-gray-500">{selectedCase?.case?.previousClaimCPT || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Primary Payer:</span>
                      <p className="text-sm text-gray-500">{selectedCase?.case?.primaryPayer || 'N/A'}</p>
                    </div>
                  </div>
                  {selectedCase.denialText && (
                    <div>
                      <span className="font-medium">Denial Text:</span>
                      <p className="text-sm mt-1 p-2 bg-red-50 rounded border-l-4 border-red-200">{selectedCase?.case.denialText}</p>
                    </div>
                  )}
                  {selectedCase.encounterText && (
                    <div>
                      <span className="font-medium">Encounter Text:</span>
                      <p className="text-sm mt-1 p-2 bg-blue-50 rounded border-l-4 border-blue-200">{selectedCase?.case.encounterText}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {(selectedCase?.case.denialScreenShots?.length || selectedCase?.case?.encounterScreenShots?.length) && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Screenshots</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedCase?.case.denialScreenShots?.length && (
                      <div>
                        <span className="font-medium">Denial Screenshots ({selectedCase?.case.denialScreenShots.length}):</span>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                          {selectedCase?.case.denialScreenShots.map((screenshot, index) => (
                            <img key={index} src={screenshot} alt={`Denial ${index + 1}`} className="w-full h-24 object-cover rounded border" />
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedCase?.case.encounterScreenShots?.length && (
                      <div>
                        <span className="font-medium">Encounter Screenshots ({selectedCase?.case.encounterScreenShots.length}):</span>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                          {selectedCase?.case.encounterScreenShots.map((screenshot, index) => (
                            <img key={index} src={screenshot} alt={`Encounter ${index + 1}`} className="w-full h-24 object-cover rounded border" />
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Analysis Sections */}
              <div className="lg:col-span-2 space-y-6">
                {/* Recommended Pathway */}
                {selectedCase.analysis?.recommended_pathway && (
                  <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border-l-4 border-blue-600 bg-gradient-to-r from-blue-50 to-white">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Target className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Recommended Action</h3>
                    </div>
                    <div className="space-y-4">
                      {selectedCase.analysis.recommended_pathway.type && (
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2 text-blue-600 font-semibold text-lg">
                            <CheckCircle className="w-6 h-6" />
                            <span>{selectedCase.analysis.recommended_pathway.type}</span>
                          </div>
                        </div>
                      )}
                      {selectedCase.analysis.recommended_pathway.instruction && (
                        <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-600">
                          <p className="text-gray-800 leading-relaxed font-medium">
                            {selectedCase.analysis.recommended_pathway.instruction}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Denial Summary */}
                {selectedCase.analysis?.denial_summary && (
                  <div className="bg-gradient-to-r from-orange-50 to-white rounded-2xl p-6 mb-6 shadow-lg border-l-4 border-orange-500">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <FileText className="w-6 h-6 text-red-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Denial Summary</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-orange-100 border border-gray-200 rounded-xl p-4 text-center">
                        <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Reason Code</div>
                        <div className="text-lg font-bold text-gray-900">
                          {selectedCase.analysis.denial_summary.reason_code || 'N/A'}
                        </div>
                      </div>
                      <div className="bg-orange-100 border border-gray-200 rounded-xl p-4 text-center">
                        <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Remark Code</div>
                        <div className="text-lg font-bold text-gray-900">
                          {selectedCase.analysis.denial_summary.remark_code || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Root Cause Analysis */}
                {selectedCase.analysis?.root_cause_analysis && (
                  <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border-l-4 border-yellow-500 bg-gradient-to-r from-yellow-50 to-white">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Target className="w-6 h-6 text-yellow-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Root Cause Analysis</h3>
                    </div>
                    <div className="space-y-4">
                      {selectedCase.analysis.root_cause_analysis.issue_identified && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                          <div className="text-sm font-semibold text-yellow-800 mb-2">Issue Identified:</div>
                          <div className="text-yellow-900 font-medium leading-relaxed">
                            {selectedCase.analysis.root_cause_analysis.issue_identified}
                          </div>
                        </div>
                      )}
                      {selectedCase.analysis.root_cause_analysis.cms_guidelines && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                          <div className="text-sm font-semibold text-yellow-800 mb-2">CMS Guidelines:</div>
                          <div className="text-yellow-900 font-medium leading-relaxed">
                            {selectedCase.analysis.root_cause_analysis.cms_guidelines}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Staff Instructions */}
                {selectedCase.analysis?.staff_instructions && (
                  <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border-l-4 border-purple-500 bg-gradient-to-r from-purple-50 to-white">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <User className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Staff Instructions</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-purple-50 border border-gray-200 rounded-xl p-4">
                        <div className="text-sm font-semibold text-purple-600 mb-2">
                          {selectedCase.analysis.staff_instructions.instruction_type || 'Submit Corrected Claim'}:
                        </div>
                        <div className="text-purple-800 font-medium leading-relaxed">
                          {selectedCase.analysis.staff_instructions.detail || 'No specific instructions provided'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Provider Education */}
                {selectedCase.analysis?.provider_education && (
                  <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border-l-4 border-indigo-500 bg-gradient-to-r from-indigo-50 to-white">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <Sparkles className="w-6 h-6 text-indigo-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Provider Education</h3>
                    </div>
                    <div className="space-y-4">
                      {selectedCase.analysis.provider_education.future_prevention && (
                        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                          <div className="text-sm font-semibold text-indigo-800 mb-2">Future Prevention:</div>
                          <div className="text-indigo-900 font-medium leading-relaxed">
                            {selectedCase.analysis.provider_education.future_prevention}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
            </div>
         
  )
}

export default PastClaims
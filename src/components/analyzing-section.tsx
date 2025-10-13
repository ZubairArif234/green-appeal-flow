import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { AlertTriangle, ArrowLeft, BarChart3, Brain, CheckCircle, FileText, Lightbulb, RefreshCw, Target, Users, Zap } from 'lucide-react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

const AnalyzingSection = () => {
  return (
   <section id="how-it-works" className="py-20 bg-gradient-light-green">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">See Our AI in Action</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Here's what you can expect from our comprehensive denial analysis
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card >
              <CardHeader className="bg-gradient-primary text-white rounded-t-lg mb-3 py-7">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <Brain className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white">AI Denial Analysis Report</CardTitle>
                      <p className="text-white/80 text-sm">
                        Claim #: 2024-08-07-001 
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-500 text-white border-0">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    High Confidence
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-8 space-y-8">
                {/* Recommended Pathway */}
                <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <Target className="h-5 w-5 text-green-600" />
                    <h3 className="font-bold text-lg text-green-800">Recommended Pathway</h3>
                  </div>
                  <div className="bg-green-100 rounded-lg p-4">
                    <p className="font-semibold text-green-800 text-lg">✅ Corrected Claim</p>
                    <p className="text-green-700 mt-2">
                      Submit a corrected claim with updated diagnosis pointers. The E/M service is valid but incorrectly
                      linked to global period diagnoses.
                    </p>
                  </div>
                </div>

                {/* Denial Summary */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-blue-600" />
                    <h3 className="font-bold text-lg text-blue-800">Denial Summary</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-100 rounded-lg p-4">
                      <p className="font-semibold text-blue-800">Reason Code</p>
                      <p className="text-blue-700">CO-16: Missing/Invalid Information</p>
                    </div>
                    <div className="bg-blue-100 rounded-lg p-4">
                      <p className="font-semibold text-blue-800">Remark Code</p>
                      <p className="text-blue-700">M51: Billing Error Identified</p>
                    </div>
                  </div>
                </div>

                {/* Root Cause Analysis */}
                <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <Lightbulb className="h-5 w-5 text-orange-600" />
                    <h3 className="font-bold text-lg text-orange-800">Root Cause Analysis</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-orange-100 rounded-lg p-4">
                      <p className="font-semibold text-orange-800">Issue Identified:</p>
                      <p className="text-orange-700">
                        <strong>CPT 99214</strong> with <strong>modifier 24</strong> was incorrectly linked to global
                        period diagnoses (C43.9, S01.80XA) instead of the unrelated condition (C44.91).
                      </p>
                    </div>
                    <div className="bg-orange-100 rounded-lg p-4">
                      <p className="font-semibold text-orange-800">CMS Guidelines:</p>
                      <p className="text-orange-700">
                        E/M services with modifier 24 during global periods must be linked <strong>exclusively</strong>{" "}
                        to unrelated diagnoses.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Staff Instructions */}
                <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <Users className="h-5 w-5 text-purple-600" />
                    <h3 className="font-bold text-lg text-purple-800">Staff Instructions</h3>
                  </div>
                  <div className="bg-purple-100 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
                        1
                      </div>
                      <div>
                        <p className="font-semibold text-purple-800">Submit Corrected Claim</p>
                        <p className="text-purple-700">Update CPT 99214-24 diagnosis pointers from A,B,C to C only</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Provider Note */}
                <div className="bg-gray-50 border-l-4 border-gray-500 p-6 rounded-r-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <h3 className="font-bold text-lg text-gray-800">Provider Education</h3>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <p className="text-gray-700">
                      <strong>Future Prevention:</strong> When billing E/M services with modifier 24 during global
                      periods, ensure diagnosis pointers link <strong>only</strong> to conditions unrelated to the
                      original surgery.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
               <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                 className="flex-1 bg-primary hover:bg-primary-dark text-primary-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-primary/20 text-primary hover:bg-primary/5"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Analyze New Denial
              </Button>
            </div>
              </CardContent>
            </Card>

            {/* Demo Notice */}
            <div className="text-center mt-8">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                <Zap className="h-3 w-3 mr-1" />
                This is a demo example - Try it yourself with our free trial
              </Badge>
            </div>
          </div>
        </div>
      </section>
  )
}

export default AnalyzingSection
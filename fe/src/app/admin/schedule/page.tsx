"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import DynamicNavbar from "@/components/DynamicNavbar";
import MagicBento from "@/components/MagicBento";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useGetUsersByRole } from "@/hooks/useGraphQL";
import { UserRole } from "@/gql/types";

// Component to show students in selected batch
function BatchStudents({ students, batchYear }: { students: any[], batchYear: string }) {
  if (students.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No Students Found</h3>
        <p className="text-gray-400">No students found for batch {batchYear}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-64 overflow-y-auto">
      {students.map((student: any, index: number) => (
        <div
          key={student.walletAddress || index}
          className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">
                {student.name 
                  ? student.name.charAt(0).toUpperCase()
                  : student.walletAddress.slice(2, 4).toUpperCase()
                }
              </span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">
                {student.name || 'Anonymous Student'}
              </p>
              <p className="text-gray-400 text-xs">
                {student.studentId ? `ID: ${student.studentId}` : 'No Student ID'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              student.isActive ? 'bg-green-400' : 'bg-red-400'
            }`}></div>
            <span className="text-xs text-gray-400">
              {student.isActive ? 'Active' : 'Inactive'}
            </span>
            <input 
              type="checkbox" 
              className="ml-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              defaultChecked={student.isActive}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SchedulePage() {
  const { user } = useAuth();
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [examDetails, setExamDetails] = useState({
    examName: "",
    subject: "",
    courseId: "",
    date: "",
    time: "",
    duration: "",
    instructions: ""
  });

  // Get all students data
  const { data: studentsData, loading, error, refetch } = useGetUsersByRole(UserRole.STUDENT);
  const allStudents = studentsData?.getUsersByRole || [];

  // Extract unique batches from student IDs and group students
  const { batches, studentsByBatch } = useMemo(() => {
    const batchMap = new Map<string, any[]>();
    const batchSet = new Set<string>();

    allStudents.forEach(student => {
      if (student.studentId && student.studentId.length >= 2) {
        const batch = student.studentId.slice(0, 2);
        batchSet.add(batch);
        
        if (!batchMap.has(batch)) {
          batchMap.set(batch, []);
        }
        batchMap.get(batch)?.push(student);
      }
    });

    // Sort batches in descending order (newest first)
    const sortedBatches = Array.from(batchSet).sort((a, b) => b.localeCompare(a));

    return {
      batches: sortedBatches,
      studentsByBatch: batchMap
    };
  }, [allStudents]);

  const selectedStudents = selectedBatch ? studentsByBatch.get(selectedBatch) || [] : [];

  const handleScheduleExam = () => {
    if (!selectedBatch || !examDetails.examName || !examDetails.subject || !examDetails.courseId || !examDetails.date) {
      alert("Please fill in all required fields");
      return;
    }

    // Here you would typically send the exam schedule to your backend
    console.log("Scheduling exam:", {
      batch: selectedBatch,
      students: selectedStudents,
      examDetails
    });

    alert(`Exam "${examDetails.examName}" for course ${examDetails.courseId} scheduled for Batch ${selectedBatch} with ${selectedStudents.length} students`);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen" style={{ backgroundColor: '#0b0b12' }}>
          <DynamicNavbar />
          <div className="p-6 h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <p className="text-gray-300">Loading student data...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen" style={{ backgroundColor: '#0b0b12' }}>
          <DynamicNavbar />
          <div className="p-6 h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-400 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.27 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Error Loading Data</h3>
              <p className="text-gray-300 mb-4">{error.message}</p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen" style={{ backgroundColor: '#0b0b12' }}>
        <DynamicNavbar />
        
        {/* Page Header */}
        <div className="p-6 pb-2">
          <h1 className="text-3xl font-bold text-white mb-2">
            Schedule Examination
          </h1>
          <p className="text-gray-400">
            Schedule exams for specific batches and manage student participation
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 pt-4">
          {/* Batch Selection */}
          <div className="backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:via-transparent before:to-transparent before:rounded-2xl" style={{ backgroundColor: '#12121a' }}>
            <MagicBento 
              textAutoHide={true}
              enableStars={false}
              enableSpotlight={true}
              enableBorderGlow={true}
              enableTilt={false}
              enableMagnetism={false}
              clickEffect={true}
              spotlightRadius={300}
              particleCount={8}
              glowColor="180, 180, 200"
              cards={[{
                color: "transparent",
                title: "Select Batch",
                description: "Choose student batch for exam",
                label: "Batch",
                children: (
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Available Batches</h3>
                    <div className="space-y-3">
                      {batches.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">No batches found</p>
                      ) : (
                        batches.map((batch) => (
                          <button
                            key={batch}
                            onClick={() => setSelectedBatch(batch)}
                            className={`w-full p-3 rounded-lg text-left transition-colors ${
                              selectedBatch === batch
                                ? 'bg-blue-600 text-white'
                                : 'bg-white/5 hover:bg-white/10 text-gray-300'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Batch 20{batch}</span>
                              <span className="text-sm opacity-75">
                                {studentsByBatch.get(batch)?.length || 0} students
                              </span>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )
              }]}
            />
          </div>

          {/* Exam Details Form */}
          <div className="backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:via-transparent before:to-transparent before:rounded-2xl" style={{ backgroundColor: '#12121a' }}>
            <MagicBento 
              textAutoHide={true}
              enableStars={false}
              enableSpotlight={true}
              enableBorderGlow={true}
              enableTilt={false}
              enableMagnetism={false}
              clickEffect={true}
              spotlightRadius={300}
              particleCount={8}
              glowColor="180, 180, 200"
              cards={[{
                color: "transparent",
                title: "Exam Details",
                description: "Configure exam settings",
                label: "Details",
                children: (
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Exam Name *
                      </label>
                      <input
                        type="text"
                        value={examDetails.examName}
                        onChange={(e) => setExamDetails({...examDetails, examName: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                        placeholder="e.g., Mid-term Examination"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        value={examDetails.subject}
                        onChange={(e) => setExamDetails({...examDetails, subject: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                        placeholder="e.g., Blockchain Technology"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Course ID *
                      </label>
                      <input
                        type="text"
                        value={examDetails.courseId}
                        onChange={(e) => setExamDetails({...examDetails, courseId: e.target.value.toUpperCase()})}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                        placeholder="e.g., CSE201, CE104, IT301"
                        pattern="^[A-Z]{2,4}[0-9]{3}$"
                        title="Course ID should be department code (CSE, CE, IT, etc.) followed by 3 digits"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Date *
                        </label>
                        <input
                          type="date"
                          value={examDetails.date}
                          onChange={(e) => setExamDetails({...examDetails, date: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Time
                        </label>
                        <input
                          type="time"
                          value={examDetails.time}
                          onChange={(e) => setExamDetails({...examDetails, time: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={examDetails.duration}
                        onChange={(e) => setExamDetails({...examDetails, duration: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                        placeholder="e.g., 120"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Instructions
                      </label>
                      <textarea
                        value={examDetails.instructions}
                        onChange={(e) => setExamDetails({...examDetails, instructions: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                        rows={3}
                        placeholder="Special instructions for students..."
                      />
                    </div>

                    <button
                      onClick={handleScheduleExam}
                      disabled={!selectedBatch || !examDetails.examName || !examDetails.subject || !examDetails.courseId || !examDetails.date}
                      className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed rounded-lg transition-colors text-white font-medium"
                    >
                      Schedule Exam
                    </button>
                  </div>
                )
              }]}
            />
          </div>

          {/* Selected Students */}
          <div className="backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:via-transparent before:to-transparent before:rounded-2xl" style={{ backgroundColor: '#12121a' }}>
            <MagicBento 
              textAutoHide={true}
              enableStars={false}
              enableSpotlight={true}
              enableBorderGlow={true}
              enableTilt={false}
              enableMagnetism={false}
              clickEffect={true}
              spotlightRadius={300}
              particleCount={8}
              glowColor="180, 180, 200"
              cards={[{
                color: "transparent",
                title: selectedBatch ? `Batch 20${selectedBatch} Students` : "Select Batch",
                description: selectedBatch ? `${selectedStudents.length} students` : "Choose a batch to view students",
                label: "Students",
                children: (
                  <div className="p-6">
                    {selectedBatch ? (
                      <>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold text-white">
                            Students in Batch 20{selectedBatch}
                          </h3>
                          <span className="text-blue-400 font-medium">
                            {selectedStudents.length} students
                          </span>
                        </div>
                        <BatchStudents students={selectedStudents} batchYear={selectedBatch} />
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-gray-400 mb-4">
                          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        <p className="text-gray-400">Select a batch to view students</p>
                      </div>
                    )}
                  </div>
                )
              }]}
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

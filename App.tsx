import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StudentList } from './components/StudentList';
import { StudentDetail } from './components/StudentDetail';
import { AddStudentModal } from './components/AddStudentModal';
import { ClassReport } from './components/ClassReport';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import { SetupScreen } from './components/SetupScreen';
import type { Student, Measurement, Assessment, ClassInfo } from './types';
import { calculateBmi, calculateAgeInMonths } from './utils/helpers';

export type ViewType = 'dashboard' | 'class_report';
export type UserRole = 'teacher' | 'parent';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  // Load data from localStorage on initial mount
  useEffect(() => {
    try {
      const savedClassInfo = localStorage.getItem('classInfo');
      const savedStudents = localStorage.getItem('students');

      if (savedClassInfo) {
        setClassInfo(JSON.parse(savedClassInfo));
      }
      if (savedStudents) {
        setStudents(JSON.parse(savedStudents));
      }
    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
    }
    setIsLoading(false);
  }, []);

  // Persist classInfo to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('classInfo', JSON.stringify(classInfo));
    }
  }, [classInfo, isLoading]);

  // Persist students to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('students', JSON.stringify(students));
    }
  }, [students, isLoading]);

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsLoggedIn(true);
    setSelectedStudentId(null);
    setCurrentView('dashboard');
  };
  
  const handleSaveSetup = (info: ClassInfo) => {
    setClassInfo(info);
    setStudents([]); // Start with an empty student list for the new class
  };

  const handleUpdateClassInfo = (updatedInfo: ClassInfo) => {
    setClassInfo(updatedInfo);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setSelectedStudentId(null);
    // Note: We are not clearing localStorage on logout
    // so the data persists for the next session.
  };
  
  const handleAddStudent = (studentData: Omit<Student, 'id' | 'measurements'>) => {
    const newStudent: Student = {
      ...studentData,
      id: new Date().toISOString(),
      measurements: [],
    };
    setStudents(prev => [...prev, newStudent]);
    setSelectedStudentId(newStudent.id);
    setCurrentView('dashboard');
  };

  const handleUpdateStudentInfo = (studentId: string, updatedInfo: Partial<Pick<Student, 'parentPhone' | 'healthNotes'>>) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId ? { ...student, ...updatedInfo } : student
      )
    );
  };

  const handleAddMeasurement = (studentId: string, height: number, weight: number, date: string) => {
    setStudents(prevStudents => 
      prevStudents.map(student => {
        if (student.id === studentId) {
          const ageInMonths = calculateAgeInMonths(student.dob, date);
          const newMeasurement: Measurement = {
            id: new Date().toISOString(),
            date,
            height,
            weight,
            bmi: ageInMonths >= 70 ? calculateBmi(height, weight) : undefined
          };
          const updatedMeasurements = [...student.measurements, newMeasurement]
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          return { ...student, measurements: updatedMeasurements };
        }
        return student;
      })
    );
  };
  
  const handleUpdateAssessment = (studentId: string, measurementId: string, assessment: Assessment) => {
    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        const updatedMeasurements = student.measurements.map(m => {
          if (m.id === measurementId) {
            return { ...m, assessment };
          }
          return m;
        });
        return { ...student, measurements: updatedMeasurements };
      }
      return student;
    }));
  };
  
  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center"><p>Đang tải dữ liệu...</p></div>;
  }

  if (!isLoggedIn || !userRole) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // If teacher is logged in but class info is not set, show setup screen
  if (userRole === 'teacher' && !classInfo) {
    return <SetupScreen onSave={handleSaveSetup} />;
  }
  
  // For parents, if there's no class info, they can't see anything yet.
  if (userRole === 'parent' && !classInfo) {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
            <h1 className="text-2xl font-bold text-gray-700">Chưa có thông tin lớp học.</h1>
            <p className="text-gray-600 mt-2">Vui lòng chờ giáo viên thiết lập lớp học trước khi bạn có thể xem thông tin.</p>
             <button onClick={handleLogout} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Đăng xuất
            </button>
        </div>
    )
  }

  const renderContent = () => {
    if (currentView === 'class_report') {
        return <ClassReport students={students} onUpdateAssessment={handleUpdateAssessment} />
    }
    
    if (selectedStudent) {
      return <StudentDetail 
                student={selectedStudent} 
                userRole={userRole} 
                onAddMeasurement={handleAddMeasurement} 
                onUpdateAssessment={handleUpdateAssessment}
                onUpdateStudentInfo={handleUpdateStudentInfo}
              />;
    }

    return <Dashboard 
                classInfo={classInfo!} 
                studentCount={students.length}
                userRole={userRole}
                onUpdateClassInfo={handleUpdateClassInfo} 
                onSelectStudent={() => {
                    if (students.length > 0) {
                        setSelectedStudentId(students[0].id)
                    } else {
                        if (userRole === 'teacher') {
                            setIsModalOpen(true);
                        } else {
                             alert("Lớp hiện chưa có học sinh nào.");
                        }
                    }
                }}
            />;
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      <Header 
        userRole={userRole}
        onLogout={handleLogout} 
        currentView={currentView}
        onChangeView={(view) => {
            setCurrentView(view);
            // when switching views, deselect student if not on dashboard
            if (view !== 'dashboard') {
                setSelectedStudentId(null);
            }
        }}
        />
      <div className="flex flex-1 overflow-hidden">
        <StudentList
          students={students}
          selectedStudentId={selectedStudentId}
          onSelectStudent={(id) => {
              setSelectedStudentId(id);
              setCurrentView('dashboard');
          }}
          onAddStudent={() => setIsModalOpen(true)}
          userRole={userRole}
        />
        {renderContent()}
      </div>
      <AddStudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddStudent={handleAddStudent}
      />
    </div>
  );
}

export default App;
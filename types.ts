export enum Gender {
  MALE = 'Nam',
  FEMALE = 'Nữ',
}

export interface ParentalAdvice {
  title: string;
  details: string;
}

export interface Assessment {
  heightStatus: string;
  weightStatus: string;
  bmiStatus: string;
  summary: string;
  parentalAdvice: ParentalAdvice[];
  overallStatus: 'Bình thường' | 'Cần chú ý';
}

export interface Measurement {
  id: string;
  date: string; // YYYY-MM-DD
  height: number; // cm
  weight: number; // kg
  bmi?: number;
  assessment?: Assessment;
}

export interface Student {
  id: string;
  name: string;
  dob: string; // YYYY-MM-DD
  gender: Gender;
  photo?: string; // base64 string
  measurements: Measurement[];
  parentPhone?: string;
  healthNotes?: string;
}

export interface Teacher {
  name: string;
}

export interface HealthEvent {
  id: string;
  date: string; // YYYY-MM-DD for sorting
  title: string;
  description: string;
}

export interface MenuItem {
  id: string; // 'monday', 'tuesday', etc.
  day: string;
  meals: string;
}

export interface ClassInfo {
  className: string;
  teachers: [Teacher, Teacher];
  healthSchedule: HealthEvent[];
  menu: MenuItem[];
}
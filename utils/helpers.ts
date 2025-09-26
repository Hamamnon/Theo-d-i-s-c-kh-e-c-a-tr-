
export const calculateAgeInMonths = (dob: string, measurementDate: string): number => {
  const birthDate = new Date(dob);
  const mDate = new Date(measurementDate);
  let months = (mDate.getFullYear() - birthDate.getFullYear()) * 12;
  months -= birthDate.getMonth();
  months += mDate.getMonth();
  return months <= 0 ? 0 : months;
};

export const calculateBmi = (heightCm: number, weightKg: number): number | undefined => {
  if (heightCm <= 0) return undefined;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return parseFloat(bmi.toFixed(2));
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

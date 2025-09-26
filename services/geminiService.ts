import { GoogleGenAI, Type } from "@google/genai";
import type { Student, Measurement, Assessment } from '../types';
import { calculateAgeInMonths } from '../utils/helpers';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const assessmentSchema = {
  type: Type.OBJECT,
  properties: {
    heightStatus: { type: Type.STRING, description: 'Đánh giá chiều cao theo tuổi (ví dụ: Bình thường, Thấp còi).' },
    weightStatus: { type: Type.STRING, description: 'Đánh giá cân nặng theo tuổi (ví dụ: Bình thường, Suy dinh dưỡng, Thừa cân).' },
    bmiStatus: { type: Type.STRING, description: 'Đánh giá BMI theo tuổi nếu trẻ trên 70 tháng (ví dụ: Bình thường, Thừa cân). Trả về "Không áp dụng" nếu dưới 70 tháng.' },
    summary: { type: Type.STRING, description: 'Một câu tóm tắt tổng quan về tình trạng phát triển của trẻ.' },
    parentalAdvice: {
      type: Type.ARRAY,
      description: 'Danh sách các lời khuyên dành cho phụ huynh. Nếu trẻ bình thường, trả về mảng rỗng.',
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'Tiêu đề ngắn gọn, mang tính hành động cho lời khuyên.' },
          details: { type: Type.STRING, description: 'Giải thích chi tiết về lý do và cách thực hiện lời khuyên một cách dễ hiểu.' }
        },
        required: ['title', 'details']
      }
    },
    overallStatus: { type: Type.STRING, description: 'Đánh giá tổng thể cuối cùng. Chỉ trả về "Bình thường" hoặc "Cần chú ý".', enum: ['Bình thường', 'Cần chú ý']}
  },
  required: ['heightStatus', 'weightStatus', 'bmiStatus', 'summary', 'parentalAdvice', 'overallStatus']
};

export const getGrowthAssessment = async (student: Student, measurement: Measurement): Promise<Assessment | null> => {
  try {
    const ageInMonths = calculateAgeInMonths(student.dob, measurement.date);
    const bmiText = measurement.bmi ? `và chỉ số BMI là ${measurement.bmi}` : '';

    const prompt = `Với vai trò là một chuyên gia dinh dưỡng nhi khoa, hãy đánh giá tình trạng phát triển của một trẻ ${student.gender === 'Nam' ? 'trai' : 'gái'}, ${ageInMonths} tháng tuổi, cao ${measurement.height} cm, nặng ${measurement.weight} kg ${bmiText} dựa trên chuẩn tăng trưởng của WHO.
    
    Hãy thực hiện các yêu cầu sau:
    1.  **Phân tích chỉ số:** Đánh giá riêng cho chiều cao, cân nặng, và BMI (chỉ tính nếu trẻ từ 70 tháng tuổi trở lên). Phân loại mỗi chỉ số là: "Bình thường", "Thấp còi", "Thừa cân", "Béo phì", "Suy dinh dưỡng thể nhẹ cân", "Suy dinh dưỡng thể gầy còm".
    2.  **Tóm tắt:** Đưa ra một câu tóm tắt tổng quan, thân thiện.
    3.  **Lời khuyên cho phụ huynh (quan trọng nhất):** Nếu trẻ có chỉ số không bình thường, hãy soạn 2-3 lời khuyên. Mỗi lời khuyên phải được viết dưới dạng lời khuyên trực tiếp, thân thiện, tích cực và mang tính hướng dẫn dành cho phụ huynh. Cấu trúc mỗi lời khuyên bao gồm:
        *   **title:** Một tiêu đề ngắn gọn, súc tích (ví dụ: "Bổ sung thực phẩm giàu kẽm").
        *   **details:** Một đoạn văn giải thích rõ ràng tại sao nó quan trọng và gợi ý cách áp dụng thực tế trong bữa ăn hàng ngày (ví dụ: "Kẽm giúp bé ăn ngon miệng hơn. Mẹ có thể thêm vào thực đơn của bé các món như cháo hàu, thịt bò xào, hoặc các loại hạt...").
        Nếu trẻ phát triển bình thường, trả về một mảng rỗng cho mục này.
    4.  **Đánh giá tổng thể:** Dựa trên tất cả chỉ số, đưa ra một đánh giá cuối cùng: "Bình thường" hoặc "Cần chú ý".

    Vui lòng trả lời bằng tiếng Việt và tuân thủ nghiêm ngặt cấu trúc JSON đã định nghĩa.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: assessmentSchema,
        },
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as Assessment;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return null;
  }
};
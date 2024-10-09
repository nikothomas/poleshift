// Assuming WCJTestData is defined as follows:
export interface WCJTestData {
  SubjectArea: string;
  Score: string;
  Proficiency: string;
  ObservationType: string; // New field to specify the type of observation
  Observation: string; // New field to store the observation text
}

export interface DEMITestData {
  year: string;
  season: string;
  knowledgeLevel: 'Incomplete' | 'Proficient' | 'Strong';
  applicationLevel: 'Incomplete' | 'Proficient' | 'Strong';
  communicationLevel: 'Incomplete' | 'Proficient' | 'Strong';
  knowledgeMessage: string;
  applicationMessage: string;
  communicationMessage: string;
}

// Define the FASTData interface to represent the data structure
export interface FASTData {
  score: number;
  grade: number;
  season: string;
  year: string;
  studentCategory: string | null;
  skills: string[];
}

export interface ProcessedTestData {
  sentences: string[];
  data: Array<Record<string, string | number | null>>;
}

/**
 * Interface representing the structured data from the Teacher Feedback Form.
 * Each key is a question, and its value is an array of answers from teachers.
 */
export interface TeacherFeedbackData {
  [question: string]: string[];
}

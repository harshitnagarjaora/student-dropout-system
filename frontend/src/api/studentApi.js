import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const uploadAndPredict = async (attendanceFile, marksFile, feesFile) => {
  const formData = new FormData();
  formData.append('attendance_file', attendanceFile);
  formData.append('marks_file', marksFile);
  formData.append('fees_file', feesFile);

  try {
    const response = await api.post('/api/upload-and-predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Error processing files');
  }
};

export const getAllStudents = async () => {
  try {
    const response = await api.get('/api/students');
    return response.data;
  } catch (error) {
    throw new Error('Error fetching students');
  }
};

export const sendAlert = async (studentId, message) => {
  try {
    const response = await api.post(`/api/send-alert/${studentId}`, null, {
      params: { message },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error sending alert');
  }
};

export const getStudentCounseling = async (studentId) => {
  try {
    const response = await api.get(`/api/student/${studentId}/counseling`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching counseling data');
  }
};
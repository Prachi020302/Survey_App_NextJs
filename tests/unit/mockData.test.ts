import {
  mockUsers,
  mockSurveys,
  mockResponses,
  mockAnalyticsData,
  mockAuthState,
  mockAdminAuthState,
  mockApiResponses,
  mockFormData,
} from './__mocks__/mockData';

describe('Mock Data Validation', () => {
  describe('mockUsers', () => {
    test('should have valid user structure', () => {
      expect(mockUsers).toHaveLength(3);
      
      mockUsers.forEach(user => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('firstName');
        expect(user).toHaveProperty('lastName');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('role');
        expect(user).toHaveProperty('password');
        expect(user).toHaveProperty('createdAt');
        expect(user).toHaveProperty('updatedAt');
        
        expect(typeof user.id).toBe('string');
        expect(typeof user.firstName).toBe('string');
        expect(typeof user.lastName).toBe('string');
        expect(typeof user.email).toBe('string');
        expect(['User', 'Admin']).toContain(user.role);
        expect(user.createdAt).toBeInstanceOf(Date);
        expect(user.updatedAt).toBeInstanceOf(Date);
      });
    });

    test('should have different roles', () => {
      const roles = mockUsers.map(user => user.role);
      expect(roles).toContain('User');
      expect(roles).toContain('Admin');
    });

    test('should have unique emails', () => {
      const emails = mockUsers.map(user => user.email);
      const uniqueEmails = [...new Set(emails)];
      expect(emails).toHaveLength(uniqueEmails.length);
    });
  });

  describe('mockSurveys', () => {
    test('should have valid survey structure', () => {
      expect(mockSurveys).toHaveLength(2);
      
      mockSurveys.forEach(survey => {
        expect(survey).toHaveProperty('id');
        expect(survey).toHaveProperty('title');
        expect(survey).toHaveProperty('description');
        expect(survey).toHaveProperty('questions');
        expect(survey).toHaveProperty('isActive');
        expect(survey).toHaveProperty('createdBy');
        expect(survey).toHaveProperty('createdAt');
        expect(survey).toHaveProperty('updatedAt');
        
        expect(typeof survey.id).toBe('string');
        expect(typeof survey.title).toBe('string');
        expect(typeof survey.description).toBe('string');
        expect(Array.isArray(survey.questions)).toBe(true);
        expect(typeof survey.isActive).toBe('boolean');
        expect(survey.createdAt).toBeInstanceOf(Date);
        expect(survey.updatedAt).toBeInstanceOf(Date);
      });
    });

    test('should have valid question structure', () => {
      mockSurveys.forEach(survey => {
        survey.questions.forEach(question => {
          expect(question).toHaveProperty('id');
          expect(question).toHaveProperty('label');
          expect(question).toHaveProperty('type');
          
          expect(typeof question.id).toBe('string');
          expect(typeof question.label).toBe('string');
          expect(['text', 'radio', 'checkbox', 'select', 'number']).toContain(question.type);
          
          if (question.options) {
            expect(Array.isArray(question.options)).toBe(true);
            question.options.forEach(option => {
              expect(typeof option).toBe('string');
            });
          }
        });
      });
    });

    test('should have at least one active and one inactive survey', () => {
      const activeStatuses = mockSurveys.map(survey => survey.isActive);
      expect(activeStatuses).toContain(true);
      expect(activeStatuses).toContain(false);
    });
  });

  describe('mockResponses', () => {
    test('should have valid response structure', () => {
      expect(mockResponses).toHaveLength(2);
      
      mockResponses.forEach(response => {
        expect(response).toHaveProperty('id');
        expect(response).toHaveProperty('surveyId');
        expect(response).toHaveProperty('userId');
        expect(response).toHaveProperty('answers');
        expect(response).toHaveProperty('submittedAt');
        expect(response).toHaveProperty('createdAt');
        expect(response).toHaveProperty('updatedAt');
        
        expect(typeof response.id).toBe('string');
        expect(typeof response.surveyId).toBe('string');
        expect(typeof response.userId).toBe('string');
        expect(Array.isArray(response.answers)).toBe(true);
        expect(response.submittedAt).toBeInstanceOf(Date);
        expect(response.createdAt).toBeInstanceOf(Date);
        expect(response.updatedAt).toBeInstanceOf(Date);
      });
    });

    test('should have valid answer structure', () => {
      mockResponses.forEach(response => {
        response.answers.forEach(answer => {
          expect(answer).toHaveProperty('questionId');
          expect(answer).toHaveProperty('selectedOptions');
          
          expect(typeof answer.questionId).toBe('string');
          expect(Array.isArray(answer.selectedOptions)).toBe(true);
          answer.selectedOptions.forEach(option => {
            expect(typeof option).toBe('string');
          });
        });
      });
    });

    test('should reference existing surveys and users', () => {
      const surveyIds = mockSurveys.map(survey => survey.id);
      const userIds = mockUsers.map(user => user.id);
      
      mockResponses.forEach(response => {
        expect(surveyIds).toContain(response.surveyId);
        expect(userIds).toContain(response.userId);
      });
    });
  });

  describe('mockAnalyticsData', () => {
    test('should have valid analytics structure', () => {
      expect(mockAnalyticsData).toHaveProperty('totalSurveys');
      expect(mockAnalyticsData).toHaveProperty('totalResponses');
      expect(mockAnalyticsData).toHaveProperty('totalUsers');
      expect(mockAnalyticsData).toHaveProperty('chartData');
      
      expect(typeof mockAnalyticsData.totalSurveys).toBe('number');
      expect(typeof mockAnalyticsData.totalResponses).toBe('number');
      expect(typeof mockAnalyticsData.totalUsers).toBe('number');
      expect(typeof mockAnalyticsData.chartData).toBe('object');
    });

    test('should have valid chart data structure', () => {
      const { chartData } = mockAnalyticsData;
      
      expect(chartData).toHaveProperty('dates');
      expect(chartData).toHaveProperty('surveys');
      expect(chartData).toHaveProperty('responses');
      
      expect(Array.isArray(chartData.dates)).toBe(true);
      expect(Array.isArray(chartData.surveys)).toBe(true);
      expect(Array.isArray(chartData.responses)).toBe(true);
      
      // Arrays should have the same length
      expect(chartData.dates).toHaveLength(chartData.surveys.length);
      expect(chartData.dates).toHaveLength(chartData.responses.length);
    });

    test('should have consistent totals with array data', () => {
      expect(mockAnalyticsData.totalSurveys).toBe(mockSurveys.length);
      expect(mockAnalyticsData.totalResponses).toBe(mockResponses.length);
      
      // Only count users with role "User" as per analytics requirements
      const userRoleUsers = mockUsers.filter(user => user.role === 'User');
      expect(mockAnalyticsData.totalUsers).toBe(userRoleUsers.length);
    });
  });

  describe('mockAuthState', () => {
    test('should have valid auth state structure', () => {
      expect(mockAuthState).toHaveProperty('isAuthenticated');
      expect(mockAuthState).toHaveProperty('token');
      expect(mockAuthState).toHaveProperty('user');
      expect(mockAuthState).toHaveProperty('id');
      expect(mockAuthState).toHaveProperty('email');
      expect(mockAuthState).toHaveProperty('role');
      expect(mockAuthState).toHaveProperty('firstName');
      expect(mockAuthState).toHaveProperty('lastName');
      
      expect(mockAuthState.isAuthenticated).toBe(true);
      expect(typeof mockAuthState.token).toBe('string');
      expect(typeof mockAuthState.user).toBe('object');
      expect(mockAuthState.role).toBe('User');
    });

    test('should reference a valid user', () => {
      const userIds = mockUsers.map(user => user.id);
      expect(userIds).toContain(mockAuthState.id);
    });
  });

  describe('mockAdminAuthState', () => {
    test('should have admin role', () => {
      expect(mockAdminAuthState.role).toBe('Admin');
      expect(mockAdminAuthState.isAuthenticated).toBe(true);
    });

    test('should reference a valid admin user', () => {
      const adminUsers = mockUsers.filter(user => user.role === 'Admin');
      const adminIds = adminUsers.map(user => user.id);
      expect(adminIds).toContain(mockAdminAuthState.id);
    });
  });

  describe('mockApiResponses', () => {
    test('should have consistent API response structure', () => {
      Object.values(mockApiResponses).forEach(response => {
        expect(response).toHaveProperty('success');
        expect(response).toHaveProperty('statusCode');
        expect(response).toHaveProperty('message');
        
        expect(typeof response.success).toBe('boolean');
        expect(typeof response.statusCode).toBe('number');
        expect(typeof response.message).toBe('string');
        
        if (response.data) {
          expect(response.data).toBeDefined();
        }
      });
    });

    test('should have successful responses', () => {
      Object.values(mockApiResponses).forEach(response => {
        expect(response.success).toBe(true);
        expect(response.statusCode).toBe(200);
      });
    });
  });

  describe('mockFormData', () => {
    test('should have valid form data structures', () => {
      expect(mockFormData).toHaveProperty('survey');
      expect(mockFormData).toHaveProperty('response');
      expect(mockFormData).toHaveProperty('profile');
      expect(mockFormData).toHaveProperty('login');
      expect(mockFormData).toHaveProperty('register');
      
      // Survey form data
      expect(mockFormData.survey).toHaveProperty('title');
      expect(mockFormData.survey).toHaveProperty('description');
      expect(mockFormData.survey).toHaveProperty('questions');
      expect(Array.isArray(mockFormData.survey.questions)).toBe(true);
      
      // Response form data
      expect(mockFormData.response).toHaveProperty('surveyId');
      expect(mockFormData.response).toHaveProperty('userId');
      expect(mockFormData.response).toHaveProperty('answers');
      expect(Array.isArray(mockFormData.response.answers)).toBe(true);
      
      // Profile form data
      expect(mockFormData.profile).toHaveProperty('firstName');
      expect(mockFormData.profile).toHaveProperty('lastName');
      expect(mockFormData.profile).toHaveProperty('email');
      
      // Login form data
      expect(mockFormData.login).toHaveProperty('email');
      expect(mockFormData.login).toHaveProperty('password');
      
      // Register form data
      expect(mockFormData.register).toHaveProperty('firstName');
      expect(mockFormData.register).toHaveProperty('lastName');
      expect(mockFormData.register).toHaveProperty('email');
      expect(mockFormData.register).toHaveProperty('password');
      expect(mockFormData.register).toHaveProperty('role');
    });
  });
});

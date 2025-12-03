import { validateInput, userSchemas } from '../validation';

describe('Validation', () => {
  describe('userSchemas.signIn', () => {
    it('should validate correct sign in data', async () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await validateInput(userSchemas.signIn, validData);
      expect(result).toEqual(validData);
    });

    it('should reject invalid email', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };

      await expect(
        validateInput(userSchemas.signIn, invalidData)
      ).rejects.toThrow();
    });

    it('should reject empty password', async () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      };

      await expect(
        validateInput(userSchemas.signIn, invalidData)
      ).rejects.toThrow();
    });
  });

  describe('userSchemas.signUp', () => {
    it('should validate correct sign up data', async () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123',
        firstName: 'Test',
        lastName: 'User',
        role: 'student',
        organizationId: '123e4567-e89b-12d3-a456-426614174000',
      };

      const result = await validateInput(userSchemas.signUp, validData);
      expect(result.email).toBe(validData.email);
    });

    it('should reject weak password', async () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'weak',
        firstName: 'Test',
        lastName: 'User',
        role: 'student',
        organizationId: '123e4567-e89b-12d3-a456-426614174000',
      };

      await expect(
        validateInput(userSchemas.signUp, invalidData)
      ).rejects.toThrow();
    });
  });
});

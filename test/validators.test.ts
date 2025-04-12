import { describe, expect, test } from '@jest/globals';
import { isValidSendMessageArgs, isValidSendJsonArgs, SendMessageArgs, SendJsonArgs } from '../src/utils/validators.js';

describe('Validator Functions', () => {
  describe('isValidSendMessageArgs', () => {
    test('should return true for valid arguments with content', () => {
      const args = { content: 'Hello, world!' };
      expect(isValidSendMessageArgs(args)).toBe(true);
    });

    test('should return true for valid arguments with content, username and avatar_url', () => {
      const args = { 
        content: 'Hello, world!', 
        username: 'TestUser', 
        avatar_url: 'https://example.com/avatar.png' 
      };
      expect(isValidSendMessageArgs(args)).toBe(true);
    });

    test('should return false for null argument', () => {
      expect(isValidSendMessageArgs(null)).toBe(false);
    });

    test('should return false for non-object argument', () => {
      expect(isValidSendMessageArgs('string')).toBe(false);
      expect(isValidSendMessageArgs(123)).toBe(false);
    });

    test('should return false when content is missing', () => {
      const args = { username: 'TestUser' };
      expect(isValidSendMessageArgs(args)).toBe(false);
    });

    test('should return false when content is not a string', () => {
      const args = { content: 123 };
      expect(isValidSendMessageArgs(args)).toBe(false);
    });
  });

  describe('isValidSendJsonArgs', () => {
    test('should return true for valid arguments with body as object', () => {
      const args = { body: { message: 'Hello, world!' } };
      expect(isValidSendJsonArgs(args)).toBe(true);
    });

    test('should return false for null argument', () => {
      expect(isValidSendJsonArgs(null)).toBe(false);
    });

    test('should return false for non-object argument', () => {
      expect(isValidSendJsonArgs('string')).toBe(false);
      expect(isValidSendJsonArgs(123)).toBe(false);
    });

    test('should return false when body is missing', () => {
      const args = { otherField: 'value' };
      expect(isValidSendJsonArgs(args)).toBe(false);
    });

    test('should return false when body is not an object', () => {
      const args = { body: 'not an object' };
      expect(isValidSendJsonArgs(args)).toBe(false);
    });

    test('should return false when body is null', () => {
      const args = { body: null };
      expect(isValidSendJsonArgs(args)).toBe(false);
    });
  });
}); 
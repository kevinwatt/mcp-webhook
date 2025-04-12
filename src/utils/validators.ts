export interface SendMessageArgs {
  content: string;
  username?: string;
  avatar_url?: string;
}

export interface SendJsonArgs {
  body: object;
}

/**
 * Validates if the provided arguments are valid for sending a message
 * @param args - The arguments to validate
 * @returns True if arguments are valid, false otherwise
 */
export const isValidSendMessageArgs = (args: unknown): args is SendMessageArgs => {
  if (typeof args !== 'object' || args === null) {
    return false;
  }
  const { content } = args as Record<string, unknown>;
  return typeof content === 'string';
};

/**
 * Validates if the provided arguments are valid for sending JSON
 * @param args - The arguments to validate
 * @returns True if arguments are valid, false otherwise
 */
export const isValidSendJsonArgs = (args: unknown): args is SendJsonArgs => {
  if (typeof args !== 'object' || args === null) {
    return false;
  }
  const { body } = args as Record<string, unknown>;
  return typeof body === 'object' && body !== null;
};
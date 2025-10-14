export const mockEmailService = {
  logger: console,
  config: {
    enabled: true,
    from: {
      name: 'Test Sender',
      email: 'test@example.com',
    },
  },
  sendEmail: jest.fn(),
};
export const users = [
  {
    id: "1",
    email: "abhangpaturkar0709@gmail.com",
    password: "Pass@123", // In real app, this would be properly hashed
    name: "Demo User",
  },
];

export const links = [
  {
    id: "1",
    userId: "1",
    originalUrl: "https://www.example.com/very/long/url/that/needs/shortening",
    shortCode: "abc123",
    encryptedUrl: "", // Will be populated when encryption is implemented
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    clicks: 42,
    isActive: true,
  },
];

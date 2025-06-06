import CryptoJS from "crypto-js";
import { links } from "../data/mockData";

const ENCRYPTION_KEY = "your-secret-key"; // In production, use environment variables

export const linkService = {
  encryptUrl: (url, encryptionKey = ENCRYPTION_KEY) => {
    return CryptoJS.AES.encrypt(url, encryptionKey).toString();
  },

  decryptUrl: (encryptedUrl, encryptionKey = ENCRYPTION_KEY) => {
    const bytes = CryptoJS.AES.decrypt(encryptedUrl, encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  },

  generateShortCode: () => {
    return Math.random().toString(36).substring(2, 8);
  },

  createLink: (
    userId,
    originalUrl,
    p0, // unused param, kept for compatibility
    expiresAt,
    useEncryption, // unused param, kept for compatibility
    p1, // unused param, kept for compatibility
    expiresAtOverride // nullable expiration date param, unused here (you had duplicate names)
  ) => {
    const shortCode = linkService.generateShortCode();
    const encryptedUrl = linkService.encryptUrl(originalUrl);

    const newLink = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      originalUrl,
      shortCode,
      encryptedUrl,
      createdAt: new Date().toISOString(),
      expiresAt, // Using the passed expiresAt param
      clicks: 0,
      isActive: true,
    };

    links.push(newLink);
    return newLink;
  },

  getUserLinks: (userId) => {
    return links;
    // return links.filter((link) => link.userId === userId);
  },

  deleteLink: (id) => {
    const index = links.findIndex((link) => link.id === id);
    if (index !== -1) {
      links.splice(index, 1);
    }
  },

  incrementClicks: (shortCode) => {
    const link = links.find((link) => link.shortCode === shortCode);
    if (link) {
      link.clicks += 1;
    }
  },
};

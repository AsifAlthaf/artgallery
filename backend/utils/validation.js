// backend/utils/validation.js

export const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  // At least 6 chars
  return typeof password === 'string' && password.length >= 6;
};

const BANNED_WORDS = [
  'admin', 'administrator', 'system', 'root', 'support', 'help', 'info',
  'fuck', 'shit', 'bitch', 'asshole', 'dick', 'pussy', 'cunt', 'whore', 
  'slut', 'bastard', 'nigger', 'faggot', 'spic', 'chink', 'gook', 'twat', 'wanker'
];

export const isProfane = (username) => {
  const normalized = username.toLowerCase();
  // Check exact matches or substantial substrings if necessary
  // Simplest approach: if it contains any banned word
  return BANNED_WORDS.some(word => normalized.includes(word));
};

export const validateUsername = (username) => {
  if (isProfane(username)) return false;

  // 3-30 chars, alphanumeric, underscores, dashes, dots
  const re = /^[a-z0-9._-]{3,30}$/;
  if (!re.test(username)) return false;
  
  // At most one dot, one dash
  const dashCount = (username.match(/-/g) || []).length;
  const dotCount = (username.match(/\./g) || []).length;
  return dashCount <= 1 && dotCount <= 1;
};

export const validateRegistrationInput = (name, email, password, username) => {
  if (!name || name.trim().length === 0) return { isValid: false, message: 'Name is required' };
  if (!email || !validateEmail(email)) return { isValid: false, message: 'Valid email is required' };
  if (!password || !validatePassword(password)) return { isValid: false, message: 'Password must be at least 6 characters' };
  
  if (username) {
     if (isProfane(username)) return { isValid: false, message: 'Username contains inappropriate or reserved words' };
     if (!validateUsername(username)) return { isValid: false, message: 'Invalid username format (3-30 chars, alphanumeric)' };
  }
  
  return { isValid: true };
};

export const PLATFORM_LIMITS = {
  Twitter: 280,
  Instagram: 2200,
  LinkedIn: 3000,
  Facebook: 63206
};

export const validationStrategies = {
  Twitter(content) {
    const limit = PLATFORM_LIMITS.Twitter;
    return { isValid: content.length <= limit, maxCharacters: limit };
  },

  Facebook(content) {
    const limit = PLATFORM_LIMITS.Facebook;
    return { isValid: content.length <= limit, maxCharacters: limit };
  },

  LinkedIn(content) {
    const limit = PLATFORM_LIMITS.LinkedIn;
    return { isValid: content.length <= limit, maxCharacters: limit };
  },

  Instagram(content) {
    const limit = PLATFORM_LIMITS.Instagram;
    return { isValid: content.length <= limit, maxCharacters: limit };
  }
};

export function validateContent(platform, content) {
  const strategy = validationStrategies[platform];

  if (!strategy) {
    return { isValid: true, maxCharacters: 0 };
  }

  return strategy(content);
}

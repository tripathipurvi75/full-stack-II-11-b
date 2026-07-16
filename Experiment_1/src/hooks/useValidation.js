import { useEffect, useState } from 'react';
import { validateContent } from '../utils/platformLimits';

export default function useValidation(platform, content) {
  const [charCount, setCharCount] = useState(0);
  const [maxCharacters, setMaxCharacters] = useState(0);
  const [isExceeded, setIsExceeded] = useState(false);

  useEffect(() => {
    const currentLength = content.length;
    const result = validateContent(platform, content);

    setCharCount(currentLength);
    setMaxCharacters(result.maxCharacters);
    setIsExceeded(!result.isValid);
  }, [platform, content]);

  return { charCount, maxCharacters, isExceeded };
}

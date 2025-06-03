
export const validateUrl = (url: string): boolean => {
  try {
    // Add https:// if no protocol is provided
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    
    console.log('Validating URL:', normalizedUrl);
    
    // Create URL object to validate format
    const urlObj = new URL(normalizedUrl);
    
    console.log('URL object created:', {
      protocol: urlObj.protocol,
      hostname: urlObj.hostname,
      pathname: urlObj.pathname,
      search: urlObj.search,
      hash: urlObj.hash
    });
    
    // Must use HTTP or HTTPS protocol
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      console.log('Invalid protocol:', urlObj.protocol);
      return false;
    }
    
    // Must have valid hostname
    if (!urlObj.hostname || urlObj.hostname.length < 3) {
      console.log('Invalid hostname:', urlObj.hostname);
      return false;
    }
    
    // Must contain at least one dot (like example.com)
    if (!urlObj.hostname.includes('.')) {
      console.log('Hostname missing dot:', urlObj.hostname);
      return false;
    }
    
    console.log('URL validation passed');
    return true;
  } catch (error) {
    console.log('URL validation error:', error);
    return false;
  }
};

export const normalizeUrl = (url: string): string => {
  let normalizedUrl = url.trim();
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = 'https://' + normalizedUrl;
  }
  return normalizedUrl;
};

const BASE_URL = 'http://localhost:5000';

export const getFullUrl = (url, name = 'User') => {
  if (!url) return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`;
  if (url.startsWith('http')) return url;
  return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

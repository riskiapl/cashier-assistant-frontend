export function convertToQueryString(obj) {
  if (!obj || Object.keys(obj).length === 0) {
    return "";
  }

  const params = new URLSearchParams();

  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value);
    }
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

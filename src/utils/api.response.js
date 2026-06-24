function decodeObfuscatedData(obfuscatedPayload) {
  try {
    const parts = obfuscatedPayload.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid payload format');
    }

    const encodedData = parts[1];
    const obfuscated = atob(encodedData);

    let base64String = '';
    for (let i = 0; i < obfuscated.length; i++) {
      const charCode = obfuscated.charCodeAt(i);
      const originalChar = charCode - (i % 7) - 3;
      base64String += String.fromCharCode(originalChar);
    }

    const decodedString = atob(base64String);
    return JSON.parse(decodedString);
  } catch {
    return null;
  }
}

function processApiResponse(apiResponse) {
  if (!apiResponse || !apiResponse.data) {
    return null;
  }

  if (apiResponse.data.secure === true && apiResponse.data.payload) {
    return decodeObfuscatedData(apiResponse.data.payload);
  }

  return apiResponse.data;
}

function debugApiResponse() {}

export { processApiResponse, debugApiResponse };

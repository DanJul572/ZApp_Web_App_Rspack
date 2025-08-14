const readJSONFile = (event) => {
  return new Promise((resolve, reject) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonContent = JSON.parse(e.target.result);
          resolve(jsonContent);
        } catch (error) {
          console.error('Error parsing JSON file : ', error);
          reject(error);
        }
      };
      reader.readAsText(file);
    } else {
      console.error('Invalid file type. Please choose a JSON file');
      reject('Invalid file type');
    }
  });
};

const extractFileNames = (fileName) => {
  if (fileName) {
    const underscoreIndex = fileName.indexOf('_');
    if (underscoreIndex !== -1) {
      return fileName.substring(underscoreIndex + 1);
    }
    return fileName;
  }
  return '';
};

const getFileFromBuffer = (data) => {
  const bufferFormat = new Uint8Array(data.data.data);
  const blob = new Blob([bufferFormat], { type: data.type });
  const file = new File([blob], extractFileNames(data.name), {
    type: data.type,
  });
  return file;
};

export { readJSONFile, extractFileNames, getFileFromBuffer };

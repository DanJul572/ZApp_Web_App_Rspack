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

export { readJSONFile };

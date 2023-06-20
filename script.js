const form = document.querySelector('#api-form');
const apiFile = document.querySelector('#api-file');
const customFileLabel = document.querySelector('#custom-file-label');
const responseDiv = document.querySelector('#response');
const topicIdSelect = document.querySelector('#topic-id');

apiFile.addEventListener('change', () => {
  if (apiFile.files.length > 0) {
    customFileLabel.textContent = apiFile.files[0].name;
  } else {
    customFileLabel.textContent = 'No file chosen';
  }
});

form.addEventListener('submit', e => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('file', apiFile.files[0]);
  formData.append('topic_id', topicIdSelect.value);

  // Display "Loading..." message
  responseDiv.innerHTML = '<p>Loading...</p>';

  fetch('/send-data', {
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const { hashedImage, topic_id } = data;
      const filename = apiFile.files[0].name;
      const transaction_id = data.data.transaction_id;
      const explorer_url = data.data.explorer_url.replace('-testnet', '');

      responseDiv.innerHTML = `
        <p>File name: ${filename}</p>
        <p>Hash of file: ${hashedImage}</p>
        <p>Topic ID: ${topic_id}</p>
        <p>Transaction ID: ${transaction_id}</p>
        <p>Explorer URL: <a href="${explorer_url}" target="_blank">${explorer_url}</a></p>
        <p>Ok.....Now what?: <a href="https://www.easyhash.com" target="_blank">www.easyhash.com</a></p>`;
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
      responseDiv.innerHTML = '<p>An error occurred while sending data to the API.</p>';
    });
});

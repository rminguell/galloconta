document.getElementById('predictButton').addEventListener('click', async function(e) {
    e.preventDefault();

    const baseUrl = 'https://galloconta-419024990899.europe-southwest1.run.app';

    const formData = new FormData();
    formData.append('file', document.getElementById('file-upload').files[0]);

    const progress = document.getElementById('progress');
    const result = document.getElementById('result');
    const feedback = document.getElementById('feedback');
    const upload = document.getElementById('uploadForm');
    const reload = document.getElementById('reload')
    const objectCount = document.getElementById('objectCount')

    progress.style.display = 'flex';

    const response = await fetch(baseUrl + '/upload', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        console.error('Error en la subida del archivo:', response.statusText);
        alert('Hubo un error al procesar la imagen.');
        progress.style.display = 'none';
        return;
    }

    const data = await response.json();

    const predictedImagePath = baseUrl + '/output/' + data.result_image.split('/').pop();
    document.getElementById('predictedImage').src = predictedImagePath;
    document.getElementById('objectCount').innerText = data.object_count + ' grullas';

    upload.style.display = 'none';
    progress.style.display = 'none';
    result.style.display = 'block';
    feedback.style.display = 'block';
    

    const predictedFileName = data.result_image.split('/').pop();

    document.getElementById('likeButton').onclick = () => sendFeedback(baseUrl, true, predictedFileName);
    document.getElementById('dislikeButton').onclick = () => sendFeedback(baseUrl, false, predictedFileName);

    document.getElementById('file').value = '';
});

document.getElementById('param_1').addEventListener('input', function() {
    document.getElementById('param_1_text').value = this.value;
});

document.getElementById('param_2').addEventListener('input', function() {
    document.getElementById('param_2_text').value = this.value;
});

document.getElementById('file-upload').addEventListener('input', function() {
    document.getElementById('file_name').textContent = this.files[0].name
    if (this.files[0].name) {
        document.getElementById('select-file-btn').style.display = 'none';
        document.getElementById('predictButton').style.display = 'block';
    }
});

document.getElementById('select-file-btn').addEventListener('click', function() {
    document.getElementById('file-upload').click();
});

function handleFeedback() {

    const feedback = document.getElementById('feedback');
    feedback.style.display = 'none';

    const reload= document.getElementById('reload');
    reload.style.display ='flex';
    document.getElementById('reloadButton').onclick = () => location.reload();
}

async function sendFeedback(url, like, fileName) {
    const response = await fetch(url + '/feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ like, fileName }),
    });

    if (!response.ok) {
        console.error('Error al enviar feedback:', response.statusText);
        alert('No se pudo registrar el feedback.');
        return;
    } else {
        handleFeedback()
    }
}

const translations = {
    "es": {
        "title": "GalloConta",
        "subtitle": "Calcula cuántas grullas hay en una imagen",
        "file_upload_label": "Imagen a procesar:",
        "select_file_btn": "Subir foto",
        "file_name_text": "Ningún archivo seleccionado",
        "sensitivity_label": "Sensibilidad:",
        "remove_duplicates_label": "Eliminar duplicados:",
        "predict_button": "Contar grullas",
        "processing_text": "Procesando la imagen, por favor espera...",
        "save_button": "Guardar",
        "feedback_text": "¿Te gusta el resultado?",
        "like_button": "Si",
        "dislike_button": "No",
        "feedback_info": "Tu opinión es importante. Las imágenes con valoración negativa serán utilizadas para mejorar la IA de GalloConta en el próximo entrenamiento",
        "adjust_button": "Ajustar parámetros",
        "reload_button": "Subir otra foto",
        "footer_contact": "Si tienes cualquier duda o sugerencia, contacta a través de <a href='mailto:rodrigo.minguell@yahoo.com'>correo electrónico</a> o <a href='https://www.linkedin.com/in/rodrigo-minguell' target='_blank'>LinkedIn</a>",
        "footer_copy": "&copy; 2025 R. Minguell"
    },
    "en": {
        "title": "GalloConta",
        "subtitle": "Calculate how many cranes are in an image",
        "file_upload_label": "Image to process:",
        "select_file_btn": "Upload photo",
        "file_name_text": "No file selected",
        "sensitivity_label": "Sensitivity:",
        "remove_duplicates_label": "Remove duplicates:",
        "predict_button": "Count cranes",
        "processing_text": "Processing the image, please wait...",
        "save_button": "Save",
        "feedback_text": "Do you like the result?",
        "like_button": "Yes",
        "dislike_button": "No",
        "feedback_info": "Your feedback is important. Images with negative feedback will be used to improve GalloConta's AI in the next training",
        "adjust_button": "Adjust parameters",
        "reload_button": "Upload another photo",
        "footer_contact": "If you have any questions or suggestions, contact via <a href='mailto:rodrigo.minguell@yahoo.com'>email</a> or <a href='https://www.linkedin.com/in/rodrigo-minguell' target='_blank'>LinkedIn</a>",
        "footer_copy": "&copy; 2025 R. Minguell"
    }
};

function setLanguage(lang) {
    document.getElementById('title').innerText = translations[lang].title;
    document.getElementById('subtitle').innerText = translations[lang].subtitle;
    document.getElementById('file_upload_label').innerText = translations[lang].file_upload_label;
    document.getElementById('select_file_btn').innerText = translations[lang].select_file_btn;
    document.getElementById('file_name').innerText = translations[lang].file_name_text;
    document.getElementById('sensitivity_label').innerText = translations[lang].sensitivity_label;
    document.getElementById('remove_duplicates_label').innerText = translations[lang].remove_duplicates_label;
    document.getElementById('predictButton').innerText = translations[lang].predict_button;
    document.getElementById('processing_text').innerText = translations[lang].processing_text;
    document.getElementById('save_button').innerText = translations[lang].save_button;
    document.getElementById('feedback_text').innerText = translations[lang].feedback_text;
    document.getElementById('like_button').innerText = translations[lang].like_button;
    document.getElementById('dislike_button').innerText = translations[lang].dislike_button;
    document.getElementById('feedback_info').innerText = translations[lang].feedback_info;
    document.getElementById('adjust_button').innerText = translations[lang].adjust_button;
    document.getElementById('reload_button').innerText = translations[lang].reload_button;
    document.getElementById('footer_contact').innerHTML = translations[lang].footer_contact;
    document.getElementById('footer_copy').innerHTML = translations[lang].footer_copy;
}

function changeLanguage(event) {
    const lang = event.target.value;  
    setLanguage(lang);  
}

setLanguage('es');

import React from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// הגדרת מקור העובד לגרסה הנכונה
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.js`;

const FileUpload: React.FC = () => {
    const url = 'https://businessman-api.onrender.com'

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; // הקובץ הראשון
        if (file) {
            const allowedTypes = ['application/pdf', 'text/plain', 'image/jpeg', 'image/png']; // סוגי קבצים מותרים
            if (allowedTypes.includes(file.type)) {
                const formData = new FormData();
                formData.append('file', file);
    
                try {
                    const response = await fetch(`${url}/TODO: .................`, {
                        method: 'POST',
                        body: formData,
                    });
    
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
    
                    const data = await response.json();
                    console.log('File uploaded successfully:', data);
                } catch (error) {
                    console.log('Error uploading file:', error);
                    alert('שגיאה בהעלאת הקובץ.');
                }
            } else {
                alert("אנא בחר קובץ בפורמט PDF, טקסט או תמונה.");
            }
        } else {
            alert("אנא בחר קובץ.");
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} accept="application/pdf" />
            
            
        </div>
    );
};

export default FileUpload;

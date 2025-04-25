import { useState } from "react";
import axios from "axios";

const FileUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const url = import.meta.env.VITE_API_URL

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setMessage(null);
            setError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!file) {
            setError("יש לבחור קובץ לפני השליחה");
            return;
        }

        const formData = new FormData();
        formData.append("fileUpload", file);

        try {
            const response = await axios.post(`${url}/FileUpload/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setMessage(response.data);
            setError(null);
        } catch (err: any) {
            const msg = err.response?.data || "אירעה שגיאה בהעלאת הקובץ";
            setError(msg);
            setMessage(null);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} accept=".jpg,.png,.pdf,.docx,.txt" />
            <button type="submit">העלה קובץ</button>

            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
    );
};

export default FileUpload;
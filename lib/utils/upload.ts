export type UploadResponse = {
    url: string;
    error?: string;
};

export async function uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Failed to upload file");
    }

    const data: UploadResponse = await response.json();
    if (data.error) throw new Error(data.error);

    return data.url;
} 
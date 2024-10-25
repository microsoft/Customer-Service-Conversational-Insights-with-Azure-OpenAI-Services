import { fetchRaw, httpClient } from "../utils/httpClient/httpClient";


export async function UploadFile(formData: FormData){
    const response = await httpClient.upload(`${window.ENV.API_URL}/api/Storage/Upload`, formData);

    return response;
}

export async function UploadMultipleFiles(files: File[]){
    const formData = new FormData();

    files.forEach((file, index) => {
        formData.append(`file[${index}]`, file);
    });

    const response = await httpClient.upload(`${window.ENV.API_URL}/api/Storage/Upload`, formData);

    return response;
}

export async function GetFile(path: string){
    const encodedPath = encodeURIComponent(path);
    const fullPath = `${window.ENV.API_URL}/api/Storage?path=${encodedPath}`;
    const response = await fetchRaw(fullPath, { method: 'GET' });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    return blob;
}

export async function GetImage(path: string){
    const fullPath = `${window.ENV.API_URL}/api/Storage?path=${path}`;
    const response = await fetchRaw(fullPath, { method: 'GET' });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    return blob;
}

export async function downloadFile(path: string, fileName: string) {
    const encodedPath = encodeURIComponent(path);
    const fullPath = `${window.ENV.API_URL}/api/Storage?path=${encodedPath}`;
    await httpClient.download(fullPath, fileName);
}






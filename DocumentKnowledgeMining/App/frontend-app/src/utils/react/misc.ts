export function getEnumKeyByEnumValue<T extends { [index: string]: string }>(
    myEnum: T,
    enumValue: string
): keyof T | null {
    const keys = Object.keys(myEnum).filter((x) => myEnum[x] == enumValue);
    return keys.length > 0 ? keys[0] : null;
}

export async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function convertBase64Async(file: Blob): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
            reject(error);
        };
    });
}

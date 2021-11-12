export const urlToBase64Image = async (url: string) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return fileToBase64Image(blob)
}

export const fileToBase64Image = (blob: File | Blob) => {
    return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob); 
        reader.onloadend = () => {
            const base64data = reader.result;   
            resolve(`${base64data}`);
        }
    });
}

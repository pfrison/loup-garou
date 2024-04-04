
export type AccountInfos = {
    username: string,
    iconColorBg: string,
    iconColorFg: string
}

export type ProfilePicture = {
    username: string,
    image: string
}

export async function blobToDataURL(blob: Blob): Promise<string> {
    return new Promise<string>((resvole) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => resvole(reader.result as string)
    });
}

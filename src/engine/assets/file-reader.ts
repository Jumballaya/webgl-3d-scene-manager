export async function readImageFile(file: File): Promise<HTMLImageElement> {
  const fileReader = new FileReader();
  return new Promise((res, rej) => {
    fileReader.onload = () => {
      const img = new Image();
      img.onload = () => {
        res(img);
      };
      img.title = file.name;
      img.src = fileReader.result as string;
    };
    fileReader.onerror = (e) => {
      rej(e);
    };
    fileReader.readAsDataURL(file);
  });
}

export async function readTextFile(file: File): Promise<string> {
  const fileReader = new FileReader();
  return new Promise((res, rej) => {
    fileReader.onload = () => {
      res(fileReader.result as string);
    };
    fileReader.onerror = (e) => {
      rej(e);
    };
    fileReader.readAsText(file);
  });
}

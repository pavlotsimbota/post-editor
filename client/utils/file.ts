export const readFile = (
  file: File
): Promise<Partial<{ url: string; width: number; height: number }>> => {
  return new Promise((res, rej) => {
    if (!file) {
      res({});
      return;
    }
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        res({
          url: event!.target!.result as string,
          width: img.width,
          height: img.height,
        });
      };
      img.src = event!.target!.result as string;
    };
    reader.onerror = function (event) {
      rej(event!.target!.error);
    };
    reader.readAsDataURL(file);
  });
};

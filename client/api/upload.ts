import { fetch } from '../utils/fetch';

export const uploadFile = async (file: File, imageMeta) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('meta', JSON.stringify(imageMeta));
    const { data } = (await fetch({
      method: 'post',
      url: '/upload',
      data: formData,
      params: imageMeta,
    })) as any;

    return data.file;
  } catch (e) {
    console.log(e);
    return {};
  }
};

export const fetchUploads = async () => {
  try {
    const { data } = (await fetch({
      method: 'get',
      url: '/upload',
    })) as any;

    return data.files;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const deleteUpload = async (id: string) => {
  try {
    const { data } = (await fetch({
      method: 'delete',
      url: '/upload',
      data: {
        id,
      },
    })) as any;

    return data.file;
  } catch (e) {
    console.log(e);
    return {};
  }
};

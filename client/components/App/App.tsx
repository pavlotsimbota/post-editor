import React, { useState, useRef, useEffect } from 'react';
import { uploadFile, fetchUploads, deleteUpload } from '../../api/upload';
import { readFile } from '../../utils/file';
import { File } from '../../types';

import s from './styles.module.css';

export const App = () => {
  const input = useRef<HTMLInputElement>(null);
  const [state, setState] = useState({
    image: {} as any,
    images: [] as File[],
    file: null,
  });

  const getImages = async () => {
    const images = await fetchUploads();
    setState(prev => ({ ...prev, images }));
  };

  const handleChangeFile = async ({ target: { files } }) => {
    if (!files || !files[0]) return;

    const image = await readFile(files[0]);
    setState(prev => ({ ...prev, image, file: files[0] }));
  };

  const handleDeleteCurrentFile = () => {
    input.current!.files = null;
    input.current!.value = '';
    setState(prev => ({ ...prev, image: {} }));
  };

  const handleUpload = async () => {
    if (!state.file) return;
    const file = await uploadFile(state.file, {
      width: state.image.width,
      height: state.image.height,
    });
    input.current!.files = null;
    input.current!.value = '';
    setState(prev => ({
      ...prev,
      images: [file, ...prev.images],
      image: {},
    }));
  };

  const onDeleteImage = (id: string) => async () => {
    const { _id } = await deleteUpload(id);
    setState(prev => ({
      ...prev,
      images: prev.images.filter(image => image._id !== _id),
    }));
  };

  useEffect(() => {
    getImages();
  }, []);

  return (
    <div className={`container ${s.app}`}>
      <div className={s.upload}>
        <input
          type="file"
          className={s.inputFile}
          placeholder="Upload file..."
          onChange={handleChangeFile}
          ref={input}
        />
        {!!state.image.url && (
          <div className={s.image}>
            <img src={state.image.url} />
            <div className={s.uploadActions}>
              <button onClick={handleDeleteCurrentFile}>Delete</button>
              <button onClick={handleUpload}>Upload</button>
            </div>
          </div>
        )}
      </div>
      {!!state.images.length && (
        <div className={s.images}>
          <h3>Uploaded images</h3>
          <div className={s.imagesList}>
            {state.images.map(({ _id, filePath }) => (
              <div key={_id} className={s.imageItem}>
                <img src={filePath} />
                <div className={s.imageActions}>
                  <button onClick={onDeleteImage(_id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import {JSX} from 'react';

interface GalleryProps {
  images: string[];
  columns: number;
}

const Gallery = ({images, columns}: GalleryProps) => {
  const imagePerColumn = Math.floor(images.length / columns);

  // Create a column of images starting at a specific index
  const createColumn = (startIndex: number): JSX.Element[] => {
    const column: JSX.Element[] = [];
    for (let j = 0; j < imagePerColumn; j++) {
      column.push(
        <div key={startIndex + j} className='image'>
          <img src={images[startIndex + j]} alt='background' />
        </div>
      );
    }
    return column;
  };

  // Create the entire gallery layout with columns
  const createGallery = (): JSX.Element[] => {
    const gallery: JSX.Element[] = [];
    for (let i = 0; i < columns; i++) {
      gallery.push(
        <div key={i} className={i % 2 === 0 ? 'image-column sliding-down' : 'image-column sliding-up'}>
          {createColumn(i * imagePerColumn)}
        </div>
      );
    }
    return gallery;
  };

  return <>{createGallery()}</>;
};

export default Gallery;

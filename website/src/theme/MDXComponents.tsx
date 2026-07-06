import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import SiteImage from '@site/src/components/SiteImage';

type ImgProps = React.ImgHTMLAttributes<HTMLImageElement>;

function Img(props: ImgProps): React.JSX.Element {
  return (
    <SiteImage
      {...props}
      className={props.className ? `${props.className} zoomable` : 'zoomable'}
    />
  );
}

export default {
  ...MDXComponents,
  img: Img,
  DocImage: Img,
};

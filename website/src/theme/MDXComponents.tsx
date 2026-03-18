import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';

type ImgProps = React.ImgHTMLAttributes<HTMLImageElement>;

function parsePixelLike(value: React.CSSProperties['maxHeight']): number | null {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return value;
  }

  if (typeof value === 'string') {
    const match = value.trim().match(/^([0-9]+(?:\.[0-9]+)?)px$/i);
    if (match) {
      const parsed = Number(match[1]);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
    }
  }

  return null;
}

function Img(props: ImgProps): React.JSX.Element {
  const { width, height, style, src, loading, decoding, fetchPriority, ...rest } = props;
  const numericWidth = typeof width === 'number' ? width : Number(width);
  const numericHeight = typeof height === 'number' ? height : Number(height);
  const styleObject = style && typeof style === 'object' && !Array.isArray(style) ? style : undefined;
  const hasAspectRatio =
    Number.isFinite(numericWidth) &&
    numericWidth > 0 &&
    Number.isFinite(numericHeight) &&
    numericHeight > 0;
  const maxHeightPx = parsePixelLike(styleObject?.maxHeight);
  const widthFromMaxHeight =
    hasAspectRatio && maxHeightPx != null
      ? `${Math.round((maxHeightPx * numericWidth) / numericHeight)}px`
      : undefined;

  return (
    <img
      {...rest}
      src={src}
      width={width}
      height={height}
      loading={loading}
      decoding={decoding ?? 'async'}
      fetchPriority={fetchPriority}
      style={{
        ...(style ?? {}),
        maxWidth: '100%',
        height: 'auto',
        ...(widthFromMaxHeight ? { width: widthFromMaxHeight } : {}),
        ...(hasAspectRatio ? { aspectRatio: `${numericWidth} / ${numericHeight}` } : {}),
      }}
    />
  );
}

export default {
  ...MDXComponents,
  img: Img,
  DocImage: Img,
};

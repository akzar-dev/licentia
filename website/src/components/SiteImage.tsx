import React from 'react';
import clsx from 'clsx';

type SiteImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
};

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

function toCssWidth(value: React.ImgHTMLAttributes<HTMLImageElement>['width']): string | undefined {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return `${value}px`;
  }

  if (typeof value === 'string' && value.trim()) {
    return /^[0-9]+(?:\.[0-9]+)?$/.test(value.trim()) ? `${value.trim()}px` : value;
  }

  return undefined;
}

export default function SiteImage(props: SiteImageProps): React.JSX.Element {
  const {
    width,
    height,
    style,
    className,
    wrapperClassName,
    wrapperStyle,
    decoding,
    onLoad,
    onError,
    ...rest
  } = props;
  const [isLoaded, setIsLoaded] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement | null>(null);
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
  const reservedWidth = widthFromMaxHeight ?? toCssWidth(width);

  React.useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    if (img.complete && img.naturalWidth > 0) {
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
    }
  }, [rest.src, rest.srcSet]);

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    onLoad?.(event);
  };

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    onError?.(event);
  };

  return (
    <span
      className={clsx(
        'site-image',
        isLoaded ? 'site-image--loaded' : 'site-image--loading',
        wrapperClassName
      )}
      style={{
        width: reservedWidth,
        ...(hasAspectRatio ? { aspectRatio: `${numericWidth} / ${numericHeight}` } : {}),
        ...wrapperStyle,
      }}
    >
      {!isLoaded ? <span className="site-image__skeleton" aria-hidden="true" /> : null}
      <img
        {...rest}
        ref={imgRef}
        className={clsx('site-image__img', className)}
        width={width}
        height={height}
        decoding={decoding ?? 'async'}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          ...(style ?? {}),
          maxWidth: '100%',
          height: 'auto',
          ...(widthFromMaxHeight ? { width: widthFromMaxHeight } : {}),
          ...(hasAspectRatio ? { aspectRatio: `${numericWidth} / ${numericHeight}` } : {}),
        }}
      />
    </span>
  );
}

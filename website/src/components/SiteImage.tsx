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

/** How long a load has to take before the placeholder is worth showing. */
const SKELETON_DELAY_MS = 180;
/** How long it stays in the document after the image arrives, so it can fade. */
const SKELETON_FADE_MS = 220;

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
  /**
   * The placeholder has three states, not two, and the middle one is why it is worth the
   * bookkeeping:
   *
   *   mounted but invisible - the usual case. Most images here are cached, preloaded, or
   *     small, and a placeholder shown instantly on those is a one-frame grey flash on
   *     exactly the images that were fastest. It reads as jank, not as loading.
   *   visible - only once the wait has passed SKELETON_DELAY_MS and there is a real gap
   *     to fill.
   *   leaving - kept in the document for SKELETON_FADE_MS after the image arrives, so it
   *     fades rather than vanishing between one frame and the next.
   *
   * An image that loads inside the delay is never shown one: `waiting` never turns true,
   * the placeholder sits at zero opacity throughout, and unmounting it is invisible.
   */
  const [waiting, setWaiting] = React.useState(false);
  const [keepSkeleton, setKeepSkeleton] = React.useState(true);
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

  // Long enough that a fast image never shows a placeholder; short enough that a slow one
  // gets it before anybody wonders whether the page is broken.
  React.useEffect(() => {
    if (isLoaded) return undefined;
    const timer = setTimeout(() => setWaiting(true), SKELETON_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isLoaded, rest.src, rest.srcSet]);

  React.useEffect(() => {
    if (!isLoaded) {
      setKeepSkeleton(true);
      return undefined;
    }
    setWaiting(false);
    const timer = setTimeout(() => setKeepSkeleton(false), SKELETON_FADE_MS);
    return () => clearTimeout(timer);
  }, [isLoaded]);

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
        waiting && 'site-image--waiting',
        wrapperClassName
      )}
      style={{
        width: reservedWidth,
        ...(hasAspectRatio ? { aspectRatio: `${numericWidth} / ${numericHeight}` } : {}),
        ...wrapperStyle,
      }}
    >
      {keepSkeleton ? <span className="site-image__skeleton" aria-hidden="true" /> : null}
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

import type { AnchorHTMLAttributes, ImgHTMLAttributes } from 'react';
// Full navigation intentionally returns protected URLs to Express.
export function Link(props: AnchorHTMLAttributes<HTMLAnchorElement>) { return <a {...props} />; }
export function Image({ priority, unoptimized, ...props }: ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean; unoptimized?: boolean }) {
  return <img {...props} loading={priority ? 'eager' : 'lazy'} />;
}

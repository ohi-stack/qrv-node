export default function Image({ src, alt = '', width, height, priority: _priority, unoptimized: _unoptimized, ...props }) {
  const source = typeof src === 'string' ? src : src?.src || '';
  return <img src={source} alt={alt} width={width} height={height} {...props} />;
}

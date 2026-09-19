export default function Link({ href, children, ...props }) {
  const target = typeof href === 'string' ? href : href?.pathname || '#';
  return <a href={target} {...props}>{children}</a>;
}

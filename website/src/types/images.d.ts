/**
 * @docusaurus/module-type-aliases only declares '*.svg', so importing raster images
 * from TypeScript doesn't typecheck out of the box. Declaring them here lets pages
 * import images as modules, which means the bundler resolves them at build time --
 * a missing or renamed file becomes a build error instead of a silent 404 -- and the
 * emitted filenames are content-hashed for cache busting.
 */
declare module '*.webp' {
  const src: string;
  export default src;
}
declare module '*.png' {
  const src: string;
  export default src;
}
declare module '*.jpg' {
  const src: string;
  export default src;
}
declare module '*.jpeg' {
  const src: string;
  export default src;
}
declare module '*.gif' {
  const src: string;
  export default src;
}

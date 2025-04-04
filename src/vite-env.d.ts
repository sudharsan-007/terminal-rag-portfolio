
/// <reference types="vite/client" />

declare module '*.yaml' {
  const data: any;
  export default data;
}

declare module '*.yaml?raw' {
  const content: string;
  export default content;
}

declare module '*.md' {
  const content: string;
  export default content;
}

declare module "potrace" {
  type Callback = (error: Error | null, svg: string) => void;
  const potrace: {
    trace(file: Buffer | string, options: Record<string, unknown>, callback: Callback): void;
  };
  export default potrace;
}

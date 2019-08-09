declare module "await-exec" {
  function exec(cmd: string, opt: any): Promise<void>;
  namespace exec {}

  export = exec;
}

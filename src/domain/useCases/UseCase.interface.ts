export interface Usecase {
  execute(...args): Promise<any>;
}

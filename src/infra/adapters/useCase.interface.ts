export abstract class Usecase<T = any> {
  abstract execute(...args): Promise<T>;
}

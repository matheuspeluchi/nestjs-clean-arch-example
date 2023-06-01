export abstract class Usecase<I = any, O = any> {
  abstract execute(...params: I[]): Promise<O>;
}

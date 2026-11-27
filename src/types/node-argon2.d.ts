declare module "crypto" {
  export interface Argon2Parameters {
    message: string | Buffer;
    nonce: string | Buffer;
    parallelism: number;
    tagLength: number;
    memory: number;
    passes: number;
    secret?: string | Buffer;
    associatedData?: string | Buffer;
  }

  export function argon2(
    algorithm: "argon2d" | "argon2i" | "argon2id",
    parameters: Argon2Parameters,
    callback: (err: Error | null, derivedKey: Buffer) => void
  ): void;
}

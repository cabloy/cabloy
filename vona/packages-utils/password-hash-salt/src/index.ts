import { Buffer } from 'node:buffer';
import { pbkdf2, randomBytes } from 'node:crypto';
import { promisify } from 'node:util';

export interface IHashOptions {
  saltlen?: number;
  iterations: number;
  keylen: number;
  digest: string;
}

const __hashOptionsDefault = {
  saltlen: 64,
  iterations: 10000,
  keylen: 64,
  digest: 'sha1',
};

export async function hash(password: string, options?: IHashOptions) {
  // options
  options = options ? Object.assign({}, __hashOptionsDefault, options) : __hashOptionsDefault;
  // salt
  const salt = await promisify(randomBytes)(options.saltlen!);
  // pbkdf2
  const key = await promisify(pbkdf2)(
    password,
    salt,
    options.iterations,
    options.keylen,
    options.digest,
  );
  // hash
  return `pbkdf2$${salt.toString('hex')}$${options.iterations}$${options.keylen}$${options.digest}$${key.toString('hex')}`;
}

export async function verify(password: string, hash: string) {
  const [method, salt, iterations, keylen, digest, key] = hash.split('$');
  if (!method || !salt || !iterations || !keylen || !digest || !key) return false;
  const key2 = await promisify(pbkdf2)(
    password,
    Buffer.from(salt, 'hex'),
    Number.parseInt(iterations),
    Number.parseInt(keylen),
    digest,
  );
  return key2.toString('hex') === key;
}

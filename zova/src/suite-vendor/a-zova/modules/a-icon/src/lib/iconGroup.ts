import { StateLock } from 'zova';

export class IconGroup {
  public svg: string | undefined;
  public loaded: StateLock;

  constructor() {
    this.loaded = StateLock.create();
  }
}

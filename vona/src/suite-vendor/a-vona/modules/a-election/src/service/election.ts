import { BeanBase, cast } from 'vona';
import { Service } from 'vona-module-a-bean';

import type {
  IElectionElectInfo,
  IElectionElectOptions,
  TypeFunctionObtain,
  TypeFunctionRelease,
} from '../types/election.ts';

@Service()
export class ServiceElection extends BeanBase {
  private _electionElectInfos: Record<string, IElectionElectInfo | undefined> = {};

  private get clientRedis() {
    return this.bean.redis.get('worker');
  }

  public async dispose() {
    for (const resource of Object.keys(this._electionElectInfos)) {
      await this.release(resource);
    }
  }

  public obtain(
    resource: string,
    fnObtain: TypeFunctionObtain,
    fnRelease: TypeFunctionRelease,
    options?: IElectionElectOptions,
  ) {
    const electionElectInfo: IElectionElectInfo = {
      intervalId: undefined,
      isLeader: false,
      fnObtain,
      fnRelease,
      options,
    };
    this._electionElectInfos[resource] = electionElectInfo;
    //
    const tickets = options?.tickets ?? 1;
    if (tickets === -1 || tickets === Infinity) {
      electionElectInfo.isLeader = true;
      if (!this.app.meta.appClose) {
        fnObtain();
      }
      return;
    }
    electionElectInfo.intervalId = setInterval(async () => {
      const res = await this._obtain(resource, electionElectInfo, tickets);
      if ((!res || electionElectInfo.isLeader) && electionElectInfo.intervalId) {
        clearInterval(electionElectInfo.intervalId);
        electionElectInfo.intervalId = undefined;
      }
    }, this.scope.config.obtain.timeout);
  }

  async _obtain(resource: string, electionElectInfo: IElectionElectInfo, tickets: number) {
    if (this.app.meta.appClose) return;
    const workerAlivePrefix = this.$scope.worker.cacheRedis.workerAlive.getRedisKey('');
    const lockResource = `election.${resource}`;
    const res = await cast(this.clientRedis).electionObtain(
      lockResource,
      workerAlivePrefix,
      this.bean.worker.id,
      tickets,
    );
    if (!res) return; // exists
    const [leader, workersDead] = res;
    electionElectInfo.isLeader = leader === 1;
    if (electionElectInfo.isLeader) {
      if (this.app.meta.appClose) {
        // force release
        await this.release(resource);
      } else {
        electionElectInfo.fnObtain();
      }
    }
    for (const workerDead of workersDead) {
      // force release
      this.scope.broadcast.release.emit({ workerId: workerDead, resource });
    }
    return res;
  }

  async release(resource: string) {
    const electionElectInfo = this._electionElectInfos[resource];
    if (!electionElectInfo) return;
    delete this._electionElectInfos[resource];
    const { intervalId, isLeader, fnRelease, options } = electionElectInfo;
    //
    if (intervalId) {
      clearInterval(intervalId);
    }
    if (fnRelease) {
      await fnRelease();
    }
    //
    if (!isLeader) return;
    const tickets = options?.tickets ?? 1;
    if (tickets === -1 || tickets === Infinity) return;
    // need not redlock
    const lockResource = `election.${resource}`;
    await this.clientRedis.hdel(lockResource, this.bean.worker.id);
  }
}

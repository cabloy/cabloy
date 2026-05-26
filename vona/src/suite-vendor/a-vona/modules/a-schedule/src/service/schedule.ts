import type { IInstanceRecord } from 'vona';

import { BeanBase, beanFullNameFromOnionName, cast, deepExtend } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { IScheduleExecute, IScheduleRecord, TypeScheduleJob } from '../types/schedule.ts';

@Service()
export class ServiceSchedule extends BeanBase {
  async execute(scheduleName: keyof IScheduleRecord, job?: TypeScheduleJob) {
    // ignore on test
    if (this.app.meta.isTest) return;
    // check if valid
    if (job && !(await this.checkScheduleValid(job))) {
      return;
    }
    // schedule config
    const scheduleItem = this.bean.onion.schedule.getOnionSlice(scheduleName);
    const scheduleConfig = this.bean.onion.schedule.getOnionOptions(scheduleName);
    // execute
    return await this.bean.executor.newCtx(
      async () => {
        const beanFullName = scheduleItem.beanOptions.beanFullName;
        const beanInstance = <IScheduleExecute>this.app.bean._getBean(beanFullName as any);
        return await beanInstance.execute(job);
      },
      {
        transaction: scheduleConfig?.transaction,
        instance: true,
      },
    );
  }

  public async deleteSchedule(scheduleName: keyof IScheduleRecord): Promise<boolean>;
  public async deleteSchedule(job: TypeScheduleJob): Promise<boolean>;
  public async deleteSchedule(job: TypeScheduleJob | string): Promise<boolean> {
    if (typeof job === 'string') {
      const scheduleName = cast<keyof IScheduleRecord>(job);
      const scheduleItem = this.bean.onion.schedule.onionsNormal[scheduleName];
      const scheduleKey = this.getScheduleKey(this.ctx.instanceName, scheduleName);
      const scheduleOptions = scheduleItem.beanOptions.options!;
      const queueName = scheduleOptions.queue || 'a-schedule:schedule';
      const queue = this.$scope.queue.service.queue.getQueue(queueName, this.ctx.instanceName);
      return await queue.removeJobScheduler(scheduleKey);
    } else {
      const queue = this.$scope.queue.service.queue.getQueue(
        job.data.queueName,
        job.data.options!.instanceName,
      );
      return await queue.removeJobScheduler(job.name);
    }
  }

  public async checkScheduleValid(job: TypeScheduleJob) {
    const scheduleName = job.data.data.scheduleName;
    // schedule: maybe not exists
    const scheduleItem = this.bean.onion.schedule.getOnionSlice(scheduleName);
    if (!scheduleItem) {
      await this.deleteSchedule(job);
      return false;
    }
    // check disable
    if (
      this.bean.onion.schedule
        .getOnionsEnabledCached()
        .findIndex(item => item.name === scheduleName) === -1
    ) {
      await this.deleteSchedule(job);
      return false;
    }
    // check if changed
    const scheduleConfig = this.app.bean.onion.schedule.getOnionOptions(scheduleName);
    const scheduleHashActive = this.$scope.queue.service.queue.getRepeatKey(
      job.name,
      job.data!.options!.jobOptions!.repeat!,
    );
    const scheduleKeyConfig = this.getScheduleKey(this.ctx.instanceName, scheduleName);
    const scheduleHashConfig = this.$scope.queue.service.queue.getRepeatKey(
      scheduleKeyConfig,
      scheduleConfig!.repeat,
    );
    if (scheduleHashActive !== scheduleHashConfig) {
      return false;
    }
    // ok
    return true;
  }

  public getScheduleKey(
    instanceName: string | undefined | null,
    scheduleName: keyof IScheduleRecord,
  ) {
    return `${instanceName}.${beanFullNameFromOnionName(cast<string>(scheduleName), 'schedule')}`; // not use :
  }

  public async loadSchedules(instanceName?: keyof IInstanceRecord | undefined | null) {
    if (instanceName === undefined) instanceName = this.ctx.instanceName;
    for (const scheduleItem of this.bean.onion.schedule.getOnionsEnabledCached()) {
      const scheduleName = scheduleItem.name;
      await this.addSchedule(scheduleName, instanceName);
    }
  }

  public async addSchedule(
    scheduleName: keyof IScheduleRecord,
    instanceName?: keyof IInstanceRecord | undefined | null,
  ) {
    if (instanceName === undefined) instanceName = this.ctx.instanceName;
    const scheduleItem = this.bean.onion.schedule.getOnionSlice(scheduleName);
    if (!scheduleItem) return;
    // push
    const scheduleKey = this.getScheduleKey(instanceName, scheduleName);
    const scheduleOptions = scheduleItem.beanOptions.options!;
    const queueName = scheduleOptions.queue || 'a-schedule:schedule';
    const queue = this.$scope.queue.service.queue.getQueue(queueName, instanceName);
    const data = this.$scope.queue.service.queue.prepareJobInfo(
      queueName,
      { scheduleName },
      {
        dbInfo: scheduleOptions.dbInfo,
        instanceName,
        queueNameSub: scheduleName,
        jobOptions: {
          repeat: scheduleOptions.repeat,
        },
      },
    );
    const templateOptions = deepExtend(
      {},
      this.scope.config.schedule.templateOptions,
      scheduleOptions.templateOptions,
    );
    await this.scope.redlock.lock(
      `schedule.${scheduleName}`,
      async () => {
        await this.deleteSchedule(scheduleName);
        await queue.upsertJobScheduler(scheduleKey, scheduleOptions.repeat, {
          data,
          opts: templateOptions,
        });
      },
      { instanceName },
    );
  }
}

import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { BeanModelBase, Model } from 'zova-module-a-model';

export interface IModelOptionsTest extends IDecoratorModelOptions {}

@Model<IModelOptionsTest>()
export class ModelTest extends BeanModelBase {
  test() {
    return this.$useStateData({
      queryKey: ['test'],
      queryFn: async () => {
        const data = await this.$api.testSsrToolOne.test(
          {
            id: '1',
            name: 'Tom',
            married: true,
            details: [],
          },
          {
            params: { id: '1' },
            query: { name: 'Tom' },
          },
        );
        return data;
      },
    });
  }
}

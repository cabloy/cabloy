import type { EntityRole } from 'vona-module-home-user';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { EntityPost } from '../entity/post.ts';
import type { EntityPostContent } from '../entity/postContent.ts';
import type { EntityUser } from '../entity/user.ts';

export interface ITestData {
  userTom: EntityUser;
  userJimmy: EntityUser;
  roleFamily: EntityRole;
  roleFriend: EntityRole;
  postApple: EntityPost;
  postPear: EntityPost;
  postContentApple: EntityPostContent;
}

@Service()
export class ServiceTestData extends BeanBase {
  async create(prefix: string): Promise<ITestData> {
    const scopeTest = this.scope;
    const userTom = await scopeTest.model.user.insert({ name: `${prefix}:tom` });
    const userJimmy = await scopeTest.model.user.insert({ name: `${prefix}:jimmy` });
    const roleFamily = await scopeTest.model.role.insert({ name: `${prefix}:family` });
    const roleFriend = await scopeTest.model.role.insert({ name: `${prefix}:friend` });
    await scopeTest.model.roleUser.insertBulk([
      { userId: userTom.id, roleId: roleFamily.id },
      { userId: userTom.id, roleId: roleFriend.id },
      { userId: userJimmy.id, roleId: roleFamily.id },
    ]);
    const postApple = await scopeTest.model.post.insert({
      title: `${prefix}:postApple`,
      userId: userTom.id,
    });
    const postPear = await scopeTest.model.post.insert({
      title: `${prefix}:postPear`,
      userId: userTom.id,
    });
    const postContentApple = await scopeTest.model.postContent.insert({
      content: `${prefix}:postContentApple`,
      postId: postApple.id,
    });
    // ok
    return {
      userTom,
      userJimmy,
      roleFamily,
      roleFriend,
      postApple,
      postPear,
      postContentApple,
    };
  }

  async drop(data: ITestData) {
    const { userTom, userJimmy, roleFamily, roleFriend, postApple, postPear, postContentApple } =
      data;
    const scopeTest = this.scope;
    await scopeTest.model.postContent.delete({ id: postContentApple.id });
    await scopeTest.model.post.delete({ id: postApple.id });
    await scopeTest.model.post.delete({ id: postPear.id });
    await scopeTest.model.roleUser.delete({ userId: userTom.id });
    await scopeTest.model.roleUser.delete({ userId: userJimmy.id });
    await scopeTest.model.role.delete({ id: roleFamily.id });
    await scopeTest.model.role.delete({ id: roleFriend.id });
    await scopeTest.model.user.delete({ id: userTom.id });
    await scopeTest.model.user.delete({ id: userJimmy.id });
  }
}

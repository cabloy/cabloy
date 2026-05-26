import type {
  IMetaVersionTest,
  IMetaVersionTestOptions,
  IMetaVersionUpdate,
  IMetaVersionUpdateOptions,
} from 'vona-module-a-version';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate, IMetaVersionTest {
  async update(options: IMetaVersionUpdateOptions) {
    if (options.version === 1) {
      // testVonaTest
      const entityTest = this.scope.entity.test;
      await this.bean.model.createTable(entityTest.$table, table => {
        table.comment(entityTest.$comment.$table);
        table.basicFields();
        table.string(entityTest.title, 255).comment(entityTest.$comment.title);
        table.string(entityTest.description, 255);
      });
      // testVonaUser
      const entityUser = this.scope.entity.user;
      await this.bean.model.createTable(entityUser.$table, table => {
        table.basicFields();
        table.string(entityUser.name, 255);
        table.integer(entityUser.age);
        table.integer(entityUser.scores);
      });
      // testVonaRole
      const entityRole = this.scope.entity.role;
      await this.bean.model.createTable(entityRole.$table, table => {
        table.basicFields();
        table.string(entityRole.name, 255);
      });
      // testVonaRoleUser
      const entityRoleUser = this.scope.entity.roleUser;
      await this.bean.model.createTable(entityRoleUser.$table, table => {
        table.basicFields();
        table.tableIdentity(entityRoleUser.userId);
        table.tableIdentity(entityRoleUser.roleId);
      });
      // testVonaPost
      const entityPost = this.scope.entity.post;
      await this.bean.model.createTable(entityPost.$table, table => {
        table.basicFields();
        table.string(entityPost.title, 255);
        table.userId();
        table.integer(entityPost.stars);
      });
      // testVonaPostContent
      const entityPostContent = this.scope.entity.postContent;
      await this.bean.model.createTable(entityPostContent.$table, table => {
        table.basicFields();
        table.text(entityPostContent.content);
        table.tableIdentity(entityPostContent.postId);
      });
      // testVonaCategory
      const entityCategory = this.scope.entity.category;
      await this.bean.model.createTable(entityCategory.$table, table => {
        table.basicFields();
        table.string(entityCategory.name, 255);
        table.tableIdentity(entityCategory.categoryIdParent);
      });
      // order
      const entityOrder = this.scope.entity.order;
      await this.bean.model.createTable(entityOrder.$table, table => {
        table.comment(entityOrder.$comment.$table);
        table.basicFields();
        table
          .string(entityOrder.orderNo, 50)
          .defaultTo(entityOrder.$default.orderNo)
          .comment(entityOrder.$comment.orderNo);
        table.string(entityOrder.remark, 255).comment(entityOrder.$comment.remark);
        table.tableIdentity(entityOrder.userId);
      });
      // product
      const entityProduct = this.scope.entity.product;
      await this.bean.model.createTable(entityProduct.$table, table => {
        table.basicFields();
        table.string(entityProduct.name, 50).comment(entityProduct.$comment.name);
        table.integer(entityProduct.price);
        table.integer(entityProduct.quantity);
        table.integer(entityProduct.amount);
        table.tableIdentity(entityProduct.orderId);
      });
    }
  }

  async test(_options: IMetaVersionTestOptions) {
    // user: Kevin
    const userKevin = await this.scope.model.user.insert({ name: 'Kevin' });
    // create: post/postContent
    await this.scope.model.post.insert(
      {
        title: 'test:post001',
        postContent: {
          content: 'this is a test post!',
        },
        userId: userKevin?.id,
      },
      {
        include: { postContent: true },
      },
    );
  }
}

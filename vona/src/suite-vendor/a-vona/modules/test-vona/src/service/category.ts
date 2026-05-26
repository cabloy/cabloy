import assert from 'node:assert';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { $relationDynamic } from 'vona-module-a-orm';

import { ModelCategory } from '../model/category.ts';

@Service()
export class ServiceCategory extends BeanBase {
  async categoryTreeDynamic() {
    // create
    const treeCreate = await this.scope.model.category.insert(
      {
        name: 'Category-1',
        children2: [
          {
            name: 'Category-1-1',
            children2: [{ name: 'Category-1-1-1' }],
          },
          {
            name: 'Category-1-2',
          },
        ],
      },
      {
        with: {
          children2: $relationDynamic.hasMany(() => ModelCategory, 'categoryIdParent', {
            with: {
              children2: $relationDynamic.hasMany(() => ModelCategory, 'categoryIdParent', {}),
            },
          }),
        },
      },
    );
    // get
    const tree = await this.scope.model.category.get(
      {
        id: treeCreate.id,
      },
      {
        with: {
          children2: $relationDynamic.hasMany(() => ModelCategory, 'categoryIdParent', {
            columns: ['id', 'name'],
            with: {
              children2: $relationDynamic.hasMany(() => ModelCategory, 'categoryIdParent', {
                columns: ['id', 'name'],
              }),
            },
          }),
        },
      },
    );
    assert.equal(tree?.children2.length, 2);
    assert.equal(tree?.children2[0].children2.length, 1);
    // update
    await this.scope.model.category.update(
      {
        id: treeCreate.id,
        name: 'Category-1-Update',
        children2: [
          // create
          { name: 'Category-1-3' },
          // update
          { id: treeCreate.children2?.[0].id, name: 'Category-1-1-Update' },
          // delete
          { id: treeCreate.children2?.[1].id, deleted: true },
        ],
      },
      {
        with: {
          children2: $relationDynamic.hasMany(() => ModelCategory, 'categoryIdParent'),
        },
      },
    );
    // delete
    await this.scope.model.category.delete(
      {
        id: treeCreate.id,
      },
      {
        with: {
          children2: $relationDynamic.hasMany(() => ModelCategory, 'categoryIdParent', {
            with: {
              children2: $relationDynamic.hasMany(() => ModelCategory, 'categoryIdParent', {}),
            },
          }),
        },
      },
    );
  }

  async categoryTreeReverse() {
    // create
    const treeCreate = await this.scope.model.category.insert({
      name: 'Category-1',
      children: [
        {
          name: 'Category-1-1',
          children: [{ name: 'Category-1-1-1' }],
        },
        {
          name: 'Category-1-2',
        },
      ],
    });
    // 'Category-1-1-1'
    const subCategoryId = treeCreate.children?.[0].children?.[0].id;
    // get: reverse
    const subCategory = await this.scope.model.categoryChain.get({
      id: subCategoryId,
    });
    assert.equal(subCategory?.parent?.parent?.id, treeCreate.id);
  }

  async categoryTree() {
    // create
    const treeCreate = await this.scope.model.category.insert({
      name: 'Category-1',
      children: [
        {
          name: 'Category-1-1',
          children: [{ name: 'Category-1-1-1' }],
        },
        {
          name: 'Category-1-2',
        },
      ],
    });
    // get
    const tree = await this.scope.model.category.get({
      id: treeCreate.id,
    });
    assert.equal(tree?.children.length, 2);
    assert.equal(tree?.children[0].children.length, 1);
    // update
    await this.scope.model.category.update({
      id: treeCreate.id,
      name: 'Category-1-Update',
      children: [
        // create
        { name: 'Category-1-3' },
        // update
        { id: treeCreate.children?.[0].id, name: 'Category-1-1-Update' },
        // delete
        { id: treeCreate.children?.[1].id, deleted: true },
      ],
    });
    // delete
    await this.scope.model.category.delete({
      id: treeCreate.id,
    });
  }
}

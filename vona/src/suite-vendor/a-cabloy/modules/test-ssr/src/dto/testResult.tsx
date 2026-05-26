import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { cel } from '@cabloy/utils';
import React from 'react';
import { text } from 'vona';
import { $makeSchema, Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';
import { ZovaCommand, ZovaComponent, ZovaEvent, ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';
import { DtoTestDetail } from './testDetail.ts';

export interface IDtoOptionsTestResult extends IDecoratorDtoOptions<
  '_custom1' | '_custom2' | '_custom3' | '_custom4' | '_custom5' | '_customCopy' | '_customCopied'
> {}

@Dto<IDtoOptionsTestResult>({
  fields: {
    _custom1: $makeSchema(
      v.openapi({
        rest: {
          form: {
            // render: (
            //   <FFDemoBasicTest v-if={cel('getValue("name")!="kevin"')} name="_custom1" showLog={true} class="text-center">
            //     <div>{$locale('ChildOne')}</div>
            //     <div>{cel('name + ":" + value')}</div>
            //     <div v-for={['a', 'b', 'c']} key={cel('int(eachIndex)+1')}>{cel('each + eachIndex')}</div>
            //     <div v-slot="header" v-slot-scope="item">{cel('name + ":header:" + item.name')}</div>
            //     <div v-slot="footer" v-slot-scope="scope">{cel('name + ":footer:" + scope.name')}</div>
            //   </FFDemoBasicTest>
            // ),
          },
        },
      }),
      ZovaRender.layout({ label: 'Custom1' }),
      v.default('custom'),
      v.optional(),
      v.min(6),
      z.string(),
    ),
    _custom2: $makeSchema(
      ZovaRender.fieldJsx(
        <div className="text-center">
          <div>{$locale('ChildOne')}</div>
          <div>{$locale('ChildTwo')}</div>
          <div>{$locale('TestApples_', 0)}</div>
          <div>{text`I have ${$locale('TestApples_', 1)}`}</div>
          <div>{text`cel://name+": ${$locale('TestApples_', 2)}"`}</div>
          <ZovaComponent
            name="a-icon:icon"
            options={{
              name: '::home',
              width: 24,
            }}
            nativeOnClick={
              <ZovaEvent>
                <ZovaCommand
                  name="basic-commandssync:log"
                  options={{ message: 'sss' }}
                ></ZovaCommand>
              </ZovaEvent>
            }
          ></ZovaComponent>
        </div>,
      ),
      ZovaRender.layout({
        label: 'Custom2',
        header: <div>{cel('name + ":containerHeader:" + value')}</div>,
        footer: <div>{cel('name + ":containerFooter:" + value')}</div>,
      }),
      v.default('custom'),
      v.optional(),
      v.min(6),
      z.string(),
    ),
    _custom5: $makeSchema(
      ZovaRender.fieldJsx(
        <div>
          <var name="varTest" value={cel('getValue("name") + "!!"')}></var>
          <div>{cel('"var: " + varTest')}</div>
        </div>,
      ),
      ZovaRender.layout({ label: 'Custom5' }),
      v.default('custom'),
      v.optional(),
      v.min(6),
      z.string(),
    ),
    _customCopy: $makeSchema(
      ZovaRender.fieldJsx(
        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
          <input
            className="input"
            value={cel('getValue("name")')}
            onInput={
              <ZovaEvent>
                <ZovaCommand
                  name="basic-commands:setValue"
                  options={{ name: 'name' }}
                ></ZovaCommand>
                <ZovaCommand
                  name="basic-commands:setValue"
                  options={{ name: '_customCopied', value: false, disableNotifyChanged: true }}
                ></ZovaCommand>
              </ZovaEvent>
            }
          ></input>
          <ZovaComponent
            v-if={cel('getValue("_customCopied")==false')}
            name="a-icon:icon"
            style={{ cursor: 'pointer' }}
            options={{
              name: ':outline:copy-outline',
            }}
            nativeOnClick={
              <ZovaEvent>
                <ZovaCommand
                  name="basic-commands:copy"
                  options={{ text: cel('getValue("name")') }}
                ></ZovaCommand>
                <ZovaCommand
                  name="basic-commands:setValue"
                  options={{ name: '_customCopied', value: true }}
                ></ZovaCommand>
              </ZovaEvent>
            }
          ></ZovaComponent>
          <span v-if={cel('getValue("_customCopied")==true')}>Copied!</span>
        </div>,
      ),
      ZovaRender.layout({ label: 'Custom Copy' }),
      v.optional(),
      v.min(6),
      z.string(),
    ),
    _customCopied: $makeSchema(ZovaRender.visible(false), v.optional(), z.boolean()),
  },
})
export class DtoTestResult {
  @Api.field(v.tableIdentity())
  id: TableIdentity;

  @Api.field(
    v.title($locale('Name')),
    ZovaRender.fieldJsx(<input className="text-center-2 text-center"></input>),
    ZovaRender.layout({ label: cel('name+"!!"'), class: 'test-layout' }),
    v.default('tom'),
    v.min(3),
  )
  name: string;

  @Api.field()
  married: boolean;

  @Api.field(v.array(DtoTestDetail))
  details: DtoTestDetail[];
}

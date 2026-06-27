import { cel } from '@cabloy/utils';
import React from 'react';
import { ZovaCommand, ZovaEvent } from 'zova-rest-cabloy-basic-admin';

export const onEffectForAverageScore = (
  <ZovaEvent>
    <ZovaCommand
      name="basic-commandssync:expr"
      res="subjectCount"
      options={{
        expression: cel('int(getValue("subjectCount",0))'),
      }}
    ></ZovaCommand>
    <ZovaCommand
      name="basic-commandssync:expr"
      res="totalScore"
      options={{
        expression: cel('int(getValue("totalScore",0))'),
      }}
    ></ZovaCommand>
    <ZovaCommand
      name="basic-commands:setValue"
      options={{
        name: 'averageScore',
        value: cel('subjectCount==0 ? "" : toFixed(double(totalScore) / double(subjectCount), 2)'),
      }}
    ></ZovaCommand>
  </ZovaEvent>
);

import { cel } from '@cabloy/utils';
import React from 'react';
import { ZovaCommand, ZovaEvent } from 'zova-rest-cabloy-basic-admin';

export const onEffectForTrainingRecordSubjects = (
  <ZovaEvent>
    <ZovaCommand
      name="basic-commands:setValue"
      options={{
        name: 'subjectCount',
        value: cel(
          'int(getValue("trainingRecordSubjects",[]).filter(item, get(item, "deleted")!=true).size())',
        ),
      }}
    ></ZovaCommand>
    <ZovaCommand
      name="basic-commands:setValue"
      options={{
        name: 'totalScore',
        value: cel(
          'sum(getValue("trainingRecordSubjects",[]).filter(item, get(item, "deleted")!=true).map(item, int(get(item, "score", 0))))',
        ),
      }}
    ></ZovaCommand>
  </ZovaEvent>
);

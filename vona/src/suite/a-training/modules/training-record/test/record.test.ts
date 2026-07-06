import type { DtoRecordCreate, DtoRecordUpdate } from 'vona-module-training-record';
import type { DtoStudentCreate } from 'vona-module-training-student';

import fse from 'fs-extra';
import assert from 'node:assert';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

const dossierTextAttendance = Buffer.from('attendance dossier file');
const dossierTextAssessment = Buffer.from('assessment dossier file');

describe('record.test.ts', () => {
  it('action:record', async () => {
    await app.bean.executor.mockCtx(async () => {
      const studentData: DtoStudentCreate = {
        name: '__Student__',
        description: 'This is a student for record test',
        mobile: '13812345678',
        level: 1,
        trainingRecords: [],
      };
      const trainingTime = new Date('2026-01-15T09:30:00.000Z');
      const trainingTimeUpdate = new Date('2026-02-20T14:45:00.000Z');
      const dossierFilePathAttendance = path.join(
        os.tmpdir(),
        'training-record-dossier-attendance.txt',
      );
      const dossierFilePathAssessment = path.join(
        os.tmpdir(),
        'training-record-dossier-assessment.txt',
      );
      let dossierFileAttendance: any;
      let dossierFileAssessment: any;
      await app.bean.passport.signinMock();
      try {
        await fse.writeFile(dossierFilePathAttendance, dossierTextAttendance);
        dossierFileAttendance = await app.bean.file.upload(
          'file-native:native',
          {
            file: dossierFilePathAttendance,
            filename: 'attendance.txt',
            contentType: 'text/plain',
            public: false,
            meta: {
              category: 'attendanceSheet',
              source: 'upload',
            },
          },
          {
            clientName: 'default',
            fileScene: 'training-record:dossierFile',
          },
        );
        const recordData = {
          studentId: 0 as any,
          name: '__Record__',
          subjectCount: 1,
          totalScore: 88,
          averageScore: 88,
          trainingTime,
          dossierFileIds: [dossierFileAttendance.id],
          description: 'This is a record',
          trainingRecordSubjects: [
            {
              name: '__Math__',
              score: 95,
              description: 'Math subject',
            },
          ],
        } as any as DtoRecordCreate;
        const studentId = await app.bean.executor.performAction('post', '/training/student', {
          body: studentData,
        });
        recordData.studentId = studentId;
        const recordId = await app.bean.executor.performAction('post', '/training/record', {
          body: recordData,
        });
        assert.equal(!!recordId, true);

        const selectRes: any = await app.bean.executor.performAction('get', '/training/record');
        const recordItem = selectRes.list.find((item: any) => String(item.id) === String(recordId));
        assert.equal(!!recordItem, true);
        assert.equal(recordItem!.name, recordData.name);
        assert.equal(String(recordItem!.studentId), String(studentId));
        assert.equal(recordItem!.dossierFiles?.length, 1);
        assert.equal(recordItem!.dossierFiles?.[0]?.filename, 'attendance.txt');

        let record: any = await app.bean.executor.performAction('get', '/training/record/:id', {
          params: { id: recordId },
        });
        const recordSubject = record.trainingRecordSubjects?.[0];
        const recordDossierFile = record.dossierFiles?.[0];
        assert.equal(record.name, recordData.name);
        assert.equal(String(record.studentId), String(studentId));
        assert.equal(record.subjectCount, recordData.subjectCount);
        assert.equal(record.totalScore, recordData.totalScore);
        assert.equal(record.averageScore, recordData.averageScore);
        assert.equal(new Date(record.trainingTime).toISOString(), trainingTime.toISOString());
        assert.equal(record.dossierFileIds?.length, 1);
        assert.equal(record.dossierFiles?.length, 1);
        assert.equal(String(recordDossierFile?.id), String(dossierFileAttendance.id));
        assert.equal(recordDossierFile?.filename, 'attendance.txt');
        assert.equal(recordDossierFile?.signed, true);
        assert.equal(recordDossierFile?.meta?.category, 'attendanceSheet');
        assert.equal(record.trainingRecordSubjects?.length, 1);
        assert.equal(recordSubject?.name, '__Math__');
        assert.equal(recordSubject?.score, 95);
        const downloadResponse = await fetch(recordDossierFile.downloadUrl);
        assert.equal(downloadResponse.ok, true);
        assert.equal(await downloadResponse.text(), dossierTextAttendance.toString());

        let student: any = await app.bean.executor.performAction('get', '/training/student/:id', {
          params: { id: studentId },
        });
        let studentRecord = student.trainingRecords?.find(
          (item: any) => String(item.id) === String(recordId),
        );
        assert.equal(!!studentRecord, true);
        assert.equal(studentRecord?.dossierFiles?.length, 1);
        assert.equal(studentRecord?.trainingRecordSubjects?.length, 1);

        await fse.writeFile(dossierFilePathAssessment, dossierTextAssessment);
        dossierFileAssessment = await app.bean.file.upload(
          'file-native:native',
          {
            file: dossierFilePathAssessment,
            filename: 'assessment.txt',
            contentType: 'text/plain',
            public: false,
            meta: {
              category: 'assessmentReport',
              source: 'upload',
            },
          },
          {
            clientName: 'default',
            fileScene: 'training-record:dossierFile',
          },
        );
        const dataUpdate = {
          studentId,
          name: '__RecordNew__',
          subjectCount: 2,
          totalScore: 183,
          averageScore: 91.5,
          trainingTime: trainingTimeUpdate,
          dossierFileIds: [dossierFileAttendance.id, dossierFileAssessment.id],
          description: 'This is an updated record',
          trainingRecordSubjects: [
            {
              id: recordSubject.id,
              name: '__MathNew__',
              score: 96,
              description: 'Updated math subject',
            },
            {
              name: '__English__',
              score: 87,
              description: 'English subject',
            },
          ],
        } as any as DtoRecordUpdate;
        await app.bean.executor.performAction('patch', '/training/record/:id', {
          params: { id: recordId },
          body: dataUpdate,
        });

        record = await app.bean.executor.performAction('get', '/training/record/:id', {
          params: { id: recordId },
        });
        const [updatedMathSubject, updatedEnglishSubject] = record.trainingRecordSubjects ?? [];
        assert.equal(record.name, dataUpdate.name);
        assert.equal(record.subjectCount, dataUpdate.subjectCount);
        assert.equal(record.totalScore, dataUpdate.totalScore);
        assert.equal(record.averageScore, dataUpdate.averageScore);
        assert.equal(new Date(record.trainingTime).toISOString(), trainingTimeUpdate.toISOString());
        assert.equal(record.dossierFileIds?.length, 2);
        assert.equal(record.dossierFiles?.length, 2);
        assert.equal(
          record.dossierFiles.some((item: any) => item.filename === 'attendance.txt'),
          true,
        );
        assert.equal(
          record.dossierFiles.some((item: any) => item.filename === 'assessment.txt'),
          true,
        );
        assert.equal(record.trainingRecordSubjects?.length, 2);
        assert.equal(updatedMathSubject?.name, '__MathNew__');
        assert.equal(updatedMathSubject?.score, 96);
        assert.equal(updatedEnglishSubject?.name, '__English__');
        assert.equal(updatedEnglishSubject?.score, 87);

        student = await app.bean.executor.performAction('get', '/training/student/:id', {
          params: { id: studentId },
        });
        studentRecord = student.trainingRecords?.find(
          (item: any) => String(item.id) === String(recordId),
        );
        assert.equal(studentRecord?.name, dataUpdate.name);
        assert.equal(studentRecord?.dossierFiles?.length, 2);
        assert.equal(studentRecord?.trainingRecordSubjects?.length, 2);

        await app.bean.executor.performAction('delete', '/training/record/:id', {
          params: { id: recordId },
        });

        record = await app.bean.executor.performAction('get', '/training/record/:id', {
          params: { id: recordId },
        });
        assert.equal(record, undefined);

        student = await app.bean.executor.performAction('get', '/training/student/:id', {
          params: { id: studentId },
        });
        studentRecord = student.trainingRecords?.find(
          (item: any) => String(item.id) === String(recordId),
        );
        assert.equal(studentRecord, undefined);

        const retainedDossierFileAttendance = await app.bean.file.get(dossierFileAttendance.id);
        const retainedDossierFileAssessment = await app.bean.file.get(dossierFileAssessment.id);
        assert.equal(!!retainedDossierFileAttendance, true);
        assert.equal(!!retainedDossierFileAssessment, true);

        await app.bean.executor.performAction('delete', '/training/student/:id', {
          params: { id: studentId },
        });

        student = await app.bean.executor.performAction('get', '/training/student/:id', {
          params: { id: studentId },
        });
        assert.equal(student, undefined);
      } finally {
        if (dossierFileAssessment) {
          await app.bean.file.delete(dossierFileAssessment.id);
        }
        if (dossierFileAttendance) {
          await app.bean.file.delete(dossierFileAttendance.id);
        }
        await fse.remove(dossierFilePathAttendance);
        await fse.remove(dossierFilePathAssessment);
        await app.bean.passport.signout();
      }
    });
  });
});

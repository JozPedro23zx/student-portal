import { Chance } from 'chance';
import { EnrollmentStatus, Status } from './value-object/enrollmentStatus';
import { Enrollment } from './enrollment';

type PropOrFactory<T> = T | ((index: number) => T);

export class EnrollmentFakeBuilder<TBuild = any> {
  private _id: PropOrFactory<string> | undefined = undefined;
  private _student_id: PropOrFactory<string> = (_index) => this.chance.guid();
  private _class_id: PropOrFactory<string> = (_index) => this.chance.guid();
  private _enrollment_date: PropOrFactory<Date> = (_index) => this.chance.date();
  private _status: PropOrFactory<EnrollmentStatus> = (_index) => EnrollmentStatus.create(Status.ENROLLED);
  private _created_at: PropOrFactory<Date> | undefined = undefined;
  private _updated_at: PropOrFactory<Date> | undefined = undefined;

  private countObjs: number;
  private chance: Chance.Chance;

  static anEnrollment() {
    return new EnrollmentFakeBuilder<Enrollment>();
  }

  static theEnrollments(countObjs: number) {
    return new EnrollmentFakeBuilder<Enrollment[]>(countObjs);
  }

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = new Chance();
  }

  withId(valueOrFactory: PropOrFactory<string>) {
    this._id = valueOrFactory;
    return this;
  }

  withStudentId(valueOrFactory: PropOrFactory<string>) {
    this._student_id = valueOrFactory;
    return this;
  }

  withClassId(valueOrFactory: PropOrFactory<string>) {
    this._class_id = valueOrFactory;
    return this;
  }

  withEnrollmentDate(valueOrFactory: PropOrFactory<Date>) {
    this._enrollment_date = valueOrFactory;
    return this;
  }

  withStatus(valueOrFactory: PropOrFactory<EnrollmentStatus>) {
    this._status = valueOrFactory;
    return this;
  }

  withCreatedAt(valueOrFactory: PropOrFactory<Date>) {
    this._created_at = valueOrFactory;
    return this;
  }

  withUpdatedAt(valueOrFactory: PropOrFactory<Date>) {
    this._updated_at = valueOrFactory;
    return this;
  }

  build(): TBuild {
    const enrollments = new Array(this.countObjs)
      .fill(undefined)
      .map((_, index) => {
        const enrollment = new Enrollment({
          id: this.callFactory(this._id, index),
          student_id: this.callFactory(this._student_id, index),
          class_id: this.callFactory(this._class_id, index),
          enrollment_date: this.callFactory(this._enrollment_date, index),
          status: this.callFactory(this._status, index),
          created_at: this.callFactory(this._created_at, index),
          updated_at: this.callFactory(this._updated_at, index),
        });
        return enrollment;
      });
    return this.countObjs === 1 ? (enrollments[0] as any) : enrollments;
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === 'function'
      ? factoryOrValue(index)
      : factoryOrValue;
  }
}

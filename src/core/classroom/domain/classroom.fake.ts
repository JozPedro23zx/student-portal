import { Chance } from 'chance';
import { Uuid } from '@core/@shared/domain/value-object/uuid.vo';
import { ClassRoom } from './calssroom.entity';


type PropOrFactory<T> = T | ((index: number) => T);

export class ClassRoomFakeBuilder<TBuild = any> {
  private _id: PropOrFactory<Uuid> | undefined = undefined;
  private _grade_level: PropOrFactory<string> = (_index) => this.chance.pickone(["1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade", "6th Grade"]);
  private _start_date: PropOrFactory<Date> = (_index) => this.chance.date();
  private _end_date: PropOrFactory<Date> = (_index) => this.chance.date();
  private _createdAt: PropOrFactory<Date> = (_index) => new Date();
  private _updatedAt: PropOrFactory<Date> = (_index) => new Date();

  private countObjs: number;
  private chance: Chance.Chance;

  static aClassRoom() {
    return new ClassRoomFakeBuilder<ClassRoom>();
  }

  static theClassRooms(countObjs: number) {
    return new ClassRoomFakeBuilder<ClassRoom[]>(countObjs);
  }

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = Chance();
  }

  withId(valueOrFactory: PropOrFactory<Uuid>) {
    this._id = valueOrFactory;
    return this;
  }

  withGradeLevel(valueOrFactory: PropOrFactory<string>) {
    this._grade_level = valueOrFactory;
    return this;
  }

  withStartDate(valueOrFactory: PropOrFactory<Date>) {
    this._start_date = valueOrFactory;
    return this;
  }

  withEndDate(valueOrFactory: PropOrFactory<Date>) {
    this._end_date = valueOrFactory;
    return this;
  }

  withCreatedAt(valueOrFactory: PropOrFactory<Date>) {
    this._createdAt = valueOrFactory;
    return this;
  }

  withUpdatedAt(valueOrFactory: PropOrFactory<Date>) {
    this._updatedAt = valueOrFactory;
    return this;
  }

  build(): TBuild {
    const classrooms = new Array(this.countObjs)
      .fill(undefined)
      .map((_, index) => {
        const classroom = new ClassRoom({
          id: this.callFactory(this._id, index) ?? new Uuid(),
          grade_level: this.callFactory(this._grade_level, index),
          start_date: this.callFactory(this._start_date, index),
          end_date: this.callFactory(this._end_date, index),
          createdAt: this.callFactory(this._createdAt, index),
          updatedAt: this.callFactory(this._updatedAt, index),
        });
        return classroom;
      });
    return this.countObjs === 1 ? (classrooms[0] as any) : classrooms;
  }

  get id() {
    return this.getValue('id');
  }

  get grade_level() {
    return this.getValue('grade_level');
  }

  get start_date() {
    return this.getValue('start_date');
  }

  get end_date() {
    return this.getValue('end_date');
  }

  get createdAt() {
    return this.getValue('createdAt');
  }

  get updatedAt() {
    return this.getValue('updatedAt');
  }

  private getValue(prop: any) {
    const optional = ['id'];
    const privateProp = `_${prop}` as keyof this;
    if (!this[privateProp] && optional.includes(prop)) {
      throw new Error(`Property ${prop} not have a factory, use 'with' methods`);
    }
    return this.callFactory(this[privateProp], 0);
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === 'function'
      ? factoryOrValue(index)
      : factoryOrValue;
  }
}

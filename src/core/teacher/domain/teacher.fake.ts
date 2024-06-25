import Chance from 'chance';
import { Address } from './value-object/address.vo';
import { Teacher, TeacherProps } from './teacher.entity';
import { Subject, Subjects } from './value-object/subject.vo';

type PropOrFactory<T> = T | ((index: number) => T);

export class TeacherFakeBuilder<TBuild = any> {
    private _first_name: PropOrFactory<string> = (_index) => this.chance.first();
    private _last_name: PropOrFactory<string> = (_index) => this.chance.last();
    private _subject_specialization: PropOrFactory<Subject[]> = (_index) => [new Subject(this.randomSubject())];
    private _date_of_birth: PropOrFactory<Date> = (_index) => this.chance.birthday();
    private _address: PropOrFactory<Address> = (_index) => new Address({
      street: this.chance.street(),
      number: this.chance.integer({ min: 1, max: 1000 }),
      city: this.chance.city(),
    });
    private _phone_number: PropOrFactory<string | null> = (_index) => this.chance.phone();
    private _created_at: PropOrFactory<Date> | undefined = undefined;
    private _updated_at: PropOrFactory<Date> | undefined = undefined;
  
    private countObjs;
  
    static aTeacher() {
      return new TeacherFakeBuilder<Teacher>();
    }
  
    static theTeachers(countObjs: number) {
      return new TeacherFakeBuilder<Teacher[]>(countObjs);
    }
  
    private chance: Chance.Chance;
  
    private constructor(countObjs: number = 1) {
      this.countObjs = countObjs;
      this.chance = Chance();
    }
  
    private randomSubject(): Subjects {
      const subjects = Object.values(Subjects);
      return subjects[this.chance.integer({ min: 0, max: subjects.length - 1 })];
    }
  
    withFirstName(valueOrFactory: PropOrFactory<string>) {
      this._first_name = valueOrFactory;
      return this;
    }
  
    withLastName(valueOrFactory: PropOrFactory<string>) {
      this._last_name = valueOrFactory;
      return this;
    }
  
    withSubjectSpecialization(valueOrFactory: PropOrFactory<Subject[]>) {
      this._subject_specialization = valueOrFactory;
      return this;
    }
  
    withDateOfBirth(valueOrFactory: PropOrFactory<Date>) {
      this._date_of_birth = valueOrFactory;
      return this;
    }
  
    withAddress(valueOrFactory: PropOrFactory<Address>) {
      this._address = valueOrFactory;
      return this;
    }
  
    withPhoneNumber(valueOrFactory: PropOrFactory<string | null>) {
      this._phone_number = valueOrFactory;
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
      const teachers = new Array(this.countObjs)
        .fill(undefined)
        .map((_, index) => {
          const teacher = new Teacher({
            first_name: this.callFactory(this._first_name, index),
            last_name: this.callFactory(this._last_name, index),
            subject_specialization: this.callFactory(this._subject_specialization, index),
            date_of_birth: this.callFactory(this._date_of_birth, index),
            address: this.callFactory(this._address, index),
            phone_number: this.callFactory(this._phone_number, index),
            ...(this._created_at && {
              createdAt: this.callFactory(this._created_at, index),
            }),
            ...(this._updated_at && {
              updatedAt: this.callFactory(this._updated_at, index),
            }),
          });
          teacher.validate();
          return teacher;
        });
      return this.countObjs === 1 ? (teachers[0] as any) : teachers;
    }
  
    private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
      return typeof factoryOrValue === 'function'
        ? factoryOrValue(index)
        : factoryOrValue;
    }
  }
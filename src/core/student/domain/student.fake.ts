import { Chance } from 'chance';
import { Address } from "./value-object/address.vo";
import { Student } from './student.entity';

type PropOrFactory<T> = T | ((index: number) => T);

export class StudentFakeBuilder<TBuild = any> {
  // auto generated in entity
  private _id: PropOrFactory<string> | undefined = undefined;
  private _first_name: PropOrFactory<string> = (_index) => this.chance.first();
  private _last_name: PropOrFactory<string> = (_index) => this.chance.last();
  private _date_of_birth: PropOrFactory<Date> = (_index) => this.chance.birthday();
  private _address: PropOrFactory<Address> = (_index: any) => new Address({
    street: this.chance.street(),
    number: this.chance.integer({ min: 1, max: 1000 }),
    city: this.chance.city(),
  });
  private _phone_number: PropOrFactory<string | null> = (_index) => this.chance.phone();

  private countObjs: number;
  private chance: Chance.Chance;

  static aStudent() {
    return new StudentFakeBuilder<Student>();
  }

  static theStudents(countObjs: number) {
    return new StudentFakeBuilder<Student[]>(countObjs);
  }

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = Chance();
  }

  withId(valueOrFactory: PropOrFactory<string>) {
    this._id = valueOrFactory;
    return this;
  }

  withFirstName(valueOrFactory: PropOrFactory<string>) {
    this._first_name = valueOrFactory;
    return this;
  }

  withLastName(valueOrFactory: PropOrFactory<string>) {
    this._last_name = valueOrFactory;
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

  withInvalidFirstNameTooLong(value?: string) {
    this._first_name = value ?? this.chance.string({ length: 256 });
    return this;
  }

  build(): TBuild {
    const students = new Array(this.countObjs)
      .fill(undefined)
      .map((_, index) => {
        const student = new Student({
          id: !this._id ? undefined : this.callFactory(this._id, index),
          first_name: this.callFactory(this._first_name, index),
          last_name: this.callFactory(this._last_name, index),
          date_of_birth: this.callFactory(this._date_of_birth, index),
          address: this.callFactory(this._address, index),
          phone_number: this.callFactory(this._phone_number, index),
        });
        student.validate();
        return student;
      });
    return this.countObjs === 1 ? (students[0] as any) : students;
  }

  get id() {
    return this.getValue('id');
  }

  get first_name() {
    return this.getValue('first_name');
  }

  get last_name() {
    return this.getValue('last_name');
  }

  get date_of_birth() {
    return this.getValue('date_of_birth');
  }

  get address() {
    return this.getValue('address');
  }

  get phone_number() {
    return this.getValue('phone_number');
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

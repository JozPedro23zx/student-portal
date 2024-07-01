import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { Enrollment, EnrollmentProps } from "./enrollment";
import { EnrollmentStatus, InvalidStatusTypeError, Status } from "./value-object/enrollmentStatus";


describe('Enrollment unit tests', () => {
  it('should create an enrollment with valid props', () => {
    const props: EnrollmentProps = {
      student_id: 'student1',
      class_id: 'class1',
      enrollment_date: new Date(),
      status: EnrollmentStatus.create(Status.ENROLLED),
    };

    const enrollment = new Enrollment(props);

    expect(enrollment.student_id).toBe(props.student_id);
    expect(enrollment.class_id).toBe(props.class_id);
    expect(enrollment.enrollment_date).toBe(props.enrollment_date);
    expect(enrollment.status).toBe(props.status);
  });

  it('should update the status of an enrollment', () => {
    const props: EnrollmentProps = {
      student_id: 'student1',
      class_id: 'class1',
      enrollment_date: new Date(),
      status: EnrollmentStatus.create(Status.ENROLLED),
    };

    const enrollment = new Enrollment(props);
    const newStatus = EnrollmentStatus.create(Status.COMPLETED);

    enrollment.updateStatus(newStatus);

    expect(enrollment.status).toBe(newStatus);
  });

  it('should convert to JSON', () => {
    const props: EnrollmentProps = {
      id: new Uuid('536482b8-4698-43ae-8a7f-4a5e87cfd1c7'),
      student_id: 'student1',
      class_id: 'class1',
      enrollment_date: new Date(),
      status: EnrollmentStatus.create(Status.ENROLLED),
      created_at: new Date(),
      updated_at: new Date(),
    };

    const enrollment = new Enrollment(props);
    const json = enrollment.toJSON();

    expect(json).toEqual({
      id: props.id.id,
      student_id: props.student_id,
      class_id: props.class_id,
      enrollment_date: props.enrollment_date,
      status: props.status,
    });
  });
});

describe('EnrollmentStatus', () => {
  it('should create a valid enrollment status', () => {
    const status = EnrollmentStatus.create(Status.ENROLLED);
    expect(status.type).toBe(Status.ENROLLED);
  });

  it('should throw an error for invalid status type', () => {
    expect(() => {
      EnrollmentStatus.create('invalid-status');
    }).toThrow(InvalidStatusTypeError);
  });
});
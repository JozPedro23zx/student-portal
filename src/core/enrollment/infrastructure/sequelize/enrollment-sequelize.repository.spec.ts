import { setupSequelize } from "@core/@shared/infrastructure/repository/sequelize/setup-helper";
import { EnrollmentSequelizeRepository } from "./enrollment-sequelize.repository";
import { EnrollmentModel } from "./enrollment.model";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { EnrollmentFakeBuilder } from "@core/enrollment/domain/enrollment.fake";
import { CustomNotFoundError } from "@core/@shared/erros/not-found.error";
import { EnrollmentStatus, Status } from "@core/enrollment/domain/value-object/enrollmentStatus";

describe("Enrollment repository unit tests", () => {
    let repository: EnrollmentSequelizeRepository;

    setupSequelize({ models: [EnrollmentModel] });

    beforeEach(async () => {
        repository = new EnrollmentSequelizeRepository(EnrollmentModel);
    })

    it('should create a new enrollment', async () => {
        const enrollment = EnrollmentFakeBuilder.anEnrollment().build()
        await repository.create(enrollment);

        const enrollmentCreated = await repository.find(enrollment.entityId);
        expect(enrollmentCreated!.toJSON()).toStrictEqual(enrollment.toJSON());
    });

    it('should find an enrollment by id', async () => {
        const uuid = new Uuid();
        let enrollmentFound = await repository.find(uuid);
        expect(enrollmentFound).toBeNull();

        const enrollment = EnrollmentFakeBuilder.anEnrollment().build()
        await repository.create(enrollment);

        enrollmentFound = await repository.find(enrollment.entityId);
        expect(enrollment.toJSON()).toStrictEqual(enrollmentFound!.toJSON());
    });

    it('should return all enrollments', async () => {
        const enrollment = EnrollmentFakeBuilder.anEnrollment().build()
        await repository.create(enrollment);

        const enrollments = await repository.findAll();
        expect(enrollments).toHaveLength(1);
        expect(enrollments[0].toJSON()).toEqual(enrollment.toJSON());
    });

    it('should throw error on update when an enrollment is not found', async () => {
        const enrollment = EnrollmentFakeBuilder.anEnrollment().build()
        await expect(repository.update(enrollment)).rejects.toThrow(CustomNotFoundError);
    });

    it('should update an enrollment', async () => {
        const enrollment = EnrollmentFakeBuilder.anEnrollment().withStatus(EnrollmentStatus.create(Status.ENROLLED)).build();
        await repository.create(enrollment);

        enrollment.updateStatus(EnrollmentStatus.create(Status.COMPLETED));

        await repository.update(enrollment);

        const updatedEnrollment = await repository.find(enrollment.entityId);
        expect(updatedEnrollment!.toJSON()).toEqual(enrollment.toJSON());
    });

    it('should throw error on delete when an enrollment is not found', async () => {
        const uuid = new Uuid();
        await expect(repository.delete(uuid)).rejects.toThrow(CustomNotFoundError);
    });

    it('should delete an enrollment', async () => {
        const enrollment = EnrollmentFakeBuilder.anEnrollment().build()
        await repository.create(enrollment);

        await repository.delete(enrollment.entityId);

        const deletedEnrollment = await repository.find(enrollment.entityId);
        expect(deletedEnrollment).toBeNull();
    });
})
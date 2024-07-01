import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

export type EnrollmentProps = {
    id: string;
    student_id: string;
    class_id: string;
    enrollment_date: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

@Table({tableName: 'enrollments', timestamps: false})
export class EnrollmentModel extends Model<EnrollmentProps>{

    @PrimaryKey
    @Column({ allowNull: false, type: DataType.UUID })
    declare id: string;

    @Column({ allowNull: false, type: DataType.UUID })
    declare  student_id: string;

    @Column({ allowNull: false, type: DataType.UUID })
    declare  class_id: string;

    @Column({ allowNull: false, type: DataType.DATE })
    declare  enrollment_date: Date;

    @Column({ allowNull: false, type: DataType.STRING })
    declare  status: string;

    @Column({ allowNull: false, type: DataType.DATE })
    declare createdAt: Date;
  
    @Column({ allowNull: false, type: DataType.DATE })
    declare updatedAt: Date;
}

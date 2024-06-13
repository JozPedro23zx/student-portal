import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

export type StudentModelProps = {
    id: string;
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    street: string;
    number: number;
    city: string;
    phone_number: string;
    createdAt: Date;
    updatedAt: Date;
}

@Table({tableName: "students", timestamps: false})
export class StudentModel extends Model<StudentModelProps>{

    @PrimaryKey
    @Column({allowNull: false, type: DataType.UUID})
    declare id: string;

    @Column({allowNull: false, type: DataType.STRING(255)})
    declare first_name: string;

    @Column({allowNull: false, type: DataType.STRING(255)})
    declare last_name: string;

    @Column({allowNull: false, type: DataType.DATE(3)})
    declare date_of_birth: Date;

    @Column({allowNull: false, type: DataType.STRING(255)})
    declare street: string;

    @Column({allowNull: false, type: DataType.NUMBER})
    declare number: number;

    @Column({allowNull: false, type: DataType.STRING(255)})
    declare city: string;

    @Column({allowNull: false, type: DataType.STRING(255)})
    declare phone_number: string;

    @Column({allowNull: false, type: DataType.DATE(3)})
    createdAt: Date;

    @Column({allowNull: false, type: DataType.DATE(3)})
    updatedAt: Date;
}
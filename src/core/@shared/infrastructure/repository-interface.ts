import BaseEntity from "../domain/entity/base-entity";
import { Uuid } from "../domain/value-object/uuid.vo";

export interface IRepository<E extends BaseEntity> {
    create(entity: E): Promise<void>;
    update(entity: E): Promise<void>;
    delete(uuid: Uuid): Promise<void>;

    find(uuid: Uuid): Promise<E>;
    findByIds(uuids: Uuid[]): Promise<E[]>;
    findAll(): Promise<E[]>;
}
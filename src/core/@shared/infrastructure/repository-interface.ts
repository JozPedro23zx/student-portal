import BaseEntity from "../domain/entity/base-entity";
import { Uuid } from "../domain/value-object/uuid.vo";

export interface IRepository<E extends BaseEntity> {
    create(entity: E): Promise<void>;
    update(entity: E): Promise<void>;
    delete(id: Uuid): Promise<void>;

    find(id: Uuid): Promise<E>;
    findByIds(ids: Uuid[]): Promise<E[]>;
    findAll(): Promise<E[]>;
}
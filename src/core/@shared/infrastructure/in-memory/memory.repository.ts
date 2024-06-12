import BaseEntity from "@core/@shared/domain/entity/base-entity";
import { IRepository } from "../repository-interface";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";

export abstract class InMemoryRepository<E extends BaseEntity> implements IRepository<E>{

    entities: E[] = [];

    async create(entity: E): Promise<void> {
        this.entities.push(entity);
    }

    async update(entity: E): Promise<void> {
        const index = this.entities.findIndex((e)=> e.entityId.equals(entity.entityId));
        if (index === -1){
            throw new Error("Object not found");
        }
        this.entities[index] = entity;
    }

    async delete(id: Uuid): Promise<void> {
        const index = this.entities.findIndex((e)=> e.entityId.equals(id));
        if (index === -1){
            throw new Error("Object not found");
        }
        this.entities.splice(index, 1);
    }

    async find(id: Uuid): Promise<E> {
        const item = this.entities.find((e) => item.entityId.equals(id));
        return item;
    }

    async findByIds(ids: Uuid[]): Promise<E[]> {
        return this.entities.filter((e)=>{
            return ids.some((id) => e.entityId.equals(id));
        });
    }

    async findAll(): Promise<E[]> {
        return this.entities;
    }
    
}
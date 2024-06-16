import BaseEntity from "@core/@shared/domain/entity/base-entity";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { InMemoryRepository } from "./memory.repository";

type StubEntityConstructor = {
  entity_id?: Uuid;
  name: string;
  price: number;
};

class StubEntity extends BaseEntity {
  entity_id: Uuid;
  name: string;
  price: number;

  constructor(props: StubEntityConstructor) {
    super();
    this.entity_id = props.entity_id || new Uuid();
    this.name = props.name;
    this.price = props.price;
  }

  toJSON() {
    return {
      entity_id: this.entity_id.id,
      name: this.name,
      price: this.price,
    };
  }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }
}

describe('InMemoryRepository Unit Tests', () => {
    let repo: StubInMemoryRepository;
  
    beforeEach(() => {
      repo = new StubInMemoryRepository();
    });

    test('should insert a new entity', async () => {
        const entity = new StubEntity({
          entity_id: new Uuid(),
          name: 'Test',
          price: 100,
        });
    
        await repo.create(entity);
    
        expect(repo.entities.length).toBe(1);
        expect(repo.entities[0]).toBe(entity);
    });

    it('should throws error on update when entity not found', async () => {
        const entity = new StubEntity({ name: 'name value', price: 5 });
        await expect(repo.update(entity)).rejects.toThrow(
          new Error("Object not found"),
        );
    });

    test('should find a entity', async () => {
      const entity = new StubEntity({
        entity_id: new Uuid(),
        name: 'Test',
        price: 100,
      });
  
      await repo.create(entity);

      let item = await repo.find(entity.entity_id);
  
      expect(item).toStrictEqual(entity);
  });


    it('should update entity', async () => {
        const entity = new StubEntity({
          entity_id: new Uuid(),
          name: 'Test',
          price: 100,
        });
    
        await repo.create(entity);
    
        const entityUpdated = new StubEntity({
            entity_id: entity.entity_id,
            name: 'updated',
            price: 1,
        });

        await repo.update(entityUpdated);
        expect(entityUpdated.toJSON()).toStrictEqual(repo.entities[0].toJSON());
    });

    it('should throws error on delete when entity not found', async () => {
        const uuid = new Uuid();
        await expect(repo.delete(uuid)).rejects.toThrow(
            new Error("Object not found"),
        );
    
        await expect(
          repo.delete(new Uuid('9366b7dc-2d71-4799-b91c-c64adb205104')),
        ).rejects.toThrow(
            new Error("Object not found"),
        );
    });
    
      it('should deletes an entity', async () => {
        const entity = new StubEntity({ name: 'name value', price: 5 });
        await repo.create(entity);
    
        await repo.delete(entity.entity_id);
        expect(repo.entities).toHaveLength(0);
    });
})
  
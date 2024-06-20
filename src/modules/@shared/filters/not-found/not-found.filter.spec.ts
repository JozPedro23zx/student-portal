import BaseEntity from '@core/@shared/domain/entity/base-entity';
import { NotFoundFilter } from './not-found.filter';
import { Controller, Get, INestApplication } from '@nestjs/common';
import { CustomNotFoundError } from '@core/@shared/erros/not-found.error';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

class StubEntity extends BaseEntity {
  entity_id: any;
  toJSON(): Required<any> {
    return {};
  }
}

@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new CustomNotFoundError('fake id', StubEntity.name);
  }
}

describe('NotFoundFilter', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [StubController],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new NotFoundFilter());
    await app.init();
  });

  it('should be defined', () => {
    expect(new NotFoundFilter()).toBeDefined();
  });

  it('should catch a EntityValidationError', () => {
    return request(app.getHttpServer()).get('/stub').expect(404).expect({
      statusCode: 404,
      error: 'Not Found',
      message: 'Not possible find any StubEntity with id: fake id',
    });
  });
})

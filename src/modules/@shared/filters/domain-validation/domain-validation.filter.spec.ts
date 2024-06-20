import { Controller, Get, INestApplication } from '@nestjs/common';
import { DomainValidationFilter } from './domain-validation.filter';
import { EntityValidationError } from '@core/@shared/erros/validate.error';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';


@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new EntityValidationError([
      'another error',
      {
        field1: ['field1 is required', 'error 2'],
      },
      {
        field2: ['field2 is required'],
      },
    ]);
  }
}

describe('DomainValidationFilter', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [StubController],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new DomainValidationFilter());
    await app.init();
  });
  
  it('should be defined', () => {
    expect(new DomainValidationFilter()).toBeDefined();
  });

  it('should catch a EntityValidationError', () => {
    return request(app.getHttpServer())
      .get('/stub')
      .expect(422)
      .expect({
        statusCode: 422,
        error: 'Invalid Data Error',
        message: [
          'another error',
          'field1 is required',
          'error 2',
          'field2 is required',
        ],
      });
  });

});

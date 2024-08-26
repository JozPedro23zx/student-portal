import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from 'src/modules/@shared/rabbitmq/keycloak-user.interface';

@Injectable()
export class ProducerService {
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  async sendUserCreationMessage(user: User) {
    return this.client.emit('user_creation', user);
  }
}
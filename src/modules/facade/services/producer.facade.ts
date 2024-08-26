import { Injectable, Inject } from "@nestjs/common";
import { User } from "src/modules/@shared/rabbitmq/keycloak-user.interface";
import { ProducerService } from "src/modules/rabbitmq/services/producer.service";

@Injectable()
export class ProducerFacade {
    @Inject(ProducerService)
    private producerService: ProducerService

    async producerMessageToCreateUser(user: User){
        return this.producerService.sendUserCreationMessage(user)
    }
}
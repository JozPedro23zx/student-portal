import { Module, forwardRef } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ProducerService } from "./services/producer.service";
import { ConsumerService } from "./services/consumer.service";
import { FacadeModule } from "../facade/facade.module";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'RABBITMQ_SERVICE',
                useFactory: async (configService: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [configService.get<string>("RABBITMQ_URL") || 'amqp://localhost:5672'],
                        queue: 'main-queue',
                        queueOptions: {
                            durable: true,
                        },
                    },
                }),
                inject: [ConfigService]
            },
        ]),
        forwardRef(() => FacadeModule)
    ],
    controllers: [],
    providers: [ProducerService, ConsumerService],
    exports: [ProducerService]
})
export class RabbitMQModule {}
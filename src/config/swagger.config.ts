import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";


export const setUpSwagger = (app: INestApplication) => {
    const config = new DocumentBuilder()
    .setTitle('CareerHub API')
    .setDescription('Job posting API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('', app, document);
}


import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './entities/project.entity';
import { CollaborationRequest, CollaborationRequestSchema } from './entities/collab-request.schema';
import { ProjectController } from './projects.controller';
import { ProjectService } from './projects.service';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: CollaborationRequest.name, schema: CollaborationRequestSchema },
    ]),
    AuthModule,
    MailModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}

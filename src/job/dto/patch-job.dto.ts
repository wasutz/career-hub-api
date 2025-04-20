import { PartialType } from '@nestjs/swagger';
import { CreateJobDto } from './create-job.dto';

export class PatchJobDto extends PartialType(CreateJobDto) {}

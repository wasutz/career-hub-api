import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto';

export class PatchJobDto extends PartialType(CreateJobDto) {}

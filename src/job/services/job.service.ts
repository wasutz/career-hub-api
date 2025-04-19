import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobEntity } from '../models/job.entity';
import { CreateJobDto } from '../dto/create-job.dto';
import { UpdateJobDto } from '../dto/update-job.dto';

@Injectable()
export class JobService {
    constructor(
        @InjectRepository(JobEntity)
        private readonly jobRepository: Repository<JobEntity>,
    ) {}

    async create(createJobDto: CreateJobDto): Promise<JobEntity> {
        const job = this.jobRepository.create(createJobDto);

        return await this.jobRepository.save(job);
    }

      async findAll(): Promise<JobEntity[]> {
        return await this.jobRepository.find();
      }

      async findOne(id: string): Promise<JobEntity> {
        const job = await this.jobRepository.findOne({ where: { id } });
        if (!job) {
            throw new NotFoundException(`Job #${id} not found`);
        }

        return job;
      }

      async update(id: string, updateDto: UpdateJobDto): Promise<JobEntity> {
        const job = await this.findOne(id);

        Object.assign(job, updateDto);

        return await this.jobRepository.save(job);
      }

      async remove(id: string): Promise<void> {
        const result = await this.jobRepository.delete(id);

        if (result.affected === 0) {
          throw new NotFoundException(`Job #${id} not found`);
        }
      }
}

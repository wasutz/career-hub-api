import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobEntity } from '../models/job.entity';
import { CreateJobDto } from '../dto/create-job.dto';
import { UpdateJobDto } from '../dto/update-job.dto';
import { UserEntity, UserRole } from '../../user/models/user.entity';
import { PatchJobDto } from '../dto/patch-job.dto';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(JobEntity)
    private readonly jobRepository: Repository<JobEntity>,
  ) { }

  async create(createJobDto: CreateJobDto, user: UserEntity): Promise<JobEntity> {
    const job = this.jobRepository.create({
      ...createJobDto,
      createdBy: user,
    });

    return await this.jobRepository.save(job);
  }

  async findAll(page: number, pageSize: number) {
    const [items, total] = await this.jobRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });

    return { items, total };
  }

  async findOne(id: string): Promise<JobEntity> {
    const job = await this.jobRepository.findOne({
      where: { id }
    });

    if (!job) {
      throw new NotFoundException(`Job id: ${id} not found`);
    }

    return job;
  }

  async findOwnJob(id: string, user: UserEntity): Promise<JobEntity> {
    const job = await this.findOne(id);

    if (job.createdBy.id === user.id || user.role === UserRole.ADMIN) {
      return job;
    }

    throw new ForbiddenException("You don't have permission on this job post");
  }

  async update(id: string, updateDto: UpdateJobDto | PatchJobDto, user: UserEntity): Promise<JobEntity> {
    const job = await this.findOwnJob(id, user);

    Object.assign(job, updateDto);

    return await this.jobRepository.save(job);
  }

  async remove(id: string, user: UserEntity): Promise<void> {
    const job = await this.findOwnJob(id, user);

    await this.jobRepository.delete(job.id);
  }
}

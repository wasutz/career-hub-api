import { Test, TestingModule } from '@nestjs/testing';
import { JobService } from './job.service';
import { JobEntity } from '../models/job.entity';
import { Repository } from 'typeorm';
import { CreateJobDto } from '../dto/create-job.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateJobDto } from '../dto/update-job.dto';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('JobService', () => {
  let service: JobService;
  let repo: jest.Mocked<Repository<JobEntity>>;

  const mockJob = {
    id: '1',
    title: 'Test title',
    description: 'Test desc',
  } as JobEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobService,
        {
          provide: getRepositoryToken(JobEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<JobService>(JobService);
    repo = module.get(getRepositoryToken(JobEntity));
  });

  describe('create', () => {
    it('should create and return a job', async () => {
      const dto: CreateJobDto = { title: 'NestJS Dev', description: 'API work', location: 'location', company: 'company'};
      const createdJob = { ...dto, id: '1' } as JobEntity;

      repo.create.mockReturnValue(createdJob);
      repo.save.mockResolvedValue(createdJob);

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(createdJob);
      expect(result).toEqual(createdJob);
    });
  });

  describe('findAll', () => {
    it('should return all jobs', async () => {
      repo.find.mockResolvedValue([mockJob]);

      const result = await service.findAll();

      expect(repo.find).toHaveBeenCalled();
      expect(result).toEqual([mockJob]);
    });
  });

  describe('findOne', () => {
    it('should return a job by id', async () => {
      repo.findOne.mockResolvedValue(mockJob);

      const result = await service.findOne('1');

      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(mockJob);
    });

    it('should throw NotFoundException if job not found', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.findOne('2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the job', async () => {
      const updateDto: UpdateJobDto = { title: 'Updated title', description: 'Updated desc', location: 'new-lo', company: 'new-company'};

      repo.findOne.mockResolvedValue(mockJob);
      repo.save.mockResolvedValue({ ...mockJob, ...updateDto });

      const result = await service.update('1', updateDto);

      expect(result.title).toBe(updateDto.title);
      expect(repo.save).toHaveBeenCalled();
    });
  });
});
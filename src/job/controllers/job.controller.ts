import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { JobService } from '../services/job.service';
import { CreateJobDto } from '../dto/create-job.dto';
import { UpdateJobDto } from '../dto/update-job.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserEntity } from '../../user/models/user.entity';
import { User } from '../../auth/decorators/user.decorator';
import { PatchJobDto } from '../dto/patch-job.dto';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { JobResponseDto } from '../dto/job-response.dto';
import { ApiOkResponsePaginated } from '../../common/decorators/paginated-response';

@Controller('jobs')
export class JobController {
    constructor(private readonly jobService: JobService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: JobResponseDto })
    create(@Body() createJobDto: CreateJobDto, @User() user: UserEntity) {
        const job = this.jobService.create(createJobDto, user);

        return plainToInstance(JobResponseDto, job);
    }

    @Get()
    @ApiOkResponsePaginated(JobResponseDto)
    async findAll(
        @Query() pagination: PaginationQueryDto
    ) {
        const { page, pageSize } = pagination;
        const { items, total} = await this.jobService.findAll(page, pageSize);

        return {
            items: items.map(item => plainToInstance(JobResponseDto, item)),
            total,
        };
    }

    @Get(':id')
    @ApiOkResponse({ type: JobResponseDto })
    findOne(@Param('id') id: string) {
        const job = this.jobService.findOne(id);

        return plainToInstance(JobResponseDto, job);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: JobResponseDto })
    update(
        @Param('id') id: string,
        @Body() updateJobDto: UpdateJobDto,
        @User() user: UserEntity
    ) {
        const job = this.jobService.update(id, updateJobDto, user);

        return plainToInstance(JobResponseDto, job);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: JobResponseDto })
    partialUpdate(
        @Param('id') id: string,
        @Body() patchJobDto: PatchJobDto,
        @User() user: UserEntity
    ) {
        const job = this.jobService.update(id, patchJobDto, user);

        return plainToInstance(JobResponseDto, job);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string, @User() user: UserEntity) {
        return this.jobService.remove(id, user);
    }
}

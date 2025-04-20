import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { JobService } from '../services/job.service';
import { CreateJobDto } from '../dto/create-job.dto';
import { UpdateJobDto } from '../dto/update-job.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserEntity } from '../../user/models/user.entity';
import { User } from '../../auth/decorators/user.decorator';
import { PatchJobDto } from '../dto/patch-job.dto';

@Controller('jobs')
export class JobController {
    constructor(private readonly jobService: JobService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createJobDto: CreateJobDto, @User() user: UserEntity) {
        return this.jobService.create(createJobDto, user);
    }

    @Get()
    findAll() {
        return this.jobService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.jobService.findOne(id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    update(
        @Param('id') id: string,
        @Body() updateJobDto: UpdateJobDto,
        @User() user: UserEntity
    ) {
        return this.jobService.update(id, updateJobDto, user);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    partialUpdate(
        @Param('id') id: string,
        @Body() patchJobDto: PatchJobDto,
        @User() user: UserEntity
    ) {
        return this.jobService.update(id, patchJobDto, user);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string, @User() user: UserEntity) {
        return this.jobService.remove(id, user);
    }
}

import { Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import { JobEntity } from '../../job/models/job.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => JobEntity, (job) => job.createdBy)
  jobs: JobEntity[];
}

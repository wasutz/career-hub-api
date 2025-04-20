import { Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import { JobEntity } from '../../job/models/job.entity';
import { Exclude } from 'class-transformer';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => JobEntity, (job) => job.createdBy)
  jobs?: JobEntity[];

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;
}

import { InputType, Field, ObjectType } from '@nestjs/graphql';

// Assign Blockchain Role DTOs
@InputType()
export class AssignBlockchainRoleInput {
  @Field()
  userWalletAddress: string;

  @Field()
  role: string; // 'TEACHER_ROLE', 'STUDENT_ROLE'
}

@ObjectType()
export class AssignBlockchainRoleResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field({ nullable: true })
  txHash?: string;
}

// Teacher Subject Management DTOs
@InputType()
export class CreateTeacherSubjectInput {
  @Field()
  teacherWalletAddress: string;

  @Field()
  subjectCode: string;

  @Field()
  subjectName: string;

  @Field()
  academicYear: string;

  @Field()
  semester: string;

  @Field(() => [String])
  batches: string[];

  @Field({ nullable: true })
  department?: string;
}

@InputType()
export class UpdateTeacherSubjectInput {
  @Field()
  subjectId: string;

  @Field({ nullable: true })
  subjectCode?: string;

  @Field({ nullable: true })
  subjectName?: string;

  @Field({ nullable: true })
  academicYear?: string;

  @Field({ nullable: true })
  semester?: string;

  @Field(() => [String], { nullable: true })
  batches?: string[];

  @Field({ nullable: true })
  department?: string;

  @Field({ nullable: true })
  isActive?: boolean;
}

@ObjectType()
export class TeacherSubjectDto {
  @Field()
  _id: string;

  @Field()
  teacherDID: string;

  @Field()
  teacherWalletAddress: string;

  @Field()
  teacherName: string;

  @Field()
  subjectCode: string;

  @Field()
  subjectName: string;

  @Field()
  academicYear: string;

  @Field()
  semester: string;

  @Field(() => [String])
  batches: string[];

  @Field({ nullable: true })
  department?: string;

  @Field()
  isActive: boolean;

  @Field({ nullable: true })
  assignedBy?: string;

  @Field({ nullable: true })
  assignedAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

// Revoke Credential DTOs
@InputType()
export class AdminRevokeCredentialInput {
  @Field()
  credentialId: string;

  @Field({ nullable: true })
  reason?: string;
}

@ObjectType()
export class AdminRevokeCredentialResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field({ nullable: true })
  credentialId?: string;
}

// Exam Schedule DTOs
@InputType()
export class CreateExamScheduleInput {
  @Field()
  subject: string;

  @Field()
  examName: string;

  @Field()
  examType: string;

  @Field()
  examDate: Date;

  @Field()
  duration: number;

  @Field()
  totalMarks: number;

  @Field()
  passingMarks: number;

  @Field()
  venue: string;

  @Field()
  teacherWalletAddress: string;

  @Field()
  academicYear: string;

  @Field()
  semester: string;

  @Field()
  batch: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class UpdateExamScheduleInput {
  @Field()
  examId: string;

  @Field({ nullable: true })
  subject?: string;

  @Field({ nullable: true })
  examName?: string;

  @Field({ nullable: true })
  examType?: string;

  @Field({ nullable: true })
  examDate?: Date;

  @Field({ nullable: true })
  duration?: number;

  @Field({ nullable: true })
  totalMarks?: number;

  @Field({ nullable: true })
  passingMarks?: number;

  @Field({ nullable: true })
  venue?: string;

  @Field({ nullable: true })
  teacherWalletAddress?: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  description?: string;
}

@ObjectType()
export class ExamScheduleDto {
  @Field()
  _id: string;

  @Field()
  subject: string;

  @Field()
  examName: string;

  @Field()
  examType: string;

  @Field()
  examDate: Date;

  @Field()
  duration: number;

  @Field()
  totalMarks: number;

  @Field()
  passingMarks: number;

  @Field()
  venue: string;

  @Field()
  teacherDID: string;

  @Field()
  academicYear: string;

  @Field()
  semester: string;

  @Field()
  batch: string;

  @Field()
  status: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

// View Students by Batch DTOs
@ObjectType()
export class StudentByBatchDto {
  @Field()
  _id: string;

  @Field()
  walletAddress: string;

  @Field()
  did: string;

  @Field()
  name: string;

  @Field()
  studentId: string;

  @Field({ nullable: true })
  email?: string;

  @Field()
  isActive: boolean;

  @Field({ nullable: true })
  batch?: string;
}

import { InputType, Field, ObjectType } from '@nestjs/graphql';

// Course Setup DTOs
@ObjectType()
export class CourseSetupDto {
  @Field()
  totalSubjects: number;

  @Field()
  totalBatches: number;

  @Field()
  totalStudents: number;

  @Field(() => [SubjectInfoDto])
  subjects: SubjectInfoDto[];
}

@ObjectType()
export class SubjectInfoDto {
  @Field()
  _id: string;

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

// Upload Marks (Credential) DTOs
@InputType()
export class UploadMarksInput {
  @Field()
  studentWalletAddress: string;

  @Field()
  subject: string;

  @Field()
  marks: number;

  @Field()
  examType: string;

  @Field()
  academicYear: string;

  @Field()
  semester: string;

  @Field({ nullable: true })
  grade?: string;

  @Field({ nullable: true })
  institution?: string;
}

@ObjectType()
export class UploadMarksResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field({ nullable: true })
  credentialId?: string;

  @Field({ nullable: true })
  vcHash?: string;
}

// Teacher Students DTOs
@ObjectType()
export class TeacherStudentDto {
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

  @Field({ nullable: true })
  batch?: string;

  @Field()
  isActive: boolean;
}

// Teacher Credentials DTOs
@ObjectType()
export class TeacherCredentialDto {
  @Field()
  _id: string;

  @Field()
  studentDID: string;

  @Field()
  studentName: string;

  @Field()
  subject: string;

  @Field()
  marks: number;

  @Field({ nullable: true })
  grade?: string;

  @Field()
  examType: string;

  @Field()
  academicYear: string;

  @Field()
  semester: string;

  @Field()
  isRevoked: boolean;

  @Field({ nullable: true })
  blockchainTxHash?: string;

  @Field({ nullable: true })
  ipfsHash?: string;

  @Field()
  createdAt: Date;
}

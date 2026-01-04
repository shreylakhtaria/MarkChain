# MarkChain Backend API Documentation

## Table of Contents
1. [Admin APIs](#admin-apis)
2. [Teacher APIs](#teacher-apis)
3. [Notification APIs](#notification-apis)
4. [User Profile APIs](#user-profile-apis)

---

## Admin APIs

### 1. Assign Blockchain Role
**Mutation:** `assignBlockchainRole`
**Role Required:** ADMIN
**Description:** Assigns a blockchain role (TEACHER_ROLE, STUDENT_ROLE) to a user

```graphql
mutation {
  assignBlockchainRole(input: {
    userWalletAddress: "0x123..."
    role: "TEACHER_ROLE"
  }) {
    success
    message
    txHash
  }
}
```

### 2. Manage Teacher Subjects

#### Create Teacher Subject Assignment
**Mutation:** `createTeacherSubject`
**Role Required:** ADMIN

```graphql
mutation {
  createTeacherSubject(input: {
    teacherWalletAddress: "0x123..."
    subjectCode: "CS301"
    subjectName: "Database Management Systems"
    academicYear: "2025-2026"
    semester: "Sem-5"
    batches: ["Batch-A", "Batch-B"]
    department: "Computer Science"
  }) {
    _id
    teacherDID
    subjectCode
    subjectName
    isActive
  }
}
```

#### Get All Teacher Subjects
**Query:** `getAllTeacherSubjects`
**Role Required:** ADMIN

```graphql
query {
  getAllTeacherSubjects {
    _id
    teacherName
    subjectCode
    subjectName
    batches
    academicYear
  }
}
```

#### Get Teacher Subjects by Teacher
**Query:** `getTeacherSubjectsByTeacher`
**Role Required:** ADMIN, TEACHER

```graphql
query {
  getTeacherSubjectsByTeacher(teacherWalletAddress: "0x123...") {
    _id
    subjectCode
    subjectName
    batches
  }
}
```

#### Update Teacher Subject
**Mutation:** `updateTeacherSubject`
**Role Required:** ADMIN

```graphql
mutation {
  updateTeacherSubject(input: {
    subjectId: "60f7b..."
    subjectName: "Advanced DBMS"
    batches: ["Batch-A", "Batch-B", "Batch-C"]
  }) {
    _id
    subjectName
    batches
  }
}
```

#### Delete Teacher Subject
**Mutation:** `deleteTeacherSubject`
**Role Required:** ADMIN

```graphql
mutation {
  deleteTeacherSubject(subjectId: "60f7b...") {
    success
    message
  }
}
```

### 3. Revoke Credentials

**Mutation:** `revokeCredential`
**Role Required:** ADMIN

```graphql
mutation {
  revokeCredential(input: {
    credentialId: "60f7b..."
    reason: "Grade correction needed"
  }) {
    success
    message
    credentialId
  }
}
```

### 4. Exam Schedule CRUD Operations

#### Create Exam Schedule
**Mutation:** `createExamSchedule`
**Role Required:** ADMIN

```graphql
mutation {
  createExamSchedule(input: {
    subject: "Database Management Systems"
    examName: "Mid Term Exam"
    examType: "midterm"
    examDate: "2026-02-15T10:00:00Z"
    duration: 180
    totalMarks: 100
    passingMarks: 40
    venue: "Room 301"
    teacherWalletAddress: "0x123..."
    academicYear: "2025-2026"
    semester: "Sem-5"
    batch: "Batch-A"
    description: "Mid term examination"
  }) {
    _id
    examName
    examDate
    status
  }
}
```

#### Get All Exam Schedules
**Query:** `getAllExamSchedules`
**Role Required:** Authenticated User

```graphql
query {
  getAllExamSchedules {
    _id
    subject
    examName
    examDate
    venue
    status
  }
}
```

#### Get Exam Schedule by ID
**Query:** `getExamScheduleById`
**Role Required:** Authenticated User

```graphql
query {
  getExamScheduleById(examId: "60f7b...") {
    _id
    subject
    examName
    examDate
    totalMarks
  }
}
```

#### Update Exam Schedule
**Mutation:** `updateExamSchedule`
**Role Required:** ADMIN

```graphql
mutation {
  updateExamSchedule(input: {
    examId: "60f7b..."
    examDate: "2026-02-20T10:00:00Z"
    venue: "Room 302"
  }) {
    _id
    examDate
    venue
  }
}
```

#### Delete Exam Schedule
**Mutation:** `deleteExamSchedule`
**Role Required:** ADMIN

```graphql
mutation {
  deleteExamSchedule(examId: "60f7b...") {
    success
    message
  }
}
```

### 5. View Students by Batch

**Query:** `getStudentsByBatch`
**Role Required:** ADMIN

```graphql
query {
  getStudentsByBatch(batch: "Batch-A") {
    _id
    walletAddress
    did
    name
    studentId
    email
    batch
  }
}
```

---

## Teacher APIs

### 1. Teacher Dashboard - Course Setup

**Query:** `getTeacherCourseSetup`
**Role Required:** TEACHER

```graphql
query {
  getTeacherCourseSetup {
    totalSubjects
    totalBatches
    totalStudents
    subjects {
      _id
      subjectCode
      subjectName
      academicYear
      semester
      batches
    }
  }
}
```

### 2. Students Page in Teacher Dashboard

**Query:** `getTeacherStudents`
**Role Required:** TEACHER

```graphql
query {
  getTeacherStudents(batch: "Batch-A") {
    _id
    walletAddress
    did
    name
    studentId
    email
    batch
  }
}
```

### 3. Credentials Page in Teacher Dashboard

**Query:** `getTeacherCredentials`
**Role Required:** TEACHER

```graphql
query {
  getTeacherCredentials(subject: "Database Management Systems") {
    _id
    studentDID
    studentName
    subject
    marks
    grade
    examType
    isRevoked
    createdAt
  }
}
```

### 4. Upload Marks (Create Credential)

**Mutation:** `uploadMarks`
**Role Required:** TEACHER

```graphql
mutation {
  uploadMarks(input: {
    studentWalletAddress: "0x456..."
    subject: "Database Management Systems"
    marks: 85
    examType: "midterm"
    academicYear: "2025-2026"
    semester: "Sem-5"
    grade: "A"
    institution: "CHARUSAT University"
  }) {
    success
    message
    credentialId
    vcHash
  }
}
```

---

## Notification APIs

### 1. Get My Notifications

**Query:** `getMyNotifications`
**Role Required:** Authenticated User

```graphql
query {
  getMyNotifications(limit: 20) {
    _id
    type
    title
    message
    isRead
    createdAt
    metadata
    relatedEntityType
  }
}
```

### 2. Get Unread Notifications Count

**Query:** `getUnreadNotificationsCount`
**Role Required:** Authenticated User

```graphql
query {
  getUnreadNotificationsCount
}
```

### 3. Mark Notification as Read

**Mutation:** `markNotificationAsRead`
**Role Required:** Authenticated User

```graphql
mutation {
  markNotificationAsRead(input: {
    notificationId: "60f7b..."
  }) {
    success
    message
  }
}
```

### 4. Mark All Notifications as Read

**Mutation:** `markAllNotificationsAsRead`
**Role Required:** Authenticated User

```graphql
mutation {
  markAllNotificationsAsRead {
    success
    message
  }
}
```

### 5. Delete Notification

**Mutation:** `deleteNotification`
**Role Required:** Authenticated User

```graphql
mutation {
  deleteNotification(notificationId: "60f7b...") {
    success
    message
  }
}
```

---

## User Profile APIs

### 1. Teacher and Admin Profile Update with Email OTP

#### Send Email OTP
**Mutation:** `sendEmailOTPForProfile`
**Role Required:** TEACHER, ADMIN

```graphql
mutation {
  sendEmailOTPForProfile(input: {
    email: "teacher@example.com"
    name: "John Doe"
  }) {
    success
    message
    email
  }
}
```

#### Verify Email OTP and Update Profile
**Mutation:** `verifyEmailOTPAndUpdateProfile`
**Role Required:** TEACHER, ADMIN

```graphql
mutation {
  verifyEmailOTPAndUpdateProfile(input: {
    email: "teacher@example.com"
    otp: "123456"
    name: "John Doe"
  }) {
    success
    message
    user {
      _id
      name
      email
      walletAddress
      role
    }
  }
}
```

---

## Notification Types

The system generates the following notification types:

- **credential_issued**: When a teacher uploads marks for a student
- **credential_revoked**: When an admin revokes a credential
- **exam_scheduled**: When an admin schedules a new exam
- **marks_uploaded**: When marks are uploaded
- **profile_updated**: When a user updates their profile
- **subject_assigned**: When an admin assigns a subject to a teacher
- **role_assigned**: When an admin assigns a blockchain role to a user

---

## GraphQL Schema Generation

The GraphQL schema is automatically generated at `src/schema.gql` when you run the server.

To regenerate the schema:
```bash
npm run start:dev
```

---

## Authentication

All APIs (except auth APIs) require JWT authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Role-Based Access Control

- **ADMIN**: Full access to all admin operations
- **TEACHER**: Access to teacher dashboard and credential operations for assigned subjects
- **STUDENT**: Access to view their own credentials and notifications

---

## Error Handling

All APIs return standard GraphQL errors with appropriate error messages:

```json
{
  "errors": [
    {
      "message": "Error message here",
      "extensions": {
        "code": "BAD_REQUEST"
      }
    }
  ]
}
```

---

## Database Collections

### New Collections Added:
1. **teacher_subjects**: Stores teacher-subject assignments
2. **exam_schedules**: Stores exam schedules
3. **notifications**: Stores user notifications

### Updated Collections:
1. **users**: Added `batch` field, email verification for teachers/admins
2. **credentials**: Enhanced with blockchain and academic fields

---

## Environment Variables

Make sure these are set in your `.env` file:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/markchain

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=7d

# Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Blockchain
BLOCKCHAIN_RPC_URL=http://localhost:8545
BLOCKCHAIN_PRIVATE_KEY=your_private_key
CONTRACT_ADDRESS=your_contract_address

# IPFS
IPFS_HOST=ipfs.infura.io
IPFS_PORT=5001
IPFS_PROTOCOL=https
```

---

## Development & Testing

Start the development server:
```bash
cd be
npm install
npm run start:dev
```

Access GraphQL Playground:
```
http://localhost:3000/graphql
```

---

## Notes

1. **Blockchain Integration**: Some operations (credential anchoring, role assignment) interact with the blockchain asynchronously
2. **IPFS Storage**: Credentials are uploaded to IPFS for decentralized storage
3. **Email Notifications**: OTP emails are sent for profile verification
4. **Real-time Updates**: Consider adding subscriptions for real-time notification updates
5. **Batch Field**: The batch field in User schema can be populated during student registration or admin assignment

---

For more information, contact the development team.

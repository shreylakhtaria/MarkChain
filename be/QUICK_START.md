# Quick Start Guide - MarkChain Backend

## Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- IPFS node or Infura IPFS access
- Ethereum node (local or testnet)

## Installation

1. **Install Dependencies**
```bash
cd be
npm install
```

2. **Configure Environment**

Create a `.env` file in the `be` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/markchain

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRATION=7d

# Email Configuration (Gmail Example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password

# Blockchain Configuration
BLOCKCHAIN_RPC_URL=http://localhost:8545
BLOCKCHAIN_PRIVATE_KEY=your_private_key_without_0x
CONTRACT_ADDRESS=0x_your_deployed_contract_address

# IPFS Configuration (Infura)
IPFS_HOST=ipfs.infura.io
IPFS_PORT=5001
IPFS_PROTOCOL=https
IPFS_PROJECT_ID=your_infura_project_id
IPFS_PROJECT_SECRET=your_infura_project_secret
```

## Running the Application

### Development Mode
```bash
npm run start:dev
```

The server will start on `http://localhost:3000`

Access GraphQL Playground: `http://localhost:3000/graphql`

### Production Mode
```bash
npm run build
npm run start:prod
```

## Testing the APIs

### 1. Open GraphQL Playground
Navigate to `http://localhost:3000/graphql`

### 2. Test Authentication Flow

#### Step 1: Request Nonce
```graphql
mutation {
  requestNonce(walletAddress: "0xYourWalletAddress") {
    nonce
    message
  }
}
```

#### Step 2: Verify Signature (after signing with wallet)
```graphql
mutation {
  verifySignature(input: {
    walletAddress: "0xYourWalletAddress"
    signature: "0xYourSignature"
  }) {
    accessToken
    user {
      walletAddress
      did
      role
      name
    }
  }
}
```

#### Step 3: Set Authorization Header
In GraphQL Playground, add to HTTP Headers:
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN_HERE"
}
```

### 3. Test Admin APIs

#### Assign Blockchain Role
```graphql
mutation {
  assignBlockchainRole(input: {
    userWalletAddress: "0xTeacherWalletAddress"
    role: "TEACHER_ROLE"
  }) {
    success
    message
    txHash
  }
}
```

#### Create Teacher Subject Assignment
```graphql
mutation {
  createTeacherSubject(input: {
    teacherWalletAddress: "0xTeacherWallet"
    subjectCode: "CS301"
    subjectName: "Database Management Systems"
    academicYear: "2025-2026"
    semester: "Sem-5"
    batches: ["Batch-A", "Batch-B"]
    department: "Computer Science"
  }) {
    _id
    subjectCode
    subjectName
  }
}
```

#### Schedule an Exam
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
    teacherWalletAddress: "0xTeacherWallet"
    academicYear: "2025-2026"
    semester: "Sem-5"
    batch: "Batch-A"
  }) {
    _id
    examName
    status
  }
}
```

### 4. Test Teacher APIs

#### Get Course Setup
```graphql
query {
  getTeacherCourseSetup {
    totalSubjects
    totalBatches
    totalStudents
    subjects {
      subjectCode
      subjectName
      batches
    }
  }
}
```

#### Upload Marks
```graphql
mutation {
  uploadMarks(input: {
    studentWalletAddress: "0xStudentWallet"
    subject: "CS301"
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

### 5. Test Notification APIs

#### Get My Notifications
```graphql
query {
  getMyNotifications(limit: 10) {
    _id
    type
    title
    message
    isRead
    createdAt
  }
}
```

#### Mark Notification as Read
```graphql
mutation {
  markNotificationAsRead(input: {
    notificationId: "notification_id_here"
  }) {
    success
    message
  }
}
```

### 6. Test User Profile APIs

#### Send Email OTP (Teacher/Admin)
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

#### Verify Email OTP
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
      name
      email
      role
    }
  }
}
```

## Database Setup

### MongoDB Collections

The following collections will be automatically created:

1. **users** - User accounts and profiles
2. **credentials** - Academic credentials (VCs)
3. **teachersubjects** - Teacher-subject assignments
4. **examschedules** - Exam schedules
5. **notifications** - User notifications

### Initial Data Setup

Create an admin user manually in MongoDB:

```javascript
use markchain

db.users.insertOne({
  walletAddress: "0xYourAdminWallet",
  did: "did:ethr:0xYourAdminWallet",
  role: "ADMIN",
  name: "Admin User",
  email: "admin@example.com",
  isActive: true,
  isVerified: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Ensure MongoDB is running
```bash
# Start MongoDB
mongod --dbpath /path/to/data
```

#### 2. Email OTP Not Sending
**Solution:** 
- Check EMAIL_* environment variables
- Use Gmail App Password (not regular password)
- Enable "Less secure app access" or use App Password

#### 3. Blockchain Connection Error
**Solution:**
- Ensure blockchain node is running
- Check BLOCKCHAIN_RPC_URL
- Verify CONTRACT_ADDRESS is deployed

#### 4. IPFS Upload Fails
**Solution:**
- Check IPFS configuration
- Verify Infura credentials
- Ensure IPFS node is accessible

## Development Tips

### Auto-reload on Changes
The development server watches for file changes and auto-reloads.

### View Generated Schema
Check `src/schema.gql` for the complete GraphQL schema.

### Debug Mode
```bash
npm run start:debug
```
Then attach debugger on port 9229.

### Linting
```bash
npm run lint
```

### Format Code
```bash
npm run format
```

## Project Structure

```
be/
├── src/
│   ├── admin/              # Admin module
│   ├── auth/               # Authentication
│   ├── blockchain/         # Blockchain integration
│   ├── config/             # Configuration
│   ├── email/              # Email service
│   ├── notification/       # Notification system
│   ├── schemas/            # Mongoose schemas
│   ├── teacher/            # Teacher module
│   ├── user/               # User management
│   ├── utility/            # Utility functions
│   ├── app.module.ts       # Root module
│   ├── main.ts             # Application entry
│   └── schema.gql          # Generated GraphQL schema
├── test/                   # Test files
├── .env                    # Environment variables
├── package.json            # Dependencies
└── tsconfig.json           # TypeScript config
```

## API Documentation

Complete API documentation is available in:
- **`API_DOCUMENTATION.md`** - Detailed API reference
- **`IMPLEMENTATION_SUMMARY.md`** - Implementation details

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure environment variables
3. ✅ Start MongoDB
4. ✅ Deploy smart contracts
5. ✅ Run the application
6. ✅ Test APIs in GraphQL Playground
7. ✅ Create initial admin user
8. ✅ Integrate with frontend

## Production Deployment

### Build for Production
```bash
npm run build
```

### Environment Configuration
- Set NODE_ENV=production
- Use strong JWT_SECRET
- Configure production database
- Set up SSL/TLS
- Configure CORS properly
- Use production blockchain network

### Monitoring
- Set up logging (Winston, Pino)
- Monitor error rates
- Track API performance
- Set up alerts

## Support

For issues or questions:
1. Check API_DOCUMENTATION.md
2. Check IMPLEMENTATION_SUMMARY.md
3. Review error logs
4. Contact development team

---

**Last Updated:** January 4, 2026
**Version:** 1.0.0

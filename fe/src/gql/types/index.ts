// Input Types
export interface VerifySignatureInput {
  walletAddress: string;
  signature: string;
  nonce: string;
}

export interface SendOTPInput {
  studentId: string;
}

export interface VerifyOTPInput {
  otp: string;
  name: string;
  studentId: string;
}

// User Types
export interface User {
  _id?: string;
  walletAddress: string;
  did?: string;
  role: UserRole;
  name?: string;
  email?: string;
  studentId?: string;
  subjects?: string[];
  isActive?: boolean;
  lastLogin?: string;
}

export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

// Response Types
export interface GenerateNonceResponse {
  generateNonce: {
    nonce: string;
    message: string;
  };
}

export interface VerifySignatureResponse {
  verifySignature: {
    accessToken: string;
    user: {
      walletAddress: string;
      did: string;
      role: UserRole;
      name?: string;
      email?: string;
    };
  };
}

export interface GetAllUsersResponse {
  getAllUsers: User[];
}

export interface GetUserProfileResponse {
  getUserProfile: User;
}

export interface GetUsersByRoleResponse {
  getUsersByRole: User[];
}

export interface SendOTPResponse {
  sendOTPForVerification: {
    success: boolean;
    message: string;
    email: string;
  };
}

export interface VerifyOTPResponse {
  verifyOTPAndUpdateProfile: {
    success: boolean;
    message: string;
    user: {
      id: string;
      name: string;
      studentId: string;
      isVerified: boolean;
      walletAddress: string;
      role: UserRole;
    };
  };
}

// Blockchain Input Types
export interface AssignBlockchainRoleInput {
  userAddress: string;
  role: string;
}

export interface AssignSubjectToTeacherInput {
  teacherAddress: string;
  subject: string;
}

export interface RemoveSubjectFromTeacherInput {
  teacherAddress: string;
  subject: string;
}

export interface RevokeBlockchainCredentialInput {
  studentAddress: string;
  subject: string;
}

export interface LinkWalletAddressInput {
  walletAddress: string;
}

export interface RegisterUserDIDInput {
  did: string;
}

export interface IssueBlockchainCredentialInput {
  studentAddress: string;
  subject: string;
  credentialData: string;
}

export interface VerifyBlockchainCredentialInput {
  studentAddress: string;
  subject: string;
}

// Blockchain Response Types
export interface BlockchainOperationResponse {
  success: boolean;
  transactionHash?: string;
  message?: string;
  error?: string;
}

export interface BlockchainStatus {
  walletAddress?: string;
  didHash?: string;
  blockchainRole?: string;
  didRegistered: boolean;
  hasBlockchainRole: boolean;
  assignedSubjects: string[];
}

export interface BlockchainCredential {
  ipfsHash: string;
  issuer: string;
  updatedAt: string;
  subject: string;
  studentName: string;
  grade: string;
  blockchainTxHash: string;
}

export interface BlockchainNetworkInfo {
  contractAddress: string;
  walletAddress: string;
  network: string;
  chainId: number;
  isConnected: boolean;
}

// Blockchain Query Response Types
export interface GetMyBlockchainStatusResponse {
  getMyBlockchainStatus: BlockchainStatus;
}

export interface GetMyAssignedSubjectsResponse {
  getMyAssignedSubjects: string[];
}

export interface GetMySubjectCredentialResponse {
  getMySubjectCredential: BlockchainCredential;
}

export interface GetMyBlockchainCredentialsResponse {
  getMyBlockchainCredentials: BlockchainCredential[];
}

export interface VerifyBlockchainCredentialResponse {
  verifyBlockchainCredential: BlockchainCredential;
}

export interface GetBlockchainNetworkInfoResponse {
  getBlockchainNetworkInfo: BlockchainNetworkInfo;
}

export interface TestIPFSConnectionResponse {
  testIPFSConnection: boolean;
}

// Blockchain Mutation Response Types
export interface AssignBlockchainRoleResponse {
  assignBlockchainRole: BlockchainOperationResponse;
}

export interface AssignSubjectToTeacherResponse {
  assignSubjectToTeacher: BlockchainOperationResponse;
}

export interface RemoveSubjectFromTeacherResponse {
  removeSubjectFromTeacher: BlockchainOperationResponse;
}

export interface RevokeBlockchainCredentialResponse {
  revokeBlockchainCredential: BlockchainOperationResponse;
}

export interface LinkWalletAddressResponse {
  linkWalletAddress: BlockchainOperationResponse;
}

export interface RegisterUserDIDResponse {
  registerUserDID: BlockchainOperationResponse;
}

export interface IssueBlockchainCredentialResponse {
  issueBlockchainCredential: BlockchainOperationResponse;
}

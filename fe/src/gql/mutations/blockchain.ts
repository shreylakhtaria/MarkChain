import { gql } from '@apollo/client';

// ADMIN OPERATIONS
export const ASSIGN_BLOCKCHAIN_ROLE = gql`
  mutation AssignBlockchainRole($input: AssignBlockchainRoleInput!) {
    assignBlockchainRole(input: $input) {
      success
      transactionHash
      message
      error
    }
  }
`;

export const ASSIGN_SUBJECT_TO_TEACHER = gql`
  mutation AssignSubjectToTeacher($input: AssignSubjectToTeacherInput!) {
    assignSubjectToTeacher(input: $input) {
      success
      transactionHash
      message
      error
    }
  }
`;

export const REMOVE_SUBJECT_FROM_TEACHER = gql`
  mutation RemoveSubjectFromTeacher($input: RemoveSubjectFromTeacherInput!) {
    removeSubjectFromTeacher(input: $input) {
      success
      transactionHash
      message
      error
    }
  }
`;

export const REVOKE_BLOCKCHAIN_CREDENTIAL = gql`
  mutation RevokeBlockchainCredential($input: RevokeBlockchainCredentialInput!) {
    revokeBlockchainCredential(input: $input) {
      success
      transactionHash
      message
      error
    }
  }
`;

// USER OPERATIONS
export const LINK_WALLET_ADDRESS = gql`
  mutation LinkWalletAddress($input: LinkWalletAddressInput!) {
    linkWalletAddress(input: $input) {
      success
      transactionHash
      message
      error
    }
  }
`;

export const REGISTER_USER_DID = gql`
  mutation RegisterUserDID($input: RegisterUserDIDInput!) {
    registerUserDID(input: $input) {
      success
      transactionHash
      message
      error
    }
  }
`;

// TEACHER OPERATIONS
export const ISSUE_BLOCKCHAIN_CREDENTIAL = gql`
  mutation IssueBlockchainCredential($input: IssueBlockchainCredentialInput!) {
    issueBlockchainCredential(input: $input) {
      success
      transactionHash
      message
      error
    }
  }
`;
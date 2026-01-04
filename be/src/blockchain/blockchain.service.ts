import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { GRADING_SSI_ABI } from './contract-abi';

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  private provider: ethers.Provider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;

  constructor(private configService: ConfigService) {
    this.initializeBlockchain();
  }

  private initializeBlockchain() {
    try {
      const rpcUrl = this.configService.get<string>('BLOCKCHAIN_RPC_URL');
      const privateKey = this.configService.get<string>('BLOCKCHAIN_PRIVATE_KEY');
      const contractAddress = this.configService.get<string>('CONTRACT_ADDRESS');

      this.logger.log(`Blockchain Config - RPC URL: ${rpcUrl}`);
      this.logger.log(`Blockchain Config - Private Key: ${privateKey ? privateKey.substring(0, 10) + '...' : 'NOT SET'}`);
      this.logger.log(`Blockchain Config - Contract Address: ${contractAddress}`);

      if (!rpcUrl || !privateKey || !contractAddress) {
        throw new Error('Missing required blockchain configuration');
      }

      if (privateKey === 'your_private_key_here') {
        throw new Error('Please set a real private key in BLOCKCHAIN_PRIVATE_KEY environment variable');
      }

      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      this.wallet = new ethers.Wallet(privateKey, this.provider);
      this.contract = new ethers.Contract(contractAddress, GRADING_SSI_ABI, this.wallet);

      this.logger.log('Blockchain service initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize blockchain service:', error);
      throw error;
    }
  }

  // Role Management Functions
  async assignRole(userAddress: string, role: string): Promise<string> {
    try {
      const tx = await this.contract.assignRole(userAddress, role);
      await tx.wait();
      this.logger.log(`Role ${role} assigned to ${userAddress}`);
      return tx.hash;
    } catch (error) {
      this.logger.error(`Failed to assign role: ${error.message}`);
      throw error;
    }
  }

  async grantRole(role: string, account: string): Promise<string> {
    try {
      const tx = await this.contract.grantRole(role, account);
      await tx.wait();
      this.logger.log(`Role ${role} granted to ${account}`);
      return tx.hash;
    } catch (error) {
      this.logger.error(`Failed to grant role: ${error.message}`);
      throw error;
    }
  }

  async revokeRole(role: string, account: string): Promise<string> {
    try {
      const tx = await this.contract.revokeRole(role, account);
      await tx.wait();
      this.logger.log(`Role ${role} revoked from ${account}`);
      return tx.hash;
    } catch (error) {
      this.logger.error(`Failed to revoke role: ${error.message}`);
      throw error;
    }
  }

  async hasRole(role: string, account: string): Promise<boolean> {
    try {
      return await this.contract.hasRole(role, account);
    } catch (error) {
      this.logger.error(`Failed to check role: ${error.message}`);
      throw error;
    }
  }

  // DID Management Functions
  async registerDID(did: string): Promise<string> {
    try {
      const tx = await this.contract.registerDID(did);
      await tx.wait();
      this.logger.log(`DID registered: ${did}`);
      return tx.hash;
    } catch (error) {
      this.logger.error(`Failed to register DID: ${error.message}`);
      throw error;
    }
  }

  async getDID(userAddress: string): Promise<string> {
    try {
      const didBytes32 = await this.contract.didRegistry(userAddress);
      return didBytes32 === ethers.ZeroHash ? '' : didBytes32;
    } catch (error) {
      this.logger.error(`Failed to get DID: ${error.message}`);
      throw error;
    }
  }

  // Credential Management Functions
  async issueOrUpdateCredential(
    studentAddress: string,
    subject: string,
    ipfsHash: string
  ): Promise<string> {
    try {
      const tx = await this.contract.issueOrUpdateCredential(
        studentAddress,
        subject,
        ipfsHash
      );
      await tx.wait();
      this.logger.log(`Credential issued for ${studentAddress} in ${subject}`);
      return tx.hash;
    } catch (error) {
      this.logger.error(`Failed to issue credential: ${error.message}`);
      throw error;
    }
  }

  // Alias method for issueOrUpdateCredential with DID-based parameters
  async issueCredential(
    studentDID: string,
    vcHash: string,
    ipfsHash: string
  ): Promise<string> {
    try {
      // Extract address from DID if needed, or use as is
      // DID format: did:ethr:0xAddress
      const addressMatch = studentDID.match(/0x[a-fA-F0-9]{40}/);
      const studentAddress = addressMatch ? addressMatch[0] : studentDID;

      // Use a generic subject identifier or hash for this type of credential
      const tx = await this.contract.issueOrUpdateCredential(
        studentAddress,
        vcHash.substring(0, 32), // Use first 32 chars of hash as subject identifier
        ipfsHash
      );
      await tx.wait();
      this.logger.log(`Credential issued for ${studentDID} with hash ${vcHash}`);
      return tx.hash;
    } catch (error) {
      this.logger.error(`Failed to issue credential: ${error.message}`);
      throw error;
    }
  }

  async revokeCredential(studentAddress: string, subject: string): Promise<string> {
    try {
      const tx = await this.contract.revokeCredential(studentAddress, subject);
      await tx.wait();
      this.logger.log(`Credential revoked for ${studentAddress} in ${subject}`);
      return tx.hash;
    } catch (error) {
      this.logger.error(`Failed to revoke credential: ${error.message}`);
      throw error;
    }
  }

  async getMySubjectCredential(subject: string): Promise<any> {
    try {
      return await this.contract.getMySubjectCredential(subject);
    } catch (error) {
      this.logger.error(`Failed to get my credential: ${error.message}`);
      throw error;
    }
  }

  async getStudentSubjectCredential(
    studentAddress: string,
    subject: string
  ): Promise<any> {
    try {
      return await this.contract.getStudentSubjectCredential(studentAddress, subject);
    } catch (error) {
      this.logger.error(`Failed to get student credential: ${error.message}`);
      throw error;
    }
  }

  // Subject Management Functions
  async assignSubjectToTeacher(teacherAddress: string, subject: string): Promise<string> {
    try {
      const tx = await this.contract.assignSubjectToTeacher(teacherAddress, subject);
      await tx.wait();
      this.logger.log(`Subject ${subject} assigned to teacher ${teacherAddress}`);
      return tx.hash;
    } catch (error) {
      this.logger.error(`Failed to assign subject to teacher: ${error.message}`);
      throw error;
    }
  }

  async removeSubjectFromTeacher(teacherAddress: string, subject: string): Promise<string> {
    try {
      const tx = await this.contract.removeSubjectFromTeacher(teacherAddress, subject);
      await tx.wait();
      this.logger.log(`Subject ${subject} removed from teacher ${teacherAddress}`);
      return tx.hash;
    } catch (error) {
      this.logger.error(`Failed to remove subject from teacher: ${error.message}`);
      throw error;
    }
  }

  async getTeacherSubjects(teacherAddress: string): Promise<string[]> {
    try {
      const subjects: string[] = [];
      let index = 0;
      
      while (true) {
        try {
          const subject = await this.contract.teacherSubjects(teacherAddress, index);
          if (!subject) break;
          subjects.push(subject);
          index++;
        } catch {
          break;
        }
      }
      
      return subjects;
    } catch (error) {
      this.logger.error(`Failed to get teacher subjects: ${error.message}`);
      throw error;
    }
  }

  // Role Constants
  getRoleConstants() {
    return {
      DEFAULT_ADMIN_ROLE: ethers.ZeroHash,
      STUDENT_ROLE: ethers.keccak256(ethers.toUtf8Bytes('STUDENT_ROLE')),
      TEACHER_ROLE: ethers.keccak256(ethers.toUtf8Bytes('TEACHER_ROLE'))
    };
  }

  // Utility Functions
  getContractAddress(): string {
    return this.contract.target.toString();
  }

  getWalletAddress(): string {
    return this.wallet.address;
  }
}
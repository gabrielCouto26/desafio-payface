import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import TransactionCore from './transaction.core';
import { Transaction } from './entities/transaction.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
import { TransactionDto } from './dto/transaction.dto';
import { TransactionStatus } from './transaction.interfaces';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('TransactionCore', () => {
  let transactionCore: TransactionCore;

  const mockTransactionRepository = {
    save: jest.fn(),
  };

  const mockWalletRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockRedisClient = {
    get: jest.fn(),
    set: jest.fn(),
    disconnect: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionCore,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepository,
        },
        {
          provide: getRepositoryToken(Wallet),
          useValue: mockWalletRepository,
        },
        {
          provide: 'RedisClient',
          useValue: mockRedisClient,
        },
      ],
    }).compile();

    transactionCore = module.get<TransactionCore>(TransactionCore);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const mockTransactionDto: TransactionDto = {
      fromWalletId: 'wallet-1',
      toWalletId: 'wallet-2',
      amount: 100,
    };

    const mockSourceWallet: Wallet = {
      id: 'wallet-1',
      balance: 500,
      createdAt: new Date(),
      updatedAt: new Date(),
      transactions: [],
    };

    const mockDestinationWallet: Wallet = {
      id: 'wallet-2',
      balance: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
      transactions: [],
    };

    it('should successfully execute a transaction', async () => {
      mockRedisClient.get.mockResolvedValue(null);
      mockWalletRepository.findOne
        .mockResolvedValueOnce(mockSourceWallet)
        .mockResolvedValueOnce(mockDestinationWallet);
      mockWalletRepository.save.mockResolvedValue(mockSourceWallet);
      mockTransactionRepository.save.mockResolvedValue({});

      await transactionCore.execute(mockTransactionDto);

      expect(mockWalletRepository.save).toHaveBeenCalledTimes(2);
      expect(mockTransactionRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          fromWalletId: mockTransactionDto.fromWalletId,
          toWalletId: mockTransactionDto.toWalletId,
          amount: mockTransactionDto.amount,
          status: TransactionStatus.SUCCESS,
        }),
      );
    });

    it('should throw BadRequestException when source wallet has insufficient balance', async () => {
      const insufficientWallet = { ...mockSourceWallet, balance: 50 };
      mockRedisClient.get.mockResolvedValue(null);
      mockWalletRepository.findOne.mockResolvedValueOnce(insufficientWallet);

      await expect(transactionCore.execute(mockTransactionDto)).rejects.toThrow(
        BadRequestException,
      );

      expect(mockTransactionRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: TransactionStatus.FAILED,
        }),
      );
    });

    it('should throw NotFoundException when source wallet is not found', async () => {
      mockRedisClient.get.mockResolvedValue(null);
      mockWalletRepository.findOne.mockResolvedValueOnce(null);

      await expect(transactionCore.execute(mockTransactionDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getWallet', () => {
    const mockWallet: Wallet = {
      id: 'wallet-1',
      balance: 500,
      createdAt: new Date(),
      updatedAt: new Date(),
      transactions: [],
    };

    it('should return wallet from cache if available', async () => {
      const cachedWallet = {
        ...mockWallet,
        createdAt: mockWallet.createdAt.toISOString(),
        updatedAt: mockWallet.updatedAt.toISOString(),
      };
      mockRedisClient.get.mockResolvedValue(JSON.stringify(cachedWallet));

      const result = await (transactionCore as any).getWallet('wallet-1');

      expect(result).toEqual({
        ...mockWallet,
        createdAt: new Date(mockWallet.createdAt.toISOString()),
        updatedAt: new Date(mockWallet.updatedAt.toISOString()),
      });
      expect(mockWalletRepository.findOne).not.toHaveBeenCalled();
    });

    it('should fetch wallet from database if not in cache', async () => {
      mockRedisClient.get.mockResolvedValue(null);
      mockWalletRepository.findOne.mockResolvedValue(mockWallet);

      const result = await (transactionCore as any).getWallet('wallet-1');

      expect(result).toEqual(mockWallet);
      expect(mockWalletRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'wallet-1' },
      });
    });

    it('should throw NotFoundException when wallet is not found', async () => {
      mockRedisClient.get.mockResolvedValue(null);
      mockWalletRepository.findOne.mockResolvedValue(null);

      await expect(
        (transactionCore as any).getWallet('non-existent'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('checkWalletBalance', () => {
    const mockWallet: Wallet = {
      id: 'wallet-1',
      balance: 500,
      createdAt: new Date(),
      updatedAt: new Date(),
      transactions: [],
    };

    it('should return null when wallet has sufficient balance', () => {
      const result = (transactionCore as any).checkWalletBalance(
        mockWallet,
        100,
      );
      expect(result).toBeNull();
    });

    it('should throw BadRequestException when wallet has insufficient balance', () => {
      expect(() =>
        (transactionCore as any).checkWalletBalance(mockWallet, 600),
      ).toThrow(BadRequestException);
    });
  });

  describe('increaseWalletBalance', () => {
    const mockWallet: Wallet = {
      id: 'wallet-1',
      balance: 500,
      createdAt: new Date(),
      updatedAt: new Date(),
      transactions: [],
    };

    it('should increase wallet balance and update cache', async () => {
      mockWalletRepository.findOne.mockResolvedValue(mockWallet);
      mockWalletRepository.save.mockResolvedValue({
        ...mockWallet,
        balance: 600,
      });

      await (transactionCore as any).increaseWalletBalance('wallet-1', 100);

      expect(mockWalletRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          balance: 600,
        }),
      );
      expect(mockRedisClient.set).toHaveBeenCalled();
    });

    it('should throw NotFoundException when wallet is not found', async () => {
      mockWalletRepository.findOne.mockResolvedValue(null);

      await expect(
        (transactionCore as any).increaseWalletBalance('non-existent', 100),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('decreaseWalletBalance', () => {
    const mockWallet: Wallet = {
      id: 'wallet-1',
      balance: 500,
      createdAt: new Date(),
      updatedAt: new Date(),
      transactions: [],
    };

    it('should decrease wallet balance and update cache', async () => {
      mockWalletRepository.save.mockResolvedValue({
        ...mockWallet,
        balance: 400,
      });

      await (transactionCore as any).decreaseWalletBalance(mockWallet, 100);

      expect(mockWalletRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          balance: 400,
        }),
      );
      expect(mockRedisClient.set).toHaveBeenCalled();
    });
  });

  describe('createTransaction', () => {
    const mockTransactionDto: TransactionDto = {
      fromWalletId: 'wallet-1',
      toWalletId: 'wallet-2',
      amount: 100,
    };

    it('should create a transaction with the given status', async () => {
      const mockTransaction = {
        ...mockTransactionDto,
        status: TransactionStatus.SUCCESS,
        createdAt: expect.any(Date),
      };

      mockTransactionRepository.save.mockResolvedValue(mockTransaction);

      await (transactionCore as any).createTransaction(
        mockTransactionDto,
        TransactionStatus.SUCCESS,
      );

      expect(mockTransactionRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          fromWalletId: mockTransactionDto.fromWalletId,
          toWalletId: mockTransactionDto.toWalletId,
          amount: mockTransactionDto.amount,
          status: TransactionStatus.SUCCESS,
        }),
      );
    });
  });
});

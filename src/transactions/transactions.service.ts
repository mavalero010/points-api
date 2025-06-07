import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { RegisterPurchaseInput } from './dto/register-purchase.input';
import { RedeemPointsInput } from './dto/redeem-points.input';
import { UsersService } from '../users/users.service';
import { RewardsService } from '../rewards/rewards.service';
import { MongoLoggerService } from '../common/services/mongo-logger.service';
import { InsufficientPointsException } from '../common/exceptions/custom.exception';
import { CloudFunctionService } from '../common/services/cloud-function.service';
import { User } from '../users/entities/user.entity';
import { Reward } from '../rewards/entities/reward.entity';
import { TransactionLog, SystemLog } from '../common/interfaces/log.interface';

@Injectable()
export class TransactionsService {
  private readonly POINTS_MULTIPLIER = 0.1; // 10% del monto en puntos

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Reward)
    private readonly rewardsRepository: Repository<Reward>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => RewardsService))
    private readonly rewardsService: RewardsService,
    private readonly logger: MongoLoggerService,
    private readonly cloudFunction: CloudFunctionService,
  ) {}

  async registerPurchase(input: RegisterPurchaseInput): Promise<Transaction> {
    const { userId, amount } = input;
    const points = Math.floor(amount * this.POINTS_MULTIPLIER);
    const reference = `PURCHASE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Verificar que el usuario existe y obtenerlo
    const user = await this.usersService.findOne(userId);

    // Crear la transacción
    const newTransaction = this.transactionRepository.create({
      userId,
      user, // Asignar el usuario directamente
      type: TransactionType.EARN,
      points,
      reference,
      description: `Compra registrada por ${amount}`,
      date: new Date(),
    });

    // Guardar la transacción
    const savedTransaction = await this.transactionRepository.save(newTransaction);

    // Actualizar puntos del usuario
    await this.usersService.updatePoints(userId, points);

    // Registrar en MongoDB
    await this.logger.logTransaction({
      userId,
      transactionType: 'earn',
      points,
      status: 'success',
      level: 'info',
      message: `Puntos acreditados por compra: ${points}`,
      metadata: { amount, reference },
    });

    // Enviar a Cloud Function
    try {
      await this.cloudFunction.registerPoints({
        userId,
        points,
        transactionId: savedTransaction.id,
      });
    } catch (error) {
      await this.logger.logSystemEvent({
        level: 'error',
        message: 'Error al registrar puntos en Cloud Function',
        component: 'TransactionsService',
        action: 'registerPurchase',
        success: false,
        metadata: { error: error.message },
      });
    }

    // Retornar la transacción con la relación cargada
    const foundTransaction = await this.transactionRepository.findOne({
      where: { id: savedTransaction.id },
      relations: ['user'],
    });

    if (!foundTransaction) {
      throw new NotFoundException(`No se encontró la transacción con ID ${savedTransaction.id}`);
    }

    return foundTransaction;
  }

  async redeemPoints(input: RedeemPointsInput): Promise<Transaction> {
    try {
      const { userId, rewardId, description } = input;

      // Obtener usuario y recompensa
      const [user, reward] = await Promise.all([
        this.usersService.findOne(userId),
        this.rewardsService.findOne(rewardId),
      ]);

      // Verificar puntos suficientes
      if (user.totalPoints < reward.pointsCost) {
        throw new InsufficientPointsException(user.totalPoints, reward.pointsCost);
      }

      // Crear la transacción
      const transaction = this.transactionRepository.create({
        userId,
        type: TransactionType.REDEEM,
        points: -reward.pointsCost,
        description: description || `Redención: ${reward.name}`,
        date: new Date(),
      });

      // Guardar la transacción
      const savedTransaction = await this.transactionRepository.save(transaction);

      // Actualizar puntos del usuario
      await this.usersService.updatePoints(userId, -reward.pointsCost);

      // Registrar en MongoDB
      await this.logger.logTransaction({
        userId,
        transactionType: 'redeem',
        points: reward.pointsCost,
        status: 'success',
        level: 'info',
        message: `Puntos redimidos por recompensa: ${reward.pointsCost}`,
        metadata: { rewardId, rewardName: reward.name },
      });

      // Retornar la transacción con la relación cargada
      const foundTransaction = await this.transactionRepository.findOne({
        where: { id: savedTransaction.id },
        relations: {
          user: true
        }
      });

      if (!foundTransaction) {
        throw new NotFoundException(`No se encontró la transacción con ID ${savedTransaction.id}`);
      }

      return foundTransaction;
    } catch (error) {
      // Registrar el error en MongoDB
      await this.logger.logSystemEvent({
        level: 'error',
        message: `Error al redimir puntos: ${error.message}`,
        component: 'TransactionsService',
        action: 'redeemPoints',
        success: false,
        metadata: { 
          userId: input.userId,
          rewardId: input.rewardId,
          error: error.message 
        },
      });

      throw error;
    }
  }

  async getUserHistory(userId: string): Promise<Transaction[]> {
    // Verificar que el usuario existe
    await this.usersService.findOne(userId);

    return this.transactionRepository.find({
      where: { userId },
      order: { date: 'DESC' },
    });
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find({
      order: { date: 'DESC' },
    });
  }

  async getTransactionLogs(userId: string): Promise<TransactionLog[]> {
    return this.logger.getTransactionLogs(userId);
  }

  async getSystemLogs(): Promise<SystemLog[]> {
    return this.logger.getSystemLogs();
  }
} 
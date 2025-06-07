import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserNotFoundException } from '../common/exceptions/custom.exception';
import { MongoLoggerService } from '../common/services/mongo-logger.service';
import { CreateUserInput } from './dto/create-user.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly logger: MongoLoggerService,
  ) {}

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: {
        transactions: false // No cargamos las transacciones por defecto
      }
    });

    if (!user) {
      await this.logger.logSystemEvent({
        level: 'warning',
        message: `Intento de acceso a usuario no existente: ${id}`,
        component: 'UsersService',
        action: 'findOne',
        success: false,
      });
      throw new UserNotFoundException(id);
    }

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async updatePoints(userId: string, points: number): Promise<User> {
    const user = await this.findOne(userId);
    const newTotal = user.totalPoints + points;
    
    if (newTotal < 0) {
      await this.logger.logSystemEvent({
        level: 'error',
        message: `Intento de actualizar puntos resultando en balance negativo: ${newTotal}`,
        component: 'UsersService',
        action: 'updatePoints',
        success: false,
        metadata: { userId: userId, pointsChange: points },
      });
      throw new Error('El balance de puntos no puede ser negativo');
    }

    user.totalPoints = newTotal;

    await this.logger.logSystemEvent({
      level: 'info',
      message: `Puntos actualizados para usuario ${userId}`,
      component: 'UsersService',
      action: 'updatePoints',
      success: true,
      metadata: { userId: userId, pointsChange: points, newBalance: newTotal },
    });

    return this.usersRepository.save(user);
  }

  async create(input: CreateUserInput): Promise<User> {
    const user = this.usersRepository.create(input);
    return this.usersRepository.save(user);
  }
} 
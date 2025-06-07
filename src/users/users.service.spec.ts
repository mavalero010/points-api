import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserNotFoundException } from '../common/exceptions/custom.exception';
import { MongoLoggerService } from '../common/services/mongo-logger.service';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;
  let logger: MongoLoggerService;

  const mockUser: User = {
    id: '123',
    name: 'Test User',
    totalPoints: 100,
    transactions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
  };

  const mockLogger = {
    logSystemEvent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: MongoLoggerService,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    logger = module.get<MongoLoggerService>(MongoLoggerService);

    // Limpiar todos los mocks
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('debería retornar un usuario cuando existe', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne('123');

      expect(result).toEqual(mockUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '123' },
        relations: ['transactions'],
      });
    });

    it('debería lanzar UserNotFoundException cuando el usuario no existe', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('123')).rejects.toThrow(UserNotFoundException);
      expect(mockLogger.logSystemEvent).toHaveBeenCalledWith({
        level: 'warning',
        message: 'Intento de acceso a usuario no existente: 123',
        component: 'UsersService',
        action: 'findOne',
        success: false,
      });
    });
  });

  describe('findAll', () => {
    it('debería retornar un array de usuarios', async () => {
      const users = [mockUser];
      mockRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('updatePoints', () => {
    it('debería actualizar los puntos del usuario correctamente', async () => {
      const updatedUser = { ...mockUser, totalPoints: 150 };
      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updatePoints('123', 50);

      expect(result).toEqual(updatedUser);
      expect(mockLogger.logSystemEvent).toHaveBeenCalledWith({
        level: 'info',
        message: 'Puntos actualizados para usuario 123',
        component: 'UsersService',
        action: 'updatePoints',
        success: true,
        metadata: { userId: '123', pointsChange: 50, newBalance: 150 },
      });
    });

    it('debería lanzar error cuando los puntos resultantes son negativos', async () => {
      const userWithPoints = { ...mockUser, totalPoints: 100 };
      mockRepository.findOne.mockResolvedValue(userWithPoints);

      const pointsToDeduct = -150; // Intentar deducir más puntos de los que tiene
      await expect(service.updatePoints('123', pointsToDeduct)).rejects.toThrow(
        'El balance de puntos no puede ser negativo'
      );

      expect(mockLogger.logSystemEvent).toHaveBeenCalledWith({
        level: 'error',
        message: 'Intento de actualizar puntos resultando en balance negativo: -50',
        component: 'UsersService',
        action: 'updatePoints',
        success: false,
        metadata: { userId: '123', pointsChange: pointsToDeduct },
      });
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('debería lanzar UserNotFoundException cuando el usuario no existe', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.updatePoints('123', 50)).rejects.toThrow(UserNotFoundException);
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });
}); 
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class CloudFunctionService {
  private readonly logger = new Logger(CloudFunctionService.name);
  private readonly functionUrl: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.functionUrl = this.configService.get<string>('CLOUD_FUNCTION_URL');
    if (!this.functionUrl) {
      this.logger.warn('CLOUD_FUNCTION_URL no está configurada');
    }
  }

  async registerPoints(data: {
    userId: string;
    points: number;
    transactionId: string;
  }): Promise<void> {
    if (!this.functionUrl) {
      this.logger.warn('Cloud Function no configurada, omitiendo registro');
      return;
    }

    try {
      const response = await axios.post(this.functionUrl, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        throw new Error(`Error en Cloud Function: ${response.statusText}`);
      }

      this.logger.log(`Puntos registrados en Cloud Function: ${JSON.stringify(data)}`);
    } catch (error) {
      this.logger.error(
        `Error al invocar Cloud Function: ${error.message}`,
        error.stack,
      );
      // No lanzamos el error para no interrumpir el flujo principal
    }
  }
} 
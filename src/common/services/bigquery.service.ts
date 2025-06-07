import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BigQuery } from '@google-cloud/bigquery';

@Injectable()
export class BigQueryService {
  private readonly bigquery: BigQuery;
  private readonly datasetId: string;
  private readonly tableId: string;

  constructor(private readonly configService: ConfigService) {
    this.bigquery = new BigQuery({
      projectId: this.configService.get<string>('GOOGLE_CLOUD_PROJECT'),
      keyFilename: this.configService.get<string>('GOOGLE_APPLICATION_CREDENTIALS'),
    });
    this.datasetId = this.configService.get<string>('BIGQUERY_DATASET_ID') || 'points_system';
    this.tableId = this.configService.get<string>('BIGQUERY_TABLE_ID') || 'points_transactions';
  }

  async insertPointsTransaction(data: {
    userId: string;
    points: number;
    transactionId: string;
    type: 'earn' | 'redeem';
    timestamp: Date;
  }): Promise<void> {
    const rows = [
      {
        user_id: data.userId,
        points: data.points,
        transaction_id: data.transactionId,
        type: data.type,
        timestamp: data.timestamp.toISOString(),
        processed_at: new Date().toISOString(),
      },
    ];

    try {
      await this.bigquery.dataset(this.datasetId).table(this.tableId).insert(rows);
    } catch (error) {
      console.error('Error al insertar en BigQuery:', error);
      throw error;
    }
  }

  async getPointsSummary(userId: string): Promise<{
    totalEarned: number;
    totalRedeemed: number;
    currentBalance: number;
  }> {
    const query = `
      SELECT
        SUM(CASE WHEN type = 'earn' THEN points ELSE 0 END) as total_earned,
        SUM(CASE WHEN type = 'redeem' THEN points ELSE 0 END) as total_redeemed,
        SUM(points) as current_balance
      FROM \`${this.datasetId}.${this.tableId}\`
      WHERE user_id = @userId
    `;

    try {
      const [rows] = await this.bigquery.query({
        query,
        params: { userId },
      });

      return {
        totalEarned: rows[0]?.total_earned || 0,
        totalRedeemed: rows[0]?.total_redeemed || 0,
        currentBalance: rows[0]?.current_balance || 0,
      };
    } catch (error) {
      console.error('Error al consultar BigQuery:', error);
      throw error;
    }
  }
}

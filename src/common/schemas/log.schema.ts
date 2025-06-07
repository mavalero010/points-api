import { Schema } from 'mongoose';

export const BaseLogSchema = new Schema({
  timestamp: { type: Date, required: true },
  level: { type: String, enum: ['info', 'warning', 'error'], required: true },
  message: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed },
});

export const TransactionLogSchema = new Schema({
  ...BaseLogSchema.obj,
  userId: { type: String, required: true, index: true },
  transactionType: { type: String, enum: ['earn', 'redeem'], required: true },
  points: { type: Number, required: true },
  status: { type: String, enum: ['success', 'failed'], required: true },
  errorDetails: String,
});

export const SystemLogSchema = new Schema({
  ...BaseLogSchema.obj,
  component: { type: String, required: true },
  action: { type: String, required: true },
  success: { type: Boolean, required: true },
});

// Índices
TransactionLogSchema.index({ timestamp: -1 });
TransactionLogSchema.index({ userId: 1, timestamp: -1 });
SystemLogSchema.index({ timestamp: -1 });
SystemLogSchema.index({ component: 1, timestamp: -1 }); 
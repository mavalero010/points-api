-- Crear el dataset si no existe
CREATE SCHEMA IF NOT EXISTS `points_system`;

-- Crear la tabla de transacciones
CREATE OR REPLACE TABLE `points_system.points_transactions` (
  userId STRING NOT NULL,
  points INT64 NOT NULL,
  transactionId STRING NOT NULL,
  timestamp TIMESTAMP NOT NULL
)
PARTITION BY DATE(timestamp)
CLUSTER BY userId;

-- Crear vista para resumen diario
CREATE OR REPLACE VIEW `points_system.daily_points_summary` AS
SELECT
  userId,
  DATE(timestamp) as date,
  SUM(points) as total_points,
  COUNT(*) as transaction_count
FROM `points_system.points_transactions`
GROUP BY userId, DATE(timestamp); 
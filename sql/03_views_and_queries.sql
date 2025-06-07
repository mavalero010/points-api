-- Vista para el historial de transacciones con detalles
CREATE OR REPLACE VIEW transaction_history AS
SELECT 
    t.id,
    t.user_id,
    u.name as user_name,
    t.type,
    t.points,
    t.description,
    t.reference,
    CASE 
        WHEN t.type = 'redeem' AND t.reference IS NOT NULL THEN r.name 
        ELSE NULL 
    END as reward_name,
    t.created_at
FROM transactions t
JOIN users u ON t.user_id = u.id
LEFT JOIN rewards r ON t.type = 'redeem' AND t.reference::uuid = r.id;

-- Vista para resumen de puntos por usuario
CREATE OR REPLACE VIEW user_points_summary AS
SELECT 
    u.id,
    u.name,
    u.total_points,
    COUNT(t.id) as total_transactions,
    SUM(CASE WHEN t.type = 'earn' THEN 1 ELSE 0 END) as earn_transactions,
    SUM(CASE WHEN t.type = 'redeem' THEN 1 ELSE 0 END) as redeem_transactions,
    MAX(t.created_at) as last_transaction_date
FROM users u
LEFT JOIN transactions t ON u.id = t.user_id
GROUP BY u.id, u.name, u.total_points;

-- Vista para recompensas populares
CREATE OR REPLACE VIEW popular_rewards AS
SELECT 
    r.id,
    r.name,
    r.points_cost,
    COUNT(t.id) as times_redeemed,
    r.stock,
    r.is_active
FROM rewards r
LEFT JOIN transactions t ON t.type = 'redeem' AND t.reference::uuid = r.id
GROUP BY r.id, r.name, r.points_cost, r.stock, r.is_active
ORDER BY times_redeemed DESC;

-- Función para obtener el historial de un usuario
CREATE OR REPLACE FUNCTION get_user_history(user_uuid UUID)
RETURNS TABLE (
    transaction_id UUID,
    transaction_type transaction_type,
    points INTEGER,
    description TEXT,
    reference VARCHAR(255),
    reward_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id as transaction_id,
        t.type as transaction_type,
        t.points,
        t.description,
        t.reference,
        r.name as reward_name,
        t.created_at
    FROM transactions t
    LEFT JOIN rewards r ON t.type = 'redeem' AND t.reference::uuid = r.id
    WHERE t.user_id = user_uuid
    ORDER BY t.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener recompensas disponibles para un usuario
CREATE OR REPLACE FUNCTION get_available_rewards(user_points INTEGER)
RETURNS TABLE (
    reward_id UUID,
    name VARCHAR(255),
    description TEXT,
    points_cost INTEGER,
    is_available BOOLEAN,
    stock INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id as reward_id,
        r.name,
        r.description,
        r.points_cost,
        (r.points_cost <= user_points AND (r.stock IS NULL OR r.stock > 0)) as is_available,
        r.stock
    FROM rewards r
    WHERE r.is_active = true
    ORDER BY r.points_cost ASC;
END;
$$ LANGUAGE plpgsql; 
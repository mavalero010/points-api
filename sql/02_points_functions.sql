-- Función para actualizar los puntos del usuario
CREATE OR REPLACE FUNCTION update_user_points()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE users
        SET total_points = total_points + NEW.points
        WHERE id = NEW.user_id;
        
        -- Verificar que no queden puntos negativos
        IF EXISTS (
            SELECT 1 FROM users 
            WHERE id = NEW.user_id AND total_points < 0
        ) THEN
            RAISE EXCEPTION 'El balance de puntos no puede ser negativo'
                USING ERRCODE = '23514';  -- check_violation
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar puntos automáticamente
CREATE TRIGGER update_points_after_transaction
    AFTER INSERT ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_points();

-- Función para verificar stock de recompensa
CREATE OR REPLACE FUNCTION check_reward_stock()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo verificar para redenciones
    IF NEW.type = 'redeem' THEN
        -- Actualizar stock si existe
        UPDATE rewards r
        SET stock = stock - 1
        WHERE id = NEW.reference::uuid
        AND stock IS NOT NULL
        AND stock > 0;
        
        -- Verificar si hay stock disponible
        IF EXISTS (
            SELECT 1 FROM rewards
            WHERE id = NEW.reference::uuid
            AND stock IS NOT NULL
            AND stock < 0
        ) THEN
            RAISE EXCEPTION 'No hay stock disponible para esta recompensa'
                USING ERRCODE = '23514';  -- check_violation
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para verificar stock antes de redención
CREATE TRIGGER check_stock_before_redeem
    AFTER INSERT ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION check_reward_stock();

-- Función para verificar puntos suficientes
CREATE OR REPLACE FUNCTION check_sufficient_points()
RETURNS TRIGGER AS $$
DECLARE
    available_points INTEGER;
    required_points INTEGER;
BEGIN
    IF NEW.type = 'redeem' THEN
        -- Obtener puntos disponibles
        SELECT total_points INTO available_points
        FROM users
        WHERE id = NEW.user_id;

        -- Obtener puntos requeridos
        SELECT points_cost INTO required_points
        FROM rewards
        WHERE id = NEW.reference::uuid;

        -- Verificar si hay puntos suficientes
        IF available_points < required_points THEN
            RAISE EXCEPTION 'Puntos insuficientes. Disponible: %, Requerido: %', 
                available_points, required_points
                USING ERRCODE = '23514';  -- check_violation
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para verificar puntos antes de redención
CREATE TRIGGER check_points_before_redeem
    BEFORE INSERT ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION check_sufficient_points(); 
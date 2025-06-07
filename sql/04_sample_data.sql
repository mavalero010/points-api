-- Insertar usuarios de prueba
INSERT INTO users (name) VALUES
    ('Juan Pérez'),
    ('María García'),
    ('Carlos Rodríguez');

-- Insertar recompensas de prueba
INSERT INTO rewards (name, description, points_cost, stock) VALUES
    ('Descuento 10%', 'Descuento del 10% en tu próxima compra', 1000, NULL),
    ('Vale de $50', 'Vale de descuento por $50', 5000, 100),
    ('Producto Gratis', 'Cualquier producto hasta $100', 10000, 50),
    ('Membresía Premium', 'Membresía premium por 1 mes', 15000, NULL),
    ('Regalo Sorpresa', 'Regalo sorpresa exclusivo', 3000, 25);

-- Función auxiliar para generar transacciones de prueba
CREATE OR REPLACE FUNCTION generate_sample_transactions()
RETURNS void AS $$
DECLARE
    user_record RECORD;
    reward_record RECORD;
    amount INTEGER;
    points INTEGER;
BEGIN
    -- Para cada usuario
    FOR user_record IN SELECT id FROM users LOOP
        -- Generar algunas transacciones de ganancia de puntos
        FOR i IN 1..5 LOOP
            amount := floor(random() * 900 + 100);  -- Monto entre 100 y 1000
            points := floor(amount * 0.1);  -- 10% en puntos
            
            INSERT INTO transactions (user_id, type, points, reference)
            VALUES (user_record.id, 'earn', points, 'PURCHASE-' || i);
        END LOOP;

        -- Generar algunas redenciones si tienen suficientes puntos
        FOR reward_record IN SELECT id, points_cost FROM rewards WHERE points_cost <= (
            SELECT total_points FROM users WHERE id = user_record.id
        ) LOOP
            IF random() > 0.5 THEN  -- 50% de probabilidad de redimir
                INSERT INTO transactions (
                    user_id, 
                    type, 
                    points, 
                    reference,
                    description
                )
                VALUES (
                    user_record.id,
                    'redeem',
                    -reward_record.points_cost,
                    reward_record.id::text,
                    'Redención de recompensa'
                );
            END IF;
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Generar transacciones de prueba
SELECT generate_sample_transactions();

-- Eliminar la función auxiliar
DROP FUNCTION generate_sample_transactions(); 
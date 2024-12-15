-- DESIGNING SQL QUERIES

-- Total Revenue Per Room Type
SELECT r.room_type, SUM(r.price) AS total_revenue
FROM Room r
JOIN Booking b ON r.room_id = b.room_id
GROUP BY r.room_type
ORDER BY total_revenue DESC;

-- Average lead time for bookings by room type
SELECT r.room_type, AVG(b.lead_time) AS avg_lead_time
FROM Booking b
JOIN Room r ON b.room_id = r.room_id
GROUP BY r.room_type
ORDER BY avg_lead_time DESC;

-- Find the top 5 busiest rooms (most booked)
SELECT room_id, room_type, booking_count
FROM (SELECT r.room_id, r.room_type, COUNT(b.booking_id) AS booking_count, RANK() OVER (ORDER BY COUNT(b.booking_id) DESC) AS rank
      FROM Room r
      JOIN Booking b ON r.room_id = b.room_id
      GROUP BY r.room_id,r.room_type
      ) ranked_rooms
WHERE rank <= 5;

-- Determine occupancy rate for each room in 2018
WITH TotalDays AS (
    SELECT r.room_id, SUM(CASE WHEN EXTRACT(YEAR FROM b.booking_date) = 2018 THEN b.no_of_nights ELSE 0 END) AS booked_days
    FROM Room r
    LEFT JOIN Booking b ON r.room_id = b.room_id
    GROUP BY r.room_id
)
SELECT r.room_id, r.room_type, COALESCE(td.booked_days, 0) AS booked_days, (COALESCE(td.booked_days, 0) / 365.0) * 100 AS occupancy_rate 
FROM Room r
LEFT JOIN TotalDays td ON r.room_id = td.room_id
ORDER BY occupancy_rate DESC;


-- Average number of days per stay and average price per stay for each room type
SELECT r.room_type, AVG(b.no_of_nights) AS avg_stay_days, AVG(b.no_of_nights * r.price) AS avg_stay_price
FROM Room r
JOIN Booking b ON r.room_id = b.room_id
GROUP BY r.room_type
ORDER BY avg_stay_price DESC;

-- Total Booking per guest
SELECT g.guest_id, g.g_name, COUNT(b.booking_id) AS total_bookings, g.previous_bookings_not_canceled AS past_bookings
FROM Guest g
LEFT JOIN Booking b ON g.guest_id = b.guest_id
GROUP BY g.guest_id, g.g_name, g.previous_bookings_not_canceled
ORDER BY total_bookings DESC;

-- Find the top 5 guests (most amount spent)
SELECT g.guest_id, g.g_name, SUM(b.no_of_nights * r.price) AS total_spent
FROM Guest g
JOIN Booking b ON g.guest_id = b.guest_id
JOIN Room r ON b.room_id = r.room_id
GROUP BY g.guest_id, g.g_name
ORDER BY total_spent DESC
FETCH FIRST 5 ROWS ONLY;

-- Testing Stored Functions and Procedures (Display results on DMBS window, do not forget to activate the connexion of the current user) 
 
-- Test cancel_booking for a random booking
DECLARE
    v_booking_id INTEGER;
BEGIN
    SELECT booking_id 
    INTO v_booking_id
    FROM (
        SELECT booking_id 
        FROM Booking 
        WHERE booking_status = 'Not_Canceled'
        ORDER BY DBMS_RANDOM.VALUE
    )
    WHERE ROWNUM = 1;

    cancel_booking(v_booking_id);
END;
/

-- Test generate_monthly_report procedure 
BEGIN
    generate_monthly_report(1, '2018-06'); 
END;
/
 
-- Test calculate_total_cost function for a random booking
DECLARE
    v_booking_id INTEGER;
    v_total_cost NUMBER(10, 2);
BEGIN
    SELECT booking_id
    INTO v_booking_id
    FROM (
        SELECT booking_id
        FROM Booking
        ORDER BY DBMS_RANDOM.VALUE
    )
    WHERE ROWNUM = 1;
    v_total_cost := calculate_total_cost_by_booking(p_booking_id => v_booking_id);   
    DBMS_OUTPUT.PUT_LINE('Total cost for booking ID ' || v_booking_id || ': ' || v_total_cost);
END;
/

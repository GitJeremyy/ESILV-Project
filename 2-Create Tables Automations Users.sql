-- FROM HERE, CONNECT TO admin_user (service xepdb1)

-- TABLE CREATION 

-- Drop tables if already exist
DROP TABLE Booking CASCADE CONSTRAINTS;
DROP TABLE Guest CASCADE CONSTRAINTS;
DROP TABLE Room CASCADE CONSTRAINTS;
DROP TABLE Staff CASCADE CONSTRAINTS;
DROP TABLE Hotel CASCADE CONSTRAINTS;

-- Table creation
CREATE TABLE Hotel (
    hotel_id INTEGER GENERATED BY DEFAULT ON NULL AS IDENTITY,
    nameH VARCHAR2(100),
    location VARCHAR2(100),
    total_bookings INTEGER,
    CONSTRAINT pk_hotel PRIMARY KEY (hotel_id)
);

CREATE TABLE Guest (
    guest_id INTEGER GENERATED BY DEFAULT ON NULL AS IDENTITY,
    g_name VARCHAR(50),
    g_email VARCHAR(50),
    g_phone VARCHAR(20),
    repeated_guest CHAR(1) CHECK (repeated_guest IN ('Y', 'N')),
    previous_cancellations INTEGER,
    previous_bookings_not_canceled INTEGER,
    CONSTRAINT pk_guest PRIMARY KEY (guest_id)
);

CREATE TABLE Room (
    room_id INTEGER GENERATED BY DEFAULT ON NULL AS IDENTITY,
    hotel_id INTEGER,
    room_type VARCHAR2(50),
    price NUMBER(10, 2),
    CONSTRAINT pk_room PRIMARY KEY (room_id),
    CONSTRAINT fk_hotel FOREIGN KEY (hotel_id) REFERENCES Hotel(hotel_id)
);

CREATE TABLE Staff (
    staff_id INTEGER GENERATED BY DEFAULT ON NULL AS IDENTITY,
    hotel_id INTEGER,
    name VARCHAR2(100),
    position VARCHAR2(50),
    contact_info VARCHAR2(100),
    CONSTRAINT pk_staff PRIMARY KEY (staff_id),
    CONSTRAINT fk_hotel_staff FOREIGN KEY (hotel_id) REFERENCES Hotel(hotel_id)
);

CREATE TABLE Booking (
    booking_id INTEGER GENERATED BY DEFAULT ON NULL AS IDENTITY,
    guest_id INTEGER,
    hotel_id INTEGER,
    room_id INTEGER,
    no_of_adults INTEGER,
    no_of_children INTEGER,
    meal_plan VARCHAR2(50),
    car_parking_space CHAR(1) CHECK (car_parking_space IN ('Y', 'N')),
    lead_time INTEGER,
    booking_status VARCHAR2(20),
    booking_date DATE,
    no_of_nights INTEGER,
    CONSTRAINT pk_booking PRIMARY KEY (booking_id),
    CONSTRAINT fk_guest FOREIGN KEY (guest_id) REFERENCES Guest(guest_id),
    CONSTRAINT fk_hotel_booking FOREIGN KEY (hotel_id) REFERENCES Hotel(hotel_id),
    CONSTRAINT fk_room FOREIGN KEY (room_id) REFERENCES Room(room_id)
);

-- AUTOMATION OF THE INFORMATION SYSTEM

SET SERVEROUTPUT ON SIZE UNLIMITED;

-- Display on DMBS window results

-- Trigger to update Hotel.total_bookings when a reservation is made 
CREATE OR REPLACE TRIGGER update_booking_stats
AFTER INSERT ON Booking
BEGIN
    UPDATE Hotel
    SET total_bookings = total_bookings + 1
    WHERE hotel_id = 1;
END;
/

-- Trigger to update Hotel.total_bookings when a reservation is deleted
CREATE OR REPLACE TRIGGER delete_booking_stats
AFTER DELETE ON Booking
FOR EACH ROW
BEGIN
    UPDATE Hotel
    SET total_bookings = total_bookings - 1
    WHERE hotel_id = 1;
END;
/

-- Procedure to update Hotel.total_bookings when a reservation is canceled 
CREATE OR REPLACE PROCEDURE cancel_booking (
    p_booking_id IN INTEGER
) IS
BEGIN
    -- Set the booking_status as 'Canceled' 
    UPDATE Booking
    SET booking_status = 'Canceled'
    WHERE booking_id = p_booking_id;  
    
    DBMS_OUTPUT.PUT_LINE('Reservation ' || p_booking_id || ' successfully canceled.');
END cancel_booking;
/

-- Procedure to generate a monthly report 
CREATE OR REPLACE PROCEDURE generate_monthly_report (
    p_hotel_id IN INTEGER,
    p_report_month IN VARCHAR2
) IS
    v_nameH VARCHAR2(100);
BEGIN
    SELECT nameH INTO v_nameH
    FROM Hotel
    WHERE hotel_id = p_hotel_id;
    DBMS_OUTPUT.PUT_LINE('Reservation report for ' || v_nameH || ' for ' || p_report_month);
    FOR rec IN (
        SELECT booking_date, no_of_nights, no_of_adults, no_of_children, meal_plan
        FROM Booking
        WHERE hotel_id = p_hotel_id
        AND TO_CHAR(booking_date, 'YYYY-MM') = p_report_month
        ORDER BY booking_date ASC
    ) LOOP
        DBMS_OUTPUT.PUT_LINE('Reservation on ' || TO_CHAR(rec.booking_date, 'DD-MM-YYYY') || ', Nights : ' || rec.no_of_nights || ', Adults: ' || rec.no_of_adults || ', Children : ' || rec.no_of_children || ', Meal Plan : ' || rec.meal_plan);
    END LOOP;
END generate_monthly_report;
/

-- Function to calculate the total amount for a stay period (nights+meals)
CREATE OR REPLACE FUNCTION calculate_total_cost_by_booking (
    p_booking_id IN INTEGER
) RETURN NUMBER IS
    v_room_price NUMBER(10, 2);
    v_meal_price NUMBER(10, 2) := 0;
    v_total_cost NUMBER(10, 2);
    v_room_id INTEGER;
    v_no_of_nights INTEGER;
    v_meal_plan VARCHAR2(50);
    v_hotel_id INTEGER;
BEGIN
    -- R�cup�re les informations de r�servation n�cessaires � partir de la table Booking
    SELECT room_id, no_of_nights, meal_plan, hotel_id
    INTO v_room_id, v_no_of_nights, v_meal_plan, v_hotel_id
    FROM Booking
    WHERE booking_id = p_booking_id;
    
    -- R�cup�re le prix de la chambre � partir de la table Room
    SELECT price INTO v_room_price
    FROM Room
    WHERE room_id = v_room_id AND hotel_id = v_hotel_id;
    
    -- D�termine le prix des repas en fonction du plan s�lectionn�
    IF v_meal_plan = 'Meal Plan 1' THEN
        v_meal_price := 50;
    ELSIF v_meal_plan = 'Meal Plan 2' THEN
        v_meal_price := 30;
    ELSIF v_meal_plan = 'Not Selected' THEN
        v_meal_price := 0;
    END IF;

    -- Calcule le co�t total
    v_total_cost := (v_room_price * v_no_of_nights) + (v_meal_price * v_no_of_nights);
    
    -- Retourne le co�t total
    RETURN v_total_cost;
END calculate_total_cost_by_booking;
/

-- SECURITY AND USER MANAGEMENT

-- Manager

DROP ROLE manager_role;
DROP USER manager_user;

CREATE ROLE manager_role;
CREATE USER manager_user IDENTIFIED BY manager_password;

GRANT CREATE SESSION, CONNECT TO manager_role;
GRANT SELECT ON admin_user.Hotel TO manager_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON admin_user.Guest TO manager_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON admin_user.Booking TO manager_role;
GRANT SELECT ON admin_user.Room TO manager_role;
GRANT SELECT, INSERT, UPDATE ON admin_user.Staff TO manager_role;

GRANT EXECUTE ON admin_user.generate_monthly_report TO manager_role;
GRANT EXECUTE ON admin_user.calculate_total_cost_by_booking TO manager_role;
GRANT EXECUTE ON admin_user.cancel_booking TO manager_role;

GRANT manager_role TO manager_user;

--Employee

DROP ROLE employee_role;
DROP USER employee_user;

CREATE ROLE employee_role;
CREATE USER employee_user IDENTIFIED BY employee_password;

GRANT CREATE SESSION, CONNECT TO employee_role;
GRANT SELECT ON admin_user.Hotel TO employee_role;
GRANT SELECT, UPDATE ON admin_user.Guest TO employee_role;
GRANT SELECT, INSERT, UPDATE ON admin_user.Booking TO employee_role;
GRANT SELECT ON admin_user.Room TO employee_role;

GRANT EXECUTE ON admin_user.calculate_total_cost_by_booking TO employee_role;
GRANT EXECUTE ON admin_user.cancel_booking TO employee_role;

GRANT employee_role TO employee_user;

-- Guest

DROP ROLE guest_role;
DROP USER guest_user;

CREATE ROLE guest_role;
CREATE USER guest_user IDENTIFIED BY guest_password;

GRANT CREATE SESSION, CONNECT TO guest_role;
GRANT INSERT,UPDATE ON admin_user.Booking TO guest_role;
GRANT SELECT ON admin_user.Room TO guest_role;

GRANT EXECUTE ON admin_user.cancel_booking TO guest_role;

GRANT guest_role TO guest_user;

-- Create Public Synonyms to simplify access to tables for all users

-- Drop synonyms if already exist
DROP PUBLIC SYNONYM Hotel;
DROP PUBLIC SYNONYM Guest;
DROP PUBLIC SYNONYM Booking;
DROP PUBLIC SYNONYM Room;
DROP PUBLIC SYNONYM Staff;
DROP PUBLIC SYNONYM generate_monthly_report;
DROP PUBLIC SYNONYM cancel_booking;
DROP PUBLIC SYNONYM calculate_total_cost_by_booking;

CREATE PUBLIC SYNONYM Hotel FOR admin_user.Hotel;
CREATE PUBLIC SYNONYM Guest FOR admin_user.Guest;
CREATE PUBLIC SYNONYM Booking FOR admin_user.Booking;
CREATE PUBLIC SYNONYM Room FOR admin_user.Room;
CREATE PUBLIC SYNONYM Staff FOR admin_user.Staff;
CREATE PUBLIC SYNONYM generate_monthly_report FOR admin_user.generate_monthly_report;
CREATE PUBLIC SYNONYM cancel_booking FOR admin_user.cancel_booking;
CREATE PUBLIC SYNONYM calculate_total_cost_by_booking FOR admin_user.calculate_total_cost_by_booking;

-- Securing the system

-- Drop profile if already exists
DROP PROFILE secure_profile CASCADE;

CREATE PROFILE secure_profile LIMIT 
  PASSWORD_LIFE_TIME 30 -- 30 days until changing pw
  PASSWORD_REUSE_MAX 5 -- 5 times autorizhed reused pw
  FAILED_LOGIN_ATTEMPTS 10 -- 10 tries before locked account
  PASSWORD_LOCK_TIME 1; -- after failed login, locked account for 1 day

ALTER USER admin_user PROFILE secure_profile;
ALTER USER manager_user PROFILE secure_profile;
ALTER USER employee_user PROFILE secure_profile;
ALTER USER guest_user PROFILE secure_profile;
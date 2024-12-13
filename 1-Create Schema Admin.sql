ALTER SESSION SET CONTAINER = xepdb1;

-- Create Admin Schema

DROP ROLE admin_role;
CREATE ROLE admin_role;

DROP USER admin_user CASCADE;
CREATE USER admin_user IDENTIFIED BY admin_password; -- schema

-- ADMIN 
GRANT ALL PRIVILEGES TO admin_role;
GRANT admin_role TO admin_user;
ALTER USER admin_user QUOTA UNLIMITED ON USERS; -- illimited storage

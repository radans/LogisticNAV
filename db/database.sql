CREATE DATABASE `veotellimused`;

CREATE USER 'veotellimused'@'localhost' IDENTIFIED BY 'veotellimused';
CREATE USER 'veotellimused'@'%' IDENTIFIED BY 'veotellimused';

GRANT SELECT, INSERT, UPDATE, DELETE, ALTER, CREATE, DROP, INDEX, REFERENCES, CREATE VIEW ON veotellimused.* TO 'veotellimused'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE, ALTER, CREATE, DROP, INDEX, REFERENCES, CREATE VIEW ON veotellimused.* TO 'veotellimused'@'%';

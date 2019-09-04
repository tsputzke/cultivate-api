BEGIN;

TRUNCATE
  room_data,
  rooms,
  cultivate_users
  RESTART IDENTITY CASCADE;

INSERT INTO cultivate_users (user_name, password)
VALUES
  ('aliasA', 'Mifflin'),
  ('aliasB', 'Bo'),
  ('AliasC', 'Charlie'),
  ('AliasD', 'Sam'),
  ('AliasE', 'Lex'),
  ('AliasF', 'Ping');

INSERT INTO rooms (user_id, room_name, room_description)
VALUES
  (1, 'Room1', 'its a room'),
  (1, 'Room2', 'its a room'),
  (2, 'Room3', null),
  (2, 'Room4', null),
  (3, 'Room5', 'something else');

INSERT INTO room_data (
  room_id, 
  date_added,
  temperature,
  rh, 
  co2, 
  light, 
  comments
) VALUES
  ( 1, '2019-09-01', 25, 75, 400, 100, 'mushrooms are growing!'),
  ( 1, '2019-08-15', 26, 65, 410, 100, 'orchids are growing!'),
  ( 1, '2019-08-01', 27, 45, 420, 100, 'petunias are growing!'),
  ( 1, '2019-07-15', 28, 55, 430, 100, 'plants are growing!'),
  ( 1, '2019-07-01', 29, 75, 440, 100, 'oysters are growing!'),
  ( 2, '2019-05-15', 30, 78, 450, 100, 'shiitake are growing!'),
  ( 2, '2019-05-01', 31, 79, 460, 100, 'hericium are growing!'),
  ( 3, '2019-01-15', 32, 80, 470, 100, 'nothing is growing!');

COMMIT;
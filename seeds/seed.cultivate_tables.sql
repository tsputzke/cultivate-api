BEGIN;

TRUNCATE
  room_data,
  rooms,
  cultivate_users
  RESTART IDENTITY CASCADE;

INSERT INTO cultivate_users (user_name, password)
VALUES
  ('TestUser', '$2a$10$mhfezzRvTWDvTgqQC49uZObZ1hyvnqF0hRFwRp2KR53q.kY0Z58v6'),
  ('aliasA', '$2a$10$lvuudsZUcEJpkqCBCOrN/.INMZ6CEjxpjiysg1qtGKOe8KIrJ/eby'), 
  ('aliasB', '$2a$10$msdqYxaExt8DZzXoGT1RFedTgAt0QK8ZH1xzOJcuQMc2TMIOuId1.');

INSERT INTO rooms (user_id, room_name, room_description)
VALUES
  (1, 'Example Room', 'Greenhouse 2'),
  (2, 'Room2', 'its a room'),
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
  ( 1, '2019-10-01', 25, 75, 400, 100, 'nectrotic spots on mint'),
  ( 1, '2019-09-20', 26, 65, 410, 120, 'stanhopea started flowering'),
  ( 1, '2019-09-15', 27, 45, 420, 90, null),
  ( 1, '2019-09-13', 28, 55, 430, 78, 'plants look healthy!'),
  ( 1, '2019-08-22', 29, 75, 440, 92, 'fertilized tomatoes with 21-5-20 at 200ppm N'),
  ( 1, '2019-08-15', 29, 78, 440, 110, null),
  ( 1, '2019-08-07', 27, 77, 540, 100, null),
  ( 1, '2019-08-01', 24, 79, 510, 96, 'pruned the bonsai'),
  ( 1, '2019-07-25', 28, 85, 480, 85, 'took philodendron cuttings for Omar'),
  ( 1, '2019-07-21', 29, 81, 500, 98, 'transplanted African Violets'),
  ( 1, '2019-07-18', 27, 84, 550, 100, null),
  ( 1, '2019-07-15', 29, 88, 592, 103, null),

  ( 2, '2019-05-15', 30, 78, 450, 100, 'shiitake are growing!'),
  ( 2, '2019-05-01', 31, 79, 460, 100, 'hericium are growing!'),
  ( 3, '2019-01-15', 32, 80, 470, 100, 'nothing is growing!');

COMMIT;
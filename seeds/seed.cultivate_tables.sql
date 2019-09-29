BEGIN;

TRUNCATE
  room_data,
  rooms,
  cultivate_users
  RESTART IDENTITY CASCADE;

INSERT INTO cultivate_users (user_name, password)
VALUES
  ('TestUser', '$2a$10$mhfezzRvTWDvTgqQC49uZObZ1hyvnqF0hRFwRp2KR53q.kY0Z58v6');

INSERT INTO rooms (user_id, room_name, room_description)
VALUES
  (1, 'Sun Room', null),
  (1, 'Basement', 'microgreen trays'),
  (1, 'Closet', 'oyster mushrooms'),
  (1, 'Office', 'desk plants at office'),
  (1, 'Front Garden', null);

INSERT INTO room_data (
  room_id, 
  date_added,
  temperature,
  rh, 
  co2, 
  light, 
  comments
) VALUES
  ( 1, '2019-10-01', 27, 75, 500, 100, 'nectrotic spots on bonsai leaves'),
  ( 1, '2019-09-20', 26, 65, 500, 120, 'stanhopea started flowering'),
  ( 1, '2019-09-15', 27, 45, 500, 90, null),
  ( 1, '2019-09-13', 28, 55, 500, 130, 'plants look healthy!'),
  ( 1, '2019-08-22', 29, 75, 500, 92, null),
  ( 1, '2019-08-15', 29, 78, 500, 110, null),
  ( 1, '2019-08-07', 27, 77, 500, 100, null),
  ( 1, '2019-08-01', 24, 79, 500, 96, 'pruned the bonsai'),
  ( 1, '2019-07-25', 28, 85, 500, 85, 'took philodendron cuttings for Omar'),
  ( 1, '2019-07-21', 29, 81, 500, 98, 'transplanted African Violets'),
  ( 1, '2019-07-18', 27, 84, 500, 100, null),
  ( 1, '2019-07-15', 29, 88, 500, 103, null),

  ( 2, '2019-10-01', 25, 75, 400, 120, null),
  ( 2, '2019-09-20', 26, 66, 410, 120, 'harvested greens'),
  ( 2, '2019-09-15', 25, 65, 420, 120, null),
  ( 2, '2019-09-13', 22, 65, 430, 120, 'fertilized with 21-5-20 at 200ppm N'),
  ( 2, '2019-08-22', 24, 73, 440, 120, null),
  ( 2, '2019-08-15', 24, 78, 440, 120, 'fertilized with 21-5-20 at 200ppm N'),
  ( 2, '2019-08-07', 23, 77, 540, 120, null),
  ( 2, '2019-08-01', 24, 79, 510, 120, 'seeded trays'),
  ( 2, '2019-07-25', 27, 80, 480, 120, 'harvested greens'),
  ( 2, '2019-07-21', 25, 81, 500, 120, null),
  ( 2, '2019-07-18', 27, 79, 550, 120, null),
  ( 2, '2019-07-15', 26, 78, 592, 120, 'fertilized with 21-5-20 at 200ppm N'),

  ( 3, '2019-10-01', 27, 73, 400, 100, null),
  ( 3, '2019-09-20', 26, 65, 410, 120, null),
  ( 3, '2019-09-15', 27, 75, 400, 90, 'cleaned/ sterilized grow room'),
  ( 3, '2019-09-13', 28, 85, 430, 78, 'contamination - removed blocks'),
  ( 3, '2019-08-22', 27, 75, 440, 92, null),
  ( 3, '2019-08-15', 28, 78, 440, 110, 'harvest 5lbs'),
  ( 3, '2019-08-07', 27, 77, 340, 100, 'harvest 3lbs'),
  ( 3, '2019-08-01', 25, 79, 310, 96, null),
  ( 3, '2019-07-25', 28, 85, 480, 85, null),
  ( 3, '2019-07-21', 27, 81, 500, 98, 'pinning started'),
  ( 3, '2019-07-18', 27, 84, 550, 100, null),
  ( 3, '2019-07-15', 29, 88, 580, 103, null),

  ( 4, '2019-10-01', 25, 55, 500, 40, 'Phalaenopsis died :('),
  ( 4, '2019-09-20', 26, 58, 500, 45, null),
  ( 4, '2019-09-15', 27, 45, 500, 60, null),
  ( 4, '2019-09-13', 28, 55, 500, 60, 'spider plant got a Phalaenopsis buddy today!'),
  ( 4, '2019-08-22', 29, 56, 500, 55, 'pruned spider plant'),
  ( 4, '2019-08-15', 29, 60, 500, 62, null),
  ( 4, '2019-08-07', 27, 58, 500, 58, null),
  ( 4, '2019-08-01', 24, 59, 500, 40, null),
  ( 4, '2019-07-25', 28, 55, 500, 43, null),
  ( 4, '2019-07-21', 29, 54, 500, 58, 'fertilized spider plant'),
  ( 4, '2019-07-18', 27, 58, 500, 55, null),
  ( 4, '2019-07-15', 29, 58, 500, 59, null),

  ( 5, '2019-10-01', 23, 75, 500, 150, null),
  ( 5, '2019-09-20', 22, 65, 500, 120, null),
  ( 5, '2019-09-15', 24, 45, 500, 90, null),
  ( 5, '2019-09-13', 26, 55, 500, 78, 'plants look healthy!'),
  ( 5, '2019-08-22', 25, 75, 500, 92, 'lots of butterflies on the wild asters by the shed'),
  ( 5, '2019-08-15', 26, 78, 500, 110, null),
  ( 5, '2019-08-07', 29, 77, 500, 100, null),
  ( 5, '2019-08-01', 28, 79, 500, 96, null),
  ( 5, '2019-07-25', 31, 85, 500, 85, 'harvested strawberries!'),
  ( 5, '2019-07-21', 32, 81, 500, 98, 'added mulch around Japanese maple'),
  ( 5, '2019-07-18', 30, 84, 500, 100, null),
  ( 5, '2019-07-15', 32, 88, 500, 103, 'Seeded kale for fall');

COMMIT;
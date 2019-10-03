# User
Posts new user to 'cultivate_users' database. 
Logs in existing user and returns JWT token and user_id.

## URL

Route to post new user/ login:
https://pure-castle-83890.herokuapp.com/api/users [+ /login]

## Method:

POST

## URL Params

## Required:

None

## Data Params

None

## Success Response:

Code: 201 Created

## Error Response:

Code: 400 Bad Request

## Sample Call:

  ```
  fetch('https://pure-castle-83890.herokuapp.com/api/users' [+ '/login'], {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ user_name, password }),
  });
  ```

# Room
Return all rooms belonging to a user.
Adds room to database.
Deletes room from database.

## URL

Route to get rooms, by user_id (GET):
https://pure-castle-83890.herokuapp.com/api/rooms/:user_id

Route to add room (POST):
https://pure-castle-83890.herokuapp.com/api/rooms

Route to delete room, by room_id (DELETE):
https://pure-castle-83890.herokuapp.com/api/rooms/delete/:room_id

## Method:

GET / POST / DELETE

## URL Params

## Required:

None

## Data Params

None

## Success Response:

New Room:
Code: 201 Created

Delete room:
Code: 204 No Content

## Error Response:

Code: 400 Bad Request

## Sample Call:

  ```
  fetch('https://pure-castle-83890.herokuapp.com/api/rooms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `bearer ${TokenService.getAuthToken()}`,
    },
    body: JSON.stringify(newRoomObject),
  })
  ```

# Room-Data
Return room data by room_id.
Add room data from database.
Deletes room data from database.

## URL

Route to get room data, by room_id (GET):
https://pure-castle-83890.herokuapp.com/api/room-data/:room_id

Route to add room-data (POST):
https://pure-castle-83890.herokuapp.com/api/room-data

Route to delete room data, by room_data_id (DELETE):
https://pure-castle-83890.herokuapp.com/api/rooms/delete/:room_data_id

## Method:

GET / POST / DELETE

## URL Params

## Required:

None

## Data Params

None

## Success Response:

New Room Data:
Code: 201 Created

Delete Room Data:
Code: 204 No Content

## Error Response:

Code: 400 Bad Request

## Sample Call:

  ```
  fetch('https://pure-castle-83890.herokuapp.com/api/room-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `bearer ${TokenService.getAuthToken()}`,
    },
    body: JSON.stringify(newDataObject),
  })
  ```
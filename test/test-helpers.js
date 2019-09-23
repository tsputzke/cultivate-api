
function makeUsersArray() {
  return [
    {
      user_id: 1,
      user_name: 'test-user-1',
      password: '$2a$10$D.v8SbIp0Iqhg/ASogdu2.6YTJo4mUjuaMcncA8WMp8PkUYwM.l96',
    },
    {
      user_id: 2,
      user_name: 'test-user-2',
      password: 'password',
    },
    {
      user_id: 3,
      user_name: 'test-user-3',
      password: 'password',
    },
    {
      user_id: 4,
      user_name: 'test-user-4',
      password: '$2a$10$D.v8SbIp0Iqhg/ASogdu2.6YTJo4mUjuaMcncA8WMp8PkUYwM.l96',
    },
  ]
}


function makeRoomArray(users) {
  return [
    {
      room_id: 1,
      user_id: users[0].user_id,
      room_name: 'test-room-1',
      room_description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
    },
    {
      room_id: 2,
      user_id: users[1].user_id,
      room_name: 'test-room-2',
      room_description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
    },
    {
      room_id: 3,
      user_id: users[2].user_id,
      room_name: 'test-room-3',
      room_description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
    },
    {
      room_id: 4,
      user_id: users[2].user_id,
      room_name: 'test-room-4',
      room_description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
    },
  ]
}

function makeRoomDataArray(rooms) {
  return [
    {
      room_data_id: 1,
      room_id: rooms[0].room_id,
      date_added: '2019-09-01',
      temperature: 25,
      rh: 75,
      co2: 400,
      light: 100,
      comments: 'First test comment!',
    },
    {
      room_data_id: 2,
      room_id: rooms[1].room_id,
      date_added: '2019-09-02',
      temperature: 25,
      rh: 75,
      co2: 400,
      light: 100,
      comments: 'Second test comment!',
    },
    {
      room_data_id: 3,
      room_id: rooms[2].room_id,
      date_added: '2019-09-03',
      temperature: 25,
      rh: 75,
      co2: 400,
      light: 100,
      comments: 'Third test comment!',
    },
    {
      room_data_id: 4,
      room_id: rooms[2].room_id,
      date_added: '2019-09-04',
      temperature: 25,
      rh: 75,
      co2: 400,
      light: 100,
      comments: 'Fourth test comment!',
    },
  ];
}

// function makeExpectedRoom(users, article, comments=[]) {
//   const author = users
//     .find(user => user.id === article.author_id)

//   const number_of_comments = comments
//     .filter(comment => comment.article_id === article.id)
//     .length

//   return {
//     id: article.id,
//     style: article.style,
//     title: article.title,
//     content: article.content,
//     date_created: article.date_created.toISOString(),
//     number_of_comments,
//     author: {
//       id: author.id,
//       user_name: author.user_name,
//       full_name: author.full_name,
//       nickname: author.nickname,
//       date_created: author.date_created.toISOString(),
//       date_modified: author.date_modified || null,
//     },
//   }
// }

// function makeExpectedArticleComments(users, articleId, comments) {
//   const expectedComments = comments
//     .filter(comment => comment.article_id === articleId)

//   return expectedComments.map(comment => {
//     const commentUser = users.find(user => user.id === comment.user_id)
//     return {
//       id: comment.id,
//       text: comment.text,
//       date_created: comment.date_created.toISOString(),
//       user: {
//         id: commentUser.id,
//         user_name: commentUser.user_name,
//         full_name: commentUser.full_name,
//         nickname: commentUser.nickname,
//         date_created: commentUser.date_created.toISOString(),
//         date_modified: commentUser.date_modified || null,
//       }
//     }
//   })
// }

// function makeMaliciousArticle(user) {
//   const maliciousArticle = {
//     id: 911,
//     style: 'How-to',
//     date_created: new Date(),
//     title: 'Naughty naughty very naughty <script>alert("xss");</script>',
//     author_id: user.id,
//     content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
//   }
//   const expectedArticle = {
//     ...makeExpectedArticle([user], maliciousArticle),
//     title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
//     content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
//   }
//   return {
//     maliciousArticle,
//     expectedArticle,
//   }
// }

function makeRoomsFixtures() {
  const testUsers = makeUsersArray()
  const testRooms = makeRoomArray(testUsers)
  const testData = makeRoomDataArray(testRooms)
  return { testUsers, testRooms, testData }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        room_data,
        rooms,
        cultivate_users
      `
    )
    // .then(() =>
    //   Promise.all([
    //     trx.raw(`ALTER SEQUENCE room_data_seq minvalue 0 START WITH 1`),
    //     trx.raw(`ALTER SEQUENCE rooms_seq minvalue 0 START WITH 1`),
    //     trx.raw(`ALTER SEQUENCE cultivate_users_seq minvalue 0 START WITH 1`),
    //     trx.raw(`SELECT setval('room_data_seq', 0)`),
    //     trx.raw(`SELECT setval('rooms_seq', 0)`),
    //     trx.raw(`SELECT setval('cultivate_users_seq', 0)`),
    //   ])
    // )
  )
}

// function seedArticlesTables(db, users, articles, comments=[]) {
//   // use a transaction to group the queries and auto rollback on any failure
//   return db.transaction(async trx => {
//     await trx.into('blogful_users').insert(users)
//     await trx.into('blogful_articles').insert(articles)
//     // update the auto sequence to match the forced id values
//     await Promise.all([
//       trx.raw(
//         `SELECT setval('blogful_users_id_seq', ?)`,
//         [users[users.length - 1].id],
//       ),
//       trx.raw(
//         `SELECT setval('blogful_articles_id_seq', ?)`,
//         [articles[articles.length - 1].id],
//       ),
//     ])
//     // only insert comments if there are some, also update the sequence counter
//     if (comments.length) {
//       await trx.into('blogful_comments').insert(comments)
//       await trx.raw(
//         `SELECT setval('blogful_comments_id_seq', ?)`,
//         [comments[comments.length - 1].id],
//       )
//     }
//   })
// }

// function seedMaliciousArticle(db, user, article) {
//   return db
//     .into('blogful_users')
//     .insert([user])
//     .then(() =>
//       db
//         .into('blogful_articles')
//         .insert([article])
//     )
// }

function seedUsers(db, testUsers) {
    return db
      .insert(testUsers)
      .into('cultivate_users')
      .returning('*')
      .then(([user]) => user)
  }

module.exports = {
  // makeAuthHeader,
  makeUsersArray,
  makeRoomArray,
  // makeExpectedArticle,
  // makeExpectedArticleComments,
  // makeMaliciousArticle,
  makeRoomDataArray,

  makeRoomsFixtures,
  cleanTables,
  seedUsers,
  // seedArticlesTables,
  // seedMaliciousArticle,
}

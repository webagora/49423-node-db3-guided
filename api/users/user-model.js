const db = require('../../data/db-config.js')

module.exports = {
  findPosts,
  find,
  findById,
  add,
  remove
}

async function findPosts(user_id) {
  /*
    Implement so it resolves this structure:

    [
      {
          "post_id": 10,
          "contents": "Trusting everyone is...",
          "username": "seneca"
      },
      etc
    ]

    select
        contents, username, p.id as post_id
    from posts as p
    join users as u
        on u.id = p.user_id
    where u.id = 2;

  */
  const rows = await db('posts as p')
    .join('users as u', 'u.id', 'p.user_id')
    .select('contents', 'username', 'p.id as post_id')
    .where('u.id', user_id)
  console.log(rows)
  // transformation of the
  return rows
}

async function find() {
  /*
    Improve so it resolves this structure:

    [
        {
            "user_id": 1,
            "username": "lao_tzu",
            "post_count": 6
        },
        {
            "user_id": 2,
            "username": "socrates",
            "post_count": 3
        },
        etc
    ]

  select
      u.id as user_id, username, count(p.id) as post_count
  from users as u
  left join posts as p
      on u.id = p.user_id
  group by u.id
  order by post_count desc;

  */
  const rows = await db('users as u')
    .leftJoin('posts as p', 'u.id', 'p.user_id')
    .groupBy('u.id')
    .select('u.id as user_id', 'username')
    .count('p.id as post_count')
  return rows
}

async function findById(id) {
  /*
    Improve so it resolves this structure:

    {
      "user_id": 2,
      "username": "socrates"
      "posts": [
        {
          "post_id": 7,
          "contents": "Beware of the barrenness of a busy life."
        },
        etc
      ]
    }

    select
      username,
      u.id as user_id,
      p.id as post_id,
      contents
    from users as u
    left join posts as p
        on u.id = p.user_id
    where u.id = 4;
  */
  const rows = await db('users as u')
    .leftJoin('posts as p', 'u.id', 'p.user_id')
    .select('username', 'u.id as user_id', 'p.id as post_id', 'contents')
    .where('u.id', id)
console.log(rows)
  const result = {
    username: rows[0].username,
    user_id: rows[0].user_id,
    posts: rows.reduce((posts, post) => {
      if (!post.post_id) return posts
      return posts.concat({ })
    }, []),
  }
  return result
}

function add(user) {
  return db('users')
    .insert(user)
    .then(([id]) => { // eslint-disable-line
      return findById(id)
    })
}

function remove(id) {
  // returns removed count
  return db('users').where({ id }).del()
}

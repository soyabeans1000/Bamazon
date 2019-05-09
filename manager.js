const { prompt } = require('inquirer')
const { createConnection } = require('mysql2')

const db = createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Reboot@2019',
    database: 'bamazon_db'
})

async function getProducts(columns) {
    //Get all Products from the Database
    let response = await new Promise((resolve, reject) => {
        db.query(`SELECT ${columns} FROM products`, (e, r) => {
            if (e) {
                reject(e)
            } else {
                resolve(r)
            }
        })
    })
    return response
}

// const getSong = _ => {
//   getSongs('title')
//     .then(r => {
//       prompt({
//         type: 'list',
//         name: 'title',
//         message: 'Select the song you would like to view:',
//         choices: r.map(({ title }) => title)
//       })
//         .then(title => {
//           db.query('SELECT * FROM songs WHERE ?', title, (e, [{ title, artist, genre }]) => {
//             if (e) throw e
//             console.log(`
//             ----------
//             ${title} by ${artist}
//             Genre: ${genre}
//             ----------
//             `)
//             getAction()
//           })
//         })
//         .catch(e => console.log(e))
//     })
//     .catch(e => console.log(e))
// }

// const addSong = _ => {
//   prompt([
//     {
//       type: 'input',
//       name: 'title',
//       message: 'What is the title of the song?'
//     },
//     {
//       type: 'input',
//       name: 'artist',
//       message: 'Who is this song by?'
//     },
//     {
//       type: 'input',
//       name: 'genre',
//       message: 'What genre is this song from?'
//     }
//   ])
//     .then(song => {
//       db.query('INSERT INTO songs SET ?', song, e => {
//         if (e) throw e
//         console.log('*** Successfully added your song! ***')
//         getAction()
//       })
//     })
// }

// const updateSong = _ => {
//   getSongs('title')
//     .then(r => {
//       prompt([
//         {
//           type: 'list',
//           name: 'title',
//           message: 'Select the song you wish to change:',
//           choices: r.map(({ title }) => title)
//         },
//         {
//           type: 'list',
//           name: 'column',
//           message: 'Select the property you wish to change:',
//           choices: ['title', 'artist', 'genre']
//         },
//         {
//           type: 'input',
//           name: 'value',
//           message: 'What is the new value?'
//         }
//       ])
//         .then(({ title, column, value }) => {
//           db.query('UPDATE songs SET ? WHERE ?', [
//             { [column]: value }, { title }
//           ], e => {
//             if (e) throw e
//             console.log('*** Succesfully updated your song! ***')
//             getAction()
//           })
//         })
//     })
//     .catch(e => console.log(e))
// }

// const deleteSong = _ => {
//   getSongs('title')
//     .then(r => {
//       prompt([
//         {
//           type: 'list',
//           name: 'title',
//           message: 'Select the song you wish to delete:',
//           choices: r.map(({ title }) => title)
//         },
//         {
//           type: 'confirm',
//           name: 'choice',
//           message: 'Are you sure you want to delete this song?'
//         }
//       ])
//         .then(({ title, choice }) => {
//           if (choice) {
//             db.query('DELETE FROM songs WHERE ?', { title }, e => {
//               if (e) throw e
//               console.log('*** Successfully deleted your song! ***')
//               getAction()
//             })
//           } else {
//             getAction()
//           }
//         })
//         .catch(e => console.log(e))
//     })
//     .catch(e => console.log(e))
// }

const getAction = _ => {
  prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: ['View products for Sale', 'View Low Inventory.', 'Add to Inventory', 'Add New Product', '--EXIT--']
  })
    .then(({ action }) => {
      switch (action) {
        case 'View products for Sale':
          getProducts('*')
            .then(r => {
              r.forEach(({item_id, product_name, price}) => console.log(`
                ----------
                #${item_id} ${product_name} - ${price}
                ----------`
              ))
              getAction()
            })
            .catch(e => console.log(e))
          break
        case 'View Low Inventory':
         // getSong()
         console.log('low inventory')
          break
        case 'Add to Inventory':
         // addSong()
         console.log('add')
          break
        case 'Add New Product':
        console.log('addnew')
          break
        case '--EXIT--':
          process.exit()
        default:
          getAction()
          break
      }
    })
    .catch(e => console.log(e))
}

db.connect(e => e ? console.log(e) : getAction())

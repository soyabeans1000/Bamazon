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


async function getLowInventory(columns) {
  //Get all Products from the Database
  let response = await new Promise((resolve, reject) => {
      db.query(`SELECT ${columns} FROM products WHERE stock_quantity <= 5`, (e, r) => {
          if (e) {
              reject(e)
          } else {
              resolve(r)
          }
      })
  })
  return response
}

const addProduct = _ => {
   prompt([
          {
     type: 'input',
       name: 'product_name',
       message: 'What is the name of the Product?'
     },
     {
       type: 'input',
       name: 'department_name',
       message: 'Which Department?'
     },
     {
       type: 'input',
       name: 'price',
       message: 'What is the price per item?'
     },
     {
      type: 'input',
      name: 'stock_quantity',
      message: 'How many do you have?'
    },

   ])
     .then(item => {
       db.query('INSERT INTO PRODUCTS SET ?', item, e => {
         if (e) throw e
         console.log('*** Successfully added your product! ***')
         getAction()
       })
     })
}

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



const getAction = _ => {
  prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: ['View products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', '--EXIT--']
  })
    .then(({ action }) => {
      switch (action) {
        case 'View products for Sale':
          getProducts('*')
            .then(r => {
              r.forEach(({item_id, product_name, price}) => console.log(`
                ----------
                #${item_id} ${product_name} - $${price}
                ----------`
              ))
              getAction()
            })
            .catch(e => console.log(e))
          break
        case 'View Low Inventory':
        getLowInventory('*')
          .then(r => {
            r.forEach(({item_id, product_name, stock_quantity}) => console.log(`
              ----------
              #${item_id} ${product_name} - QTY:${stock_quantity}
              ----------`
            ))
            getAction()
          })
          .catch(e => console.log(e))
         
          break
        case 'Add to Inventory':
         
         console.log('add')
          break
        case 'Add New Product':
        addProduct()
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

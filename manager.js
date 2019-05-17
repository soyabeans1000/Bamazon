const { prompt } = require('inquirer')
const { createConnection } = require('mysql2')

const db = createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
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

//Return Products with inventory equal and less than 5
//Returns a promise, with an array 
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
  //return promise
  return response
}


//Add Product to Database, after getting questions from user
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
      message: 'How many?'
    },

   ])
     .then(item => {
       db.query('INSERT INTO PRODUCTS SET ?', item, e => {
         if (e) throw e
         console.log('\n*** Successfully added your product! ***\n')
         getAction()
       })
     })
}

//Update inventory of product with prod_id
//Returns Promise
async function updateQty(prod_id,qty) {

  let response = await new Promise((resolve, reject) => {
       db.query(`SELECT stock_quantity FROM products WHERE item_id = ${prod_id}`, (e, r) => {
          //IF error
           if (e) {
                reject(e)
               console.log(e)
           }
              else {
                  let currentQty =  r[0].stock_quantity
                  let newQty = currentQty + parseInt(qty)
                  db.query(`UPDATE products set stock_quantity = ${newQty} WHERE item_id = ${prod_id}`, (e, r) => {
                         if (e) {
                             reject(e)
                         } else {
                          resolve('\n*** Inventory Updated Succesfully  ***\n')
                          }
                        })        
                }
            })
        })
        //return promise
  return response
}

//Update inventory of product selected from list 
const updateInventory = _ => {
  getProducts('*')
    .then(r => {
      prompt([
        {
          type: 'list',
          name: 'product_name',
          message: 'Select the product you wish to change:',
          choices: r.map(({ item_id, product_name, stock_quantity }) => `${item_id} ${product_name}`)
        },
       
        {
          type: 'input',
          name: 'value',
          message: 'How many more?'
        }
      ])
        .then( r => {
           let itemID = r.product_name.split(' ')[0]

          //Call Function with promise
          updateQty(itemID, r.value)
          .then(r => {console.log(r)
          getAction()
        })
          .catch(e => console.log(e))            
          })
        })     
.catch(e => console.log(e))
}

//Default menu
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
                ---------------------------------------
                #${item_id} ${product_name} - $${price}
                ---------------------------------------`
              ))
              getAction()
            })
            .catch(e => console.log(e))
          break
        case 'View Low Inventory':
        getLowInventory('*')
          .then(r => {
            r.forEach(({item_id, product_name, stock_quantity}) => console.log(`
              ---------------------------------------------------
              #${item_id} ${product_name} - QTY:${stock_quantity}
              ---------------------------------------------------` ))
            getAction()
          })
          .catch(e => console.log(e))
         
          break
        case 'Add to Inventory':
        updateInventory() 
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

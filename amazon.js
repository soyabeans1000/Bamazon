const { prompt } = require('inquirer')
const { createConnection } = require('mysql2')
const db = createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Reboot@2019',
  database: 'bamazon_db'
})

async function queryProducts(columns) {
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

const getProducts = _ => {
  let pArray = []
  queryProducts('*')
    .then(r => {
      r.forEach(({ item_id, product_name, department_name }) => {
        pArray.push(`#${item_id} ${product_name} FROM ${department_name}`)
      })
      prompt({
        type: 'list',
        name: 'Product',
        message: 'Select the product you would like to buy:',
        choices: pArray
      })
        .then(answer => {
          console.log(answer.Product)
        })
        .catch(e => console.log(e))
      // getAction()
    })
    .catch(e => console.log(e))
}

const getAction = _ => {
  prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: ['Shop our products', '--EXIT--']
  })
    .then(({ action }) => {
      switch (action) {
        case 'Shop our products':
          getProducts()
          break
        case '--EXIT--':
          process.exit()
        default:
          getAction()
          break
      }
    })
}
db.connect(e => e ? console.log(e) : getAction())


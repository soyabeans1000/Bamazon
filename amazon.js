const { prompt } = require('inquirer')
const { createConnection } = require('mysql2')
const db = createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Reboot@2019',
  database: 'bamazon_db'
})

async function buy(x, qty) {

  let productId = (x.split(' ')[0]).substring(1)
  let response = await new Promise((resolve, reject) => {
    db.query(`SELECT stock_quantity FROM products WHERE item_id = ${productId}`, (e, r) => {
      //IF error
      if (e) {
        reject(e)
        console.log(e)
      }
      else {
        resolve(r)
        //get the quantity to compare with the number to buy
        let itemQty = parseInt(r[0].stock_quantity)

        if (qty <= itemQty) {
          //get the quantity to compare with the number to buy
          console.log('Update')
          db.query(`UPDATE products set stock_quantity = ${itemQty - qty} WHERE item_id = ${productId}`, (e, r) => {
            if (e) {
              console.log(e)
            } else {
              "Purchase Successful!"
            }
            //End Update Query
          })
        }
        //If not enough
        else
          console.log("Sorry we dont have enough")
        //Done Updating
      }
    })
  })
  getAction()
}


const buyItem = (x) => {

  prompt({
    type: 'input',
    name: 'qty',
    message: 'How Many?',
    //choices
  })
    .then(answer => {
      //console.log(answer.qty)
      buy(x,answer.qty)  

      //getProducts()
    })
    .catch(e => console.log(e))

}


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
  let ans
  queryProducts('*')
    .then(r => {
      r.forEach(({ item_id, product_name, price }) => {
        pArray.push(`#${item_id} ${product_name} - ${price}`)
      })
      pArray.push('Return to Main Menu')
      prompt({
        type: 'list',
        name: 'Product',
        message: 'Select the product you would like to buy:',
        choices: pArray
      })
        .then(answer => {

        if (answer.Product === 'Return to Main Menu')
        {
          getAction()
        }
        else 
        {buyItem(answer.Product)}
        })
        .catch(e => console.log(e))

        
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


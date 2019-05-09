const { prompt } = require('inquirer')
const { createConnection } = require('mysql2')
const db = createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Reboot@2019',
    database: 'bamazon_db'
})

async function buyItem() {

  let   qty = 10
    x = '#1 resr'

let rmessage = 'Resolving inside of function'

console.log('inside')
   
             let response = await new Promise((resolve, reject) => {
                          
            
                
               db.query(`SELECT stock_quantity FROM products WHERE item_id = ${productId}`, (e, r) => {
                      //IF error
                     if (e) {
                         // reject(e)
                         console.log(e)
                   }
                      else {
                          //get the quantity to compare with the number to buy
                    let itemQty = parseInt(r[0].stock_quantity)

                     if (qty <= itemQty) {
                          //get the quantity to compare with the number to buy
                              db.query(`UPDATE products set stock_quantity = ${itemQty - qty} WHERE item_id = ${productId}`, (e, r) => {
                            console.log("inside query")
                                  if (e) {
                                     // reject(e)
                                 } else {
                                      rmessage = "Purchase Successful!"
                                      console.log("Purchase Successful!")
                                  }
                                  //End Update Query
                              })
                          }
                          //If not enough
                          else {
                              rmessage = "Sorry! OUT OF STOCK"
                              console.log("Sorry we don't have enough")
                          }
                      }
                  })
             })
             console.log(rmessage)
         resolve(rmessage)
       return response
  
        
  
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

                    console.log(answer)

                    if (answer.Product === 'Return to Main Menu') {
                        getAction()
                    }
                    else {
                        
                        prompt({
                            type: 'input',
                            name: 'qty',
                            message: 'How Many?',
                            //choices
                        }).then(d => {
                            console.log("Handling Product to buy" +  answer.Product + d.qty)

                            let productId = (answer.Product.split(' ')[0]).substring(1)

                            db.query(`SELECT stock_quantity FROM products WHERE item_id = ${productId}`, (e, r) => {
                                //IF error
                               if (e) {
                                   console.log(e)
                             }
                                else {
                                    //get the quantity to compare with the number to buy
                              let itemQty = parseInt(r[0].stock_quantity)
          
                               if (d.qty <= itemQty) {
                                    //get the quantity to compare with the number to buy
                                        db.query(`UPDATE products set stock_quantity = ${itemQty - qty} WHERE item_id = ${productId}`, (e, r) => {
                                      console.log("inside query")
                                            if (e) {
                                               // reject(e)
                                           } else {
                                                rmessage = "Purchase Successful!"
                                                console.log("Purchase Successful!")
                                            }
                                            //End Update Query
                                        })
                                    }
                                    //If not enough
                                    else {
                                        rmessage = "Sorry! OUT OF STOCK"
                                        console.log("Sorry we don't have enough")
                                    }
                                }
                            })

                     

                        })
               
            
                        }   
                        
                        //handling Product choice
                    })  
                            
                          
                    
                
        })
        .catch(e => console.log(e))


      //  getAction()

        
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


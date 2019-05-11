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



async function updateInventory_buy(prod_id,qty) {

  let response = await new Promise((resolve, reject) => {
       db.query(`SELECT stock_quantity FROM products WHERE item_id = ${prod_id}`, (e, r) => {
          //IF error
           if (e) {
                reject(e)
               console.log(e)
           }
              else {
                  let currentQty =  r[0].stock_quantity
                  let newQty = currentQty - parseInt(qty)
                  db.query(`UPDATE products set stock_quantity = ${newQty} WHERE item_id = ${prod_id}`, (e, r) => {
                         if (e) {
                             reject(e)
                         } else {
                          resolve('\n***Purchase Successful***\n')
                          }
                        })        
                }
            })
        })
        //return promise
  return response
}

//Update inventory of product with prod_id
//Returns Promise
async function buyItem(prod_id,qty) {

    let response = await new Promise((resolve, reject) => {
         db.query(`SELECT stock_quantity FROM products WHERE item_id = ${prod_id}`, (e, r) => {
            //IF error
             if (e) {
                  reject(e)
                 console.log(e)
                   }
                else {
                    let currentQty =  r[0].stock_quantity
                    if (currentQty < qty)
                    resolve('\n*** Sorry we dont have enough  ***\n')
                    else 
                    {


                        prompt([
                            {
                              type: 'list',
                              name: 'confirm',
                              message: 'Are u sure?',
                              choices: ['Yes','No']
                            } ])
                            
                            .then( r =>  
                            
                            {
                            if (r.confirm === "Yes")
                            {  
                            let newQty = currentQty - parseInt(qty)
                            db.query(`UPDATE products set stock_quantity = ${newQty} WHERE item_id = ${prod_id}`, (e, r) => {
                                   if (e) {
                                       reject(e)
                                   } else {
                                    resolve('\n*** Purchase Successful  ***\n')
                                    }
                                  }) 
                            }







                            
                            else 
                            {
                              resolve('\n*** Item purchase cancelled!  ***\n')
                               getAction()
                            }
                            
                        })
                    }
                  }
              })
          })
          //return promise
    return response
  }
  
//Update inventory of product selected from list 
  const buyProducts = _ => {

 getProducts('*')
      .then(r => {
        prompt([
          {
            type: 'list',
            name: 'product_name',
            message: 'Select the product you wish to buy:',
            choices: r.map(({ item_id, product_name, stock_quantity }) => `${item_id} ${product_name}`)
          },      
          {
            type: 'input',
            name: 'value',
            message: 'How Many?'
          }
        ])
          .then( r => {
             let itemID = r.product_name.split(' ')[0]
  
            //Call Function with promise
            buyItem(itemID, r.value)
            .then(r => {
            console.log(r)
            getAction()
          })
            .catch(e => console.log(e))            
            })
          })     
  .catch(e => console.log(e))
   }


const getAction = _ => {
    prompt({
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: ['Buy our products', '--EXIT--']
    })
      .then(({ action }) => {
        switch (action) {
          case 'Buy our products':
          buyProducts()
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


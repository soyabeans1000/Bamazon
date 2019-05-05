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
    db.query(`SELECT ${coumn} FROM products`, (e, r) => {
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

  queryProducts('*')
            .then(r => {
              r.forEach(({ title, artist, genre }) => console.log(`
                ---------
                ${title} by ${artist}
                Genre: ${genre}
                ----------
              `))
              getAction()
            })
            .catch(e => console.log(e))




//   queryProducts()
//   //Process the array returned 
//   .then(r => {

//  console.log(r.length)

//  let pArray

//  for (i=0; i < r.length; i++)
//  {

//   let pArray
//   pArray[i] = r[i].product_name
//   console.log(pArray)

//   console.log(r[i].product_name)
//  }


   

  

//     prompt({
//       type: 'list',
//       name: 'Product',
//      message: 'Select the product you would like to buy:',
//       choices: [1,2,3]
//       })
//       .then(title => {
        
  
//       })
//       .catch(e => console.log(e))
//   })
//   .catch(e => console.log(e))
// }





  
 //queryProducts()
  

//  console.log(queryProducts())
//      prompt({
//        type: 'list',
//          name: 'Product',
//         message: 'Select the product you would like to buy:',
//          // choices: r.map(({item_id, product_name, price }) => title)
//          choices: [queryProducts()]
//       })
//        .then(product => {

//         console.log(product.Product)
// //           db.query('SELECT * FROM songs WHERE ?', title, (e, [{ title, artist, genre }]) => {
// //             if (e) throw e
// //             console.log(`
// //             ----------
// //             ${title} by ${artist}
// //             Genre: ${genre}
// //             ----------
// //             `)
// //             getAction()
// //           })
// //         })
// //         .catch(e => console.log(e))
//     })
//   .catch(e => console.log(e))
// }






        getProducts()
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


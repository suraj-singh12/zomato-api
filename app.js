let express = require('express');
let app = express();

let dotenv = require('dotenv');
dotenv.config();
let port = process.env.PORT || 8500;

let mongo = require('mongodb');
const res = require('express/lib/response');
let MongoClient = mongo.MongoClient;
// let mongoUrl = process.env.MongoUrl;     // local url
let mongoUrl = process.env.MongoLiveUrl;
let db;
let authKey = require('./auth-key.json').key;

//middleware 
let cors = require('cors');
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());


function auth(key) {
    if (key == authKey)
        return true;
    return false;
}

//Cors Configuration - Start
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested, Content-Type, Accept Authorization"
    )
    if (req.method === "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "POST, PUT, PATCH, GET, DELETE"
      )
      return res.status(200).json({})
    }
    next()
  })
  //Cors Configuration - End
  

app.get('/', (req, res) => {
    res.send('Express Server Default');
});

// list all the APIs: menu, restaurants, location, mealtype
app.get('/list-apis', (req, res) => {
    let key = req.header('x-basic-auth');
    if (auth(key)) {
        db.listCollections().toArray((err, collInfo) => {
            if (err) throw err;

            let arr = []
            for (c of collInfo)  // for of loop (used in arrays)
                arr.push(c.name);

            res.send(arr);
        });
    } else {
        res.send("Unauthorized Access !")
    }
});


app.get('/location', (req, res) => {
    db.collection('location').find().toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/mealtype', (req, res) => {
    db.collection('mealtype').find().toArray((err, result) => {
        if(err) throw err;
        res.send(result);
    });
});

app.get('/restaurants', (req, res)  => {
    let stateId = Number(req.query.stateId);
    let mealId = Number(req.query.mealId);
    let query = {};

    if(stateId && mealId) {
        query = {state_id: stateId, 'mealTypes.mealtype_id': mealId};
    } else if(stateId) {
        query ={state_id: stateId};
    } else if(mealId) {
        query = {'mealTypes.mealtype_id': mealId}
    }

    db.collection('restaurants').find(query).toArray((err, result) => {
        if(err) throw err;
        res.send(result);
    });
});

// filter on basis of mealId, cuisineId, and cost
app.get('/filter/:mealId', (req, res) => {
    let sort = {cost: 1};
    let mealId = Number(req.params.mealId);
    let cuisineId = Number(req.query.cuisineId);
    let lcost = Number(req.query.lcost);
    let hcost = Number(req.query.hcost);
    let query = {};
    if(req.query.sort) 
        sort = {cost: req.query.sort};
    
    if(lcost && hcost && cuisineId) {
        query = {
            'mealTypes.mealtype_id':mealId,
            $and:[{cost:{$gt:lcost, $lt:hcost}}],
            'cuisines.cuisine_id': cuisineId
        }
    } else if(lcost && hcost) {
        query = {
            'mealTypes.mealtype_id':mealId,
            $and:[{cost:{$gt:lcost, $lt:hcost}}]
        }
    } else if(lcost) {
        query = {
            'mealTypes.mealtype_id':mealId,
            cost:{$gt:lcost}
        }
    } else if(hcost) {
        query = {
            'mealTypes.mealtype_id':mealId,
            cost:{$lt:hcost}
        }
    } else if(cuisineId) {
        query = { 
            'mealTypes.mealtype_id':mealId,
            'cuisines.cuisine_id': cuisineId
        }
    } 
    else {
        query = {
            'mealTypes.mealtype_id':mealId
        }
    }

    db.collection('restaurants').find(query).sort(sort).toArray((err, result) => {
        if(err) throw err;
        res.send(result);
    });
});

// details of a restaurant using id
app.get('/details/:id', (req, res) => {
    let id = Number(req.params.id);
    db.collection('restaurants').find({restaurant_id:id}).toArray((err, result) => {
        if(err) throw err;
        res.send(result);
    });
});

// details of menu using restaurant_id
app.get('/menu/:id', (req, res) => {
    let id = Number(req.params.id);
    db.collection('menu').find({restaurant_id:id}).toArray((err, result) => {
        if(err) throw err;
        res.send(result);
    });
});

// get the orders details       (test this api)
app.get('/orders', (req,res) => {
    let email = req.query.email;
    let query = {}
    if(email) {
        query = {email}
    }
    db.collection('orders').find(query).toArray((err, result) => {
        if(err) throw err;
        res.send(result);
    });
});

//-----------------------------------------------------------------------
// menu on basis of user selected ids [how to call this api?]
app.post('/menuItem', (req, res) => {
    if(Array.isArray(req.body)) {
        db.collection('menu').find({menu_id:{$in:req.body}}).toArray((err, result) => {
            if(err) throw err;
            res.send(result);
        });
    } else {
        res.send("Invalid Input")
    }
})

// placeOrder
app.post('/placeOrder', (req, res) => {
    db.collection('orders').insertOne(req.body, (err, result) => {
        if(err) throw err;
        res.send(result);
    });
});

// updating order status
app.put('/updateOrder/:id', (req, res) => {
    let oid = Number(req.params.id);
    db.collection('orders').updateOne(
        {id:oid},   // updated `orderId` to `id` here because our data has nothing as orderId, we just name it id (in database order's data)
        {
            $set:{
                "status":req.body.status, 
                "bank_name":req.body.bank_name,
                "date":req.body.date
            }
        }, (err, result) => {
            if(err) throw err;
            res.send('Order Updated');
        }
    );
});

app.delete('/deleteOrder/:id', (req, res) => {
    let oid = mongo.ObjectId(req.params.id);
    // can use deleteOne(), deleteBulk(), remove()
    db.collection('orders').deleteOne({_id:oid}, (err, result) => {
        if(err) throw err;
        res.send('Order Deleted');
    });
});

// the update & delete api won't work when you put them in browser.
// you have to use postman for it or use react.
// by default the address bar of browser can only run .get() apis
app.delete('/deleteAllOrders', (req,res) => {
    db.collection('orders').deleteMany({}, (err, result) => {
        if(err) throw err;
        res.send('All Orders Deleted');
    });
})

// connect to database
MongoClient.connect(mongoUrl, (err, client) => {
    if (err) console.log("Error while connecting");

    db = client.db('project1');

    app.listen(port, (err) => {
        if (err) throw err;
        console.log('Express server listening on port' + port);
        console.log('http://localhost:' + port);
    })
})
const mongoClient=require('mongodb').MongoClient
const mongo=require('mongodb-legacy').MongoClient

const state = {
    db:null
}


module.exports.connect=function(done){         //done is callback
    const dbname='jwt'
   // const url=`mongodb+srv://amilsanan:amil123456@cluster0.3hyjwzh.mongodb.net/${dbname}`
    const url=`mongodb://localhost:27017`

    mongo.connect(url,(err,data)=>{
        if(err) return done(err)
        state.db=data.db(dbname)
        done()
    })

    
}

module.exports.get=function(){
    return state.db
}
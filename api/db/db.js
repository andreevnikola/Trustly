const { MongoClient } = require("mongodb");
const uri = "mongodb://127.0.0.1:27017/";

const client = new MongoClient(uri);

async function setupDB() {
  await client.connect();
}
setupDB();

class CRUD{
    constructor(db, collection){
        this.db = db;
        this.collection = collection;
        this.connect();
    }
    async connect(){
        this.connection = await client.db(this.db).collection(this.collection);
    }
    async Create(data){
        this.result = await this.connection?.insertOne(data);
        return this.result;
    }
    async Read(condition){
        this.result = await this.connection.findOne(condition);
        return this.result;
    }
    async ReadMany(condition, limit, sort){
        if(limit){
            if(sort){
                this.result = await this.connection?.find(condition).limit(limit).sort(sort).toArray();
            }else{
                this.result = await this.connection?.find(condition).limit(limit).toArray();
            }
        }else{
            if(sort){
                this.result = await this.connection?.find(condition).sort(sort).toArray();
            }else{
                this.result = await this.connection?.find(condition).toArray();
            }
        }
        return this.result;
    }
    async Update(condition, data){
        this.result = await this.connection?.updateOne(condition, data);
        return this.result;
    }
    async Delete(condition){
        this.result = await this.connection?.deleteOne(condition);
        return this.result;
    }
    async Close(){
        await client.close();
    }
}

module.exports = CRUD;
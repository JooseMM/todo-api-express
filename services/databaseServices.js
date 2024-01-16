import {  MongoClient, ObjectId, ServerApiVersion  } from 'mongodb';
import 'dotenv/config';

export class DbService {
  DB_URL = process.env.DATABASE_URL;
  client = new MongoClient(this.DB_URL, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  db = this.client.db("todo");
  collection = this.db.collection("tasks");

  async getAll() {
    try {
      await this.client.connect();
      return await this.collection.find({}).toArray();
    }  catch(err) {
      console.log("Error at connecting to database:" + err);
    } finally {
      await this.client.close();
    }
  }
  async get(id){
    try {
      const ID = new ObjectId(id);
      await this.client.connect();
      return await this.collection.find({ _id: ID }).toArray();

    } catch(err){
      console.log("Error while trying to find a document: " + err);
    } finally {
      await this.client.close();
    }
  }
  async create(newData){
    try {
      await this.client.connect();
      await this.collection.insertOne(newData);
    } 
    catch(err) {
      return 'Error while trying to create a document: ' + err ;
    } 
    finally {
      await this.client.close();
    }
  }
  async delete(id){
    try {
      const ID = new ObjectId(id);
      await this.client.connect();
      await this.collection.deleteOne({ _id: ID });
    } catch(err) {
      console.log("Error while trying to delete a document: " + err);
    } finally {
      await this.client.close();
    }
  }
}

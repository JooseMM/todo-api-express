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
  collection = this.db.collection("users");

  //users services
  async getUser(name) {
    try {
      await this.client.connect();
      const response = await this.collection.findOne({ username: name });
      const { username, password } = response;
      console.log('this is getuser ' + username, password);
      return { username, password };
    }catch(error) {
      return { ok: false, msg: error.message };
    } finally {
      await this.client.close();
    }
  }
  async createUser(newUser) {
    try {
      await this.client.connect();
      const response = await this.collection.insertOne(newUser);
      return { ok: true, response };
    } catch(error){
      return { ok: false, msg: error.message };
    } finally {
      await this.client.close();
    }
  }
  async createTask(newTaskInfo){
    const { task, date, complete, userId } = newTaskInfo;
    const newTask = {
      _id: new ObjectId(),
      task: task,
      complete: complete,
      date: date
    }
    const userQuery = { _id: new ObjectId(userId) };
    const updateQuery = {
      $push: { 'tasks': newTask }
    };
    try {
      await this.client.connect();
      const response = await this.collection.updateOne(userQuery, updateQuery);
      return { ok: true, response };
    } 
    catch(error) {
      return { ok: false, msg: error.message };
    } 
    finally {
      await this.client.close();
    }
  }
  async getAllTask(userId) {
    try {
      await this.client.connect();
      const { tasks } = await this.collection.findOne({ _id: new ObjectId(userId)});
      return { ok: true, tasks };
    }  catch(error) {
      return { ok: false, msg: error.message };
    } finally {
      await this.client.close();
    }
  }
  async getTask(userId, taskId){
    try {
      await this.client.connect();
      const { tasks } = await this.collection.findOne({ _id: new ObjectId(userId)});
      const response = tasks.filter((match)=> match._id == taskId);
      return { ok: true, response};
    } catch(error){
      return { ok: false, msg: error.message };
    } finally {
      await this.client.close();
    }
  }
  async update(updateData) {
    try {
      const ID = new ObjectId(updateData.id);
      await this.client.connect();

      if(updateData.complete) {
	const response = await this.collection.updateOne({ "tasks._id": ID }, { $set: { "tasks.$.complete": true}});
	return { ok: true, response };
      }
      else {
	const response = await this.collection.updateOne({ "tasks._id": ID }, { $set: { "tasks.$.task": updateData.task }});
	return { ok: true, response }
      }

    } catch(error) {
      return { ok: false, msg: error.message };
    } finally {
      await this.client.close();
    }
  }
  async delete(deleteInfo){
    const { taskId, userId } = deleteInfo;
    const filter = { _id: new ObjectId(userId) };
    const operation = { $pull: { tasks: { _id: new ObjectId(taskId)}}};
    try {
      await this.client.connect();
      const response = await this.collection.updateOne(filter, operation);
      return { ok: true, response};
    } catch(error) {
      return { ok: false, msg: error.message };
    } finally {
      await this.client.close();
    }
  }
  async deleteComplete(userId) {
    const filter = { _id: new ObjectId(userId) };
    const operation = { $pull: { tasks: { complete: true }}};
    try {
      await this.client.connect();
      const response = await this.collection.updateMany(filter, operation);
      return { ok: true, response};
    } catch(error) {
      return { ok: false, msg: error.message };
    } finally {
      await this.client.close();
    }

  }
}

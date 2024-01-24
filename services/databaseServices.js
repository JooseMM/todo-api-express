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
      const { username, password, _id } = response;
      const id = new ObjectId(_id).toString();
      return { ok: true, userExist: true, username, password, id };
    }catch(error) {
      return { ok: false, userExist: false, msg: error.message };
    } finally {
      await this.client.close();
    }
  }
  async createUser(newUser) {
    try {
      await this.client.connect();
      const response = await this.collection.insertOne(newUser);
      return { ok: true, status:200, response };
    } catch(error){
      return { ok: false, status:400, msg: error.message };
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
      const { modifiedCount } = response;
      return { ok: true, status: 201, modifiedCount, insertedId: newTask._id, msg: 'Task stored' };
    } 
    catch(error) {
      return { ok: false, status: 500, modifiedCount: 0, insertedId: undefined, msg: error.message };
    } 
    finally {
      await this.client.close();
    }
  }
  async getAllTask(userId) {
    try {
      await this.client.connect();
      const { tasks } = await this.collection.findOne({ _id: new ObjectId(userId)});
      return { ok: true, status: 200, msg: 'Successful query', tasks };
    }  catch(error) {
      return { ok: false, status: 400, msg: error.message, tasks: undefined };
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
	const { modifiedCount } = response;
	return { ok: true, status: 200, modifiedCount, msg: "Task modified" };
      }
      else {
	const response = await this.collection.updateOne({ "tasks._id": ID }, { $set: { "tasks.$.task": updateData.task }});
	return { ok: true, status: 200, modifiedCount, msg: "Task modified" };
      }

    } catch(error) {
	return { ok: false, status: 500, modifiedCount: 0, msg: error.message };
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
      const { modifiedCount } = response
      return { ok: true, status: 200, modifiedCount, msg: "Task deleted successfuly"};
    } catch(error) {
      return { ok: false, status: 500, modifiedCount: 0, msg: error.message };
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
      const { modifiedCount } = response;
      return { ok: true, status: 200, modifiedCount, msg: "Complete tasks where deleted successfuly"};
    } catch(error) {
      return { ok: false, status: 500, modifiedCount: 0, msg: error.message };
    } finally {
      await this.client.close();
    }

  }
}

import { DbService } from "../services/databaseServices.js";
    
 const db = new DbService(); 
 export async function apiGetAll (_req,res) {
    res.send(await db.getAll());
  };
 export async function apiGet(req, res) {
   res.send(await db.get(req.params.id));
 };
export async function apiCreate(req, res) {
  if(!req.body.task) {
    res.json(req.body.task);
  } else {
    const newData = {
      task : req.body.task,
      complete : false,
      date: new Date()
    }
    res.send(await db.create(newData));
  }
};
 export async function apiDelete(req, res) {
   res.send(await db.delete(req.params.id));
 };

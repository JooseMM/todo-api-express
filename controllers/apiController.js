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
    res.json("Bad Request: " + req.body.task);
  } else {
    const newData = {
      task: req.body.task,
      complete: false,
      date: new Date()
    }
    res.sendStatus(await db.create(newData));
  }
};
 export async function apiDelete(req, res) {
   res.sendStatus(await db.delete(req.params.id));
 };

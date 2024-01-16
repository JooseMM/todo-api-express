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
    res.sendStatus(400).send("Bad Request: " + req.body.task);
  } else {
    const newData = {
      task: req.body.task,
      complete: false,
      date: new Date()
    }
    await db.create(newData);
    res.send(await db.getAll());
  }
};
 export async function apiDelete(req, res) {
   if(!req.params.id) { res.sendStatus(400).send("Not a valid id provided")}
   else {
     await db.delete(req.params.id)
     res.sendStatus(await db.getAll());
   }
 };

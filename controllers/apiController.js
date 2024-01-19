import { DbService } from "../services/databaseServices.js";

const db = new DbService(); 
export async function apiGetAll (_req,res) {
  res.send(await db.getAll());
};

export async function apiGet(req, res) {
  const id = req.params.id;
  if(!id) {
    return res.sendStatus(400).send("Not a valid id provided :" + id)
  }
  res.send(await db.get(req.params.id));
};

export async function apiCreate(req, res) {
  if(!req.body.task || !req.body.task) {
    return res.sendStatus(400).send("Bad Request: " + req.body.task);
  } else {
    const newData = {
      task: req.body.task,
      complete: false,
      date: req.body.date
    }
    res.send(await db.create(newData));
  }
};
export async function apiUpdate(req, res) {
  if(!req.body.id) {
    return res.sendStatus(400).send("Not a valid ID provided")
  }
  const newData = { 
    id: req.body.id,
    task: req.body.task ? req.body.task : undefined,
    complete: req.body.complete ? req.body.complete : false,
  }
  res.send(await db.update(newData));
};
export async function apiDelete(req, res) {
  const id = req.params.id;
  if(!id) { return res.sendStatus(400).send("Not a valid id provided")}
  else {
    await db.delete(id)
    res.send(await db.getAll());
  }
};
export async function apiClear(req, res) {
  res.send(await db.clear());
};


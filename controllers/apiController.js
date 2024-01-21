import { DbService } from "../services/databaseServices.js";
import  Jwt  from "jsonwebtoken";
import bcrypt from "bcrypt";

const db = new DbService(); 
export async function getAllTask (req,res) {
  if(!req.params.userId) {
    return res.send(400).json({ status: 400, msg: 'No ID provided'});
  }
  const { userId } = req.params;
  res.json(await db.getAllTask(userId));
};

export async function getSingleTask(req, res) {
  if(!req.params.userId || !req.params.taskId) {
    return res.json("Not a valid id provided :" + id)
  }
  const { userId, taskId } = req.params;
  res.json(await db.getTask(userId, taskId));
};

export async function createTask(req, res) {
  if(!req.body.task || !req.body.userId || !req.body.date) {
    return res.status(400).send("Bad Request");
  } 
  const { task, date, userId } = req.body;
  const result = await db.createTask({ task, date, userId, complete: false,});
  res.json(result);
  
};
export async function userSignUp(req, res) {
  //todo: validate incoming data
  const { username, password } = req.body
  if(!username || !password ) {
    return send.json({ status: 400, msg: 'bad request' });
  }
  const getUserResponse = await db.getUser(username);
  if(getUserResponse.ok) { return res.status(400).json({status: 400, msg: 'username is already in use' })};
  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(password, salt);
  const newUser = {
    username: username,
    password: hashPass,
    tasks: []
  }
  res.json(await db.createUser(newUser));
}
export async function userLogin(req, res) {
  const { username, password } = req.body;
  if( !username || !password ) {
    return res.json({ status: 400, msg: 'Ingreso de nombre de usuario o contraseña invalido'})
  };
  const user = await db.getUser(username);
  if(!user) {
    return res.json({ status: 400, msg: 'Usuario no existe' })
  };
  bcrypt.compare(password, user.password, ( _err, result )=> {
    if(result) {
      const token = Jwt.sign({ id: user._id,  user: username }, process.env.JWT_SECRET, { expiresIn: "7d"});
      return res.json({
	status: 200,
	msg: 'login successful',
	token: token
      })
    }
    else {
      return res.json({status: 400, msg: 'Usuario o contraseña incorrecta'});
    }
  });
  
}
export async function updateTask(req, res) {
  if(!req.body.id) {
    return res.status(400).send("Not a valid ID provided")
  }
  const newData = {
    id: req.body.id,
    task: req.body.task || undefined,
    complete: req.body.complete || false,
  };
  res.json(await db.update(newData));
};
export async function deleteTask(req, res) {
  if(!req.body.userId || !req.body.taskId) { return res.sendStatus(400).send("Not valids IDs provided")}
  const { userId, taskId } = req.body;
    res.json(await db.delete({ userId, taskId}));
};
export async function deleteCompleteTasks(req, res) {
  const { userId } = req.body
  if(!userId) { return res.json({ status: 400, msg: 'Bad request'})}
  return res.json(await db.deleteComplete(userId));
};


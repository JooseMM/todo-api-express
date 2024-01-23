import { DbService } from "../services/databaseServices.js";
import  Jwt  from "jsonwebtoken";
import bcrypt from "bcrypt";

const db = new DbService(); 
export async function getAllTask (req,res) {
  const userId = req.user.id;
  if(!userId) {
    return res.send(400).json({ ok:false, status: 400, msg: 'No ID provided'});
  }
  res.json(await db.getAllTask(userId));
};

export async function getSingleTask(req, res) {
  if(!req.params.taskId) {
    return res.json({ ok:false, status: 400, msg: 'Bad request'});
  }
  const userId = req.user.id;
  const { taskId } = req.params;
  res.json(await db.getTask(userId, taskId));
};

export async function createTask(req, res) {
  if(!req.body.task || !req.body.date) {
    return res.json({status: 400, ok: false, msg: 'Bad request'});
  } 
  const userId = req.user.id;
  const { task, date } = req.body;
  const result = await db.createTask({ task, date, userId, complete: false,});
  res.json(result);
};
export async function userSignUp(req, res) {
  //todo: validate incoming data
  const { username, password } = req.body
  if( !username || !password ) {
    return send.json({ ok: false, status: 400, msg: 'bad request' });
  }
  const getUserResponse = await db.getUser(username);
  if(getUserResponse.userExist) { 
    return res.json({ ok: false, status: 400, msg: 'username is already in use' })
  };
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
    return res.json({ ok: false, status: 400, msg: 'Ingreso de nombre de usuario o contraseña invalido'})
  };
  const user = await db.getUser(username);
  if(!user) {
    return res.json({ ok: false, status: 400, msg: 'Usuario no existe' });
  };
  bcrypt.compare(password, user.password, ( _err, result )=> {
    if(result) {
      const token = Jwt.sign({ id: user.id,  user: username }, process.env.JWT_SECRET);
      res.cookie('token', token, { httpOnly: true });
      return res.json({
	status: 200,
	msg: 'login successful',
	ok: true
      })
    }
    else {
      return res.json({status: 400, ok: false, msg: 'Usuario o contraseña incorrecta'});
    }
  });
}
export async function updateTask(req, res) {
  if(!req.body.id) {
    return res.json({ ok: false, status:400, msg:"Not a valid ID provided"});
  }
  const newData = {
    id: req.body.id,
    task: req.body.task || undefined,
    complete: req.body.complete || false,
  };
  res.json(await db.update(newData));
};
export async function deleteTask(req, res) {
  if(!req.user.id || !req.body.taskId) {
    return res.json({status:400, ok:false, msg:"Not valids IDs provided"});
  }
  const taskId = req.body.taskId;
  const userId = req.user.id;
  res.json(await db.delete({ userId, taskId}));
};
export async function deleteCompleteTasks(req, res) {
  const  userId = req.user.id;
  if(!userId) { return res.json({ status: 400, ok:false, msg: 'Bad request'})}
  return res.json(await db.deleteComplete(userId));
};
export const tokenAuthentication = (req, res, next) => {
  const token = req.cookies.token;
  if(!token){ return res.json({ status: 400, ok: false, msg: "User haven't login"})}
  try {
    const decodePayload = Jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decodePayload.id, username: decodePayload.user };
    next();
  } catch(error) {
    res.clearCookie("token");
    return res.json({ status: 400, ok: false, msg: "User haven''t login", error: error.message });
  }
}
export function userLogout(_req, res) {
  res.clearCookie("token");
  res.json({ status: 200, ok: true, msg: 'user has logout'});
}

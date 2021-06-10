const { Router } = require('express');
const { login, createUser, getUsuarios, getUsuariosById, deleteUsuarios, updateUsuarios } = require('../controllers/authController');
const { validarJWT } =  require('../helpers/jwt');

const router = Router();

router.post('/sign-in', login)
router.post('/sign-up', validarJWT,createUser)

router.get('/get-users', validarJWT , getUsuarios)
router.get('/get-users/:idusuario', validarJWT ,  getUsuariosById)
router.delete('/delete-users/:idusuario', validarJWT , deleteUsuarios)
router.put('/update-users/:idusuario', validarJWT , updateUsuarios)

module.exports = router;
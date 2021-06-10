const { response } = require("express")
const { Pool } = require('pg');
const { database } = require('../database/connect');
const bcrypt = require('bcryptjs');
const { generarJWT } = require("../helpers/jwt");

const pool = new Pool(database);

const login = async(req, res = response) => {
    const { usuario, password } = req.body;
    try {
        const data_usuario = await pool.query(`SELECT usuario.idusuario, usuario.usuario, usuario.password, rol.nomrol FROM usuario, rol WHERE usuario.idrol = rol.idrol AND usuario.usuario=$1`,[usuario])
        if(data_usuario.rows.length===0){
            return res.status(400).json({
                msg: 'Usuario Incorrecto.!'
            })
        }
        // Validar passwords
        const validPassword = bcrypt.compareSync(password, data_usuario.rows[0].password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Contrasena no valida'
            });
        }

        // Generar JWT
        const token = await generarJWT(data_usuario.rows[0].idusuario, data_usuario.rows[0].usuario, data_usuario.rows[0].nomrol);

        res.status(200).json({
            msg: 'Bienvenido a la app.!',
            token
        })
    } catch (error) {
        return res.status(500).json({
            msg: 'Algo salio mal.!'
        })
    }
}

const createUser = async(req, res = response) => {
    const { usuario, password, idrol } = req.body;
    try {
        const data_usuarios = await pool.query(`SELECT * FROM usuario WHERE usuario=$1`, [usuario])
        
        if(data_usuarios.rows.length>0){
            return res.status(400).json({
                msg: 'El Usuario ya existe.!'
            })
        }
        // Encriptar contrasena
        const salt = bcrypt.genSaltSync();
        const password_encrypt = bcrypt.hashSync(password, salt);
        await pool.query(`INSERT INTO usuario(usuario, password, estado, idrol) values($1, $2, 1, $3)`,
        [usuario, password_encrypt, idrol])
        return res.status(200).json({
            msg: 'Usuario creado correctamente.!'
        })
    } catch (error) {
        res.status(500).json({  
            msg: 'Algo salio mal.!'
        })
    }
}

const getUsuarios = async(req, res = response) => {
    try {      
        const data_usuario = await pool.query(`SELECT usuario.idusuario, usuario.usuario, usuario.password, rol.idrol, rol.nomrol FROM usuario, rol WHERE usuario.idrol=rol.idrol`)
        if(data_usuario.rows.length===0){
            return res.status(400).json({
                msg: 'No hay usuarios!'
            })
        }
        res.status(200).json({
            usuarios: data_usuario.rows
        })
    } catch (error) {
        return res.status(500).json({
            msg: 'Algo salio mal.!'
        })
    }
}

const getUsuariosById = async(req, res = response) => {
    try {      
        const { idusuario } = req.params;
        const data_usuario = await pool.query(`SELECT usuario.idusuario, usuario.usuario, usuario.password, rol.idrol, rol.nomrol FROM usuario, rol WHERE usuario.idrol = rol.idrol and usuario.idusuario=$1`, [idusuario])
        if(data_usuario.rows.length===0){
            return res.status(400).json({
                msg: 'Usuario no encontrado!'
            })
        }
        res.status(200).json({
            usuarios: data_usuario.rows
        })
    } catch (error) {
        return res.status(500).json({
            msg: 'Algo salio mal.!'
        })
    }
}

const deleteUsuarios = async(req, res = response) => {
    try {      
        const { idusuario } = req.params;
        const usuario_eliminado = await pool.query(`DELETE FROM usuario WHERE idusuario=$1 RETURNING *`, [idusuario])
        if(usuario_eliminado.rowCount===0){
            return res.status(400).json({ 
                msg: 'No existe este Usuario!'
            })
        }
        res.status(200).json({
            msg: `Usuario ${ usuario_eliminado.rows[0].usuario } eliminado correctamente!`
        })
    } catch (error) {
        return res.status(500).json({
            msg: 'Algo salio mal.!'
        })
    }
}

const updateUsuarios = async(req, res = response) => {
    try {      
        const { idusuario } = req.params;
        const { usuario, password, estado, idrol  } = req.body;
        const existe_usuario = await pool.query(`SELECT * FROM usuario WHERE usuario=$1`, [usuario])
        if(existe_usuario.rows.length>0){
            return res.status(400).json({
                msg: 'El Usuario ya existe.!'
            })
        }
         const salt = bcrypt.genSaltSync();
         const password_encrypt = bcrypt.hashSync(password, salt);
        const usuario_modificado = await pool.query(`UPDATE usuario SET usuario=$1, password=$2, estado=$3, idrol=$4 WHERE idusuario=$5`, [usuario, password_encrypt, estado, idrol, idusuario])
        if(usuario_modificado.rowCount===0){
            return res.status(400).json({
                msg: 'No existe este Usuario!'
            })
        }
        res.status(200).json({
            msg: `Usuario modificado correctamente!`
        })
    } catch (error) {
        return res.status(500).json({
            msg: 'Algo salio mal.!'
        })
    }
}



module.exports = {
    login,
    createUser,
    getUsuarios,
    getUsuariosById,
    deleteUsuarios,
    updateUsuarios
}
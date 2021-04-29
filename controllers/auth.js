const { request, response } = require('express');
const Usuario = require('../models/Usuario')
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt')

const crearUsuario = async(req = request, res = response) => {
    const { name, email, password } = req.body;

    try {
        //Verificar que el correo no exista
        let usuario = await Usuario.findOne({ email });
        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya fue registrado'
            });
        }

        //Crear Usuario con el modelo
        usuario = new Usuario(req.body);


        //Hashear la contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        //Generar el JWT
        const token = await generarJWT(usuario.id, name, email);


        //Crear Usuario de Base de Datos
        await usuario.save();


        //Generar Respuesta Exitosa
        return res.status(201).json({
            ok: true,
            uid: usuario.id,
            name,
            email,
            token
        })


    } catch (error) {

        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el Administrador'
        })

    }



}

const loginUsuario = async(req, res) => {
    const { email, password } = req.body;

    try {

        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Email y/o Contraseña no son validos'
            })
        }

        //Confirmar si el password hace match
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Email y/o Contraseña no son validos'
            })
        }

        //Generar JWT
        const token = await generarJWT(usuario.id, usuario.name, usuario.email);

        //Respuesta 
        return res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            email: usuario.email,
            token
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Contacte con el Administrador'
        })
    }




}

const revalidarToken = async(req, res) => {

    const { uid, name, email } = req

    const token = await generarJWT(uid, name);

    return res.status(200).json({
        ok: true,
        uid,
        name,
        email,
        token
    })

}


module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}
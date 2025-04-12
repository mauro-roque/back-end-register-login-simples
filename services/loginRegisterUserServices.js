const { User } = require("../models/RegisterModel.js");
const { RepositoriesUser, ConsultaUsuarios } = require("../repositories/loginRegisterUserRepositories.js");
const { UserLogin } = require("../models/loginModel.js")

class ServiceUser {
  static validarDados(dados, num, email, senha) {
    // num 1 = criar conta | num 2 = login
    if (num === 1) {
      if (!dados.nome || typeof dados.nome !== 'string' || dados.nome.trim() === '') {
        throw new Error("Erro: nome");
      }
      if (!dados.telefone || typeof dados.telefone !== 'string' || dados.telefone.trim() === '') {
        throw new Error("Erro: telefone");
      }
      if (!dados.login || typeof dados.login !== 'string' || dados.login.trim() === '') {
        throw new Error("Erro: login");
      }
      if (!dados.senha || typeof dados.senha !== 'string' || dados.senha.trim() === '') {
        throw new Error("Erro: senha");
      }
    } else if (num === 2) {
      if (!email || typeof email !== 'string' || email.trim() === '') {
        throw new Error("Erro: login-email");
      }
      if (!senha || typeof senha !== 'string' || senha.trim() === '') {
        throw new Error("Erro: senha");
      }
    }
  }

  static async modelarUsuario(dados) {
    const newUser = new User(dados.nome, dados.telefone, dados.login, dados.senha);
    return newUser;
  }

  static async insertDadosBd(dados) {
    const idNewUser = await RepositoriesUser.insertNewUser(dados);
    return idNewUser
  }

  static async processarDadosCriacaoConta(dados) {
    ServiceUser.validarDados(dados, 1, "", "");
    const newUser = await ServiceUser.modelarUsuario(dados);
    const idNewUser = await ServiceUser.insertDadosBd(newUser);
    let id = idNewUser > 0 ? true : false
    return id;
  }

  static async modelarUsuarioLoginBody(dados) {
    const modelUser = new UserLogin(dados.login, dados.senha);
    return modelUser
  }

  static async modelarUsuarioLoginEndpoint(login, senha) {
    const modelUser = new UserLogin(login, senha);
    return modelUser
  }

  static async verificaGetLoginContaBd(modelUser) {
    const dadosUser = RepositoriesUser.verificarUser(modelUser);
    return dadosUser
  }

  static async processarDadosLogin(dados, email, senha) {
    if (email.length <= 0 && senha.length <= 0) {
      //logica dos dados passados pelo body
      let modelUser = await ServiceUser.modelarUsuarioLoginBody(dados);
      ServiceUser.validarDados(dados, 2, modelUser.email, modelUser.senha);
      let usuarioEncontrado = await ServiceUser.verificaGetLoginContaBd(modelUser);
      return usuarioEncontrado;

    } else if (email.length >= 0 && senha.length >= 0) {
      //logica dos dados passados pelo endpoint
      ServiceUser.validarDados(dados, 2, email, senha);
      let modelUser = await ServiceUser.modelarUsuarioLoginEndpoint(email, senha);
      let usuarioEncontrado = await ServiceUser.verificaGetLoginContaBd(modelUser);
      return usuarioEncontrado;
    } else {
      return false
    }
  }
}

class ConsultasUsers {
  static async consultarTodosUsers() {
    const todosUsers = await ConsultaUsuarios.consultarTodosUsers();
    return todosUsers
  }
}

module.exports = {
  ServiceUser,
  ConsultasUsers
}
const { ServiceUser, ConsultasUsers } = require("../services/loginRegisterUserServices.js");

const express = require('express')
const app = express()
const port = 9090

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Consultas funcionais registro / login
app.post("/cadastro", async (req, res) => {
  const dados = req.body;

  if (!dados || Object.keys(dados).length === 0) {
    return res.status(400).send({ error: "Dados vazios ou mal formatados" });
  }

  try {
    const retornoProcessamento = await ServiceUser.processarDadosCriacaoConta(dados);
    if (retornoProcessamento === true) {
      console.log("Conta criada com sucesso");
      res.status(200).send({ mensagem: "Conta criada com sucesso, " + retornoProcessamento });
    } else {
      console.log("Erro: na criação da conta");
      res.status(400).send({ erro: "Erro na criação da conta, possivelmente usuario duplicado" });
    }
  } catch (error) {
    console.error("Error: verificação de dados - ", error);
    res.status(400).send({ error: "Erro ao processar os dados" });
  }
});

app.get("/login-user", async (req, res) => {
  const dados = req.body;
  if (!dados || Object.keys(dados).length === 0) {
    return res.status(400).send({ error: "Dados vazios ou mal formatados" });
  }

  try {
    let retornoProcessamento = await ServiceUser.processarDadosLogin(dados, "", "");
    if (typeof retornoProcessamento === "object") {
      console.log("Conta logada");
      res.status(200).send(retornoProcessamento)
    } else {
      console.log("Erro: ao entrar na conta");
      res.status(404).send(html)
    }
  } catch (error) {
    console.error("Error: verificação de dados - ", error);
    res.status(400).send({ error: "Erro ao processar os dados" });
  }
})

app.get("/login/:email/:senha", async (req, res) => {
  let email = req.params.email;
  let senha = req.params.senha;

  if (!email || !senha) {
    return res.status(400).send({ error: "Email ou senha não fornecidos" });
  }

  try {
    let retornoProcessamento = await ServiceUser.processarDadosLogin("", email, senha);

    if (typeof retornoProcessamento === "object") {
      console.log("Conta logada");
      res.status(200).send(retornoProcessamento);
    } else {
      console.log("Erro: ao entrar na conta");
      res.status(401).send({ error: "Credenciais inválidas" });
    }

  } catch (error) {
    console.error("Error: verificação de dados - ", error);
    res.status(500).send({ error: "Erro ao processar os dados" });
  }
});

//Outras consultas Users
app.get("/todosUsers", async (req, res) => {
  try {
    const resul = await ConsultasUsers.consultarTodosUsers();
    res.send(resul);
  } catch (error) {
    console.error("Error ao buscar users ", error);
    res.status(500).send({ error: "Erro ao processar os dados" });
  }
});

app.get("/user-por-id/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const resul = await ConsultasUsers.consultarTodosUsers();
    res.send(resul[id-1]);
  } catch (error) {
    console.error("Error ao buscar users ", error);
    res.status(500).send({ error: "Erro ao processar os dados" });
  }
});

app.listen(port, () => console.log("localhost:" + port));
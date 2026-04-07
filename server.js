require('dotenv').config(); // Carrega as variáveis do .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.CHAVE_BANCO)
    .then(() => console.log("✅ Conectado ao MongoDB com sucesso!"))
    .catch((erro) => console.error("❌ Erro ao conectar ao MongoDB:", erro));

app.get('/', (req, res) => {
    res.send("API do CRUD Rodando!");
});

const PORT = process.env.PORTA || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor voando na porta ${PORT}`);
});

const Projeto = require('./models/Projeto'); // Importa o modelo

app.post('/projetos', async (req, res) => {
    try {
        const novoProjeto = new Projeto(req.body);
        await novoProjeto.save();
        res.status(201).json({ mensagem: "Projeto salvo com sucesso!", projeto: novoProjeto });
    } catch (erro) {
        res.status(400).json({ mensagem: "Erro ao salvar", erro: erro.message });
    }
});

app.get('/projetos', async (req, res) => {
    try {
        const projetos = await Projeto.find();
        res.json(projetos);
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao buscar projetos" });
    }
});

app.delete('/projetos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await Projeto.findByIdAndDelete(id);
        res.json({ mensagem: "Projeto deletado com sucesso!" });
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao excluir" });
    }
});
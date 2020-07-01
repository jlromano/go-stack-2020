const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4');

const app = express();

/**
 * Obrigatoriamente todas as rotas terão que passar por essa função.
 */
app.use(cors());
app.use(express.json());

/**
 * Métodos HTTP:
 * 
 * GET: buscar informações do back-end.
 * POST: criar informação no back-end.
 * PUT/PATCH: alterar informação no back-end.
 *  Maioria das pessoas utilizam apenas PUT.
 *  Patch deveria ser utilizado pra atualização mais especifica.
 * DELETE: Deletar uma informação no back-end.
 */

 /**
  * Tipos de parametros
  * 
  * Query Params: Principalmente para filtros e paginação.
  * Route Params: Identificar recursos na atualização ou remoção.
  * Request Body: Conteudo na hora de criar ou editar um recurso.
  */

const projects = [];

function logRequests (request, response, next) {
    const { method, url } = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.time(logLabel);

    next();

    console.timeEnd(logLabel);
}

function validateProjectId (request, response, next) {
    const { id } = request.params;

    if (!isUuid(id)) {
        return response.status(400).json({error: 'Invalid Project Id.'});
    }

    return next();
}

app.use(logRequests);
app.use('/projects/:id', validateProjectId);

// Criando nossa primeira rota, com retorno via JSON
// O que vem depois da / da rota, chamamos de recurso.
app.get('/projects', (request, response) => {
    const { title } = request.query;

    const results = title
        ? projects.filter(project => project.title.includes(title))
        : projects;

    // console.log(title);
    // console.log(owner);
    
    return response.json(results);
});

app.post('/projects', (request, response) => {
    const { title, owner } = request.body;

    const project = { id: uuid(), title, owner };

    projects.push(project);

    console.log(title);
    console.log(owner);

    return response.json(project);
});

app.put('/projects/:id', (request, response) => {
    const { id } = request.params;
    const { title, owner } = request.body;

    const projectIndex = projects.findIndex(project => project.id === id);

    /**
     * Validação se ele encontrou ou nao o projeto, se não encontrou, o indice será menor que 0
     */

    if (projectIndex < 0) {
        return response.status(400).json({ error: 'Project not found'});
    }

    const project = {
        id,
        title,
        owner,
    };

    projects[projectIndex] = project;

    return response.json(project);
});

app.delete('/projects/:id', (request, response) => {
    const { id } = request.params;

    const projectIndex = projects.findIndex(project => project.id === id);
    const project = projects.findIndex(project => project.id === id);

    if (projectIndex < 0 ) {
        return response.status(400).json({ error: 'Project not found'});
    }

    projects.splice(projectIndex, 1);

    return response.status(204).send();
});

// Definindo a porta que vamos rodar o servidor, de preferencia portas acima de 80
app.listen(3333, () => {
    // Inserindo mensagem de confirmação que o servidor subiu
    console.log('🚀 Back-end started!');
});
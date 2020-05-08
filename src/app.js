const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body; //the user input those informations
  const newRepository = { id: uuid(), title, techs, likes:0 } //we put the id and likes(always initiated with 0)

  repositories.push(newRepository);

  return response.status(201).json(repositories);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params; //we get the id through url
  const { title, url, techs } = request.body; //the user only can modify those fields, they'll send across requisiton

  const repositoryIndex = repositories.findIndex(repository => repository.id === id); //verify if id is exists, if exists this return a valor equal or bigger then zero

  if (repositoryIndex < 0){
      return response.status(400).json({error: 'Repository not found'});
  }

  const repository = {
    title,
    url, 
    techs
  };

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repositories);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0){
    return response.status(400).json({error: 'Repository dont exist'});
  }

  repositories.splice(repositoryIndex,1); //remove one position from the argument passed

  return response.status(204).send;
});

app.post("/repositories/:id/like", (request, response) => {
  const { id, like } = request.params;
  console.log(id);
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  console.log(repositoryIndex);
  if (repositoryIndex < 0){
    return response.status(400).json({error: 'Repository dont exist'});
  }

  repositories[repositoryIndex].like = like;
  return response.json(repositories);
});

module.exports = app;

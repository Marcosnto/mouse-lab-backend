const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

//CREATE
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body; //the user input those informations
  const newRepository = { id: uuid(), title, url, techs, likes:0, dislikes: 0} //we put the id and likes(always initiated with 0)

  repositories.push(newRepository);

  return response.status(201).json(newRepository);
});

//LIKE
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0){
    return response.status(400).json({error: 'Repository dont exist'});
  }

  const repository = repositories[repositoryIndex];
  repository.likes+=1;

  return response.json(repository);
});

//DISLIKE
app.post("/repositories/:id/dislike", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0){
    return response.status(400).json({error: 'Repository dont exist'});
  }

  const repository = repositories[repositoryIndex];
  repository.dislikes+=1;

  return response.status(200).json(repository);

});

//LIST
app.get("/repositories", (request, response) => {
  const { tech } = request.query;
  
  const results = tech
    ? repositories.filter(project => (project.techs).toLowerCase().includes(tech.toLowerCase()))
    : repositories;

  return response.status(200).json(results);
});

//UPDATE
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;//we get the id throughl url
  const { title, url, techs } = request.body; //the user only can modify those fields, they'll send across requisiton

  const repositoryIndex = repositories.findIndex(repository => repository.id === id); //verify if id is exists, if exists this return a valor equal or bigger then zero

  if (repositoryIndex < 0){
      return response.status(400).json({error: 'Repository not found'});
  }

  const repository = {
    id,
    title,
    url, 
    techs,
    likes: repositories[repositoryIndex].likes, 
    dislikes: repositories[repositoryIndex].dislikes,
  };

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);

});

//DELETE
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0){
    return response.status(400).json({error: 'Repository dont exist'});
  }

  const deleted = repositories[repositoryIndex];
  
  repositories.splice(repositoryIndex,1); //remove one position from the argument passed
  
  return response.status(204).json(deleted);
});

module.exports = app;

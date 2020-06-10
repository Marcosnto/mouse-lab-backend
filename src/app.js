const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

//CREATE
app.post("/repositories", (request, response) => {
  const { title, owner, url, techs } = request.body; //the user input those informations
  const newRepository = { id: uuid(), title, owner, url, techs, likes:0, favorite: false} //we put the id and likes(always initiated with 0)

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

//SET FAVORITES
app.put("/repositories/:id/favorite", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0){
    return response.status(400).json({error: 'Repository dont exist'});
  }

  const repository = repositories[repositoryIndex];
  repository.favorite === false ? repository.favorite = true : repository.favorite = false;

  return response.status(200).json(repository);

});

//LIST ALL FAVORITES
app.get("/repositories/favorites", (request, response) => {

  const results = repositories.filter(repository => {
    if (repository.favorite === true) {
      return repository;
    }
  });

  return response.status(200).json(results);
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
  const { title, owner, url, techs } = request.body; //the user only can modify those fields, they'll send across requisiton

  const repositoryIndex = repositories.findIndex(repository => repository.id === id); //verify if id is exists, if exists this return a valor equal or bigger then zero

  if (repositoryIndex < 0){
      return response.status(400).json({error: 'Repository not found'});
  }

  const repository = {
    id,
    title,
    owner,
    url, 
    techs,
    likes: repositories[repositoryIndex].likes, 
    favorite,
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

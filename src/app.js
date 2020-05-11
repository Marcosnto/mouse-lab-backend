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

  return response.status(201).json(repositories);
});

//LIKE
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const { like } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0){
    return response.status(400).json({error: 'Repository dont exist'});
  }

  if (repositories[repositoryIndex].likes >= 0 && like > 0){
    repositories[repositoryIndex].likes += like;
  }else{
    return response.status(400).json({error: 'Number of likes must to be bigger then zero'})
  }

  return response.json(repositories);
});

//READ
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

//UPDATE
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params; //we get the id through url
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

  // repository[likes] = repositories[repositoryIndex].likes;
  // repository[dislikes] = repositories[repositoryIndex].dislikes;

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repositories);

});

//DELETE
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0){
    return response.status(400).json({error: 'Repository dont exist'});
  }

  repositories.splice(repositoryIndex,1); //remove one position from the argument passed

  return response.status(204).send;
});

module.exports = app;

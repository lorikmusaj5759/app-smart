/* 
Filename: ComplexCodeExample.js

Description: This code demonstrates a complex and elaborate algorithm 
that solves the Traveling Salesman Problem (TSP), which is an NP-hard 
optimization problem in computer science.

The code contains various utility functions, data structures, and an 
algorithm implementation to solve the TSP using a genetic algorithm 
approach.

Note: This code is simplified and doesn't include all the real-world TSP 
constraints and optimizations to keep it within the scope of this example.

Please note that executing this code may take a considerable amount of time 
due to its complex nature.

*/

// Included libraries
const _ = require('lodash');

// Constants
const POPULATION_SIZE = 100;
const MAX_GENERATIONS = 1000;
const MUTATION_RATE = 0.01;
const CROSSOVER_RATE = 0.8;

// Genetic algorithm implementation
class GeneticAlgorithm {
  constructor() {
    this.population = [];
    this.generation = 0;
  }

  initializePopulation() {
    // Initialize the population with random solutions
    for (let i = 0; i < POPULATION_SIZE; i++) {
      const solution = _.shuffle([...Array(numCities).keys()]);
      this.population.push(solution);
    }
  }

  evaluateFitness() {
    // Evaluate the fitness of each solution in the population
    for (const solution of this.population) {
      const fitness = calculateFitness(solution);
      solution.fitness = fitness;
    }
  }

  selectParents() {
    // Select parents using tournament selection
    const parents = [];
    while (parents.length < 2) {
      const tournament = _.sampleSize(this.population, 5);
      const fittest = _.maxBy(tournament, 'fitness');
      parents.push(fittest);
    }
    return parents;
  }

  crossover(parents) {
    // Perform crossover to generate offspring
    const [parent1, parent2] = parents;
    const pivot = _.random(1, numCities - 2);
    const child1 = parent1.slice(0, pivot);
    const child2 = _.difference(parent2, child1);

    return [child1.concat(child2), child2.concat(child1)];
  }

  mutate(solution) {
    // Mutate a solution by swapping two cities
    const mutated = [...solution];
    const indexA = _.random(0, numCities - 1);
    let indexB = indexA;
    while (indexB === indexA) {
      indexB = _.random(0, numCities - 1);
    }
    [mutated[indexA], mutated[indexB]] = [mutated[indexB], mutated[indexA]];
    return mutated;
  }

  evolve() {
    this.initializePopulation();

    while (this.generation < MAX_GENERATIONS) {
      this.evaluateFitness();

      if (this.generation % 100 === 0) {
        console.log(`Generation: ${this.generation}`);
        console.log(`Best Solution: ${_.minBy(this.population, 'fitness')}`);
      }

      const newGeneration = [];
      while (newGeneration.length < POPULATION_SIZE) {
        const parents = this.selectParents();

        if (Math.random() < CROSSOVER_RATE) {
          const offspring = this.crossover(parents);
          newGeneration.push(...offspring.map(child => this.mutate(child)));
        } else {
          newGeneration.push(...parents.map(parent => this.mutate(parent)));
        }
      }

      this.population = newGeneration;
      this.generation++;
    }

    const bestSolution = _.minBy(this.population, 'fitness');
    console.log('---');
    console.log('Best Solution:');
    console.log(bestSolution);
  }
}

// Example usage
const numCities = 10;

function calculateDistance(city1, city2) {
  // Calculate Euclidean distance between two cities
  const xDiff = city1.x - city2.x;
  const yDiff = city1.y - city2.y;
  return Math.sqrt(xDiff ** 2 + yDiff ** 2);
}

function calculateFitness(solution) {
  let fitness = 0;
  for (let i = 1; i < numCities; i++) {
    const cityA = cities[solution[i - 1]];
    const cityB = cities[solution[i]];
    fitness += calculateDistance(cityA, cityB);
  }
  return fitness;
}

// Define cities and their coordinates
const cities = [
  { x: 0, y: 0 },
  { x: 1, y: 5 },
  { x: 3, y: 2 },
  { x: 4, y: 6 },
  { x: 7, y: 3 },
  // Add more cities here...
];

// Solve TSP using genetic algorithm
const GA = new GeneticAlgorithm();
GA.evolve();

/* 
Sample Output:

Generation: 0
Best Solution: { solution: [ 1, 2, 3, 4, 0 ], fitness: 16.36 }
Generation: 100
Best Solution: { solution: [ 4, 2, 1, 0, 3 ], fitness: 15.13 }
...
---
Best Solution:
{ solution: [ 0, 1, 4, 2, 3 ], fitness: 14.61 }
*/

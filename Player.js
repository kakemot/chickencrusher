class Player {

  constructor(isPhysical) {
    this.isPhysical = isPhysical;
    this.fitness = 0;
    this.vision = []; //the input array fed into the neuralNet
    this.decision = []; //the out put of the NN
    this.unadjustedFitness;
    this.lifespan = 0; //how long the player lived for this.fitness
    this.bestScore = 0; //stores the this.score achieved used for replay
    this.dead = false;
    this.score = 0;
    this.gen = 0;
    this.genomeInputs = 1;
    this.genomeOutputs = 2;
    this.brain = new Genome(this.genomeInputs, this.genomeOutputs);
    if (isPhysical) {
      this.duck = new Duck(100, 100, this, this.isPhysical);
      this.index = enemies.length;
      enemies.push(this.duck);
    }
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------------------
  show() {
    this.duck.display();
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------
  move() {
    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------
  update() {
    if (this.duck.isCollidingWith == "box") {
      this.kill();
      this.duck.dead = true;
    }
  }

  kill() {
    this.duck.killBody();
    this.dead = true;
  }
  //----------------------------------------------------------------------------------------------------------------------------------------------------------

  look() {
    this.vision = [];
    if (this.isPhysical) {
      this.vision[0] = map(this.duck.body.GetLinearVelocity().x, -25, 25, -1, 1);
    }
    
  }

  moveright() {
    var direction = new box2d.b2Vec2(15, 0);
    this.duck.body.ApplyForce(direction, this.duck.body.GetPosition());
  }

  jump() {
    var direction = new box2d.b2Vec2(0, 5);
    this.duck.body.ApplyForce(direction, this.duck.body.GetPosition());
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------
  //gets the output of the this.brain then converts them to actions
  think() {
    var max = 0;
    var maxIndex = 0;
    //get the output of the neural network
    this.decision = this.brain.feedForward(this.vision);

    for (var i = 0; i < this.decision.length; i++) {
      if (this.decision[i] > max) {
        max = this.decision[i];
        maxIndex = i;
      }
    }

    if (this.decision[0] > 0.5) {
      this.moveright();
    }

    if (this.decision[1] > 0.5) {
      this.jump();
    }
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------
  //returns a clone of this player with the same brian
  clone() {
    var clone = new Player(true);
    clone.brain = this.brain.clone();
    clone.fitness = this.fitness;
    clone.brain.generateNetwork();
    clone.gen = this.gen;
    clone.bestScore = this.score;
    return clone;
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //since there is some randomness in games sometimes when we want to replay the game we need to remove that randomness
  //this fuction does that

  cloneForReplay() {
    var clone = new Player(false);
    clone.brain = this.brain.clone();
    clone.fitness = this.fitness;
    clone.brain.generateNetwork();
    clone.gen = this.gen;
    clone.bestScore = this.score;
    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
    return clone;
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------------------
  //fot Genetic algorithm
  calculateFitness() {
    this.fitness = random(10);
    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------------------
  crossover(parent2) {
    var child = new Player(true);
    child.brain = this.brain.crossover(parent2.brain);
    child.brain.generateNetwork();
    return child;
  }
}

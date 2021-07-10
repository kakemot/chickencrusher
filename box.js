// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// A rectangular box


// Constructor
class Box {
    constructor(x, y, isPhysical = true) {
      this.isPhysical = isPhysical;
      this.id = "box";
      this.isCollidingWith;
      this.w = 32;
      this.h = 32;
      this.x = x;
      this.y = y;
      this.dead = false;
  
      // Define a body
      let bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      bd.position = scaleToWorld(x, y);
  
      // Define a fixture
      let fd = new box2d.b2FixtureDef();
      // Fixture holds shape
      fd.shape = new box2d.b2PolygonShape();
      fd.shape.SetAsBox(scaleToWorld(this.w / 2), scaleToWorld(this.h / 2));
  
      // Some physics
      fd.density = 1.0;
      fd.friction = 0.5;
      fd.restitution = 0.2;
  
      // Create the body
      this.body = world.CreateBody(bd);
      // Attach the fixture
      this.body.CreateFixture(fd);
    }
  
    // This function removes the particle from the box2d world
    killBody() {
      world.DestroyBody(this.body);
    }
  
    // Is the particle ready for deletion?
    done() {
      // Let's find the screen position of the particle
      let pos = scaleToPixels(this.body.GetPosition());
      // Is it off the bottom of the screen?
      if (pos.y > height + this.w * this.h) {
        this.killBody();
        return true;
      }
      return false;
    }
  
    // Drawing the box
    display() {
      // Get the body's position
      let pos = scaleToPixels(this.body.GetPosition());
      this.x = pos.x;
      this.y = pos.y;
      // Get its angle of rotation
      let a = this.body.GetAngleRadians();
  
      // Draw it!
      rectMode(CENTER);
      push();
      translate(pos.x, pos.y);
      rotate(a);
      fill(127);
      stroke(200);
      strokeWeight(2);
      image(crate, -this.w/2, -this.h/2, this.w, this.h);
      pop();
    }
  }
var foodObject;
var dog, dogimg, dogimg1;
var food, db;
var feed, addFood;
var lastFed;
function preload() {
  dogimg = loadImage('images/dogImg.png');
  dogimg1 = loadImage('images/dogImg1.png')
}

function setup() {
  createCanvas(1000, 500);
  db = firebase.database()
  db.ref('Food').on('value', readStock)
  dog = createSprite(650, 300, 150, 150);
  dog.addImage(dogimg);
  dog.scale = 0.15
  foodObject = new Food()
  feed = createButton('Feed The Dog')
  feed.position(700, 90)
  feed.mousePressed(feedDog)
  addFood = createButton('Add The Food')
  addFood.position(700, 150)
  addFood.mousePressed(addFoods)
}


function draw() {
  background(0)
  foodObject.display()
  drawSprites();
  //add styles here
  textSize(20)
  text(`Food remaining: ${food}`, 120, 100)
  db.ref('FeedTime').on('value',function (data){
    lastFed = data.val()
  })
  if(lastFed>=12){
    text(`Last Fed: ${lastFed%12} P.M.`, 700,50)
  }
  else if(lastFed==0){
    text(`Last Fed: 12 A.M.`, 700,50)
  }
  else{
    text(`Last Fed: ${lastFed} A.M.`, 700,50)
  }
}
function readStock(data) {
  food = data.val()
  foodObject.updateFoodStock(food)
}

function feedDog() {
  dog.addImage(dogimg1)
  if (foodObject.getFoodStock() <= 0) {
    foodObject.updateFoodStock(foodObject.getFoodStock() * 0)
  }
  else {
    foodObject.updateFoodStock(foodObject.getFoodStock() - 1)
  }
  db.ref('/').update({
    Food: foodObject.getFoodStock(),
    FeedTime: hour()
  })
}
function addFoods() {
  food++
  db.ref('/').update({
    Food: food
  })
}
